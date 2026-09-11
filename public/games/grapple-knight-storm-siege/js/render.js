const TAU = Math.PI * 2,
  C = {
    ink: "#153f49",
    deep: "#235663",
    teal: "#538f8f",
    jade: "#7bb6a8",
    pale: "#d8e7c9",
    cream: "#fff2c9",
    gold: "#d8ad63",
    darkGold: "#806846",
    coral: "#ec7050",
    red: "#a84338",
    sky: "#b5c9b4",
    smoke: "#537e80",
  },
  clamp = (K, g, D) => Math.max(g, Math.min(D, K)),
  mix = (K, g, D) => K + (g - K) * D,
  rnd = (K, g) => K + Math.random() * (g - K);
function rng(K) {
  return () => {
    ((K |= 0), (K = (K + 0x6d2b79f5) | 0));
    let g = Math.imul(K ^ (K >>> 15), 1 | K);
    return (
      (g ^= g + Math.imul(g ^ (g >>> 7), 61 | g)),
      ((g ^ (g >>> 14)) >>> 0) / 0x100000000
    );
  };
}
function path(K, g, D, l, Y = 1) {
  K.beginPath();
  for (let r = 0; r < g.length; r++) {
    const R = g[r];
    if (!r) K.moveTo(R[0], R[1]);
    else K.lineTo(R[0], R[1]);
  }
  (K.closePath(),
    D && ((K.fillStyle = D), K.fill()),
    l && ((K.strokeStyle = l), (K.lineWidth = Y), K.stroke()));
}
function ellipse(K, g, D, l, Y, r, p, R = 1) {
  (K.beginPath(),
    K.ellipse(g, D, Math.max(0.01, l), Math.max(0.01, Y), 0, 0, TAU),
    r && ((K.fillStyle = r), K.fill()),
    p && ((K.strokeStyle = p), (K.lineWidth = R), K.stroke()));
}
function line(K, g, D, l, Y, r, p = 1) {
  (K.beginPath(),
    K.moveTo(g, D),
    K.lineTo(l, Y),
    (K.strokeStyle = r),
    (K.lineWidth = p),
    K.stroke());
}
function curve(K, g, D, l, Y, r, p, R, Z = 1) {
  (K.beginPath(),
    K.moveTo(g, D),
    K.quadraticCurveTo(l, Y, r, p),
    (K.strokeStyle = R),
    (K.lineWidth = Z),
    K.stroke());
}
function ring(K, g, D, l, Y, p = 1, R = 0, Z = TAU) {
  (K.beginPath(),
    K.arc(g, D, Math.max(0.01, l), R, Z),
    (K.strokeStyle = Y),
    (K.lineWidth = p),
    K.stroke());
}
function rivet(K, g, D, l = 2.3) {
  (ellipse(K, g, D + 0.7, l + 0.7, l + 0.7, C.ink),
    ellipse(K, g, D, l, l, C.gold),
    line(K, g - l * 0.4, D - 0.7, g + l * 0.4, D - 0.7, C.cream, 0.8));
}
function gear(K, g, D, l, Y, p, R = C.gold) {
  (K.save(), K.translate(g, D), K.rotate(p));
  const Z = [];
  for (let s = 0; s < Y * 4; s++) {
    const q = (s / (Y * 4)) * TAU,
      U = l * (s % 4 < 2 ? 1 : 0.82);
    Z.push([Math.cos(q) * U, Math.sin(q) * U]);
  }
  (path(K, Z, R, C.ink, 1.5),
    ellipse(K, 0, 0, l * 0.54, l * 0.54, C.ink, C.darkGold, 1),
    ellipse(K, 0, 0, l * 0.23, l * 0.23, C.gold),
    K.restore());
}
function feather(K, g, D, l, Y, r, p) {
  (K.save(), K.translate(g, D), K.rotate(l));
  const R = K.createLinearGradient(-r * 0.5, 0, r * 0.5, Y * 0.7);
  (R.addColorStop(0, "#d4e3b9"),
    R.addColorStop(0.27, p),
    R.addColorStop(0.72, "#45838a"),
    R.addColorStop(1, "#274f5a"),
    path(
      K,
      [
        [-r * 0.48, 0],
        [0, -14],
        [r * 0.48, 0],
        [r * 0.25, Y * 0.66],
        [0, Y],
        [-r * 0.3, Y * 0.71],
      ],
      R,
      C.ink,
      2,
    ),
    path(
      K,
      [
        [-r * 0.34, 0],
        [-4, -4],
        [-3, Y * 0.83],
        [-r * 0.2, Y * 0.65],
      ],
      C.pale,
    ),
    line(K, 0, 5, 0, Y * 0.83, C.gold, 2.3),
    line(K, -r * 0.27, Y * 0.31, r * 0.27, Y * 0.31, C.ink, 1));
  for (let Z = 0; Z < 4; Z++) {
    const s = Y * (0.43 + Z * 0.09),
      q = r * (0.24 - Z * 0.035);
    (line(K, 4, s - 2, q, s - 7, "#173f4966", 0.8),
      line(K, -4, s, -q, s - 6, "#4c828466", 0.8));
  }
  (line(K, r * 0.43, 3, r * 0.2, Y * 0.67, "#e3d69b", 1),
    rivet(K, 0, 7, 2.6),
    K.restore());
}
function cloud(K, g, D, l, Y, r, p, R) {
  ((K.fillStyle = r),
    K.beginPath(),
    K.moveTo(g - l * 0.54, D + Y * 0.25),
    K.bezierCurveTo(
      g - l * 0.65,
      D - Y * 0.1,
      g - l * 0.32,
      D - Y * 0.45,
      g - l * 0.18,
      D - Y * 0.21,
    ),
    K.bezierCurveTo(
      g - l * 0.13,
      D - Y * 0.8,
      g + l * 0.23,
      D - Y * 0.75,
      g + l * 0.3,
      D - Y * 0.25,
    ),
    K.bezierCurveTo(
      g + l * 0.52,
      D - Y * 0.5,
      g + l * 0.62,
      D + Y * 0.04,
      g + l * 0.5,
      D + Y * 0.24,
    ),
    K.bezierCurveTo(
      g + l * 0.26,
      D + Y * 0.51,
      g - l * 0.35,
      D + Y * 0.41,
      g - l * 0.54,
      D + Y * 0.25,
    ),
    K.fill(),
    (K.strokeStyle = p),
    (K.lineWidth = 1.3));
  for (let Z = 0; Z < 5; Z++) {
    const s = (R() - 0.5) * l * 0.6,
      q = (R() - 0.4) * Y * 0.3;
    (K.beginPath(),
      K.ellipse(
        g + s,
        D + q,
        l * (0.12 + R() * 0.13),
        Y * 0.11,
        -0.1,
        Math.PI,
        TAU * 0.9,
      ),
      K.stroke());
  }
}
function makeBackground(K, g, D = null) {
  const l = document.createElement("canvas");
  ((l.width = Math.ceil(K * 1.3)), (l.height = Math.ceil(g * 1.3)));
  const Y = l.getContext("2d");
  Y.scale(1.3, 1.3);
  const r = rng(0x144ad + K);
  if (D) {
    const t = Math.max(K / D.naturalWidth, g / D.naturalHeight),
      H = D.naturalWidth * t,
      V = D.naturalHeight * t;
    Y.drawImage(D, (K - H) * 0.5, (g - V) * 0.5, H, V);
    const F = Y.createLinearGradient(0, 0, 0, g);
    return (
      F.addColorStop(0, "#d7e1c128"),
      F.addColorStop(0.48, "#d9ddb916"),
      F.addColorStop(1, "#e9d2a634"),
      (Y.fillStyle = F),
      Y.fillRect(0, 0, K, g),
      l
    );
  }
  const p = Y.createLinearGradient(0, 0, 0, g);
  (p.addColorStop(0, "#789da3"),
    p.addColorStop(0.25, "#b8c9b5"),
    p.addColorStop(0.56, "#e6d5ab"),
    p.addColorStop(1, "#dfbb8e"),
    (Y.fillStyle = p),
    Y.fillRect(0, 0, K, g));
  const R = K * 0.79,
    Z = g * 0.19,
    s = Math.min(K, g) * 0.11,
    q = Y.createRadialGradient(R, Z, s * 0.4, R, Z, s * 3.5);
  (q.addColorStop(0, "#ffedb18c"),
    q.addColorStop(1, "#ffe5b000"),
    (Y.fillStyle = q),
    Y.fillRect(0, 0, K, g),
    ellipse(Y, R, Z, s, s, "#f5e4b8"),
    ring(Y, R, Z, s + 8, "#e8dbb375"),
    ring(Y, R, Z, s + 13, "#e8dbb346"),
    (Y.globalAlpha = 0.12));
  for (let Q = 0; Q < 16; Q++) {
    const n = (Q / 16) * TAU;
    line(
      Y,
      R + Math.cos(n) * s * 1.24,
      Z + Math.sin(n) * s * 1.24,
      R + Math.cos(n) * s * 1.55,
      Z + Math.sin(n) * s * 1.55,
      C.cream,
      1,
    );
  }
  ((Y.globalAlpha = 1), (Y.globalAlpha = 0.06));
  for (let d = 0; d < 0x1900; d++) {
    const E = r() * K,
      G = r() * g;
    line(Y, E, G, E + r() * 4 + 0.4, G, r() < 0.5 ? "#ffffff" : C.ink, 0.6);
  }
  Y.globalAlpha = 1;
  for (let m = 0; m < 6; m++) {
    const O = (m / 5) * K + (r() - 0.5) * 45,
      S = g * (0.61 + r() * 0.12),
      J = 0.4 + r() * 0.6;
    (Y.save(),
      Y.translate(O, S),
      Y.scale(J, J),
      (Y.globalAlpha = 0.22),
      path(
        Y,
        [
          [-45, 0],
          [-33, 29],
          [-12, 35],
          [0, 83],
          [17, 41],
          [33, 30],
          [54, 0],
        ],
        "#416d76",
      ),
      path(
        Y,
        [
          [-35, 0],
          [-30, -18],
          [-25, -18],
          [-25, -65],
          [-13, -76],
          [-3, -64],
          [-3, -10],
          [5, -10],
          [5, -103],
          [12, -118],
          [18, -106],
          [18, -13],
          [33, -13],
          [39, 0],
        ],
        "#426c76",
      ),
      line(Y, -11, -66, -11, -12, "#c4cdb4", 3),
      Y.restore());
  }
  const U = [
    {
      y: 0.66,
      count: 9,
      color: "#aac0b0",
      light: "#d6ddbd",
      width: 0.27,
      height: 0.074,
    },
    {
      y: 0.77,
      count: 8,
      color: "#c8cdb0",
      light: "#eeebc9",
      width: 0.29,
      height: 0.1,
    },
    {
      y: 0.88,
      count: 7,
      color: "#e1d7b2",
      light: "#f7ebca",
      width: 0.33,
      height: 0.12,
    },
    {
      y: 1.025,
      count: 5,
      color: "#efd8b3",
      light: "#fff1d2",
      width: 0.45,
      height: 0.15,
    },
  ];
  U.forEach((N) => {
    const L = Y.createLinearGradient(
      0,
      g * (N.y - N.height),
      0,
      g * (N.y + N.height),
    );
    (L.addColorStop(0, N.light),
      L.addColorStop(0.35, N.color),
      L.addColorStop(1, "#9cb3a6"));
    for (let B = -1; B < N.count + 1; B++) {
      (cloud(
        Y,
        (B * K) / (N.count - 1),
        g * (N.y + r() * 0.045),
        K * N.width * (r() * 0.3 + 0.8),
        g * N.height,
        L,
        N.light,
        r,
      ),
        (Y.globalAlpha = 0.5),
        cloud(
          Y,
          ((B + 0.35) * K) / (N.count - 1),
          g * (N.y + 0.055 + r() * 0.025),
          K * N.width * 0.66,
          g * N.height * 0.72,
          N.color,
          "#f1e8c9",
          r,
        ),
        (Y.globalAlpha = 1));
    }
  });
  const A = Y.createLinearGradient(0, g * 0.7, 0, g);
  (A.addColorStop(0, "#ecdcb000"),
    A.addColorStop(0.8, "#f1d9b055"),
    A.addColorStop(1, "#f6dfbd88"),
    (Y.fillStyle = A),
    Y.fillRect(0, g * 0.7, K, g * 0.3),
    (Y.globalAlpha = 0.11));
  for (let N = 0; N < 60; N++) {
    const L = r() * K,
      B = g * (0.75 + r() * 0.25);
    curve(Y, L, B, L + 30, B - 3, L + 75 + r() * 150, B - 1, C.darkGold, 0.8);
  }
  return ((Y.globalAlpha = 1), l);
}
function armorPanel(K, g, D = C.jade) {
  const l = g.map((Q) => Q[0]),
    Y = g.map((Q) => Q[1]),
    r = Math.min(...l),
    R = Math.max(...l),
    Z = Math.min(...Y),
    s = Math.max(...Y),
    U = K.createLinearGradient(r, Z, R, s),
    A = D === C.pale ? "#f4efd0" : D === C.teal ? "#9cbdb0" : "#c5d9b8",
    t = D === C.pale ? "#8cae9f" : D === C.teal ? "#34636e" : "#548b8b";
  (U.addColorStop(0, A),
    U.addColorStop(0.25, D),
    U.addColorStop(0.68, D),
    U.addColorStop(1, t),
    path(K, g, U, C.ink, 2.8));
  const H = (r + R) / 2,
    V = (Z + s) / 2,
    F = g.map((Q) => [mix(H, Q[0], 0.945), mix(V, Q[1], 0.945)]);
  (path(K, F, null, "#d0d5a570", 1),
    K.save(),
    path(K, g),
    K.clip(),
    (K.globalAlpha *= 0.19));
  for (let Q = 0; Q < 5; Q++) {
    const n = r + (R - r) * (0.23 + Q * 0.13),
      d = Z + (s - Z) * (0.32 + Math.sin(Q * 7 + r) * 0.21);
    (line(K, n, d, n + Math.min(15, (R - r) * 0.11), d - 2, C.cream, 0.7),
      line(K, n + 2, d + 3, n + 8, d + 2, C.ink, 0.5));
  }
  K.restore();
  for (let E = 1; E < g.length; E++) {
    const G = g[E - 1],
      m = g[E];
    if (m[1] <= G[1] + 4)
      line(K, G[0], G[1] + 2, m[0], m[1] + 2, "#d4ddaf", 1.4);
  }
}
function scrollwork(K, g, D, l = 1, Y = 0) {
  (K.save(),
    K.translate(g, D),
    K.rotate(Y),
    K.scale(l, l),
    (K.strokeStyle = "#c7c98e"),
    (K.lineWidth = 1.3),
    K.beginPath(),
    K.moveTo(-33, 0),
    K.bezierCurveTo(-20, -12, 7, 17, 20, 0),
    K.bezierCurveTo(34, -17, 13, -22, 13, -10),
    K.bezierCurveTo(13, -1, 25, -6, 19, -11),
    K.stroke(),
    K.beginPath(),
    K.moveTo(33, 0),
    K.bezierCurveTo(20, 12, -7, -17, -20, 0),
    K.bezierCurveTo(-34, 17, -13, 22, -13, 10),
    K.bezierCurveTo(-13, 1, -25, 6, -19, 11),
    K.stroke(),
    path(
      K,
      [
        [-5, 0],
        [0, -5],
        [5, 0],
        [0, 5],
      ],
      "#c7c98e",
    ),
    K.restore());
}
function floatingIsland(K, g, D, l, Y) {
  (K.save(),
    K.translate(g, D + Math.sin(Y * 0.4 + l) * 5),
    K.scale(l, l),
    (K.globalAlpha *= 0.45));
  const r = K.createLinearGradient(-34, 0, 33, 83);
  (r.addColorStop(0, "#789e94"),
    r.addColorStop(0.65, "#4c777a"),
    r.addColorStop(1, "#9fb5a7"),
    path(
      K,
      [
        [-46, 1],
        [-34, 27],
        [-14, 43],
        [-6, 76],
        [6, 62],
        [15, 31],
        [38, 18],
        [49, -2],
      ],
      r,
    ),
    path(
      K,
      [
        [-34, 7],
        [-17, 29],
        [-6, 76],
        [-14, 43],
      ],
      "#b4c5a877",
    ),
    path(
      K,
      [
        [8, 5],
        [15, 31],
        [6, 62],
        [27, 17],
      ],
      "#2e606756",
    ),
    ellipse(K, 0, 0, 49, 9, "#a8bca1"),
    path(
      K,
      [
        [-19, -2],
        [-19, -34],
        [-14, -34],
        [-14, -43],
        [-3, -45],
        [1, -30],
        [9, -30],
        [9, -7],
      ],
      "#698d86",
    ),
    line(K, -12, -39, -12, -7, "#c7cfaf", 3),
    path(
      K,
      [
        [14, -5],
        [14, -21],
        [19, -21],
        [19, -28],
        [23, -28],
        [23, -4],
      ],
      "#799a8c",
    ),
    (K.globalAlpha *= 0.5),
    curve(K, -67, 14, -13, 5, 75, 18, "#f1e6c4", 5),
    curve(K, -57, 19, -7, 13, 49, 21, "#f1e6c4", 2),
    K.restore());
}
function drawBellkeeper(K, g, D) {
  const l = g.scale || 1;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  for (const Y of g.parts) {
    if (Y.kind === "core") continue;
    const r = (Y.x - g.x) / l,
      R = (Y.y - g.y) / l,
      Z = Math.sign(r),
      q = Z * (Math.abs(r) > 150 ? 177 : 73),
      U = q + Z * 39,
      A = R * 0.44,
      H = Y.hp > 0;
    (line(K, q, -21, U, A, C.ink, 19),
      line(K, q, -21, U, A, C.darkGold, 12),
      line(K, q - 3, -23, U - 3, A - 3, C.gold, 4));
    if (H) {
      (line(K, U, A, r, R - 17, C.ink, 12),
        line(K, U - 2, A, r - 2, R - 17, C.gold, 7));
      for (let V = 0; V < 6; V++) {
        const F = V / 6;
        line(
          K,
          mix(U, r, F) - 5,
          mix(A, R - 17, F),
          mix(U, r, F) + 5,
          mix(A, R - 17, F),
          C.ink,
          1.7,
        );
      }
    }
    gear(K, U, A, 14, 8, D * Z * 0.6, H ? C.gold : C.darkGold);
  }
  for (const Q of [-1, 1]) {
    (K.save(),
      K.scale(Q, 1),
      K.save(),
      K.translate(179, -60),
      K.rotate(-0.16 + Math.sin(D * 2.5) * 0.018),
      ellipse(K, 0, 0, 71, 22, C.ink, C.darkGold, 3),
      ellipse(K, 0, -4, 59, 17, C.darkGold, C.gold, 2));
    for (let d = 0; d < 6; d++) {
      const E = D * 6 + (d / 6) * TAU;
      line(K, 0, -4, Math.cos(E) * 55, -4 + Math.sin(E) * 14, C.pale, 5);
    }
    (ellipse(K, 0, -5, 13, 6, C.gold, C.ink, 2),
      K.restore(),
      armorPanel(
        K,
        [
          [35, -86],
          [123, -102],
          [220, -43],
          [180, 23],
          [71, 44],
          [34, 7],
        ],
        C.teal,
      ),
      armorPanel(
        K,
        [
          [44, -90],
          [121, -106],
          [188, -63],
          [140, -24],
          [52, 4],
        ],
        C.jade,
      ),
      path(
        K,
        [
          [54, -82],
          [119, -96],
          [166, -66],
          [133, -41],
          [55, -14],
        ],
        "#99c0a7",
        C.ink,
        1.1,
      ),
      scrollwork(K, 111, -60, 0.74, -0.18),
      curve(K, 64, -71, 101, -85, 143, -62, C.pale, 2),
      line(K, 55, -12, 175, -47, C.gold, 4),
      line(K, 65, 8, 165, -13, C.darkGold, 5));
    for (let G = 0; G < 6; G++) {
      const m = 73 + G * 15,
        O = 6 - G * 2.8;
      (path(
        K,
        [
          [m, O],
          [m + 10, O - 1],
          [m + 8, O + 14],
          [m, O + 15],
        ],
        C.ink,
        C.gold,
        0.8,
      ),
        line(K, m + 3, O + 4, m + 6, O + 3, "#ecc775", 2));
    }
    for (const [S, J] of [
      [56, -77],
      [120, -94],
      [175, -63],
      [55, -14],
      [142, -29],
      [171, 10],
    ])
      rivet(K, S, J, 2.8);
    (path(
      K,
      [
        [72, 25],
        [132, 11],
        [148, 29],
        [84, 46],
      ],
      C.ink,
      C.darkGold,
      2,
    ),
      gear(K, 96, 29, 12, 10, D * 0.65, C.darkGold),
      gear(K, 118, 23, 9, 8, -D * 0.85, C.gold),
      line(K, 68, -9, 152, -31, C.ink, 1.2),
      line(K, 73, -7, 148, -26, "#e2d3a5", 0.8));
    for (let N = 0; N < 4; N++) {
      const w = 151 + N * 8,
        L = -59 + N * 4;
      (line(K, w, L, w - 11, L + 9, "#325c65", 2),
        line(K, w + 1, L, w - 10, L + 9, "#bad0b1", 0.7));
    }
    const n = Math.sin(D * 3 + Q) * 10;
    (path(
      K,
      [
        [140, 16],
        [153, 13],
        [162 + n * 0.3, 65],
        [154 + n, 89],
        [145 + n * 0.6, 74],
      ],
      C.coral,
      C.ink,
      1.4,
    ),
      line(K, 148, 20, 152 + n * 0.5, 66, "#f6c28a", 1),
      K.restore());
  }
  (armorPanel(
    K,
    [
      [-48, -74],
      [-35, -119],
      [0, -145],
      [35, -119],
      [48, -74],
      [37, 22],
      [0, 55],
      [-37, 22],
    ],
    C.teal,
  ),
    armorPanel(
      K,
      [
        [-28, -81],
        [-20, -115],
        [0, -133],
        [20, -115],
        [28, -81],
        [22, 19],
        [0, 33],
        [-22, 19],
      ],
      C.jade,
    ),
    path(
      K,
      [
        [-12, -73],
        [-12, -105],
        [0, -116],
        [12, -105],
        [12, -73],
      ],
      C.ink,
      C.gold,
      2.3,
    ),
    line(K, 0, -108, 0, -76, C.gold, 2),
    line(K, -12, -89, 12, -89, C.gold, 2));
  for (const B of [-1, 1]) {
    (line(K, B * 29, -94, B * 36, -65, "#d4cd93", 1.2),
      line(K, B * 23, -59, B * 25, -28, "#2d6470", 3),
      line(K, B * 27, -59, B * 29, -28, "#d4cd93", 0.9),
      gear(K, B * 40, -42, 9, 8, D * B, C.gold));
  }
  (path(
    K,
    [
      [-39, -118],
      [0, -155],
      [39, -118],
      [29, -117],
      [0, -140],
      [-29, -117],
    ],
    C.gold,
    C.ink,
    1.6,
  ),
    line(K, 0, -155, 0, -168, C.ink, 3),
    path(
      K,
      [
        [0, -167],
        [25, -163],
        [17 + Math.sin(D * 3) * 3, -151],
        [0, -156],
      ],
      C.coral,
      C.ink,
      0.8,
    ));
  for (const T of [-1, 1]) {
    (K.save(),
      K.scale(T, 1),
      path(
        K,
        [
          [26, 34],
          [48, 31],
          [62, 4],
          [65, -32],
          [78, -44],
          [75, -3],
          [56, 46],
          [29, 57],
        ],
        C.gold,
        C.ink,
        2,
      ),
      curve(K, 35, 45, 57, 42, 66, -5, C.cream, 1),
      K.restore());
  }
  K.restore();
}
function drawGlasswing(K, g, D) {
  const l = g.scale || 1;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  const Y = Math.sin(D * 1.7) * 20;
  (K.beginPath(),
    K.moveTo(-17, 62),
    K.bezierCurveTo(-40, 135, Y - 60, 181, Y - 16, 205),
    K.bezierCurveTo(Y - 31, 163, 13, 127, 11, 68),
    K.closePath(),
    (K.fillStyle = C.teal),
    K.fill(),
    (K.strokeStyle = C.ink),
    (K.lineWidth = 2),
    K.stroke(),
    curve(K, 0, 72, Y - 25, 160, Y - 16, 193, C.gold, 2),
    K.beginPath(),
    K.moveTo(12, 71),
    K.bezierCurveTo(29, 125, Y + 55, 156, Y + 29, 172),
    (K.strokeStyle = C.coral),
    (K.lineWidth = 8),
    K.stroke());
  for (const r of [-1, 1]) {
    (K.save(), K.scale(r, 1));
    const R = Math.sin(D * 1.75 + 0.3) * 0.035;
    K.rotate(R);
    for (let Z = 7; Z >= 0; Z--) {
      const q = 61 + Z * 32,
        U = -34 - Z * 2.5;
      feather(
        K,
        q,
        U,
        -(0.22 + Z * 0.1) + Math.sin(D * 2 - Z * 0.4) * 0.035,
        135 - Z * 3,
        51 - Z * 1.8,
        Z % 2 ? C.teal : C.jade,
      );
    }
    (armorPanel(
      K,
      [
        [29, -48],
        [111, -98],
        [231, -91],
        [336, -28],
        [319, -13],
        [223, -57],
        [139, -45],
        [55, 22],
      ],
      C.jade,
    ),
      path(
        K,
        [
          [49, -45],
          [116, -84],
          [220, -77],
          [308, -31],
          [221, -64],
          [136, -60],
        ],
        C.pale,
        C.ink,
        1,
      ),
      scrollwork(K, 186, -70, 0.59, 0.06),
      path(
        K,
        [
          [60, -13],
          [147, -53],
          [224, -56],
          [314, -14],
          [233, -36],
          [155, -34],
          [65, 12],
        ],
        C.deep,
        C.ink,
        1.4,
      ),
      line(K, 47, -33, 111, -74, C.gold, 5),
      line(K, 116, -73, 215, -69, C.gold, 4),
      line(K, 220, -67, 311, -24, C.gold, 3),
      gear(K, 130, -67, 16, 10, -D * 0.5, C.gold));
    for (let A = 0; A < 6; A++)
      rivet(K, 166 + A * 22, -68 + Math.max(0, A - 2) * 10, 2);
    for (let H = 0; H < 3; H++) {
      const V = 81 + H * 34;
      path(
        K,
        [
          [V, -21 - H * 10],
          [V + 17, -34 - H * 7],
          [V + 19, -23 - H * 7],
          [V + 2, -7 - H * 10],
        ],
        "#264c58",
        C.gold,
        0.8,
      );
    }
    (armorPanel(
      K,
      [
        [224, -81],
        [283, -91],
        [348, -61],
        [366, -25],
        [306, -52],
      ],
      C.teal,
    ),
      line(K, 244, -79, 346, -40, C.gold, 2.7),
      K.restore());
  }
  for (const F of g.parts) {
    if (F.kind === "core" || F.hp <= 0) continue;
    const Q = (F.x - g.x) / l,
      n = (F.y - g.y) / l;
    (line(K, Q * 0.87, Math.min(-10, n - 38), Q, n, C.ink, 12),
      line(K, Q * 0.87 - 2, Math.min(-10, n - 38), Q - 2, n, C.gold, 5));
  }
  (armorPanel(
    K,
    [
      [0, -111],
      [40, -72],
      [54, -1],
      [27, 75],
      [0, 96],
      [-27, 75],
      [-54, -1],
      [-40, -72],
    ],
    C.teal,
  ),
    armorPanel(
      K,
      [
        [0, -104],
        [23, -66],
        [29, -5],
        [13, 67],
        [0, 81],
        [-13, 67],
        [-29, -5],
        [-23, -66],
      ],
      C.pale,
    ),
    path(
      K,
      [
        [0, -90],
        [12, -60],
        [8, -32],
        [-8, -32],
        [-12, -60],
      ],
      C.ink,
      C.gold,
      2,
    ),
    path(
      K,
      [
        [-35, -61],
        [-12, -46],
        [-15, -22],
        [-45, -32],
      ],
      C.ink,
      C.gold,
      1.6,
    ),
    path(
      K,
      [
        [35, -61],
        [12, -46],
        [15, -22],
        [45, -32],
      ],
      C.ink,
      C.gold,
      1.6,
    ),
    line(K, -34, -44, -21, -37, C.coral, 3),
    line(K, 34, -44, 21, -37, C.coral, 3));
  for (const d of [-1, 1]) {
    (K.save(),
      K.scale(d, 1),
      path(
        K,
        [
          [20, -77],
          [38, -88],
          [50, -117],
          [50, -82],
          [33, -61],
        ],
        C.gold,
        C.ink,
        2,
      ),
      line(K, 28, 40, 18, 62, C.gold, 1.2),
      line(K, 31, 33, 26, 45, "#264d59", 2),
      K.restore());
  }
  K.restore();
}
function drawCrown(K, g, D) {
  const l = g.scale || 1;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  const Y = D * 0.11;
  (K.save(),
    K.rotate(Y),
    ring(K, 0, 0, 190, C.ink, 20),
    ring(K, 0, 0, 194, C.gold, 3),
    ring(K, 0, 0, 181, C.gold, 2),
    ring(K, 0, 0, 203, "#e5c487", 1));
  for (let r = 0; r < 36; r++) {
    const R = (r / 36) * TAU,
      Z = r % 3 === 0;
    (K.save(),
      K.rotate(R),
      line(K, 0, -183, 0, -197, C.gold, Z ? 3 : 1),
      Z &&
        (path(
          K,
          [
            [-6, -199],
            [0, -214],
            [6, -199],
          ],
          C.gold,
          C.ink,
          1,
        ),
        rivet(K, 0, -189, 2)),
      K.restore());
  }
  for (let q = 0; q < 12; q++) {
    (K.save(),
      K.rotate((q / 12) * TAU),
      scrollwork(K, 0, -187, 0.28, 0),
      K.restore());
  }
  K.restore();
  for (let U = 0; U < 8; U++) {
    (K.save(), K.rotate((U / 8) * TAU - Y * 0.45));
    const A = Math.sin(D * 1.6 + U * 0.7) * 0.025;
    (feather(K, -12, -89, Math.PI + 0.18 + A, 119, 36, C.teal),
      feather(K, 12, -83, Math.PI - 0.13 + A, 140, 34, C.jade),
      K.restore());
  }
  (K.save(),
    K.rotate(-Y * 2.2),
    ring(K, 0, 0, 124, C.ink, 16),
    ring(K, 0, 0, 127, C.gold, 3),
    ring(K, 0, 0, 119, C.gold, 1.5));
  for (let H = 0; H < 12; H++) {
    const V = (H / 12) * TAU,
      F = Math.cos(V) * 124,
      Q = Math.sin(V) * 124;
    gear(
      K,
      F,
      Q,
      H % 3 ? 7 : 12,
      H % 3 ? 6 : 9,
      D * (H % 2 ? 1 : -1),
      H % 3 ? C.darkGold : C.gold,
    );
  }
  K.restore();
  for (const n of g.parts) {
    if (n.kind === "core" || n.hp <= 0) continue;
    const d = (n.x - g.x) / l,
      E = (n.y - g.y) / l,
      G = Math.atan2(E, d);
    (K.save(),
      K.rotate(G),
      path(
        K,
        [
          [63, -10],
          [95, -14],
          [Math.hypot(d, E), -7],
          [Math.hypot(d, E), 7],
          [95, 14],
          [63, 10],
        ],
        C.deep,
        C.ink,
        2,
      ),
      line(K, 66, 0, Math.hypot(d, E), 0, C.gold, 3),
      K.restore());
  }
  (armorPanel(
    K,
    [
      [0, -84],
      [49, -51],
      [68, 8],
      [39, 66],
      [0, 87],
      [-39, 66],
      [-68, 8],
      [-49, -51],
    ],
    C.jade,
  ),
    path(
      K,
      [
        [-50, -24],
        [-12, -3],
        [-20, 50],
        [-35, 60],
        [-57, 9],
      ],
      C.pale,
      C.ink,
      1.4,
    ),
    path(
      K,
      [
        [50, -24],
        [12, -3],
        [20, 50],
        [35, 60],
        [57, 9],
      ],
      C.pale,
      C.ink,
      1.4,
    ),
    path(
      K,
      [
        [-61, -30],
        [-31, -50],
        [0, -35],
        [31, -50],
        [61, -30],
        [38, -20],
        [0, -27],
        [-38, -20],
      ],
      C.gold,
      C.ink,
      2.4,
    ),
    path(
      K,
      [
        [-39, -53],
        [-47, -94],
        [-25, -79],
        [-13, -109],
        [0, -86],
        [13, -109],
        [25, -79],
        [47, -94],
        [39, -53],
      ],
      C.gold,
      C.ink,
      3,
    ),
    path(
      K,
      [
        [-34, -61],
        [-32, -77],
        [-22, -68],
        [-11, -89],
        [0, -70],
        [11, -89],
        [22, -68],
        [32, -77],
        [34, -61],
      ],
      C.pale,
      C.ink,
      1,
    ));
  for (const m of [-25, 0, 25]) ellipse(K, m, -59, 3, 4, C.coral, C.ink, 0.8);
  path(
    K,
    [
      [-17, 56],
      [0, 47],
      [17, 56],
      [0, 71],
    ],
    C.gold,
    C.ink,
    2,
  );
  for (const O of [-1, 1]) {
    (K.save(),
      K.scale(O, 1),
      curve(K, 32, 13, 25, 30, 35, 45, "#557f76", 1.2),
      curve(K, 40, 8, 31, 28, 39, 40, C.gold, 1),
      rivet(K, 42, -6, 2),
      K.restore());
  }
  (line(K, 0, 70, 0, 101, C.ink, 3),
    path(
      K,
      [
        [0, 98],
        [10, 112],
        [0, 133],
        [-10, 112],
      ],
      C.gold,
      C.ink,
      2,
    ),
    K.restore());
}
function drawSerpent(K, g, D) {
  const l = g.scale || 1,
    Y = g.parts
      .filter((V) => V.kind !== "core")
      .sort((V, F) => (V.baseLx ?? V.lx) - (F.baseLx ?? F.lx)),
    r = g.parts.find((V) => V.kind === "core");
  if (!Y.length || !r) return;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  const R = Y.map((V) => ({
      x: (V.x - g.x) / l,
      y: (V.y - g.y) / l,
      live: V.hp > 0,
    })),
    Z = { x: (r.x - g.x) / l, y: (r.y - g.y) / l };
  for (let V = 0; V < R.length; V++) {
    const F = R[V],
      Q = R[V + 1] || Z;
    (line(K, F.x, F.y + 8, Q.x, Q.y + 8, C.ink, 34),
      line(K, F.x, F.y + 6, Q.x, Q.y + 6, "#887e55", 25),
      line(K, F.x, F.y + 1, Q.x, Q.y + 1, C.gold, 6));
    const n = Q.x - F.x,
      d = Q.y - F.y,
      E = Math.hypot(n, d),
      G = -d / Math.max(1, E),
      m = n / Math.max(1, E);
    for (let O = 1; O < 6; O++) {
      const S = O / 6,
        J = mix(F.x, Q.x, S),
        N = mix(F.y, Q.y, S);
      line(
        K,
        J - G * 13,
        N - m * 13 + 6,
        J + G * 13,
        N + m * 13 + 6,
        "#3c5b56",
        2,
      );
    }
  }
  const q = R[0];
  (K.save(), K.translate(q.x, q.y));
  const U = Math.sin(D * 2.4) * 11;
  (path(
    K,
    [
      [-14, -17],
      [-48, -23],
      [-75, -49 + U],
      [-91, -53 + U],
      [-77, -29 + U],
      [-88, -12 + U * 0.3],
      [-60, 11],
      [-19, 19],
    ],
    C.jade,
    C.ink,
    2.2,
  ),
    path(
      K,
      [
        [-43, -12],
        [-76, -33 + U],
        [-64, -10],
        [-71, -4],
        [-39, 8],
      ],
      C.pale,
      C.gold,
      1.2,
    ),
    line(K, -16, 1, -72, -17 + U * 0.5, C.gold, 3));
  for (let w = 0; w < 3; w++)
    feather(K, -33 + w * 10, 11, -0.5 - w * 0.23, 37 + w * 10, 15, C.teal);
  K.restore();
  for (let L = 0; L < R.length; L++) {
    const B = R[L],
      T = R[Math.max(0, L - 1)],
      f = R[L + 1] || Z,
      M = Math.atan2(f.y - T.y, f.x - T.x) * 0.56;
    (K.save(), K.translate(B.x, B.y), K.rotate(M));
    if (B.live) {
      (feather(
        K,
        -10,
        -23,
        Math.PI - 0.18 + Math.sin(D * 2.2 + L) * 0.05,
        54 + (L % 2) * 13,
        25,
        C.jade,
      ),
        feather(
          K,
          -14,
          20,
          0.23 + Math.sin(D * 2.2 + L) * 0.06,
          47 + (L % 2) * 9,
          22,
          C.teal,
        ),
        armorPanel(
          K,
          [
            [-47, -19],
            [-23, -42],
            [20, -39],
            [47, -14],
            [39, 27],
            [6, 36],
            [-35, 24],
          ],
          L % 2 ? C.teal : C.jade,
        ),
        path(
          K,
          [
            [-39, -16],
            [-20, -30],
            [15, -30],
            [32, -18],
            [12, -21],
            [-17, -19],
          ],
          C.pale,
          C.gold,
          1,
        ),
        curve(K, -24, 24, -1, 31, 25, 20, C.gold, 2));
      for (let I = 0; I < 3; I++) {
        const X = -33 + I * 11;
        (line(K, X, 15, X + 6, 23, C.ink, 2.6),
          line(K, X + 2, 14, X + 8, 22, "#d5cd95", 0.8));
      }
      (rivet(K, -30, -18, 2.1), rivet(K, 30, -13, 2.1));
    } else
      for (let o = 0; o < 3; o++) {
        const h = -21 + o * 20;
        (curve(K, h - 7, -23, h - 23, 0, h - 5, 23, C.ink, 6),
          curve(K, h - 7, -23, h - 23, 0, h - 5, 23, C.darkGold, 3));
      }
    K.restore();
  }
  (K.save(), K.translate(Z.x, Z.y));
  const A = 4 + Math.sin(D * 2.8) * 2;
  (armorPanel(
    K,
    [
      [-45, -29],
      [-19, -54],
      [25, -45],
      [50, -23],
      [76, -14],
      [81, 5],
      [45, 19],
      [12, 36],
      [-29, 32],
      [-48, 10],
    ],
    C.jade,
  ),
    armorPanel(
      K,
      [
        [-32, -30],
        [-15, -44],
        [21, -35],
        [36, -19],
        [9, -25],
        [-13, -16],
      ],
      C.pale,
    ),
    path(
      K,
      [
        [30, 17],
        [77, 3],
        [77, 10 + A],
        [46, 25 + A],
        [18, 34],
      ],
      C.ink,
      C.gold,
      1.8,
    ),
    path(
      K,
      [
        [16, 36],
        [45, 27 + A],
        [80, 15 + A],
        [69, 30 + A],
        [39, 43 + A],
        [8, 44],
      ],
      C.teal,
      C.ink,
      2,
    ));
  for (let u = 0; u < 5; u++) {
    const W = 36 + u * 8,
      P = 17 - u * 2.6;
    path(
      K,
      [
        [W, P],
        [W + 6, P - 2],
        [W + 4, P + 8],
      ],
      C.cream,
      C.darkGold,
      0.8,
    );
  }
  (path(
    K,
    [
      [-19, -45],
      [-35, -78],
      [-28, -87],
      [-13, -66],
      [2, -53],
    ],
    C.gold,
    C.ink,
    2,
  ),
    path(
      K,
      [
        [13, -43],
        [14, -71],
        [28, -85],
        [30, -71],
        [26, -50],
      ],
      C.gold,
      C.ink,
      2,
    ),
    path(
      K,
      [
        [-19, -56],
        [-28, -76],
        [-17, -65],
        [-5, -55],
      ],
      C.cream,
    ),
    path(
      K,
      [
        [28, -27],
        [49, -21],
        [43, -12],
        [24, -16],
      ],
      C.ink,
      C.gold,
      1.2,
    ),
    line(K, 30, -20, 42, -17, C.coral, 2.5),
    ellipse(K, 69, -8, 5, 3, C.ink, C.gold, 1));
  const H = Math.sin(D * 2) * 9;
  (curve(K, 68, -8, 99, -18 + H, 77, -50 + H, C.ink, 4),
    curve(K, 68, -9, 98, -19 + H, 77, -51 + H, C.gold, 2),
    curve(K, 62, 25, 89, 53 + H, 65, 70 + H, C.ink, 4),
    curve(K, 62, 25, 89, 53 + H, 65, 70 + H, C.gold, 2));
  for (let e = 0; e < 3; e++)
    feather(K, -39, -11 + e * 16, 0.9 + e * 0.12, 43 + e * 6, 16, C.teal);
  (K.restore(), K.restore());
}
function drawLoom(K, g, D) {
  const l = g.scale || 1;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  const Y = g.parts.filter((q) => q.kind !== "core");
  for (let q = 0; q < Y.length; q++) {
    const U = Y[q],
      A = (U.x - g.x) / l,
      H = (U.y - g.y) / l,
      V = Math.atan2(H, A),
      F = Math.cos(V),
      Q = Math.sin(V),
      d = F * 60,
      E = Q * 73,
      G = q % 2 ? -1 : 1,
      m = A * 0.67 - Q * (43 + Math.sin(D * 1.25 + q) * 5) * G,
      O = H * 0.68 + F * 43 * G;
    (line(K, d, E, m, O, C.ink, 22),
      line(K, d - Q * 2, E + F * 2, m - Q * 2, O + F * 2, C.teal, 15),
      line(K, d + Q * 5, E - F * 5, m + Q * 5, O - F * 5, C.gold, 3),
      gear(K, d, E, 14, 9, D * (q % 2 ? 0.3 : -0.3), C.gold));
    if (U.hp > 0) {
      const S = Math.hypot(A - m, H - O),
        J = -(H - O) / Math.max(1, S),
        N = (A - m) / Math.max(1, S);
      (line(K, m + J * 7, O + N * 7, A + J * 7, H + N * 7, C.ink, 7),
        line(K, m - J * 7, O - N * 7, A - J * 7, H - N * 7, C.ink, 7),
        line(
          K,
          m + J * 7 - 1,
          O + N * 7 - 1,
          A + J * 7 - 1,
          H + N * 7 - 1,
          C.gold,
          3,
        ),
        line(K, m - J * 7, O - N * 7, A - J * 7, H - N * 7, "#8baaa0", 3));
      for (let w = 1; w < 4; w++) {
        const L = w / 4,
          B = mix(m, A, L),
          T = mix(O, H, L);
        line(K, B - J * 7, T - N * 7, B + J * 7, T + N * 7, C.darkGold, 2);
      }
      ((K.globalAlpha *= 0.42),
        curve(K, d, E, A * 0.37, H * 0.3 + 26, A, H, "#f6eac5", 1),
        (K.globalAlpha /= 0.42));
    }
    (gear(K, m, O, 18, 10, D * 0.34 * G, U.hp > 0 ? C.gold : C.darkGold),
      ellipse(K, m, O, 6, 6, C.jade, C.ink, 1.6));
  }
  (path(
    K,
    [
      [0, -138],
      [108, -7],
      [0, 143],
      [-108, -7],
    ],
    C.ink,
    C.gold,
    3.5,
  ),
    path(
      K,
      [
        [0, -111],
        [82, -6],
        [0, 112],
        [-82, -6],
      ],
      "#759b9477",
      C.gold,
      2,
    ));
  for (let f = -3; f <= 3; f++) {
    const z = f / 4,
      M = z * 56,
      I = 90 * (1 - Math.abs(z));
    (line(K, M - 8, -I, M + 8, I, "#e2d59b88", 1),
      line(K, -I * 0.65, M, I * 0.65, M, "#d7cc9866", 1));
  }
  for (const X of [-1, 1]) {
    (K.save(),
      K.scale(X, 1),
      armorPanel(
        K,
        [
          [0, -142],
          [22, -125],
          [98, -28],
          [113, -8],
          [97, 10],
          [77, -18],
          [6, -113],
        ],
        C.jade,
      ),
      armorPanel(
        K,
        [
          [108, -5],
          [86, 33],
          [16, 130],
          [0, 146],
          [0, 113],
          [68, 18],
          [81, -8],
        ],
        C.teal,
      ),
      line(K, 12, -118, 83, -27, C.cream, 1.3),
      line(K, 89, 5, 11, 119, C.gold, 2.5),
      rivet(K, 21, -108, 2.5),
      rivet(K, 75, -39, 2.5),
      rivet(K, 76, 23, 2.4),
      rivet(K, 22, 103, 2.4),
      scrollwork(K, 42, -73, 0.48, 0.85),
      K.restore());
  }
  const r = g.parts.find((o) => o.kind === "core"),
    R = r ? (r.x - g.x) / l : 0,
    Z = r ? (r.y - g.y) / l : 0;
  (curve(K, 0, -121, R + 26, -40, R, Z, C.gold, 2),
    curve(K, 0, 122, R - 20, 47, R, Z, C.gold, 2),
    K.save(),
    K.translate(R, Z),
    armorPanel(
      K,
      [
        [0, -60],
        [44, -23],
        [54, 19],
        [26, 59],
        [0, 75],
        [-26, 59],
        [-54, 19],
        [-44, -23],
      ],
      C.pale,
    ),
    path(
      K,
      [
        [-41, -29],
        [-18, -50],
        [0, -40],
        [18, -50],
        [41, -29],
        [24, -21],
        [0, -30],
        [-24, -21],
      ],
      C.gold,
      C.ink,
      2,
    ));
  for (const o of [-1, 1]) {
    (K.save(),
      K.scale(o, 1),
      path(
        K,
        [
          [35, 22],
          [57, 36],
          [46, 66],
          [24, 80],
          [35, 55],
          [37, 41],
          [23, 35],
        ],
        C.teal,
        C.ink,
        2,
      ),
      line(K, 35, 31, 46, 41, C.gold, 1.4),
      path(
        K,
        [
          [22, -44],
          [35, -67],
          [35, -80],
          [45, -63],
          [39, -40],
        ],
        C.gold,
        C.ink,
        1.6,
      ),
      K.restore());
  }
  (K.restore(),
    gear(K, 0, -133, 12, 10, D * 0.75, C.gold),
    gear(K, 0, 134, 12, 10, -D * 0.75, C.gold),
    K.restore());
}
function sunWheel(K, g, D, l, Y, p) {
  (K.save(), K.translate(g, D), K.rotate(Y));
  const R = K.createRadialGradient(-l * 0.15, -l * 0.2, 2, 0, 0, l);
  (R.addColorStop(0, p ? "#fff3bd" : "#9bb9ac"),
    R.addColorStop(0.58, p ? "#dab56d" : "#578b8c"),
    R.addColorStop(1, p ? "#a48149" : "#315b65"),
    ellipse(K, 0, 0, l, l, R, C.ink, 3),
    ring(K, 0, 0, l - 5, C.gold, 1.5),
    ring(K, 0, 0, l + 5, C.gold, 2));
  for (let Z = 0; Z < 12; Z++) {
    (K.save(),
      K.rotate((Z / 12) * TAU),
      path(
        K,
        [
          [-4, -l - 3],
          [0, -l - 14],
          [4, -l - 3],
        ],
        C.gold,
        C.ink,
        1,
      ),
      line(K, 0, -l + 8, 0, -l + 18, "#6d715650", 1.3),
      K.restore());
  }
  for (let s = 0; s < 6; s++) {
    (K.save(),
      K.rotate((s / 6) * TAU),
      curve(
        K,
        0,
        -l * 0.74,
        l * 0.4,
        -l * 0.39,
        0,
        -l * 0.15,
        p ? "#f8e2aa" : "#94b2a0",
        1.2,
      ),
      K.restore());
  }
  (ellipse(K, 0, 0, l * 0.21, l * 0.21, p ? C.cream : C.pale, C.gold, 2),
    K.restore());
}
function drawArk(K, g, D) {
  const l = g.scale || 1;
  (K.save(), K.translate(g.x, g.y), K.scale(l, l));
  for (const r of [-1, 1]) {
    const R = g.polarity === (r < 0 ? 0 : 1) || g.polarity == null;
    (sunWheel(K, r * 135, -91, 51, D * 0.1 * r, R),
      line(K, r * 135, -37, r * 131, 14, C.ink, 13),
      line(K, r * 137, -37, r * 133, 14, C.gold, 4));
  }
  (K.beginPath(),
    K.moveTo(-348, -76),
    K.bezierCurveTo(-277, -15, -215, 29, 0, 55),
    K.bezierCurveTo(215, 29, 277, -15, 348, -76),
    K.bezierCurveTo(325, 55, 208, 123, 0, 148),
    K.bezierCurveTo(-208, 123, -325, 55, -348, -76),
    K.closePath());
  const Y = K.createLinearGradient(0, -61, 0, 148);
  (Y.addColorStop(0, "#b5ccb0"),
    Y.addColorStop(0.34, C.jade),
    Y.addColorStop(0.65, C.teal),
    Y.addColorStop(1, C.deep),
    (K.fillStyle = Y),
    K.fill(),
    (K.strokeStyle = C.ink),
    (K.lineWidth = 3),
    K.stroke(),
    K.beginPath(),
    K.moveTo(-341, -63),
    K.bezierCurveTo(-259, 36, -154, 60, 0, 79),
    K.bezierCurveTo(154, 60, 259, 36, 341, -63),
    (K.strokeStyle = C.gold),
    (K.lineWidth = 5),
    K.stroke(),
    K.beginPath(),
    K.moveTo(-319, -10),
    K.bezierCurveTo(-236, 72, -130, 91, 0, 108),
    K.bezierCurveTo(130, 91, 236, 72, 319, -10),
    (K.strokeStyle = C.ink),
    (K.lineWidth = 7),
    K.stroke(),
    K.beginPath(),
    K.moveTo(-319, -12),
    K.bezierCurveTo(-236, 70, -130, 89, 0, 106),
    K.bezierCurveTo(130, 89, 236, 70, 319, -12),
    (K.strokeStyle = C.gold),
    (K.lineWidth = 2),
    K.stroke());
  for (const Z of [-1, 1]) {
    (K.save(),
      K.scale(Z, 1),
      armorPanel(
        K,
        [
          [269, -11],
          [326, -70],
          [352, -111],
          [348, -60],
          [330, -16],
          [296, 24],
        ],
        C.jade,
      ),
      path(
        K,
        [
          [322, -54],
          [343, -88],
          [336, -45],
          [302, -2],
        ],
        C.pale,
        C.gold,
        1.2,
      ));
    for (let U = 0; U < 7; U++) {
      const A = 56 + U * 32,
        H = 68 - U * U * 1.15;
      (path(
        K,
        [
          [A - 5, H + 12],
          [A - 5, H],
          [A, H - 5],
          [A + 5, H],
          [A + 5, H + 10],
        ],
        C.ink,
        C.darkGold,
        0.9,
      ),
        line(K, A, H, A, H + 7, "#f2d18d", 1.5),
        rivet(K, A + 12, H + 15, 1.7));
    }
    for (let V = 0; V < 4; V++) {
      const F = 67 + V * 61,
        Q = 122 - V * V * 6;
      (path(
        K,
        [
          [F - 10, Q - 20],
          [F + 3, Q - 24],
          [F + 12, Q + 6],
          [F - 2, Q + 12],
        ],
        C.gold,
        C.ink,
        1.4,
      ),
        line(K, F - 1, Q - 17, F + 5, Q + 5, C.cream, 1));
    }
    scrollwork(K, 206, 29, 0.75, -0.35);
    const q = Math.sin(D * 2.7 + Z) * 9;
    (path(
      K,
      [
        [197, 70],
        [210, 65],
        [221 + q * 0.4, 121],
        [208 + q, 141],
        [202 + q * 0.5, 127],
      ],
      C.coral,
      C.ink,
      1.2,
    ),
      K.restore());
  }
  (armorPanel(
    K,
    [
      [-38, -32],
      [-36, -111],
      [-21, -139],
      [0, -160],
      [21, -139],
      [36, -111],
      [38, -32],
      [56, 32],
      [34, 94],
      [0, 177],
      [-34, 94],
      [-56, 32],
    ],
    C.teal,
  ),
    armorPanel(
      K,
      [
        [-20, -32],
        [-19, -105],
        [0, -129],
        [19, -105],
        [20, -32],
        [32, 28],
        [19, 86],
        [0, 143],
        [-19, 86],
        [-32, 28],
      ],
      C.pale,
    ),
    path(
      K,
      [
        [-33, -120],
        [0, -171],
        [33, -120],
        [22, -119],
        [0, -151],
        [-22, -119],
      ],
      C.gold,
      C.ink,
      2,
    ),
    path(
      K,
      [
        [-10, -64],
        [-10, -100],
        [0, -113],
        [10, -100],
        [10, -64],
      ],
      C.ink,
      C.gold,
      1.7,
    ),
    line(K, 0, -106, 0, -68, C.gold, 1.5),
    line(K, -9, -87, 9, -87, C.gold, 1.4));
  for (const n of [-1, 1]) {
    (path(
      K,
      [
        [n * 42, -15],
        [n * 63, -28],
        [n * 60, -82],
        [n * 72, -111],
        [n * 82, -79],
        [n * 77, -1],
      ],
      C.jade,
      C.ink,
      2,
    ),
      line(K, n * 69, -74, n * 68, -18, C.gold, 1.5),
      gear(K, n * 47, 63, 15, 10, D * n * 0.34, C.gold));
  }
  path(
    K,
    [
      [-13, 114],
      [0, 145],
      [13, 114],
      [0, 183],
    ],
    C.gold,
    C.ink,
    1.8,
  );
  for (const d of g.parts) {
    if (d.kind === "core" || d.hp <= 0) continue;
    const E = (d.x - g.x) / l,
      G = (d.y - g.y) / l;
    (line(K, E * 0.93, G - 20, E, G, C.ink, 12),
      line(K, E * 0.93 - 2, G - 21, E - 2, G - 1, C.gold, 5));
  }
  K.restore();
}
function drawPart(K, g, D, l, Y) {
  if (g.hp <= 0) return;
  const R = D.scale || 1,
    Z = g.r || 25,
    q = g.kind === "core",
    U = g.exposed && g.active !== ![] && !(g.cooldown > 0),
    A = g.id === Y,
    H = Z / (q ? 30 : 25);
  (K.save(), K.translate(g.x, g.y));
  if (g.kind === "bell")
    (K.save(),
      K.scale(H, H),
      path(
        K,
        [
          [-17, -22],
          [-13, -35],
          [13, -35],
          [17, -22],
          [21, 16],
          [31, 25],
          [31, 33],
          [-31, 33],
          [-31, 25],
          [-21, 16],
        ],
        C.gold,
        C.ink,
        2.6,
      ),
      path(
        K,
        [
          [-11, -22],
          [11, -22],
          [16, 20],
          [-16, 20],
        ],
        C.teal,
        C.ink,
        1,
      ),
      line(K, -24, 25, 24, 25, C.cream, 2),
      ellipse(K, 0, 33, 7, 10, C.darkGold, C.ink, 1.6),
      line(K, -9, -32, 9, -32, C.cream, 2),
      K.restore());
  else {
    if (g.kind === "engine") {
      (K.save(),
        K.rotate((g.angle || 0) * 0.12),
        K.scale(H, H),
        path(
          K,
          [
            [-19, -25],
            [0, -37],
            [19, -25],
            [24, 15],
            [12, 31],
            [-12, 31],
            [-24, 15],
          ],
          C.gold,
          C.ink,
          2.4,
        ));
      for (const F of [-1, 1]) {
        path(
          K,
          [
            [F * 17, -11],
            [F * 34, -18],
            [F * 30, 17],
            [F * 18, 22],
          ],
          C.jade,
          C.ink,
          2,
        );
      }
      K.restore();
    } else {
      if (g.kind === "shield")
        (K.save(),
          K.rotate(l * 0.3 + (g.angle || 0)),
          K.scale(H, H),
          path(
            K,
            [
              [0, -40],
              [29, -22],
              [33, 8],
              [19, 31],
              [0, 40],
              [-19, 31],
              [-33, 8],
              [-29, -22],
            ],
            C.gold,
            C.ink,
            2.5,
          ),
          path(
            K,
            [
              [0, -32],
              [21, -17],
              [25, 7],
              [14, 24],
              [0, 30],
              [-14, 24],
              [-25, 7],
              [-21, -17],
            ],
            C.jade,
            C.ink,
            1.5,
          ),
          K.restore());
      else {
        if (g.kind === "coil") {
          (K.save(),
            K.scale(H, H),
            path(
              K,
              [
                [-27, -18],
                [-16, -31],
                [17, -31],
                [28, -18],
                [28, 17],
                [15, 30],
                [-16, 30],
                [-27, 18],
              ],
              C.darkGold,
              C.ink,
              2.2,
            ));
          for (const Q of [-1, 1]) {
            for (let x = 0; x < 3; x++) {
              const n = -15 + x * 13;
              (curve(K, Q * 18, n - 3, Q * 36, n, Q * 24, n + 8, C.ink, 5),
                curve(
                  K,
                  Q * 18,
                  n - 4,
                  Q * 35,
                  n - 1,
                  Q * 24,
                  n + 7,
                  C.gold,
                  2.5,
                ));
            }
          }
          K.restore();
        } else {
          if (g.kind === "spindle") {
            (K.save(),
              K.rotate((g.angle || 0) * 0.18),
              K.scale(H, H),
              path(
                K,
                [
                  [-25, -31],
                  [25, -31],
                  [17, -20],
                  [17, 20],
                  [27, 33],
                  [-27, 33],
                  [-17, 20],
                  [-17, -20],
                ],
                C.teal,
                C.ink,
                2.3,
              ),
              ellipse(K, 0, -28, 31, 9, C.gold, C.ink, 2),
              ellipse(K, 0, 30, 32, 9, C.darkGold, C.ink, 2),
              ring(K, 0, 0, 28, C.pale, 1.2));
            for (const d of [-1, 1]) {
              for (let E = 0; E < 4; E++)
                line(
                  K,
                  d * 20,
                  -15 + E * 10,
                  d * 29,
                  -18 + E * 10,
                  C.cream,
                  1.1,
                );
            }
            (rivet(K, 0, -29, 3), rivet(K, 0, 31, 3), K.restore());
          } else {
            if (g.kind === "reactor") {
              (K.save(),
                K.scale(H, H),
                armorPanel(
                  K,
                  [
                    [-20, -29],
                    [-10, -38],
                    [10, -38],
                    [20, -29],
                    [29, 0],
                    [22, 25],
                    [0, 36],
                    [-22, 25],
                    [-29, 0],
                  ],
                  g.exposed ? C.jade : C.teal,
                ));
              for (const G of [-1, 1]) {
                path(
                  K,
                  [
                    [G * 23, -19],
                    [G * 36, -27],
                    [G * 33, 22],
                    [G * 24, 27],
                  ],
                  C.gold,
                  C.ink,
                  1.4,
                );
                for (let m = 0; m < 4; m++)
                  line(K, G * 27, -13 + m * 8, G * 32, -15 + m * 8, C.ink, 1.3);
              }
              (path(
                K,
                [
                  [-8, 31],
                  [0, 45],
                  [8, 31],
                ],
                C.gold,
                C.ink,
                1.1,
              ),
                K.restore());
            }
          }
        }
      }
    }
  }
  if (q)
    (gear(K, 0, 0, Z + 10 * R, 12, -l * 0.3, C.gold),
      ellipse(K, 0, 0, Z + 3 * R, Z + 3 * R, C.ink, C.cream, 1.2));
  else ellipse(K, 0, 0, Z + 4 * R, Z + 4 * R, C.ink, C.darkGold, 2);
  if (U) {
    const O = 0.65 + Math.sin(l * 5 + g.x * 0.01) * 0.2;
    ellipse(K, 0, 0, Z - 2 * R, Z - 2 * R, "#4b6655");
    const S = K.createRadialGradient(0, 0, Z * 0.08, 0, 0, Z);
    (S.addColorStop(0, "#fff3bb"),
      S.addColorStop(0.35, "#e6bd71"),
      S.addColorStop(1, "#9c945a"),
      ellipse(K, 0, 0, Z * 0.75, Z * 0.75, S),
      (K.globalAlpha = 0.4),
      ring(K, 0, 0, Z + 6 * R + O * 2, C.cream, 1.2 * R),
      (K.globalAlpha = 1),
      ring(K, 0, 0, Z, C.cream, 2.8 * R),
      path(
        K,
        [
          [0, -Z * 0.48],
          [Z * 0.32, 0],
          [0, Z * 0.48],
          [-Z * 0.32, 0],
        ],
        "#fff8d8",
        C.darkGold,
        1.2 * R,
      ));
    for (let y = 0; y < 4; y++) {
      (K.save(),
        K.rotate((y * Math.PI) / 2),
        path(
          K,
          [
            [-3 * R, -Z - 4 * R],
            [0, -Z + 2 * R],
            [3 * R, -Z - 4 * R],
          ],
          C.cream,
        ),
        K.restore());
    }
  } else {
    ellipse(K, 0, 0, Z - 1, Z - 1, "#365b60", "#8caa8c", 2 * R);
    for (let J = -1; J <= 1; J++) {
      path(
        K,
        [
          [-Z * 0.75, J * Z * 0.46 - Z * 0.15],
          [Z * 0.72, J * Z * 0.46 - Z * 0.26],
          [Z * 0.76, J * Z * 0.46 + Z * 0.09],
          [-Z * 0.73, J * Z * 0.46 + Z * 0.2],
        ],
        J === 0 ? "#779b8b" : "#577c73",
        C.ink,
        R,
      );
    }
    ((K.strokeStyle = C.pale),
      (K.lineWidth = 1.8 * R),
      K.beginPath(),
      K.arc(0, -2 * R, 4 * R, Math.PI, 0),
      K.stroke(),
      (K.fillStyle = C.pale),
      K.fillRect(-5 * R, -2 * R, 10 * R, 8 * R),
      (K.fillStyle = C.ink),
      K.fillRect(-R, 0, 2 * R, 3 * R));
    if (g.cooldown > 0)
      ring(
        K,
        0,
        0,
        Z + 3 * R,
        "#cbdac0",
        2 * R,
        -Math.PI / 2,
        -Math.PI / 2 + TAU * clamp(1 - g.cooldown / (q ? 1.2 : 1.05), 0.06, 1),
      );
  }
  const V = Math.max(1, Math.min(10, Math.ceil(g.maxHp || 1)));
  if (!q)
    for (let N = 0; N < V; N++) {
      const w = Math.PI * 0.15 + (N / V) * Math.PI * 0.7;
      ring(
        K,
        0,
        0,
        Z + 8 * R,
        N < g.hp ? C.gold : "#193d4960",
        3 * R,
        w,
        w + (Math.PI * 0.7) / V - 0.08,
      );
    }
  if (A && U) {
    (K.save(), K.rotate(l * 0.5));
    for (let L = 0; L < 4; L++) {
      const B = (L * TAU) / 4;
      ring(K, 0, 0, Z + 13 * R, C.cream, 2 * R, B, B + 0.55);
    }
    K.restore();
  }
  K.restore();
}
function drawKnight(K, g, D, l) {
  const Y = Math.hypot(g.vx || 0, g.vy || 0),
    r = g.hook
      ? Math.atan2(g.vy || 0, g.vx || 1)
      : clamp((g.vx || 0) / 600, -0.7, 0.7);
  if (l.length > 2) {
    K.beginPath();
    for (let Z = 0; Z < l.length; Z++) {
      const s = l[Z],
        q = 1 - Z / l.length;
      if (!Z) K.moveTo(s.x, s.y);
      else K.lineTo(s.x, s.y);
      K.lineWidth = 7 * q;
    }
    ((K.strokeStyle = "#e9804e48"),
      (K.lineWidth = g.hook ? 11 : 3),
      (K.lineCap = "round"),
      K.stroke());
  }
  (K.save(), K.translate(g.x, g.y));
  g.invuln > 0 &&
    ((K.globalAlpha = 0.25 + Math.sin(D * 24) * 0.08),
    ellipse(K, 0, 0, 26, 26, C.cream),
    (K.globalAlpha = 1),
    ring(K, 0, 0, 23, "#fff0be", 1.5, D * 2, D * 2 + 4.3));
  if (g.hook) K.rotate(r + Math.PI / 2);
  else K.rotate(r * 0.45);
  const R = Math.sin(D * 14) * (Y > 100 ? 6 : 3);
  (K.beginPath(),
    K.moveTo(-5, -6),
    K.bezierCurveTo(-18, -1, -13 + R, 18, -21 + R, 24),
    K.lineTo(-4, 19),
    K.lineTo(5, 27 + R * 0.4),
    K.quadraticCurveTo(8, 9, 5, -4),
    K.closePath(),
    (K.fillStyle = C.red),
    K.fill(),
    (K.strokeStyle = C.ink),
    (K.lineWidth = 1.8),
    K.stroke(),
    path(
      K,
      [
        [-6, -5],
        [3, -3],
        [-4, 18],
        [-16 + R * 0.4, 23],
        [-12, 6],
      ],
      C.coral,
    ),
    curve(K, -7, -2, -7, 12, -15 + R * 0.4, 20, "#ffc18b", 1.2),
    path(
      K,
      [
        [-5, 7],
        [-5, 17],
        [-10, 20],
        [-11, 16],
        [-8, 13],
        [-9, 6],
      ],
      C.ink,
    ),
    path(
      K,
      [
        [2, 7],
        [7, 16],
        [13, 15],
        [13, 19],
        [5, 21],
        [-2, 11],
      ],
      C.ink,
    ),
    path(
      K,
      [
        [-7, -6],
        [5, -7],
        [8, 6],
        [2, 12],
        [-7, 8],
      ],
      "#dbdfbd",
      C.ink,
      1.6,
    ),
    line(K, -5, 1, 5, 0, C.gold, 2),
    line(K, 1, -5, 1, 8, "#8ea799", 1.5),
    path(
      K,
      [
        [3, -4],
        [10, 3],
        [13, -1],
        [16, 1],
        [12, 8],
        [4, 5],
      ],
      C.pale,
      C.ink,
      1.5,
    ),
    line(K, 14, 18, 14, -39, C.ink, 4),
    line(K, 13, 18, 13, -39, C.gold, 2),
    path(
      K,
      [
        [13, -52],
        [19, -32],
        [13, -36],
        [8, -31],
      ],
      C.cream,
      C.ink,
      1.2,
    ),
    line(K, 13, -47, 13, -36, "#dca75c", 1),
    path(
      K,
      [
        [-9, -13],
        [-6, -23],
        [3, -26],
        [10, -20],
        [10, -10],
        [4, -5],
        [-6, -6],
      ],
      C.pale,
      C.ink,
      1.8,
    ),
    path(
      K,
      [
        [0, -24],
        [7, -21],
        [8, -10],
        [2, -6],
      ],
      "#a6beb0",
    ),
    path(
      K,
      [
        [-9, -15],
        [11, -18],
        [11, -13],
        [-8, -10],
      ],
      C.ink,
    ),
    line(K, -6, -12, 1, -14, "#f2d59b", 1.2),
    path(
      K,
      [
        [-4, -24],
        [-7, -29],
        [-3, -36],
        [2, -32],
        [3, -25],
      ],
      C.coral,
      C.ink,
      1.2,
    ),
    path(
      K,
      [
        [-9, -6],
        [9, -8],
        [10, -2],
        [-7, -1],
      ],
      C.coral,
      C.ink,
      1,
    ),
    K.restore());
}
export function createRenderer(K) {
  const g = K.getContext("2d", { alpha: ![] });
  if (!g) throw new Error("Canvas\x202D\x20is\x20unavailable.");
  let D = 0x3e8,
    l = 700,
    Y = 0x3e8,
    r = 700,
    p = 1,
    R = 1,
    Z = 0,
    s = 0,
    q = null,
    U = 0,
    A = 0,
    t = null,
    H = ![],
    V = 0,
    F = 0,
    Q = 0,
    x = "",
    n = [],
    d = [],
    E = [],
    G = [],
    m = [];
  const O = (k) => {
      if (n.length < 480) n.push(k);
    },
    S = new Image();
  ((S.onload = () => {
    if (H) return;
    ((t = S), (q = makeBackground(Y, r, t)));
  }),
    (S.src = new URL("./assets/cloudsea.webp", import.meta.url).href));
  function y(k, z, M = 1, I = 0x3e8, i = 700) {
    ((D = Math.max(1, k)), (l = Math.max(1, z)), (p = clamp(M || 1, 1, 2)));
    const X = Y !== I || r !== i || !q;
    ((Y = I),
      (r = i),
      (R = Math.min(D / Y, l / r)),
      (Z = (D - Y * R) / 2),
      (s = (l - r * R) / 2),
      (K.width = Math.round(D * p)),
      (K.height = Math.round(l * p)),
      (K.style.width = D + "px"),
      (K.style.height = l + "px"));
    if (X) q = makeBackground(Y, r, t);
    return {
      scale: R,
      x: Z,
      y: s,
      offsetX: Z,
      offsetY: s,
      width: D,
      height: l,
      worldW: Y,
      worldH: r,
    };
  }
  function J(k, z) {
    const M = Number.isFinite(k.x) ? k.x : z?.boss?.x || Y / 2,
      I = Number.isFinite(k.y) ? k.y : z?.boss?.y || r / 2;
    k.type === "boss_start" &&
      ((E.length = 0),
      (d.length = 0),
      (n.length = 0),
      (m.length = 0),
      (U = Math.max(U, 1.5)));
    if (k.type === "strike" || k.type === "break" || k.type === "deflect") {
      const X = k.type === "break",
        o = k.type === "deflect";
      U = Math.max(U, X ? 9 : o ? 1 : 4.5);
      if (!o) A = Math.max(A, X ? 0.1 : 0.035);
      (G.push({
        x: M,
        y: I,
        age: 0,
        life: X ? 0.6 : 0.35,
        r: X ? 120 : 68,
        color: o ? "#d2fff2" : C.cream,
      }),
        d.push({
          x: M,
          y: I,
          a: rnd(-0.9, -0.45),
          age: 0,
          life: X ? 0.27 : 0.18,
          size: X ? 120 : 75,
        }));
      const h = X ? 37 : o ? 7 : 18;
      for (let u = 0; u < h; u++) {
        const W = rnd(0, TAU),
          P = rnd(50, X ? 380 : 260);
        O({
          x: M,
          y: I,
          vx: Math.cos(W) * P,
          vy: Math.sin(W) * P - 50,
          age: 0,
          life: rnd(0.3, 1.1),
          r: rnd(1.5, X ? 7 : 3),
          a: W,
          spin: rnd(-5, 5),
          gravity: X ? 150 : 20,
          color: [C.cream, C.gold, C.jade, C.coral][u % 4],
          kind: X && u % 3 === 0 ? "plate" : "spark",
        });
      }
    }
    if (k.type === "hurt") {
      ((U = 8),
        (A = -0.18),
        G.push({ x: M, y: I, age: 0, life: 0.5, r: 72, color: C.coral }));
      for (let b = 0; b < 13; b++)
        O({
          x: M,
          y: I,
          vx: rnd(-120, 120),
          vy: rnd(-130, 20),
          age: 0,
          life: 0.6,
          r: rnd(2, 5),
          a: rnd(0, TAU),
          spin: 2,
          gravity: 200,
          color: C.coral,
          kind: "plate",
        });
    }
    k.type === "hook" &&
      G.push({
        x: z?.player?.x || M,
        y: z?.player?.y || I,
        age: 0,
        life: 0.25,
        r: 36,
        color: C.cream,
      });
    if (k.type === "burst") {
      ((U = 10), (A = 0.19));
      for (let K0 = 0; K0 < 3; K0++)
        G.push({
          x: M,
          y: I,
          age: -K0 * 0.09,
          life: 0.7,
          r: Y * 0.85,
          color: K0 % 2 ? C.gold : C.cream,
        });
      for (let K1 = 0; K1 < 90; K1++) {
        const K2 = (K1 / 90) * TAU,
          K3 = rnd(120, 700);
        O({
          x: M,
          y: I,
          vx: Math.cos(K2) * K3,
          vy: Math.sin(K2) * K3,
          age: 0,
          life: rnd(0.5, 0.9),
          r: rnd(2, 4),
          a: K2,
          spin: 0,
          gravity: 0,
          color: K1 % 2 ? C.gold : C.cream,
          kind: "spark",
        });
      }
    }
    if (k.type === "boss_defeat") {
      ((U = 14),
        (A = 0.3),
        G.push({ x: M, y: I, age: 0, life: 1.2, r: Y * 0.7, color: C.cream }));
      for (let K4 = 0; K4 < 135; K4++) {
        const K5 = rnd(0, TAU),
          K6 = rnd(0, 170),
          K7 = rnd(20, 270);
        O({
          x: M + Math.cos(K5) * K6,
          y: I + Math.sin(K5) * K6 * 0.65,
          vx: Math.cos(K5) * K7,
          vy: Math.sin(K5) * K7 - 90,
          age: 0,
          life: rnd(1, 3.8),
          r: rnd(3, K4 % 4 ? 12 : 25),
          a: K5,
          spin: rnd(-3, 3),
          gravity: 90,
          color: [C.gold, C.jade, C.teal, C.pale, C.cream][K4 % 5],
          kind: K4 % 3 ? "plate" : "spark",
        });
      }
    }
    if (k.type === "win") {
      A = 0.3;
      for (let K8 = 0; K8 < 35; K8++)
        m.push({
          x: rnd(-100, Y),
          y: rnd(r * 0.4, r * 1.2),
          size: rnd(5, 13),
          speed: rnd(25, 65),
          phase: rnd(0, TAU),
        });
    }
    if (k.type === "upgrade") {
      const K9 = z?.player;
      G.push({
        x: K9?.x || M,
        y: K9?.y || I,
        age: 0,
        life: 0.8,
        r: 120,
        color: C.pale,
      });
    }
    if (
      k.type === "core_open" ||
      k.type === "enrage" ||
      k.type === "armor_reform"
    ) {
      U = Math.max(U, 5);
      for (let KK = 0; KK < 3; KK++)
        G.push({
          x: M,
          y: I,
          age: -KK * 0.11,
          life: 0.85,
          r: 190 + KK * 18,
          color: k.type === "enrage" ? C.coral : C.cream,
        });
      for (let Kg = 0; Kg < 24; Kg++) {
        const KD = (Kg / 24) * TAU;
        O({
          x: M,
          y: I,
          vx: Math.cos(KD) * 140,
          vy: Math.sin(KD) * 140,
          age: 0,
          life: 0.7,
          r: 2,
          a: KD,
          spin: 0,
          gravity: 0,
          color: k.type === "enrage" ? C.coral : C.gold,
          kind: "spark",
        });
      }
    }
  }
  function N(z) {
    for (const M of z.hazards || []) {
      const I = M.kind === "volley" || M.timer < M.warn,
        X = clamp(M.timer / Math.max(0.01, M.warn), 0, 1);
      if (M.kind === "nova") {
        const W = Math.max(1, M.radius || 1);
        (g.save(),
          (g.globalAlpha = I ? 0.09 + X * 0.08 : 0.25),
          ellipse(g, M.x, M.y, W, W, I ? "#a35340" : "#df6848"),
          (g.globalAlpha = I ? 0.55 + X * 0.25 : 0.95));
        if (I) {
          (g.setLineDash([7, 8]),
            (g.lineDashOffset = -V * 13),
            ring(g, M.x, M.y, W, "#b76043", 2),
            g.setLineDash([]),
            ring(g, M.x, M.y, W - 4, "#e5b26d", 0.9),
            ring(
              g,
              M.x,
              M.y,
              16,
              "#a54f3d",
              2.2,
              -Math.PI / 2,
              -Math.PI / 2 + X * TAU,
            ),
            path(
              g,
              [
                [M.x, M.y - 8],
                [M.x + 6, M.y],
                [M.x, M.y + 8],
                [M.x - 6, M.y],
              ],
              "#b65d43",
            ));
          for (let P = 0; P < 8; P++) {
            const e = (P / 8) * TAU;
            line(
              g,
              M.x + Math.cos(e) * (W - 10),
              M.y + Math.sin(e) * (W - 10),
              M.x + Math.cos(e) * W,
              M.y + Math.sin(e) * W,
              "#b76043",
              1.4,
            );
          }
        } else {
          (ring(g, M.x, M.y, W, C.coral, 4),
            ring(g, M.x, M.y, W - 2, "#fff0bc", 1.5));
          const v = ((M.timer - M.warn) * 2.5) % 1;
          (ring(g, M.x, M.y, Math.max(1, W * v), "#ffedb7", 2.2),
            ring(
              g,
              M.x,
              M.y,
              Math.max(1, W * ((v + 0.5) % 1)),
              "#f5cf85",
              1.3,
            ));
          for (let b = 0; b < 12; b++) {
            const K0 = (b / 12) * TAU + 0.06 * Math.sin(V * 12),
              K1 = W * 0.22;
            line(
              g,
              M.x + Math.cos(K0) * K1,
              M.y + Math.sin(K0) * K1,
              M.x + Math.cos(K0) * (W - 7),
              M.y + Math.sin(K0) * (W - 7),
              "#f2c580",
              1,
            );
          }
        }
        g.restore();
        continue;
      }
      const o = Number.isFinite(M.x2) ? M.x2 : M.x,
        u = Number.isFinite(M.y2) ? M.y2 : r;
      (g.save(), (g.lineCap = "butt"));
      if (I) {
        ((g.globalAlpha = 0.13 + X * 0.2),
          line(g, M.x, M.y, o, u, "#a04439", Math.max(4, M.width || 16)),
          (g.globalAlpha = 0.45 + X * 0.3),
          g.setLineDash([6, 10]),
          (g.lineDashOffset = -V * 20),
          line(g, M.x, M.y, o, u, "#bd4f3b", 1.6),
          g.setLineDash([]));
        const K2 = Math.atan2(u - M.y, o - M.x),
          K3 = -Math.sin(K2),
          K4 = Math.cos(K2),
          K5 = (M.width || 16) / 2;
        (line(
          g,
          M.x + K3 * K5,
          M.y + K4 * K5,
          o + K3 * K5,
          u + K4 * K5,
          "#bf6046",
          0.8,
        ),
          line(
            g,
            M.x - K3 * K5,
            M.y - K4 * K5,
            o - K3 * K5,
            u - K4 * K5,
            "#bf6046",
            0.8,
          ),
          (g.globalAlpha = 0.85),
          ring(
            g,
            M.x,
            M.y,
            12 + X * 6,
            C.coral,
            2,
            -Math.PI / 2,
            -Math.PI / 2 + X * TAU,
          ));
      } else {
        const K6 = Math.max(3, M.width || 16);
        ((g.globalAlpha = 0.18),
          line(g, M.x, M.y, o, u, C.coral, K6 + 13),
          (g.globalAlpha = 0.9),
          line(g, M.x, M.y, o, u, C.coral, K6),
          line(g, M.x, M.y, o, u, "#ffe6ae", K6 * 0.58),
          line(g, M.x, M.y, o, u, "#fff9d9", Math.max(2, K6 * 0.16)));
        if (M.kind === "tether") {
          const K7 = o - M.x,
            K8 = u - M.y,
            K9 = Math.max(1, Math.hypot(K7, K8)),
            KK = -K8 / K9,
            Kg = K7 / K9,
            KD = Math.max(2, Math.ceil(K9 / 19));
          (g.beginPath(), g.moveTo(M.x, M.y));
          for (let Kl = 1; Kl < KD; Kl++) {
            const Kc = Kl / KD,
              KY = Math.sin(Kl * 4.6 + V * 27) * K6 * 0.32;
            g.lineTo(M.x + K7 * Kc + KK * KY, M.y + K8 * Kc + Kg * KY);
          }
          (g.lineTo(o, u),
            (g.strokeStyle = "#fffae0"),
            (g.lineWidth = 2),
            g.stroke());
        }
      }
      if (M.kind === "tether")
        for (const [Kr, Kp] of [
          [M.x, M.y],
          [o, u],
        ]) {
          path(
            g,
            [
              [Kr, Kp - 9],
              [Kr + 7, Kp],
              [Kr, Kp + 9],
              [Kr - 7, Kp],
            ],
            I ? "#b86546" : "#ffe7b0",
            C.ink,
            1,
          );
        }
      g.restore();
    }
  }
  function w(k) {
    for (const z of k.bullets || []) {
      (g.save(), g.translate(z.x, z.y), g.rotate(Math.atan2(z.vy, z.vx)));
      const M = z.r || 5;
      ((g.globalAlpha = 0.32),
        path(
          g,
          [
            [M, 0],
            [-M * 4.5, -M * 0.65],
            [-M * 3.5, 0],
            [-M * 4.5, M * 0.65],
          ],
          z.friendly ? "#b4fbe6" : "#de8b55",
        ),
        (g.globalAlpha = 1),
        z.kind === "glass"
          ? (path(
              g,
              [
                [M + 2, 0],
                [0, -M],
                [-M * 1.5, 0],
                [0, M],
              ],
              z.friendly ? "#c1fbef" : "#f7d891",
              C.ink,
              1.4,
            ),
            line(g, -M, 0, M, 0, "#fff2c5", 1.4))
          : (ellipse(g, 0, 0, M + 1.5, M + 1.5, C.ink),
            ellipse(
              g,
              0,
              0,
              M,
              M,
              z.friendly ? "#acfff0" : z.kind === "ember" ? C.coral : C.gold,
            ),
            ellipse(g, 1, -1, M * 0.48, M * 0.48, "#fff2c7")),
        g.restore());
    }
  }
  function L(z) {
    const M = z.player,
      I = M.hook?.targetId || (z.focus ? z.aim?.targetId : null),
      X = z.boss?.parts?.find((W) => W.id === I);
    if (!X && !z.focus) return;
    const o = X?.x ?? z.aim?.x ?? M.x,
      h = X?.y ?? z.aim?.y ?? M.y,
      u = Math.hypot(o - M.x, h - M.y);
    g.save();
    if (M.hook && X) {
      const W = Math.min(24, u * 0.09) * Math.max(0, 1 - (M.hook.age || 0) * 5);
      (curve(g, M.x, M.y, (M.x + o) / 2, (M.y + h) / 2 + W, o, h, C.ink, 4),
        curve(
          g,
          M.x,
          M.y - 1,
          (M.x + o) / 2,
          (M.y + h) / 2 + W - 1,
          o,
          h,
          C.cream,
          1.8,
        ));
      const P = (o - M.x) / Math.max(1, u),
        e = (h - M.y) / Math.max(1, u);
      for (let j = 1; j < 6; j++) {
        const a = (V * 4 + j / 6) % 1;
        line(
          g,
          M.x + P * u * a,
          M.y + e * u * a,
          M.x + P * Math.max(0, u * a - 9),
          M.y + e * Math.max(0, u * a - 9),
          "#ffd882",
          3,
        );
      }
    } else
      z.focus &&
        ((g.globalAlpha = 0.6),
        g.setLineDash([3, 9]),
        (g.lineDashOffset = -V * 35),
        line(g, M.x, M.y, o, h, X?.exposed ? C.cream : C.ink, 1.5),
        g.setLineDash([]),
        !X &&
          (ring(g, o, h, 10, C.cream, 1.4),
          line(g, o - 15, h, o - 6, h, C.cream, 1.2),
          line(g, o + 6, h, o + 15, h, C.cream, 1.2),
          line(g, o, h - 15, o, h - 6, C.cream, 1.2),
          line(g, o, h + 6, o, h + 15, C.cream, 1.2)));
    g.restore();
  }
  function B(z, M = 1 / 60) {
    if (!z?.player) return;
    if (!q) y(D, l, p, z.width || Y, z.height || r);
    M = clamp(M || 0, 0, 0.06);
    const I = z.paused ? 0 : M;
    V += I;
    ((x === "lost" && z.phase === "playing") ||
      (x === "won" && z.phase === "playing")) &&
      ((n.length = 0),
      (m.length = 0),
      (E.length = 0),
      (G.length = 0),
      (d.length = 0));
    ((x = z.phase),
      (U *= Math.exp(-I * 13)),
      (A *= Math.exp(-I * 9)),
      (F = Math.sin(V * 173) * U),
      (Q = Math.sin(V * 139 + 1) * U * 0.7),
      g.setTransform(p, 0, 0, p, 0, 0));
    const X = g.createLinearGradient(0, 0, 0, l);
    (X.addColorStop(0, "#a8bcb1"),
      X.addColorStop(0.5, "#d9d3ae"),
      X.addColorStop(1, "#e6ccb0"),
      (g.fillStyle = X),
      g.fillRect(0, 0, D, l),
      g.save(),
      g.translate(Z, s),
      g.scale(R, R),
      g.beginPath(),
      g.rect(0, 0, Y, r),
      g.clip(),
      g.drawImage(q, 0, 0, Y, r),
      floatingIsland(g, Y * 0.1 + Math.sin(V * 0.06) * 7, r * 0.65, 0.63, V),
      floatingIsland(
        g,
        Y * 0.91 - Math.sin(V * 0.07) * 10,
        r * 0.58,
        0.43,
        V + 6,
      ),
      floatingIsland(
        g,
        Y * 0.69 + Math.sin(V * 0.045) * 8,
        r * 0.81,
        0.27,
        V + 12,
      ),
      (g.globalAlpha = 0.17));
    for (let W = 0; W < 13; W++) {
      const P = ((W * 191 - V * (8 + (W % 3) * 5) + Y * 20) % (Y + 170)) - 85,
        e = ((W * 107 + 90) % (r - 110)) + 50;
      curve(
        g,
        P,
        e,
        P + 33,
        e - 3,
        P + 80 + (W % 3) * 20,
        e - 1,
        "#fff8dc",
        W % 2 ? 1 : 2,
      );
    }
    g.globalAlpha = 1;
    if (z.act > 0 && z.phase !== "won") {
      const j = [
        "#00000000",
        "#2556600b",
        "#193e4e1a",
        "#236c721a",
        "#49416720",
        "#80604525",
      ];
      ((g.fillStyle = j[z.act] || j[5]), g.fillRect(0, 0, Y, r));
    }
    if (z.focus) {
      ((g.fillStyle = "#153e4930"), g.fillRect(0, 0, Y, r));
      const K0 = z.player;
      (ring(g, K0.x, K0.y, 44 + Math.sin(V * 3) * 2, "#f6ebc340", 1),
        ring(g, K0.x, K0.y, 49, "#f6ebc322", 1, V * 0.3, V * 0.3 + 5));
    }
    (g.save(), g.translate(F, Q), N(z));
    const o = z.boss;
    if (o) {
      g.save();
      const K1 = z.phase === "dying",
        K2 = z.phase === "upgrade" || z.phase === "won",
        K3 = o.deathTime || 0;
      if (K2) g.globalAlpha = 0;
      else
        K1 &&
          ((g.globalAlpha = clamp(1 - K3 / 2.5, 0, 1)),
          g.translate(Math.sin(V * 17) * 5 * K3, K3 * K3 * 18),
          g.translate(o.x, o.y),
          g.rotate(Math.sin(V * 2) * K3 * 0.07),
          g.translate(-o.x, -o.y));
      if (g.globalAlpha > 0.01) {
        (g.save(), (g.globalAlpha *= 0.23));
        const K4 = o.scale || 1;
        for (let K5 = 0; K5 < 4; K5++) {
          const K6 = o.x - (235 + K5 * 19) * K4,
            K7 = o.y + (96 + K5 * 20) * K4;
          curve(
            g,
            K6,
            K7,
            o.x,
            K7 + 25 * K4,
            o.x + (190 + K5 * 17) * K4,
            K7 - 2 * K4,
            C.cream,
            1.1,
          );
        }
        g.restore();
        if (o.kind === 1) drawGlasswing(g, o, V);
        else {
          if (o.kind === 2) drawCrown(g, o, V);
          else {
            if (o.kind === 3) drawSerpent(g, o, V);
            else {
              if (o.kind === 4) drawLoom(g, o, V);
              else {
                if (o.kind === 5) drawArk(g, o, V);
                else drawBellkeeper(g, o, V);
              }
            }
          }
        }
        for (const K8 of o.parts || []) drawPart(g, K8, o, V, z.aim?.targetId);
      }
      g.restore();
    }
    (w(z), L(z));
    const h = z.player;
    if (z.burstCharge >= 100 && z.phase === "playing") {
      (g.save(), (g.globalAlpha = 0.45 + Math.sin(V * 4) * 0.15));
      for (let K9 = 0; K9 < 3; K9++) {
        const KK = V * 1.4 + (K9 / 3) * TAU;
        (ring(g, h.x, h.y, 31, C.cream, 1.8, KK, KK + 0.6),
          path(
            g,
            [
              [h.x + Math.cos(KK) * 34, h.y + Math.sin(KK) * 34],
              [h.x + Math.cos(KK + 0.07) * 40, h.y + Math.sin(KK + 0.07) * 40],
              [h.x + Math.cos(KK + 0.14) * 34, h.y + Math.sin(KK + 0.14) * 34],
            ],
            C.gold,
          ));
      }
      g.restore();
    }
    if (I && z.phase !== "lost") {
      E.unshift({ x: h.x, y: h.y + 5 });
      if (E.length > (h.hook ? 13 : 7)) E.length = h.hook ? 13 : 7;
    }
    if (z.phase !== "lost") drawKnight(g, h, V, E);
    for (const Kg of n) {
      ((Kg.age += I),
        (Kg.x += Kg.vx * I),
        (Kg.y += Kg.vy * I),
        (Kg.vy += (Kg.gravity || 0) * I),
        (Kg.a += Kg.spin * I));
      const KD = clamp(1 - Kg.age / Kg.life, 0, 1);
      if (!KD) continue;
      (g.save(),
        (g.globalAlpha = Math.min(1, KD * 2)),
        g.translate(Kg.x, Kg.y),
        g.rotate(Kg.a));
      if (Kg.kind === "plate") {
        path(
          g,
          [
            [-Kg.r, -Kg.r * 0.55],
            [Kg.r * 0.65, -Kg.r],
            [Kg.r, Kg.r * 0.5],
            [-Kg.r * 0.7, Kg.r * 0.8],
          ],
          Kg.color,
          C.ink,
          Math.min(1.5, Kg.r * 0.2),
        );
        if (Kg.r > 7)
          line(
            g,
            -Kg.r * 0.5,
            -Kg.r * 0.3,
            Kg.r * 0.45,
            -Kg.r * 0.45,
            C.cream,
            1,
          );
      } else
        ((g.fillStyle = Kg.color),
          g.fillRect(-Kg.r * 2.5, -Kg.r * 0.4, Kg.r * 5, Kg.r * 0.8));
      g.restore();
    }
    n = n.filter((Kl) => Kl.age < Kl.life);
    for (const Kl of G) {
      Kl.age += I;
      if (Kl.age < 0) continue;
      const Kc = clamp(Kl.age / Kl.life, 0, 1);
      ((g.globalAlpha = (1 - Kc) * 0.8),
        ring(
          g,
          Kl.x,
          Kl.y,
          8 + Math.pow(Kc, 0.65) * Kl.r,
          Kl.color,
          mix(4, 0.5, Kc),
        ));
      if (Kl.r > 100)
        ring(g, Kl.x, Kl.y, 5 + Math.pow(Kc, 0.62) * Kl.r * 0.91, C.gold, 1);
    }
    ((g.globalAlpha = 1), (G = G.filter((KY) => KY.age < KY.life)));
    for (const KY of d) {
      KY.age += I;
      const Kr = clamp(KY.age / KY.life, 0, 1);
      (g.save(),
        g.translate(KY.x, KY.y),
        g.rotate(KY.a),
        (g.globalAlpha = 1 - Kr),
        path(
          g,
          [
            [-KY.size * (1 - Kr * 0.3), 4],
            [KY.size * 0.65, -8 * (1 - Kr)],
            [KY.size, -1],
            [-KY.size * 0.8, 9 * (1 - Kr)],
          ],
          C.cream,
        ),
        path(
          g,
          [
            [-KY.size * 0.8, 13],
            [KY.size * 0.8, 4],
            [KY.size * 0.7, 7],
            [-KY.size, 16],
          ],
          C.gold,
        ),
        g.restore());
    }
    d = d.filter((Kp) => Kp.age < Kp.life);
    for (const Kp of m) {
      ((Kp.x += Kp.speed * I), (Kp.y -= Kp.speed * 0.65 * I));
      Kp.x > Y + 30 && ((Kp.x = -20), (Kp.y = rnd(r * 0.3, r * 0.9)));
      const KR = Math.sin(V * 7 + Kp.phase) * Kp.size * 0.6;
      (g.save(),
        g.translate(Kp.x, Kp.y),
        g.rotate(-0.27),
        path(
          g,
          [
            [-Kp.size, KR],
            [0, 0],
            [Kp.size, KR],
            [4, 5],
            [0, 3],
            [-4, 5],
          ],
          "#fff1ce",
          "#bdaf80",
          0.6,
        ),
        g.restore());
    }
    (g.restore(), (g.globalAlpha = 0.2));
    const u = g.createLinearGradient(0, 0, 0, r);
    (u.addColorStop(0, "#173f49"),
      u.addColorStop(0.15, "#173f4900"),
      u.addColorStop(0.8, "#173f4900"),
      u.addColorStop(1, "#173f49"),
      (g.fillStyle = u),
      g.fillRect(0, 0, Y, r),
      (g.globalAlpha = 1),
      Math.abs(A) > 0.005 &&
        ((g.globalAlpha = Math.abs(A)),
        (g.fillStyle = A > 0 ? "#fff4d8" : "#b73e31"),
        g.fillRect(0, 0, Y, r),
        (g.globalAlpha = 1)),
      g.restore());
  }
  function T(k, z) {
    const M = K.getBoundingClientRect();
    return {
      x: (((k - M.left) * D) / Math.max(1, M.width) - Z) / R - F,
      y: (((z - M.top) * l) / Math.max(1, M.height) - s) / R - Q,
    };
  }
  function f() {
    ((n.length = 0),
      (d.length = 0),
      (E.length = 0),
      (G.length = 0),
      (m.length = 0),
      (H = !![]),
      (S.onload = null),
      (q = null),
      (t = null));
  }
  return { resize: y, render: B, event: J, screenToWorld: T, destroy: f };
}
