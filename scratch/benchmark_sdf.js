// Benchmark test for Zz before and after
const n = 176;
const g = 22;
const v = 460;

// Setup mock spatial hash with 500 segments
const segments = [];
const hash = new Map();

function Z1(qD, qf) {
  return (qD | 0) * 0x466f45d ^ (qf | 0) * 0x127409f;
}

for (let i = 0; i < 500; i++) {
  const ax = (Math.random() - 0.5) * 2000;
  const ay = Math.random() * 2000;
  const bx = ax + (Math.random() - 0.5) * 50;
  const by = ay + (Math.random() - 0.5) * 50;
  const seg = { ax, ay, bx, by, dead: false, lenSq: (bx-ax)*(bx-ax) + (by-ay)*(by-ay) || 1 };
  segments.push(seg);
  
  const minX = Math.min(ax, bx), maxX = Math.max(ax, bx);
  const minY = Math.min(ay, by), maxY = Math.max(ay, by);
  for (let gy = Math.floor(minY / v); gy <= Math.floor(maxY / v); gy++) {
    for (let gx = Math.floor(minX / v); gx <= Math.floor(maxX / v); gx++) {
      const key = Z1(gx, gy);
      let b = hash.get(key);
      if (!b) { b = []; hash.set(key, b); }
      b.push(seg);
    }
  }
}

// BEFORE
function ZL_old(qD, qf, n0) {
  const n1 = qD.bx - qD.ax, n2 = qD.by - qD.ay, n3 = n1 * n1 + n2 * n2 || 1;
  let n4 = ((qf - qD.ax) * n1 + (n0 - qD.ay) * n2) / n3;
  if (n4 < 0) n4 = 0; else if (n4 > 1) n4 = 1;
  const n5 = qD.ax + n1 * n4, n6 = qD.ay + n2 * n4;
  return { d: Math.hypot(qf - n5, n0 - n6), px: n5, py: n6 };
}
function Z3_old(qD, qf, n0) {
  const n1 = [], n2 = new Set();
  for (let n3 = Math.floor((qf - n0) / v); n3 <= Math.floor((qf + n0) / v); n3++) {
    for (let n4 = Math.floor((qD - n0) / v); n4 <= Math.floor((qD + n0) / v); n4++) {
      const n5 = hash.get(Z1(n4, n3));
      if (!n5) continue;
      for (const n6 of n5) {
        if (!n2.has(n6)) {
          n2.add(n6);
          n1.push(n6);
        }
      }
    }
  }
  return n1;
}
function Zz_old(qD, qf, n0) {
  let n1 = n0;
  const n2 = Z3_old(qD, qf, n0);
  for (const n3 of n2) {
    if (n3.dead) continue;
    const n4 = ZL_old(n3, qD, qf).d;
    if (n4 < n1) n1 = n4;
  }
  return n1;
}

// AFTER (Optimized)
let _globalQueryStamp = 0;
function Zz_new(qD, qf, n0) {
  let minDistSq = n0 * n0;
  const qId = ++_globalQueryStamp;
  const minGX = Math.floor((qD - n0) / v), maxGX = Math.floor((qD + n0) / v);
  const minGY = Math.floor((qf - n0) / v), maxGY = Math.floor((qf + n0) / v);
  for (let gy = minGY; gy <= maxGY; gy++) {
    for (let gx = minGX; gx <= maxGX; gx++) {
      const bucket = hash.get(Z1(gx, gy));
      if (!bucket) continue;
      for (let i = 0; i < bucket.length; i++) {
        const seg = bucket[i];
        if (seg.dead || seg._qs === qId) continue;
        seg._qs = qId;
        const ax = seg.ax, ay = seg.ay, bx = seg.bx, by = seg.by;
        const abx = bx - ax, aby = by - ay;
        const lenSq = seg.lenSq;
        let t = ((qD - ax) * abx + (qf - ay) * aby) / lenSq;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const dx = qD - (ax + abx * t);
        const dy = qf - (ay + aby * t);
        const dSq = dx * dx + dy * dy;
        if (dSq < minDistSq) minDistSq = dSq;
      }
    }
  }
  return Math.sqrt(minDistSq);
}

// Benchmark 1 frame of 22 x 176 = 3,872 points
const startOld = performance.now();
for (let r = 0; r < g; r++) {
  for (let c = 0; c < n; c++) {
    Zz_old(c * 5, r * 5, v);
  }
}
const timeOld = performance.now() - startOld;

const startNew = performance.now();
for (let r = 0; r < g; r++) {
  for (let c = 0; c < n; c++) {
    Zz_new(c * 5, r * 5, v);
  }
}
const timeNew = performance.now() - startNew;

console.log(`OLD implementation: ${timeOld.toFixed(2)} ms per frame slice`);
console.log(`NEW implementation: ${timeNew.toFixed(2)} ms per frame slice`);
console.log(`Speedup: ${(timeOld / timeNew).toFixed(1)}x faster!`);
