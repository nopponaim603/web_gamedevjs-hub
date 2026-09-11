const $ = (q) => document.getElementById(q),
  perf = () => performance.now();
window.addEventListener("unhandledrejection", (q) =>
  console.error("unhandledrejection", q.reason),
);
const save = createSave();
if (save.data.lang) i18n.lang = save.data.lang;
const ui = createUI(),
  renderer = createRenderer($("game"), $("minimap")),
  input = createInput($("game")),
  audio = createAudio();
((input.onFirstGesture = () => audio.unlock()), ui.applyTexts());
function createLocalRoom({ withHuman: q, name: Z, skin: e } = {}) {
  const W = _oal1lz8_I,
    D = createSim({ seed: (Math[W(406)]() * 0x3b9aca00) | 0 });
  let f = -1;
  if (q) {
    const K = D[W(266)]({ name: Z || W(291), skin: e || "drop", colorIdx: 0 });
    f = K[W(241)];
  }
  for (let t = D.S.players[W(334)](Boolean).length; t < BAL.entities; t++) {
    D[W(266)]({
      name:
        BAL[W(362)][((t * 7 + D[W(239)]() * 12) | 0) % BAL[W(362)][W(264)]] ||
        "Bot\x20" + t,
      bot: personaFor(t + ((D[W(239)]() * 3) | 0)),
      colorIdx: t,
      skin: W(269),
    });
  }
  for (const o of D.S[W(393)]) if (o) D[W(275)](o);
  const b = createBotPool(D, (Math[W(406)]() * 0xf4240) | 0),
    c = new Map(),
    V = () => {
      const u = W;
      for (const Y of D.S[u(393)])
        if (Y) c[u(285)](Y.slot, [Y.x, Y.y, Y[u(345)]]);
    };
  V();
  let m = 0,
    l = perf();
  const g = [];
  return {
    kind: "local",
    sim: D,
    get mySlot() {
      return f;
    },
    events: g,
    setInput(Y, B) {
      const U = W;
      if (f >= 0) D[U(252)](f, { angle: Y, boost: B });
    },
    update(Y) {
      const r = W;
      ((m += Math[r(250)](250, Y - l)), (l = Y));
      let B = ![];
      while (m >= BAL.tickMs) {
        ((m -= BAL[r(300)]),
          !B && (V(), (B = !![])),
          b.update(),
          g[r(378)](...D[r(400)]()));
      }
      return m / BAL[r(300)];
    },
    view(Y) {
      const w = W,
        B = D.S[w(393)][w(244)]((L) => {
          const H = w;
          if (!L) return null;
          const j = c[H(258)](L[H(241)]) || [L.x, L.y, L[H(345)]];
          return {
            slot: L[H(241)],
            name: L[H(292)],
            colorIdx: L.colorIdx,
            skin: L[H(235)],
            alive: L[H(273)],
            x: j[0] + (L.x - j[0]) * Y,
            y: j[1] + (L.y - j[1]) * Y,
            angle: L.angle,
            ink: L[H(336)],
            maxInk: D[H(281)](L),
            boost: L.boost,
            protected: D.S[H(400)] < L[H(310)],
            isMe: L.slot === f,
            trailPts: trailPtsOf(D, L),
          };
        }),
        J = f >= 0 ? D.S[w(393)][f] : null;
      return {
        players: B,
        mySlot: f,
        timeLeft: D.S[w(238)],
        frenzy: D.S[w(308)],
        phase: D.S.phase,
        phaseLeft: D.S[w(398)],
        placements: D[w(246)](),
        humans: 1,
        offline: !![],
        respawnLeft:
          J && !J[w(273)] && J.respawnAt > 0
            ? Math[w(429)](0, ((J[w(322)] - D.S.tick) * BAL[w(300)]) / 0x3e8)
            : null,
        spectating: !!J?.[w(355)],
      };
    },
    grid: () => D.S.grid,
    dispose() {},
  };
}
function trailPtsOf(q, Z) {
  const A = _oal1lz8_I;
  if (!Z[A(273)] || !Z[A(305)] || Z[A(305)].length === 0) return null;
  const e = q.S.G,
    D = new Array((Z[A(305)].length + 1) * 2);
  for (let f = 0; f < Z[A(305)].length; f++) {
    const b = Z[A(305)][f];
    ((D[f * 2] = (b % e) + 0.5), (D[f * 2 + 1] = ((b / e) | 0) + 0.5));
  }
  return (
    (D[Z.trailCells.length * 2] = Z.x),
    (D[Z[A(305)][A(264)] * 2 + 1] = Z.y),
    D
  );
}
let room = null,
  mode = "attract",
  podiumTimerFn = null,
  leaderSlot = -1,
  scoreSubmittedRound = -1,
  lowInkWarned = ![],
  hadFirstClaim = ![],
  boostWas = ![];
