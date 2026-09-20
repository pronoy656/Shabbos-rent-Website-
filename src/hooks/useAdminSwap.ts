import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSwaps, adminUpdateSwapStatus } from "@/services/adminSwap.service";
import type { AdminAllSwapsParams, SwapStatus } from "@/types/swap.types";

export const ADMIN_ALL_SWAPS_KEY = ["admin", "swaps"] as const;

/** Get All Swap Requests (Admin) */
export const useAdminSwaps = (params?: AdminAllSwapsParams) =>
  useQuery({
    queryKey: [...ADMIN_ALL_SWAPS_KEY, params],
    queryFn: () => getAllSwaps(params),
  });

/** Update Any Swap Request Status (Admin) */
export const useAdminUpdateSwapStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SwapStatus }) =>
      adminUpdateSwapStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ALL_SWAPS_KEY });
    },
  });
};
