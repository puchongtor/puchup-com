import { pilates } from "../_industry/content";
import { serviceMetadata } from "../_industry/ServicePage";
import { IndustrySalesPage } from "../_industry/IndustrySalesPage";
import { pilatesSales } from "../_industry/sales-content";

export const metadata = serviceMetadata(pilates);

export default function PilatesStudioWebsitePage() {
  return <IndustrySalesPage industry={pilates} sales={pilatesSales} />;
}
