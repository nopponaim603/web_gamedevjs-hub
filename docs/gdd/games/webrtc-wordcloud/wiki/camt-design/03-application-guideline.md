# Guideline การประยุกต์ใช้ CAMT Design กับ web_angemus

> เป้าหมาย: ปรับ design ของ web_angemus (Next.js + Tailwind v4) ให้สอดคล้องกับ brand identity ของ CAMT
> อ้างอิงข้อมูลจาก [01-brand-identity.md](01-brand-identity.md) และ [02-website-design-tokens.md](02-website-design-tokens.md)

## 1. สถานะปัจจุบันของ web_angemus

`src/app/globals.css` ปัจจุบันใช้ palette **navy blue / teal / amber** (`--primary: #1e3a8a`, `--secondary: #0d9488`, `--accent: #d97706`) พร้อม glassmorphism — **ไม่ตรงกับ identity ของ CAMT** ที่เป็นโทน copper/brown/orange บนพื้นขาว-ครีม

## 2. Proposed Color Mapping

แทนค่าตัวแปรเดิมใน `globals.css` ดังนี้ (ค่าทั้งหมดมาจากแหล่งข้อมูลจริง):

```css
:root {
  color-scheme: light dark;

  /* Base */
  --background: #FAFAF7;        /* ขาวอมครีม — กลางระหว่างขาวกับ #F0F0E9 ของ CAMT */
  --background-alt: #F0F0E9;    /* section สลับ (จากเว็บ CAMT) */
  --foreground: #282828;        /* text หลัก (CAMT global primary) */
  --muted: #7A7A7A;             /* text รอง (CAMT global text) */

  /* Brand */
  --primary: #B8775D;           /* Copper — สีหลักแบรนด์ (PDF p.8) */
  --primary-hover: #A67763;     /* Copper เข้มที่เว็บใช้เป็น active state */
  --secondary: #594A41;         /* Brown — สีรองแบรนด์ (PDF p.8) */
  --heading: #533527;           /* น้ำตาลเข้มสำหรับ headline (เว็บ CAMT) */
  --accent: #F48E2E;            /* Orange — CTA หลัก (เว็บ CAMT accent) */
  --accent-deep: #E86230;       /* Orange เข้ม สำหรับ hover ของ accent */

  /* Surface */
  --card-bg: #FFFFFF;
  --border-color: #E4E4E4;      /* gray จาก CAMT palette */
  --divider: #F5F5F5;           /* divider ใน mega-menu CAMT */
}
```

### Dark mode (ข้อเสนอ — เว็บ CAMT ไม่มี dark mode ให้อ้างอิง)

หากคง dark mode ไว้ ให้คุมโทนด้วยน้ำตาลเข้มแทน navy เช่น `--background: #1C1714` (น้ำตาลดำ), `--primary: #C98E74` (copper สว่างขึ้นเพื่อ contrast), `--accent: #F48E2E` คงเดิม
ค่าเหล่านี้เป็นข้อเสนอที่ต้องตรวจ contrast (WCAG AA) ก่อนใช้จริง

## 3. Typography

| ประเด็น | เว็บ CAMT ใช้ | ทางเลือกสำหรับ web_angemus |
|---|---|---|
| ฟอนต์หลัก | `aktiv-grotesk-thai` (Adobe Fonts — ต้องมี license) | ถ้ามี Adobe Fonts: ใช้ตามต้นทาง / ถ้าไม่มี: ฟอนต์ Google ไทย sans เช่น `IBM Plex Sans Thai`, `Noto Sans Thai`, หรือ `Anuphan` (เลือกตัวที่บุคลิก grotesk ใกล้เคียง) |
| ฟอนต์เนื้อหาไทย | `thonglor` (เชิงพาณิชย์) | ใช้ฟอนต์หลักตัวเดียวทั้งระบบได้เพื่อลดความซับซ้อน |
| Weight หัวเรื่อง | 500 (medium) ทุกระดับ | คงไว้ที่ 500–600 ไม่ใช้ 700+ |
| line-height | body 1.5 / heading 1.3 | คงตาม |

แนะนำ type scale ตามเว็บ CAMT (h1 56 → h6 16, ลดขั้นที่ 1024px และ 767px) — ดูตารางเต็มใน [02-website-design-tokens.md](02-website-design-tokens.md) §2.2

## 4. Component Guidelines

