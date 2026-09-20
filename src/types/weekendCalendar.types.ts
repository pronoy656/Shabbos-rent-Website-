// ─────────────────────────────────────────────
// Weekend Calendar Types
// Based on api-integration/weekend-calender.txt
// ─────────────────────────────────────────────

export interface WeekendCalendar {
  id: string;
  title: string;
  date: string; // ISO format e.g. "2026-11-08T00:00:00.000Z" or "2026-11-08"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWeekendCalendarPayload {
  title: string;
  date: string; // e.g. "2026-11-07"
}

export interface UpdateWeekendCalendarPayload {
  title?: string;
  date?: string;
}

export interface WeekendCalendarListResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: WeekendCalendar[];
}

export interface WeekendCalendarResponse {
  success: boolean;
  message: string;
  data: WeekendCalendar;
}
