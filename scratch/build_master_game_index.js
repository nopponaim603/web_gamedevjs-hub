const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '..', 'docs', 'gdd', 'games');
const rootIndexMd = path.join(__dirname, '..', 'docs', 'index.md');

// Complete metadata registry of all 49 games
const gameRegistry = [
  { id: 'G001', code: 'emoji-match', title: '😀 Emoji Memory Match', engine: 'Vanilla JS / CSS Grid', category: 'ปริศนา / ฝึกสมอง', folder: 'emoji-match', docFolder: 'emoji-match', docFile: 'spec.md' },
  { id: 'G002', code: '2048-cubes', title: '🧊 2048 Cubes', engine: 'Canvas 2D / Physics', category: 'ปริศนา / ฟิสิกส์', folder: '2048-cubes', docFolder: '2048-cubes', docFile: 'spec.md' },
  { id: 'G003', code: 'mahjong-tile-match', title: '🀄 Mahjong Tile Match', engine: 'Vanilla JS', category: 'ปริศนา / จับคู่ทรีแมตช์', folder: 'mahjong-tile-match', docFolder: 'mahjong-tile-match', docFile: 'spec.md' },
  { id: 'G004', code: 'space-shooter', title: '🚀 Space Shooter', engine: 'Phaser 2D', category: 'Phaser 2D Engine', folder: 'phaser-demo', docFolder: 'space-shooter', docFile: 'spec.md' },
  { id: 'G005', code: 'cyber-sphere', title: '🌐 Cyber Sphere 3D', engine: 'Babylon.js 3D', category: 'Babylon 3D Engine', folder: 'babylon-demo', docFolder: 'cyber-sphere-3d', docFile: 'spec.md' },
  { id: 'G006', code: 'tile-swap', title: '🔲 Tile Swap', engine: 'Phaser 2D', category: 'ปริศนา / สลับไทล์', folder: 'tile-swap', docFolder: 'tile-swap', docFile: 'spec.md' },
  { id: 'G007', code: '3d-platformer', title: '🏃 Kenney 3D Platformer', engine: 'Babylon.js 8', category: 'Babylon 3D Engine', folder: '3d-platformer', docFolder: '3d-platformer', docFile: 'spec.md' },
  { id: 'G008', code: 'card-memory', title: '🃏 Card Memory Match', engine: 'Vanilla JS', category: 'ปริศนา / ฝึกสมอง', folder: 'card-memory', docFolder: 'card-memory', docFile: 'spec.md' },
  { id: 'G009', code: 'ocean-frenzy', title: '🦈 Ocean Frenzy', engine: 'Phaser 3', category: 'Phaser 2D Engine', folder: 'ocean-frenzy', docFolder: 'ocean-frenzy', docFile: 'spec.md' },
  { id: 'G010', code: 'dice-quest', title: '🎲 Dice Quest', engine: 'Vanilla JS / Phaser', category: 'กระดาน / วางกลยุทธ์', folder: 'dice-quest', docFolder: 'dice-quest', docFile: 'spec.md' },
  { id: 'G016', code: 'goosl-marbles', title: '🔮 Goosl Glass Marbles', engine: 'WebGL 2 / Shader', category: 'ปริศนา / ฟิสิกส์', folder: 'goosl-marbles', docFolder: 'goosl-marbles', docFile: 'spec.md' },
  { id: 'G017', code: 'tiny-dungeon-roguelike', title: '🗡️ Tiny Dungeon Survivor', engine: 'Phaser 2D / Roguelike', category: 'Phaser 2D Engine', folder: 'tiny-dungeon-roguelike', docFolder: 'tiny-dungeon-roguelike', docFile: 'spec.md' },
  { id: 'G018', code: 'hole-io', title: '🕳️ Hungry Manhole (Hole.io City)', engine: 'Three.js 3D Engine', category: 'Three.js 3D Engine', folder: 'hole-io', docFolder: 'hole-io', docFile: 'spec.md' },
  { id: 'G019', code: 'stateIO', title: '🗺️ State.IO (Territory Domination)', engine: 'Canvas 2D / Web Audio', category: 'กระดาน / วางกลยุทธ์', folder: 'stateIO', docFolder: 'stateIO', docFile: 'gdd.md' },
  { id: 'G020', code: 'warfront', title: '⚔️ WarFront.io (FrontWars RTS)', engine: 'WebGL / TypeScript', category: 'กระดาน / วางกลยุทธ์', folder: 'warfront', docFolder: 'warfront', docFile: 'gdd.md' },
  { id: 'G021', code: 'tiny-dungeon-squad', title: '🐍 Tiny Dungeon Squad (SNKRX)', engine: 'Phaser 2D / Auto-Battler', category: 'Phaser 2D Engine', folder: 'tiny-dungeon-squad', docFolder: 'tiny-dungeon-squad', docFile: 'spec.md' },
  { id: 'G022', code: 'animated-card-game', title: '🃏 FOOL THE GAME (Royal Cascade)', engine: 'Phaser 3 / GSAP', category: 'กระดาน / วางกลยุทธ์', folder: 'animated-card-game', docFolder: 'animated-card-game', docFile: 'gdd.md' },
  { id: 'G023', code: 'boba-pearl-drop', title: '🧋 BOBA PEARL DROP: 100% SUGAR', engine: 'Babylon.js 3D', category: 'Babylon 3D Engine', folder: 'boba-pearl-drop', docFolder: 'boba-pearl-drop', docFile: 'spec.md' },
  { id: 'G024', code: 'eggplant-wiggle', title: '🍆 Wiggle Eggplant 3D', engine: 'Three.js / Wiggle Phys', category: 'Three.js 3D Engine', folder: 'eggplant-wiggle', docFolder: 'eggplant-wiggle', docFile: 'spec.md' },
  { id: 'G025', code: 'pretext-breaker', title: '🧱 Pretext Breaker (Typography Arkanoid)', engine: 'Canvas 2D / Text Engine', category: 'ปริศนา / อาเขต', folder: 'pretext-breaker', docFolder: 'pretext-breaker', docFile: 'spec.md' },
  { id: 'G026', code: 'starter-kit-racing', title: '🏎️ Starter Kit Racing 3D', engine: 'Three.js / Crashcat Phys', category: 'Three.js 3D Engine', folder: 'starter-kit-racing', docFolder: 'starter-kit-racing', docFile: 'spec.md' },
  { id: 'G027', code: 'webrtc-xo', title: '🎮 XO Multiplayer (WebRTC P2P)', engine: 'WebRTC / PeerJS', category: 'กระดาน / มัลติเพลเยอร์', folder: 'webrtc-xo', docFolder: 'webrtc-xo', docFile: 'spec.md' },
  { id: 'G028', code: 'godawful', title: '⚡ GODAWFUL (Cute Town God Sim)', engine: 'Three.js / PostFX', category: 'Three.js 3D Engine', folder: 'godawful', docFolder: 'godawful', docFile: 'spec.md' },
  { id: 'G029', code: 'survive-10-waves', title: '🛡️ SURVIVE 10 WAVES (Extraction 3D)', engine: 'Three.js / ES Modules', category: 'Three.js 3D Engine', folder: 'survive-10-waves', docFolder: 'survive-10-waves', docFile: 'spec.md' },
  { id: 'G030', code: 'dirtline', title: '🏍️ DIRT LINE (Trials Dirt Bike 3D)', engine: 'Three.js / Spring Phys', category: 'Three.js 3D Engine', folder: 'dirtline', docFolder: 'dirtline', docFile: 'spec.md' },
  { id: 'G031', code: 'oxford-3000', title: '📚 Oxford 3000 Vocab Master', engine: 'HTML5 / Canvas / TTS', category: 'การศึกษา / ภาษาอังกฤษ', folder: 'oxford-3000', docFolder: 'oxford-3000', docFile: 'spec.md' },
  { id: 'G032', code: 'silent-viper', title: '🎯 SILENT VIPER (Sniper 3D)', engine: 'Three.js / Vite', category: 'Three.js 3D Engine', folder: 'silent-viper', docFolder: 'silent-viper', docFile: 'spec.md' },
  { id: 'G033', code: 'attack-agi', title: '⚡ Attack AGI (3D Horde Shooter)', engine: 'Three.js / Procedural', category: 'Three.js 3D Engine', folder: 'attack-agi', docFolder: 'attack-agi', docFile: 'spec.md' },
  { id: 'G034', code: 'pong-wars', title: '⚔️ Dynamic Pong Wars (Day vs Night)', engine: 'Canvas 2D / Vanilla JS', category: 'ปริศนา / ฟิสิกส์', folder: 'pong-wars', docFolder: 'pong-wars', docFile: 'spec.md' },
  { id: 'G035', code: 'rubik-graph', title: '🎲 Rubik Graph Solver 3D', engine: 'Three.js / Graph Theory', category: 'ปริศนา / กราฟ 3D', folder: 'rubik-graph', docFolder: 'rubik-graph', docFile: 'spec.md' },
  { id: 'G036', code: 'geeks-vs-zombies', title: '🧟 Geeks vs Zombies (Cyber TD)', engine: 'Phaser 3 / Canvas 2D', category: 'กระดาน / วางกลยุทธ์', folder: 'geeks-vs-zombies', docFolder: 'geeks-vs-zombies', docFile: 'spec.md' },
  { id: 'G037', code: 'boat-roguelite-driftwake', title: '⛵ Boat Roguelite: Driftwake (3D Naval)', engine: 'Three.js / WebGL / Audio', category: 'Three.js 3D Engine', folder: 'boat-roguelite-driftwake', docFolder: 'boat-roguelite-driftwake', docFile: 'spec.md' },
  { id: 'G038', code: 'echo-abyss', title: '🌊 Echo Abyss: Deep-Sea Sonar Survival', engine: 'WebGL 2 / Canvas / Audio', category: 'Three.js 3D Engine', folder: 'echo-abyss', docFolder: 'echo-abyss', docFile: 'spec.md' },
  { id: 'G039', code: 'coin-pusher-3d-copper-cascade', title: '🪙 Coin Pusher 3D: Copper Cascade', engine: 'Three.js / Physics 3D', category: 'Three.js 3D Engine', folder: 'coin-pusher-3d-copper-cascade', docFolder: 'coin-pusher-3d-copper-cascade', docFile: 'spec.md' },
  { id: 'G040', code: 'dragon-roguelite-skywake', title: '🐉 Dragon Roguelite: Skywake', engine: 'PixiJS / 2D Action', category: 'Phaser 2D Engine', folder: 'dragon-roguelite-skywake', docFolder: 'dragon-roguelite-skywake', docFile: 'spec.md' },
  { id: 'G041', code: 'grapple-knight-storm-siege', title: '⚔️ Grapple Knight: Storm Siege', engine: 'Canvas 2D / Boss Rush', category: 'Phaser 2D Engine', folder: 'grapple-knight-storm-siege', docFolder: 'grapple-knight-storm-siege', docFile: 'spec.md' },
  { id: 'G042', code: 'ink-warden', title: '🖌️ Ink Warden 墨守 (Calligraphy Defense)', engine: 'WebGL Fluid / Canvas', category: 'Three.js 3D Engine', folder: 'ink-warden', docFolder: 'ink-warden', docFile: 'spec.md' },
  { id: 'G043', code: 'jelly-baby', title: '👶 Jelly Baby (WebGPU 3D Soft-Body)', engine: 'WebGPU / Three.js r185', category: 'Three.js 3D Engine', folder: 'jelly-baby', docFolder: 'jelly-baby', docFile: 'spec.md' },
  { id: 'G044', code: 'inkwash', title: '🎨 INKWASH 晕染 (Territory io Battle)', engine: 'Canvas 2D / Living Ink', category: 'Phaser 2D Engine', folder: 'inkwash', docFolder: 'inkwash', docFile: 'spec.md' },
  { id: 'G045', code: 'volta', title: '⚡ VOLTA: Lineman of the Storm', engine: 'PixiJS 8 / WPA Swing', category: 'Phaser 2D Engine', folder: 'volta', docFolder: 'volta', docFile: 'spec.md' },
  { id: 'G046', code: 'scribble-jump', title: '✏️ Scribble Jump (Vertical Doodler)', engine: 'Canvas 2D / Doodle Jump', category: 'Phaser 2D Engine', folder: 'scribble-jump', docFolder: 'scribble-jump', docFile: 'spec.md' },
  { id: 'G047', code: 'k8sgames', title: '☸️ K8s Games (3D Kubernetes Simulator)', engine: 'Three.js / WebGL / DevOps', category: 'Three.js 3D Engine', folder: 'k8sgames', docFolder: 'k8sgames', docFile: 'spec.md' },
  { id: 'G048', code: 'water-ring-toss', title: '🌊 Water Ring Toss 3D (Vintage Toy)', engine: 'Three.js / Rapier WASM', category: 'Three.js 3D Engine', folder: 'water-ring-toss', docFolder: 'water-ring-toss', docFile: 'spec.md' },
  { id: 'G049', code: 'celadon', title: '🏺 CELADON: The Long Ash 3D', engine: 'Three.js / GLSL Shader', category: 'Three.js 3D Engine', folder: 'celadon', docFolder: 'celadon', docFile: 'spec.md' },
  { id: 'G050', code: 'crumple', title: '📄 Crumple (Paper Arcade 3D)', engine: 'Three.js / Procedural Mesh', category: 'Three.js 3D Engine', folder: 'crumple', docFolder: 'crumple', docFile: 'spec.md' },
  { id: 'G051', code: 'overprint-404', title: '🎯 404 OVERPRINT (Tactical Shooter)', engine: 'Canvas 2D / WebGL', category: 'ปริศนา / อาเขต', folder: 'overprint-404', docFolder: 'overprint-404', docFile: 'spec.md' },
  { id: 'G052', code: 'whistlevale', title: '🚂 Whistlevale (A House of Little Worlds)', engine: 'Three.js / Diorama 3D', category: 'Three.js 3D Engine', folder: 'whistlevale', docFolder: 'whistlevale', docFile: 'spec.md' },
  { id: 'G053', code: 'mogura-tatakanai', title: '🐾 Mogura Tatakanai (Pet the Mole 3D)', engine: 'Three.js r128 / Web Audio', category: 'Three.js 3D Engine', folder: 'mogura-tatakanai', docFolder: 'mogura-tatakanai', docFile: 'spec.md' },
  { id: 'G054', code: 'skate-dog', title: '🛹 Skate Dog (3D Procedural Pup)', engine: 'Three.js / Procedural 3D', category: 'Three.js 3D Engine', folder: 'skate-dog', docFolder: 'skate-dog', docFile: 'spec.md' }
];

