"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./demo.module.css";

const fields = [
  { name: "work", label: "ลักษณะงาน", placeholder: "เช่น ยกเครื่องจักรลงจากรถส่งของ", required: true },
  { name: "weight", label: "น้ำหนักรวม", placeholder: "เช่น 2,500 กก. หรือรอชั่งน้ำหนัก", required: true },
  { name: "dimensions", label: "ขนาดของ", placeholder: "ความยาว × กว้าง × สูง" },
  { name: "radius", label: "ระยะยก / ความสูงโดยประมาณ", placeholder: "ใส่ข้อมูลที่ทราบ หรือรอสำรวจ" },
  { name: "location", label: "พิกัดต้นทางหรือจุดยก", placeholder: "ชื่อไซต์ จังหวัด หรือ URL แผนที่", required: true },
  { name: "destination", label: "ปลายทาง (ถ้ามี)", placeholder: "ชื่อไซต์ จังหวัด หรือ URL แผนที่" },
  { name: "date", label: "วันใช้งาน", required: true, type: "date" },
] as const;

export function QuoteForm() {
  const query = useSearchParams();
  const [brief, setBrief] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyStatus("คัดลอกบรีฟแล้ว");
    } catch {
      setCopyStatus("เลือกข้อความในช่องบรีฟเพื่อคัดลอกได้");
    }
  }

  return (
    <div className={styles.formWrap}>
      <p className={styles.notice}>กรอกข้อมูลเพื่อสรุปบรีฟงานให้พร้อมคัดลอก ข้อมูลอยู่ในหน้านี้และจะหายเมื่อโหลดใหม่หรือปิดหน้า</p>
      <form className={styles.form} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const lines = [
          ["ประเภทรถ", data.get("vehicle")],
          ...fields.map(field => [field.label, data.get(field.name)]),
          ["รายละเอียดเพิ่มเติม", data.get("notes")],
        ].flatMap(([label, value]) => typeof value === "string" && value.trim() ? [`${label}: ${value.trim()}`] : []);
        setBrief(lines.join("\n"));
        setCopyStatus("");
      }}>
        <label>ประเภทรถ
          <select name="vehicle">
            <option>ให้ทีมช่วยแนะนำ</option><option>รถเครนเคลื่อนที่</option><option>รถเฮี๊ยบ</option>
          </select>
        </label>
        {fields.map(field => (
          <label key={field.name}>{field.label}{"required" in field && <span aria-hidden="true"> *</span>}
            <input name={field.name} type={"type" in field ? field.type : "text"} placeholder={"placeholder" in field ? field.placeholder : undefined}
              required={"required" in field && field.required} maxLength={240}
              defaultValue={field.name === "work" ? query.get("work")?.slice(0, 240) : undefined} />
          </label>
        ))}
        <label className={styles.full}>รายละเอียดเพิ่มเติม
          <textarea name="notes" rows={4} maxLength={1200} placeholder="ช่วงเวลาเข้าไซต์ ทางเข้าจำกัด หรือเอกสารที่ผู้ดูแลพื้นที่ขอ" />
        </label>
        <div className={styles.full}><button className={styles.button} type="submit" disabled={!ready}>สร้างบรีฟขอราคา</button></div>
      </form>
      {brief && (
        <section className={styles.result} aria-labelledby="brief-title">
          <h2 id="brief-title">บรีฟที่พร้อมคัดลอก</h2>
          <label className={styles.full}><span className={styles.visuallyHidden}>ข้อความบรีฟ</span><textarea readOnly value={brief} rows={10} /></label>
          <button className={styles.button} type="button" onClick={copyBrief}>คัดลอกบรีฟ</button>
          <p role="status">{copyStatus}</p>
        </section>
      )}
    </div>
  );
}
