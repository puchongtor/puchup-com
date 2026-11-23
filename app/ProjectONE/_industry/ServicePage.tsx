import type { Metadata } from "next";
import { industryPages } from "./content";
import styles from "./service.module.css";

type Industry = (typeof industryPages)[number];
const showroom = "/ProjectONE/demo/?format=plus";
const line = "https://line.me/R/ti/p/@masterpuch";
export const industryRoute = (slug: string) => `/ProjectONE/${slug}/`;

export function serviceMetadata(industry: Industry): Metadata {
  const path = industryRoute(industry.slug);
  return {
    title: { absolute: `${industry.title} | Project ONE by PuchUp` },
    description: industry.description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "th_TH",
      title: industry.title,
      description: industry.description,
      url: path,
      images: [{ url: industry.demo.image, alt: industry.demo.alt }],
    },
  };
}

export function ServicePage({ industry }: { industry: Industry }) {
  const { demo } = industry;
  const related = industryPages.filter((page) => page.slug !== industry.slug);
  return (
    <div className={styles.page} data-industry={industry.slug}>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <a className={styles.brand} href="/ProjectONE/">Project <strong>ONE</strong></a>
          <nav aria-label="Project ONE">
            <a href={showroom}>โชว์รูม</a>
            <a href="/ProjectONE/#pricing">แพ็กเกจ</a>
            <a className={styles.navContact} href="#contact">ขอใบเสนอราคา</a>
          </nav>
        </div>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <div>
              <p className={styles.label}>Project ONE / Local SEO Plus</p>
              <h1>{industry.title}</h1>
              <p className={styles.promise}>{industry.promise}</p>
              <p className={styles.intro}>{industry.intro}</p>
              <div className={styles.actions}>
                <a className={styles.primary} href={demo.path}>เปิดเว็บไซต์ตัวอย่าง <span aria-hidden="true">↗</span></a>
                <a className={styles.secondary} href="#contact">ขอใบเสนอราคา</a>
              </div>
              <p className={styles.audience}>{industry.audience}</p>
            </div>
            <figure className={styles.figure}>
              <img src={demo.image} alt={demo.alt} fetchPriority="high" />
              <figcaption><span>เว็บไซต์ตัวอย่าง</span><strong>{demo.name}</strong></figcaption>
            </figure>
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="features">
          <div className={styles.lead}>
            <h2 id="features">{industry.problem[0]}</h2>
            <p>{industry.problem[1]}</p>
          </div>
          <div className={styles.grid}>
            {industry.features.map(([heading, detail]) => (
              <article key={heading}>
                <h3>{heading}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.demo} aria-labelledby="demo">
          <div className={`${styles.wrap} ${styles.demoGrid}`}>
            <div>
              <h2 id="demo">ลองใช้งานเว็บ<br />{demo.name}</h2>
              <p>{demo.detail}</p>
              <div className={styles.actions}>
                <a className={styles.secondary} href={demo.path}>เปิดเว็บไซต์ตัวอย่างเต็ม <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <ul className={styles.demoLinks}>
              {demo.pages.map(([path, label, detail]) => (
                <li key={path}>
                  <a href={demo.path + path}>
                    <strong>{label}</strong>
                    <span>{detail}</span>
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {industry.caseStudy && (
          <aside className={`${styles.wrap} ${styles.section}`} aria-label="ผลงานจริง">
            <div className={styles.case}>
              <div>
                <p className={styles.label}>ผลงานจริงของ Project ONE</p>
                <h2>{industry.caseStudy.title}</h2>
                <p>{industry.caseStudy.detail}</p>
              </div>
              <a href={industry.caseStudy.href}>ดูผลงานและวิธีวัดผล <span aria-hidden="true">↗</span></a>
            </div>
          </aside>
        )}
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="questions">
          <h2 id="questions">คำถามก่อนเริ่มทำเว็บไซต์</h2>
          <div className={styles.faq}>
            {industry.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          {industry.guide && <div className={styles.actions}><a href={industry.guide[0]}>{industry.guide[1]} ↗</a></div>}
        </section>
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="contact">
          <div className={styles.contact}>
            <div>
              <h2 id="contact">{industry.contactTitle}</h2>
              <p>{industry.brief}</p>
            </div>
            <div className={styles.actions}>
              <a className={styles.primary} href={line}>ขอใบเสนอราคาทาง LINE <span aria-hidden="true">↗</span></a>
              <a href="tel:0880899895">โทร 088-089-9895</a>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <a href="/">PuchUp</a>
          <a href={showroom}>โชว์รูม Project ONE</a>
          {related.map((page) => <a key={page.slug} href={industryRoute(page.slug)}>{page.title}</a>)}
        </div>
      </footer>
    </div>
  );
}
