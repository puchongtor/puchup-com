"use client";

import { useState } from "react";
import {
  CHANNELS,
  CRM_SERVICES,
  CYCLES,
  WORK_STATUSES,
  addMonths,
  cycleCharge,
  cyclePhrase,
  formatBaht,
  formatThaiDate,
  remindOn,
  type Client,
} from "@/lib/crm/model";
import { Field, GhostButton, PrimaryButton, inputClass } from "./ui";

export function ClientForm({
  draft,
  today,
  onChange,
  onSave,
  onClose,
  onDelete,
  isNew,
}: {
  draft: Client;
  today: string;
  onChange: (next: Client) => void;
  onSave: (next: Client) => void;
  onClose: () => void;
  onDelete: () => void;
  isNew: boolean;
}) {
  const [error, setError] = useState("");
  const charge = cycleCharge(draft);
  const remind = /^\d{4}-\d{2}-\d{2}$/.test(draft.nextDue) ? remindOn(draft.nextDue, draft.cycleMonths, "billing") : "";

  function patch(partial: Partial<Client>) {
    onChange({ ...draft, ...partial });
  }

  function toggleService(id: string) {
    const services = draft.services.includes(id) ? draft.services.filter((item) => item !== id) : [...draft.services, id];
    patch({ services });
  }

  function save() {
    if (!draft.businessName.trim()) {
      setError("ใส่ชื่อธุรกิจหรือชื่อเว็บ");
      return;
    }
    setError("");
    onSave(draft);
  }

  return (
    <form
      className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">{isNew ? "เพิ่มลูกค้า" : draft.businessName || "แก้ไขลูกค้า"}</h2>
          <p className="mt-1 text-sm text-muted">บันทึกในเบราว์เซอร์เครื่องนี้</p>
        </div>
        <div className="flex gap-2">
          <GhostButton onClick={onClose}>กลับ</GhostButton>
          <PrimaryButton type="submit">บันทึก</PrimaryButton>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-aorange">{error}</p> : null}

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm font-semibold text-ink">ผู้ติดต่อ</h3>
        <Field label="ชื่อธุรกิจ / ชื่อเว็บ">
          <input className={inputClass} value={draft.businessName} onChange={(e) => patch({ businessName: e.target.value })} />
        </Field>
        <Field label="ชื่อผู้ติดต่อ">
          <input className={inputClass} value={draft.contactName} onChange={(e) => patch({ contactName: e.target.value })} />
        </Field>
        <Field label="เบอร์โทร">
          <input className={inputClass} inputMode="tel" value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} />
        </Field>
        <Field label="อีเมล" hint="มีอีเมลแล้ว กดเปิดจดหมายพร้อมข้อความได้จากหน้ารายการแจ้งเตือน">
          <input className={inputClass} inputMode="email" value={draft.email} onChange={(e) => patch({ email: e.target.value })} />
        </Field>
        <Field label="LINE">
          <input className={inputClass} value={draft.lineId} onChange={(e) => patch({ lineId: e.target.value })} />
        </Field>
        <Field label="ช่องทางที่ใช้แจ้ง">
          <select className={inputClass} value={draft.channel} onChange={(e) => patch({ channel: e.target.value as Client["channel"] })}>
            {CHANNELS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="หมายเหตุช่องทาง" hint="เช่น ชื่อเฟซ หรือเวลาที่สะดวกให้ทัก">
          <input className={inputClass} value={draft.channelNote} onChange={(e) => patch({ channelNote: e.target.value })} />
        </Field>
        <Field label="เว็บไซต์">
          <input className={inputClass} value={draft.website} onChange={(e) => patch({ website: e.target.value })} placeholder="https://" />
        </Field>
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-ink">บริการที่เลือก</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {CRM_SERVICES.map((service) => {
            const on = draft.services.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`rounded-xl border px-3 py-2 text-sm ${on ? "border-navy bg-navy text-base" : "border-slate-200/60 bg-white text-ink"}`}
              >
                {service.label}
              </button>
            );
          })}
        </div>
        {draft.services.includes("care") ? (
          <p className="mt-2 text-xs leading-5 text-muted">ทุกวันจันทร์ ระบบจะเตือนให้กลับไปดูแลเว็บนี้ จนกว่าจะกดว่าจัดการแล้วในสัปดาห์นั้น</p>
        ) : null}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="รายละเอียดงาน">
            <input className={inputClass} value={draft.serviceNote} onChange={(e) => patch({ serviceNote: e.target.value })} />
          </Field>
          <Field label="สถานะงาน">
            <select className={inputClass} value={draft.workStatus} onChange={(e) => patch({ workStatus: e.target.value as Client["workStatus"] })}>
              {WORK_STATUSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm font-semibold text-ink">รอบบิลและการชำระ</h3>
        <Field label="วันที่เว็บขึ้นออนไลน์" hint="รอบบิลนับจากวันนี้ ลูกค้าแก้หลังออนไลน์ไม่เลื่อนวันครบ">
          <input className={inputClass} type="date" value={draft.startDate} onChange={(e) => patch({ startDate: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <p className="mb-1.5 text-sm font-medium text-ink">เก็บเงินทุกกี่เดือน</p>
          <div className="flex flex-wrap gap-2">
            {CYCLES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => patch({ cycleMonths: item.value })}
                className={`rounded-xl border px-3 py-2 text-sm ${draft.cycleMonths === item.value ? "border-navy bg-navy text-base" : "border-slate-200/60 bg-white text-ink"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            {draft.cycleMonths === 12
              ? "รายปี แจ้งเตือนก่อนครบ 1 เดือน"
              : draft.cycleMonths === 0
                ? "งานครั้งเดียว จะเตือนเมื่อใส่วันครบกำหนด ก่อน 2 สัปดาห์"
                : "รอบ 1, 3 และ 6 เดือน แจ้งเตือนก่อนครบ 2 สัปดาห์"}
          </p>
        </div>
        {draft.cycleMonths === 0 ? (
          <Field label="ราคาครั้งเดียว (บาท)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={draft.oneTimePrice || ""}
              onChange={(e) => patch({ oneTimePrice: Number(e.target.value.replace(/,/g, "")) || 0 })}
            />
          </Field>
        ) : (
          <Field label="ราคาต่อเดือน (บาท)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={draft.monthlyPrice || ""}
              onChange={(e) => patch({ monthlyPrice: Number(e.target.value.replace(/,/g, "")) || 0 })}
            />
          </Field>
        )}
        {draft.cycleMonths === 12 ? (
          <Field label="ราคาต่อปี (บาท)" hint="ถ้าใส่ราคาต่อปี ระบบใช้ยอดนี้ตอนทวงรอบ 12 เดือน แทนการคูณ 12">
            <input
              className={inputClass}
              inputMode="numeric"
              value={draft.yearlyPrice || ""}
              onChange={(e) => patch({ yearlyPrice: Number(e.target.value.replace(/,/g, "")) || 0 })}
            />
          </Field>
        ) : draft.cycleMonths > 0 ? (
          <Field label="ยอดต่องวด" hint="คำนวณจากราคาต่อเดือน × จำนวนเดือน">
            <input className={inputClass} readOnly value={charge ? `${formatBaht(charge)} บาท` : ""} />
          </Field>
        ) : (
          <div />
        )}
        <Field label="วันครบกำหนดรอบนี้">
          <input className={inputClass} type="date" value={draft.nextDue} onChange={(e) => patch({ nextDue: e.target.value })} />
        </Field>
        {draft.cycleMonths > 0 ? (
          <div className="flex items-end">
            <GhostButton
              className="w-full"
              onClick={() => {
                if (!draft.startDate) return;
                patch({ nextDue: addMonths(draft.startDate, draft.cycleMonths) });
              }}
            >
              ตั้งวันครบจากวันที่ออนไลน์
            </GhostButton>
          </div>
        ) : null}
        <div className="rounded-2xl border border-slate-200/60 bg-cream/70 p-4 text-sm text-ink md:col-span-2">
          <p>
            ยอดที่ต้องแจ้งรอบนี้: <span className="font-semibold">{charge > 0 ? `${formatBaht(charge)} บาท` : "ยังไม่ได้ใส่ราคา"}</span>
            {draft.cycleMonths > 0 ? ` · ${cyclePhrase(draft.cycleMonths)}` : ""}
          </p>
          <p className="mt-1 text-muted">
            {draft.nextDue && remind
              ? `เริ่มแจ้งได้ ${formatThaiDate(remind)} · ครบ ${formatThaiDate(draft.nextDue)}`
              : "ยังไม่มีวันครบกำหนด — ใส่วันที่เว็บขึ้นออนไลน์แล้วบันทึก ระบบจะตั้งรอบแรกจากวันนั้น"}
          </p>
          {draft.lastPaidAt ? (
            <p className="mt-1 text-muted">
              ชำระล่าสุด {formatThaiDate(draft.lastPaidAt)}
              {draft.lastPaidAmount > 0 ? ` · ${formatBaht(draft.lastPaidAmount)} บาท` : ""}
            </p>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink md:col-span-2">
          <input type="checkbox" checked={draft.paused} onChange={(e) => patch({ paused: e.target.checked })} />
          พักการแจ้งเตือนชั่วคราว
        </label>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm font-semibold text-ink">โดเมนและโฮส</h3>
        <Field label="โดเมน">
          <input className={inputClass} value={draft.domain} onChange={(e) => patch({ domain: e.target.value })} />
        </Field>
        <Field label="วันหมดอายุโดเมน" hint="แจ้งก่อน 1 เดือน">
          <input className={inputClass} type="date" value={draft.domainDue} onChange={(e) => patch({ domainDue: e.target.value })} />
        </Field>
        <Field label="วันหมดอายุโฮสติ้ง" hint="แจ้งก่อน 1 เดือน">
          <input className={inputClass} type="date" value={draft.hostingDue} onChange={(e) => patch({ hostingDue: e.target.value })} />
        </Field>
        <Field label="โน้ตภายใน">
          <textarea className={`${inputClass} min-h-24`} value={draft.note} onChange={(e) => patch({ note: e.target.value })} />
        </Field>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {isNew ? (
          <span />
        ) : (
          <button type="button" onClick={onDelete} className="text-sm font-medium text-aorange">
            ลบลูกค้านี้
          </button>
        )}
        <div className="flex gap-2">
          <GhostButton onClick={onClose}>ยกเลิก</GhostButton>
          <PrimaryButton type="submit">บันทึก</PrimaryButton>
        </div>
      </div>
    </form>
  );
}
