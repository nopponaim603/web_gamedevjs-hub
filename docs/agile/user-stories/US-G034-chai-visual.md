---
title: "US-G034: Chai Visual — Interactive CS & DSA Animated Engine Porting"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-17"
owner: "Algorithm Visualizer & Frontend Engineer"
status: "Backlog / Ready"
tags:
  - agile
  - user-story
  - scraping
  - chai-visual
  - dsa
  - simulation
---
# US-G034: Chai Visual — Learn CS by Watching It Move (G034)

**Epic:** Epic 34 — Chai Visual Interactive CS & DSA Animated Engine Porting (G034)  
**Source URL:** [https://dsa.chaicode.com/](https://dsa.chaicode.com/)  
**Target Directory:** `public/games/chai-visual/`  
**Created:** 2026-09-17  
**Estimate:** XL (4 Stories)  

---

## 📖 Epic Overview

**ในฐานะ** ผู้พัฒนาเว็บการศึกษาและวิชวลซิมูเลชัน (EdTech & Interactive Simulation Developer)  
**ฉันต้องการ** สแครป ถอดรหัสโครงสร้าง และพอร์ตเอนจินจำลองภาพเคลื่อนไหวของ **Chai Visual** (`https://dsa.chaicode.com/`)  
**เพื่อให้** พอร์ตโฟลิโอ GameDevJS Hub มีมินิแอปแนว Interactive Educational Simulation ให้ผู้เล่นได้เรียนรู้และเห็นการทำงานของโครงสร้างข้อมูล อัลกอริทึม ระบบเน็ตเวิร์ก และระบบปฏิบัติการแบบเห็นการเคลื่อนไหวทีละเฟรม (Step-by-step Canvas/SVG Animation)

---

## 🎯 User Story Breakdown

### [US-G034-00] System Architecture & Visual Education Engine Spec
- **Statement:** ในฐานะ Lead Educational Software Architect ฉันต้องการจัดทำเอกสาร Spec วิเคราะห์โมเดลการเรนเดอร์ State Machine ของอัลกอริทึม, โครงสร้างข้อมูลที่เคลื่อนไหวได้ (Two Pointers, Array Blocks, Memory Nodes), การคำนวณ Time/Space Complexity แบบไดนามิก และโทนดีไซน์สมุดสเก็ตช์ (Paper/Ink Aesthetic)
- **Acceptance Criteria:**
  - [ ] จัดทำเอกสาร GDD & Tech Spec ใน `docs/gdd/games/chai-visual/spec.md`
  - [ ] ออกแบบ Step Engine: Play, Pause, Step Next, Step Prev, Speed Multiplier (0.5x - 2x)
  - [ ] วิเคราะห์ชุดข้อมูลอัลกอริทึมเด่น: Two-Pointers (Valid Palindrome, Two Sum), Sorting, Sliding Window
  - [ ] ถอดดีไซน์โทนสี Paper & Ink (`#111a17` / `#2e1615` / `#3fae72`) และขอบลายเส้นมือวาด (`sketch-border`)

### [US-G034-01] Next.js Visualizer Bundles, Paper/Ink Theme & Sketch Assets Scraping
- **Statement:** ในฐานะ Web Scraper ฉันต้องการดึง CSS Modules, SVG Icons, ฟอนต์สไตล์ Hand-drawn, มาสคอต Chai Mascot และแยก Component ตัวเรนเดอร์อัลกอริทึมออกมาเป็นเว็บแอป Standalone ใน `public/games/chai-visual/`
- **Acceptance Criteria:**
  - [ ] ดาวน์โหลด CSS stylesheets, Webpack Chunks จาก `https://dsa.chaicode.com/`
  - [ ] ดึงรูปภาพ Mascot (`/chai-mascot-dark.png`), Icon SVG และ Fonts
  - [ ] จัดโครงสร้างให้รันบนเว็บเซิร์ฟเวอร์แบบ Static HTML/JS โดยตัดระบบล็อกอิน/API ที่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอกออก
  - [ ] คงความสามารถในการสลับโหมด Dark / Light Paper Theme ตาม System Preference

### [US-G034-02] Step-by-Step Algorithm Animation Runner & Pointer Simulation
- **Statement:** ในฐานะ Animation & Algorithm Programmer ฉันต้องการพอร์ตเอนจินจำลองตัวชี้ (Pointers L/R), บล็อกอาร์เรย์ตัวเลข, กล่องอธิบายผลลัพธ์แต่ละก้าว (Explanation Banner) และการแสดงสถานะเงื่อนไขแบบเรียลไทม์
- **Acceptance Criteria:**
  - [ ] เครื่องเล่นแอนิเมชันอัลกอริทึม: มีปุ่ม เล่น (Play), หยุด (Pause), ถอยหลัง (Step Back), เดินหน้า (Step Forward)
  - [ ] การเคลื่อนไหวของ Pointer ซ้าย-ขวา (L: สีส้ม `#ff8b3d`, R: สีฟ้า `#7fa9dd`) ขยับตามดัชนีอย่างนุ่มนวล
  - [ ] แท็บเปรียบเทียบแนวทางแก้ปัญหา (Approach Leap): Brute Force vs. Two Pointers vs. Hash Map
  - [ ] กราฟแสดงจำนวนรอบการคำนวณ (Operations Meter) และมาตรวัด Big-O (Time O(n²), Space O(1))

### [US-G034-03] Interactive Complexity Matrix, Track Navigator & Hub Integration
- **Statement:** ในฐานะ UI/UX & Web Developer ฉันต้องการสร้างหน้าเลือกหัวข้อ (Track Navigator: DSA, LLD, Networks, OS), การ์ดโต้ตอบฝึกฝน และนำเข้าสู่สารบบ GameDevJS Hub
- **Acceptance Criteria:**
  - [ ] เมนูเลือกโหมดการเรียนรู้ (Tracks): DSA Visual, Low-Level Design (LLD), Networking Visual, OS Visual
  - [ ] Interactive Canvas ปรับค่า Input ของโจทย์ได้เอง (Custom Array / Target Sum)
  - [ ] Responsive UI รองรับหน้าจอมือถือและแท็บเล็ตด้วย Layout ปรับตัวอัตโนมัติ
  - [ ] บันทึกการ์ดลง `src/app/page.js` ในหมวดหมู่ "การศึกษา / ปริศนาโค้ด" และเล่นผ่าน Iframe Modal ได้อย่างไร้รอยต่อ

---

## 🛠 Technical Tasks
1. ดาวน์โหลดโครงร่างและ Bundle หลักจาก `dsa.chaicode.com`
2. สร้างเอนจินจำลองแอนิเมชันอัลกอริทึมแบบ Standalone Vanilla JS / Lightweight React
3. ออกแบบโจทย์ตัวอย่าง Two Pointers & Two Sum ให้สมบูรณ์แบบ
4. บันทึกและเชื่อมโยงกับ GameDevJS Hub
