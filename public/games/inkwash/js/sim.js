export function mulberry32(q) {
  let Z = q >>> 0;
  return function () {
    ((Z |= 0), (Z = (Z + 0x6d2b79f5) | 0));
    let e = Math.imul(Z ^ (Z >>> 15), 1 | Z);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 0x100000000
    );
  };
}
const TAU = Math.PI * 2,
  norm = (q) => {
    while (q > Math.PI) q -= TAU;
    while (q < -Math.PI) q += TAU;
    return q;
  };
export function createSim(q = {}) {
  ((Z = q.grid || BAL.grid),
    (e = Z * Z),
    (D = mulberry32(q.seed ?? 1)),
    (f = BAL.tickMs / 0x3e8),
    (b = new Uint8Array(e)),
    (p = new Uint8Array(e)),
    (c = []),
    (V = new Uint16Array(11)),
    (m = {
      tick: 0,
      round: 1,
      phase: "playing",
      timeLeft: q.roundSec ?? BAL.roundSec,
      phaseLeft: 0,
      frenzy: ![],
      grid: b,
      trail: p,
      players: c,
      counts: V,
      G: Z,
      N: e,
      events: [],
    }),
    (l = (k, M) => (M | 0) * Z + (k | 0)),
    (g = (k, M) => k >= 0 && M >= 0 && k < Z && M < Z),
    (K = (x) => l(x.x, x.y)));
  function t(x) {
    const qp = qb;
    m.events[qp(476)](x);
  }
  function o(x) {
    const qc = qb;
    return (
      BAL[qc(543)] +
      Math[qc(492)](BAL[qc(544)], V[x[qc(528)] + 1] * BAL[qc(548)])
    );
  }
  function Y(x = {}) {
    const qV = qb;
    let k = c[qV(527)]((a) => !a);
    k === -1 && ((k = c[qV(529)]), c[qV(476)](null));
    if (k >= 10) return null;
    const M = {
      slot: k,
      id: x.id ?? "p" + k,
      name: x[qV(518)] || qV(490) + (k + 1),
      colorIdx: x[qV(459)] ?? k,
      skin: x.skin || qV(522),
      bot: x[qV(530)] || null,
      x: 0,
      y: 0,
      angle: 0,
      targetAngle: 0,
      boost: ![],
      ink: BAL[qV(543)],
      alive: ![],
      trailCells: [],
      lastCell: -1,
      kills: 0,
      deaths: 0,
      bestBp: 0,
      claims: 0,
      spawnProtUntil: 0,
      respawnAt: -1,
      spectating: ![],
    };
    return ((c[k] = M), M);
  }
  function B(x) {
    const qm = qb,
      k = c[x];
    if (!k) return;
    if (k[qm(539)]) W(k, qm(552), null);
    c[x] = null;
  }
  function J(k, M) {
    let a = 0,
      E = 0;
    for (let X = -4; X <= 4; X++)
      for (let v = -4; v <= 4; v++) {
        const C = k + v,
          Q = M + X;
        if (!g(C, Q)) continue;
        E++;
        if (b[l(C, Q)] !== 0) a++;
      }
    return E ? a / E : 1;
  }
  function L() {
    const ql = qb;
    let k = null,
      M = -1;
    for (let a = 0; a < 40; a++) {
      const E = BAL[ql(497)],
        X = E + D() * (Z - E * 2),
        v = E + D() * (Z - E * 2);
      let C = 0x3b9aca00;
      for (const q0 of c) {
        if (!q0 || !q0[ql(539)]) continue;
        const q1 = Math[ql(460)](q0.x - X, q0.y - v);
        if (q1 < C) C = q1;
      }
      const Q = Math.min(C, BAL[ql(557)] * 1.5) - J(X, v) * 20;
      Q > M && ((M = Q), (k = { x: X, y: v }));
    }
    return k;
  }
  function j(k, M, a, E) {
    const qg = qb,
      X = [];
    for (let v = Math.floor(a - E); v <= a + E; v++) {
      for (let C = Math[qg(488)](M - E); C <= M + E; C++) {
        if (!g(C, v)) continue;
        if ((C + 0.5 - M) ** 2 + (v + 0.5 - a) ** 2 > E * E) continue;
        const Q = l(C, v);
        (d(Q, k.slot + 1), X[qg(476)](Q));
      }
    }
    return X;
  }
  function h(x) {
    const k = L();
    R(x, k.x, k.y);
  }
  function R(k, M, a) {
    const qK = qb;
    ((k.x = M),
      (k.y = a),
      (k[qK(545)] = k[qK(514)] = D() * TAU - Math.PI),
      (k[qK(539)] = !![]),
      (k[qK(489)] = ![]),
      (k.boost = ![]),
      (k[qK(484)].length = 0),
      (k[qK(499)] = K(k)),
      (k.spawnProtUntil = m[qK(517)] + Math.round(BAL[qK(483)] / f)),
      (k.respawnAt = -1));
    const E = j(k, k.x, k.y, BAL[qK(546)]);
    ((k.ink = o(k)),
      t({ t: qK(531), slot: k[qK(528)], x: k.x, y: k.y, cells: E }));
  }
  function d(x, k) {
    const M = b[x];
    if (M === k) return;
    if (M) V[M]--;
    if (k) V[k]++;
    b[x] = k;
  }
  function I(x) {
    for (const k of x.trailCells) if (p[k] === x.slot + 1) p[k] = 0;
    x.trailCells.length = 0;
  }
  function W(x, k, M) {
    const qt = qb;
    if (!x[qt(539)]) return;
    ((x[qt(539)] = ![]), x[qt(511)]++, I(x));
    const a = [],
      E = x.slot + 1;
    for (let v = 0; v < e; v++) b[v] === E && (d(v, 0), a.push(v));
    t({
      t: qt(520),
      slot: x[qt(528)],
      cause: k,
      by: M?.[qt(528)] ?? null,
      x: x.x,
      y: x.y,
      cells: a,
    });
    M &&
      M.alive &&
      (M.kills++,
      (M[qt(541)] = Math[qt(492)](o(M), M[qt(541)] + BAL[qt(487)])),
      t({ t: qt(471), killer: M[qt(528)], victim: x.slot }));
    const X = m[qt(458)] === "playing" && m[qt(512)] > BAL[qt(556)];
    if (X) x[qt(538)] = m[qt(517)] + Math.round(BAL[qt(494)] / f);
    else ((x[qt(538)] = -1), (x[qt(489)] = !![]));
  }
  const u = new Uint8Array(e),
    U = new Int32Array(e);
  function r(k) {
    const qo = qb,
      M = k.slot + 1,
      a = [];
    for (const v of k.trailCells) {
      if (p[v] === M) p[v] = 0;
      b[v] !== M && (d(v, M), a[qo(476)](v));
    }
    ((k[qo(484)][qo(529)] = 0), u[qo(555)](0));
    let E = 0;
    const X = (C) => {
      !u[C] && b[C] !== M && ((u[C] = 1), (U[E++] = C));
    };
    for (let C = 0; C < Z; C++) {
      (X(l(C, 0)), X(l(C, Z - 1)));
    }
    for (let Q = 0; Q < Z; Q++) {
      (X(l(0, Q)), X(l(Z - 1, Q)));
    }
    while (E > 0) {
      const q0 = U[--E],
        q1 = q0 % Z,
        q2 = (q0 / Z) | 0;
      if (q1 > 0) X(q0 - 1);
      if (q1 < Z - 1) X(q0 + 1);
      if (q2 > 0) X(q0 - Z);
      if (q2 < Z - 1) X(q0 + Z);
    }
    for (let q3 = 0; q3 < e; q3++) {
      !u[q3] && b[q3] !== M && (d(q3, M), a[qo(476)](q3));
    }
    (a.length &&
      (k[qo(535)]++,
      t({
        t: qo(466),
        slot: k[qo(528)],
        cells: a,
        area: a[qo(529)],
        ox: k.x,
        oy: k.y,
      })),
      (k[qo(523)] = Math[qo(486)](k[qo(523)], bp(V[M]))));
  }
  function w(x, k, M) {
    const qY = qb,
      a = x[qY(528)] + 1,
      E = p[k],
      X = m.tick < x[qY(480)];
    if (E && E !== a) {
      const v = c[E - 1];
      v && v[qY(539)] && !X && m.tick >= v[qY(480)] && M.push([v, qY(471), x]);
    } else {
      if (E === a && !X) {
        const C = x[qY(484)][qY(516)](k);
        if (C !== -1 && x[qY(484)].length - C > BAL[qY(467)]) {
          M[qY(476)]([x, qY(537), null]);
          return;
        }
      }
    }
    if (b[k] === a) {
      if (x[qY(484)][qY(529)]) r(x);
    } else {
      if (p[k] === 0) p[k] = a;
      if (x[qY(484)][x[qY(484)][qY(529)] - 1] !== k) x.trailCells[qY(476)](k);
    }
  }
  function H(x, k) {
    const qB = qb,
      M = norm(x[qB(514)] - x[qB(545)]),
      a = BAL[qB(521)] * f;
    x[qB(545)] =
      Math[qB(507)](M) <= a
        ? x.targetAngle
        : norm(x[qB(545)] + Math[qB(524)](M) * a);
    const E = b[K(x)] !== x.slot + 1 || x.trailCells[qB(529)] > 0,
      X = x[qB(541)] <= 0 && E,
      C = x[qB(496)] && !X;
    let Q = BAL.speed;
    if (C) Q *= BAL[qB(479)];
    if (X) Q *= BAL[qB(553)];
    if (E) {
      let q2 = BAL[qB(532)];
      if (C) q2 += m[qB(547)] ? 0 : BAL[qB(475)];
      x[qB(541)] = Math.max(0, x[qB(541)] - q2 * f);
    } else x.ink = Math[qB(492)](o(x), x[qB(541)] + BAL[qB(526)] * f);
    let q0 = Q * f;
    const q1 = 0.45;
    while (q0 > 0 && x[qB(539)]) {
      const q3 = Math[qB(492)](q1, q0);
      ((q0 -= q3),
        (x.x = Math.min(
          Z - 0.51,
          Math[qB(486)](0.51, x.x + Math[qB(493)](x.angle) * q3),
        )),
        (x.y = Math.min(
          Z - 0.51,
          Math[qB(486)](0.51, x.y + Math[qB(462)](x[qB(545)]) * q3),
        )));
      const q4 = K(x);
      if (q4 === x[qB(499)]) continue;
      const q5 = x[qB(499)] % Z,
        q6 = (x[qB(499)] / Z) | 0,
        q7 = q4 % Z,
        q8 = (q4 / Z) | 0;
      if (q5 !== q7 && q6 !== q8) {
        const q9 = l(q7, q6);
        w(x, q9, k);
        if (!x.alive || k[qB(472)](([qq]) => qq === x)) {
          x.lastCell = q9;
          break;
        }
      }
      (w(x, q4, k), (x[qB(499)] = q4));
      if (k[qB(472)](([qq]) => qq === x)) break;
    }
  }
  function A() {
    const qJ = qb;
    return c[qJ(482)](Boolean)
      [qJ(554)]((x) => ({
        slot: x[qJ(528)],
        name: x.name,
        colorIdx: x[qJ(459)],
        bot: !!x[qJ(530)],
        cells: V[x[qJ(528)] + 1],
        bp: bp(V[x.slot + 1]),
        kills: x.kills,
        bestBp: x[qJ(523)],
        score: bp(V[x.slot + 1]) + x[qJ(485)] * BAL[qJ(513)],
      }))
      [qJ(495)]((x, k) => k.score - x[qJ(550)]);
  }
  function P() {
    const qL = qb;
    ((m[qL(458)] = qL(540)),
      (m.phaseLeft = BAL[qL(501)]),
      t({ t: qL(525), placements: A(), round: m[qL(465)] }));
  }
  function y() {
    const qj = qb;
    (b[qj(555)](0), p.fill(0), V.fill(0));
    for (const x of c) {
      if (!x) continue;
      ((x[qj(539)] = ![]),
        (x.trailCells[qj(529)] = 0),
        (x[qj(485)] = 0),
        (x[qj(511)] = 0),
        (x[qj(523)] = 0),
        (x[qj(535)] = 0),
        (x.spectating = ![]),
        (x.respawnAt = -1));
    }
    (m[qj(465)]++,
      (m.phase = "playing"),
      (m.timeLeft = q[qj(549)] ?? BAL[qj(549)]),
      (m[qj(547)] = ![]));
    for (const k of c) if (k) h(k);
    t({ t: qj(503), round: m[qj(465)] });
  }
  function T() {
    const qh = qb;
    m[qh(512)] -= f;
    !m[qh(547)] &&
      m[qh(512)] <= BAL[qh(477)] &&
      ((m[qh(547)] = !![]), t({ t: qh(547) }));
    const x = [];
    for (const E of c) {
      if (!E) continue;
      if (!E.alive) {
        if (E[qh(538)] >= 0 && m.tick >= E[qh(538)]) h(E);
        continue;
      }
      if (!E[qh(519)]) H(E, x);
    }
    const k = c[qh(482)]((X) => X && X[qh(539)]);
    for (let X = 0; X < k[qh(529)]; X++) {
      for (let v = X + 1; v < k[qh(529)]; v++) {
        const C = k[X],
          Q = k[v];
        if (Math.hypot(C.x - Q.x, C.y - Q.y) > BAL.headOnDist) continue;
        if (m.tick < C.spawnProtUntil || m[qh(517)] < Q[qh(480)]) continue;
        const q0 = b[K(C)] === C[qh(528)] + 1 && C[qh(484)][qh(529)] === 0,
          q1 = b[K(Q)] === Q[qh(528)] + 1 && Q[qh(484)][qh(529)] === 0;
        if (q0 && !q1) x[qh(476)]([Q, "headon", C]);
        else {
          if (q1 && !q0) x[qh(476)]([C, qh(478), Q]);
          else
            !q0 &&
              !q1 &&
              (x.push([C, qh(478), Q]), x[qh(476)]([Q, qh(478), C]));
        }
      }
    }
    const M = new Set();
    for (const [q2, q3, q4] of x) {
      if (M.has(q2[qh(528)])) continue;
      (M[qh(491)](q2[qh(528)]),
        W(q2, q3, q4 && M[qh(536)](q4.slot) ? null : q4));
    }
    if (m.timeLeft <= 0) P();
  }
  function s() {
    const qR = qb;
    ((m[qR(500)] = []), m.tick++);
    if (m[qR(458)] === qR(509)) T();
    else {
      m[qR(542)] -= f;
      if (m[qR(542)] <= 0) y();
    }
    return m[qR(500)];
  }
  function i() {
    const qd = qb,
      x = [];
    let k = b[0],
      M = 0;
    for (let a = 0; a < e; a++) {
      if (b[a] === k) M++;
      else (x[qd(476)](M, k), (k = b[a]), (M = 1));
    }
    return (x.push(M, k), x);
  }
  function F(x) {
    const qI = qb;
    (b[qI(555)](0), V[qI(555)](0));
    let M = 0;
    for (let a = 0; a < x[qI(529)]; a += 2) {
      const E = x[a],
        X = x[a + 1];
      for (let v = 0; v < E; v++) {
        if (X) V[X]++;
        ((b[M] = X), M++);
      }
    }
  }
  function O() {
    const qW = qb;
    return {
      tick: m[qW(517)],
      round: m[qW(465)],
      phase: m[qW(458)],
      timeLeft: Math[qW(465)](m.timeLeft * 100) / 100,
      phaseLeft: Math[qW(465)](m.phaseLeft * 100) / 100,
      frenzy: m[qW(547)],
      g: i(),
      tr: c[qW(482)](Boolean)[qW(554)]((x) => [x[qW(528)], ...x.trailCells]),
      ps: c[qW(554)](
        (x) =>
          x && {
            slot: x[qW(528)],
            id: x.id,
            name: x.name,
            colorIdx: x[qW(459)],
            skin: x[qW(502)],
            bot: x[qW(530)],
            x: Math[qW(465)](x.x * 100) / 100,
            y: Math[qW(465)](x.y * 100) / 100,
            angle: Math.round(x.angle * 0x3e8) / 0x3e8,
            boost: x.boost,
            ink: Math[qW(465)](x[qW(541)] * 10) / 10,
            alive: x.alive,
            kills: x[qW(485)],
            deaths: x[qW(511)],
            bestBp: x[qW(523)],
            claims: x[qW(535)],
            spawnProtUntil: x[qW(480)],
            respawnAt: x[qW(538)],
            spectating: x[qW(489)],
          },
      ),
    };
  }
  function n(x) {
    const qu = qb;
    ((m[qu(517)] = x.tick),
      (m.round = x[qu(465)]),
      (m[qu(458)] = x[qu(458)]),
      (m[qu(512)] = x[qu(512)]),
      (m[qu(542)] = x[qu(542)]),
      (m[qu(547)] = x.frenzy),
      F(x.g),
      p[qu(555)](0),
      (c[qu(529)] = 0));
    for (const M of x.ps) {
      if (!M) {
        c.push(null);
        continue;
      }
      const a = { targetAngle: M[qu(545)], trailCells: [], lastCell: -1, ...M };
      ((a[qu(499)] = l(a.x, a.y)), c[qu(476)](a));
    }
    for (const E of x.tr) {
      const X = c[E[0]];
      if (!X) continue;
      for (let v = 1; v < E[qu(529)]; v++) {
        X[qu(484)].push(E[v]);
        if (p[E[v]] === 0) p[E[v]] = X.slot + 1;
      }
    }
  }
  function z() {
    const qU = qb;
    let x = 0x811c9dc5 >>> 0;
    for (let k = 0; k < e; k++) {
      ((x ^= b[k]), (x = Math[qU(515)](x, 0x1000193)));
    }
    for (const M of c) {
      if (!M) continue;
      ((x ^= Math[qU(465)](M.x * 100)),
        (x = Math[qU(515)](x, 0x1000193)),
        (x ^= Math[qU(465)](M.y * 100)),
        (x = Math[qU(515)](x, 0x1000193)),
        (x ^= M.trailCells[qU(529)]),
        (x = Math[qU(515)](x, 0x1000193)));
    }
    return x >>> 0;
  }
  return {
    S: m,
    BAL: BAL,
    dt: f,
    addPlayer: Y,
    removePlayer: B,
    spawn: h,
    spawnAt(k, M, a) {
      const E = c[k];
      if (E) R(E, M, a);
    },
    setInput(x, k) {
      const qr = qb,
        M = c[x];
      if (!M) return;
      if (typeof k[qr(545)] === qr(506) && isFinite(k[qr(545)]))
        M.targetAngle = norm(k[qr(545)]);
      if (typeof k.boost === qr(470)) M[qr(496)] = k[qr(496)];
    },
    tick: s,
    placements: A,
    snapshot: O,
    applySnapshot: n,
    hashGrid: z,
    rleGrid: i,
    idx: l,
    inb: g,
    cellOf: K,
    maxInkOf: o,
    rng: D,
  };
}
