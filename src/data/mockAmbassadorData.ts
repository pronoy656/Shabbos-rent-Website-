import { Ambassador, Attribution, Commission, Payout } from '@/types/ambassador';

const STORAGE_KEY_AMBASSADORS = 'shabos_rent_ambassadors_v1';
const STORAGE_KEY_ATTRIBUTIONS = 'shabos_rent_attributions_v1';
const STORAGE_KEY_COMMISSIONS = 'shabos_rent_commissions_v1';
const STORAGE_KEY_PAYOUTS = 'shabos_rent_payouts_v1';

export const DEFAULT_RATES = {
  modelAListing: 15,
  modelARental: 25,
  modelBListing: 25,
  modelBRental: 40,
  subReferralListing: 5,
};

const INITIAL_AMBASSADORS: Ambassador[] = [
  {
    id: 'amb-moshe-001',
    name: 'Moshe Cohen',
    email: 'moshe@shabosrent.com',
    phone: '0501234567',
    password: 'password123',
    referralCode: 'MOSHE50',
    defaultModel: 'A',
    recruitedBy: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T10:00:00.000Z',
    contractSignedAt: '2026-01-01T10:00:00.000Z',
    rateLockedUntil: '2027-01-01T10:00:00.000Z',
    rates: DEFAULT_RATES,
    payoutDetails: {
      bankName: 'Bank Hapoalim',
      accountNumber: '123456',
      branchNumber: '789',
    },
  },
  {
    id: 'amb-david-002',
    name: 'David Levi',
    email: 'david@shabosrent.com',
    phone: '0529876543',
    password: 'password123',
    referralCode: 'DAVID20',
    defaultModel: 'B',
    recruitedBy: 'amb-moshe-001', // Recruited by Moshe!
    status: 'active',
    createdAt: '2026-02-15T00:00:00.000Z',
    approvedAt: '2026-02-15T12:00:00.000Z',
    contractSignedAt: '2026-02-15T12:00:00.000Z',
    rateLockedUntil: '2027-02-15T12:00:00.000Z',
    rates: DEFAULT_RATES,
  },
  {
    id: 'amb-sara-003',
    name: 'Sara Klein',
    email: 'sara@shabosrent.com',
    phone: '0541112233',
    password: 'password123',
    referralCode: '', // Not generated yet while pending
    defaultModel: 'A',
    recruitedBy: 'amb-moshe-001',
    status: 'pending',
    createdAt: '2026-07-22T08:00:00.000Z',
    rates: DEFAULT_RATES,
  },
];

const INITIAL_ATTRIBUTIONS: Attribution[] = [
  {
    id: 'attr-101',
    listingId: 'apt-jerusalem-01',
    apartmentTitle: 'Luxury Penthouse with Kosher Kitchen',
    ownerName: 'Yaakov Stern',
    ownerPhone: '0505556677',
    ownerEmail: 'stern@example.com',
    ambassadorId: 'amb-moshe-001',
    model: 'A',
    modelSetAt: '2026-07-05T10:00:00.000Z',
    modelDeadline: '2026-07-10T10:00:00.000Z',
    method: 'link',
    attributedAt: '2026-07-03T10:00:00.000Z',
    listingCreatedAt: '2026-07-03T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'attr-102',
    listingId: 'apt-bnei-brak-02',
    apartmentTitle: 'Spacious 4-Room Shabbat Suite',
    ownerName: 'Avraham Goldberg',
    ownerPhone: '0523334455',
    ownerEmail: 'goldberg@example.com',
    ambassadorId: 'amb-moshe-001',
    model: null, // Pending model selection!
    modelSetAt: null,
    modelDeadline: new Date(Date.now() + 5 * 86400000).toISOString(), // 5 days remaining
    method: 'link',
    attributedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    listingCreatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'active',
  },
  {
    id: 'attr-103',
    listingId: 'apt-netanya-03',
    apartmentTitle: 'Seaside Kosher Apartment',
    ownerName: 'Chaim Weizmann',
    ownerPhone: '0547778899',
    ownerEmail: 'weizmann@example.com',
    ambassadorId: 'amb-david-002',
    model: 'B',
    modelSetAt: '2026-06-01T10:00:00.000Z',
    modelDeadline: '2026-06-08T10:00:00.000Z',
    method: 'manual',
    attributedAt: '2026-06-01T10:00:00.000Z',
    listingCreatedAt: '2026-05-20T10:00:00.000Z',
    status: 'active',
  },
];

