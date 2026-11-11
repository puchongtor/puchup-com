/** Inbox แจ้งเตือน Manager — ติกเสร็จเก็บที่เซิร์ฟเวอร์ + cache เครื่อง */

export type ManagerAlertRecord = {
  id: string;
  title: string;
  companyName: string;
  salesName: string;
  hint: string;
  href: string;
  when: string;
  doneAt: string;
};

const DONE_KEY_PREFIX = "ap-sale-manager-alerts-done-v2:";
const LEGACY_KEY = "ap-sale-manager-alerts-done-v1";
const MIGRATED_FLAG = "ap-sale-manager-alerts-migrated-v2:";

function storageKey(managerId: string) {
  return `${DONE_KEY_PREFIX}${managerId || "anon"}`;
}

function readLocal(managerId: string): ManagerAlertRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(managerId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ManagerAlertRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(managerId: string, list: ManagerAlertRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    storageKey(managerId),
    JSON.stringify(list.slice(0, 500)),
  );
}

function readLegacy(): ManagerAlertRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ManagerAlertRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeById(
  a: ManagerAlertRecord[],
  b: ManagerAlertRecord[],
): ManagerAlertRecord[] {
  const map = new Map<string, ManagerAlertRecord>();
  for (const item of [...a, ...b]) {
    if (!item?.id) continue;
    const prev = map.get(item.id);
    if (!prev || (item.doneAt || "") > (prev.doneAt || "")) {
      map.set(item.id, item);
    }
  }
  return [...map.values()].sort((x, y) =>
    (y.doneAt || "").localeCompare(x.doneAt || ""),
  );
}

export function loadDoneAlerts(managerId?: string): ManagerAlertRecord[] {
  if (!managerId) return readLegacy();
  return mergeById(readLocal(managerId), []).sort((a, b) =>
    b.doneAt.localeCompare(a.doneAt),
  );
}

export function cacheDoneAlerts(
  managerId: string,
  list: ManagerAlertRecord[],
): ManagerAlertRecord[] {
  const sorted = [...list].sort((a, b) => b.doneAt.localeCompare(a.doneAt));
  writeLocal(managerId, sorted);
  return sorted;
}

/** ดึงจากเซิร์ฟเวอร์ + รวม local/legacy ครั้งแรกแล้ว sync ขึ้น */
export async function fetchDoneAlerts(
  managerId: string,
): Promise<ManagerAlertRecord[]> {
  let server: ManagerAlertRecord[] = [];
  try {
    const res = await fetch("/api/sale/manager/alerts");
    const json = (await res.json()) as {
      ok?: boolean;
      alerts?: ManagerAlertRecord[];
      needsMigration?: boolean;
    };
    if (res.ok && json.ok) server = json.alerts || [];
  } catch {
    /* offline → local */
  }

  const local = readLocal(managerId);
  const legacy = readLegacy();
  const merged = mergeById(server, mergeById(local, legacy));
  writeLocal(managerId, merged);

  const migratedKey = `${MIGRATED_FLAG}${managerId}`;
  const already =
    typeof window !== "undefined" &&
    window.localStorage.getItem(migratedKey) === "1";

  // sync รายการที่เครื่องมีแต่เซิร์ฟเวอร์ยังไม่มี
  const serverIds = new Set(server.map((s) => s.id));
  const missing = merged.filter((m) => !serverIds.has(m.id));
  if (missing.length > 0) {
    try {
      const res = await fetch("/api/sale/manager/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alerts: missing }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        alerts?: ManagerAlertRecord[];
      };
      if (res.ok && json.ok && json.alerts) {
        writeLocal(managerId, json.alerts);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(migratedKey, "1");
          window.localStorage.removeItem(LEGACY_KEY);
        }
        return json.alerts;
      }
    } catch {
      /* keep local */
    }
  } else if (!already && typeof window !== "undefined") {
    window.localStorage.setItem(migratedKey, "1");
    window.localStorage.removeItem(LEGACY_KEY);
  }

  return merged;
}

export async function markAlertDoneRemote(
  managerId: string,
  item: Omit<ManagerAlertRecord, "doneAt"> & { doneAt?: string },
): Promise<ManagerAlertRecord[]> {
  const optimistic = mergeById(readLocal(managerId), [
    {
      ...item,
      doneAt: item.doneAt || new Date().toISOString(),
    },
  ]);
  writeLocal(managerId, optimistic);

  try {
    const res = await fetch("/api/sale/manager/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert: item }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      alerts?: ManagerAlertRecord[];
    };
    if (res.ok && json.ok && json.alerts) {
      writeLocal(managerId, json.alerts);
      return json.alerts;
    }
  } catch {
    /* keep optimistic */
  }
  return optimistic;
}

export async function restoreAlertRemote(
  managerId: string,
  id: string,
): Promise<ManagerAlertRecord[]> {
  const optimistic = readLocal(managerId).filter((x) => x.id !== id);
  writeLocal(managerId, optimistic);

  try {
    const res = await fetch(
      `/api/sale/manager/alerts?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const json = (await res.json()) as {
      ok?: boolean;
      alerts?: ManagerAlertRecord[];
    };
    if (res.ok && json.ok && json.alerts) {
      writeLocal(managerId, json.alerts);
      return json.alerts;
    }
  } catch {
    /* keep optimistic */
  }
  return optimistic;
}

export async function deleteDoneAlertRemote(
  managerId: string,
  id: string,
): Promise<ManagerAlertRecord[]> {
  return restoreAlertRemote(managerId, id);
}

/** @deprecated sync helpers — ใช้ remote แทน */
export function markAlertDone(
  item: Omit<ManagerAlertRecord, "doneAt"> & { doneAt?: string },
): ManagerAlertRecord[] {
  const list = readLegacy().filter((x) => x.id !== item.id);
  list.unshift({
    ...item,
    doneAt: item.doneAt || new Date().toISOString(),
  });
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_KEY, JSON.stringify(list));
  }
  return list;
}

export function restoreAlert(id: string): ManagerAlertRecord[] {
  const list = readLegacy().filter((x) => x.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LEGACY_KEY, JSON.stringify(list));
  }
  return list;
}

export function deleteDoneAlert(id: string): ManagerAlertRecord[] {
  return restoreAlert(id);
}

export function formatAlertDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });
}

/** ตรวจว่า alert นี้ถูกติกแล้วหรือยัง — รองรับ id รูปแบบเก่า */
export function isAlertDone(
  alertId: string,
  title: string,
  doneIds: Set<string>,
  doneList: ManagerAlertRecord[],
) {
  if (doneIds.has(alertId)) return true;
  const norm = title.trim().toLowerCase().replace(/\s+/g, " ");
  for (const d of doneList) {
    if (d.id === alertId) return true;
    const dNorm = (d.title || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (norm && dNorm === norm && alertId.split(":")[0] === d.id.split(/[-:]/)[0]) {
      return true;
    }
    // legacy: uuid-step-Title vs uuid:step:title
    if (d.id.replace(/-step-/i, ":step:").toLowerCase() === alertId.toLowerCase()) {
      return true;
    }
    if (d.id.replace(/-quote-/i, ":quote:").toLowerCase() === alertId.toLowerCase()) {
      return true;
    }
  }
  return false;
}
