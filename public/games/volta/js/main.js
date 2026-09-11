/**
 * VOLTA — Lineman of the Storm
 * Fast 2D Cable Swinger & Thunderstorm Survival in Pixi.js
 */

import { createAudio } from './audio.js';
import { createSDK, normalizeSave } from './sdk.js';

const $ = id => document.getElementById(id);
const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, t) => {
  const k = clamp((t - a) / (b - a), 0, 1);
  return k * k * (3 - 2 * k);
};
const rnd = (min, max) => min + Math.random() * (max - min);
const hexLerp = (c1, c2, t) => {
  const r1 = c1 >> 16, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = c2 >> 16, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
  return (Math.round(lerp(r1, r2, t)) << 16) | (Math.round(lerp(g1, g2, t)) << 8) | Math.round(lerp(b1, b2, t));
};

const INK = 0x1b1a17;
const PAPER = 0xefe3c6;
const ORANGE = 0xe8641b;
const BLUE = 0x2b4c6f;
const WHITE = 0xf7f1e1;
const DH = 720;
const GRAV = 1900;
const ZONE_LEN = 9000;
const PX_PER_M = 10;

const ZONES = [
  {
    name: 'PRAIRIE',
    zh: '草原',
    sky: [0xefe3c6, 0xf3c795, 0xe8964b, 0xe8641b],
    far: 0x2b4c6f,
    mid: 0x223a55,
    ground: 0x1b1a17,
    sun: 0xe8641b,
    sunY: 0.4,
    spacing: [300, 380],
    rain: 0.35,
    stormK: 1.0
  },
  {
    name: 'THE GORGE',
    zh: '峡谷',
    sky: [0xe4d2b4, 0xe2a86f, 0xd07040, 0xb9491f],
    far: 0x3a5a7a,
    mid: 0x24405c,
    ground: 0x1b1a17,
    sun: 0xefe3c6,
    sunY: 0.226,
    spacing: [420, 540],
    rain: 0.5,
    stormK: 1.1
  },
  {
    name: 'RAIL YARD',
    zh: '铁路场',
    sky: [0xc9b896, 0xc48f68, 0xa85a3a, 0x7d3320],
    far: 0x33445a,
    mid: 0x202e40,
    ground: 0x15130f,
    sun: 0xe8641b,
    sunY: 0.44,
    spacing: [260, 360],
    rain: 0.65,
    stormK: 1.2
  },
  {
    name: 'THE PASS',
    zh: '山口',
    sky: [0x8fa3b5, 0x6f8199, 0xd97a3d, 0xe8641b],
    far: 0x3e5a78,
    mid: 0x22344a,
    ground: 0x1b1a17,
    sun: 0xf7f1e1,
    sunY: 0.5,
    spacing: [300, 420],
    rain: 0.85,
    stormK: 1.3
  },
  {
    name: 'NIGHT LINE',
    zh: '夜线',
    sky: [0x1a2536, 0x233a52, 0x2b4c6f, 0x6a3a2a],
    far: 0x141c26,
    mid: 0x0e141b,
    ground: 0x0b0b0a,
    sun: 0xefe3c6,
    sunY: 0.3,
    spacing: [280, 400],
    rain: 1.0,
    stormK: 1.45
  }
];

const ROMAN = u => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][u - 1] || String(u);

let LANG = 'en';
const ZH = {
  'HOLD TO THROW THE LINE · RELEASE TO FLY': '按住 · 抛出缆线 · 松开 · 飞出去',
  'LINEMAN OF THE STORM': '风暴中的架线员',
  'HOLD · THROW THE LINE &nbsp;&nbsp;·&nbsp;&nbsp; RELEASE · FLY &nbsp;&nbsp;·&nbsp;&nbsp; LET GO BEFORE THE BOLT': '按住 · 抛线 &nbsp;&nbsp;·&nbsp;&nbsp; 松开 · 飞 &nbsp;&nbsp;·&nbsp;&nbsp; 闪电落下前放手',
  'hold anywhere to begin': '按住任意处开始',
  'WORKS PROGRESS · RURAL ELECTRIFICATION': '公共事业振兴署 · 乡村电气化',
  'PAUSED': '已暂停',
  'tap to resume · M mute': '点按继续 · M 静音',
  'PLAY AGAIN': '再来一次',
  'STORM': '风暴',
  'GLOVES': '橡胶手套',
  'BEST': '最佳',
  'THE LINE WENT LIVE': '缆线通电了',
  'GRAVITY WON': '重力赢了',
  'THE STORM TOOK THE LINE': '风暴吞掉了线路',
  'RUN OVER': '本次结束',
  'NEW RECORD': '新纪录',
  'ARC DODGE': '闪避电弧',
  'LET GO!': '放手！',
  'NO LINE IN REACH': '够不到线',
  'GLOVES BURNED': '手套烧穿了',
  'GUST': '阵风',
  'ARC DODGES': '闪避电弧',
  'SWINGS': '荡跃',
  'SECTION': '区段',
  'm': '米'
};

const T = str => (LANG === 'zh' && ZH[str]) || str;
const zoneName = z => (LANG === 'zh' ? ZONES[z % 5].zh : ZONES[z % 5].name);

const audio = createAudio();
const sdk = createSDK();
let save = normalizeSave(null);

const G = {
  phase: 'title',
  started: false,
  time: 0,
  dist: 0,
  score: 0,
  zone: 0,
  combo: 0,
  gloves: false,
  dodges: 0,
  swings: 0,
  pickups: 0,
  cause: '',
  dieT: 0,
  gustT: 0,
  gustDir: 0,
  wind: 0,
  flash: 0,
  shake: 0,
  stormX: -900,
  stormSpeed: 150,
  banner: 0,
  best: false,
  hintT: 0,
  lastAttachTower: -1,
  releaseT: -9,
  releaseTower: -1,
  holdRetry: 0
};

const P = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  attached: false,
  ax: 0,
  ay: 0,
  anchor: null,
  len: 0,
  grounded: true,
  angle: 0,
  trail: []
};

let towers = [], anchors = [], pickups = [], floats = [], bolts = [];
let genX = 0, towerSeq = 0;
const input = { hold: false, justHeld: false };
let director = { next: 2.5 };

function zoneAt(x) {
  return Math.max(0, Math.floor(x / ZONE_LEN));
}

function zoneT(x) {
  return (x - zoneAt(x) * ZONE_LEN) / ZONE_LEN;
}

function passRise(x) {
  const z = zoneAt(x) % 5;
  const t = zoneT(x);
  if (z === 3) return -260 * smooth(0.05, 0.85, t) - 40 * Math.sin(t * 19);
  if (z === 4) return -260 * (1 - smooth(0, 0.35, t));
  return 0;
}

function groundY(x) {
  const z = zoneAt(x) % 5;
  const t = zoneT(x);
  let gy = 600 + passRise(x);
  if (z === 0) {
    gy += 22 * Math.sin(x / 640) + 10 * Math.sin(x / 210);
  } else if (z === 1) {
    const r = smooth(0.12, 0.3, t) * (1 - smooth(0.72, 0.9, t));
    gy += r * (560 + 40 * Math.sin(x / 300)) + 14 * Math.sin(x / 400);
  } else if (z === 2) {
    gy += 6 * Math.sin(x / 150);
  } else if (z === 3) {
    gy += 26 * Math.sin(x / 260) + 12 * Math.sin(x / 90);
  } else {
    gy += 30 * Math.sin(x / 520);
  }
  return gy;
}

function lineY(x) {
  return 232 + passRise(x) + 26 * Math.sin(x / 1150) + 10 * Math.sin(x / 430);
}

