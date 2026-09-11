/**
 * Attack AGI — 3D Cyberpunk Arena & Environment
 */

class WorldBuilder {
    constructor(scene) {
        this.scene = scene;
        this.size = window.AGI_CONFIG.ARENA.SIZE;
        this.wallHeight = window.AGI_CONFIG.ARENA.WALL_HEIGHT;
        this.obstacles = [];
    }

    build() {
        this.buildFloor();
        this.buildPerimeterWalls();
        this.buildPillarsAndCover();
        this.buildLighting();
    }

    buildFloor() {
        // Dark grid floor
        const floorGeo = new THREE.PlaneGeometry(this.size, this.size, 32, 32);
        floorGeo.rotateX(-Math.PI / 2);

        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x0b0f19,
            roughness: 0.7,
            metalness: 0.2
        });

        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grid lines overlay
        const gridHelper = new THREE.GridHelper(this.size, 45, 0x0284c7, 0x1e293b);
        gridHelper.position.y = 0.01;
        this.scene.add(gridHelper);

        // Central AGI core platform
        const coreGeo = new THREE.CylinderGeometry(4, 4.5, 0.4, 32);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x1e1b4b,
            emissive: 0x4338ca,
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0.8
        });
        const corePlatform = new THREE.Mesh(coreGeo, coreMat);
        corePlatform.position.y = 0.2;
        this.scene.add(corePlatform);

        // Core holographic pillar
        const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
        const pillarMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.75,
            wireframe: true
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.y = 3.2;
        this.scene.add(pillar);
        this.obstacles.push({ x: 0, z: 0, radius: 1.5 });
    }

    buildPerimeterWalls() {
        const half = this.size / 2;
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.5,
            metalness: 0.5,
            emissive: 0xef4444,
            emissiveIntensity: 0.05
        });

        const configs = [
            { pos: [0, this.wallHeight / 2, -half], size: [this.size, this.wallHeight, 1] },
            { pos: [0, this.wallHeight / 2, half], size: [this.size, this.wallHeight, 1] },
            { pos: [-half, this.wallHeight / 2, 0], size: [1, this.wallHeight, this.size] },
            { pos: [half, this.wallHeight / 2, 0], size: [1, this.wallHeight, this.size] },
        ];

        configs.forEach(cfg => {
            const geo = new THREE.BoxGeometry(...cfg.size);
            const wall = new THREE.Mesh(geo, wallMat);
            wall.position.set(...cfg.pos);
            this.scene.add(wall);
        });

        // Glowing boundary strip on walls
        const stripMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const stripConfigs = [
            { pos: [0, 0.5, -half + 0.55], size: [this.size, 0.2, 0.1] },
            { pos: [0, 0.5, half - 0.55], size: [this.size, 0.2, 0.1] },
            { pos: [-half + 0.55, 0.5, 0], size: [0.1, 0.2, this.size] },
            { pos: [half - 0.55, 0.5, 0], size: [0.1, 0.2, this.size] }
        ];
        stripConfigs.forEach(cfg => {
            const geo = new THREE.BoxGeometry(...cfg.size);
            const strip = new THREE.Mesh(geo, stripMat);
            strip.position.set(...cfg.pos);
            this.scene.add(strip);
        });
    }

    buildPillarsAndCover() {
        const pillarLocations = [
            [-18, -18], [18, -18],
            [-18, 18], [18, 18],
            [-28, 0], [28, 0],
            [0, -28], [0, 28]
        ];

        const pillarGeo = new THREE.BoxGeometry(2.5, 5, 2.5);
        const pillarMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.4,
            metalness: 0.6,
            emissive: 0x0284c7,
            emissiveIntensity: 0.2
        });

        pillarLocations.forEach(([x, z]) => {
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(x, 2.5, z);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);
            this.obstacles.push({ x, z, radius: 1.8 });
        });
    }

    buildLighting() {
        // Ambient light (Moody Cyberpunk)
        const ambient = new THREE.AmbientLight(0x1e293b, 0.6);
        this.scene.add(ambient);

        // Directional moonlight/sunlight
        const dirLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
        dirLight.position.set(30, 45, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        // Center glowing blue core light
        const coreLight = new THREE.PointLight(0x06b6d4, 2.0, 30);
        coreLight.position.set(0, 3, 0);
        this.scene.add(coreLight);

        // Red corner alert lights
        const redLight1 = new THREE.PointLight(0xef4444, 1.2, 35);
        redLight1.position.set(-35, 4, -35);
        this.scene.add(redLight1);

        const redLight2 = new THREE.PointLight(0xef4444, 1.2, 35);
        redLight2.position.set(35, 4, 35);
        this.scene.add(redLight2);

        // Dark atmosphere fog
        this.scene.fog = new THREE.FogExp2(0x0b0f19, 0.015);
    }
}

window.WorldBuilder = WorldBuilder;
