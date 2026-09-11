const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '..', 'docs', 'gdd', 'games');

const missingGameSpecs = {
  'mogura-tatakanai': {
    code: 'G053',
    title: '🐾 Mogura Tatakanai — モグラ叩かない (Pet the Mole 3D)',
    category: 'Three.js 3D Engine / Arcade',
    engine: 'Three.js r128 / Web Audio API',
    description: 'เกม 3D Arcade สุดน่ารักที่ฉีกกฎเกมตีตัวตุ่น (Whack-a-Mole) แบบดั้งเดิม โดยเปลี่ยนจากการทุบตีเป็นการลูบหัวตัวตุ่นอย่างอ่อนโยน (Petting / Stroking) เพื่อสะสมคะแนน พร้อมตัวตุ่นหลากสายพันธุ์ เอฟเฟกต์อนุภาค 3D และดนตรีประกอบสุดไพเราะ',
    controls: 'Desktop: คลิกซ้ายค้างแล้วลากเมาส์ลูบหัวตัวตุ่น | Mobile: แตะและลากนิ้วผ่านหัวตัวตุ่น (Stroke / Pet)',
    features: [
      'Procedural 3D Moles: ตุ่น 4 สายพันธุ์ (Normal, Gold, Black, White) แต่ละชนิดให้คะแนนและเสียงตอบสนองต่างกัน',
      'Stroke Detection: ตรวจจับการลูบสัมผัสด้วย Raycaster 3D พร้อมอนิเมชันมือเรืองแสง',
      'Dynamic Procedural Textures: หญ้าและดินสร้างแบบ Procedural Canvas 2D สดใหม่ทุกการรัน',
      'Integrated High Score: บันทึก Top 5 คะแนนลงใน LocalStorage พร้อมเอฟเฟกต์ Count-up',
      'Web Audio Synth & Dual BGM: ระบบเสียง Sound Effects สังเคราะห์ด้วย Web Audio API พร้อมเพลงประกอบ BGM ในตัว'
    ]
  },
  'overprint-404': {
    code: 'G051',
    title: '🎯 404 OVERPRINT — Tactical Shooter & Typography Arcade',
    category: 'ปริศนา / อาเขต 2D',
    engine: 'Vanilla JS / Canvas 2D / WebGL',
    description: 'เกมยิงปืนทางยุทธวิธีแนว Typography ในธีมหน้าจอ Error 404 ที่ผู้เล่นต้องควบคุมการเล็ง ยิงเป้าหมาย และบริหารจัดการกระสุนในสไตล์ Brutalist Typography Design',
    controls: 'Mouse: เล็งและคลิกซ้ายเพื่อยิง | Space / R: รีโหลดกระสุน | Esc: เมนู',
    features: [
      'Brutalist Typography Art: การออกแบบภาพกราฟิกด้วยตัวอักษรและ Contrast สูง สไตล์ Iskra Graphics',
      'Precision Recoil & Ballistics: ฟิสิกส์การเล็งและการดีดของกระสุนที่สมจริง',
      'Tactical Wave Defense: ศัตรูโผล่ตามจุดบอดของหน้าจอพร้อมระบบคะแนนคอมโบ',
      'Juicy Sound FX: เสียงลั่นไกและปลอกกระสุนแบบไดนามิก'
    ]
  },
  'pong-wars': {
    code: 'G034',
    title: '⚔️ Dynamic Pong Wars — Day vs Night Color Conquest',
    category: 'ปริศนา / ฟิสิกส์',
    engine: 'Canvas 2D / Vanilla JS / Web Audio',
    description: 'เกมฟิสิกส์ซิมูเลชันการต่อสู้ระหว่างลูกบอลกลางวัน (Sun/Day) และกลางคืน (Moon/Night) ที่กระเด้งเปลี่ยนสีของกระดานแบบ Dynamic Grid Conquest',
    controls: 'Interactive Simulation: สามารถคลิกเพื่อเพิ่มลูกบอล หรือปล่อยให้ระบบต่อสู้อัตโนมัติ (Zero-Player Sim)',
    features: [
      'Dual Dynamic Ball Physics: ลูกบอลสองขั้วสะท้อนพื้นผิวและระบายสีพื้นที่ใหม่',
      'Balanced Tile Grid: คำนวณเปอร์เซ็นต์การครองพื้นที่ของทั้งสองฝ่ายแบบเรียลไทม์',
      'Generative Audio Chimes: เสียงโน้ตตามความเร็วและจุดที่ลูกบอลกระทบ',
      'Custom Speed & Gravity Controls: ปรับแต่งจำนวนลูกบอลและความเร็วในการจำลอง'
    ]
  },
  'emoji-match': {
    code: 'G001',
    title: '😀 Emoji Memory Match — Brain Training Puzzle',
    category: 'ปริศนา / ฝึกสมอง',
    engine: 'Vanilla JS / HTML5 / CSS3 Grid',
    description: 'เกมจับคู่ภาพความจำอิโมจิ ออกแบบมาเพื่อฝึกสมาธิและความจำระยะสั้น มีระดับความยากหลากหลายและการจับเวลาทำสถิติ',
    controls: 'Mouse / Touch: คลิกหรือแตะการ์ดเพื่อเปิดและจับคู่อิโมจิที่เหมือนกัน',
    features: [
      'Dynamic Emoji Themes: สุ่มชุดอิโมจิหลากหลายหมวดหมู่ (สัตว์, อาหาร, สีหน้า, กีฬา)',
      'Combo & Scoring System: คูณคะแนนเมื่อเปิดจับคู่ถูกต้องต่อเนื่อง',
      'Leaderboard & Timer: บันทึกเวลาที่เร็วที่สุดและจำนวนเทิร์นที่ใช้',
      'Juicy Card Flip FX: อนิเมชันพลิกการ์ด 3D CSS แบบนุ่มนวล'
    ]
  },
  'rubik-graph': {
    code: 'G035',
    title: '🎲 Rubik Graph Solver 3D — Combinatorial Cube Graph',
    category: 'ปริศนา / กราฟและคณิตศาสตร์',
    engine: 'Three.js 3D / Graph Theory Algorithms',
    description: 'เกมและเครื่องมือสร้างภาพจำลองกราฟการหมุนของรูบิคแบบ 3 มิติ เชื่อมโยงทฤษฎีกราฟและขั้นตอนวิธีแก้ปริศนาลูกบิดรูบิค',
    controls: 'Mouse Drag: หมุนมุมมองลูกบิดและโหนดกราฟ 3D | Controls UI: เลือกอัลกอริทึมและสเต็ปการหมุน',
    features: [
      'Interactive 3D Rubik Cube: หมุนเลเยอร์ของลูกบิดได้อย่างอิสระ',
      'State Graph Visualizer: แสดงโครงสร้างกราฟของสถานะลูกบิดในปริภูมิ 3 มิติ',
      'Step-by-Step Solver: แสดงเส้นทางแก้ปัญหารูบิคแบบทีละขั้นตอน',
      'Multi-language UI: รองรับคำอธิบายภาษาไทยและอังกฤษ'
    ]
  },
  'geeks-vs-zombies': {
    code: 'G036',
    title: '🧟 Geeks vs Zombies — Cyber Tower Defense',
    category: 'กระดาน / วางกลยุทธ์',
    engine: 'Phaser 3 / Canvas 2D',
    description: 'เกมวางแผนป้องกันฐาน (Tower Defense) ธีมโปรแกรมเมอร์และสาย Geek วางยูนิตคอมพิวเตอร์และเซิร์ฟเวอร์ต่อสู้กับฝูงซอมบี้บั๊กและมัลแวร์',
    controls: 'Mouse: ลากวางยูนิต Geek บนเลน และคลิกเพื่ออัปเกรดความสามารถ',
    features: [
      'Geek Unit Types: ยูนิตหลากหลายสาย (Frontend, Backend, DevOps, Hacker)',
      'Bug & Zombie Swarms: ซอมบี้หลากหลายรูปแบบพร้อมความต้านทานเฉพาะทาง',
      'Resource Management: บริหารแรม (RAM) และพลังงาน CPU เพื่อสร้างยูนิต',
      'Special Powerups: ยิงคาถา Git Force Push หรือ DDoS Wave เคลียร์หน้าจอ'
    ]
  },
  'water-ring-toss': {
    code: 'G048',
    title: '🌊 Water Ring Toss 3D — Vintage Handheld Toy Simulator',
    category: 'Three.js 3D Engine / ฟิสิกส์ของเหลว',
    engine: 'Three.js / Rapier WASM 3D Physics',
    description: 'เกมจำลองของเล่นย้อนยุคตู้กดน้ำกดห่วง (Water Ring Toss) ในรูปแบบ 3 มิติสมจริง พร้อมระบบฟิสิกส์แรงดันน้ำและแรงลอยตัวของห่วงยาง',
    controls: 'Left/Right Buttons (or A/D keys): กดปุ่มปั๊มฟองน้ำเพื่อดันห่วงให้ลอยขึ้นไปสวมเสา',
    features: [
      'Rapier WASM 3D Physics: ฟิสิกส์ Rigid Body ของห่วงและแรงต้านของน้ำที่สมจริง 100%',
      'Dual Pump Mechanism: ปุ่มปั๊มน้ำซ้าย-ขวา สร้างกระแสน้ำวนเฉพาะจุด',
      'Retro Toy Acrylic Case: เชเดอร์เคสพลาสติกใสพร้อมแสงสะท้อนและฟองน้ำ',
      'Target Ring Challenge: สะสมห่วงให้ครบทุกเสาเพื่อทำคะแนนสูงสุด'
    ]
  },
  'celadon': {
    code: 'G049',
    title: '🏺 CELADON: The Long Ash 3D — Ceramic Glaze Journey',
    category: 'Three.js 3D Engine / ผ่อนคลายและศิลปะ',
    engine: 'Three.js / Custom GLSL Shaders / Web Audio',
    description: 'เกม 3D บรรยากาศสงบนิ่ง (Atmospheric Art Game) ที่ผู้เล่นต้องควบคุมการเผาและเคลือบเครื่องเคลือบศิลาดลโบราณ รักษาอุณหภูมิและประกายขี้เถ้า',
    controls: 'Mouse / Touch: ควบคุมความแรงของเปลวไฟและหมุนเครื่องปั้นดินเผา 3D',
    features: [
      'Procedural Glaze Shaders: จำลองการหลอมละลายและการแตกลายงาของน้ำเคลือบศิลาดล',
      'Calming Ambient Soundscape: เสียงฟืนไม้แตกและเสียงลมสร้างสมาธิ',
      'Kiln Temperature Physics: ควบคุมการไหลของออกซิเจนและอุณหภูมิในเตาเผา',
      'Pottery Collection: บันทึกและสะสมผลงานเครื่องปั้นดินเผาที่เผาสำเร็จ'
    ]
  },
  'crumple': {
    code: 'G050',
    title: '📄 Crumple — Paper Arcade 3D',
    category: 'Three.js 3D Engine / อาเขต',
    engine: 'Three.js / Procedural Mesh Deformation',
    description: 'เกม 3D สไตล์กระดาษพับและขยำ (Paper Physics Arcade) ที่ให้ผู้เล่นควบคุมลูกบอลกระดาษกลิ้งหลบสิ่งกีดขวางบนโต๊ะทำงานสไตล์เรโทร',
    controls: 'WASD / Arrow Keys: ควบคุมทิศทางการกลิ้งของก้อนกระดาษ | Space: กระโดด',
    features: [
      'Paper Deformation Engine: พื้นผิวและโมเดลกระดาษที่ยับย่นแบบไดนามิก',
      'Office Desktop Obstacles: สิ่งกีดขวางจากเครื่องเขียน (ปากกา, ยางลบ, แก้วกาแฟ, คลิปหนีบกระดาษ)',
      'Stop-motion Aesthetic: อนิเมชันสไตล์สต็อปโมชันกระดาษ 12 FPS สวยงาม',
      'Combo Crumple Score: เก็บสะสมเศษกระดาษโน้ตเพื่อปลดล็อกสกินใหม่'
    ]
  },
  'silent-viper': {
    code: 'G032',
    title: '🎯 SILENT VIPER — Tactical Sniper 3D',
    category: 'Three.js 3D Engine / ยิงปืนทางยุทธวิธี',
    engine: 'Three.js / Vite / WebGL',
    description: 'เกมยิงปืนสไนเปอร์ลอบสังหาร 3 มิติ ผู้เล่นรับบทเป็นพลซุ่มยิงในปฏิบัติการลับ คำนวณระยะทาง แรงลม และอัตราการเต้นของหัวใจก่อนลั่นไก',
    controls: 'Mouse: เล็งกล้องส่องทางไกล (Scope) | Right Click: ซูม/กลั้นหายใจ | Left Click: ลั่นไกยิง',
    features: [
      'Realistic Scope & Ballistics: การซูมแบบ Optical เลนส์พร้อมตาราง Mil-Dot',
      'Bullet-Time Slow Motion: อนิเมชันกระสุนแหวกอากาศแบบสโลว์โมชันเมื่อยิงโดนเป้าสำคัญ',
      'Wind & Distance Factor: ต้องปรับแต่งการเล็งชดเชยทิศทางลมและแรงโน้มถ่วง',
      'Stealth Mission Rating: ประเมินเกรดความเงียบและความแม่นยำหลังจบภารกิจ'
    ]
  },
  'attack-agi': {
    code: 'G033',
    title: '⚡ Attack AGI — 3D Cyber Horde Shooter',
    category: 'Three.js 3D Engine / แอ็กชันเซอร์ไววัล',
    engine: 'Three.js / Procedural Cyber Grid',
    description: 'เกมยิงฝูงหุ่นยนต์ AI และบ็อตไวรัสในโลกไซเบอร์สเปซ 3 มิติ สไตล์ Vampire Survivors x Tron ที่ผู้เล่นต้องเอาชีวิตรอดจากคลื่น AGI ดิจิทัล',
    controls: 'WASD: เคลื่อนที่ | Mouse: เล็งทิศทางโจมตี (Auto-fire / Manual Trigger) | Space: Dash',
    features: [
      'Massive Horde Performance: เรนเดอร์ศัตรู AI นับพันตัวพร้อมกันได้อย่างลื่นไหล',
      'Cyber Upgrade Tree: อัปเกรดอาวุธเลเซอร์, ไฟร์วอลล์ระเบิด, และโดรนซับพอร์ต',
      'Neon Grid Aesthetics: งานภาพสไตล์ Synthwave นีออนพร้อมเพลงอิเล็กทรอนิกส์เร้าใจ',
      'Boss AGI Encounters: เผชิญหน้ากับบอส Superintelligent Neural Core'
    ]
  },
  'skate-dog': {
    code: 'G022-B',
    title: '🛹 Skate Dog — 3D Procedural Skateboarding Pup',
    category: 'Three.js 3D Engine / อาเขตผจญภัย',
    engine: 'Three.js / Procedural Terrain Generation',
    description: 'เกมสเก็ตบอร์ด 3 มิติแสนสดใส ควบคุมเจ้าสุนัขนักสเก็ตไถบอร์ดไปตามเส้นทางเมืองและชายหาดที่สร้างแบบ Procedural ไม่รู้จบ',
    controls: 'Arrow Left/Right (or A/D): เลี้ยวสเก็ตบอร์ด | Space: กระโดด Ollie / ทำท่า Trick | Shift: เร่งความเร็ว',
    features: [
      'Infinite Procedural Track: เส้นทางสเก็ตบอร์ดสร้างขึ้นใหม่แบบไม่มีที่สิ้นสุด',
      'Trick Combo System: กระโดด Grinding ราวบันไดและหมุนตัวกลางอากาศสะสมตัวคูณคะแนน',
      'Cute Canine Character: โมเดลน้องหมา 3D ดุ๊กดิ๊กพร้อมแอนิเมชันลิ้นห้อยและหางกระดิก',
      'Day/Night Cycle: บรรยากาศแสงสีเมืองที่เปลี่ยนจากเช้าจรดค่ำแบบเรียลไทม์'
    ]
  },
  'whistlevale': {
    code: 'G052',
    title: '🚂 Whistlevale — A House of Little Worlds 3D',
    category: 'Three.js 3D Engine / สำรวจและปริศนา',
    engine: 'Three.js / WebGL / Spatial Audio',
    description: 'เกมผจญภัยสำรวจโลกจำลองขนาดจิ๋ว (Diorama World) ภายในบ้านทรงโบราณ ไขปริศนารางรถไฟจิ๋วและเชื่อมต่อโลกแห่งความฝัน',
    controls: 'Mouse Drag: หมุนมุมมอง Diorama 360 องศา | Left Click: โต้ตอบกับสวิตช์ รางรถไฟ และกล่องปริศนา',
    features: [
      'Intricate 3D Dioramas: ฉากจำลองจำลองโลกในโหลแก้วและกล่องดนตรีสุดประณีต',
      'Interactive Railway Logic: สับรางรถไฟและส่งขบวนรถไฟไอน้ำไปยังเป้าหมาย',
      'Whimsical Soundtrack: ดนตรีบรรเลงออร์เคสตราสไตล์นิทานแฟนตาซี',
      'Storybook Narrative: ค้นพบความทรงจำและจดหมายที่ซ่อนอยู่ตามห้องต่างๆ'
    ]
  }
};

