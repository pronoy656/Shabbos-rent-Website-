import { api } from "@/lib/api";
import type { Availability, UpdateAvailabilityPayload } from "@/types/calendar.types";

// ─────────────────────────────────────────────
// Calendar / Availability Service
// ─────────────────────────────────────────────

/** Get availability for a specific listing */
export const getAvailability = (listingId: string): Promise<Availability[]> =>
  api.get(`/listings/${listingId}/availability`).then((res) => res.data);

/** Update availability dates for a listing */
export const updateAvailability = (
  listingId: string,
  payload: UpdateAvailabilityPayload
): Promise<Availability[]> =>
  api.put(`/listings/${listingId}/availability`, payload).then((res) => res.data);

/** Mark a Shabbat weekend as special */
export const markSpecialShabbat = (
  listingId: string,
  weekendId: string
): Promise<void> =>
  api.post(`/listings/${listingId}/special-shabbat/${weekendId}`).then((res) => res.data);

/** Unmark a special Shabbat weekend */
export const unmarkSpecialShabbat = (
  listingId: string,
  weekendId: string
): Promise<void> =>
  api.delete(`/listings/${listingId}/special-shabbat/${weekendId}`).then((res) => res.data);
