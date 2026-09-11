/**
 * Attack AGI — Core Game Controller & Lifecycle Engine
 */

class AttackAGIGame {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER, VICTORY

        this.score = 0;
        this.highscore = parseInt(localStorage.getItem(window.AGI_CONFIG.STORAGE_KEY_HIGHSCORE) || '0', 10);
        this.waveIndex = 0;

        this.lastTime = performance.now();

        this.initThree();
        this.initComponents();
        this.bindEvents();
        this.updateHUD();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => this.onResize());
    }

    initComponents() {
        this.particleMgr = new window.ParticleManager(this.scene);
        this.world = new window.WorldBuilder(this.scene);
        this.world.build();

        this.player = new window.PlayerController(this.camera, this.renderer.domElement);
        this.weapons = new window.WeaponManager(this.camera, this.scene, this.particleMgr);
        this.enemyMgr = new window.EnemyManager(this.scene, this.particleMgr);

        this.scene.add(this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    bindEvents() {
        // UI Buttons
        document.getElementById('btn-engage').onclick = () => this.startGame();
        document.getElementById('btn-restart').onclick = () => this.startGame();
        document.getElementById('btn-resume').onclick = () => this.togglePause();

        const btnSound = document.getElementById('sound-toggle-btn');
        if (btnSound) {
            btnSound.onclick = () => {
                const isMuted = window.audioManager.toggleMute();
                btnSound.textContent = isMuted ? '🔇' : '🔊';
            };
            btnSound.textContent = window.audioManager.muted ? '🔇' : '🔊';
        }

        const backBtn = document.getElementById('hub-back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                window.parent.postMessage('backToMenu', '*');
                if (window === window.top) {
                    window.location.href = '../index.html';
                }
            };
        }

        // Weapon hotkeys (1, 2, 3) & Reload (R)
        window.addEventListener('keydown', (e) => {
            if (this.state !== 'PLAYING') return;

            if (e.code === 'Digit1') this.weapons.switchWeapon(0);
            if (e.code === 'Digit2') this.weapons.switchWeapon(1);
            if (e.code === 'Digit3') this.weapons.switchWeapon(2);
            if (e.code === 'KeyR') this.weapons.reload();
            if (e.code === 'Escape') this.togglePause();
        });

        // Mouse Shoot
        window.addEventListener('mousedown', (e) => {
            if (this.state !== 'PLAYING' || !this.player.isLocked) return;
            if (e.button === 0) {
                this.handleFire();
            }
        });

        // Mobile Weapon Select Cards
        document.querySelectorAll('.weapon-slot-card').forEach((card, idx) => {
            card.onclick = () => {
                if (this.state === 'PLAYING') {
                    this.weapons.switchWeapon(idx);
                }
            };
        });

        // Mobile Action Buttons
        const btnFire = document.getElementById('mobile-fire-btn');
        if (btnFire) {
            btnFire.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleFire();
            }, { passive: false });
        }

        const btnDodge = document.getElementById('mobile-dodge-btn');
        if (btnDodge) {
            btnDodge.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.player.triggerDodge();
            }, { passive: false });
        }

        const btnReload = document.getElementById('mobile-reload-btn');
        if (btnReload) {
            btnReload.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.weapons.reload();
            }, { passive: false });
        }
    }

    handleFire() {
        const hits = this.weapons.shoot(this.enemyMgr.enemies);
        hits.forEach(({ enemy, damage }) => {
            enemy.takeDamage(damage);
        });
        this.updateHUD();
    }

    startGame() {
        this.score = 0;
        this.waveIndex = 0;
        this.state = 'PLAYING';

        this.player.health = window.AGI_CONFIG.PLAYER.MAX_HEALTH;
        this.player.alive = true;
        this.player.position.set(0, window.AGI_CONFIG.PLAYER.HEIGHT, 15);
        this.player.velocity.set(0, 0, 0);

        this.particleMgr.clear();
        this.enemyMgr.clear();
        this.enemyMgr.startWave(0);

        this.hideOverlay('overlay-title');
        this.hideOverlay('overlay-gameover');
        this.hideOverlay('overlay-pause');
        document.getElementById('hud-layer').classList.remove('hidden');

        // Request Pointer Lock on desktop
        if (window.matchMedia('(pointer: fine)').matches) {
            this.renderer.domElement.requestPointerLock();
        }

        window.audioManager.play('rifle');
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            if (document.exitPointerLock) document.exitPointerLock();
            this.showOverlay('overlay-pause');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.hideOverlay('overlay-pause');
            if (window.matchMedia('(pointer: fine)').matches) {
                this.renderer.domElement.requestPointerLock();
            }
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        if (document.exitPointerLock) document.exitPointerLock();
        window.audioManager.play('gameover');

        if (this.score > this.highscore) {
            this.highscore = this.score;
            localStorage.setItem(window.AGI_CONFIG.STORAGE_KEY_HIGHSCORE, this.highscore.toString());
        }

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-best').textContent = this.highscore;
        document.getElementById('final-wave').textContent = (this.waveIndex + 1);

        this.showOverlay('overlay-gameover');
    }

    nextWave() {
        this.waveIndex++;
        window.audioManager.play('wave_clear');

        if (this.waveIndex < window.AGI_CONFIG.WAVES.length) {
            this.enemyMgr.startWave(this.waveIndex);
            this.showWaveNotice(`WAVE ${this.waveIndex + 1} ENGAGING!`);
        } else {
            // Endless loop with increased enemies
            this.enemyMgr.startWave(this.waveIndex);
            this.showWaveNotice(`OVERLOAD WAVE ${this.waveIndex + 1}!`);
        }
        this.updateHUD();
    }

    showWaveNotice(text) {
        const notice = document.getElementById('wave-notice');
        if (notice) {
            notice.textContent = text;
            notice.classList.add('active');
            setTimeout(() => notice.classList.remove('active'), 2500);
        }
    }

    updateHUD() {
        // Health Bar
        const hpFill = document.getElementById('hp-fill');
        const hpText = document.getElementById('hp-text');
        if (hpFill) hpFill.style.width = `${Math.max(0, this.player.health)}%`;
        if (hpText) hpText.textContent = `${Math.ceil(this.player.health)} / 100`;

        // Ammo Counter
        const ammoVal = document.getElementById('ammo-val');
        const ammoMax = document.getElementById('ammo-max');
        if (ammoVal) ammoVal.textContent = this.weapons.currentAmmo;
        if (ammoMax) ammoMax.textContent = `/ ${this.weapons.current.magSize}`;

        // Score & Wave
        const scoreVal = document.getElementById('hud-score');
        const waveVal = document.getElementById('hud-wave');
        if (scoreVal) scoreVal.textContent = this.score;
        if (waveVal) waveVal.textContent = `WAVE ${this.waveIndex + 1}`;

        // Weapon Slots Active State
        document.querySelectorAll('.weapon-slot-card').forEach((card, idx) => {
            if (idx === this.weapons.currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
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

        // 1. Update Player
        this.player.update(dt, this.world.obstacles);

        // 2. Update Weapons
        this.weapons.update(dt, this.enemyMgr.enemies);

        // 3. Update Enemies
        this.enemyMgr.update(
            dt,
            this.player.position,
            this.world.obstacles,
            (damage) => {
                this.player.takeDamage(damage);
                this.updateHUD();
                if (!this.player.alive) {
                    this.gameOver();
                }
            },
            (points) => {
                this.score += points;
                this.updateHUD();
            }
        );

        // 4. Update Particles & FX
        this.particleMgr.update(dt);

        // 5. Check Wave Completion
        if (this.enemyMgr.isWaveComplete()) {
            this.nextWave();
        }

        // 6. Render 3D Frame
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.attackAGI = new AttackAGIGame();
});
