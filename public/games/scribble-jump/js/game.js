/**
 * Scribble Jump — Clean, High-Performance Canvas Arcade Platformer
 */

'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const menuBestEl = document.getElementById('menuBest');
const finalScoreEl = document.getElementById('finalScore');
const finalBestEl = document.getElementById('finalBest');
const deathLineEl = document.getElementById('deathLine');
const menuEl = document.getElementById('menu');
const pauseMenuEl = document.getElementById('pauseMenu');
const gameOverEl = document.getElementById('gameOver');
const settingsMenuEl = document.getElementById('settingsMenu');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const resumeBtn = document.getElementById('resumeBtn');
const pauseBtn = document.getElementById('pauseBtn');
const soundBtn = document.getElementById('soundBtn');
const settingsBtn = document.getElementById('settingsBtn');
const menuSettingsBtn = document.getElementById('menuSettingsBtn');
const pauseSettingsBtn = document.getElementById('pauseSettingsBtn');
const gameOverSettingsBtn = document.getElementById('gameOverSettingsBtn');
const settingsDoneBtn = document.getElementById('settingsDoneBtn');
const langZhBtn = document.getElementById('langZhBtn');
const langEnBtn = document.getElementById('langEnBtn');
const leftPad = document.getElementById('leftPad');
const rightPad = document.getElementById('rightPad');
const runHintEl = document.getElementById('runHint');
const runFactsEl = document.getElementById('runFacts');

const ui = {
  menuSubtitle: document.getElementById('menuSubtitle'),
  menuBestLabel: document.getElementById('menuBestLabel'),
  menuControlLabel: document.getElementById('menuControlLabel'),
  menuControlValue: document.getElementById('menuControlValue'),
  menuHint: document.getElementById('menuHint'),
  pauseTitle: document.getElementById('pauseTitle'),
  pauseSubtitle: document.getElementById('pauseSubtitle'),
  gameOverTitle: document.getElementById('gameOverTitle'),
  finalScoreLabel: document.getElementById('finalScoreLabel'),
  finalBestLabel: document.getElementById('finalBestLabel'),
  settingsTitle: document.getElementById('settingsTitle'),
  languageLabel: document.getElementById('languageLabel'),
  mobileLabel: document.getElementById('mobileLabel'),
  mobileLine1: document.getElementById('mobileLine1'),
  mobileLine2: document.getElementById('mobileLine2'),
  mobileLine3: document.getElementById('mobileLine3'),
  touchLeftLabel: document.getElementById('touchLeftLabel'),
  touchRightLabel: document.getElementById('touchRightLabel')
};

const W = 420;
const H = 746;
const STORAGE_KEY = 'scribble-jump-best';
const SOUND_KEY = 'scribble-jump-sound';
const LANGUAGE_KEY = 'scribble-jump-language';

const STRINGS = {
  zh: {
    htmlLang: 'zh-CN',
    title: 'Scribble Jump',
    appLabel: 'Scribble Jump 游戏',
    canvasLabel: 'Scribble Jump 画布游戏',
    menuSubtitle: '往上跳，别掉下去。碰到怪东西就踩它，别拿脸撞。',
    start: '开始',
    settings: '设置',
    best: '最高分',
    control: '控制',
    menuHint: '手机：按住屏幕左侧或右侧。键盘：方向键或 A/D，空格键暂停。',
    pause: '暂停',
    pauseSubtitle: '手感已经调优。接下来准备应对更高难度的关卡。',
    resume: '继续',
    gameOver: '掉了',
    restart: '再来',
    runScore: '本局',
    highScore: '最高',
    language: '语言',
    mobile: '手机玩法',
    mobileLine1: '按住左半屏往左，右半屏往右。',
    mobileLine2: '角色自动跳；你负责找平台。',
    mobileLine3: '踩红怪得分。蓝盾能挡一次撞击。',
    runHint: '按住左右移动。\n从上方踩红怪。\n蓝盾能挡一次撞击。',
    done: '完成',
    left: '按住左',
    right: '按住右',
    hud: (bestVal, coins, shield) => `最高 ${bestVal} · 金币 ${coins}${shield ? ' · 护盾' : ''}`,
    soundOn: '关闭声音',
    soundOff: '开启声音',
    pauseAction: '暂停',
    settingsAction: '设置',
    deaths: [
      '这个角度挺离谱。',
      '平台明明就在那里，太可惜了。',
      '掉落速度太快，重来一次找回手感。',
      '别用脸接怪，这条很重要。'
    ]
  },
  en: {
    htmlLang: 'en',
    title: 'Scribble Jump',
    appLabel: 'Scribble Jump game',
    canvasLabel: 'Scribble Jump canvas game',
    menuSubtitle: 'Jump up, do not fall. Stomp red weirdos, do not face-tank them.',
    start: 'Start',
    settings: 'Settings',
    best: 'Best',
    control: 'Controls',
    menuHint: 'Phone: hold the left or right half. Keyboard: arrows or A/D, Space pauses.',
    pause: 'Paused',
    pauseSubtitle: 'The feel is decent now. Next comes more toys and sharper pacing.',
    resume: 'Resume',
    gameOver: 'Dropped',
    restart: 'Again',
    runScore: 'Run',
    highScore: 'Best',
    language: 'Language',
    mobile: 'Phone Controls',
    mobileLine1: 'Hold left half to move left; right half to move right.',
    mobileLine2: 'Auto-jump is on. Steer and find platforms.',
    mobileLine3: 'Stomp red enemies. A blue shield blocks one hit.',
    runHint: 'Hold left/right to steer.\nStomp red enemies from above.\nBlue shields block one hit.',
    done: 'Done',
    left: 'Hold left',
    right: 'Hold right',
    hud: (bestVal, coins, shield) => `BEST ${bestVal} · COIN ${coins}${shield ? ' · SHIELD' : ''}`,
    soundOn: 'Mute sound',
    soundOff: 'Enable sound',
    pauseAction: 'Pause',
    settingsAction: 'Settings',
    deaths: [
      'That angle was nonsense.',
      'The platform was right there. Brutal.',
      'Run it back. The hands will return.',
      'Do not block enemies with your face. Big rule.'
    ]
  }
};

const COLORS = {
  ink: '#243044',
  line: 'rgba(47, 127, 247, 0.16)',
  redLine: 'rgba(229, 77, 94, 0.2)',
  green: '#43b66e',
  greenDark: '#2e8d53',
  blue: '#2f7ff7',
  orange: '#f08b35',
  red: '#e54d5e',
  violet: '#8a63d2',
  gold: '#f5c844',
  paper: '#f8f0dc',
  paper2: '#fff8e7',
  shadow: 'rgba(36, 48, 68, 0.18)'
};

