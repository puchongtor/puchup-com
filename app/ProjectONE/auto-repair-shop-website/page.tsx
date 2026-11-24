import { autoService } from "../_industry/content";
import { serviceMetadata } from "../_industry/ServicePage";
import { IndustrySalesPage } from "../_industry/IndustrySalesPage";
import { autoSales } from "../_industry/sales-content";

export const metadata = serviceMetadata(autoService);

export default function AutoRepairShopWebsitePage() {
  return <IndustrySalesPage industry={autoService} sales={autoSales} />;
}
