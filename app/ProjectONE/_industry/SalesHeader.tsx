import { BrandLogoHorizontal } from "@/components/Logo";
import styles from "./sales.module.css";

export function SalesHeader({ evidence }: { evidence: "results" | "workflow" }) {
  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <a href="/" aria-label="PuchUp หน้าแรก">
            <BrandLogoHorizontal variant="light" className={styles.brandLogo} />
          </a>
          <a href="/ProjectONE/" className={styles.projectLink}>Project ONE</a>
        </div>
        <nav aria-label="เมนูหน้านี้">
          <a href="#examples">ตัวอย่าง</a>
          <a href={`#${evidence}`}>{evidence === "results" ? "ผลตอบรับ" : "การใช้งาน"}</a>
          <a href="#pricing">ราคา</a>
          <a href="#faq">คำถาม</a>
        </nav>
      </div>
    </header>
  );
}