// Sort by ID
gameRegistry.sort((a, b) => a.id.localeCompare(b.id));

// 1. Generate docs/gdd/games/index.md
let gamesIndexContent = `---
title: "🎮 Game Design Specifications Master Index"
project: "GameDevJS Hub (webJS)"
version: "1.0.0"
last_updated: "2026-09-11"
owner: "Noppon / Dev Team"
status: "Active"
tags:
  - gdd
  - master-index
  - games
---

# 🎮 Game Design Specifications Master Index

เอกสารดัชนีรวมเกมทั้งหมดในโปรเจกต์ **GameDevJS Hub (webJS)** จำนวน **${gameRegistry.length} เกม** พร้อมรหัสเกม (Game ID Code), เอนจินที่ใช้, หมวดหมู่, และลิงก์ไปยังเอกสาร Game Specification ฉบับสมบูรณ์

---

## 📋 ตารางดัชนีเกมทั้งหมด (Master Game Index Table)

| Game ID | Code Name | Game Title | Engine / Tech Stack | Category | GDD Specification |
| :---: | :--- | :--- | :--- | :--- | :---: |
`;

for (const g of gameRegistry) {
  const relDocPath = `./${g.docFolder}/${g.docFile}`;
  gamesIndexContent += `| **${g.id}** | \`${g.code}\` | ${g.title} | ${g.engine} | ${g.category} | [📄 View Spec](${relDocPath}) |\n`;
}

