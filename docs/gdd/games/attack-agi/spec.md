---
title: "⚡ Attack AGI — 3D Cyber Horde Shooter"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - attack-agi
  - three.js 3d engine
  - game-spec
---

# ⚡ Attack AGI — 3D Cyber Horde Shooter

**Code Name:** `attack-agi`  
**Game ID:** `G033`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** Three.js / Procedural Cyber Grid  
**URL in Hub:** `/games/attack-agi/index.html`  
**Category:** Three.js 3D Engine / แอ็กชันเซอร์ไววัล  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมยิงฝูงหุ่นยนต์ AI และบ็อตไวรัสในโลกไซเบอร์สเปซ 3 มิติ สไตล์ Vampire Survivors x Tron ที่ผู้เล่นต้องเอาชีวิตรอดจากคลื่น AGI ดิจิทัล

### 1.2 Core Features
- **Massive Horde Performance:**  เรนเดอร์ศัตรู AI นับพันตัวพร้อมกันได้อย่างลื่นไหล
- **Cyber Upgrade Tree:**  อัปเกรดอาวุธเลเซอร์, ไฟร์วอลล์ระเบิด, และโดรนซับพอร์ต
- **Neon Grid Aesthetics:**  งานภาพสไตล์ Synthwave นีออนพร้อมเพลงอิเล็กทรอนิกส์เร้าใจ
- **Boss AGI Encounters:**  เผชิญหน้ากับบอส Superintelligent Neural Core

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | WASD: เคลื่อนที่ | Mouse: เล็งทิศทางโจมตี (Auto-fire / Manual Trigger) | Space: Dash |

---

## 3. Technical Architecture & Modular Layout

เกมได้รับการ Refactor สู่สถาปัตยกรรมแบบ **Clean Vanilla Three.js + Modular ES6** โดยปราศจาก React/Turbopack chunk bundle:

```text
public/games/attack-agi/
├── index.html              # Entry Point (HUD, Overlays, Three.js canvas)
├── styles.css              # Cyberpunk HUD, Health bar, Ammo counter, Touch buttons
├── thumbnail.jpg
└── js/
    ├── config.js           # Weapon stats, Wave configs, Arena bounds
    ├── audio.js            # Web Audio API Synthesizer (Lasers, Explosions, Reload, Sirens)
    ├── particles.js        # 3D Particle system (Sparks, Fire zones, Bullet tracers)
    ├── world.js            # Three.js 3D Arena, Neon pillars, Grid floor, Dynamic lighting
    ├── weapons.js          # Pulse Rifle, Scatter Shotgun, Molotov EMP fireball viewmodels & recoil
    ├── enemies.js          # AI Horde System (Drones, Cyber Hounds, Heavy Mechs, Core Sentinel Boss)
    ├── player.js           # FPS Camera, WASD, Pointer Lock, Jump, Dodge Dash, Mobile Touch
    └── game.js             # Core Game Loop, State Machine (MENU -> PLAYING -> GAMEOVER)
```

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
