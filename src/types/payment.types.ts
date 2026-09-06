// ─────────────────────────────────────────────
// Payment Types
// ─────────────────────────────────────────────

export interface PaymentPayload {
  listingId: string;
  isFirstYearFree?: boolean;
}

export interface PaymentStatus {
  listingId: string;
  subscriptionActive: boolean;
  expiresAt?: string;
  plan: "free" | "yearly";
}
