# CAMT Design Reference

ชุดข้อมูลอ้างอิงด้านการออกแบบของ CAMT (College of Arts, Media and Technology, CMU) สำหรับเตรียมนำไปประยุกต์ใช้ปรับ design ของ web_angemus

## ที่มาของข้อมูล (Sources)

| Source | รายละเอียด | วันที่เก็บข้อมูล |
|---|---|---|
| `guideline CAMT logo.pdf` | CAMT Brand Identity Guidelines (เอกสารทางการ, 15 หน้า) | 2026-06-13 |
| https://www.camt.cmu.ac.th/ | เว็บไซต์หลัก (WordPress + Elementor) — ถอดจาก CSS จริงของเว็บ | 2026-06-13 |
| `post-9.css` (Elementor Global Kit) | Global design tokens ของเว็บไซต์: สี ฟอนต์ type scale layout | 2026-06-13 |
| `post-35.css` (Homepage CSS) | Token ระดับหน้า: สี section, component styles | 2026-06-13 |

## โครงสร้างเอกสาร

1. **[01-brand-identity.md](01-brand-identity.md)** — Brand Identity จาก PDF ทางการ: แนวคิด Hexagon, สีแบรนด์ (ทองแดง/น้ำตาล/ส้ม), กฎการใช้โลโก้, ฟอนต์
2. **[02-website-design-tokens.md](02-website-design-tokens.md)** — Design tokens ที่ถอดจากเว็บไซต์จริง: color palette, typography scale, layout, components
3. **[03-application-guideline.md](03-application-guideline.md)** — Guideline การนำไปประยุกต์ใช้กับ web_angemus: CSS variables, Tailwind mapping, ลำดับการปรับ

## สรุปย่อ (Quick Reference)

| Token | ค่า | ที่มา |
|---|---|---|
| Copper (สีหลักแบรนด์) | `#B8775D` | PDF p.8 (Logo 2-Tone) |
| Brown (สีรองแบรนด์) | `#594A41` | PDF p.8 (Logo 2-Tone) |
| Accent Orange (เว็บ) | `#F48E2E` | post-9.css `--e-global-color-accent` |
| Headline Brown (เว็บ) | `#533527` | post-9.css / post-35.css |
| Section BG Cream | `#F0F0E9` | post-35.css |
| Text หลัก | `#282828` | post-9.css `--e-global-color-primary` |
| ฟอนต์เว็บ (หัวเรื่อง/อังกฤษ) | aktiv-grotesk-thai | post-9.css |
| ฟอนต์เว็บ (เนื้อหาไทย) | thonglor | post-9.css |
| ฟอนต์สิ่งพิมพ์ | Quark | PDF p.9 |
| Container max-width | 1312px (บาง section 1392px) | post-9.css / post-35.css |
| Card border-radius | 16px | post-35.css |
| รูปทรงประจำแบรนด์ | Hexagon (หกเหลี่ยม) | PDF p.2 |
