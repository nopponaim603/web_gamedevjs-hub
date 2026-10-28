# User Story: US-WC-01 - Submit Word

**Status:** ✅ Done
**Epic:** [Product Backlog](../../01-product-backlog.md)
**Owner:** Team

---

## 📖 Description
**ในฐานะ** ผู้ใช้งาน
**ฉันต้องการ** พิมพ์คำศัพท์และส่งเข้าไปในระบบ
**เพื่อให้** คำศัพท์ของฉันไปปรากฏบน Word Cloud ของทุกคน

---

## ✅ Acceptance Criteria
1. [x] มีช่อง Input สำหรับพิมพ์คำศัพท์ (จำกัดความยาว)
2. [x] เมื่อกด Send หรือ Enter คำศัพท์จะถูกส่งไปยัง Peers ทุกคนใน Mesh
3. [x] คำศัพท์ที่ส่งไปปรากฏใน `wordCounts` ของทุกเครื่อง

---

## 🛠 Technical Tasks
- [x] Implement broadcast of `NEW_WORD` message type
- [x] Create `addWord` logic in `WordCloudApp`
- [x] Handle duplicate words by increasing frequency count

---

## 🔗 Related Files
- Backlog: [Product Backlog](../../01-product-backlog.md)
- Software Design: [Interactive Mechanics](../../../software/05-interactive-mechanics.md)
