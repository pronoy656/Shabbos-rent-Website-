// ─────────────────────────────────────────────
// Calendar / Availability Types
// ─────────────────────────────────────────────

export interface Availability {
  id: string;
  listingId: string;
  weekendId: string;      // Unique ID for the Shabbat weekend
  shabbatStart: string;   // ISO date string (Friday sunset)
  shabbatEnd: string;     // ISO date string (Saturday night)
  status: "available" | "unavailable" | "special";
}

export interface UpdateAvailabilityPayload {
  weekends: {
    weekendId: string;
    status: "available" | "unavailable" | "special";
  }[];
}
