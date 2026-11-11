/** Types aligned with docs/sales-ai-spec.md */

export type Source = { raw_event_id: string; t_start?: number; t_end?: number };

export type Field<T> = {
  value: T | null;
  confidence: number;
  sources: Source[];
};

export type VisitUrgency = "low" | "normal" | "urgent" | "line_down";

export type VisitSummary = {
  company: {
    name: Field<string>;
    address: Field<string>;
    matched_company_id: string | null;
  };
  contacts: {
    name: Field<string>;
    position: Field<string>;
    phone: Field<string>;
    line_id: Field<string>;
    email: Field<string>;
    card_event_id?: string;
  }[];
  purpose: Field<string>;
  discussion: { topic: string; detail: string; sources: Source[] }[];
  items: {
    kind: "part_request" | "machine_issue" | "quote_request" | "competitor" | "other";
    description: string;
    brand: Field<string>;
    model: Field<string>;
    part_number: Field<string>;
    qty: Field<number>;
    urgency: VisitUrgency;
    photo_event_ids: string[];
  }[];
  decision: {
    decision_maker: Field<string>;
    budget: Field<string>;
    timeline: Field<string>;
    competitor_mentioned: Field<string>;
  };
  sentiment: {
    level: "positive" | "neutral" | "concerned" | "unhappy";
    complaints: string[];
  };
  next_steps: {
    title: string;
    due_date: string | null;
    assignee: "sales" | "other";
    sources: Source[];
  }[];
  attachments: {
    event_id: string;
    tag: "card" | "nameplate" | "site" | "document" | "part" | "other";
  }[];
  unresolved: string[];
  distance_km: number | null;
};

export type ChatRole = "sales" | "secretary";

export type ProtoMessage = {
  id: string;
  role: ChatRole;
  content: string;
  kind?: "text" | "audio" | "image";
  status?: "queued" | "sent" | "transcribed" | "error";
  tag?: string;
  /** data URL สำหรับโชว์รูปในแชท */
  imageUrl?: string;
};

export type ProtoCompany = {
  id: string;
  name: string;
  province: string;
  visitCount: number;
  lastVisit?: string;
};

/** admin = ตั้งค่า / manager = ผู้บริหารอ่านรายงาน / sales = เซลล์ภาคสนาม */
export type SalesRole = "admin" | "manager" | "sales";

/** โปรไฟล์เซลล์ / ผู้ใช้ในระบบ Sales AI */
export type SalesProfile = {
  id: string;
  username?: string;
  fullName: string;
  nickname: string;
  position: string;
  phone: string;
  email: string;
  avatarDataUrl: string | null;
  role: SalesRole;
  updatedAt: string;
};

export type StoredVisitReport = {
  id: string;
  companyName: string;
  salesId: string;
  salesName: string;
  summary: VisitSummary;
  status: "pending_review" | "confirmed";
  urgency: VisitUrgency;
  confirmedAt: string | null;
  createdAt: string;
  /** แท็กรูปจาก raw_events — ใช้คะแนนรูปประกอบ */
  photoTags?: string[];
  /** สถิติการคุยกับเลขา — ใช้คะแนนสาระ / ไม่มีแต่น้ำ */
  chatQuality?: {
    salesTurns: number;
    salesChars: number;
    photoCount: number;
    openQuestions: number;
  };
  note?: string;
};

export type StoredTask = {
  id: string;
  title: string;
  dueLabel: string;
  overdue: boolean;
  done: boolean;
};
