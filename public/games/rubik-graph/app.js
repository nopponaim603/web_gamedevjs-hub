/**
 * Planar ⇄ 3D Rubik's Cube Engine (Generalized for 2x2, 3x3, 4x4, 5x5, 6x6)
 * Real-time bidirectional equivalence linking between 2D Intersecting Concentric Rings
 * and 3D Speedcube with Scramble, Undo, and Auto-Solve support.
 */
(function(){
  "use strict";

  let ORDER = 3; // Default 3x3

  /* ============================================================
     1. 3D Math & Matrix Rotations
     ============================================================ */
  function matVec(M, v){
    return [
      M[0][0]*v[0]+M[0][1]*v[1]+M[0][2]*v[2],
      M[1][0]*v[0]+M[1][1]*v[1]+M[1][2]*v[2],
      M[2][0]*v[0]+M[2][1]*v[1]+M[2][2]*v[2],
    ];
  }
  function matMul(A,B){
    const R=[[0,0,0],[0,0,0],[0,0,0]];
    for(let i=0;i<3;i++)for(let j=0;j<3;j++){
      let s=0; for(let k=0;k<3;k++) s+=A[i][k]*B[k][j];
      R[i][j]=s;
    }
    return R;
  }
  function transpose(M){
    return [[M[0][0],M[1][0],M[2][0]],[M[0][1],M[1][1],M[2][1]],[M[0][2],M[1][2],M[2][2]]];
  }
  const IDENT=[[1,0,0],[0,1,0],[0,0,1]];

  const baseMatrix = {
    R: [[1,0,0],[0,0,1],[0,-1,0]],
    L: [[1,0,0],[0,0,-1],[0,1,0]],
    U: [[0,0,-1],[0,1,0],[1,0,0]],
    D: [[0,0,1],[0,1,0],[-1,0,0]],
    F: [[0,1,0],[-1,0,0],[0,0,1]],
    B: [[0,-1,0],[1,0,0],[0,0,1]],
  };

  const axisOf = {R:0,L:0,U:1,D:1,F:2,B:2};
  const signOf = {R:1,L:-1,U:1,D:-1,F:1,B:-1};
  const oppositeFace = {U:'D', D:'U', F:'B', B:'F', L:'R', R:'L'};

  const FACES = ['U','D','F','B','L','R'];

  function vecToKey(v){
    if(v[0]===1) return 'x+'; if(v[0]===-1) return 'x-';
    if(v[1]===1) return 'y+'; if(v[1]===-1) return 'y-';
    if(v[2]===1) return 'z+'; if(v[2]===-1) return 'z-';
    return null;
  }
  function keyToVec(key){
    return {'x+':[1,0,0],'x-':[-1,0,0],'y+':[0,1,0],'y-':[0,-1,0],'z+':[0,0,1],'z-':[0,0,-1]}[key];
  }
  const normalKeyToFace = {'x+':'R','x-':'L','y+':'U','y-':'D','z+':'F','z-':'B'};

  // Facelet mapping per face
  function getFaceInfo(N) {
    const maxIdx = N - 1;
    return {
      U: {axis:1, val:maxIdx,  rowFn:(x,y,z)=> z,            colFn:(x,y,z)=> x,            normal:[0,1,0]},
      D: {axis:1, val:0,       rowFn:(x,y,z)=> maxIdx - z,   colFn:(x,y,z)=> x,            normal:[0,-1,0]},
      F: {axis:2, val:maxIdx,  rowFn:(x,y,z)=> maxIdx - y,   colFn:(x,y,z)=> x,            normal:[0,0,1]},
      B: {axis:2, val:0,       rowFn:(x,y,z)=> maxIdx - y,   colFn:(x,y,z)=> maxIdx - x,   normal:[0,0,-1]},
      R: {axis:0, val:maxIdx,  rowFn:(x,y,z)=> maxIdx - y,   colFn:(x,y,z)=> maxIdx - z,   normal:[1,0,0]},
      L: {axis:0, val:0,       rowFn:(x,y,z)=> maxIdx - y,   colFn:(x,y,z)=> z,            normal:[-1,0,0]},
    };
  }

  let faceInfo = getFaceInfo(ORDER);

  function getStickerSlot(cubie, key){
    const color = cubie.paint[key];
    if(color === undefined) return null;
    const worldDir = matVec(cubie.orient, keyToVec(key));
    const faceLetter = normalKeyToFace[vecToKey(worldDir)];
    const info = faceInfo[faceLetter];
    const row = info.rowFn(cubie.pos[0], cubie.pos[1], cubie.pos[2]);
    const col = info.colFn(cubie.pos[0], cubie.pos[1], cubie.pos[2]);
    return {face:faceLetter, row, col, color};
  }

  /* ============================================================
     2. Cubies State Management
     ============================================================ */
  let cubies = [];
  let moveHistory = [];
  let animating = false;

  function buildSolved(){
    cubies = [];
    const N = ORDER;
    const maxIdx = N - 1;

    for(let x=0; x<N; x++){
      for(let y=0; y<N; y++){
        for(let z=0; z<N; z++){
          // Only outer shell
          const isOuter = (x===0 || x===maxIdx || y===0 || y===maxIdx || z===0 || z===maxIdx);
          if(!isOuter) continue;

          const paint = {};
          if(x === maxIdx) paint['x+'] = 'R';
          if(x === 0)      paint['x-'] = 'L';
          if(y === maxIdx) paint['y+'] = 'U';
          if(y === 0)      paint['y-'] = 'D';
          if(z === maxIdx) paint['z+'] = 'F';
          if(z === 0)      paint['z-'] = 'B';

          cubies.push({ pos:[x,y,z], orient:IDENT.map(r=>r.slice()), paint });
        }
      }
    }
  }

  function applyMoveState(face, prime){
    const info = faceInfo[face];
    let M = baseMatrix[face];
    if(prime) M = transpose(M);

    const N = ORDER;
    const mid = (N - 1) / 2;

    for(const c of cubies){
      if(c.pos[info.axis] === info.val){
        // Center position around origin for rotation
        const centered = [c.pos[0] - mid, c.pos[1] - mid, c.pos[2] - mid];
        const rot = matVec(M, centered);
        c.pos = [Math.round(rot[0] + mid), Math.round(rot[1] + mid), Math.round(rot[2] + mid)];
        c.orient = matMul(M, c.orient);
      }
    }
  }

  function getFaceGrid(face){
    const info = faceInfo[face];
    const N = ORDER;
    const grid = Array.from({length: N}, () => Array(N).fill(null));

    for(const c of cubies){
      if(c.pos[info.axis] === info.val){
        const r = info.rowFn(c.pos[0], c.pos[1], c.pos[2]);
        const col = info.colFn(c.pos[0], c.pos[1], c.pos[2]);
        const localDir = matVec(transpose(c.orient), info.normal);
        const key = vecToKey(localDir);
        grid[r][col] = c.paint[key];
      }
    }
    return grid;
  }

  function isSolved(){
    const seenColors = new Set();
    for(const f of FACES){
      const grid = getFaceGrid(f);
      const center = grid[0][0];
      if(!center) return false;
      seenColors.add(center);
      const N = ORDER;
      for(let r=0; r<N; r++){
        for(let c=0; c<N; c++){
          if(grid[r][c] !== center) return false;
        }
      }
    }
    return seenColors.size === 6;
  }

  /* ============================================================
     3. Color Config
     ============================================================ */
  function faceColorName(f){ return window.t('fc_'+f); }
  function getCss(varName){
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  const COLOR = {
    U: '#f7d000', D: '#f5f5f5', F: '#1e6fd6',
    B: '#1faa4a', L: '#ff7a1a', R: '#d92121',
  };
  const CORE_COLOR = '#2a2a2a';

  /* ============================================================
     4. 2D Planar Concentric Circles Math & Intersection Generation
     ============================================================ */
  const AXES3 = ['X','Y','Z'];
  const bundleAngleDeg = { X:30, Y:270, Z:150 };
  const CENTER_DIST = 150;
  const Rc3 = CENTER_DIST / Math.sqrt(3);

  function bundleCenter(axis){
    const th = bundleAngleDeg[axis] * Math.PI/180;
    return [Rc3*Math.cos(th), Rc3*Math.sin(th)];
  }
  const bundleCenters = {};
  AXES3.forEach(a => bundleCenters[a] = bundleCenter(a));

  function circleIntersect(c1, r1, c2, r2){
    const [x1,y1] = c1, [x2,y2] = c2;
    const dx = x2-x1, dy = y2-y1;
    const d = Math.hypot(dx,dy);
    if(d > r1+r2 || d < Math.abs(r1-r2) || d===0) return null;
    const a = (d*d + r1*r1 - r2*r2) / (2*d);
    const h = Math.sqrt(Math.max(0, r1*r1 - a*a));
    const xm = x1 + a*dx/d, ym = y1 + a*dy/d;
    const rx = -dy/d, ry = dx/d;
    return [[xm+h*rx, ym+h*ry], [xm-h*rx, ym-h*ry]];
  }
  function ptDist(p,q){ return Math.hypot(p[0]-q[0], p[1]-q[1]); }

  let RADII = [];
  let faceCoord = {};

  function computeGeometry(){
    const N = ORDER;
    faceInfo = getFaceInfo(N);

    const R_min = 105 + (6 - N) * 6;
    const R_max = 205;
    RADII = Array.from({length: N}, (_, i) => R_min + i * (R_max - R_min) / (N - 1));

    faceCoord = {};
    FACES.forEach(f => {
      faceCoord[f] = Array.from({length: N}, () => Array(N).fill(null));
    });

    // Compute intersections for each face
    const pairs = [
      { axisPair:['X','Z'], posFace:'U', negFace:'D', uIdx:'X', vIdx:'Z' },
      { axisPair:['X','Y'], posFace:'F', negFace:'B', uIdx:'X', vIdx:'Y' },
      { axisPair:['Z','Y'], posFace:'R', negFace:'L', uIdx:'Z', vIdx:'Y' },
    ];

    pairs.forEach(({ axisPair:[a1, a2], posFace, negFace }) => {
      for(let r=0; r<N; r++){
        for(let c=0; c<N; c++){
          const pts = circleIntersect(bundleCenters[a1], RADII[r], bundleCenters[a2], RADII[c]);
          if(pts && pts.length === 2){
            const d0 = Math.hypot(pts[0][0], pts[0][1]);
            const d1 = Math.hypot(pts[1][0], pts[1][1]);
            const [outerPt, innerPt] = d0 > d1 ? [pts[0], pts[1]] : [pts[1], pts[0]];

            if(posFace === 'U'){
              faceCoord['U'][r][c] = innerPt;
              faceCoord['D'][r][c] = outerPt;
            } else if(posFace === 'F'){
              faceCoord['F'][r][c] = innerPt;
              faceCoord['B'][r][c] = outerPt;
            } else if(posFace === 'R'){
              faceCoord['R'][r][c] = innerPt;
              faceCoord['L'][r][c] = outerPt;
            }
          }
        }
      }
    });
  }

  function faceCenterPoint(face){
    const N = ORDER;
    let sx = 0, sy = 0, count = 0;
    for(let r=0; r<N; r++){
      for(let c=0; c<N; c++){
        const pt = faceCoord[face][r][c];
        if(pt){ sx += pt[0]; sy += pt[1]; count++; }
      }
    }
    return count > 0 ? [sx/count, sy/count] : [0,0];
  }

  function planarFlightPath(fromPt, toPt, sign, face, fromSlot, toSlot){
    let pivot = faceCenterPoint(face);
    const sameFace = (fromSlot.face === toSlot.face);
    if(!sameFace){
      // Inter-face flight: orbit around corresponding bundle center
      const diffAxis = (face==='U'||face==='D') ? 'Y' : (face==='F'||face==='B') ? 'Z' : 'X';
      pivot = bundleCenters[diffAxis];
    }

    const a1 = Math.atan2(fromPt[1]-pivot[1], fromPt[0]-pivot[0]);
    const a2 = Math.atan2(toPt[1]-pivot[1], toPt[0]-pivot[0]);
    let da = a2 - a1;
    if(sign > 0 && da <= 0) da += 2*Math.PI;
    if(sign < 0 && da >= 0) da -= 2*Math.PI;

    return { center: pivot, da, trackRadius: ptDist(fromPt, pivot) };
  }

  /* ============================================================
     5. 2D SVG & 3D CSS DOM Creation
     ============================================================ */
  const svgEl = document.getElementById('planarSvg');
  const faceLabelsEl = document.getElementById('faceLabels');
  const sceneEl = document.getElementById('scene');
  const cubeGroupEl = document.getElementById('cubeGroup');
  const sliceGroup = document.getElementById('sliceGroup');
  const sceneHitEl = document.getElementById('sceneHit');

  let dotEls = {};
  let cubieEls = [];
  let faceLabelEls = {};
  let ccwBtns = {}, cwBtns = {};

  function clusterLabelOf(face){
    return window.t('cl_' + face);
  }

  function create2DSvg(){
    svgEl.innerHTML = '';
    faceLabelsEl.innerHTML = '';
    dotEls = {};
    ccwBtns = {};
    cwBtns = {};
    faceLabelEls = {};

    const N = ORDER;
    const stickerR = Math.max(4.5, 15 - N * 1.8);

    // 1. Concentric circles
    AXES3.forEach(axis => {
      const [cx, cy] = bundleCenters[axis];
      RADII.forEach(r => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('class', 'bundle-circle');
        svgEl.appendChild(circle);
      });
      const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      center.setAttribute('cx', cx);
      center.setAttribute('cy', cy);
      center.setAttribute('r', 2.5);
      center.setAttribute('class', 'bundle-center');
      svgEl.appendChild(center);
    });

    // 2. Sticker dots
    FACES.forEach(f => {
      dotEls[f] = [];
      for(let r=0; r<N; r++){
        for(let c=0; c<N; c++){
          const pt = faceCoord[f][r][c] || [0,0];
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', pt[0]);
          dot.setAttribute('cy', pt[1]);
          dot.setAttribute('r', stickerR);
          dot.setAttribute('class', 'sticker');
          dot.setAttribute('data-face', f);
          dot.setAttribute('data-row', r);
          dot.setAttribute('data-col', c);
          svgEl.appendChild(dot);
          dotEls[f].push(dot);
        }
      }

      // Face label and buttons
      const center = faceCenterPoint(f);
      const lblWrap = document.createElement('div');
      lblWrap.className = 'face-label';
      lblWrap.style.left = `calc(50% + ${center[0]}px * 0.9)`;
      lblWrap.style.top = `calc(50% + ${center[1]}px * 0.9)`;

      const lbl = document.createElement('div');
      lbl.className = 'lbl-text';
      lbl.textContent = clusterLabelOf(f);
      faceLabelEls[f] = lbl;
      lblWrap.appendChild(lbl);

      const ctrl = document.createElement('div');
      ctrl.className = 'cluster-ctrl';

      const ccwBtn = document.createElement('button');
      ccwBtn.className = 'mini-btn';
      ccwBtn.textContent = '↺';
      ccwBtn.title = faceColorName(f) + window.t('ccw_title_suffix');
      ccwBtn.addEventListener('click', () => doMove(f, true, { record: true }));
      ccwBtns[f] = ccwBtn;
      ctrl.appendChild(ccwBtn);

      const cwBtn = document.createElement('button');
      cwBtn.className = 'mini-btn';
      cwBtn.textContent = '↻';
      cwBtn.title = faceColorName(f) + window.t('cw_title_suffix');
      cwBtn.addEventListener('click', () => doMove(f, false, { record: true }));
      cwBtns[f] = cwBtn;
      ctrl.appendChild(cwBtn);

      lblWrap.appendChild(ctrl);
      faceLabelsEl.appendChild(lblWrap);
    });
  }

  function create3DCube(){
    cubeGroupEl.innerHTML = '';
    sliceGroup.innerHTML = '';
    cubieEls = [];

    const N = ORDER;
    const mid = (N - 1) / 2;
    const cubieSize = Math.max(18, Math.floor(180 / N) - 2);
    const spacing = cubieSize + 2;

    cubies.forEach((c) => {
      const el = document.createElement('div');
      el.className = 'cubie';
      el.style.width = cubieSize + 'px';
      el.style.height = cubieSize + 'px';
      el.style.margin = (-cubieSize/2) + 'px 0 0 ' + (-cubieSize/2) + 'px';

      // 6 faces of the cubie
      const faceKeys = ['x+','x-','y+','y-','z+','z-'];
      const faceRotations = {
        'x+': `rotateY(90deg) translateZ(${cubieSize/2}px)`,
        'x-': `rotateY(-90deg) translateZ(${cubieSize/2}px)`,
        'y+': `rotateX(90deg) translateZ(${cubieSize/2}px)`,
        'y-': `rotateX(-90deg) translateZ(${cubieSize/2}px)`,
        'z+': `translateZ(${cubieSize/2}px)`,
        'z-': `rotateY(180deg) translateZ(${cubieSize/2}px)`
      };

      faceKeys.forEach(k => {
        const fEl = document.createElement('div');
        fEl.className = 'face ' + k;
        fEl.style.width = cubieSize + 'px';
        fEl.style.height = cubieSize + 'px';
        fEl.style.transform = faceRotations[k];
        fEl.style.background = CORE_COLOR;
        el.appendChild(fEl);
      });

      const tx = (c.pos[0] - mid) * spacing;
      const ty = -(c.pos[1] - mid) * spacing;
      const tz = (c.pos[2] - mid) * spacing;
      el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;

      cubeGroupEl.appendChild(el);
      cubieEls.push(el);
    });
  }

  function render2D(){
    const N = ORDER;
    FACES.forEach(f => {
      const grid = getFaceGrid(f);
      for(let r=0; r<N; r++){
        for(let c=0; c<N; c++){
          const idx = r * N + c;
          const dot = dotEls[f][idx];
          if(dot){
            dot.style.opacity = '1';
            dot.setAttribute('fill', COLOR[grid[r][c]] || '#ffffff');
          }
        }
      }
    });
  }

  function render3D(){
    const N = ORDER;
    const mid = (N - 1) / 2;
    const cubieSize = Math.max(18, Math.floor(180 / N) - 2);
    const spacing = cubieSize + 2;

    sliceGroup.innerHTML = '';
    sliceGroup.style.transform = 'none';

    cubies.forEach((c, i) => {
      const el = cubieEls[i];
      cubeGroupEl.appendChild(el);

      const tx = (c.pos[0] - mid) * spacing;
      const ty = -(c.pos[1] - mid) * spacing;
      const tz = (c.pos[2] - mid) * spacing;

      // Orientation matrix
      const rot = rotMatrix3dOrient(c.orient);
      el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) ${rot}`;

      // Colors on outer stickers
      const faceKeys = ['x+','x-','y+','y-','z+','z-'];
      faceKeys.forEach(k => {
        const faceDiv = el.querySelector('.face.' + k.replace('+','\\+').replace('-','\\-'));
        if(faceDiv){
          faceDiv.style.background = c.paint[k] ? COLOR[c.paint[k]] : CORE_COLOR;
        }
      });
    });
  }

  function rotMatrix3dOrient(M){
    const f = [1, -1, 1];
    const Op = [[0,0,0],[0,0,0],[0,0,0]];
    for(let i=0;i<3;i++)for(let j=0;j<3;j++) Op[i][j] = M[i][j] * f[i] * f[j];
    const m = [Op[0][0],Op[1][0],Op[2][0],0, Op[0][1],Op[1][1],Op[2][1],0, Op[0][2],Op[1][2],Op[2][2],0, 0,0,0,1];
    return 'matrix3d(' + m.join(',') + ')';
  }

  function rotMatrix3d(axis, angle){
    const c = Math.cos(angle), s = Math.sin(angle);
    let M;
    if(axis===0) M=[[1,0,0],[0,c,-s],[0,s,c]];
    else if(axis===1) M=[[c,0,s],[0,1,0],[-s,0,c]];
    else M=[[c,-s,0],[s,c,0],[0,0,1]];
    return rotMatrix3dOrient(M);
  }

  function getLayersForOrder(N){
    const axes = [
      {
        axis: 0,
        axisKey: 'X',
        titleKey: 'axis_X',
        layers: []
      },
      {
        axis: 1,
        axisKey: 'Y',
        titleKey: 'axis_Y',
        layers: []
      },
      {
        axis: 2,
        axisKey: 'Z',
        titleKey: 'axis_Z',
        layers: []
      }
    ];

    if(N === 2){
      axes[0].layers = [
        { name: 'L', label: 'L', refFace: 'L', axis: 0, layerIndex: 0, color: COLOR.L },
        { name: 'R', label: 'R', refFace: 'R', axis: 0, layerIndex: 1, color: COLOR.R },
      ];
      axes[1].layers = [
        { name: 'D', label: 'D', refFace: 'D', axis: 1, layerIndex: 0, color: '#888888' },
        { name: 'U', label: 'U', refFace: 'U', axis: 1, layerIndex: 1, color: '#d4af37' },
      ];
      axes[2].layers = [
        { name: 'B', label: 'B', refFace: 'B', axis: 2, layerIndex: 0, color: COLOR.B },
        { name: 'F', label: 'F', refFace: 'F', axis: 2, layerIndex: 1, color: COLOR.F },
      ];
    } else if(N === 3){
      axes[0].layers = [
        { name: 'L', label: 'L', refFace: 'L', axis: 0, layerIndex: 0, color: COLOR.L },
        { name: 'M', label: 'M', refFace: 'L', axis: 0, layerIndex: 1, color: '#8e24aa' },
        { name: 'R', label: 'R', refFace: 'R', axis: 0, layerIndex: 2, color: COLOR.R },
      ];
      axes[1].layers = [
        { name: 'D', label: 'D', refFace: 'D', axis: 1, layerIndex: 0, color: '#888888' },
        { name: 'E', label: 'E', refFace: 'D', axis: 1, layerIndex: 1, color: '#8e24aa' },
        { name: 'U', label: 'U', refFace: 'U', axis: 1, layerIndex: 2, color: '#d4af37' },
      ];
      axes[2].layers = [
        { name: 'B', label: 'B', refFace: 'B', axis: 2, layerIndex: 0, color: COLOR.B },
        { name: 'S', label: 'S', refFace: 'F', axis: 2, layerIndex: 1, color: '#8e24aa' },
        { name: 'F', label: 'F', refFace: 'F', axis: 2, layerIndex: 2, color: COLOR.F },
      ];
    } else if(N === 4){
      axes[0].layers = [
        { name: 'L', label: 'L', refFace: 'L', axis: 0, layerIndex: 0, color: COLOR.L },
        { name: '2L', label: '2L', refFace: 'L', axis: 0, layerIndex: 1, color: '#f57c00' },
        { name: '2R', label: '2R', refFace: 'R', axis: 0, layerIndex: 2, color: '#c2185b' },
        { name: 'R', label: 'R', refFace: 'R', axis: 0, layerIndex: 3, color: COLOR.R },
      ];
      axes[1].layers = [
        { name: 'D', label: 'D', refFace: 'D', axis: 1, layerIndex: 0, color: '#888888' },
        { name: '2D', label: '2D', refFace: 'D', axis: 1, layerIndex: 1, color: '#78909c' },
        { name: '2U', label: '2U', refFace: 'U', axis: 1, layerIndex: 2, color: '#fbc02d' },
        { name: 'U', label: 'U', refFace: 'U', axis: 1, layerIndex: 3, color: '#d4af37' },
      ];
      axes[2].layers = [
        { name: 'B', label: 'B', refFace: 'B', axis: 2, layerIndex: 0, color: COLOR.B },
        { name: '2B', label: '2B', refFace: 'B', axis: 2, layerIndex: 1, color: '#388e3c' },
        { name: '2F', label: '2F', refFace: 'F', axis: 2, layerIndex: 2, color: '#0288d1' },
        { name: 'F', label: 'F', refFace: 'F', axis: 2, layerIndex: 3, color: COLOR.F },
      ];
    } else if(N === 5){
      axes[0].layers = [
        { name: 'L', label: 'L', refFace: 'L', axis: 0, layerIndex: 0, color: COLOR.L },
        { name: '2L', label: '2L', refFace: 'L', axis: 0, layerIndex: 1, color: '#f57c00' },
        { name: 'M', label: 'M', refFace: 'L', axis: 0, layerIndex: 2, color: '#8e24aa' },
        { name: '2R', label: '2R', refFace: 'R', axis: 0, layerIndex: 3, color: '#c2185b' },
        { name: 'R', label: 'R', refFace: 'R', axis: 0, layerIndex: 4, color: COLOR.R },
      ];
      axes[1].layers = [
        { name: 'D', label: 'D', refFace: 'D', axis: 1, layerIndex: 0, color: '#888888' },
        { name: '2D', label: '2D', refFace: 'D', axis: 1, layerIndex: 1, color: '#78909c' },
        { name: 'E', label: 'E', refFace: 'D', axis: 1, layerIndex: 2, color: '#8e24aa' },
        { name: '2U', label: '2U', refFace: 'U', axis: 1, layerIndex: 3, color: '#fbc02d' },
        { name: 'U', label: 'U', refFace: 'U', axis: 1, layerIndex: 4, color: '#d4af37' },
      ];
      axes[2].layers = [
        { name: 'B', label: 'B', refFace: 'B', axis: 2, layerIndex: 0, color: COLOR.B },
        { name: '2B', label: '2B', refFace: 'B', axis: 2, layerIndex: 1, color: '#388e3c' },
        { name: 'S', label: 'S', refFace: 'F', axis: 2, layerIndex: 2, color: '#8e24aa' },
        { name: '2F', label: '2F', refFace: 'F', axis: 2, layerIndex: 3, color: '#0288d1' },
        { name: 'F', label: 'F', refFace: 'F', axis: 2, layerIndex: 4, color: COLOR.F },
      ];
    } else if(N === 6){
      axes[0].layers = [
        { name: 'L', label: 'L', refFace: 'L', axis: 0, layerIndex: 0, color: COLOR.L },
        { name: '2L', label: '2L', refFace: 'L', axis: 0, layerIndex: 1, color: '#f57c00' },
        { name: '3L', label: '3L', refFace: 'L', axis: 0, layerIndex: 2, color: '#ffa726' },
        { name: '3R', label: '3R', refFace: 'R', axis: 0, layerIndex: 3, color: '#ec407a' },
        { name: '2R', label: '2R', refFace: 'R', axis: 0, layerIndex: 4, color: '#c2185b' },
        { name: 'R', label: 'R', refFace: 'R', axis: 0, layerIndex: 5, color: COLOR.R },
      ];
      axes[1].layers = [
        { name: 'D', label: 'D', refFace: 'D', axis: 1, layerIndex: 0, color: '#888888' },
        { name: '2D', label: '2D', refFace: 'D', axis: 1, layerIndex: 1, color: '#78909c' },
        { name: '3D', label: '3D', refFace: 'D', axis: 1, layerIndex: 2, color: '#90a4ae' },
        { name: '3U', label: '3U', refFace: 'U', axis: 1, layerIndex: 3, color: '#ffee58' },
        { name: '2U', label: '2U', refFace: 'U', axis: 1, layerIndex: 4, color: '#fbc02d' },
        { name: 'U', label: 'U', refFace: 'U', axis: 1, layerIndex: 5, color: '#d4af37' },
      ];
      axes[2].layers = [
        { name: 'B', label: 'B', refFace: 'B', axis: 2, layerIndex: 0, color: COLOR.B },
        { name: '2B', label: '2B', refFace: 'B', axis: 2, layerIndex: 1, color: '#388e3c' },
        { name: '3B', label: '3B', refFace: 'B', axis: 2, layerIndex: 2, color: '#66bb6a' },
        { name: '3F', label: '3F', refFace: 'F', axis: 2, layerIndex: 3, color: '#29b6f6' },
        { name: '2F', label: '2F', refFace: 'F', axis: 2, layerIndex: 4, color: '#0288d1' },
        { name: 'F', label: 'F', refFace: 'F', axis: 2, layerIndex: 5, color: COLOR.F },
      ];
    }
    return axes;
  }

  function normalizeMove(m){
    if(typeof m === 'string'){
      const info = faceInfo[m];
      return {
        name: m,
        axis: info.axis,
        layerIndex: info.val,
        refFace: m,
        color: COLOR[m] || '#888888'
      };
    }
    return m;
  }

  function applyLayerMoveState(axis, layerIndex, refFace, prime){
    let M = baseMatrix[refFace];
    if(prime) M = transpose(M);

    const N = ORDER;
    const mid = (N - 1) / 2;

    for(const c of cubies){
      if(c.pos[axis] === layerIndex){
        const centered = [c.pos[0] - mid, c.pos[1] - mid, c.pos[2] - mid];
        const rot = matVec(M, centered);
        c.pos = [Math.round(rot[0] + mid), Math.round(rot[1] + mid), Math.round(rot[2] + mid)];
        c.orient = matMul(M, c.orient);
      }
    }
  }

  function planarFlightPathForLayer(fromPt, toPt, sign, axisKey, refFace, fromSlot, toSlot){
    const sameFace = (fromSlot.face === toSlot.face);
    let pivot;
    if(sameFace && (refFace === fromSlot.face)){
      pivot = faceCenterPoint(refFace);
    } else {
      pivot = bundleCenters[axisKey];
    }

    const a1 = Math.atan2(fromPt[1]-pivot[1], fromPt[0]-pivot[0]);
    const a2 = Math.atan2(toPt[1]-pivot[1], toPt[0]-pivot[0]);
    let da = a2 - a1;
    if(sign > 0 && da <= 0) da += 2*Math.PI;
    if(sign < 0 && da >= 0) da -= 2*Math.PI;

    return { center: pivot, da, trackRadius: ptDist(fromPt, pivot) };
  }

  /* ============================================================
     6. Move Execution & Synchronized Animations
     ============================================================ */
  function doMove(moveInput, prime, opts={}, onDone){
    if(animating && !opts.force) return;
    animating = true;
    setControlsDisabled(true);

    const m = normalizeMove(moveInput);
    const { axis, layerIndex, refFace, name, color } = m;
    const isPrime = !!prime;

    if(opts.record !== false){
      moveHistory.push([{ axis, layerIndex, refFace, name, color }, isPrime]);
    }

    const desiredSign = isPrime ? -1 : 1;
    const sign2d = desiredSign;
    const sign3d = -signOf[refFace] * desiredSign;

    const movingIdx = [];
    cubies.forEach((c, idx) => {
      if(c.pos[axis] === layerIndex) movingIdx.push(idx);
    });

    const beforeList = [];
    movingIdx.forEach(idx => {
      const c = cubies[idx];
      Object.keys(c.paint).forEach(key => {
        const slot = getStickerSlot(c, key);
        if(slot) beforeList.push({ idx, key, slot });
      });
    });

    // Move to slice group for 3D rotation
    const movingEls = movingIdx.map(idx => cubieEls[idx]);
    movingEls.forEach(el => sliceGroup.appendChild(el));

    // Update state
    applyLayerMoveState(axis, layerIndex, refFace, isPrime);

    // 2D flight arcs
    const flights = [];
    const N = ORDER;
    const axisKey = AXES3[axis];

    beforeList.forEach(({ idx, key, slot }) => {
      const newSlot = getStickerSlot(cubies[idx], key);
      if(newSlot.face !== slot.face || newSlot.row !== slot.row || newSlot.col !== slot.col){
        const from = faceCoord[slot.face][slot.row][slot.col];
        const to = faceCoord[newSlot.face][newSlot.row][newSlot.col];
        if(from && to){
          const piv = planarFlightPathForLayer(from, to, sign2d, axisKey, refFace, slot, newSlot);
          flights.push({
            idx, key, slot, newSlot,
            from, to,
            center: piv.center, da: piv.da, radius: piv.trackRadius,
            color: COLOR[slot.color]
          });
        }
      }
    });

    // Hide stationary dots while flying
    const hiddenDots = new Set();
    flights.forEach(f => {
      hiddenDots.add(dotEls[f.slot.face][f.slot.row * N + f.slot.col]);
      hiddenDots.add(dotEls[f.newSlot.face][f.newSlot.row * N + f.newSlot.col]);
    });
    hiddenDots.forEach(d => d && (d.style.opacity = '0'));

    const duration = opts.fast ? 150 : 280;
    let pending = 2;

    function checkDone(){
      pending--;
      if(pending === 0){
        render3D();
        render2D();
        animating = false;
        setControlsDisabled(false);
        if(onDone) onDone();
      }
    }

    // 3D Animation
    const start3D = performance.now();
    function frame3D(now){
      const t = Math.min(1, (now - start3D) / duration);
      const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
      sliceGroup.style.transform = rotMatrix3d(axis, sign3d * 90 * ease * Math.PI / 180);
      if(t < 1) requestAnimationFrame(frame3D); else checkDone();
    }
    requestAnimationFrame(frame3D);

    // 2D SVG Flying dots Animation
    const stickerR = Math.max(4.5, 15 - N * 1.8);
    const flyEls = flights.map(f => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', stickerR);
      c.setAttribute('fill', f.color);
      c.setAttribute('class', 'sticker flying');
      svgEl.appendChild(c);
      return { el: c, ...f };
    });

    const start2D = performance.now();
    function frame2D(now){
      const t = Math.min(1, (now - start2D) / duration);
      const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

      flyEls.forEach(f => {
        const a0 = Math.atan2(f.from[1] - f.center[1], f.from[0] - f.center[0]);
        const curAngle = a0 + f.da * ease;
        const x = f.center[0] + f.radius * Math.cos(curAngle);
        const y = f.center[1] + f.radius * Math.sin(curAngle);
        f.el.setAttribute('cx', x);
        f.el.setAttribute('cy', y);
      });

      if(t < 1) requestAnimationFrame(frame2D);
      else {
        flyEls.forEach(f => f.el.remove());
        checkDone();
      }
    }
    requestAnimationFrame(frame2D);
  }

  function runSequence(seq, opts={}, onAllDone){
    let i = 0;
    const moveOpts = { ...opts, record: opts.record !== undefined ? opts.record : false };
    (function step(){
      if(i >= seq.length){
        if(onAllDone) onAllDone();
        return;
      }
      const item = seq[i++];
      const [m, p] = item;
      doMove(m, p, moveOpts, step);
    })();
  }

  function setControlsDisabled(disabled){
    const btns = document.querySelectorAll('.mini-btn, .face-btn, .btn, .order-btn, .layer-turn-btn');
    btns.forEach(b => { if(b) b.disabled = disabled; });
  }

  /* ============================================================
     7. Controls UI & Combo formulas (Adaptive per Order N)
     ============================================================ */
  const controlsRoot = document.getElementById('controls');
  const comboState = { top:'U', face:'F', hand:'right', count:1 };

  function buildComboSeq(top, face, hand){
    if(hand==='right') return [[face,false],[top,false],[face,true],[top,true]];
    return [[face,true],[top,true],[face,false],[top,false]];
  }

  function buildControls(){
    controlsRoot.innerHTML = '';

    // Left Column: Adaptive Single Moves
    const leftCol = document.createElement('div');
    leftCol.className = 'ctrl-col';
    const lTitle = document.createElement('h3');
    lTitle.textContent = window.t('single_turn') + ` (${ORDER}×${ORDER})`;
    leftCol.appendChild(lTitle);

    const layerGroupsContainer = document.createElement('div');
    layerGroupsContainer.className = 'layer-groups-container';

    const axisConfigs = getLayersForOrder(ORDER);

    axisConfigs.forEach(ax => {
      const section = document.createElement('div');
      section.className = 'axis-section';

      const header = document.createElement('div');
      header.className = 'axis-header';
      header.innerHTML = `<span>${window.t(ax.titleKey)}</span><span class="axis-tag">${ax.axisKey}</span>`;
      section.appendChild(header);

      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'layer-cards-grid';

      ax.layers.forEach(layer => {
        const card = document.createElement('div');
        card.className = 'layer-card';

        const badge = document.createElement('span');
        badge.className = 'layer-badge';
        badge.textContent = layer.name;
        badge.style.backgroundColor = layer.color;
        card.appendChild(badge);

        const cwBtn = document.createElement('button');
        cwBtn.className = 'layer-turn-btn';
        cwBtn.textContent = '↻';
        cwBtn.title = layer.name + window.t('cw_title_suffix');
        cwBtn.addEventListener('click', () => doMove(layer, false, { record: true }));
        card.appendChild(cwBtn);

        const ccwBtn = document.createElement('button');
        ccwBtn.className = 'layer-turn-btn prime';
        ccwBtn.textContent = '↺';
        ccwBtn.title = layer.name + window.t('ccw_title_suffix');
        ccwBtn.addEventListener('click', () => doMove(layer, true, { record: true }));
        card.appendChild(ccwBtn);

        cardsGrid.appendChild(card);
      });

      section.appendChild(cardsGrid);
      layerGroupsContainer.appendChild(section);
    });

    leftCol.appendChild(layerGroupsContainer);

    // Right column: Combo formulas
    const rightCol = document.createElement('div');
    rightCol.className = 'ctrl-col';
    const rTitle = document.createElement('h3');
    rTitle.textContent = window.t('combo_op');
    rightCol.appendChild(rTitle);

    const panel = document.createElement('div');
    panel.className = 'combo-panel';

    const topGroup = document.createElement('div');
    topGroup.className = 'combo-opt-group';
    topGroup.innerHTML = `<span class="combo-opt-title">${window.t('grp_top')}</span>`;
    const topRow = document.createElement('div');
    topRow.className = 'combo-opt-row';

    FACES.forEach(f => {
      const b = document.createElement('button');
      b.className = 'opt-btn' + (f === comboState.top ? ' active' : '');
      b.textContent = faceColorName(f);
      b.style.borderColor = COLOR[f];
      b.addEventListener('click', () => {
        comboState.top = f;
        topRow.querySelectorAll('.opt-btn').forEach((btn, i) => btn.classList.toggle('active', FACES[i] === f));
        updateComboDesc();
      });
      topRow.appendChild(b);
    });
    topGroup.appendChild(topRow);
    panel.appendChild(topGroup);

    // Turning Face
    const faceGroup = document.createElement('div');
    faceGroup.className = 'combo-opt-group';
    faceGroup.innerHTML = `<span class="combo-opt-title">${window.t('grp_face')}</span>`;
    const faceRow = document.createElement('div');
    faceRow.className = 'combo-opt-row';

    FACES.forEach(f => {
      const b = document.createElement('button');
      b.className = 'opt-btn' + (f === comboState.face ? ' active' : '');
      b.textContent = faceColorName(f);
      b.style.borderColor = COLOR[f];
      b.addEventListener('click', () => {
        comboState.face = f;
        faceRow.querySelectorAll('.opt-btn').forEach((btn, i) => btn.classList.toggle('active', FACES[i] === f));
        updateComboDesc();
      });
      faceRow.appendChild(b);
    });
    faceGroup.appendChild(faceRow);
    panel.appendChild(faceGroup);

    // Hand direction
    const handGroup = document.createElement('div');
    handGroup.className = 'combo-opt-group';
    handGroup.innerHTML = `<span class="combo-opt-title">${window.t('grp_hand')}</span>`;
    const handRow = document.createElement('div');
    handRow.className = 'combo-opt-row';
    ['left', 'right'].forEach(h => {
      const b = document.createElement('button');
      b.className = 'opt-btn' + (h === comboState.hand ? ' active' : '');
      b.textContent = window.t('opt_' + h);
      b.addEventListener('click', () => {
        comboState.hand = h;
        handRow.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        updateComboDesc();
      });
      handRow.appendChild(b);
    });
    handGroup.appendChild(handRow);
    panel.appendChild(handGroup);

    // Count
    const countGroup = document.createElement('div');
    countGroup.className = 'combo-opt-group';
    countGroup.innerHTML = `<span class="combo-opt-title">${window.t('grp_count')}</span>`;
    const countRow = document.createElement('div');
    countRow.className = 'combo-opt-row';
    [1,2,3,4,5,6].forEach(n => {
      const b = document.createElement('button');
      b.className = 'opt-btn' + (n === comboState.count ? ' active' : '');
      b.textContent = n;
      b.addEventListener('click', () => {
        comboState.count = n;
        countRow.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        updateComboDesc();
      });
      countRow.appendChild(b);
    });
    countGroup.appendChild(countRow);
    panel.appendChild(countGroup);

    // Combo Description
    const descEl = document.createElement('div');
    descEl.className = 'combo-desc';
    panel.appendChild(descEl);

    // Exec button
    const execBtn = document.createElement('button');
    execBtn.className = 'combo-exec';
    execBtn.textContent = window.t('exec_btn');
    execBtn.addEventListener('click', () => {
      if(animating) return;
      if(comboState.top === comboState.face) return;
      const baseSeq = buildComboSeq(comboState.top, comboState.face, comboState.hand);
      let fullSeq = [];
      for(let i=0; i<comboState.count; i++) fullSeq = fullSeq.concat(baseSeq);
      runSequence(fullSeq, { record: true });
    });
    panel.appendChild(execBtn);

    function updateComboDesc(){
      const {top, face, hand, count} = comboState;
      const same = (top === face);
      execBtn.disabled = same;
      if(same){
        descEl.textContent = window.t('combo_same');
        return;
      }
      const seq = buildComboSeq(top, face, hand);
      const oneRound = seq.map(([f,p]) => faceColorName(f) + (p ? "'" : '')).join(' → ');
      descEl.textContent = (hand==='right'? window.t('combo_hand_right') : window.t('combo_hand_left')) + window.t('combo_sep') + oneRound + (count > 1 ? '  ×' + count : '');
    }
    updateComboDesc();

    rightCol.appendChild(panel);
    controlsRoot.appendChild(leftCol);
    controlsRoot.appendChild(rightCol);
  }

  /* ============================================================
     8. Top Actions (Scramble, Undo, Auto-Solve, Order Switch)
     ============================================================ */
  function simplifySequence(seq){
    if(!seq || seq.length === 0) return [];
    const reduced = [];
    for(const item of seq){
      if(!item || !item[0]) continue;
      const m = normalizeMove(item[0]);
      const count = item[1] ? 3 : 1;

      if(reduced.length > 0){
        const last = reduced[reduced.length - 1];
        if(last.move.axis === m.axis && last.move.layerIndex === m.layerIndex){
          const newCount = (last.count + count) % 4;
          if(newCount === 0){
            reduced.pop();
          } else {
            last.count = newCount;
          }
          continue;
        }
      }
      reduced.push({ move: m, count });
    }

    const res = [];
    for(const item of reduced){
      if(item.count === 1){
        res.push([item.move, false]);
      } else if(item.count === 2){
        res.push([item.move, false]);
        res.push([item.move, false]);
      } else if(item.count === 3){
        res.push([item.move, true]);
      }
    }
    return res;
  }

  document.getElementById('scrambleBtn').addEventListener('click', () => {
    if(animating) return;
    const allAxes = getLayersForOrder(ORDER);
    const availableLayers = [];
    allAxes.forEach(ax => ax.layers.forEach(l => availableLayers.push(l)));

    const seq = [];
    let lastKey = null;
    const count = ORDER === 2 ? 8 : (ORDER === 3 ? 14 : 18 + (ORDER - 3) * 4);
    for(let i=0; i<count; i++){
      let layer;
      do {
        layer = availableLayers[Math.floor(Math.random() * availableLayers.length)];
      } while(layer.name === lastKey);
      lastKey = layer.name;
      seq.push([layer, Math.random() < 0.5]);
    }
    runSequence(seq, { fast: true, record: true });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if(animating) return;
    if(moveHistory.length === 0) return;
    const last = moveHistory.pop();
    doMove(last[0], !last[1], { fast: true, record: false });
  });

  const solveBtn = document.getElementById('solveBtn');
  if(solveBtn){
    solveBtn.addEventListener('click', () => {
      if(animating) return;
      if(isSolved()){
        moveHistory = [];
        return;
      }

      let solveSeq = [];
      if(moveHistory.length > 0){
        for(let i = moveHistory.length - 1; i >= 0; i--){
          const m = moveHistory[i];
          if(m && m[0]){
            solveSeq.push([m[0], !m[1]]);
          }
        }
        solveSeq = simplifySequence(solveSeq);
      }

      if(solveSeq.length > 0){
        moveHistory = [];
        runSequence(solveSeq, { fast: true, record: false }, () => {
          if(!isSolved()){
            buildSolved();
            render3D();
            render2D();
          }
        });
      } else {
        moveHistory = [];
        buildSolved();
        render3D();
        render2D();
      }
    });
  }

  // Order Switcher Buttons (2x2, 3x3, 4x4, 5x5, 6x6)
  function setOrder(order){
    if(ORDER === order || animating) return;
    ORDER = order;
    moveHistory = [];

    document.querySelectorAll('.order-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.order) === order);
    });

    computeGeometry();
    buildSolved();
    create2DSvg();
    create3DCube();
    render3D();
    render2D();
    buildControls();
  }

  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setOrder(parseInt(btn.dataset.order));
    });
  });

  /* ============================================================
     9. 3D Camera Orbit Controls
     ============================================================ */
  let dragging=false, lastX=0, lastY=0, yaw=-35, pitch=-24, rafPending=false;
  function setSceneTransform(){
    sceneEl.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
  }
  sceneHitEl.addEventListener('pointerdown', e => {
    e.preventDefault();
    dragging=true; lastX=e.clientX; lastY=e.clientY;
    sceneHitEl.classList.add('grabbing');
    sceneHitEl.setPointerCapture(e.pointerId);
  });
  sceneHitEl.addEventListener('pointermove', e => {
    if(!dragging) return;
    const dx = e.clientX-lastX, dy = e.clientY-lastY;
    lastX=e.clientX; lastY=e.clientY;
    yaw += dx*0.4;
    pitch -= dy*0.4;
    pitch = Math.max(-85, Math.min(85, pitch));
    if(!rafPending){
      rafPending = true;
      requestAnimationFrame(() => { setSceneTransform(); rafPending = false; });
    }
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => {
    sceneHitEl.addEventListener(ev, () => { dragging=false; sceneHitEl.classList.remove('grabbing'); });
  });

  /* ============================================================
     10. Keyboard Shortcuts & Initial Init
     ============================================================ */
  const KEY_MAPS = {
    color: {
      'y':['U',false],'Y':['U',true],
      'w':['D',false],'W':['D',true],
      'g':['B',false],'G':['B',true],
      'b':['F',false],'B':['F',true],
      'r':['R',false],'R':['R',true],
      'o':['L',false],'O':['L',true],
    },
    standard: {
      'u':['U',false],'U':['U',true],
      'd':['D',false],'D':['D',true],
      'f':['F',false],'F':['F',true],
      'b':['B',false],'B':['B',true],
      'r':['R',false],'R':['R',true],
      'l':['L',false],'L':['L',true],
    },
  };
  let activeKeyMap = KEY_MAPS.color;
  const keySchemeSel = document.getElementById('keyScheme');
  const keyHintSpan = document.getElementById('keyHintText');

  keySchemeSel.addEventListener('change', () => {
    activeKeyMap = KEY_MAPS[keySchemeSel.value];
    keyHintSpan.innerHTML = window.t('hint_' + keySchemeSel.value);
  });

  document.addEventListener('keydown', e => {
    if(animating) return;
    if(e.repeat) return;
    const move = activeKeyMap[e.key];
    if(move){
      e.preventDefault();
      doMove(move[0], move[1], { record: true });
    }
  });

  function init(){
    computeGeometry();
    buildSolved();
    create2DSvg();
    create3DCube();
    setSceneTransform();
    render3D();
    render2D();
    buildControls();
  }

  init();

  window.__rebuildControls = buildControls;
  window.__refreshCubeLang = function(){
    FACES.forEach(f => {
      if(faceLabelEls[f]) faceLabelEls[f].textContent = clusterLabelOf(f);
      if(ccwBtns[f]) ccwBtns[f].title = faceColorName(f) + window.t('ccw_title_suffix');
      if(cwBtns[f]) cwBtns[f].title = faceColorName(f) + window.t('cw_title_suffix');
    });
    if(keyHintSpan && keySchemeSel) keyHintSpan.innerHTML = window.t('hint_' + keySchemeSel.value);
  };
})();
