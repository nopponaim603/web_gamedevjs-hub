const $ = (q) => document.getElementById(q);
export function createUI() {
  const s = _oh3dnj1_T,
    q = {
      hud: $(s(498)),
      timer: $(s(569)),
      board: $(s(540)),
      announce: $("announce"),
      tutor: $(s(477)),
      spectate: $("spectate"),
      netBadge: $(s(574)),
      frenzyBanner: $(s(546)),
      podium: $(s(501)),
      podiumList: $("podiumList"),
      podYou: $("podYou"),
      podNext: $(s(485)),
      podTitle: $("podTitle"),
      podiumSplash: $(s(572)),
    };
  function Z(B) {
    const i = s;
    document[i(598)](i(508)).forEach((J) => J.classList[i(551)](i(566)));
    if (B) $(i(591) + B)?.[i(515)][i(559)](i(566));
  }
  function e() {
    const F = s;
    (($(F(532))[F(579)] = i18n.t(F(532))),
      ($(F(571))[F(579)] = i18n.t(F(564))),
      ($(F(562))[F(579)] = i18n.t("friends")),
      ($(F(575))[F(579)] = i18n.t(F(537))),
      ($(F(560)).textContent = i18n.t(F(518))),
      ($(F(578))[F(479)] = i18n.t("nickname")),
      ($("frTitle")[F(579)] = i18n.t("frTitle")),
      ($(F(483)).textContent = i18n.t(F(517))),
      ($(F(581))[F(579)] = i18n.t("or")),
      ($("joinCode")[F(479)] = i18n.t(F(522))),
      ($(F(573))[F(579)] = i18n.t(F(593))),
      ($(F(587)).textContent = i18n.t("back")),
      ($(F(576)).textContent = i18n.t("room")),
      ($(F(588))[F(579)] = i18n.t("shareHint")),
      ($(F(530))[F(579)] = i18n.t(F(510))),
      ($("btnRoomGo")[F(579)] = i18n.t(F(565))),
      ($(F(505))[F(579)] = i18n.t("back")),
      ($("skTitle")[F(579)] = i18n.t(F(596))),
      ($(F(538))[F(579)] = i18n.t(F(492))),
      ($(F(474)).textContent = i18n.t(F(474))),
      ($(F(536))[F(579)] = i18n.t(F(492))));
    const B = $(F(595));
    B.innerHTML = "";
    for (const J of i18n.t(F(496))) {
      const L = document[F(480)]("li");
      ((L[F(579)] = J), B.appendChild(L));
    }
    $(F(592))[F(579)] = i18n.t(F(488));
  }
  function D(B) {
    const O = s;
    q[O(498)].classList[O(475)](O(528), !B);
  }
  function f(B, J) {
    const n = s,
      L = Math[n(516)](0, Math.floor(B / 60)),
      j = Math[n(516)](0, Math.floor(B % 60));
    ((q[n(599)][n(579)] = L + ":" + String(j)[n(584)](2, "0")),
      q.timer.classList[n(475)](n(487), !!J));
  }
  function b(B, J, L) {
    const z = s,
      j = B[z(533)](0, 3),
      h = j[z(504)]((d) => d[z(514)] === J),
      R = [...j];
    if (!h) {
      const d = B[z(556)]((I) => I[z(514)] === J);
      if (d) R[z(490)](d);
    }
    q.board[z(535)] = "";
    for (const I of R) {
      const W = B.indexOf(I) + 1,
        u = document[z(480)](z(519));
      u.className = z(484) + (I[z(514)] === J ? z(499) : "");
      const U = document[z(480)]("span");
      ((U[z(491)] = z(541)), (U.style[z(544)] = L[I[z(473)] % L[z(549)]]));
      const w = document[z(480)](z(471));
      w[z(579)] = W + ".\x20" + I[z(512)];
      const H = document.createElement("span");
      ((H.className = z(594)),
        (H.textContent = (I.bp / 100).toFixed(1) + "%"),
        u[z(550)](U, w, H),
        q.board[z(580)](u));
    }
  }
  function p(B, J = 0x960) {
    const x = s,
      L = document.createElement(x(519));
    ((L[x(491)] = "msg"), (L[x(579)] = B), q[x(531)][x(580)](L));
    while (q[x(531)].children.length > 3) q.announce[x(597)][x(551)]();
    (setTimeout(() => {
      const k = x;
      ((L[k(529)][k(583)] = "0"), (L[k(529)].transition = k(525)));
    }, J - 400),
      setTimeout(() => L[x(551)](), J));
  }
  const c = { done: new Set(), showing: null, timer: null };
  function V(B) {
    const M = s;
    if (c.done[M(502)](B) || c[M(495)] === B) return;
    ((c[M(495)] = B),
      (q.tutor[M(579)] = i18n.t(B)),
      q[M(477)][M(515)].add(M(548)),
      clearTimeout(c.timer),
      (c[M(599)] = setTimeout(() => m(B), 0x1770)));
  }
  function m(B) {
    const a = s;
    (c[a(495)] === B && (q.tutor[a(515)][a(551)](a(548)), (c[a(495)] = null)),
      c[a(542)][a(559)](B));
  }
  function l() {
    const E = s;
    (c.done[E(590)](), (c[E(495)] = null));
  }
  function g() {
    const X = s;
    ((q.frenzyBanner[X(579)] = i18n.t("frenzy")),
      q[X(546)][X(515)][X(551)](X(528)),
      (q.frenzyBanner[X(529)].animation = X(558)),
      void q[X(546)][X(503)],
      (q[X(546)].style[X(585)] = ""),
      setTimeout(() => q[X(546)][X(515)][X(559)](X(528)), 0x898));
  }
  function K(B) {
    const v = s;
    if (!B) {
      q[v(482)][v(515)].add("hidden");
      return;
    }
    ((q[v(482)][v(579)] = B), q[v(482)].classList[v(551)](v(528)));
  }
  function t(B) {
    const C = s;
    if (!B) {
      q[C(574)][C(515)][C(559)](C(528));
      return;
    }
    ((q[C(574)].textContent = B), q.netBadge[C(515)][C(551)](C(528)));
  }
  function o(B, J, L, j) {
    const Q = s;
    (Z("podium"), (q[Q(494)][Q(535)] = ""));
    const h = ["🥇", "🥈", "🥉"];
    B.slice(0, 5)[Q(507)]((I, W) => {
      const G = Q,
        u = document[G(480)](G(519));
      u[G(491)] = G(539) + (I[G(514)] === J ? G(499) : "");
      const U = document[G(480)](G(471));
      ((U.className = "medal"), (U[G(579)] = h[W] || W + 1 + "."));
      const w = document[G(480)]("span");
      ((w[G(491)] = G(541)), (w.style[G(544)] = L[I[G(473)] % L[G(549)]]));
      const H = document[G(480)](G(471));
      H[G(579)] = I.name;
      const A = document.createElement(G(471));
      ((A[G(491)] = G(594)),
        (A[G(579)] = (I.bp / 100).toFixed(1) + G(554) + I[G(577)]),
        u.append(U, w, H, A),
        q[G(494)][G(580)](u));
    });
    const R = B[Q(556)]((I) => I[Q(514)] === J);
    ((q[Q(476)][Q(579)] = R ? i18n.t(Q(602), R[Q(577)], R[Q(586)]) : ""),
      (q.podiumSplash[Q(535)] = ""));
    const d = B[0];
    if (d)
      for (let I = 0; I < 7; I++) {
        const W = document[Q(480)](Q(519)),
          u = 24 + Math.random() * 70;
        ((W[Q(529)][Q(553)] =
          "position:absolute;width:" +
          u +
          "px;height:" +
          u +
          Q(527) +
          (40 + Math[Q(472)]() * 30) +
          "%\x20" +
          (50 + Math[Q(472)]() * 30) +
          "%\x20" +
          (45 + Math[Q(472)]() * 30) +
          "%\x20" +
          (55 + Math[Q(472)]() * 20) +
          "%;" +
          (Q(506) +
            L[d.colorIdx % L.length] +
            Q(543) +
            (0.08 + Math[Q(472)]() * 0.1) +
            ";") +
          ("left:" +
            Math[Q(472)]() * 90 +
            "%;top:" +
            Math[Q(472)]() * 85 +
            Q(561) +
            Math[Q(472)]() * 360 +
            Q(601))),
          q[Q(572)][Q(580)](W));
      }
    return (U) => {
      const S = Q;
      q[S(485)][S(579)] = j === null ? "" : i18n.t(S(570), Math.ceil(U));
    };
  }
  function Y(B, J, L) {
    const q0 = s,
      j = $(q0(523));
    j[q0(535)] = "";
    for (const h of SKINS) {
      const R = document[q0(480)](q0(519)),
        d = skinUnlocked(h, B[q0(557)].stats);
      R[q0(491)] =
        q0(489) + (B.data[q0(563)] === h ? q0(600) : "") + (d ? "" : q0(547));
      const I = document[q0(480)]("canvas");
      ((I[q0(520)] = I[q0(555)] = 84), J(I, h), R.appendChild(I));
      if (!d) {
        const W = document[q0(480)](q0(519));
        ((W.className = q0(493)),
          (W[q0(579)] = i18n.t("skinLocks")[h] || ""),
          R.appendChild(W));
      }
      (R[q0(478)](q0(524), () => {
        const q1 = q0;
        if (!d) return;
        (B[q1(486)]("skin", h), L(h), Y(B, J, L));
      }),
        j.appendChild(R));
    }
  }
  return {
    screen: Z,
    applyTexts: e,
    showHud: D,
    hudTimer: f,
    hudBoard: b,
    announce: p,
    tutor: V,
    tutorDone: m,
    tutorReset: l,
    frenzyBanner: g,
    spectate: K,
    netBadge: t,
    podium: o,
    buildSkinGrid: Y,
    els: q,
  };
}
export { bp, BAL };
