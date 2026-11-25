"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import {
  baht, corporateContact, corporateDiscount, corporatePackages, corporatePromotionEndsAt,
  corporatePromotionLabel, discountedPrice, isCorporatePromotionActive,
} from "@/lib/corporate-demo/packages";
import styles from "./corporate.module.css";

function subscribeToPromotion(update: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  function schedule() {
    const remaining = corporatePromotionEndsAt - Date.now();
    if (remaining > 0) {
      timer = setTimeout(() => { update(); schedule(); }, Math.min(remaining, 2_147_483_647));
    }
  }
  schedule();
  window.addEventListener("pageshow", update);
  return () => {
    clearTimeout(timer);
    window.removeEventListener("pageshow", update);
  };
}

function useCorporatePromotion() {
  return useSyncExternalStore(subscribeToPromotion, isCorporatePromotionActive, () => false);
}

export function CorporatePromotionLink() {
  if (!useCorporatePromotion()) return null;

  return (
    <a className={styles.topPromotion} href="#packages">
      <div className={styles.wrap}>
        <p className={styles.topPromotionOffer}>โปรส่งท้ายปี <strong>ลด {corporateDiscount}%</strong></p>
        <p className={styles.topPromotionDate}>ทั้ง 3 แพ็กเกจ · ถึง <time dateTime="2026-12-31">{corporatePromotionLabel}</time></p>
        <span className={styles.topPromotionAction}>ดูราคาแพ็กเกจ</span>
      </div>
    </a>
  );
}

export function CorporatePackagePrices() {
  const promotion = useCorporatePromotion();
  return (
    <>
      <p className={styles.lead}>ทุกแพ็กเกจวาง SEO พื้นฐานให้ครบทุกหน้าที่ส่งมอบ จำนวนหน้ารวมทั้งหน้าบริการ ผลงาน และเนื้อหาที่ช่วยลูกค้าตัดสินใจ เช่น คู่มือก่อนจ้างและคำถามที่พบบ่อย</p>
      {promotion && (
        <div className={styles.promotion}>
          <p className={styles.promotionDiscount}>ลด <strong>{corporateDiscount}%</strong></p>
          <div className={styles.promotionCopy}>
            <p className={styles.promotionTitle}>โปรส่งท้ายปี</p>
            <p>สำหรับทั้ง 3 แพ็กเกจ</p>
          </div>
          <p className={styles.promotionDeadline}>ถึง <time dateTime="2026-12-31">{corporatePromotionLabel}</time></p>
        </div>
      )}
      <div className={styles.priceGrid}>
        {corporatePackages.map(plan => (
          <article key={plan.name} className={styles.priceCard}>
            <h3>{plan.name}</h3>
            <p className={styles.planScope}>เว็บไซต์สูงสุด {plan.pages} หน้า · SEO พื้นฐานครบทุกหน้า</p>
            <p className={styles.price}>
              <span>฿{baht(promotion ? discountedPrice(plan.price) : plan.price)}</span>
              {promotion && <del aria-label={`ราคาปกติ ${baht(plan.price)} บาท`}>฿{baht(plan.price)}</del>}
            </p>
            <p>{plan.description}</p>
            <ul>{plan.allocation.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
            <a href={corporateContact.lineUrl} className={styles.secondary}>คุยแพ็กเกจ {plan.name}</a>
          </article>
        ))}
      </div>
    </>
  );
}
