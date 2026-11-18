export type Channel = "email" | "line" | "phone" | "facebook" | "other";
export type WorkStatus = "building" | "delivered" | "care" | "closed";
export type CycleMonths = 0 | 1 | 3 | 6 | 12;
export type AlertKind = "billing" | "domain" | "hosting" | "care";
export type AlertBucket = "overdue" | "send" | "sent" | "later";
export type OutreachSource = "outbound" | "inbound";
export type OutreachStatus = "waiting" | "interested" | "won" | "rejected";
export type OutreachChannel = "page" | "line" | "fb-personal" | "phone" | "other";
export type OutreachKind = "clinic" | "shop" | "other";

export type SentNotice = {
  key: string;
  sentAt: string;
  channel: Channel;
};

export type Client = {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  lineId: string;
  channel: Channel;
  channelNote: string;
  services: string[];
  serviceNote: string;
  website: string;
  domain: string;
  startDate: string;
  workStatus: WorkStatus;
  cycleMonths: CycleMonths;
  monthlyPrice: number;
  yearlyPrice: number;
  oneTimePrice: number;
  nextDue: string;
  domainDue: string;
  hostingDue: string;
  note: string;
  paused: boolean;
  sent: SentNotice[];
  lastPaidAt: string;
  lastPaidAmount: number;
  createdAt: string;
};

export type StudioSettings = {
  accountName: string;
  bank: string;
  accountNo: string;
  promptPay: string;
  signature: string;
};

export type OutreachLead = {
  id: string;
  name: string;
  kind: OutreachKind;
  source: OutreachSource;
  channel: OutreachChannel;
  channelNote: string;
  status: OutreachStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type Alert = {
  key: string;
  clientId: string;
  kind: AlertKind;
  dueDate: string;
  daysLeft: number;
  remindFrom: string;
  bucket: AlertBucket;
  notified: boolean;
  amount: number | null;
  subject: string;
  body: string;
  title: string;
};

export const CRM_SERVICES = [
  { id: "project-one", label: "Project ONE" },
  { id: "corporate", label: "Corporate Site" },
  { id: "shopguide", label: "ShopGuide" },
  { id: "saledesk", label: "SaleDesk" },
  { id: "opscraft", label: "OpsCraft" },
  { id: "partner", label: "PuchUp Partner" },
  { id: "care", label: "Local Care รายเดือน" },
  { id: "seo", label: "SEO / คอนเทนต์" },
  { id: "domain", label: "โดเมน" },
  { id: "hosting", label: "โฮสติ้ง" },
  { id: "extra", label: "งานเพิ่ม / แก้ไข" },
] as const;

export const CHANNELS: { id: Channel; label: string }[] = [
  { id: "email", label: "อีเมล" },
  { id: "line", label: "LINE" },
  { id: "phone", label: "โทร" },
  { id: "facebook", label: "Facebook" },
  { id: "other", label: "อื่นๆ" },
];

export const WORK_STATUSES: { id: WorkStatus; label: string }[] = [
  { id: "building", label: "กำลังทำ" },
  { id: "delivered", label: "ส่งมอบแล้ว" },
  { id: "care", label: "ดูแลต่อเนื่อง" },
  { id: "closed", label: "จบงาน" },
];

export const OUTREACH_SOURCES: { id: OutreachSource; label: string }[] = [
  { id: "outbound", label: "เราส่งข้อความ" },
  { id: "inbound", label: "ลูกค้าติดต่อเข้ามา" },
];

export const OUTREACH_KINDS: { id: OutreachKind; label: string }[] = [
  { id: "clinic", label: "คลินิก" },
  { id: "shop", label: "ร้าน" },
  { id: "other", label: "อื่นๆ" },
];

export const OUTREACH_CHANNELS: { id: OutreachChannel; label: string }[] = [
  { id: "page", label: "เพจ" },
  { id: "line", label: "LINE" },
  { id: "fb-personal", label: "เฟสส่วนตัว" },
  { id: "phone", label: "โทร" },
  { id: "other", label: "อื่นๆ" },
];

export const OUTREACH_STATUSES: { id: OutreachStatus; label: string }[] = [
  { id: "waiting", label: "รอตอบ" },
  { id: "interested", label: "กำลังสนใจ" },
  { id: "won", label: "ทำเว็บกับเราแล้ว" },
  { id: "rejected", label: "ไม่สนใจ" },
];

export const CYCLES: { value: CycleMonths; label: string }[] = [
  { value: 0, label: "ครั้งเดียว" },
  { value: 1, label: "1 เดือน" },
  { value: 3, label: "3 เดือน" },
  { value: 6, label: "6 เดือน" },
  { value: 12, label: "12 เดือน" },
];

const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const HORIZON_DAYS = 60;

export const defaultSettings: StudioSettings = {
  accountName: "",
  bank: "",
  accountNo: "",
  promptPay: "",
  signature: "PuchUp\nhello@puchup.com",
};

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1 + months, 1));
  const year = first.getUTCFullYear();
  const month = first.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDay);
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86400000);
}

