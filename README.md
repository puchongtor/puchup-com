# PuchUp.com (v2)

Business System Builder — **PuchUp สร้างระบบผู้ช่วยธุรกิจ**

Source of truth: `_prototype/` + `HANDOFF.md`

## หน้าเว็บ

- `/` Home + Live Business Assistant
- `/build` What We Build
- `/showcase` + `/showcase/aeropulse`
- `/products` Systems / Labs
- `/how-we-work`
- `/about`
- `/contact`

## พัฒนา

คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ Sanity project ID (ถ้ามี)

โปรเจกต์นี้**ไม่มี Supabase** — CMS คือ Sanity อย่างเดียว

```bash
npm install
npm run dev
```

เปิด http://localhost:3000  
เดโม: http://localhost:3000/sites/restaurant/ และ `/sites/aeropulse/`

## Deploy (Next.js static บน Vercel)

ไซต์ถูก build เป็นไฟล์ใน `out/` (`output: "export"`) เพื่อไม่ใช้ Vercel Functions / Image Optimization

1. Import Git repo ใน Vercel (Framework: Next.js — `vercel.json` ชี้ `outputDirectory` เป็น `out`)
2. Environment variables ให้ตรงกับ `.env.example` โดยเฉพาะ `NEXT_PUBLIC_SANITY_*`
3. ผูกโดเมน `puchup.com` / `www` เท่านั้น — **อย่าทับ** `puchong.puchup.com`
4. เดโม subdomain (`restaurant.puchup.com` ฯลฯ) ชี้มาที่โปรเจกต์นี้ได้ — rewrite ไป `/sites/[site]/` ใน `vercel.json`

อัปเดตเนื้อหา Sanity: ตั้ง Deploy Hook ของ Vercel แล้วยิงจาก Sanity webhook (rebuild ครั้งละครั้ง ถูกกว่า ISR ทุก request)

Studio: `npm run sanity` หรือ iframe ที่ `/admin` → `NEXT_PUBLIC_SANITY_STUDIO_URL`

## ห้ามแตะ

- `puchong.puchup.com` / โปรเจกต์ Kuncharoen
