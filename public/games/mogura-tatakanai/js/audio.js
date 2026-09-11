/**
 * Mogura Tatakanai — Web Audio Synthesizer & BGM Engine
 */

class MoguraAudioManager {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem(window.MOGURA_CONFIG.STORAGE_KEY_MUTED) === 'true';
        this.bgmTracks = window.MOGURA_CONFIG.BGM_TRACKS;
        this.currentBgmIndex = 0;
        this.currentBgmAudio = null;
        this.isBgmStarted = false;

        this.initVisibilityListener();
    }

    initAudio() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSound(type) {
        if (this.muted) return;
        this.initAudio();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'button') {
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(783.99, now + 0.05);
            gain2.gain.setValueAtTime(0.001, now);
            gain2.gain.setValueAtTime(0.2, now + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc2.start(now + 0.05);
            osc2.stop(now + 0.2);
        } else if (type === 'normal') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(840, now + 0.18);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
        } else if (type === 'gold') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1860, now + 0.28);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
            osc.start(now);
            osc.stop(now + 0.28);
        } else if (type === 'black') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(170, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.26);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.26);
            osc.start(now);
            osc.stop(now + 0.26);
        } else if (type === 'white') {
            const notes = [1046.50, 1318.51, 1567.98, 2093.00];
            notes.forEach((freq, i) => {
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + i * 0.06);
                g.gain.setValueAtTime(0.001, now);
                g.gain.setValueAtTime(0.2, now + i * 0.06);
                g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);
                o.connect(g);
                g.connect(this.ctx.destination);
                o.start(now + i * 0.06);
                o.stop(now + i * 0.06 + 0.42);
            });
        } else if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(560, now + 0.09);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.09);
            osc.start(now);
            osc.stop(now + 0.09);
        } else if (type === 'descend') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(460, now);
            osc.frequency.exponentialRampToValueAtTime(210, now + 0.11);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.11);
            osc.start(now);
            osc.stop(now + 0.11);
        } else if (type === 'count_tick') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.45, now + 0.004);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);

            const oscHigh = this.ctx.createOscillator();
            const gainHigh = this.ctx.createGain();
            oscHigh.type = 'sine';
            oscHigh.frequency.setValueAtTime(1760, now);
            gainHigh.gain.setValueAtTime(0.001, now);
            gainHigh.gain.linearRampToValueAtTime(0.45, now + 0.004);
            gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            oscHigh.connect(gainHigh);
            gainHigh.connect(this.ctx.destination);
            oscHigh.start(now);
            oscHigh.stop(now + 0.04);
        } else if (type === 'count_finish') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.5, now);
            osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.18);
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.start(now);
            osc.stop(now + 0.28);

            const oscHigh = this.ctx.createOscillator();
            const gainHigh = this.ctx.createGain();
            oscHigh.type = 'triangle';
            oscHigh.frequency.setValueAtTime(2093.0, now);
            oscHigh.frequency.exponentialRampToValueAtTime(2637.0, now + 0.18);
            gainHigh.gain.setValueAtTime(0.45, now);
            gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            oscHigh.connect(gainHigh);
            gainHigh.connect(this.ctx.destination);
            oscHigh.start(now);
            oscHigh.stop(now + 0.32);
        }
    }

    playCurrentBgm() {
        if (!this.isBgmStarted) return;
        if (this.currentBgmAudio) {
            this.currentBgmAudio.pause();
            this.currentBgmAudio.onended = null;
        }
        this.currentBgmAudio = new Audio(this.bgmTracks[this.currentBgmIndex]);
        this.currentBgmAudio.volume = 0.7;
        this.currentBgmAudio.muted = this.muted;
        this.currentBgmAudio.onended = () => {
            this.currentBgmIndex = 1 - this.currentBgmIndex;
            this.playCurrentBgm();
        };
        this.currentBgmAudio.play().catch(() => {});
    }

    startBgm() {
        if (this.isBgmStarted && this.currentBgmAudio && !this.currentBgmAudio.paused) return;
        this.isBgmStarted = true;
        if (!this.currentBgmAudio || this.currentBgmAudio.paused) {
            if (!this.currentBgmAudio) {
                this.currentBgmIndex = Math.floor(Math.random() * this.bgmTracks.length);
            }
            this.playCurrentBgm();
        }
    }

    stopBgm() {
        this.isBgmStarted = false;
        if (this.currentBgmAudio) {
            this.currentBgmAudio.pause();
            this.currentBgmAudio.currentTime = 0;
            this.currentBgmAudio.onended = null;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem(window.MOGURA_CONFIG.STORAGE_KEY_MUTED, this.muted);
        if (this.currentBgmAudio) {
            this.currentBgmAudio.muted = this.muted;
        }
        return this.muted;
    }

    initVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.currentBgmAudio && !this.currentBgmAudio.paused) {
                    this.currentBgmAudio.pause();
                }
            } else {
                if (this.isBgmStarted && this.currentBgmAudio && this.currentBgmAudio.paused) {
                    this.currentBgmAudio.play().catch(() => {});
                }
            }
        });
    }
}

window.moguraAudio = new MoguraAudioManager();
