import Image from "next/image";
import { Fragment } from "react";
import { site } from "@/lib/site";
import { guides, type CraneArticle } from "./articles";
import { href } from "./data";
import { articlePhoto, mediaPath, pageClips } from "./media";
import { CardList, ClipGallery, QuoteCallout } from "./sections";
import styles from "./demo.module.css";

export function CraneArticleView({ article }: { article: CraneArticle }) {
  const visual = articlePhoto(article.slug);
  const url = site.url + href(`guides/${article.slug}`);
  const structured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.intro,
    inLanguage: "th",
    mainEntityOfPage: url,
    image: visual && [site.url + mediaPath + visual.cover[0], site.url + mediaPath + visual.inline[0]],
    author: { "@type": "Organization", name: site.name, url: site.url + "/about/" },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
      <div className={styles.section}>
        <div className={styles.container}>
          <article className={styles.article}>
            <header className={styles.articleMeta}><span>{article.category}</span><span>เรียบเรียงโดย PuchUp</span></header>
            {visual && <figure className={styles.articleCover}>
              <Image src={mediaPath + visual.cover[0]} alt={visual.cover[1]} width={1344} height={756} sizes="(max-width: 840px) 100vw, 820px" loading="eager" />
            </figure>}
            <p className={styles.takeaway}><strong>สรุปก่อนอ่าน</strong>{article.takeaway}</p>
            <nav className={styles.toc} aria-label="สารบัญ">
              <h2>เรื่องที่อ่านได้ในหน้านี้</h2>
              <ol>{article.sections.map(({ title }, index) => <li key={title}><a href={`#section-${index + 1}`}>{title}</a></li>)}</ol>
            </nav>
            <div className={styles.articleText}>
              {article.sections.map(({ title, paragraphs }, index) => (
                <Fragment key={title}>
                  <section id={`section-${index + 1}`}>
                    <h2>{title}</h2>
                    {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  </section>
                  {index === 1 && visual && <figure>
                    <Image src={mediaPath + visual.inline[0]} alt={visual.inline[1]} width={1344} height={756} sizes="(max-width: 840px) 100vw, 820px" />
                    <figcaption>{visual.caption}</figcaption>
                  </figure>}
                </Fragment>
              ))}
            </div>
            {article.sources?.length && <aside className={styles.articleSources}>
              <h2>แหล่งอ้างอิง</h2>
              <ul>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul>
            </aside>}
            <ClipGallery items={pageClips(article.slug)} />
            <section className={styles.related}>
              <h2>อ่านต่อ</h2>
              <CardList group="guides" entries={article.related.flatMap(slug => guides.filter(guide => guide.slug === slug))} />
            </section>
          </article>
        </div>
      </div>
      <QuoteCallout />
    </>
  );
}
