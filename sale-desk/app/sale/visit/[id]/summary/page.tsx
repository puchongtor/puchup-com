import { SummaryCard } from "@/components/sales-ai/SummaryCard";

type Props = {
  params: Promise<{ id: string }>;
};

/** S4 — การ์ดสรุปก่อนยืนยัน */
export default async function VisitSummaryPage({ params }: Props) {
  const { id } = await params;
  return <SummaryCard visitId={id} />;
}
