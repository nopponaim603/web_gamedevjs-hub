const perf = () => performance.now(),
  sdk = () => window.AIGameShare || null;
export function sdkReady(q = 0x1f40) {
  return new Promise((Z) => {
    const e = perf(),
      D = () => {
        if (sdk()?.multiplayer) return Z(!![]);
        if (perf() - e > q) return Z(![]);
        setTimeout(D, 120);
      };
    D();
  });
}
export function fetchInvite(q = 0x9c4) {
  return new Promise((Z) => {
    let e = ![];
    const D = "inv-" + Math.random().toString(36).slice(2),
      f = (p, c) => {
        const qh = qj;
        if (e) return;
        ((e = !![]),
          window[qh(403)](qh(377), b),
          Z({ room: p || null, pageUrl: c || null }));
      },
      b = (p) => {
        const qR = qj,
          c = p[qR(455)];
        if (!c || c[qR(511)] !== qR(471) || c.requestId !== D) return;
        f(
          typeof c[qR(478)] === qR(414) ? c[qR(478)] : null,
          typeof c.pageUrl === qR(414) ? c[qR(491)] : null,
        );
      };
    window.addEventListener("message", b);
    try {
      window.parent.postMessage(
        { type: "aigameshare:invite.get", requestId: D },
        "*",
      );
    } catch {
      return f(null, null);
    }
    setTimeout(() => f(null, null), q);
  });
}
function createSendQueue(Z, e = 22) {
  const D = [];
  let f = e,
    b = null;
  const p = setInterval(() => {
    ((f = e), c());
  }, 0x3e8);
  function c() {
    while (D.length && f > 0) {
      f--;
      const { d: V, to: m } = D.shift();
      try {
        Z.send(V, m);
      } catch {}
    }
    D.length &&
      !b &&
      (b = setTimeout(() => {
        ((b = null), c());
      }, 120));
  }
  return {
    push(V, m) {
      (D.push({ d: V, to: m }), c());
    },
    dispose() {
      clearInterval(p);
      if (b) clearTimeout(b);
      D.length = 0;
    },
    get backlog() {
      return D.length;
    },
  };
}
const CHUNK = 700;
export async function createNetRoom({ mode: q, code: Z, name: e, skin: D }) {
  const qU = _ottp5c6_qJ,
    f = sdk()?.[qU(396)];
  if (!f) throw new Error(qU(465));
  let b = null;
  if (q === qU(385))
    b = await f[qU(430)]({ maxPlayers: BAL[qU(423)], name: e });
  else {
    if (q === qU(357)) b = await f[qU(486)](Z, { name: e });
    else {
      if (q === qU(447)) {
        if (typeof f.quickMatch === qU(487))
          b = await f.quickMatch({ name: e, maxPlayers: BAL[qU(423)] });
        else throw new Error(qU(481));
      }
    }
  }
  if (!b) throw new Error(qU(421));
  const p = {
      kind: qU(401),
      code: b.code,
      get seat() {
        const qr = qU;
        return b[qr(370)];
      },
      get isHost() {
        const qw = qU;
        return b[qw(448)];
      },
      players: b[qU(363)] || [],
      events: [],
      onLobby: null,
      onStarted: null,
      onHumans: null,
      onDropToLocal: null,
      humanCount: (b.players || [])[qU(495)]((S) => S.connected)[qU(504)],
      mySlot: -1,
    },
    c = createSendQueue(b),
    V = [];
  let m = ![],
    l = b[qU(468)] === "playing",
    g = null,
    K = null;
  const t = new Map(),
    o = new Map();
  let Y = 0,
    B = 0,
    J = 0;
  const L = new Map();
  function j(S) {
    const qH = qU;
    g = createSim({ seed: (Math[qH(512)]() * 0x3b9aca00) | 0 });
    if (S?.sim) {
      g[qH(372)](S.sim);
      if (S[qH(445)]) {
        for (const [q1, q2] of S[qH(445)]) t[qH(498)](q1, q2);
      }
      const q0 = new Set(
        (b[qH(363)] || [])
          [qH(495)]((q3) => q3[qH(420)])
          .map((q3) => q3[qH(370)]),
      );
      for (const q3 of [...t[qH(497)]()]) {
        if (!q0[qH(392)](q3)) {
          const q4 = t[qH(424)](q3);
          t[qH(416)](q3);
          const q5 = g.S[qH(363)][q4];
          q5 && (q5[qH(485)] = personaFor(q4));
        }
      }
      p[qH(456)] = !![];
    } else {
      for (let q6 = 0; q6 < BAL[qH(382)]; q6++) {
        g[qH(438)]({
          name: BAL[qH(434)][(q6 * 5) % BAL.botNames.length],
          bot: personaFor(q6),
          colorIdx: q6,
          skin: qH(376),
        });
      }
      for (const q7 of g.S[qH(363)]) if (q7) g[qH(409)](q7);
    }
    ((K = createBotPool(g, (Math.random() * 0xf4240) | 0)),
      h(b[qH(370)], { name: e, skin: D }, !![]));
    for (const q8 of b[qH(363)] || []) {
      if (q8[qH(370)] !== b[qH(370)] && q8.connected)
        h(q8[qH(370)], { name: q8[qH(503)] }, ![]);
    }
    ((p.mySlot = t.get(b.seat)), W());
  }
  function h(S, q0, q1) {
    const qA = qU;
    if (t[qA(392)](S)) {
      const q5 = g.S[qA(363)][t[qA(424)](S)];
      if (q5 && q0?.[qA(503)]) q5[qA(503)] = q0[qA(503)];
      if (q5 && q0?.[qA(418)]) q5[qA(418)] = q0[qA(418)];
      return t[qA(424)](S);
    }
    let q2 = -1,
      q3 = 0x3b9aca00;
    for (const q6 of g.S[qA(363)]) {
      if (!q6 || !q6[qA(485)]) continue;
      const q7 = q6[qA(417)] ? g.S[qA(353)][q6[qA(390)] + 1] : -1;
      q7 < q3 && ((q3 = q7), (q2 = q6[qA(390)]));
    }
    if (q2 === -1) return -1;
    const q4 = g.S[qA(363)][q2];
    ((q4[qA(485)] = null),
      (q4[qA(503)] = (q0?.name || "P" + S)[qA(405)](0, 14)));
    if (q0?.skin) q4[qA(418)] = q0[qA(418)];
    return (t[qA(498)](S, q2), W(), u(), q2);
  }
  function I(S) {
    const qN = qU,
      q0 = t.get(S);
    if (q0 === undefined) return;
    t[qN(416)](S);
    const q1 = g?.S.players[q0];
    (q1 &&
      ((q1[qN(485)] = personaFor(q0)),
      (q1[qN(503)] = BAL[qN(434)][(q0 * 5 + 3) % BAL[qN(434)][qN(504)]]),
      (q1[qN(418)] = "drop")),
      W(),
      u());
  }
  function W() {
    const qP = qU;
    K?.[qP(437)]();
  }
  function u() {
    const qy = qU;
    if (!b[qy(448)] || !g) return;
    const S = [...t[qy(474)]()],
      q0 = g.S[qy(363)]
        [qy(495)](Boolean)
        [qy(457)]((q1) => [
          q1[qy(390)],
          q1[qy(503)],
          q1[qy(389)],
          q1[qy(418)],
          q1[qy(485)] ? 1 : 0,
        ]);
    c[qy(433)]({ k: "ro", roster: S, meta: q0 });
  }
  function U(S, q0, q1) {
    const qT = qU;
    for (let q2 = 0; q2 < q1[qT(504)]; q2 += CHUNK) {
      c[qT(433)]({
        ...q0,
        k: S,
        cells: q1[qT(405)](q2, q2 + CHUNK),
        fin: q2 + CHUNK >= q1.length ? 1 : 0,
      });
    }
    if (q1[qT(504)] === 0) c[qT(433)]({ ...q0, k: S, cells: [], fin: 1 });
  }
  function r(S, q0) {
    const qs = qU;
    for (const q1 of S) {
      if (q1.t === qs(361))
        U(
          "cl",
          { slot: q1[qs(390)], ox: q1.ox, oy: q1.oy, area: q1[qs(359)] },
          q1.cells,
        );
      else {
        if (q1.t === qs(429))
          U(
            "de",
            {
              slot: q1[qs(390)],
              x: q1.x,
              y: q1.y,
              cause: q1[qs(473)],
              by: q1.by,
            },
            q1[qs(466)],
          );
        else {
          if (q1.t === qs(508))
            U("rs", { slot: q1.slot, x: q1.x, y: q1.y }, q1.cells);
          else {
            if (q1.t === "cut")
              c[qs(433)]({ k: "ct", killer: q1[qs(419)], victim: q1[qs(404)] });
            else {
              if (q1.t === qs(356)) c[qs(433)]({ k: "fz" });
              else {
                if (q1.t === "roundEnd")
                  c[qs(433)]({
                    k: "re",
                    placements: q1[qs(364)],
                    round: q1[qs(501)],
                  });
                else
                  q1.t === "roundStart" &&
                    (c[qs(433)]({ k: "r0", round: q1[qs(501)] }), (J = 0));
              }
            }
          }
        }
      }
    }
    if (g.S[qs(362)] - Y >= 2) {
      Y = g.S.tick;
      const q2 = [];
      for (const q4 of g.S.players) {
        if (!q4) continue;
        q2.push([
          q4[qs(390)],
          +q4.x[qs(354)](2),
          +q4.y[qs(354)](2),
          +q4[qs(500)][qs(354)](2),
          Math.round(q4[qs(461)]),
          (q4[qs(417)] ? 1 : 0) |
            (q4[qs(442)] ? 2 : 0) |
            (g.S.tick < q4.spawnProtUntil ? 4 : 0),
          Math[qs(501)](g[qs(386)](q4)),
        ]);
      }
      const q3 = {
        k: "st",
        t: g.S[qs(362)],
        tl: +g.S[qs(483)].toFixed(1),
        ph: g.S[qs(496)] === qs(510) ? 0 : 1,
        pl: +g.S[qs(422)][qs(354)](1),
        fz: g.S.frenzy ? 1 : 0,
        ps: q2,
      };
      (q0 - B > 0x3e8 &&
        ((B = q0),
        (q3.lb = g[qs(364)]()[qs(457)]((q5) => [
          q5[qs(390)],
          q5.bp,
          q5.kills,
          q5[qs(453)],
          q5[qs(371)],
        ]))),
        c[qs(433)](q3));
    }
    if (q0 - J > 0x9c4 && c[qs(387)] < 8) {
      J = q0;
      try {
        b[qs(402)]({ sim: g[qs(454)](), roster: [...t[qs(474)]()] });
      } catch {}
    }
  }
  const w = BAL[qU(398)],
    H = new Uint8Array(w * w),
    A = new Map();
  let N = { tl: BAL[qU(415)], ph: 0, pl: 0, fz: ![] },
    P = [],
    y = 0,
    T = 0,
    s = ![];
  const i = { x: 0, y: 0, angle: 0, valid: ![] };
  function F(S) {
    const qi = qU;
    let q0 = A[qi(424)](S);
    return (
      !q0 &&
        ((q0 = {
          slot: S,
          name: "P" + S,
          colorIdx: S,
          skin: "drop",
          bot: !![],
          alive: ![],
          x: 0,
          y: 0,
          angle: 0,
          ink: 100,
          maxInk: 100,
          boost: ![],
          protected: ![],
          trailCells: [],
          lastCell: -1,
          buf: [],
        }),
        A[qi(498)](S, q0)),
      q0
    );
  }
  function O(S, q0, q1) {
    const qF = qU;
    if (S[qF(374)] === -1) {
      S[qF(374)] = (q1 | 0) * w + (q0 | 0);
      return;
    }
    let q2 = S.x,
      q3 = S.y;
    const q4 = Math[qF(395)](q0 - q2, q1 - q3),
      q5 = Math[qF(439)](1, Math[qF(505)](q4 / 0.45));
    for (let q6 = 1; q6 <= q5; q6++) {
      const q7 = q2 + (q0 - q2) * (q6 / q5),
        q8 = q3 + (q1 - q3) * (q6 / q5),
        q9 = (q8 | 0) * w + (q7 | 0);
      if (q9 === S.lastCell) continue;
      const qq = H[q9] === S[qF(390)] + 1;
      if (qq) {
        if (S[qF(477)][qF(504)]) S[qF(477)].length = 0;
      } else S[qF(477)][S[qF(477)][qF(504)] - 1] !== q9 && S[qF(477)].push(q9);
      S[qF(374)] = q9;
    }
  }
  function n(S, q0) {
    for (const q1 of S) H[q1] = q0;
  }
  function z(S) {
    const qO = qU;
    if (!S?.[qO(435)]) return;
    const q0 = S[qO(435)];
    p[qO(476)] = !![];
    let q1 = 0;
    for (let q2 = 0; q2 < q0.g.length; q2 += 2) {
      const q3 = q0.g[q2],
        q4 = q0.g[q2 + 1];
      (H[qO(368)](q4, q1, q1 + q3), (q1 += q3));
    }
    N = {
      tl: q0[qO(483)],
      ph: q0[qO(496)] === "playing" ? 0 : 1,
      pl: q0[qO(422)],
      fz: q0[qO(356)],
    };
    for (const q5 of q0.ps) {
      if (!q5) continue;
      const q6 = F(q5[qO(390)]);
      ((q6[qO(503)] = q5[qO(503)]),
        (q6[qO(389)] = q5[qO(389)]),
        (q6[qO(418)] = q5[qO(418)]),
        (q6[qO(485)] = !!q5[qO(485)]),
        (q6.alive = q5[qO(417)]),
        (q6.ink = q5[qO(461)]),
        !q6[qO(458)][qO(504)] &&
          ((q6.x = q5.x), (q6.y = q5.y), (q6[qO(500)] = q5[qO(500)])));
    }
    for (const q7 of q0.tr || []) {
      const q8 = F(q7[0]);
      q8[qO(477)] = q7[qO(405)](1);
    }
    if (S[qO(445)])
      for (const [q9, qq] of S.roster) {
        if (q9 === b[qO(370)]) p[qO(380)] = qq;
      }
  }
  function x(S, q0) {
    const qn = qU;
    switch (S.k) {
      case "ro": {
        for (const [q1, q2] of S[qn(445)])
          if (q1 === b[qn(370)]) p[qn(380)] = q2;
        for (const [q3, q4, q5, q6, q7] of S[qn(427)]) {
          const q8 = F(q3);
          ((q8[qn(503)] = q4),
            (q8[qn(389)] = q5),
            (q8.skin = q6),
            (q8[qn(485)] = !!q7));
        }
        break;
      }
      case "st": {
        ((y = q0), (N = { tl: S.tl, ph: S.ph, pl: S.pl, fz: !!S.fz }));
        for (const [q9, qq, qZ, qe, qD, qf, qb] of S.ps) {
          const qp = F(q9),
            qc = !!(qf & 1);
          if (qc && qp[qn(417)]) O(qp, qq, qZ);
          qc &&
            !qp[qn(417)] &&
            ((qp[qn(477)][qn(504)] = 0),
            (qp[qn(374)] = (qZ | 0) * w + (qq | 0)));
          ((qp[qn(417)] = qc),
            (qp[qn(461)] = qD),
            (qp.maxInk = qb || 100),
            (qp[qn(442)] = !!(qf & 2)),
            (qp[qn(459)] = !!(qf & 4)),
            qp.buf[qn(433)]([q0, qq, qZ, qe]));
          if (qp[qn(458)][qn(504)] > 6) qp.buf.shift();
          ((qp.x = qq), (qp.y = qZ), (qp.angle = qe));
          if (q9 === p[qn(380)]) {
            if (!i[qn(375)])
              ((i.x = qq), (i.y = qZ), (i[qn(500)] = qe), (i[qn(375)] = !![]));
            else {
              const qV = Math.hypot(i.x - qq, i.y - qZ);
              qV > 3
                ? ((i.x = qq), (i.y = qZ))
                : ((i.x += (qq - i.x) * 0.25), (i.y += (qZ - i.y) * 0.25));
            }
          }
        }
        if (S.lb) P = S.lb;
        break;
      }
      case "cl": {
        n(S[qn(466)], S[qn(390)] + 1);
        const qm = F(S.slot);
        if (S[qn(482)]) qm[qn(477)][qn(504)] = 0;
        p.events[qn(433)]({
          t: qn(361),
          slot: S.slot,
          cells: S[qn(466)],
          area: S.area,
          ox: S.ox,
          oy: S.oy,
          partial: !S.fin,
        });
        break;
      }
      case "de": {
        n(S[qn(466)], 0);
        const ql = F(S[qn(390)]);
        ql[qn(477)].length = 0;
        if (S[qn(482)]) ql[qn(417)] = ![];
        p[qn(391)].push({
          t: "death",
          slot: S.slot,
          cells: S.cells,
          x: S.x,
          y: S.y,
          cause: S.cause,
          by: S.by,
        });
        S[qn(390)] === p[qn(380)] &&
          S[qn(482)] &&
          ((T = q0), (s = N.tl <= BAL[qn(366)]), (i[qn(375)] = ![]));
        break;
      }
      case "rs": {
        n(S[qn(466)], S[qn(390)] + 1);
        const qg = F(S.slot);
        ((qg[qn(417)] = !![]),
          (qg[qn(477)][qn(504)] = 0),
          (qg.x = S.x),
          (qg.y = S.y),
          (qg[qn(374)] = (S.y | 0) * w + (S.x | 0)),
          (qg[qn(458)][qn(504)] = 0),
          p[qn(391)][qn(433)]({
            t: "respawn",
            slot: S.slot,
            x: S.x,
            y: S.y,
            cells: S[qn(466)],
          }));
        S[qn(390)] === p.mySlot && ((T = 0), (s = ![]), (i[qn(375)] = ![]));
        break;
      }
      case "ct":
        p[qn(391)][qn(433)]({
          t: qn(446),
          killer: S.killer,
          victim: S[qn(404)],
        });
        break;
      case "fz":
        ((N.fz = !![]), p[qn(391)][qn(433)]({ t: qn(356) }));
        break;
      case "re":
        p[qn(391)][qn(433)]({
          t: qn(360),
          placements: S.placements,
          round: S.round,
        });
        break;
      case "r0": {
        H.fill(0);
        for (const qK of A.values()) {
          ((qK[qn(477)][qn(504)] = 0),
            (qK[qn(417)] = ![]),
            (qK[qn(458)][qn(504)] = 0));
        }
        ((s = ![]),
          (T = 0),
          p.events[qn(433)]({ t: qn(378), round: S[qn(501)] }));
        break;
      }
      case "in":
        break;
    }
  }
  let k = b.state || null;
  (V[qU(433)](
    b.on(qU(377), ({ from: S, d: q0 }) => {
      const qz = qU;
      if (m || !q0 || typeof q0.k !== qz(414)) return;
      const q1 = perf();
      if (b[qz(448)]) {
        if (q0.k === "in") {
          const q2 = t.get(S);
          if (q2 !== undefined && g)
            g[qz(384)](q2, { angle: q0.a, boost: !!q0.b });
        } else {
          if (q0.k === qz(488)) {
            const q3 = h(S, { name: q0.name, skin: q0.skin }, ![]);
            if (q3 >= 0) u();
          }
        }
      } else x(q0, q1);
    }),
  ),
    V[qU(433)](
      b.on(qU(467), (S) => {
        k = S;
        if (!b.isHost && S) z(S);
      }),
    ),
    V.push(
      b.on(qU(363), ({ players: S, hostSeat: q0 }) => {
        const qx = qU;
        p.players = S;
        const q1 = S[qx(495)]((q2) => q2.connected)[qx(504)];
        ((p[qx(428)] = q1),
          p[qx(507)] && p[qx(507)](q1),
          p.onLobby && p[qx(410)]());
        if (b[qx(448)] && g) {
          const q2 = new Set(
            S[qx(495)]((q3) => q3[qx(420)])[qx(457)]((q3) => q3[qx(370)]),
          );
          for (const q3 of [...t.keys()]) {
            if (q3 !== b[qx(370)] && !q2[qx(392)](q3)) I(q3);
          }
          for (const q4 of S) {
            if (q4.connected && !t[qx(392)](q4[qx(370)]))
              h(q4[qx(370)], { name: q4[qx(503)] }, ![]);
          }
        }
        q0 === b[qx(370)] && !g && l && (j(k), u());
      }),
    ),
    V[qU(433)](
      b.on(qU(460), () => {
        const qk = qU;
        l = !![];
        if (b[qk(448)] && !g) j(k);
        if (!b[qk(448)])
          c[qk(433)]({ k: qk(488), name: e, skin: D }, b[qk(513)]);
        p[qk(436)] && p[qk(436)]();
      }),
    ),
    V[qU(433)](
      b.on("connection", (S) => {
        const qM = qU;
        S === qM(426) && !m && p.onDropToLocal && p[qM(388)]();
      }),
    ),
    V.push(
      b.on("finished", () => {
        const qa = qU;
        if (!m) p[qa(388)] && p[qa(388)]();
      }),
    ));
  let M = 0,
    a = perf(),
    E = 0,
    X = null,
    v = ![];
  ((p[qU(394)] = (S) => {
    const qE = qU;
    if (b[qE(448)]) {
      if (!g) return 0;
      p._migrated && ((p[qE(456)] = ![]), p[qE(492)] && p[qE(492)]());
      ((M += Math.min(250, S - a)), (a = S));
      let q0 = ![];
      while (M >= BAL[qE(411)]) {
        M -= BAL.tickMs;
        if (!q0) {
          q0 = !![];
          for (const q2 of g.S[qE(363)])
            if (q2) L[qE(498)](q2[qE(390)], [q2.x, q2.y, q2[qE(500)]]);
        }
        K[qE(394)]();
        const q1 = g[qE(362)]();
        (p[qE(391)].push(...q1), r(q1, S));
      }
      return M / BAL[qE(411)];
    }
    a = S;
    p[qE(476)] && ((p._snapDirty = ![]), p[qE(492)] && p[qE(492)]());
    if (l && !m) {
      if (!p[qE(441)]) p[qE(441)] = S;
      const q3 = y ? S - y : S - p[qE(441)];
      if (q3 > 0x1f40) {
        m = !![];
        try {
          c[qE(452)]();
        } catch {}
        try {
          b[qE(358)]();
        } catch {}
        return (p.onDropToLocal && p[qE(388)](), 0);
      }
    }
    if (i[qE(375)] && p[qE(380)] >= 0) {
      const q4 = A[qE(424)](p[qE(380)]);
      if (q4 && q4[qE(417)]) {
        const q5 = Math.min(0.05, (S - (p._pf || S)) / 0x3e8);
        p[qE(393)] = S;
        const q6 =
            (((i[qE(489)] ?? q4[qE(500)]) - i[qE(500)] + Math.PI * 3) %
              (Math.PI * 2)) -
            Math.PI,
          q7 = BAL[qE(413)] * q5;
        i[qE(500)] += Math[qE(502)](q6) <= q7 ? q6 : Math[qE(408)](q6) * q7;
        const q8 =
          H[(i.y | 0) * w + (i.x | 0)] !== p[qE(380)] + 1 ||
          q4[qE(477)].length > 0;
        let q9 = BAL[qE(444)];
        if (v && q4[qE(461)] > 0) q9 *= BAL.boostMult;
        if (q4[qE(461)] <= 0 && q8) q9 *= BAL[qE(367)];
        ((i.x = Math[qE(349)](
          w - 0.51,
          Math[qE(439)](0.51, i.x + Math[qE(400)](i[qE(500)]) * q9 * q5),
        )),
          (i.y = Math[qE(349)](
            w - 0.51,
            Math[qE(439)](0.51, i.y + Math[qE(352)](i.angle) * q9 * q5),
          )));
      }
    }
    return 0;
  }),
    (p.setInput = (S, q0) => {
      const qX = qU;
      if (b.isHost) {
        if (g && p.mySlot >= 0) g[qX(384)](p.mySlot, { angle: S, boost: q0 });
        return;
      }
      i.target = S;
      const q1 = q0 !== v;
      v = q0;
      const q2 = perf();
      if (
        q2 - E > 0x3e8 / BAL[qX(509)] ||
        X === null ||
        Math[qX(502)](S - X) > 0.05 ||
        q1
      ) {
        ((E = q2), (X = S));
        try {
          b.send({ k: "in", a: +S[qX(354)](3), b: q0 ? 1 : 0 }, b[qX(513)]);
        } catch {}
      }
    }),
    (p[qU(383)] = (S) => {
      const qv = qU;
      if (b[qv(448)] && g) {
        const q6 = g.S[qv(363)][qv(457)]((q8) => {
            const qC = qv;
            if (!q8) return null;
            const q9 = L.get(q8.slot) || [q8.x, q8.y, q8[qC(500)]];
            return {
              slot: q8[qC(390)],
              name: q8.name,
              colorIdx: q8[qC(389)],
              skin: q8.skin,
              alive: q8[qC(417)],
              x: q9[0] + (q8.x - q9[0]) * S,
              y: q9[1] + (q8.y - q9[1]) * S,
              angle: q8[qC(500)],
              ink: q8[qC(461)],
              maxInk: g.maxInkOf(q8),
              boost: q8[qC(442)],
              protected: g.S[qC(362)] < q8[qC(351)],
              isMe: q8.slot === p[qC(380)],
              trailPts: C(q8),
            };
          }),
          q7 = g.S.players[p[qv(380)]];
        return {
          players: q6,
          mySlot: p.mySlot,
          timeLeft: g.S[qv(483)],
          frenzy: g.S[qv(356)],
          phase: g.S.phase,
          phaseLeft: g.S[qv(422)],
          placements: g[qv(364)](),
          humans: p.humanCount,
          offline: ![],
          respawnLeft:
            q7 && !q7.alive && q7.respawnAt > 0
              ? Math.max(0, ((q7.respawnAt - g.S.tick) * BAL.tickMs) / 0x3e8)
              : null,
          spectating: !!q7?.[qv(369)],
        };
      }
      const q0 = perf(),
        q1 = q0 - BAL[qv(493)],
        q2 = [];
      let q3 = -1;
      for (const q8 of A[qv(506)]()) q3 = Math[qv(439)](q3, q8[qv(390)]);
      for (let q9 = 0; q9 <= q3; q9++) q2[qv(433)](null);
      for (const qq of A[qv(506)]()) {
        let qZ = qq.x,
          qe = qq.y,
          qD = qq[qv(500)];
        if (qq[qv(390)] === p[qv(380)] && i.valid)
          ((qZ = i.x), (qe = i.y), (qD = i[qv(500)]));
        else {
          if (qq.buf[qv(504)] >= 2) {
            let qf = qq[qv(458)][qv(504)] - 1;
            while (qf > 0 && qq[qv(458)][qf - 1][0] > q1) qf--;
            const qb = qq[qv(458)][Math[qv(439)](0, qf - 1)],
              qp = qq[qv(458)][qf],
              qc = Math[qv(439)](1, qp[0] - qb[0]),
              qV = Math.min(1.2, Math.max(0, (q1 - qb[0]) / qc));
            ((qZ = qb[1] + (qp[1] - qb[1]) * qV),
              (qe = qb[2] + (qp[2] - qb[2]) * qV),
              (qD = qp[3]));
          }
        }
        q2[qq[qv(390)]] = {
          slot: qq[qv(390)],
          name: qq.name,
          colorIdx: qq[qv(389)],
          skin: qq[qv(418)],
          alive: qq[qv(417)],
          x: qZ,
          y: qe,
          angle: qD,
          ink: qq[qv(461)],
          maxInk: qq.maxInk,
          boost: qq.boost,
          protected: qq[qv(459)],
          isMe: qq.slot === p.mySlot,
          trailPts: Q(qq, qZ, qe),
        };
      }
      const q4 = P[qv(457)](([qm, ql, qg, qK, qt]) => ({
          slot: qm,
          name: A[qv(424)](qm)?.[qv(503)] || "P" + qm,
          colorIdx: A[qv(424)](qm)?.[qv(389)] ?? qm,
          bot: A[qv(424)](qm)?.[qv(485)] ?? !![],
          bp: ql,
          kills: qg,
          bestBp: qK,
          score: qt,
          cells: 0,
        })),
        q5 = T && !s ? Math.max(0, BAL[qv(365)] - (q0 - T) / 0x3e8) : null;
      return {
        players: q2,
        mySlot: p.mySlot,
        timeLeft: N.tl,
        frenzy: N.fz,
        phase: N.ph === 0 ? "playing" : qv(355),
        phaseLeft: N.pl,
        placements: q4,
        humans: p[qv(428)],
        offline: ![],
        respawnLeft: q5,
        spectating: s,
        stale: q0 - y > 0xfa0,
      };
    }));
  function C(S) {
    const qQ = qU;
    if (!S[qQ(417)] || !S.trailCells[qQ(504)]) return null;
    const q0 = new Array((S[qQ(477)][qQ(504)] + 1) * 2);
    for (let q1 = 0; q1 < S[qQ(477)][qQ(504)]; q1++) {
      const q2 = S[qQ(477)][q1];
      ((q0[q1 * 2] = (q2 % w) + 0.5), (q0[q1 * 2 + 1] = ((q2 / w) | 0) + 0.5));
    }
    return (
      (q0[S.trailCells.length * 2] = S.x),
      (q0[S[qQ(477)][qQ(504)] * 2 + 1] = S.y),
      q0
    );
  }
  function Q(S, q0, q1) {
    const qG = qU;
    if (!S.alive || !S[qG(477)][qG(504)]) return null;
    const q2 = new Array((S.trailCells[qG(504)] + 1) * 2);
    for (let q3 = 0; q3 < S[qG(477)][qG(504)]; q3++) {
      const q4 = S[qG(477)][q3];
      ((q2[q3 * 2] = (q4 % w) + 0.5), (q2[q3 * 2 + 1] = ((q4 / w) | 0) + 0.5));
    }
    return (
      (q2[S[qG(477)][qG(504)] * 2] = q0),
      (q2[S[qG(477)][qG(504)] * 2 + 1] = q1),
      q2
    );
  }
  ((p[qU(398)] = () => (b.isHost && g ? g.S[qU(398)] : H)),
    (p[qU(435)] = null),
    Object[qU(514)](p, qU(435), {
      get: () => (b[qU(448)] ? g : null),
      configurable: !![],
    }),
    (p[qU(449)] = async () => {
      const qS = qU,
        S = await fetchInvite(0x5dc),
        q0 = S[qS(491)] || window[qS(350)].href[qS(479)]("?")[0];
      return q0 + qS(469) + b[qS(373)];
    }),
    (p[qU(399)] = () => {
      const Z0 = qU;
      try {
        b[Z0(484)]();
      } catch {}
    }),
    (p[qU(452)] = () => {
      const Z1 = qU;
      ((m = !![]), c[Z1(452)]());
      for (const S of V) {
        try {
          S();
        } catch {}
      }
      try {
        b[Z1(358)]();
      } catch {}
    }));
  if (q === "quick") {
    if (b[qU(448)]) {
      (j(k), (l = !![]));
      try {
        b[qU(484)]();
      } catch {}
    } else l && c.push({ k: "hello", name: e, skin: D }, b[qU(513)]);
  } else {
    if (l) {
      if (!b[qU(448)]) c[qU(433)]({ k: qU(488), name: e, skin: D }, b[qU(513)]);
      else {
        if (!g) j(k);
      }
    }
  }
  return p;
}
