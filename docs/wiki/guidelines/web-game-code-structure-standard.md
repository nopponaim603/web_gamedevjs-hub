---
title: "🏗️ มาตรฐานการจัดวาง Source Code และสถาปัตยกรรมเกมบนเว็บ (Web Game Code Structure Standard)"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Web Game Architecture & Core Tech Team"
status: "Approved"
tags:
  - wiki
  - guidelines
  - architecture
  - standards
---

# 🏗️ มาตรฐานการจัดวาง Source Code และสถาปัตยกรรมเกมบนเว็บ (Web Game Code Structure Standard)

---

## 1. วัตถุประสงค์ (Purpose & Principles)

เพื่อยกระดับคุณภาพโค้ด การบำรุงรักษา (Maintainability) และการขยายขีดความสามารถ (Scalability) ของเกมทั้งหมดใน **GameDevJS Hub (`public/games/`)** เอกสารนี้กำหนดมาตรฐานการจัดวางไฟล์ (File Structure), การแบ่งขอบเขตความรับผิดชอบ (Separation of Concerns), และแบบแผนการเขียนโค้ด (Coding Conventions) ให้เป็นหนึ่งเดียวกันทุกเกม

### หลักการสำคัญ (Core Architectural Principles):
1. **Zero Monolithic Files:** ห้ามรวมโค้ด HTML, CSS, Config, Audio, Entity และ Game Loop ไว้ในไฟล์เดียวยาวหลายร้อยบรรทัด
2. **Clear Separation of Concerns:** แยก Logic แต่ละด้านออกจากกันชัดเจน (Presentation, Sound, VFX, State, Control)
3. **Vanilla-First & Framework Agnostic:** รองรับทั้ง Vanilla JS (Canvas 2D / DOM), Phaser 3, และ Babylon.js โดยใช้แบบแผนโครงสร้างเดียวกัน
4. **Resilience & Zero Crashes:** มีการจัดการ Error Handling, AudioContext Suspension/Resume, และ Fallback เมื่อโหลด Asset ไม่สำเร็จ
5. **Universal Hub Integration:** ทุกเกมต้องมีระบบปุ่มย้อนกลับ (Back to Hub), บันทึกสถิติ (LocalStorage), และรองรับทั้ง Mobile Touch + Desktop Keyboard

---

## 2. โครงสร้างโฟลเดอร์มาตรฐาน (Standard Directory & File Layout)

ทุกเกมภายใต้ `public/games/<game-id>/` จัดวางไฟล์ตามโครงสร้างมาตรฐาน (โดยมี `k8sgames` เป็น Reference Architecture) ดังนี้:

### 2.1 Standard Layout (สำหรับเกม 2D / 3D ทั่วไป):
```text
public/games/<game-id>/
├── index.html          # HTML Entry Point (Container, Viewport, HUD & Overlays)
├── styles.css          # CSS Layout, Glassmorphic HUD, Animations, Themes
├── thumbnail.jpg       # ภาพตัวอย่างเกมขนาด 16:9 สำหรับหน้า Hub
└── js/                 # โฟลเดอร์รวมโมดูล JavaScript
    ├── config.js       # ค่าคงที่, ตั้งค่าระดับความยาก, พาเลทสี, LocalStorage Keys
    ├── audio.js        # Web Audio API Engine / Sound Manager / SFX Synthesizer
    ├── particles.js    # ระบบ Particle Effects / Visual FX / Confetti (ถ้ามี)
    ├── entities.js     # Domain Models, Game Objects, Card/Player Classes
    └── game.js         # Core Controller, Game Loop, Event Listeners, State Machine
```

### 2.2 Advanced Submodule Layout (สำหรับเกมขนาดใหญ่ เช่น `k8sgames`):
```text
public/games/k8sgames/
├── index.html
├── style.css
├── thumbnail.png
└── js/
    ├── data/           # Config, Constants, Scenarios, Datasets
    ├── engine/         # State Machines, Incident Engines, Simulation Ticks
    ├── rendering/      # 3D / WebGL / Canvas Renderers
    ├── resources/      # Asset Loaders, Audio Managers, Haptics
    └── ui/             # HUD Controllers, Modals, Terminal Panels
```

