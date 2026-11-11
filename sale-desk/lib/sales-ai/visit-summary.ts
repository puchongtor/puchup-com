import type { VisitSummary } from "./types";

export function emptyField<T>(value: T | null = null, confidence = 0) {
  return { value, confidence, sources: [] as { raw_event_id: string }[] };
}

export function emptyVisitSummary(companyName: string): VisitSummary {
  return {
    company: {
      name: emptyField(companyName || null, companyName ? 0.9 : 0),
      address: emptyField(null),
      matched_company_id: null,
    },
    contacts: [],
    purpose: emptyField(null),
    discussion: [],
    items: [],
    decision: {
      decision_maker: emptyField(null),
      budget: emptyField(null),
      timeline: emptyField(null),
      competitor_mentioned: emptyField(null),
    },
    sentiment: { level: "neutral", complaints: [] },
    next_steps: [],
    attachments: [],
    unresolved: [],
    distance_km: null,
  };
}
