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

```bash
npm install
npm run dev
```

## Build (static — พร้อม Cloudflare Pages)

```bash
npm run build
```

ผลลัพธ์อยู่ที่โฟลเดอร์ `out/`

### Cloudflare Pages

1. สร้างโปรเจกต์ใหม่ (อย่าทับ `puchong.puchup.com`)
2. Build command: `npm run build`
3. Output directory: `out`
4. ผูกเฉพาะ `puchup.com` / `www` — คง subdomain `puchong` ไว้ที่เดิม

## ห้ามแตะ

- `puchong.puchup.com` / โปรเจกต์ Kuncharoen
