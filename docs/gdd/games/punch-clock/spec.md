---
title: "🥊 PUNCH CLOCK — Corporate Boxing 3D Simulator"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-25"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - punch-clock
  - three.js 3d engine
  - boxing
  - game-spec
---

# 🥊 PUNCH CLOCK — A Corporate Boxing Simulator

**Code Name:** `punch-clock`  
**Game ID:** `G055`  
**Version:** `1.0.0` (Production Release)  
**Age Rating:** Teen (Corporate Comedy / Cartoon Violence)  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5 / WebGL)  
**Engine & Tech Stack:** Three.js / ES Modules / Procedural Web Audio API  
**URL in Hub:** `/games/punch-clock/index.html`  
**Category:** Three.js 3D Engine / แอ็กชันอาเขต  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
คุณถูกปลดออกจากงานกะดึก แต่ HR บอกว่ายังมีตำแหน่งว่างเหลืออยู่ตำแหน่งเดียวบนดาดฟ้าตึกเพนต์เฮาส์! ถึงเวลาชกต่อยไต่เต้าบันไดองค์กรจากห้องจดหมายชั้นใต้ดิน ผ่านฝ่ายทรัพยากรบุคคล รองประธาน จนถึงซีอีโอ ในสไตล์ *Punch-Out!!* ผสมกลิ่นอายคอเมดี้สุดแสบแบบ *Devolver Digital*

### 1.2 Core Pillars
1. **Read, Dodge, Punish:** บอสทุกตัวมีท่าบอกก่อนต่อย (Tell) พร้อมแสงเรืองที่นวม หลบให้ถูกทิศทางแล้วสวนกลับ
2. **Juice on Every Input:** ระบบ Hit-stop, Screen shake, Camera kick, Chromatic flash และอนุภาคกระจาย
3. **Instant Retry:** กด `R` เพื่อ Reapply สมัครงานชกใหม่ทันทีแบบ Hotline Miami
4. **Daily Shift Mode:** โหมดตะลุย 6 ชั้นรวด มี Modifiers และ Perks สับเปลี่ยนทุกวัน
5. **Procedural Performance:** ตัวละครสร้างจาก Primitives & Lathe profiles ขับเคลื่อนด้วย IK และเสียงสังเคราะห์ผ่าน Web Audio API 100%

---

## 2. Boss Roster (The Corporate Ladder)

| ชั้น (Floor) | คู่ต่อสู้ (Opponent) | ลูกเล่นพิเศษ (Gimmick) | หลอดล้ม (KDs) |
| :---: | :--- | :--- | :---: |
| **B1** | Kyle, Unpaid Intern | สอนเล่นเบื้องต้น, โยนแก้วกาแฟ, แอบเช็กมือถือ (เปิดช่องโดนสวน) | 1 |
| **3** | Brenda from HR | หมัดแย็บคู่, ชุดหมัด Performance Review, ปากระดาษเตือน | 2 |
| **12** | Chad, VP of Synergy | เบ่งกล้าม, หมัดอัปเปอร์คัต, หมัดหมุนหลังมือ PIVOT | 2 |
| **27** | Derek, Consultant ($900/hr) | หลอกล่อ, คอมโบรวดเร็ว, คิดค่าบริการทุกครั้งที่โดนต่อย | 2 |
| **44** | Margaret, Chairwoman (94) | แอบงีบหลับกลางเวที (ต่อยฟรีแต่ตื่นมาโกรธจัด), ฟันปลอมบิน | 3 |
| **60** | Roland Vantablack III, CEO | นวมทองคำ, สั่ง Layoffs (ไฟดับทั้งเวที), Hostile Takeover | 3 |

---

## 3. Controls & Interaction Guide

| การกระทำ (Action) | คีย์บอร์ด (Keyboard) | เมาส์ (Mouse) | ทัชสกรีน (Touch) | จอยเกม (Gamepad) |
| :--- | :---: | :---: | :---: | :---: |
| **Left Jab** | `J` หรือ `Z` | คลิกซ้าย | แตะฝั่งซ้าย | `X` / `□` |
| **Right Cross** | `K` หรือ `X` | คลิกขวา | แตะฝั่งขวา | `B` / `○` |
| **Dodge Left/Right** | `A` / `D` หรือ `←` / `→` | — | ปัดซ้าย / ขวา | Analog Stick |
| **Duck (ก้มหลบ)** | `S` หรือ `↓` | — | ปัดลง | Stick Down |
| **Haymaker (หมัดหนัก)** | `Space` | คลิกกลาง | ปัดขึ้น | `Y` / `△` |
| **Retry** | `R` | — | เมนู Pause | Select |

---

## 4. Technical Architecture

1. **Custom Post-Processing Grade Pass:** รวม MSAA Target, UnrealBloomPass, FXAA และ Single Screen Grade Shader
2. **Procedural IK & Spring Bones:** เนคไท, ผม และพุงกระเพื่อมตามฟิสิกส์สปริง
3. **Canvas 2D Clip Recorder:** อัดรีเพลย์ช่วง K.O. 4–8 วินาทีด้วย MediaRecorder ส่งออกเป็นวิดีโอคลิปหรือการ์ดสรุปผล
4. **Pure Web Audio:** สังเคราะห์เสียงกลอง, เบส, หมัด และเสียงเชียร์สด ไม่ต้องโหลดไฟล์ MP3 ภายนอก

---

## 5. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
