import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "@/lib/site";
import { caseStudyImage } from "@/lib/corporate-demo/project-media";
import { areaContent } from "../areas";
import { CraneAreaView } from "../area-view";
import { CraneArticleView } from "../article-view";
import { guides } from "../articles";
import { fleet, groups, href, overview, projectLocations } from "../data";
import { mediaPath, pageClips, pagePhoto } from "../media";
import { QuoteForm } from "../quote-form";
import { CardList, ClipGallery, QuoteCallout } from "../sections";
import { workDetails } from "../work-details";
import styles from "../demo.module.css";

type Props = { params: Promise<{ slug: string[] }> };
type OverviewSlug = keyof typeof overview;

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Object.keys(overview).map(slug => ({ slug: [slug] })),
    ...groups.flatMap(group => group.entries.map(entry => ({ slug: [group.slug, entry.slug] }))),
  ];
}

function findPage([section, detail, ...rest]: string[]) {
  if (rest.length || !Object.hasOwn(overview, section)) notFound();
  const slug = section as OverviewSlug;
  const group = groups.find(group => group.slug === slug);
  const entry = group?.entries.find(entry => entry.slug === detail);
  if (detail && !entry) notFound();
  const [title, intro] = overview[slug];
  const pageTitle = entry && slug === "areas" ? `เช่ารถเครนและรถเฮี๊ยบ ${entry.title}` : entry?.title ?? title;
  return { slug, group, entry, title: pageTitle, intro: entry?.intro ?? intro };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, entry, title, intro } = findPage((await params).slug);
  if (slug === "quote") return { title, description: intro };
  const path = href(entry ? `${slug}/${entry.slug}` : slug);
  const visual = pagePhoto(entry?.slug ?? slug);
  const images = slug === "projects" && entry
    ? [{ url: caseStudyImage("crane", entry.slug), alt: `ภาพจำลอง${title}`, width: 720, height: 405 }]
    : visual ? [{ url: mediaPath + visual[0], alt: visual[1], width: 1344, height: 756 }] : [];
  return {
    title,
    description: intro,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title, description: intro, type: slug === "guides" && entry ? "article" : "website", url: site.url + path, siteName: site.name, locale: "th_TH", images },
    twitter: { card: "summary_large_image", title, description: intro, images: images.map(image => image.url) },
  };
}

