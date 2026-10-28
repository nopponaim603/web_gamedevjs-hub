# User Story: US-QZ-01 - Quiz Mode via Markdown

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้สร้าง Session (Host)
**ฉันต้องการ** อัปโหลดไฟล์ Markdown เพื่อเริ่มโหมดตอบคำถาม
**เพื่อให้** ฉันสามารถจัดกิจกรรมประเมินผลหรือเล่นเกมกับผู้เข้าร่วมได้

---

## ✅ Acceptance Criteria
1. [x] Host สามารถอัปโหลดไฟล์ `.md` และระบบแยกแยะคำถาม/คำตอบได้ถูกต้อง
2. [x] มีระบบจัดการ Lifecycle (Countdown -> Question -> Result)
3. [x] ข้อมูลคำถามและสถานะถูก Sync ไปยัง Participant ทุกคนแบบ Real-time
4. [x] แสดง Leaderboard สรุปคะแนนหลังจบการแข่งขัน

---

## 🛠 Technical Tasks
- [x] Develop `QuizManager` class for Markdown parsing and state management
- [x] Implement quiz-specific UI views (Question Area, Options, Timer)
- [x] Handle synchronization of quiz states across the WebRTC mesh
- [x] Implement scoring logic and leaderboard display

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Quiz Logic: [quiz-manager.js](../../../../src/js/quiz-manager.js)
- Application Logic: [app.js](../../../../src/js/app.js)
