import { getCaseStory } from "@/lib/case-stories";
import { SiteFooter } from "@/components/SiteFooter";
import { dental } from "../_industry/content";
import { SalesHeader } from "../_industry/SalesHeader";
import { serviceMetadata } from "../_industry/ServicePage";
import styles from "../_industry/sales.module.css";

export const metadata = serviceMetadata({
  ...dental,
  description: "รับทำเว็บไซต์คลินิกทันตกรรม เริ่ม 9,900 บาท เทียบ 4 แพ็กเกจ ดูตัวอย่างเว็บคลินิกทำฟันและจัดฟัน พร้อม Local SEO, Google Maps และปุ่มนัดทาง LINE OA",
});

const line = "https://line.me/R/ti/p/@masterpuch";
const example = dental.demo;
const caseStudy = getCaseStory("baandental-local-seo-first-week");
const metrics = caseStudy?.stats.slice(1, 4);
const baanDentalHome = "/images/cases/baandental/website-hero.png";
const previews = [
  { name: "บ้านฟันดี", label: "Starter Web · ตัวอย่างเว็บไซต์หน้าเดียว", image: "/images/project-one/dental-starter-home.webp", href: "/ProjectONE/dental/", description: "รวมบริการ ราคา ทีมหมอ แผนที่ และปุ่มนัดไว้ในหน้าเดียว เหมาะกับคลินิกที่ต้องการลิงก์เดียวให้คนไข้เปิดจาก LINE หรือโฆษณา" },
  { name: "บ้านทันตแพทย์ สาธุประดิษฐ์", label: "Local SEO Site · เว็บไซต์คลินิกที่เปิดใช้จริง", image: baanDentalHome, href: caseStudy?.siteUrl ?? "https://www.baandental.com/", description: "มีทางเข้าแยกตามบริการและข้อมูลที่คนไข้ค้น ตั้งแต่ราคาค่ารักษา ทีมทันตแพทย์ ไปจนถึงการเดินทางและปุ่มนัดทาง LINE" },
];
const packages = [
  { name: "Starter Web", price: "9,900", size: "เว็บไซต์หน้าเดียว", fit: "คลินิกที่มี Google Maps อยู่แล้ว และต้องการลิงก์หลักสำหรับ LINE หรือโฆษณา", includes: ["รวมบริการเด่น ราคาเริ่มต้น และข้อมูลคลินิก", "ปุ่มนัดทาง LINE โทร และเปิดแผนที่", "ข้อมูลคลินิกแบบมีโครงสร้างสำหรับ Google"] },
  { name: "Get Local Customers", price: "12,900", size: "เว็บไซต์หน้าเดียว + Google Business", fit: "คลินิกที่ต้องการเริ่มทำเว็บพร้อมจัดข้อมูลบน Google Maps", includes: ["ครบจาก Starter Web", "ช่วยตั้งค่าหรือปรับ Google Business Profile", "เชื่อมเว็บกับหมุด และจัดทำป้าย QR สำหรับรีวิว"] },
  { name: "Local SEO Site", price: "17,900", size: "เว็บไซต์ไม่เกิน 10 หน้า", fit: "คลินิกที่อยากให้คนไข้ค้นเจอจากหลายบริการ และอ่านข้อมูลก่อนนัด", includes: ["ครบจาก Get Local Customers", "แยกหน้าบริการ ราคา ทีมทันตแพทย์ และการเดินทาง", "วางคำค้นตามบริการและพื้นที่ พร้อมลิงก์เชื่อมระหว่างหน้า"] },
  { name: "Local SEO Plus", price: "24,900", size: "เว็บไซต์ไม่เกิน 40 หน้า", fit: "คลินิกหลายสาขา หรือคลินิกที่มีบริการหลายกลุ่มและต้องการเนื้อหาเชิงลึก", includes: ["ครบจาก Local SEO Site", "แยกหน้าสาขาและบริการตามขอบเขตงาน", "เพิ่มหน้าคำถามและบทความตามคำค้นที่เกี่ยวข้องกับบริการจริง"] },
];

