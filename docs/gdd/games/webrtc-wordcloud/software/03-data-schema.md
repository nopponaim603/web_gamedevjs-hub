# P2P CloudWord — Data Schema

**Version:** 1.3 | **Last Updated:** 2026-06-14

## Data Syncing (JSON Messages)

All data exchanged over WebRTC Data Channels is sent as JSON objects.

### Word Cloud Mode

#### 1. New Word Submission
Sent when a user submits a word.
```json
{ 
  "type": "NEW_WORD", 
  "word": "AI", 
  "sender": "Peer_ID" 
}
```

#### 2. Mesh Init
Sent by the Host to a newly connected peer to share the list of already-known peers, so the newcomer can connect to them and complete the mesh.
```json
{
  "type": "MESH_INIT",
  "peers": ["ID1", "ID2", "ID3"]
}
```

#### 3. State Sync
Sent by the Host to a newly connected peer to bring it up to date with the current session state.
```json
{
  "type": "STATE_SYNC",
  "mode": "cloud",
  "words": [{ "text": "AI", "count": 5 }],
  "topic": "Today's theme",
  "theme": "light",
  "nicknames": [["Peer_ID_1", "Alice"], ["Peer_ID_2", "Bob"]]
}
```
In `quiz` mode, `mode` is `"quiz"` and `words`/`topic` are omitted; the client switches its view to the Quiz UI and waits for the next `QUIZ_STATE`. `nicknames` and `theme` are always included.

#### 3b. Player Info
Broadcast by every peer whenever the connected peer set changes (`peerChange`), so all participants learn each other's nicknames.
```json
{ "type": "PLAYER_INFO", "peerId": "Peer_ID", "nickname": "Alice" }
```
`nickname` defaults to `Player-XXXX` (first 4 chars of the Peer ID) if the user leaves it blank. Receivers store it in a local `nicknames: Map<peerId, nickname>` and re-render the participant list / leaderboard. Values are truncated to 20 chars and HTML-escaped before rendering.

#### 3c. Word Upvote
Broadcast by a peer when clicking a word on the cloud to upvote it.
```json
{
  "type": "VOTE_WORD",
  "word": "AI"
}
```

#### 3d. Delete Word (Moderation)
Broadcast by the Host to delete an inappropriate word. Receivers verify that `senderPeerId` matches the authenticated `hostId` before executing the deletion locally.
```json
{
  "type": "DELETE_WORD",
  "word": "Spam"
}
```

#### 3e. Theme Change
Broadcast by the Host when switching the visual preset of the session.
```json
{
  "type": "THEME_CHANGE",
  "theme": "dark"
}
```

---

### Quiz Mode

#### 4. Quiz Activate
Broadcast by the Host when starting a quiz, switching all participants into Quiz mode.
```json
{ "type": "QUIZ_ACTIVATE" }
```

#### 5. Quiz State
Broadcast by the Host on every `QuizManager` state transition (`COUNTDOWN`, `QUESTION`, `RESULT`, `FINAL`).
```json
{
  "type": "QUIZ_STATE",
  "state": "QUESTION",
  "data": {
    "index": 0,
    "question": { "text": "...", "options": ["A", "B", "C", "D"], "correctIndex": 1 },
    "leaderboard": [{ "id": "Peer_ID", "score": 950 }],
    "stats": [0, 0, 0]
  }
}
```
Note: `question.correctIndex` is broadcast to all participants even while the question is active — clients must not reveal it in the UI until `state === "RESULT"`. `stats` has the same length as `question.options` (not fixed to 4).

#### 6. Quiz Timer
Broadcast every second during `COUNTDOWN`/`QUESTION` to keep all clocks in sync.
```json
{ "type": "QUIZ_TIMER", "timeLeft": 18, "state": "QUESTION" }
```

#### 7. Quiz Answer
Broadcast by a participant when they select an option. Only the Host acts on it (calls `QuizManager.submitAnswer`).
```json
{ "type": "QUIZ_ANSWER", "answerIndex": 1, "peerId": "Peer_ID" }
```

#### 8. Quiz End
Broadcast by the Host to end the quiz and return all participants to Word Cloud mode.
```json
{ "type": "QUIZ_END" }
```

---

## Local State

### wordCounts Object
Stores the frequency of each word for rendering.
```javascript
{
  "AI": 5,
  "WebRTC": 3,
  "Collaboration": 8
}
```

### nicknames Map (all peers)
Maps every known Peer ID (including self) to its display nickname. Populated from `STATE_SYNC.nicknames` and kept up to date via `PLAYER_INFO`. Entries for peers that disconnect are removed on the next `peerChange`.
```javascript
Map {
  "Peer_ID_1" => "Alice",
  "Peer_ID_2" => "Bob"
}
```

### QuizManager State (Host only)
```javascript
{
  questions: [{ text, options: [...], correctIndex }],
  currentQuestionIndex: 0,
  state: "QUESTION", // LOBBY | COUNTDOWN | QUESTION | RESULT | FINAL
  scores: Map<peerId, number>,
  responses: Map<peerId, answerIndex>,
  streaks: Map<peerId, number>, // consecutive correct answers
  questionStartTime: 1718000000000, // Date.now() when the current question started
  activePeerCount: 3 // connected participants incl. host, set via setActivePeerCount()
}
```

#### Scoring (Kahoot-style speed scoring)
- Correct answer: `score = MIN_POINTS + (BASE_POINTS - MIN_POINTS) * (timeLeft / QUESTION_SECONDS)` (rounded), where `timeLeft` is derived from `questionStartTime`. Defaults: `BASE_POINTS = 1000`, `MIN_POINTS = 500`, `QUESTION_SECONDS = 20`.
- Incorrect or no answer: `0` points for that question, and the peer's `streaks` entry resets to `0`.
- Streak bonus: each consecutive correct answer adds `(streak - 1) * STREAK_BONUS` extra points (`STREAK_BONUS = 50`).
- Early reveal: once `responses.size >= activePeerCount`, `revealResult()` fires immediately (state -> `RESULT`) instead of waiting for the timer.

---

## Related Documents
- System Design: [System Design](./01-system-design.md)
- Mechanics: [Interactive Mechanics](./05-interactive-mechanics.md)
