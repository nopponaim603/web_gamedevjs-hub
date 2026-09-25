---
title: "US-G031: DEAD END — Zombie Survival Shooter Scraping & Porting"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-17"
owner: "Game Scraper & Reverse Engineer"
status: "Completed"
tags:
  - agile
  - user-story
  - scraping
  - dead-end
  - shooter
---
# US-G031: DEAD END — Last Night in the Neighborhood (G031)

**Epic:** Epic 31 — DEAD END Top-Down Zombie Survival Shooter Scraping & Porting (G031)  
**Source URL:** [https://dead-end.replit.app/](https://dead-end.replit.app/)  
**Target Directory:** `public/games/dead-end/`  
**Created:** 2026-09-17  
**Estimate:** XL (4 Stories)  

---

## 📖 Epic Overview

**ในฐานะ** ผู้พัฒนาเว็บเกมพอร์ตโฟลิโอ (Game Developer & Reverse Engineer)  
**ฉันต้องการ** สแครป (Scrape) แกะรอยระบบ (Reverse-Engineer) และพอร์ตเกม **DEAD END — Last night in the neighborhood** จาก Replit (`https://dead-end.replit.app/`)  
**เพื่อให้** นำมาบรรจุลงใน GameDevJS Hub เป็นเกมแนว Top-down Survival Shooter ความละเอียดสูง เล่นได้ทั้งบน Desktop และ Mobile Touch โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก (Zero-dependency Standalone)

---

## 🎯 User Story Breakdown

### [US-G031-00] Game Design Document & 5-Wave Survival Spec
- **Statement:** ในฐานะ Lead Game Designer ฉันต้องการจัดทำเอกสาร GDD Spec วิเคราะห์ลูปเกม 5 Waves, การเคลื่อนที่ 8 ทิศทาง + Stamina Sprint/Dodge, อาวุธ M4/Shotgun, AI ศัตรู (Walkers, Spitters, Sector Threat Boss) และระบบ Roguelike Field Perks
- **Acceptance Criteria:**
  - [x] จัดทำเอกสาร GDD ใน `docs/gdd/games/dead-end/spec.md`
  - [x] วิเคราะห์ Core Loop: Defense Waves → Scavenge Supply Drops → Field Upgrade Choice → Evacuation
  - [x] ถอดสูตรคำนวณ Damage, Ammo Capacity, Reload Rate, Stamina Regen และ Spitter Acid Trajectory
  - [x] ออกแบบ Data Schema สำหรับ Roguelike Field Perks (เช่น Hollow Point, Sprint Booster, Fast Hands)

### [US-G031-01] Asset, Vite Bundle & Audio SFX Scraping
- **Statement:** ในฐานะ Web Scraper ฉันต้องการดาวน์โหลด HTML, Vite ESM Bundles (`/assets/index-*.js`, `/assets/index-*.css`), SVG Logos, Sprites/Textures และเสียง Web Audio SFX ทั้งหมดมาจัดโครงสร้างใน `public/games/dead-end/`
- **Acceptance Criteria:**
  - [x] สแครป HTML, CSS, Module JS จาก `https://dead-end.replit.app/`
  - [x] สกัดและดาวน์โหลด Brand Assets (`./brand/dead-end-logo.svg`, `./favicon.svg`, icons)
  - [x] ถอดรหัส Audio Synthesizer / Sound FX (ปืน M4, ลูกซอง, เสียงคำรามซอมบี้, เสียงหวอไซเรน)
  - [x] ปลดล็อกข้อจำกัด Replit analytics script ให้ทำงานแบบ Self-contained Standalone

### [US-G031-02] Top-Down Combat Loop, Zombie Waves AI & Roguelike Field Perks
- **Statement:** ในฐานะ Gameplay Engineer ฉันต้องการพอร์ตและปรับแต่งระบบฟิสิกส์การเล็งเมาส์ 360°, การยิงกระสุน, ซอมบี้พาธไฟน์ดิ้งตามหาผู้เล่น, การเกิดระลอกคลื่น 5 Wave และหน้าต่างเลือก Field Upgrade ระหว่างเวฟ
- **Acceptance Criteria:**
  - [x] ควบคุมตัวละคร WASD + Mouse Aim 360° พร้อมระบบ Sprint (Shift) และ Dodge Roll (Space)
  - [x] ระบบสลับอาวุธ M4 Carbine (Full Auto) และ Shotgun (Spread), รีโหลดกระสุน (R)
  - [x] AI ซอมบี้ 3 ประเภท: Walker ธรรมดา, Spitter พ่นกรดระยะไกล, และ Sector Threat Boss พร้อม Health Bar
  - [x] ระบบ Field Upgrade Modal: สุ่มเลือก Perk 1 ใน 3 หลังจบเวฟ (กดคีย์ 1, 2, 3 หรือคลิก)

### [US-G031-03] Minimap HUD, Ammo Matrix, Mobile Touch & Hub Integration
- **Statement:** ในฐานะ Frontend & UI/UX Engineer ฉันต้องการพอร์ต Radar Minimap, Ammo Track, Damage Flash, Mobile Virtual Joysticks และเชื่อมต่อการ์ดเกมเข้าสู่ Next.js Game Hub
- **Acceptance Criteria:**
  - [x] Canvas Minimap แสดงตำแหน่งผู้เล่น, ซอมบี้ (Hostiles) และกล่องกระสุน (Supply Drops) แบบ Realtime
  - [x] HUD Elements: หลอดเลือด Health Bar, Stamina Track, ตัวนับ Kill Combo Streak, Boss Threat Bar
  - [x] Virtual Joysticks และปุ่มสัมผัสบนหน้าจอมือถือ (Move-pad, Aim-pad, Reload, Dodge, Swap)
  - [x] ลงทะเบียนการ์ดเกมใน `src/app/page.js` และทดสอบการเปิดเล่นผ่าน Iframe Modal ที่ 60 FPS

---

## 🛠 Technical Tasks
1. สร้างสคริปต์ `scratch/scrape_dead_end.js` เพื่อสกัด HTML, CSS, JS Bundles และ Assets
2. ตรวจสอบ dependencies ภายใน JS bundle และถอดรหัส canvas render loop
3. จัดระเบียบไฟล์ลง `public/games/dead-end/`
4. ทดสอบความเข้ากันได้กับ Localhost และ Mobile Responsive
