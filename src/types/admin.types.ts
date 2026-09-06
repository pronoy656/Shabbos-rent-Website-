// ─────────────────────────────────────────────
// Admin Types
// ─────────────────────────────────────────────

export interface AdminSettings {
  isFirstYearFreeActive: boolean;
  maintenanceMode: boolean;
  maxListingsPerOwner: number;
}

export type UpdateSettingsPayload = Partial<AdminSettings>;