const patientJourney = [
  ["เจอคลินิกตอนกำลังค้นหา", "แยกหน้าตามบริการที่มีจริง เช่น จัดฟัน ขูดหินปูน หรือรากฟันเทียม ใช้ชื่อย่านและข้อมูลสาขาที่ตรงกับ Google Maps เพื่อช่วยให้คนไข้ไปถึงหน้าที่เกี่ยวข้อง"],
  ["เห็นข้อมูลพอจะตัดสินใจ", "แต่ละหน้าตอบให้ชัดว่ามีบริการอะไร ราคาเริ่มต้นเท่าไร ใครเป็นผู้ดูแล และสาขาไหนให้บริการ พร้อมเงื่อนไขโปรโมชันเมื่อคลินิกมีรายการจริง"],
  ["ทักนัดจากหน้าที่กำลังดู", "วางทางไป LINE OA และโทรให้กดได้ง่ายบนมือถือ ทีมคลินิกคุยเรื่องบริการและสาขาที่คนไข้สนใจต่อได้ในแชต"],
];

const setup = [
  ["สรุปขอบเขตและราคา", "ส่งชื่อคลินิก ย่านหรือจำนวนสาขา และบริการที่อยากเน้น เราจะสรุปแพ็กเกจ รายการส่งมอบ และสิ่งที่ต้องเตรียมก่อนเริ่ม"],
  ["ออกแบบและตรวจข้อมูล", "จัดหน้าให้เข้ากับแบรนด์และรูปคลินิก คุณตรวจบริการ ราคา ข้อมูลทันตแพทย์ และเงื่อนไขก่อนเผยแพร่"],
  ["เปิดเว็บและทดสอบทางนัด", "ตรวจบนมือถือ ทดสอบปุ่ม LINE โทร และแผนที่ แล้วส่งมอบข้อมูลสำหรับดูแลเว็บไซต์ต่อ"],
];

const questions = [
  ["คลินิกเพิ่งเปิด เลือกแพ็กเกจไหนดี?", "ถ้าต้องการเว็บไซต์หน้าเดียวและมีหมุดพร้อมแล้ว เริ่มจาก Starter Web ได้ หากต้องตั้งค่าหมุดพร้อมเว็บ เลือก Get Local Customers ส่วนคลินิกที่อยากแยกหน้าบริการตั้งแต่ต้นเหมาะกับ Local SEO Site"],
  ["มีเว็บเดิมอยู่แล้ว ใช้โดเมนเดิมได้ไหม?", "ใช้โดเมนเดิมได้เมื่อมีสิทธิ์จัดการ ก่อนย้ายจะดูว่าหน้าไหนมีคนเข้าและกำหนด URL ที่ควรเก็บหรือเปลี่ยนเส้นทาง"],
  ["ถ้ามีหลายสาขา สามารถแยก Google Maps และ LINE ได้ไหม?", "แยกข้อมูลและแผนที่ตามสาขาได้ และเลือกใช้ LINE OA กลางหรือแยกบัญชีตามสาขา ขอบเขตการดูแล Google Business หลายหมุดจะสรุปในใบเสนอราคา"],
  ["ต้องเตรียมอะไรบ้างก่อนเริ่ม?", "เตรียมโลโก้ ภาพคลินิก รายการบริการ ราคาและเงื่อนไข โปรไฟล์ทันตแพทย์ เวลาเปิด และลิงก์ LINE OA ทีมจะใช้ข้อมูลที่คลินิกยืนยันก่อนเผยแพร่"],
  ["เชื่อมระบบจองเดิมได้ไหม?", "วางปุ่มไปยังระบบจองเดิมได้ ส่วนการแสดงคิวว่างหรือแลกข้อมูลกับระบบคลินิกต้องตรวจความสามารถของระบบเดิมและประเมินขอบเขตเพิ่ม"],
  ["ทำ SEO แล้วใช้เวลานานแค่ไหน?", "ขึ้นกับคู่แข่งในย่าน สภาพเว็บเดิม และคำค้น เราวัดจากการแสดงผลและคลิกใน Search Console ควบคู่กับจำนวนผู้สอบถามที่คลินิกติดตามได้"],
];

function Steps({ items }: { items: readonly (readonly string[])[] }) {
  return <ol className={styles.steps}>{items.map(([title, detail]) => <li key={title}><h3>{title}</h3><p>{detail}</p></li>)}</ol>;
}

