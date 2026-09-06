import { api } from "@/lib/api";
import type { AdminSettings, UpdateSettingsPayload } from "@/types/admin.types";

// ─────────────────────────────────────────────
// Admin Service
// ─────────────────────────────────────────────

/** Get global admin settings */
export const getSettings = (): Promise<AdminSettings> =>
  api.get("/admin/settings").then((res) => res.data);

/** Update admin settings (e.g. First Year Free toggle) */
export const updateSettings = (payload: UpdateSettingsPayload): Promise<AdminSettings> =>
  api.put("/admin/settings", payload).then((res) => res.data);

/** Get all listings for admin review */
export const getAdminListings = () =>
  api.get("/admin/listings").then((res) => res.data);

/** Approve a listing */
export const approveListing = (id: string) =>
  api.post(`/admin/listings/${id}/approve`).then((res) => res.data);

/** Reject a listing */
export const rejectListing = (id: string, reason?: string) =>
  api.post(`/admin/listings/${id}/reject`, { reason }).then((res) => res.data);
