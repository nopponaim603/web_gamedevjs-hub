# User Story: iPhone (Small Phone) Responsive Layout [US-UI-09]

## Description
As a participant joining from an iPhone, I want the join screen, word cloud, quiz, and input bar to fit my phone screen correctly — including the notch and home-indicator safe areas and the Safari dynamic address bar — so I can read and interact comfortably without content being cut off, overlapped, or causing horizontal scroll.

## Acceptance Criteria
- [ ] **Safe areas:** The fixed `.mobile-input-bar` respects the iOS home indicator via `padding-bottom: env(safe-area-inset-bottom)` (relies on `viewport-fit=cover` from [US-UI-08](./US-UI-08.md)), so the input/send button is never obscured by the home bar.
- [ ] **Notch:** Top-of-screen content (header, `.cloud-container` padding-top, QR/join card) respects `env(safe-area-inset-top)` in landscape so nothing hides behind the notch/Dynamic Island.
- [ ] **Viewport height:** `.cloud-container` and full-height screens use a dynamic-viewport-safe unit (`100dvh` with a `vh` fallback) so the layout does not jump or get clipped when Safari's address bar shows/hides.
- [ ] **No horizontal scroll:** At `≤480px` there is no `overflow-x`; the word cloud canvas, presence strip, modals, and reaction panel all stay within the viewport width.
- [ ] **Touch targets:** Interactive controls (send button, emoji reactions, quiz option buttons, tab buttons) are at least 44×44px per iOS HIG.
- [ ] **Modals:** Modals/side-panels are full-width with comfortable padding at `≤480px` and are scrollable if taller than the viewport (no trapped/clipped content).
- [ ] **Input zoom:** Text inputs use `font-size: 16px` (or `max(16px, …)`) to prevent iOS Safari auto-zoom on focus.
- [ ] **Quiz:** Quiz options stack to a single column and remain fully tappable; the question text scales down to remain readable without overflow.
- [ ] Verified on iPhone SE (375px), iPhone 15 (393px), and one large phone, in both portrait and landscape (Safari iOS).

## Technical Tasks
- [ ] **Safe-area insets:** Apply `env(safe-area-inset-*)` to `.mobile-input-bar`, header, and `.cloud-container` in `src/css/style.css`.
- [ ] **dvh units:** Replace `75vh`/full-height `vh` usages with `dvh` + `vh` fallback.
- [ ] **Input font-size:** Ensure `#word-input` and nickname/join inputs are ≥16px on mobile.
- [ ] **Touch sizing:** Audit and bump min tap-target sizes for reactions, send, tabs, quiz options.
- [ ] **Overflow sweep:** Add `overflow-x: hidden` guard where appropriate and fix any element exceeding `100vw` at `≤480px`.
- [ ] **Manual QA:** Test on iPhone breakpoints via responsive devtools + at least one real/simulator Safari iOS pass.

## Dependencies
- US-UI-08 (Responsive Breakpoint Baseline) — provides `viewport-fit=cover`, breakpoint scale, and shared tokens.
- US-UI-06 (Presence Avatars Walking Strip) — strip must remain within viewport at phone sizes.

## Open Questions
- Minimum supported device width — target 320px (iPhone SE 1st gen) or 375px? Recommendation: design to 360–375px, sanity-check 320px.
