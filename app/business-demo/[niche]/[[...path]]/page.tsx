import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { companyAreaImage, companyDetails, companyImage, companyMedia, demoEntries, demoPageHref, demoSections, detailKeys, editorialImage, findCompany, sectionKeys, serviceImage, type DetailKey, type SectionKey } from "@/lib/corporate-demo/demo";
import { caseStudyImage } from "@/lib/corporate-demo/project-media";
import { companyVideos, type CompanyVideo } from "@/lib/corporate-demo/videos";
import { BriefForm } from "../brief-form";
import styles from "../showroom.module.css";

type Props = { params: Promise<{ niche: string; path?: string[] }> };
type DemoEntry = { slug: string; title: string; body?: string; story?: string; location?: string; example?: [string, string, string] };
const words = new Intl.Segmenter("th", { granularity: "word" });

function excerpt(text: string, limit = 180) {
  const firstParagraph = text.split("\n\n")[0];
  if (firstParagraph.length <= limit) return firstParagraph;
  let result = "";
  for (const { segment } of words.segment(firstParagraph)) {
    if (result.length + segment.length > limit) break;
    result += segment;
  }
  return result.trimEnd() + "…";
}

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(companyDetails).flatMap(niche => {
    const entries = demoEntries(niche);
    if (!entries) return [];
    return [
      { niche, path: [] },
      ...sectionKeys.map(section => ({ niche, path: [section] })),
      ...detailKeys.flatMap(section => entries[section].map(item => ({ niche, path: [section, item.slug] }))),
    ];
  });
}

function resolve(niche: string, path: string[]) {
  const company = findCompany(niche);
  const entries = demoEntries(niche);
  if (!company || !entries || path.length > 2) notFound();
  const sections = demoSections(company.details);
  const section = path[0] as SectionKey | undefined;
  if (section && !Object.hasOwn(sections, section)) notFound();
  const detail = section && detailKeys.includes(section as DetailKey) ? entries[section as DetailKey] : [];
  const item: DemoEntry | undefined = detail.find(entry => entry.slug === path[1]);
  if (path[1] && !item) notFound();
  const title = item ? (section === "areas" ? `${company.niche.title} ${item.title}` : item.title) : section ? sections[section] : company.details.headline;
  const description = item?.body ? excerpt(item.body) : item?.story ?? (item ? `ข้อมูลวางแผน${title} พร้อมสิ่งที่ต้องเตรียมและกรณีศึกษาที่เกี่ยวข้อง` : company.details.description);
  return { ...company, entries, sections, section, item, title, description, detail };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche, path = [] } = await params;
  const { details, title, description, section, item } = resolve(niche, path);
  const url = demoPageHref(niche, ...path);
  let image = companyImage(niche, section === "about" ? "team" : "cover");
  if (section === "field-notes" && item) image = editorialImage(niche, item.slug);
  if (section === "projects" && item) image = caseStudyImage(details.asset, item.slug);
  if (section === "services" && item) image = serviceImage(details.asset, item.slug).src;
  if (section === "areas" && !item) image = companyAreaImage(niche);
  return {
    title: `${title} | ${details.brand}`,
    description,
    robots: { index: section !== "quote", follow: section !== "quote" },
    alternates: { canonical: url },
    openGraph: { title, description, url, type: section === "field-notes" && item ? "article" : "website", images: [image] },
  };
}