const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: 'comm-201',
    ambassadorId: 'amb-moshe-001',
    type: 'listing',
    sourceListingId: 'apt-jerusalem-01',
    apartmentTitle: 'Luxury Penthouse with Kosher Kitchen',
    amount: 15,
    status: 'approved',
    earnedAt: '2026-07-03T10:00:00.000Z',
  },
  {
    id: 'comm-202',
    ambassadorId: 'amb-moshe-001',
    type: 'rental',
    sourceListingId: 'apt-jerusalem-01',
    sourceRentalId: 'rent-901',
    apartmentTitle: 'Luxury Penthouse with Kosher Kitchen',
    amount: 25,
    status: 'paid',
    earnedAt: '2026-07-15T14:30:00.000Z',
    payoutId: 'payout-301',
  },
  {
    id: 'comm-203',
    ambassadorId: 'amb-moshe-001',
    type: 'sub-referral',
    sourceListingId: 'apt-netanya-03',
    apartmentTitle: 'Seaside Kosher Apartment',
    amount: 5,
    status: 'approved',
    earnedAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'comm-204',
    ambassadorId: 'amb-david-002',
    type: 'listing',
    sourceListingId: 'apt-netanya-03',
    apartmentTitle: 'Seaside Kosher Apartment',
    amount: 25,
    status: 'approved',
    earnedAt: '2026-06-01T10:00:00.000Z',
  },
];

const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'payout-301',
    ambassadorId: 'amb-moshe-001',
    ambassadorName: 'Moshe Cohen',
    amount: 300,
    status: 'paid',
    requestedAt: '2026-07-10T09:00:00.000Z',
    paidAt: '2026-07-12T11:00:00.000Z',
    referenceCode: 'PAY-109283',
  },
];

// Helper methods to read/write persistent data
export function getStoredAmbassadors(): Ambassador[] {
  if (typeof window === 'undefined') return INITIAL_AMBASSADORS;
  const data = localStorage.getItem(STORAGE_KEY_AMBASSADORS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_AMBASSADORS, JSON.stringify(INITIAL_AMBASSADORS));
    return INITIAL_AMBASSADORS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_AMBASSADORS;
  }
}

export function saveStoredAmbassadors(ambassadors: Ambassador[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_AMBASSADORS, JSON.stringify(ambassadors));
  }
}

export function getStoredAttributions(): Attribution[] {
  if (typeof window === 'undefined') return INITIAL_ATTRIBUTIONS;
  const data = localStorage.getItem(STORAGE_KEY_ATTRIBUTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ATTRIBUTIONS, JSON.stringify(INITIAL_ATTRIBUTIONS));
    return INITIAL_ATTRIBUTIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ATTRIBUTIONS;
  }
}

export function saveStoredAttributions(attributions: Attribution[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ATTRIBUTIONS, JSON.stringify(attributions));
  }
}

export function getStoredCommissions(): Commission[] {
  if (typeof window === 'undefined') return INITIAL_COMMISSIONS;
  const data = localStorage.getItem(STORAGE_KEY_COMMISSIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_COMMISSIONS, JSON.stringify(INITIAL_COMMISSIONS));
    return INITIAL_COMMISSIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMISSIONS;
  }
}

export function saveStoredCommissions(commissions: Commission[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_COMMISSIONS, JSON.stringify(commissions));
  }
}

export function getStoredPayouts(): Payout[] {
  if (typeof window === 'undefined') return INITIAL_PAYOUTS;
  const data = localStorage.getItem(STORAGE_KEY_PAYOUTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(INITIAL_PAYOUTS));
    return INITIAL_PAYOUTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PAYOUTS;
  }
}

export function saveStoredPayouts(payouts: Payout[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(payouts));
  }
}

export function resetAllMockAmbassadorData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_AMBASSADORS, JSON.stringify(INITIAL_AMBASSADORS));
    localStorage.setItem(STORAGE_KEY_ATTRIBUTIONS, JSON.stringify(INITIAL_ATTRIBUTIONS));
    localStorage.setItem(STORAGE_KEY_COMMISSIONS, JSON.stringify(INITIAL_COMMISSIONS));
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(INITIAL_PAYOUTS));
    localStorage.removeItem('shabos_rent_ambassador_session');
    localStorage.removeItem('shabos_rent_referral_code');
  }
}
