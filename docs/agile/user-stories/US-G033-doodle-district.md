---
title: "US-G033: Doodle District — 3D Hand-Drawn Arena Shooter Scraping & Porting"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-17"
owner: "Game Scraper & Three.js 3D Engineer"
status: "Backlog / Ready"
tags:
  - agile
  - user-story
  - scraping
  - doodle-district
  - threejs
  - multiplayer
---
# US-G033: Doodle District (G033)

**Epic:** Epic 33 — Doodle District 3D Hand-Drawn Arena Shooter & PeerJS Multiplayer Scraping (G033)  
**Source URL:** [https://doodleshooter.vercel.app/](https://doodleshooter.vercel.app/)  
**Target Directory:** `public/games/doodle-district/`  
**Created:** 2026-09-17  
**Estimate:** XL (4 Stories)  

---

## 📖 Epic Overview

**ในฐานะ** นักพัฒนา 3D Web Graphics และเครือข่าย P2P (3D Graphics & Network Engineer)  
**ฉันต้องการ** สแครปและพอร์ตเกม **Doodle District** จาก Vercel (`https://doodleshooter.vercel.app/`)  
**เพื่อให้** ผู้เล่นสามารถเข้าเล่นเกมยิงปืน 3D ในโลกภาพวาดลายเส้นสมุดสเก็ตช์ (Hand-drawn Doodle Notebook Aesthetic) ที่สร้างด้วย Three.js r170 พร้อมระบบมัลติเพลเยอร์แบบ WebRTC Peer-to-Peer โดยไม่ต้องตั้ง Game Server แยก

---

## 🎯 User Story Breakdown

### [US-G033-00] Game Design Document & 3D Doodle Arena Spec
- **Statement:** ในฐานะ Lead 3D Game Architect ฉันต้องการจัดทำเอกสาร GDD Spec วิเคราะห์การเรนเดอร์เมืองลายเส้น 3D, ระบบฟิสิกส์กระสุนและแรงดีดปืน (Recoil), การตรวจจับการชน (AABB / Raycast Collision) และโปรโตคอล WebRTC PeerJS สำหรับ P2P Multiplayer Room
- **Acceptance Criteria:**
  - [ ] จัดทำเอกสาร GDD ใน `docs/gdd/games/doodle-district/spec.md`
  - [ ] ออกแบบ Shader / Material สไตล์กระดาษกราฟและลายเส้นดินสอ/หมึกปากกา (Notebook Doodle Shaders)
  - [ ] ถอดโครงสร้าง City Map: อาคารลายเส้น, ทางเดินแคบ, จุดซุ่มยิง, และแท่นเกิด (Spawn Points)
  - [ ] กำหนด Message Payload ของ PeerJS: Player Movement (Pos/Rot), Bullet Spawn, Damage Event, Score Sync

### [US-G033-01] Three.js 0.170.0 Bundle, Doodle Textures & PeerJS Scraping
- **Statement:** ในฐานะ Web Scraper ฉันต้องการดาวน์โหลด HTML, สไตล์ชีท `./style.A4A8BF44.css`, มอดูลเกม `./game.7LCERBLR.js`, โค้ด Vendor Three.js r170, PeerJS 1.5.4 และ Google Fonts (`Patrick Hand`, `Caveat`) มาจัดเก็บแบบ Standalone ใน `public/games/doodle-district/`
- **Acceptance Criteria:**
  - [ ] ดาวน์โหลดไฟล์ทั้งหมดจาก `https://doodleshooter.vercel.app/`
  - [ ] แปลง Import Map ชี้ Three.js และ PeerJS มาเป็น Local Vendor Files ในโฟลเดอร์เกมเพื่อ Zero-CDN reliance
  - [ ] โหลด Google Webfonts แบบ Local Storage หรือ Fallback ป้องกันเว็บออฟไลน์โหลดฟอนต์ไม่ขึ้น
  - [ ] สกัด Texture ลายกระดาษสมุด (Notebook Grid Texture) และโมเดล Doodle Props

### [US-G033-02] 3D Movement, Bullet Trajectory & Notebook Arena Collisions
- **Statement:** ในฐานะ 3D Gameplay Programmer ฉันต้องการพอร์ตการควบคุมมุมมอง First-person/Over-the-shoulder, Pointer Lock API, การเคลื่อนไหว WASD + กระโดด, วิถีกระสุน Doodle Tracer และระบบตรวจจับ Hitbox ตัวละคร
- **Acceptance Criteria:**
  - [ ] การควบคุมมุมกล้อง 3D ลื่นไหล 60 FPS พร้อมฟังก์ชัน Pointer Lock เมื่อคลิกที่หน้าจอ
  - [ ] การเคลื่อนที่: WASD เดินหน้า-ถอยหลัง-สไลด์ข้าง, Spacebar กระโดด, Shift วิ่งเร็ว
  - [ ] ระบบอาวุธ: ปืนลายเส้นยิงกระสุนหมึก/ดินสอ มีวิถีวิถีโค้งเล็กน้อยและ Particle ลายเส้นเวลาชนผนัง
  - [ ] ระบบ Singleplayer Sandbox / Target Range สำหรับทดสอบยิงเป้ากระดาษเคลื่อนที่

### [US-G033-03] PeerJS P2P Room Lobby, HUD Overlay & Hub Integration
- **Statement:** ในฐานะ Full-stack Web & Network Engineer ฉันต้องการสร้างหน้าจอสร้างห้อง (Create Room) / เข้าห้อง (Join by Room Code), HUD แสดงพลังชีวิต/กระสุน/เป้าเล็ง, และนำการ์ดเกมไปแสดงผลใน Next.js Portfolio Hub
- **Acceptance Criteria:**
  - [ ] ระบบสร้างห้อง PeerJS และคัดลอกรหัสห้อง (Share Room Code / Direct URL Hash) ให้เพื่อนเข้าร่วมได้ทันที
  - [ ] HUD Overlay (`<div id="hud">`): เป้าเล็ง Crosshair ลายเส้นมือวาด, แถบพลังชีวิต, ตัวบอกกระสุน และ Killfeed
  - [ ] ระบบจัดการกรณีหลุดการเชื่อมต่อ (Peer Disconnection Graceful Handling)
  - [ ] ลงทะเบียนการ์ดเกมใน `src/app/page.js` ภายใต้หมวดหมู่ "Three.js 3D Engine"

---

## 🛠 Technical Tasks
1. สร้างสคริปต์สแครปไฟล์จาก `doodleshooter.vercel.app`
2. จัดการ Vendor Dependencies (Three.js 0.170, PeerJS) ให้รันแบบ Offline-ready
3. ทดสอบการเชื่อมต่อ 2 แท็บเบราว์เซอร์ผ่าน PeerJS
4. ผสานเข้ากับ GameDevJS Hub Modal Iframe
