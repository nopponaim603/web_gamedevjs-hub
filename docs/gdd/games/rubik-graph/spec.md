---
title: "🎲 Rubik Graph Solver 3D — Combinatorial Cube Graph"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - rubik-graph
  - ปริศนา
  - game-spec
---

# 🎲 Rubik Graph Solver 3D — Combinatorial Cube Graph

**Code Name:** `rubik-graph`  
**Game ID:** `G035`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js 3D / Graph Theory Algorithms  
**URL in Hub:** `/games/rubik-graph/index.html`  
**Category:** ปริศนา / กราฟและคณิตศาสตร์  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมและเครื่องมือสร้างภาพจำลองกราฟการหมุนของรูบิคแบบ 3 มิติ เชื่อมโยงทฤษฎีกราฟและขั้นตอนวิธีแก้ปริศนาลูกบิดรูบิค

### 1.2 Core Features
- **Interactive 3D Rubik Cube:**  หมุนเลเยอร์ของลูกบิดได้อย่างอิสระ
- **State Graph Visualizer:**  แสดงโครงสร้างกราฟของสถานะลูกบิดในปริภูมิ 3 มิติ
- **Step-by-Step Solver:**  แสดงเส้นทางแก้ปัญหารูบิคแบบทีละขั้นตอน
- **Multi-language UI:**  รองรับคำอธิบายภาษาไทยและอังกฤษ

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse Drag: หมุนมุมมองลูกบิดและโหนดกราฟ 3D | Controls UI: เลือกอัลกอริทึมและสเต็ปการหมุน |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js 3D / Graph Theory Algorithms รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
