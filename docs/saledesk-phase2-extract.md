# SaleDesk Phase 2 — Extract checklist

อย่าทำใน Phase 1 นี้แล้ว ใช้เมื่อพร้อม copy ระบบเต็มจากต้นแบบลูกค้า

## แหล่งต้นแบบ

- แอป: `D:\PuchUp\Web ลูกค้า\Advancepro\advancepro-web\app\sale`
- แบรนด์ที่ต้องถอด: `lib/sales-ai/brand.ts` (ห้ามเหลือชื่อ Advance บนโปรดักต์)
- สไตล์: `app/sale/sale.css`
- ต้นแบบโฮสต์จริงแยกคนละโดเมน: `sale.advancepro-th.com`

## งานหลัก

1. คัดลอกโมดูล sale (auth, visit, coach, manager, accounts, search) เป็นแพ็กเกจ white-label
2. แทนที่ brand ด้วย [`lib/saledesk/tenant.ts`](../lib/saledesk/tenant.ts) — ค่าเริ่ม Your Company / ลูกค้าจริงทีหลัง
3. แยก env Supabase ต่อ tenant — ห้ามใช้ DB ของ Advance ร่วมกับเดโมขาย
4. โฮสต์ใต้ PuchUp เช่น `sale.puchup.com` หรือ path ที่ตกลง — คนละกับ `puchup.com/sale` (หน้าพรีเซนต์)
5. เดโมที่ `/sale/demo/*` ค่อยชี้ไปแอปจริง หรือคงมock ไว้เป็น preview เบา

## สถานะ (เริ่มแล้ว)

แอปจริงอยู่ที่ [`sale-desk/`](../sale-desk/) — โฮสต์ `sale.puchup.com` (หรือ local `:3002`)  
เว็บหลักยัง `output: "export"` → API ต้องรันที่แอปนี้เท่านั้น

## เกณฑ์เสร็จ

- [x] แยกแอป SaleDesk คนละโดเมน / ไม่ใช้ static export
- [x] แบรนด์ Your Company · IndusTech (ไม่ใช้ Advance ใน brand.ts)
- [x] หน้าพรีเซนต์ `/sale` ยังอยู่บน puchup.com
- [ ] ผูก Supabase โปรเจค `puchup` + seed + deploy Vercel
- [ ] ต้นแบบลูกค้า Advance ไม่ถูกลบ/ไม่ถูกผสมแบรนด์
