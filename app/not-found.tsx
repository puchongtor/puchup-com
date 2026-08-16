import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="mb-3 text-3xl font-bold">ไม่พบหน้านี้</h1>
      <p className="mb-8 text-muted">ลิงก์อาจเปลี่ยนแล้ว หรือหน้าถูกย้าย</p>
      <Link href="/" className="inline-flex rounded-full bg-navy px-5 py-3 font-semibold text-base">
        กลับหน้าแรก
      </Link>
    </section>
  );
}
