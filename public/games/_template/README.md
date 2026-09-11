# 🎮 Standard Web Game Template

โครงสร้างแม่แบบมาตรฐาน (Starter Boilerplate) สำหรับสร้างเกมบนเว็บใน **GameDevJS Hub**

## 📁 โครงสร้างไฟล์ (File Structure)

* `index.html` — โครงสร้างหน้าเว็บ, HUD Bar, Overlays (Start, Pause, GameOver)
* `styles.css` — Design Tokens, Glassmorphism, Safe-area insets, Animations
* `config.js` — ค่าคงที่, ตั้งค่า Resolution, Key LocalStorage, Game Balance Knobs
* `audio.js` — Web Audio API Synthesizer (Click, Score, Hit, GameOver) พร้อมปุ่ม Mute
* `particles.js` — Canvas Particle System สำหรับ Visual Effects
* `entities.js` — ตัวอย่าง Entity Model (`Player`, `Enemy`, ฯลฯ)
* `game.js` — State Machine (`BOOT` $\rightarrow$ `MENU` $\rightarrow$ `PLAYING` $\rightarrow$ `PAUSED` $\rightarrow$ `GAMEOVER`), Game Loop, Touch/Keyboard controls

## 🚀 วิธีนำไปใช้สร้างเกมใหม่

1. คัดลอกโฟลเดอร์ `_template` ไปเป็นชื่อเกมใหม่ เช่น `public/games/my-awesome-game/`
2. แก้ไข `config.js` กำหนดชื่อ Key `STORAGE_KEY_HIGHSCORE` และตัวแปรของเกม
3. ปรับแต่ง Logic ใน `entities.js` และ `game.js`
4. เพิ่มรูปภาพหน้าปก `thumbnail.jpg` ขนาด 16:9
5. ลงทะเบียนเกมใน `src/app/page.js` และสร้าง GDD spec ใน `docs/gdd/games/<game-id>/spec.md`
