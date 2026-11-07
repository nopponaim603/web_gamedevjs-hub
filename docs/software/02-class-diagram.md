---
title: "Software Class Diagram & Flow — GameDevJS Hub"
project: "GameDevJS Hub (webJS)"
version: "1.47.0"
last_updated: "2026-11-07"
owner: "Noppon / Dev Team"
status: "Active"
tags:
  - software
  - architecture
  - uml
---
# Software Class Diagram & Flow — GameDevJS Hub

---

## 1. Hub Interaction Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Player
    participant Page as "src/app/page.js"
    participant Hook as "useGameCatalog Hook"
    participant Section as "CategorySection.jsx"
    participant Modal as "GameModal.jsx"
    participant TargetGame as "Target Game (public/games/*)"

    Player->>Page: เปิดหน้าเว็บ Hub
    Page->>Hook: เรียกใช้งาน useGameCatalog()
    Hook-->>Page: ส่งคืน { games, filteredGames, activeGame, filter state }
    Page->>Section: Render หมวดหมู่เกมผ่าน CategorySection
    Section-->>Player: แสดงผลการ์ดเกมตามหมวดหมู่ (Phaser, Babylon, Three.js, etc.)

    Player->>Section: คลิกปุ่ม "Play" บน GameCard
    Section->>Hook: setActiveGame(game)
    Hook-->>Page: trigger re-render with activeGame
    Page->>Modal: Render GameModal(activeGame)
    Modal->>TargetGame: โหลด iframe URL ของเกมที่เลือก
    TargetGame-->>Modal: Game loaded & ready

    Player->>Modal: เล่นเกมเสร็จ / กด ESC / คลิกปิด
    Modal->>Hook: setActiveGame(null)
    Hook-->>Page: ปิด Modal และเคลียร์ iframe sandbox
```

---

## 2. Component & Architecture Class Diagram

```mermaid
classDiagram
    class GameItem {
        +String id
        +String title
        +String category
        +String url
        +String image
        +String gradient
        +String aspectRatio
    }

    class UseGameCatalogHook {
        +Array~GameItem~ games
        +Array~GameItem~ filteredGames
        +String searchKeyword
        +String selectedCategory
        +GameItem activeGame
        +setSearchKeyword(keyword)
        +setSelectedCategory(category)
        +setActiveGame(game)
    }

    class HomePage {
        +render()
    }

    class CategorySectionComponent {
        +String title
        +String icon
        +Array~GameItem~ games
        +Function filterFn
        +String badgeColor
        +Function onPlay
        +render()
    }

    class GameCardComponent {
        +GameItem game
        +Function onPlay
        +render()
    }

    class GameModalComponent {
        +GameItem game
        +Function onClose
        +render()
    }

    HomePage --> UseGameCatalogHook : uses
    HomePage --> CategorySectionComponent : renders
    CategorySectionComponent --> GameCardComponent : renders
    HomePage --> GameModalComponent : opens on activeGame
    UseGameCatalogHook --> GameItem : manages
```

---

## Related Documents
- System Design: [Software System Design](./01-system-design.md)
- Data Schema: [Data Schema & Persistence](./03-data-schema.md)
- Master Index: [Documentation Master Index](../index.md)
