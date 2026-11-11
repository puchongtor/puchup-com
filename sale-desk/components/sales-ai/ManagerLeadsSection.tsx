"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AssistantFace } from "@/components/sales-ai/AssistantFace";
import {
  getAssistantPersona,
  loadAssistantId,
} from "@/lib/sales-ai/assistant-persona";
import {
  hasPendingFollowUp,
  isAccountStuck,
  matchSalesOptionId,
  type OpenAccount,
  type OpenAccountDraft,
} from "@/lib/sales-ai/open-accounts";

type Bubble = { role: "manager" | "assistant"; content: string };

type SalesOption = {
  id: string;
  label: string;
  username?: string | null;
};

const emptyDraft = (): OpenAccountDraft => ({
  companyName: null,
  contactName: null,
  phone: null,
  note: null,
  status: "open",
  nextAction: null,
  nextActionAt: null,
  ownerSalesHint: null,
});

function formatWhen(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  salesOptions: SalesOption[];
  managerName: string;
  managerId: string;
  onAccountsChanged?: () => void;
};

/**
 * แท็บเพิ่มฐานข้อมูลลูกค้าในหน้า Manager
 * บน = คุยกับเลขา + ร่าง · ล่าง = รายการที่บันทึกแล้ว
 */
export function ManagerLeadsSection({
  salesOptions,
  managerName,
  managerId,
  onAccountsChanged,
}: Props) {
  const persona = useMemo(
    () => getAssistantPersona(loadAssistantId(managerId)),
    [managerId],
  );
  const [accounts, setAccounts] = useState<OpenAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [turns, setTurns] = useState<Bubble[]>([
    {
      role: "assistant",
      content: `สวัสดีค่ะ ดิฉัน${persona.name} — วางชื่อลูกค้าเก่า เบอร์ หรือข้อความที่มีงานค้างมาได้เลยค่ะ จะจัดร่างให้ แล้วยืนยันบันทึกด้านขวาได้เลย`,
    },
  ]);
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<OpenAccountDraft>(emptyDraft);
  const [ownerSalesId, setOwnerSalesId] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const rawParts = useRef<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch("/api/sale/accounts?status=active");
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        accounts?: OpenAccount[];
      };
      if (!res.ok || !json.ok) {
        setListError(json.error || "โหลดรายการไม่สำเร็จ");
        setAccounts([]);
        return;
      }
      setAccounts(json.accounts || []);
    } catch {
      setListError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const followUpCount = useMemo(
    () => accounts.filter((a) => hasPendingFollowUp(a)).length,
    [accounts],
  );

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const msg = text.trim();
    if (!msg || busy) return;
    setBusy(true);
    setFormError(null);
    setText("");
    rawParts.current.push(msg);
    const nextTurns = [...turns, { role: "manager" as const, content: msg }];
    setTurns(nextTurns);
    try {
      const res = await fetch("/api/sale/accounts/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: msg,
          draft,
          salesOptions,
          history: nextTurns.slice(0, -1).map((t) => ({
            role: t.role,
            content: t.content,
          })),
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        draft?: OpenAccountDraft;
        ownerSalesId?: string | null;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setFormError(json.error || "เลขาตอบไม่สำเร็จ");
        return;
      }
      if (json.draft) {
        setDraft({ ...json.draft, status: "open" });
        const matched =
          json.ownerSalesId ||
          matchSalesOptionId(json.draft.ownerSalesHint, salesOptions) ||
          matchSalesOptionId(msg, salesOptions);
        if (matched) setOwnerSalesId(matched);
      }
      setTurns((t) => [
        ...t,
        { role: "assistant", content: json.reply || "รับทราบค่ะ" },
      ]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
    } catch {
      setFormError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  async function saveAccount() {
    if (saving) return;
    if (!draft.companyName?.trim()) {
      setFormError("ยังไม่มีชื่อบริษัท — คุยกับเลขาหรือพิมพ์ในร่างก่อนนะ");
      return;
    }
    setSaving(true);
    setFormError(null);
    setSavedFlash(null);
    try {
      const res = await fetch("/api/sale/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: draft.companyName,
          contactName: draft.contactName,
          phone: draft.phone,
          note: draft.note,
          nextAction: draft.nextAction,
          nextActionAt: draft.nextActionAt,
          ownerSalesId: ownerSalesId || null,
          sourceRaw: rawParts.current.join("\n---\n").slice(0, 8000),
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        account?: OpenAccount;
      };
      if (!res.ok || !json.ok || !json.account) {
        setFormError(json.error || "บันทึกไม่สำเร็จ");
        return;
      }
      setAccounts((prev) => [
        json.account!,
        ...prev.filter((a) => a.id !== json.account!.id),
      ]);
      onAccountsChanged?.();
      setDraft(emptyDraft());
      setOwnerSalesId("");
      rawParts.current = [];
      const willAlert = Boolean(json.account.nextAction?.trim());
      setTurns([
        {
          role: "assistant",
          content: `บันทึก ${json.account.companyName} ในฐานลูกค้าแล้วค่ะ${
            json.account.ownerSalesName
              ? ` · ส่งให้ ${json.account.ownerSalesName} ติดตาม`
              : ""
          }${willAlert ? " · ใส่แจ้งเตือนงานติดตามแล้ว" : ""} — มีรายการอื่นวางต่อได้เลย`,
        },
      ]);
      setSavedFlash(
        willAlert
          ? `บันทึกแล้ว · ${json.account.companyName} · ขึ้นแจ้งเตือนแล้ว`
          : `บันทึกแล้ว · ${json.account.companyName}`,
      );
    } catch {
      setFormError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function archiveAccount(id: string) {
    try {
      const res = await fetch(`/api/sale/accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dropped" }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        onAccountsChanged?.();
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: "var(--sale-line)" }}
      >
        <div
          className="flex flex-wrap items-end justify-between gap-3 border-b px-4 py-3.5 sm:px-5"
          style={{
            borderColor: "var(--sale-line)",
            background: "var(--sale-navy-soft)",
          }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--sale-navy)" }}
            >
              เพิ่มฐานข้อมูลลูกค้า
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--sale-muted)" }}>
              ลูกค้าเก่าที่อยากเก็บ · ยังติดต่ออยู่ · หรือมีงานค้าง — ฐานเดียวกับ Sale ·
              บันทึกในชื่อ {managerName}
            </p>
          </div>
          {followUpCount > 0 ? (
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{
                background: "var(--sale-warn)",
                color: "var(--sale-warn-text)",
              }}
            >
              ติดตาม {followUpCount} · อยู่ในแจ้งเตือน
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-5">
          <section
            className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border bg-white lg:col-span-3"
            style={{ borderColor: `color-mix(in srgb, ${persona.accent} 35%, var(--sale-line))` }}
          >
            <div
              className="flex items-center gap-2.5 border-b px-3 py-2.5"
              style={{
                borderColor: persona.accent,
                background: `color-mix(in srgb, ${persona.accent} 8%, white)`,
              }}
            >
              <AssistantFace persona={persona} size={36} />
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--sale-navy)" }}
                >
                  คุยกับ{persona.name}
                </p>
                <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
                  เลขาจัดร่างฐานลูกค้า · {persona.vibe}
                </p>
              </div>
            </div>

            <div
              className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3"
              style={{ maxHeight: "36vh", background: "var(--sale-bg)" }}
            >
              {turns.map((t, i) => {
                const mine = t.role === "manager";
                return (
                  <div
                    key={`${t.role}-${i}`}
                    className={`flex items-end gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine ? <AssistantFace persona={persona} size={22} /> : null}
                    <p
                      className="max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                      style={{
                        background: mine
                          ? "var(--sale-navy)"
                          : "var(--sale-surface)",
                        color: mine ? "#fff" : "var(--sale-text)",
                        border: mine ? "none" : `1px solid ${persona.accent}`,
                      }}
                    >
                      {t.content}
                    </p>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => void send(e)}
              className="border-t p-3"
              style={{ borderColor: "var(--sale-line)" }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="วางข้อมูลลูกค้า หรือคุยกับเลขา…"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--sale-line)" }}
              />
              <button
                type="submit"
                disabled={busy || !text.trim()}
                className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--sale-navy)" }}
              >
                {busy ? `${persona.name} กำลังจัด…` : "ส่งให้เลขา"}
              </button>
            </form>
          </section>

          <aside
            className="rounded-2xl border bg-white p-4 lg:col-span-2"
            style={{ borderColor: "var(--sale-line)" }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--sale-muted)" }}
            >
              ร่างที่จะบันทึก
            </p>
            <Field
              label="บริษัท *"
              value={draft.companyName || ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, companyName: v || null }))
              }
            />
            <Field
              label="ผู้ติดต่อ"
              value={draft.contactName || ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, contactName: v || null }))
              }
            />
            <Field
              label="เบอร์"
              value={draft.phone || ""}
              onChange={(v) => setDraft((d) => ({ ...d, phone: v || null }))}
            />
            <Field
              label="งานถัดไป (ถ้ามี จะแจ้ง Sale ที่มอบหมาย)"
              value={draft.nextAction || ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, nextAction: v || null }))
              }
            />
            <label
              className="mt-2 block text-xs"
              style={{ color: "var(--sale-muted)" }}
            >
              มอบหมาย Sale (ถ้ามี)
              <select
                value={ownerSalesId}
                onChange={(e) => setOwnerSalesId(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                style={{ borderColor: "var(--sale-line)" }}
              >
                <option value="">ยังไม่มอบหมาย</option>
                {salesOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="mt-2 block text-xs"
              style={{ color: "var(--sale-muted)" }}
            >
              โน้ต
              <textarea
                value={draft.note || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, note: e.target.value || null }))
                }
                rows={2}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                style={{ borderColor: "var(--sale-line)" }}
              />
            </label>

            {formError ? (
              <p
                className="mt-3 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "var(--sale-warn)",
                  color: "var(--sale-warn-text)",
                }}
              >
                {formError}
              </p>
            ) : null}
            {savedFlash ? (
              <p
                className="mt-3 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "var(--sale-ok)",
                  color: "var(--sale-ok-text)",
                }}
              >
                {savedFlash}
              </p>
            ) : null}

            <button
              type="button"
              disabled={saving}
              onClick={() => void saveAccount()}
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--sale-navy)" }}
            >
              {saving ? "กำลังบันทึก…" : "ยืนยันบันทึกฐานลูกค้า"}
            </button>
          </aside>
        </div>
      </div>

      <section>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--sale-navy)" }}
          >
            ในฐานข้อมูลแล้ว
            {accounts.length ? ` · ${accounts.length}` : ""}
          </h3>
          <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
            มีงานถัดไป = ขึ้นแท็บแจ้งเตือนทันที
          </p>
        </div>

        {listError ? (
          <p
            className="mb-3 rounded-xl px-3 py-2 text-sm"
            style={{
              background: "var(--sale-warn)",
              color: "var(--sale-warn-text)",
            }}
          >
            {listError}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
            กำลังโหลด…
          </p>
        ) : accounts.length === 0 ? (
          <div
            className="rounded-2xl border bg-white px-4 py-8 text-center"
            style={{ borderColor: "var(--sale-line)" }}
          >
            <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีรายการในฐานนี้
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
              คุยกับเลขาด้านบน แล้วกดยืนยันบันทึก
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {accounts.map((a) => {
              const stuck = isAccountStuck(a);
              const pending = hasPendingFollowUp(a);
              return (
                <li
                  key={a.id}
                  className="rounded-2xl border bg-white px-4 py-3"
                  style={{
                    borderColor: stuck
                      ? "rgba(180, 83, 9, 0.45)"
                      : pending
                        ? "rgba(18, 52, 120, 0.28)"
                        : "var(--sale-line)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--sale-navy)" }}
                      >
                        {a.companyName || "ไม่ระบุบริษัท"}
                      </p>
                      <p
                        className="mt-0.5 text-xs"
                        style={{ color: "var(--sale-muted)" }}
                      >
                        {[a.contactName, a.phone].filter(Boolean).join(" · ") ||
                          "ยังไม่มีผู้ติดต่อ"}
                      </p>
                    </div>
                    {stuck || pending ? (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: stuck
                            ? "var(--sale-warn)"
                            : "var(--sale-navy-soft)",
                          color: stuck
                            ? "var(--sale-warn-text)"
                            : "var(--sale-navy)",
                        }}
                      >
                        {stuck ? "ค้าง" : "ติดตาม"}
                      </span>
                    ) : null}
                  </div>
                  {a.nextAction ? (
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--sale-text)" }}
                    >
                      งานถัดไป: {a.nextAction}
                      {formatWhen(a.nextActionAt)
                        ? ` · ${formatWhen(a.nextActionAt)}`
                        : ""}
                    </p>
                  ) : null}
                  <div
                    className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]"
                    style={{ color: "var(--sale-muted)" }}
                  >
                    <span>
                      ใส่โดย {a.createdByName || "ผู้จัดการ"}
                      {a.ownerSalesName ? ` · ส่งให้ ${a.ownerSalesName}` : ""}
                      {formatWhen(a.createdAt)
                        ? ` · ${formatWhen(a.createdAt)}`
                        : ""}
                    </span>
                    <button
                      type="button"
                      className="underline"
                      style={{ color: "var(--sale-navy)" }}
                      onClick={() => void archiveAccount(a.id)}
                    >
                      เก็บออกจากรายการ
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mt-2 block text-xs" style={{ color: "var(--sale-muted)" }}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
        style={{ borderColor: "var(--sale-line)" }}
      />
    </label>
  );
}
