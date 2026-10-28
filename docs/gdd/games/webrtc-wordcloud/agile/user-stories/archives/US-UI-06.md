# User Story: Presence Avatars Walking Strip [US-UI-06]

## Description
As a participant, I want to see a small avatar for every connected peer "walking" along the bottom of the word cloud so the session feels alive and I can see who's present at a glance.

## Acceptance Criteria
- [x] A `.presence-strip` lane is rendered along the bottom edge of `.cloud-container`, visible in both Word Cloud and Quiz modes.
- [x] One avatar appears per connected peer (host + all participants), labeled with the first 1–2 letters of their nickname (fallback to Peer ID if no nickname).
- [x] Avatars use the hexagon frame from [US-UI-05](./US-UI-05.md) (`.hex-frame`) and are colored from the CAMT word-cloud palette, deterministically keyed by peer ID (same peer = same color across clients).
- [x] The host's avatar is visually distinguished (e.g. `--heading-color` outline/badge).
- [x] Avatars continuously drift left/right within the strip at slow, randomized, non-distracting speeds ("walking" effect), implemented in CSS (`@keyframes` + randomized inline `animation-duration`/`animation-delay`).
- [x] Hovering/tapping an avatar shows the participant's full nickname (e.g. via `title` attribute or small tooltip).
- [x] The strip updates automatically when peers join/leave or when nicknames change — no new network message types are added; it reuses the existing peer list and `nicknames` map.
- [x] On mobile (`≤767px`), the strip and avatars shrink per the spec in [04-ui-ux-design.md](../../software/04-ui-ux-design.md#presence-avatars-walking-strip).

## Technical Tasks
- [x] **Markup:** Add `.presence-strip` container inside `.cloud-container` in `index.html`.
- [x] **Styles:** Add `.presence-strip`, `.presence-avatar`, walking `@keyframes`, host badge, and responsive sizing in `src/css/style.css`.
- [x] **Color/ID hashing:** Add a small deterministic hash-to-palette-index helper (reuse or place alongside `renderer.js` color palette).
- [x] **Render logic:** In `app.js`, render/update `.presence-strip` from `updatePeerUI()` (peers + `this.nicknames`), re-rendering on peer list and nickname changes.
- [x] **Randomized motion:** Assign each avatar a randomized `animation-duration`/`animation-delay` on render so avatars don't move in lockstep.

## Dependencies
- US-UI-05 (Hexagon Motif & Branding Accents) — avatar frame shape
- US-QZ-04 (Nicknames) — for nickname-based labels (falls back to Peer ID if not yet implemented)
