"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import { AssistantFace } from "@/components/sales-ai/AssistantFace";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { ProfileAvatar } from "@/components/sales-ai/ProfileAvatar";
import {
  ASSISTANT_PERSONAS,
  getAssistantPersona,
  loadAssistantId,
  saveAssistantId,
} from "@/lib/sales-ai/assistant-persona";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { normalizeSaleRole } from "@/lib/sales-ai/roles";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";

/** โปรไฟล์ตัวเอง: Sale / ผู้จัดการ — รูป ชื่อ username รหัสผ่าน */
export default function SaleProfilePage() {
  const {
    ready,
    syncing,
    syncError,
    profile,
    updateProfile,
    setAvatarFromFile,
    clearAvatar,
  } = useSaleStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    nickname: "",
    position: "",
    phone: "",
    email: "",
  });
  const [assistantId, setAssistantId] = useState("nara");
  const [assistantSaved, setAssistantSaved] = useState(false);

  const role = normalizeSaleRole(profile.role);
  const isManager = role === "manager";
  const backHref = isManager ? saleHref("/manager") : saleHref("/home");

  useEffect(() => {
    if (!ready) return;
    setForm({
      username: profile.username || "",
      fullName: profile.fullName,
      nickname: profile.nickname,
      position: profile.position,
      phone: profile.phone,
      email: profile.email,
    });
    setAssistantId(loadAssistantId(profile.id));
  }, [ready, profile]);

  function onPickAssistant(id: string) {
    setAssistantId(id);
    saveAssistantId(profile.id, id);
    // เคลียร์แชทโฮมเก่า ให้ทักทายด้วยน้ำเสียงผู้ช่วยใหม่
    try {
      localStorage.removeItem(`ap_sale_coach_chat_v1:${profile.id}`);
    } catch {
      /* ignore */
    }
    setAssistantSaved(true);
    window.setTimeout(() => setAssistantSaved(false), 1800);
  }

  const selectedAssistant = getAssistantPersona(assistantId);

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("ไฟล์ใหญ่เกิน 8MB");
      return;
    }
    setError(null);
    try {
      await setAvatarFromFile(file);
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ");
    }
  }

  async function onSave() {
    if (!form.fullName.trim()) {
      setError("กรุณากรอกชื่อ");
      return;
    }
    const username = form.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      setError("username ใช้ a-z 0-9 . _ - ความยาว 3–32");
      return;
    }
    setError(null);

    const fullName = form.fullName.trim();
    await updateProfile({
      username,
      fullName,
      nickname: isManager
        ? fullName
        : form.nickname.trim() || fullName,
      position: isManager
        ? profile.position || "ผู้บริหาร"
        : form.position.trim() || "เซลล์ภาคสนาม",
      phone: form.phone.trim(),
      email: form.email.trim(),
    });

    // username อยู่ในตาราง profiles ผ่าน /api/sale/users
    if (username !== (profile.username || "").toLowerCase()) {
      try {
        const res = await fetch("/api/sale/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: profile.id, username }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error || "เปลี่ยน username ไม่สำเร็จ");
          return;
        }
      } catch {
        setError("เปลี่ยน username ไม่สำเร็จ");
        return;
      }
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function onChangePassword() {
    setPwErr(null);
    setPwMsg(null);
    if (pwForm.newPassword.length < 6) {
      setPwErr("รหัสผ่านใหม่อย่างน้อย 6 ตัว");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwErr("รหัสใหม่กับยืนยันไม่ตรงกัน");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/sale/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setPwErr(json.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        return;
      }
      setPwMsg("เปลี่ยนรหัสผ่านแล้ว");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwErr("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setPwSaving(false);
    }
  }

  const previewProfile = {
    ...profile,
    ...form,
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="px-4 pb-4 pt-5 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="sm" />
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={backHref}
            className="rounded-lg p-2"
            style={{ background: "rgba(255,255,255,0.12)" }}
            aria-label="กลับ"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-semibold">
              {isManager ? "โปรไฟล์ของฉัน" : "โปรไฟล์พนักงาน"}
            </h1>
            <p className="text-[11px] text-white/75">
              {isManager
                ? `${SALE_BRAND.name} · ชื่อ · username · รหัสผ่าน`
                : `ทีมขาย ${SALE_BRAND.name} · รูป · ชื่อ · เบอร์ · ตำแหน่ง`}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <section className="sale-card flex flex-col items-center p-5">
          <div className="relative">
            <ProfileAvatar profile={previewProfile} size={96} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full text-white shadow"
              style={{ background: "var(--sale-navy)" }}
              aria-label="อัปโหลดรูป"
            >
              <Camera size={16} />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
          <div className="mt-3 flex gap-3 text-xs">
            <button
              type="button"
              className="font-medium"
              style={{ color: "var(--sale-navy)" }}
              onClick={() => fileRef.current?.click()}
            >
              อัปรูปโปรไฟล์
            </button>
            {profile.avatarDataUrl ? (
              <button
                type="button"
                className="font-medium"
                style={{ color: "var(--sale-muted)" }}
                onClick={clearAvatar}
              >
                ลบรูป
              </button>
            ) : null}
          </div>
        </section>

        <section className="sale-card space-y-3 p-4">
          <Field
            label="Username (ล็อกอิน)"
            value={form.username}
            onChange={(v) =>
              setForm((f) => ({ ...f, username: v.toLowerCase().replace(/\s/g, "") }))
            }
            placeholder="เช่น manager01"
          />
          <p className="-mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
            ใช้ a-z 0-9 . _ - · ยาว 3–32 ตัว · เปลี่ยนรหัสผ่านได้ด้านล่าง
          </p>
          <Field
            label="ชื่อ-นามสกุล"
            value={form.fullName}
            onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
            placeholder="เช่น สมชาย ใจดี"
          />
          {!isManager ? (
            <>
              <Field
                label="ชื่อที่แสดง / ชื่อเล่น"
                value={form.nickname}
                onChange={(v) => setForm((f) => ({ ...f, nickname: v }))}
                placeholder="เช่น คุณสมชาย"
              />
              <Field
                label="ตำแหน่ง"
                value={form.position}
                onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                placeholder="เช่น เซลล์ภาคสนาม"
              />
            </>
          ) : null}
          <Field
            label="เบอร์โทร"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            placeholder="08x-xxx-xxxx"
            type="tel"
          />
          <Field
            label="อีเมล (ถ้ามี)"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            placeholder="name@yourcompany.example"
            type="email"
          />
        </section>

        {error || syncError ? (
          <p className="text-center text-xs" style={{ color: "var(--sale-danger-text)" }}>
            {error || `บันทึกในเครื่องแล้ว แต่ซิงก์คลาวด์ไม่สำเร็จ: ${syncError}`}
          </p>
        ) : null}
        {saved && !syncError ? (
          <p className="text-center text-xs" style={{ color: "var(--sale-ok-text)" }}>
            บันทึกโปรไฟล์แล้ว (เครื่อง + Supabase)
          </p>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={syncing}
          className="sale-btn-accent touch-target w-full text-[15px] disabled:opacity-60"
        >
          {syncing ? "กำลังบันทึก…" : "บันทึกโปรไฟล์"}
        </button>

        {!isManager ? (
          <section className="sale-card space-y-3 p-4">
            <div className="flex items-center gap-3">
              <AssistantFace persona={selectedAssistant} size={48} />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                  เลือกผู้ช่วย AI
                </h2>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                  ตอนนี้: {selectedAssistant.name} · {selectedAssistant.vibe} · ล็อกจนกว่าจะเปลี่ยนใหม่
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ASSISTANT_PERSONAS.map((p) => {
                const active = p.id === assistantId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPickAssistant(p.id)}
                    className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center"
                    style={{
                      border: `1.5px solid ${active ? p.accent : "var(--sale-line)"}`,
                      background: active
                        ? `color-mix(in srgb, ${p.accent} 10%, white)`
                        : "var(--sale-surface)",
                    }}
                  >
                    <AssistantFace persona={p} size={52} />
                    <span className="text-xs font-semibold" style={{ color: "var(--sale-navy)" }}>
                      {p.name}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--sale-muted)" }}>
                      {p.vibe}
                    </span>
                  </button>
                );
              })}
            </div>
            {assistantSaved ? (
              <p className="text-center text-[11px]" style={{ color: "var(--sale-ok-text)" }}>
                บันทึกผู้ช่วยแล้ว — ใช้หน้าตาและน้ำเสียงนี้ต่อทันที
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="sale-card space-y-3 p-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
            เปลี่ยนรหัสผ่าน
          </h2>
          <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
            ใส่รหัสเดิมก่อน · เปลี่ยนเองได้ทันที
          </p>
          <Field
            label="รหัสผ่านปัจจุบัน"
            value={pwForm.currentPassword}
            onChange={(v) => setPwForm((f) => ({ ...f, currentPassword: v }))}
            type="password"
          />
          <Field
            label="รหัสผ่านใหม่"
            value={pwForm.newPassword}
            onChange={(v) => setPwForm((f) => ({ ...f, newPassword: v }))}
            type="password"
            placeholder="อย่างน้อย 6 ตัว"
          />
          <Field
            label="ยืนยันรหัสผ่านใหม่"
            value={pwForm.confirmPassword}
            onChange={(v) => setPwForm((f) => ({ ...f, confirmPassword: v }))}
            type="password"
          />
          {pwErr ? (
            <p className="text-center text-xs" style={{ color: "var(--sale-danger-text)" }}>
              {pwErr}
            </p>
          ) : null}
          {pwMsg ? (
            <p className="text-center text-xs" style={{ color: "var(--sale-ok-text)" }}>
              {pwMsg}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void onChangePassword()}
            disabled={pwSaving}
            className="sale-btn-primary touch-target w-full text-sm disabled:opacity-60"
          >
            {pwSaving ? "กำลังเปลี่ยน…" : "บันทึกรหัสผ่านใหม่"}
          </button>
        </section>

        {!isManager ? (
          <Link
            href={saleHref("/onboarding")}
            className="text-center text-xs"
            style={{ color: "var(--sale-muted)" }}
          >
            ตั้งค่าเพิ่มเติม (consent / ติดตั้งแอป)
          </Link>
        ) : (
          <Link
            href={saleHref("/manager")}
            className="text-center text-xs font-medium"
            style={{ color: "var(--sale-navy)" }}
          >
            ← กลับหน้าผู้จัดการ
          </Link>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
      />
    </label>
  );
}
