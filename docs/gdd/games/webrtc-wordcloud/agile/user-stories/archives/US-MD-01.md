# User Story: Host Moderation [US-MD-01]

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้สร้าง Session (Host)
**ฉันต้องการ** ลบคำที่ไม่เหมาะสมออกจาก Word Cloud
**เพื่อให้** ฉันสามารถควบคุมดูแลความปลอดภัยและความสุภาพของห้องกิจกรรมได้

---

## ✅ Acceptance Criteria
- [x] Host สามารถคลิกขวาที่คำบน Word Cloud หรือรายการคำทางด้านซ้ายเพื่อเปิดเมนู "Delete Word"
- [x] เมื่อกดลบ คำดังกล่าวจะส่งข้อความ `DELETE_WORD` ไปให้ทุกคนใน session
- [x] คำที่ถูกลบจะหายไปจากหน้าจอของผู้เข้าร่วม (Participant) ทุกคนโดยอัตโนมัติ
- [x] ผู้เข้าร่วมทั่วไปที่ไม่ใช่ Host จะไม่สามารถลบคำได้

---

## 🛠 Technical Tasks
- [x] **Context Menu:** พัฒนา HTML/CSS และสคริปต์สำหรับแสดง Custom Context Menu บริเวณเมาส์เมื่อคลิกขวา (ข้าม Default Context Menu ของบราวเซอร์)
- [x] **Security:** ผูกตรวจสอบความถูกต้อง `senderPeerId` ในช่องทางสื่อสาร WebRTC ให้ตรงกับ `hostId` ก่อนลบคำในหน้าจอของ Participant เพื่อความปลอดภัย
- [x] **State Update:** พัฒนาฟังก์ชัน `removeWordLocal()` เพื่อนำคำออกและสั่งให้ D3 และ Stats list อัปเดตการแสดงผลใหม่ทันที

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Styling: [style.css](../../../../src/css/style.css)
- Application Logic: [app.js](../../../../src/js/app.js)
- UI Template: [index.html](../../../../index.html)
