import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotificationPref,
  updateMyNotificationPref,
  testReminderNow,
} from "@/services/ownerService";
import type { UpdateNotificationPrefPayload } from "@/types/owner";

/** Query key — used for cache invalidation */
export const NOTIFICATION_PREF_KEY = ["owner", "notification-pref"] as const;

/** Fetches current logged-in owner's notification preferences */
export const useMyNotificationPref = () =>
  useQuery({
    queryKey: NOTIFICATION_PREF_KEY,
    queryFn: getMyNotificationPref,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1,
  });

/** Saves / updates notification preferences */
export const useUpdateNotificationPref = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateNotificationPrefPayload) =>
      updateMyNotificationPref(payload),
    onSuccess: () => {
      // Invalidate the GET cache so the UI re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_PREF_KEY });
    },
  });
};

/** Triggers an immediate test reminder */
export const useTestReminderNow = () => {
  return useMutation({
    mutationFn: () => testReminderNow(),
  });
};
