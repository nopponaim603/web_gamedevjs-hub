/**
 * FOOL THE GAME — Audio & Haptics Engine
 * Web Audio API synthesized sound effects & tactile feedback
 */

class SoundHapticEngine {
  constructor() {
    this.ctx = null;
    this.initAudio();
  }

  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  vibrate(pattern) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1, pitchShift = 0) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq + pitchShift, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playCardSwish() {
    this.playTone(350, 'triangle', 0.08, 0.08);
    this.vibrate(5);
  }

  playCardDrop() {
    this.playTone(180, 'sine', 0.12, 0.2);
    this.vibrate(20);
  }

  playButtonClick() {
    this.playTone(520, 'sine', 0.06, 0.15);
    this.vibrate(10);
  }

  playTakeCards() {
    this.playTone(220, 'sawtooth', 0.2, 0.12);
    this.vibrate([30, 40, 30]);
  }

  playDiscard() {
    this.playTone(440, 'triangle', 0.15, 0.15);
    this.vibrate(15);
  }

  playCoinSound(pitchIndex = 0) {
    const baseFreq = 800;
    this.playTone(baseFreq + pitchIndex * 60, 'sine', 0.1, 0.12);
  }

  playWinFanfare() {
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.15), i * 120);
    });
    this.vibrate([50, 50, 50, 100]);
  }
}

window.SoundHapticEngine = SoundHapticEngine;
