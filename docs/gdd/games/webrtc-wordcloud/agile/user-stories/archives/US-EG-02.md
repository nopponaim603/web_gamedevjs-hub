# User Story: Live Reactions [US-EG-02]

## Description
As a user, I want to send live emoji reactions that float on the screen so I can express instant feedback during the session.

## Acceptance Criteria
- [x] A reaction bar exists with at least 4 emojis (❤️, 🔥, 👏, 😂).
- [x] Clicking an emoji sends a `REACTION` message to all peers.
- [x] Floating emoji animation appears on all clients' screens.
- [x] Emojis fade out and are removed from the DOM after animation.

## Technical Tasks
- [x] **Reaction UI:** Add a floating bar with emoji buttons.
- [x] **Animation:** Create a CSS-based "Float & Fade" animation class.
- [x] **P2P Trigger:** Broadcast reaction type; all peers spawn the emoji at a random position.
- [x] **Cleanup:** Ensure DOM elements are destroyed after animation completes.

## Dependencies
- US-NW-01 (Mesh Networking)
