import type { Metadata } from "next";
import Link from "next/link";
import styles from "./aeropulse.module.css";

export const metadata: Metadata = {
  title: "AeroPulse — AI Bike Shopping Experience | PuchUp",
  description: "สำรวจ AeroPulse ตัวอย่างระบบช่วยเลือกจักรยานจาก PuchUp ที่เปลี่ยนการเลือกสินค้าซับซ้อนให้เป็นประสบการณ์ที่เข้าใจง่าย",
};

const steps = [
  { n: "01", title: "เริ่มจากคน ไม่ใช่สเปก", text: "ลูกค้าบอกงบ เส้นทาง และประสบการณ์ ผ่านคำถามสั้น ๆ หรือพูดคุยกับผู้ช่วย" },
  { n: "02", title: "ค้นพบรุ่นที่เหมาะ", text: "ระบบช่วยคัดจักรยานที่ตรงโจทย์ พร้อมเหตุผลประกอบการแนะนำที่เข้าใจง่าย" },
  { n: "03", title: "มั่นใจก่อนตัดสินใจ", text: "เปรียบเทียบตัวเลือก ดูรายละเอียด และตรวจสอบไซซ์หรือสต็อกในระบบตัวอย่าง" },
  { n: "04", title: "ส่งต่อให้ร้านอย่างลื่นไหล", text: "สรุปความต้องการส่งต่อทาง LINE เพื่อให้ทีมร้านพูดคุยต่อได้อย่างมีบริบท" },
];

const bikes = [
  { image: "/images/products/shopguide/sg-bike-aero.jpg", label: "SPEED / PERFORMANCE", title: "Aero", text: "สำหรับคนที่มองหาความเร็วและความคล่องตัว" },
  { image: "/images/products/shopguide/sg-bike-endurance.jpg", label: "COMFORT / DISTANCE", title: "Endurance", text: "สำหรับการปั่นไกลที่อยากให้ทุกระยะสบายขึ้น" },
  { image: "/images/products/shopguide/sg-bike-gravel.jpg", label: "FREEDOM / ADVENTURE", title: "Gravel", text: "สำหรับเส้นทางที่ไม่ได้มีแค่ถนนเรียบ" },
];