function addTower(x) {
  const ly = lineY(x);
  const gy = groundY(x);
  const isTwoCross = Math.random() < (zoneAt(x) % 5 === 2 ? 0.55 : 0.3);
  const isRailStep = zoneAt(x) % 5 === 2 && towerSeq % 2 === 1;
  const top = ly - (isRailStep ? 90 : 0);

  const tower = {
    id: towerSeq++,
    x,
    top,
    gy,
    ly,
    two: isTwoCross,
    warn: -9,
    live: -9,
    struck: 0,
    anchors: [],
    g: null
  };

  const addAnchor = (ax, ay, kind) => {
    const anch = { x: ax, y: ay, towers: [tower.id], kind, tower };
    anchors.push(anch);
    tower.anchors.push(anch);
    return anch;
  };

  addAnchor(x - 40, top + 20, 'ins');
  addAnchor(x + 40, top + 20, 'ins');
  addAnchor(x, top - 26, 'peak');
  if (isTwoCross) {
    addAnchor(x - 50, top + 92, 'ins');
    addAnchor(x + 50, top + 92, 'ins');
  }

  towers.push(tower);
  return tower;
}

function catenary(p1, p2, t) {
  const sag = Math.abs(p2.x - p1.x) * 0.075;
  const rx = lerp(p1.x, p2.x, t);
  const ry = lerp(p1.y, p2.y, t) + sag * 4 * t * (1 - t);
  return { x: rx, y: ry };
}

function genTo(targetX) {
  while (genX < targetX) {
    const prev = towers[towers.length - 1];
    const z = ZONES[zoneAt(genX + 100) % 5];
    const spacing = rnd(z.spacing[0], z.spacing[1]);
    const nextX = prev ? prev.x + spacing : 0;
    const curTower = addTower(nextX);
    genX = nextX;

    if (prev) {
      if (Math.random() < 0.5) {
        const midPoint = catenary(prev.anchors[1], curTower.anchors[0], rnd(0.4, 0.6));
        anchors.push({
          x: midPoint.x,
          y: midPoint.y + 6,
          towers: [prev.id, curTower.id],
          kind: 'spacer',
          tower: null
        });
      }

      if (Math.random() < 0.75 && nextX > 700) {
        const count = 3 + Math.floor(Math.random() * 3);
        const yBase = rnd(70, 170);
        const yAmp = rnd(60, 140);
        for (let i = 0; i < count; i++) {
          const s = (i + 1) / (count + 1);
          const cat = catenary(prev.anchors[1], curTower.anchors[0], s);
          const py = cat.y + yBase + yAmp * Math.sin(s * Math.PI);
          if (py < groundY(cat.x) - 70) {
            pickups.push({ x: cat.x, y: py, kind: 'ins', got: false, t: Math.random() * 6 });
          }
        }
      }

      if (nextX > 1800 && Math.floor(nextX / 6000) !== Math.floor(prev.x / 6000)) {
        const cat = catenary(prev.anchors[1], curTower.anchors[0], 0.5);
        pickups.push({
          x: cat.x,
          y: Math.min(cat.y + 150, groundY(cat.x) - 90),
          kind: 'gloves',
          got: false,
          t: 0
        });
      }
    }
  }
}

function pickAnchor() {
  let bestAnch = null;
  let bestScore = 1e9;

  for (const anch of anchors) {
    const dx = anch.x - P.x;
    const dy = anch.y - P.y;
    if (dx < -70 || dx > 480) continue;
    const dist = Math.hypot(dx, dy);
    if (dist < 40 || dist > 470) continue;
    if (dy > 60) continue;

    let score = Math.abs(dist - 320) * 0.6 + Math.max(0, -dx) * 3 + Math.max(0, dy) * 2.5 - dx * 0.35 + Math.max(0, anch.y + dist - (groundY(anch.x) - 60)) * 1.5;
    if (anch.tower && anch.tower.live > G.time - 0.6 && anch.tower.live <= G.time) {
      score += 100000;
    }
    if (bestAnch === null || score < bestScore) {
      bestAnch = anch;
      bestScore = score;
    }
  }
  return bestAnch;
}

const app = new PIXI.Application();
let W = innerWidth, H = innerHeight, zoom = 1, camX = 0, camY = 0;
const L = {};

function makeNoiseTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx2 = c.getContext('2d');
  const img = ctx2.createImageData(256, 256);
  for (let k = 0; k < img.data.length; k += 4) {
    const n = 205 + Math.random() * 50;
    img.data[k] = img.data[k + 1] = img.data[k + 2] = n;
    img.data[k + 3] = 255;
  }
  ctx2.putImageData(img, 0, 0);
  return PIXI.Texture.from(c);
}

function makeVignette() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx2 = c.getContext('2d');
  const grad = ctx2.createRadialGradient(256, 256, 120, 256, 256, 340);
  grad.addColorStop(0, 'rgba(27,26,23,0)');
  grad.addColorStop(1, 'rgba(27,26,23,0.55)');
  ctx2.fillStyle = grad;
  ctx2.fillRect(0, 0, 512, 512);
  return PIXI.Texture.from(c);
}

function makeRainTexture() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 22;
  const ctx2 = c.getContext('2d');
  ctx2.fillStyle = '#f7f1e1';
  ctx2.fillRect(1, 0, 2, 22);
  return PIXI.Texture.from(c);
}

await app.init({
  background: INK,
  antialias: true,
  resolution: Math.min(3, devicePixelRatio || 1),
  autoDensity: true,
  resizeTo: window,
  preference: 'webgl'
});

$('stage').appendChild(app.canvas);

{
  L.sky = new PIXI.Graphics();
  L.far = new PIXI.Container();
  L.mid = new PIXI.Container();
  L.world = new PIXI.Container();
  L.ground = new PIXI.Graphics();
  L.cables = new PIXI.Graphics();
  L.towers = new PIXI.Container();
  L.warn = new PIXI.Graphics();
  L.pick = new PIXI.Graphics();
  L.rope = new PIXI.Graphics();
  L.player = new PIXI.Graphics();
  L.bolt = new PIXI.Graphics();
  L.reticle = new PIXI.Graphics();
  L.floats = new PIXI.Container();

  L.world.addChild(L.cables, L.towers, L.warn, L.pick, L.ground, L.rope, L.player, L.bolt, L.reticle, L.floats);
  L.storm = new PIXI.Graphics();
  L.rain = new PIXI.Container();
  L.flash = new PIXI.Graphics();
  L.paper = new PIXI.TilingSprite({ texture: makeNoiseTexture(), width: W, height: H });
  L.paper.blendMode = 'multiply';
  L.paper.alpha = 0.55;
  L.vig = new PIXI.Sprite(makeVignette());
  L.vig.alpha = 0.9;

  app.stage.addChild(L.sky, L.far, L.mid, L.world, L.storm, L.rain, L.flash, L.paper, L.vig);

  const rt = makeRainTexture();
  L.drops = [];
  for (let i = 0; i < 260; i++) {
    const s = new PIXI.Sprite(rt);
    s.anchor.set(0.5, 0);
    s.alpha = rnd(0.25, 0.6);
    s.scale.set(rnd(0.6, 1.1), rnd(0.7, 1.4));
    s.tint = 0xf7f1e1;
    s._sp = rnd(900, 1500);
    s.x = Math.random() * 3000;
    s.y = Math.random() * 2000;
    L.rain.addChild(s);
    L.drops.push(s);
  }
}

const farChunks = new Map(), midChunks = new Map();

function resize() {
  W = innerWidth;
  H = innerHeight;
  zoom = clamp(Math.min(H / DH, W / (W < H ? 540 : 900)), 0.5, 1.6);
  L.paper.width = W;
  L.paper.height = H;
  L.vig.width = W;
  L.vig.height = H;
}
addEventListener('resize', resize);
resize();

