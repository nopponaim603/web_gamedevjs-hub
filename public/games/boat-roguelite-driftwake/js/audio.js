/**
 * Boat Roguelite: Driftwake — Audio Synthesizer & Dynamic Sea BGM Engine
 */

const REGION_TRACKS = [
  {
    roots: [48, 53, 55, 46],
    chord: [0, 4, 7, 12],
    melody: [0, 7, 12, 14, 12, 7, 4, 7],
    step: 0.27,
    color: "triangle",
    bell: 0,
  },
  {
    roots: [45, 50, 52, 48],
    chord: [0, 3, 7, 10],
    melody: [0, 7, 10, 12, 15, 12, 7, 3],
    step: 0.26,
    color: "triangle",
    bell: 0,
  },
  {
    roots: [43, 46, 41, 45],
    chord: [0, 3, 7, 12],
    melody: [0, 7, 3, 10, 7, 12, 10, 7],
    step: 0.23,
    color: "sine",
    bell: 0,
  },
  {
    roots: [50, 57, 54, 45],
    chord: [0, 3, 7, 14],
    melody: [0, 14, 12, 7, 3, 7, 14, 19],
    step: 0.3,
    color: "sine",
    bell: 1,
  },
  {
    roots: [41, 44, 46, 39],
    chord: [0, 3, 7, 10],
    melody: [0, 3, 7, 10, 7, 3, 12, 7],
    step: 0.24,
    color: "triangle",
    bell: 0,
  },
  {
    roots: [48, 55, 53, 57],
    chord: [0, 4, 7, 14],
    melody: [0, 7, 12, 16, 14, 12, 7, 19],
    step: 0.265,
    color: "triangle",
    bell: 1,
  },
];

