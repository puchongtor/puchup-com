import { normalizeDb, type CrmDb } from "./model";

const KEY = "puchup-crm-v1";
const BACKUP_KEY = "puchup-crm-v1-bak";

export function loadDb(): CrmDb {
  if (typeof window === "undefined") return normalizeDb(null);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return normalizeDb(null);
    return normalizeDb(JSON.parse(raw));
  } catch {
    return normalizeDb(null);
  }
}

export function saveDb(db: CrmDb): boolean {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP_KEY, prev);
    localStorage.setItem(KEY, JSON.stringify(db));
    return true;
  } catch {
    return false;
  }
}

export function downloadDb(db: CrmDb, filename: string) {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
