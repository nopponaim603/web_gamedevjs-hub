# User Story: US-UI-01 - Participant List

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้ใช้งาน
**ฉันต้องการ** เห็นรายชื่อและจำนวนผู้เข้าร่วมที่เชื่อมต่ออยู่
**เพื่อให้** ฉันรู้ว่ามีใครอยู่ใน Session บ้างและระบบทำงานปกติหรือไม่

---

## ✅ Acceptance Criteria
1. [x] แสดงจำนวน Peer ที่เชื่อมต่ออยู่ (Player Count) บน Sidebar
2. [x] มีหน้าต่าง Side Panel แสดงรายชื่อ Peer ID ทั้งหมดใน Mesh
3. [x] รายชื่ออัปเดตแบบ Real-time เมื่อมีคนเข้าหรือออกจากระบบ

---

## 🛠 Technical Tasks
- [x] Implement `peerChange` event in `CloudNetwork`
- [x] Create `updatePeerUI` method in `WordCloudApp` to refresh DOM
- [x] Design and implement the side panel UI in `index.html` and `style.css`

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Network Logic: [network.js../../../../src/js/network.js)
- UI Logic: [app.js../../../../src/js/app.js)