export function formatThaiDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${THAI_MONTHS[m - 1]} ${y + 543}`;
}

export function formatBaht(n: number): string {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function cyclePhrase(cycle: CycleMonths): string {
  switch (cycle) {
    case 1:
      return "รายเดือน";
    case 3:
      return "ทุก 3 เดือน";
    case 6:
      return "ทุก 6 เดือน";
    case 12:
      return "รายปี";
    default:
      return "ครั้งเดียว";
  }
}

export function serviceLabel(client: Pick<Client, "services">): string {
  const map = new Map<string, string>(CRM_SERVICES.map((s) => [s.id, s.label]));
  const labels = client.services.map((id) => map.get(id) || id).filter(Boolean);
  return labels.length ? labels.join(", ") : "บริการเว็บไซต์";
}

export function cycleCharge(client: Pick<Client, "cycleMonths" | "monthlyPrice" | "yearlyPrice" | "oneTimePrice">): number {
  if (client.cycleMonths === 12 && client.yearlyPrice > 0) return client.yearlyPrice;
  if (client.cycleMonths > 0) return Math.round(client.monthlyPrice * client.cycleMonths);
  return client.oneTimePrice || 0;
}

export function channelLabel(channel: Channel): string {
  return CHANNELS.find((c) => c.id === channel)?.label || channel;
}

export function workLabel(status: WorkStatus): string {
  return WORK_STATUSES.find((s) => s.id === status)?.label || status;
}

/** รายปีและโดเมน/โฮส แจ้งก่อน 1 เดือนตามปฏิทิน รอบ 1/3/6 เดือนแจ้งก่อน 14 วัน */
export const LOCAL_CARE_TASKS = [
  "ดูคำค้นจาก Search Console แล้วใส่จุดที่มีคุณค่า",
  "เจอคีย์ที่น่าสนใจ ช่วยดันเสริม — อัปเดต หรือเขียนบทความเสริมตามคีย์",
  "แก้ข้อความ / โปรโมชั่นบนเว็บเมื่อร้านส่งมา",
  "ดูแลหมุด Maps ให้ข้อมูลและรูปสด ตามรอบ",
  "สรุปผลการค้นหารายเดือน — คีย์ที่เพิ่ม คนเข้า และคลิกจาก Google",
] as const;

/** Monday of the week that contains `today`. Sunday belongs to the Monday just past. */
export function weekMonday(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const back = dow === 0 ? 6 : dow - 1;
  return addDays(today, -back);
}

export function hasLocalCare(client: Pick<Client, "services" | "paused" | "workStatus">): boolean {
  return client.services.includes("care") && !client.paused && client.workStatus !== "closed" && client.workStatus !== "building";
}

export function remindOn(due: string, cycle: CycleMonths, kind: AlertKind): string {
  if (kind !== "billing" || cycle === 12) return addMonths(due, -1);
  return addDays(due, -14);
}

export function newClient(today = todayISO()): Client {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return {
    id,
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    lineId: "",
    channel: "line",
    channelNote: "",
    services: [],
    serviceNote: "",
    website: "",
    domain: "",
    startDate: today,
    workStatus: "care",
    cycleMonths: 1,
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: 0,
    nextDue: "",
    domainDue: "",
    hostingDue: "",
    note: "",
    paused: false,
    sent: [],
    lastPaidAt: "",
    lastPaidAmount: 0,
    createdAt: new Date().toISOString(),
  };
}

function greet(name: string): string {
  const n = name.trim();
  return n ? `สวัสดีครับ คุณ${n}` : "สวัสดีครับ";
}

function payBlock(settings: StudioSettings): string {
  const lines: string[] = [];
  if (settings.bank.trim() || settings.accountNo.trim() || settings.accountName.trim()) {
    lines.push("โอนได้ที่");
    if (settings.bank.trim()) lines.push(settings.bank.trim());
    if (settings.accountName.trim()) lines.push(`ชื่อบัญชี ${settings.accountName.trim()}`);
    if (settings.accountNo.trim()) lines.push(settings.accountNo.trim());
  }
  if (settings.promptPay.trim()) lines.push(`พร้อมเพย์ ${settings.promptPay.trim()}`);
  if (!lines.length) return "ตอบกลับมาได้เลยครับ จะส่งช่องทางชำระให้";
  return lines.join("\n");
}

function signature(settings: StudioSettings): string {
  return settings.signature.trim() || "PuchUp";
}

function joinLines(lines: Array<string | false | null | undefined>): string {
  return lines
    .filter((line): line is string => line != null && line !== false)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chargeLine(client: Client): string {
  const amount = cycleCharge(client);
  if (amount <= 0) return "ยอดตามที่ตกลงกันไว้";
  if (client.cycleMonths === 1) return `ยอดรายเดือน ${formatBaht(amount)} บาท`;
  if (client.cycleMonths === 3) return `ยอดรอบ 3 เดือน ${formatBaht(amount)} บาท`;
  if (client.cycleMonths === 6) return `ยอดรอบ 6 เดือน ${formatBaht(amount)} บาท`;
  if (client.cycleMonths === 12) return `ยอดรายปี ${formatBaht(amount)} บาท`;
  return `ยอด ${formatBaht(amount)} บาท`;
}

export function billingMessage(client: Client, settings: StudioSettings, overdue = false): { subject: string; body: string } {
  const biz = client.businessName.trim() || "ลูกค้า";
  const services = serviceLabel(client);
  const due = formatThaiDate(client.nextDue);
  const cycle = cyclePhrase(client.cycleMonths);
  const subject =
    overdue ? `เลยกำหนดชำระ — ${biz}` : client.cycleMonths === 0 ? `แจ้งยอดชำระ — ${biz}` : `แจ้งครบรอบ${cycle} — ${biz}`;
  const opener = overdue
    ? `รอบบริการ ${services} ของ ${biz} ครบกำหนดไปแล้วเมื่อวันที่ ${due}`
    : client.cycleMonths === 0
      ? `ยอดบริการ ${services} ของ ${biz} ครบกำหนดวันที่ ${due}`
      : `บริการ ${services} ของ ${biz} จะครบรอบ${cycle} วันที่ ${due}`;
  const body = joinLines([
    greet(client.contactName),
    "",
    opener,
    client.website.trim() ? `เว็บไซต์ ${client.website.trim()}` : "",
    chargeLine(client),
    "",
    payBlock(settings),
    "",
    overdue ? "รบกวนชำระเพื่อให้บริการเดินต่อได้ครับ" : "หลังโอนรบกวนส่งสลิปกลับมาได้เลยครับ",
    "",
    signature(settings),
  ]);
  return { subject, body };
}

export function renewalMessage(
  client: Client,
  settings: StudioSettings,
  kind: "domain" | "hosting",
  overdue = false,
): { subject: string; body: string } {
  const biz = client.businessName.trim() || "ลูกค้า";
  const due = formatThaiDate(kind === "domain" ? client.domainDue : client.hostingDue);
  const what = kind === "domain" ? `โดเมน ${client.domain.trim() || "เว็บไซต์"}` : "โฮสติ้ง";
  const subject = overdue ? `${what} หมดอายุแล้ว — ${biz}` : `${what} ใกล้หมดอายุ — ${biz}`;
  const opener = overdue ? `${what} หมดอายุไปแล้วเมื่อวันที่ ${due}` : `${what} จะหมดอายุวันที่ ${due}`;
  const body = joinLines([
    greet(client.contactName),
    "",
    opener,
    client.website.trim() ? `เว็บไซต์ ${client.website.trim()}` : "",
    overdue ? "ถ้าต้องการต่อ รบกวนตอบกลับมาได้เลยครับ" : "ถ้าจะต่ออายุ รบกวนตอบกลับมาได้เลยครับ จะได้ดำเนินการก่อนหมด",
    "",
    signature(settings),
  ]);
  return { subject, body };
}

function bucketFor(today: string, due: string, remindFrom: string, notified: boolean): AlertBucket | "hidden" {
  if (today > due) return "overdue";
  if (today >= remindFrom) return notified ? "sent" : "send";
  if (daysBetween(today, due) <= HORIZON_DAYS) return "later";
  return "hidden";
}

function pushDated(
  alerts: Alert[],
  client: Client,
  settings: StudioSettings,
  today: string,
  kind: Exclude<AlertKind, "care">,
  due: string,
  title: string,
): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return;
  const remindFrom = remindOn(due, client.cycleMonths, kind);
  const notified = client.sent.some((item) => item.key === `${kind}:${due}`);
  const bucket = bucketFor(today, due, remindFrom, notified);
  if (bucket === "hidden") return;
  const overdue = bucket === "overdue";
  const message =
    kind === "billing"
      ? billingMessage(client, settings, overdue)
      : renewalMessage(client, settings, kind, overdue);
  alerts.push({
    key: `${kind}:${due}`,
    clientId: client.id,
    kind,
    dueDate: due,
    daysLeft: daysBetween(today, due),
    remindFrom,
    bucket,
    notified,
    amount: kind === "billing" ? cycleCharge(client) : null,
    subject: message.subject,
    body: message.body,
    title,
  });
}

function pushCare(alerts: Alert[], client: Client, today: string) {
  if (!hasLocalCare(client)) return;
  const monday = weekMonday(today);
  const key = `care:${monday}`;
  const notified = client.sent.some((item) => item.key === key);
  const biz = client.businessName.trim() || "ลูกค้า";
  const firstMonday = Number(monday.slice(8, 10)) <= 7;
  const tasks = LOCAL_CARE_TASKS.map((task, index) => {
    const line = index === LOCAL_CARE_TASKS.length - 1 && firstMonday ? `${task} — สัปดาห์นี้ถึงรอบสรุปเดือน` : task;
    return `${index + 1}. ${line}`;
  });
  alerts.push({
    key,
    clientId: client.id,
    kind: "care",
    dueDate: addDays(monday, 6),
    daysLeft: 0,
    remindFrom: monday,
    bucket: notified ? "sent" : "send",
    notified,
    amount: null,
    subject: `Local Care — ${biz}`,
    body: [`กลับไปดูแลเว็บ ${biz}`, client.website.trim(), "", ...tasks].filter((line) => line !== "").join("\n"),
    title: "Local Care",
  });
}

export function buildAlerts(client: Client, settings: StudioSettings, today: string): Alert[] {
  if (client.paused) return [];
  const alerts: Alert[] = [];
  pushCare(alerts, client, today);
  if (client.workStatus !== "closed" && client.nextDue) {
    pushDated(alerts, client, settings, today, "billing", client.nextDue, "รอบบิล");
  }
  if (client.domainDue) pushDated(alerts, client, settings, today, "domain", client.domainDue, "โดเมน");
  if (client.hostingDue) pushDated(alerts, client, settings, today, "hosting", client.hostingDue, "โฮสติ้ง");
  return alerts;
}

const BUCKET_RANK: Record<AlertBucket, number> = { overdue: 0, send: 1, sent: 2, later: 3 };

export function sortAlerts(alerts: Alert[]): Alert[] {
  return [...alerts].sort((a, b) => BUCKET_RANK[a.bucket] - BUCKET_RANK[b.bucket] || a.daysLeft - b.daysLeft);
}

export function whenLabel(daysLeft: number): string {
  if (daysLeft < 0) return `เลยมา ${Math.abs(daysLeft)} วัน`;
  if (daysLeft === 0) return "ครบวันนี้";
  return `อีก ${daysLeft} วัน`;
}

export function sendHint(client: Client): string {
  if (client.channel === "email" && client.email.trim()) return `เปิดอีเมลถึง ${client.email.trim()}`;
  if (client.channel === "line") return `คัดลอกไปส่งใน LINE${client.lineId.trim() ? ` ${client.lineId.trim()}` : ""}`;
  if (client.channel === "phone") return `โทรแจ้ง${client.phone.trim() ? ` ${client.phone.trim()}` : ""}`;
  if (client.channel === "facebook") return `คัดลอกไปส่งทาง Facebook${client.channelNote.trim() ? ` ${client.channelNote.trim()}` : ""}`;
  return "คัดลอกแล้วส่งเอง";
}

export function markSent(client: Client, key: string, channel: Channel, at = new Date().toISOString()): Client {
  const sent = client.sent.filter((item) => item.key !== key);
  sent.push({ key, sentAt: at, channel });
  return { ...client, sent: sent.slice(-50) };
}

export function markCyclePaid(client: Client, today: string): Client {
  const amount = cycleCharge(client);
  if (client.cycleMonths === 0) {
    return { ...client, nextDue: "", lastPaidAt: today, lastPaidAmount: amount };
  }
  const base = /^\d{4}-\d{2}-\d{2}$/.test(client.nextDue) ? client.nextDue : today;
  return {
    ...client,
    nextDue: addMonths(base, client.cycleMonths),
    lastPaidAt: today,
    lastPaidAmount: amount,
  };
}

export function rollAnnual(date: string, today: string): string {
  let next = addMonths(/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today, 12);
  let guard = 0;
  while (next <= today && guard < 40) {
    next = addMonths(next, 12);
    guard += 1;
  }
  return next;
}

/** First due follows the go-live date. Later edits do not move the anniversary. */
export function withFirstDue(client: Client): Client {
  if (client.nextDue || !client.startDate || client.cycleMonths === 0) return client;
  if (client.workStatus === "closed") return client;
  return { ...client, nextDue: addMonths(client.startDate, client.cycleMonths) };
}

export function clientMatches(client: Client, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    client.businessName,
    client.contactName,
    client.phone,
    client.email,
    client.lineId,
    client.domain,
    client.website,
    client.channelNote,
    serviceLabel(client),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNum(value: unknown): number {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function asDate(value: unknown): string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function asCycle(value: unknown): CycleMonths {
  const n = Number(value);
  return n === 0 || n === 1 || n === 3 || n === 6 || n === 12 ? n : 1;
}

function asChannel(value: unknown): Channel {
  return value === "email" || value === "line" || value === "phone" || value === "facebook" || value === "other"
    ? value
    : "line";
}

function asWork(value: unknown): WorkStatus {
  return value === "building" || value === "delivered" || value === "care" || value === "closed" ? value : "care";
}

function asOutreachSource(value: unknown): OutreachSource {
  return value === "inbound" ? "inbound" : "outbound";
}

function asOutreachKind(value: unknown): OutreachKind {
  return value === "shop" || value === "other" || value === "clinic" ? value : "clinic";
}

function asOutreachChannel(value: unknown): OutreachChannel {
  return value === "page" || value === "line" || value === "fb-personal" || value === "phone" || value === "other" ? value : "page";
}

function asOutreachStatus(value: unknown): OutreachStatus {
  return value === "waiting" || value === "interested" || value === "won" || value === "rejected" ? value : "waiting";
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function outreachSourceLabel(source: OutreachSource): string {
  return OUTREACH_SOURCES.find((item) => item.id === source)?.label || source;
}

export function outreachKindLabel(kind: OutreachKind): string {
  return OUTREACH_KINDS.find((item) => item.id === kind)?.label || kind;
}

export function outreachChannelLabel(channel: OutreachChannel): string {
  return OUTREACH_CHANNELS.find((item) => item.id === channel)?.label || channel;
}

export function outreachStatusLabel(status: OutreachStatus): string {
  return OUTREACH_STATUSES.find((item) => item.id === status)?.label || status;
}

export function normalizeOutreachName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("th");
}

export function sortOutreachLeads(leads: OutreachLead[]): OutreachLead[] {
  return [...leads].sort((a, b) => a.name.localeCompare(b.name, "th", { sensitivity: "base" }));
}

export function findOutreachByName(leads: OutreachLead[], name: string, exceptId?: string): OutreachLead | undefined {
  const key = normalizeOutreachName(name);
  if (!key) return undefined;
  return leads.find((lead) => lead.id !== exceptId && normalizeOutreachName(lead.name) === key);
}

export function outreachMatches(lead: OutreachLead, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("th");
  if (!q) return true;
  const hay = [
    lead.name,
    outreachKindLabel(lead.kind),
    outreachSourceLabel(lead.source),
    outreachChannelLabel(lead.channel),
    lead.channelNote,
    lead.note,
    outreachStatusLabel(lead.status),
  ]
    .join(" ")
    .toLocaleLowerCase("th");
  return hay.includes(q);
}

export function newOutreachLead(source: OutreachSource = "outbound"): OutreachLead {
  const now = new Date().toISOString();
  return {
    id: newId("o"),
    name: "",
    kind: "clinic",
    source,
    channel: "page",
    channelNote: "",
    status: source === "inbound" ? "interested" : "waiting",
    note: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeOutreachLead(raw: unknown): OutreachLead | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<OutreachLead>;
  if (typeof row.id !== "string" || !row.id) return null;
  const name = asText(row.name);
  if (!name) return null;
  const source = asOutreachSource(row.source);
  const createdAt = asText(row.createdAt) || new Date().toISOString();
  return {
    id: row.id,
    name,
    kind: asOutreachKind(row.kind),
    source,
    channel: asOutreachChannel(row.channel),
    channelNote: asText(row.channelNote),
    status:
      row.status === undefined || row.status === null || row.status === ""
        ? source === "inbound"
          ? "interested"
          : "waiting"
        : asOutreachStatus(row.status),
    note: asText(row.note),
    createdAt,
    updatedAt: asText(row.updatedAt) || createdAt,
  };
}

export function normalizeClient(raw: unknown): Client | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<Client>;
  if (typeof row.id !== "string" || !row.id) return null;
  const sent = Array.isArray(row.sent)
    ? row.sent
        .filter((item): item is SentNotice => {
          if (!item || typeof item !== "object") return false;
          const notice = item as SentNotice;
          return typeof notice.key === "string" && typeof notice.sentAt === "string";
        })
        .map((item) => ({ ...item, channel: asChannel(item.channel) }))
        .slice(-50)
    : [];
  return {
    id: row.id,
    businessName: asText(row.businessName),
    contactName: asText(row.contactName),
    phone: asText(row.phone),
    email: asText(row.email),
    lineId: asText(row.lineId),
    channel: asChannel(row.channel),
    channelNote: asText(row.channelNote),
    services: Array.isArray(row.services) ? row.services.filter((id): id is string => typeof id === "string") : [],
    serviceNote: asText(row.serviceNote),
    website: asText(row.website),
    domain: asText(row.domain),
    startDate: asDate(row.startDate),
    workStatus: asWork(row.workStatus),
    cycleMonths: asCycle(row.cycleMonths),
    monthlyPrice: asNum(row.monthlyPrice),
    yearlyPrice: asNum(row.yearlyPrice),
    oneTimePrice: asNum(row.oneTimePrice),
    nextDue: asDate(row.nextDue),
    domainDue: asDate(row.domainDue),
    hostingDue: asDate(row.hostingDue),
    note: asText(row.note),
    paused: Boolean(row.paused),
    sent,
    lastPaidAt: asDate(row.lastPaidAt),
    lastPaidAmount: asNum(row.lastPaidAmount),
    createdAt: asText(row.createdAt) || new Date().toISOString(),
  };
}

export function normalizeSettings(raw: unknown): StudioSettings {
  if (!raw || typeof raw !== "object") return { ...defaultSettings };
  const row = raw as Partial<StudioSettings>;
  return {
    accountName: asText(row.accountName),
    bank: asText(row.bank),
    accountNo: asText(row.accountNo),
    promptPay: asText(row.promptPay),
    signature: asText(row.signature) || defaultSettings.signature,
  };
}

export type CrmDb = { version: 1; clients: Client[]; settings: StudioSettings; outreach: OutreachLead[] };

export function normalizeDb(raw: unknown): CrmDb {
  const row = raw && typeof raw === "object" ? (raw as { clients?: unknown; settings?: unknown; outreach?: unknown }) : {};
  const clients = Array.isArray(row.clients) ? row.clients.map(normalizeClient).filter((c): c is Client => Boolean(c)) : [];
  const outreach = Array.isArray(row.outreach)
    ? sortOutreachLeads(row.outreach.map(normalizeOutreachLead).filter((item): item is OutreachLead => Boolean(item)))
    : [];
  return { version: 1, clients, settings: normalizeSettings(row.settings), outreach };
}

export function sampleTemplates(settings: StudioSettings): { title: string; subject: string; body: string }[] {
  const base = newClient("2026-11-01");
  const shared: Client = {
    ...base,
    businessName: "ร้านตัวอย่าง",
    contactName: "สมชาย",
    website: "https://example.com",
    services: ["project-one", "care"],
    monthlyPrice: 1500,
    yearlyPrice: 15000,
    nextDue: "2026-12-18",
    domain: "example.com",
    domainDue: "2027-01-20",
    hostingDue: "2027-01-20",
  };
  const monthly = billingMessage({ ...shared, cycleMonths: 1 }, settings);
  const yearly = billingMessage({ ...shared, cycleMonths: 12 }, settings);
  const late = billingMessage({ ...shared, cycleMonths: 1, nextDue: "2026-11-01" }, settings, true);
  const domain = renewalMessage(shared, settings, "domain");
  const hosting = renewalMessage(shared, settings, "hosting");
  return [
    { title: "รอบ 1 / 3 / 6 เดือน — แจ้งก่อน 2 สัปดาห์", ...monthly },
    { title: "รายปี — แจ้งก่อน 1 เดือน", ...yearly },
    { title: "เลยกำหนดแล้วยังไม่ชำระ", ...late },
    { title: "โดเมนใกล้หมดอายุ", ...domain },
    { title: "โฮสติ้งใกล้หมดอายุ", ...hosting },
  ];
}