function buildFar(chunkIdx, z) {
  const zone = ZONES[z % 5];
  const g = new PIXI.Graphics();
  const startX = chunkIdx * 1600;
  let cx = startX;
  const polyPts = [startX, 400];

  while (cx < startX + 1600) {
    const w = rnd(60, 200);
    let h;
    if (z % 5 === 3 || z % 5 === 4) h = rnd(120, 300);
    else if (z % 5 === 1) h = rnd(40, 110);
    else h = rnd(6, 30);
    polyPts.push(cx + w * 0.5, 400 - h, cx + w, 400 - h * (z % 5 === 1 ? 1 : rnd(0.2, 0.7)));
    cx += w;
  }
  polyPts.push(cx, 400, cx, 900, startX, 900);
  g.poly(polyPts).fill(zone.far);

  const k = z % 5;
  for (let u = 0; u < 6; u++) {
    const px = startX + rnd(0, 1600);
    if (k === 0) {
      const bh = rnd(70, 130), bw = 34;
      g.rect(px, 400 - bh, bw, bh).fill(zone.far);
      g.circle(px + bw / 2, 400 - bh, bw / 2).fill(zone.far);
      if (u % 2) {
        g.rect(px + 60, 360, 50, 40).fill(zone.far);
        g.poly([px + 55, 360, px + 85, 335, px + 115, 360]).fill(zone.far);
      }
    } else if (k === 2) {
      const bh = rnd(140, 260);
      g.rect(px, 400 - bh, 18, bh).fill(zone.far);
      g.rect(px - 6, 400 - bh, 30, 10).fill(zone.far);
      g.rect(px + 40, 380, 90, 24).fill(zone.far);
      if (u % 3 === 0) {
        g.rect(px + 150, 300, 8, 100).fill(zone.far);
        g.roundRect(px + 130, 270, 48, 40, 8).fill(zone.far);
      }
    } else if (k === 1 && u === 0) {
      g.rect(startX + 700, 300, 260, 100).fill(zone.far);
      for (let f = 0; f < 6; f++) {
        g.rect(startX + 720 + f * 40, 300, 12, 60).fill(hexLerp(zone.far, PAPER, 0.15));
      }
    } else if (k === 4 && u < 3) {
      g.rect(px, rnd(330, 380), rnd(20, 50), 80).fill(zone.far);
    }
  }
  return g;
}

function buildMid(chunkIdx, z) {
  const zone = ZONES[z % 5];
  const g = new PIXI.Graphics();
  const startX = chunkIdx * 1200;
  const polyPts = [startX, 520];

  for (let k = startX; k <= startX + 1200; k += 40) {
    const o = (z % 5 === 3 ? 110 : 34) * (0.5 + 0.5 * Math.sin(k / 260 + chunkIdx)) + 20 * Math.sin(k / 70);
    polyPts.push(k, 520 - o);
  }
  polyPts.push(startX + 1200, 900, startX, 900);
  g.poly(polyPts).fill(zone.mid);

  const k = z % 5;
  for (let u = 0; u < 9; u++) {
    const px = startX + rnd(0, 1200);
    const gy = 520 - 30;
    if (k === 0) {
      if (u % 3 === 0) {
        g.rect(px, gy - 40, 60, 40).fill(zone.mid);
        g.poly([px - 4, gy - 40, px + 30, gy - 62, px + 64, gy - 40]).fill(zone.mid);
      } else {
        g.rect(px, gy - 70, 3, 70).fill(zone.mid);
        for (let x = 0; x < 4; x++) g.rect(px + 1, gy - 70, 22, 3).fill(zone.mid);
      }
    } else if (k === 1) {
      g.poly([px, gy, px + 30, gy - 80, px + 60, gy - 70, px + 90, gy]).fill(zone.mid);
    } else if (k === 2) {
      g.rect(px, gy - 26, 120, 26).fill(zone.mid);
      for (let m = 0; m < 5; m++) g.rect(px + 8 + m * 22, gy - 20, 12, 10).fill(hexLerp(zone.mid, PAPER, 0.25));
      g.rect(px - 20, gy - 14, 14, 14).fill(zone.mid);
    } else if (k === 3) {
      g.poly([px, gy + 30, px + 50, gy - 120, px + 70, gy - 100, px + 120, gy + 30]).fill(zone.mid);
      if (u % 2) g.poly([px + 40, gy - 90, px + 50, gy - 120, px + 60, gy - 95]).fill(hexLerp(zone.mid, PAPER, 0.5));
    } else {
      g.poly([px, gy + 40, px + 60, gy - 90, px + 130, gy + 40]).fill(zone.mid);
    }
  }
  return g;
}

function syncChunks() {
  const sx = camX;
  const viewW = W / zoom;

  const configs = [
    [L.far, farChunks, 1600, 0.18, buildFar],
    [L.mid, midChunks, 1200, 0.42, buildMid]
  ];

  for (const [container, map, chunkWidth, parallax, builder] of configs) {
    const px = sx * parallax;
    const minChunk = Math.floor(px / chunkWidth) - 1;
    const maxChunk = Math.floor((px + viewW) / chunkWidth) + 1;

    for (let c = minChunk; c <= maxChunk; c++) {
      if (!map.has(c)) {
        const worldX = c * chunkWidth / parallax;
        const g = builder(c, zoneAt(worldX + 400));
        map.set(c, g);
        container.addChild(g);
      }
    }
    for (const [c, g] of map) {
      if (c < minChunk - 1 || c > maxChunk + 1) {
        container.removeChild(g);
        g.destroy();
        map.delete(c);
      }
    }
  }
}

function drawTower(t) {
  const g = new PIXI.Graphics();
  const height = t.gy - t.top;
  const groundColor = ZONES[zoneAt(t.x) % 5].ground;
  const baseW = 36 + height * 0.06;
  const topW = 16;

  g.poly([t.x - baseW, t.gy, t.x - topW, t.top, t.x + topW, t.top, t.x + baseW, t.gy]).fill(groundColor);

  const latticeColor = hexLerp(groundColor, PAPER, 0.9);
  const segments = Math.max(2, Math.floor(height / 48));

  for (let i = 0; i < segments; i++) {
    const y0 = i / segments;
    const y1 = (i + 1) / segments;
    const sy = lerp(t.gy, t.top, y0);
    const ey = lerp(t.gy, t.top, y1);
    const w0 = lerp(baseW, topW, y0) - 5;
    const w1 = lerp(baseW, topW, y1) - 5;

    g.moveTo(t.x - w0, sy).lineTo(t.x + w1, ey).moveTo(t.x + w0, sy).lineTo(t.x - w1, ey).stroke({ width: 2.2, color: latticeColor, alpha: 0.55 });
    g.moveTo(t.x - w1, ey).lineTo(t.x + w1, ey).stroke({ width: 2, color: latticeColor, alpha: 0.35 });
  }

  g.rect(t.x - 60, t.top + 2, 120, 8).fill(groundColor);
  g.rect(t.x - 4, t.top - 30, 8, 34).fill(groundColor);
  if (t.two) g.rect(t.x - 70, t.top + 74, 140, 8).fill(groundColor);

  for (const anch of t.anchors) {
    if (anch.kind === 'peak') {
      g.circle(anch.x, anch.y, 6).fill(ORANGE);
      g.circle(anch.x, anch.y, 6).stroke({ width: 2, color: groundColor });
    } else {
      g.rect(anch.x - 3, anch.y - 14, 6, 12).fill(groundColor);
      g.rect(anch.x - 7, anch.y - 7, 14, 4).fill(ORANGE);
      g.rect(anch.x - 7, anch.y - 1, 14, 4).fill(ORANGE);
      g.circle(anch.x, anch.y + 5, 3).fill(groundColor);
    }
  }

  g.x = 0;
  t.g = g;
  L.towers.addChild(g);
}

function cullTowers() {
  const minX = camX - 300;
  const maxX = camX + W / zoom + 300;

  while (towers.length && towers[0].x < minX - 800) {
    const old = towers.shift();
    if (old.g) {
      L.towers.removeChild(old.g);
      old.g.destroy();
    }
    anchors = anchors.filter(a => !a.towers.includes(old.id) || (a.kind === 'spacer' && a.towers[1] !== old.id && a.x > minX - 800));
  }

  for (const t of towers) {
    const isVisible = t.x > minX && t.x < maxX;
    if (isVisible && !t.g) drawTower(t);
    if (t.g) t.g.visible = isVisible;
  }

  pickups = pickups.filter(p => p.x > minX - 200 && !p.got);
}

