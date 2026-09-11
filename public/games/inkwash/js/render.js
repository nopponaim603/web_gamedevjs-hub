const shade = (q, Z) => {
  e = parseInt(q.slice(1), 16);
  let D = (e >> 16) & 255,
    p = (e >> 8) & 255,
    c = e & 255;
  return (
    Z >= 0
      ? ((D += (255 - D) * Z), (p += (255 - p) * Z), (c += (255 - c) * Z))
      : ((D *= 1 + Z), (p *= 1 + Z), (c *= 1 + Z)),
    "rgb(" + (D | 0) + "," + (p | 0) + "," + (c | 0) + ")"
  );
};
export function drawSkinPreview(q, Z, e) {
  ((D = q.getContext("2d")), (f = q.width), (b = q.height));
  D.clearRect(0, 0, f, b);
  const p = f * 0.22;
  (D.save(),
    D.translate(f / 2, b / 2),
    D.rotate(-0.5),
    (D.fillStyle = e),
    (D.strokeStyle = "#FFFDF6"),
    (D.lineWidth = Math.max(1.5, p * 0.18)),
    D.beginPath());
  if (Z === "plane")
    (D.moveTo(p * 1.2, 0),
      D.lineTo(-p, -p * 0.95),
      D.lineTo(-p * 0.35, 0),
      D.lineTo(-p, p * 0.95),
      D.closePath());
  else {
    if (Z === "koi") D.ellipse(0, 0, p * 1.15, p * 0.85, 0, 0, Math.PI * 2);
    else
      Z === "lantern"
        ? D.ellipse(0, 0, p * 0.9, p, 0, 0, Math.PI * 2)
        : D.arc(0, 0, p, 0, Math.PI * 2);
  }
  (D.fill(), D.stroke());
  if (Z === "cat")
    (D.beginPath(),
      D.moveTo(-p * 0.75, -p * 0.6),
      D.lineTo(-p * 1.15, -p * 1.35),
      D.lineTo(-p * 0.25, -p * 0.95),
      D.moveTo(p * 0.75, -p * 0.6),
      D.lineTo(p * 1.15, -p * 1.35),
      D.lineTo(p * 0.25, -p * 0.95),
      D.fill());
  else {
    if (Z === "drop")
      (D.beginPath(),
        D.moveTo(-p * 1.55, 0),
        D.quadraticCurveTo(-p * 0.6, -p * 0.55, 0, -p * 0.8),
        D.quadraticCurveTo(-p * 0.6, 0.1, -p * 1.55, 0),
        D.fill());
    else {
      if (Z === "koi" || Z === "fish")
        (D.beginPath(),
          D.moveTo(-p * 0.9, 0),
          D.lineTo(-p * 1.7, -p * 0.7),
          D.lineTo(-p * 1.7, p * 0.7),
          D.closePath(),
          D.fill());
      else {
        if (Z === "gingko")
          ((D.fillStyle = "#FFFDF6"),
            D.fillRect(-p * 0.08, p * 0.3, p * 0.16, p * 0.7));
        else {
          if (Z === "lantern")
            ((D.fillStyle = "#8C5B3F"),
              D.fillRect(-p * 0.4, -p * 1.3, p * 0.8, p * 0.3));
          else
            Z === "brush" &&
              ((D.fillStyle = "#8C5B3F"),
              D.fillRect(-p * 2, -p * 0.22, p * 1.3, p * 0.44));
        }
      }
    }
  }
  ((D.fillStyle = "rgba(255,255,255,0.65)"),
    D.beginPath(),
    D.arc(p * 0.32, -p * 0.34, p * 0.22, 0, Math.PI * 2),
    D.fill(),
    D.restore());
}
export function createRenderer(q, Z) {
  ((e = q.getContext("2d")),
    (D = Z ? Z.getContext("2d") : null),
    (f = BAL.grid),
    (b = []),
    (c = []),
    (V = []),
    (m = []));
  for (let v = 0; v < BAL.colors.length; v++) {
    const C = BAL.colors[v][1];
    (b.push(C),
      c.push(shade(C, -0.22)),
      V.push(shade(C, -0.12)),
      m.push(shade(C, 0.42)));
  }
  const g = document.createElement("canvas");
  g.width = g.height = 256;
  {
    const Q = g.getContext("2d");
    ((Q.fillStyle = BAL.paper), Q.fillRect(0, 0, 256, 256));
    let S = 0x12d687;
    const q0 = () => (S = (S * 0x41a7) % 0x7fffffff) / 0x7fffffff;
    ((Q.strokeStyle = "rgba(190,178,150,0.16)"), (Q.lineWidth = 1));
    for (let q1 = 0; q1 < 240; q1++) {
      const q2 = q0() * 256,
        q3 = q0() * 256,
        q4 = q0() * Math.PI,
        q5 = 2 + q0() * 6;
      (Q.beginPath(),
        Q.moveTo(q2, q3),
        Q.lineTo(q2 + Math.cos(q4) * q5, q3 + Math.sin(q4) * q5),
        Q.stroke());
    }
    Q.fillStyle = "rgba(160,145,115,0.05)";
    for (let q6 = 0; q6 < 500; q6++)
      Q.fillRect(q0() * 256, q0() * 256, 1.4, 1.4);
    Q.strokeStyle = "rgba(210,198,170,0.35)";
    for (let q7 = 0; q7 < 256; q7 += 32) {
      (Q.beginPath(),
        Q.moveTo(0, q7 + 0.5),
        Q.lineTo(256, q7 + 0.5),
        Q.stroke(),
        Q.beginPath(),
        Q.moveTo(q7 + 0.5, 0),
        Q.lineTo(q7 + 0.5, 256),
        Q.stroke());
    }
  }
  const K = e.createPattern(g, "repeat"),
    t = 4,
    o = document.createElement("canvas");
  o.width = o.height = f * t;
  const Y = o.getContext("2d"),
    B = document.createElement("canvas");
  B.width = B.height = f * t;
  const J = B.getContext("2d"),
    L = new Uint8Array(f * f);
  function j(q8, q9) {
    const qN = qA;
    L[q8] = q9;
    const qq = q8 % f,
      qZ = (q8 / f) | 0;
    q9
      ? ((Y[qN(240)] = 0.85),
        (Y[qN(185)] = b[(q9 - 1) % b[qN(265)]]),
        Y[qN(261)](qq * t, qZ * t, t, t),
        Y[qN(193)](qq * t, qZ * t, t, t),
        (Y[qN(240)] = 1))
      : Y[qN(261)](qq * t, qZ * t, t, t);
    h(qq, qZ);
    if (qq > 0) h(qq - 1, qZ);
    if (qq < f - 1) h(qq + 1, qZ);
    if (qZ > 0) h(qq, qZ - 1);
    if (qZ < f - 1) h(qq, qZ + 1);
  }
  function h(q8, q9) {
    const qP = qA,
      qq = q9 * f + q8,
      qZ = L[qq];
    J[qP(261)](q8 * t, q9 * t, t, t);
    if (!qZ) return;
    ((J[qP(240)] = 0.7), (J[qP(185)] = c[(qZ - 1) % c[qP(265)]]));
    const qe = q8 * t,
      qD = q9 * t;
    if (q8 === 0 || L[qq - 1] !== qZ) J[qP(193)](qe, qD, 1, t);
    if (q8 === f - 1 || L[qq + 1] !== qZ) J[qP(193)](qe + t - 1, qD, 1, t);
    if (q9 === 0 || L[qq - f] !== qZ) J.fillRect(qe, qD, t, 1);
    if (q9 === f - 1 || L[qq + f] !== qZ) J.fillRect(qe, qD + t - 1, t, 1);
    J[qP(240)] = 1;
  }
  let R = [];
  function d(q8, q9, qq, qZ, qe, qD) {
    const qy = qA;
    for (const qf of q8) {
      const qb = (qf % f) + 0.5,
        qp = ((qf / f) | 0) + 0.5,
        qc = Math[qy(273)](qb - qq, qp - qZ);
      R[qy(284)]({ at: qD + Math[qy(182)](420, qc * qe), i: qf, owner: q9 });
    }
  }
  function I(q8) {
    const qT = qA;
    if (!R[qT(265)]) return;
    const q9 = [];
    for (const qq of R) {
      if (qq.at <= q8) j(qq.i, qq[qT(201)]);
      else q9.push(qq);
    }
    R = q9;
  }
  function u(q8) {
    for (let q9 = 0; q9 < f * f; q9++) {
      if (L[q9] !== q8[q9]) j(q9, q8[q9]);
    }
  }
  function U(q8) {
    const qs = qA;
    ((R = []),
      Y[qs(261)](0, 0, f * t, f * t),
      J[qs(261)](0, 0, f * t, f * t),
      L[qs(225)](0),
      (Y.globalAlpha = 0.85));
    for (let q9 = 0; q9 < f * f; q9++)
      if (q8[q9]) {
        L[q9] = q8[q9];
        const qq = q9 % f,
          qZ = (q9 / f) | 0;
        ((Y.fillStyle = b[(q8[q9] - 1) % b.length]),
          Y[qs(193)](qq * t, qZ * t, t, t));
      }
    Y[qs(240)] = 1;
    for (let qe = 0; qe < f; qe++)
      for (let qD = 0; qD < f; qD++) if (L[qe * f + qD]) h(qD, qe);
  }
  const r = [];
  function w(q8, q9, qq, qZ, qe = 1) {
    const qi = qA;
    for (let qD = 0; qD < qZ && r[qi(265)] < BAL[qi(281)]; qD++) {
      const qf = Math[qi(226)]() * Math.PI * 2,
        qb = (0.6 + Math[qi(226)]() * 2.2) * qe;
      r[qi(284)]({
        x: q8,
        y: q9,
        vx: Math[qi(237)](qf) * qb,
        vy: Math[qi(179)](qf) * qb,
        r: 0.12 + Math[qi(226)]() * 0.3,
        life: 1,
        decay: 1.6 + Math[qi(226)]() * 1.4,
        c: b[qq % b[qi(265)]],
      });
    }
  }
  function A(q8, q9, qq) {
    const qF = qA;
    r[qF(284)]({
      ring: !![],
      x: q8,
      y: q9,
      r: 0.5,
      life: 1,
      decay: 0.9,
      c: c[qq % c[qF(265)]],
    });
  }
  const N = { x: f / 2, y: f / 2, scale: 20, shake: 0 };
  let P = 0,
    T = 0,
    F = 1;
  function O() {
    const qO = qA;
    ((F = Math.min(2, window.devicePixelRatio || 1)),
      (P = q[qO(248)]),
      (T = q.clientHeight),
      (q[qO(209)] = Math.round(P * F)),
      (q[qO(224)] = Math[qO(241)](T * F)));
  }
  (window.addEventListener("resize", O), O());
  function n(q8, q9, qq, qZ = ![]) {
    const qn = qA,
      qe = (Math[qn(182)](P, T) || 360) / BAL.viewCells;
    if (qZ) {
      ((N.x = q8), (N.y = q9), (N[qn(250)] = qe));
      return;
    }
    const qD = 1 - Math[qn(203)](-qq * 6);
    ((N.x += (q8 - N.x) * qD),
      (N.y += (q9 - N.y) * qD),
      (N.scale += (qe - N.scale) * qD));
  }
  const z = (q8, q9) => [
    (q8 - N.x) * N.scale + P / 2,
    (q9 - N.y) * N.scale + T / 2,
  ];
  function M(q8, q9, qq, qZ, qe, qD) {
    const qz = qA,
      qf = b[qq % b[qz(265)]];
    (q8[qz(183)](),
      q8[qz(196)](0, 0),
      (q8.fillStyle = qf),
      (q8[qz(199)] = qz(194)),
      (q8.lineWidth = Math[qz(223)](1.5, qZ * 0.18)),
      q8[qz(212)]());
    if (qe === qz(262))
      (q8[qz(277)](0, 0, qZ, 0, Math.PI * 2),
        q8[qz(225)](),
        q8[qz(205)](),
        q8[qz(212)](),
        q8.moveTo(-qZ * 1.55, 0),
        q8[qz(247)](-qZ * 0.6, -qZ * 0.55, 0, -qZ * 0.8),
        q8[qz(247)](-qZ * 0.6, 0.1, -qZ * 1.55, 0),
        q8.fill());
    else {
      if (qe === qz(191))
        (q8[qz(277)](0, 0, qZ, 0, Math.PI * 2),
          q8[qz(225)](),
          q8[qz(205)](),
          q8[qz(212)](),
          q8[qz(214)](-qZ * 0.75, -qZ * 0.6),
          q8[qz(186)](-qZ * 1.15, -qZ * 1.35),
          q8.lineTo(-qZ * 0.25, -qZ * 0.95),
          q8.moveTo(qZ * 0.75, -qZ * 0.6),
          q8[qz(186)](qZ * 1.15, -qZ * 1.35),
          q8[qz(186)](qZ * 0.25, -qZ * 0.95),
          q8[qz(225)]());
      else {
        if (qe === qz(230))
          (q8[qz(245)](0, 0, qZ * 1.15, qZ * 0.85, 0, 0, Math.PI * 2),
            q8.fill(),
            q8.stroke(),
            q8[qz(212)](),
            q8[qz(214)](-qZ, 0),
            q8.quadraticCurveTo(-qZ * 1.9, -qZ * 0.8, -qZ * 1.7, 0),
            q8[qz(247)](-qZ * 1.9, qZ * 0.8, -qZ, 0),
            q8[qz(225)]());
        else {
          if (qe === "plane")
            (q8[qz(214)](qZ * 1.2, 0),
              q8[qz(186)](-qZ, -qZ * 0.95),
              q8[qz(186)](-qZ * 0.35, 0),
              q8[qz(186)](-qZ, qZ * 0.95),
              q8.closePath(),
              q8[qz(225)](),
              q8[qz(205)]());
          else {
            if (qe === qz(236))
              (q8[qz(214)](0, qZ * 0.2),
                q8[qz(277)](
                  0,
                  -qZ * 0.2,
                  qZ,
                  Math.PI * 0.85,
                  Math.PI * 0.15,
                  !![],
                ),
                q8[qz(242)](),
                q8[qz(225)](),
                q8[qz(205)]());
            else {
              if (qe === qz(257))
                (q8[qz(245)](0, 0, qZ * 0.9, qZ, 0, 0, Math.PI * 2),
                  q8[qz(225)](),
                  q8[qz(205)](),
                  (q8[qz(185)] = shade(qf, -0.25)),
                  q8[qz(193)](-qZ * 0.4, -qZ * 1.25, qZ * 0.8, qZ * 0.3));
              else {
                if (qe === qz(195))
                  (q8[qz(277)](0, 0, qZ * 0.85, 0, Math.PI * 2),
                    q8[qz(225)](),
                    q8[qz(205)](),
                    (q8[qz(185)] = qz(178)),
                    q8[qz(193)](-qZ * 2.1, -qZ * 0.22, qZ * 1.35, qZ * 0.44));
                else
                  qe === "fish"
                    ? (q8[qz(277)](0, 0, qZ, 0, Math.PI * 2),
                      q8[qz(225)](),
                      q8[qz(205)](),
                      q8.beginPath(),
                      q8[qz(214)](-qZ * 0.8, 0),
                      q8[qz(186)](-qZ * 1.6, -qZ * 0.7),
                      q8[qz(186)](-qZ * 1.6, qZ * 0.7),
                      q8[qz(242)](),
                      q8[qz(225)]())
                    : (q8[qz(277)](0, 0, qZ, 0, Math.PI * 2),
                      q8[qz(225)](),
                      q8[qz(205)]());
              }
            }
          }
        }
      }
    }
    ((q8[qz(185)] = qz(279)),
      q8[qz(212)](),
      q8[qz(277)](qZ * 0.32, -qZ * 0.34, qZ * 0.22, 0, Math.PI * 2),
      q8[qz(225)](),
      qD &&
        ((q8[qz(199)] = qz(181)),
        (q8[qz(229)] = Math.max(2, qZ * 0.22)),
        q8[qz(212)](),
        q8[qz(277)](0, 0, qZ * 1.45, 0, Math.PI * 2),
        q8[qz(205)]()),
      q8[qz(239)]());
  }
  function E(q8, q9, qq) {
    const qx = qA,
      qZ = Math[qx(182)](0.1, q9 / 0x3e8);
    (I(qq), e[qx(259)](F, 0, 0, F, 0, 0), (e[qx(185)] = K), e[qx(183)]());
    const [qe, qD] = z(0, 0);
    (e[qx(196)](
      (((qe % 256) + 256) % 256) - 256,
      (((qD % 256) + 256) % 256) - 256,
    ),
      e[qx(193)](-256, -256, P + 768, T + 768),
      e[qx(239)]());
    N[qx(253)] > 0 &&
      (e[qx(196)](
        (Math.random() - 0.5) * N[qx(253)],
        (Math[qx(226)]() - 0.5) * N[qx(253)],
      ),
      (N[qx(253)] = Math.max(0, N[qx(253)] - qZ * 26)));
    const [qf, qb] = z(0, 0);
    ((e[qx(190)] = !![]), (e[qx(234)] = qx(211)));
    const qp = f * N[qx(250)];
    (e.drawImage(o, qf, qb, qp, qp),
      (e[qx(240)] = 0.85),
      e[qx(200)](B, qf, qb, qp, qp),
      (e[qx(240)] = 1),
      (e.strokeStyle = qx(231)),
      (e[qx(229)] = Math[qx(223)](2, N[qx(250)] * 0.18)),
      e[qx(243)](qf, qb, qp, qp),
      (e[qx(185)] = "rgba(220,208,180,0.5)"));
    if (qf > 0) e[qx(193)](0, 0, qf, T);
    if (qb > 0) e.fillRect(0, 0, P, qb);
    if (qf + qp < P) e[qx(193)](qf + qp, 0, P - qf - qp, T);
    if (qb + qp < T) e.fillRect(0, qb + qp, P, T - qb - qp);
    for (const qV of q8[qx(256)]) {
      if (!qV || !qV.alive || !qV[qx(254)] || qV[qx(254)][qx(265)] < 2)
        continue;
      const qm = b[qV[qx(238)] % b[qx(265)]];
      ((e.lineJoin = qx(241)), (e[qx(272)] = qx(241)), e[qx(212)]());
      for (let ql = 0; ql < qV.trailPts[qx(265)]; ql += 2) {
        const [qg, qK] = z(qV[qx(254)][ql], qV[qx(254)][ql + 1]);
        if (ql === 0) e.moveTo(qg, qK);
        else e[qx(186)](qg, qK);
      }
      ((e[qx(199)] = V[qV[qx(238)] % V[qx(265)]]),
        (e[qx(240)] = 0.92),
        (e[qx(229)] = N.scale * 0.62),
        e[qx(205)](),
        (e[qx(199)] = shade(qm, 0.28)),
        (e[qx(240)] = 0.85),
        (e[qx(229)] = N[qx(250)] * 0.26),
        e.stroke(),
        (e[qx(240)] = 1));
    }
    for (const qt of q8.players) {
      if (!qt || !qt[qx(215)]) continue;
      const [qo, qY] = z(qt.x, qt.y);
      if (qo < -80 || qY < -80 || qo > P + 80 || qY > T + 80) continue;
      (e[qx(183)](), e[qx(196)](qo, qY));
      if (qt[qx(202)] && Math[qx(252)](qq / 120) % 2 === 0) e[qx(240)] = 0.45;
      (e[qx(274)](qt.angle),
        M(e, qt, qt[qx(238)], N[qx(250)] * 0.58, qt[qx(266)], qt.isMe),
        e[qx(239)](),
        (e[qx(233)] = qx(280) + Math[qx(223)](10, N[qx(250)] * 0.5) + qx(188)),
        (e[qx(276)] = qx(235)),
        (e.fillStyle = "rgba(74,66,56,0.85)"),
        (e[qx(199)] = qx(232)),
        (e.lineWidth = 3),
        e[qx(270)](qt[qx(192)], qo, qY - N[qx(250)] * 1.15),
        e.fillText(qt[qx(192)], qo, qY - N[qx(250)] * 1.15));
      if (qt[qx(258)] && qt.ink < qt[qx(207)] - 1) {
        const qB = N.scale * 2.4,
          qJ = Math[qx(223)](3, N[qx(250)] * 0.16),
          qL = Math[qx(223)](0, qt[qx(217)] / qt.maxInk);
        ((e[qx(185)] = qx(204)),
          e[qx(193)](qo - qB / 2, qY + N.scale * 1, qB, qJ),
          (e[qx(185)] = qL < 0.25 ? "#E0532F" : "#3D5A98"),
          e[qx(193)](qo - qB / 2, qY + N[qx(250)] * 1, qB * qL, qJ));
      }
    }
    for (let qj = r[qx(265)] - 1; qj >= 0; qj--) {
      const qh = r[qj];
      qh[qx(275)] -= qZ * qh[qx(255)];
      if (qh[qx(275)] <= 0) {
        r[qx(278)](qj, 1);
        continue;
      }
      if (qh[qx(219)]) {
        qh.r += qZ * 10;
        const [qR, qd] = z(qh.x, qh.y);
        ((e[qx(199)] = qh.c),
          (e[qx(240)] = qh[qx(275)] * 0.7),
          (e[qx(229)] = 2.5),
          e[qx(212)](),
          e.arc(qR, qd, qh.r * N[qx(250)], 0, Math.PI * 2),
          e[qx(205)]());
      } else {
        ((qh.x += qh.vx * qZ * 3),
          (qh.y += qh.vy * qZ * 3),
          (qh.vx *= 0.94),
          (qh.vy *= 0.94));
        const [qI, qW] = z(qh.x, qh.y);
        ((e[qx(185)] = qh.c),
          (e[qx(240)] = Math[qx(182)](1, qh[qx(275)]) * 0.85),
          e[qx(212)](),
          e[qx(277)](qI, qW, qh.r * N[qx(250)] * qh[qx(275)], 0, Math.PI * 2),
          e[qx(225)]());
      }
      e.globalAlpha = 1;
    }
    e[qx(185)] = "rgba(232,223,201,0)";
    const qc = e.createRadialGradient(
      P / 2,
      T / 2,
      Math[qx(182)](P, T) * 0.3,
      P / 2,
      T / 2,
      Math[qx(223)](P, T) * 0.85,
    );
    (qc.addColorStop(0, qx(263)),
      qc.addColorStop(0.5, "rgba(223,211,184,0.12)"),
      qc[qx(268)](1, qx(267)),
      (e[qx(185)] = qc),
      e.fillRect(0, 0, P, T));
  }
  function X(q8) {
    const qk = qA;
    if (!D) return;
    (D.clearRect(0, 0, 140, 140),
      (D[qk(185)] = BAL[qk(271)]),
      D[qk(193)](0, 0, 140, 140),
      (D.imageSmoothingEnabled = ![]),
      (D.globalAlpha = 0.95),
      D[qk(200)](o, 0, 0, 140, 140),
      (D[qk(240)] = 1));
    const q9 = 140 / f;
    for (const qq of q8[qk(256)]) {
      if (!qq || !qq[qk(215)]) continue;
      ((D[qk(185)] = qq[qk(258)] ? qk(218) : b[qq.colorIdx % b[qk(265)]]),
        D.beginPath(),
        D[qk(277)](
          qq.x * q9,
          qq.y * q9,
          qq[qk(258)] ? 3.4 : 2.2,
          0,
          Math.PI * 2,
        ),
        D[qk(225)](),
        qq.isMe && ((D[qk(199)] = qk(194)), (D[qk(229)] = 1.4), D[qk(205)]()));
    }
  }
  return {
    resize: O,
    follow: n,
    draw: E,
    drawMinimap: X,
    syncGrid: U,
    syncGridDiff: u,
    queueWash: d,
    paintCell: j,
    splat: w,
    ripple: A,
    shake(q8) {
      const qM = qA;
      N[qM(253)] = Math[qM(223)](N[qM(253)], q8);
    },
    toScreen: z,
    get cam() {
      return N;
    },
    colors: b,
  };
}
