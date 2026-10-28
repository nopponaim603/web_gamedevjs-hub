# User Story: US-WC-03 - Word Animations

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้ใช้งาน
**ฉันต้องการ** ให้คำศัพท์มีการขยับและเปลี่ยนขนาดอย่างนุ่มนวล
**เพื่อให้** ประสบการณ์การใช้งานดูทันสมัยและมีชีวิตชีวา (Visual Feedback)

---

## ✅ Acceptance Criteria
1. [x] คำศัพท์มีการทำ Transition เมื่อเปลี่ยนขนาดหรือสี (Duration 600ms)
2. [x] ใช้ D3 Force Simulation เพื่อให้คำขยับหลบกันอย่างเป็นธรรมชาติ (Collision Physics)
3. [x] แสดงคำศัพท์ลอยขึ้นมาชั่วคราว (Floating Word) เมื่อมีการส่งคำใหม่

---

## 🛠 Technical Tasks
- [x] Implement D3 transitions in `CloudRenderer.update()`
- [x] Configure `d3.forceCollide` for dynamic radius based on font size
- [x] Create `showFloatingWord` utility for micro-interactions

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Renderer Logic: [renderer.js../../../../src/js/renderer.js)
