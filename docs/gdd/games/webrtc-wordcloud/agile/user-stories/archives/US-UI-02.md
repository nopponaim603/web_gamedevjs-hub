# User Story: Theme Customization [US-UI-02]

## Description
As a host, I want to change the visual theme of the word cloud so I can match the event's atmosphere.

## Acceptance Criteria
- [x] Settings menu includes a theme selector.
- [x] At least 3 themes: Default (Light), Dark (Neon), and Pastel.
- [x] Switching themes updates the cloud colors instantly.
- [x] Theme choice is synced to all participants.

## Technical Tasks
- [x] **Theme Tokens:** Define color palettes in `style.css` using CSS variables.
- [x] **UI Switcher:** Add a dropdown in the settings menu.
- [x] **Sync:** Broadcast `THEME_CHANGE` to all peers.
- [x] **Live Update:** Update D3 color scales dynamically.

## Dependencies
- US-WC-02 (Rendering)
