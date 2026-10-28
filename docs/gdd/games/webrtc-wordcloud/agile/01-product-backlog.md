# P2P CloudWord — Product Backlog

**Last Updated:** 2026-06-14 | **Version:** 1.4

## Must Have (MVP)
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| [US-NW-01](./user-stories/archives/US-NW-01.md) | As a host, I want to create a session so I can start a word cloud. | Peer ID generated, "Waiting" state active. | M | [✅ Done] |
| [US-NW-02](./user-stories/archives/US-NW-02.md) | As a participant, I want to join via QR code so I can contribute. | URL param detected, auto-connect to Host. | M | [✅ Done] |
| [US-WC-01](./user-stories/archives/US-WC-01.md) | As a user, I want to submit a word so it appears in the cloud. | Input field works, broadcast successful. | S | [✅ Done] |
| [US-WC-02](./user-stories/archives/US-WC-02.md) | As a user, I want to see a dynamic word cloud so I can see the collective input. | Renderer updates on new word. | L | [✅ Done] |

## Should Have
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| [US-UI-01](./user-stories/archives/US-UI-01.md) | As a user, I want to see the list of participants. | UI shows count/list of connected peers. | S | [✅ Done] |
| [US-WC-03](./user-stories/archives/US-WC-03.md) | As a user, I want words to animate when they grow. | Smooth transitions in the word cloud. | M | [✅ Done] |
| [US-QZ-01](./user-stories/archives/US-QZ-01.md) | As a host, I want to run a quiz mode using Markdown files. | Parse MD questions, manage timer and states. | L | [✅ Done] |
| [US-QZ-03](./user-stories/US-QZ-03.md) | As a participant, I want faster correct answers to score higher (Kahoot-style), and results to reveal early once everyone has answered. | Speed-based scoring, dynamic stats per option count, early reveal on full response. | M | [ ] |
| [US-QZ-04](./user-stories/US-QZ-04.md) | As a participant, I want to set a nickname so the leaderboard shows my name instead of my Peer ID. | Nickname captured at join, synced via `PLAYER_INFO`, shown on leaderboard/participant list. | S | [ ] |
| [US-QZ-02](./user-stories/US-QZ-02.md) | As a host, I want a Quiz Editor Web UI so I can create and edit quizzes without writing Markdown. | Form-based editor, live preview, MD import/export. | L | [ ] |

## v1.2 Engagement & Moderation (Next Sprint)
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| [US-EG-01](./user-stories/archives/US-EG-01.md) | As a participant, I want to click on a word to upvote it. | Clicking word sends `WORD_UPVOTE`, cloud grows. | M | [✅ Done] |
| [US-EG-02](./user-stories/archives/US-EG-02.md) | As a user, I want to send live reactions (emojis). | Emoji panel exists, floating animation on all clients. | M | [✅ Done] |
| [US-MD-01](./user-stories/archives/US-MD-01.md) | As a host, I want to delete inappropriate words. | Host right-click menu, `DELETE_WORD` broadcasted. | S | [✅ Done] |
| [US-UI-02](./user-stories/archives/US-UI-02.md) | As a host, I want to change the cloud's theme. | Palette switcher in UI, updates colors dynamically. | S | [✅ Done] |
| [US-EX-01](./user-stories/archives/US-EX-01.md) | As a host, I want to export the final word cloud as a PNG. | Download button for canvas, high-quality image. | S | [✅ Done] |

## v1.4 CAMT Visual Identity Rebrand (Next Sprint)
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| [US-UI-03](./user-stories/archives/US-UI-03.md) | As a host/participant, I want the app's colors and typography to follow the CAMT brand identity so the product feels consistent with CAMT. | CSS variables in `style.css`/`quiz-editor.css` updated to CAMT palette & font; no glassmorphism/blur remains. | M | [✅ Done] |
| [US-UI-04](./user-stories/archives/US-UI-04.md) | As a host/participant, I want buttons, cards, tabs, and modals restyled per CAMT component specs. | Components match CAMT specs (radius, padding, colors) in `04-ui-ux-design.md`. | M | [✅ Done] |
| [US-UI-05](./user-stories/archives/US-UI-05.md) | As a host/participant, I want a hexagon motif used for decorative elements (icons, avatars, QR frame) reflecting the CAMT brand shape. | Hexagon `clip-path` motif applied to at least icon containers and QR/avatar frames; logo unaltered. | S | [✅ Done] |
| [US-UI-06](./user-stories/archives/US-UI-06.md) | As a participant, I want to see avatars of connected peers walking along the bottom of the word cloud so the session feels alive. | `.presence-strip` shows one hexagon avatar per peer with walking animation, synced to peer list/nicknames. | M | [✅ Done] |

## v1.3 Future / Unplanned
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| US-EG-03 | As a user, I want to hear sound effects for reactions. | Play subtle SFX when receiving a reaction. | S | [ ] |
| US-NW-03 | Network diagnostics UI. | View connection health. | S | [ ] |
| [US-UI-07](./user-stories/archives/US-UI-07.md) | As a participant, I want presence avatars to be animated pixel-art characters walking, so the strip feels alive. | Inline-SVG pixel-art walk animation with per-peer color, direction flip, host badge, and reduced-motion fallback. | M | [✅ Done] |

## v1.4 Responsive / Mobile & Tablet Polish (Next Sprint)
| ID | User Story | Acceptance Criteria | Estimate | Status |
|----|-----------|---------------------|----------|--------|
| [US-UI-08](./user-stories/US-UI-08.md) | As a user on any device, I want a consistent, documented responsive breakpoint system so per-device fixes build on a shared baseline. | Documented breakpoint scale, `viewport-fit=cover`, shared responsive tokens, no horizontal scroll, consolidated media queries. | S | [ ] |
| [US-UI-09](./user-stories/US-UI-09.md) | As an iPhone user, I want join/cloud/quiz/input to fit my screen including notch & home-indicator safe areas. | Safe-area insets, `100dvh` units, 16px inputs (no auto-zoom), ≥44px touch targets, no overflow at ≤480px. | M | [ ] |
| [US-UI-10](./user-stories/US-UI-10.md) | As an iPad user, I want the layout to use the tablet screen well in portrait & landscape. | Tablet `768–1024px` layout distinct from phone/desktop, cloud re-fit on orientation change, constrained modal/card widths. | M | [ ] |

## Linked Software Features
- Derived from: [Interactive Mechanics](../software/05-interactive-mechanics.md), [Concept](../software/00-concept.md), [UI/UX & Visual Design](../software/04-ui-ux-design.md)
- CAMT Theme Reference: [docs/wiki/camt-design](../wiki/camt-design/index.md)

