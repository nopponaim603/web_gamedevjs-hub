# User Story: Responsive Breakpoint Baseline & Audit [US-UI-08]

## Description
As a host/participant on any device, I want the app to have a consistent, documented set of responsive breakpoints and shared layout tokens, so that the existing ad-hoc media queries (`1024px`, `767px`, `600px`) become a coherent system that the per-device stories (iPhone [US-UI-09], iPad [US-UI-10]) can build on instead of each adding more one-off rules.

## Acceptance Criteria
- [ ] A documented breakpoint scale is defined and used consistently across `style.css` and `quiz-editor.css`:
  - `≤480px` — small phones (iPhone SE → iPhone 15 portrait)
  - `481–767px` — large phones / phablets
  - `768–1024px` — tablets (iPad portrait & small landscape)
  - `≥1025px` — desktop
- [ ] The current scattered queries (`max-width: 1024px`, `767px`, `600px`) are reconciled to this scale with no visual regressions on desktop, and the `600px` quiz query is folded into the standard phone breakpoint.
- [ ] The viewport meta in `index.html` and `quiz-editor.html` is updated to `width=device-width, initial-scale=1.0, viewport-fit=cover` to enable iOS safe-area support consumed by [US-UI-09].
- [ ] Shared responsive values (avatar size, input bar height, container paddings) are expressed as CSS custom properties so per-breakpoint overrides change one variable instead of many rules.
- [ ] A short responsive matrix is added to [04-ui-ux-design.md](../../software/04-ui-ux-design.md) listing each breakpoint and what changes at it (layout columns, input bar, modal width, presence strip).
- [ ] No console errors and no horizontal scrollbar (`overflow-x`) at any breakpoint on `index.html` or `quiz-editor.html`.

## Technical Tasks
- [ ] **Audit:** Catalog all existing `@media` rules in `src/css/style.css` and `src/css/quiz-editor.css` and map each to the new breakpoint scale.
- [ ] **Tokens:** Introduce `--bp-*` documentation comments and responsive custom properties (e.g. `--input-h`, `--avatar-size`, `--container-pad`) at `:root`.
- [ ] **Viewport:** Add `viewport-fit=cover` to both HTML `<meta name="viewport">` tags.
- [ ] **Consolidate:** Refactor the `1024px` / `767px` / `600px` queries onto the documented breakpoints.
- [ ] **Docs:** Add the responsive matrix table to `04-ui-ux-design.md`.

## Dependencies
- None (foundational). Blocks: US-UI-09 (iPhone), US-UI-10 (iPad).

## Open Questions
- Should breakpoints be `max-width` (desktop-first, current style) or migrate to `min-width` (mobile-first)? Recommendation: keep desktop-first to minimize churn this sprint.
