---
title: "Epic Roadmap: Web Scraping Resources & Portfolio Expansion (G059–G061 & AIGameShare Hub)"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-18"
owner: "Dev Team / Web Scraper"
status: "Active"
tags:
  - agile
  - epic
  - roadmap
  - scraping
  - user-stories
  - ai-games
  - 3d-scenes
---
# 🌐 Epic Roadmap: Web Scraping Resources & Portfolio Expansion

เอกสารบันทึกแหล่งข้อมูลเว็บ (Scraping Target Sites), การวิเคราะห์โครงสร้างสถาปัตยกรรม (Reverse Engineering & Architectural Analysis) และแผนการดึงข้อมูล (Scraping & Porting Plan) เพื่อนำเข้าสู่ **GameDevJS Hub**

---

## 📊 ตารางเปรียบเทียบแหล่งข้อมูลเว็บสำหรับ Scraping (Target Sites Matrix)

| ID / หมวดหมู่ | ชื่อเป้าหมาย / เว็บไซต์ | แหล่งที่มา (Source URL) | เทคโนโลยี / เอนจิน | หมวดหมู่ใน Hub | ความสำคัญ / ลำดับ |
|---|---|---|---|---|:---:|
| **Portal Hub** | **AIGameShare** | [aigameshare.com](https://www.aigameshare.com/) | Next.js / Cloudflare / Web Audio / REST API | แหล่งคลังเกม AI รวม (Meta Hub) | 🔥 P0 (Mega Source) |
| **G059** | **Warlock** | [warlock-zone.fly.dev](https://warlock-zone.fly.dev/) | 3D/Top-Down Canvas / WebGL / WebSockets | แบทเทิลอารีนา / พ่อมดเกาะลาวา | ⚡ P1 |
| **G060** | **Louvre · Miniature World** | [3dscenes.qualityf2p.workers.dev/paris](https://3dscenes.qualityf2p.workers.dev/paris) | 3D WebGL / Diorama / Tilt-Shift Shader | ซิมูเลชัน 3D / สถาปัตยกรรมและเมือง | ⚡ P1 |
| **G061** | **Original Transformer vs DeepSeek** | [transformer-architecture.petergostev.chatgpt.site](https://transformer-architecture.petergostev.chatgpt.site/) | Three.js ESM / 3D Canvas / Spatial UI | การศึกษา / ซิมูเลชัน 3D AI Architecture | ⚡ P1 |

---

## 🔍 รายละเอียดเชิงลึกของแต่ละแหล่งข้อมูล (In-Depth Technical Specifications)

---

### 🌟 1. AIGameShare: Share & Play AI Generated Browser Games (Mega Hub Source)
- **Source URL:** [https://www.aigameshare.com/](https://www.aigameshare.com/)
- **ลักษณะเด่น:** แพลตฟอร์มพอร์ทัลรวมเกม Web Games / HTML5 ที่สร้างด้วย Generative AI ระดับชั้นนำระดับโลก เป็นแหล่งค้นพบเกมคุณภาพสูงแบบ Zero-Download และเล่นได้ทันทีทั้งบน Desktop และ Mobile
- **รายการเกมเด่นในคลังที่พร้อมนำเข้าคิว Scrape ลำดับถัดไป:**
  1. 🌊 **Tidewell** (`/games/tidewell`): 3D Cozy Aquarium Simulation เพาะพันธุ์ปลาและสิ่งมีชีวิตใต้ทะเล ระบบ Cloud-Saved และ Ambient View
  2. ⛏️ **DEEPER** (`/games/deeper`): 2D Mining Physics Simulation ขุดเจาะหินลึก 600 เมตร บริหารแรงดันน้ำ อากาศ และแร่มีค่า
  3. 🪶 **Bullet Hell: Sunspindle** (`/games/bullet-hell-sunspindle`): Aerial Bullet Hell ขี่นกนางแอ่นกลดูดซับกระสุนพลังงานแสงอาทิตย์
  4. 🤖 **Glow Squad** (`/games/glow-squad`): Cartoon Auto-survivor Roguelite
  5. 🚀 **SPCX: To the Moon** (`/games/spcx-to-the-moon`): IPO-day Arcade Stock Market Climber
  6. 💖 **SMITTEN** (`/games/smitten`): Retro 90s Stat-raising Dating Sim (19 Endings)
- **Scraping Strategy:**
  - เข้าถึงผ่าน REST API Schema `/api/games/[slug]/` และดึง Asset Bundle จาก CDN
  - วิเคราะห์ iframe sandbox URL และถอด dependency ของแต่ละเกมมาบรรจุลง `public/games/<slug>/`

---

### 🌋 2. Warlock (G059)
- **Source URL:** [https://warlock-zone.fly.dev/](https://warlock-zone.fly.dev/)
- **คำโปรย:** *"An arena of fire, a battle of wits. Eight wizards. One small island. Play Warlock in your browser."*
- **รูปแบบเกม:**
  - เกมแนว Action Spell Brawler / Lava Arena ที่ได้รับแรงบันดาลใจจากม็อดระดับตำนาน Warlock ของ Warcraft III
  - พ่อมด 8 คนประจันหน้ากันบนเกาะลาวาขนาดเล็กที่ขอบเกาะค่อยๆ หดตัว
  - สกิลยิงพลังผลัก (Knockback), สร้างกำแพงไฟ, ดูดดึงคู่ต่อสู้, วาร์ป และคอมโบคู่ต่อสู้ให้กระเด็นตกลาวา
- **เทคโนโลยี & สถาปัตยกรรม:**
  - Canvas 2D / 3D Isometric View
  - Vector Physics & Momentum Impulse (แรงกระแทกจากพลังเวท)
  - รองรับ Multiplayer หรือ Singleplayer Bot Practice Mode
- **แผนงานพอร์ต (Porting Plan):**
  - ดึง HTML, JS client bundle, Sound effects และ Particle FX ลง `public/games/warlock/`
  - ทำ Standalone Offline Mode กับ AI Bots ให้เล่นได้ทันทีผ่าน GameDevJS Hub Modal

---

### 🏛️ 3. Louvre · A world in miniature (G060)
- **Source URL:** [https://3dscenes.qualityf2p.workers.dev/paris](https://3dscenes.qualityf2p.workers.dev/paris)
- **คำโปรย:** *"Explore one square kilometre around the Louvre in a living 3D miniature. Orbit, tilt, and follow the light from dawn to night."*
- **รูปแบบระบบ:**
  - 3D Miniature Architectural Diorama จำลองพื้นที่ 1 ตารางกิโลเมตรรอบพิพิธภัณฑ์ลูฟร์ในกรุงปารีส
  - มุมกล้องแบบ Orbit / Tilt พร้อม Tilt-Shift Depth of Field ให้ความรู้สึกเหมือนกำลังมองดูเมืองโมเดลจำลองของเล่น
  - ระบบเวลากลางวัน-กลางคืนแบบเรียลไทม์ (Dawn, Noon, Dusk, Night) แสงเงาทอดตัวตามองศาของดวงอาทิตย์
- **เทคโนโลยี & สถาปัตยกรรม:**
  - WebGL / Three.js หรือ Custom 3D Shader Engine
  - โมเดล Low-poly / Baked Lighting Optimized สำหรับเบราว์เซอร์
  - Touch & Mouse Navigation Controls
- **แผนงานพอร์ต (Porting Plan):**
  - ดึง 3D Geometry chunks, Shaders, กล้อง, แสง และ UI Controls ลง `public/games/louvre-miniature/`
  - ปรับปรุงให้เปิดเล่นเป็น Interactive 3D Showcase ใน Hub ได้ลื่นไหล 60 FPS

---

### 🧠 4. Original Transformer vs DeepSeek (G061)
- **Source URL:** [https://transformer-architecture.petergostev.chatgpt.site/](https://transformer-architecture.petergostev.chatgpt.site/)
- **คำโปรย:** *"Explore the original Transformer and DeepSeek V4.1 Flash, or take a one-minute visual tour of what changed."*
- **รูปแบบระบบ:**
  - Interactive 3D Spatial Architecture Visualizer เปรียบเทียบโครงสร้างโมเดล AI ยุคบุกเบิก (Original Transformer 2017: 6 encoder + 6 decoder) กับโมเดลยุคใหม่ (DeepSeek V4.1 Flash 2026: 20 encoder + 20 decoder)
  - โหมด **Story Mode (1 min)**: ทัวร์มีไกด์นำชมทีละขั้นตอนพร้อมเสียง/คำบรรยาย
  - **Token Flow Simulation**: จำลองการไหลของข้อมูลโทเคนผ่าน Attention Layers
  - ตัวปรับ **Context Slider** (4K ถึง 128K tokens) และตัวปรับความเร็วแอนิเมชัน (0.4x, 1x, 2x)
- **เทคโนโลยี & สถาปัตยกรรม:**
  - Three.js ES Modules (`./vendor/build/three.module.js`, `./vendor/examples/jsm/`)
  - WebGL 3D Canvas พร้อม 2D Overlay Labels & Chapter Navigation
  - Zero External Dependencies (สามารถรันแบบ Local Standalone ได้ 100%)
- **แผนงานพอร์ต (Porting Plan):**
  - ดึง `index.html`, `style.css`, `app.js`, และ Three.js Vendor Files มาไว้ที่ `public/games/transformer-deepseek/`
  - บันทึกลงหมวดหมู่ "การศึกษา / ซิมูเลชัน 3D AI Architecture" ใน Hub

---

## 🎯 แผนงาน Scraping และ Ingestion Pipeline

1. **Phase 1: Registry & Target Documentation** (✅ เสร็จสิ้น)
   - บันทึกรายการลง Epic Roadmap และ Product Backlog
2. **Phase 2: Automated Scraper Preparation**
   - เขียนสคริปต์ตรวจจับและดึง Assets ลงโฟลเดอร์ `scratch/scrape_batch_resources.js`
   - ทดสอบการดึง Network Assets และ Vendor Bundles
3. **Phase 3: Sandbox & Standalone Adaptation**
   - ปรับแต่งเส้นทาง Local Paths ให้เป็น Relative/Local ทั้งหมด
   - รองรับการเปิดบน iFrame Modal ของ Next.js GameDevJS Hub
4. **Phase 4: GameDevJS Hub Catalog Listing**
   - เพิ่มรายการการ์ดเกมลง `src/app/page.js` พร้อม Badge, หมวดหมู่ และ Gradient ประจำตัว
