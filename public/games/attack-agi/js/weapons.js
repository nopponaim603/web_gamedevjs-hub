/**
 * Attack AGI — Weapon Arsenal & Viewmodel Controller
 */

class WeaponManager {
    constructor(camera, scene, particleMgr) {
        this.camera = camera;
        this.scene = scene;
        this.particleMgr = particleMgr;

        this.weapons = JSON.parse(JSON.stringify(window.AGI_CONFIG.WEAPONS));
        this.currentIndex = 0;
        this.ammo = this.weapons.map(w => w.magSize);
        this.isReloading = false;
        this.lastFireTime = 0;

        // Viewmodel group attached to camera
        this.viewmodel = new THREE.Group();
        this.camera.add(this.viewmodel);
        this.viewmodel.position.set(0.28, -0.22, -0.45);

        // Projectiles in flight (Molotovs, etc.)
        this.projectiles = [];

        this.initViewmodels();
    }

    get current() {
        return this.weapons[this.currentIndex];
    }

    get currentAmmo() {
        return this.ammo[this.currentIndex];
    }

    initViewmodels() {
        this.models = [];

        // 1. Pulse Rifle Viewmodel
        const rifleGroup = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(0.08, 0.1, 0.45);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);

        const barrelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        barrelGeo.rotateX(Math.PI / 2);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.set(0, 0.02, -0.3);

        rifleGroup.add(body, barrel);
        this.viewmodel.add(rifleGroup);
        this.models.push(rifleGroup);

        // 2. Shotgun Viewmodel
        const shotgunGroup = new THREE.Group();
        const sBodyGeo = new THREE.BoxGeometry(0.1, 0.12, 0.4);
        const sBodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
        const sBody = new THREE.Mesh(sBodyGeo, sBodyMat);

