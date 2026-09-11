---
title: "🐾 Mogura Tatakanai — モグラ叩かない (Pet the Mole 3D)"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - mogura-tatakanai
  - three.js 3d engine
  - game-spec
---

# 🐾 Mogura Tatakanai — モグラ叩かない (Pet the Mole 3D)

**Code Name:** `mogura-tatakanai`  
**Game ID:** `G053`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js r128 / Web Audio API  
**URL in Hub:** `/games/mogura-tatakanai/index.html`  
**Category:** Three.js 3D Engine / Arcade  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกม 3D Arcade สุดน่ารักที่ฉีกกฎเกมตีตัวตุ่น (Whack-a-Mole) แบบดั้งเดิม โดยเปลี่ยนจากการทุบตีเป็นการลูบหัวตัวตุ่นอย่างอ่อนโยน (Petting / Stroking) เพื่อสะสมคะแนน พร้อมตัวตุ่นหลากสายพันธุ์ เอฟเฟกต์อนุภาค 3D และดนตรีประกอบสุดไพเราะ

### 1.2 Core Features
- **Procedural 3D Moles:**  ตุ่น 4 สายพันธุ์ (Normal, Gold, Black, White) แต่ละชนิดให้คะแนนและเสียงตอบสนองต่างกัน
- **Stroke Detection:**  ตรวจจับการลูบสัมผัสด้วย Raycaster 3D พร้อมอนิเมชันมือเรืองแสง
- **Dynamic Procedural Textures:**  หญ้าและดินสร้างแบบ Procedural Canvas 2D สดใหม่ทุกการรัน
- **Integrated High Score:**  บันทึก Top 5 คะแนนลงใน LocalStorage พร้อมเอฟเฟกต์ Count-up
- **Web Audio Synth & Dual BGM:**  ระบบเสียง Sound Effects สังเคราะห์ด้วย Web Audio API พร้อมเพลงประกอบ BGM ในตัว

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Desktop: คลิกซ้ายค้างแล้วลากเมาส์ลูบหัวตัวตุ่น | Mobile: แตะและลากนิ้วผ่านหัวตัวตุ่น (Stroke / Pet) |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js r128 / Web Audio API รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