function resetRun() {
  for (const t of towers) {
    if (t.g) {
      L.towers.removeChild(t.g);
      t.g.destroy();
    }
  }
  towers = [];
  anchors = [];
  pickups = [];
  bolts = [];
  genX = 0;
  towerSeq = 0;

  for (const f of floats) L.floats.removeChild(f.o);
  floats = [];

  Object.assign(G, {
    phase: 'title',
    started: false,
    time: 0,
    dist: 0,
    score: 0,
    zone: 0,
    combo: 0,
    gloves: false,
    dodges: 0,
    swings: 0,
    pickups: 0,
    cause: '',
    dieT: 0,
    gustT: 0,
    gustDir: 0,
    wind: 0,
    flash: 0,
    shake: 0,
    stormX: -1100,
    stormSpeed: 150,
    banner: 0,
    best: false,
    hintT: 0,
    lastAttachTower: -1,
    releaseT: -9,
    releaseTower: -1,
    holdRetry: 0
  });

  genTo(3000);
  const startTower = towers[0];
  Object.assign(P, {
    x: startTower.x,
    y: startTower.top - 2,
    vx: 0,
    vy: 0,
    attached: false,
    anchor: null,
    len: 0,
    grounded: true,
    angle: 0,
    trail: []
  });

  director = { next: 3.2 };
  camX = P.x - W / zoom * 0.38;
  camY = P.y - H / zoom * 0.5;

  sdk.newRun();
  $('poster').classList.add('hidden');
  $('title').style.opacity = 1;
  $('hint').style.opacity = 1;
  $('gloves').classList.add('hidden');
  $('combo').classList.add('hidden');

  hud();
  const tb = $('titleBest');
  if (save.best.score > 0) {
    tb.textContent = `${T('BEST')} ${save.best.score.toLocaleString()} · ${save.best.dist.toLocaleString()} ${T('m')}`;
    tb.classList.remove('hidden');
  } else {
    tb.classList.add('hidden');
  }
}

function begin() {
  if (G.started) return;
  G.started = true;
  G.phase = 'play';
  $('title').style.opacity = 0;
  audio.unlock();
  audio.start();
  sdk.track('start', {});
  save.runs++;
  sdk.save(save);
}

function floatText(x, y, text, color = ORANGE) {
  const label = new PIXI.Text({
    text,
    style: {
      fontFamily: 'Impact, Anton, Arial Narrow, sans-serif',
      fontSize: 30,
      fill: color,
      stroke: { color: INK, width: 5 },
      letterSpacing: 2
    }
  });
  label.anchor.set(0.5);
  label.x = x;
  label.y = y;
  L.floats.addChild(label);
  floats.push({ o: label, t: 0, vy: -60 });
}

function addScore(pts, x, y, label) {
  G.score += pts;
  if (label !== undefined) floatText(x, y, label, ORANGE);
}

function tryAttach() {
  const target = pickAnchor();
  if (!target) {
    if (G.holdRetry <= 0) {
      audio.miss();
      G.holdRetry = 0.35;
      if (G.hintT <= 0) {
        floatText(P.x, P.y - 50, T('NO LINE IN REACH'), PAPER);
        G.hintT = 1.2;
      }
    }
    return false;
  }

  P.attached = true;
  P.anchor = target;
  P.ax = target.x;
  P.ay = target.y;
  P.len = clamp(Math.hypot(target.x - P.x, target.y - P.y), 90, 470);
  P.safeLen = Math.max(110, groundY(target.x) - 80 - target.y);
  P.grounded = false;
  G.swings++;

  if (target.tower) G.lastAttachTower = target.tower.id;
  else G.lastAttachTower = target.towers[0];

  audio.attach();
  return true;
}

function release() {
  if (!P.attached) return;
  P.attached = false;
  G.releaseT = G.time;
  G.releaseTowers = P.anchor.towers.slice();
  P.anchor = null;
  audio.release();

  const speed = Math.hypot(P.vx, P.vy);
  if (speed > 700) {
    audio.whoosh(clamp((speed - 700) / 900, 0, 1));
  }
}

function directorStep(dt) {
  if (G.dist < 220) return;
  director.next -= dt;
  if (director.next > 0) return;

  const prog = clamp(G.dist / 4200, 0, 1);
  director.next = rnd(3 - prog * 1.6, 5 - prog * 2.4);

  const eligible = towers.filter(t => t.x > P.x - 120 && t.x < P.x + 950 && t.warn < G.time - 3);
  if (!eligible.length) return;

  let chosen = null;
  const currentTower = P.attached && P.anchor?.tower ? P.anchor.tower : null;
  const nextTarget = !P.attached ? pickAnchor() : null;

  if (currentTower && Math.random() < 0.35 + prog * 0.3) {
    chosen = currentTower;
  } else if (nextTarget?.tower && Math.random() < 0.45) {
    chosen = nextTarget.tower;
  } else {
    chosen = eligible[Math.floor(Math.random() * eligible.length)];
  }

  if (!eligible.includes(chosen)) chosen = eligible[Math.floor(Math.random() * eligible.length)];

  chosen.warn = G.time;
  chosen.warnDur = 1.05 - prog * 0.3;
  audio.rumble();

  if (Math.random() < prog * 0.5) {
    const others = eligible.filter(t => t !== chosen);
    if (others.length) {
      const second = others[Math.floor(Math.random() * others.length)];
      second.warn = G.time + 0.4;
      second.warnDur = 1 - prog * 0.25;
    }
  }
}

function strike(t) {
  t.live = G.time;
  t.struck++;
  const proximity = clamp(1 - Math.abs(t.x - P.x) / 1400, 0.1, 1);
  G.flash = 0.9 * proximity + 0.25;
  G.shake = 10 * proximity;
  audio.strike(proximity);

  const pts = [[t.x, t.top - 1200]];
  let curX = t.x;
  let curY = t.top - 1200;
  while (curY < t.top - 30) {
    curY += rnd(40, 110);
    curX += rnd(-60, 60);
    pts.push([curX, curY]);
  }
  pts.push([t.x, t.top - 30]);

  bolts.push({
    pts,
    t: 0,
    branches: pts.slice(2, -2).filter(() => Math.random() < 0.4).map(p => [p, [p[0] + rnd(-140, 140), p[1] + rnd(60, 200)]])
  });

  if (G.releaseTowers && G.releaseTowers.includes(t.id) && G.time - G.releaseT < 0.42) {
    G.dodges++;
    save.dodges++;
    const bonus = 200 + G.dodges * 20;
    addScore(bonus, P.x, P.y - 70, `${T('ARC DODGE')} +${bonus}`);
    audio.dodge();
    G.releaseTowers = null;
  }
}

function liveHit(t) {
  if (!P.attached || !P.anchor.towers.includes(t.id)) return;
  if (G.gloves) {
    G.gloves = false;
    $('gloves').classList.add('hidden');
    floatText(P.x, P.y - 60, T('GLOVES BURNED'), PAPER);
    release();
    P.vy -= 350;
    P.vx += 250;
    G.flash = 0.6;
    audio.fried();
    return;
  }
  die('fried');
}

function die(cause) {
  if (G.phase !== 'play') return;
  G.phase = 'dying';
  G.cause = cause;
  G.dieT = 0;
  P.attached = false;
  P.anchor = null;

  if (cause === 'fried') {
    audio.fried();
    P.vx *= 0.3;
    P.vy = -300;
  } else if (cause === 'crash') {
    audio.crash();
    G.shake = 14;
  } else {
    audio.swallowed();
  }
  sdk.track('death', { cause, dist: Math.round(G.dist), score: G.score });
}