function myName() {
  const N = _oal1lz8_I,
    q = ($("nickname")[N(229)] || "")[N(326)]();
  if (q) save[N(285)](N(292), q);
  return q || save[N(348)][N(292)] || N(291);
}
function startAttract() {
  const P = _oal1lz8_I;
  (room?.dispose(),
    (room = createLocalRoom({ withHuman: ![] })),
    renderer[P(271)](room[P(306)]()),
    (mode = "attract"),
    ui[P(236)](P(299)),
    ui.showHud(![]),
    refreshTitleStats());
}
function refreshTitleStats() {
  const y = _oal1lz8_I,
    q = save[y(348)][y(274)];
  $(y(347))[y(379)] = q.rounds > 0 ? i18n.t(y(274), q[y(315)], q[y(327)]) : "";
}
function startLocal() {
  const T = _oal1lz8_I;
  (room?.dispose(),
    (room = createLocalRoom({
      withHuman: !![],
      name: myName(),
      skin: save[T(348)][T(235)],
    })),
    renderer[T(271)](room[T(306)]()),
    beginPlay(!![]));
}
function beginPlay(q) {
  const s = _oal1lz8_I;
  ((mode = s(424)),
    ui[s(236)](null),
    ui[s(401)](!![]),
    ui[s(276)](null),
    ui[s(426)](),
    (scoreSubmittedRound = -1),
    (lowInkWarned = ![]),
    (hadFirstClaim = ![]),
    (leaderSlot = -1),
    input[s(260)]());
  if (q) ui.tutor(s(364));
  const Z = room[s(425)](0),
    e = Z.players[Z.mySlot];
  if (e) renderer[s(268)](e.x, e.y, 0, !![]);
  ui[s(413)](Z[s(352)] ? i18n.t("offline") : null);
}
function playerName(q, Z) {
  const i = _oal1lz8_I;
  return q[i(393)][Z]?.[i(292)] || "?";
}
function handleEvents(q) {
  const F = _oal1lz8_I,
    Z = room.events[F(233)](0);
  for (const D of Z) {
    switch (D.t) {
      case F(325): {
        renderer[F(277)](D[F(261)], D[F(241)] + 1, D.ox, D.oy, 8, perf());
        if (D[F(287)]) break;
        renderer[F(243)](D.ox, D.oy, D[F(241)]);
        if (D[F(241)] === q[F(335)]) {
          audio.claim(D[F(263)]);
          if (D[F(263)] > 25) renderer[F(422)](Math[F(250)](8, D.area / 60));
          const f = (D[F(263)] / (BAL[F(306)] * BAL[F(306)])) * 100;
          if (f >= 0.5) ui[F(415)](i18n.t(F(309), f[F(338)](1)), 0x5dc);
          (!hadFirstClaim &&
            ((hadFirstClaim = !![]),
            ui[F(249)](F(364)),
            ui[F(249)](F(253)),
            setTimeout(() => mode === F(424) && ui[F(351)](F(404)), 0x4b0)),
            save[F(248)](F(261), D[F(263)]));
        } else D.area > 60 && audio[F(415)]();
        break;
      }
      case F(339): {
        (renderer[F(277)](D[F(261)], 0, D.x, D.y, 5, perf()),
          renderer[F(350)](
            D.x,
            D.y,
            q.players[D[F(241)]]?.[F(307)] ?? 0,
            10,
            1.4,
          ),
          renderer.ripple(D.x, D.y, q[F(393)][D[F(241)]]?.[F(307)] ?? 0));
        D[F(241)] === q[F(335)] &&
          (audio[F(358)](),
          renderer[F(422)](10),
          ui[F(415)](i18n.t(F(329)), 0x708));
        D[F(228)] === F(366) &&
          D[F(241)] !== q[F(335)] &&
          ui[F(415)](i18n.t(F(279), playerName(q, D[F(241)])), 0x7d0);
        break;
      }
      case F(399): {
        const b = playerName(q, D[F(375)]),
          c = playerName(q, D[F(360)]);
        ui[F(415)](i18n.t(F(430), b, c), 0x898);
        if (D[F(375)] === q[F(335)]) (audio.kill(), save[F(248)](F(327)));
        else audio[F(399)]();
        break;
      }
      case F(349): {
        renderer[F(277)](D.cells, D[F(241)] + 1, D.x, D.y, 3, perf());
        if (D[F(241)] === q[F(335)]) {
          ui.spectate(null);
          const V = q[F(393)][D[F(241)]];
          if (V) renderer.follow(D.x, D.y, 0, !![]);
        }
        break;
      }
      case F(308): {
        (ui[F(302)](), audio[F(289)](), audio[F(265)](!![]));
        break;
      }
      case "roundEnd": {
        (audio.setFrenzy(![]), onRoundEnd(D));
        break;
      }
      case F(412): {
        renderer[F(271)](
          room[F(306)] ? room[F(306)]() : room[F(420)].S[F(306)],
        );
        if (mode === F(421)) beginPlay(![]);
        break;
      }
    }
  }
}
function onRoundEnd(q) {
  const O = _oal1lz8_I;
  ((mode = O(421)), ui[O(401)](![]), audio[O(421)]());
  const Z = room.mySlot;
  podiumTimerFn = ui[O(421)](q[O(246)], Z, renderer[O(428)], BAL[O(321)]);
  const D = q[O(246)][O(383)]((f) => f.slot === Z);
  if (D && scoreSubmittedRound !== q[O(387)]) {
    ((scoreSubmittedRound = q.round),
      save.bump(O(297)),
      save[O(416)]("bestBp", D[O(320)]));
    if (q[O(246)][0]?.[O(241)] === Z) save[O(248)](O(315));
    (save[O(385)](), refreshTitleStats());
    try {
      window[O(331)]?.[O(411)](O(388), D[O(388)], { playerName: D[O(292)] });
    } catch {}
  }
}
let lastFrame = perf(),
  hudAt = 0,
  fpsAcc = 0,
  fpsN = 0,
  fpsValue = 60;
