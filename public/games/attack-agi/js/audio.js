/**
 * Attack AGI — Web Audio API Synthesizer Engine
 */

class AGIAudioManager {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem(window.AGI_CONFIG.STORAGE_KEY_MUTED) === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            switch (type) {
                case 'rifle': {
                    // Laser/Pulse rifle crack
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                }

                case 'shotgun': {
                    // Heavy explosive blast
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(280, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                    osc.start(now);
                    osc.stop(now + 0.22);
                    break;
                }

                case 'throw': {
                    // Molotov whoosh
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.linearRampToValueAtTime(500, now + 0.15);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                    osc.start(now);
                    osc.stop(now + 0.18);
                    break;
                }

                case 'burn': {
                    // Sizzling fire crackle
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(140, now);
                    osc.frequency.setValueAtTime(220, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
                }

                case 'hitmarker': {
                    // High pitch ding
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1400, now);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                    osc.start(now);
                    osc.stop(now + 0.04);
                    break;
                }

                case 'explosion': {
                    // Deep shockwave
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(120, now);
                    osc.frequency.linearRampToValueAtTime(30, now + 0.35);
                    gain.gain.setValueAtTime(0.35, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                    break;
                }

                case 'player_hit': {
                    // Damage grunt/thud
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.12);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                }

                case 'reload': {
                    // Tech click clack
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.setValueAtTime(880, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                }

                case 'wave_clear': {
                    // Victory chime
                    [523, 659, 784, 1046].forEach((freq, idx) => {
                        const o = this.ctx.createOscillator();
                        const g = this.ctx.createGain();
                        o.connect(g);
                        g.connect(this.ctx.destination);
                        o.type = 'sine';
                        o.frequency.setValueAtTime(freq, now + idx * 0.08);
                        g.gain.setValueAtTime(0.15, now + idx * 0.08);
                        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
                        o.start(now + idx * 0.08);
                        o.stop(now + idx * 0.08 + 0.25);
                    });
                    break;
                }

                case 'gameover': {
                    // Power down descending tone
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.7);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                    osc.start(now);
                    osc.stop(now + 0.7);
                    break;
                }
            }
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem(window.AGI_CONFIG.STORAGE_KEY_MUTED, this.muted);
        return this.muted;
    }
}

window.audioManager = new AGIAudioManager();
