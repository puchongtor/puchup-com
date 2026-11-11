# PuchUp SaleDesk (`sale.puchup.com`)

แอปแยกจาก `puchup.com` เพราะเว็บหลักใช้ `output: "export"` (ไฟล์นิ่ง) **รัน API / login cookie ไม่ได้**

แอปนี้เป็น Next.js ปกติ มี `app/api/sale/*` ได้

## ทำไม API ไม่ได้บน puchup.com

`next.config.ts` ของเว็บหลักตั้ง `output: "export"` → build เป็น HTML ใน `out/` ไม่มี serverless functions → ไม่มี `/api/*`

## Local

```bash
cd sale-desk
npm install
cp .env.example .env.local   # ใส่ keys โปรเจค Supabase ชื่อ puchup
npx supabase db push         # จากโฟลเดอร์นี้ หรือรัน SQL ใน Dashboard
npm run seed:pilot
npm run dev                  # http://localhost:3002/sale
```

Login ทดสอบ: `manager01` / `Sale#2026` (หรือค่า `SALE_PILOT_PASSWORD`)

## Production

1. สร้าง Vercel project ชี้ root directory = `sale-desk`
2. ผูกโดเมน `sale.puchup.com`
3. ใส่ env เดียวกับ `.env.example`
4. บน DNS ของ puchup.com ชี้ CNAME `sale` → Vercel

แบรนด์เดโม: **Your Company** · บริษัท อินดัสเทค พาร์ทส์ จำกัด (อะไหล่เครื่องจักร)