function frame() {
  const n = _oal1lz8_I;
  requestAnimationFrame(frame);
  const q = perf(),
    Z = q - lastFrame;
  ((lastFrame = q), (fpsAcc += Z), fpsN++);
  fpsAcc > 0x3e8 &&
    ((fpsValue = Math.round(0x3e8 / (fpsAcc / fpsN))),
    (fpsAcc = 0),
    (fpsN = 0));
  if (!room) return;
  const e = room[n(286)](q),
    D = room[n(425)](e);
  handleEvents(D);
  if (mode === n(424) && D[n(335)] >= 0) {
    const b = D.players[D[n(335)]];
    if (b && b.alive) {
      input[n(372)](renderer.toScreen(b.x, b.y));
      if (input.angle !== null) room.setInput(input[n(345)], input[n(231)]);
      if (input[n(231)] && !boostWas && b[n(336)] > 1) audio[n(357)]();
      boostWas = input[n(231)];
      if (input[n(278)]) ui[n(249)]("tut1");
      if (b[n(386)] && b[n(386)].length > 8) ui[n(351)](n(253));
      if (b[n(336)] < b.maxInk * 0.22)
        (ui[n(351)](n(294)),
          !lowInkWarned && ((lowInkWarned = !![]), audio.lowInk()));
      else {
        if (b.ink > b[n(346)] * 0.6) lowInkWarned = ![];
      }
    }
  }
  let f = null;
  if (D[n(335)] >= 0) {
    const p = D[n(393)][D[n(335)]];
    if (p && p.alive) f = p;
  }
  if (!f) {
    const c = D[n(246)][0];
    f = c ? D[n(393)][c[n(241)]] : null;
  }
  if (f) renderer[n(268)](f.x, f.y, Z / 0x3e8);
  renderer[n(333)](D, Z, q);
  if (mode === "playing" && q - hudAt > 160) {
    ((hudAt = q),
      ui[n(293)](D[n(238)], D[n(308)]),
      ui.hudBoard(D[n(246)], D[n(335)], renderer[n(428)]),
      renderer[n(282)](D));
    const V = D[n(246)].findIndex((g) => g[n(241)] === D[n(335)]);
    if (V >= 0) audio[n(365)](V + 1);
    const m = D[n(246)][0]?.[n(241)] ?? -1;
    m !== leaderSlot &&
      leaderSlot !== -1 &&
      D[n(246)][0]?.bp > 100 &&
      ui[n(415)](i18n.t(n(280), playerName(D, m)), 0x7d0);
    leaderSlot = m;
    const l = D[n(393)][D[n(335)]];
    if (D[n(335)] >= 0 && l && !l[n(273)]) {
      if (D[n(355)]) ui.spectate(i18n.t(n(355)));
      else
        D[n(319)] !== null &&
          D.respawnLeft !== undefined &&
          ui.spectate(i18n.t(n(337), Math[n(429)](0, Math.ceil(D[n(319)]))));
    } else l?.alive && ui[n(276)](null);
  }
  if (mode === n(421) && podiumTimerFn) podiumTimerFn(D[n(398)]);
}
($("btnPlay").addEventListener("click", () => {
  const z = _oal1lz8_I;
  (audio[z(247)](), startQuick());
}),
  $("btnFriends").addEventListener("click", () => {
    const x = _oal1lz8_I;
    (audio.unlock(), ui[x(236)]("friends"), refreshFriends());
  }),
  $("btnSkins").addEventListener("click", () => {
    const k = _oal1lz8_I;
    (ui[k(328)](
      save,
      (q, Z) => drawSkinPreview(q, Z, "#E0532F"),
      () => {},
    ),
      ui[k(236)](k(395)));
  }),
  $("btnHow").addEventListener("click", () => ui.screen("how")),
  $("btnLang").addEventListener("click", () => {
    const M = _oal1lz8_I;
    (i18n[M(394)](), save[M(285)](M(390), i18n[M(390)]), ui[M(408)]());
  }),
  $("btnSkBack").addEventListener("click", () => ui.screen("title")),
  $("btnHowBack").addEventListener("click", () => ui.screen("title")),
  $("btnFrBack").addEventListener("click", () => ui.screen("title")),
  $("nickname").addEventListener("change", () =>
    save.set("name", $("nickname").value.trim()),
  ));
