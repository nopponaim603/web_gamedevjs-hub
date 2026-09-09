/**
 * 3D Rubik's Cube Interactive View (Three.js WebGL)
 * Handles 3D Cubies mesh assembly, slice animations, mouse drag-to-turn raycasting, and camera orbit.
 */
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
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
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4.5, 3.5, 5.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 12;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(6, 10, 8);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-6, -8, -6);
    this.scene.add(dirLight2);

    // Subtle Ground Glow
    const groundGeo = new THREE.PlaneGeometry(15, 15);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x071527,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.2;
    this.scene.add(ground);

    window.addEventListener('resize', () => this._onResize());
  }

  _onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
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
    // Clear old cubies
    if (this.cubeGroup) {
      this.scene.remove(this.cubeGroup);
    }

    this.cubeGroup = new THREE.Group();
    this.cubies = [];

    const dim = this.dim;
    const spacing = 1.02;
    const offset = (dim - 1) / 2;

    const boxGeo = new THREE.BoxGeometry(0.96, 0.96, 0.96);

    // Standard materials for 6 faces: Right(+x), Left(-x), Up(+y), Down(-y), Front(+z), Back(-z)
    const baseBlackMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.35,
      metalness: 0.1
    });

    for (let x = 0; x < dim; x++) {
      for (let y = 0; y < dim; y++) {
        for (let z = 0; z < dim; z++) {
          // Skip inner core if 3x3
          if (dim === 3 && x === 1 && y === 1 && z === 1) continue;

          const materials = [
            x === dim - 1 ? this._createStickerMat('R') : baseBlackMat, // Right (+X)
            x === 0 ? this._createStickerMat('L') : baseBlackMat,       // Left (-X)
            y === dim - 1 ? this._createStickerMat('U') : baseBlackMat, // Up (+Y)
            y === 0 ? this._createStickerMat('D') : baseBlackMat,       // Down (-Y)
            z === dim - 1 ? this._createStickerMat('F') : baseBlackMat, // Front (+Z)
            z === 0 ? this._createStickerMat('B') : baseBlackMat        // Back (-Z)
          ];

          const cubie = new THREE.Mesh(boxGeo, materials);
          cubie.position.set((x - offset) * spacing, (y - offset) * spacing, (z - offset) * spacing);
          cubie.userData = { originalX: x, originalY: y, originalZ: z };
          this.cubies.push(cubie);
          this.cubeGroup.add(cubie);
        }
      }
    }

    this.scene.add(this.cubeGroup);
  }

  _createStickerMat(faceKey) {
    const hex = COLOR_MAP[faceKey] || '#FFFFFF';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      roughness: 0.15,
      metalness: 0.05
    });
  }

  /**
   * Sync visual colors from Cube2x2 / Cube3x3 state
   */
  updateFromState(cube) {
    if (!cube) return;
    const dim = this.dim;
    const state = cube.state;

    // Map facelets to cubie stickers
    if (dim === 2) {
      // 2x2 cubies mapping
      // U:0-3, R:4-7, F:8-11, D:12-15, L:16-19, B:20-23
      this.cubies.forEach(cubie => {
        const p = cubie.position;
        const x = p.x > 0 ? 1 : 0;
        const y = p.y > 0 ? 1 : 0;
        const z = p.z > 0 ? 1 : 0;

        // Up/Down
        if (y === 1) cubie.material[2] = this._createStickerMat(state[z * 2 + x]);
        else cubie.material[3] = this._createStickerMat(state[12 + (1 - z) * 2 + x]);

        // Right/Left
        if (x === 1) cubie.material[0] = this._createStickerMat(state[4 + (1 - y) * 2 + (1 - z)]);
        else cubie.material[1] = this._createStickerMat(state[16 + (1 - y) * 2 + z]);

        // Front/Back
        if (z === 1) cubie.material[4] = this._createStickerMat(state[8 + (1 - y) * 2 + x]);
        else cubie.material[5] = this._createStickerMat(state[20 + (1 - y) * 2 + (1 - x)]);
      });
    } else {
      // 3x3 cubies mapping
      this.cubies.forEach(cubie => {
        const p = cubie.position;
        const x = Math.round(p.x + 1);
        const y = Math.round(p.y + 1);
        const z = Math.round(p.z + 1);

        // Up: 0-8, Down: 27-35
        if (y === 2) cubie.material[2] = this._createStickerMat(state[z * 3 + x]);
        if (y === 0) cubie.material[3] = this._createStickerMat(state[27 + (2 - z) * 3 + x]);

        // Right: 9-17, Left: 36-44
        if (x === 2) cubie.material[0] = this._createStickerMat(state[9 + (2 - y) * 3 + (2 - z)]);
        if (x === 0) cubie.material[1] = this._createStickerMat(state[36 + (2 - y) * 3 + z]);

        // Front: 18-26, Back: 45-53
        if (z === 2) cubie.material[4] = this._createStickerMat(state[18 + (2 - y) * 3 + x]);
        if (z === 0) cubie.material[5] = this._createStickerMat(state[45 + (2 - y) * 3 + (2 - x)]);
      });
    }
  }

  /**
   * Animate a slice turn (U, U', R, R2, etc.)
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

      // Identify affected cubies and rotation axis
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
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cosine ease

        pivot.setRotationFromAxisAngle(axis, initialRot + (targetRot - initialRot) * ease);

        if (progress < 1) {
          requestAnimationFrame(animateSlice);
        } else {
          pivot.setRotationFromAxisAngle(axis, targetRot);
          pivot.updateMatrixWorld();

          // Detach back to cubeGroup
          activeCubies.forEach(c => {
            this.cubeGroup.attach(c);
            // Snap position & rotation to clean grid
            c.position.x = Math.round(c.position.x * 10) / 10;
            c.position.y = Math.round(c.position.y * 10) / 10;
            c.position.z = Math.round(c.position.z * 10) / 10;
          });
          this.scene.remove(pivot);

          this.isAnimating = false;
          resolve();

          // Process next queued move if any
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
      const intersects = raycaster.intersectObjects(this.cubies);
      if (intersects.length > 0) {
        clickedCubie = intersects[0].object;
        clickedNormal = intersects[0].face.normal.clone().transformDirection(clickedCubie.matrixWorld).round();
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
        // Drag gesture on cube face! Determine slice move
        const move = this._inferMoveFromGesture(clickedCubie, clickedNormal, dx, dy);
        if (move) {
          this.onMoveApplied(move);
        }
      }
      clickedCubie = null;
    });
  }

  _inferMoveFromGesture(cubie, normal, dx, dy) {
    const p = cubie.position;
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    // Gesture on Front (+Z)
    if (normal.z > 0.5) {
      if (isHorizontal) return dx > 0 ? (p.y > 0 ? 'U' : "D'") : (p.y > 0 ? "U'" : 'D');
      else return dy > 0 ? (p.x > 0 ? 'R' : "L'") : (p.x > 0 ? "R'" : 'L');
    }
    // Gesture on Up (+Y)
    if (normal.y > 0.5) {
      if (isHorizontal) return dx > 0 ? (p.z > 0 ? "F'" : 'B') : (p.z > 0 ? 'F' : "B'");
      else return dy > 0 ? (p.x > 0 ? 'R' : "L'") : (p.x > 0 ? "R'" : 'L');
    }
    // Gesture on Right (+X)
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
