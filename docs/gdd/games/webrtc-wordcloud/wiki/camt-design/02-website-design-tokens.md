# Website Design Tokens — camt.cmu.ac.th

> ถอดจาก CSS จริงของเว็บไซต์ (เก็บข้อมูล 2026-06-13)
> - Global Kit: `https://www.camt.cmu.ac.th/wp-content/uploads/elementor/css/post-9.css`
> - Homepage: `https://www.camt.cmu.ac.th/wp-content/uploads/elementor/css/post-35.css`
> - Stack: WordPress + Elementor (+ The Plus Addons, JetEngine), WP Rocket

## 1. Color Palette

### 1.1 Global Colors (Elementor Kit)

| Role | Hex | Elementor var |
|---|---|---|
| Primary (text/link) | `#282828` | `--e-global-color-primary` |
| Secondary | `#54595F` | `--e-global-color-secondary` |
| Text | `#7A7A7A` | `--e-global-color-text` |
| **Accent (ส้มแบรนด์)** | `#F48E2E` | `--e-global-color-accent` |
| White (บนพื้นเข้ม/ปุ่ม) | `#FFFFFF` | `--e-global-color-9fca730`, `bb007fc`, `32b045d` |
| Dark Heading | `#0E0E0E` | `--e-global-color-07562bf` |
| **Headline Brown (น้ำตาลแบรนด์)** | `#533527` | `--e-global-color-b13bfff` |
| Divider/Subtle BG | `#F5F5F5` | `--e-global-color-086cbe1` |
| Beige/Tan | `#CDC1B1` | `--e-global-color-5303108` |
| Orange Deep (hover/secondary accent) | `#E86230` | `--e-global-color-12ca4c9` |
| Orange Light | `#FF7C4B` | `--e-global-color-304a117` |
| Gray scale | `#010101` `#222426` `#262626` `#313131` `#424242` `#5C5C5C` `#737477` `#8F8F8F` `#ACB5BE` `#DBDBDB` `#E4E4E4` `#E6E9F0` | หลายตัวแปร |
| Shadow (15% black) | `#00000026` | `--e-global-color-78d9011` |
| Page transition BG | `#FFBC7D` | kit `e-page-transition` |

### 1.2 สีระดับ Section/Component (Homepage)

| การใช้งาน | Hex |
|---|---|
| Hero headline (ตัวเลข/หัวเรื่องใหญ่) | `#533527` (น้ำตาลเข้ม) |
| Card "รู้จัก CAMT" BG | `#F48E2E` (ส้ม) |
| Card "ทุนการศึกษา" BG | `#2F4B3C` (เขียวเข้ม) |
| ตัวอักษรบนการ์ดเขียวอ่อน | `#0B332D` |
| ปุ่ม outline / ตัวอักษร CTA | `#06063A` (navy เกือบดำ) |
| Tab active BG (ค้นหาหลักสูตร) | `#A67763` (โทนทองแดง — ใกล้ `#B8775D` ของแบรนด์) |
| Tab text ปกติ | `#533527` |
| Section BG (ข่าวสาร) | `#F0F0E9` (ครีม) |
| Accordion text | `#313131` |

**ข้อสังเกต:** เว็บใช้ neutral เทา-ดำเป็นหลัก แล้วชูสีแบรนด์เป็นจุดเน้น — ส้ม `#F48E2E` (accent), น้ำตาล `#533527` (headline), ทองแดง `#A67763` (interactive state) บนพื้นขาว/ครีม `#F0F0E9` ตามกฎ PDF ที่ให้วางโลโก้บนพื้นขาวเป็นหลัก

## 2. Typography

### 2.1 Font Families

| Font | การใช้งาน | หมายเหตุ |
|---|---|---|
| `aktiv-grotesk-thai` | ฟอนต์หลักทั้งเว็บ (body default + h1–h6 + display) | ฟอนต์เชิงพาณิชย์ (Adobe Fonts) รองรับไทย |
| `thonglor` | เนื้อหาไทย (text presets 14–24px) | ฟอนต์เชิงพาณิชย์ |
| `Roboto` / `Roboto Slab` | ค่า default เดิมของ kit (แทบไม่ถูกใช้จริง) | — |

Base: `font-family: "aktiv-grotesk-thai", Sans-serif; line-height: 1.5em;`

### 2.2 Heading Scale (น้ำหนัก 500, line-height 1.3em ทุกระดับ)

