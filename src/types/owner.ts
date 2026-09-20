// ─────────────────────────────────────────────
// Owner & Notification Preference Types
// Based on api-integration/integrationguide.txt specifications
// ─────────────────────────────────────────────

export type NotificationChannel = "EMAIL" | "PHONE" | "BOTH";

export type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface OwnerNotificationPref {
  id?: string;
  userId: string;
  channel: NotificationChannel;
  notificationEmail: string | null;
  notificationPhone: string | null;
  preferredDay: DayOfWeek | null;
  preferredTime: string | null; // "HH:mm"
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateNotificationPrefPayload {
  channel?: NotificationChannel;
  notificationEmail?: string | null;
  notificationPhone?: string | null;
  preferredDay?: DayOfWeek | null;
  preferredTime?: string | null;
}

export interface OwnerNotificationPrefResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OwnerNotificationPref;
}

// ─────────────────────────────────────────────
// Admin-Facing Owner Types
// ─────────────────────────────────────────────

export interface SendReminderPayload {
  emailSubject?: string;
  emailBody?: string;
  channel?: NotificationChannel; // override owner's saved channel
}

export interface SendPaymentReminderPayload extends SendReminderPayload {
  amount?: number; // override auto-calculated due amount
}

export interface SendReminderResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: {
    success: boolean;
    message: string;
    channelUsed: NotificationChannel;
    notificationPreference: NotificationChannel;
    emailSent: boolean;
    callInitiated: boolean;
    callSid: string | null;
    notices?: string[] | null;
    dueAmount?: number;
  };
}

export interface OwnerListItem {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  profileImage?: string | null;
  status: string;
  isVerified?: boolean;
  notificationPreference?: NotificationChannel;
  ownerNotificationPreference?: OwnerNotificationPref | null;
  financials?: {
    totalEarnings?: number;
    totalDue?: number;
    hasOverduePayment?: boolean;
    reportRented?: {
      unpaidCount: number;
      unpaidAmount: number;
    };
  };
  apartment?: Record<string, unknown> | null;
}

export interface OwnerPaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedOwnersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: OwnerPaginationMeta;
  data: OwnerListItem[];
}

export interface SingleOwnerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OwnerListItem;
}
