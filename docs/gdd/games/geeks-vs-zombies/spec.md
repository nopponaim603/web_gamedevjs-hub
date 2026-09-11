---
title: "🧟 Geeks vs Zombies — Cyber Tower Defense"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - geeks-vs-zombies
  - กระดาน
  - game-spec
---

# 🧟 Geeks vs Zombies — Cyber Tower Defense

**Code Name:** `geeks-vs-zombies`  
**Game ID:** `G036`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Phaser 3 / Canvas 2D  
**URL in Hub:** `/games/geeks-vs-zombies/index.html`  
**Category:** กระดาน / วางกลยุทธ์  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมวางแผนป้องกันฐาน (Tower Defense) ธีมโปรแกรมเมอร์และสาย Geek วางยูนิตคอมพิวเตอร์และเซิร์ฟเวอร์ต่อสู้กับฝูงซอมบี้บั๊กและมัลแวร์

### 1.2 Core Features
- **Geek Unit Types:**  ยูนิตหลากหลายสาย (Frontend, Backend, DevOps, Hacker)
- **Bug & Zombie Swarms:**  ซอมบี้หลากหลายรูปแบบพร้อมความต้านทานเฉพาะทาง
- **Resource Management:**  บริหารแรม (RAM) และพลังงาน CPU เพื่อสร้างยูนิต
- **Special Powerups:**  ยิงคาถา Git Force Push หรือ DDoS Wave เคลียร์หน้าจอ

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse: ลากวางยูนิต Geek บนเลน และคลิกเพื่ออัปเกรดความสามารถ |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Phaser 3 / Canvas 2D รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
