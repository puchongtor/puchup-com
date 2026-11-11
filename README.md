# PuchUp.com

Business System Builder — **PuchUp สร้างระบบผู้ช่วยธุรกิจ**

โครงสร้างแยกโปรเจกต์: หน้าหลัก PuchUp กับ **Project ONE** (เว็บหน้าร้านหน้าเดียว) อยู่คนละชุด route

## Routes

### หน้าหลัก PuchUp (จะปรับทีหลัง)

- `/` Home + Live Business Assistant
- `/build` What We Build
- `/showcase` + `/showcase/aeropulse`
- `/products` Systems / Labs
- `/how-we-work`
- `/about`
- `/contact`

### Project ONE (หน้าร้านหน้าเดียว → LINE / Maps)

| Path | เนื้อหา |
|------|---------|
| `/ProjectONE/` | หน้าขาย Project ONE |
| `/ProjectONE/demo/` | Showroom ธุรกิจตัวอย่าง |
| `/ProjectONE/google/` | หน้าร้านบน Google |
| `/ProjectONE/[slug]/` | เดโมร้านจริง (เช่น `/ProjectONE/restaurant/`) |
| `/demo/` | alias → showroom เดียวกัน |

แหล่ง HTML ชั่วคราว (จาก Gemini): `content/project-one/pages/` + `content/project-one/themes/`  
รูป: `public/images/project-one/`  
ตัว rewrite ลิงก์/รูป: `lib/project-one/html.ts`

## พัฒนา

คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ Sanity project ID (ถ้ามี)

```bash
npm install
npm run dev
```

เปิด http://localhost:3000  
Project ONE: http://localhost:3000/ProjectONE/  
Showroom: http://localhost:3000/ProjectONE/demo/  
เดโมร้าน: http://localhost:3000/ProjectONE/restaurant/

## Deploy (Next.js static บน Vercel)

ไซต์ถูก build เป็นไฟล์ใน `out/` (`output: "export"`)

1. Import Git repo ใน Vercel — `vercel.json` ชี้ `outputDirectory` เป็น `out`
2. Environment variables ให้ตรงกับ `.env.example`
3. ผูกโดเมน `puchup.com` / `www` เท่านั้น — **อย่าทับ** `puchong.puchup.com`

## ห้ามแตะ

- `puchong.puchup.com` / โปรเจกต์ Kuncharoen
