# User Story: CAMT Color & Typography Tokens [US-UI-03]

## Description
As a host/participant, I want the app's colors and typography to follow the CAMT brand identity so the product feels visually consistent with CAMT.

## Acceptance Criteria
- [x] `:root` CSS variables in `src/css/style.css` and `src/css/quiz-editor.css` are replaced with the CAMT token set from [04-ui-ux-design.md](../../software/04-ui-ux-design.md) (`--bg-color`, `--bg-alt`, `--card-bg`, `--text-primary`, `--text-secondary`, `--heading-color`, `--primary`, `--primary-hover`, `--secondary`, `--accent-color`, `--accent-deep`, `--border-color`, `--divider`).
- [x] Font family switched from `Outfit`/`Inter` to a Thai-supporting grotesk sans (`IBM Plex Sans Thai`, `Noto Sans Thai`) loaded via Google Fonts in `index.html` / `quiz-editor.html`.
- [x] All `--glass` / `backdrop-filter: blur(...)` usages are removed and replaced with solid `--card-bg` + `--border-color` + `0 2px 8px rgba(0,0,0,0.08)` shadow.
- [x] `.logo` (formerly `.gradient-text`) uses `--heading-color` (#533527) instead of the blue/indigo gradient.
- [x] Word cloud color scale in `app.js`/`renderer.js` updated to draw from the CAMT earth-tone palette.

## Technical Tasks
- [x] **Tokens:** Update `:root` in `src/css/style.css` and `src/css/quiz-editor.css`.
- [x] **Fonts:** Add Google Fonts `<link>` for chosen Thai sans, update `font-family` rules.
- [x] **De-glass:** Remove `backdrop-filter` and `--glass` references; replace `header`, sidebar, panels with solid surfaces.
- [x] **Word cloud palette:** Update color scale array in `src/js/app.js` and `src/js/renderer.js`.

## Dependencies
- US-WC-02 (Rendering)
