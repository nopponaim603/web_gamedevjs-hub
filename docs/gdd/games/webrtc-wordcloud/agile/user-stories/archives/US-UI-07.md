# User Story: Pixel-Art Animated Presence Avatars [US-UI-07]

## Description
As a participant, I want each peer's avatar in the `.presence-strip` to be a small pixel-art character with a walking animation instead of a flat hexagon initial, so the presence strip feels more like a lively little game world.

## Acceptance Criteria
- [x] `.presence-avatar` renders a pixel-art sprite instead of the `.hex-frame` hexagon + initials, with `shape-rendering="crispEdges"` so it stays crisp at small sizes. *(Implemented as an inline SVG sprite rather than a sprite-sheet image — see Open Questions.)*
- [x] The sprite plays a walk-cycle animation (alternating leg groups via opacity-toggling `@keyframes pixel-leg-swap` with `steps(1, jump-none)`), independent of (but combined with) the existing left/right drift animation from [US-UI-06](./US-UI-06.md).
- [x] The sprite visually flips (`transform: scaleX(-1)` via `@keyframes pixel-face` + `steps(2, jump-none)`) to face the direction it is currently walking, synced with the drift animation's `alternate` direction (flip duration = 2× walk duration).
- [x] Per-peer color variation is preserved and still deterministic by peer ID — implemented via `fill="currentColor"` on the SVG combined with the existing per-peer `color` (CAMT palette, chosen via `hashId()`), so "same peer = same color across clients" still holds.
- [x] The host's avatar keeps its 👑 badge distinction from US-UI-06.
- [x] Hover/tap tooltip with full nickname is preserved (`title` attribute).
- [x] Graceful fallback: `prefers-reduced-motion: reduce` disables all sprite/leg/flip/drift animations, showing a static (but still pixel-art) avatar — no broken/empty avatars.
- [x] Mobile (`≤767px`) sizing from US-UI-06 (28px avatars) is retained and the sprite remains legible at that size.

## Technical Tasks
- [x] ~~**Asset (spike/prerequisite):** Source or create a pixel-art walk-cycle sprite sheet~~ — superseded by an inline-SVG approach (no external asset needed, see Open Questions).
- [x] **Styles:** In `src/css/style.css`, added `.pixel-sprite`, `.pixel-sprite-svg`, `.pixel-leg`/`.pixel-leg-b` with `@keyframes pixel-leg-swap` and `@keyframes pixel-face`, layered alongside the existing `presence-walk` drift `@keyframes`.
- [x] **Direction flip:** `.pixel-sprite` flip handled via `@keyframes pixel-face` (`scaleX` toggle) synced to the outer element's `alternate` drift direction by doubling the animation duration.
- [x] **Color variation:** Per-peer color continues to be computed in `updatePresenceStrip()` (`src/js/app.js`) via `hashId(id)` against the CAMT palette and applied as inline `color`, inherited by the SVG via `currentColor`.
- [x] **Fallback handling:** Added `prefers-reduced-motion: reduce` media query disabling sprite/leg/flip/drift animations (static pixel sprite remains visible — no hex-frame fallback needed since the SVG always renders).
- [x] **Responsive check:** Verified sprite legibility at the 28px mobile avatar size; removed the now-unused `font-size: 0.625rem` rule from the mobile `.presence-avatar` media query.

## Dependencies
- US-UI-06 (Presence Avatars Walking Strip) — provides `.presence-strip`, `.presence-avatar`, drift animation, host badge, and render logic this story extends.

## Open Questions (resolved)
- **Sprite source:** Resolved by using an inline SVG pixel-art creature (blocky `<rect>` shapes, `fill="currentColor"`, `shape-rendering="crispEdges"`) generated directly in `updatePresenceStrip()`, instead of sourcing/commissioning a PNG sprite-sheet. This avoids licensing/asset-pipeline concerns and keeps per-peer tinting trivial via `currentColor`.
- **CAMT brand fit:** Resolved — the sprite still uses the CAMT earth-tone palette via `currentColor`/`hashId()`, so it reads as a brand-consistent "mascot" rather than a clashing alternate theme.
