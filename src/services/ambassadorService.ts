import { Ambassador, CommissionModel } from '@/types/ambassador';
import {
  getStoredAmbassadors,
  saveStoredAmbassadors,
  DEFAULT_RATES,
} from '@/data/mockAmbassadorData';

export function getAllAmbassadors(): Ambassador[] {
  return getStoredAmbassadors();
}

export function getAmbassadorById(id: string): Ambassador | null {
  const ambassadors = getStoredAmbassadors();
  return ambassadors.find((a) => a.id === id) || null;
}

export function getPendingAmbassadors(): Ambassador[] {
  return getStoredAmbassadors().filter((a) => a.status === 'pending');
}

export function generateUniqueReferralCode(name: string): string {
  const ambassadors = getStoredAmbassadors();
  const cleanName = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
  const prefix = cleanName.length >= 3 ? cleanName.slice(0, 4) : 'AMB';
  const randomNum = Math.floor(10 + Math.random() * 90);
  let code = `${prefix}${randomNum}`;

  // Ensure unique
  let count = 1;
  while (ambassadors.some((a) => a.referralCode === code)) {
    code = `${prefix}${randomNum + count}`;
    count++;
  }
  return code;
}

export function approveAmbassadorApplication(
  ambassadorId: string
): { success: boolean; ambassador?: Ambassador; error?: string } {
  const ambassadors = getStoredAmbassadors();
  const index = ambassadors.findIndex((a) => a.id === ambassadorId);

  if (index === -1) {
    return { success: false, error: 'Ambassador application not found.' };
  }

  const amb = ambassadors[index];
  const referralCode = amb.referralCode || generateUniqueReferralCode(amb.name);
  const now = new Date();
  const rateLockEnd = new Date(now.getTime() + 365 * 86400000); // 12 Months Locked

  const updated: Ambassador = {
    ...amb,
    status: 'active',
    referralCode,
    approvedAt: now.toISOString(),
    contractSignedAt: now.toISOString(),
    rateLockedUntil: rateLockEnd.toISOString(),
    rates: amb.rates || DEFAULT_RATES,
  };

  ambassadors[index] = updated;
  saveStoredAmbassadors(ambassadors);

  return { success: true, ambassador: updated };
}

export function rejectAmbassadorApplication(
  ambassadorId: string
): { success: boolean; error?: string } {
  const ambassadors = getStoredAmbassadors();
  const index = ambassadors.findIndex((a) => a.id === ambassadorId);

  if (index === -1) {
    return { success: false, error: 'Ambassador application not found.' };
  }

  ambassadors[index].status = 'inactive';
  saveStoredAmbassadors(ambassadors);

  return { success: true };
}

export function updateAmbassadorDefaultModel(
  ambassadorId: string,
  newDefaultModel: CommissionModel
): { success: boolean; error?: string } {
  const ambassadors = getStoredAmbassadors();
  const index = ambassadors.findIndex((a) => a.id === ambassadorId);

  if (index === -1) {
    return { success: false, error: 'Ambassador not found.' };
  }

  ambassadors[index].defaultModel = newDefaultModel;
  saveStoredAmbassadors(ambassadors);

  return { success: true };
}

export function getRecruitedSubAmbassadors(ambassadorId: string): Ambassador[] {
  const ambassadors = getStoredAmbassadors();
  return ambassadors.filter((a) => a.recruitedBy === ambassadorId);
}
