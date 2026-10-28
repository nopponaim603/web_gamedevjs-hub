# User Story: US-WC-02 - Dynamic Word Cloud

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้ใช้งาน
**ฉันต้องการ** เห็น Word Cloud ที่ขยับได้และเปลี่ยนแปลงตามความถี่ของคำ
**เพื่อให้** ฉันเห็นภาพรวมของความสนใจในกลุ่มได้ชัดเจน

---

## ✅ Acceptance Criteria
1. [x] คำที่มีความถี่สูงจะมีขนาดตัวอักษรใหญ่กว่าคำอื่น
2. [x] มีการใช้ D3 Force Simulation เพื่อให้คำขยับหลบกันและไม่ซ้อนทับ
3. [x] Cloud อัปเดตแบบ Real-time เมื่อได้รับข้อมูลใหม่

---

## 🛠 Technical Tasks
- [x] Integrate D3.js force simulation in `CloudRenderer`
- [x] Implement scale for font size based on word frequency
- [x] Handle container resize to keep cloud centered

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Software Design: [Interactive Mechanics](../../../software/05-interactive-mechanics.md)
