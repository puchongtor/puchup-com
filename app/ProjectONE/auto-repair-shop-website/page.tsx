import { autoService } from "../_industry/content";
import { ServicePage, serviceMetadata } from "../_industry/ServicePage";

export const metadata = serviceMetadata(autoService);

export default function AutoRepairShopWebsitePage() {
  return <ServicePage industry={autoService} />;
}