| Component | แนวทาง |
|---|---|
| Card | radius **16px** (`rounded-2xl`), padding 24–28px, พื้นสีเดียว (ขาว/ครีม/สีแบรนด์) — **เลิกใช้ glassmorphism/backdrop-blur** เพื่อให้ตรงบุคลิก CAMT ที่เป็น solid surface |
| ปุ่ม CTA หลัก | solid `#F48E2E` text ขาว radius 4px (`rounded`) padding 16px 24px |
| ปุ่ม CTA รอง | pill outline 1px radius 25px (`rounded-full`) padding 8px 24px — สี border/text ใช้ `--heading` หรือ `--secondary` |
| Tab/Filter | pill radius 50px, active = BG `#A67763` text ขาว |
| Headline เด่น | สี `#533527` แทน gradient-text เดิม (เลิก gradient น้ำเงิน-เขียว) |
| Section สลับ | ขาว ↔ `#F0F0E9` |
| Shadow | เบา: `0 2px 8px rgba(0,0,0,0.08)` / modal: `2px 8px 23px rgba(0,0,0,0.2)` ตามเว็บ CAMT |
| Motif | ใช้รูปทรง hexagon เป็น decorative element (icon container, pattern พื้นหลังจาง ๆ, clip-path) — ห้ามดัดแปลงโลโก้ (PDF p.15) |

## 5. กฎจากแบรนด์ที่ต้องระวังเมื่อใช้ในเว็บ

1. โลโก้ CAMT ต้องวางบน **พื้นขาวเป็นอันดับแรก** (PDF p.12) — บนพื้นเข้มใช้เวอร์ชันขาว `logo-camt-white.svg`
2. ต้องเว้น clear space รอบโลโก้ ≈ ความสูงตัวอักษร "A" ในโลโก้ (PDF p.11)
3. ห้ามเปลี่ยนสีโลโก้ / ทำ outline / บิดสัดส่วน / วางบนพื้นหรือ pattern ที่กลืนกับโลโก้ (PDF p.15)
4. ถ้าจะใช้ภาพในช่องหกเหลี่ยมของโลโก้ (special event) ต้องไม่ทำลายรูปทรงเดิม (PDF p.14)

## 6. ลำดับการปรับ (Suggested Migration Steps)

1. **Tokens** — แก้ CSS variables ใน `globals.css` ตาม §2 (ไฟล์เดียว เห็นผลทั้งเว็บ)
2. **Fonts** — เปลี่ยน `--font-outfit/--font-inter` ใน `src/app/layout.tsx` เป็นฟอนต์ไทยที่เลือก (next/font/google)
3. **Utility classes** — ปรับ `.gradient-text`, `.glass`, `.glass-nav`, `.hover-glow` ให้เป็น solid style ตาม §4 (หรือ deprecate)
4. **Components** — ไล่ปรับปุ่ม/การ์ด/แท็บใน `src/components/` และหน้าใน `src/app/` ให้ใช้ token ใหม่
5. **Assets** — เพิ่มโลโก้ CAMT (ขอไฟล์ทางการ หรือใช้ SVG จากเว็บ) + hexagon motif
6. **ตรวจ accessibility** — เช็ก contrast คู่สีหลัก โดยเฉพาะ `#F48E2E` บนขาว (ส้มสว่าง — ผ่าน AA เฉพาะ text ขนาดใหญ่ ควรใช้ `#E86230` หรือ `#533527` สำหรับ text เล็ก)

## 7. คู่สีที่แนะนำ / ควรเลี่ยง (Contrast Notes)

| คู่สี | ใช้กับ | หมายเหตุ |
|---|---|---|
| `#282828` บน `#FFFFFF`/`#F0F0E9` | body text | ปลอดภัย |
| `#533527` บน ขาว/ครีม | headline | ปลอดภัย |
| ขาว บน `#594A41` / `#533527` | ปุ่ม/การ์ดเข้ม | ปลอดภัย |
| ขาว บน `#A67763` | tab active | ระดับ ~AA large text — ใช้กับตัวอักษร ≥18px ตามเว็บ CAMT |
| ขาว บน `#F48E2E` | ปุ่มส้ม | contrast ต่ำ — เว็บ CAMT ใช้กับ weight 500+ ขนาดใหญ่; สำหรับ text เล็กให้เลี่ยง |
| `#F48E2E` บน ขาว | link/icon | ใช้เป็น accent ตกแต่งเท่านั้น ไม่ใช้กับ text เล็ก |

> ค่า contrast ควรยืนยันด้วยเครื่องมือ (เช่น WebAIM) ระหว่าง implement จริง