let createdCount = 0;

for (const [folderName, info] of Object.entries(missingGameSpecs)) {
  const targetDir = path.join(gamesDir, folderName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const specPath = path.join(targetDir, 'spec.md');
  const content = `---
title: "${info.title}"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Completed"
tags:
  - gdd
  - ${folderName}
  - ${info.category.toLowerCase().split('/')[0].trim()}
  - game-spec
---

# ${info.title}

**Code Name:** \`${folderName}\`  
**Game ID:** \`${info.code}\`  
**Version:** \`1.0.0\` (Production Release)  
**Age Rating:** All Ages  
**Supported Platforms:** Desktop & Mobile Web (Cross-Platform HTML5)  
**Engine & Tech Stack:** ${info.engine}  
**URL in Hub:** \`/games/${folderName}/index.html\`  
**Category:** ${info.category}  

---

## 1. Executive Summary & Concept

### 1.1 Elevator Pitch
${info.description}

### 1.2 Core Features
${info.features.map(f => `- **${f.split(':')[0]}:** ${f.split(':')[1] || ''}`).join('\n')}

---

## 2. Controls & Interaction Guide

| Action | Controls |
| :--- | :--- |
| **Primary Interaction** | ${info.controls} |

---

## 3. Technical Architecture & Implementation

1. **Engine Layer:** พัฒนาด้วย ${info.engine} รันบนเบราว์เซอร์ 100% Client-Side ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
2. **Audio System:** รองรับ Web Audio API สังเคราะห์เสียง Effect และ BGM ทำงานสมบูรณ์แบบทั้งบนเดสก์ท็อปและมือถือ
3. **Responsive Viewport:** ปรับแต่ง Aspect Ratio และ Canvas Resolution ให้พอดีกับหน้าจอและ Frame ของ Hub Modal
4. **State Persistence:** บันทึกคะแนนสูงสุด (High Scores) ลงใน \`localStorage\` ของเบราว์เซอร์อัตโนมัติ

---

## 4. Related Hub Documents
- Back to Game Index: [Game Design Hub (GDD)](../index.md)
- Root Project Index: [Project Index](../../index.md)
- Changelog: [Documentation Changelog](../../changelog.md)
`;

  fs.writeFileSync(specPath, content, 'utf8');
  console.log(`Created spec for: ${folderName} -> ${specPath}`);
  createdCount++;
}

console.log(`\nSuccessfully created ${createdCount} missing game specifications!`);
