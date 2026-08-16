# PuchUp.com — v2 Handoff Note (สำหรับ Cursor)

**Source of truth:** ไฟล์ "Master Build Brief v2" ที่ผู้ใช้ให้มา — ไม่ใช่ `puchup-cursor-handoff.md` หรือ `puchup-design-specification.md` เดิม (สองไฟล์นั้นถูก supersede แล้ว)

**HTML ใน `puchup-website-prototype.zip` คือ visual reference ที่ตรงกับ Master Brief v2 แล้ว** — ใช้เป็นหน้าตาสุดท้ายได้เลย ไม่ต้องตีความใหม่ Cursor มีหน้าที่แค่แปลงเป็น Next.js + TypeScript ตามโครงสร้าง section 3 ของ Brief (ไม่ใช่ patch ของเก่า แต่ build ตาม IA/component list ใน Brief โดยใช้ HTML นี้เป็นข้อมูลอ้างอิงด้าน CSS/spacing/copy)

## ห้ามเปลี่ยนเด็ดขาด

ประโยคนี้คือแกนของทั้งเว็บ ไม่ใช่แค่ tagline — ห้าม Cursor แก้คำ, ย่อ, หรือ paraphrase ไม่ว่าในบริบทไหน:

> PuchUp ไม่ได้แค่สร้างเว็บไซต์
> PuchUp สร้างระบบที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น

ปรากฏอยู่ที่: Hero (เป็นบรรทัดไฮไลต์ใต้ subhead), Philosophy section (เป็นข้อความปิดท้าย), และ About page

## สิ่งที่เปลี่ยนจากเวอร์ชันก่อนหน้า (v1 → v2)

- Positioning: "ระบบผู้ช่วยธุรกิจ" (v1) → **"Business System Builder"** (v2, eyebrow ใน Hero)
- Primary CTA: "คุยกับ PuchUp" → **"เล่าธุรกิจให้ PuchUp ฟัง"** (ใช้เป็น CTA หลักทุกจุด conversion)
- CTA hierarchy ใหม่: Explore = "ดูสิ่งที่เราสร้าง →" / Understand = "ดูว่า PuchUp ทำงานอย่างไร →" / Primary = "เล่าธุรกิจให้ PuchUp ฟัง" — ห้ามใช้ "คุยกับ PuchUp" ซ้ำทุกจุดเหมือน v1
- Nav เพิ่ม **"How We Work"** เป็นเมนูหลัก (v1 ไม่มี)
- เพิ่ม section ใหม่ 2 อัน: **"Ordinary Website vs PuchUp System"** (comparison 2 คอลัมน์) และ **"Philosophy"** — ทั้งสองต้องอยู่ตามลำดับใน section 37 ของ Brief
- Products แบ่งเป็น **PuchUp Systems** (ว่างตอนนี้ ยังไม่มี product ประกาศจริง) กับ **PuchUp Labs** (คุณเจริญ/ระบบพัฒนาชีวิตขั้นสูง/Vlog AI) — ห้ามรวมเป็นกลุ่มเดียวเหมือน v1
- Assistant มี **session memory จริง** ระหว่างบทสนทนา (business/need/interestedSystem/goal/turnCount) — ห้ามถามซ้ำสิ่งที่ผู้ใช้บอกไปแล้ว (ดู state object ใน `index.html` ท้ายไฟล์เป็นตัวอย่าง logic ที่ต้อง reproduce ใน `lib/assistant/conversationEngine.ts`)
- เพิ่ม **Sticky Assistant Launcher**: โผล่มุมล่างขวาหลัง scroll ผ่าน Hero, ไม่ auto-open, ไม่บัง CTA
- Handoff card ต้องมีปุ่ม "ส่งให้ทีม PuchUp" และ **"แก้ไขข้อมูล"** (v1 มีแค่ปุ่มเดียว)
- Unknown/error state ต้องมีปุ่ม "ส่งต่อให้ทีม" และ **"คุยเรื่องอื่น"** (v1 ไม่มีปุ่มหลัง unknown message)

## Acceptance Checklist

ใช้ checklist ข้อ 41 ในตัว Master Brief v2 โดยตรง — มีรายการละเอียดกว่า checklist เดิมใน `puchup-cursor-handoff.md` (เช่น เพิ่มเรื่อง "PuchUp does NOT look like generic web agency", "No console errors", "No broken links") ให้ยึด checklist ในไฟล์ Brief เป็นหลัก