function showPoster() {
  G.phase = 'over';
  const isNewRecord = G.score > save.best.score;
  G.best = isNewRecord;

  save.best.score = Math.max(save.best.score, G.score);
  save.best.dist = Math.max(save.best.dist, Math.round(G.dist));
  save.best.zone = Math.max(save.best.zone, G.zone + 1);

  sdk.save(save, true);
  sdk.submitScore(G.score, {
    dist: Math.round(G.dist),
    zone: G.zone + 1,
    dodges: G.dodges,
    swings: G.swings,
    cause: G.cause
  });

  $('posterKick').textContent = isNewRecord ? T('NEW RECORD') : T('RUN OVER');
  $('posterMast').textContent = G.cause === 'fried' ? T('THE LINE WENT LIVE') : G.cause === 'crash' ? T('GRAVITY WON') : T('THE STORM TOOK THE LINE');
  $('posterScore').textContent = G.score.toLocaleString();
  $('posterStats').innerHTML = `${Math.round(G.dist).toLocaleString()} ${T('m')} · ${T('SECTION')} ${ROMAN(G.zone + 1)} ${zoneName(G.zone)}<br>${G.swings} ${T('SWINGS')} · ${G.dodges} ${T('ARC DODGES')}`;
  $('posterBest').textContent = `${T('BEST')} ${save.best.score.toLocaleString()} · ${save.best.dist.toLocaleString()} ${T('m')}`;
  $('btn-again').textContent = T('PLAY AGAIN');
  $('poster').classList.remove('hidden');
}

function step(dt) {
  G.time += dt;
  if (G.holdRetry > 0) G.holdRetry -= dt;
  if (G.hintT > 0) G.hintT -= dt;

  const curZone = ZONES[G.zone % 5];
  if (G.phase === 'play') {
    const stormProg = clamp(G.dist / 4000, 0, 1);
    G.stormSpeed = lerp(340, 640, stormProg) * curZone.stormK * (1 + Math.max(0, G.zone - 4) * 0.06);
    G.stormX += G.stormSpeed * dt;
    if (G.stormX < P.x - 1100) G.stormX = P.x - 1100;

    if (G.gustT > 0) {
      G.gustT -= dt;
      G.wind = lerp(G.wind, G.gustDir, 4 * dt);
    } else {
      G.wind = lerp(G.wind, 0, 2 * dt);
      if (G.dist > 700 && Math.random() < dt * (0.08 + curZone.rain * 0.12)) {
        G.gustT = 1.3;
        G.gustDir = (Math.random() < 0.5 ? -1 : 1) * rnd(0.6, 1.0);
        audio.gust();
        floatText(P.x, P.y - 90, T('GUST') + (G.gustDir > 0 ? ' →' : ' ←'), PAPER);
      }
    }

    if (input.hold) {
      if (!P.attached && G.holdRetry <= 0) tryAttach();
    } else if (P.attached) {
      release();
    }

    if (P.attached) {
      P.len = Math.max(110, P.len - (P.len > P.safeLen ? 300 : 55) * dt);
      if (P.grounded) P.grounded = false;
    }

    if (!P.grounded) {
      P.vy += GRAV * dt;
      P.vx += G.wind * 260 * dt;
      P.vx *= 1 - 0.02 * dt;
      P.vy *= 1 - 0.02 * dt;
      P.x += P.vx * dt;
      P.y += P.vy * dt;

      if (P.attached) {
        const dx = P.x - P.ax;
        const dy = P.y - P.ay;
        const dist = Math.hypot(dx, dy);
        if (dist > P.len) {
          const nx = dx / dist;
          const ny = dy / dist;
          P.x = P.ax + nx * P.len;
          P.y = P.ay + ny * P.len;
          const dot = P.vx * nx + P.vy * ny;
          if (dot > 0) {
            P.vx -= dot * nx;
            P.vy -= dot * ny;
          }
        }
      }

      const gy = groundY(P.x);
      if (P.y > gy - 6) die('crash');
      if (P.y < -900) {
        P.y = -900;
        P.vy = Math.max(0, P.vy);
      }
    }

    if (P.x - G.stormX < 20) die('storm');
    G.dist = Math.max(G.dist, P.x / PX_PER_M);

    const zoneIdx = zoneAt(P.x);
    if (zoneIdx !== G.zone) {
      G.zone = zoneIdx;
      banner(ROMAN(zoneIdx + 1), zoneName(zoneIdx));
      audio.zone();
      sdk.track('zone', { zone: zoneIdx + 1, score: G.score });
    }

    for (const item of pickups) {
      if (item.got) continue;
      const dist = Math.hypot(item.x - P.x, item.y - P.y);
      if (dist < 34) {
        item.got = true;
        if (item.kind === 'ins') {
          G.combo++;
          G.pickups++;
          G.comboT = G.time;
          const pts = 50 + Math.min(10, G.combo) * 10;
          addScore(pts, item.x, item.y - 20, `+${pts}`);
          audio.pickup(G.combo);
          $('combo').textContent = `×${G.combo}`;
          $('combo').classList.remove('hidden');
        } else {
          G.gloves = true;
          $('gloves').classList.remove('hidden');
          floatText(item.x, item.y - 30, T('GLOVES'), PAPER);
          audio.gloves();
        }
      }
    }

    if (G.combo > 0 && G.time - G.comboT > 5) {
      G.combo = 0;
      $('combo').classList.add('hidden');
    }

    directorStep(dt);

    for (const t of towers) {
      if (t.warn > 0 && t.warn <= G.time && t.live < t.warn && G.time - t.warn >= (t.warnDur || 1)) {
        strike(t);
      }
      if (t.live > 0 && G.time - t.live < 0.55) {
        liveHit(t);
      }
    }

    genTo(P.x + 2600);
    if (P.x > 400 && G.hintT === 0) {
      $('hint').style.opacity = 0;
      G.hintT = -1;
    }
  } else if (G.phase === 'dying') {
    G.dieT += dt;
    if (G.cause !== 'storm') {
      P.vy += GRAV * dt;
      P.x += P.vx * dt;
      P.y += P.vy * dt;
      const gy = groundY(P.x);
      if (P.y > gy - 8) {
        P.y = gy - 8;
        P.vx *= 0.8;
        P.vy = 0;
      }
    } else {
      P.x -= 120 * dt;
    }
    if (G.dieT > 1.3) showPoster();
  }

  for (const b of bolts) b.t += dt;
  bolts = bolts.filter(b => b.t < 0.28);

  for (const f of floats) {
    f.t += dt;
    f.o.y += f.vy * dt;
    f.o.alpha = 1 - smooth(0.7, 1.2, f.t);
  }
  floats = floats.filter(f => {
    if (f.t > 1.2) {
      L.floats.removeChild(f.o);
      f.o.destroy();
      return false;
    }
    return true;
  });

  G.flash = Math.max(0, G.flash - dt * 2.2);
  G.shake = Math.max(0, G.shake - dt * 30);

  if (G.banner > 0) {
    G.banner -= dt;
    if (G.banner <= 0) $('banner').classList.add('hidden');
  }

  const lookAhead = clamp(P.vx * 0.25, -60, 160);
  const targetCamX = P.x - W / zoom * (W < H ? 0.3 : 0.38) + lookAhead;
  const targetCamY = P.y - H / zoom * 0.52;

  camX = lerp(camX, targetCamX, 1 - Math.pow(0.001, dt));
  camY = lerp(camY, targetCamY, 1 - Math.pow(0.01, dt));
  camY = Math.min(camY, groundY(P.x) + 120 - H / zoom);
  camY = Math.max(camY, -700);
}

function banner(kicker, main) {
  $('bannerKick').textContent = kicker;
  $('bannerMain').textContent = main;
  const el = $('banner');
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  G.banner = 2.4;
}

