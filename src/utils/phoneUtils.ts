export interface CountryCodeOption {
  code: '972' | '1';
  label: string;
  flag: string;
  prefix: string;
  samplePlaceholder: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  {
    code: '972',
    label: 'Israel',
    flag: '🇮🇱',
    prefix: '+972',
    samplePlaceholder: '055 123 4567',
  },
  {
    code: '1',
    label: 'USA/Canada',
    flag: '🇺🇸',
    prefix: '+1',
    samplePlaceholder: '(555) 123-4567',
  },
];

/**
 * Intelligently normalizes a phone number.
 * 
 * Rules:
 * - Israel (972): If user enters local zero (e.g. 0551234567), remove leading 0 to get 972551234567 (never 9720551234567).
 * - USA/Canada (1): Ensures 1 prefix for 10-digit inputs (e.g. 5551234567 -> 15551234567).
 * - Consistency: Canonical format is digits-only with country code prefix (e.g., "972551234567" or "15551234567").
 */
export function normalizePhoneNumber(
  input: string | null | undefined,
  defaultCountryCode: '972' | '1' = '972'
): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Extract all digits
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  // Check if input explicitly starts with +972 or 972
  if (trimmed.startsWith('+972') || digits.startsWith('972')) {
    let nationalPart = digits.slice(3);
    // Remove local leading 0 if present (e.g. 9720551234567 -> 972551234567)
    if (nationalPart.startsWith('0')) {
      nationalPart = nationalPart.slice(1);
    }
    return `972${nationalPart}`;
  }

  // Check if input explicitly starts with +1 or 1 (and length is 11 digits)
  if ((trimmed.startsWith('+1') || digits.startsWith('1')) && digits.length === 11) {
    return digits;
  }

  // Handle based on default/selected country code
  if (defaultCountryCode === '972') {
    let nationalPart = digits;
    if (nationalPart.startsWith('0')) {
      nationalPart = nationalPart.slice(1);
    }
    return `972${nationalPart}`;
  }

  if (defaultCountryCode === '1') {
    let nationalPart = digits;
    if (nationalPart.startsWith('1') && nationalPart.length === 11) {
      return nationalPart;
    }
    if (nationalPart.startsWith('0')) {
      nationalPart = nationalPart.slice(1);
    }
    return `1${nationalPart}`;
  }

  return digits;
}

/**
 * Formats a normalized or raw phone number for clean UI display.
 * E.g., 972551234567 -> +972 55-123-4567
 * E.g., 15551234567 -> +1 (555) 123-4567
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone || '';

  if (normalized.startsWith('972')) {
    const national = normalized.slice(3);
    if (national.length === 9) {
      // Mobile format: 55-123-4567 or 50-123-4567
      return `+972 ${national.slice(0, 2)}-${national.slice(2, 5)}-${national.slice(5)}`;
    }
    if (national.length === 8) {
      // Landline format: 2-123-4567
      return `+972 ${national.slice(0, 1)}-${national.slice(1, 4)}-${national.slice(4)}`;
    }
    return `+972 ${national}`;
  }

  if (normalized.startsWith('1') && normalized.length === 11) {
    const national = normalized.slice(1);
    return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
  }

  return `+${normalized}`;
}

/**
 * Returns a standardized WhatsApp URL (https://wa.me/972551234567)
 */
export function getWhatsAppLink(phone: string | null | undefined, text?: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '#';
  const baseUrl = `https://wa.me/${normalized}`;
  return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}

/**
 * Returns a standardized phone dialer URL (tel:+972551234567)
 */
export function getTelLink(phone: string | null | undefined): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '#';
  return `tel:+${normalized}`;
}

/**
 * Checks if two phone number representations belong to the same number.
 */
export function isSamePhone(
  phoneA: string | null | undefined,
  phoneB: string | null | undefined
): boolean {
  const normA = normalizePhoneNumber(phoneA);
  const normB = normalizePhoneNumber(phoneB);
  if (!normA || !normB) return false;
  return normA === normB;
}

/**
 * Parses a phone number into its country code and local national component.
 */
export function parsePhoneNumber(phone: string | null | undefined): {
  countryCode: '972' | '1';
  nationalNumber: string;
} {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) {
    return { countryCode: '972', nationalNumber: '' };
  }

  if (normalized.startsWith('1') && normalized.length === 11) {
    return {
      countryCode: '1',
      nationalNumber: normalized.slice(1),
    };
  }

  if (normalized.startsWith('972')) {
    const national = normalized.slice(3);
    // Prepend 0 if it's a standard Israeli local number (e.g. 0551234567)
    const localDisplay = national ? `0${national}` : '';
    return {
      countryCode: '972',
      nationalNumber: localDisplay,
    };
  }

  return { countryCode: '972', nationalNumber: phone || '' };
}
