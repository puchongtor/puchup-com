"use client";

import { saleHref, saleNavPath } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { SALE_ROLE_LABEL, type SaleAppRole } from "@/lib/sales-ai/roles";

const ADMIN_HUB = [
  {
    path: "/admin/sales",
    title: "ติดตาม Sale",
    desc: "ดูรายงานและการเคลื่อนไหวของแต่ละคน (ไม่อินเข้าบัญชี)",
  },
  {
    path: "/manager",
    title: "Manager",
    desc: "บริษัท → Sale ใครไปวันไหน → เปิดรายงาน",
  },
  {
    path: "/score",
    title: "คะแนนแยก Sale",
    desc: "คะแนนและคำแนะนำรายคน จากรายงานที่ยืนยัน",
  },
] as const;

type UserStatus = "active" | "suspended" | "closed";

type UserRow = {
  id: string;
  username: string;
  full_name: string;
  nickname?: string | null;
  phone?: string | null;
  email?: string | null;
  position?: string | null;
  role: SaleAppRole;
  status: UserStatus | string;
  created_at?: string;
};

const STATUS_LABEL: Record<string, string> = {
  active: "ใช้งาน",
  suspended: "ระงับ",
  closed: "ปิด",
};

type ConfirmState = {
  id: string;
  username: string;
  action: "suspended" | "closed";
} | null;