async function startQuick() {
  const a = _oal1lz8_I,
    q = await sdkReady(0x9c4);
  if (q)
    try {
      const Z = await createNetRoom({
        mode: a(407),
        name: myName(),
        skin: save.data.skin,
        renderer: renderer,
        onFallback: null,
      });
      if (Z) {
        adoptNetRoom(Z);
        return;
      }
    } catch (e) {
      console[a(303)](a(262), e);
    }
  startLocal();
}
let lobbyRoom = null;
async function refreshFriends() {
  const E = _oal1lz8_I,
    q = await sdkReady(0x9c4);
  (($(E(284))[E(379)] = q ? "" : i18n.t("offline")),
    ($(E(361))[E(396)] = !q),
    ($("btnJoinGo").disabled = !q));
}
($("btnHost").addEventListener("click", async () => {
  const X = _oal1lz8_I;
  $(X(284)).textContent = i18n.t("connecting");
  try {
    ((lobbyRoom = await createNetRoom({
      mode: X(254),
      name: myName(),
      skin: save[X(348)][X(235)],
      renderer: renderer,
    })),
      enterLobby());
  } catch (q) {
    (console[X(303)](q), ($(X(284))[X(379)] = i18n.t(X(352))));
  }
}),
  $("btnJoinGo").addEventListener("click", async () => {
    const v = _oal1lz8_I,
      q = ($(v(295))[v(229)] || "")[v(326)]()[v(288)]();
    if (!q) return;
    $(v(284))[v(379)] = i18n.t(v(342));
    try {
      ((lobbyRoom = await createNetRoom({
        mode: v(311),
        code: q,
        name: myName(),
        skin: save[v(348)][v(235)],
        renderer: renderer,
      })),
        enterLobby());
    } catch (Z) {
      (console[v(303)](Z), ($(v(284))[v(379)] = String(Z?.message || Z)));
    }
  }));