const PLATFORM = {
  normal: { w: 78, h: 15, color: COLORS.green, dark: COLORS.greenDark },
  moving: { w: 76, h: 15, color: COLORS.blue, dark: '#205aaa' },
  crumble: { w: 70, h: 15, color: COLORS.orange, dark: '#b35b1e' },
  spring: { w: 80, h: 15, color: COLORS.violet, dark: '#5d3ca0' }
};

const GRAVITY = 1850;
const JUMP = -760;
const SUPER_JUMP = -1040;
const MOVE_ACCEL = 3700;
const MOVE_DRAG = 0.86;
const MAX_VX = 390;
const MAX_DT = 1 / 28;

let dpr = 1;
let mode = 'menu';
let settingsReturnMode = 'playing';
let lastTime = performance.now();
const input = { left: false, right: false, pointerId: null, pointerX: null };
let best = getNumber(STORAGE_KEY, 0);
let soundOn = getStored(SOUND_KEY, '1') !== '0';
let locale = getStored(LANGUAGE_KEY, getDefaultLocale());
if (!STRINGS[locale]) locale = getDefaultLocale();
let runHintTimer = 0;
let world = createWorld();

/**
 * Web Audio Dynamic Sound Generator
 */
const AudioBus = (() => {
  let ctx = null;
  let masterGain = null;
  let sfxGain = null;
  let bgmGain = null;
  let delayNode = null;
  let delayFeedback = null;
  let delayFilter = null;
  let isUnlocked = false;
  let currentMode = 'menu';
  let intensity = 0;
  let currentScore = 0;
  let currentVelocity = 0;
  let nextBgmTime = 0;
  let stepCount = 0;

  const ROOT_NOTES = [130.81, 146.83, 164.81, 196.0];
  const CHORDS = [
    [0, 4, 7, 12, 7, 4, 10, 7],
    [0, 3, 7, 12, 15, 12, 7, 3],
    [0, 5, 9, 12, 16, 12, 9, 5],
    [0, 4, 7, 11, 14, 11, 7, 4]
  ];
  const LEAD_MELODIES = [
    [12, null, 16, 19, null, 16, 21, null, 19, 16, null, 14, 12, null, 7, null],
    [12, null, 15, 19, null, 20, 19, null, 17, 15, null, 12, 10, null, 7, null],
    [12, null, 17, 21, null, 17, 24, null, 21, 17, null, 16, 14, null, 9, null],
    [11, null, 14, 19, null, 18, 19, null, 16, 14, null, 11, 9, null, 7, null]
  ];
  const BASS_LINES = [
    [12, 16, 19, 16, 14, 12, 7, 12, 16, 19, 21, 19, 16, 14, 12, null],
    [12, 15, 19, 15, 13, 12, 7, 10, 15, 19, 20, 19, 15, 13, 12, null],
    [12, 17, 21, 17, 16, 12, 9, 12, 17, 21, 24, 21, 17, 16, 12, null],
    [11, 14, 19, 14, 12, 11, 7, 11, 14, 19, 23, 19, 16, 14, 11, null]
  ];

  function noteToFreq(base, interval) {
    return base * Math.pow(2, interval / 12);
  }

  function getProgressionIndex() {
    return Math.max(0, Math.floor(currentScore / 850)) % ROOT_NOTES.length;
  }

  function getCurrentRoot() {
    return ROOT_NOTES[getProgressionIndex()];
  }

  function getMasterVolume() {
    return soundOn ? 0.28 : 0.0;
  }

  function getBgmTargetVolume() {
    if (!isUnlocked || !soundOn) return 0.0;
    if (currentMode === 'playing') return 0.79 + intensity * 0.16;
    if (currentMode === 'gameover') return 0.16;
    return 0.054;
  }

  function initAudioNodes() {
    if (ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = getMasterVolume();

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 16;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.16;

    masterGain.connect(comp);
    comp.connect(ctx.destination);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.86;
    sfxGain.connect(masterGain);

    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.0;
    bgmGain.connect(masterGain);

    delayNode = ctx.createDelay(0.4);
    delayNode.delayTime.value = 0.18;
    delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.16;
    delayFilter = ctx.createGain();
    delayFilter.gain.value = 0.18;

    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(delayFilter);
    delayFilter.connect(bgmGain);
  }

  function resume() {
    initAudioNodes();
    if (!ctx) return;
    const firstUnlock = !isUnlocked;
    isUnlocked = true;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (!nextBgmTime || nextBgmTime < ctx.currentTime) nextBgmTime = ctx.currentTime + 0.04;
    if (masterGain) masterGain.gain.setTargetAtTime(getMasterVolume(), ctx.currentTime, 0.025);
    if (bgmGain) bgmGain.gain.setTargetAtTime(getBgmTargetVolume(), ctx.currentTime, 0.2);
    if (firstUnlock && soundOn) {
      playStartSound();
      scheduleBgm();
    }
  }

  function playTone(freq, dur, wave = 'sine', vol = 0.05, mult = 1, delay = 0) {
    if (!ctx || !soundOn) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(Math.max(20, freq), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * mult), now + dur);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(g);
    g.connect(sfxGain || masterGain || ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  function playNoise(dur, vol = 0.04, delay = 0, cutoff = 1700) {
    if (!ctx || !soundOn) return;
    const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
    }

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    const now = ctx.currentTime + delay;

    src.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = cutoff;
    filter.Q.value = 0.8;
    g.gain.value = vol;

    src.connect(filter);
    filter.connect(g);
    g.connect(sfxGain || masterGain || ctx.destination);
    src.start(now);
  }

  function playSynthMelody(freq, time, dur, vol, wave = 'triangle', cutoff = 1600) {
    if (!ctx || !bgmGain || !soundOn || currentMode !== 'playing') return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.998), time + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.value = 1.35;

    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(g);
    g.connect(bgmGain);
    if (delayNode) g.connect(delayNode);

    osc.start(time);
    osc.stop(time + dur + 0.04);
  }

  function playKick(time, vol = 0.14) {
    if (!ctx || !bgmGain || !soundOn || currentMode !== 'playing') return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(118, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.13);

    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);

    osc.connect(g);
    g.connect(bgmGain);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  function playHat(time, dur, vol, cutoff, filterType = 'bandpass') {
    if (!ctx || !bgmGain || !soundOn || currentMode !== 'playing') return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    src.buffer = buf;
    filter.type = filterType;
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.value = 1.1;

    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(bgmGain);
    src.start(time);
  }

  function scheduleBgm() {
    if (!ctx || !isUnlocked || !soundOn || currentMode !== 'playing') return;
    const now = ctx.currentTime;
    if (!nextBgmTime || nextBgmTime < now) nextBgmTime = now + 0.025;

    const tempo = 122 + intensity * 14 + Math.min(8, currentVelocity / 120);
    const stepDur = 60 / tempo / 2;
    const root = getCurrentRoot();
    const progressionIdx = getProgressionIndex();
    const chord = CHORDS[progressionIdx];
    const melody = LEAD_MELODIES[progressionIdx];
    const bass = BASS_LINES[progressionIdx];

    while (nextBgmTime < now + 0.24) {
      const step16 = stepCount % 16;
      const isDownbeat = step16 === 0 || step16 === 8;
      const isOffbeat = step16 === 4 || step16 === 12;
      const chordNote = chord[stepCount % chord.length] + (step16 >= 8 ? 12 : 0);
      const melNote = melody[stepCount % melody.length];
      const bassNote = bass[step16];
      const brightness = 1850 + intensity * 1250 + progressionIdx * 180;

      if (step16 % 4 === 0) playKick(nextBgmTime, isDownbeat ? 0.17 : 0.12);
      if (isOffbeat) playHat(nextBgmTime + 0.012, 0.055, 0.052, 2400);
      if (step16 % 2 === 1) playHat(nextBgmTime + 0.006, 0.026, 0.022 + intensity * 0.006, 6800, 'highpass');
      if (isDownbeat) playSynthMelody(noteToFreq(root * 0.5, 0), nextBgmTime, stepDur * 0.78, 0.105 + intensity * 0.02, 'square', 520);

      if (step16 % 2 === 0 || step16 === 5 || step16 === 13) {
        playSynthMelody(noteToFreq(root, chordNote + 12), nextBgmTime + 0.012, Math.min(0.15, stepDur * 0.62), 0.058 + intensity * 0.016, 'triangle', brightness);
      }

      if (bassNote !== null) {
        playSynthMelody(noteToFreq(root, bassNote + 12), nextBgmTime + stepDur * 0.18, Math.min(0.16, stepDur * 0.62), 0.078 + intensity * 0.018, step16 % 4 === 0 ? 'square' : 'sine', brightness + 860);
      } else if (melNote !== null) {
        playSynthMelody(noteToFreq(root, melNote + 12), nextBgmTime + stepDur * 0.24, Math.min(0.14, stepDur * 0.56), 0.052 + intensity * 0.012, 'sine', brightness + 650);
      }

      if (step16 === 14) {
        playSynthMelody(noteToFreq(root, 31), nextBgmTime + stepDur * 0.18, Math.min(0.09, stepDur * 0.38), 0.04, 'sine', 3400);
      }

      stepCount++;
      nextBgmTime += stepDur;
    }
  }

  function playStartSound() {
    if (!isUnlocked) return;
    playTone(392, 0.08, 'triangle', 0.055, 1.18);
    playTone(523.25, 0.1, 'triangle', 0.05, 1.12, 0.075);
  }

  return {
    resume,
    setMode(m) {
      currentMode = m;
      if (!ctx) return;
      if (bgmGain) bgmGain.gain.setTargetAtTime(getBgmTargetVolume(), ctx.currentTime, 0.22);
    },
    setSound(on) {
      soundOn = Boolean(on);
      setStored(SOUND_KEY, soundOn ? '1' : '0');
      if (masterGain && ctx) masterGain.gain.setTargetAtTime(getMasterVolume(), ctx.currentTime, 0.025);
      if (bgmGain && ctx) bgmGain.gain.setTargetAtTime(getBgmTargetVolume(), ctx.currentTime, 0.16);
    },
    startRun: playStartSound,
    land(type, combo = 1) {
      if (!isUnlocked) return;
      if (type === 'spring') {
        playTone(330, 0.1, 'triangle', 0.07, 1.85);
        playTone(660, 0.16, 'sine', 0.045, 1.24, 0.05);
        return;
      }
      if (type === 'crumble') {
        playTone(150, 0.1, 'square', 0.058, 0.62);
        playNoise(0.12, 0.035, 0.01, 900);
        return;
      }
      const pitchOffset = Math.min(combo, 9) * 16;
      playTone(350 + pitchOffset, 0.06, 'triangle', 0.043, 1.08);
    },
    pickup(type) {
      if (!isUnlocked) return;
      if (type === 'shield') {
        playTone(520, 0.09, 'triangle', 0.052, 1.32);
        playTone(780, 0.12, 'sine', 0.04, 1.1, 0.055);
        return;
      }
      playTone(880, 0.045, 'sine', 0.035, 1.12);
      playTone(1175, 0.055, 'triangle', 0.026, 0.96, 0.036);
    },
    stomp() {
      if (!isUnlocked) return;
      playTone(180, 0.08, 'square', 0.058, 0.7);
      playTone(360, 0.08, 'triangle', 0.04, 1.28, 0.04);
      playNoise(0.08, 0.028, 0, 1200);
    },
    shieldBlock() {
      if (!isUnlocked) return;
      playTone(260, 0.11, 'sawtooth', 0.06, 0.78);
      playTone(520, 0.16, 'triangle', 0.045, 1.4, 0.035);
      playNoise(0.11, 0.03, 0, 2200);
    },
    danger(proximity = 1) {
      if (!isUnlocked) return;
      playTone(110 + proximity * 70, 0.055, 'square', 0.028 + proximity * 0.018, 0.72);
    },
    death(cause) {
      if (!isUnlocked) return;
      if (cause === 'enemy') {
        playTone(140, 0.18, 'sawtooth', 0.09, 0.42);
        playNoise(0.18, 0.055, 0.02, 760);
        return;
      }
      playTone(180, 0.16, 'triangle', 0.065, 0.54);
      playTone(92, 0.22, 'sawtooth', 0.045, 0.65, 0.09);
    },
    milestone() {
      if (!isUnlocked) return;
      playTone(392, 0.08, 'triangle', 0.052, 1.28);
      playTone(587.33, 0.1, 'triangle', 0.047, 1.18, 0.07);
      playTone(783.99, 0.13, 'sine', 0.042, 1.04, 0.145);
    },
    update(score, velY, enemyPressure) {
      currentScore = score;
      currentVelocity = velY;
      intensity = Math.max(0, Math.min(1, enemyPressure + Math.min(0.42, score / 2400)));
      if (!ctx || !isUnlocked) return;
      if (bgmGain) bgmGain.gain.setTargetAtTime(getBgmTargetVolume(), ctx.currentTime, 0.18);
      scheduleBgm();
    }
  };
})();

