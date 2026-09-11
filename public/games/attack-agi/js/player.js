/**
 * Attack AGI — First-Person Player Controller (Desktop + Mobile)
 */

class PlayerController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.cfg = window.AGI_CONFIG.PLAYER;
        this.health = this.cfg.MAX_HEALTH;
        this.alive = true;

        // Position & Velocity
        this.position = new THREE.Vector3(0, this.cfg.HEIGHT, 15);
        this.velocity = new THREE.Vector3();
        this.isGrounded = true;

        // Mouse Look (Euler pitch/yaw)
        this.yaw = 0;
        this.pitch = 0;
        this.sensitivity = 0.0022;

        // Input state
        this.keys = {};
        this.isLocked = false;
        this.isDodging = false;
        this.dodgeTimer = 0;
        this.dodgeCooldownTimer = 0;

        // Mobile touch state
        this.touchMove = { x: 0, y: 0 };
        this.isFiring = false;

        this.initControls();
    }

    initControls() {
        // Desktop Pointer Lock
        document.addEventListener('pointerlockchange', () => {
            this.isLocked = (document.pointerLockElement === this.domElement);
        });

        this.domElement.addEventListener('click', () => {
            if (!this.isLocked && this.alive) {
                this.domElement.requestPointerLock();
            }
        });

        // Mouse Move
        document.addEventListener('mousemove', (e) => {
            if (!this.isLocked) return;
            this.yaw -= e.movementX * this.sensitivity;
            this.pitch -= e.movementY * this.sensitivity;
            this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
        });

        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.triggerDodge();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    triggerDodge() {
        if (this.dodgeCooldownTimer > 0 || this.isDodging || !this.isGrounded) return;
        this.isDodging = true;
        this.dodgeTimer = this.cfg.DODGE_DURATION;
        this.dodgeCooldownTimer = this.cfg.DODGE_COOLDOWN;
        window.audioManager.play('throw');
    }

    takeDamage(amount) {
        if (!this.alive) return;
        this.health -= amount;
        window.audioManager.play('player_hit');

        // Screen flash red
        const flash = document.getElementById('damage-flash');
        if (flash) {
            flash.classList.remove('active');
            void flash.offsetWidth;
            flash.classList.add('active');
        }

        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    update(dt, obstacles) {
        if (!this.alive) return;

        if (this.dodgeCooldownTimer > 0) {
            this.dodgeCooldownTimer -= dt;
        }

        if (this.isDodging) {
            this.dodgeTimer -= dt;
            if (this.dodgeTimer <= 0) {
                this.isDodging = false;
            }
        }

        // Camera Orientation
        const quatYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        const quatPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
        this.camera.quaternion.copy(quatYaw).multiply(quatPitch);

        // Movement Direction
        const moveDir = new THREE.Vector3();
        if (this.keys['KeyW'] || this.keys['ArrowUp'] || this.touchMove.y > 0.2) moveDir.z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown'] || this.touchMove.y < -0.2) moveDir.z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft'] || this.touchMove.x < -0.2) moveDir.x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight'] || this.touchMove.x > 0.2) moveDir.x += 1;

        moveDir.normalize();
        moveDir.applyQuaternion(quatYaw);

        const currentSpeed = this.isDodging ? this.cfg.DODGE_SPEED : this.cfg.MOVE_SPEED;

        // Apply Horizontal Movement
        this.position.x += moveDir.x * currentSpeed * dt;
        this.position.z += moveDir.z * currentSpeed * dt;

        // Jump & Gravity
        if ((this.keys['Space']) && this.isGrounded && !this.isDodging) {
            this.velocity.y = this.cfg.JUMP_FORCE;
            this.isGrounded = false;
        }

        if (!this.isGrounded) {
            this.velocity.y -= this.cfg.GRAVITY * dt;
            this.position.y += this.velocity.y * dt;

            if (this.position.y <= this.cfg.HEIGHT) {
                this.position.y = this.cfg.HEIGHT;
                this.velocity.y = 0;
                this.isGrounded = true;
            }
        }

        // Arena Boundaries Collision
        const halfSize = (window.AGI_CONFIG.ARENA.SIZE / 2) - this.cfg.RADIUS - 0.5;
        this.position.x = Math.max(-halfSize, Math.min(halfSize, this.position.x));
        this.position.z = Math.max(-halfSize, Math.min(halfSize, this.position.z));

        // Obstacles Collision
        obstacles.forEach(obs => {
            const dist = Math.hypot(this.position.x - obs.x, this.position.z - obs.z);
            const minDist = obs.radius + this.cfg.RADIUS;
            if (dist < minDist) {
                const pushAngle = Math.atan2(this.position.z - obs.z, this.position.x - obs.x);
                this.position.x = obs.x + Math.cos(pushAngle) * minDist;
                this.position.z = obs.z + Math.sin(pushAngle) * minDist;
            }
        });

        // Sync Camera
        this.camera.position.copy(this.position);
    }
}

window.PlayerController = PlayerController;
