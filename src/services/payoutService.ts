import { Payout } from '@/types/ambassador';
import {
  getStoredPayouts,
  saveStoredPayouts,
  getStoredCommissions,
  saveStoredCommissions,
  getStoredAmbassadors,
} from '@/data/mockAmbassadorData';
import { calculateAmbassadorBalances } from './commissionService';

export const MINIMUM_PAYOUT_THRESHOLD = 50; // ₪50 minimum threshold

export function getPayoutsByAmbassador(ambassadorId: string): Payout[] {
  const payouts = getStoredPayouts();
  return payouts.filter((p) => p.ambassadorId === ambassadorId);
}

export function getAllPayouts(): Payout[] {
  return getStoredPayouts();
}

/**
 * Ambassador requests payout for their approved balance
 */
export function requestPayout(
  ambassadorId: string
): { success: boolean; payout?: Payout; error?: string } {
  const balances = calculateAmbassadorBalances(ambassadorId);

  if (balances.approvedBalance < MINIMUM_PAYOUT_THRESHOLD) {
    return {
      success: false,
      error: `Minimum payout threshold is ₪${MINIMUM_PAYOUT_THRESHOLD}. Your approved balance is ₪${balances.approvedBalance}.`,
    };
  }

  const ambassadors = getStoredAmbassadors();
  const ambassador = ambassadors.find((a) => a.id === ambassadorId);

  const payout: Payout = {
    id: `payout-${Date.now()}`,
    ambassadorId,
    ambassadorName: ambassador ? ambassador.name : 'Ambassador',
    amount: balances.approvedBalance,
    status: 'requested',
    requestedAt: new Date().toISOString(),
  };

  const payouts = getStoredPayouts();
  payouts.push(payout);
  saveStoredPayouts(payouts);

  return { success: true, payout };
}

/**
 * Admin approves payout request
 */
export function approvePayout(
  payoutId: string,
  referenceCode?: string
): { success: boolean; error?: string } {
  const payouts = getStoredPayouts();
  const payoutIndex = payouts.findIndex((p) => p.id === payoutId);

  if (payoutIndex === -1) {
    return { success: false, error: 'Payout request not found.' };
  }

  const payout = payouts[payoutIndex];
  const now = new Date().toISOString();

  payouts[payoutIndex] = {
    ...payout,
    status: 'paid',
    paidAt: now,
    referenceCode: referenceCode || `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  // Mark all approved commissions for this ambassador as paid
  const commissions = getStoredCommissions();
  for (let i = 0; i < commissions.length; i++) {
    if (
      commissions[i].ambassadorId === payout.ambassadorId &&
      commissions[i].status === 'approved'
    ) {
      commissions[i].status = 'paid';
      commissions[i].payoutId = payout.id;
    }
  }

  saveStoredCommissions(commissions);
  saveStoredPayouts(payouts);

  return { success: true };
}

/**
 * Admin rejects payout request
 */
export function rejectPayout(
  payoutId: string,
  reason?: string
): { success: boolean; error?: string } {
  const payouts = getStoredPayouts();
  const payoutIndex = payouts.findIndex((p) => p.id === payoutId);

  if (payoutIndex === -1) {
    return { success: false, error: 'Payout request not found.' };
  }

  payouts[payoutIndex] = {
    ...payouts[payoutIndex],
    status: 'rejected',
    rejectionReason: reason || 'Information mismatch or payout under review.',
  };

  saveStoredPayouts(payouts);
  return { success: true };
}
