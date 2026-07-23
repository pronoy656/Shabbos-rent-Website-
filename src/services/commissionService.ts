import { Attribution, Commission, CommissionStatus } from '@/types/ambassador';
import {
  getStoredCommissions,
  saveStoredCommissions,
  getStoredAmbassadors,
} from '@/data/mockAmbassadorData';

export function getCommissionsByAmbassador(ambassadorId: string): Commission[] {
  const commissions = getStoredCommissions();
  return commissions.filter((c) => c.ambassadorId === ambassadorId);
}

export function getAllCommissions(): Commission[] {
  return getStoredCommissions();
}

/**
 * Generate Pending Listing Commission when Model A or Model B is assigned
 */
export function createListingCommission(attribution: Attribution): Commission | null {
  if (!attribution.model) return null;

  const ambassadors = getStoredAmbassadors();
  const ambassador = ambassadors.find((a) => a.id === attribution.ambassadorId);
  const rates = ambassador?.rates || { modelAListing: 15, modelBListing: 25 };

  const amount = attribution.model === 'A' ? rates.modelAListing : rates.modelBListing;
  const commissions = getStoredCommissions();

  // Prevent duplicate listing commission for same attribution
  const existing = commissions.find(
    (c) =>
      c.ambassadorId === attribution.ambassadorId &&
      c.sourceListingId === attribution.listingId &&
      c.type === 'listing'
  );

  if (existing) return existing;

  const commission: Commission = {
    id: `comm-list-${Date.now()}`,
    ambassadorId: attribution.ambassadorId,
    type: 'listing',
    sourceListingId: attribution.listingId,
    apartmentTitle: attribution.apartmentTitle,
    amount,
    status: 'pending', // Pending listing fee clearance!
    earnedAt: new Date().toISOString(),
  };

  commissions.push(commission);

  // Check Sub-Referral Bonus for Recruiter! (₪5)
  if (ambassador && ambassador.recruitedBy) {
    const subCommission: Commission = {
      id: `comm-sub-${Date.now()}`,
      ambassadorId: ambassador.recruitedBy,
      type: 'sub-referral',
      sourceListingId: attribution.listingId,
      apartmentTitle: attribution.apartmentTitle,
      amount: ambassador.rates?.subReferralListing || 5,
      status: 'approved',
      earnedAt: new Date().toISOString(),
    };
    commissions.push(subCommission);
  }

  saveStoredCommissions(commissions);
  return commission;
}

/**
 * Developer/Admin trigger: Approve pending listing commission when listing fee ₪28 clears
 */
export function approveListingCommission(sourceListingId?: string): { success: boolean; apartmentTitle?: string } {
  const commissions = getStoredCommissions();
  let updated = false;
  let title = '';

  for (let i = 0; i < commissions.length; i++) {
    if (
      commissions[i].type === 'listing' &&
      commissions[i].status === 'pending' &&
      (!sourceListingId || commissions[i].sourceListingId === sourceListingId)
    ) {
      commissions[i].status = 'approved';
      title = commissions[i].apartmentTitle;
      updated = true;
      if (sourceListingId) break;
    }
  }

  if (updated) {
    saveStoredCommissions(commissions);
  }
  return { success: updated, apartmentTitle: title };
}

/**
 * Triggered on Confirmed Rental Event (₪50 billing)
 * Model A: ₪25 for rentals within 12 months from listing creation
 * Model B: ₪40 on First Rental Ever (1-time)
 */