function Grid({ niche, section, items, hideImageFor }: { niche: string; section: DetailKey; items: DemoEntry[]; hideImageFor?: string }) {
  const asset = companyDetails[niche]?.asset;
  return (
    <div className={styles.grid}>
      {items.map(entry => {
        const image = section === "field-notes" ? editorialImage(niche, entry.slug)
          : section === "projects" && asset ? caseStudyImage(asset, entry.slug)
          : section === "services" && asset ? serviceImage(asset, entry.slug).src : undefined;
        return (
          <Link key={entry.slug} href={demoPageHref(niche, section, entry.slug)} className={styles.card}>
            {image && entry.slug !== hideImageFor && <Image className={styles.cardImage} src={image} alt="" width={720} height={405} sizes="(max-width: 680px) 100vw, 33vw" />}
            <div className={styles.cardBody}>
              {entry.location && <p className={styles.kicker}>{entry.location}</p>}
              <h3>{entry.title}</h3>
              {entry.body && <p>{excerpt(entry.body, 145)}</p>}
              {entry.story && <p>{entry.story}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function Photo({ niche, alt, work }: { niche: string; alt: string; work?: boolean }) {
  return <Image className={styles.photo} src={companyImage(niche, work ? "work" : "cover")} alt={alt} width={1344} height={756} sizes="(max-width: 760px) 100vw, 850px" />;
}

function VideoPreview({ asset, niche, clip }: { asset: string; niche: string; clip: CompanyVideo }) {
  const source = `${companyMedia}videos/${asset}/${clip.id}`;
  return (
    <figure className={styles.clip}>
      <video controls muted playsInline preload="none" poster={asset === "pest" ? companyImage(niche, "work") : `${source}.webp`} aria-label={clip.title}>
        <source src={asset === "pest" ? `${companyMedia}pest.mp4` : `${source}.mp4`} type="video/mp4" />
      </video>
      <figcaption>{clip.title} · วิดีโอจำลองจาก AI</figcaption>
    </figure>
  );
}

export default async function CompanyDemoPage({ params }: Props) {
  const { niche: slug, path = [] } = await params;
  const { niche, details, entries, sections, section, item, title, description, detail } = resolve(slug, path);
  const link = (...segments: string[]) => demoPageHref(slug, ...segments);
  const check = <ul className={styles.checklist}>{details.checklist.map(label => <li key={label}>{label}</li>)}</ul>;
  const steps = <ol className={styles.steps}>{details.process.map(([label, body]) => <li key={label}><h3>{label}</h3><p>{body}</p></li>)}</ol>;
  const video = companyVideos[details.asset];
  const clip = video ? <VideoPreview asset={details.asset} niche={slug} clip={video} /> : null;
  const callout = <section className={styles.callout}><div className={styles.wrap}><h2>เตรียมข้อมูลให้ทีมประเมินงาน</h2><Link className={styles.action} href={link("quote")}>สร้างบรีฟขอราคา</Link></div></section>;

  if (!section) return <>
    <section className={styles.hero}>
      <Image src={companyImage(slug)} alt={`ภาพประกอบ${niche.title}`} fill preload sizes="100vw" />
      <div className={styles.wrap}><div className={styles.heroCopy}><p>{niche.title}</p><h1>{title}</h1><p>{description}</p><div className={styles.actions}><Link className={styles.action} href={link("quote")}>ส่งบรีฟขอราคา</Link><Link className={styles.outline} href={link("projects")}>ดูกรณีศึกษา</Link></div></div></div>
    </section>
    <div className={styles.block}><div className={styles.wrap}>
      <HomeIntroSections {...{ niche, details, entries, steps, slug }} clip={clip ?? <Photo niche={slug} alt={`ภาพประกอบงาน${niche.title}`} work />} />
      <section><h2>{details.notebook}</h2><Grid niche={slug} section="field-notes" items={entries["field-notes"].slice(0, 3)} /><Link className={styles.inline} href={link("field-notes")}>อ่านหัวข้อทั้งหมด</Link></section>
      <section><h2>พื้นที่และข้อจำกัดหน้างาน</h2><Grid niche={slug} section="areas" items={entries.areas} /></section>
    </div></div>
    {callout}
  </>;

  const article = section === "field-notes" && item;
  const caseStudy = section === "projects" && item;
  const area = section === "areas" && item;
  const service = section === "services" && item;
  const servicePhoto = service ? serviceImage(details.asset, service.slug) : undefined;
  const areaOverview = section === "areas" && !item;
  const relatedProjects = item?.location ? entries.projects.filter(entry => entry.location !== item.location).slice(0, 3) : entries.projects.slice(0, 3);
  const articleExample = article ? entries.projects[entries["field-notes"].findIndex(entry => entry.slug === item.slug)] : undefined;
  const nearbyProjects = area ? entries.projects.filter(entry => entry.location.includes(item.title)).slice(0, 3) : [];
  const otherAreaExamples = area ? entries.projects.slice(entries.areas.findIndex(entry => entry.slug === item.slug) * 2).slice(0, 2) : [];
  const areaLead = nearbyProjects[0];
  const json = article && {
    "@context": "https://schema.org", "@type": "Article", headline: item.title, description, inLanguage: "th",
    image: [site.url + editorialImage(slug, item.slug), site.url + companyImage(slug, "work")], mainEntityOfPage: site.url + link(...path),
    author: { "@type": "Organization", name: "PuchUp", url: site.url },
  };

  return <>
    {json && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />}
    <header className={styles.pageHead}><div className={areaOverview ? `${styles.wrap} ${styles.areaHead}` : styles.wrap}>
      <div>
        <nav aria-label="เส้นทางหน้า"><Link href={link()}>หน้าแรก</Link>{item && <Link href={link(section)}>{sections[section]}</Link>}</nav>
        {item?.location && <p className={styles.kicker}>{item.location} · กรณีจำลอง</p>}
        <h1>{title}</h1>
        {!item && <p>{areaOverview ? `เลือกพื้นที่เพื่อดูตัวอย่างหน้างานและข้อมูลที่ควรเตรียมก่อนติดต่อทีม ${details.brand}` : details.description}</p>}
      </div>
      {areaOverview && (
        <figure>
          <Image className={styles.photo} src={companyAreaImage(slug)} alt={`ภาพประกอบประเภทพื้นที่สำหรับงาน${niche.title}`} width={1344} height={756} sizes="(max-width: 680px) 100vw, 560px" preload />
          <figcaption>ภาพประกอบลักษณะพื้นที่ให้บริการ สร้างด้วย AI</figcaption>
        </figure>
      )}
    </div></header>
    <div className={styles.block}><div className={styles.wrap}>
      {section === "quote" && <BriefForm fields={[...niche.brief, "ชื่อผู้ประสานงานหรือเบอร์ติดต่อกลับ"]} offer={`ขอข้อมูล${niche.title}`} />}
      {!item && detail.length > 0 && <>
        {areaOverview && <h2>เลือกพื้นที่หน้างาน</h2>}
        {section === "projects" && <p>แต่ละกรณีเป็นโจทย์สมมติ ระบุพื้นที่และเกณฑ์ที่ใช้ตรวจงานเพื่อให้เห็นวิธีประสานงาน</p>}
        <Grid niche={slug} section={section as DetailKey} items={detail} />
        {(section === "projects" || section === "services") && clip}
      </>}
      {section === "about" && (
        <article className={styles.copy}>
          <figure>
            <Image className={styles.photo} src={companyImage(slug, "team")} alt={`ภาพจำลองทีมงาน ${details.brand} ยืนเรียงกัน`} width={1360} height={760} sizes="(max-width: 900px) 100vw, 860px" />
            <figcaption>ภาพหมู่ทีมงานสมมติ สร้างด้วย AI</figcaption>
          </figure>
          <h2>การทำงานของทีม{details.brand}</h2>
          <p>{niche.evidence}</p>
          <h2>ลำดับการประสานงาน</h2>
          {steps}
          <h2>ขอบเขตที่ควรยืนยันกับทีม</h2>
          {check}
          <p>ค้นคว้ารูปแบบบริการจาก <a href={details.source.url}>{details.source.label}</a> บริษัทและกรณีในเว็บไซต์นี้เป็นข้อมูลสมมติ</p>
        </article>
      )}
      {section === "process" && (
        <>
          <article className={styles.copy}>
            <h2>จากข้อมูลหน้างานถึงการตรวจรับ</h2>
            {steps}
            <h2>รายการก่อนเริ่มงาน</h2>
            {check}
          </article>
          {clip && (
            <section className={styles.workVideo}>
              <h2>คลิปประกอบลักษณะงาน</h2>
              {clip}
            </section>
          )}
        </>
      )}
      {service && servicePhoto && (
        <article className={styles.copy}>
          <figure style={{ maxWidth: servicePhoto.width }}>
            <Image className={styles.photo} {...servicePhoto} alt={`ภาพจำลองบริการ ${service.title}`} sizes={`(max-width: 760px) 100vw, ${Math.min(servicePhoto.width, 860)}px`} />
            <figcaption>ภาพประกอบลักษณะงาน สร้างด้วย AI</figcaption>
          </figure>
          <h2>ขอบเขตและเกณฑ์ที่ใช้ประเมิน</h2>
          <p>{niche.evidence}</p>
          {item.example && <><h2>โจทย์ที่ใช้คุยก่อนเริ่ม</h2><p>{item.example[2]}</p></>}
          <h2>ข้อมูลที่ต้องเตรียม</h2>
          {check}{steps}
          <Link className={styles.inline} href={link("projects")}>ดูกรณีศึกษาที่เกี่ยวข้อง</Link>
        </article>
      )}
      {caseStudy && <article className={styles.copy}><figure><CasePhoto asset={details.asset} item={caseStudy} eager /><figcaption>ภาพจำลองกรณีศึกษา · {item.location} · สร้างด้วย AI</figcaption></figure><h2>โจทย์และเกณฑ์ตรวจรับ</h2><p>{item.story}</p><h2>จุดที่ทีมใช้ประสานกับเจ้าของพื้นที่</h2>{steps}<h2>กรณีอื่นที่นำไปเทียบได้</h2><Grid niche={slug} section="projects" items={relatedProjects} /></article>}
      {area && <article className={styles.copy}>
        {areaLead && <figure><CasePhoto asset={details.asset} item={areaLead} eager /><figcaption>ภาพจำลอง · {areaLead.title} · {areaLead.location}</figcaption></figure>}
        <h2>เตรียมข้อมูลหน้างานใน{item.title}</h2>
        <p>{details.description}</p>
        <p>ส่งพิกัดที่ทีมเข้าปฏิบัติงานจริง ช่วงเวลาที่เปิดพื้นที่ได้ และเงื่อนไขของผู้ดูแลอาคารหรือเจ้าของไซต์ พร้อมข้อมูลต่อไปนี้</p>
        {check}
        <h2>{nearbyProjects.length ? "กรณีสมมติในพื้นที่" : "กรณีสมมติที่ใช้เทียบขอบเขตได้"}</h2>
        <Grid niche={slug} section="projects" items={nearbyProjects.length ? nearbyProjects : otherAreaExamples} hideImageFor={areaLead?.slug} />
        <Link className={styles.inline} href={link("process")}>ดูว่าแต่ละฝ่ายต้องเตรียมอะไร</Link>
      </article>}
      {article && <article className={styles.copy}>
        <p className={styles.kicker}>เรียบเรียงโดย PuchUp</p>
        <Image className={styles.photo} src={editorialImage(slug, item.slug)} alt={`ภาพประกอบเรื่อง ${item.title}`} width={680} height={383} sizes="(max-width: 760px) 100vw, 850px" loading="eager" />
        <h2>สิ่งที่ต้องดูจากงานจริง</h2>
        {item.body?.split("\n\n").map(text => <p key={text}>{text}</p>)}
        <figure><Photo niche={slug} alt={`ภาพประกอบภายในคู่มือ${niche.title}`} work /><figcaption>ภาพประกอบลักษณะงาน สร้างด้วย AI</figcaption></figure>
        {articleExample && <><h2>ลองเทียบกับโจทย์หน้างาน</h2><p><strong>{articleExample.location}</strong> · {articleExample.story}</p><Link className={styles.inline} href={link("projects", articleExample.slug)}>อ่านกรณีศึกษานี้</Link></>}
        <h2>คำถามที่ควรถามก่อนยืนยันขอบเขต</h2>{check}
        <p><a href={details.source.url}>แหล่งอ้างอิงรูปแบบบริการ · {details.source.label}</a></p>
        <h2>หัวข้อที่ควรอ่านต่อ</h2><Grid niche={slug} section="field-notes" items={entries["field-notes"].filter(entry => entry.slug !== item.slug).slice(0,2)} />
      </article>}
    </div></div>
    {section !== "quote" && callout}
  </>;
}

function CasePhoto({ asset, item, eager }: { asset: string; item: DemoEntry; eager?: boolean }) {
  return <Image className={styles.photo} src={caseStudyImage(asset, item.slug)} alt={`ภาพจำลอง${item.title} ${item.location ?? ""}`.trim()} width={720} height={405} sizes="(max-width: 760px) 100vw, 850px" loading={eager ? "eager" : undefined} />;
}

function HomeIntroSections({ niche, details, entries, steps, clip, slug }: {
  niche: NonNullable<ReturnType<typeof findCompany>>["niche"];
  details: NonNullable<ReturnType<typeof findCompany>>["details"];
  entries: NonNullable<ReturnType<typeof demoEntries>>;
  steps: React.ReactNode; clip: React.ReactNode; slug: string;
}) {
  const blocks = {
    services: <section key="services"><h2>เลือกบริการตามงานของคุณ</h2><Grid niche={slug} section="services" items={entries.services} /></section>,
    process: <section key="process" className={styles.feature}><div><h2>ทำไมวางแผนกับ{details.brand}</h2><p>{niche.evidence}</p>{steps}<Link className={styles.inline} href={demoPageHref(slug, "about")}>ดูวิธีที่ทีมเตรียมงาน</Link></div>{clip}</section>,
    projects: <section key="projects"><h2>กรณีศึกษาที่อ้างอิงลักษณะพื้นที่</h2><p>โจทย์และสถานที่สมมติสำหรับให้เห็นขอบเขตงาน</p>
      {details.look === "portfolio" && <div className={styles.projectLead}><CasePhoto asset={details.asset} item={entries.projects[0]} /><div><h3>{entries.projects[0].title}</h3><p>{entries.projects[0].story}</p><Link className={styles.inline} href={demoPageHref(slug, "projects", entries.projects[0].slug)}>อ่านกรณีศึกษา · {entries.projects[0].location}</Link></div></div>}
      <Grid niche={slug} section="projects" items={entries.projects.slice(details.look === "portfolio" ? 1 : 0, details.look === "portfolio" ? 4 : 3)} /><Link className={styles.inline} href={demoPageHref(slug, "projects")}>ดูกรณีศึกษาทั้ง {entries.projects.length} งาน</Link></section>,
  };
  const order = {
    technical: ["services", "process", "projects"],
    editorial: ["process", "services", "projects"],
    portfolio: ["projects", "services", "process"],
    cinematic: ["process", "projects", "services"],
  } as const;
  return order[details.look].map(key => blocks[key]);
}
