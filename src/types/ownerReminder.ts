export type ReminderDeliveryMethod = 'phone' | 'email' | 'both';

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface OwnerReminderConfig {
  id: string;
  ownerId: string;
  enabled: boolean;
  dayOfWeek: DayOfWeek;
  time: string; // e.g. "10:00" or "18:00"
  deliveryMethod: ReminderDeliveryMethod;
  phone: string; // Normalized phone number
  email: string;
  lastTriggeredAt: string | null;
  updatedAt: string;
}

export interface ReminderTriggerResult {
  success: boolean;
  message: string;
  deliveryMethod: ReminderDeliveryMethod;
  recipientPhone?: string;
  recipientEmail?: string;
  timestamp: string;
}