function renderSky() {
  const zoneIdx = G.zone;
  const t = zoneT(P.x);
  const z1 = ZONES[zoneIdx % 5];
  const z2 = ZONES[(zoneIdx + 1) % 5];
  const blend = smooth(0.85, 1, t);
  const skyColors = z1.sky.map((c, i) => hexLerp(c, z2.sky[i], blend));

  const g = L.sky;
  g.clear();

  const stops = [0, 0.3, 0.46, 0.58, 1];
  for (let i = 0; i < 4; i++) {
    g.rect(0, H * stops[i], W, H * (stops[i + 1] - stops[i]) + 1).fill(skyColors[i]);
  }

  const sunColor = hexLerp(z1.sun, z2.sun, blend);
  const sunY = lerp(z1.sunY, z2.sunY, blend);
  const sunX = W * 0.72 - (camX * 0.02) % (W * 0.5);
  const sunR = Math.min(W, H) * 0.13;
  const sunPosY = H * sunY;

  if (zoneIdx % 5 !== 4) {
    const rayLen = Math.hypot(W, H) * 1.2;
    const rayCount = 18;
    const rayRot = G.time * 0.02;
    for (let i = 0; i < rayCount; i++) {
      if (i % 2) continue;
      const a1 = rayRot + (i / rayCount) * Math.PI * 2;
      const a2 = rayRot + ((i + 0.6) / rayCount) * Math.PI * 2;
      g.poly([sunX, sunPosY, sunX + Math.cos(a1) * rayLen, sunPosY + Math.sin(a1) * rayLen, sunX + Math.cos(a2) * rayLen, sunPosY + Math.sin(a2) * rayLen]).fill({ color: PAPER, alpha: 0.07 });
    }
    g.circle(sunX, sunPosY, sunR).fill(sunColor);
    for (let i = 0; i < 3; i++) {
      g.rect(sunX - sunR * 1.4, sunPosY + sunR * 0.2 + i * sunR * 0.28, sunR * 2.8, sunR * 0.09).fill(skyColors[i + 1]);
    }
  } else {
    g.circle(sunX, sunPosY, sunR * 0.6).fill(sunColor);
    g.circle(sunX + sunR * 0.25, sunPosY - sunR * 0.15, sunR * 0.5).fill(skyColors[0]);
    for (let i = 0; i < 14; i++) {
      const starX = (((i * 431 + 77) % W - (camX * 0.01) % W + W) % W);
      g.circle(starX, (i * 197) % (H * 0.4), 1.5 + (i % 3)).fill({ color: PAPER, alpha: 0.6 });
    }
  }

  const cloudColor = hexLerp(skyColors[0], skyColors[1], 0.5);
  for (let i = 0; i < 6; i++) {
    const cw = 120 + (i * 97) % 160;
    const ch = cw * 0.22;
    const cx = (((i * 613 + 200 - camX * (0.03 + i * 0.006) - G.time * 12) % (W + cw * 2) + W + cw * 2) % (W + cw * 2)) - cw;
    const cy = H * (0.05 + (i * 0.37) % 0.22);
    g.roundRect(cx, cy, cw, ch, ch / 2).fill(cloudColor);
    g.roundRect(cx + cw * 0.25, cy - ch * 0.5, cw * 0.45, ch * 0.9, ch * 0.45).fill(cloudColor);
  }

  L.far.x = -camX * 0.18 * zoom;
  L.far.y = H * 0.5 - 400 * zoom - camY * 0.05 * zoom;
  L.far.scale.set(zoom);

  L.mid.x = -camX * 0.42 * zoom;
  L.mid.y = H * 0.62 - 520 * zoom - camY * 0.12 * zoom;
  L.mid.scale.set(zoom);
}

function renderWorld() {
  const shakeOffset = G.shake;
  const sx = shakeOffset ? rnd(-shakeOffset, shakeOffset) : 0;
  const sy = shakeOffset ? rnd(-shakeOffset, shakeOffset) : 0;

  L.world.scale.set(zoom);
  L.world.x = -camX * zoom + sx;
  L.world.y = -camY * zoom + sy;

  const leftX = camX - 100;
  const rightX = camX + W / zoom + 100;
  const curZone = ZONES[G.zone % 5];

  // Ground
  const gGround = L.ground;
  gGround.clear();
  const groundPoly = [leftX, groundY(leftX)];
  for (let x = leftX; x <= rightX; x += 24) groundPoly.push(x, groundY(x));
  groundPoly.push(rightX, groundY(rightX), rightX, camY + H / zoom + 400, leftX, camY + H / zoom + 400);
  gGround.poly(groundPoly).fill(curZone.ground);

  for (let x = Math.floor(leftX / 90) * 90; x < rightX; x += 90) {
    const gy = groundY(x);
    gGround.rect(x, gy - 6, 40 + (x % 7) * 3, 3).fill(hexLerp(curZone.ground, PAPER, 0.25));
  }

  // Cables
  const gCables = L.cables;
  gCables.clear();
  for (let i = 0; i + 1 < towers.length; i++) {
    const t1 = towers[i];
    const t2 = towers[i + 1];
    if (t2.x < leftX || t1.x > rightX) continue;

    const isLive = (t1.live > 0 && G.time - t1.live < 0.55) || (t2.live > 0 && G.time - t2.live < 0.55);
    const isWarn = (t1.warn > 0 && t1.warn <= G.time && t1.live < t1.warn) || (t2.warn > 0 && t2.warn <= G.time && t2.live < t2.warn);

    const wirePairs = [
      [t1.anchors[0], t2.anchors[0]],
      [t1.anchors[1], t2.anchors[1]],
      [t1.anchors[2], t2.anchors[2]]
    ];
    if (t1.two && t2.two) {
      wirePairs.push([t1.anchors[3], t2.anchors[3]], [t1.anchors[4], t2.anchors[4]]);
    }

    for (const [a1, a2] of wirePairs) {
      gCables.moveTo(a1.x, a1.y);
      for (let s = 1; s <= 14; s++) {
        const cat = catenary(a1, a2, s / 14);
        gCables.lineTo(cat.x, cat.y);
      }
      gCables.stroke({ width: isLive ? 5 : 2.4, color: isLive ? ORANGE : curZone.ground, alpha: 1 });

      if (isLive) {
        gCables.moveTo(a1.x, a1.y);
        for (let s = 1; s <= 14; s++) {
          const cat = catenary(a1, a2, s / 14);
          gCables.lineTo(cat.x + rnd(-3, 3), cat.y + rnd(-3, 3));
        }
        gCables.stroke({ width: 1.6, color: WHITE });
      } else if (isWarn && Math.sin(G.time * 55) > 0) {
        gCables.moveTo(a1.x, a1.y);
        for (let s = 1; s <= 14; s++) {
          const cat = catenary(a1, a2, s / 14);
          gCables.lineTo(cat.x, cat.y);
        }
        gCables.stroke({ width: 1.2, color: WHITE, alpha: 0.6 });
      }
    }
  }

  // Warning & Sparks
  const gWarn = L.warn;
  gWarn.clear();
  for (const anch of anchors) {
    if (anch.kind !== 'spacer' || anch.x < leftX || anch.x > rightX) continue;
    gWarn.circle(anch.x, anch.y, 7).fill(ORANGE);
    gWarn.circle(anch.x, anch.y, 7).stroke({ width: 2, color: curZone.ground });
    gWarn.circle(anch.x, anch.y, 2.5).fill(curZone.ground);
  }

  for (const t of towers) {
    if (t.x < leftX || t.x > rightX) continue;
    if (t.warn > 0 && t.warn <= G.time && t.live < t.warn) {
      const prog = (G.time - t.warn) / (t.warnDur || 1);
      if (Math.sin(G.time * (30 + prog * 60)) > -0.2) {
        for (const anch of t.anchors) {
          gWarn.circle(anch.x, anch.y, 10 + prog * 8).stroke({ width: 3, color: WHITE, alpha: 0.9 });
          for (let i = 0; i < 3; i++) {
            const ang = rnd(0, 6.28);
            const rad = rnd(8, 22 + prog * 20);
            gWarn.moveTo(anch.x, anch.y).lineTo(anch.x + Math.cos(ang) * rad, anch.y + Math.sin(ang) * rad).stroke({ width: 2, color: WHITE });
          }
        }
      }
    }

    if (t.live > 0 && G.time - t.live < 0.55) {
      for (const anch of t.anchors) {
        for (let i = 0; i < 4; i++) {
          const ang = rnd(0, 6.28);
          const rad = rnd(10, 40);
          gWarn.moveTo(anch.x, anch.y).lineTo(anch.x + Math.cos(ang) * rad, anch.y + Math.sin(ang) * rad).stroke({ width: 2.5, color: i % 2 ? WHITE : ORANGE });
        }
      }
    }
  }

  // Pickups
  const gPick = L.pick;
  gPick.clear();
  for (const p of pickups) {
    if (p.got || p.x < leftX || p.x > rightX) continue;
    p.t += 0.016;
    const floatOffset = Math.sin(p.t * 3) * 4;

    if (p.kind === 'ins') {
      gPick.circle(p.x, p.y + floatOffset, 11).fill(ORANGE);
      gPick.circle(p.x, p.y + floatOffset, 11).stroke({ width: 3, color: INK });
      gPick.rect(p.x - 7, p.y + floatOffset - 2, 14, 4).fill(INK);
      gPick.rect(p.x - 3, p.y + floatOffset - 16, 6, 8).fill(INK);
    } else {
      gPick.roundRect(p.x - 13, p.y + floatOffset - 16, 26, 32, 6).fill(WHITE);
      gPick.roundRect(p.x - 13, p.y + floatOffset - 16, 26, 32, 6).stroke({ width: 3, color: INK });
      gPick.rect(p.x - 13, p.y + floatOffset + 6, 26, 5).fill(ORANGE);
      gPick.circle(p.x, p.y + floatOffset - 30, 5).fill(ORANGE);
    }
  }

  // Aim Reticle
  const gRet = L.reticle;
  gRet.clear();
  if (G.phase === 'play' && !P.attached) {
    const target = pickAnchor();
    if (target) {
      const pulse = 1 + 0.15 * Math.sin(G.time * 8);
      gRet.circle(target.x, target.y, 16 * pulse).stroke({ width: 3, color: ORANGE, alpha: 0.9 });
      gRet.circle(target.x, target.y, 16 * pulse).stroke({ width: 1, color: PAPER, alpha: 0.6 });
      if (input.hold) {
        gRet.moveTo(P.x, P.y - 10).lineTo(target.x, target.y).stroke({ width: 1.5, color: PAPER, alpha: 0.35 });
      }
    }
  }

  // Swinger Rope
  const gRope = L.rope;
  gRope.clear();
  if (P.attached) {
    const dx = P.ax - P.x;
    const dy = P.ay - P.y;
    const dist = Math.hypot(dx, dy);
    const sag = Math.max(0, P.len - dist) * 0.5;

    gRope.moveTo(P.x, P.y - 12);
    gRope.quadraticCurveTo((P.x + P.ax) / 2 + (dy / dist) * sag * 0.2, (P.y + P.ay) / 2 + sag + 8, P.ax, P.ay);
    gRope.stroke({ width: 3, color: INK });

    gRope.moveTo(P.x, P.y - 12);
    gRope.quadraticCurveTo((P.x + P.ax) / 2 + (dy / dist) * sag * 0.2, (P.y + P.ay) / 2 + sag + 8, P.ax, P.ay);
    gRope.stroke({ width: 1, color: ORANGE, alpha: 0.8 });
    gRope.circle(P.ax, P.ay, 5).fill(ORANGE);
  }

  renderPlayer();

  // Lightning Bolts
  const gBolt = L.bolt;
  gBolt.clear();
  for (const b of bolts) {
    const normT = b.t / 0.28;
    const thick = 9 * (1 - normT) + 3;

    const drawBoltSegment = (path, width) => {
      gBolt.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) {
        gBolt.lineTo(path[i][0] + rnd(-2, 2), path[i][1]);
      }
      gBolt.stroke({ width: width * 2.2, color: ORANGE, alpha: 0.9 * (1 - normT) });

      gBolt.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) {
        gBolt.lineTo(path[i][0], path[i][1]);
      }
      gBolt.stroke({ width, color: WHITE, alpha: 1 - normT * 0.6 });
    };

    drawBoltSegment(b.pts, thick);
    for (const br of b.branches) drawBoltSegment(br, thick * 0.5);
  }

  cullTowers();
}

