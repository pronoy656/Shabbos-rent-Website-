import { api } from "@/lib/api";
import type { PaymentPayload, PaymentStatus } from "@/types/payment.types";

// ─────────────────────────────────────────────
// Payment Service
// ─────────────────────────────────────────────

/** Create a yearly subscription for a listing */
export const createSubscription = (payload: PaymentPayload): Promise<{ checkoutUrl: string }> =>
  api.post("/payments/subscribe", payload).then((res) => res.data);

/** Get payment/subscription status for a listing */
export const getPaymentStatus = (listingId: string): Promise<PaymentStatus> =>
  api.get(`/payments/status/${listingId}`).then((res) => res.data);
