import { api } from "@/lib/api";
import type { AdminAllSwapsParams, SwapRequestItem, SwapStatus } from "@/types/swap.types";

/** Get All Swap Requests (Admin) */
export const getAllSwaps = (params?: AdminAllSwapsParams): Promise<{ data: SwapRequestItem[]; meta: any }> =>
  api.get("/swap/admin/all", { params }).then((res) => res.data);

/** Update Any Swap Request Status (Admin) */
export const adminUpdateSwapStatus = (id: string, status: SwapStatus): Promise<{ data: SwapRequestItem }> =>
  api.patch(`/swap/admin/status/${id}`, { status }).then((res) => res.data);
