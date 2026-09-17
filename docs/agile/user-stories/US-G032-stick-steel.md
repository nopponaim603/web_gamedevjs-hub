---
title: "US-G032: Stick & Steel — Physics Duel & Weapon Ragdoll Scraping & Porting"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-17"
owner: "Game Scraper & Physics Engineer"
status: "Backlog / Ready"
tags:
  - agile
  - user-story
  - scraping
  - stick-steel
  - physics
---
# US-G032: Stick & Steel · The Splinter Pit (G032)

**Epic:** Epic 32 — Stick & Steel Physics Duel & Weapon Ragdoll Scraping & Porting (G032)  
**Source URL:** [https://genex.games/stick-steel](https://genex.games/stick-steel)  
**Play Embed URL:** [https://stick-steel.genex.technology/](https://stick-steel.genex.technology/)  
**Source GitHub Repo:** [https://github.com/Rabneba/stick-steel](https://github.com/Rabneba/stick-steel)  
**Target Directory:** `public/games/stick-steel/`  
**Created:** 2026-09-17  
**Estimate:** XL (4 Stories)  

---

## 📖 Epic Overview

**ในฐานะ** ผู้พัฒนาเว็บเกมและวิศวกรฟิสิกส์ (Game Developer & Physics Engineer)  
**ฉันต้องการ** สแครปและพอร์ตเกม **Stick & Steel · The Splinter Pit** (เกมฟิสิกส์ดวลดาบคนก้านไม้บนสะพานแคบเหนือบ่อหนาม)  
**เพื่อให้** ผู้เล่นใน GameDevJS Hub สามารถสนุกกับการฟันดาบ ปัดป้อง (Parry), ปลดอาวุธ (Disarm), ซัดคู่ต่อสู้ตกหลุมหนาม ทั้งในโหมดซ้อม (Practice Yard), สู้กับบอท (Fight a Bot) และดวล 2 คนบนเครื่องเดียวกัน/ออนไลน์

---

## 🎯 User Story Breakdown

### [US-G032-00] Game Design Document & Ragdoll Swordplay Spec
- **Statement:** ในฐานะ Lead Game Designer ฉันต้องการจัดทำเอกสาร GDD Spec วิเคราะห์ระบบฟิสิกส์ 2D Stickman Ragdoll, การเหวี่ยงอาวุธแบบ Angular Impulse, การคำนวณโมเมนตัมการกระแทก (Knockback) และกฎการตัดสินแพ้ชนะเมื่อตกสะพาน
- **Acceptance Criteria:**
  - [ ] จัดทำเอกสาร GDD ใน `docs/gdd/games/stick-steel/spec.md`
  - [ ] วิเคราะห์คลังอาวุธ: ดาบสั้น (Shortsword), กระบองมีหนาม (Mace), ดาบยาวสองมือ (Two-handed Longsword)
  - [ ] ออกแบบระบบปัดป้องดาบ (Blade Clashing & Parry Stun) และการหลุดมือของอาวุธ (Disarm Physics)
  - [ ] กำหนด State Machine ของนักรบ: Idle, Windup, Swing, Recoil, Knockdown, Ragdoll Recovery

### [US-G032-01] Hand-Drawn Assets, Patrick Hand Typography & Vite Bundle Scraping
- **Statement:** ในฐานะ Web Scraper ฉันต้องการดาวน์โหลด Vite Bundles (`./assets/index-*.js`, `./assets/index-*.css`), ฟอนต์สไตล์ลายมือ `PatrickHand-Regular.ttf`, SVG Icons และเสียงปะทะเหล็กกล้า (Steel Clang SFX) มาจัดโครงสร้างใน `public/games/stick-steel/`
- **Acceptance Criteria:**
  - [ ] ดาวน์โหลดไฟล์หลักจาก `https://stick-steel.genex.technology/` พร้อมอ้างอิง source จาก `Rabneba/stick-steel`
  - [ ] สกัดฟอนต์ `./fonts/PatrickHand-Regular.ttf` และตั้งค่า `@font-face` ให้โหลดแบบ Local ออฟไลน์ได้
  - [ ] ตัดต่อและถอดรหัสเสียงปะทะใบดาบ (Sword Clash), เสียงตกหลุมหนาม (Splinter Impalement), เสียงลมเหวี่ยง
  - [ ] จัดระบบไฟล์ให้รันผ่าน `index.html` แบบ Standalone ภายใน `public/games/stick-steel/`

### [US-G032-02] Splinter Pit Bridge Physics, Dual-Wield Combat & Bot AI
- **Statement:** ในฐานะ Physics & AI Engineer ฉันต้องการพอร์ตเอนจินฟิสิกส์การควบคุมไม้ก้าน, ข้อต่อ ragdoll, การแกว่งดาบตามเคอร์เซอร์เมาส์ และพัฒนาระบบ Bot AI ให้สามารถกะจังหวะฟันและถอยรักษาระยะได้สมจริง
- **Acceptance Criteria:**
  - [ ] สะพานไม้แคบพร้อมขอบเขต Collider และโซนกับดักหนามด้านล่างที่ทำให้ตายทันที
  - [ ] การควบคุมนักรบ: เคลื่อนที่ซ้าย-ขวา (A/D หรือ Arrows), กระโดด (W/Space), เหวี่ยงดาบตามองศาเมาส์/ทัช
  - [ ] ปฏิกิริยาการปะทะ: ดาบชนดาบเกิดสะเก็ดไฟและแรงดีดกลับ, ดาบชนตัวสร้างดาเมจและแรงผลัก
  - [ ] Bot AI: มี 3 ระดับฝีมือ (Novice, Swordsman, Master) สามารถอ่านระยะดาบและบล็อกการโจมตีได้

### [US-G032-03] Practice Yard, Local/Online Duel Controls & Hub Integration
- **Statement:** ในฐานะ UI/UX Developer ฉันต้องการสร้างหน้าเลือกโหมดการเล่น (Practice Yard, 1P vs Bot, 2P Local Shared Keyboard), ระบบนับคะแนนยก (Round Wins) และเชื่อมต่อการ์ดเกมเข้าสู่ Next.js Game Hub
- **Acceptance Criteria:**
  - [ ] เมนูเลือกโหมด: ซ้อมกับหุ่นฟาง (Practice Dummy), ดวลเดี่ยวกับ AI, และดวล 2 คนบนคีย์บอร์ดเดียวกัน
  - [ ] UI โทนกระดาษสเก็ตช์หมึกดำ-กระดาษคราฟต์ (`#efeeeb`) แสดงชื่อนักดาบ, อาวุธที่เลือก และสถิติยก
  - [ ] รองรับ Mobile Gesture Controls (Virtual Joystick สำหรับขยับตัว + Dial สำหรับบังคับทิศทางดาบ)
  - [ ] บันทึกการ์ดลง `src/app/page.js` ในหมวดหมู่ "เกมต่อสู้ / ฟิสิกส์" และทดสอบเล่นบน Modal Iframe

---

## 🛠 Technical Tasks
1. ดึงโค้ดและแกะบิลด์จาก `stick-steel.genex.technology` หรือโคลน GitHub repository `Rabneba/stick-steel`
2. ทดสอบเอนจินฟิสิกส์ Canvas 2D ใน Localhost
3. แปลงระบบเสียงและการเรนเดอร์ลายเส้นให้ทำงานลื่นไหล 60 FPS
4. เพิ่มลงใน Game Hub Portfolio
