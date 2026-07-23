export type CommissionModel = 'A' | 'B';
export type AmbassadorStatus = 'pending' | 'active' | 'suspended' | 'inactive';
export type AttributionMethod = 'link' | 'manual' | 'admin';
export type CommissionType = 'listing' | 'rental' | 'sub-referral' | 'reversal';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'reversed';
export type PayoutStatus = 'requested' | 'processing' | 'paid' | 'rejected';

export interface LockedRates {
  modelAListing: number; // 15
  modelARental: number;  // 25
  modelBListing: number; // 25
  modelBRental: number;  // 40
  subReferralListing: number; // 5
}

export interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone: string; // normalized
  password?: string;
  referralCode: string; // e.g. MOSHE50 (generated on active)
  defaultModel: CommissionModel;
  recruitedBy?: string | null; // ambassadorId of recruiter
  status: AmbassadorStatus;
  createdAt: string;
  approvedAt?: string | null;
  contractSignedAt?: string | null;
  rateLockedUntil?: string | null; // ISO string 12M after approval
  rates: LockedRates;
  payoutDetails?: {
    bankName?: string;
    accountNumber?: string;
    branchNumber?: string;
    paypalEmail?: string;
  };
}

export interface Attribution {
  id: string;
  listingId: string;
  apartmentTitle: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ambassadorId: string;
  model: CommissionModel | null; // null if pending within 7 days
  modelSetAt?: string | null;
  modelDeadline: string; // ISO string 7 days from attribution
  method: AttributionMethod;
  attributedAt: string; // ISO string
  listingCreatedAt: string; // ISO string (for 30-day manual claim window and Model A 12M window)
  status: 'active' | 'relinked' | 'expired';
}

export interface Commission {
  id: string;
  ambassadorId: string;
  type: CommissionType;
  sourceListingId: string;
  apartmentTitle: string;
  sourceRentalId?: string | null;
  amount: number; // positive or negative for reversal
  status: CommissionStatus;
  earnedAt: string; // ISO string
  payoutId?: string | null;
  reversalOf?: string | null; // commissionId if reversal
  reversalReason?: string | null;
}

export interface Payout {
  id: string;
  ambassadorId: string;
  ambassadorName: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: string;
  paidAt?: string | null;
  referenceCode?: string | null;
  rejectionReason?: string | null;
}

export interface AmbassadorAuthSession {
  ambassadorId: string;
  name: string;
  email: string;
  referralCode: string;
  status: AmbassadorStatus;
  loggedInAt: string;
}
