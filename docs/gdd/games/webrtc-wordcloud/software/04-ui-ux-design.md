# P2P CloudWord — UI/UX & Visual Design

**Version:** 2.0 | **Last Updated:** 2026-06-14

## Visual Identity (CAMT Theme)

The visual identity is migrated from the original dark navy/sky-blue glassmorphism theme to the **CAMT (College of Arts, Media and Technology, CMU) brand identity** — earth-tone (copper/brown/orange) on a light cream/white surface, solid (non-glass) cards, and a hexagon motif.

> Reference: [CAMT Design Reference](../wiki/camt-design/index.md) — [Brand Identity](../wiki/camt-design/01-brand-identity.md), [Website Design Tokens](../wiki/camt-design/02-website-design-tokens.md), [Application Guideline](../wiki/camt-design/03-application-guideline.md), [design-tokens.json](../wiki/camt-design/design-tokens.json)

### Color Palette (CSS Variables)

| Token | Hex | Usage | Source |
|---|---|---|---|
| `--bg-color` | `#FAFAF7` | App background (cream-white) | CAMT proposal |
| `--bg-alt` | `#F0F0E9` | Alternate section / sidebar background | CAMT homepage |
| `--card-bg` | `#FFFFFF` | Cards, panels, modals | CAMT |
| `--text-primary` | `#282828` | Primary text | CAMT global primary |
| `--text-secondary` | `#7A7A7A` | Secondary/muted text | CAMT global text |
| `--heading-color` | `#533527` | Headlines, logo wordmark | CAMT headline brown |
| `--primary` | `#B8775D` | Brand primary (Copper) — links, icons, focus rings | PDF p.8 |
| `--primary-hover` | `#A67763` | Hover/active state for primary (tab active bg) | CAMT homepage |
| `--secondary` | `#594A41` | Brand secondary (Brown) — secondary buttons, borders | PDF p.8 |
| `--accent-color` | `#F48E2E` | Primary CTA buttons | CAMT accent |
| `--accent-deep` | `#E86230` | Accent hover/pressed | CAMT homepage |
| `--success` | `#22c55e` | Connection active / correct answers (unchanged) | existing |
| `--danger` | `#dc2626` | Errors, delete actions | existing convention |
| `--border-color` | `#E4E4E4` | Card/input borders | CAMT |
| `--divider` | `#F5F5F5` | Dividers, subtle backgrounds | CAMT |

### Visual Themes (Implemented Presets)

The application supports three dynamic visual themes that transition all CSS color variables smoothly:

#### 1. CAMT Light (Default)
Standard light cream/copper earth-tone theme designed according to the core brand guidelines.
- `--bg-color`: `#FAFAF7`
- `--bg-alt`: `#F0F0E9`
- `--card-bg`: `#FFFFFF`
- `--primary` (Copper): `#B8775D`
- `--accent-color` (Orange): `#F48E2E`
- `--heading-color` (Brown): `#533527`

#### 2. Dark (Neon)
High-contrast dark theme optimized for low-light environments with neon/cyan/rose visual indicators.
- `--bg-color`: `#0f172a` (slate-900)
- `--bg-alt`: `#1e293b` (slate-800)
- `--card-bg`: `#1e293b`
- `--text-primary`: `#f8fafc`
- `--text-secondary`: `#94a3b8`
- `--heading-color`: `#f43f5e` (Rose)
- `--primary` (Sky Blue): `#38bdf8`
- `--accent-color` (Emerald): `#10b981`
- `--accent-deep`: `#06b6d4`
- `--border-color` / `--divider`: `#334155`

#### 3. Pastel
Soft, soothing visual theme with a warm beige background and soft pastel tones.
- `--bg-color`: `#fdf8f5`
- `--bg-alt`: `#f5ebe6`
- `--card-bg`: `#ffffff`
- `--text-primary`: `#4a3e3d`
- `--text-secondary`: `#9c8a87`
- `--heading-color`: `#d4a373`
- `--primary`: `#ccd5ae`
- `--primary-hover`: `#e8acb5`
- `--secondary`: `#faedcd`
- `--accent-color`: `#e8a598`
- `--accent-deep`: `#f19c79`
- `--border-color`: `#e9ecef`
- `--divider`: `#f8f9fa`

> No glassmorphism: replace `--glass` / `backdrop-filter: blur()` usages with solid `--card-bg` + `--border-color` + light shadow `0 2px 8px rgba(0,0,0,0.08)`.

### Typography

- **Font family:** Thai-supporting grotesk sans — `IBM Plex Sans Thai`, `Noto Sans Thai`, or `Anuphan` (Google Fonts, replaces `Outfit`/`Inter`). Single font family for both Thai and English content.
- **Heading weight:** 500–600 (avoid 700+), `line-height: 1.3em`.
- **Body line-height:** `1.5em`.
- **Scale reference** (desktop → tablet ≤1024px → mobile ≤767px):

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| h1 / Page title | 56px | 50px | 42px |
| h2 / Section title | 48px | 42px | 36px |
| h3 / Card title | 40px | 34px | 30px |
| h4 | 32px | 26px | 24px |
| h5 | 24px | 18px | 16px |
| h6 / Label | 16px | 14px | 14px |

