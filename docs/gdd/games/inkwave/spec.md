---
title: "🦑 INKWAVE: Turf Riot — 4v4 Ink Shooter 3D"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-25"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - inkwave
  - three.js 3d engine
  - shooter
  - turf-war
  - game-spec
---

# 🦑 INKWAVE: Turf Riot — 4v4 Turf-War Ink Shooter

**Code Name:** `inkwave`  
**Game ID:** `G056`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** Everyone (E)  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5 / WebGL)  
**Engine & Tech Stack:** Three.js / Custom Paint Canvas Shader / Procedural Web Audio API  
**URL in Hub:** `/games/inkwave/index.html`  
**Category:** Three.js 3D Engine / ชูตเตอร์ชิงพื้นที่ (Turf-War)  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
เกมชูตเตอร์ 3D ชิงพื้นที่แบบ 4 ต่อ 4 ได้แรงบันดาลใจจาก *Splatoon* บนเบราว์เซอร์ ยิงหมึกย้อมสีลานพลาซ่า ดำน้ำแปลงร่างเป็นหมึกเพื่อว่ายน้ำด้วยความเร็วสูง เติมน้ำหมึก และปีนกำแพงสาดสีเพื่อเอาชนะทีมตรงข้าม!

### 1.2 Core Pillars
1. **Turf Is Everything:** ชัยชนะวัดจากเปอร์เซ็นต์พื้นที่ที่ทีมระบายสีได้มากที่สุดเมื่อหมดเวลา (Turf War)
2. **Kid & Squid Dual-Form:** โหมดร่างคนใช้ยิงปืนและกลิ้งลูกกลิ้ง / โหมดร่างหมึก (กดคลิกขวา หรือ Shift) ดำลงในหมึกทีมตัวเองเพื่อพุ่งตัวเร็ว รีฟิลหมึก และปีนกำแพง
3. **Smart Bots & 4v4 Match Flow:** ระบบบอท AI อัจฉริยะ 7 ตัวร่วมสู้ มี NavGraph, การตัดสินใจลาดตระเวน, ชิงพื้นที่, และสวนกลับ
4. **Rich Weapon Arsenal:** ปืนสเปรย์ (Spritzer), ลูกกลิ้งยักษ์ (Swell Roller), สไนเปอร์ชาร์จ (Glint Charger), และปืนระเบิด (Popper Blaster) พร้อมอาวุธเสริม (Splat Bomb) และท่าไม้ตายพิเศษ (Tidal Slam, Ink Tempest)
5. **Zero External Assets:** เสียงสังเคราะห์ด้วย Web Audio API 100%, Texture และ Murals สร้างแบบ Procedural

---

## 2. Weapon & Gear Arsenal

| อาวุธ (Weapon) | สไตล์การเล่น (Style) | ความแรง (Damage) | ระยะยิง (Range) | ท่าพิเศษ (Special) |
| :--- | :--- | :---: | :---: | :--- |
| **Spritzer (Shooter)** | ปืนกลสมดุล ยิงกระสุนหมึกถี่ต่อเนื่อง | ปานกลาง | ปานกลาง | **Tidal Slam** (กระโดดกระแทกคลื่นหมึก) |
| **Swell Roller (Roller)** | กลิ้งระบายสีเป็นแถบกว้าง ฟาดหมึกกระจาย | สูงมากระยะประชิด | สั้น | **Tidal Slam** |
| **Glint Charger (Charger)** | ชาร์จแล้วยิงเส้นหมึกทะลวงระยะไกล | สูงมาก (1 Hit Splat) | ไกลมาก | **Ink Tempest** (เมฆฝนหมึกโปรยปราย) |
| **Popper Blaster (Blaster)** | ยิงกระสุนหมึกระเบิดกลางอากาศ | สูง (Direct Hit ล้มทันที) | ปานกลาง | **Ink Tempest** |

---

## 3. Controls & Interaction Guide

| การกระทำ (Action) | คีย์บอร์ด & เมาส์ (PC) | จอยเกม (Gamepad) |
| :--- | :---: | :---: |
| **เคลื่อนที่ (Move)** | `W` / `A` / `S` / `D` | Left Stick |
| **หันมุมกล้อง (Aim / Look)** | เมาส์ (Mouse Move) | Right Stick |
| **ยิง / โจมตี (Fire / Paint)** | คลิกซ้าย (Left Click) | Right Trigger (RT) |
| **ดำน้ำเป็นหมึก (Squid Form)** | คลิกขวา (Right Click) หรือ `Shift` | Left Trigger (LT) |
| **กระโดด (Jump)** | `Space` | `A` / `✕` |
| **ปาระเบิดเสริม (Sub Weapon)** | `E` หรือ `Q` | Right Bumper (RB) |
| **ท่าไม้ตาย (Special Attack)** | `F` (เมื่อเกจเต็ม) | Right Stick Click (R3) |

---

## 4. Technical Architecture

1. **GPU Surface Paint System:** ฉีดหมึกกระทบพื้นผิวและบันทึกลงใน Dynamic Texture Atlas แบบเรียลไทม์ พร้อมคำนวณพื้นที่ Turf % อัตโนมัติ
2. **Lightmap AO & Material Pipeline:** รองรับ Ambient Occlusion Lightmap ที่อบมาล่วงหน้าสำหรับ Tidewater Plaza และ Kelpline Terminal
3. **Fluid Character Controller:** ระบบควบคุมที่ลื่นไหล รองรับการไถลบอร์ด, เด้งเกาะขอบเสา (Ledge Assist), การไต่กำแพงหมึก (Wall Climb)
4. **Procedural Audio Synthesis:** สังเคราะห์เสียงยิง, เสียงพุ่งในน้ำหมึก, เสียงฟองสบู่แตก, และดนตรีแนวซังฟังก์สดใหม่

---

## 5. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
