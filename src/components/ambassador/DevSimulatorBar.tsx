"use client";

import { useState, useEffect } from 'react';
import {
  setMockActiveAmbassadorSession,
  getActiveAmbassadorSession,
} from '@/services/ambassadorAuthService';
import { getStoredAmbassadors, resetAllMockAmbassadorData } from '@/data/mockAmbassadorData';
import {
  createAttributionFromListing,
  processExpired7DayDeadlines,
  getAttributionsByAmbassador,
} from '@/services/attributionService';
import {
  approveListingCommission,
  processRentalEvent,
  getCommissionsByAmbassador,
  reverseCommission,
} from '@/services/commissionService';
import {
  Sparkles,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Building2,
  DollarSign,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function DevSimulatorBar({ onDataChange }: { onDataChange?: () => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string>('amb-moshe-001');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const session = getActiveAmbassadorSession();
    if (session) {
      setCurrentSessionId(session.ambassadorId);
    }
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    if (onDataChange) onDataChange();
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRoleSwitch = (ambassadorId: string) => {
    if (ambassadorId === 'admin') {
      setCurrentSessionId('admin');
      notify('Switched to Admin Panel');
      router.push('/dashboard/ambassadors');
      return;
    }

    const session = setMockActiveAmbassadorSession(ambassadorId);
    if (session) {
      setCurrentSessionId(ambassadorId);

      const ambassadors = getStoredAmbassadors();
      const amb = ambassadors.find((a) => a.id === ambassadorId);

      if (amb && amb.status === 'pending') {
        notify(`Switched to Pending Applicant: ${session.name}`);
        router.push('/ambassador/login');
      } else {
        notify(`Logged in as Ambassador: ${session.name} (${session.referralCode || 'Active'})`);
        if (window.location.pathname === '/ambassador/dashboard') {
          window.location.reload();
        } else {
          router.push('/ambassador/dashboard');
        }
      }
    }
  };

  const handleSimulateNewListing = () => {
    const session = getActiveAmbassadorSession();
    const refCode = session?.referralCode || 'MOSHE50';
    const randomId = Math.floor(100 + Math.random() * 900);
    
    const apartmentNames = ['Cozy Studio', 'Modern Loft', 'Seaview Villa', 'Downtown Penthouse', 'Sunny Apartment', 'Luxury Suite', 'Family Home', 'Urban Studio', 'Grand Villa', 'Boutique Apartment'];
    const randomName = apartmentNames[Math.floor(Math.random() * apartmentNames.length)];

    const res = createAttributionFromListing({
      listingId: `apt-sim-${randomId}`,
      apartmentTitle: `${randomName} #${randomId}`,
      ownerName: `Owner #${randomId}`,
      ownerPhone: `050${randomId}1234`,
      ownerEmail: `owner${randomId}@example.com`,
      referralCode: refCode,
    });

    if (res.success) {
      notify(`⚡ New Apartment Listed via ${refCode}! Model pending within 7 days.`);
    } else {
      notify(`❌ ${res.error}`);
    }
  };

  const handleSimulateListingFeePaid = () => {
    const session = getActiveAmbassadorSession();
    if (!session) return;

    // 1. Try finding any pending listing commission for the active ambassador
    const commissions = getCommissionsByAmbassador(session.ambassadorId);
    const pendingComm = commissions.find(
      (c) => c.type === 'listing' && c.status === 'pending'
    );

    if (pendingComm) {
      const res = approveListingCommission(pendingComm.sourceListingId);
      if (res.success) {
        notify(`⚡ Listing Fee Paid for "${pendingComm.apartmentTitle}"! ₪${pendingComm.amount} Commission Approved.`);
        return;
      }
    }

    // 2. Check if there is an unassigned model listing for this ambassador
    const attributions = getAttributionsByAmbassador(session.ambassadorId);
    const pendingModelAttr = attributions.find((a) => a.model === null);

    if (pendingModelAttr) {
      notify(`⚠️ Please lock Model A or Model B first for "${pendingModelAttr.apartmentTitle}" (or click "Run 7-Day Deadline") before approving fee!`);
      return;
    }

    // 3. Fallback: try approving any pending listing commission across system
    const globalRes = approveListingCommission();
    if (globalRes.success) {
      notify(`⚡ Listing Fee Paid for "${globalRes.apartmentTitle || 'Apartment'}"! Commission Approved.`);
    } else {
      notify('Info: All listing commissions are already approved. (Click "⚡ New Referral Listing" and lock Model A/B to test!)');
    }
  };

  const handleSimulateRentalEvent = () => {
    const session = getActiveAmbassadorSession();
    if (!session) return;
    const attributions = getAttributionsByAmbassador(session.ambassadorId);
    const setAttr = attributions.find((a) => a.model !== null);

    if (!setAttr) {
      notify('⚠️ Cannot simulate rental: No apartment with locked Model A/B found. Please set a model first!');
      return;
    }

    const res = processRentalEvent(setAttr);
    if (res.success) {
      notify(`⚡ Rental Event Confirmed! ${res.message}`);
    } else {
      notify(`⚠️ ${res.message}`);
    }
  };

  const handleSimulateReversal = () => {
    const session = getActiveAmbassadorSession();
    if (!session) return;
    const commissions = getCommissionsByAmbassador(session.ambassadorId);
    const eligible = commissions.find((c) => (c.type === 'rental' || c.type === 'listing') && c.status === 'approved');

    if (!eligible) {
      notify('⚠️ No approved listing/rental commission available to reverse.');
      return;
    }

    const res = reverseCommission(eligible.id, 'Simulated rental invalid / fee refunded');
    if (res.success) {
      notify(`⚡ Reversal Generated (-₪${Math.abs(eligible.amount)}) for audit trail!`);
    } else {
      notify(`❌ ${res.error}`);
    }
  };

  const handleSimulate7DayExpiry = () => {
    const count = processExpired7DayDeadlines(true);
    if (count > 0) {
      notify(`⚡ 7-Day Deadline Runner Executed! ${count} pending listing(s) auto-assigned default model.`);
    } else {
      notify('Info: No unassigned listing (model = null) found to auto-assign.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all mock ambassador data, attributions, commissions, and session?')) {
      resetAllMockAmbassadorData();
      setMockActiveAmbassadorSession('amb-moshe-001');
      setCurrentSessionId('amb-moshe-001');
      notify('🔄 All mock data reset to original clean state!');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-50 max-w-xl font-sans">
      <div className="bg-zinc-900/95 backdrop-blur-md text-white border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all">
        {/* Bar Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-zinc-900 flex items-center justify-between cursor-pointer select-none border-b border-zinc-800"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Developer Simulator & Test Controls
            </span>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Bar Content */}
        {isOpen && (
          <div className="p-4 space-y-4 text-xs">
            {/* Context Role Switcher */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Switch Test Context / Active User:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  onClick={() => handleRoleSwitch('amb-moshe-001')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all border text-left flex items-center gap-1.5 ${
                    currentSessionId === 'amb-moshe-001'
                      ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="truncate">Moshe (Active)</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('amb-david-002')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all border text-left flex items-center gap-1.5 ${
                    currentSessionId === 'amb-david-002'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="truncate">David (Sub)</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('amb-sara-003')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all border text-left flex items-center gap-1.5 ${
                    currentSessionId === 'amb-sara-003'
                      ? 'bg-amber-600 border-amber-400 text-white shadow-sm'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="truncate">Sara (Pending)</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all border text-left flex items-center gap-1.5 ${
                    currentSessionId === 'admin'
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">Admin Panel</span>
                </button>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Simulate Business Logic Events:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleSimulateNewListing}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-indigo-600 hover:border-indigo-500 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  New Referral Listing
                </button>
                <button
                  onClick={handleSimulateListingFeePaid}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-emerald-600 hover:border-emerald-500 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Approve Listing Fee
                </button>
                <button
                  onClick={handleSimulateRentalEvent}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-emerald-600 hover:border-emerald-500 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Confirmed Rental Event
                </button>
                <button
                  onClick={handleSimulateReversal}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-rose-600 hover:border-rose-500 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3 text-rose-400" />
                  Generate Reversal (-₪25)
                </button>
                <button
                  onClick={handleSimulate7DayExpiry}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-amber-600 hover:border-amber-500 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  Run 7-Day Deadline
                </button>
                <button
                  onClick={handleResetData}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-800/80 hover:bg-red-700 text-red-200 hover:text-white transition-all flex items-center gap-1 font-medium ml-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Mock Data
                </button>
              </div>
            </div>

            {/* Event Notification Toast */}
            {notification && (
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
                {notification}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
