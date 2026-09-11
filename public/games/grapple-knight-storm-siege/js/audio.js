// Grapple Knight: Storm Siege - Interactive Web Audio Synthesizer
const ROOTS = [50, 46, 48, 45]; // MIDI roots: D, Bb, C, A
const MELODY = [0, 7, 10, 15, 7, 5, 3, 7, 12, 10, 7, 5, 3, 5, 7, 10];
const midiToFreq = (midi) => 440 * 2 ** ((midi - 69) / 12);
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export function createAudio() {
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let reverbGain = null;
  let noiseBuffer = null;
  let hornWave = null;

  let isMuted = false;
  let isPaused = false;
  let isDestroyed = false;

  let nextBeatTime = 0;
  let beatIndex = 0;
  let actIndex = 0;
  let tensionLevel = 0;
  let gamePhase = 'playing';
  let gameStarted = false;
  let isFocused = false;
  let resumePromise = null;
  let rngSeed = 0x4a734f19;

  const activeVoices = new Set();
  const allNodes = [];
  const sfxThrottleMap = new Map();
  const MAX_VOICES = 42;

  function prng() {
    rngSeed ^= rngSeed << 13;
    rngSeed ^= rngSeed >>> 17;
    rngSeed ^= rngSeed << 5;
    return (rngSeed >>> 0) / 0x100000000;
  }

  function rampGain(param, targetValue, timeConstant = 0.06) {
    if (!ctx || !param) return;
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(targetValue, now, timeConstant);
  }

  function stopAllVoices() {
    for (const voice of [...activeVoices]) {
      voice.dispose();
    }
    nextBeatTime = 0;
  }

  function ensureContext() {
    if (ctx || isDestroyed) return Boolean(ctx);
    const AudioCtxClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioCtxClass) return false;

    try {
      ctx = new AudioCtxClass({ latencyHint: 'interactive' });

      // Dynamics Compressor for mastering
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 16;
      compressor.ratio.value = 3.5;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.2;

      masterGain = ctx.createGain();
      masterGain.gain.value = isMuted || isPaused ? 0 : 0.66;

      musicGain = ctx.createGain();
      musicGain.gain.value = 0.6;

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.95;

      musicGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(compressor);
      compressor.connect(ctx.destination);

      // Algorithmic Reverb Impulse
      const reverb = ctx.createConvolver();
      const irDuration = Math.floor(ctx.sampleRate * 1.15);
      const irBuffer = ctx.createBuffer(1, irDuration, ctx.sampleRate);
      const irData = irBuffer.getChannelData(0);
      let noiseVal = 0;
      for (let i = 0; i < irData.length; i++) {
        noiseVal = noiseVal * 0.5 + (prng() * 2 - 1) * 0.5;
        irData[i] = noiseVal * (1 - i / irData.length) ** 3 * 0.58;
      }
      reverb.buffer = irBuffer;

      reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.15;
      reverbGain.connect(reverb);
      reverb.connect(masterGain);

      allNodes.push(masterGain, musicGain, sfxGain, compressor, reverbGain, reverb);

      // Loopable noise buffer
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      let filterVal = 0;
      for (let i = 0; i < noiseData.length; i++) {
        const white = prng() * 2 - 1;
        filterVal = (filterVal + white * 0.08) / 1.06;
        noiseData[i] = white * 0.55 + filterVal * 0.45;
      }

      // Heroic Brass periodic wave table
      hornWave = ctx.createPeriodicWave(
        new Float32Array(9),
        new Float32Array([0, 1, 0.3, 0.22, 0.1, 0.065, 0.025, 0.015, 0.008])
      );

      return true;
    } catch (err) {
      const oldCtx = ctx;
      ctx = null;
      for (const node of allNodes.splice(0)) {
        try { node.disconnect(); } catch {}
      }
      try { oldCtx?.close()?.catch(() => {}); } catch {}
      return false;
    }
  }

  function unlock() {
    if (isDestroyed || !ensureContext()) return Promise.resolve(false);
    if (ctx.state === 'running') return Promise.resolve(true);
    if (resumePromise) return resumePromise;

    try {
      resumePromise = Promise.resolve(ctx.resume())
        .then(() => !isDestroyed && ctx?.state === 'running')
        .catch(() => false)
        .finally(() => {
          resumePromise = null;
        });
      return resumePromise;
    } catch {
      return Promise.resolve(false);
    }
  }

  function createVoice(startTime, duration, peakGain, panValue, destinationNode, sendToReverb = true) {
    if (!ctx || isDestroyed || isMuted || isPaused || activeVoices.size >= MAX_VOICES) {
      return null;
    }

    const start = Math.max(startTime, ctx.currentTime);
    const end = start + Math.max(0.035, duration);

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, start);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    if (panner.pan) {
      panner.pan.value = clamp(panValue, -0.8, 0.8);
    }

    envelope.connect(panner);
    panner.connect(destinationNode);
    if (sendToReverb && reverbGain) {
      envelope.connect(reverbGain);
    }

    const nodes = [envelope, panner];
    const sources = [];
    let isDisposed = false;

    const voice = {
      start,
      end,
      gain: peakGain,
      envelope,
      nodes,
      sources,
      dispose() {
        if (isDisposed) return;
        isDisposed = true;
        for (const src of sources) {
          src.onended = null;
          try { src.stop(); } catch {}
        }
        for (const node of nodes) {
          try { node.disconnect(); } catch {}
        }
        activeVoices.delete(voice);
      },
    };

    activeVoices.add(voice);
    return voice;
  }

  function applyAdsr(voice, attack = 0.006, decay = 0.18, sustain = 0.0001) {
    const gainParam = voice.envelope.gain;
    const peakTime = Math.min(voice.end - 0.002, voice.start + attack);
    gainParam.linearRampToValueAtTime(voice.gain, peakTime);
    gainParam.exponentialRampToValueAtTime(
      Math.max(0.0001, sustain),
      Math.min(voice.end, peakTime + decay)
    );
    gainParam.exponentialRampToValueAtTime(0.0001, voice.end);
  }

  function attachSource(voice, sourceNode) {
    voice.sources.push(sourceNode);
    voice.nodes.push(sourceNode);
    sourceNode.onended = () => {
      if (ctx && ctx.currentTime >= voice.end - 0.025) {
        voice.dispose();
      }
    };
    sourceNode.start(voice.start);
    sourceNode.stop(voice.end);
  }

  function addOscillator(voice, freq, waveType = 'sine', gainMultiplier = 1, endFreq = null, detuneCents = 0) {
    const osc = ctx.createOscillator();
    if (waveType === 'horn' && hornWave) {
      osc.setPeriodicWave(hornWave);
    } else {
      osc.type = waveType;
    }

    osc.frequency.setValueAtTime(Math.max(15, freq), voice.start);
    osc.detune.value = detuneCents;
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(15, endFreq), voice.end);
    }

    const oscGain = ctx.createGain();
    oscGain.gain.value = gainMultiplier;
    osc.connect(oscGain);
    oscGain.connect(voice.envelope);

    voice.nodes.push(oscGain);
    attachSource(voice, osc);
  }

  function playNoise(time, duration, gain, startFreq, filterType = 'bandpass', pan = 0, endFreq = startFreq, targetSubmix = sfxGain) {
    const voice = createVoice(time, duration, gain, pan, targetSubmix, false);
    if (!voice) return;

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = filterType === 'bandpass' ? 0.65 : 0.45;
    filter.frequency.setValueAtTime(startFreq, voice.start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), voice.end);

    noiseSrc.connect(filter);
    filter.connect(voice.envelope);
    voice.nodes.push(filter);

    applyAdsr(voice, 0.006, duration * 0.7);
    attachSource(voice, noiseSrc);
  }

  function playBell(midiNote, time, volScale = 1, pan = 0) {
    const voice = createVoice(time, 0.85, 0.12 * volScale, pan, musicGain);
    if (!voice) return;
    applyAdsr(voice, 0.004, 0.7);
    addOscillator(voice, midiToFreq(midiNote), 'triangle', 0.8);
    addOscillator(voice, midiToFreq(midiNote + 12), 'sine', 0.18, midiToFreq(midiNote + 12) * 0.997);
  }

  function playChime(midiNote, time, volScale = 1, pan = 0, targetSubmix = musicGain, duration = 1.25) {
    const voice = createVoice(time, duration, 0.075 * volScale, pan, targetSubmix);
    if (!voice) return;
    applyAdsr(voice, 0.003, duration * 0.88);
    addOscillator(voice, midiToFreq(midiNote), 'sine', 1);
    addOscillator(voice, midiToFreq(midiNote) * 2.756, 'sine', 0.13);
    addOscillator(voice, midiToFreq(midiNote) * 4.06, 'sine', 0.045);
  }

  function playHorn(midiNote, time, duration, volScale = 1, pan = 0) {
    const voice = createVoice(time, duration, 0.052 * volScale, pan, musicGain);
    if (!voice) return;
    applyAdsr(voice, 0.22, duration * 0.48, voice.gain * 0.48);
    addOscillator(voice, midiToFreq(midiNote), 'horn', 0.65, null, -4);
    addOscillator(voice, midiToFreq(midiNote), 'horn', 0.35, null, 4);
  }

  function playSubBass(time, volScale = 1, freq = 115, targetSubmix = sfxGain) {
    const voice = createVoice(time, 0.28, 0.2 * volScale, 0, targetSubmix, false);
    if (!voice) return;
    applyAdsr(voice, 0.004, 0.23);
    addOscillator(voice, freq, 'sine', 1, 35);
  }

  function scheduleBgmBeat(time) {
    const tempos = [88, 102, 112, 104, 116, 124];
    const beatDuration = 60 / tempos[actIndex];
    const beatInBar = beatIndex % 8;
    const barIndex = Math.floor(beatIndex / 8);

    const pitchOffset = [0, 0, 0, -2, 3, 5][actIndex];
    const rootMidi = ROOTS[Math.floor(barIndex / 2) % ROOTS.length] + pitchOffset;
    const focusGain = isFocused ? 0.68 : 1.0;

    if (beatInBar === 0) {
      playHorn(rootMidi - 12, time, beatDuration * 3.85, focusGain, -0.28);
      playHorn(rootMidi - 5, time + 0.06, beatDuration * 3.5, focusGain * 0.46, 0.25);
      playBell(rootMidi, time, 0.8, -0.38);
      playSubBass(time, 0.55 + tensionLevel * 0.22, 84, musicGain);
    }

    if (beatInBar % 2 === 0 || tensionLevel > 0.5) {
      const melodyNote = MELODY[(beatIndex + actIndex * 3) % MELODY.length];
      const noteMidi = 62 + melodyNote + pitchOffset;
      playBell(
        noteMidi,
        time + (beatInBar % 2 ? beatDuration * 0.035 : 0),
        (beatInBar % 2 ? 0.42 : 0.66) * focusGain,
        Math.sin(beatIndex * 1.3) * 0.42
      );
    }

    if (beatInBar === 2 || beatInBar === 6) {
      playNoise(time, 0.115, (0.08 + tensionLevel * 0.035) * focusGain, 1700, 'bandpass', 0.14, 800, musicGain);
      if (actIndex > 0) {
        playSubBass(time, 0.3 + tensionLevel * 0.15, 115, musicGain);
      }
    }

    if (beatInBar % 2 === 1 && tensionLevel > 0.25) {
      playNoise(time, 0.035, 0.026 * focusGain, 5200, 'highpass', -0.3, 3600, musicGain);
    }

    if (beatInBar === 4 && barIndex % 2 === 1) {
      playChime(81 + [0, -2, -5, -7][Math.floor(barIndex / 2) % 4], time, 0.46 * focusGain, 0.4);
    }

    if (actIndex >= 2 && beatInBar === 7 && tensionLevel > 0.62) {
      playNoise(time, 0.14, 0.055, 450, 'bandpass', -0.3, 180, musicGain);
    }

    beatIndex++;
    return beatDuration / 2;
  }

  function update(state) {
    if (isDestroyed || !state) return;

    actIndex = clamp(Math.floor(Number(state.act) || 0), 0, 5);
    gamePhase = state.phase || 'playing';
    gameStarted = Boolean(state.started);
    isFocused = Boolean(state.focus);

    const boss = state.boss;
    const bossHpRatio = boss?.maxHp > 0 ? 1 - boss.hp / boss.maxHp : 0;
    tensionLevel = clamp(actIndex * 0.085 + bossHpRatio * 0.42 + (boss?.coreOpen ? 0.2 : 0), 0, 1);

    if (!ctx || ctx.state !== 'running' || isMuted || isPaused || state.paused) {
      nextBeatTime = 0;
      return;
    }

    for (const voice of activeVoices) {
      if (voice.end < ctx.currentTime - 0.08) voice.dispose();
    }

    if (!gameStarted || gamePhase !== 'playing') {
      nextBeatTime = 0;
      return;
    }

    rampGain(musicGain.gain, isFocused ? 0.4 : 0.58 + tensionLevel * 0.09, 0.18);

    const now = ctx.currentTime;
    if (!nextBeatTime || nextBeatTime < now - 0.2) {
      nextBeatTime = now + 0.025;
    }

    let iterations = 0;
    while (nextBeatTime < now + 0.12 && iterations++ < 3) {
      nextBeatTime += scheduleBgmBeat(nextBeatTime);
    }
  }

  function event(ev) {
    if (!ctx || ctx.state !== 'running' || isDestroyed || isMuted || isPaused || !ev) return;

    const eventType = typeof ev === 'string' ? ev : ev.type;
    const now = ctx.currentTime;
    const throttleDurations = {
      hook: 0.045,
      strike: 0.055,
      break: 0.09,
      deflect: 0.065,
      hurt: 0.25,
    };
    const throttleLimit = throttleDurations[eventType] || 0;

    if (now - (sfxThrottleMap.get(eventType) ?? -Infinity) < throttleLimit) {
      return;
    }
    sfxThrottleMap.set(eventType, now);

    const panPos = Math.sin((Number(ev.x) || 0) * 0.004) * 0.25;

    switch (eventType) {
      case 'hook': {
        playNoise(now, 0.17, 0.19, 1400, 'bandpass', panPos, 5600);
        const voice = createVoice(now, 0.32, 0.048, panPos, sfxGain);
        if (voice) {
          applyAdsr(voice, 0.007, 0.28);
          addOscillator(voice, 470, 'triangle', 1, 1350);
        }
        break;
      }
      case 'strike': {
        const combo = clamp(Number(ev.combo) || 0, 0, 12);
        playSubBass(now, 0.75, 148);
        playNoise(now, 0.12, 0.18, 1100, 'bandpass', panPos, 320);
        playChime(62 + [0, 3, 5, 7, 10][combo % 5], now, 1.35, panPos, sfxGain, 0.66);
        break;
      }
      case 'break': {
        playNoise(now, 0.4, 0.25, 2200, 'lowpass', panPos, 180);
        playSubBass(now, 0.85, 95);
        [74, 77, 81].forEach((note, idx) =>
          playChime(note, now + idx * 0.055, 0.74, panPos, sfxGain, 0.85)
        );
        break;
      }
      case 'deflect': {
        playChime(86 + [0, 3, 5][Math.floor(prng() * 3)], now, 0.72, panPos, sfxGain, 0.3);
        break;
      }
      case 'hurt': {
        playNoise(now, 0.28, 0.22, 400, 'lowpass', 0, 100);
        const voice = createVoice(now, 0.29, 0.12, 0, sfxGain, false);
        if (voice) {
          applyAdsr(voice, 0.007, 0.27);
          addOscillator(voice, 185, 'triangle', 1, 62);
          addOscillator(voice, 196, 'triangle', 0.32, 58);
        }
        break;
      }
      case 'nova': {
        playNoise(now, 0.28, 0.17, 700, 'bandpass', panPos, 160);
        playSubBass(now, 0.7, 96);
        break;
      }
      case 'tether':
      case 'polarity': {
        playChime(eventType === 'tether' ? 77 : 81, now, 0.58, panPos, sfxGain, 0.55);
        break;
      }
      case 'rescue': {
        [62, 69, 74, 86].forEach((note, idx) =>
          playChime(note, now + idx * 0.1, 0.8, 0, sfxGain, 1.1)
        );
        break;
      }
      case 'burst': {
        playNoise(now, 0.55, 0.33, 5200, 'lowpass', 0, 180);
        playSubBass(now, 1.2, 90);
        [62, 69, 74, 81].forEach((note, idx) =>
          playChime(note, now + idx * 0.035, 1, (idx - 1.5) * 0.2, sfxGain)
        );
        break;
      }
      case 'upgrade':
      case 'heal': {
        [62, 65, 69, 74].forEach((note, idx) =>
          playChime(note, now + idx * 0.105, 0.82, (idx - 1.5) * 0.15, sfxGain)
        );
        break;
      }
      case 'boss_start': {
        beatIndex = 0;
        nextBeatTime = now + 0.08;
        playHorn(38, now, 1.4, 1.25, -0.1);
        playHorn(45, now + 0.13, 1.5, 0.8, 0.15);
        playChime(74, now + 0.18, 0.75, 0, sfxGain);
        break;
      }
      case 'boss_defeat': {
        stopAllVoices();
        playNoise(now, 1.7, 0.38, 4400, 'lowpass', 0, 65);
        playSubBass(now, 1.5, 145);
        playSubBass(now + 0.23, 0.8, 78);
        [50, 57, 62, 69].forEach((note, idx) =>
          playChime(note, now + 0.13 + idx * 0.11, 1.1, (idx - 1.5) * 0.2, sfxGain, 2.0)
        );
        break;
      }
      case 'win': {
        [62, 65, 69, 74, 77, 81, 86].forEach((note, idx) =>
          playChime(note, now + idx * 0.16, idx === 6 ? 1.2 : 0.9, Math.sin(idx) * 0.3, sfxGain, 2.6)
        );
        playHorn(50, now + 0.4, 3.2, 1.15, -0.2);
        playHorn(57, now + 0.48, 3.0, 0.8, 0.2);
        break;
      }
      case 'lose': {
        stopAllVoices();
        playHorn(38, now, 1.7, 0.8, -0.15);
        playChime(62, now + 0.15, 0.6, 0.2, sfxGain, 1.8);
        playChime(57, now + 0.48, 0.5, -0.1, sfxGain, 1.8);
        break;
      }
      default:
        break;
    }
  }

  function setMuted(muted) {
    isMuted = Boolean(muted);
    if (isMuted) stopAllVoices();
    rampGain(masterGain?.gain, isMuted || isPaused ? 0 : 0.66, 0.035);
    if (!isMuted && ctx && !isPaused) void unlock();
  }

  function setPaused(paused) {
    isPaused = Boolean(paused);
    if (isPaused) stopAllVoices();
    rampGain(masterGain?.gain, isMuted || isPaused ? 0 : 0.66, 0.035);
    if (!isPaused && ctx && !isMuted) void unlock();
  }

  function destroy() {
    if (isDestroyed) return;
    isDestroyed = true;
    stopAllVoices();
    for (const node of allNodes.splice(0)) {
      try { node.disconnect(); } catch {}
    }
    try { ctx?.close()?.catch(() => {}); } catch {}
    ctx = null;
    noiseBuffer = null;
    hornWave = null;
    sfxThrottleMap.clear();
  }

  return {
    unlock,
    event,
    update,
    setMuted,
    setPaused,
    destroy,
  };
}
