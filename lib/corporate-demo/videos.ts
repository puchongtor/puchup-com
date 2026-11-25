export type CompanyVideo = { id: string; title: string };

export const companyVideos: Readonly<Partial<Record<string, CompanyVideo>>> = {
  fountain: { id: "musical", title: "น้ำพุดนตรีและแสงไฟยามค่ำ" },
  glass: { id: "glass-wash", title: "เก็บคราบกระจกด้านล่างของอาคารสำนักงาน" },
  clean: { id: "lobby-scrub", title: "ทำความสะอาดพื้นล็อบบี้ก่อนส่งมอบ" },
  landscape: { id: "garden-planting", title: "จัดวางพรรณไม้ริมทางเดินในสวน" },
  home: { id: "house-handover", title: "เดินตรวจงานบ้านก่อนส่งมอบ" },
  machinery: { id: "warehouse-move", title: "เคลื่อนเครื่องจักรผ่านทางเดินในคลัง" },
  sign: { id: "backlit-sign", title: "ตรวจชิ้นงานป้ายและลองเปิดไฟด้านหลัง" },
  solar: { id: "roof-array", title: "มุมบินผ่านแผงโซลาร์บนหลังคาโรงงาน" },
  epoxy: { id: "floor-rolling", title: "เกลี่ยผิวเคลือบบนพื้นโรงงาน" },
  waterproof: { id: "drain-check", title: "ตรวจงานกันซึมรอบปากท่อระบาย" },
  pest: { id: "inspection", title: "สำรวจวงกบไม้และบันทึกจุดตรวจ" },
};
