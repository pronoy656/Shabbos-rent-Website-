import { api } from "@/lib/api";
import type {
  WeekendCalendar,
  CreateWeekendCalendarPayload,
  UpdateWeekendCalendarPayload,
  WeekendCalendarListResponse,
  WeekendCalendarResponse,
} from "@/types/weekendCalendar.types";

// ─────────────────────────────────────────────
// Weekend Calendar Service
// Based on api-integration/weekend-calender.txt
// ─────────────────────────────────────────────

/** Get all weekend calendars (Public, Owner, Admin) */
export const getWeekendCalendars = async (params?: {
  page?: number;
  limit?: number;
}): Promise<WeekendCalendarListResponse> => {
  const res = await api.get<WeekendCalendarListResponse>("/weekend-calendar", {
    params,
  });
  return res.data;
};

/** Create a new weekend calendar date (Admin only) */
export const createWeekendCalendar = async (
  payload: CreateWeekendCalendarPayload
): Promise<WeekendCalendarResponse> => {
  const res = await api.post<WeekendCalendarResponse>("/weekend-calendar", payload);
  return res.data;
};

/** Update an existing weekend calendar date (Admin only) */
export const updateWeekendCalendar = async (
  weekendId: string,
  payload: UpdateWeekendCalendarPayload
): Promise<WeekendCalendarResponse> => {
  const res = await api.patch<WeekendCalendarResponse>(
    `/weekend-calendar/${weekendId}`,
    payload
  );
  return res.data;
};

/** Delete a weekend calendar date (Admin only) */
export const deleteWeekendCalendar = async (
  weekendId: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/weekend-calendar/${weekendId}`
  );
  return res.data;
};