export default async function CraneDetailPage({ params }: Props) {
  const { slug, group, entry, title, intro } = findPage((await params).slug);
  const article = slug === "guides" && entry ? guides.find(guide => guide.slug === entry.slug) : undefined;
  const area = slug === "areas" && entry && areaContent[entry.slug] ? entry : undefined;
  const vehicleList = slug === "mobile" || slug === "hiab";
  const photo = pagePhoto(entry?.slug ?? slug);
  const projectLocation = slug === "projects" && entry ? projectLocations[entry.slug] : undefined;
  const nextGuide = slug === "hiab" || entry?.slug.startsWith("truck-") ? "truck-transport" : "quote-checklist";
  const hasCards = !entry && (group || vehicleList);
  return (
    <>
      <div className={styles.pageHero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="เส้นทางหน้า">
            <Link href={href()}>หน้าแรก</Link>
            {entry && group && <><span aria-hidden="true">/</span><Link href={href(group.slug)}>{group.label}</Link></>}
          </nav>
          {group && <p className={styles.kicker}>{group.label}</p>}
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </div>
      {article ? <CraneArticleView article={article} /> : area ? <CraneAreaView slug={area.slug} name={area.title} /> : <>
      <div className={styles.section}>
        <div className={styles.container}>
          {slug === "quote" && (
            <Suspense fallback={<p>กำลังเปิดแบบฟอร์ม…</p>}>
              <QuoteForm />
            </Suspense>
          )}
          {slug === "projects" && entry ? <figure className={styles.projectFigure}>
            <Image src={caseStudyImage("crane", entry.slug)} alt={`ภาพจำลอง${title} ${projectLocation ?? ""}`.trim()} width={720} height={405} sizes="(max-width: 720px) 100vw, 900px" loading="eager" />
            <figcaption>ภาพจำลองกรณีศึกษา · {projectLocation} · สร้างด้วย AI</figcaption>
          </figure> : photo && <Image className={styles.detailPhoto}
            src={mediaPath + photo[0]}
            alt={photo[1]}
            width={900} height={406} sizes="(max-width: 720px) 100vw, 900px" />}
          {slug === "fleet" && !entry && (
            <div className={styles.chips}>
              <Link href={href("mobile")}>ดูรถเครนเคลื่อนที่</Link>
              <Link href={href("hiab")}>ดูรถเฮี๊ยบ</Link>
            </div>
          )}
          {slug === "safety" && (
            <div className={styles.prose}>
              <h2>ข้อมูลจากเจ้าของพื้นที่</h2>
              <p>ขอรายการเอกสารจากผู้ดูแลไซต์ พร้อมแจ้งพิกัด รูปทางเข้า ลักษณะพื้น ตำแหน่งจอด และข้อจำกัดการทำงานในพื้นที่</p>
              <h2>ข้อมูลที่ขอจากผู้ให้บริการ</h2>
              <p>ขอรายละเอียดรถและผู้ปฏิบัติงานที่จะเข้าพื้นที่ รวมถึงเอกสารตรวจสภาพรถและเอกสารผู้ปฏิบัติงานตามรายการที่ไซต์กำหนด</p>
              <h2>ประสานแผนก่อนวันงาน</h2>
              <p>ยืนยันกำหนดการ ผู้รับผิดชอบ และการนัดสำรวจ หากไซต์ต้องใช้แผนงานยก ให้ประสานทีมผู้ให้บริการเพื่อจัดทำจากข้อมูลจริง</p>
              <h2>คำถามก่อนให้รถเข้าไซต์</h2>
              <dl className={styles.whyPoints}>
                <div><dt>ส่งเอกสารก่อนวันงานแค่ไหน</dt><dd>ขอวันปิดรับเอกสารจากผู้ดูแลไซต์ และเผื่อเวลาตรวจแก้หากต้องเปลี่ยนทะเบียนรถหรือผู้ปฏิบัติงาน</dd></div>
                <div><dt>ต้องนัดสำรวจก่อนทุกงานหรือเปล่า</dt><dd>หากตำแหน่งตั้ง ระยะยก หรือทางเข้ายังยืนยันจากผังและรูปไม่ได้ ให้ถามผู้รับผิดชอบไซต์กับผู้ให้บริการเรื่องนัดดูพื้นที่ก่อนจองรถ</dd></div>
              </dl>
              <Link className={styles.textLink} href={href("guides/site-documents")}>อ่านเรื่องเอกสารเข้าโรงงาน</Link>
            </div>
          )}
          {hasCards && (
            <>
              {vehicleList && <p className={styles.notice}>พิกัดที่ระบุเป็นชื่อกลุ่มรถตัวอย่าง พิกัดยกจริงต้องตรวจจากตารางพิกัดของรถรุ่นจริงตามระยะยกและสภาพหน้างาน</p>}
              <CardList group={vehicleList ? "fleet" : slug} entries={vehicleList
                ? fleet.filter(vehicle => vehicle.slug.startsWith(slug === "mobile" ? "mobile-" : "truck-"))
                : group?.entries ?? []} />
            </>
          )}
          {entry && (
            <article className={styles.prose}>
              {slug === "fleet" && <p className={styles.notice}>ภาพประกอบและพิกัดบนหน้านี้ใช้แสดงรูปแบบแคตตาล็อก รถที่ใช้จริงและพิกัดตามระยะต้องให้ทีมงานตรวจสอบ</p>}
              <div className={styles.workText}>
                {[...entry.sections, ...(workDetails[entry.slug] ?? [])].map(([heading, paragraph]) => <section key={heading}><h2>{heading}</h2><p>{paragraph}</p></section>)}
              </div>
              {slug !== "guides" && <Link className={styles.textLink} href={href(`guides/${nextGuide}`)}>อ่านคู่มือเตรียมขอราคา</Link>}
              {slug === "guides" && <Link className={styles.textLink} href={href("services")}>ดูบริการยกและขนย้าย</Link>}
            </article>
          )}
          <ClipGallery items={pageClips(entry?.slug ?? slug)} />
        </div>
      </div>
      {slug !== "quote" && <QuoteCallout topic={entry?.title} />}
      </>}
    </>
  );
}
