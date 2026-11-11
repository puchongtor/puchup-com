import type { AssistantGender } from "./assistant-persona";
import { particleFor } from "./assistant-persona";

/** เสียงพูดกับเซลล์ — ตามเพศผู้ช่วยที่เลือก */

export function salesDisplayName(fullName?: string | null, username?: string | null) {
  const name = (fullName || username || "").trim();
  return name || "เซลล์";
}

function politeName(salesName: string) {
  const name = (salesName || "").trim();
  if (!name) return "คุณเซลล์";
  return /^คุณ/.test(name) ? name : `คุณ${name}`;
}

/** แนะนำตัวครั้งแรกของเซลล์คนนี้ */
export function firstMeetingOpening(
  salesName: string,
  gender: AssistantGender = "female",
  assistantName?: string,
) {
  const p = particleFor(gender);
  const who = politeName(salesName);
  const selfName = assistantName || "ผู้ช่วย";
  return (
    `สวัสดี${p.polite} ${p.self}${selfName} ผู้ช่วยของ${who} ` +
    `สำหรับจัดการข้อมูลการพบลูกค้าครั้งนี้${p.polite} ` +
    `คุยกับ${p.self}ได้เลย — พูด ส่งรูป ส่งคลิป หรือพิมพ์ก็ได้ ` +
    `${p.self}จะเก็บข้อมูลและถามเฉพาะส่วนที่จำเป็นนะ${p.question} ` +
    `วันนี้ไปบริษัทไหน${p.question} ไปทำอะไรเป็นหลัก — ขาย / แก้ปัญหา / ส่งของ / ตามงาน?`
  );
}

/** เยี่ยมรอบถัดไป — ไม่แนะนำตัวซ้ำ รู้ใจแล้ว */
export function returningOpening(
  salesName: string,
  gender: AssistantGender = "female",
) {
  const p = particleFor(gender);
  return (
    `สวัสดี${p.polite}${politeName(salesName)} เริ่มเยี่ยมใหม่แล้วนะ${p.question} ` +
    `วันนี้ไปที่ไหน เป้าอะไร${p.question} — ขาย / แก้ปัญหา / ส่งของ / ตามงาน? บอกได้เลย${p.polite}`
  );
}
