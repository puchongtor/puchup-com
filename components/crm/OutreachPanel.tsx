"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  OUTREACH_CHANNELS,
  OUTREACH_KINDS,
  OUTREACH_SOURCES,
  OUTREACH_STATUSES,
  findOutreachByName,
  formatThaiDate,
  newOutreachLead,
  outreachChannelLabel,
  outreachKindLabel,
  outreachSourceLabel,
  sortOutreachLeads,
  type OutreachChannel,
  type OutreachKind,
  type OutreachLead,
  type OutreachSource,
  type OutreachStatus,
} from "@/lib/crm/model";
import { Field, GhostButton, PrimaryButton, inputClass } from "./ui";

const PAGE_SIZE = 10;

function enteredDate(iso: string): string {
  const day = iso.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? formatThaiDate(day) : "—";
}

function statusTone(status: OutreachStatus) {
  switch (status) {
    case "interested":
      return "border-aamber/40 bg-aamber/20 text-ink";
    case "won":
      return "border-apurple/30 bg-apurple/10 text-apurple";
    case "rejected":
      return "border-slate-200 bg-slate-100 text-muted";
    default:
      return "border-slate-200/80 bg-cream text-ink";
  }
}

export function OutreachPanel({
  leads,
  query,
  statusFilter,
  onStatusFilterChange,
  onChange,
  onFlash,
}: {
  leads: OutreachLead[];
  query: string;
  statusFilter: OutreachStatus | null;
  onStatusFilterChange: (next: OutreachStatus | null) => void;
  onChange: (next: OutreachLead[]) => void;
  onFlash: (message: string) => void;
}) {
  const [source, setSource] = useState<OutreachSource>("outbound");
  const [kind, setKind] = useState<OutreachKind>("clinic");
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<OutreachChannel>("page");
  const [channelNote, setChannelNote] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<OutreachLead | null>(null);
  const [pagination, setPagination] = useState<{
    query: string;
    statusFilter: OutreachStatus | null;
    pages: Partial<Record<OutreachStatus, number>>;
  }>({ query, statusFilter, pages: {} });
  const filtersChanged = pagination.query !== query || pagination.statusFilter !== statusFilter;
  if (filtersChanged) setPagination({ query, statusFilter, pages: {} });

  const searched = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("th");
    const rows = !q
      ? leads
      : leads.filter((lead) => {
          const hay = [
            lead.name,
            outreachKindLabel(lead.kind),
            outreachSourceLabel(lead.source),
            outreachChannelLabel(lead.channel),
            lead.channelNote,
            lead.note,
          ]
            .join(" ")
            .toLocaleLowerCase("th");
          return hay.includes(q);
        });
    return sortOutreachLeads(rows);
  }, [leads, query]);

  const listed = useMemo(
    () => (statusFilter ? searched.filter((lead) => lead.status === statusFilter) : searched),
    [searched, statusFilter],
  );

  const groups = OUTREACH_STATUSES.map((status) => {
    const rows = listed.filter((lead) => lead.status === status.id);
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const page = filtersChanged ? 1 : Math.min(pagination.pages[status.id] ?? 1, pageCount);
    const offset = (page - 1) * PAGE_SIZE;
    return { ...status, total: rows.length, page, pageCount, offset, rows: rows.slice(offset, offset + PAGE_SIZE) };
  }).filter((group) => group.total > 0);

  function goToPage(status: OutreachStatus, nextPage: number) {
    setPagination((current) => ({
      ...current,
      pages: { ...current.pages, [status]: nextPage },
    }));
  }

  function resetForm() {
    setName("");
    setChannel("page");
    setChannelNote("");
    setNote("");
  }

  function saveNew(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      onFlash("ใส่ชื่อธุรกิจก่อน");
      return;
    }
    const duplicate = findOutreachByName(leads, trimmed);
    if (duplicate) {
      const ok = window.confirm(
        `มี “${duplicate.name}” ในรายการแล้ว (${outreachKindLabel(duplicate.kind)} · ${outreachSourceLabel(duplicate.source)} · ${outreachChannelLabel(duplicate.channel)})\nบันทึกซ้ำอีกชื่อไหม`,
      );
      if (!ok) return;
    }
    const lead: OutreachLead = {
      ...newOutreachLead(source),
      name: trimmed,
      kind,
      channel,
      channelNote: channelNote.trim(),
      note: note.trim(),
    };
    onChange(sortOutreachLeads([lead, ...leads]));
    goToPage(lead.status, 1);
    resetForm();
    onFlash(source === "inbound" ? "บันทึกแล้ว — ลูกค้าทักเข้ามา" : "บันทึกแล้ว — เราส่งข้อความ");
  }

  function setStatus(id: string, status: OutreachStatus) {
    onChange(
      sortOutreachLeads(
        leads.map((lead) => (lead.id === id ? { ...lead, status, updatedAt: new Date().toISOString() } : lead)),
      ),
    );
  }

  function saveEdit() {
    if (!editing) return;
    const trimmed = editing.name.trim();
    if (!trimmed) {
      onFlash("ใส่ชื่อธุรกิจก่อน");
      return;
    }
    const duplicate = findOutreachByName(leads, trimmed, editing.id);
    if (duplicate) {
      const ok = window.confirm(`มี “${duplicate.name}” ในรายการแล้ว บันทึกชื่อนี้ทับไหม`);
      if (!ok) return;
    }
    onChange(
      sortOutreachLeads(
        leads.map((lead) =>
          lead.id === editing.id
            ? {
                ...editing,
                name: trimmed,
                channelNote: editing.channelNote.trim(),
                note: editing.note.trim(),
                updatedAt: new Date().toISOString(),
              }
            : lead,
        ),
      ),
    );
    setEditing(null);
    onFlash("แก้รายการแล้ว");
  }

  function removeLead(lead: OutreachLead) {
    if (!window.confirm(`ลบ ${lead.name} ออกจากกำลังติดต่อ ?`)) return;
    onChange(leads.filter((item) => item.id !== lead.id));
    if (editing?.id === lead.id) setEditing(null);
    onFlash("ลบแล้ว");
  }

  return (
    <div className="grid min-w-0 gap-6">
      <form
        onSubmit={saveNew}
        className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-lg font-semibold text-ink">กำลังติดต่อ</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          บันทึกชื่อกับช่องทางที่คุยแล้ว ทั้งคลินิก ร้าน หรือธุรกิจอื่น เพื่อช่วยเช็กก่อนส่งซ้ำ
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {OUTREACH_SOURCES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSource(item.id)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                source === item.id ? "border-navy bg-navy text-base" : "border-slate-200/60 bg-white text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="ชื่อธุรกิจ">
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น บ้านทันตแพทย์"
              required
            />
          </Field>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">ประเภท</p>
            <div className="flex flex-wrap gap-2">
              {OUTREACH_KINDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setKind(item.id)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    kind === item.id ? "border-apurple/40 bg-apurple/10 text-ink" : "border-slate-200/60 bg-white text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">ช่องทาง</p>
            <div className="flex flex-wrap gap-2">
              {OUTREACH_CHANNELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChannel(item.id)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    channel === item.id ? "border-apurple/40 bg-apurple/10 text-ink" : "border-slate-200/60 bg-white text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Field label="รายละเอียดช่องทาง" hint="ชื่อเพจ ไลน์ไอดี หรือเบอร์">
            <input
              className={inputClass}
              value={channelNote}
              onChange={(event) => setChannelNote(event.target.value)}
              placeholder="เช่น เพจบ้านทันตแพทย์"
            />
          </Field>
          <Field label="โน้ตสั้น">
            <input
              className={inputClass}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="คุยเรื่องอะไรไว้"
            />
          </Field>
        </div>

        <div className="mt-5">
          <PrimaryButton type="submit">บันทึกรายการ</PrimaryButton>
        </div>
      </form>

      {editing ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">แก้รายการ</h3>
            <GhostButton onClick={() => setEditing(null)}>ปิด</GhostButton>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="ชื่อธุรกิจ">
              <input
                className={inputClass}
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              />
            </Field>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">ประเภท</p>
              <div className="flex flex-wrap gap-2">
                {OUTREACH_KINDS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEditing({ ...editing, kind: item.id })}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      editing.kind === item.id ? "border-apurple/40 bg-apurple/10 text-ink" : "border-slate-200/60 bg-white text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">แหล่ง</p>
              <div className="flex flex-wrap gap-2">
                {OUTREACH_SOURCES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEditing({ ...editing, source: item.id })}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      editing.source === item.id ? "border-navy bg-navy text-base" : "border-slate-200/60 bg-white text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">ช่องทาง</p>
              <div className="flex flex-wrap gap-2">
                {OUTREACH_CHANNELS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEditing({ ...editing, channel: item.id })}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      editing.channel === item.id ? "border-apurple/40 bg-apurple/10 text-ink" : "border-slate-200/60 bg-white text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="รายละเอียดช่องทาง">
              <input
                className={inputClass}
                value={editing.channelNote}
                onChange={(event) => setEditing({ ...editing, channelNote: event.target.value })}
              />
            </Field>
            <Field label="โน้ตสั้น">
              <input
                className={inputClass}
                value={editing.note}
                onChange={(event) => setEditing({ ...editing, note: event.target.value })}
              />
            </Field>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <PrimaryButton onClick={saveEdit}>บันทึกการแก้</PrimaryButton>
            <GhostButton onClick={() => removeLead(editing)}>ลบ</GhostButton>
          </div>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-3">
        <p className="text-sm text-muted">
          {statusFilter
            ? `${OUTREACH_STATUSES.find((item) => item.id === statusFilter)?.label || ""} ${listed.length} ราย`
            : query.trim()
              ? `พบ ${listed.length} จาก ${leads.length} ราย`
              : `${leads.length} ราย`}
          {" · แยกตามสถานะ · ล่าสุดก่อน"}
          {statusFilter ? (
            <button type="button" onClick={() => onStatusFilterChange(null)} className="ml-2 font-medium text-apurple">
              ดูทั้งหมด
            </button>
          ) : null}
        </p>

        {listed.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 text-sm text-muted shadow-sm">
            {leads.length === 0 ? "ยังไม่มีรายการกำลังติดต่อ" : "ไม่มีรายการในสถานะนี้"}
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <section
                key={group.id}
                aria-labelledby={`outreach-status-${group.id}`}
                className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 px-4 py-2.5">
                  <h3 id={`outreach-status-${group.id}`} className="text-sm font-semibold text-ink">{group.label}</h3>
                  <p className="text-xs text-muted">{group.total} ราย</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] table-fixed border-collapse text-left text-sm">
                    <colgroup>
                      <col className="w-[11%]" />
                      <col className="w-[30%]" />
                      <col className="w-[7%]" />
                      <col className="w-[7%]" />
                      <col className="w-[9%]" />
                      <col className="w-[36%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-slate-200/60 text-xs font-medium text-muted">
                        <th aria-sort="descending" className="px-3 py-2.5 font-medium">วันที่ใส่</th>
                        <th className="px-3 py-2.5 font-medium">ชื่อ</th>
                        <th className="px-3 py-2.5 font-medium">ประเภท</th>
                        <th className="px-3 py-2.5 font-medium">แหล่ง</th>
                        <th className="px-3 py-2.5 font-medium">ช่องทาง</th>
                        <th className="px-3 py-2.5 font-medium">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((lead) => (
                        <tr key={lead.id} className="border-b border-slate-200/60 last:border-b-0">
                          <td className="overflow-hidden px-3 py-2.5 whitespace-nowrap text-muted">
                            {enteredDate(lead.createdAt)}
                          </td>
                          <td className="overflow-hidden px-3 py-2.5">
                            <button
                              type="button"
                              onClick={() => setEditing(lead)}
                              className="block w-full [overflow-wrap:anywhere] text-left font-semibold text-ink"
                            >
                              {lead.name}
                            </button>
                            {lead.note ? <p className="mt-0.5 truncate text-xs text-muted">{lead.note}</p> : null}
                          </td>
                          <td className="overflow-hidden px-3 py-2.5 text-muted">{outreachKindLabel(lead.kind)}</td>
                          <td className="overflow-hidden px-3 py-2.5 text-muted">
                            {lead.source === "outbound" ? "เราส่ง" : "เขาทัก"}
                          </td>
                          <td className="overflow-hidden px-3 py-2.5">
                            <p className="truncate text-ink">{outreachChannelLabel(lead.channel)}</p>
                            {lead.channelNote ? <p className="mt-0.5 truncate text-xs text-muted">{lead.channelNote}</p> : null}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-wrap gap-1.5">
                              {OUTREACH_STATUSES.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setStatus(lead.id, item.id)}
                                  aria-pressed={lead.status === item.id}
                                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                                    lead.status === item.id ? statusTone(item.id) : "border-slate-200/60 bg-white text-muted"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {group.pageCount > 1 ? (
                  <nav
                    aria-label={`หน้ารายการ ${group.label}`}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 px-4 py-2.5"
                  >
                    <p className="text-sm text-muted" aria-live="polite">
                      รายการ {group.offset + 1}–{group.offset + group.rows.length} จาก {group.total}
                    </p>
                    <div className="flex gap-2">
                      <PrimaryButton disabled={group.page === 1} onClick={() => goToPage(group.id, group.page - 1)}>
                        ก่อนหน้า
                      </PrimaryButton>
                      <PrimaryButton disabled={group.page === group.pageCount} onClick={() => goToPage(group.id, group.page + 1)}>
                        ดูต่อ
                      </PrimaryButton>
                    </div>
                  </nav>
                ) : null}
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
