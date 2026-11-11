"use client";

import { saleHref, saleNavPath } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandFooter } from "@/components/sales-ai/BrandFooter";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import {
  deleteDoneAlertRemote,
  fetchDoneAlerts,
  formatAlertDate,
  isAlertDone,
  loadDoneAlerts,
  markAlertDoneRemote,
  restoreAlertRemote,
  type ManagerAlertRecord,
} from "@/lib/sales-ai/alert-inbox";
import {
  formatDayPlanLine,
  type SaleDayPlan,
} from "@/lib/sales-ai/day-plans";
import { extractManagerFollowUps } from "@/lib/sales-ai/followups";
import { ManagerLeadsSection } from "@/components/sales-ai/ManagerLeadsSection";
import {
  hasPendingFollowUp,
  isAccountStuck,
  type OpenAccount,
} from "@/lib/sales-ai/open-accounts";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import { scorecardsBySale } from "@/lib/sales-ai/scoring";

type Section =
  | "overview"
  | "leads"
  | "companies"
  | "scores"
  | "team"
  | "alerts";

type AlertItem = {
  id: string;
  tone: "danger" | "warn";
  title: string;
  companyName: string;
  salesName: string;
  hint: string;
  when: string;
  href: string;
};

type UserRow = {
  id: string;
  username: string;
  full_name: string;
  nickname?: string | null;
  phone?: string | null;
  position?: string | null;
  role: string;
  status: string;
};

const NAV: { id: Section; label: string }[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "leads", label: "เพิ่มฐานข้อมูลลูกค้า" },
  { id: "companies", label: "ลูกค้าจากงาน Sale" },
  { id: "scores", label: "ทีมและคะแนน" },
  { id: "team", label: "จัดการ Sale" },
  { id: "alerts", label: "แจ้งเตือน" },
];

function parseSection(raw: string | null): Section {
  if (
    raw === "overview" ||
    raw === "leads" ||
    raw === "companies" ||
    raw === "scores" ||
    raw === "team" ||
    raw === "alerts"
  ) {
    return raw;
  }
  if (raw === "accounts" || raw === "open") return "leads";
  return "overview";
}

function todayKeyBangkok() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function dayKeyOf(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function shiftDayKey(dayKey: string, delta: number) {
  const d = new Date(`${dayKey}T12:00:00+07:00`);
  d.setDate(d.getDate() + delta);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function dayLabelOf(dayKey: string) {
  if (dayKey === "unknown") return "ไม่ระบุวัน";
  return new Date(`${dayKey}T12:00:00+07:00`).toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  });
}

function dayPickerTitle(dayKey: string) {
  const today = todayKeyBangkok();
  const full = new Date(`${dayKey}T12:00:00+07:00`).toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  });
  if (dayKey === today) return `วันนี้ · ${full}`;
  if (dayKey === shiftDayKey(today, -1)) return `เมื่อวาน · ${full}`;
  if (dayKey === shiftDayKey(today, 1)) return `พรุ่งนี้ · ${full}`;
  return full;
}

function urgencyLabel(u: string) {
  if (u === "line_down") return "ด่วน · เครื่องหยุด";
  if (u === "urgent") return "ด่วน";
  return "ปกติ";
}

type ManagerAskBubble = {
  id: string;
  role: "manager" | "assistant";
  content: string;
};

const MANAGER_ASK_WELCOME: ManagerAskBubble = {
  id: "welcome",
  role: "assistant",
  content:
    "สวัสดีค่ะ ดิฉันผู้ช่วยผู้จัดการค่ะ ถามได้เลยว่า Sale คนไหนทำได้ดี ลูกค้าไหนถูกเยี่ยมบ่อย หรืองานไหนรอตรวจ — ดึงจากรายงานและทีมทั้งฐานให้ค่ะ",
};

function managerAskStorageKey(managerId: string) {
  return `ap_sale_manager_ask_v1:${managerId || "guest"}`;
}