function renderPlayer() {
  const g = L.player;
  g.clear();
  const px = P.x, py = P.y;
  const isDying = G.phase === 'dying';
  const isFried = isDying && G.cause === 'fried';
  const bodyColor = isFried && Math.sin(G.time * 60) > 0 ? WHITE : INK;
  const accentColor = isFried && Math.sin(G.time * 60) > 0 ? WHITE : ORANGE;

  let angle = 0;
  if (P.attached) {
    angle = Math.atan2(P.ax - px, -(P.ay - py)) * 0.5 + clamp(P.vx / 1600, -0.5, 0.5);
  } else if (!P.grounded) {
    angle = clamp(P.vx / 1400, -0.7, 0.7) + clamp(P.vy / 3000, -0.3, 0.3);
  }

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const rot = (lx, ly) => [px + lx * cosA - ly * sinA, py + lx * sinA + ly * cosA];

  const drawLimb = (p1, p2, width, color) => {
    const s = rot(p1[0], p1[1]);
    const e = rot(p2[0], p2[1]);
    g.moveTo(s[0], s[1]).lineTo(e[0], e[1]).stroke({ width, color: color || bodyColor, cap: 'round' });
  };

  drawLimb([0, -6], [0, -26], 7);

  const stepT = G.time * 10;
  if (P.grounded) {
    drawLimb([0, -6], [-5, 12], 5);
    drawLimb([0, -6], [6, 12], 5);
    drawLimb([0, -22], [-9, -8], 4.5);
    drawLimb([0, -22], [12, -30], 4.5);
  } else if (P.attached) {
    const sway = Math.sin(stepT) * 3;
    drawLimb([0, -6], [-8 + sway, 12], 5);
    drawLimb([0, -6], [9 - sway, 10], 5);

    const dx = P.ax - px, dy = P.ay - py;
    const dist = Math.hypot(dx, dy);
    const hand = [px + (dx / dist) * 16, py - 12 + (dy / dist) * 16];
    g.moveTo(...rot(0, -22)).lineTo(hand[0], hand[1]).stroke({ width: 4.5, color: bodyColor, cap: 'round' });
    g.moveTo(...rot(0, -20)).lineTo(hand[0] - 4, hand[1] + 6).stroke({ width: 4.5, color: bodyColor, cap: 'round' });
  } else if (isDying && G.cause !== 'fried') {
    drawLimb([0, -6], [-10, 8], 5);
    drawLimb([0, -6], [10, 6], 5);
    drawLimb([0, -22], [-14, -14], 4.5);
    drawLimb([0, -22], [14, -16], 4.5);
  } else {
    const speed = clamp(Math.hypot(P.vx, P.vy) / 1200, 0, 1);
    drawLimb([0, -6], [-12 * speed - 3, 10], 5);
    drawLimb([0, -6], [10, 12 - 4 * speed], 5);
    drawLimb([0, -22], [-16, -34 + 10 * speed], 4.5);
    drawLimb([0, -22], [16, -36], 4.5);
  }

  const headPos = rot(0, -34);
  g.circle(headPos[0], headPos[1], 6.5).fill(bodyColor);

  const capPos = rot(0, -39);
  g.roundRect(capPos[0] - 9, capPos[1] - 3, 18, 6, 2).fill(accentColor);
  g.circle(capPos[0], capPos[1] - 1, 7).fill(accentColor);

  const beltPos = rot(0, -8);
  g.rect(beltPos[0] - 5, beltPos[1] - 2, 10, 3).fill(accentColor);
}