---

## 3. รายละเอียดหน้าที่ของแต่ละไฟล์ (Module Breakdown)

### 3.1 `index.html` — โครงสร้างหน้าจอและลำดับการโหลดสคริปต์
* **Viewport & Meta:** ต้องตั้งค่า `viewport-fit=cover`, `user-scalable=no`
* **Semantic Containers:**
  * `#app` / `#game-container`: พื้นที่ Canvas สำหรับเรนเดอร์เกม
  * `#hud`: แถบแสดงคะแนน (Score), เวลา (Timer), พลังชีวิต (Health/Lives), และปุ่ม Pause
  * `#overlays`: ป๊อปอัปแจ้งเตือน (Start Screen, Victory Modal, Game Over Modal)
* **Script Load Order:** ต้องโหลด Config และ Engine ย่อยก่อน Controller หลักเสมอ:
  ```html
  <script src="js/config.js"></script>
  <script src="js/audio.js"></script>
  <script src="js/particles.js"></script>
  <script src="js/entities.js"></script>
  <script src="js/game.js"></script>
  ```

---

### 3.2 `styles.css` — การจัดการสไตล์และ Design Tokens
* ใช้ **CSS Custom Properties (Variables)** ในการกำหนดธีมและสเกล
* รองรับ **Safe Area Insets** บนมือถือ (`env(safe-area-inset-top)`)
* ควบคุมการ Render Canvas ให้อยู่กึ่งกลางหน้าจอ ไม่แตกเบลอ (`image-rendering: pixelated` สำหรับ Pixel Art)
* มาตรฐาน UI ประกอบด้วย:
  * Glassmorphism Card Style (`backdrop-filter: blur(12px)`)
  * Modern Typography (Outfit, Inter, Chakra Petch)
  * Smooth Hover & Active Transitions (`cubic-bezier(0.4, 0, 0.2, 1)`)

---

### 3.3 `config.js` — แหล่งข้อมูลและค่าปรับแต่งตัวแปร (Single Source of Truth)
* รวบรวมข้อมูลคงที่ทั้งหมด ห้าม Hardcode ตัวเลข/ข้อความลอยๆ ไว้ใน Logic
* ป้องกัน Namespace ชนกันด้วยการผูกเข้ากับ `window.<GAME_NAME>_CONFIG` หรือ Export Object ชัดเจน
* ตัวอย่างโครงสร้าง:
  ```javascript
  window.GameConfig = {
      BASE_WIDTH: 540,
      BASE_HEIGHT: 960,
      STORAGE_KEY: 'game-id-highscore',
      DIFFICULTY: {
          EASY: { speed: 3, spawnRate: 1500 },
          HARD: { speed: 6, spawnRate: 800 }
      },
      COLORS: {
          PRIMARY: '#6366f1',
          SECONDARY: '#ec4899',
          BACKGROUND: '#0f172a'
      }
  };
  ```

---

### 3.4 `audio.js` — การจัดการระบบเสียง (Audio & Haptics Engine)
* ใช้ **Web Audio API** ในการสังเคราะห์เสียง (Synthesized SFX) หรือโหลดไฟล์ Audio
* ต้องรองรับ **User Interaction Autoplay Policy** (ปลดล็อค AudioContext เมื่อคลิกครั้งแรก)
* มีระบบ **Mute / Unmute Toggle** และบันทึกสถานะลง `localStorage`
* ตัวอย่าง Class มาตรฐาน:
  ```javascript
  class AudioManager {
      constructor() {
          this.ctx = null;
          this.muted = localStorage.getItem('game-audio-muted') === 'true';
      }
      init() {
          if (!this.ctx) {
              const AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (AudioContextClass) this.ctx = new AudioContextClass();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
              this.ctx.resume();
          }
      }
      playSfx(type) {
          if (this.muted) return;
          this.init();
          // Synthesis oscillators or buffer playback...
      }
      toggleMute() {
          this.muted = !this.muted;
          localStorage.setItem('game-audio-muted', this.muted);
          return this.muted;
      }
  }
  window.audioManager = new AudioManager();
  ```

---