function midiToFreq(midiNote) {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

function createAudio(initialMuted = false) {
  let ctx = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let noiseBuffer = null;
  let bgmTimer = null;

  let isMuted = initialMuted;
  let nextBgmStepTime = 0;
  let bgmStepIndex = 0;
  let currentRegion = 0;
  let isBgmPlaying = false;
  let isDisposed = false;

  let activeVoiceCount = 0;
  let activeSfxVoiceCount = 0;
  let voiceBudget = 6;
  let lastBudgetResetTime = 0;

  const cooldownMap = new Map();

  function acquireVoice(channel, isPriority = false) {
    if (
      activeVoiceCount >= 64 ||
      (channel === sfxGain && activeSfxVoiceCount >= (isPriority ? 48 : 32))
    ) {
      return false;
    }
    activeVoiceCount++;
    if (channel === sfxGain) activeSfxVoiceCount++;
    return true;
  }

  function releaseVoice(channel) {
    activeVoiceCount--;
    if (channel === sfxGain) activeSfxVoiceCount--;
  }

  function applyStereoPan(sourceNode, destinationNode, pan = 0) {
    if (!pan || !ctx.createStereoPanner) {
      sourceNode.connect(destinationNode);
      return null;
    }
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    sourceNode.connect(panner);
    panner.connect(destinationNode);
    return panner;
  }

  function playTone(
    freq,
    duration,
    volume,
    waveType = "sine",
    startTime = ctx.currentTime,
    targetBus = sfxGain,
    endFreq = 0,
    pan = 0,
    priority = false,
  ) {
    if (!acquireVoice(targetBus, priority)) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(30, endFreq),
        startTime + duration,
      );
    }

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.009);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);

    const panner = applyStereoPan(gain, targetBus, pan);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      if (panner) panner.disconnect();
      releaseVoice(targetBus);
    };

    osc.start(startTime);
    osc.stop(startTime + duration + 0.03);
  }

  function playNoise(
    duration,
    volume,
    cutoffFreq = 900,
    startTime = ctx.currentTime,
    pan = 0,
    priority = false,
  ) {
    if (!acquireVoice(sfxGain, priority) || !noiseBuffer) return;

    const bufferSource = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    bufferSource.buffer = noiseBuffer;
    filter.type = "lowpass";
    filter.frequency.value = cutoffFreq;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    bufferSource.connect(filter);
    filter.connect(gain);
    const panner = applyStereoPan(gain, sfxGain, pan);

    bufferSource.onended = () => {
      bufferSource.disconnect();
      filter.disconnect();
      gain.disconnect();
      if (panner) panner.disconnect();
      releaseVoice(sfxGain);
    };

    bufferSource.start(startTime);
    bufferSource.stop(startTime + duration + 0.01);
  }

  function scheduleBgmStep() {
    if (!ctx || ctx.state !== "running") return;
    if (nextBgmStepTime < ctx.currentTime - 0.1) {
      nextBgmStepTime = ctx.currentTime + 0.02;
    }

    const track = REGION_TRACKS[currentRegion];
    while (nextBgmStepTime < ctx.currentTime + 0.15) {
      if (isBgmPlaying && !isMuted) {
        const rootNote =
          track.roots[Math.floor(bgmStepIndex / 16) % track.roots.length];

        // Chords and bass
        if (bgmStepIndex % 8 === 0) {
          track.chord.forEach((interval, i) => {
            playTone(
              midiToFreq(rootNote + interval),
              2.5,
              0.02 / (1 + i * 0.3),
              "sine",
              nextBgmStepTime + i * 0.026,
              bgmGain,
            );
          });
          playTone(
            midiToFreq(rootNote - 12),
            1.1,
            0.032,
            "sine",
            nextBgmStepTime,
            bgmGain,
          );
        }

        // Lead melody
        if (bgmStepIndex % 2 === 0) {
          const melodyNote = track.melody[(bgmStepIndex / 2) % 8];
          playTone(
            midiToFreq(rootNote + 12 + melodyNote),
            currentRegion === 3 ? 1.35 : 0.8,
            0.023,
            track.color,
            nextBgmStepTime,
            bgmGain,
          );
        }

        // Percussion pulses
        if (bgmStepIndex % 4 === 0) {
          playTone(
            currentRegion === 4 ? 90 : 105,
            0.18,
            currentRegion === 3 ? 0.017 : 0.038,
            "sine",
            nextBgmStepTime,
            bgmGain,
            38,
          );
        }
        if (currentRegion > 0 && bgmStepIndex % 4 === 2) {
          playTone(
            midiToFreq(rootNote + 7),
            0.19,
            0.015,
            "triangle",
            nextBgmStepTime,
            bgmGain,
          );
        }
        if (track.bell && bgmStepIndex % 8 === 6) {
          playTone(
            midiToFreq(rootNote + 31),
            1.5,
            0.013,
            "sine",
            nextBgmStepTime,
            bgmGain,
          );
        }
      }
      bgmStepIndex++;
      nextBgmStepTime += track.step;
    }
  }

  async function unlockAudio() {
    if (isDisposed) return;
    try {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();

        masterGain = ctx.createGain();
        masterGain.gain.value = isMuted ? 0.0 : 0.65;

        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -14;
        compressor.knee.value = 12;
        compressor.ratio.value = 5;
        compressor.attack.value = 0.008;
        compressor.release.value = 0.18;

        masterGain.connect(compressor);
        compressor.connect(ctx.destination);

        bgmGain = ctx.createGain();
        bgmGain.gain.value = isBgmPlaying ? 0.55 : 0.0;
        bgmGain.connect(masterGain);

        sfxGain = ctx.createGain();
        sfxGain.gain.value = 0.6;
        sfxGain.connect(masterGain);

        // Create white noise for water and cannon blast effects
        noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        nextBgmStepTime = ctx.currentTime + 0.03;
        lastBudgetResetTime = ctx.currentTime;
        bgmTimer = setInterval(scheduleBgmStep, 80);
      }

      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      if (nextBgmStepTime < ctx.currentTime) {
        nextBgmStepTime = ctx.currentTime + 0.02;
      }
    } catch (e) {
      console.warn("[Audio] Audio context init failed:", e);
    }
  }

  function checkCooldown(key, cooldownTime, nowTime, bypassBudget = false) {
    if (nowTime - (cooldownMap.get(key) ?? -Infinity) < cooldownTime)
      return false;

    voiceBudget = Math.min(
      6,
      voiceBudget + Math.max(0, nowTime - lastBudgetResetTime) * 14,
    );
    lastBudgetResetTime = nowTime;

    if (!bypassBudget && voiceBudget < 1) return false;
    if (!bypassBudget) voiceBudget--;

    cooldownMap.set(key, nowTime);
    return true;
  }

  function playArpeggio(
    notes,
    baseMidi,
    time,
    step = 0.11,
    duration = 0.8,
    vol = 0.065,
  ) {
    notes.forEach((interval, idx) => {
      playTone(
        midiToFreq(baseMidi + interval),
        duration,
        vol,
        "triangle",
        time + idx * step,
        sfxGain,
        0,
        0,
        true,
      );
    });
  }

  function playSound(event, mountOrDetail, elementType) {
    if (!ctx || ctx.state !== "running" || isMuted || isDisposed) return;
    const now = ctx.currentTime;

    if (event === "shot") {
      const mount = ["bow", "port", "starboard", "stern", "escort"].includes(
        mountOrDetail,
      )
        ? mountOrDetail
        : "enemy";
      if (!checkCooldown("shot-" + mount, mount === "enemy" ? 0.22 : 0.12, now))
        return;

      const pan = mount === "port" ? -0.45 : mount === "starboard" ? 0.45 : 0.0;

      if (elementType === "fire") {
        playTone(130, 0.23, 0.075, "triangle", now, sfxGain, 42, pan);
        playNoise(0.24, 0.068, 2300, now, pan);
        playTone(430, 0.17, 0.025, "sine", now, sfxGain, 210, pan);
      } else if (elementType === "frost") {
        playTone(1440, 0.23, 0.036, "triangle", now, sfxGain, 660, pan);
        playTone(2200, 0.15, 0.018, "sine", now + 0.018, sfxGain, 1320, pan);
        playNoise(0.1, 0.035, 4100, now, pan);
      } else if (elementType === "storm") {
        playTone(170, 0.1, 0.042, "sawtooth", now, sfxGain, 870, pan);
        playTone(1050, 0.16, 0.028, "sine", now, sfxGain, 310, pan);
        playNoise(0.07, 0.035, 4800, now, pan);
      } else {
        if (mount === "bow") {
          playTone(160, 0.23, 0.14, "triangle", now, sfxGain, 42);
          playTone(60, 0.28, 0.075, "sine", now, sfxGain, 30);
          playNoise(0.13, 0.075, 1500, now);
        } else if (mount === "port" || mount === "starboard") {
          const sidePan = mount === "port" ? -0.45 : 0.45;
          playTone(190, 0.15, 0.085, "triangle", now, sfxGain, 58, sidePan);
          playNoise(0.11, 0.065, 1900, now, sidePan);
        } else if (mount === "stern") {
          playTone(240, 0.12, 0.075, "triangle", now, sfxGain, 82);
          playNoise(0.085, 0.055, 2500, now);
        } else {
          playTone(125, 0.11, 0.04, "triangle", now, sfxGain, 48);
          playNoise(0.08, 0.027, 950, now);
        }
      }
    } else if (event === "specialWeapon") {
      if (!checkCooldown(event, 0.55, now, true)) return;
      const baseNote =
        elementType === "frost" ? 76 : elementType === "storm" ? 69 : 64;
      playArpeggio([0, 7, 12, 19], baseNote, now, 0.065, 0.55, 0.057);
      playNoise(0.18, 0.04, elementType === "fire" ? 2200 : 4200, now, 0, true);
    } else if (event === "specialWeaponEnd") {
      if (!checkCooldown(event, 0.8, now)) return;
      playTone(660, 0.2, 0.02, "sine", now, sfxGain, 440);
    } else if (
      event === "ignite" ||
      (event === "elementHit" && elementType === "fire")
    ) {
      if (!checkCooldown("fire-impact", 0.22, now)) return;
      playNoise(0.13, 0.043, 2600, now);
      playNoise(0.055, 0.023, 4600, now + 0.07);
    } else if (
      event === "chill" ||
      (event === "elementHit" && elementType === "frost")
    ) {
      if (!checkCooldown("frost-impact", 0.2, now)) return;
      playTone(1840, 0.19, 0.027, "sine", now, sfxGain, 1220);
      playTone(2490, 0.12, 0.012, "triangle", now + 0.025);
    } else if (
      event === "chain" ||
      (event === "elementHit" && elementType === "storm")
    ) {
      if (!checkCooldown("storm-impact", 0.17, now)) return;
      playTone(960, 0.09, 0.027, "sawtooth", now, sfxGain, 180);
      playNoise(0.055, 0.023, 5100, now);
    } else if (event === "extinguish") {
      if (!checkCooldown(event, 0.7, now)) return;
      playNoise(0.28, 0.045, 3300, now);
      playTone(620, 0.24, 0.018, "sine", now, sfxGain, 380);
    } else if (event === "sink") {
      if (!checkCooldown(event, 0.14, now)) return;
      playTone(88, 0.45, 0.14, "sine", now, sfxGain, 32);
      playNoise(0.45, 0.15, 1000, now);
      playTone(460, 0.23, 0.018, "triangle", now);
    } else if (event === "surge") {
      if (!checkCooldown(event, 0.35, now, true)) return;
      playNoise(0.55, 0.13, 1800, now, 0, true);
      playTone(150, 0.5, 0.07, "sine", now, sfxGain, 520, 0, true);
      playTone(300, 0.5, 0.035, "triangle", now, sfxGain, 750, 0, true);
    } else if (event === "perfectSurge") {
      if (!checkCooldown(event, 0.6, now, true)) return;
      playArpeggio([0, 7, 12], 76, now, 0.055, 0.5, 0.075);
      playTone(180, 0.32, 0.06, "sine", now, sfxGain, 720, 0, true);
    } else if (event === "hurt") {
      if (!checkCooldown(event, 0.18, now)) return;
      playTone(72, 0.32, 0.085, "triangle", now, sfxGain, 40, 0, true);
      playNoise(0.23, 0.12, 650, now, 0, true);
    } else if (event === "hit") {
      if (!checkCooldown(event, 0.09, now)) return;
      playNoise(0.065, 0.035, 2000, now);
    } else if (event === "pickup") {
      if (!checkCooldown(event, 0.12, now)) return;
      playTone(880, 0.16, 0.045, "sine", now);
      playTone(1320, 0.2, 0.027, "sine", now + 0.055);
    } else if (event === "upgrade" || event === "waveClear") {
      if (!checkCooldown(event, 0.4, now, true)) return;
      playArpeggio([0, 4, 7, 12], 64, now);
    } else if (event === "evolution") {
      if (!checkCooldown(event, 0.6, now, true)) return;
      playTone(midiToFreq(48), 1.5, 0.065, "sine", now, sfxGain, 0, 0, true);
      playArpeggio([0, 7, 12, 16, 19, 24], 60, now, 0.105, 1.2, 0.068);
    } else if (event === "contractComplete") {
      if (!checkCooldown(event, 0.7, now, true)) return;
      playArpeggio([0, 4, 7, 12], 72, now, 0.085, 0.62, 0.06);
    } else if (event === "boss") {
      if (!checkCooldown(event, 1.0, now, true)) return;
      [0, 0.2, 0.4].forEach((offset) => {
        playTone(65, 0.8, 0.1, "triangle", now + offset, sfxGain, 0, 0, true);
        playTone(69, 0.8, 0.045, "sine", now + offset, sfxGain, 0, 0, true);
      });
    } else if (event === "win" || event === "campaignClear") {
      if (!checkCooldown("victory", 1.5, now, true)) return;
      playArpeggio([0, 4, 7, 12, 7, 12, 16, 19], 60, now, 0.18, 1.5, 0.075);
    } else if (event === "lose") {
      if (!checkCooldown(event, 1.5, now)) return;
      [60, 55, 52, 48].forEach((note, i) => {
        playTone(
          midiToFreq(note),
          1.8,
          0.055,
          "sine",
          now + i * 0.3,
          sfxGain,
          0,
          0,
          true,
        );
      });
    }
  }

  return {
    unlock: unlockAudio,
    play: playSound,
    setMuted(mute) {
      isMuted = !!mute;
      if (masterGain && ctx && ctx.state !== "closed") {
        masterGain.gain.setTargetAtTime(
          isMuted ? 0.0 : 0.65,
          ctx.currentTime,
          0.05,
        );
      }
      return isMuted;
    },
    get muted() {
      return isMuted;
    },
    update(gameState, isPaused) {
      const nextRegion = Math.max(
        0,
        Math.min(REGION_TRACKS.length - 1, Math.floor(gameState.region || 0)),
      );
      if (nextRegion !== currentRegion) {
        currentRegion = nextRegion;
        bgmStepIndex = 0;
      }

      const shouldPlayBgm = gameState.phase === "playing" && !isPaused;
      if (
        bgmGain &&
        ctx &&
        ctx.state !== "closed" &&
        shouldPlayBgm !== isBgmPlaying
      ) {
        bgmGain.gain.setTargetAtTime(
          shouldPlayBgm ? 0.55 : 0.0,
          ctx.currentTime,
          0.22,
        );
      }
      isBgmPlaying = shouldPlayBgm;
    },
    dispose() {
      isDisposed = true;
      clearInterval(bgmTimer);
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
    },
  };
}

export { createAudio };
