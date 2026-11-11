"use client";

import type {
  SalesProfile,
  StoredTask,
  StoredVisitReport,
} from "./types";

const PROFILE_KEY = "ap-sale-profile-v1";
const PROFILE_ID_KEY = "ap-sale-profile-id-v1";
const REPORTS_KEY = "ap-sale-reports-v1";
const TASKS_KEY = "ap-sale-tasks-v1";
const CONSENT_KEY = "ap-sale-consent-v1";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ensureProfileId(existing?: string | null): string {
  if (existing && UUID_RE.test(existing)) return existing;
  if (typeof window === "undefined") {
    return "00000000-0000-4000-8000-000000000001";
  }
  try {
    const stored = window.localStorage.getItem(PROFILE_ID_KEY);
    if (stored && UUID_RE.test(stored)) return stored;
    const next = crypto.randomUUID();
    window.localStorage.setItem(PROFILE_ID_KEY, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

export const DEFAULT_PROFILE: SalesProfile = {
  id: "00000000-0000-4000-8000-000000000001",
  fullName: "เซลล์ A",
  nickname: "คุณเซลล์ A",
  position: "เซลล์ภาคสนาม",
  phone: "",
  email: "",
  avatarDataUrl: null,
  role: "sales",
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TASKS: StoredTask[] = [
  {
    id: "t1",
    title: "ส่งใบเสนอราคาสายพาน",
    dueLabel: "วันนี้",
    overdue: false,
    done: false,
  },
  {
    id: "t2",
    title: "โทรถามความคืบหน้าปั๊มไฮดรอลิก",
    dueLabel: "พรุ่งนี้",
    overdue: false,
    done: false,
  },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadProfile(): SalesProfile {
  const raw = { ...DEFAULT_PROFILE, ...readJson(PROFILE_KEY, DEFAULT_PROFILE) };
  const id = ensureProfileId(raw.id);
  if (id !== raw.id) {
    const fixed = { ...raw, id };
    writeJson(PROFILE_KEY, fixed);
    return fixed;
  }
  return raw;
}

export function saveProfile(profile: SalesProfile) {
  const next = {
    ...profile,
    id: ensureProfileId(profile.id),
    updatedAt: new Date().toISOString(),
  };
  writeJson(PROFILE_KEY, next);
  try {
    window.localStorage.setItem(PROFILE_ID_KEY, next.id);
  } catch {
    /* ignore */
  }
  return next;
}

export function loadReports(): StoredVisitReport[] {
  return readJson(REPORTS_KEY, [] as StoredVisitReport[]);
}

export function saveReports(reports: StoredVisitReport[]) {
  writeJson(REPORTS_KEY, reports);
}

export function upsertReport(report: StoredVisitReport) {
  const list = loadReports();
  const idx = list.findIndex((r) => r.id === report.id);
  if (idx >= 0) list[idx] = report;
  else list.unshift(report);
  saveReports(list);
  return list;
}

export function removeReport(reportId: string) {
  const list = loadReports().filter((r) => r.id !== reportId);
  saveReports(list);
  return list;
}

export function loadTasks(): StoredTask[] {
  return readJson(TASKS_KEY, DEFAULT_TASKS);
}

export function saveTasks(tasks: StoredTask[]) {
  writeJson(TASKS_KEY, tasks);
}

export function loadConsent(): boolean {
  return readJson(CONSENT_KEY, false);
}

export function saveConsent(value: boolean) {
  writeJson(CONSENT_KEY, value);
}

/** ย่อรูปเป็น data URL ขนาดพอดีเก็บ localStorage */
export async function fileToAvatarDataUrl(file: File, maxPx = 512): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}
