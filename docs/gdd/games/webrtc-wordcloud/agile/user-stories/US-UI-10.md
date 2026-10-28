# User Story: iPad (Tablet) Responsive Layout [US-UI-10]

## Description
As a host or participant using an iPad, I want the layout to make good use of the larger tablet screen in both portrait and landscape — rather than falling back to the single-column phone layout or the cramped desktop layout — so the sidebar (QR/participants/controls) and the word cloud are both usable side-by-side where space allows.

## Acceptance Criteria
- [ ] **Landscape (≥1024px-ish):** On iPad landscape the two-column `main` layout (sidebar + `.cloud-container`) is preserved and balanced — the sidebar is not so wide that the cloud is squeezed, nor collapsed to a single column unnecessarily.
- [ ] **Portrait (768–1024px):** On iPad portrait the layout switches to a tablet-tuned arrangement (sidebar stacked above/below or a narrower side rail) that is clearly distinct from the phone single-column treatment — QR code and participant list remain comfortably sized, not stretched full-width.
- [ ] **Word cloud sizing:** The word cloud canvas re-fits/re-renders on orientation change (portrait ↔ landscape) without clipping or leaving large empty gutters.
- [ ] **Modals & cards:** Modals, the hero/join card, and quiz cards use a constrained max-width centered on tablet (not edge-to-edge full-bleed like phones).
- [ ] **Touch:** Controls retain ≥44px touch targets; hover-only affordances (e.g. tooltips, host right-click delete) have a touch-accessible path.
- [ ] **Presence strip:** Avatar sizing on tablet sits between the desktop and 28px phone sizes, staying legible across the wider strip.
- [ ] Verified on iPad mini/Air (768px portrait, 1024px landscape) and iPad Pro 11" in Safari iOS, both orientations.

## Technical Tasks
- [ ] **Tablet breakpoint:** Add/adjust a `768–1024px` block in `src/css/style.css` for the tablet `main` grid (distinct from the current `≤1024px` rule that collapses to one column).
- [ ] **Orientation:** Ensure the word cloud renderer recalculates on `resize`/`orientationchange`; verify `renderer.js` re-layout is triggered.
- [ ] **Max-widths:** Constrain modal/card max-widths for tablet so they don't stretch full-bleed.
- [ ] **Presence avatar size:** Add a tablet `--avatar-size` step between desktop and the 28px phone size.
- [ ] **Touch fallbacks:** Confirm host moderation (right-click delete) and tooltips have a tap-friendly alternative on tablet.
- [ ] **Manual QA:** Test iPad portrait/landscape via devtools device presets + Safari iOS pass.

## Dependencies
- US-UI-08 (Responsive Breakpoint Baseline) — provides the `768–1024px` tablet breakpoint and tokens.
- US-WC-02 (Dynamic Word Cloud) — renderer re-layout on resize/orientation change.

## Open Questions
- iPad portrait: stacked single-column vs. narrow side rail + cloud? Recommendation: prototype the narrow side rail first; fall back to stacked if QR/list become cramped.
