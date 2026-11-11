"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PROFILE,
  DEFAULT_TASKS,
  fileToAvatarDataUrl,
  loadConsent,
  loadProfile,
  loadReports,
  loadTasks,
  saveConsent,
  saveProfile,
  saveTasks,
  removeReport,
  upsertReport,
} from "./storage";
import type { SalesProfile, StoredTask, StoredVisitReport } from "./types";

type SaleStoreValue = {
  ready: boolean;
  syncing: boolean;
  syncError: string | null;
  profile: SalesProfile;
  reports: StoredVisitReport[];
  tasks: StoredTask[];
  consent: boolean;
  updateProfile: (patch: Partial<SalesProfile>) => Promise<SalesProfile>;
  setAvatarFromFile: (file: File) => Promise<void>;
  clearAvatar: () => Promise<void>;
  confirmReport: (report: StoredVisitReport) => Promise<void>;
  discardReport: (reportId: string) => Promise<void>;
  toggleTask: (id: string) => void;
  setConsent: (v: boolean) => void;
};

const SaleStoreContext = createContext<SaleStoreValue | null>(null);

async function apiPutProfile(profile: SalesProfile) {
  const res = await fetch("/api/sale/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });
  const json = (await res.json()) as {
    ok: boolean;
    error?: string;
    profile?: SalesProfile;
  };
  if (!res.ok || !json.ok) throw new Error(json.error || "sync_failed");
  return json.profile || profile;
}

async function apiGetProfile(id: string) {
  const res = await fetch(`/api/sale/profile?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const json = (await res.json()) as { ok: boolean; profile: SalesProfile | null };
  return json.ok ? json.profile : null;
}

async function apiPutReport(report: StoredVisitReport) {
  const res = await fetch("/api/sale/reports", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });
  const json = (await res.json()) as { ok: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error || "report_sync_failed");
}

async function apiGetReports(opts: { salesId?: string; all?: boolean }) {
  const qs = opts.all
    ? "scope=all"
    : `salesId=${encodeURIComponent(opts.salesId || "")}`;
  const res = await fetch(`/api/sale/reports?${qs}`);
  if (!res.ok) return null;
  const json = (await res.json()) as {
    ok: boolean;
    reports?: StoredVisitReport[];
  };
  return json.ok ? json.reports || [] : null;
}

async function apiGetMe() {
  const res = await fetch("/api/sale/auth/me");
  if (!res.ok) return null;
  const json = (await res.json()) as {
    ok?: boolean;
    user?: {
      id: string;
      username?: string;
      fullName?: string;
      nickname?: string | null;
      position?: string | null;
      phone?: string | null;
      email?: string | null;
      avatarUrl?: string | null;
      role?: string;
    };
  };
  return json.ok ? json.user || null : null;
}

export function SaleStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [profile, setProfile] = useState<SalesProfile>(DEFAULT_PROFILE);
  const [reports, setReports] = useState<StoredVisitReport[]>([]);
  const [tasks, setTasks] = useState<StoredTask[]>(DEFAULT_TASKS);
  const [consent, setConsentState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = loadProfile();
      const localReports = loadReports();
      setProfile(local);
      setReports(localReports);
      setTasks(loadTasks());
      setConsentState(loadConsent());
      setReady(true);

      try {
        const me = await apiGetMe();
        if (cancelled) return;
        let active = local;
        if (me?.id) {
          active = saveProfile({
            ...local,
            id: me.id,
            username: me.username,
            fullName: me.fullName || local.fullName,
            nickname: me.nickname || me.fullName || local.nickname,
            position: me.position || local.position,
            phone: me.phone || local.phone,
            email: me.email || local.email,
            avatarDataUrl: me.avatarUrl || local.avatarDataUrl,
            role:
              me.role === "admin"
                ? "admin"
                : me.role === "manager" || me.role === "reports"
                  ? "manager"
                  : "sales",
          });
          setProfile(active);
        } else {
          const remote = await apiGetProfile(local.id);
          if (cancelled) return;
          if (remote) {
            active = saveProfile({
              ...remote,
              avatarDataUrl: remote.avatarDataUrl || local.avatarDataUrl,
            });
            setProfile(active);
          }
        }

        const seeAll = active.role === "admin" || active.role === "manager";
        const remoteReports = await apiGetReports(
          seeAll ? { all: true } : { salesId: active.id },
        );
        if (cancelled) return;
        if (remoteReports && remoteReports.length > 0) {
          const byId = new Map(
            seeAll ? [] : localReports.map((r) => [r.id, r] as const),
          );
          for (const r of remoteReports) byId.set(r.id, r);
          const merged = [...byId.values()].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt),
          );
          setReports(merged);
          if (!seeAll) {
            for (const r of merged) upsertReport(r);
          }
        }
      } catch {
        /* offline / API not ready — keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback(async (patch: Partial<SalesProfile>) => {
    setSyncing(true);
    setSyncError(null);
    let next = saveProfile({ ...loadProfile(), ...patch });
    setProfile(next);
    try {
      next = saveProfile(await apiPutProfile(next));
      setProfile(next);
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : "sync_failed");
    } finally {
      setSyncing(false);
    }
    return next;
  }, []);

  const setAvatarFromFile = useCallback(async (file: File) => {
    const dataUrl = await fileToAvatarDataUrl(file);
    await updateProfile({ avatarDataUrl: dataUrl });
  }, [updateProfile]);

  const clearAvatar = useCallback(async () => {
    await updateProfile({ avatarDataUrl: null });
  }, [updateProfile]);

  const confirmReport = useCallback(async (report: StoredVisitReport) => {
    const list = upsertReport(report);
    setReports([...list]);
    setSyncing(true);
    setSyncError(null);
    try {
      // visits.sales_id FK → profiles — sync profile first
      await apiPutProfile(loadProfile());
      await apiPutReport(report);
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : "report_sync_failed");
    } finally {
      setSyncing(false);
    }
  }, []);

  const discardReport = useCallback(async (reportId: string) => {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch(`/api/sale/visit/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "void" }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "discard_failed");
      }
      // ลบในเครื่องหลังเซิร์ฟเวอร์รับแล้ว — กันงานค้างโผล่กลับ / ลบไม่ครบ
      setReports([...removeReport(reportId)]);
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : "discard_failed");
      throw e;
    } finally {
      setSyncing(false);
    }
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      saveTasks(next);
      return next;
    });
  }, []);

  const setConsent = useCallback((v: boolean) => {
    saveConsent(v);
    setConsentState(v);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      syncing,
      syncError,
      profile,
      reports,
      tasks,
      consent,
      updateProfile,
      setAvatarFromFile,
      clearAvatar,
      confirmReport,
      discardReport,
      toggleTask,
      setConsent,
    }),
    [
      ready,
      syncing,
      syncError,
      profile,
      reports,
      tasks,
      consent,
      updateProfile,
      setAvatarFromFile,
      clearAvatar,
      confirmReport,
      discardReport,
      toggleTask,
      setConsent,
    ],
  );

  return (
    <SaleStoreContext.Provider value={value}>{children}</SaleStoreContext.Provider>
  );
}

export function useSaleStore() {
  const ctx = useContext(SaleStoreContext);
  if (!ctx) throw new Error("useSaleStore must be used within SaleStoreProvider");
  return ctx;
}

export function profileInitials(profile: SalesProfile) {
  const source = profile.nickname || profile.fullName || "A";
  const parts = source.replace(/^คุณ/, "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return source.slice(0, 1).toUpperCase() || "A";
}
