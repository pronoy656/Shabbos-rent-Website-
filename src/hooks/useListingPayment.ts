"use client";

import { useState, useCallback } from "react";
import { createListingIntent, verifyNedarimPayment } from "@/lib/payment/listingFlowApi";
import { buildNedarimIframeUrl, getPaymentRecordId } from "@/lib/payment/helpers";
import type { ListingPaymentIntent, VerifyResult } from "@/lib/payment/types";

interface UseListingPaymentOptions {
  onSuccess?: (result: VerifyResult) => void;
  onError?: (error: string) => void;
}

export function useListingPayment(options?: UseListingPaymentOptions) {
  const [intent, setIntent] = useState<ListingPaymentIntent | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIntent = useCallback(async (apartmentId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await createListingIntent(apartmentId);
      setIntent(data);
      const url = buildNedarimIframeUrl(data);
      setIframeUrl(url);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to initiate payment intent";
      setError(msg);
      options?.onError?.(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const verifyPayment = useCallback(
    async (transactionId: string): Promise<VerifyResult | null> => {
      if (!intent || isVerifying || paid) return null;
      setIsVerifying(true);
      setError(null);
      try {
        const result = await verifyNedarimPayment({
          transactionId,
          paymentType: "APARTMENT_LISTING",
          paymentRecordId: getPaymentRecordId(intent),
          apartmentId: intent.apartmentId,
        });
        setPaid(true);
        options?.onSuccess?.(result);
        return result;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Payment verification failed";
        setError(msg);
        options?.onError?.(msg);
        return null;
      } finally {
        setIsVerifying(false);
      }
    },
    [intent, isVerifying, paid, options]
  );

  const reset = useCallback(() => {
    setIntent(null);
    setIframeUrl(null);
    setIsLoading(false);
    setIsVerifying(false);
    setPaid(false);
    setError(null);
  }, []);

  return {
    intent,
    iframeUrl,
    isLoading,
    isVerifying,
    paid,
    error,
    createIntent,
    verifyPayment,
    reset,
  };
}
