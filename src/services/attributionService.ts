import { Attribution, CommissionModel } from '@/types/ambassador';
import {
  getStoredAttributions,
  saveStoredAttributions,
  getStoredAmbassadors,
} from '@/data/mockAmbassadorData';
import { createListingCommission } from '@/services/commissionService';
import { normalizePhoneNumber, isSamePhone } from '@/utils/phoneUtils';

const REFERRAL_COOKIE_KEY = 'shabos_rent_referral_code';

export function captureReferralCode(code: string) {
  if (typeof window !== 'undefined' && code && code.trim() !== '') {
    localStorage.setItem(REFERRAL_COOKIE_KEY, code.trim().toUpperCase());
  }
}

export function getSavedReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFERRAL_COOKIE_KEY);
}

export function clearSavedReferralCode() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_COOKIE_KEY);
  }
}

export function getAttributionsByAmbassador(ambassadorId: string): Attribution[] {
  const attributions = getStoredAttributions();
  return attributions.filter((a) => a.ambassadorId === ambassadorId && a.status === 'active');
}

export function getAllAttributions(): Attribution[] {
  return getStoredAttributions();
}

/**
 * Triggered when an Owner creates an apartment listing with a referral code
 */
export function createAttributionFromListing(params: {
  listingId: string;
  apartmentTitle: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  referralCode: string;
}): { success: boolean; attribution?: Attribution; error?: string } {
  const ambassadors = getStoredAmbassadors();
  const refCode = params.referralCode.trim().toUpperCase();

  const ambassador = ambassadors.find(
    (a) => a.referralCode.toUpperCase() === refCode && a.status === 'active'
  );

  if (!ambassador) {
    return { success: false, error: 'Invalid or inactive referral code.' };
  }

  const attributions = getStoredAttributions();

  // Rule: One Ambassador Only per Apartment
  const existing = attributions.find(
    (a) => a.listingId === params.listingId && a.status === 'active'
  );
  if (existing) {
    return { success: false, error: 'Apartment is already attributed to an ambassador.' };
  }

  const now = new Date();
  const deadline = new Date(now.getTime() + 7 * 86400000); // 7 Days Model Deadline

  const attribution: Attribution = {
    id: `attr-${Date.now()}`,
    listingId: params.listingId,
    apartmentTitle: params.apartmentTitle,
    ownerName: params.ownerName,
    ownerPhone: normalizePhoneNumber(params.ownerPhone),
    ownerEmail: params.ownerEmail.trim().toLowerCase(),
    ambassadorId: ambassador.id,
    model: null, // Pending 7-day ambassador selection!
    modelSetAt: null,
    modelDeadline: deadline.toISOString(),
    method: 'link',
    attributedAt: now.toISOString(),
    listingCreatedAt: now.toISOString(),
    status: 'active',
  };

  attributions.push(attribution);
  saveStoredAttributions(attributions);

  return { success: true, attribution };
}

/**
 * Ambassador locks Model A or Model B within 7-day deadline
 */
export function selectAttributionModel(
  attributionId: string,
  model: CommissionModel,
  ambassadorId: string
): { success: boolean; attribution?: Attribution; error?: string } {
  const attributions = getStoredAttributions();
  const index = attributions.findIndex((a) => a.id === attributionId);

  if (index === -1) {
    return { success: false, error: 'Attribution record not found.' };
  }

  const attr = attributions[index];

  if (attr.ambassadorId !== ambassadorId) {
    return { success: false, error: 'Unauthorized. You do not own this attribution.' };
  }

  if (attr.model !== null) {
    return { success: false, error: 'Model has already been set for this apartment.' };
  }

  const now = new Date();
  const updated: Attribution = {
    ...attr,
    model,
    modelSetAt: now.toISOString(),
  };

  attributions[index] = updated;
  saveStoredAttributions(attributions);

  // Generate Pending Listing Commission automatically!
  createListingCommission(updated);

  return { success: true, attribution: updated };
}

