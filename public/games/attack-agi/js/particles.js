/**
 * Attack AGI — 3D Particle & Visual FX System
 */

class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.fireZones = [];
        this.tracers = [];

        // Shared Geometry and Materials
        this.sparkGeo = new THREE.SphereGeometry(0.1, 4, 4);
        this.sparkMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

        this.fireGeo = new THREE.PlaneGeometry(1, 1);
        this.fireGeo.rotateX(-Math.PI / 2);
    }

    emitSparks(position, color = 0xffaa00, count = 12) {
        const mat = new THREE.MeshBasicMaterial({ color: color });
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(this.sparkGeo, mat);
            mesh.position.copy(position);

            const speed = 4 + Math.random() * 8;
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.2) * Math.PI;

            const velocity = new THREE.Vector3(
                Math.cos(angle) * Math.cos(elevation) * speed,
                Math.sin(elevation) * speed + 2,
                Math.sin(angle) * Math.cos(elevation) * speed
            );

            this.scene.add(mesh);
            this.particles.push({
                mesh,
                velocity,
                life: 0.35 + Math.random() * 0.2,
                maxLife: 0.55
            });
        }
    }

    addTracer(from, to, color = 0x38bdf8) {
        const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
        const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        this.tracers.push({
            line,
            life: 0.08
        });
    }

    createFireZone(position, radius = 6, duration = 5.0) {
        const group = new THREE.Group();
        group.position.set(position.x, 0.05, position.z);

        // Ground fire decal ring
        const ringGeo = new THREE.RingGeometry(0.1, radius, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        group.add(ring);

        // Inner glowing core
        const coreGeo = new THREE.CircleGeometry(radius * 0.7, 24);
        coreGeo.rotateX(-Math.PI / 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffdd00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.y = 0.02;
        group.add(core);

        this.scene.add(group);

        this.fireZones.push({
            group,
            position: new THREE.Vector3(position.x, 0, position.z),
            radius,
            duration,
            elapsed: 0
        });

        window.audioManager.play('burn');
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            p.velocity.y -= 20 * dt; // Gravity
            p.mesh.position.addScaledVector(p.velocity, dt);

            const scale = Math.max(0.01, p.life / p.maxLife);
            p.mesh.scale.set(scale, scale, scale);

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                this.particles.splice(i, 1);
            }
        }

        // Update tracers
        for (let i = this.tracers.length - 1; i >= 0; i--) {
            const t = this.tracers[i];
            t.life -= dt;
            if (t.life <= 0) {
                this.scene.remove(t.line);
                t.line.geometry.dispose();
                this.tracers.splice(i, 1);
            }
        }

        // Update fire zones
        for (let i = this.fireZones.length - 1; i >= 0; i--) {
            const f = this.fireZones[i];
            f.elapsed += dt;

            // Pulsing animation
            const scale = 1 + Math.sin(f.elapsed * 12) * 0.05;
            f.group.scale.set(scale, 1, scale);

            // Emit occasional fire sparks
            if (Math.random() < 0.3) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * f.radius;
                const spPos = new THREE.Vector3(
                    f.position.x + Math.cos(angle) * dist,
                    0.2,
                    f.position.z + Math.sin(angle) * dist
                );
                this.emitSparks(spPos, 0xff4500, 2);
            }

            if (f.elapsed >= f.duration) {
                this.scene.remove(f.group);
                this.fireZones.splice(i, 1);
            }
        }
    }

    clear() {
        for (const p of this.particles) this.scene.remove(p.mesh);
        for (const t of this.tracers) this.scene.remove(t.line);
        for (const f of this.fireZones) this.scene.remove(f.group);
        this.particles.length = 0;
        this.tracers.length = 0;
        this.fireZones.length = 0;
    }
}

window.ParticleManager = ParticleManager;
