import { DemoShell } from "@/components/saledesk/DemoShell";
import { ManagerStoryboard } from "@/components/saledesk/ManagerStoryboard";

export const dynamic = "force-static";

export default function SaleDemoManagerPage() {
  return (
    <DemoShell role="manager" title="มุมผู้จัดการ — งานค้างจากสนาม">
      <ManagerStoryboard />
    </DemoShell>
  );
}
