# User Story: US-NW-01 - Create Session

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้สร้าง Session (Host)
**ฉันต้องการ** สร้างห้องใหม่และได้รับ Peer ID
**เพื่อให้** ฉันสามารถแชร์ลิงก์หรือ QR Code ให้เพื่อนเข้าร่วมได้

---

## ✅ Acceptance Criteria
1. [x] เมื่อกดปุ่ม "Create Session" ระบบจะขอ Peer ID จาก Server PeerJS
2. [x] แสดง Peer ID บนหน้าจอ
3. [x] สร้าง QR Code ที่บรรจุ URL สำหรับเข้าร่วม
4. [x] สถานะของแอปเปลี่ยนเป็น "Host"

---

## 🛠 Technical Tasks
- [x] Initialize PeerJS instance
- [x] Implement `open` event listener for Peer
- [x] Integrate `qrcode.js` to display the join link

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Software Design: [Interactive Mechanics](../../../software/05-interactive-mechanics.md)
