import { resort } from "../_industry/content";
import { ServicePage, serviceMetadata } from "../_industry/ServicePage";

export const metadata = serviceMetadata(resort);

export default function ResortWebsitePage() {
  return <ServicePage industry={resort} />;
}
