import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorporateClosing, CorporateContact, CorporatePackages } from "@/components/corporate/Offer";
import styles from "@/components/corporate/corporate.module.css";
import { corporateNiches, findNiche } from "@/lib/corporate-demo/catalog";
import { corporateGroups, demoHref, flagshipSites, saleHref } from "@/lib/corporate-demo/collection";
import { companyDetails, companyImage } from "@/lib/corporate-demo/demo";
import { websiteCopy } from "@/lib/corporate-demo/website-copy";

type Props = { params: Promise<{ niche: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return corporateNiches.map(({ slug: niche }) => ({ niche }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const niche = findNiche((await params).niche);
  if (!niche) notFound();
  const copy = websiteCopy[niche.slug];
  const title = copy
    ? `รับทำเว็บไซต์${copy.business} และปรับเว็บเดิม`
    : `รับทำเว็บไซต์สำหรับธุรกิจ${niche.title} พร้อม SEO`;
  const description = copy ? `รับ${copy.intro}` : niche.offer;
  return { title, description, alternates: { canonical: saleHref(niche.slug) }, openGraph: { title, description, images: [companyImage(niche.slug)] } };
}

export default async function SalePage({ params }: Props) {
  const niche = findNiche((await params).niche);
  if (!niche) notFound();
  const hasDemo = flagshipSites.some(slug => slug === niche.slug);
  const company = companyDetails[niche.slug];
  const copy = websiteCopy[niche.slug];
  const demo = demoHref(niche.slug);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image src={companyImage(niche.slug)} alt="" fill preload sizes="100vw" />
        <div className={styles.wrap}>
          <div className={styles.heroCopy}>
            <Link href="/corporate/" className={styles.crumb}>PuchUp Corporate</Link>
            <p className={styles.eyebrow}>{corporateGroups[niche.group - 1]}</p>
            <h1 className={styles.saleTitle}>{copy ? `รับทำเว็บไซต์${copy.business}` : `รับทำเว็บไซต์สำหรับธุรกิจ${niche.title}`}</h1>
            <p>{copy?.intro ?? niche.offer}</p>
            <div className={styles.actions}>
              {hasDemo && <Link className={styles.primary} href={demo}>เปิดเว็บตัวอย่าง</Link>}
              <a className={hasDemo ? styles.outline : styles.primary} href="#packages">ดูแพ็กเกจและราคา</a>
              {copy && <a className={styles.outline} href="#redesign">ปรับเว็บไซต์เดิม</a>}
            </div>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.wrap}>
          <h2>สิ่งที่ลูกค้าควรเห็นก่อนติดต่อ</h2>
          <p className={styles.lead}>{copy
            ? `วางหน้าเว็บให้${niche.audience} เห็นข้อมูลที่ใช้ตัดสินใจและส่งรายละเอียดที่ทีมคุณใช้ประเมินงานได้`
            : `ออกแบบสำหรับ${niche.audience} โดยให้ลูกค้าเห็นข้อมูลสำคัญก่อนส่งบรีฟ`}</p>
          <div className={styles.process}>
            <div><h3>หน้าบริการที่ค้นหาได้</h3><ul>{niche.services.map(service => <li key={service}>{service}</li>)}</ul></div>
            <div><h3>ผลงานที่ใช้ตัดสินใจ</h3><p>{niche.evidence}</p></div>
            <div><h3>ฟอร์มที่ทีมประเมินใช้ต่อได้</h3><ul>{niche.brief.map(field => <li key={field}>{field}</li>)}</ul></div>
          </div>
          {hasDemo && <div className={styles.proof}>
            <Image src={companyImage(niche.slug, "work")} alt={`ภาพประกอบเว็บตัวอย่าง${niche.title}`} width={640} height={360} sizes="(max-width: 740px) 100vw, 44vw" />
            <div>
              <p className={styles.eyebrow}>เว็บไซต์ตัวอย่าง · กรณีจำลอง</p>
              <h3>{company?.brand ?? "ยกงาน เครน"}</h3>
              <p>{company?.description ?? niche.offer}</p>
              <div className={styles.links}>
                <Link href={`${demo}projects/`}>ดูตัวอย่างหน้าผลงาน</Link>
                <Link href={`${demo}quote/`}>ลองฟอร์มขอราคา</Link>
              </div>
            </div>
          </div>}
          {!copy && <CorporateContact />}
        </div>
      </section>
      {copy && (
        <section id="redesign" className={`${styles.section} ${styles.websiteOptions}`}>
          <div className={styles.wrap}>
            <h2>ทำเว็บไซต์ใหม่หรือปรับเว็บไซต์เดิม</h2>
            <div className={`${styles.process} ${styles.websiteOptionsGrid}`}>
              <div><h3>เริ่มทำเว็บไซต์ใหม่</h3><p>{copy.newSite}</p></div>
              <div><h3>ปรับเว็บไซต์ที่มีอยู่</h3><p>{copy.redesign}</p></div>
            </div>
            <p className={styles.terms}>สงสัยว่าใช้โดเมนเดิมได้ไหม ส่ง URL มาให้เราดูได้ครับ เราจะตรวจสิทธิ์เข้าถึงโดเมนและหน้าเดิมที่ควรเก็บ ถ้าจำเป็นต้องเปลี่ยน URL จะวางแผนให้ลิงก์เดิมส่งต่อไปยังหน้าที่เกี่ยวข้องก่อนเปิดเว็บใหม่</p>
            <CorporateContact />
          </div>
        </section>
      )}
      <CorporatePackages />
      <CorporateClosing />
    </div>
  );
}