        const sBarrelGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.35, 8);
        sBarrelGeo.rotateX(Math.PI / 2);
        const sBarrelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4 });
        const sBarrel = new THREE.Mesh(sBarrelGeo, sBarrelMat);
        sBarrel.position.set(0, 0.03, -0.28);

        shotgunGroup.add(sBody, sBarrel);
        this.viewmodel.add(shotgunGroup);
        this.models.push(shotgunGroup);

        // 3. Molotov Viewmodel
        const molotovGroup = new THREE.Group();
        const bottleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12);
        const bottleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, roughness: 0.1 });
        const bottle = new THREE.Mesh(bottleGeo, bottleMat);

        const ragGeo = new THREE.BoxGeometry(0.04, 0.1, 0.04);
        const ragMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const rag = new THREE.Mesh(ragGeo, ragMat);
        rag.position.set(0, 0.15, 0);

        molotovGroup.add(bottle, rag);
        this.viewmodel.add(molotovGroup);
        this.models.push(molotovGroup);

        this.updateViewmodelVisibility();
    }

    switchWeapon(index) {
        if (index === this.currentIndex || this.isReloading) return;
        if (index < 0 || index >= this.weapons.length) return;

        this.currentIndex = index;
        this.updateViewmodelVisibility();
        window.audioManager.play('reload');
    }

    updateViewmodelVisibility() {
        this.models.forEach((m, idx) => {
            m.visible = (idx === this.currentIndex);
        });
    }

    canShoot() {
        if (this.isReloading) return false;
        if (this.currentAmmo <= 0) return false;
        const now = performance.now() / 1000;
        return (now - this.lastFireTime) >= this.current.fireRate;
    }

    shoot(enemies) {
        if (!this.canShoot()) {
            if (this.currentAmmo <= 0 && !this.isReloading) {
                this.reload();
            }
            return [];
        }

        const now = performance.now() / 1000;
        this.lastFireTime = now;
        this.ammo[this.currentIndex]--;

        // Viewmodel Recoil kick
        this.viewmodel.position.z += 0.08;
        this.viewmodel.rotation.x += 0.12;

        const hits = [];

        if (this.current.id === 'rifle') {
            window.audioManager.play('rifle');
            this.fireRaycast(enemies, hits, 1, this.current.spread, this.current.damage);
        } else if (this.current.id === 'shotgun') {
            window.audioManager.play('shotgun');
            this.fireRaycast(enemies, hits, this.current.pellets, this.current.spread, this.current.damage);
        } else if (this.current.id === 'molotov') {
            window.audioManager.play('throw');
            this.throwMolotov();
        }

        return hits;
    }

    fireRaycast(enemies, hits, count, spread, damage) {
        const origin = new THREE.Vector3();
        this.camera.getWorldPosition(origin);

        for (let i = 0; i < count; i++) {
            const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);

            if (spread > 0) {
                dir.x += (Math.random() - 0.5) * spread;
                dir.y += (Math.random() - 0.5) * spread;
                dir.z += (Math.random() - 0.5) * spread;
                dir.normalize();
            }

            const raycaster = new THREE.Raycaster(origin, dir, 0.1, this.current.range);
            const enemyMeshes = enemies.filter(e => e.alive).map(e => e.mesh);
            const intersects = raycaster.intersectObjects(enemyMeshes, true);

            const tracerEnd = new THREE.Vector3().copy(origin).addScaledVector(dir, this.current.range);

            if (intersects.length > 0) {
                const hit = intersects[0];
                tracerEnd.copy(hit.point);

                // Find matching enemy instance
                const enemy = enemies.find(e => e.containsMesh(hit.object));
                if (enemy && enemy.alive) {
                    hits.push({ enemy, damage });
                    this.particleMgr.emitSparks(hit.point, 0xef4444, 8);
                    window.audioManager.play('hitmarker');
                }
            } else {
                this.particleMgr.emitSparks(tracerEnd, 0x38bdf8, 3);
            }

            const tracerStart = new THREE.Vector3(0.2, -0.15, -0.3).applyQuaternion(this.camera.quaternion).add(origin);
            this.particleMgr.addTracer(tracerStart, tracerEnd, this.current.id === 'shotgun' ? 0xf59e0b : 0x38bdf8);
        }
    }

    throwMolotov() {
        const origin = new THREE.Vector3();
        this.camera.getWorldPosition(origin);

        const dir = new THREE.Vector3(0, 0.2, -1).applyQuaternion(this.camera.quaternion).normalize();
        const velocity = dir.multiplyScalar(this.current.throwSpeed);

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        mesh.position.copy(origin);
        this.scene.add(mesh);

        this.projectiles.push({
            mesh,
            velocity,
            aoeRadius: this.current.aoeRadius,
            aoeDuration: this.current.aoeDuration,
            directDamage: this.current.damage
        });
    }

    reload() {
        if (this.isReloading || this.currentAmmo === this.current.magSize) return;

        this.isReloading = true;
        window.audioManager.play('reload');

        // Reload animation
        const initialY = this.viewmodel.position.y;
        this.viewmodel.position.y -= 0.15;

        setTimeout(() => {
            this.ammo[this.currentIndex] = this.current.magSize;
            this.isReloading = false;
            this.viewmodel.position.y = initialY;
        }, this.current.reloadTime * 1000);
    }

    update(dt, enemies) {
        // Viewmodel smooth recovery from recoil
        this.viewmodel.position.z += (-0.45 - this.viewmodel.position.z) * 10 * dt;
        this.viewmodel.rotation.x += (0 - this.viewmodel.rotation.x) * 10 * dt;

        // Update active projectiles (Molotovs)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.velocity.y -= 25 * dt; // Gravity
            proj.mesh.position.addScaledVector(proj.velocity, dt);

            // Ground impact
            if (proj.mesh.position.y <= 0.2) {
                this.particleMgr.emitSparks(proj.mesh.position, 0xff4500, 25);
                this.particleMgr.createFireZone(proj.mesh.position, proj.aoeRadius, proj.aoeDuration);
                window.audioManager.play('explosion');

                // Direct damage to nearby enemies
                enemies.forEach(e => {
                    if (e.alive && e.mesh.position.distanceTo(proj.mesh.position) <= proj.aoeRadius) {
                        e.takeDamage(proj.directDamage);
                    }
                });

                this.scene.remove(proj.mesh);
                this.projectiles.splice(i, 1);
            }
        }
    }
}

window.WeaponManager = WeaponManager;