| Tag | Desktop | ≤1024px | ≤767px |
|---|---|---|---|
| h1 | 56px | 50px | 42px |
| h2 | 48px | 42px | 36px |
| h3 | 40px | 34px | 30px |
| h4 | 32px | 26px | 24px |
| h5 | 24px | 18px | 16px |
| h6 | 16px | 14px | 14px |

### 2.3 Display/Text Presets (Global Typography)

| Preset | Font | Size (desktop → tablet → mobile) | Weight |
|---|---|---|---|
| Display XL | aktiv-grotesk-thai | 100 → 80 → 68px | 500 |
| Display L | aktiv-grotesk-thai | 88 → 72 → 60px | 500 |
| Display M | aktiv-grotesk-thai | 72 → 64 → 54px | 500 |
| Body L (thonglor) | thonglor | 24 → 20 → 18px | 400/700 |
| Body M (thonglor) | thonglor | 20 → 16 → 14px | 400/700 |
| Menu/Nav | aktiv-grotesk-thai | 18 → 16 → 14px | 600 |
| Small label | aktiv-grotesk-thai | 24 → 20 → 18px | 500 |

Hero homepage: 64px (desktop) / 40px (mobile), weight 500; subtitle 22px/20px weight 600

## 3. Layout & Spacing

| Token | ค่า |
|---|---|
| Container max-width | **1312px** (global) — section หลักของ homepage ใช้ 1392px |
| Breakpoints | tablet ≤1024px, mobile ≤767px |
| Widget spacing default | 20px |
| Section padding (แนวตั้ง) | 64px (desktop) → 24–48px (mobile) |
| Card padding | 24px / 28px / 32px / 35px ตามขนาดการ์ด |
| Grid gap | 8 / 16 / 28 / 32px |
| News grid | 4 คอลัมน์ → 3 (tablet) → 1 (mobile), gap 16px |
| Bento grid (highlight) | `1fr 2fr 1fr` → ปรับเป็น `3fr 1fr 1fr` (tablet) → `1fr` (mobile) |

## 4. Components

| Component | สเปก |
|---|---|
| **Card** | border-radius **16px**, BG เป็นสีแบรนด์หรือภาพ, padding 24–28px, มี min-height (217–680px ตามชนิด) |
| **ปุ่ม Pill (outline)** | border 1px `#06063A`, radius 25px, padding 8px 24px, font 18px/600, ไอคอนลูกศรขวา (`flex-direction: row-reverse`) |
| **ปุ่ม Solid** | BG `--e-global-color-accent` (#F48E2E), text ขาว, radius 4px, padding 16px 24px, weight 500 |
| **ปุ่ม Text/Ghost** | BG โปร่งใส, font 14px/600, สีตามพื้นหลังการ์ด |
| **Tabs (pill)** | radius 50px, font 18px/500, ปกติ text `#533527` พื้นโปร่งใส; active/hover BG `#A67763` text ขาว, padding 12px 25px |
| **Slider hero** | สูง 500px, content กว้าง max 66%, transition 3000ms×1.2 |
| **Slider arrows** | วงกลม 48px, BG accent, icon ขาว 24px |
| **Pagination dots** | 8px, active สี accent |
| **Popup/Modal** | กว้าง 768px, shadow `2px 8px 23px 3px rgba(0,0,0,0.2)` |
| **Divider บางใน mega-menu** | border-bottom 1px `#F5F5F5` |
| **ภาษา 2 ภาษา** | TH (หลัก) / EN ที่ `/en/home/` |

## 5. ลักษณะเด่นของการออกแบบโดยรวม

1. **การ์ดมุมโค้ง 16px เป็นหน่วยหลักของ layout** — แทบทุก section เป็นการ์ดสีพื้น/ภาพ ขนาดต่างกันแบบ bento grid
2. **พื้นหลังขาว/ครีม + จุดสีแบรนด์เข้ม** — ไม่ใช้ gradient ฉูดฉาด ใช้ภาพประกอบที่มี pattern hexagon แฝง
3. **Typography ใหญ่และหนาแน่นปานกลาง** — display ถึง 100px, heading weight 500 (ไม่หนามาก), เนื้อหาไทยใช้ฟอนต์แยก (thonglor)
4. **ปุ่มสองบุคลิก** — pill outline (เรียบหรู) สำหรับ CTA รอง และ solid ส้มสำหรับ CTA หลัก
5. **โทนสี earth tone (ทองแดง/น้ำตาล/ครีม) ผสม navy/เขียวเข้ม** เป็นสีเสริมของการ์ด