gamesIndexContent += `
---

## 🗂️ การจัดหมวดหมู่ตามเอนจิน (Engine Breakdown)

### 1. Three.js / WebGL / WebGPU 3D Engine (${gameRegistry.filter(g => g.category.includes('Three.js') || g.engine.includes('Three') || g.engine.includes('WebGPU')).length} Games)
${gameRegistry.filter(g => g.category.includes('Three.js') || g.engine.includes('Three') || g.engine.includes('WebGPU')).map(g => `- **[${g.id}]** ${g.title} — [📄 Spec](./${g.docFolder}/${g.docFile})`).join('\n')}

### 2. Phaser 2D / PixiJS Engine (${gameRegistry.filter(g => g.category.includes('Phaser') || g.engine.includes('Phaser') || g.engine.includes('Pixi')).length} Games)
${gameRegistry.filter(g => g.category.includes('Phaser') || g.engine.includes('Phaser') || g.engine.includes('Pixi')).map(g => `- **[${g.id}]** ${g.title} — [📄 Spec](./${g.docFolder}/${g.docFile})`).join('\n')}

### 3. Babylon.js 3D Engine (${gameRegistry.filter(g => g.category.includes('Babylon') || g.engine.includes('Babylon')).length} Games)
${gameRegistry.filter(g => g.category.includes('Babylon') || g.engine.includes('Babylon')).map(g => `- **[${g.id}]** ${g.title} — [📄 Spec](./${g.docFolder}/${g.docFile})`).join('\n')}

### 4. Vanilla JS / Canvas 2D / P2P Multiplayers (${gameRegistry.filter(g => !g.category.includes('Three.js') && !g.engine.includes('Three') && !g.engine.includes('WebGPU') && !g.category.includes('Phaser') && !g.engine.includes('Phaser') && !g.engine.includes('Pixi') && !g.category.includes('Babylon') && !g.engine.includes('Babylon')).length} Games)
${gameRegistry.filter(g => !g.category.includes('Three.js') && !g.engine.includes('Three') && !g.engine.includes('WebGPU') && !g.category.includes('Phaser') && !g.engine.includes('Phaser') && !g.engine.includes('Pixi') && !g.category.includes('Babylon') && !g.engine.includes('Babylon')).map(g => `- **[${g.id}]** ${g.title} — [📄 Spec](./${g.docFolder}/${g.docFile})`).join('\n')}

---

## 🔗 เอกสารที่เกี่ยวข้อง (Related Links)
- [📘 Root Project Index](../../index.md)
- [🏗️ Concept & Architecture](../00-concept.md)
- [⚙️ Core Mechanics & Loops](../01-mechanics.md)
- [🎨 Art & UI/UX Guidelines](../03-art-direction.md)
- [🔊 Audio Direction & Specs](../04-audio-direction.md)
- [📜 Documentation Changelog](../../changelog.md)
`;