function LineButton({ label }: { label: string }) {
  return <a className={styles.primary} href={line} target="_blank" rel="noopener noreferrer">{label}</a>;
}

export default function DentalClinicWebsitePage() {
  return (
    <>
    <div className={styles.page}>
      <SalesHeader evidence="results" />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <div>
              <p className={styles.kicker}>รับทำเว็บไซต์คลินิกทันตกรรม</p>
              <h1>จากคนค้นหาหมอฟัน<br />ถึงคนทักนัดคลินิกคุณ</h1>
              <p className={styles.promise}>คนไข้ดูบริการ ราคา และทางมาได้ก่อนทัก</p>
              <p>Project ONE ออกแบบเว็บคลินิกทำฟันและจัดฟันให้ทำงานร่วมกับ Google Maps และ LINE OA ตั้งแต่เว็บหน้าเดียวสำหรับคลินิกเปิดใหม่ ไปจนถึงเว็บหลายสาขาที่วาง Local SEO ตามบริการและทำเล</p>
              <div className={styles.actions}><a className={styles.primary} href="#examples">ดูหน้าเว็บที่เราทำ</a><a className={styles.textLink} href="#results">ดูผลตอบรับจากคลินิกจริง</a></div>
            </div>
            <figure className={styles.heroImage}>
              <img src={baanDentalHome} alt="ภาพหน้าแรกเว็บไซต์บ้านทันตแพทย์ สาธุประดิษฐ์" fetchPriority="high" />
              <figcaption><strong>บ้านทันตแพทย์ สาธุประดิษฐ์</strong><span>เว็บไซต์คลินิกที่เปิดใช้จริง</span></figcaption>
            </figure>
          </div>
        </section>

        <section id="examples" className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.heading}><h2>เห็นหน้าเว็บก่อนเลือกแพ็กเกจ</h2><p>เทียบหน้าแรกของเว็บคลินิกหน้าเดียวกับงาน Local SEO ที่เปิดใช้งานจริง</p></div>
            <div className={styles.previewGrid}>{previews.map(item => (
              <article className={styles.previewCard} key={item.name}>
                <div className={styles.previewImage}><img src={item.image} alt={"ภาพหน้าแรกเว็บไซต์" + item.name} loading="lazy" /></div>
                <div className={styles.previewCopy}><p className={styles.kicker}>{item.label}</p><h3>{item.name}</h3><p>{item.description}</p><a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>เปิดเว็บ{item.name}</a></div>
              </article>
            ))}</div>
          </div>
        </section>

        {caseStudy && metrics && <section id="results" className={styles.dark}>
          <div className={styles.wrap}>
            <div className={styles.caseGrid}>
              <div>
                <p className={styles.kicker}>ผลตอบรับจากคลินิกจริง</p>
                <h2>บ้านทันตแพทย์ สาธุประดิษฐ์</h2>
                <p>ในสัปดาห์แรกหลังเปิดเว็บ เริ่มพบคำค้นบริการทันตกรรมคู่กับชื่อย่าน และมีผู้สนใจทัก LINE OA เพื่อสอบถามนัดหมาย</p>
                <dl className={styles.metrics}>{metrics.map(({ label, value, note }) => <div key={label}><dt>{label}</dt><dd>{value}<span>{note}</span></dd></div>)}</dl>
                <p className={styles.caseNote}>ตัวเลขการแสดงผลและคลิกมาจากช่วง 24 ชั่วโมงที่บันทึกในสัปดาห์แรก ส่วนจำนวนผู้ทักเป็นข้อมูลจากช่วงสัปดาห์แรกของเคสนี้ ผลขึ้นกับคำค้น พื้นที่ และการแข่งขันของแต่ละคลินิก</p>
                <a className={styles.lightLink} href={caseStudy.siteUrl} target="_blank" rel="noopener noreferrer">เปิดเว็บไซต์บ้านทันตแพทย์</a>
              </div>
              <figure><img src="/images/cases/baandental/gsc-24h.png" alt="รายงาน Google Search Console ของบ้านทันตแพทย์ แสดง 149 การแสดงผลและ 3 คลิก" loading="lazy" /><figcaption>ข้อมูลจาก Google Search Console ของคลินิกในช่วงที่บันทึกผล</figcaption></figure>
            </div>
          </div>
        </section>}

        <section className={styles.tinted}>
          <div className={styles.wrap}>
            <div className={styles.heading}><h2>ทำไมเว็บนี้ถึงช่วยให้คลินิกรับนัดได้</h2><p>เราออกแบบจากสิ่งที่คนไข้ต้องตัดสินใจจริง แล้วเชื่อม Google Search, เว็บไซต์ และ LINE OA เข้าด้วยกัน เพื่อให้ทุกขั้นมีทางไปต่อ</p></div>
            <Steps items={patientJourney} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.example}>
              <img src={example.image} alt={example.alt} loading="lazy" />
              <div><p className={styles.kicker}>ตัวอย่างเว็บสำหรับคลินิกสองสาขา</p><h2>เมื่อข้อมูลแต่ละสาขาต้องชัด</h2><p>ไลเนรา เดนทัล แสดงวิธีจัดบริการ ราคา ทีมหมอ และแผนที่แยกตามสาขา คนไข้เปิดดูสาขาที่สะดวกและไปต่อถึงการนัดได้จากหน้าที่กำลังอ่าน</p>
                <ul>{example.pages.map(([path, label]) => <li key={path}><a href={example.path + path} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul>
                <a className={styles.primary} href={example.path} target="_blank" rel="noopener noreferrer">เปิดเว็บคลินิกตัวอย่าง</a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.tinted}>
          <div className={styles.wrap}><div className={styles.heading}><h2>เริ่มงานและส่งมอบอย่างไร</h2></div><Steps items={setup} /></div>
        </section>

        <section id="pricing" className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.heading}><h2>ราคาและสิ่งที่ได้ในแต่ละแพ็กเกจ</h2><p>เทียบจากจำนวนหน้าและงาน Google Business ที่คลินิกต้องการ ทั้งสี่แพ็กเกจรวมโดเมน .com, โฮสติ้ง และ SSL สำหรับปีแรก</p></div>
            <div className={styles.prices}>{packages.map((plan, index) => (
              <article className={styles.plan} data-featured={index === 2 || undefined} key={plan.name}>
                <p className={styles.planSize}>{plan.size}</p><h3>{plan.name}</h3>
                <p className={styles.price}>฿{plan.price}</p><p>{plan.fit}</p>
                <ul>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}</div>
            <div className={styles.costs}>
              <div><h3>ค่าใช้จ่ายตั้งแต่ปีที่ 2</h3><p>ต่ออายุโดเมน โฮสติ้ง และ SSL ฿2,500 ต่อปี</p></div>
              <div><h3>ดูแล SEO ต่อเนื่องตามต้องการ</h3><p>฿3,500 ต่อเดือน หรือ ฿7,500 สำหรับ 3 เดือน รวมติดตามคำค้น อัปเดตเนื้อหาและข้อมูลบน Google Maps ตามรอบ</p></div>
            </div>
            <div className={styles.priceContact}><p>หลายสาขา หลายภาษา หรือเชื่อมระบบนัดหมายเดิม สามารถขอราคาตามขอบเขตงานได้</p><LineButton label="ปรึกษาแพ็กเกจทาง LINE OA" /></div>
          </div>
        </section>

        <section id="faq" className={styles.section}>
          <div className={styles.wrap}><div className={styles.faq}>
            <h2>คำถามก่อนจ้างทำเว็บคลินิก</h2>
            {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div></div>
        </section>

        <section id="contact" className={styles.dark}>
          <div className={styles.wrap}><div className={styles.contact}>
            <div><h2>เริ่มจากบริการที่อยากให้คนไข้หาเจอ</h2><p>ส่งชื่อคลินิก ย่าน จำนวนสาขา และลิงก์เพจหรือเว็บเดิมถ้ามี เราจะช่วยเลือกแพ็กเกจและสรุปราคาตามงานก่อนตัดสินใจ</p></div>
            <div className={styles.actions}><LineButton label="ขอใบเสนอราคาทาง LINE OA" /><a className={styles.lightLink} href="tel:0880899895">โทร 088-089-9895</a></div>
          </div></div>
        </section>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
