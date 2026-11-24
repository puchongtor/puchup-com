import { resort } from "../_industry/content";
import { serviceMetadata } from "../_industry/ServicePage";
import { IndustrySalesPage } from "../_industry/IndustrySalesPage";
import { resortSales } from "../_industry/sales-content";

export const metadata = serviceMetadata(resort);

const coastalExample = {
  name: "Tamarind Tide Pranburi",
  path: "/tamarind-tide-pranburi/",
  image: "/images/project-one/sales/tamarind-tide-plus.webp",
  kind: "Local SEO Plus · บ้านพักติดทะเล",
  description: "เว็บตัวอย่างสำหรับรีสอร์ทริมทะเลขนาดกลาง มีหน้าห้องพัก 5 แบบ โปรพิเศษ คลิปบรรยากาศ และบทความสำหรับทริปกลุ่ม ลูกค้าเลือกห้องกับวันเข้าพักแล้วเตรียมข้อความสอบถามทาง LINE ได้",
};

export default function ResortWebsitePage() {
  return <IndustrySalesPage industry={resort} sales={resortSales} additionalExamples={[coastalExample]} />;
}
