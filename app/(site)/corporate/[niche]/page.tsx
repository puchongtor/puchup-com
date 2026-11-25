import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorporateClosing, CorporateContact, CorporatePackages } from "@/components/corporate/Offer";
import styles from "@/components/corporate/corporate.module.css";
import { corporateNiches, findNiche } from "@/lib/corporate-demo/catalog";
import { corporateGroups, demoHref, flagshipSites, saleHref } from "@/lib/corporate-demo/collection";
import { companyDetails, companyImage } from "@/lib/corporate-demo/demo";

type Props = { params: Promise<{ niche: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return corporateNiches.map(({ slug: niche }) => ({ niche }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const niche = findNiche((await params).niche);
  if (!niche) notFound();
  const title = `รับทำเว็บไซต์สำหรับธุรกิจ${niche.title} พร้อม SEO`;
  return { title, description: niche.offer, alternates: { canonical: saleHref(niche.slug) }, openGraph: { title, description: niche.offer, images: [companyImage(niche.slug)] } };
}

export default async function SalePage({ params }: Props) {
  const niche = findNiche((await params).niche);
  if (!niche) notFound();
  const hasDemo = flagshipSites.some(slug => slug === niche.slug);
  const company = companyDetails[niche.slug];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image src={companyImage(niche.slug)} alt="" fill preload sizes="100vw" />
        <div className={styles.wrap}>
          <div className={styles.heroCopy}>
            <Link href="/corporate/" className={styles.crumb}>PuchUp Corporate</Link>
            <p className={styles.eyebrow}>{corporateGroups[niche.group - 1]}</p>
            <h1 className={styles.saleTitle}>รับทำเว็บไซต์สำหรับธุรกิจ{niche.title}</h1>
            <p>{niche.offer}</p>
            <div className={styles.actions}>{hasDemo && <Link className={styles.primary} href={demoHref(niche.slug)}>เปิดเว็บตัวอย่าง</Link>}<a className={hasDemo ? styles.outline : styles.primary} href="#packages">ดูแพ็กเกจและราคา</a></div>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.wrap}>
          <h2>สิ่งที่ลูกค้าควรเห็นก่อนติดต่อ</h2>
          <p className={styles.lead}>ออกแบบสำหรับ{niche.audience} โดยให้ลูกค้าเห็นข้อมูลสำคัญก่อนส่งบรีฟ</p>
          <div className={styles.process}>
            <div><h3>หน้าบริการที่ค้นหาได้</h3><ul>{niche.services.map(service => <li key={service}>{service}</li>)}</ul></div>
            <div><h3>ผลงานที่ใช้ตัดสินใจ</h3><p>{niche.evidence}</p></div>
            <div><h3>ฟอร์มที่ทีมประเมินใช้ต่อได้</h3><ul>{niche.brief.map(field => <li key={field}>{field}</li>)}</ul></div>
          </div>
          {company && <div className={styles.proof}>
            <Image src={companyImage(niche.slug, "work")} alt={`ภาพประกอบเว็บตัวอย่าง${niche.title}`} width={640} height={360} sizes="(max-width: 740px) 100vw, 44vw" />
            <div><p className={styles.eyebrow}>ดูโครงจากเว็บตัวอย่าง</p><h3>{company.brand}</h3><p>{company.description}</p><Link className={styles.inline} href={demoHref(niche.slug)}>ลองเปิดดูหน้าบริการและผลงาน</Link></div>
          </div>}
          <CorporateContact />
        </div>
      </section>
      <CorporatePackages />
      <CorporateClosing />
    </div>
  );
}
