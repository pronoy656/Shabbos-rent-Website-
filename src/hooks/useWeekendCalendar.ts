import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWeekendCalendars,
  createWeekendCalendar,
  updateWeekendCalendar,
  deleteWeekendCalendar,
} from "@/services/weekendCalendar.service";
import type {
  CreateWeekendCalendarPayload,
  UpdateWeekendCalendarPayload,
} from "@/types/weekendCalendar.types";

// ─────────────────────────────────────────────
// Weekend Calendar Hooks
// ─────────────────────────────────────────────

export const WEEKEND_CALENDAR_QUERY_KEY = ["weekend-calendar"] as const;

/** Hook to fetch list of weekend calendars */
export const useWeekendCalendars = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: [...WEEKEND_CALENDAR_QUERY_KEY, params],
    queryFn: () => getWeekendCalendars(params),
  });

/** Hook to create a weekend calendar date (Admin) */
export const useCreateWeekendCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWeekendCalendarPayload) =>
      createWeekendCalendar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEEKEND_CALENDAR_QUERY_KEY });
    },
  });
};

/** Hook to update a weekend calendar date (Admin) */
export const useUpdateWeekendCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weekendId,
      payload,
    }: {
      weekendId: string;
      payload: UpdateWeekendCalendarPayload;
    }) => updateWeekendCalendar(weekendId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEEKEND_CALENDAR_QUERY_KEY });
    },
  });
};

/** Hook to delete a weekend calendar date (Admin) */
export const useDeleteWeekendCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekendId: string) => deleteWeekendCalendar(weekendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEEKEND_CALENDAR_QUERY_KEY });
    },
  });
};
