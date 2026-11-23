import { pilates } from "../_industry/content";
import { ServicePage, serviceMetadata } from "../_industry/ServicePage";

export const metadata = serviceMetadata(pilates);

export default function PilatesStudioWebsitePage() {
  return <ServicePage industry={pilates} />;
}
