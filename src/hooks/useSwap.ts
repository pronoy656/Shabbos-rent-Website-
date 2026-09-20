import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveSwapPreference,
  getMySwapPreference,
  getMatchedSwaps,
  getAllSwapPreferences,
  sendSwapRequest,
  getMySwaps,
  updateSwapStatus,
} from "@/services/swap.service";
import type {
  SaveSwapPreferencePayload,
  MatchedSwapsParams,
  AllSwapPreferencesParams,
  SwapRequestPayload,
  MySwapsParams,
  SwapStatus,
} from "@/types/swap.types";

export const SWAP_PREFERENCE_KEY = ["swap-preference", "my"] as const;
export const MATCHED_SWAPS_KEY = ["swap-preference", "matched-swaps"] as const;
export const ALL_SWAPS_PREFERENCES_KEY = ["swap-preference", "all"] as const;
export const MY_SWAPS_KEY = ["swap", "my-swaps"] as const;

/** Get My Swap Preference */
export const useSwapPreference = () =>
  useQuery({
    queryKey: SWAP_PREFERENCE_KEY,
    queryFn: getMySwapPreference,
    retry: 1,
  });

/** Save / Update Swap Preference */
export const useSaveSwapPreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveSwapPreferencePayload) => saveSwapPreference(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SWAP_PREFERENCE_KEY });
      queryClient.invalidateQueries({ queryKey: MATCHED_SWAPS_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SWAPS_PREFERENCES_KEY });
    },
  });
};

/** Search & Matched Swappable Listings (Scored Matching Engine) */
export const useMatchedSwaps = (params?: MatchedSwapsParams, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [...MATCHED_SWAPS_KEY, params],
    queryFn: () => getMatchedSwaps(params),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });

/** Get All Swappable Preferences (Direct Search) */
export const useAllSwapPreferences = (params?: AllSwapPreferencesParams) =>
  useQuery({
    queryKey: [...ALL_SWAPS_PREFERENCES_KEY, params],
    queryFn: () => getAllSwapPreferences(params),
  });

/** Send Swap Request */
export const useSendSwapRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SwapRequestPayload) => sendSwapRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SWAPS_KEY });
      queryClient.invalidateQueries({ queryKey: MATCHED_SWAPS_KEY });
    },
  });
};

/** Get My Swaps (Sent & Received) */
export const useMySwaps = (params?: MySwapsParams) =>
  useQuery({
    queryKey: [...MY_SWAPS_KEY, params],
    queryFn: () => getMySwaps(params),
  });

/** Update Swap Request Status (Accept / Reject) */
export const useUpdateSwapStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SwapStatus }) =>
      updateSwapStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SWAPS_KEY });
      queryClient.invalidateQueries({ queryKey: SWAP_PREFERENCE_KEY });
      queryClient.invalidateQueries({ queryKey: MATCHED_SWAPS_KEY });
    },
  });
};
