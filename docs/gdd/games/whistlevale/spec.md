---
title: "🚂 Whistlevale — A House of Little Worlds 3D"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - whistlevale
  - three.js 3d engine
  - game-spec
---

# 🚂 Whistlevale — A House of Little Worlds 3D

**Code Name:** `whistlevale`  
**Game ID:** `G052`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / WebGL / Spatial Audio  
**URL in Hub:** `/games/whistlevale/index.html`  
**Category:** Three.js 3D Engine / สำรวจและปริศนา  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมผจญภัยสำรวจโลกจำลองขนาดจิ๋ว (Diorama World) ภายในบ้านทรงโบราณ ไขปริศนารางรถไฟจิ๋วและเชื่อมต่อโลกแห่งความฝัน

### 1.2 Core Features
- **Intricate 3D Dioramas:**  ฉากจำลองจำลองโลกในโหลแก้วและกล่องดนตรีสุดประณีต
- **Interactive Railway Logic:**  สับรางรถไฟและส่งขบวนรถไฟไอน้ำไปยังเป้าหมาย
- **Whimsical Soundtrack:**  ดนตรีบรรเลงออร์เคสตราสไตล์นิทานแฟนตาซี
- **Storybook Narrative:**  ค้นพบความทรงจำและจดหมายที่ซ่อนอยู่ตามห้องต่างๆ

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse Drag: หมุนมุมมอง Diorama 360 องศา | Left Click: โต้ตอบกับสวิตช์ รางรถไฟ และกล่องปริศนา |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / WebGL / Spatial Audio รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
