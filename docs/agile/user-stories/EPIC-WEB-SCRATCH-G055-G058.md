---
title: "Epic Roadmap: Web Game Scraping & Portfolio Expansion (G055–G058)"
project: "GameDevJS Hub (webJS)"
version: "1.1.0"
last_updated: "2026-09-17"
owner: "Dev Team / Web Scraper"
status: "Active"
tags:
  - agile
  - epic
  - roadmap
  - scraping
  - user-stories
---
# 🎮 Epic Roadmap: Web Game Scraping & Hub Expansion (G055–G058)

เอกสารรวบรวม User Stories และแผนงานสำหรับการดึงข้อมูล (Scraping), การวิเคราะห์โครงสร้าง (Reverse Engineering) และการพอร์ตเกมลง GameDevJS Hub สำหรับ 4 โครงการใหม่:

---

## 📊 ตารางเปรียบเทียบภาพรวม (Games Overview Matrix)

| ID | ชื่อเกม | แหล่งที่มา (Source URL) | เทคโนโลยี / เอนจิน | หมวดหมู่ใน Hub | สถานะ |
|---|---|---|---|---|---|
| **G055** | **DEAD END** | [dead-end.replit.app](https://dead-end.replit.app/) | Canvas 2D / Vite ESM / Web Audio | แอ็กชัน / ยิงซอมบี้ | 🔴 Ready for Scraping |
| **G056** | **Stick & Steel** | [genex.games/stick-steel](https://genex.games/stick-steel) | 2D Physics Ragdoll / Canvas / Patrick Hand Font | ต่อสู้ / ฟิสิกส์ดวลดาบ | 🔴 Ready for Scraping |
| **G057** | **Doodle District** | [doodleshooter.vercel.app](https://doodleshooter.vercel.app/) | Three.js r170 / PeerJS WebRTC / 3D Canvas | ยิงปืน 3D / มัลติเพลเยอร์ | 🔴 Ready for Scraping |
| **G058** | **Chai Visual** | [dsa.chaicode.com](https://dsa.chaicode.com/) | Next.js / SVG & Canvas Animation / Sketch UI | การศึกษา / ซิมูเลชัน CS | 🔴 Ready for Scraping |

---

## 🎯 รายละเอียด Epic และ User Stories ที่สร้างขึ้น

### 🧟 1. Epic 31 — DEAD END: Last Night in the Neighborhood (G055)
- **เอกสาร User Story:** [`US-G031-dead-end.md`](./US-G031-dead-end.md)
- **จุดเด่น:** เกมแนวเอาชีวิตรอดจากฝูงซอมบี้ 5 ระลอก (5 Waves), บอสประจำเซกเตอร์, ระบบเก็บ Perk แบบ Roguelike หลังจบเวฟ, เรดาร์ Minimap แบบสด, รองรับทั้งเมาส์+คีย์บอร์ดและ Mobile Virtual Joysticks
- **User Stories:**
  - `US-G031-00`: Game Design Document & 5-Wave Survival Spec
  - `US-G031-01`: Asset, Vite Bundle & Audio SFX Scraping
  - `US-G031-02`: Top-Down Combat Loop, Zombie Waves AI & Roguelike Field Perks
  - `US-G031-03`: Minimap HUD, Ammo Matrix, Mobile Touch & Hub Integration

### ⚔️ 2. Epic 32 — Stick & Steel: The Splinter Pit (G056)
- **เอกสาร User Story:** [`US-G032-stick-steel.md`](./US-G032-stick-steel.md)
- **จุดเด่น:** เกมดวลดาบคนก้านไม้บนสะพานแคบเหนือบ่อหนาม ฟิสิกส์การเหวี่ยงอาวุธ (ดาบสั้น, กระบองหนาม, ดาบยาว), การปัดป้องดาบ (Parry), การปลดอาวุธหลุดมือ (Disarm), ซัดคู่ต่อสู้ตกบ่อหนาม
- **User Stories:**
  - `US-G032-00`: Game Design Document & Ragdoll Swordplay Spec
  - `US-G032-01`: Hand-Drawn Assets, Patrick Hand Typography & Vite Bundle Scraping
  - `US-G032-02`: Splinter Pit Bridge Physics, Dual-Wield Combat & Bot AI
  - `US-G032-03`: Practice Yard, Local/Online Duel Controls & Hub Integration

### ✏️ 3. Epic 33 — Doodle District (G057)
- **เอกสาร User Story:** [`US-G033-doodle-district.md`](./US-G033-doodle-district.md)
- **จุดเด่น:** เกมยิงมุมมอง 3D ในโลกสมุดสเก็ตช์ลายเส้นดินสอ/ปากกา ใช้ Three.js r170 พร้อมระบบมัลติเพลเยอร์แบบ WebRTC ผ่าน PeerJS ให้สร้างห้องดวลกับเพื่อนได้แบบไร้เซิร์ฟเวอร์
- **User Stories:**
  - `US-G033-00`: Game Design Document & 3D Doodle Arena Spec
  - `US-G033-01`: Three.js 0.170.0 Bundle, Doodle Textures & PeerJS Scraping
  - `US-G033-02`: 3D Movement, Bullet Trajectory & Notebook Arena Collisions
  - `US-G033-03`: PeerJS P2P Room Lobby, HUD Overlay & Hub Integration

### ☕ 4. Epic 34 — Chai Visual: Learn CS by Watching It Move (G058)
- **เอกสาร User Story:** [`US-G034-chai-visual.md`](./US-G034-chai-visual.md)
- **จุดเด่น:** แพลตฟอร์มซิมูเลชันการศึกษาที่ทำให้เห็นอัลกอริทึมและการประมวลผลของคอมพิวเตอร์เคลื่อนไหวทีละก้าว (Step-by-step), โหมด Two Pointers / Two Sum, การเปรียบเทียบ Time/Space Complexity O(n) แบบสด
- **User Stories:**
  - `US-G034-00`: System Architecture & Visual Education Engine Spec
  - `US-G034-01`: Next.js Visualizer Bundles, Paper/Ink Theme & Sketch Assets Scraping
  - `US-G034-02`: Step-by-Step Algorithm Animation Runner & Pointer Simulation
  - `US-G034-03`: Interactive Complexity Matrix, Track Navigator & Hub Integration

---

## 🛠️ แผนการเตรียมงานและสคริปต์ Scraping (Preparation Workflow)

1. **Scraping Scripts:** รันสคริปต์สกัด Assets ลง `public/games/<game>/`:
   - `scratch/scrape_dead_end.js` → `public/games/dead-end/`
   - `scratch/scrape_stick_steel.js` → `public/games/stick-steel/`
   - `scratch/scrape_doodle_district.js` → `public/games/doodle-district/`
   - `scratch/scrape_chai_visual.js` → `public/games/chai-visual/`
2. **Offline & Standalone Optimization:** แก้ไข Import Maps, Fonts และ Asset Paths ให้เป็น Local ทั้งหมด
3. **Hub Catalog Integration:** อัปเดต `src/app/page.js` เพื่อเพิ่มการ์ดเกม หมวดหมู่ และ Gradient ประจำเกม
