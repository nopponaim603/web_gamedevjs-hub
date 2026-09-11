/**
 * Dice Quest — Web Audio SFX Engine
 */

class DiceAudioManager {
    constructor() {
        this.ctx = null;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not available');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        this.resume();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'roll') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'buy') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'bad') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'win') {
                [523, 659, 784, 1047, 1319].forEach((f, i) => {
                    const o2 = this.ctx.createOscillator();
                    const g2 = this.ctx.createGain();
                    o2.type = 'sine';
                    o2.connect(g2);
                    g2.connect(this.ctx.destination);
                    o2.frequency.setValueAtTime(f, now + i * 0.12);
                    g2.gain.setValueAtTime(0.12, now + i * 0.12);
                    g2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
                    o2.start(now + i * 0.12);
                    o2.stop(now + i * 0.12 + 0.35);
                });
            }
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }
}

window.DiceAudioManager = DiceAudioManager;
window.audioManager = new DiceAudioManager();