### 3.5 `particles.js` — วิชวลเอฟเฟกต์ (VFX & Polish)
* ระบบอนุภาคแยกส่วน ป้องกันไม่ให้โค้ดการวาดเอฟเฟกต์ไปปะปนกับ Game Loop
* รองรับเอฟเฟกต์ยอดนิยม:
  * `emitSparks(x, y, color, count)`: ประกายไฟเมื่อชน/ยิงโดน
  * `emitConfetti()`: พลุกระดาษเมื่อชนะเกมหรือทำ New Highscore
  * `emitFloatingText(text, x, y, color)`: ข้อความลอยคะแนน `+100`, `COMBO! x2`

---

### 3.6 `entities.js` — โมเดลตัวละครและออบเจกต์ในเกม
* นิยาม Class ของ Entity เช่น `Player`, `Enemy`, `Card`, `Bullet`, `Tile`
* แต่ละ Class มีหน้าที่รับผิดชอบตนเอง:
  * `update(dt)`: ปรับปรุงตำแหน่ง, ฟิสิกส์, Cooldown
  * `render(ctx)` หรือจัดการ DOM Element ของตนเอง
  * `takeDamage(amount)`, `destroy()`

---

### 3.7 `game.js` — ตัวควบคุมหลักและ State Machine
* ควบคุมการทำงานของ **State Machine**:
  * `BOOT` $\rightarrow$ `MENU` $\rightarrow$ `PLAYING` $\rightarrow$ `PAUSED` $\rightarrow$ `GAMEOVER` $\rightarrow$ `VICTORY`
* ควบคุม RequestAnimationFrame (สำหรับ Canvas 2D) หรือ Scene Lifecycle (สำหรับ Phaser/Babylon)
* รองรับ Input Handling (Touch, Mouse, Keyboard Arrow/WASD)
* จัดการระบบบันทึกคะแนนสูงสุดและปุ่มย้อนกลับ:
  ```javascript
  function returnToHub() {
      window.parent.postMessage('backToMenu', '*');
      if (window === window.top) {
          window.location.href = '../index.html';
      }
  }
  ```

---

## 4. มาตรฐานการควบคุมและ UX ข้ามแพลตฟอร์ม (Cross-Platform Controls)

| อุปกรณ์ | การควบคุมหลัก (Primary Controls) | การควบคุมรอง (Secondary / Fallback) |
| :--- | :--- | :--- |
| 📱 **Mobile / Tablet** | Touch Gestures, Virtual Buttons, Drag & Swipe | Gyroscope / Tilt (ถ้าจำเป็น) |
| 💻 **PC / Desktop** | Keyboard (`Arrow Keys`, `WASD`, `Space`, `Enter`, `Esc`) | Mouse Click / Pointer Drag |

* ทุกเกมต้องสามารถเล่นได้ทั้งแบบ **สัมผัส (Touch)** และ **คีย์บอร์ด (Keyboard)** โดยไม่มีอาการปุ่มค้าง

---

## 5. Checklist ตรวจสอบความถูกต้องก่อน Release (Definition of Done)

- [ ] **1. File Structure:** แยกไฟล์ `index.html`, `styles.css`, `config.js`, `audio.js`, `game.js` ถูกต้อง
- [ ] **2. Responsive Viewport:** ทดสอบการแสดงผลบนขนาดหน้าจอ `360x640` (Mobile) และ `1920x1080` (PC) ไม่ล้นหรือตกขอบ
- [ ] **3. Audio Policy:** เสียงไม่เล่นก่อนผู้ใช้มี Action และมีปุ่มเปิด/ปิดเสียง (Sound Toggle)
- [ ] **4. Navigation:** ปุ่ม Back to Hub ใช้งานได้ทั้งใน iFrame และ Standalone tab
- [ ] **5. Highscore Persistence:** เก็บคะแนนสูงสุดใน `localStorage` ถูกต้อง ไม่ Reset เมื่อ Refresh
- [ ] **6. Performance:** รันได้ 60 FPS นิ่งบนอุปกรณ์ทั่วไป ปราศจาก Memory Leaks ใน Particle & Animation Loops
- [ ] **7. Build Check:** คำสั่ง `npm run build` รันผ่านสมบูรณ์โดยไม่มี Syntax หรือ Module Errors