function enterLobby() {
  const C = _oal1lz8_I;
  (ui[C(236)](C(257)),
    ($(C(332)).textContent = lobbyRoom[C(381)] || C(353)),
    $(C(389))[C(419)][C(394)](C(301), !lobbyRoom[C(330)]),
    ($(C(405))[C(379)] = lobbyRoom[C(330)] ? "" : i18n.t("waitingHost")),
    (lobbyRoom[C(240)] = renderLobby),
    (lobbyRoom.onStarted = () => {
      (adoptNetRoom(lobbyRoom), (lobbyRoom = null));
    }),
    renderLobby());
}
function renderLobby() {
  const Q = _oal1lz8_I;
  if (!lobbyRoom) return;
  const q = $("roomSeats");
  q.innerHTML = "";
  for (const Z of lobbyRoom[Q(393)]) {
    const e = document[Q(245)](Q(341));
    e.className = Q(283) + (Z[Q(283)] === lobbyRoom[Q(283)] ? Q(296) : "");
    const D = document[Q(245)](Q(227));
    ((D[Q(374)] = "dot"),
      (D[Q(363)].background =
        renderer[Q(428)][(Z.seat - 1) % renderer[Q(428)].length]),
      e.appendChild(D),
      e[Q(354)](document[Q(382)](Z[Q(292)] || "P" + Z.seat)),
      q[Q(354)](e));
  }
}
($("btnCopyLink").addEventListener("click", async () => {
  const G = _oal1lz8_I;
  if (!lobbyRoom) return;
  const q = await lobbyRoom[G(230)]();
  try {
    (await navigator[G(312)][G(409)](q), ($(G(405))[G(379)] = i18n.t(G(237))));
  } catch {
    $("roomStatus")[G(379)] = q;
  }
}),
  $("btnRoomGo").addEventListener("click", () => lobbyRoom?.startMatch()),
  $("btnRoomBack").addEventListener("click", () => {
    const S = _oal1lz8_I;
    (lobbyRoom?.[S(418)](), (lobbyRoom = null), ui[S(236)]("title"));
  }));
function adoptNetRoom(q) {
  const q0 = _oal1lz8_I;
  (room?.dispose(),
    (room = q),
    renderer[q0(271)](q[q0(306)]()),
    (q[q0(316)] = () => renderer[q0(290)](q[q0(306)]())),
    (q[q0(270)] = () => {
      const q1 = q0;
      (ui[q1(415)](i18n.t("offline"), 0x9c4), startLocal());
    }),
    beginPlay(!![]),
    ui[q0(413)](i18n.t("onlineN", q[q0(232)] || 1)),
    (q[q0(369)] = (Z) => ui[q0(413)](i18n.t(q0(397), Z))));
}
((async function boot() {
  const q2 = _oal1lz8_I;
  await save.loadCloud();
  save[q2(348)][q2(390)] &&
    ((i18n[q2(390)] = save[q2(348)][q2(390)]), ui[q2(408)]());
  if (save.data[q2(292)]) $(q2(377))[q2(229)] = save[q2(348)][q2(292)];
  refreshTitleStats();
  try {
    window[q2(331)]?.ready?.();
  } catch {}
  (startAttract(), requestAnimationFrame(frame));
  const q = await fetchInvite(0x7d0);
  q[q2(257)] &&
    (ui[q2(236)](q2(368)),
    ($(q2(295))[q2(229)] = q[q2(257)]),
    refreshFriends());
})(),
  (window.__game = {
    get mode() {
      return mode;
    },
    get room() {
      return room;
    },
    get fps() {
      return fpsValue;
    },
    get sim() {
      const q3 = _oal1lz8_I;
      return room?.[q3(420)] || null;
    },
    startLocal: startLocal,
    forceEndRound() {
      const q4 = _oal1lz8_I;
      if (room?.[q4(420)]) room[q4(420)].S[q4(238)] = 0.05;
    },
    steer(q, Z = ![]) {
      const q5 = _oal1lz8_I;
      room?.[q5(252)](q, Z);
    },
    claimCount() {
      const q6 = _oal1lz8_I,
        q = room?.[q6(420)];
      if (!q) return 0;
      return q.S.players.filter(Boolean)[q6(370)]((Z, e) => Z + e[q6(417)], 0);
    },
    myClaims() {
      const q7 = _oal1lz8_I,
        q = room?.[q7(420)],
        Z = room?.[q7(335)];
      return q && Z >= 0 ? (q.S[q7(393)][Z]?.[q7(417)] ?? 0) : 0;
    },
    bp: bp,
  }));
