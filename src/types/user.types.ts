// ─────────────────────────────────────────────
// Admin - Get All Users API Types
// Based on alluser.md integration guide
// ─────────────────────────────────────────────

export type UserRole = "USER" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";

export interface UserApartmentSummary {
  id: string;
  title: string;
  city: string;
}

export interface UserMarketingPlatformSummary {
  id: string;
  title: string;
  platform: string;
}

export interface UserNotificationPreferenceSummary {
  id?: string;
  userId?: string;
  channel?: "EMAIL" | "PHONE" | "BOTH" | string;
  notificationEmail?: string | null;
  notificationPhone?: string | null;
  preferredDay?: string | null;
  preferredTime?: string | null;
  isPaused?: boolean;
  allowReminder?: boolean;
  specificReminderDate?: string | null;
  lastReminderSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserListItem {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  role: UserRole | string;
  status: UserStatus | string;
  isVerified: boolean;
  ownerNotificationPreference?: UserNotificationPreferenceSummary | null;
  marketingPlatform?: UserMarketingPlatformSummary | null;
  apartments?: UserApartmentSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersQueryParams {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminUsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface AdminUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: AdminUsersMeta;
  data: AdminUserListItem[];
}