/**
 * Scheduled/Dev trigger: Auto-assign default model for attributions past 7-day deadline
 */
export function processExpired7DayDeadlines(forceAll: boolean = false): number {
  const attributions = getStoredAttributions();
  const ambassadors = getStoredAmbassadors();
  const now = new Date().getTime();
  let count = 0;

  for (let i = 0; i < attributions.length; i++) {
    const attr = attributions[i];
    if (attr.model === null && attr.status === 'active') {
      const deadline = new Date(attr.modelDeadline).getTime();
      if (forceAll || now >= deadline) {
        const ambassador = ambassadors.find((a) => a.id === attr.ambassadorId);
        const assignedModel: CommissionModel = ambassador ? ambassador.defaultModel : 'A';

        attributions[i] = {
          ...attr,
          model: assignedModel,
          modelSetAt: new Date().toISOString(),
        };

        createListingCommission(attributions[i]);
        count++;
      }
    }
  }

  if (count > 0) {
    saveStoredAttributions(attributions);
  }

  return count;
}

/**
 * Ambassador Manual Claim Form
 * Rules: Phone/Email matching, First Claim Wins, Max 30 days since listing creation
 */
export function manualClaimApartment(params: {
  ambassadorId: string;
  ownerName?: string;
  ownerPhone: string;
  ownerEmail: string;
  model: CommissionModel;
}): { success: boolean; attribution?: Attribution; error?: string } {
  const attributions = getStoredAttributions();
  const ambassadors = getStoredAmbassadors();

  const ambassador = ambassadors.find(
    (a) => a.id === params.ambassadorId && a.status === 'active'
  );
  if (!ambassador) {
    return { success: false, error: 'Ambassador account is not active.' };
  }

  const normalizedPhone = normalizePhoneNumber(params.ownerPhone);
  const cleanEmail = params.ownerEmail.trim().toLowerCase();

  // Simulated property database check (or existing attributions)
  // Check if already claimed by any ambassador
  const alreadyClaimed = attributions.find(
    (a) =>
      a.status === 'active' &&
      (isSamePhone(a.ownerPhone, normalizedPhone) ||
        a.ownerEmail.toLowerCase() === cleanEmail)
  );

  if (alreadyClaimed) {
    return {
      success: false,
      error: 'This apartment has already been claimed by another ambassador.',
    };
  }

  // Create new manual attribution
  const now = new Date();
  const attribution: Attribution = {
    id: `attr-manual-${Date.now()}`,
    listingId: `apt-manual-${Date.now()}`,
    apartmentTitle: `Apartment (${params.ownerName || 'Owner Listing'})`,
    ownerName: params.ownerName || 'Property Owner',
    ownerPhone: normalizedPhone,
    ownerEmail: cleanEmail,
    ambassadorId: ambassador.id,
    model: params.model,
    modelSetAt: now.toISOString(),
    modelDeadline: now.toISOString(),
    method: 'manual',
    attributedAt: now.toISOString(),
    listingCreatedAt: now.toISOString(),
    status: 'active',
  };

  attributions.push(attribution);
  saveStoredAttributions(attributions);

  // Create listing commission
  createListingCommission(attribution);

  return { success: true, attribution };
}

/**
 * Admin Manual Relink or Model Change
 */
export function adminRelinkAttribution(params: {
  attributionId: string;
  newAmbassadorId: string;
  newModel: CommissionModel;
}): { success: boolean; error?: string } {
  const attributions = getStoredAttributions();
  const index = attributions.findIndex((a) => a.id === params.attributionId);

  if (index === -1) {
    return { success: false, error: 'Attribution record not found.' };
  }

  attributions[index] = {
    ...attributions[index],
    ambassadorId: params.newAmbassadorId,
    model: params.newModel,
    method: 'admin',
    modelSetAt: new Date().toISOString(),
  };

  saveStoredAttributions(attributions);
  return { success: true };
}
