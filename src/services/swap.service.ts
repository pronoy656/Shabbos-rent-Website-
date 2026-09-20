import { api } from "@/lib/api";
import type {
  SaveSwapPreferencePayload,
  SwapPreference,
  MatchedSwapsParams,
  MatchedSwapsResponse,
  AllSwapPreferencesParams,
  SwappableListingItem,
  SwapRequestPayload,
  SwapRequestItem,
  MySwapsData,
  MySwapsParams,
  SwapStatus,
} from "@/types/swap.types";

/** Save / Update Swap Preferences & Toggle Swap */
export const saveSwapPreference = (
  payload: SaveSwapPreferencePayload
): Promise<{ data: SwapPreference; message?: string }> =>
  api.post("/swap-preference", payload).then((res) => res.data);

/** Get My Swap Preference */
export const getMySwapPreference = (): Promise<{ data: SwapPreference }> =>
  api.get("/swap-preference/my-preference").then((res) => res.data);

/** Get Matched Swappable Listings (Scored Matching Engine) */
export const getMatchedSwaps = (
  params?: MatchedSwapsParams
): Promise<MatchedSwapsResponse> =>
  api.get("/swap-preference/matched-swaps", { params }).then((res) => res.data);

/** Get All Active Swap Preferences (Direct Search) */
export const getAllSwapPreferences = (
  params?: AllSwapPreferencesParams
): Promise<{ data: SwappableListingItem[]; meta: any }> =>
  api.get("/swap-preference/all", { params }).then((res) => res.data);

/** Send Swap Request */
export const sendSwapRequest = (
  payload: SwapRequestPayload
): Promise<{ data: SwapRequestItem; message?: string }> =>
  api.post("/swap/request", payload).then((res) => res.data);

/** Get My Swaps (Sent & Received) */
export const getMySwaps = (
  params?: MySwapsParams
): Promise<{ data: MySwapsData; message?: string }> =>
  api.get("/swap/my-swaps", { params }).then((res) => res.data);

/** Update Swap Request Status */
export const updateSwapStatus = (
  id: string,
  status: SwapStatus
): Promise<{ data: SwapRequestItem; message?: string }> =>
  api.patch(`/swap/status/${id}`, { status }).then((res) => res.data);