export default function SaleAdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "sales" as SaleAppRole,
  });
  const [editForm, setEditForm] = useState({
    username: "",
    fullName: "",
    nickname: "",
    phone: "",
    email: "",
    position: "",
    role: "sales" as SaleAppRole,
    password: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sale/users");
      const json = (await res.json()) as { ok: boolean; users?: UserRow[]; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "โหลดรายชื่อไม่สำเร็จ");
        return;
      }
      setUsers(json.users || []);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(u: UserRow) {
    setEditingId(u.id);
    setOkMsg(null);
    setError(null);
    setEditForm({
      username: u.username || "",
      fullName: u.full_name || "",
      nickname: u.nickname || "",
      phone: u.phone || "",
      email: u.email || "",
      position: u.position || "",
      role: (u.role as SaleAppRole) || "sales",
      password: "",
    });
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/sale/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "สร้างบัญชีไม่สำเร็จ");
        return;
      }
      setOkMsg("สร้างบัญชีแล้ว");
      setForm({ username: "", password: "", fullName: "", role: "sales" });
      await load();
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const payload: Record<string, string> = {
        id: editingId,
        username: editForm.username.trim().toLowerCase(),
        fullName: editForm.fullName,
        nickname: editForm.nickname,
        phone: editForm.phone,
        email: editForm.email,
        position: editForm.position,
        role: editForm.role,
      };
      if (editForm.password.trim()) payload.password = editForm.password.trim();

      const res = await fetch("/api/sale/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "บันทึกไม่สำเร็จ");
        return;
      }
      setOkMsg("แก้ไขบัญชีแล้ว");
      setEditingId(null);
      await load();
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSaving(false);
    }
  }

  async function applyStatus(id: string, status: UserStatus) {
    setError(null);
    setOkMsg(null);
    const res = await fetch("/api/sale/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!res.ok || !json.ok) {
      setError(json.error || "เปลี่ยนสถานะไม่สำเร็จ");
      return;
    }
    setOkMsg(
      status === "active"
        ? "เปิดใช้บัญชีแล้ว"
        : status === "suspended"
          ? "ระงับบัญชีแล้ว"
          : "ปิดบัญชีแล้ว",
    );
    setConfirm(null);
    await load();
  }

  return (
    <div className="min-h-dvh" style={{ background: "var(--sale-bg)" }}>
      <header className="px-4 py-5 text-white sm:px-6" style={{ background: "var(--sale-navy)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <BrandMark tone="dark" size="sm" showProduct={false} />
            <h1 className="mt-3 text-lg font-semibold">Admin ระบบ</h1>
            <p className="text-xs text-white/70">
              ส่องระบบรวม · Manager จัดการ Sale เองได้ · {SALE_BRAND.name}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-xs text-white/90"
            style={{ background: "rgba(255,255,255,0.12)" }}
            onClick={async () => {
              await fetch("/api/sale/auth/logout", { method: "POST" });
              window.location.href = saleNavPath("/");
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section
          className="rounded-2xl border bg-white/90 p-5 shadow-sm"
          style={{ borderColor: "var(--sale-line)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
            เข้าดูทุกระบบ (Admin)
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
            ติดตาม Sale = ดูรายงาน/การเคลื่อนไหวของแต่ละคน ไม่ได้สวมบัญชี Sale
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_HUB.map((item) => (
              <Link
                key={item.path}
                href={saleHref(item.path)}
                className="rounded-xl border px-4 py-3 transition hover:border-[var(--sale-navy)]"
                style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--sale-muted)" }}>
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {(error || okMsg) && (
          <p
            className="text-center text-xs"
            style={{ color: error ? "var(--sale-danger-text)" : "var(--sale-ok-text)" }}
          >
            {error || okMsg}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            className="rounded-2xl border bg-white/90 p-5 shadow-sm"
            style={{ borderColor: "var(--sale-line)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
              เพิ่มบัญชี
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
              ผู้บริหาร = อ่านรายงาน (ยังไม่แยกทีม) · Sale ช่วงทดสอบสูงสุด 5 คน
            </p>
            <form onSubmit={onCreate} className="mt-4 space-y-3">
              <Field
                label="Username"
                value={form.username}
                onChange={(v) => setForm((f) => ({ ...f, username: v }))}
                placeholder="username"
              />
              <Field
                label="รหัสผ่านชั่วคราว"
                value={form.password}
                onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                type="password"
              />
              <Field
                label="ชื่อที่แสดง"
                value={form.fullName}
                onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
                placeholder="ชื่อ-นามสกุล"
              />
              <RoleSelect
                value={form.role}
                onChange={(role) => setForm((f) => ({ ...f, role }))}
              />
              <button
                type="submit"
                disabled={saving}
                className="sale-btn-accent w-full py-2.5 text-sm disabled:opacity-60"
              >
                {saving ? "กำลังสร้าง…" : "สร้างบัญชี"}
              </button>
            </form>
          </section>

          <section
            className="rounded-2xl border bg-white/90 p-5 shadow-sm"
            style={{ borderColor: "var(--sale-line)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
              บัญชีทั้งหมด
            </h2>
            {loading ? (
              <p className="mt-4 text-sm" style={{ color: "var(--sale-muted)" }}>
                กำลังโหลด…
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className="border-b pb-3 last:border-0"
                    style={{ borderColor: "var(--sale-line)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{u.full_name}</p>
                        <p className="text-xs" style={{ color: "var(--sale-muted)" }}>
                          @{u.username} · {SALE_ROLE_LABEL[u.role] || u.role} ·{" "}
                          {STATUS_LABEL[u.status] || u.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {u.role === "sales" ? (
                          <Link
                            href={saleHref(`/admin/sales/${u.id}`)}
                            className="rounded-lg px-2.5 py-1.5 text-[11px]"
                            style={{
                              background: "var(--sale-navy-soft)",
                              color: "var(--sale-navy)",
                            }}
                          >
                            ดูการเคลื่อนไหว
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-lg px-2.5 py-1.5 text-[11px]"
                          style={{
                            background: "var(--sale-navy-soft)",
                            color: "var(--sale-navy)",
                          }}
                          onClick={() =>
                            editingId === u.id ? setEditingId(null) : startEdit(u)
                          }
                        >
                          {editingId === u.id ? "ปิดแก้ไข" : "แก้ไข"}
                        </button>
                        {u.status === "active" ? (
                          <>
                            <button
                              type="button"
                              className="rounded-lg px-2.5 py-1.5 text-[11px]"
                              style={{
                                background: "var(--sale-warn)",
                                color: "var(--sale-warn-text)",
                              }}
                              onClick={() =>
                                setConfirm({
                                  id: u.id,
                                  username: u.username,
                                  action: "suspended",
                                })
                              }
                            >
                              ระงับ
                            </button>
                            <button
                              type="button"
                              className="rounded-lg px-2.5 py-1.5 text-[11px]"
                              style={{
                                background: "var(--sale-danger)",
                                color: "var(--sale-danger-text)",
                              }}
                              onClick={() =>
                                setConfirm({
                                  id: u.id,
                                  username: u.username,
                                  action: "closed",
                                })
                              }
                            >
                              ปิด
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="rounded-lg px-2.5 py-1.5 text-[11px]"
                            style={{
                              background: "var(--sale-ok)",
                              color: "var(--sale-ok-text)",
                            }}
                            onClick={() => applyStatus(u.id, "active")}
                          >
                            เปิดใช้
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === u.id ? (
                      <form
                        onSubmit={onSaveEdit}
                        className="mt-3 space-y-2 rounded-xl p-3"
                        style={{ background: "var(--sale-bg)" }}
                      >
                        <Field
                          label="Username (สำหรับล็อกอิน)"
                          value={editForm.username}
                          onChange={(v) => setEditForm((f) => ({ ...f, username: v }))}
                          placeholder="a-z 0-9 . _ -"
                        />
                        <Field
                          label="ชื่อที่แสดง"
                          value={editForm.fullName}
                          onChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))}
                        />
                        <Field
                          label="ชื่อเล่น"
                          value={editForm.nickname}
                          onChange={(v) => setEditForm((f) => ({ ...f, nickname: v }))}
                          required={false}
                        />
                        <Field
                          label="ตำแหน่ง"
                          value={editForm.position}
                          onChange={(v) => setEditForm((f) => ({ ...f, position: v }))}
                          required={false}
                        />
                        <Field
                          label="เบอร์โทร"
                          value={editForm.phone}
                          onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                          required={false}
                        />
                        <Field
                          label="อีเมล"
                          value={editForm.email}
                          onChange={(v) => setEditForm((f) => ({ ...f, email: v }))}
                          required={false}
                        />
                        <RoleSelect
                          value={editForm.role}
                          onChange={(role) => setEditForm((f) => ({ ...f, role }))}
                        />
                        <Field
                          label="รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)"
                          value={editForm.password}
                          onChange={(v) => setEditForm((f) => ({ ...f, password: v }))}
                          type="password"
                          required={false}
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="sale-btn-primary w-full py-2 text-sm disabled:opacity-60"
                        >
                          {saving ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
                        </button>
                      </form>
                    ) : null}
                  </li>
                ))}
                {users.length === 0 ? (
                  <li className="text-sm" style={{ color: "var(--sale-muted)" }}>
                    ยังไม่มีบัญชี
                  </li>
                ) : null}
              </ul>
            )}
          </section>
        </div>
      </main>

      {confirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl border bg-white p-5 shadow-lg"
            style={{ borderColor: "var(--sale-line)" }}
          >
            <h3 className="text-base font-semibold" style={{ color: "var(--sale-navy)" }}>
              {confirm.action === "closed" ? "ยืนยันปิดบัญชี?" : "ยืนยันระงับบัญชี?"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--sale-muted)" }}>
              {confirm.action === "closed" ? (
                <>
                  จะ<strong>ปิด</strong>บัญชี <strong>@{confirm.username}</strong>{" "}
                  — เข้าสู่ระบบไม่ได้จนกว่าจะกดเปิดใช้อีกครั้ง ต้องการดำเนินการต่อหรือไม่?
                </>
              ) : (
                <>
                  จะ<strong>ระงับชั่วคราว</strong>บัญชี <strong>@{confirm.username}</strong>{" "}
                  — เข้าสู่ระบบไม่ได้จนกว่าจะกดเปิดใช้ ต้องการดำเนินการต่อหรือไม่?
                </>
              )}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="sale-btn-ghost flex-1 py-2.5 text-sm"
                onClick={() => setConfirm(null)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
                style={{
                  background:
                    confirm.action === "closed" ? "#b91c1c" : "var(--sale-navy)",
                }}
                onClick={() => applyStatus(confirm.id, confirm.action)}
              >
                {confirm.action === "closed" ? "ยืนยันปิด" : "ยืนยันระงับ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: SaleAppRole;
  onChange: (role: SaleAppRole) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
        สิทธิ์
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SaleAppRole)}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
      >
        <option value="sales">Sale</option>
        <option value="manager">ผู้บริหาร (Manager)</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
      />
    </label>
  );
}
