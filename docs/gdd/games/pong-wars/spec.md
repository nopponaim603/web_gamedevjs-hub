---
title: "⚔️ Dynamic Pong Wars — Day vs Night Color Conquest"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - pong-wars
  - ปริศนา
  - game-spec
---

# ⚔️ Dynamic Pong Wars — Day vs Night Color Conquest

**Code Name:** `pong-wars`  
**Game ID:** `G034`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Canvas 2D / Vanilla JS / Web Audio  
**URL in Hub:** `/games/pong-wars/index.html`  
**Category:** ปริศนา / ฟิสิกส์  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมฟิสิกส์ซิมูเลชันการต่อสู้ระหว่างลูกบอลกลางวัน (Sun/Day) และกลางคืน (Moon/Night) ที่กระเด้งเปลี่ยนสีของกระดานแบบ Dynamic Grid Conquest

### 1.2 Core Features
- **Dual Dynamic Ball Physics:**  ลูกบอลสองขั้วสะท้อนพื้นผิวและระบายสีพื้นที่ใหม่
- **Balanced Tile Grid:**  คำนวณเปอร์เซ็นต์การครองพื้นที่ของทั้งสองฝ่ายแบบเรียลไทม์
- **Generative Audio Chimes:**  เสียงโน้ตตามความเร็วและจุดที่ลูกบอลกระทบ
- **Custom Speed & Gravity Controls:**  ปรับแต่งจำนวนลูกบอลและความเร็วในการจำลอง

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Interactive Simulation: สามารถคลิกเพื่อเพิ่มลูกบอล หรือปล่อยให้ระบบต่อสู้อัตโนมัติ (Zero-Player Sim) |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Canvas 2D / Vanilla JS / Web Audio รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
