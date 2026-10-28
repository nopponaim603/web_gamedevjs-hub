# P2P CloudWord — Interactive Mechanics

**Version:** 1.2 | **Last Updated:** 2026-06-14

## Core Loop
1. **Join/Create:** User starts a session or joins via QR code.
2. **Submit:** User enters a word in the input field.
3. **Broadcast:** The word is sent to all peers in the mesh.
4. **Aggregation:** Every peer counts word frequency (`wordCounts`) to determine font size.
5. **Render:** The word cloud re-renders dynamically.

## User Actions
| Action | Input | Result | Notes |
|--------|-------|--------|-------|
| Create Session | "Create Session" Button | Generates Peer ID and QR code | Becomes "Main Node" (Host) |
| Join Session | Scan QR / URL Param | Connects to Host Peer ID | Becomes Participant |
| Submit Word | Text Input + Send | Word sent to everyone | Updates local frequency count |
| Upvote Word | Click on word in cloud | Broadcasts weight increase (`VOTE_WORD`) | v1.2 Feature |
| Send Reaction | Emoji Button click | Floating emoji on everyone's screen | v1.2 Feature |
| Moderate Word | Host-only: Right-click word | Removes word from everyone's cloud (`DELETE_WORD`) | v1.2 Feature |
| Change Theme | Host-only: Dropdown menu selection | Switches active visual preset on all clients (`THEME_CHANGE`) | v1.2 Feature |
| Export PNG | Host-only: "Export PNG" Button | Generates and downloads 2x scaled dashboard image | v1.2 Feature |
| View Cloud | Observation | Sees animated word cloud | Dynamic scaling by frequency |
| Check Presence | Sidebar/Overlay | View list of active participants with initial avatars | v1.3 Feature (Partially Done) |
| View History | History Tab | Review past word clouds/logs | v1.3 Feature |

## Core System Modules
### Networking System (Mesh Logic)
- **Host Role:** Maintains the list of all Peer IDs. When a new person joins, the Host distributes their ID to everyone else to establish a Full Mesh.
- **QR Join Logic:** Checks for URL parameter `?join=...` on page load and auto-connects to that ID.
- **Network Diagnostics (v1.3):** Real-time monitoring of PeerJS error events and connection state (disconnected, closed, failed).

### Word Management System (Aggregation)
Tracks word frequencies in a local Map. Each submission increases the frequency of that word, which the renderer uses to scale the text.

### Engagement System (v1.2)
- **Upvote Logic:** Sends a `VOTE_WORD` message. All peers increment the frequency of the target word.
- **Reaction Logic:** Sends a `REACTION` message with the emoji type. Peers trigger a local CSS float animation.

### Moderation System (v1.2)
- **Host Privileges:** Only the Host's broadcasted `DELETE_WORD` messages are executed.
- **Security Check:** Clients authenticate the delete command by checking that the WebRTC channel's verified `senderPeerId` matches the authenticated session `hostId` to prevent spoofing.

### Theme Customization System (v1.2)
- **Visual Presets:** Swaps CSS color variable tokens for Light (CAMT Default), Dark (Neon), and Pastel theme variables.
- **Sync:** Broadcasts `THEME_CHANGE` messages to synchronize selections across all peers.

### Export System (v1.2)
- **Offscreen Canvas:** Serializes the SVG DOM elements to a 2x scaled canvas for high-quality PNG downloads, embedding topic headers and watermarks.

### Rendering System (Visualization)
Uses **D3.js v7 (Force Simulation Layout)** to position text elements in real-time. Supports runtime theme color updates with transition animations on SVG text fills.

**Linked to Software Design:** [System Design](./01-system-design.md)

## Session Lifecycle & Termination
- **Goal:** Collaborative creation of a representative word cloud.
- **Termination:** Host disconnects or users leave the session.
