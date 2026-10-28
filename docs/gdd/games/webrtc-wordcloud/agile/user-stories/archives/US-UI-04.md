# User Story: CAMT Component Restyle [US-UI-04]

## Description
As a host/participant, I want buttons, cards, tabs, and modals restyled per the CAMT component specs so the UI matches the brand's solid, earth-tone look.

## Acceptance Criteria
- [x] Primary CTA buttons (e.g. "Create Session", "Send") use solid `--accent-color` background, white text, `border-radius: 4px`, padding `16px 24px`.
- [x] Secondary buttons use pill outline style: 1px border `--secondary`/`--heading-color`, `border-radius: 25px`, padding `8px 24px`.
- [x] Cards/panels (sidebar sections, settings, leaderboard) use `border-radius: 16px`, `--card-bg`, `1px solid --border-color`, padding 24px, shadow `0 2px 8px rgba(0,0,0,0.08)`.
- [x] Tabs/option pills (quiz mode switcher) use `border-radius: 50px`, active state background `--primary-hover` with white text.
- [x] Modals/overlay panels (hero session card, Quiz Editor cards) use `border-radius: 16px`; the landing overlay card uses shadow `2px 8px 23px 3px rgba(0,0,0,0.2)`.
- [x] Status indicator colors (`--success`/`--danger`) unchanged and still pass contrast on new background.

## Technical Tasks
- [x] **Buttons:** Updated base `button`, `button.secondary`, `button.danger` in `style.css` (padding, radius, pill outline).
- [x] **Cards:** `.card`, `.cloud-container`, `.quiz-card`, `.preview-quiz-card` use 16px radius, `--border-color`, `0 2px 8px rgba(0,0,0,0.08)` shadow.
- [x] **Tabs:** `.mode-select-container`/`.mode-btn` pill (50px radius, `--primary-hover` active state).
- [x] **Modals:** `.hero-card` given modal shadow `2px 8px 23px 3px rgba(0,0,0,0.2)`.
- [x] **Verify contrast:** Primary buttons use white-on-`--accent-color` only for large/medium weight-500+ labels per guideline; small accent text avoided.

## Notes
- No standalone `.modal`/`<dialog>` element exists in the app yet — the landing "hero card" overlay and quiz cards serve as the modal-equivalent surfaces and were restyled accordingly.

## Dependencies
- US-UI-03 (Color & Typography Tokens)

## Dependencies
- US-UI-03 (Color & Typography Tokens)
