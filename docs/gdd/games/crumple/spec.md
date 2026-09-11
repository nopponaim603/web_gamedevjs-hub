---
title: "📄 Crumple — Paper Arcade 3D"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - crumple
  - three.js 3d engine
  - game-spec
---

# 📄 Crumple — Paper Arcade 3D

**Code Name:** `crumple`  
**Game ID:** `G050`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Procedural Mesh Deformation  
**URL in Hub:** `/games/crumple/index.html`  
**Category:** Three.js 3D Engine / อาเขต  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกม 3D สไตล์กระดาษพับและขยำ (Paper Physics Arcade) ที่ให้ผู้เล่นควบคุมลูกบอลกระดาษกลิ้งหลบสิ่งกีดขวางบนโต๊ะทำงานสไตล์เรโทร

### 1.2 Core Features
- **Paper Deformation Engine:**  พื้นผิวและโมเดลกระดาษที่ยับย่นแบบไดนามิก
- **Office Desktop Obstacles:**  สิ่งกีดขวางจากเครื่องเขียน (ปากกา, ยางลบ, แก้วกาแฟ, คลิปหนีบกระดาษ)
- **Stop-motion Aesthetic:**  อนิเมชันสไตล์สต็อปโมชันกระดาษ 12 FPS สวยงาม
- **Combo Crumple Score:**  เก็บสะสมเศษกระดาษโน้ตเพื่อปลดล็อกสกินใหม่

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | WASD / Arrow Keys: ควบคุมทิศทางการกลิ้งของก้อนกระดาษ | Space: กระโดด |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / Procedural Mesh Deformation รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
