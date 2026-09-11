/**
 * Game Template — Core Game Loop & State Machine
 */

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = 'BOOT'; // BOUT, MENU, PLAYING, PAUSED, GAMEOVER

        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem(window.GAME_CONFIG.STORAGE_KEY_HIGHSCORE) || '0', 10);

        this.lastTime = 0;
        this.player = null;

        this.initCanvas();
        this.bindEvents();
        this.updateHUD();
    }

    initCanvas() {
        const { BASE_WIDTH, BASE_HEIGHT } = window.GAME_CONFIG;
        this.canvas.width = BASE_WIDTH;
        this.canvas.height = BASE_HEIGHT;
        this.player = new window.Player(BASE_WIDTH / 2, BASE_HEIGHT - 120);
    }

    bindEvents() {
        // UI Buttons
        document.getElementById('btn-start').onclick = () => this.startGame();
        document.getElementById('btn-restart').onclick = () => this.startGame();
        document.getElementById('btn-pause').onclick = () => this.togglePause();
        document.getElementById('btn-resume').onclick = () => this.togglePause();

        const btnSound = document.getElementById('btn-sound');
        btnSound.onclick = () => {
            const isMuted = window.audioManager.toggleMute();
            btnSound.textContent = isMuted ? '🔇' : '🔊';
        };
        btnSound.textContent = window.audioManager.muted ? '🔇' : '🔊';

        document.getElementById('btn-back').onclick = () => {
            window.parent.postMessage('backToMenu', '*');
            if (window === window.top) {
                window.location.href = '../index.html';
            }
        };

        // Pointer Controls (Touch & Mouse)
        const handlePointer = (e) => {
            if (this.state !== 'PLAYING') return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const canvasX = (clientX - rect.left) * scaleX;
            this.player.setTarget(canvasX);
        };

        this.canvas.addEventListener('mousemove', handlePointer);
        this.canvas.addEventListener('touchmove', handlePointer, { passive: false });
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handlePointer(e);
        }, { passive: false });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (this.state !== 'PLAYING') return;
            const step = 40;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.player.setTarget(this.player.targetX - step);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.player.setTarget(this.player.targetX + step);
            } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
    }

    startGame() {
        this.score = 0;
        this.state = 'PLAYING';
        window.particleSystem.clear();
        this.player.x = this.canvas.width / 2;
        this.player.targetX = this.canvas.width / 2;

        this.hideOverlay('overlay-start');
        this.hideOverlay('overlay-gameover');
        this.hideOverlay('overlay-pause');
        this.updateHUD();

        window.audioManager.play('click');
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.showOverlay('overlay-pause');
            window.audioManager.play('click');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.hideOverlay('overlay-pause');
            window.audioManager.play('click');
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        window.audioManager.play('gameover');

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem(window.GAME_CONFIG.STORAGE_KEY_HIGHSCORE, this.bestScore.toString());
        }

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-best').textContent = this.bestScore;
        this.showOverlay('overlay-gameover');
        this.updateHUD();
    }

    addScore(points = 10) {
        this.score += points;
        window.audioManager.play('score');
        window.particleSystem.emit(this.player.x, this.player.y, window.GAME_CONFIG.COLORS.ACCENT, 8);
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('score-val').textContent = this.score;
        document.getElementById('best-val').textContent = this.bestScore;
    }

    showOverlay(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('hidden');
            requestAnimationFrame(() => el.classList.add('active'));
        }
    }

    hideOverlay(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            setTimeout(() => el.classList.add('hidden'), 250);
        }
    }

    loop(timestamp) {
        if (this.state !== 'PLAYING') return;

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.player.update(dt);
        window.particleSystem.update(dt);
    }

    render() {
        const { width, height } = this.canvas;
        this.ctx.fillStyle = window.GAME_CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, width, height);

        // Grid/Background Accents
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        this.player.render(this.ctx);
        window.particleSystem.render(this.ctx);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
});
