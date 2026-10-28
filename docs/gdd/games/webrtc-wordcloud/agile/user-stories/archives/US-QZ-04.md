# User Story: US-QZ-04 - Player Nickname & Leaderboard Display

**Status:** ✅ Done
**Epic:** [Product Backlog](../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้เข้าร่วม (Participant)
**ฉันต้องการ** ตั้งชื่อเล่น (Nickname) ของตัวเองก่อนเข้าร่วม Quiz
**เพื่อให้** เพื่อนๆ และ Host เห็นชื่อของฉันบน Leaderboard แทน Peer ID ที่อ่านไม่รู้เรื่อง

ระบบนี้ยังไม่เน้นการเก็บข้อมูลลง database — nickname ถูกเก็บไว้ใน memory ของ session (ผ่าน WebRTC state sync) เท่านั้น และจะหายไปเมื่อ session จบ

---

## ✅ Acceptance Criteria
1. [x] ผู้เข้าร่วมกรอก Nickname ก่อนหรือขณะเข้าร่วม session (ค่าเริ่มต้น = ส่วนหนึ่งของ Peer ID ถ้าไม่กรอก)
2. [x] Nickname ถูก broadcast ไปยังทุก peer เมื่อเข้าร่วม และถูกรวมเข้ากับ `MESH_INIT`/`STATE_SYNC` สำหรับผู้เข้าร่วมใหม่
3. [x] Leaderboard (ทั้งช่วง `RESULT` และ `FINAL`) แสดง Nickname แทน Peer ID
4. [x] Host เห็นรายชื่อผู้เข้าร่วมทั้งหมดพร้อม Nickname ในรายการ Participants
5. [x] หาก Nickname ซ้ำกัน ระบบยังทำงานได้ปกติ (แยกผู้เล่นด้วย Peer ID ภายใน แสดงผลด้วย Nickname)

---

## 🛠 Technical Tasks
- [x] เพิ่ม UI ช่องกรอก Nickname ในหน้า Join/Lobby
- [x] เพิ่ม message type ใหม่ เช่น `{ "type": "PLAYER_INFO", "peerId": "...", "nickname": "..." }` และ broadcast เมื่อเชื่อมต่อสำเร็จ
- [x] ให้ Host เก็บ `nicknames: Map<peerId, nickname>` และรวมเข้าไปใน `STATE_SYNC`/`MESH_INIT` สำหรับผู้เข้าร่วมใหม่
- [x] ปรับ `QuizManager.getLeaderboard()` หรือ `app.js` ให้ map `id -> nickname` ตอน render leaderboard
- [x] อัปเดตรายการ Participants ในหน้า Host ให้แสดง Nickname
- [x] อัปเดต [03-data-schema.md](../../software/03-data-schema.md) เพิ่ม message type `PLAYER_INFO` และ field `nickname` ใน schema ที่เกี่ยวข้อง

---

## 🔗 Related Files
- Backlog: [Product Backlog](../01-product-backlog.md)
- System Design (Known Gaps): [01-system-design.md](../../software/01-system-design.md)
- Data Schema: [03-data-schema.md](../../software/03-data-schema.md)
- Network Logic: [network.js](../../../src/js/network.js)
- Quiz Logic: [quiz-manager.js](../../../src/js/quiz-manager.js)
- Application Logic: [app.js](../../../src/js/app.js)
- Markup: [index.html](../../../index.html)
