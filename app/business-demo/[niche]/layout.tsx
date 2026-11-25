import Link from "next/link";
import { notFound } from "next/navigation";
import { Menu, MessageCircle, Phone } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { saleHref } from "@/lib/corporate-demo/collection";
import { demoPageHref, demoSections, findCompany } from "@/lib/corporate-demo/demo";
import { corporateContact } from "@/lib/corporate-demo/packages";
import styles from "./showroom.module.css";

export default async function CompanyLayout({ children, params }: { children: ReactNode; params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const company = findCompany(niche);
  if (!company) notFound();
  const { details } = company;
  const theme = { "--accent": details.accent, "--ink": details.ink, "--paper": details.paper } as CSSProperties;
  const links = Object.entries(demoSections(details)).filter(([key]) => key !== "quote");
  const navigation = links.map(([key, title]) => <Link href={demoPageHref(niche, key)} key={key}>{title}</Link>);
  return <div className={styles.site} data-look={details.look} style={theme}>
    <div className={styles.demoBar}><div className={styles.wrap}>
      <span>เว็บไซต์ตัวอย่าง · แบรนด์สมมติ</span>
      <div><Link href={saleHref(niche)}>สนใจทำเว็บกับ PuchUp</Link><a href={corporateContact.telephone}><Phone size={15} aria-hidden="true" /> {corporateContact.phone}</a><a className={styles.line} href={corporateContact.lineUrl}><MessageCircle size={15} aria-hidden="true" /> LINE {corporateContact.line}</a></div>
    </div></div>
    <header className={styles.header}><div className={styles.wrap}>
      <Link href={demoPageHref(niche)} className={styles.brand}>{details.brand}<small>{company.niche.title}</small></Link>
      <nav className={styles.nav} aria-label="เมนูหลัก">{navigation}</nav>
      <Link className={styles.action} href={demoPageHref(niche, "quote")}>ขอราคา</Link>
      <details className={styles.mobile}><summary aria-label="เมนู"><Menu size={24} aria-hidden="true" /></summary><nav aria-label="เมนูมือถือ">{navigation}</nav></details>
    </div></header>
    <main>{children}</main>
    <footer className={styles.footer}><div className={styles.wrap}>
      <div><Link className={styles.brand} href={demoPageHref(niche)}>{details.brand}</Link><p>เว็บตัวอย่างและภาพจำลองเพื่อประกอบการออกแบบ โดย PuchUp</p></div>
      <nav aria-label="เมนูท้ายเว็บ">{navigation}</nav>
    </div></footer>
  </div>;
}
