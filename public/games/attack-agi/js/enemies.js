/**
 * Attack AGI — Enemy Horde AI & Wave Spawner
 */

class Enemy {
    constructor(scene, typeKey, spawnPos) {
        this.scene = scene;
        this.config = window.AGI_CONFIG.ENEMIES[typeKey];
        this.typeKey = typeKey;

        this.hp = this.config.hp;
        this.maxHp = this.config.hp;
        this.alive = true;
        this.speed = this.config.speed;
        this.damage = this.config.damage;
        this.attackCooldown = 0;

        this.mesh = this.createMesh();
        this.mesh.position.copy(spawnPos);
        this.scene.add(this.mesh);
    }

    createMesh() {
        const group = new THREE.Group();
        const scale = this.config.scale;

        if (this.typeKey === 'DRONE') {
            // Floating octagonal orb with spinning rotor ring
            const coreGeo = new THREE.OctahedronGeometry(0.8 * scale, 1);
            const coreMat = new THREE.MeshStandardMaterial({
                color: 0xef4444,
                emissive: 0xb91c1c,
                emissiveIntensity: 0.6,
                metalness: 0.8,
                roughness: 0.2
            });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);

            const ringGeo = new THREE.TorusGeometry(1.2 * scale, 0.08, 8, 24);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotateX(Math.PI / 2);
            group.add(ring);
            this.rotor = ring;
        } else if (this.typeKey === 'STALKER') {
            // Quadruped cyber hound / raptor bot
            const bodyGeo = new THREE.BoxGeometry(1.2 * scale, 0.6 * scale, 1.8 * scale);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.5 * scale;
            group.add(body);

            const eyeGeo = new THREE.SphereGeometry(0.2 * scale, 8, 8);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(0, 0.6 * scale, -0.9 * scale);
            group.add(eye);
        } else if (this.typeKey === 'ENFORCER') {
            // Heavy armored mech biped
            const torsoGeo = new THREE.BoxGeometry(1.8 * scale, 2.2 * scale, 1.4 * scale);
            const torsoMat = new THREE.MeshStandardMaterial({ color: 0x6d28d9, emissive: 0x4c1d95, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 });
            const torso = new THREE.Mesh(torsoGeo, torsoMat);
            torso.position.y = 1.6 * scale;
            group.add(torso);

            const cannonGeo = new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 2.0 * scale);
            cannonGeo.rotateX(Math.PI / 2);
            const cannonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
            const cannon = new THREE.Mesh(cannonGeo, cannonMat);
            cannon.position.set(1.1 * scale, 1.6 * scale, -0.6 * scale);
            group.add(cannon);
        } else {
            // BOSS: AGI Core Sentinel (Giant glowing fractal sphere)
            const bossGeo = new THREE.IcosahedronGeometry(2.5, 2);
            const bossMat = new THREE.MeshStandardMaterial({
                color: 0x06b6d4,
                emissive: 0x0891b2,
                emissiveIntensity: 0.8,
                wireframe: true
            });
            const boss = new THREE.Mesh(bossGeo, bossMat);
            boss.position.y = 3.5;
            group.add(boss);
        }

        group.castShadow = true;
        return group;
    }

    containsMesh(target) {
        let match = false;
        this.mesh.traverse(child => {
            if (child === target) match = true;
        });
        return match;
    }

    takeDamage(amount) {
        if (!this.alive) return;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    update(dt, playerPos, obstacles, onPlayerHit) {
        if (!this.alive) return;

        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }

        if (this.rotor) {
            this.rotor.rotation.z += 15 * dt;
        }

        // Move towards player
        const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
        if (this.config.isFlying) {
            dir.y = (this.config.altitude || 2.0) - this.mesh.position.y;
        } else {
            dir.y = 0;
        }

        const dist = dir.length();
        dir.normalize();

        // Rotate facing direction
        this.mesh.lookAt(playerPos.x, this.config.isFlying ? this.mesh.position.y : playerPos.y, playerPos.z);

        // Move
        if (dist > 1.8) {
            this.mesh.position.addScaledVector(dir, this.speed * dt);
        } else {
            // Attack player
            if (this.attackCooldown <= 0) {
                this.attackCooldown = 1.0;
                onPlayerHit(this.damage);
            }
        }

        // Clamp to ground if not flying
        if (!this.config.isFlying) {
            this.mesh.position.y = 0;
        }
    }

    destroy() {
        this.scene.remove(this.mesh);
    }
}

class EnemyManager {
    constructor(scene, particleMgr) {
        this.scene = scene;
        this.particleMgr = particleMgr;
        this.enemies = [];
        this.waveIndex = 0;
        this.spawnTimer = 0;
        this.enemiesRemainingToSpawn = 0;
        this.isWaveActive = false;
    }

    get currentWave() {
        return window.AGI_CONFIG.WAVES[Math.min(this.waveIndex, window.AGI_CONFIG.WAVES.length - 1)];
    }

    startWave(index) {
        this.waveIndex = index;
        const wave = this.currentWave;
        this.enemiesRemainingToSpawn = wave.count;
        this.spawnTimer = 0;
        this.isWaveActive = true;
    }

    spawnSingleEnemy() {
        const wave = this.currentWave;
        const typeKey = wave.types[Math.floor(Math.random() * wave.types.length)];

        // Spawn around perimeter boundary
        const arenaRadius = (window.AGI_CONFIG.ARENA.SIZE / 2) - 4;
        const angle = Math.random() * Math.PI * 2;
        const spawnPos = new THREE.Vector3(
            Math.cos(angle) * arenaRadius,
            0,
            Math.sin(angle) * arenaRadius
        );

        const enemy = new Enemy(this.scene, typeKey, spawnPos);
        this.enemies.push(enemy);
        this.particleMgr.emitSparks(spawnPos, 0xef4444, 15);
    }

    update(dt, playerPos, obstacles, onPlayerHit, onEnemyKilled) {
        // Spawn wave logic
        if (this.isWaveActive && this.enemiesRemainingToSpawn > 0) {
            this.spawnTimer += dt;
            if (this.spawnTimer >= this.currentWave.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnSingleEnemy();
                this.enemiesRemainingToSpawn--;
            }
        }

        // Check fire zone collisions
        this.particleMgr.fireZones.forEach(zone => {
            this.enemies.forEach(e => {
                if (e.alive && e.mesh.position.distanceTo(zone.position) <= zone.radius) {
                    e.takeDamage(window.AGI_CONFIG.WEAPONS[2].aoeDamage * dt);
                }
            });
        });

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(dt, playerPos, obstacles, onPlayerHit);

            if (!enemy.alive) {
                this.particleMgr.emitSparks(enemy.mesh.position, enemy.config.color, 30);
                window.audioManager.play('explosion');
                onEnemyKilled(enemy.config.score);
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    isWaveComplete() {
        return this.isWaveActive && this.enemiesRemainingToSpawn === 0 && this.enemies.length === 0;
    }

    clear() {
        this.enemies.forEach(e => e.destroy());
        this.enemies.length = 0;
        this.isWaveActive = false;
    }
}

window.EnemyManager = EnemyManager;
