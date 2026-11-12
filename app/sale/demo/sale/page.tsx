import { DemoShell } from "@/components/saledesk/DemoShell";
import { SaleStoryboard } from "@/components/saledesk/SaleStoryboard";

export const dynamic = "force-static";

export default function SaleDemoSalePage() {
  return (
    <DemoShell role="sale" title="มุมเซลล์ — จากเยี่ยมถึงรายงาน">
      <SaleStoryboard />
    </DemoShell>
  );
}
