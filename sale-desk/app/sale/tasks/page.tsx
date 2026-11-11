import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { salePublicPath } from "@/lib/sales-ai/paths";

/**
 * งานติดตามแบบจดมือในแอป — ตัดออกจากเฟสนำร่อง
 * (Sale จดในกระดาษ/มือถืออยู่แล้ว ไม่บังคับจดซ้ำ)
 * งานถัดไปให้โผล่จาก next_steps ในรายงานที่ยืนยัน ภายหลังถ้าต้องการ
 */
export default async function SaleTasksRedirectPage() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  redirect(salePublicPath("/home", host));
}
