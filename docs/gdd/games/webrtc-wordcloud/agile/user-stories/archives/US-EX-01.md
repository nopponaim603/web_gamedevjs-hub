# User Story: PNG Export [US-EX-01]

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้สร้าง Session (Host)
**ฉันต้องการ** ส่งออกผลลัพธ์ Word Cloud สรุปสุดท้ายเป็นไฟล์รูปภาพ PNG
**เพื่อให้** ฉันสามารถแชร์ผลลัพธ์ของกิจกรรมนั้นๆ ให้กับผู้อื่นได้ในภายหลัง

---

## ✅ Acceptance Criteria
- [x] มีปุ่ม "Export PNG" ในหน้ารายละเอียด Session (Sidebar)
- [x] เมื่อกดปุ่มแล้วจะเริ่มดาวน์โหลดรูปภาพให้โดยอัตโนมัติ
- [x] รูปภาพที่ส่งออกตรงกับสถานะปัจจุบันของ Word Cloud บนหน้าจอ
- [x] ส่งออกด้วยความละเอียดสูง (รองรับหน้าจอ Retina / High-DPI)

---

## 🛠 Technical Tasks
- [x] **Canvas Capture:** แปลงโครงสร้าง SVG เป็นภาพและวาดลงบน offscreen canvas
- [x] **Download Trigger:** สร้างเสมือน anchor tag และสั่งดาวน์โหลดไฟล์ PNG โดยอัตโนมัติ
- [x] **Optimization:** คำนวณขยายขนาด canvas (Scale 2x) และใส่พื้นหลัง (#1e293b) เพื่อให้รูปภาพมีความคมชัดและสวยงาม

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Main Logic: [app.js](../../../../src/js/app.js)
