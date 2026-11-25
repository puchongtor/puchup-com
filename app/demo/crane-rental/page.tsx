import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, MapPin, ShieldCheck, Truck } from "lucide-react";
import { areas, guides, href, projects, services } from "./data";
import { clips } from "./media";
import { CardList, ClipGallery, QuoteCallout } from "./sections";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "เช่ารถเครนและรถเฮี๊ยบสำหรับโรงงานและไซต์ก่อสร้าง",
  description: "ดูรถเครน รถเฮี๊ยบ บริการยกและขนย้าย พื้นที่ให้บริการ และวิธีเตรียมบรีฟขอราคาสำหรับงานโรงงานและไซต์ก่อสร้าง",
  alternates: { canonical: href() },
  robots: { index: true, follow: true },
};

export default function CraneHome() {
  return (
    <>
      <section className={styles.hero}>
        <Image src="/images/demos/crane-rental/mobile-crane.webp" alt="ภาพประกอบรถเครนเคลื่อนที่ในลานโรงงาน" fill sizes="100vw" preload />
        <div className={styles.container}>
          <p className={styles.kicker}>งานยก · ขนย้าย · ติดตั้ง</p>
          <h1>รถเครนและรถเฮี๊ยบ<br />สำหรับงานโรงงาน<br />และไซต์ก่อสร้าง</h1>
          <p className={styles.heroIntro}>เริ่มจากน้ำหนักของ พิกัด และวันใช้งาน เพื่อให้ทีมประเมินประเภทรถและเตรียมใบเสนอราคาได้ตรงกับงาน</p>
          <div className={styles.actions}>
            <Link data-puchup-demo-action href={href("quote")} className={styles.button}>ส่งรายละเอียดขอราคา</Link>
            <Link href={href("fleet")} className={styles.outline}>ดูรถและอุปกรณ์</Link>
          </div>
        </div>
      </section>
      <div className={styles.shortcuts}>
        <div className={styles.container}>
          <Link href={href("fleet")}><Truck aria-hidden="true" /> เลือกประเภทรถ</Link>
          <Link href={href("areas")}><MapPin aria-hidden="true" /> ดูพื้นที่ให้บริการ</Link>
          <Link href={href("safety")}><ShieldCheck aria-hidden="true" /> เตรียมเอกสารเข้าไซต์</Link>
          <Link data-puchup-demo-action href={href("quote")}><ClipboardList aria-hidden="true" /> เตรียมบรีฟหน้างาน</Link>
        </div>
      </div>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>เลือกรถตามลักษณะงาน</h2>
          <div className={styles.featureGrid}>
            <Link href={href("mobile")} className={styles.feature}>
              <Image src="/images/demos/crane-rental/mobile-crane.webp" alt="" width={850} height={475} sizes="(max-width: 680px) 100vw, 50vw" />
              <div><h3>รถเครนเคลื่อนที่</h3><p>งานยก ติดตั้ง และจัดวางเครื่องจักรหรือโครงสร้าง</p><span>ดูรถเครนเคลื่อนที่</span></div>
            </Link>
            <Link href={href("hiab")} className={styles.feature}>
              <Image src="/images/demos/crane-rental/truck-loader.webp" alt="" width={850} height={475} sizes="(max-width: 680px) 100vw, 50vw" />
              <div><h3>รถเฮี๊ยบ</h3><p>รถบรรทุกติดเครน สำหรับงานยกขึ้นรถและขนต่อ</p><span>ดูรถเฮี๊ยบ</span></div>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.tinted}>
        <div className={styles.container}>
          <h2>บริการตามลักษณะงาน</h2>
          <CardList group="services" entries={services} />
        </div>
      </section>
      <section className={styles.section} id="why-choose-us" aria-labelledby="why-choose-title">
        <div className={`${styles.container} ${styles.whyGrid}`}>
          <div>
            <h2 id="why-choose-title">ทำไมต้องเลือกเรา</h2>
            <p className={styles.whyIntro}>ดูขั้นตอนที่ช่วยให้ฝ่ายจัดซื้อและทีมหน้างานคุยกันได้ชัด ตั้งแต่ขอราคาไปจนถึงเตรียมรถเข้าไซต์</p>
            <dl className={styles.whyPoints}>
              <div><dt>เริ่มจากโจทย์ยกก่อนเลือกรถ</dt><dd>ทวนจุดรับ จุดวาง ระยะยก และทางเข้า เพื่อระบุข้อมูลที่ต้องตรวจเพิ่มก่อนยืนยันรถ</dd></div>
              <div><dt>เห็นขอบเขตที่ต้องจ่ายก่อนตัดสินใจ</dt><dd>ขอให้ใบเสนอราคาระบุทีม อุปกรณ์ เวลาที่รวม และเงื่อนไขค่ารอ เพื่อให้ฝ่ายจัดซื้อเทียบราคาได้</dd></div>
              <div><dt>เตรียมข้อมูลเข้าไซต์ไว้ล่วงหน้า</dt><dd>ประสานผู้ดูแลพื้นที่เรื่องปฐมนิเทศ เอกสารรถ และเวลาที่ไซต์พร้อมก่อนนัดวันทำงาน</dd></div>
            </dl>
            <Link className={styles.textLink} href={href("safety")}>ดูรายการเตรียมเอกสารเข้าไซต์</Link>
          </div>
          <Image src="/images/demos/crane-rental/site-survey.webp" alt="ภาพประกอบทีมสำรวจพื้นที่หน้าโกดัง" className={styles.whyPhoto} width={1344} height={756} sizes="(max-width: 680px) 100vw, 46vw" />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>กรณีตัวอย่างหน้างาน</h2>
          <CardList group="projects" entries={projects.slice(0, 3)} />
          <Link className={styles.textLink} href={href("projects")}>ดูกรณีตัวอย่างทั้งหมด</Link>
        </div>
      </section>
      <div className={styles.tinted}>
        <div className={styles.container}><ClipGallery items={Object.values(clips)} /></div>
      </div>
      <section className={styles.tinted}>
        <div className={styles.container}>
          <h2>พื้นที่ให้บริการ</h2>
          <div className={styles.chips}>{areas.map(area => <Link key={area.slug} href={href(`areas/${area.slug}`)}><MapPin size={18} aria-hidden="true" />{area.title}</Link>)}</div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>เตรียมตัวก่อนจ้างรถเครน</h2>
          <CardList group="guides" entries={guides.slice(0, 3)} />
          <Link className={styles.textLink} href={href("guides")}>เปิดคลังความรู้หน้างาน</Link>
        </div>
      </section>
      <QuoteCallout />
    </>
  );
}
