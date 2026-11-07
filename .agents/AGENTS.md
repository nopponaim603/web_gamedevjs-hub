# 🤖 AGENTS.md — Workspace Customizations Root Guidance

See primary workspace guidance at [AGENTS.md](../AGENTS.md).

## 🧩 Central Agent Skills & Workflows (.agents/skills)
โฟลเดอร์ `.agents/` เป็นศูนย์กลางการควบคุมพฤติกรรม ทักษะ (Skills) และแนวทางการพัฒนาสำหรับทุก AI Agent (Antigravity, Gemini, Claude, Cursor, Codex ฯลฯ)

### 1. Poteto Playbooks & Execution Modes (`.agents/skills/poteto-mode`)
เมื่อได้รับโจทย์การทำงาน ให้ประเมินลักษณะงานและเลือกใช้ Playbook ที่เหมาะสมจาก `.agents/skills/poteto-mode/playbooks/`:
- **Bug Fix**: [`playbooks/bug-fix.md`](skills/poteto-mode/playbooks/bug-fix.md) — ตรวจสอบและทำ Repro ก่อนเสมอ แก้ไขที่ต้นเหตุ และยืนยันผล
- **Feature**: [`playbooks/feature.md`](skills/poteto-mode/playbooks/feature.md) — ออกแบบข้อมูลก่อนโค้ด กำหนด Checkpoint ชัดเจน
- **Investigation / Question**: [`playbooks/investigation.md`](skills/poteto-mode/playbooks/investigation.md) — ค้นหาหลักฐานจริงในโค้ด/เอกสารก่อนสรุป
- **Refactoring**: [`playbooks/refactoring.md`](skills/poteto-mode/playbooks/refactoring.md) — ยึดโครงสร้างเดิม ไม่เปลี่ยน behavior และลดความซับซ้อน
- **Performance**: [`playbooks/perf-issue.md`](skills/poteto-mode/playbooks/perf-issue.md) — วัดผลก่อนและหลังแก้ไข พร้อมอธิบายตัวเลข
- **General / Unclear**: [`skills/figure-it-out/SKILL.md`](skills/figure-it-out/SKILL.md)

### 2. Core Principles
AI Agent ทุกตัวต้องยึดหลักการหลักในการพัฒนา:
- **Laziness Protocol**: เลี่ยงการเพิ่ม abstraction ที่ไม่จำเป็น แก้ไขให้เล็ก กระชับ และตรงจุด
- **Model the Domain**: กำหนด data shape และ state ให้ชัดเจนก่อนลงมือเขียน logic
- **Prove It Works**: ทดสอบและยืนยันด้วยหลักฐานจริงเสมอ (command output / build verification)
- **Fix Root Causes**: แก้ปัญหาที่ต้นตอของความผิดพลาด ไม่ใช่แค่เขียน guard ดักอาการ

### 3. Subagent & Execution Standards
- ใช้วิธีสั่งงาน Subagent / Delegate ตามเครื่องมือที่สภาพแวดล้อมนั้นรองรับ (เช่น `invoke_subagent` สำหรับ Antigravity หรือ Task tool สำหรับ Cursor/Claude) โดยให้ระบุ Role, Prompt และบริบทไฟล์ชัดเจน

---

## 🎮 Game Development & Domain Rules
1. **Game Development Documentation**: Always maintain `docs/` according to `.agents/skills/game-doc-manager/SKILL.md`.
2. **Multi-Engine Support**: Utilize Phaser 3 and Babylon.js adapters in `engines/`.
3. **Quality & Aesthetics**: Keep UI polished, responsive, and performant.

## 🏷️ Version & Build Management Rules
1. **Version Number Sync**: การปรับเปลี่ยนเลข `version` ใน `public/build.json` ต้องปรับเปลี่ยนตามเวอร์ชันล่าสุดที่ระบุไว้ในเอกสาร [docs/changelog.md](../docs/changelog.md) เสมอ
2. **Build Number Format**: เลข `build` ใน `public/build.json` ให้ใช้เวลา ณ ขณะอัปเดตในรูปแบบ `HHMM` (ชั่วโมงและนาที 24 ชม. เช่น `2237`)

