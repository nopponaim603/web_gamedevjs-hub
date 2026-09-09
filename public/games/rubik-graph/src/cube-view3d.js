/**
 * 3D Rubik's Cube Interactive View (Three.js WebGL)
 * Realistic Speedcube representation with black base cubies, inset glossy colored stickers,
 * smooth slice rotations, orbit camera, and drag-to-turn raycasting.
 */
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { COLOR_MAP } from './cube-core.js';

export class CubeView3D {
  constructor(container, options = {}) {
    this.container = container;
    this.onMoveApplied = options.onMoveApplied || (() => {});
    this.dim = options.dim || 3; // 2 or 3
    this.isAnimating = false;
    this.animationQueue = [];

    this._initThree();
    this._buildCube();
    this._setupInteraction();
    this._animate();
  }

  _initThree() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060913);

    // Perspective Camera viewing Up, Front, Right faces simultaneously
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(5.5, 4.2, 6.2);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 14;
    this.controls.target.set(0, 0, 0);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(8, 12, 10);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-8, -6, -8);
    this.scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xa855f7, 0.8);
    backLight.position.set(0, -10, 5);
    this.scene.add(backLight);

    // Ground platform
    const groundGeo = new THREE.CircleGeometry(6, 48);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x0c1527,
      transparent: true,
      opacity: 0.6
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.2;
    this.scene.add(ground);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this._onResize());
    resizeObserver.observe(this.container);
  }

  _onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setDimension(dim) {
    if (this.dim === dim) return;
    this.dim = dim;
    this._buildCube();
  }

  _buildCube() {
    if (this.cubeGroup) {
      this.scene.remove(this.cubeGroup);
    }

    this.cubeGroup = new THREE.Group();
    this.cubies = [];

    const dim = this.dim;
    const spacing = 1.0;
    const offset = (dim - 1) / 2;
    const cubieSize = 0.94;
    const stickerSize = 0.84;
    const stickerOffset = cubieSize / 2 + 0.005;

    const baseCubieGeo = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);
    const baseCubieMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.2
    });

    const stickerPlaneGeo = new THREE.PlaneGeometry(stickerSize, stickerSize);

    for (let x = 0; x < dim; x++) {
      for (let y = 0; y < dim; y++) {
        for (let z = 0; z < dim; z++) {
          // Skip inner core if 3x3
          if (dim === 3 && x === 1 && y === 1 && z === 1) continue;

          const cubie = new THREE.Mesh(baseCubieGeo, baseCubieMat);
          cubie.position.set((x - offset) * spacing, (y - offset) * spacing, (z - offset) * spacing);
          cubie.userData = { gridX: x, gridY: y, gridZ: z, stickers: {} };

          // Attach Stickers to outer faces
          // Right (+X)
          if (x === dim - 1) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'R');
            st.position.x = stickerOffset;
            st.rotation.y = Math.PI / 2;
            st.userData = { face: 'R' };
            cubie.add(st);
            cubie.userData.stickers['R'] = st;
          }
          // Left (-X)
          if (x === 0) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'L');
            st.position.x = -stickerOffset;
            st.rotation.y = -Math.PI / 2;
            st.userData = { face: 'L' };
            cubie.add(st);
            cubie.userData.stickers['L'] = st;
          }
          // Up (+Y)
          if (y === dim - 1) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'U');
            st.position.y = stickerOffset;
            st.rotation.x = -Math.PI / 2;
            st.userData = { face: 'U' };
            cubie.add(st);
            cubie.userData.stickers['U'] = st;
          }
          // Down (-Y)
          if (y === 0) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'D');
            st.position.y = -stickerOffset;
            st.rotation.x = Math.PI / 2;
            st.userData = { face: 'D' };
            cubie.add(st);
            cubie.userData.stickers['D'] = st;
          }
          // Front (+Z)
          if (z === dim - 1) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'F');
            st.position.z = stickerOffset;
            st.userData = { face: 'F' };
            cubie.add(st);
            cubie.userData.stickers['F'] = st;
          }
          // Back (-Z)
          if (z === 0) {
            const st = this._createStickerMesh(stickerPlaneGeo, 'B');
            st.position.z = -stickerOffset;
            st.rotation.y = Math.PI;
            st.userData = { face: 'B' };
            cubie.add(st);
            cubie.userData.stickers['B'] = st;
          }

          this.cubies.push(cubie);
          this.cubeGroup.add(cubie);
        }
      }
    }

    this.scene.add(this.cubeGroup);
  }

  _createStickerMesh(geo, colorKey) {
    const hex = COLOR_MAP[colorKey] || '#FFFFFF';
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      roughness: 0.15,
      metalness: 0.05,
      side: THREE.FrontSide
    });
    return new THREE.Mesh(geo, mat);
  }

  /**
   * Sync visual stickers from logical Cube state
   */
  updateFromState(cube) {
    if (!cube) return;
    const dim = this.dim;
    const state = cube.state;

    if (dim === 2) {
      // 2x2 facelets mapping
      this.cubies.forEach(c => {
        const p = c.position;
        const x = p.x > 0 ? 1 : 0;
        const y = p.y > 0 ? 1 : 0;
        const z = p.z > 0 ? 1 : 0;

        const st = c.userData.stickers;
        if (st['U']) this._setStickerColor(st['U'], state[z * 2 + x]);
        if (st['D']) this._setStickerColor(st['D'], state[12 + (1 - z) * 2 + x]);
        if (st['R']) this._setStickerColor(st['R'], state[4 + (1 - y) * 2 + (1 - z)]);
        if (st['L']) this._setStickerColor(st['L'], state[16 + (1 - y) * 2 + z]);
        if (st['F']) this._setStickerColor(st['F'], state[8 + (1 - y) * 2 + x]);
        if (st['B']) this._setStickerColor(st['B'], state[20 + (1 - y) * 2 + (1 - x)]);
      });
    } else {
      // 3x3 facelets mapping
      this.cubies.forEach(c => {
        const p = c.position;
        const x = Math.round(p.x + 1);
        const y = Math.round(p.y + 1);
        const z = Math.round(p.z + 1);

        const st = c.userData.stickers;
        if (st['U']) this._setStickerColor(st['U'], state[z * 3 + x]);
        if (st['D']) this._setStickerColor(st['D'], state[27 + (2 - z) * 3 + x]);
        if (st['R']) this._setStickerColor(st['R'], state[9 + (2 - y) * 3 + (2 - z)]);
        if (st['L']) this._setStickerColor(st['L'], state[36 + (2 - y) * 3 + z]);
        if (st['F']) this._setStickerColor(st['F'], state[18 + (2 - y) * 3 + x]);
        if (st['B']) this._setStickerColor(st['B'], state[45 + (2 - y) * 3 + (2 - x)]);
      });
    }
  }

  _setStickerColor(stickerMesh, colorKey) {
    if (!stickerMesh || !colorKey) return;
    const hex = COLOR_MAP[colorKey] || '#FFFFFF';
    stickerMesh.material.color.set(hex);
  }

  /**
   * Animate slice rotation
   */
  animateMove(move, duration = 220) {
    return new Promise(resolve => {
      if (this.isAnimating) {
        this.animationQueue.push({ move, duration, resolve });
        return;
      }
      this.isAnimating = true;

      const face = move[0];
      const isPrime = move.includes("'");
      const isDouble = move.includes('2');

      const angle = (Math.PI / 2) * (isDouble ? 2 : 1) * (isPrime ? 1 : -1);

      const pivot = new THREE.Group();
      this.scene.add(pivot);

      let axis = new THREE.Vector3(0, 1, 0);
      let sliceCondition = () => false;

      const threshold = 0.3;
      if (face === 'U') {
        axis = new THREE.Vector3(0, -1, 0);
        sliceCondition = c => c.position.y > threshold;
      } else if (face === 'D') {
        axis = new THREE.Vector3(0, 1, 0);
        sliceCondition = c => c.position.y < -threshold;
      } else if (face === 'R') {
        axis = new THREE.Vector3(-1, 0, 0);
        sliceCondition = c => c.position.x > threshold;
      } else if (face === 'L') {
        axis = new THREE.Vector3(1, 0, 0);
        sliceCondition = c => c.position.x < -threshold;
      } else if (face === 'F') {
        axis = new THREE.Vector3(0, 0, -1);
        sliceCondition = c => c.position.z > threshold;
      } else if (face === 'B') {
        axis = new THREE.Vector3(0, 0, 1);
        sliceCondition = c => c.position.z < -threshold;
      }

      const activeCubies = this.cubies.filter(sliceCondition);
      activeCubies.forEach(c => pivot.attach(c));

      const startTime = performance.now();
      const initialRot = 0;
      const targetRot = angle;

      const animateSlice = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

        pivot.setRotationFromAxisAngle(axis, initialRot + (targetRot - initialRot) * ease);

        if (progress < 1) {
          requestAnimationFrame(animateSlice);
        } else {
          pivot.setRotationFromAxisAngle(axis, targetRot);
          pivot.updateMatrixWorld();

          activeCubies.forEach(c => {
            this.cubeGroup.attach(c);
            c.position.x = Math.round(c.position.x * 10) / 10;
            c.position.y = Math.round(c.position.y * 10) / 10;
            c.position.z = Math.round(c.position.z * 10) / 10;
          });
          this.scene.remove(pivot);

          this.isAnimating = false;
          resolve();

          if (this.animationQueue.length > 0) {
            const next = this.animationQueue.shift();
            this.animateMove(next.move, next.duration).then(next.resolve);
          }
        }
      };

      requestAnimationFrame(animateSlice);
    });
  }

  _setupInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    let clickedCubie = null;
    let clickedNormal = null;

    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      downPos = { x: e.clientX, y: e.clientY };
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.cubies, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== this.cubeGroup && obj.parent !== this.scene) {
          obj = obj.parent;
        }
        clickedCubie = obj;
        clickedNormal = intersects[0].face.normal.clone().transformDirection(intersects[0].object.matrixWorld).round();
      } else {
        clickedCubie = null;
      }
    });

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      if (!clickedCubie || this.isAnimating) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 25) {
        const move = this._inferMoveFromGesture(clickedCubie, clickedNormal, dx, dy);
        if (move) {
          this.onMoveApplied(move);
        }
      }
      clickedCubie = null;
    });
  }

  _inferMoveFromGesture(cubie, normal, dx, dy) {
    if (!normal) return null;
    const p = cubie.position;
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    // Front Face (+Z)
    if (normal.z > 0.5) {
      if (isHorizontal) return dx > 0 ? (p.y > 0 ? 'U' : "D'") : (p.y > 0 ? "U'" : 'D');
      else return dy > 0 ? (p.x > 0 ? 'R' : "L'") : (p.x > 0 ? "R'" : 'L');
    }
    // Up Face (+Y)
    if (normal.y > 0.5) {
      if (isHorizontal) return dx > 0 ? (p.z > 0 ? "F'" : 'B') : (p.z > 0 ? 'F' : "B'");
      else return dy > 0 ? (p.x > 0 ? 'R' : "L'") : (p.x > 0 ? "R'" : 'L');
    }
    // Right Face (+X)
    if (normal.x > 0.5) {
      if (isHorizontal) return dx > 0 ? (p.y > 0 ? 'U' : "D'") : (p.y > 0 ? "U'" : 'D');
      else return dy > 0 ? (p.z > 0 ? "F'" : 'B') : (p.z > 0 ? 'F' : "B'");
    }
    return null;
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
