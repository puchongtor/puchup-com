import Link from "next/link";
import { Check, MessageCircle, Phone } from "lucide-react";
import { baht, corporateContact, corporateSeoPlans } from "@/lib/corporate-demo/packages";
import { CorporatePackagePrices } from "./PackagePrices";
import styles from "./corporate.module.css";

export function CorporateContact({ phone = true }: { phone?: boolean }) {
  return (
    <div className={styles.actions}>
      <a className={styles.primary} href={corporateContact.lineUrl}><MessageCircle size={18} aria-hidden="true" /> LINE {corporateContact.line}</a>
      {phone && <a className={styles.secondary} href={corporateContact.telephone}><Phone size={17} aria-hidden="true" /> {corporateContact.phone}</a>}
    </div>
  );
}

export function CorporatePackages() {
  return (
    <section id="packages" className={styles.offer}>
      <div className={styles.wrap}>
        <h2>เลือกขนาดเว็บไซต์ให้ตรงกับธุรกิจ</h2>
        <CorporatePackagePrices />
        <div className={styles.advancedOffer}>
          <div>
            <h3>Corporate Advanced SEO</h3>
            <p>สำหรับเว็บที่มีเนื้อหาเกิน 40 หน้า หรือมีหลายบริการ หลายพื้นที่ และแคตตาล็อกขนาดใหญ่ วางกลุ่มคำค้น ผังหน้า และแผนเชื่อมโยงเนื้อหาตามขอบเขตจริง</p>
          </div>
          <a href={corporateContact.lineUrl} className={styles.secondary}>สอบถามราคา SEO ขั้นสูง</a>
        </div>
        <p className={styles.terms}>สลับจำนวนหน้าบริการ ผลงาน และพื้นที่ได้ตามธุรกิจภายในจำนวนหน้ารวม ใช้รูปแบบจากเว็บตัวอย่างและปรับให้ตรงแบรนด์ลูกค้า โดเมน โฮสติ้ง ค่าต่ออายุ ภาษาเพิ่ม และระบบเฉพาะจะระบุในใบเสนอราคาก่อนเริ่มงาน</p>
        <section id="seo-care" className={styles.seoCare} aria-labelledby="seo-care-heading">
          <h2 id="seo-care-heading">ดูแล SEO และเขียนบทความรายเดือน</h2>
          <p className={styles.lead}>บริการหลังเปิดเว็บสำหรับธุรกิจที่ต้องการปรับเนื้อหาต่อเนื่องและตอบคำถามลูกค้าให้ครบขึ้น</p>
          <div className={styles.seoCareGrid}>
            {corporateSeoPlans.map(plan => (
              <article className={styles.priceCard} key={plan.name}>
                <h3>{plan.name}</h3>
                <p className={styles.price}><span>฿{baht(plan.price)}</span> / เดือน</p>
                <p>{plan.description}</p>
                <ul>{plan.work.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
                <a href={corporateContact.lineUrl} className={styles.secondary}>สอบถาม{plan.name}</a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export function CorporateClosing() {
  return (
    <section className={styles.closing}>
      <div className={styles.wrap}>
        <h2>คุยกับ PuchUp เรื่องเว็บบริษัทของคุณ</h2>
        <p>ส่งประเภทธุรกิจ บริการหลัก และตัวอย่างที่ชอบ ทีมจะช่วยวางขอบเขตหน้าเว็บและจำนวนเนื้อหาให้ตรงกับงาน</p>
        <CorporateContact />
        <Link className={styles.inline} href="/corporate/#industries">ดูสายงานทั้งหมด</Link>
      </div>
    </section>
  );
}
