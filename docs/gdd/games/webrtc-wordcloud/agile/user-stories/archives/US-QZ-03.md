# User Story: US-QZ-03 - Kahoot-style Speed Scoring & Early Reveal

**Status:** ✅ Done
**Epic:** [Product Backlog](../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้เข้าร่วม (Participant)
**ฉันต้องการ** ได้คะแนนมากขึ้นถ้าตอบถูกเร็วกว่า (เหมือน Kahoot)
**เพื่อให้** การแข่งขันมีความตื่นเต้นและยุติธรรมกับคนที่ตอบเร็วและถูก

**ในฐานะ** ผู้สร้าง Session (Host)
**ฉันต้องการ** ให้ระบบเข้าสู่หน้าผลลัพธ์ทันทีเมื่อผู้เข้าร่วมทุกคนตอบครบ
**เพื่อให้** ไม่ต้องรอจนหมดเวลาโดยไม่จำเป็น

---

## ✅ Acceptance Criteria
1. [x] คะแนนที่ได้จากการตอบถูกแปรผันตามเวลาที่เหลือ ณ ตอนที่ตอบ (ตอบเร็ว = คะแนนสูง, ตอบช้า = คะแนนต่ำลงแต่ยังมากกว่า 0)
2. [x] ตอบผิด หรือไม่ตอบเลย ได้ 0 คะแนนสำหรับข้อนั้น
3. [x] `getQuestionStats()` รองรับจำนวนตัวเลือกตามจริงของแต่ละคำถาม (ไม่ fix 4 ตัวเลือก)
4. [x] เมื่อผู้เข้าร่วมที่เชื่อมต่ออยู่ทั้งหมดตอบครบ ระบบเข้าสู่ state `RESULT` ทันที โดยไม่ต้องรอ timer หมด
5. [x] (Optional) ตอบถูกติดต่อกันหลายข้อ ("streak") ได้คะแนนโบนัสเพิ่ม

---

## 🛠 Technical Tasks
- [x] เพิ่ม timestamp ตอนเริ่ม `startQuestionTimer()` และคำนวณ `timeTaken` ใน `submitAnswer(peerId, answerIndex)`
- [x] ปรับสูตรคะแนน `score = MIN_POINTS + (BASE_POINTS - MIN_POINTS) * (timeLeft / QUESTION_SECONDS)` (ปัดเศษ, ขั้นต่ำ `MIN_POINTS = 500` สำหรับคำตอบที่ถูก, สูงสุด `BASE_POINTS = 1000`)
- [x] แก้ `getQuestionStats()` ให้ใช้ `this.questions[this.currentQuestionIndex].options.length` แทนค่าคงที่ 4
- [x] เพิ่ม `QuizManager.setActivePeerCount(count)` และเรียกจาก `app.js` (จาก `CloudNetwork.connections.size + 1`) เพื่อเทียบกับ `responses.size` แล้วเรียก `revealResult()` ทันทีเมื่อครบ
- [x] เก็บ `streak` counter ต่อ `peerId` ใน `QuizManager` (`this.streaks`) และเพิ่ม bonus `(streak - 1) * STREAK_BONUS` เข้า `scores`; streak รีเซ็ตเมื่อตอบผิดหรือไม่ตอบ
- [x] อัปเดต [03-data-schema.md](../../software/03-data-schema.md) และ [01-system-design.md](../../software/01-system-design.md) ด้วย field ใหม่และสูตรคะแนน

---

## 🔗 Related Files
- Backlog: [Product Backlog](../01-product-backlog.md)
- System Design: [01-system-design.md](../../software/01-system-design.md)
- Data Schema: [03-data-schema.md](../../software/03-data-schema.md)
- Quiz Logic: [quiz-manager.js](../../../src/js/quiz-manager.js)
- Application Logic: [app.js](../../../src/js/app.js)
