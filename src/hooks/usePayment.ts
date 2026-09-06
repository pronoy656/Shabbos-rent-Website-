import { useMutation, useQuery } from "@tanstack/react-query";
import { createSubscription, getPaymentStatus } from "@/services/payment.service";
import type { PaymentPayload } from "@/types/payment.types";

// ─────────────────────────────────────────────
// Payment Hooks
// ─────────────────────────────────────────────

export const usePaymentStatus = (listingId: string) =>
  useQuery({
    queryKey: ["payment", listingId],
    queryFn: () => getPaymentStatus(listingId),
    enabled: !!listingId,
  });

export const useCreateSubscription = () =>
  useMutation({
    mutationFn: (payload: PaymentPayload) => createSubscription(payload),
  });
