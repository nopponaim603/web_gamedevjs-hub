---
title: "Data Schema & Persistence — GameDevJS Hub"
project: "GameDevJS Hub (webJS)"
version: "1.47.0"
last_updated: "2026-11-07"
owner: "Noppon / Dev Team"
status: "Active"
tags:
  - software
  - schema
  - types
---
# Data Schema & Persistence — GameDevJS Hub

---

## 1. Game Catalog Domain Schema (`src/data/games.js`)

ข้อมูลเกมทั้งหมดของ Hub ถูกกำหนดโครงสร้างตามโมเดล Domain ต่อไปนี้:

```typescript
export interface GameItem {
    id: string;               // รหัสประจำเกม (e.g. "pong-wars", "ocean-frenzy", "cyber-sphere")
    title: string;            // ชื่อเกมสำหรับแสดงผล (e.g. "⚔️ Dynamic Pong Wars")
    category: string;         // หมวดหมู่และ Engine (e.g. "ปริศนา / ฟิสิกส์", "Phaser 2D Engine", "Three.js 3D Engine")
    url: string;              // พาธไปยังไฟล์เกมใน public/games/ (e.g. "/games/pong-wars/index.html")
    image: string;            // ภาพหน้าปก Thumbnail (Local path หรือ Unsplash URL)
    gradient: string;         // รหัส CSS Linear Gradient สำหรับ Background Styling
    aspectRatio?: string;     // อัตราส่วนหน้าจอของ Modal Container (optional)
}
```

### 1.1 Category Master List
```javascript
export const categories = [
  "ทั้งหมด",
  "ปริศนา",
  "กระดาน",
  "Phaser 2D",
  "Babylon 3D",
  "Three.js 3D"
];
```

---

## 2. Hook State Schema (`src/hooks/useGameCatalog.js`)

```typescript
interface GameCatalogState {
    games: GameItem[];
    filteredGames: GameItem[];
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    activeGame: GameItem | null;
    setActiveGame: (game: GameItem | null) => void;
}
```

---

## 3. PWA Web App Manifest Schema (`public/manifest.json`)

```json
{
  "name": "GameDevJS Hub — HTML5 & Multi-Engine Games",
  "short_name": "GameDevJS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0e17",
  "theme_color": "#00F2FE",
  "icons": [
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Related Documents
- System Design: [Software System Design](./01-system-design.md)
- Class Diagram: [Class Diagram & Data Flow](./02-class-diagram.md)
- Master Index: [Documentation Master Index](../index.md)
