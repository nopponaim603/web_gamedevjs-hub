---
title: "🛹 Skate Dog — 3D Procedural Skateboarding Pup"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - skate-dog
  - three.js 3d engine
  - game-spec
---

# 🛹 Skate Dog — 3D Procedural Skateboarding Pup

**Code Name:** `skate-dog`  
**Game ID:** `G022-B`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Procedural Terrain Generation  
**URL in Hub:** `/games/skate-dog/index.html`  
**Category:** Three.js 3D Engine / อาเขตผจญภัย  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมสเก็ตบอร์ด 3 มิติแสนสดใส ควบคุมเจ้าสุนัขนักสเก็ตไถบอร์ดไปตามเส้นทางเมืองและชายหาดที่สร้างแบบ Procedural ไม่รู้จบ

### 1.2 Core Features
- **Infinite Procedural Track:**  เส้นทางสเก็ตบอร์ดสร้างขึ้นใหม่แบบไม่มีที่สิ้นสุด
- **Trick Combo System:**  กระโดด Grinding ราวบันไดและหมุนตัวกลางอากาศสะสมตัวคูณคะแนน
- **Cute Canine Character:**  โมเดลน้องหมา 3D ดุ๊กดิ๊กพร้อมแอนิเมชันลิ้นห้อยและหางกระดิก
- **Day/Night Cycle:**  บรรยากาศแสงสีเมืองที่เปลี่ยนจากเช้าจรดค่ำแบบเรียลไทม์

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Arrow Left/Right (or A/D): เลี้ยวสเก็ตบอร์ด | Space: กระโดด Ollie / ทำท่า Trick | Shift: เร่งความเร็ว |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / Procedural Terrain Generation รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