function loadManagerAskTurns(managerId: string): ManagerAskBubble[] {
  if (typeof window === "undefined" || !managerId) return [MANAGER_ASK_WELCOME];
  try {
    const raw = localStorage.getItem(managerAskStorageKey(managerId));
    if (!raw) return [MANAGER_ASK_WELCOME];
    const parsed = JSON.parse(raw) as ManagerAskBubble[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [MANAGER_ASK_WELCOME];
    return parsed
      .filter(
        (t) =>
          t &&
          (t.role === "manager" || t.role === "assistant") &&
          typeof t.content === "string",
      )
      .slice(-40);
  } catch {
    return [MANAGER_ASK_WELCOME];
  }
}

function saveManagerAskTurns(managerId: string, turns: ManagerAskBubble[]) {
  if (typeof window === "undefined" || !managerId) return;
  try {
    localStorage.setItem(
      managerAskStorageKey(managerId),
      JSON.stringify(turns.slice(-40)),
    );
  } catch {
    /* quota */
  }
}

/** Manager desktop dashboard — ดูง่ายบนคอม · จัดการ Sale ได้ */
export default function ManagerPage() {
  const { profile, reports } = useSaleStore();
  const [section, setSection] = useState<Section>(() => {
    if (typeof window === "undefined") return "overview";
    try {
      return parseSection(new URLSearchParams(window.location.search).get("tab"));
    } catch {
      return "overview";
    }
  });
  const [query, setQuery] = useState("");
  const [openCompany, setOpenCompany] = useState<string | null>(null);
  const [ask, setAsk] = useState("");
  const [askBusy, setAskBusy] = useState(false);
  const [askErr, setAskErr] = useState<string | null>(null);
  const [askTurns, setAskTurns] = useState<ManagerAskBubble[]>([MANAGER_ASK_WELCOME]);
  const [askHydrated, setAskHydrated] = useState(false);
  const askEndRef = useRef<HTMLDivElement | null>(null);
  const askScrollRef = useRef<HTMLDivElement | null>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [teamMsg, setTeamMsg] = useState<string | null>(null);
  const [teamErr, setTeamErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    nickname: "",
    phone: "",
    position: "",
    password: "",
  });
  const [doneAlerts, setDoneAlerts] = useState<ManagerAlertRecord[]>([]);
  const [openAccounts, setOpenAccounts] = useState<OpenAccount[]>([]);
  const [alertTab, setAlertTab] = useState<"open" | "done">("open");
  const [overviewDay, setOverviewDay] = useState(todayKeyBangkok);
  const [dayPopupOpen, setDayPopupOpen] = useState(false);
  const dayPopupRef = useRef<HTMLDivElement | null>(null);
  const [dayPlans, setDayPlans] = useState<SaleDayPlan[]>([]);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/sale/users");
    const json = (await res.json()) as { ok: boolean; users?: UserRow[]; error?: string };
    if (res.ok && json.ok) setUsers(json.users || []);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const refreshOpenAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/sale/accounts?status=active");
      const json = (await res.json()) as {
        ok?: boolean;
        accounts?: OpenAccount[];
      };
      if (json.ok) setOpenAccounts(json.accounts || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshOpenAccounts();
  }, [refreshOpenAccounts]);

  // เข้าแท็บแจ้งเตือน / รับลูกค้า → รีเฟรชงานติดตามในฐาน
  useEffect(() => {
    if (section === "alerts" || section === "leads") {
      void refreshOpenAccounts();
    }
  }, [section, refreshOpenAccounts]);

  useEffect(() => {
    // cache ต่อบัญชีก่อน แล้วดึงจากเซิร์ฟเวอร์ (จำข้ามเครื่อง/วัน)
    setDoneAlerts(loadDoneAlerts(profile.id));
    let cancelled = false;
    (async () => {
      const list = await fetchDoneAlerts(profile.id);
      if (!cancelled) setDoneAlerts(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/sale/day-plans?day=${encodeURIComponent(overviewDay)}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          plans?: SaleDayPlan[];
        };
        if (!cancelled && json.ok) setDayPlans(json.plans || []);
      } catch {
        if (!cancelled) setDayPlans([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [overviewDay]);

  useEffect(() => {
    const id = profile?.id || "";
    if (!id) return;
    setAskTurns(loadManagerAskTurns(id));
    setAskHydrated(true);
  }, [profile?.id]);

  useEffect(() => {
    if (!askHydrated || !profile?.id) return;
    saveManagerAskTurns(profile.id, askTurns);
  }, [askHydrated, askTurns, profile?.id]);

  useEffect(() => {
    if (!dayPopupOpen) return;
    function onDoc(e: MouseEvent) {
      if (!dayPopupRef.current?.contains(e.target as Node)) {
        setDayPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [dayPopupOpen]);

  useEffect(() => {
    const box = askScrollRef.current;
    if (!box) return;
    box.scrollTop = box.scrollHeight;
  }, [askTurns, askBusy]);

  const sendManagerAsk = useCallback(async () => {
    const text = ask.trim();
    if (!text || askBusy) return;

    const managerTurn = {
      id: `m-${Date.now()}`,
      role: "manager" as const,
      content: text,
    };
    const history = askTurns
      .filter((t) => t.id !== "welcome")
      .slice(-8)
      .map((t) => ({ role: t.role, content: t.content }));

    setAsk("");
    setAskErr(null);
    setAskBusy(true);
    setAskTurns((prev) => [...prev, managerTurn]);

    try {
      const res = await fetch("/api/sale/manager/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, history }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        error?: string;
      };
      const reply =
        (json.reply || "").trim() ||
        "ยังสรุปจากฐานข้อมูลไม่ได้ชัดค่ะ ลองถามเจาะจงขึ้นได้นะคะ";
      setAskTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
        },
      ]);
      if (!res.ok && json.error) setAskErr(json.error);
    } catch {
      setAskTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "เชื่อมต่อผู้ช่วยผู้จัดการไม่สำเร็จค่ะ ลองใหม่อีกครั้งนะคะ",
        },
      ]);
      setAskErr("network");
    } finally {
      setAskBusy(false);
    }
  }, [ask, askBusy, askTurns]);

  const followUps = useMemo(() => extractManagerFollowUps(reports), [reports]);
  const scoreCards = useMemo(() => scorecardsBySale(reports), [reports]);

  /** สรุปเลขาแบบผู้ช่วย Sale รายงานขึ้นผู้จัดการ */
  const secretaryBrief = useMemo(() => {
    const today = todayKeyBangkok();
    const day = overviewDay;
    const isToday = day === today;
    const dayReports = [...reports]
      .filter((r) => dayKeyOf(r.confirmedAt || r.createdAt) === day)
      .sort((a, b) =>
        (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt),
      );

    const dayLabel =
      day === today
        ? "วันนี้"
        : day === shiftDayKey(today, -1)
          ? "เมื่อวาน"
          : dayLabelOf(day);

    function hasQuote(r: (typeof reports)[number]) {
      const steps = r.summary.next_steps || [];
      const items = r.summary.items || [];
      return (
        steps.some((s) => /เสนอราคา|quote|ใบเสนอ/i.test(s.title || "")) ||
        items.some((i) => i.kind === "quote_request")
      );
    }
    function hasAppointment(r: (typeof reports)[number]) {
      return (r.summary.next_steps || []).some((s) =>
        /นัด|ครั้งต่อไป|พบอีก|follow.?up|เข้าพบ|ไปหา/i.test(s.title || ""),
      );
    }
    function hasDelivery(r: (typeof reports)[number]) {
      return (r.summary.next_steps || []).some((s) =>
        /ส่งของ|จัดส่ง|delivery|ส่งชิ้น|ส่งอะไหล่/i.test(s.title || ""),
      );
    }
    function appointmentHint(r: (typeof reports)[number]) {
      const step = (r.summary.next_steps || []).find((s) =>
        /นัด|ครั้งต่อไป|พบอีก|บ่าย|โมง|เช้า/i.test(s.title || ""),
      );
      return step?.title?.trim() || null;
    }

    const lines: string[] = [];

    if (dayPlans.length > 0) {
      lines.push(
        isToday
          ? `มี Sale แจ้งแผนวันนี้แล้ว ${dayPlans.length} คนค่ะ`
          : `${dayLabel} มีแผนจาก Sale ${dayPlans.length} คนค่ะ`,
      );
      for (const plan of dayPlans.slice(0, 6)) {
        lines.push(formatDayPlanLine(plan));
      }
    }

    if (dayReports.length === 0) {
      if (dayPlans.length === 0) {
        lines.push(
          isToday
            ? "ณ ตอนนี้ยังไม่มีแผนและยังไม่มีรายงานเยี่ยมวันนี้ค่ะ"
            : `${dayLabel} ยังไม่มีแผนและรายงานเยี่ยมค่ะ`,
        );
      } else {
        lines.push(
          isToday
            ? "ยังไม่มีรายงานเยี่ยมเข้ามา — ดูแผนด้านล่างได้ค่ะ"
            : `${dayLabel} ยังไม่มีรายงานเยี่ยม — มีแค่แผนที่แจ้งไว้`,
        );
      }
    } else {
      const saleCount = new Set(
        dayReports.map((r) => r.salesId || r.salesName),
      ).size;
      lines.push(
        isToday
          ? `ทีมรายงานเข้ามาแล้ว ${dayReports.length} ครั้ง จาก Sale ${saleCount} คนค่ะ`
          : `${dayLabel} มีรายงาน ${dayReports.length} ครั้ง จาก Sale ${saleCount} คนค่ะ`,
      );

      for (const r of dayReports.slice(0, 8)) {
        const name = r.salesName || "Sale";
        const company = r.companyName || "ลูกค้า";
        const bits: string[] = [];

        if (r.status === "pending_review") {
          bits.push(`เพิ่งส่งสรุปจาก ${company} รอตรวจ`);
        } else {
          bits.push(`ไป ${company} เสร็จแล้ว`);
        }
        if (hasQuote(r)) bits.push("มีให้เสนอราคา");
        if (hasDelivery(r)) bits.push("มีงานรอส่งของ");
        const appt = appointmentHint(r);
        if (appt) bits.push(`นัดต่อ: ${appt.slice(0, 48)}`);
        else if (hasAppointment(r)) bits.push("มีนัดครั้งต่อไป");

        lines.push(`${name} ${bits.join(" · ")}`);
      }
      if (dayReports.length > 8) {
        lines.push(`และอีก ${dayReports.length - 8} รายงาน — เปิดจากรายการด้านล่างได้ค่ะ`);
      }
    }

    const visitRows = dayReports.map((r) => ({
      id: r.id,
      sales: r.salesName || "Sale",
      company: r.companyName || "ไม่ระบุ",
      time: new Date(r.confirmedAt || r.createdAt).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Bangkok",
      }),
      status: r.status,
    }));

    return {
      isToday,
      dayLabel,
      title: isToday ? "สรุปเลขา ณ ตอนนี้" : `สรุปเลขา · ${dayLabel}`,
      lines,
      visitRows,
      dayPlans,
    };
  }, [reports, overviewDay, dayPlans]);

  const nearbyDays = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of reports) {
      const k = dayKeyOf(r.confirmedAt || r.createdAt);
      if (k === "unknown") continue;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    const base = overviewDay;
    return Array.from({ length: 9 }, (_, i) => {
      const key = shiftDayKey(base, i - 4);
      return { key, count: counts.get(key) || 0, label: dayPickerTitle(key) };
    });
  }, [overviewDay, reports]);

  const feed = useMemo(() => {
    return [...reports]
      .filter((r) => dayKeyOf(r.confirmedAt || r.createdAt) === overviewDay)
      .sort((a, b) =>
        (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt),
      )
      .map((r) => ({
        id: r.id,
        company: r.companyName,
        sales: r.salesName || "Sale",
        urgency: r.urgency,
        summary:
          r.summary.discussion?.[0]?.detail ||
          r.summary.purpose?.value ||
          r.note ||
          "รายงานการเยี่ยม",
        time: new Date(r.confirmedAt || r.createdAt).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Bangkok",
        }),
      }));
  }, [reports, overviewDay]);

  const companies = useMemo(() => {
    const map = new Map<
      string,
      {
        companyName: string;
        visits: {
          id: string;
          salesName: string;
          dayKey: string;
          time: string;
          purpose: string;
          urgency: string;
          status: string;
        }[];
      }
    >();
    for (const r of reports) {
      const name = r.companyName || "ไม่ระบุบริษัท";
      const when = r.confirmedAt || r.createdAt;
      const cur = map.get(name) || { companyName: name, visits: [] };
      cur.visits.push({
        id: r.id,
        salesName: r.salesName || "Sale",
        dayKey: dayKeyOf(when),
        time: new Date(when).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Bangkok",
        }),
        purpose:
          r.summary.purpose?.value ||
          r.summary.discussion?.[0]?.topic ||
          "รายงานการเยี่ยม",
        urgency: r.urgency,
        status: r.status,
      });
      map.set(name, cur);
    }
    return [...map.values()]
      .map((c) => ({
        ...c,
        visits: c.visits.sort((a, b) =>
          `${b.dayKey}${b.time}`.localeCompare(`${a.dayKey}${a.time}`),
        ),
        salesNames: [...new Set(c.visits.map((v) => v.salesName))],
      }))
      .sort((a, b) => a.companyName.localeCompare(b.companyName, "th"));
  }, [reports]);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.salesNames.some((s) => s.toLowerCase().includes(q)),
    );
  }, [companies, query]);

  const salesUsers = useMemo(
    () => users.filter((u) => u.role === "sales"),
    [users],
  );

  const allAlertItems = useMemo(() => {
    const items: AlertItem[] = [];
    const seen = new Set<string>();
    for (const f of followUps) {
      if (seen.has(f.id)) continue;
      seen.add(f.id);
      items.push({
        id: f.id,
        tone: f.priority === "high" ? "danger" : "warn",
        title:
          f.kind === "quote" && !/เสนอราคา|quote|ใบเสนอ/i.test(f.title)
            ? `ใบเสนอราคา: ${f.title}`
            : f.title,
        companyName: f.companyName,
        salesName: f.salesName,
        hint: f.hint,
        when: f.when,
        href: saleHref(`/report/${f.reportId}`),
      });
    }
    for (const a of openAccounts) {
      if (!hasPendingFollowUp(a)) continue;
      const stuck = isAccountStuck(a);
      const id = `account:${a.id}:followup`;
      if (seen.has(id)) continue;
      seen.add(id);
      items.push({
        id,
        tone: stuck ? "danger" : "warn",
        title: a.nextAction?.trim() || "งานติดตามในฐานลูกค้า",
        companyName: a.companyName || "ไม่ระบุบริษัท",
        salesName: a.ownerSalesName || a.createdByName || "ฐานลูกค้า",
        hint: stuck
          ? a.ownerSalesName
            ? `ค้าง · มอบหมาย ${a.ownerSalesName}`
            : "เลยกำหนดหรือค้างอัปเดต — เปิดแท็บเพิ่มฐานข้อมูลลูกค้า"
          : a.ownerSalesName
            ? `ต้องติดตาม · มอบหมาย ${a.ownerSalesName}`
            : "มีงานถัดไปจากฐานลูกค้าที่ผู้จัดการใส่",
        when: a.nextActionAt || a.updatedAt,
        href: saleHref("/manager?tab=leads"),
      });
    }
    return items;
  }, [followUps, openAccounts]);

  const doneIds = useMemo(() => new Set(doneAlerts.map((d) => d.id)), [doneAlerts]);

  const alertItems = useMemo(() => {
    const open = allAlertItems.filter(
      (a) => !isAlertDone(a.id, a.title, doneIds, doneAlerts),
    );
    // กรองที่ติกแล้วก่อน แล้วค่อยโชว์สูงสุด 60 — ไม่ให้รายการใหม่ดันของเก่าที่ติกแล้วกลับมาแทน
    return open.slice(0, 60);
  }, [allAlertItems, doneIds, doneAlerts]);

  /** แจ้งเตือนย่อเป็นกลุ่มนับ — ไม่โชว์การ์ดยาว */
  const alertBuckets = useMemo(() => {
    const buckets = {
      quote: 0,
      appointment: 0,
      delivery: 0,
      other: 0,
    };
    for (const a of alertItems) {
      const t = `${a.title} ${a.hint}`;
      if (/เสนอราคา|quote|ใบเสนอ/i.test(t)) buckets.quote += 1;
      else if (/นัด|ครั้งต่อไป|พบอีก|follow.?up|เข้าพบ/i.test(t))
        buckets.appointment += 1;
      else if (/ส่งของ|จัดส่ง|delivery|ส่งชิ้น|ส่งอะไหล่/i.test(t))
        buckets.delivery += 1;
      else buckets.other += 1;
    }
    return [
      { key: "quote", label: "ส่งใบเสนอราคา", count: buckets.quote },
      { key: "appointment", label: "มีนัดหมายครั้งต่อไป", count: buckets.appointment },
      { key: "delivery", label: "รอส่งของ", count: buckets.delivery },
      { key: "other", label: "อื่นๆ", count: buckets.other },
    ].filter((b) => b.count > 0);
  }, [alertItems]);

  async function completeAlert(a: AlertItem) {
    const list = await markAlertDoneRemote(profile.id, {
      id: a.id,
      title: a.title,
      companyName: a.companyName,
      salesName: a.salesName,
      hint: a.hint,
      href: a.href,
      when: a.when,
    });
    setDoneAlerts(list);
  }

  async function undoAlert(id: string) {
    const list = await restoreAlertRemote(profile.id, id);
    setDoneAlerts(list);
    setAlertTab("open");
  }

  async function removeDoneAlert(id: string) {
    const list = await deleteDoneAlertRemote(profile.id, id);
    setDoneAlerts(list);
  }

  async function onCreateSale(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTeamErr(null);
    setTeamMsg(null);
    try {
      const res = await fetch("/api/sale/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "sales" }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setTeamErr(json.error || "สร้างไม่สำเร็จ");
        return;
      }
      setTeamMsg("เพิ่ม Sale แล้ว");
      setForm({ username: "", password: "", fullName: "", phone: "" });
      await loadUsers();
    } finally {
      setSaving(false);
    }
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    setTeamErr(null);
    setTeamMsg(null);
    try {
      const payload: Record<string, string> = {
        id: editId,
        username: editForm.username.trim().toLowerCase(),
        fullName: editForm.fullName,
        nickname: editForm.nickname,
        phone: editForm.phone,
        position: editForm.position,
      };
      if (editForm.password.trim()) payload.password = editForm.password.trim();
      const res = await fetch("/api/sale/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setTeamErr(json.error || "บันทึกไม่สำเร็จ");
        return;
      }
      setTeamMsg("แก้ไข Sale แล้ว");
      setEditId(null);
      await loadUsers();
    } finally {
      setSaving(false);
    }
  }

  async function setSaleStatus(id: string, status: "active" | "suspended") {
    setTeamErr(null);
    const res = await fetch("/api/sale/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!res.ok || !json.ok) {
      setTeamErr(json.error || "เปลี่ยนสถานะไม่สำเร็จ");
      return;
    }
    await loadUsers();
  }

  return (
    <div className="min-h-dvh lg:flex" style={{ background: "#eef2f6" }}>
      <aside
        className="hidden w-64 shrink-0 flex-col px-4 py-6 text-white lg:flex"
        style={{ background: "var(--sale-navy)" }}
      >
        <BrandMark tone="dark" size="sm" showProduct={false} />
        <p className="mt-3 text-xs font-semibold text-white/95">Manager</p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-white/55">
          ผู้บริหาร · ดูรายงาน · จัดการ Sale
        </p>
        <nav className="mt-8 space-y-0.5 text-sm">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                try {
                  const url = new URL(window.location.href);
                  if (item.id === "overview") url.searchParams.delete("tab");
                  else url.searchParams.set("tab", item.id);
                  window.history.replaceState({}, "", url.toString());
                } catch {
                  /* ignore */
                }
              }}
              className="block w-full rounded-lg px-3 py-2 text-left"
              style={{
                background:
                  section === item.id ? "rgba(255,255,255,0.14)" : "transparent",
                fontWeight: section === item.id ? 600 : 400,
                color: section === item.id ? "#fff" : "rgba(255,255,255,0.82)",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1 pt-6">
          <Link
            href={saleHref("/profile")}
            className="block px-3 py-2 text-xs text-white/70 hover:text-white"
          >
            โปรไฟล์ของฉัน
          </Link>
          {profile.role === "admin" ? (
            <Link href={saleHref("/admin")} className="block px-3 py-2 text-xs text-white/70 hover:text-white">
              ← Admin ระบบ
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-white/70 hover:text-white"
            onClick={async () => {
              await fetch("/api/sale/auth/logout", { method: "POST" });
              window.location.href = saleNavPath("/");
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap gap-2 lg:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                try {
                  const url = new URL(window.location.href);
                  if (item.id === "overview") url.searchParams.delete("tab");
                  else url.searchParams.set("tab", item.id);
                  window.history.replaceState({}, "", url.toString());
                } catch {
                  /* ignore */
                }
              }}
              className="rounded-full px-3 py-1.5 text-xs"
              style={{
                background: section === item.id ? "var(--sale-navy)" : "#fff",
                color: section === item.id ? "#fff" : "var(--sale-navy)",
                border: section === item.id ? "none" : "1px solid #dbe3ee",
              }}
            >
              {item.label}
            </button>
          ))}
          <Link
            href={saleHref("/profile")}
            className="rounded-full px-3 py-1.5 text-xs"
            style={{
              background: "#fff",
              color: "var(--sale-navy)",
              border: "1px solid #dbe3ee",
            }}
          >
            โปรไฟล์
          </Link>
        </div>

        <header className="mb-5 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1
                className="text-xl font-semibold"
                style={{ color: "var(--sale-navy)" }}
              >
                {NAV.find((n) => n.id === section)?.label}
              </h1>
              <p className="mt-0.5 text-xs" style={{ color: "var(--sale-muted)" }}>
                {section === "leads"
                  ? "ลูกค้าเก่า · ยังติดต่อ · งานค้าง — ผู้จัดการใส่ · ฐานเดียวกับ Sale"
                  : `${SALE_BRAND.legalName} · ออกแบบสำหรับดูบนคอมพิวเตอร์`}
              </p>
            </div>
            {alertItems.length > 0 ? (
              <button
                type="button"
                onClick={() => setSection("alerts")}
                className="sale-chip"
                style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
              >
                แจ้งเตือน {alertItems.length} รายการ
              </button>
            ) : null}
          </div>
          <form
            className="flex gap-2 rounded-2xl border p-2"
            style={{
              background: "var(--sale-navy-soft)",
              borderColor: "rgba(18, 38, 63, 0.18)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const q = String(fd.get("q") || "").trim();
              window.location.href = saleNavPath(
                `/search?q=${encodeURIComponent(q)}`,
              );
            }}
          >
            <input
              name="q"
              placeholder="ค้นหาชื่อ เบอร์ บริษัท หรือสินค้า…"
              className="min-w-0 flex-1 rounded-xl border bg-white/70 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:bg-white"
              style={{
                borderColor: "rgba(18, 38, 63, 0.12)",
                color: "var(--sale-navy)",
              }}
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl border px-4 py-2 text-sm font-medium"
              style={{
                borderColor: "rgba(18, 38, 63, 0.22)",
                background: "rgba(255,255,255,0.85)",
                color: "var(--sale-navy)",
              }}
            >
              ค้นหา
            </button>
          </form>
        </header>

        {section === "overview" ? (
          <div className="space-y-4">
            <div className="relative" ref={dayPopupRef}>
              <div
                className="flex items-center gap-2 rounded-2xl border bg-white px-2 py-2 shadow-sm"
                style={{ borderColor: "var(--sale-line)" }}
              >
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
                  onClick={() => setOverviewDay((d) => shiftDayKey(d, -1))}
                  aria-label="วันก่อนหน้า"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="min-w-0 flex-1 rounded-xl px-3 py-2 text-left"
                  style={{ background: "var(--sale-bg)" }}
                  onClick={() => setDayPopupOpen((o) => !o)}
                >
                  <p className="truncate text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                    {dayPickerTitle(overviewDay)}
                  </p>
                  <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                    กดเพื่อเลือกวัน · รายงาน {feed.length} ฉบับ
                  </p>
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
                  onClick={() => setOverviewDay((d) => shiftDayKey(d, 1))}
                  aria-label="วันถัดไป"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {dayPopupOpen ? (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border bg-white shadow-lg"
                  style={{ borderColor: "var(--sale-line)" }}
                >
                  <div className="border-b px-3 py-2" style={{ borderColor: "var(--sale-line)" }}>
                    <p className="text-xs font-semibold" style={{ color: "var(--sale-navy)" }}>
                      เลือกวัน
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                        style={{ background: "var(--sale-navy)", color: "#fff" }}
                        onClick={() => {
                          setOverviewDay(todayKeyBangkok());
                          setDayPopupOpen(false);
                        }}
                      >
                        วันนี้
                      </button>
                      <button
                        type="button"
                        className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                        style={{
                          background: "var(--sale-navy-soft)",
                          color: "var(--sale-navy)",
                        }}
                        onClick={() => {
                          setOverviewDay(shiftDayKey(todayKeyBangkok(), -1));
                          setDayPopupOpen(false);
                        }}
                      >
                        เมื่อวาน
                      </button>
                      <label className="ml-auto inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                        กระโดดไป
                        <input
                          type="date"
                          value={overviewDay}
                          onChange={(e) => {
                            if (!e.target.value) return;
                            setOverviewDay(e.target.value);
                            setDayPopupOpen(false);
                          }}
                          className="rounded-lg border px-2 py-1 text-[11px]"
                          style={{ borderColor: "var(--sale-line)" }}
                        />
                      </label>
                    </div>
                  </div>
                  <ul className="max-h-72 overflow-y-auto p-2">
                    {nearbyDays.map((d) => (
                      <li key={d.key}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm"
                          style={{
                            background:
                              d.key === overviewDay ? "var(--sale-navy-soft)" : "transparent",
                            color: "var(--sale-navy)",
                          }}
                          onClick={() => {
                            setOverviewDay(d.key);
                            setDayPopupOpen(false);
                          }}
                        >
                          <span className="font-medium">{d.label}</span>
                          <span className="text-xs" style={{ color: "var(--sale-muted)" }}>
                            {d.count > 0 ? `${d.count} รายงาน` : "—"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section
              className="sale-card flex min-h-[28rem] flex-col overflow-hidden p-0 lg:row-span-2 lg:min-h-[32rem]"
              style={{ borderColor: "var(--sale-line)" }}
            >
              <div
                className="border-b px-4 py-3.5"
                style={{
                  background: "linear-gradient(135deg, #e8eef5 0%, #f3f6f9 55%, #eef2f6 100%)",
                  borderColor: "var(--sale-line)",
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--sale-muted)" }}
                >
                  รายงานเลขาผู้จัดการ
                </p>
                <h2 className="mt-0.5 text-base font-semibold" style={{ color: "var(--sale-navy)" }}>
                  {secretaryBrief.title}
                </h2>
                <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                  {secretaryBrief.isToday
                    ? "ผู้ช่วยหน้างานรายงานขึ้นผู้จัดการ — อ่านจบรู้ว่าใครไปไหน"
                    : `ย้อนสรุปรายวัน · ${secretaryBrief.dayLabel}`}
                </p>
              </div>

              <div className="space-y-2.5 px-4 py-4 text-sm leading-relaxed">
                {secretaryBrief.lines.map((line, i) => (
                  <p
                    key={`brief-${i}`}
                    className="border-l-[3px] pl-3"
                    style={{
                      borderColor: i === 0 ? "var(--sale-navy)" : "var(--sale-line)",
                      color: "var(--sale-text)",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {secretaryBrief.dayPlans.length > 0 ? (
                <div
                  className="border-t px-4 py-3"
                  style={{ borderColor: "var(--sale-line)" }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: "var(--sale-muted)" }}
                  >
                    แผนวันนี้ของทีม
                    {!secretaryBrief.isToday ? ` · ${secretaryBrief.dayLabel}` : ""}
                    {` · ${secretaryBrief.dayPlans.length} คน`}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {secretaryBrief.dayPlans.map((plan) => (
                      <li
                        key={plan.id || plan.salesId}
                        className="rounded-xl px-3 py-2.5"
                        style={{ background: "var(--sale-bg)" }}
                      >
                        <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                          {plan.salesName || "Sale"}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {plan.stops.map((s, i) => (
                            <li
                              key={`${plan.salesId}-${i}`}
                              className="text-[13px] leading-snug"
                            >
                              <span className="font-medium">{s.company}</span>
                              <span style={{ color: "var(--sale-muted)" }}>
                                {" "}
                                ·{" "}
                                {[s.time, s.purpose, s.meetWho ? `เจอ ${s.meetWho}` : null]
                                  .filter(Boolean)
                                  .join(" · ") || "—"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className="mt-auto border-t px-4 py-3"
                style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--sale-muted)" }}
                >
                  รายงานเยี่ยมทั้งหมด
                  {!secretaryBrief.isToday ? ` · ${secretaryBrief.dayLabel}` : ""}
                  {secretaryBrief.visitRows.length
                    ? ` · ${secretaryBrief.visitRows.length} รายการ`
                    : ""}
                </p>
                {secretaryBrief.visitRows.length ? (
                  <ul className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-0.5">
                    {secretaryBrief.visitRows.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5"
                        style={{ border: "1px solid var(--sale-line)" }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                            {row.sales}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] font-medium">{row.company}</p>
                          <p className="mt-0.5 text-[12px] tabular-nums" style={{ color: "var(--sale-muted)" }}>
                            {row.time}
                            {row.status === "pending_review" ? " · รอตรวจ" : ""}
                          </p>
                        </div>
                        <Link
                          href={saleHref(`/report/${row.id}`)}
                          className="shrink-0 rounded-xl border px-3 py-2 text-[12px] font-semibold"
                          style={{
                            background: "#fff",
                            color: "#0f2744",
                            borderColor: "#0f2744",
                          }}
                        >
                          เปิดรายงาน
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm" style={{ color: "var(--sale-muted)" }}>
                    {secretaryBrief.isToday
                      ? "ยังไม่มีรายงานเยี่ยมวันนี้"
                      : `${secretaryBrief.dayLabel} ไม่มีรายงานเยี่ยม`}
                  </p>
                )}
              </div>
            </section>

            <section className="sale-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">แจ้งเตือนที่ยังไม่ทำ</h2>
                {alertItems.length > 0 ? (
                  <button
                    type="button"
                    className="text-xs font-medium"
                    style={{ color: "var(--sale-navy)" }}
                    onClick={() => setSection("alerts")}
                  >
                    ดูรายการ ({alertItems.length})
                  </button>
                ) : null}
              </div>
              {alertBuckets.length ? (
                <ul className="mt-3 space-y-2">
                  {alertBuckets.map((b) => (
                    <li key={b.key}>
                      <button
                        type="button"
                        onClick={() => setSection("alerts")}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:opacity-90"
                        style={{ background: "var(--sale-bg)" }}
                      >
                        <span className="font-medium" style={{ color: "var(--sale-navy)" }}>
                          {b.label}
                        </span>
                        <span
                          className="rounded-lg px-2 py-0.5 text-[12px] font-bold tabular-nums"
                          style={{
                            background: "var(--sale-navy-soft)",
                            color: "var(--sale-navy)",
                          }}
                        >
                          {b.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm" style={{ color: "var(--sale-muted)" }}>
                  ไม่มีแจ้งเตือนค้างอยู่
                </p>
              )}
            </section>

            <section
              className="flex h-[34rem] flex-col overflow-hidden rounded-2xl border p-4"
              style={{
                background: "linear-gradient(165deg, #0f2744 0%, #163556 48%, #1a3d5c 100%)",
                borderColor: "rgba(255,255,255,0.12)",
                boxShadow: "0 12px 40px rgba(15,39,68,0.28)",
              }}
            >
              <h2 className="shrink-0 text-sm font-semibold text-white">ถาม AI ผู้ช่วยผู้จัดการ</h2>
              <p className="mt-1 shrink-0 text-[11px]" style={{ color: "rgba(226,236,248,0.72)" }}>
                ดึงรายงาน · คะแนน · รายชื่อทีม · สถานะงานทั้งฐาน
              </p>
              <div
                ref={askScrollRef}
                className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain pr-1"
              >
                {askTurns.map((t) => {
                  const mine = t.role === "manager";
                  const lines = t.content
                    .replace(/\r\n/g, "\n")
                    .split(/\n+/)
                    .map((l) => l.trim())
                    .filter(Boolean);
                  return (
                    <div
                      key={t.id}
                      className={`max-w-[95%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        mine ? "ml-auto" : ""
                      }`}
                      style={{
                        background: mine
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.1)",
                        color: mine ? "#0f2744" : "rgba(245,249,255,0.95)",
                        border: mine
                          ? "none"
                          : "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <div className="space-y-2">
                        {lines.map((line, i) => {
                          const parts = line.split(/(\/report\/[a-zA-Z0-9_-]+|\/sale\/report\/[a-zA-Z0-9_-]+)/g);
                          return (
                            <p key={`${t.id}-${i}`} className="leading-relaxed">
                              {parts.map((part, j) => {
                                if (/^\/(?:sale\/)?report\//.test(part)) {
                                  const href = saleHref(
                                    part.replace(/^\/sale/, "") || part,
                                  );
                                  return (
                                    <Link
                                      key={`${t.id}-${i}-${j}`}
                                      href={href}
                                      className="underline underline-offset-2"
                                      style={{
                                        color: mine ? "#163556" : "#9ec5ff",
                                      }}
                                    >
                                      {part.replace(/^\/sale/, "")}
                                    </Link>
                                  );
                                }
                                return <span key={`${t.id}-${i}-${j}`}>{part}</span>;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {askBusy ? (
                  <div
                    className="max-w-[95%] rounded-2xl px-3.5 py-2.5 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(226,236,248,0.75)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    กำลังสรุปจากฐานข้อมูล…
                  </div>
                ) : null}
                <div ref={askEndRef} />
              </div>
              {askErr ? (
                <p className="mt-2 text-[11px]" style={{ color: "#fbbf24" }}>
                  ถ้าคำตอบไม่ครบ ลองถามใหม่อีกครั้งได้ค่ะ
                </p>
              ) : null}
              <div
                className="mt-3 flex shrink-0 gap-2 border-t pt-3"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                <input
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendManagerAsk();
                    }
                  }}
                  placeholder="เช่น Sale คนไหนทำได้ดีที่สุด…"
                  disabled={askBusy}
                  className="min-h-12 flex-1 rounded-xl border px-3 text-sm outline-none placeholder:text-slate-400 disabled:opacity-60"
                  style={{
                    borderColor: "rgba(255,255,255,0.35)",
                    background: "#fff",
                    color: "#0f2744",
                  }}
                />
                <button
                  type="button"
                  className="touch-target rounded-xl px-4 text-sm font-semibold disabled:opacity-60"
                  style={{
                    background: "#fff",
                    color: "#0f2744",
                  }}
                  disabled={askBusy || !ask.trim()}
                  onClick={() => void sendManagerAsk()}
                >
                  ถาม
                </button>
              </div>
            </section>
            </div>
          </div>
        ) : null}

        {section === "leads" ? (
          <ManagerLeadsSection
            managerId={profile.id}
            managerName={profile.nickname || profile.fullName || "ผู้จัดการ"}
            salesOptions={salesUsers.map((u) => ({
              id: u.id,
              label: u.nickname || u.full_name || u.username,
              username: u.username,
            }))}
            onAccountsChanged={() => void refreshOpenAccounts()}
          />
        ) : null}

        {section === "companies" ? (
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาบริษัท หรือชื่อ Sale"
              className="mb-4 min-h-11 w-full max-w-md rounded-xl border px-3 text-sm outline-none"
              style={{ borderColor: "var(--sale-line)", background: "#fff" }}
            />
            <ul className="space-y-3">
              {filteredCompanies.map((c) => {
                const open = openCompany === c.companyName;
                const byDay = new Map<string, typeof c.visits>();
                for (const v of c.visits) {
                  const list = byDay.get(v.dayKey) || [];
                  list.push(v);
                  byDay.set(v.dayKey, list);
                }
                const days = [...byDay.entries()].sort((a, b) => b[0].localeCompare(a[0]));
                return (
                  <li key={c.companyName} className="sale-card overflow-hidden">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                      onClick={() => setOpenCompany(open ? null : c.companyName)}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                          {c.companyName}
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                          Sale: {c.salesNames.join(", ")} · {c.visits.length} รายงาน
                        </p>
                      </div>
                      <span className="text-xs" style={{ color: "var(--sale-muted)" }}>
                        {open ? "ปิด" : "เปิด"}
                      </span>
                    </button>
                    {open ? (
                      <div className="border-t px-4 py-3" style={{ borderColor: "var(--sale-line)" }}>
                        {days.map(([dayKey, visits]) => (
                          <div key={dayKey} className="mb-3 last:mb-0">
                            <p className="mb-1 text-xs font-semibold" style={{ color: "var(--sale-muted)" }}>
                              {dayLabelOf(dayKey)}
                            </p>
                            {visits.map((v) => (
                              <Link
                                key={v.id}
                                href={saleHref(`/report/${v.id}`)}
                                className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-[var(--sale-bg)]"
                              >
                                <span>
                                  {v.salesName} · {v.time} · {v.purpose}
                                </span>
                                <span className="text-xs" style={{ color: "var(--sale-navy)" }}>
                                  ดูรายงาน →
                                </span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {section === "scores" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreCards.map((c) => (
              <section key={c.salesId} className="sale-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{c.salesName}</p>
                    <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
                      ยืนยัน {c.confirmedCount}/{c.reportCount}
                    </p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: "var(--sale-navy)" }}>
                    {c.total}
                  </p>
                </div>
                <ul className="mt-3 space-y-2 text-xs">
                  {(
                    [
                      ["รายละเอียดงานวันนี้", c.completeness],
                      ["ติดตามงานต่อได้", c.depth],
                      ["รูปภาพประกอบ", c.evidence],
                      ["ตรงตามนัดหมาย", c.timeliness],
                    ] as const
                  ).map(([label, score]) => (
                    <li key={label}>
                      <div className="flex justify-between">
                        <span style={{ color: "var(--sale-muted)" }}>{label}</span>
                        <span>{Math.round(score / 20)}/5</span>
                      </div>
                      <div
                        className="mt-1 h-1.5 overflow-hidden rounded-full"
                        style={{ background: "var(--sale-navy-soft)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${score}%`, background: "var(--sale-navy)" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-3 rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                  style={{ background: "var(--sale-bg)" }}
                >
                  <strong>คำแนะนำ:</strong> {c.feedback}
                </p>
              </section>
            ))}
          </div>
        ) : null}

        {section === "team" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="sale-card p-4">
              <h2 className="text-sm font-semibold">เพิ่ม Sale</h2>
              <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                Manager เพิ่ม/แก้ Sale ได้ · Admin คุมภาพรวมระบบ
              </p>
              <form onSubmit={onCreateSale} className="mt-3 space-y-2">
                <input
                  required
                  placeholder="username"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--sale-line)" }}
                />
                <input
                  required
                  type="password"
                  placeholder="รหัสผ่านชั่วคราว"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--sale-line)" }}
                />
                <input
                  required
                  placeholder="ชื่อที่แสดง"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--sale-line)" }}
                />
                <input
                  placeholder="เบอร์โทร"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--sale-line)" }}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="sale-btn-accent w-full py-2.5 text-sm disabled:opacity-60"
                >
                  {saving ? "กำลังบันทึก…" : "เพิ่ม Sale"}
                </button>
              </form>
              {teamErr ? (
                <p className="mt-2 text-xs" style={{ color: "var(--sale-danger-text)" }}>
                  {teamErr}
                </p>
              ) : null}
              {teamMsg ? (
                <p className="mt-2 text-xs" style={{ color: "var(--sale-ok-text)" }}>
                  {teamMsg}
                </p>
              ) : null}
            </section>

            <section className="sale-card p-4">
              <h2 className="text-sm font-semibold">รายชื่อ Sale</h2>
              <ul className="mt-3 space-y-3">
                {salesUsers.map((u) => (
                  <li
                    key={u.id}
                    className="border-b pb-3 last:border-0"
                    style={{ borderColor: "var(--sale-line)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{u.full_name}</p>
                        <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
                          @{u.username} · {u.status}
                          {u.phone ? ` · ${u.phone}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-[11px]"
                          style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
                          onClick={() => {
                            setEditId(editId === u.id ? null : u.id);
                            setEditForm({
                              username: u.username,
                              fullName: u.full_name,
                              nickname: u.nickname || "",
                              phone: u.phone || "",
                              position: u.position || "",
                              password: "",
                            });
                          }}
                        >
                          {editId === u.id ? "ปิด" : "แก้ไข"}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-[11px]"
                          style={{
                            background: u.status === "active" ? "var(--sale-warn)" : "var(--sale-ok)",
                            color:
                              u.status === "active"
                                ? "var(--sale-warn-text)"
                                : "var(--sale-ok-text)",
                          }}
                          onClick={() =>
                            setSaleStatus(
                              u.id,
                              u.status === "active" ? "suspended" : "active",
                            )
                          }
                        >
                          {u.status === "active" ? "ระงับ" : "เปิดใช้"}
                        </button>
                      </div>
                    </div>
                    {editId === u.id ? (
                      <form onSubmit={onSaveEdit} className="mt-2 space-y-2">
                        <input
                          required
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, username: e.target.value }))
                          }
                          className="w-full rounded-xl border px-3 py-2 text-sm"
                          style={{ borderColor: "var(--sale-line)" }}
                          placeholder="username (ล็อกอิน)"
                        />
                        <input
                          required
                          value={editForm.fullName}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, fullName: e.target.value }))
                          }
                          className="w-full rounded-xl border px-3 py-2 text-sm"
                          style={{ borderColor: "var(--sale-line)" }}
                          placeholder="ชื่อ"
                        />
                        <input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          className="w-full rounded-xl border px-3 py-2 text-sm"
                          style={{ borderColor: "var(--sale-line)" }}
                          placeholder="เบอร์"
                        />
                        <input
                          type="password"
                          value={editForm.password}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, password: e.target.value }))
                          }
                          className="w-full rounded-xl border px-3 py-2 text-sm"
                          style={{ borderColor: "var(--sale-line)" }}
                          placeholder="รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)"
                        />
                        <button type="submit" className="sale-btn-primary w-full py-2 text-sm">
                          บันทึก
                        </button>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}

        {section === "alerts" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAlertTab("open")}
                className="rounded-xl px-3 py-2 text-xs font-semibold"
                style={
                  alertTab === "open"
                    ? { background: "var(--sale-navy)", color: "#fff" }
                    : { background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }
                }
              >
                รอดำเนินการ ({alertItems.length})
              </button>
              <button
                type="button"
                onClick={() => setAlertTab("done")}
                className="rounded-xl px-3 py-2 text-xs font-semibold"
                style={
                  alertTab === "done"
                    ? { background: "var(--sale-navy)", color: "#fff" }
                    : { background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }
                }
              >
                เรียบร้อยแล้ว ({doneAlerts.length})
              </button>
            </div>

            {alertTab === "open" ? (
              <section className="sale-card p-4">
                <h2 className="text-sm font-semibold">แจ้งเตือนทั้งหมด</h2>
                <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                  งานติดตามจากรายงานที่ยืนยัน (AI ดึงให้ Manager) — ติกเมื่อดำเนินการแล้ว
                </p>
                <ul className="mt-3 space-y-2">
                  {alertItems.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl px-3 py-2.5"
                      style={{ background: "var(--sale-bg)" }}
                    >
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                        {formatAlertDate(a.when)} · Sale: {a.salesName}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--sale-muted)" }}>
                        {a.companyName}
                        {a.hint ? ` — ${a.hint}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => completeAlert(a)}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                          style={{ background: "var(--sale-navy)" }}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          เสร็จแล้ว
                        </button>
                        <Link
                          href={a.href}
                          className="rounded-xl px-3 py-2 text-xs font-medium"
                          style={{
                            background: "var(--sale-navy-soft)",
                            color: "var(--sale-navy)",
                          }}
                        >
                          เปิดรายงาน
                        </Link>
                      </div>
                    </li>
                  ))}
                  {alertItems.length === 0 ? (
                    <li className="text-sm" style={{ color: "var(--sale-muted)" }}>
                      ไม่มีแจ้งเตือนค้าง — รายการที่ติกแล้วดูได้ที่ “เรียบร้อยแล้ว”
                    </li>
                  ) : null}
                </ul>
              </section>
            ) : (
              <section className="sale-card p-4">
                <h2 className="text-sm font-semibold">เรียบร้อยแล้ว</h2>
                <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                  ย้อนกลับเข้าคิวแจ้งเตือน หรือลบออกจากประวัติได้
                </p>
                <ul className="mt-3 space-y-2">
                  {doneAlerts.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl px-3 py-2.5"
                      style={{ background: "var(--sale-bg)" }}
                    >
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                        วันที่งาน: {formatAlertDate(a.when)} · Sale: {a.salesName}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--sale-muted)" }}>
                        {a.companyName} · ติกเสร็จ {formatAlertDate(a.doneAt)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          href={a.href}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                          style={{
                            background: "var(--sale-navy-soft)",
                            color: "var(--sale-navy)",
                          }}
                        >
                          เปิดรายงาน
                        </Link>
                        <button
                          type="button"
                          onClick={() => undoAlert(a.id)}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                          style={{
                            background: "var(--sale-warn)",
                            color: "var(--sale-warn-text)",
                          }}
                        >
                          ย้อนกลับ
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDoneAlert(a.id)}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                          style={{
                            background: "var(--sale-danger)",
                            color: "var(--sale-danger-text)",
                          }}
                        >
                          ลบ
                        </button>
                      </div>
                    </li>
                  ))}
                  {doneAlerts.length === 0 ? (
                    <li className="text-sm" style={{ color: "var(--sale-muted)" }}>
                      ยังไม่มีรายการที่ติกเสร็จ
                    </li>
                  ) : null}
                </ul>
              </section>
            )}
          </div>
        ) : null}

        <div className="mt-8">
          <BrandFooter />
        </div>
      </main>
    </div>
  );
}
