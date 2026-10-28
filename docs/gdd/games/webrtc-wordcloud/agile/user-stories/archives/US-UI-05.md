# User Story: Hexagon Motif & Branding Accents [US-UI-05]

## Description
As a host/participant, I want a hexagon motif used for decorative elements (icon containers, avatars, QR code frame) so the app reflects CAMT's signature brand shape without touching the official logo.

## Acceptance Criteria
- [x] A reusable hexagon `clip-path` CSS class is added (e.g. `.hex-frame`) and applied to at least the QR code display area and participant/presence avatars.
- [x] Sidebar icon containers (status, peer list, settings) use the hexagon frame as a decorative container where appropriate.
- [x] A faint hexagon pattern is optionally used as a background texture on empty/large surfaces (e.g. word cloud canvas background), low-opacity, non-distracting.
- [x] No CAMT logo asset is recolored, outlined, or distorted (per [01-brand-identity.md](../../wiki/camt-design/01-brand-identity.md) "Don'ts").

## Technical Tasks
- [x] **CSS:** Add `.hex-frame` utility class using `clip-path: polygon(...)` in `src/css/style.css`.
- [x] **QR Frame:** Apply hex frame to QR code container in `index.html`.
- [x] **Avatars:** Apply hex frame to participant avatar elements (presence UI).
- [x] **Background pattern (optional):** Add low-opacity hexagon SVG/pattern background for the word cloud canvas container.

## Dependencies
- US-UI-03 (Color & Typography Tokens)
- US-UI-04 (Component Restyle)
