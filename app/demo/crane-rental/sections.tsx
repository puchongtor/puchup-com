import Image from "next/image";
import Link from "next/link";
import { caseStudyImage } from "@/lib/corporate-demo/project-media";
import { href, projectLocations } from "./data";
import { mediaPath, pagePhoto, type CraneClip } from "./media";
import styles from "./demo.module.css";

export function CardList({ group, entries }: { group: string; entries: { slug: string; title: string; intro: string }[] }) {
  return (
    <div className={styles.grid}>
      {entries.map(entry => {
        const image = pagePhoto(entry.slug);
        const src = group === "projects" ? caseStudyImage("crane", entry.slug) : image && mediaPath + image[0];
        const location = group === "projects" ? projectLocations[entry.slug] : undefined;
        return (
          <Link href={href(`${group}/${entry.slug}`)} className={styles.card} key={entry.slug}>
            {src && <Image className={styles.cardPhoto} src={src} alt="" width={640} height={360} sizes="(max-width: 680px) 100vw, 33vw" />}
            <div className={styles.cardBody}>
              {location && <div className={styles.projectLocation}>{location}</div>}
              <h3>{entry.title}</h3><p>{entry.intro}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function ClipGallery({ items }: { items: CraneClip[] }) {
  if (!items.length) return null;
  return (
    <section className={styles.clipGallery} aria-label="คลิปสาธิต">
      <h2>คลิปตัวอย่างหน้างาน</h2>
      <p>ภาพจำลองสร้างด้วย AI เพื่อประกอบเว็บไซต์ตัวอย่าง</p>
      <div className={styles.clipGrid}>
        {items.map(clip => (
          <figure className={styles.clip} key={clip.file}>
            <video controls muted playsInline preload="none" poster={mediaPath + clip.poster[0]} aria-label={clip.title}>
              <source src={mediaPath + clip.file} type="video/mp4" />
              เบราว์เซอร์นี้เล่นวิดีโอไม่ได้
            </video>
            <figcaption>{clip.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function QuoteCallout({ topic }: { topic?: string }) {
  return (
    <section className={styles.callout}>
      <div className={styles.container}>
        <div><h2>ให้ทีมประเมินจากหน้างาน</h2><p>เตรียมน้ำหนัก พิกัด และวันใช้งาน เพื่อเริ่มขอใบเสนอราคา</p></div>
        <Link href={topic ? `${href("quote")}?work=${encodeURIComponent(topic)}` : href("quote")} className={styles.button}>ส่งรายละเอียดงาน</Link>
      </div>
    </section>
  );
}
