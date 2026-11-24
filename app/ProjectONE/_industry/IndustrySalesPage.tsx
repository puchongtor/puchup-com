import { SiteFooter } from "@/components/SiteFooter";
import { industryPages } from "./content";
import { SalesHeader } from "./SalesHeader";
import type { SalesContent } from "./sales-content";
import styles from "./sales.module.css";

type Industry = (typeof industryPages)[number];
type SalesExample = { name: string; path: string; image: string; kind: string; description: string };
const assetBase = "/images/project-one/sales/";
const plans = [
  { name: "Starter Web", price: "9,900", size: "เว็บไซต์หน้าเดียว" },
  { name: "Get Local Customers", price: "12,900", size: "หน้าเดียว + Google Business" },
  { name: "Local SEO Site", price: "17,900", size: "เว็บไซต์ไม่เกิน 10 หน้า" },
  { name: "Local SEO Plus", price: "24,900", size: "เว็บไซต์ไม่เกิน 40 หน้า" },
];

function LineButton({ label }: { label: string }) {
  return <a className={styles.primary} href="https://line.me/R/ti/p/@masterpuch" target="_blank" rel="noopener noreferrer">{label}</a>;
}

export function IndustrySalesPage({ industry, sales, additionalExamples = [] }: {
  industry: Industry;
  sales: SalesContent;
  additionalExamples?: SalesExample[];
}) {
  const { demo } = industry;
  const starterImage = assetBase + sales.theme + "-starter.webp";
  const expandedImage = assetBase + sales.theme + "-plus.webp";
  const examples = [
    { name: sales.starter.title, path: sales.starter.path, image: starterImage, kind: "Starter Web · เว็บไซต์ตัวอย่างหน้าเดียว", description: sales.starter.detail },
    { name: demo.name, path: demo.path, image: expandedImage, kind: "Local SEO Plus · เว็บไซต์ตัวอย่างหลายหน้า", description: sales.expanded },
    ...additionalExamples,
  ];
  const setup = [
    ["สรุปขอบเขตจากงานจริง", sales.intake],
    ["ตรวจแบบก่อนเปิดใช้", "ดูตัวอย่างหน้าบนมือถือ ตรวจข้อมูลธุรกิจ ราคา เงื่อนไข รูป และข้อความที่จะส่งเข้า LINE ให้ตรงกับวิธีที่ทีมของคุณทำงาน"],
    ["ทดลองเส้นทางของลูกค้า", "ทดสอบตั้งแต่เปิดหน้าที่คนใช้ค้น ไปจนถึงกดแผนที่ โทร หรือส่งคำขอ และตกลงวิธีดูแลข้อมูลหลังเว็บไซต์เปิดใช้งาน"],
  ];
  return (
    <>
    <div className={styles.page} data-theme={sales.theme}>
      <SalesHeader evidence="workflow" />
      <main>
        <section className={styles.hero}><div className={styles.wrap}>
          <div>
            <p className={styles.kicker}>{industry.title}</p>
            <h1>{sales.headline[0]}<br />{sales.headline[1]}</h1>
            <p className={styles.promise}>{sales.promise}</p>
            <p>{sales.intro}</p>
            <div className={styles.actions}><a className={styles.primary} href="#examples">ดูหน้าเว็บที่เราทำ</a><a className={styles.textLink} href="#workflow">ดูขั้นตอนที่ลูกค้าใช้</a></div>
          </div>
          <figure className={styles.heroImage}>
            <img src={expandedImage} alt={"ภาพหน้าแรกเว็บไซต์ตัวอย่าง " + demo.name} width={1100} height={697} fetchPriority="high" />
            <figcaption><strong>{demo.name}</strong><span>เว็บไซต์ตัวอย่างหลายหน้า</span></figcaption>
          </figure>
        </div></section>

        <section id="examples" className={styles.section}><div className={styles.wrap}>
          <div className={styles.heading}><h2>เห็นหน้าเว็บก่อนเลือกแพ็กเกจ</h2><p>ลองเทียบเว็บไซต์หน้าเดียวกับเว็บไซต์ที่แยกข้อมูลตามสิ่งที่ลูกค้าต้องการดู</p></div>
          <div className={styles.previewGrid} data-three={examples.length === 3 || undefined}>{examples.map(item => (
            <article className={styles.previewCard} key={item.path}>
              <div className={styles.previewImage}><img src={item.image} alt={"ภาพหน้าแรก " + item.name} width={1100} height={697} loading="lazy" /></div>
              <div className={styles.previewCopy}><p className={styles.kicker}>{item.kind}</p><h3>{item.name}</h3><p>{item.description}</p><a className={styles.textLink} href={item.path} target="_blank" rel="noopener noreferrer">เปิดเว็บตัวอย่าง {item.name}</a></div>
            </article>
          ))}</div>
        </div></section>

        <section id="workflow" className={styles.dark}><div className={styles.wrap}>
          <div className={styles.caseGrid}>
            <div>
              <p className={styles.kicker}>ขั้นตอนที่ทดลองได้ในเว็บ</p>
              <h2>{sales.flowTitle}</h2><p>{sales.flow}</p>
              <ul className={styles.requestSample}>{sales.sample.map(item => <li key={item}>{item}</li>)}</ul>
              <p className={styles.flowNote}>{sales.confirmation}</p>
            </div>
            <div className={styles.flowCard}><h3>ลองใช้เว็บ {demo.name}</h3>
              <ul>{demo.pages.map(([path, name, detail]) => <li key={path}><a href={demo.path + path} target="_blank" rel="noopener noreferrer"><strong>{name}</strong><span>{detail}</span></a></li>)}</ul>
            </div>
          </div>
        </div></section>

        {sales.realWork && <section className={styles.section}><div className={styles.wrap}>
          <div className={styles.example}>
            <img src={sales.realWork.image} alt={"ภาพเว็บไซต์ " + sales.realWork.nameTh} loading="lazy" />
            <div><p className={styles.kicker}>ผลงานที่เปิดใช้งานจริง</p><h2>{sales.realWork.nameTh}</h2><p>{sales.realWork.summary}</p>
              <div className={styles.actions}><a className={styles.textLink} href={sales.realWork.url} target="_blank" rel="noopener noreferrer">เปิดดูเว็บไซต์ที่พักจริง</a></div>
            </div>
          </div>
        </div></section>}

        <section id="seo" className={styles.tinted}><div className={styles.wrap}>
          <div className={styles.heading}><h2>วางเว็บไซต์ให้ค้นเจอและรู้ว่าลูกค้าไปต่อไหม</h2><p>{industry.problem[1]}</p></div>
          <div className={styles.proofGrid}>
            <article><h3>วาง Local SEO จากบริการและพื้นที่จริง</h3><p>{sales.search}</p></article>
            <article><h3>ดูผลจากคำค้น การติดต่อ และงานที่ยืนยัน</h3><p>{sales.measure}</p></article>
          </div>
          <div className={styles.detailsGrid}>{industry.features.map(([heading, detail]) => <article key={heading}><h3>{heading}</h3><p>{detail}</p></article>)}</div>
          <div className={styles.actions}><LineButton label="คุยเรื่องเว็บไซต์ของคุณทาง LINE OA" /></div>
        </div></section>

        <section className={styles.section}><div className={styles.wrap}>
          <div className={styles.heading}><h2>ตั้งแต่รับโจทย์จนถึงส่งมอบ</h2></div>
          <ol className={styles.steps}>{setup.map(([name, detail]) => <li key={name}><h3>{name}</h3><p>{detail}</p></li>)}</ol>
        </div></section>

        <section id="pricing" className={styles.tinted}><div className={styles.wrap}>
          <div className={styles.heading}><h2>ราคาและขอบเขตของแต่ละแพ็กเกจ</h2><p>เลือกตามจำนวนหน้าและงาน Google Business ที่ต้องการ ทุกแพ็กเกจรวมโดเมน .com โฮสติ้ง และ SSL ปีแรก</p></div>
          <div className={styles.prices}>{plans.map((plan, index) => (
            <article className={styles.plan} key={plan.name} data-featured={index === 2 || undefined}><p className={styles.planSize}>{plan.size}</p><h3>{plan.name}</h3><p className={styles.price}>฿{plan.price}</p><p>{sales.scope[index]}</p></article>
          ))}</div>
          <div className={styles.costs}>
            <div><h3>ค่าใช้จ่ายตั้งแต่ปีที่ 2</h3><p>ต่ออายุโดเมน โฮสติ้ง และ SSL ฿2,500 ต่อปี</p></div>
            <div><h3>ดูแล SEO ต่อเนื่องตามต้องการ</h3><p>฿3,500 ต่อเดือน หรือ ฿7,500 สำหรับ 3 เดือน</p></div>
          </div>
          <p className={styles.flowNote}>หลายสาขา หลายภาษา และการเชื่อมระบบจองหรือระบบรับคิวเดิม จะสรุปขอบเขตและราคาในใบเสนอราคาก่อนเริ่ม</p>
        </div></section>

        <section id="faq" className={styles.section}><div className={styles.wrap}><div className={styles.faq}>
          <h2>คำถามก่อนเริ่มทำเว็บไซต์</h2>
          {industry.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          <details><summary>ถ้ามีเพจหรือเว็บไซต์เดิม ต้องเตรียมอะไรให้ทีมดู?</summary><p>{sales.intake} ถ้ามีเว็บเดิม ส่ง URL และแจ้งหน้าที่ต้องการเก็บไว้ด้วย</p></details>
        </div></div></section>

        <section id="contact" className={styles.dark}><div className={styles.wrap}><div className={styles.contact}>
          <div><h2>{industry.contactTitle}</h2><p>{industry.brief}</p></div>
          <div className={styles.actions}><LineButton label="ขอใบเสนอราคาทาง LINE OA" /><a className={styles.lightLink} href="tel:0880899895">โทร 088-089-9895</a></div>
        </div></div></section>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
