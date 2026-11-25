import Image from "next/image";
import Link from "next/link";
import { areaContent } from "./areas";
import { href } from "./data";
import { mediaPath } from "./media";
import { QuoteCallout } from "./sections";
import styles from "./demo.module.css";

export function CraneAreaView({ slug, name }: { slug: string; name: string }) {
  const area = areaContent[slug];
  return (
    <>
      <div className={styles.section}>
        <div className={`${styles.container} ${styles.areaContent}`}>
          <figure className={styles.articleCover}>
            <Image src={`${mediaPath}area-${slug}-work.webp`} alt={area.coverAlt} width={1344} height={756} sizes="(max-width: 900px) 100vw, 950px" loading="eager" />
            <figcaption>ภาพจำลองลักษณะพื้นที่และงานยก</figcaption>
          </figure>
          <section className={styles.areaBlock}>
            <h2>โซนที่ควรระบุเมื่อส่งพิกัดใน{name}</h2>
            <p className={styles.areaTags}>{area.landmarks.map(location => <span key={location}>{location}</span>)}</p>
          </section>
          <section className={styles.areaBlock}>
            <h2>ลักษณะงานที่ต้องวางแผนก่อนจองรถ</h2>
            <div className={styles.areaCases}>{area.useCases.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
          </section>
          <section className={styles.areaBlock}>
            <h2>คุยกับทีมหน้างานก่อนขอราคา</h2>
            <ul className={styles.areaChecklist}>{area.brief.map(item => <li key={item}>{item}</li>)}</ul>
            <Link className={styles.textLink} href={href("guides/quote-checklist")}>เปิดรายการเตรียมข้อมูลขอราคา</Link>
          </section>
          <section className={styles.areaBlock}>
            <h2>กรณีศึกษาใน{name}</h2>
            <p>{area.caseStudy}</p>
            <figure>
              <Image src={`${mediaPath}area-${slug}-client.webp`} alt={area.clientAlt} width={1344} height={756} sizes="(max-width: 900px) 100vw, 950px" />
              <figcaption>ภาพจำลองการประสานงานกับเจ้าของพื้นที่ สร้างด้วย AI</figcaption>
            </figure>
            <Link className={styles.textLink} href={href(`services/${area.service}`)}>ดูบริการที่เกี่ยวข้อง</Link>
            {area.reference && <p className={styles.areaReference}><a href={area.reference.url}>{area.reference.label}</a></p>}
          </section>
        </div>
      </div>
      <QuoteCallout topic={`งานยกและขนย้ายใน${name}`} />
    </>
  );
}
