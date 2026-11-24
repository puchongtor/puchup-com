import { resort } from "../_industry/content";
import { serviceMetadata } from "../_industry/ServicePage";
import { IndustrySalesPage } from "../_industry/IndustrySalesPage";
import { resortSales } from "../_industry/sales-content";

export const metadata = serviceMetadata(resort);

export default function ResortWebsitePage() {
  return <IndustrySalesPage industry={resort} sales={resortSales} />;
}
