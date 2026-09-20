import { api } from "@/lib/api";
import type {
  OwnerNotificationPref,
  OwnerNotificationPrefResponse,
  UpdateNotificationPrefPayload,
  OwnerListItem,
  PaginatedOwnersResponse,
  SingleOwnerResponse,
  SendReminderPayload,
  SendPaymentReminderPayload,
  SendReminderResponse,
} from "@/types/owner";

const BASE = "/owners";

// ─────────────────────────────────────────────
// Part A — Owner-Facing (role: USER)
// ─────────────────────────────────────────────

/** GET /owners/me/notification-pref */
export const getMyNotificationPref = async (): Promise<OwnerNotificationPref> => {
  const res = await api.get<OwnerNotificationPrefResponse>(`${BASE}/me/notification-pref`);
  return res.data.data;
};

/** POST /owners/me/test-reminder */
export const testReminderNow = async (): Promise<any> => {
  const res = await api.post(`${BASE}/me/test-reminder`);
  return res.data.data;
};

/** PATCH /owners/me/notification-pref */
export const updateMyNotificationPref = async (
  payload: UpdateNotificationPrefPayload
): Promise<OwnerNotificationPref> => {
  const res = await api.patch<OwnerNotificationPrefResponse>(`${BASE}/me/notification-pref`, payload);
  return res.data.data;
};

// ─────────────────────────────────────────────
// Part B — Admin-Facing (role: SUPER_ADMIN)
// ─────────────────────────────────────────────

export interface OwnerFilters {
  searchTerm?: string;
  hasDue?: "true" | "false";
  status?: string;
  channel?: string;
  notificationPreference?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** GET /owners — List all owners */
export const getAllOwners = async (filters?: OwnerFilters): Promise<PaginatedOwnersResponse> => {
  const res = await api.get<PaginatedOwnersResponse>(BASE, { params: filters });
  return res.data;
};

/** GET /owners/:id — Single owner detail */
export const getOwnerById = async (id: string): Promise<OwnerListItem> => {
  const res = await api.get<SingleOwnerResponse>(`${BASE}/${id}`);
  return res.data.data;
};

/** POST /owners/:id/availability-reminder — Send availability reminder */
export const sendAvailabilityReminder = async (
  ownerId: string,
  payload: SendReminderPayload = {}
): Promise<SendReminderResponse> => {
  const res = await api.post<SendReminderResponse>(`${BASE}/${ownerId}/availability-reminder`, payload);
  return res.data;
};

/** POST /owners/:id/payment-due-reminder — Send payment due reminder */
export const sendPaymentDueReminder = async (
  ownerId: string,
  payload: SendPaymentReminderPayload = {}
): Promise<SendReminderResponse> => {
  const res = await api.post<SendReminderResponse>(`${BASE}/${ownerId}/payment-due-reminder`, payload);
  return res.data;
};
