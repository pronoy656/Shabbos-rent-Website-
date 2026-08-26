import {
  OwnerReminderConfig,
  ReminderTriggerResult,
  DayOfWeek,
  ReminderDeliveryMethod,
} from '@/types/ownerReminder';
import { normalizePhoneNumber, formatPhoneNumber } from '@/utils/phoneUtils';

const STORAGE_KEY_REMINDER = 'shabos_rent_owner_reminder_v1';

export const DEFAULT_REMINDER_CONFIG: OwnerReminderConfig = {
  id: 'rem-owner-default',
  ownerId: 'current-owner-001',
  enabled: true,
  dayOfWeek: 'Thursday',
  time: '18:00',
  deliveryMethod: 'phone',
  phone: '972501234567',
  email: 'owner@shabbosrent.com',
  lastTriggeredAt: null,
  updatedAt: new Date().toISOString(),
};

/**
 * Gets the current owner's availability reminder configuration from storage.
 */
export function getOwnerReminder(ownerId: string = 'current-owner-001'): OwnerReminderConfig {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_CONFIG;
  const stored = localStorage.getItem(`${STORAGE_KEY_REMINDER}_${ownerId}`);
  if (!stored) {
    return DEFAULT_REMINDER_CONFIG;
  }
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      phone: normalizePhoneNumber(parsed.phone || DEFAULT_REMINDER_CONFIG.phone),
    };
  } catch {
    return DEFAULT_REMINDER_CONFIG;
  }
}

/**
 * Saves or updates the owner's availability reminder configuration.
 */
export function saveOwnerReminder(
  config: Partial<OwnerReminderConfig>,
  ownerId: string = 'current-owner-001'
): OwnerReminderConfig {
  const current = getOwnerReminder(ownerId);
  const updated: OwnerReminderConfig = {
    ...current,
    ...config,
    phone: normalizePhoneNumber(config.phone || current.phone),
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_REMINDER}_${ownerId}`, JSON.stringify(updated));
  }

  return updated;
}

/**
 * Triggers a test reminder call or email instantly for the owner to preview.
 */
export function triggerTestReminder(
  config: OwnerReminderConfig
): ReminderTriggerResult {
  const normalizedPhone = normalizePhoneNumber(config.phone);
  const formattedPhone = formatPhoneNumber(normalizedPhone);
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let message = '';
  if (config.deliveryMethod === 'phone') {
    message = `Simulated Automated Call triggered to ${formattedPhone}. Call script: "Shalom! Please update your apartment availability for this Shabbat."`;
  } else if (config.deliveryMethod === 'email') {
    message = `Simulated Reminder Email sent to ${config.email}. Subject: "Shabbat Availability Check - Shabos Rent"`;
  } else {
    message = `Simulated Call sent to ${formattedPhone} and Email sent to ${config.email}.`;
  }

  // Record last triggered timestamp
  saveOwnerReminder({
    ...config,
    lastTriggeredAt: new Date().toISOString(),
  }, config.ownerId);

  return {
    success: true,
    message,
    deliveryMethod: config.deliveryMethod,
    recipientPhone: formattedPhone,
    recipientEmail: config.email,
    timestamp,
  };
}
