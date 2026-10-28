# Implementation: Click-to-Upvote Words [US-EG-01]

**Status:** ✅ Completed  
**Date:** 2026-05-05  
**Version:** 1.0  

## Overview
This document outlines the technical implementation of the **Click-to-Upvote** feature, which allows participants to interactively support words in the cloud, increasing their visual weight in real-time across the P2P network.

## Technical Details

### 1. Data Logic
- **Storage:** The `words` Map in `WordCloudApp` remains the source of truth.
- **Logic:** An upvote is treated as an increment to the `count` property. This ensures compatibility with the existing D3 scaling logic.
- **Method:** `app.js` now includes a `voteWord(text)` method that handles both local updates and network broadcasting.

### 2. Networking (P2P)
- **New Message Type:** `VOTE_WORD`
- **Synchronization:** 
    - When a user clicks a word, the client sends a `VOTE_WORD` message to all connected peers.
    - Receiving peers update their local `words` map and trigger a re-render.
    - This maintains the decentralized state without a central server.

### 3. Visualization (D3.js & CSS)
- **Renderer Update:** 
    - The `CloudRenderer` now attaches click listeners to D3 text elements.
    - `cursor: pointer` is applied to words to indicate interactivity.
- **Feedback Animations:**
    - **Cloud:** A floating `+1` animation (`vote-pop`) appears at the exact click coordinates.
    - **Sidebar:** Words in the sidebar lists also support click-to-vote for better accessibility.
- **CSS Transitions:** Added `@keyframes votePopUp` for a smooth upward float and fade effect.

## Key Code References

- **Upvote Logic:** [app.js:L420-423](../../../src/js/app.js)
- **Interaction Handler:** [renderer.js:L68-72](../../../src/js/renderer.js)
- **Animation Styles:** [style.css:L310-323](../../../src/css/style.css)

## Verification Results
- [x] Word size increases dynamically upon click.
- [x] Votes are synchronized across multiple browser instances.
- [x] Sidebar items are correctly clickable and linked to the same logic.
- [x] Visual feedback (+1) is responsive and performant.

---
*Documented by Antigravity AI for Sprint 02.*
