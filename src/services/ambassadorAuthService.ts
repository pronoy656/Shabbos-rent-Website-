import { Ambassador, AmbassadorAuthSession } from '@/types/ambassador';
import {
  getStoredAmbassadors,
  saveStoredAmbassadors,
  DEFAULT_RATES,
} from '@/data/mockAmbassadorData';

const SESSION_KEY = 'shabos_rent_ambassador_session';

export function getActiveAmbassadorSession(): AmbassadorAuthSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function registerAmbassador(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  recruitmentCode?: string;
}): { success: boolean; ambassador?: Ambassador; error?: string } {
  const ambassadors = getStoredAmbassadors();

  // Check email or phone duplicate
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.replace(/\D/g, '');

  const existing = ambassadors.find(
    (a) => a.email.toLowerCase() === cleanEmail || a.phone.replace(/\D/g, '') === cleanPhone
  );

  if (existing) {
    return {
      success: false,
      error: 'An ambassador with this email or phone number already exists.',
    };
  }

  // Find recruiter if code provided
  let recruiterId: string | null = null;
  if (data.recruitmentCode && data.recruitmentCode.trim() !== '') {
    const recruiter = ambassadors.find(
      (a) => a.referralCode.toUpperCase() === data.recruitmentCode?.trim().toUpperCase()
    );
    if (recruiter) {
      recruiterId = recruiter.id;
    }
  }

  const newAmbassador: Ambassador = {
    id: `amb-${Date.now()}`,
    name: data.name.trim(),
    email: cleanEmail,
    phone: data.phone.trim(),
    password: data.password || 'password123',
    referralCode: '', // Not assigned until Admin approves!
    defaultModel: 'A',
    recruitedBy: recruiterId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    rates: DEFAULT_RATES,
  };

  ambassadors.push(newAmbassador);
  saveStoredAmbassadors(ambassadors);

  return { success: true, ambassador: newAmbassador };
}

export function loginAmbassador(
  emailOrPhone: string,
  password?: string
): { success: boolean; session?: AmbassadorAuthSession; status?: string; error?: string } {
  const ambassadors = getStoredAmbassadors();
  const query = emailOrPhone.trim().toLowerCase();
  const cleanPhone = emailOrPhone.replace(/\D/g, '');

  const found = ambassadors.find(
    (a) =>
      a.email.toLowerCase() === query ||
      (cleanPhone !== '' && a.phone.replace(/\D/g, '') === cleanPhone)
  );

  if (!found) {
    return { success: false, error: 'No ambassador account found with these credentials.' };
  }

  // Check status
  if (found.status === 'pending') {
    return {
      success: false,
      status: 'pending',
      error: 'Your application is currently under review by Admin. Please check back soon!',
    };
  }

  if (found.status === 'suspended' || found.status === 'inactive') {
    return {
      success: false,
      status: found.status,
      error: `Your ambassador account is currently ${found.status}. Please contact support.`,
    };
  }

  // Active user! Create session
  const session: AmbassadorAuthSession = {
    ambassadorId: found.id,
    name: found.name,
    email: found.email,
    referralCode: found.referralCode,
    status: found.status,
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, session };
}

export function setMockActiveAmbassadorSession(ambassadorId: string): AmbassadorAuthSession | null {
  const ambassadors = getStoredAmbassadors();
  const found = ambassadors.find((a) => a.id === ambassadorId);
  if (!found) return null;

  const session: AmbassadorAuthSession = {
    ambassadorId: found.id,
    name: found.name,
    email: found.email,
    referralCode: found.referralCode,
    status: found.status,
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function logoutAmbassador() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
