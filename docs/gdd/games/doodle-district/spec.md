---
title: "✏️ Doodle District 3D — Notebook Arena Shooter"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-25"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - doodle-district
  - three.js 3d engine
  - multiplayer
  - shooter
  - game-spec
---

# ✏️ Doodle District 3D — Hand-Drawn Notebook Arena Shooter

**Code Name:** `doodle-district`  
**Game ID:** `G059`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** Everyone (E)  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5 / Three.js 3D)  
**Engine & Tech Stack:** Three.js r170 / PeerJS WebRTC P2P / Canvas 3D  
**URL in Hub:** `/games/doodle-district/index.html`  
**Category:** Three.js 3D Engine / ชูตเตอร์ลายเส้นสมุดสเก็ตช์  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมยิง 3 มิติมุมมองบุคคลที่หนึ่ง/สาม ในสนามประลองกระดาษสมุดกราฟลายเส้นปากกาน้ำเงินและแดง บังคับตัวละครลายเส้นการ์ตูนสุดกวน ยิงกระสุนหมึกใส่เป้าและผู้เล่นอื่น รองรับระบบเล่นหลายคนแบบ Peer-to-Peer (WebRTC ผ่าน PeerJS) สร้างห้องดวลกับเพื่อนได้ทันทีโดยไม่ต้องผ่านเซิร์ฟเวอร์กลาง!

### 1.2 Core Pillars
1. **Hand-Drawn Graph Paper World:** สภาพแวดล้อม 3D ทั้งหมดเรนเดอร์ในสไตล์สมุดกราฟลายเส้นปากกาหมึกซึม พร้อม Shading แบบลายเส้นแฮทชิ่ง (Cross-hatching)
2. **First-Person & Third-Person Combat:** บังคับด้วยเมาส์ Pointer Lock, ยิงกระสุนหมึกที่มีวิถีโค้งและแรงตกกระทบ
3. **Serverless P2P Multiplayer:** ระบบสร้าง Room Code ด้วย PeerJS เชื่อมต่อตรงระหว่างผู้เล่นผ่าน WebRTC Datachannels
4. **Target Practice & Battle Arena:** มีโหมดเป้ายิงสำหรับฝึกซ้อมความแม่นยำเดี่ยว และสนามรบอารีนาแบบเปิด

---

## 2. Controls & Interaction Guide

| การกระทำ (Action) | คีย์บอร์ด & เมาส์ (Desktop) |
| :--- | :---: |
| **เคลื่อนที่ (Move)** | `W` / `A` / `S` / `D` |
| **หันมุมมอง (Look Around)** | เมาส์ (Mouse Aim with Pointer Lock) |
| **ยิงกระสุนหมึก (Fire)** | คลิกซ้าย (Left Click) |
| **กระโดด (Jump)** | `Space` |
| **สลับมุมมอง (1st / 3rd Person)** | `V` |
| **ออกจากล็อกเมาส์ (Unlock Mouse)** | `Esc` |

---

## 3. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
