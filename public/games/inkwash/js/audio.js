/**
 * INKWASH 晕染 — Web Audio API Synthesizer & Traditional Chinese Pentatonic BGM Engine
 */

export function createAudio() {
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let musicTimer = null;
  let muted = false;
  let currentRank = 5;
  let isFrenzy = false;

  // Traditional Pentatonic Scale (A3, B3, C#4, E4, F#4)
  const PENTATONIC = [220, 247.5, 277.2, 330, 370];
  let noteStep = 0;

  function unlock() {
    if (ctx) {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    } catch (e) {
      console.warn("AudioContext not supported");
      return;
    }

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.32;
    musicGain.connect(masterGain);

    startBgm();
  }

  const now = () => (ctx ? ctx.currentTime : 0);

  function playTone(
    freq,
    duration,
    type,
    volume,
    dest,
    delay = 0,
    pitchBend = 0,
  ) {
    if (!ctx || muted) return;

    const startTime = now() + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    if (pitchBend !== 0) {
      osc.frequency.linearRampToValueAtTime(
        Math.max(30, freq + pitchBend),
        startTime + duration,
      );
    }

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    osc.connect(gain).connect(dest || masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function playNoise(duration, volume, filterFreq = 1200, delay = 0) {
    if (!ctx || muted) return;

    const startTime = now() + delay;
    const bufferSize = Math.max(1, (duration * ctx.sampleRate) | 0);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter).connect(gain).connect(masterGain);
    noise.start(startTime);
  }

  function startBgm() {
    if (musicTimer) clearInterval(musicTimer);

    const tick = () => {
      if (!ctx || muted || document.hidden) return;

      const bpm = isFrenzy ? 126 : 92;
      const intensity = currentRank <= 1 ? 3 : currentRank <= 3 ? 2 : 1;
      const melody = [0, 2, 3, 1, 4, 2, 0, 3];
      const baseFreq = PENTATONIC[melody[noteStep % 8]];

      // Lead Pentatonic Pluck
      playTone(baseFreq * 2, 0.34, "sine", 0.05, musicGain);

      // Bass Harmony
      if (intensity >= 2 && noteStep % 2 === 0) {
        playTone(baseFreq, 0.5, "triangle", 0.035, musicGain);
      }

      // High Accents
      if (intensity >= 3 && noteStep % 4 === 2) {
        playTone(baseFreq * 3, 0.2, "sine", 0.028, musicGain);
      }

      // Frenzy Brush Rhythm
      if (isFrenzy && noteStep % 2 === 1) {
        playNoise(0.05, 0.05, 4000);
      }

      noteStep++;
      musicTimer = setTimeout(tick, 60000 / bpm / 2);
    };

    tick();
  }

  return {
    unlock,
    set muted(val) {
      muted = val;
      if (masterGain) {
        masterGain.gain.value = val ? 0 : 0.7;
      }
    },
    get muted() {
      return muted;
    },
    setRank(rank) {
      currentRank = rank;
    },
    setFrenzy(frenzy) {
      isFrenzy = frenzy;
    },

    // Territory Claim Splash Sound
    claim(cellsCount) {
      if (!ctx) return;
      const chords = Math.min(7, 2 + Math.floor(Math.sqrt(cellsCount) / 3));
      for (let i = 0; i < chords; i++) {
        const note = PENTATONIC[i % 5] * (i >= 5 ? 4 : 2);
        playTone(note, 0.32, "sine", 0.085, masterGain, i * 0.055);
      }
      playNoise(0.25, 0.05, 900);
    },

    // Dip brush into ink pot
    dip() {
      playTone(180, 0.12, "sine", 0.06, masterGain, 0, 120);
    },

    // Speed boost whoosh
    boostOn() {
      playNoise(0.18, 0.06, 2200);
    },

    // Cut enemy ink trail
    cut() {
      playNoise(0.12, 0.16, 3000);
      playTone(160, 0.25, "square", 0.07, masterGain, 0.02, -80);
    },

    // Player elimination death
    die() {
      playTone(300, 0.5, "sine", 0.12, masterGain, 0, -240);
      playNoise(0.4, 0.12, 500);
    },

    // Kill enemy player
    kill() {
      playTone(520, 0.14, "triangle", 0.1, masterGain);
      playTone(780, 0.2, "triangle", 0.1, masterGain, 0.08);
    },

    // Low ink stamina warning blip
    lowInk() {
      playTone(140, 0.09, "sawtooth", 0.045, masterGain);
    },

    // Announcement / Leaderboard change chime
    announce() {
      playTone(660, 0.15, "sine", 0.06, masterGain);
    },

    // Last 30s Frenzy start fanfare
    frenzyStart() {
      for (let i = 0; i < 4; i++) {
        playTone(
          440 * (1 + i * 0.25),
          0.16,
          "sawtooth",
          0.05,
          masterGain,
          i * 0.07,
        );
      }
      playNoise(0.5, 0.1, 6000);
    },

    // Podium end round victory chords
    podium() {
      [0, 2, 4, 7].forEach((step, idx) => {
        const f = 330 * Math.pow(2, step / 12);
        playTone(f, 0.5, "triangle", 0.09, masterGain, idx * 0.12);
      });
      playNoise(0.6, 0.08, 1500, 0.1);
    },

    // Countdown timer tick
    countdown() {
      playTone(495, 0.1, "sine", 0.07, masterGain);
    },
  };
}
