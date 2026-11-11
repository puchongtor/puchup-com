"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { homeForRole, type SaleAppRole } from "@/lib/sales-ai/roles";

/** หน้าแรกโดเมน sale — Login + โลโก้ */
export default function SaleLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/sale/auth/me");
        if (!res.ok) return;
        const json = (await res.json()) as { ok?: boolean; redirectTo?: string };
        if (!cancelled && json.ok && json.redirectTo) {
          router.replace(json.redirectTo);
        }
      } catch {
        /* stay on login */
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/sale/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        redirectTo?: string;
        user?: { role: SaleAppRole };
      };
      if (!res.ok || !json.ok) {
        setError(json.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      router.replace(
        json.redirectTo || homeForRole(json.user?.role || "sales"),
      );
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(0,52,120,0.18), transparent 60%), linear-gradient(180deg, #f4f7fb 0%, #e8eef6 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark tone="light" size="lg" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight" style={{ color: "var(--sale-navy)" }}>
            {SALE_BRAND.name}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--sale-muted)" }}>
            เข้าสู่ระบบทีมขาย
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border bg-white/90 p-5 shadow-sm backdrop-blur-md"
          style={{ borderColor: "var(--sale-line)" }}
        >
          {checking ? (
            <p className="py-6 text-center text-sm" style={{ color: "var(--sale-muted)" }}>
              กำลังตรวจสอบสถานะ…
            </p>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
                  Username
                </span>
                <input
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
                  placeholder="username"
                  required
                />
              </label>
              <label className="mt-3 block">
                <span className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
                  รหัสผ่าน
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
                  required
                />
              </label>

              {error ? (
                <p className="mt-3 text-center text-xs" style={{ color: "var(--sale-danger-text)" }}>
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="sale-btn-accent mt-4 w-full py-3 text-[15px] disabled:opacity-60"
              >
                {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
              </button>

              <p className="mt-3 text-center text-[11px] leading-relaxed" style={{ color: "var(--sale-muted)" }}>
                บัญชีสร้างโดย Admin เท่านั้น — ไม่มีสมัครเอง
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