function getStored(k, def) {
  try {
    return localStorage.getItem(k) ?? def;
  } catch {
    return def;
  }
}

function setStored(k, val) {
  try {
    localStorage.setItem(k, String(val));
  } catch {}
}

function getNumber(k, def) {
  const n = Number(getStored(k, def));
  return Number.isFinite(n) ? n : def;
}

function submitAIGameShareScore(val) {
  try {
    window.AIGameShare?.submitScore?.('score', val, {
      playerName: 'Scribble Jumper',
      meta: {
        coins: world.coins,
        best: best,
        locale: locale,
        shield: Math.round(world.player.shield),
        height: getRunHeight(),
        landings: world.landings,
        stomps: world.stomps,
        shieldBlocks: world.shieldBlocks,
        cause: world.cause,
        duration: Math.round(world.time)
      }
    });
  } catch {}
}

function getDefaultLocale() {
  return /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
}

function t(k) {
  return STRINGS[locale][k];
}

function applyLanguage() {
  const S = STRINGS[locale];
  document.documentElement.lang = S.htmlLang;
  document.title = S.title;

  document.querySelector('.app')?.setAttribute('aria-label', S.appLabel);
  canvas.setAttribute('aria-label', S.canvasLabel);
  ui.menuSubtitle.textContent = S.menuSubtitle;
  startBtn.textContent = S.start;
  menuSettingsBtn.textContent = S.settings;
  ui.menuBestLabel.textContent = S.best;
  ui.menuControlLabel.textContent = S.control;
  ui.menuControlValue.textContent = 'A / D';
  ui.menuHint.textContent = S.menuHint;
  ui.pauseTitle.textContent = S.pause;
  ui.pauseSubtitle.textContent = S.pauseSubtitle;
  resumeBtn.textContent = S.resume;
  pauseSettingsBtn.textContent = S.settings;
  ui.gameOverTitle.textContent = S.gameOver;
  restartBtn.textContent = S.restart;
  ui.finalScoreLabel.textContent = S.runScore;
  ui.finalBestLabel.textContent = S.highScore;
  gameOverSettingsBtn.textContent = S.settings;
  ui.settingsTitle.textContent = S.settings;
  ui.languageLabel.textContent = S.language;
  ui.mobileLabel.textContent = S.mobile;
  ui.mobileLine1.textContent = S.mobileLine1;
  ui.mobileLine2.textContent = S.mobileLine2;
  ui.mobileLine3.textContent = S.mobileLine3;
  settingsDoneBtn.textContent = S.done;
  ui.touchLeftLabel.textContent = S.left;
  ui.touchRightLabel.textContent = S.right;
  runHintEl.textContent = S.runHint;

  langZhBtn.classList.toggle('active', locale === 'zh');
  langEnBtn.classList.toggle('active', locale === 'en');
  langZhBtn.setAttribute('aria-pressed', locale === 'zh' ? 'true' : 'false');
  langEnBtn.setAttribute('aria-pressed', locale === 'en' ? 'true' : 'false');

  setButtonSoundIcon();
  pauseBtn.setAttribute('aria-label', S.pauseAction);
  pauseBtn.title = S.pauseAction;
  settingsBtn.setAttribute('aria-label', S.settingsAction);
  settingsBtn.title = S.settingsAction;
  updateHud();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, tVal) {
  return a + (b - a) * tVal;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function syncViewport() {
  const vv = window.visualViewport;
  const vw = Math.max(280, vv?.width || window.innerWidth || document.documentElement.clientWidth || W);
  const vh = Math.max(460, vv?.height || window.innerHeight || document.documentElement.clientHeight || H);
  const gw = clamp(Math.min(vw - 24, (vh - 24) * W / H, W), 260, W);

  document.documentElement.style.setProperty('--visible-w', vw + 'px');
  document.documentElement.style.setProperty('--visible-h', vh + 'px');
  document.documentElement.style.setProperty('--game-w', gw + 'px');
}

function resize() {
  syncViewport();
  const rect = canvas.getBoundingClientRect();
  dpr = Math.min(2.5, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
}

function createWorld() {
  const platforms = [];
  const player = {
    x: W * 0.5,
    y: H - 128,
    vx: 0,
    vy: JUMP * 0.86,
    r: 20,
    squash: 0,
    facing: 1,
    blink: 0,
    shield: 0,
    shieldPulse: 0
  };

  platforms.push(makePlatform(W * 0.5 - 44, H - 76, 'normal'));
  let nextY = H - 150;
  while (nextY > -900) {
    platforms.push(makeGeneratedPlatform(nextY, platforms.at(-1), 0));
    nextY -= nextPlatformGap(0);
  }

  const pickups = [];
  for (let i = 2; i < platforms.length; i += 3) {
    const p = platforms[i];
    pickups.push(makePickup(p.x + p.w * 0.5 + rand(-10, 10), p.y - 38, i === 5 ? 'shield' : 'coin'));
  }

  return {
    player,
    platforms,
    enemies: [makeEnemy(H - 374, W * 0.48), makeEnemy(H - 710, W * 0.24)],
    particles: [],
    pickups,
    clouds: Array.from({ length: 14 }, () => ({
      x: rand(-80, W + 80),
      y: rand(-H, H),
      s: rand(0.7, 1.65),
      drift: rand(-7, 7)
    })),
    cameraY: 0,
    highestY: player.y,
    nextPlatformY: nextY,
    nextEnemyY: -980,
    score: 0,
    coins: 0,
    landings: 0,
    stomps: 0,
    shieldBlocks: 0,
    dangerPing: 0,
    enemyPressure: 0,
    nextMilestone: 500,
    cause: 'fall',
    flash: 0,
    shake: 0,
    time: 0,
    combo: 0
  };
}

function makePlatform(x, y, type = 'normal') {
  const def = PLATFORM[type] || PLATFORM.normal;
  return {
    type,
    x,
    y,
    baseX: x,
    w: def.w,
    h: def.h,
    phase: rand(0, Math.PI * 2),
    amp: rand(36, 92),
    speed: rand(0.75, 1.35),
    broken: false,
    breakT: 0,
    springBob: 0,
    cracks: Array.from({ length: 4 }, (_, i) => ({
      x: 13 + i * 16 + rand(-2, 3),
      dx: rand(-5, 6)
    }))
  };
}

function pickPlatformType(score) {
  const roll = Math.random();
  const diff = clamp(score / 2600, 0, 1);
  if (score > 160 && roll < 0.11 + diff * 0.05) return 'moving';
  if (score > 340 && roll < 0.18 + diff * 0.06) return 'crumble';
  if (score > 440 && roll < 0.29) return 'spring';
  return 'normal';
}

function nextPlatformGap(score) {
  const diff = clamp(score / 3200, 0, 1);
  return rand(58 + diff * 10, 82 + diff * 14);
}

function makeGeneratedPlatform(y, prevPlatform, score) {
  const type = pickPlatformType(score);
  const def = PLATFORM[type];
  const prevCenter = typeof prevPlatform === 'number' ? prevPlatform : (prevPlatform?.x ?? W * 0.42) + (prevPlatform?.w ?? PLATFORM.normal.w) * 0.5;
  const spread = clamp(94 + score * 0.01, 94, 142);
  const minX = 34;
  const maxX = W - 34;
  const pad = 22;
  const maxPlatX = W - def.w - 22;

  let targetX = clamp(prevCenter + rand(-spread, spread), minX, maxX);
  if (Math.abs(targetX - prevCenter) < 34) {
    targetX = clamp(targetX + choice([-1, 1]) * rand(38, 72), minX, maxX);
  }
  const posX = clamp(targetX - def.w * 0.5, pad, maxPlatX);
  return makePlatform(posX, y, type);
}

function makeEnemy(y, x = rand(56, W - 56)) {
  return {
    x,
    baseX: x,
    y,
    r: rand(26, 33),
    phase: rand(0, Math.PI * 2),
    amp: rand(34, 86),
    speed: rand(0.72, 1.22),
    dead: false,
    pop: 0
  };
}

function makePickup(x, y, type = Math.random() < 0.16 ? 'shield' : 'coin') {
  return {
    type,
    x: clamp(x, 34, W - 34),
    y,
    r: type === 'shield' ? 16 : 12,
    spin: rand(0, Math.PI * 2),
    taken: false,
    pop: 0
  };
}

function resetGame() {
  world = createWorld();
  setMode('playing');
  updateHud();
  AudioBus.startRun();
  runHintEl.classList.add('show');
  clearTimeout(runHintTimer);
  runHintTimer = setTimeout(() => runHintEl.classList.remove('show'), 5200);
}

function setMode(m) {
  mode = m;
  menuEl.classList.toggle('show', mode === 'menu');
  pauseMenuEl.classList.toggle('show', mode === 'paused');
  gameOverEl.classList.toggle('show', mode === 'gameover');
  settingsMenuEl.classList.toggle('show', mode === 'settings');
  if (mode !== 'playing') runHintEl.classList.remove('show');
  AudioBus.setMode(mode);
}

function togglePause() {
  if (mode === 'playing') {
    setMode('paused');
  } else if (mode === 'paused') {
    setMode('playing');
    lastTime = performance.now();
  }
}

function openSettings() {
  if (mode !== 'settings') settingsReturnMode = mode;
  setMode('settings');
}

function closeSettings() {
  const ret = settingsReturnMode || 'playing';
  setMode(ret);
  if (ret === 'playing') lastTime = performance.now();
}

function setLocale(l) {
  if (!STRINGS[l]) return;
  locale = l;
  setStored(LANGUAGE_KEY, locale);
  applyLanguage();
}

function getRunHeight() {
  return Math.max(0, Math.floor((H - 128 - world.highestY) / 10));
}

function updateHud() {
  const currentScore = Math.max(0, Math.floor(world.score));
  scoreEl.textContent = String(currentScore);
  bestEl.textContent = t('hud')(best, world.coins, world.player.shield > 0);
  menuBestEl.textContent = String(best);
}

function finishGame() {
  if (mode === 'gameover') return;
  const currentScore = Math.max(0, Math.floor(world.score));
  const height = getRunHeight();
  if (currentScore > best) {
    best = currentScore;
    setStored(STORAGE_KEY, best);
  }
  submitAIGameShareScore(currentScore);

  finalScoreEl.textContent = String(currentScore);
  finalBestEl.textContent = String(best);
  deathLineEl.textContent = choice(t('deaths'));
  runFactsEl.innerHTML = [
    `Height: ${height}m`,
    `Coins: ${world.coins}`,
    `Stomps: ${world.stomps}`,
    `Landings: ${world.landings}`
  ].map(s => `<span>${s}</span>`).join('');

  setMode('gameover');
  updateHud();
  AudioBus.death(world.cause);
}

function spawnBurst(x, y, color, count = 12, speed = 220) {
  for (let i = 0; i < count; i++) {
    const angle = rand(-Math.PI, 0);
    const s = rand(speed * 0.35, speed);
    world.particles.push({
      x,
      y,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s,
      life: rand(0.32, 0.75),
      max: 0.75,
      r: rand(2, 5),
      color
    });
  }
}

function getInputAxis() {
  let axis = 0;
  if (input.left) axis -= 1;
  if (input.right) axis += 1;
  if (input.pointerX !== null) {
    const delta = input.pointerX - world.player.x;
    axis += clamp(delta / 72, -1, 1);
  }
  return clamp(axis, -1, 1);
}

function update(dt) {
  world.time += dt;
  world.flash = Math.max(0, world.flash - dt * 3.6);
  world.shake = Math.max(0, world.shake - dt * 12);

  updatePlayer(dt);
  updatePlatforms(dt);
  updateEnemies(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateCamera();
  generateAhead();
  cleanupWorld();

  if (world.score > 180 || world.time > 6) {
    runHintEl.classList.remove('show');
  }

  if (world.score >= world.nextMilestone) {
    world.nextMilestone += 500;
    AudioBus.milestone();
  }

  AudioBus.update(getRunHeight(), Math.abs(world.player.vy), world.enemyPressure);
  updateHud();
}

function updatePlayer(dt) {
  const p = world.player;
  const prevY = p.y;
  const axis = getInputAxis();

  p.vx += axis * MOVE_ACCEL * dt;
  if (Math.abs(axis) < 0.05) {
    p.vx *= Math.pow(MOVE_DRAG, dt * 60);
  }
  p.vx = clamp(p.vx, -MAX_VX, MAX_VX);
  p.vy += GRAVITY * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;

  p.squash = Math.max(0, p.squash - dt * 7);
  p.shieldPulse = Math.max(0, p.shieldPulse - dt * 4);
  p.blink += dt;

  if (Math.abs(p.vx) > 12) {
    p.facing = Math.sign(p.vx);
  }

  // Screen wrap
  if (p.x < -p.r) p.x = W + p.r;
  if (p.x > W + p.r) p.x = -p.r;

  if (p.vy > 0) {
    collidePlatforms(prevY);
  }
  collidePickups();
  collideEnemies(prevY);

  world.highestY = Math.min(world.highestY, p.y);
  world.score = Math.max(world.score, (H - 128 - world.highestY) * 0.72);

  if (p.y - world.cameraY > H + 90) {
    finishGame();
  }
}

function collidePlatforms(prevY) {
  const p = world.player;
  const feetPrev = prevY + p.r * 0.92;
  const feetCur = p.y + p.r * 0.92;

  for (const plat of world.platforms) {
    if (plat.broken) continue;
    const isHorizOverlap = p.x + p.r * 0.62 > plat.x && p.x - p.r * 0.62 < plat.x + plat.w;
    const crossedTop = feetPrev <= plat.y + 4 && feetCur >= plat.y;
    const notTooLow = feetCur <= plat.y + plat.h + 16;

    if (!isHorizOverlap || !crossedTop || !notTooLow) continue;

    if (plat.type === 'crumble') {
      plat.broken = true;
      plat.breakT = 0.45;
      p.y = plat.y - p.r * 0.92;
      p.vy = JUMP * 0.9;
      p.squash = 0.48;
      world.shake = 4;
      spawnBurst(plat.x + plat.w * 0.5, plat.y + 6, COLORS.orange, 14, 230);
      AudioBus.land('crumble', world.combo);
      break;
    }

    const isSpring = plat.type === 'spring';
    p.y = plat.y - p.r * 0.92;
    p.vy = isSpring ? SUPER_JUMP : JUMP;
    p.squash = isSpring ? 1.0 : 0.62;
    plat.springBob = isSpring ? 1.0 : 0.35;
    world.combo += 1;
    world.landings += 1;
    world.flash = isSpring ? 1.0 : Math.max(world.flash, 0.35);

    spawnBurst(p.x, plat.y, isSpring ? COLORS.violet : COLORS.green, isSpring ? 16 : 8, isSpring ? 330 : 175);
    AudioBus.land(isSpring ? 'spring' : 'normal', world.combo);
    break;
  }
}

function collideEnemies(prevY) {
  const p = world.player;
  for (const e of world.enemies) {
    if (e.dead) continue;
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy);

    if (dist > p.r + e.r * 0.86) continue;

    const stompedFromAbove = prevY + p.r * 0.68 < e.y - e.r * 0.4;
    if (p.vy > 0 && stompedFromAbove) {
      e.dead = true;
      e.pop = 0.45;
      world.stomps += 1;
      world.cause = 'stomp';
      p.vy = JUMP * 0.92;
      p.squash = 0.9;
      world.score += 160;
      spawnBurst(e.x, e.y, COLORS.red, 20, 310);
      AudioBus.stomp();
    } else if (p.shield > 0) {
      p.shield -= 1;
      p.shieldPulse = 1.0;
      world.shieldBlocks += 1;
      e.dead = true;
      e.pop = 0.45;
      p.vy = JUMP * 0.72;
      world.shake = 7;
      world.score += 90;
      spawnBurst(e.x, e.y, COLORS.blue, 24, 330);
      AudioBus.shieldBlock();
    } else {
      world.cause = 'enemy';
      world.shake = 10;
      spawnBurst(p.x, p.y, COLORS.red, 24, 340);
      finishGame();
    }
  }
}

function collidePickups() {
  const p = world.player;
  for (const item of world.pickups) {
    if (item.taken) continue;
    const dist = Math.hypot(p.x - item.x, p.y - item.y);
    if (dist > p.r + item.r) continue;

    item.taken = true;
    item.pop = 0.32;
    if (item.type === 'shield') {
      p.shield = Math.min(2, p.shield + 1);
      p.shieldPulse = 1.0;
      world.score += 80;
      spawnBurst(item.x, item.y, COLORS.blue, 18, 250);
      AudioBus.pickup('shield');
    } else {
      world.coins += 1;
      world.score += 35;
      spawnBurst(item.x, item.y, COLORS.gold, 10, 180);
      AudioBus.pickup('coin');
    }
  }
}

function updatePlatforms(dt) {
  for (const plat of world.platforms) {
    plat.springBob = Math.max(0, plat.springBob - dt * 6);
    if (plat.type === 'moving' && !plat.broken) {
      plat.phase += plat.speed * dt * 2.3;
      plat.x = clamp(plat.baseX + Math.sin(plat.phase) * plat.amp, 16, W - plat.w - 16);
    }
    if (plat.broken) {
      plat.breakT -= dt;
    }
  }
}

function updateEnemies(dt) {
  world.dangerPing = Math.max(0, world.dangerPing - dt);
  world.enemyPressure = 0;

  for (const e of world.enemies) {
    if (e.dead) {
      e.pop -= dt;
      e.y += 260 * dt;
      continue;
    }
    e.phase += e.speed * dt * 2.1;
    e.x = clamp(e.baseX + Math.sin(e.phase) * e.amp, 34, W - 34);

    const dist = Math.hypot(e.x - world.player.x, e.y - world.player.y);
    const pressure = clamp((185 - dist) / 185, 0, 1);
    world.enemyPressure = Math.max(world.enemyPressure, pressure);

    if (dist < 145 && world.dangerPing <= 0) {
      world.dangerPing = 0.32;
      AudioBus.danger(pressure);
    }
  }
}

function updatePickups(dt) {
  for (const item of world.pickups) {
    item.spin += dt * (item.type === 'shield' ? 4.4 : 7.5);
    if (item.taken) {
      item.pop -= dt;
      item.y -= 70 * dt;
    }
  }
}

function updateParticles(dt) {
  for (const p of world.particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 980 * dt;
    p.vx *= Math.pow(0.985, dt * 60);
  }
}

function updateCamera() {
  const targetCamY = world.player.y - H * 0.39;
  if (targetCamY < world.cameraY) {
    world.cameraY = lerp(world.cameraY, targetCamY, 0.16);
  }
}

function generateAhead() {
  const aheadBound = world.cameraY - 180;
  while (world.nextPlatformY > aheadBound) {
    const prev = world.platforms.at(-1);
    const scoreVal = Math.max(0, Math.floor(world.score));
    world.nextPlatformY -= nextPlatformGap(scoreVal);
    const plat = makeGeneratedPlatform(world.nextPlatformY, prev, scoreVal);
    world.platforms.push(plat);

    if (Math.random() < 0.48) {
      world.pickups.push(makePickup(plat.x + plat.w * 0.5 + rand(-18, 18), plat.y - rand(34, 54)));
    }
  }

  while (world.nextEnemyY > aheadBound) {
    world.nextEnemyY -= rand(360, 560) - clamp(world.score * 0.012, 0, 130);
    if (world.score > 80 && Math.random() < 0.9) {
      world.enemies.push(makeEnemy(world.nextEnemyY));
    }
  }
}

function cleanupWorld() {
  const bottomCull = world.cameraY + H + 160;
  world.platforms = world.platforms.filter(p => p.y < bottomCull && p.breakT > -0.1);
  world.enemies = world.enemies.filter(e => e.y < bottomCull && e.pop > -0.1);
  world.pickups = world.pickups.filter(i => i.y < bottomCull && i.pop > -0.1);
  world.particles = world.particles.filter(p => p.life > 0);

  for (const c of world.clouds) {
    c.y += 0.24;
    c.x += c.drift * 0.004;
    if (c.y - world.cameraY > H + 110) {
      c.y = world.cameraY - rand(80, 220);
      c.x = rand(-80, W + 80);
      c.s = rand(0.7, 1.65);
    }
  }
}

function draw() {
  ctx.save();
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  ctx.clearRect(0, 0, W, H);

  drawPaper();

  const shakeX = world.shake ? rand(-world.shake, world.shake) : 0;
  const shakeY = world.shake ? rand(-world.shake, world.shake) : 0;

  ctx.translate(shakeX, shakeY - world.cameraY);

  drawClouds();

  for (const plat of world.platforms) drawPlatform(plat);
  for (const item of world.pickups) drawPickup(item);
  for (const enemy of world.enemies) drawEnemy(enemy);

  drawPlayer(world.player);
  drawParticles();

  ctx.restore();

  drawEnemyWarnings();
  drawVignette();

  if (world.flash > 0) {
    drawFlash(world.flash);
  }
}

function drawPaper() {
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 1;
  const gridOffsetY = -(world.cameraY * 0.35 % 26);
  for (let y = gridOffsetY; y < H; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = COLORS.redLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 0);
  ctx.lineTo(48, H);
  ctx.stroke();
}

function drawClouds() {
  ctx.save();
  for (const c of world.clouds) {
    drawCloud(c.x, c.y + world.cameraY * 0.18, c.s);
  }
  ctx.restore();
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
  ctx.strokeStyle = 'rgba(36, 48, 68, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-16, 8, 19, 10, -0.08, 0, Math.PI * 2);
  ctx.ellipse(2, 0, 24, 15, 0.04, 0, Math.PI * 2);
  ctx.ellipse(24, 9, 19, 10, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlatform(plat) {
  const def = PLATFORM[plat.type] || PLATFORM.normal;
  let posY = plat.y;
  let alpha = 1;

  if (plat.broken) {
    posY += (0.45 - plat.breakT) * 42;
    alpha = clamp(plat.breakT / 0.45, 0, 1);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(plat.x, posY);

  // Shadow
  ctx.fillStyle = COLORS.shadow;
  roundedRect(4, 8, plat.w, plat.h, 8);
  ctx.fill();

  // Base fill
  ctx.fillStyle = def.color;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  roundedRect(0, 0, plat.w, plat.h, 8);
  ctx.fill();
  ctx.stroke();

  // Platform top highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 4);
  ctx.quadraticCurveTo(plat.w * 0.5, 0, plat.w - 12, 5);
  ctx.stroke();

  if (plat.type === 'moving') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(plat.w * 0.38, 4);
    ctx.lineTo(plat.w * 0.5, 10);
    ctx.lineTo(plat.w * 0.62, 4);
    ctx.fill();
  }

  if (plat.type === 'crumble') {
    ctx.strokeStyle = def.dark;
    ctx.lineWidth = 2;
    for (const crack of plat.cracks) {
      ctx.beginPath();
      ctx.moveTo(crack.x, 3);
      ctx.lineTo(crack.x + crack.dx, 12);
      ctx.stroke();
    }
  }

  if (plat.type === 'spring') {
    const bob = plat.springBob * 8;
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(plat.w * 0.5 - 13, -3 - bob);
    ctx.lineTo(plat.w * 0.5 - 6, -13 - bob);
    ctx.lineTo(plat.w * 0.5 + 1, -3 - bob);
    ctx.lineTo(plat.w * 0.5 + 8, -13 - bob);
    ctx.lineTo(plat.w * 0.5 + 15, -3 - bob);
    ctx.stroke();

    ctx.fillStyle = COLORS.gold;
    roundedRect(plat.w * 0.5 - 18, -19 - bob, 36, 8, 4);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x, e.y);

  const scale = e.dead ? clamp(e.pop / 0.45, 0, 1) : 1 + Math.sin(world.time * 7 + e.phase) * 0.04;
  ctx.scale(scale, scale);

  ctx.strokeStyle = 'rgba(229, 77, 94, 0.34)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, e.r + 9 + Math.sin(world.time * 8 + e.phase) * 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = COLORS.shadow;
  ctx.beginPath();
  ctx.ellipse(4, e.r + 8, e.r * 0.9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.red;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, e.r * 1.05, e.r * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-7, -4, 5, 0, Math.PI * 2);
  ctx.arc(9, -5, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.ink;
  ctx.beginPath();
  ctx.arc(-5, -3, 2, 0, Math.PI * 2);
  ctx.arc(11, -4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Horns
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, -e.r * 0.48);
  ctx.lineTo(-24, -e.r * 0.98);
  ctx.lineTo(-5, -e.r * 0.66);
  ctx.moveTo(14, -e.r * 0.5);
  ctx.lineTo(24, -e.r * 0.98);
  ctx.lineTo(5, -e.r * 0.66);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-9, 9);
  ctx.quadraticCurveTo(0, 14, 10, 8);
  ctx.stroke();

  ctx.restore();
}

function drawPickup(item) {
  ctx.save();
  ctx.translate(item.x, item.y);

  const scale = item.taken ? clamp(item.pop / 0.32, 0, 1) : 1 + Math.sin(world.time * 5 + item.spin) * 0.08;
  ctx.globalAlpha = item.taken ? scale : 1;
  ctx.scale(scale, scale);

  if (item.type === 'shield') {
    ctx.fillStyle = 'rgba(47, 127, 247, 0.2)';
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = COLORS.paper2;
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(13, -2);
    ctx.quadraticCurveTo(8, 12, 0, 16);
    ctx.quadraticCurveTo(-8, 12, -13, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = COLORS.gold;
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 13 + Math.sin(item.spin) * 3, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-3, -4, 5, -2.8, -0.5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEnemyWarnings() {
  for (const e of world.enemies) {
    if (e.dead) continue;
    const screenY = e.y - world.cameraY;
    if (screenY >= 44 || screenY < -190) continue;

    const posX = clamp(e.x, 38, W - 38);
    const floatY = Math.sin(world.time * 10 + e.phase) * 3;

    ctx.save();
    ctx.translate(posX, 42 + floatY);
    ctx.fillStyle = COLORS.red;
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(-17, -8);
    ctx.lineTo(17, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, -1);
    ctx.restore();
  }
}

function drawPlayer(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.facing, 1);

  const sq = p.squash;
  ctx.scale(1 + sq * 0.12, 1 - sq * 0.1);

  if (p.shield > 0) {
    ctx.save();
    ctx.scale(p.facing, 1);
    ctx.globalAlpha = 0.35 + p.shieldPulse * 0.35;
    ctx.fillStyle = 'rgba(47, 127, 247, 0.22)';
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 34 + p.shieldPulse * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = COLORS.shadow;
  ctx.beginPath();
  ctx.ellipse(4 * p.facing, p.r + 15, 19, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Body
  ctx.fillStyle = '#fff4b7';
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 27, 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Face patch
  ctx.fillStyle = '#8fd0ff';
  ctx.beginPath();
  ctx.ellipse(3, -7, 12, 16, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  const isBlinking = Math.sin(p.blink * 2.4) > 0.985;
  if (isBlinking) {
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(5, -10);
    ctx.lineTo(15, -9);
    ctx.stroke();
  } else {
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(10, -10, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Legs
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-11, 18);
  ctx.lineTo(-18, 29);
  ctx.moveTo(11, 18);
  ctx.lineTo(19, 28);
  ctx.stroke();

  // Shoes
  ctx.fillStyle = COLORS.orange;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(18, 28, 10, 5, 0.15, 0, Math.PI * 2);
  ctx.ellipse(-18, 29, 10, 5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawParticles() {
  for (const p of world.particles) {
    ctx.save();
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawVignette() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  grad.addColorStop(1, 'rgba(36, 48, 68, 0.12)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawFlash(intensity) {
  ctx.save();
  ctx.globalAlpha = intensity * 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function roundedRect(x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
}

function frame(now) {
  const dt = Math.min(MAX_DT, (now - lastTime) / 1000 || 0);
  lastTime = now;
  if (mode === 'playing') update(dt);
  draw();
  requestAnimationFrame(frame);
}

function setButtonSoundIcon() {
  soundBtn.style.opacity = soundOn ? '1' : '0.55';
  soundBtn.setAttribute('aria-label', soundOn ? t('soundOn') : t('soundOff'));
  soundBtn.title = soundOn ? t('soundOn') : t('soundOff');
}

function canvasPointerX(e) {
  const rect = canvas.getBoundingClientRect();
  return (e.clientX - rect.left) / rect.width * W;
}

function onPointerDown(e) {
  AudioBus.resume();
  if (mode === 'settings') return;
  if (mode === 'menu' || mode === 'gameover') {
    resetGame();
    return;
  }
  if (mode === 'paused') {
    togglePause();
    return;
  }
  input.pointerId = e.pointerId;
  input.pointerX = canvasPointerX(e);
  canvas.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e) {
  if (input.pointerId === e.pointerId) {
    input.pointerX = canvasPointerX(e);
  }
}

function onPointerUp(e) {
  if (input.pointerId === e.pointerId) {
    input.pointerId = null;
    input.pointerX = null;
  }
}

function bindHold(elem, key) {
  const onDown = e => {
    e.preventDefault();
    AudioBus.resume();
    input[key] = true;
  };
  const onUp = e => {
    e.preventDefault();
    input[key] = false;
  };
  elem.addEventListener('pointerdown', onDown);
  elem.addEventListener('pointerup', onUp);
  elem.addEventListener('pointercancel', onUp);
  elem.addEventListener('pointerleave', onUp);
}

window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
window.visualViewport?.addEventListener('scroll', resize);

canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointercancel', onPointerUp);

bindHold(leftPad, 'left');
bindHold(rightPad, 'right');

window.addEventListener('keydown', e => {
  if (e.repeat) return;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    AudioBus.resume();
    input.left = true;
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    AudioBus.resume();
    input.right = true;
  }
  if (e.code === 'Space') {
    e.preventDefault();
    AudioBus.resume();
    if (mode === 'playing' || mode === 'paused') togglePause();
    else if (mode === 'menu' || mode === 'gameover') resetGame();
  }
  if (e.code === 'Escape') {
    if (mode === 'settings') closeSettings();
    else togglePause();
  }
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = false;
});

startBtn.addEventListener('click', () => {
  AudioBus.resume();
  resetGame();
});

restartBtn.addEventListener('click', () => {
  AudioBus.resume();
  resetGame();
});

resumeBtn.addEventListener('click', () => {
  AudioBus.resume();
  togglePause();
});

pauseBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  togglePause();
});

soundBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  soundOn = !soundOn;
  AudioBus.setSound(soundOn);
  setButtonSoundIcon();
});

settingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  openSettings();
});

menuSettingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  openSettings();
});

pauseSettingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  openSettings();
});

gameOverSettingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  AudioBus.resume();
  openSettings();
});

settingsDoneBtn.addEventListener('click', e => {
  e.stopPropagation();
  closeSettings();
});

langZhBtn.addEventListener('click', () => setLocale('zh'));
langEnBtn.addEventListener('click', () => setLocale('en'));

document.addEventListener('visibilitychange', () => {
  if (document.hidden && mode === 'playing') {
    togglePause();
  }
});

// Init
applyLanguage();
resize();
setMode('menu');
requestAnimationFrame(frame);