export default function AeroPulsePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <Link href="/showcase/" className={styles.back}>← กลับไป Showcase</Link>
          <div className={styles.heroMain}>
            <p className={styles.eyebrow}><span /> PUCHUP SHOWCASE / SHOPGUIDE</p>
            <h1>THE RIGHT BIKE.<br /><em>THE RIGHT RIDE.</em></h1>
            <div className={styles.heroBottom}>
              <div><p className={styles.heroThai}>จักรยานที่ใช่<br />เริ่มจากการเข้าใจคนปั่น</p><p className={styles.heroDesc}>AeroPulse Bike Studio คือเว็บไซต์ตัวอย่างที่เปลี่ยนคำถามเรื่องจักรยาน ให้กลายเป็นประสบการณ์เลือกสินค้าที่สนุกและเข้าใจง่าย</p></div>
              <a href="https://aeropulse.puchup.com" target="_blank" rel="noreferrer" className={styles.primary}>สำรวจ AeroPulse <span>↗</span></a>
            </div>
          </div>
          <div className={styles.heroFoot}><span>AN AI-ASSISTED SHOPPING EXPERIENCE</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
      </section>

      <div className={styles.ticker} aria-hidden="true"><span>DISCOVER YOUR RIDE</span><b>✳</b><span>MADE FOR EVERY RIDER</span><b>✳</b><span>DISCOVER YOUR RIDE</span><b>✳</b><span>MADE FOR EVERY RIDER</span></div>

      <section className={styles.intro}>
        <div><p className={styles.kicker}>THE CHALLENGE <span>01 / 04</span></p><h2>จักรยานมีหลายรุ่น<br /><em>แต่คำตอบที่ใช่มีแค่คุณ</em></h2></div>
        <div className={styles.introText}><p>เสือหมอบหรือกราเวล? เฟรมแบบไหน? งบเท่านี้ควรเริ่มจากรุ่นไหนดี?</p><p>เมื่อข้อมูลมีมาก การเลือกอาจกลายเป็นเรื่องยาก AeroPulse จึงออกแบบให้ลูกค้าเริ่มจากสิ่งที่ตัวเองรู้ดีอยู่แล้ว — <strong>อยากปั่นแบบไหน</strong> — แล้วให้ระบบช่วยพาไปต่อ</p><Link href="/shopguide/">รู้จัก ShopGuide <span>↗</span></Link></div>
      </section>

      <section className={styles.experience}>
        <div className={styles.experienceHead}><div><p className={styles.kicker}>THE EXPERIENCE <span>02 / 04</span></p><h2>FROM QUESTION<br /><em>TO CONFIDENCE.</em></h2></div><p>จากคำถามแรก สู่บทสนทนากับร้าน<br />ทุกขั้นตอนออกแบบมาให้ไปต่อได้ง่ายขึ้น</p></div>
        <div className={styles.screenWrap}>
          <div className={styles.screenBar}><div><i /><i /><i /></div><span>AEROPULSE / BIKE FINDER</span><span>INTERACTIVE DEMO</span></div>
          <img src="/images/products/shopguide/aeropulse-finder.png" alt="ตัวอย่างหน้าระบบค้นหาจักรยาน AeroPulse" loading="lazy" />
          <div className={styles.screenCaption}><span>01 — DISCOVER YOUR MATCH</span><a href="https://aeropulse.puchup.com" target="_blank" rel="noreferrer">ทดลองระบบจริง ↗</a></div>
        </div>
        <div className={styles.steps}>{steps.map((step) => <article key={step.n}><span>{step.n} /</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className={styles.bikeSection}>
        <div className={styles.sectionHead}><div><p className={styles.kicker}>FIND YOUR STYLE <span>03 / 04</span></p><h2>ONE PASSION.<br /><em>YOUR OWN WAY.</em></h2></div><p>ทุกคนมีเส้นทางของตัวเอง<br />หน้าร้านก็ควรช่วยค้นหาสิ่งที่เหมาะกับแต่ละคน</p></div>
        <div className={styles.bikeGrid}>{bikes.map((bike) => <article className={styles.bikeCard} key={bike.title}><div className={styles.bikeImage}><img src={bike.image} alt={`ตัวอย่างจักรยานประเภท ${bike.title}`} loading="lazy" /><span>↗</span></div><p>{bike.label}</p><h3>{bike.title}</h3><div>{bike.text}</div></article>)}</div>
        <p className={styles.disclaimer}>ภาพและข้อมูลแสดงแนวคิดของเว็บไซต์ตัวอย่าง ไม่ใช่การรับประกันความพร้อมของสินค้า</p>
      </section>

      <section className={styles.closing}>
        <div className={styles.closingImage} />
        <div className={styles.closingContent}><p className={styles.kicker}>YOUR NEXT MOVE <span>04 / 04</span></p><h2>MAKE EVERY<br /><em>CHOICE COUNT.</em></h2><p>เมื่อลูกค้าเข้าใจตัวเลือกได้ง่ายขึ้น<br />การเริ่มต้นบทสนทนากับร้านก็ง่ายขึ้นเช่นกัน</p><div className={styles.actions}><a href="https://aeropulse.puchup.com" target="_blank" rel="noreferrer" className={styles.primary}>เปิดตัวอย่าง AeroPulse <span>↗</span></a><Link href="/contact/" className={styles.outline}>พูดคุยกับ PuchUp <span>↗</span></Link></div><p className={styles.small}>AeroPulse เป็นเว็บไซต์ตัวอย่างเพื่อแสดงแนวทางการทำงานของ ShopGuide</p></div>
      </section>
    </div>
  );
}
