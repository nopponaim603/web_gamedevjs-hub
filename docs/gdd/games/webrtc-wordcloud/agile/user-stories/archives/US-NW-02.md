# User Story: US-NW-02 - Join via QR Code

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้เข้าร่วม (Participant)
**ฉันต้องการ** เข้าร่วม Session ผ่าน QR Code หรือลิงก์ที่มี Parameter
**เพื่อให้** ฉันสามารถเชื่อมต่อกับ Host ได้ทันทีโดยไม่ต้องกรอก ID เอง

---

## ✅ Acceptance Criteria
1. [x] ระบบตรวจสอบ URL Parameter `?join=HOST_ID` เมื่อโหลดหน้าเว็บ
2. [x] หากพบ Parameter ระบบจะเชื่อมต่อไปยัง Host โดยอัตโนมัติ
3. [x] แสดงสถานะ "Connected" และเปลี่ยนโหมดเป็น Participant

---

## 🛠 Technical Tasks
- [x] Parse URL query parameters using `URLSearchParams`
- [x] Implement `connectToPeer` in `CloudNetwork`
- [x] Handle UI overlay transition on auto-connect

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Software Design: [Interactive Mechanics](../../../software/05-interactive-mechanics.md)
