# User Story: US-QZ-02 - Quiz Editor Tool

**Status:** ✅ Done
**Epic:** [Product Backlog](../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้สร้าง Session (Host) หรือผู้จัดกิจกรรม
**ฉันต้องการ** เครื่องมือ Quiz Editor แบบ Web UI ที่ช่วยให้สร้างและแก้ไขชุดคำถาม Quiz ได้
**เพื่อให้** ฉันสามารถเตรียมคำถามสำหรับกิจกรรมตอบคำถามได้ง่ายขึ้น ไม่ต้องจำและพิมพ์ Markdown เอง โดยสามารถตรวจสอบความถูกต้องและดูตัวอย่างคำถาม (Live Preview) ได้แบบเรียลไทม์

---

## ✅ Acceptance Criteria
1. [x] ผู้ใช้สร้าง Quiz ใหม่ผ่านฟอร์ม UI ได้ โดยไม่ต้องเขียน Markdown เอง
2. [x] มี Live Preview แสดงผลตรงกับไฟล์ `.md` ที่จะ export ออกไป
3. [x] Export ไฟล์ `.md` ที่ระบบ Quiz เดิมสามารถนำไปใช้งานได้ทันที
4. [x] Import ไฟล์ `.md` เดิมมาแก้ไขต่อได้ถูกต้อง
5. [x] มี Validation แจ้งเตือนเมื่อข้อมูลไม่ครบ/ไม่ถูกต้อง ก่อน export

---

## 🛠 Technical Tasks
- [x] ออกแบบและสร้างหน้าโมดูลและ UI ฟอร์ม (`quiz-editor.html` + `quiz-editor.js`) สำหรับเพิ่ม/ลบ/แก้ไขคำถาม ตัวเลือก และเฉลย
- [x] พัฒนาฟังก์ชัน Live Preview แสดงตัวอย่างหน้าตา Quiz ที่ผู้เล่นจะเห็นแบบเรียลไทม์ขณะแก้ไข
- [x] จัดลำดับข้อคำถามและตัวเลือก (ระบบปุ่มควบคุม ↑/↓ และปุ่มลบ)
- [x] พัฒนาระบบ Export ข้อมูลเป็นไฟล์ `.md` (ตามโครงสร้าง Parser เดิม) และไฟล์ `.json`
- [x] พัฒนาระบบ Import ไฟล์ `.md` เดิมและไฟล์ `.json` กลับเข้าฟอร์มแก้ไข
- [x] พัฒนาระบบตรวจสอบฟอร์ม (Validation) ก่อนบันทึกหรือ Export (ตรวจคำถามว่าง, ตัวเลือกว่าง, ตัวเลือกไม่ครบ 2 ข้อ, ไม่มีเฉลย)
- [x] ทำระบบบันทึกร่างอัตโนมัติ (Auto-save) ลงใน `localStorage` ป้องกันข้อมูลหาย
- [x] รองรับการจัดการข้อสอบหลายชุด (Question Bank/Quiz Sets) - สร้าง/คัดลอก/ลบ/สลับชุดคำถามได้

---

## 🔗 Related Files
- Backlog: [Product Backlog](../01-product-backlog.md)
- Editor Page: [quiz-editor.html](../../../quiz-editor.html)
- Editor Logic: [quiz-editor.js](../../../src/js/quiz-editor.js)
- Editor Styles: [quiz-editor.css](../../../src/css/quiz-editor.css)
- Entry Point: [index.html](../../../index.html)
- Quiz Logic (compatible format): [quiz-manager.js](../../../src/js/quiz-manager.js)
