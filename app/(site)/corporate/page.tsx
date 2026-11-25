import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, Search, Workflow } from "lucide-react";
import { CorporateClosing, CorporateContact, CorporatePackages } from "@/components/corporate/Offer";
import { CorporatePromotionLink } from "@/components/corporate/PackagePrices";
import styles from "@/components/corporate/corporate.module.css";
import { corporateNiches, findNiche } from "@/lib/corporate-demo/catalog";
import { corporateGroups, demoHref, flagshipSites, saleHref } from "@/lib/corporate-demo/collection";
import { companyImage } from "@/lib/corporate-demo/demo";
import { baht, corporatePackages } from "@/lib/corporate-demo/packages";
import { corporateProof } from "@/lib/products/corporate";

export const metadata: Metadata = {
  title: "รับทำเว็บไซต์บริษัทแยกตามสายงาน พร้อม SEO | Corporate",
  description: `เลือกเว็บบริษัทตามธุรกิจจาก 72 สายงาน แพ็กเกจ 10, 20 และ 40 หน้า วาง SEO พื้นฐานครบทุกหน้า ราคาเริ่มต้น ${baht(corporatePackages[0].price)} บาท มีบริการดูแลเว็บไซต์และเขียนบทความรายเดือน`,
  alternates: { canonical: "/corporate/" },
};

const work = [
  { icon: Search, title: "ศึกษางานจริงของแต่ละวงการ", body: "ดูว่าลูกค้าใช้ข้อมูลอะไรเลือกผู้ให้บริการ ตั้งแต่ภาพหน้างาน วัสดุ สเปก ไปจนถึงพื้นที่รับงาน" },
  { icon: Workflow, title: "ออกแบบเว็บให้ดูบริการและขอราคาได้ง่าย", body: "เชื่อมบริการกับผลงาน บทความและพื้นที่ แล้วจัดฟอร์มให้เก็บข้อมูลที่ทีมประเมินงานใช้จริง" },
  { icon: ClipboardCheck, title: "ตรวจให้ครบก่อนส่งมอบ", body: "เช็กการอ่านบนมือถือ ลิงก์ติดต่อ ภาพ คลิป และข้อมูลค้นหาของแต่ละหน้า เพื่อให้ทีมลูกค้าใช้ต่อได้" },
];

export default function CorporatePage() {
  return (
    <div className={styles.page}>
      <CorporatePromotionLink />
      <section className={styles.hero}>
        <Image src="/images/products/corporate/hero.jpg" alt="" fill preload sizes="100vw" />
        <div className={styles.wrap}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>PuchUp Corporate</p>
            <h1>เว็บไซต์บริษัท<br />ที่ลูกค้าดูแล้ว<br />รู้ว่าจะจ้างยังไง</h1>
            <p>แยกบริการ โชว์งานจริง และรับบรีฟขอราคาในแบบที่ตรงกับธุรกิจคุณ เลือกดูเว็บตัวอย่างก่อนตัดสินใจ</p>
            <div className={styles.actions}><a href="#industries" className={styles.primary}>เลือกตามสายงาน</a><a href="#packages" className={styles.outline}>ดูแพ็กเกจและราคา</a></div>
          </div>
        </div>
      </section>
      <section className={styles.section} id="industries">
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>เว็บไซต์ตัวอย่าง</p>
          <h2>เลือกดูตามธุรกิจของคุณ</h2>
          <p className={styles.lead}>เปิดเว็บตัวอย่างเพื่อลองเลือกบริการ ดูผลงานตามพื้นที่ และลองกรอกข้อมูลที่ลูกค้าต้องส่งก่อนประเมินงาน</p>
          <div className={styles.flagships}>
            {flagshipSites.map(slug => {
              const niche = findNiche(slug);
              if (!niche) return null;
              return <article className={styles.flagship} key={slug}>
                <Link href={demoHref(slug)} tabIndex={-1} aria-hidden="true"><Image className={styles.flagshipImage} src={companyImage(slug)} alt="" width={680} height={383} sizes="(max-width: 690px) 100vw, (max-width: 880px) 50vw, 33vw" /></Link>
                <div className={styles.flagshipBody}>
                  <div><p className={styles.category}>{corporateGroups[niche.group - 1]}</p><h3>{niche.title}</h3><p>{niche.offer}</p></div>
                  <div className={styles.links}><Link href={saleHref(slug)}>รายละเอียดและราคา <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href={demoHref(slug)}>เปิดเว็บตัวอย่าง <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
                </div>
              </article>;
            })}
          </div>
          <details className={styles.directory}>
            <summary>ดูครบทั้ง {corporateNiches.length} สายงาน</summary>
            <div className={styles.directoryGrid}>{corporateGroups.map((label, index) => <section key={label}><h3>{label}</h3><ul>{corporateNiches.filter(niche => niche.group === index + 1).map(niche => <li key={niche.slug}><Link href={saleHref(niche.slug)}>{niche.title}</Link></li>)}</ul></section>)}</div>
          </details>
        </div>
      </section>
      <CorporatePackages />
      <section className={styles.section}>
        <div className={styles.wrap}>
          <h2>ขั้นตอนทำเว็บไซต์บริษัท</h2>
          <div className={styles.process}>{work.map(({ icon: Icon, title, body }) => <div key={title}><Icon size={25} aria-hidden="true" /><h3>{title}</h3><p>{body}</p></div>)}</div>
          <div className={styles.proof}>
            <Image src={corporateProof.image} alt="หน้าเว็บไซต์อุตสาหกรรม Advance Pro" width={560} height={330} sizes="(max-width: 740px) 100vw, 44vw" />
            <div><p className={styles.eyebrow}>เว็บลูกค้าที่เปิดใช้งานจริง</p><h3>{corporateProof.name} · {corporateProof.nameTh}</h3><p>{corporateProof.summary}</p><a className={styles.inline} href={corporateProof.url}>ดูเว็บไซต์ Advance Pro <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
          <CorporateContact />
        </div>
      </section>
      <CorporateClosing />
    </div>
  );
}
