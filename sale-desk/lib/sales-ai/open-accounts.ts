import {
  CLAUDE_CHAT_MODEL,
  claudeMessages,
  parseClaudeJson,
  type ClaudeMessage,
} from "./claude";
import { SALE_BRAND } from "./brand";

export type OpenAccountStatus = "open" | "waiting" | "done" | "dropped";

export type OpenAccount = {
  id: string;
  companyName: string;
  contactName: string | null;
  phone: string | null;
  note: string | null;
  status: OpenAccountStatus;
  ownerSalesId: string | null;
  ownerSalesName: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
  sourceRaw: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OpenAccountDraft = {
  companyName: string | null;
  contactName: string | null;
  phone: string | null;
  note: string | null;
  status: OpenAccountStatus | null;
  nextAction: string | null;
  nextActionAt: string | null;
  /** ชื่อ Sale ที่ผู้จัดการพูดถึง — ใช้จับคู่ dropdown */
  ownerSalesHint: string | null;
};

export type OpenAccountEvent = {
  id: string;
  accountId: string;
  role: "manager" | "assistant";
  text: string;
  createdAt: string;
};

export function mapOpenAccountRow(
  row: {
    id: string;
    company_name: string;
    contact_name: string | null;
    phone: string | null;
    note: string | null;
    status: string;
    owner_sales_id: string | null;
    next_action: string | null;
    next_action_at: string | null;
    source_raw: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  },
  names?: {
    createdByName?: string | null;
    ownerSalesName?: string | null;
  },
): OpenAccount {
  const status = (
    ["open", "waiting", "done", "dropped"].includes(row.status)
      ? row.status
      : "open"
  ) as OpenAccountStatus;
  return {
    id: row.id,
    companyName: row.company_name || "",
    contactName: row.contact_name,
    phone: row.phone,
    note: row.note,
    status,
    ownerSalesId: row.owner_sales_id,
    ownerSalesName: names?.ownerSalesName ?? null,
    nextAction: row.next_action,
    nextActionAt: row.next_action_at,
    sourceRaw: row.source_raw,
    createdBy: row.created_by,
    createdByName: names?.createdByName ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** มีงานติดตามที่ต้องแจ้งเตือน (เพิ่งใส่ก็ขึ้นได้เลย) */
export function hasPendingFollowUp(a: OpenAccount) {
  if (a.status === "done" || a.status === "dropped") return false;
  return Boolean(a.nextAction?.trim());
}

/** เลยกำหนด / ค้างนาน — โทนเข้มกว่ามีงานติดตามทั่วไป */
export function isAccountStuck(a: OpenAccount, now = new Date()) {
  if (!hasPendingFollowUp(a)) return false;
  if (a.nextActionAt) {
    const t = Date.parse(a.nextActionAt);
    if (!Number.isNaN(t) && t < now.getTime()) return true;
  }
  const updated = Date.parse(a.updatedAt);
  if (!Number.isNaN(updated) && now.getTime() - updated > 3 * 24 * 60 * 60 * 1000) {
    return true;
  }
  return false;
}

function blank(v: unknown) {
  const s = String(v ?? "").trim();
  return s || null;
}

export function normalizeDraft(raw: unknown): OpenAccountDraft {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const statusRaw = String(o.status || "").trim();
  const status = (
    ["open", "waiting", "done", "dropped"].includes(statusRaw)
      ? statusRaw
      : null
  ) as OpenAccountStatus | null;
  let nextActionAt = blank(o.nextActionAt ?? o.next_action_at);
  if (nextActionAt && Number.isNaN(Date.parse(nextActionAt))) nextActionAt = null;
  return {
    companyName: blank(o.companyName ?? o.company),
    contactName: blank(o.contactName ?? o.contact),
    phone: blank(o.phone)?.slice(0, 40) || null,
    note: blank(o.note)?.slice(0, 2000) || null,
    status,
    nextAction: blank(o.nextAction ?? o.next_action)?.slice(0, 300) || null,
    nextActionAt,
    ownerSalesHint: blank(
      o.ownerSalesHint ?? o.owner_sales_hint ?? o.assignSale ?? o.sale,
    )?.slice(0, 80) || null,
  };
}

export function mergeDraft(
  base: OpenAccountDraft | null,
  patch: OpenAccountDraft,
): OpenAccountDraft {
  return {
    companyName: patch.companyName ?? base?.companyName ?? null,
    contactName: patch.contactName ?? base?.contactName ?? null,
    phone: patch.phone ?? base?.phone ?? null,
    note: patch.note ?? base?.note ?? null,
    status: patch.status ?? base?.status ?? "open",
    nextAction: patch.nextAction ?? base?.nextAction ?? null,
    nextActionAt: patch.nextActionAt ?? base?.nextActionAt ?? null,
    ownerSalesHint: patch.ownerSalesHint ?? base?.ownerSalesHint ?? null,
  };
}

/** จับชื่อ/ชื่อเล่น Sale จากข้อความหรือ hint → id ในรายชื่อทีม */
export function matchSalesOptionId(
  hint: string | null | undefined,
  options: { id: string; label: string; username?: string | null }[],
): string | null {
  const raw = String(hint || "").trim().toLowerCase();
  if (!raw || !options.length) return null;
  const cleaned = raw
    .replace(/^(sale|เซลล์|เซล|คุณ)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  // "sale puchong" / "ให้ puchong ติดตาม" ในประโยคยาว
  const saleToken =
    raw.match(
      /(?:sale|เซลล์|เซลล์ชื่อ|เซล)\s*([a-z0-9_.\u0e00-\u0e7f-]{2,40})/i,
    )?.[1]
      ?.toLowerCase()
      .trim() || null;

  const scored = options
    .map((o) => {
      const label = o.label.toLowerCase();
      const user = (o.username || "").toLowerCase();
      const tokens = [label, user, ...label.split(/[\s._-]+/)].filter(
        (t) => t && t.length >= 2,
      );
      let score = 0;
      for (const t of tokens) {
        if (cleaned === t || saleToken === t) score = Math.max(score, 100);
        else if (cleaned.includes(t) || raw.includes(t))
          score = Math.max(score, t.length >= 4 ? 85 : 70);
      }
      return { id: o.id, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.id || null;
}

type AssistTurn = { role: "manager" | "assistant"; content: string };

export type AssistSalesOption = {
  id: string;
  label: string;
  username?: string | null;
};

export async function assistOpenAccount(opts: {
  userText: string;
  history?: AssistTurn[];
  current?: OpenAccountDraft | null;
  salesOptions?: AssistSalesOption[];
}): Promise<
  | { ok: true; reply: string; draft: OpenAccountDraft; ownerSalesId: string | null }
  | { ok: false; error: string }
> {
  const current = opts.current || null;
  const roster = (opts.salesOptions || [])
    .slice(0, 40)
    .map((s) => `- ${s.label}${s.username ? ` (@${s.username})` : ""} [id:${s.id}]`)
    .join("\n");

  const system = `You are the manager's secretary at ${SALE_BRAND.legalName} (${SALE_BRAND.name}).
Help build the shared customer database: old accounts they want to keep, contacts still being followed, or jobs with pending follow-up. Same company/contact database as Sale visits. Thai female voice (ค่ะ/คะ). Short, human, clear. Chat is the main way to capture — be conversational and helpful.

The manager may paste long raw notes, short scraps, or ask questions. Extract only facts present in the text.
NEVER invent company names, people, or phone numbers. Use null when unknown.
Do NOT ask about CRM pipeline statuses. Keep status null or "open" only.
nextAction = the follow-up task itself in plain Thai (e.g. ติดตามเรื่องฟิล์มหด) — NOT the assignee name.
ownerSalesHint = nickname/username/name of the Sale to assign when the manager says ให้ sale … ติดตาม / มอบหมาย / ให้ … ทำ — extract ONLY the person token (e.g. "puchong"), not the whole sentence. null if none.
nextActionAt: ISO datetime Asia/Bangkok if a clear date/time is given, else null.

Sales roster (match ownerSalesHint to one of these when possible):
${roster || "(no roster)"}

Current draft JSON (may be empty):
${JSON.stringify(current || {})}

Output ONLY JSON:
{ "reply": string, "draft": { "companyName": string|null, "contactName": string|null, "phone": string|null, "note": string|null, "status": "open"|null, "nextAction": string|null, "nextActionAt": string|null, "ownerSalesHint": string|null } }

In reply: acknowledge what you captured in natural Thai including who will follow up if assigned. Ask at most ONE missing key field if needed.`;

  const history: ClaudeMessage[] = (opts.history || []).slice(-10).map((t) => ({
    role: t.role === "assistant" ? "assistant" : "user",
    content: t.content,
  }));

  const result = await claudeMessages({
    model: CLAUDE_CHAT_MODEL,
    system,
    maxTokens: 900,
    temperature: 0.25,
    messages: [...history, { role: "user", content: opts.userText }],
  });

  if (!result.ok) return { ok: false, error: result.error };

  const parsed = parseClaudeJson<{
    reply?: string;
    draft?: unknown;
  }>(result.text);

  let reply = String(parsed?.reply || "").trim();
  if (!reply) {
    reply = "รับทราบค่ะ ดิฉันจัดข้อมูลให้แล้ว ตรวจร่างด้านล่างได้นะคะ";
  }
  reply = reply
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();

  const draft = mergeDraft(current, normalizeDraft(parsed?.draft));
  const ownerSalesId = matchSalesOptionId(
    draft.ownerSalesHint,
    opts.salesOptions || [],
  );
  // กันชื่อ Sale ค้างใน nextAction อย่างเดียว
  if (
    !draft.nextAction &&
    draft.note &&
    /ติดตาม|ติดต่อเรื่อง|ดำเนินการ/i.test(draft.note)
  ) {
    const fromNote = draft.note
      .replace(/ให้\s*sale\s+\S+\s*/i, "")
      .replace(/ให้\s*\S+\s*ดำเนินการติดตาม/i, "ติดตาม")
      .trim();
    if (fromNote) draft.nextAction = fromNote.slice(0, 300);
  }
  return {
    ok: true,
    reply: reply.slice(0, 1800),
    draft,
    ownerSalesId,
  };
}