### Components

| Component | Spec |
|---|---|
| **Card / Panel** | `border-radius: 16px`, `background: var(--card-bg)`, `border: 1px solid var(--border-color)`, padding 24px, shadow `0 2px 8px rgba(0,0,0,0.08)` — no blur |
| **Primary Button (CTA)** | solid `var(--accent-color)`, text white, `border-radius: 4px`, padding `16px 24px`, weight 500. Use `--accent-deep` for hover. Avoid white text on accent for small text (contrast) — prefer `--heading-color` text for small accent buttons |
| **Secondary Button** | pill outline 1px `var(--secondary)` or `var(--heading-color)`, `border-radius: 25px`, padding `8px 24px`, font 18px/600 |
| **Tabs / Filters (Quiz options, theme switcher)** | pill `border-radius: 50px`, text `var(--heading-color)`, active background `var(--primary-hover)` with white text, padding `12px 25px` |
| **Theme Selector Dropdown** | Custom select container `.theme-select` styled with rounded borders (`8px`), custom focus rings, and transition variables mapping to active themes. |
| **Modal (Quiz Editor, dialogs)** | width ~768px max, `box-shadow: 2px 8px 23px 3px rgba(0,0,0,0.2)`, `border-radius: 16px` |
| **Status indicator** | unchanged (green = active, red = inactive) |
| **Hexagon motif** | decorative `clip-path: polygon(...)` hexagon used for icon containers, avatar frames, and faint background pattern — does not replace or alter any CAMT logo |

## User Interface Requirements

### 1. Landing Page
- **Actions:** Buttons for "Create Session" and "Join Session" using the Primary Button style.
- **Visuals:** QR Code display area (visible when acting as Host), framed with a hexagon-corner accent.

### 2. Main Workspace
- **Display Area:** Large empty space (`--bg-color` or `--bg-alt`) for showing the animated word cloud.
- **Input Area:** Text field for entering words and a "Send" button (Primary Button style).
- **Status/Member List:** Shows the number of connected peers and connectivity status, in a solid card panel.
- **Presence Avatars Strip:** A thin lane along the bottom edge of `.cloud-container` where one avatar per connected peer (host + participants) "walks" back and forth. See [Presence Avatars](#presence-avatars-walking-strip) below.

### Presence Avatars (Walking Strip)
- **Container:** A new `.presence-strip` element pinned to the bottom of `.cloud-container`, height ~56px, `background: var(--bg-alt)`, `border-top: 1px solid var(--divider)`.
- **Avatar:** `.presence-avatar`, ~36px hexagon (`clip-path` per [US-UI-05](../agile/user-stories/archives/US-UI-05.md) `.hex-frame`), background colored from the CAMT word-cloud palette (`--primary`, `--accent-color`, `--accent-deep`, `--secondary`, `--primary-hover`) keyed by a hash of the peer ID, showing the first 1–2 letters of the participant's nickname.
- **Host marker:** Host's avatar gets a small badge/outline in `--heading-color`.
- **Motion:** Each avatar drifts left↔right within the strip at a slow, randomized speed/phase (CSS animation with per-element random `animation-duration`/`animation-delay`, or a tiny JS ticker) — "walking" feel, not distracting.
- **Sync:** Driven by the existing peer list + `nicknames` map (no new network message types required); re-renders on `PEER_LIST`/`PLAYER_INFO` updates.
- **Interaction:** Hover/tap an avatar shows a tooltip with the full nickname.
- **Responsive:** On mobile (`≤767px`), strip height reduces to ~44px and avatar size to ~28px.

### 3. Theme Customization (Runtime Switcher, v1.2/US-UI-02)
- **Presets:** "CAMT Light" (default, per this spec), "Dark" (proposal above), plus optional secondary palettes ("Cyberpunk", "Nature") layered as alternate token sets — CAMT tokens remain the baseline default.
- **Dynamic Scales:** Animation speed and collision intensity adjustments based on submission velocity (unchanged).

## Word Cloud Color Scale
- Word colors drawn from a vibrant scale anchored on the brand earth tones: `--primary` (Copper), `--accent-color` (Orange), `--accent-deep`, `--secondary` (Brown), `--primary-hover`, with `--heading-color` for the largest/most frequent words.

## Brand Usage Constraints
- If/when the official CAMT logo is added to the header, it must sit on a white background with clear space ≈ height of the logo's "A" character (PDF p.11), and use `logo-camt-white.svg` only on dark surfaces. Do not recolor, outline, or distort the logo (PDF p.15).

---

## Related Documents
- Concept: [Concept](./00-concept.md)
- Mechanics: [Interactive Mechanics](./05-interactive-mechanics.md)
- CAMT Design Reference: [docs/wiki/camt-design](../wiki/camt-design/index.md)