export function processRentalEvent(attribution: Attribution): {
  success: boolean;
  commission?: Commission;
  message?: string;
} {
  if (!attribution.model) {
    return { success: false, message: 'Attribution model not set.' };
  }

  const commissions = getStoredCommissions();
  const ambassadors = getStoredAmbassadors();
  const ambassador = ambassadors.find((a) => a.id === attribution.ambassadorId);

  const rates = ambassador?.rates || {
    modelARental: 25,
    modelBRental: 40,
  };

  const now = new Date();
  const listingDate = new Date(attribution.listingCreatedAt);

  // --- MODEL A LOGIC ---
  if (attribution.model === 'A') {
    // Check 12-month window (365 days)
    const twelveMonthsMs = 365 * 86400000;
    if (now.getTime() - listingDate.getTime() > twelveMonthsMs) {
      return {
        success: false,
        message: '12-Month Rental Commission Window has expired for Model A.',
      };
    }

    const rentalCommission: Commission = {
      id: `comm-rent-${Date.now()}`,
      ambassadorId: attribution.ambassadorId,
      type: 'rental',
      sourceListingId: attribution.listingId,
      sourceRentalId: `rent-${Date.now()}`,
      apartmentTitle: attribution.apartmentTitle,
      amount: rates.modelARental, // ₪25
      status: 'approved',
      earnedAt: now.toISOString(),
    };

    commissions.push(rentalCommission);
    saveStoredCommissions(commissions);
    return { success: true, commission: rentalCommission, message: 'Model A Rental Commission (+₪25) earned!' };
  }

  // --- MODEL B LOGIC ---
  if (attribution.model === 'B') {
    // Model B: First Rental Ever only!
    const previousRentalComm = commissions.find(
      (c) =>
        c.sourceListingId === attribution.listingId &&
        c.type === 'rental' &&
        c.status !== 'reversed'
    );

    if (previousRentalComm) {
      return {
        success: false,
        message: 'Model B applies only to the First Rental Ever. Subsequent rentals do not earn commission.',
      };
    }

    const rentalCommission: Commission = {
      id: `comm-rent-${Date.now()}`,
      ambassadorId: attribution.ambassadorId,
      type: 'rental',
      sourceListingId: attribution.listingId,
      sourceRentalId: `rent-${Date.now()}`,
      apartmentTitle: attribution.apartmentTitle,
      amount: rates.modelBRental, // ₪40
      status: 'approved',
      earnedAt: now.toISOString(),
    };

    commissions.push(rentalCommission);
    saveStoredCommissions(commissions);
    return { success: true, commission: rentalCommission, message: 'Model B First Rental Commission (+₪40) earned!' };
  }

  return { success: false, message: 'Unknown commission model.' };
}

/**
 * Reversal Logic: Create negative line item (-₪25) to preserve audit trail
 */
export function reverseCommission(
  originalCommissionId: string,
  reason: string
): { success: boolean; reversalCommission?: Commission; error?: string } {
  const commissions = getStoredCommissions();
  const originalIndex = commissions.findIndex((c) => c.id === originalCommissionId);

  if (originalIndex === -1) {
    return { success: false, error: 'Original commission not found.' };
  }

  const original = commissions[originalIndex];

  if (original.status === 'reversed') {
    return { success: false, error: 'Commission has already been reversed.' };
  }

  // Mark original as reversed
  commissions[originalIndex].status = 'reversed';

  // Add negative audit ledger entry
  const reversalCommission: Commission = {
    id: `comm-rev-${Date.now()}`,
    ambassadorId: original.ambassadorId,
    type: 'reversal',
    sourceListingId: original.sourceListingId,
    sourceRentalId: original.sourceRentalId,
    apartmentTitle: original.apartmentTitle,
    amount: -Math.abs(original.amount), // Negative amount!
    status: 'reversed',
    earnedAt: new Date().toISOString(),
    reversalOf: original.id,
    reversalReason: reason || 'Listing fee refunded or rental invalid',
  };

  commissions.push(reversalCommission);
  saveStoredCommissions(commissions);

  return { success: true, reversalCommission };
}

/**
 * Helper to calculate Ambassador financial totals
 */
export function calculateAmbassadorBalances(ambassadorId: string) {
  const commissions = getCommissionsByAmbassador(ambassadorId);

  let pendingBalance = 0;
  let approvedBalance = 0;
  let totalPaid = 0;

  for (const c of commissions) {
    if (c.status === 'pending') {
      pendingBalance += c.amount;
    } else if (c.status === 'approved') {
      approvedBalance += c.amount;
    } else if (c.status === 'paid') {
      totalPaid += c.amount;
    }
  }

  return {
    pendingBalance: Math.max(0, pendingBalance),
    approvedBalance: Math.max(0, approvedBalance),
    totalPaid: Math.max(0, totalPaid),
    totalEarned: Math.max(0, approvedBalance + totalPaid),
  };
}
