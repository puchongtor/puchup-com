import type { Metadata } from "next";
import Link from "next/link";
import { Factory, Menu, MessageCircle, Phone } from "lucide-react";
import { saleHref } from "@/lib/corporate-demo/collection";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";
import { href, primaryLinks } from "./data";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: { template: "%s | ยกงาน เครน", default: "ยกงาน เครน | ตัวอย่างเว็บรถเครนและรถเฮี๊ยบ" },
  robots: { index: false, follow: false },
};

function Navigation() {
  return primaryLinks.map(([slug, label]) => <Link key={slug} href={href(slug)}>{label}</Link>);
}

export default function CraneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.site}>
      <div className={styles.demoBar}>
        <div className={styles.container}>
          <span>เว็บไซต์ตัวอย่าง · แบรนด์สมมติ</span>
          <div className={styles.demoContact}>
            <Link href={saleHref("crane-rental")}>สนใจทำเว็บกับ PuchUp</Link>
            <a href="tel:+66880899895"><Phone size={15} aria-hidden="true" />088-089-9895</a>
            <a href={LINE_OA_URL} className={styles.demoLine}><MessageCircle size={15} aria-hidden="true" />LINE {LINE_OA_ID}</a>
          </div>
        </div>
      </div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={href()} className={styles.brand}>
            <span className={styles.brandIcon}><Factory size={23} aria-hidden="true" /></span>
            <span>ยกงาน<span className={styles.brandAccent}> เครน</span><small>รถเครนและรถเฮี๊ยบ</small></span>
          </Link>
          <nav aria-label="เมนูหลัก" className={styles.navigation}><Navigation /></nav>
          <Link href={href("quote")} className={styles.button}>ขอใบเสนอราคา</Link>
          <details className={styles.mobileNav}>
            <summary aria-label="เมนูหลัก"><Menu aria-hidden="true" /></summary>
            <nav aria-label="เมนูมือถือ"><Navigation /></nav>
          </details>
        </div>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div><Link href={href()} className={styles.footerBrand}>ยกงาน เครน</Link><p>เว็บไซต์ตัวอย่างสำหรับธุรกิจรถเครนและรถเฮี๊ยบ โดย PuchUp</p></div>
          <nav aria-label="เมนูท้ายเว็บ"><Navigation /></nav>
        </div>
      </footer>
    </div>
  );
}
