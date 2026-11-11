import { VisitChat } from "@/components/sales-ai/VisitChat";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ company?: string }>;
};

/** S3 — แชทระหว่างเยี่ยม */
export default async function VisitChatPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { company } = await searchParams;
  return (
    <VisitChat
      visitId={id}
      companyName={company || "ยังไม่ระบุบริษัท"}
    />
  );
}
