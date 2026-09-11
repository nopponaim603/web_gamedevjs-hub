---
title: "🎯 404 OVERPRINT — Tactical Shooter & Typography Arcade"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - overprint-404
  - ปริศนา
  - game-spec
---

# 🎯 404 OVERPRINT — Tactical Shooter & Typography Arcade

**Code Name:** `overprint-404`  
**Game ID:** `G051`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Vanilla JS / Canvas 2D / WebGL  
**URL in Hub:** `/games/overprint-404/index.html`  
**Category:** ปริศนา / อาเขต 2D  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมยิงปืนทางยุทธวิธีแนว Typography ในธีมหน้าจอ Error 404 ที่ผู้เล่นต้องควบคุมการเล็ง ยิงเป้าหมาย และบริหารจัดการกระสุนในสไตล์ Brutalist Typography Design

### 1.2 Core Features
- **Brutalist Typography Art:**  การออกแบบภาพกราฟิกด้วยตัวอักษรและ Contrast สูง สไตล์ Iskra Graphics
- **Precision Recoil & Ballistics:**  ฟิสิกส์การเล็งและการดีดของกระสุนที่สมจริง
- **Tactical Wave Defense:**  ศัตรูโผล่ตามจุดบอดของหน้าจอพร้อมระบบคะแนนคอมโบ
- **Juicy Sound FX:**  เสียงลั่นไกและปลอกกระสุนแบบไดนามิก

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse: เล็งและคลิกซ้ายเพื่อยิง | Space / R: รีโหลดกระสุน | Esc: เมนู |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Vanilla JS / Canvas 2D / WebGL รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
