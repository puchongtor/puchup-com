import { dental } from "../_industry/content";
import { ServicePage, serviceMetadata } from "../_industry/ServicePage";

export const metadata = serviceMetadata(dental);

export default function DentalClinicWebsitePage() {
  return <ServicePage industry={dental} />;
}