function renderScreen(dt) {
  const gStorm = L.storm;
  gStorm.clear();

  const stormScreenX = (G.stormX - camX) * zoom;
  const stormFront = stormScreenX + 40;

  if (stormFront > -200) {
    const poly1 = [-200, -200, stormFront, -200];
    for (let y = -200; y <= H + 200; y += 46) {
      const wave = Math.sin(y * 0.021 + G.time * 1.3) * 26 + Math.sin(y * 0.077 - G.time * 2.1) * 12;
      poly1.push(stormFront + wave + (y % 92 === 0 ? 30 : 0), y);
    }
    poly1.push(-200, H + 200);
    gStorm.poly(poly1).fill({ color: 0x10151c, alpha: 0.94 });

    const poly2 = [-200, -200, stormFront - 90, -200];
    for (let y = -200; y <= H + 200; y += 46) {
      const wave = Math.sin(y * 0.031 + G.time * 1.1) * 30;
      poly2.push(stormFront - 90 + wave, y);
    }
    poly2.push(-200, H + 200);
    gStorm.poly(poly2).fill({ color: 0x0a0d12, alpha: 0.9 });

    for (let y = 0; y < H; y += 36) {
      const wave = Math.sin(y * 0.021 + G.time * 1.3) * 26;
      gStorm.rect(stormFront + wave - 46, y, 34, 4).fill({ color: BLUE, alpha: 0.5 });
    }
  }

  const curZone = ZONES[G.zone % 5];
  const windAngle = 0.35 + G.wind * 0.6;
  const stormProximity = clamp(1 - (P.x - G.stormX) / 1500, 0, 1);
  const rainIntensity = clamp(curZone.rain * 0.5 + stormProximity * 0.5, 0.45, 1.0);

  for (let i = 0; i < L.drops.length; i++) {
    const drop = L.drops[i];
    drop.visible = i < L.drops.length * rainIntensity;
    drop.rotation = -windAngle;
    drop.y += Math.cos(windAngle) * drop._sp * dt;
    drop.x += Math.sin(windAngle) * drop._sp * dt - P.vx * 0.15 * dt * zoom;

    if (drop.y > H + 40) {
      drop.y = -40 - Math.random() * 200;
      drop.x = Math.random() * (W + 400) - 200;
    }
    if (drop.x > W + 60) drop.x -= W + 120;
    if (drop.x < -60) drop.x += W + 120;
  }

  const gFlash = L.flash;
  gFlash.clear();
  if (G.flash > 0) {
    gFlash.rect(0, 0, W, H).fill({ color: PAPER, alpha: Math.min(1, G.flash) * 0.9 });
  }

  const proximityAudio = clamp(1 - (P.x - G.stormX) / 1200, 0, 1);
  audio.setEnv(
    rainIntensity,
    Math.abs(G.wind) + proximityAudio * 0.3,
    P.attached || !P.grounded ? clamp(Math.hypot(P.vx, P.vy) / 1400, 0, 1) : 0,
    towers.some(t => t.warn > 0 && t.warn <= G.time && t.live < t.warn && Math.abs(t.x - P.x) < 700)
  );
}

let hudTimer = 0;
function hud() {
  $('dist').textContent = `${Math.round(G.dist).toLocaleString()} ${T('m')}`;
  $('score').textContent = G.score.toLocaleString();
  $('zone').textContent = `${ROMAN(G.zone + 1)} · ${zoneName(G.zone)}`;

  const gap = Math.max(0, (P.x - G.stormX) / PX_PER_M);
  $('stormGap').textContent = `${Math.round(gap)} ${T('m')}`;
  $('stormFill').style.width = `${clamp(gap / 110, 0, 1) * 100}%`;
  $('storm').classList.toggle('danger', gap < 40);
  $('stormLbl').textContent = T('STORM');
  $('gloves').textContent = T('GLOVES');
}

function onDown(e) {
  if (e.target.closest && e.target.closest('button, a')) return;
  if (G.phase === 'over') return;
  if (G.phase === 'paused') {
    togglePause();
    return;
  }
  audio.unlock();
  input.hold = true;
  if (!G.started) begin();
}

function onUp() {
  input.hold = false;
}

addEventListener('pointerdown', onDown);
addEventListener('pointerup', onUp);
addEventListener('pointercancel', onUp);

addEventListener('keydown', e => {
  if (e.repeat) return;
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    e.preventDefault();
    if (G.phase === 'over') {
      restart();
      return;
    }
    onDown({ target: document.body });
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    togglePause();
  } else if (e.code === 'KeyM') {
    toggleMute();
  } else if (e.code === 'KeyR' && G.phase === 'over') {
    restart();
  }
});

addEventListener('keyup', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    onUp();
  }
});

function togglePause() {
  if (G.phase === 'play') {
    G.phase = 'paused';
    $('paused').classList.remove('hidden');
    audio.setEnv(0, 0, 0, false);
  } else if (G.phase === 'paused') {
    G.phase = 'play';
    $('paused').classList.add('hidden');
  }
}

function toggleMute() {
  save.muted = !save.muted;
  audio.unlock();
  audio.setMuted(save.muted);
  $('btn-mute').textContent = save.muted ? '×' : '♪';
  sdk.save(save);
}

function setLang(l) {
  LANG = l;
  save.lang = l;
  sdk.save(save);

  $('btn-lang').textContent = l === 'zh' ? 'EN' : '中';
  $('hint').textContent = T('HOLD TO THROW THE LINE · RELEASE TO FLY');
  document.querySelector('#title .sub').textContent = T('LINEMAN OF THE STORM');
  document.querySelector('#title .meta').innerHTML = T('HOLD · THROW THE LINE &nbsp;&nbsp;·&nbsp;&nbsp; RELEASE · FLY &nbsp;&nbsp;·&nbsp;&nbsp; LET GO BEFORE THE BOLT');
  document.querySelector('#title .tip').textContent = T('hold anywhere to begin');
  document.querySelector('#title .kick').textContent = T('WORKS PROGRESS · RURAL ELECTRIFICATION');
  $('paused').firstElementChild.textContent = T('PAUSED');
  $('paused').lastElementChild.textContent = T('tap to resume · M mute');
  $('btn-again').textContent = T('PLAY AGAIN');
  hud();
  if (G.phase === 'over') showPoster();
}

function restart() {
  resetRun();
  audio.ui();
}

$('btn-pause').addEventListener('click', e => {
  e.stopPropagation();
  if (G.phase === 'play' || G.phase === 'paused') togglePause();
});

$('btn-mute').addEventListener('click', e => {
  e.stopPropagation();
  toggleMute();
});

$('btn-lang').addEventListener('click', e => {
  e.stopPropagation();
  setLang(LANG === 'zh' ? 'en' : 'zh');
});

$('btn-again').addEventListener('click', e => {
  e.stopPropagation();
  restart();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    sdk.flush();
    if (G.phase === 'play') togglePause();
  }
});

addEventListener('pagehide', () => sdk.flush());

let accumulator = 0;
let lastFrameTime = performance.now();
const FIXED_STEP = 1 / 120;

app.ticker.add(() => {
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  if (G.phase === 'play' || G.phase === 'dying') {
    accumulator += dt;
    let loops = 0;
    while (accumulator >= FIXED_STEP && loops < 12) {
      step(FIXED_STEP);
      accumulator -= FIXED_STEP;
      loops++;
    }
  }

  syncChunks();
  renderSky();
  renderWorld();
  renderScreen(dt);
  audio.tick();

  hudTimer += dt;
  if (hudTimer > 0.1) {
    hudTimer = 0;
    hud();
  }
});

resetRun();
sdk.ready();

sdk.load().then(loaded => {
  if (loaded) {
    save = loaded;
    audio.setMuted(save.muted);
    $('btn-mute').textContent = save.muted ? '×' : '♪';
  }
  if (!loaded || !loaded.updatedAt) {
    if (/^zh/i.test(navigator.language || '')) save.lang = 'zh';
  }
  if (save.lang === 'zh') setLang('zh');
  resetRun();
}).catch(() => {});