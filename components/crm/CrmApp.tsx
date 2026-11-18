"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { AUTH_KEY, verifyLogin } from "@/lib/crm/auth";
import {
  buildAlerts,
  channelLabel,
  clientMatches,
  cyclePhrase,
  defaultSettings,
  formatBaht,
  formatThaiDate,
  LOCAL_CARE_TASKS,
  markCyclePaid,
  markSent,
  newClient,
  rollAnnual,
  normalizeDb,
  sampleTemplates,
  sendHint,
  serviceLabel,
  sortAlerts,
  todayISO,
  whenLabel,
  withFirstDue,
  workLabel,
  type Alert,
  type AlertBucket,
  type Client,
  type StudioSettings,
} from "@/lib/crm/model";
import { downloadDb, loadDb, saveDb } from "@/lib/crm/storage";
import { ClientForm } from "./ClientForm";
import { Field, GhostButton, PrimaryButton, inputClass } from "./ui";

type Tab = "alerts" | "clients" | "settings";
type ListFocus = "send" | "overdue" | "later" | "care";

const PAGE_SIZE = 20;

const BUCKETS: { id: AlertBucket; title: string; dot: string; edge: string }[] = [
  { id: "overdue", title: "เลยกำหนด", dot: "bg-aorange", edge: "border-l-aorange" },
  { id: "send", title: "ถึงเวลาแจ้งแล้ว", dot: "bg-aamber", edge: "border-l-aamber" },
  { id: "sent", title: "แจ้งแล้ว รอถึงวันครบ", dot: "bg-apurple", edge: "border-l-apurple/50" },
  { id: "later", title: "ยังไม่ถึงวันแจ้ง", dot: "bg-navy/25", edge: "border-l-navy/20" },
];

