---
title: "🎯 SILENT VIPER — Tactical Sniper 3D"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - silent-viper
  - three.js 3d engine
  - game-spec
---

# 🎯 SILENT VIPER — Tactical Sniper 3D

**Code Name:** `silent-viper`  
**Game ID:** `G032`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Vite / WebGL  
**URL in Hub:** `/games/silent-viper/index.html`  
**Category:** Three.js 3D Engine / ยิงปืนทางยุทธวิธี  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมยิงปืนสไนเปอร์ลอบสังหาร 3 มิติ ผู้เล่นรับบทเป็นพลซุ่มยิงในปฏิบัติการลับ คำนวณระยะทาง แรงลม และอัตราการเต้นของหัวใจก่อนลั่นไก

### 1.2 Core Features
- **Realistic Scope & Ballistics:**  การซูมแบบ Optical เลนส์พร้อมตาราง Mil-Dot
- **Bullet-Time Slow Motion:**  อนิเมชันกระสุนแหวกอากาศแบบสโลว์โมชันเมื่อยิงโดนเป้าสำคัญ
- **Wind & Distance Factor:**  ต้องปรับแต่งการเล็งชดเชยทิศทางลมและแรงโน้มถ่วง
- **Stealth Mission Rating:**  ประเมินเกรดความเงียบและความแม่นยำหลังจบภารกิจ

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse: เล็งกล้องส่องทางไกล (Scope) | Right Click: ซูม/กลั้นหายใจ | Left Click: ลั่นไกยิง |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / Vite / WebGL รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
