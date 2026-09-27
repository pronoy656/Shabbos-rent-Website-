"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListingFeeStatus, toggleAdminYearlyFeeSale } from "@/lib/payment/listingFlowApi";

export const LISTING_FEE_STATUS_KEY = ["listing-fee-status"] as const;

export function useListingFeeStatus() {
  return useQuery({
    queryKey: LISTING_FEE_STATUS_KEY,
    queryFn: getListingFeeStatus,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useToggleYearlyFeeSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isOnSale: boolean) => toggleAdminYearlyFeeSale(isOnSale),
    onSuccess: (data) => {
      queryClient.setQueryData(LISTING_FEE_STATUS_KEY, (old: any) => ({
        ...old,
        isOnSale: data.isOnSale,
        effectiveFee: data.isOnSale ? 0 : 28,
      }));
      queryClient.invalidateQueries({ queryKey: LISTING_FEE_STATUS_KEY });
    },
  });
}