export function CrmApp() {
  const today = todayISO();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings);
  const [tab, setTab] = useState<Tab>("alerts");
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<ListFocus>(null);
  const [draft, setDraft] = useState<Client | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [flash, setFlash] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const db = loadDb();
    setClients(db.clients);
    setSettings(db.settings);
    setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(""), 2200);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const visibleClients = useMemo(() => clients.filter((client) => clientMatches(client, query)), [clients, query]);
  const allAlerts = useMemo(
    () => sortAlerts(clients.flatMap((client) => buildAlerts(client, settings, today))),
    [clients, settings, today],
  );
  const listedClients = useMemo(() => {
    if (!focus) return visibleClients;
    if (focus === "care") return visibleClients.filter((client) => client.workStatus !== "closed");
    const ids = new Set(allAlerts.filter((alert) => alert.kind !== "care" && alert.bucket === focus).map((alert) => alert.clientId));
    return visibleClients.filter((client) => ids.has(client.id));
  }, [allAlerts, focus, visibleClients]);
  const alerts = useMemo(() => {
    if (!query.trim()) return allAlerts;
    const ids = new Set(visibleClients.map((client) => client.id));
    return allAlerts.filter((alert) => ids.has(alert.clientId));
  }, [allAlerts, query, visibleClients]);
  const noticeCount = useMemo(
    () =>
      allAlerts.filter((alert) =>
        alert.kind === "care" ? !alert.notified : alert.bucket === "send" || alert.bucket === "overdue",
      ).length,
    [allAlerts],
  );

  function openFocus(next: ListFocus) {
    setFocus((current) => (current === next ? null : next));
    setQuery("");
    setTab("clients");
    setDraft(null);
  }

  function persist(nextClients: Client[], nextSettings = settings) {
    const ok = saveDb({ version: 1, clients: nextClients, settings: nextSettings });
    if (!ok) setFlash("บันทึกไม่สำเร็จ");
    return ok;
  }

  function updateClient(next: Client) {
    const list = clients.some((item) => item.id === next.id)
      ? clients.map((item) => (item.id === next.id ? next : item))
      : [next, ...clients];
    setClients(list);
    persist(list);
    if (draft?.id === next.id) setDraft(next);
    return list;
  }

  function saveDraft(client: Client) {
    const next = withFirstDue(client);
    const filled = next.nextDue !== client.nextDue;
    updateClient(next);
    setDraft(null);
    setIsNew(false);
    setTab("clients");
    setFlash(filled ? "บันทึกแล้ว ตั้งรอบแรกจากวันที่เว็บขึ้นออนไลน์" : "บันทึกแล้ว");
  }

  function removeClient(id: string) {
    const target = clients.find((item) => item.id === id);
    if (!target) return;
    if (!window.confirm(`ลบ ${target.businessName || "ลูกค้ารายนี้"} ?`)) return;
    const list = clients.filter((item) => item.id !== id);
    setClients(list);
    persist(list);
    setDraft(null);
    setFlash("ลบแล้ว");
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setFlash("คัดลอกแล้ว");
    } catch {
      setFlash("คัดลอกไม่สำเร็จ");
    }
  }

  function openMail(client: Client, alert: Alert) {
    const email = client.email.trim();
    if (!email) {
      void copyText(alert.body);
      return;
    }
    void navigator.clipboard.writeText(`${alert.subject}\n\n${alert.body}`).catch(() => undefined);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(alert.subject)}&body=${encodeURIComponent(alert.body)}`;
    setFlash("เปิดโปรแกรมเมลแล้ว ข้อความถูกคัดลอกไว้ด้วย");
  }

  function markAlertSent(client: Client, alert: Alert) {
    updateClient(markSent(client, alert.key, client.channel));
    setFlash(alert.kind === "care" ? "เก็บงานจันทร์นี้แล้ว" : "ติ๊กว่าแจ้งแล้ว");
  }

  function markPaid(client: Client) {
    const next = markCyclePaid(client, today);
    updateClient(next);
    setFlash(next.nextDue ? `เลื่อนครบกำหนดเป็น ${formatThaiDate(next.nextDue)}` : "บันทึกว่าชำระแล้ว");
  }

  function renew(client: Client, kind: "domain" | "hosting") {
    const next =
      kind === "domain"
        ? { ...client, domainDue: rollAnnual(client.domainDue, today) }
        : { ...client, hostingDue: rollAnnual(client.hostingDue, today) };
    updateClient(next);
    setFlash(kind === "domain" ? `ต่อโดเมนถึง ${formatThaiDate(next.domainDue)}` : `ต่อโฮสถึง ${formatThaiDate(next.hostingDue)}`);
  }

  if (!ready) return <div className="min-h-screen bg-base" />;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const billingAlerts = alerts.filter((item) => item.kind !== "care");
  const sendCount = billingAlerts.filter((item) => item.bucket === "send").length;
  const overdueCount = billingAlerts.filter((item) => item.bucket === "overdue").length;
  const laterCount = billingAlerts.filter((item) => item.bucket === "later").length;
  const careCount = clients.filter((item) => item.workStatus !== "closed").length;

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="eyebrow text-[11px] text-muted">PUCHUP CRM</p>
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">ระบบดูแลลูกค้า</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTab("alerts");
                setDraft(null);
              }}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm ${noticeCount > 0 ? "border-aorange/30 bg-aorange/10 text-aorange" : "border-slate-200/60 bg-white text-ink"}`}
              aria-label={noticeCount > 0 ? `แจ้งเตือน ${noticeCount} รายการ` : "ไม่มีแจ้งเตือนค้าง"}
            >
              <BellIcon />
              {noticeCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aorange px-1 text-[11px] font-bold leading-none text-white">
                  {noticeCount > 99 ? "99+" : noticeCount}
                </span>
              ) : null}
            </button>
            <GhostButton onClick={() => downloadDb({ version: 1, clients, settings }, `puchup-crm-${today}.json`)}>
              สำรองไฟล์
            </GhostButton>
            <GhostButton onClick={() => fileRef.current?.click()}>นำเข้า</GhostButton>
            <GhostButton
              onClick={() => {
                localStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
            >
              ออกจากระบบ
            </GhostButton>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const db = normalizeDb(JSON.parse(String(reader.result)));
                    if (!window.confirm(`นำเข้า ${db.clients.length} ราย แทนที่ข้อมูลในเครื่องนี้`)) return;
                    setClients(db.clients);
                    setSettings(db.settings);
                    saveDb(db);
                    setFlash("นำเข้าแล้ว");
                  } catch {
                    setFlash("ไฟล์ใช้ไม่ได้");
                  }
                };
                reader.readAsText(file);
              }}
            />
          </div>
        </header>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          เปิดหน้านี้เมื่อไหร่ ระบบเรียงคนที่ถึงรอบให้ทันที ลูกค้า Local Care รายเดือนจะขึ้นทุกสัปดาห์ตั้งแต่วันจันทร์ ให้กลับไปดูแลเว็บ จนกว่าจะกดว่าจัดการแล้ว
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="ต้องส่ง" value={String(sendCount)} tone="send" active={focus === "send"} onClick={() => openFocus("send")} />
          <Stat label="เลยกำหนด" value={String(overdueCount)} tone="overdue" active={focus === "overdue"} onClick={() => openFocus("overdue")} />
          <Stat label="อีกไม่เกิน 60 วัน" value={String(laterCount)} tone="later" active={focus === "later"} onClick={() => openFocus("later")} />
          <Stat label="ลูกค้าที่ดูแล" value={String(careCount)} tone="care" active={focus === "care"} onClick={() => openFocus("care")} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <TabButton active={tab === "alerts"} onClick={() => { setTab("alerts"); setDraft(null); }}>
            แจ้งเตือน
          </TabButton>
          <TabButton active={tab === "clients"} onClick={() => setTab("clients")}>
            ลูกค้า
          </TabButton>
          <TabButton active={tab === "settings"} onClick={() => { setTab("settings"); setDraft(null); }}>
            ข้อความและบัญชี
          </TabButton>
          <input
            className={`${inputClass} ml-auto w-full sm:w-64`}
            placeholder="ค้นหาชื่อ เบอร์ โดเมน"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="mt-6">
          {tab === "alerts" ? (
            <AlertBoard
              alerts={alerts}
              clients={clients}
              today={today}
              onCopy={(alert) => void copyText(`${alert.subject}\n\n${alert.body}`)}
              onCopyAll={() => {
                const rows = alerts.filter((item) => item.kind !== "care" && (item.bucket === "send" || item.bucket === "overdue"));
                if (!rows.length) {
                  setFlash("ยังไม่มีข้อความที่ต้องส่ง");
                  return;
                }
                const text = rows
                  .map((item) => {
                    const client = clients.find((row) => row.id === item.clientId);
                    return `—— ${client?.businessName || "ลูกค้า"} · ${item.title} ——\n${item.subject}\n\n${item.body}`;
                  })
                  .join("\n\n");
                void copyText(text);
              }}
              onMail={(client, alert) => openMail(client, alert)}
              onSent={markAlertSent}
              onPaid={markPaid}
              onRenew={renew}
            />
          ) : null}

          {tab === "clients" ? (
            draft ? (
              <ClientForm
                draft={draft}
                today={today}
                isNew={isNew}
                onChange={setDraft}
                onSave={saveDraft}
                onClose={() => setDraft(null)}
                onDelete={() => removeClient(draft.id)}
              />
            ) : (
              <ClientList
                clients={listedClients}
                total={clients.length}
                query={query}
                focus={focus}
                onClearFocus={() => setFocus(null)}
                today={today}
                settings={settings}
                onCreate={() => {
                  setDraft(newClient(today));
                  setIsNew(true);
                }}
                onEdit={(client) => {
                  setDraft(client);
                  setIsNew(false);
                }}
                onPaid={markPaid}
              />
            )
          ) : null}

          {tab === "settings" ? (
            <SettingsPanel
              settings={settings}
              onChange={(next) => {
                setSettings(next);
                persist(clients, next);
              }}
              onCopy={(text) => void copyText(text)}
            />
          ) : null}
        </div>
      </div>
      {flash ? (
        <p className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-navy px-4 py-2 text-sm text-base shadow-sm" role="status">
          {flash}
        </p>
      ) : null}
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <form
          className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md sm:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const ok = await verifyLogin(username, password);
            setBusy(false);
            if (!ok) {
              setError("ชื่อหรือรหัสไม่ถูกต้อง");
              return;
            }
            localStorage.setItem(AUTH_KEY, "1");
            setPassword("");
            onSuccess();
          }}
        >
          <LogoMark className="h-12 w-12" />
          <p className="eyebrow mt-6 text-xs text-muted">PUCHUP CRM</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">ระบบดูแลลูกค้า</h1>
          <p className="mt-2 text-sm leading-6 text-muted">รอบบริการ วันครบกำหนด และข้อความแจ้งเตือน</p>
          <div className="mt-6 grid gap-4">
            <Field label="ชื่อผู้ใช้">
              <input className={inputClass} autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Field>
            <Field label="รหัสผ่าน">
              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>
          {error ? <p className="mt-3 text-sm text-aorange">{error}</p> : null}
          <PrimaryButton type="submit" disabled={busy} className="mt-6 w-full">
            {busy ? "กำลังตรวจ..." : "เข้าสู่ระบบ"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

const STAT_TONE = {
  send: { card: "border-aamber/60 bg-aamber/15", value: "text-ink", dot: "bg-aamber" },
  overdue: { card: "border-aorange/40 bg-aorange/10", value: "text-aorange", dot: "bg-aorange" },
  later: { card: "border-apurple/30 bg-apurple/10", value: "text-apurple", dot: "bg-apurple" },
  care: { card: "border-navy/15 bg-white/90", value: "text-navy", dot: "bg-navy" },
} as const;

function Stat({
  label,
  value,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: string;
  tone: keyof typeof STAT_TONE;
  active: boolean;
  onClick: () => void;
}) {
  const style = STAT_TONE[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left shadow-sm backdrop-blur-md ${style.card} ${active ? "ring-2 ring-navy" : ""}`}
    >
      <p className="flex items-center gap-2 text-xs text-muted">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${style.value}`}>{value}</p>
    </button>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 17H9m9-1V11a6 6 0 1 0-12 0v5l-1.5 1.5h15L18 16Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${active ? "bg-navy text-base" : "border border-slate-200/60 bg-white text-ink"}`}
    >
      {children}
    </button>
  );
}

function siteHref(url: string): string {
  const value = url.trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function AlertBoard({
  alerts,
  clients,
  today,
  onCopy,
  onCopyAll,
  onMail,
  onSent,
  onPaid,
  onRenew,
}: {
  alerts: Alert[];
  clients: Client[];
  today: string;
  onCopy: (alert: Alert) => void;
  onCopyAll: () => void;
  onMail: (client: Client, alert: Alert) => void;
  onSent: (client: Client, alert: Alert) => void;
  onPaid: (client: Client) => void;
  onRenew: (client: Client, kind: "domain" | "hosting") => void;
}) {
  const care = alerts.filter((item) => item.kind === "care");
  const rest = alerts.filter((item) => item.kind !== "care");
  if (!care.length && !rest.length) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 text-sm text-muted shadow-sm">
        ยังไม่มีรายการใน 60 วันข้างหน้า เพิ่มลูกค้าแล้วใส่วันครบกำหนด หรือเลือก Local Care รายเดือน ระบบจะบอกเองว่าเมื่อไรต้องทักและเมื่อไรต้องกลับไปดูแลเว็บ
      </div>
    );
  }
  const careOpen = care.filter((item) => !item.notified);
  const careHeading =
    careOpen.length === 0
      ? "Local Care สัปดาห์นี้จัดการแล้ว"
      : today === care[0]?.remindFrom
        ? "วันนี้วันจันทร์ — ไปดูแลเว็บ Local Care"
        : "Local Care สัปดาห์นี้ — เริ่มตั้งแต่วันจันทร์";
  return (
    <div className="grid gap-8">
      {care.length ? (
        <section className="grid gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="h-2 w-2 rounded-full bg-apurple" />
            {careHeading}
            <span className="text-xs font-medium text-muted">{care.length}</span>
          </h2>
          <PagedStack items={care}>
            {(rows) => rows.map((alert) => {
            const client = clients.find((item) => item.id === alert.clientId);
            if (!client) return null;
            const href = siteHref(client.website);
            const firstMonday = Number(alert.remindFrom.slice(8, 10)) <= 7;
            return (
              <article key={`${alert.clientId}:${alert.key}`} className="rounded-2xl border border-l-4 border-slate-200/60 border-l-apurple bg-white/80 p-5 shadow-sm backdrop-blur-md">
                <p className="text-xs font-medium text-muted">
                  {alert.notified ? "จัดการแล้วสัปดาห์นี้" : today === alert.remindFrom ? "วันนี้วันจันทร์" : `จันทร์ ${formatThaiDate(alert.remindFrom)} ยังไม่ได้ทำให้ครบ`}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{client.businessName || "ยังไม่ตั้งชื่อ"}</h3>
                <p className="mt-1 text-sm text-muted">
                  {client.website.trim() || "ยังไม่ได้ใส่เว็บไซต์"}
                  {client.contactName ? ` · ${client.contactName}` : ""}
                </p>
                <ol className="mt-3 grid gap-1.5 text-sm leading-6 text-ink">
                  {LOCAL_CARE_TASKS.map((task, index) => (
                    <li key={task}>
                      {index + 1}. {task}
                      {index === LOCAL_CARE_TASKS.length - 1 && firstMonday ? " — สัปดาห์นี้ถึงรอบสรุปเดือน" : ""}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-base">
                      เปิดเว็บ
                    </a>
                  ) : null}
                  <GhostButton onClick={() => onCopy(alert)}>คัดลอกรายการ</GhostButton>
                  {alert.notified ? null : <GhostButton onClick={() => onSent(client, alert)}>จัดการแล้วสัปดาห์นี้</GhostButton>}
                </div>
              </article>
            );
          })}
          </PagedStack>
        </section>
      ) : null}
      {rest.length ? (
        <div>
          <GhostButton onClick={onCopyAll}>คัดลอกทุกข้อความที่ต้องส่ง</GhostButton>
        </div>
      ) : null}
      {BUCKETS.map((bucket) => {
        const rows = rest.filter((item) => item.bucket === bucket.id);
        if (!rows.length) return null;
        return (
          <section key={bucket.id} className="grid gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className={`h-2 w-2 rounded-full ${bucket.dot}`} />
              {bucket.title}
              <span className="text-xs font-medium text-muted">{rows.length}</span>
            </h2>
            <PagedStack items={rows}>
              {(page) => page.map((alert) => {
              const client = clients.find((item) => item.id === alert.clientId);
              if (!client) return null;
              return (
                <article key={`${alert.clientId}:${alert.key}`} className={`rounded-2xl border border-l-4 border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md ${bucket.edge}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted">
                        {alert.title} · {whenLabel(alert.daysLeft)}
                        {alert.notified ? " · แจ้งแล้ว" : ""}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">{client.businessName || "ยังไม่ตั้งชื่อ"}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {client.contactName || "ไม่ระบุผู้ติดต่อ"} · {channelLabel(client.channel)}
                        {client.phone ? ` · ${client.phone}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-ink">{alert.amount && alert.amount > 0 ? `${formatBaht(alert.amount)} บาท` : ""}</p>
                  </div>
                  <p className="mt-3 text-sm text-ink">
                    เริ่มแจ้ง {formatThaiDate(alert.remindFrom)} · ครบ {formatThaiDate(alert.dueDate)} · {sendHint(client)}
                  </p>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-ink">ข้อความสำหรับส่ง</summary>
                    <p className="mt-1 text-xs text-muted">{alert.subject}</p>
                    <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-cream/80 p-3 font-sans text-sm leading-6 text-ink">{alert.body}</pre>
                  </details>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <PrimaryButton onClick={() => onCopy(alert)}>คัดลอก</PrimaryButton>
                    {client.email.trim() ? <GhostButton onClick={() => onMail(client, alert)}>เปิดอีเมล</GhostButton> : null}
                    {alert.bucket !== "sent" ? <GhostButton onClick={() => onSent(client, alert)}>แจ้งแล้ว</GhostButton> : null}
                    {alert.kind === "billing" ? <GhostButton onClick={() => onPaid(client)}>ชำระแล้ว</GhostButton> : null}
                    {alert.kind === "domain" || alert.kind === "hosting" ? (
                      <GhostButton onClick={() => onRenew(client, alert.kind === "domain" ? "domain" : "hosting")}>ต่อแล้ว อีก 1 ปี</GhostButton>
                    ) : null}
                  </div>
                </article>
              );
            })}
            </PagedStack>
          </section>
        );
      })}
    </div>
  );
}

function clientTone(hot: Alert | undefined, careDue: boolean, paused: boolean) {
  if (paused) return { edge: "border-l-slate-300", chip: "bg-slate-100 text-muted" };
  if (hot?.bucket === "overdue") return { edge: "border-l-aorange", chip: "bg-aorange/10 text-aorange" };
  if (hot?.bucket === "send" || careDue) return { edge: "border-l-aamber", chip: "bg-aamber/25 text-ink" };
  if (hot) return { edge: "border-l-apurple/40", chip: "bg-apurple/10 text-apurple" };
  return { edge: "border-l-navy/15", chip: "bg-cream text-ink" };
}

function PagedStack({ items, children }: { items: Alert[]; children: (rows: Alert[]) => React.ReactNode }) {
  const [shown, setShown] = useState(PAGE_SIZE);
  const rows = items.slice(0, shown);
  const rest = items.length - rows.length;
  return (
    <div className="grid gap-3">
      {children(rows)}
      {rest > 0 ? (
        <button
          type="button"
          onClick={() => setShown((count) => count + PAGE_SIZE)}
          className="rounded-xl border border-apurple/20 bg-apurple/5 px-4 py-2.5 text-sm font-medium text-ink"
        >
          ดูเพิ่ม {Math.min(PAGE_SIZE, rest)} รายการ · เหลือ {rest} จาก {items.length}
        </button>
      ) : null}
    </div>
  );
}

function ClientList({
  clients,
  total,
  query,
  focus,
  onClearFocus,
  today,
  settings,
  onCreate,
  onEdit,
  onPaid,
}: {
  clients: Client[];
  total: number;
  query: string;
  focus: ListFocus | null;
  onClearFocus: () => void;
  today: string;
  settings: StudioSettings;
  onCreate: () => void;
  onEdit: (client: Client) => void;
  onPaid: (client: Client) => void;
}) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [query, focus]);
  const pages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = clients.slice(start, start + PAGE_SIZE);
  const focusLabel = focus === "send" ? "ต้องส่ง" : focus === "overdue" ? "เลยกำหนด" : focus === "later" ? "อีกไม่เกิน 60 วัน" : focus === "care" ? "ลูกค้าที่ดูแล" : "";
  const countLabel = focus ? `${focusLabel} ${clients.length} ราย` : query.trim() ? `พบ ${clients.length} จาก ${total} ราย` : `${total} ราย`;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">{countLabel}</p>
          {focus ? (
            <button type="button" onClick={onClearFocus} className="text-sm font-medium text-apurple">
              ดูทั้งหมด
            </button>
          ) : null}
        </div>
        <PrimaryButton onClick={onCreate}>เพิ่มลูกค้า</PrimaryButton>
      </div>
      {clients.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 text-sm text-muted shadow-sm">ยังไม่มีลูกค้าในรายการนี้</div>
      ) : (
        <div className="grid gap-3">
          {rows.map((client) => {
            const clientAlerts = buildAlerts(client, settings, today);
            const careDue = clientAlerts.some((item) => item.kind === "care" && !item.notified);
            const hot =
              clientAlerts.find((item) => item.kind !== "care" && (item.bucket === "overdue" || item.bucket === "send")) ||
              clientAlerts.find((item) => item.kind !== "care");
            const tone = clientTone(hot, careDue, client.paused);
            return (
              <article key={client.id} className={`rounded-2xl border border-l-4 border-slate-200/60 bg-white/80 p-5 shadow-sm ${tone.edge}`}>
                <button type="button" onClick={() => onEdit(client)} className="w-full text-left">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{client.businessName || "ยังไม่ตั้งชื่อ"}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {client.contactName || "ไม่ระบุผู้ติดต่อ"} · {channelLabel(client.channel)}
                        {client.phone ? ` · ${client.phone}` : ""}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.chip}`}>
                      {client.paused ? "พักแจ้งเตือน" : workLabel(client.workStatus)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink">{serviceLabel(client)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {cyclePhrase(client.cycleMonths)}
                    {client.nextDue ? ` · ครบบิล ${formatThaiDate(client.nextDue)}` : ""}
                    {careDue ? " · จันทร์นี้ต้องเข้าไปดูแล" : ""}
                    {hot ? ` · ${hot.title} ${whenLabel(hot.daysLeft)}` : ""}
                  </p>
                </button>
                {client.nextDue && client.workStatus !== "closed" ? (
                  <div className="mt-4">
                    <GhostButton onClick={() => onPaid(client)}>ชำระรอบนี้แล้ว</GhostButton>
                  </div>
                ) : null}
              </article>
            );
          })}
          {pages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-sm text-muted">
                {start + 1}–{start + rows.length} จาก {clients.length} ราย
              </p>
              <div className="flex items-center gap-2">
                <GhostButton onClick={() => setPage(current - 1)} className={current <= 1 ? "pointer-events-none opacity-40" : ""}>
                  ก่อนหน้า
                </GhostButton>
                <span className="min-w-14 text-center text-sm font-semibold text-ink">
                  {current} / {pages}
                </span>
                <GhostButton onClick={() => setPage(current + 1)} className={current >= pages ? "pointer-events-none opacity-40" : ""}>
                  ถัดไป
                </GhostButton>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SettingsPanel({
  settings,
  onChange,
  onCopy,
}: {
  settings: StudioSettings;
  onChange: (next: StudioSettings) => void;
  onCopy: (text: string) => void;
}) {
  const templates = sampleTemplates(settings);
  function patch(partial: Partial<StudioSettings>) {
    onChange({ ...settings, ...partial });
  }
  return (
    <div className="grid gap-6">
      <form className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm sm:p-6" onSubmit={(event) => event.preventDefault()}>
        <h2 className="text-lg font-semibold text-ink">ช่องทางรับเงิน</h2>
        <p className="mt-1 text-sm text-muted">ใส่แล้วข้อความทวงจะมีบัญชีให้ลูกค้าโอน บันทึกอัตโนมัติในเครื่องนี้</p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="ธนาคาร">
            <input className={inputClass} value={settings.bank} onChange={(e) => patch({ bank: e.target.value })} />
          </Field>
          <Field label="ชื่อบัญชี">
            <input className={inputClass} value={settings.accountName} onChange={(e) => patch({ accountName: e.target.value })} />
          </Field>
          <Field label="เลขบัญชี">
            <input className={inputClass} value={settings.accountNo} onChange={(e) => patch({ accountNo: e.target.value })} />
          </Field>
          <Field label="พร้อมเพย์">
            <input className={inputClass} value={settings.promptPay} onChange={(e) => patch({ promptPay: e.target.value })} />
          </Field>
          <Field label="บรรทัดปิดท้าย" hint="ขึ้นบรรทัดใหม่ได้">
            <textarea className={`${inputClass} min-h-24`} value={settings.signature} onChange={(e) => patch({ signature: e.target.value })} />
          </Field>
        </div>
      </form>
      <section className="grid gap-3">
        <h2 className="text-lg font-semibold text-ink">ข้อความตัวอย่างสำหรับก๊อป</h2>
        <p className="text-sm leading-6 text-muted">บนการ์ดลูกค้าจริง ชื่อ วัน และยอดจะถูกใส่ให้เอง ตัวอย่างนี้ใช้ร้านสมมติ</p>
        {templates.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <GhostButton onClick={() => onCopy(`${item.subject}\n\n${item.body}`)}>คัดลอก</GhostButton>
            </div>
            <p className="mt-2 text-xs text-muted">{item.subject}</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-cream/80 p-3 font-sans text-sm leading-6 text-ink">{item.body}</pre>
          </article>
        ))}
      </section>
    </div>
  );
}
