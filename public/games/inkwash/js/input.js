export function createInput(q) {
  Z = { angle: null, boost: ![], active: ![], onFirstGesture: null };
  let e = -1,
    D = null,
    f = 0,
    b = null,
    p = ![];
  const c = new Set();
  let V = ![];
  const m = () => {
    !V && ((V = !![]), Z.onFirstGesture && Z.onFirstGesture());
  };
  (q.addEventListener("pointerdown", (g) => {
    const R = h;
    m();
    if (g[R(279)] === R(259)) {
      if (g[R(263)] === 2) {
        Z[R(267)] = !![];
        return;
      }
      ((p = !![]), (b = [g.clientX, g[R(246)]]));
      return;
    }
    e === -1
      ? ((e = g[R(272)]), (D = [g.clientX, g[R(246)]]))
      : (f++, (Z[R(267)] = !![]));
  }),
    q.addEventListener("pointermove", (g) => {
      const d = h;
      if (g[d(279)] === d(259)) {
        b = [g[d(252)], g.clientY];
        return;
      }
      if (g.pointerId !== e || !D) return;
      const K = g[d(252)] - D[0],
        t = g[d(246)] - D[1],
        o = Math[d(257)](K, t);
      (o > 10 && ((Z[d(273)] = Math.atan2(t, K)), (Z[d(274)] = !![])),
        o > 52 &&
          ((D[0] = g[d(252)] - (K / o) * 52),
          (D[1] = g.clientY - (t / o) * 52)));
    }));
  const l = (g) => {
    const I = h;
    if (g[I(279)] === "mouse") {
      if (g[I(263)] === 2) Z[I(267)] = ![];
      return;
    }
    if (g[I(272)] === e) ((e = -1), (D = null));
    else {
      if (f > 0) {
        f--;
        if (f === 0) Z[I(267)] = ![];
      }
    }
  };
  return (
    q.addEventListener("pointerup", l),
    q.addEventListener("pointercancel", l),
    q.addEventListener("contextmenu", (g) => g.preventDefault()),
    window.addEventListener("keydown", (g) => {
      const W = h;
      if (g[W(277)]) return;
      m();
      const K = g.key.toLowerCase();
      (["w", "a", "s", "d", W(244), W(242), W(265), W(241)][W(253)](K) &&
        (c[W(269)](K), g.preventDefault()),
        (K === W(251) || K === "\x20") && ((Z[W(267)] = !![]), g[W(275)]()));
    }),
    window.addEventListener("keyup", (g) => {
      const u = h,
        K = g[u(260)].toLowerCase();
      c[u(256)](K);
      if (K === u(251) || K === "\x20") Z[u(267)] = ![];
    }),
    window.addEventListener("blur", () => {
      const U = h;
      (c.clear(), (Z[U(267)] = ![]));
    }),
    (Z.poll = (g) => {
      const r = h;
      let K = 0,
        t = 0;
      if (c[r(278)]("a") || c[r(278)](r(265))) K -= 1;
      if (c[r(278)]("d") || c[r(278)]("arrowright")) K += 1;
      if (c.has("w") || c[r(278)](r(244))) t -= 1;
      if (c[r(278)]("s") || c.has("arrowdown")) t += 1;
      if (K || t) {
        ((Z[r(273)] = Math.atan2(t, K)), (Z[r(274)] = !![]), (p = ![]));
        return;
      }
      if (p && b && g) {
        const o = b[0] - g[0],
          Y = b[1] - g[1];
        Math.hypot(o, Y) > 18 &&
          ((Z.angle = Math[r(240)](Y, o)), (Z[r(274)] = !![]));
      }
    }),
    (Z.reset = () => {
      const w = h;
      ((Z[w(273)] = null), (Z[w(267)] = ![]), (e = -1), (D = null), (f = 0));
    }),
    Z
  );
}
