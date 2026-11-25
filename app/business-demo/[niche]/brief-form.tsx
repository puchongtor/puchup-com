"use client";

import { useEffect, useState } from "react";
import styles from "./showroom.module.css";

export function BriefForm({ fields, offer }: { fields: string[]; offer: string }) {
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => setReady(true), []);

  return <div className={styles.formWrap}>
    <p>กรอกข้อมูลเพื่อสร้างข้อความขอราคา ข้อมูลอยู่ในหน้านี้และหายเมื่อโหลดใหม่หรือปิดหน้า</p>
    <form className={styles.form} onSubmit={event => {
      event.preventDefault();
      const values = new FormData(event.currentTarget);
      setResult([offer, ...fields.map((field, index) => `${field}: ${values.get(String(index))}`)].join("\n"));
      setStatus("");
    }}>
      {fields.map((field, index) => <label key={field}>{field}<input name={String(index)} maxLength={260} required /></label>)}
      <button data-puchup-demo-action disabled={!ready} className={styles.action}>สร้างบรีฟขอราคา</button>
    </form>
    {result && <section className={styles.formResult}>
      <h2>บรีฟที่พร้อมส่ง</h2>
      <textarea readOnly aria-label="ข้อความบรีฟ" value={result} rows={9} />
      <button className={styles.action} type="button" onClick={async () => {
        try { await navigator.clipboard.writeText(result); setStatus("คัดลอกบรีฟแล้ว"); }
        catch { setStatus("เลือกข้อความในช่องบรีฟเพื่อคัดลอกได้"); }
      }}>คัดลอกบรีฟ</button>
      <p role="status">{status}</p>
    </section>}
  </div>;
}
