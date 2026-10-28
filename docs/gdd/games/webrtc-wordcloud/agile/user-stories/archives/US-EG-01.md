# User Story: Click-to-Upvote Words [US-EG-01]

## Description
As a participant, I want to click on a word in the cloud to increase its frequency (weight) so that I can support ideas without re-typing them.

## Acceptance Criteria
- [x] User can click on any word in the d3-cloud.
- [x] Clicking a word sends a `VOTE_WORD` message to all peers.
- [x] The word's count increases locally and on all peer clients.
- [x] The cloud re-renders smoothly showing the increased size.
- [x] A brief "+1" visual feedback occurs on click.

## Technical Tasks
- [x] **D3 Interaction:** Add `.on("click", ...)` to word elements in the renderer.
- [x] **Message Logic:** Implement `VOTE_WORD` handler in `app.js`.
- [x] **Sync:** When clicked, increment local count and broadcast the update.
- [x] **Animation:** Implement CSS animations for the vote pop effect.

## Dependencies
- US-WC-02 (Dynamic Word Cloud)
