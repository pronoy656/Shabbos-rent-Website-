import { useMutation, useQuery } from "@tanstack/react-query";
import { getAvailability, updateAvailability, markSpecialShabbat, unmarkSpecialShabbat } from "@/services/calendar.service";
import { queryClient } from "@/lib/queryClient";
import type { UpdateAvailabilityPayload } from "@/types/calendar.types";

// ─────────────────────────────────────────────
// Calendar Hooks
// ─────────────────────────────────────────────

export const useAvailability = (listingId: string) =>
  useQuery({
    queryKey: ["availability", listingId],
    queryFn: () => getAvailability(listingId),
    enabled: !!listingId,
  });

export const useUpdateAvailability = (listingId: string) =>
  useMutation({
    mutationFn: (payload: UpdateAvailabilityPayload) =>
      updateAvailability(listingId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", listingId] }),
  });

export const useMarkSpecialShabbat = (listingId: string) =>
  useMutation({
    mutationFn: (weekendId: string) => markSpecialShabbat(listingId, weekendId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", listingId] }),
  });

export const useUnmarkSpecialShabbat = (listingId: string) =>
  useMutation({
    mutationFn: (weekendId: string) => unmarkSpecialShabbat(listingId, weekendId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", listingId] }),
  });
