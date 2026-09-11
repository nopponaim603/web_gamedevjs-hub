---
title: "🏺 CELADON: The Long Ash 3D — Ceramic Glaze Journey"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - celadon
  - three.js 3d engine
  - game-spec
---

# 🏺 CELADON: The Long Ash 3D — Ceramic Glaze Journey

**Code Name:** `celadon`  
**Game ID:** `G049`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Custom GLSL Shaders / Web Audio  
**URL in Hub:** `/games/celadon/index.html`  
**Category:** Three.js 3D Engine / ผ่อนคลายและศิลปะ  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกม 3D บรรยากาศสงบนิ่ง (Atmospheric Art Game) ที่ผู้เล่นต้องควบคุมการเผาและเคลือบเครื่องเคลือบศิลาดลโบราณ รักษาอุณหภูมิและประกายขี้เถ้า

### 1.2 Core Features
- **Procedural Glaze Shaders:**  จำลองการหลอมละลายและการแตกลายงาของน้ำเคลือบศิลาดล
- **Calming Ambient Soundscape:**  เสียงฟืนไม้แตกและเสียงลมสร้างสมาธิ
- **Kiln Temperature Physics:**  ควบคุมการไหลของออกซิเจนและอุณหภูมิในเตาเผา
- **Pottery Collection:**  บันทึกและสะสมผลงานเครื่องปั้นดินเผาที่เผาสำเร็จ

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Mouse / Touch: ควบคุมความแรงของเปลวไฟและหมุนเครื่องปั้นดินเผา 3D |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / Custom GLSL Shaders / Web Audio รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
