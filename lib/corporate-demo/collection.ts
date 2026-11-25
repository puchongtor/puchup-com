export const corporateGroups = [
  "งานอาคารสูง", "ทำความสะอาดและดูแลอาคาร", "สวนและภูมิทัศน์", "น้ำพุ สระ และระบบน้ำ",
  "รับสร้างบ้านและอาคาร", "รีโนเวตและตกแต่งภายใน", "รถเครนและเครื่องจักร", "ขนย้ายและงานหน้างาน",
  "ป้ายและงานแสดงสินค้า", "งานระบบอาคาร", "งานเฉพาะทางโรงงาน", "งานซ่อมแซมและต่อเติม",
] as const;

export const flagshipSites = [
  "high-rise-glass-cleaning", "post-construction-cleaning", "landscape-design", "fountain-installation",
  "home-builder", "home-renovation", "crane-rental", "machinery-moving",
  "storefront-signage", "solar-rooftop", "epoxy-flooring", "waterproofing",
] as const;

export function saleHref(slug: string) {
  return `/corporate/${slug}/`;
}

export function demoHref(slug: string) {
  return slug === "crane-rental" ? "/demo/crane-rental/" : `/business-demo/${slug}/`;
}
