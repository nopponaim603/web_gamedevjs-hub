---
title: "🌊 Water Ring Toss 3D — Vintage Handheld Toy Simulator"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - water-ring-toss
  - three.js 3d engine
  - game-spec
---

# 🌊 Water Ring Toss 3D — Vintage Handheld Toy Simulator

**Code Name:** `water-ring-toss`  
**Game ID:** `G048`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Rapier WASM 3D Physics  
**URL in Hub:** `/games/water-ring-toss/index.html`  
**Category:** Three.js 3D Engine / ฟิสิกส์ของเหลว  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมจำลองของเล่นย้อนยุคตู้กดน้ำกดห่วง (Water Ring Toss) ในรูปแบบ 3 มิติสมจริง พร้อมระบบฟิสิกส์แรงดันน้ำและแรงลอยตัวของห่วงยาง

### 1.2 Core Features
- **Rapier WASM 3D Physics:**  ฟิสิกส์ Rigid Body ของห่วงและแรงต้านของน้ำที่สมจริง 100%
- **Dual Pump Mechanism:**  ปุ่มปั๊มน้ำซ้าย-ขวา สร้างกระแสน้ำวนเฉพาะจุด
- **Retro Toy Acrylic Case:**  เชเดอร์เคสพลาสติกใสพร้อมแสงสะท้อนและฟองน้ำ
- **Target Ring Challenge:**  สะสมห่วงให้ครบทุกเสาเพื่อทำคะแนนสูงสุด

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | Left/Right Buttons (or A/D keys): กดปุ่มปั๊มฟองน้ำเพื่อดันห่วงให้ลอยขึ้นไปสวมเสา |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย Three.js / Rapier WASM 3D Physics รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน `localStorage` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