fs.writeFileSync(path.join(gamesDir, 'index.md'), gamesIndexContent, 'utf8');
console.log('Created docs/gdd/games/index.md successfully!');

// 2. Update docs/index.md
let rootIndex = fs.readFileSync(rootIndexMd, 'utf8');

// Replace Game Index Code Names table
let newTable = `### 🎮 Game Index Code Names (Master Registry)\n\n[📖 ดูดัชนีและเอกสารสเปกเกมฉบับละเอียดทั้งหมด (docs/gdd/games/index.md)](./gdd/games/index.md)\n\n| # | Code Name | Game Title | Engine | Folder | Spec Document |\n| :---: | :--- | :--- | :--- | :--- | :---: |\n`;

for (const g of gameRegistry) {
  const relDoc = `./gdd/games/${g.docFolder}/${g.docFile}`;
  newTable += `| ${g.id} | \`${g.code}\` | ${g.title} | ${g.engine} | \`public/games/${g.folder}/\` | [📄 Spec](${relDoc}) |\n`;
}

const tableRegex = /### 🎮 Game Index Code Names[\s\S]*?(?=### 🎮 Active Released Game Specifications|## 💻 Software Design)/;
if (tableRegex.test(rootIndex)) {
  rootIndex = rootIndex.replace(tableRegex, newTable + '\n');
  fs.writeFileSync(rootIndexMd, rootIndex, 'utf8');
  console.log('Updated docs/index.md successfully!');
} else {
  console.log('Could not find table section in docs/index.md');
}
