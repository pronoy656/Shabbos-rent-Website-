"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getActiveAmbassadorSession,
  logoutAmbassador,
} from '@/services/ambassadorAuthService';
import {
  getAmbassadorById,
  getRecruitedSubAmbassadors,
  updateAmbassadorDefaultModel,
} from '@/services/ambassadorService';
import {
  getAttributionsByAmbassador,
  getAllAttributions,
  selectAttributionModel,
  manualClaimApartment,
} from '@/services/attributionService';
import {
  getCommissionsByAmbassador,
  calculateAmbassadorBalances,
} from '@/services/commissionService';
import {
  getPayoutsByAmbassador,
  requestPayout,
  MINIMUM_PAYOUT_THRESHOLD,
} from '@/services/payoutService';
import { Ambassador, Attribution, Commission, Payout, CommissionModel } from '@/types/ambassador';
import DevSimulatorBar from '@/components/ambassador/DevSimulatorBar';
import {
  Building2,
  DollarSign,
  Copy,
  Share2,
  Check,
  Clock,
  AlertCircle,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Filter,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function AmbassadorDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(getActiveAmbassadorSession());
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [subAmbassadors, setSubAmbassadors] = useState<Ambassador[]>([]);
  const [activeTab, setActiveTab] = useState<'apartments' | 'commissions' | 'manual' | 'sub' | 'payout' | 'settings'>('apartments');

  // Copy feedback state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Manual Claim Form State
  const [manualForm, setManualForm] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    model: 'A' as CommissionModel,
  });
  const [manualResult, setManualResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Settings Form State
  const [defaultModelSetting, setDefaultModelSetting] = useState<CommissionModel>('A');
  const [settingsResult, setSettingsResult] = useState<string | null>(null);

  // Payout Request State
  const [payoutResult, setPayoutResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Commission Ledger Filter State
  const [commissionFilter, setCommissionFilter] = useState<string>('all');

  const loadData = () => {
    const currentSession = getActiveAmbassadorSession();
    if (!currentSession) {
      // Redirect to login if no session
      router.push('/ambassador/login');
      return;
    }

    setSession(currentSession);
    const amb = getAmbassadorById(currentSession.ambassadorId);
    if (!amb || amb.status !== 'active') {
      router.push('/ambassador/login');
      return;
    }

    setAmbassador(amb);
    setDefaultModelSetting(amb.defaultModel);

    const attrs = getAttributionsByAmbassador(amb.id);
    setAttributions(attrs);

    const comms = getCommissionsByAmbassador(amb.id);
    setCommissions(comms);

    const pays = getPayoutsByAmbassador(amb.id);
    setPayouts(pays);

    const subs = getRecruitedSubAmbassadors(amb.id);
    setSubAmbassadors(subs);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!ambassador) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">Loading Ambassador Portal...</p>
        </div>
      </div>
    );
  }

  const balances = calculateAmbassadorBalances(ambassador.id);
  const pendingModelAttributions = attributions.filter((a) => a.model === null);
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/search?ref=${ambassador.referralCode}`
    : `https://shabosrent.co.il/search?ref=${ambassador.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ambassador.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleModelSelect = (attributionId: string, model: CommissionModel) => {
    const res = selectAttributionModel(attributionId, model, ambassador.id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualResult(null);

    const res = manualClaimApartment({
      ambassadorId: ambassador.id,
      ownerPhone: manualForm.ownerPhone,
      ownerEmail: manualForm.ownerEmail,
      model: manualForm.model,
    });

    if (res.success) {
      setManualResult({ success: true, msg: 'Apartment linked successfully! Listing commission generated.' });
      setManualForm({ ownerName: '', ownerPhone: '', ownerEmail: '', model: 'A' });
      loadData();
    } else {
      setManualResult({ success: false, msg: res.error || 'Failed to claim apartment.' });
    }
  };

  const handleSaveDefaultModel = () => {
    updateAmbassadorDefaultModel(ambassador.id, defaultModelSetting);
    setSettingsResult('Default model preference saved successfully for future referrals!');
    loadData();
    setTimeout(() => setSettingsResult(null), 4000);
  };

  const handleRequestPayoutSubmit = () => {
    setPayoutResult(null);
    const res = requestPayout(ambassador.id);
    if (res.success) {
      setPayoutResult({ success: true, msg: 'Payout request submitted successfully! Admin will process your payout.' });
      loadData();
    } else {
      setPayoutResult({ success: false, msg: res.error || 'Payout request failed.' });
    }
  };

  const filteredCommissions = commissions.filter((c) => {
    if (commissionFilter === 'all') return true;
    return c.status === commissionFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-24 text-zinc-900 dark:text-white">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/launchericon-192x192.png" alt="Shabos Rent Logo" className="w-8 h-8 object-contain" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight">Shabbat</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Ambassador Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                logoutAmbassador();
                router.push('/ambassador/login');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Shalom, {ambassador.name}! 👋
              </h1>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {ambassador.status}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Rate Locked 12M</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage your property referrals, select commission models, and track your financial ledger.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              {ambassador.referralCode.slice(0, 2)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Your Referral Code</span>
              <span className="text-lg font-black tracking-wider text-blue-600 dark:text-blue-400 font-mono">{ambassador.referralCode}</span>
            </div>
          </div>
        </div>

        {/* Overview Financial Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Apartments Listed</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black">{attributions.length}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Total attributed properties</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Rentals Completed</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black">
              {commissions.filter((c) => c.type === 'rental' && c.status !== 'reversed').length}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Confirmed guest stays</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Balance</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              ₪{balances.pendingBalance}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Awaiting listing fee clearance</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Approved Balance</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₪{balances.approvedBalance}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Ready for payout request</p>
          </div>
        </div>

        {/* Pinned "NEEDS ATTENTION" Section (Conditional UX Banner) */}
        {pendingModelAttributions.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 shadow-md animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-sm uppercase tracking-wider mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600 animate-bounce" />
              <span>Needs Attention — Model Selection Required ({pendingModelAttributions.length})</span>
            </div>

            <div className="space-y-4">
              {pendingModelAttributions.map((attr) => (
                <div
                  key={attr.id}
                  className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      {attr.apartmentTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Owner: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{attr.ownerName}</span> ({attr.ownerPhone}) • Listed via Personal Referral Link
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>7-Day Deadline: Model auto-assigns if not locked within 5 days!</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleModelSelect(attr.id, 'A')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Lock Model A (₪15 List + ₪25/Rental 12M)
                    </button>
                    <button
                      onClick={() => handleModelSelect(attr.id, 'B')}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Lock Model B (₪25 List + ₪40 1st Rental)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prominent Referral Link & Code Section (Highest Traffic Element) */}
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 text-white border border-indigo-700/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-1">
              Highest Priority Share Tool
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">
              Your Personal Ambassador Referral Link
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed mb-6">
              Share this link with property owners. Any owner who lists their apartment through your link will automatically be attributed to you!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none truncate"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out Shabos Rent to list your apartment: ${referralUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Navigation Tabs */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('apartments')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'apartments'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            My Apartments ({attributions.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'commissions'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Commissions Ledger ({commissions.length})
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Manual Link Apartment
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'sub'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            My Sub-Ambassadors ({subAmbassadors.length})
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'payout'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Payout Request
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* TAB 1: MY APARTMENTS */}
        {activeTab === 'apartments' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Attributed Apartments</h3>
                  <p className="text-xs text-zinc-500">Properties connected to your ambassador account</p>
                </div>
              </div>

              {attributions.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-sm">
                  No apartments attributed yet. Share your referral link to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-4">Apartment / Owner</th>
                        <th className="p-4">Linked Date</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Model</th>
                        <th className="p-4">Model A Window</th>
                        <th className="p-4 text-right">Total Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {attributions.map((attr) => {
                        const attrComms = commissions.filter((c) => c.sourceListingId === attr.listingId && c.status !== 'reversed');
                        const totalEarned = attrComms.reduce((sum, c) => sum + c.amount, 0);

                        return (
                          <tr key={attr.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-sm text-zinc-900 dark:text-white">{attr.apartmentTitle}</div>
                              <div className="text-zinc-500">{attr.ownerName} • {attr.ownerPhone}</div>
                            </td>
                            <td className="p-4 text-zinc-600 dark:text-zinc-400 font-medium">
                              {new Date(attr.attributedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 font-bold uppercase text-[10px] text-zinc-700 dark:text-zinc-300">
                                {attr.method}
                              </span>
                            </td>
                            <td className="p-4">
                              {attr.model ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  attr.model === 'A' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                }`}>
                                  Model {attr.model}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                  Pending Selection
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-zinc-500">
                              {attr.model === 'A' ? (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Active (12M Window)</span>
                                </div>
                              ) : attr.model === 'B' ? (
                                <span className="text-zinc-400 italic">N/A (1-Time First Rental)</span>
                              ) : (
                                <span className="text-amber-500 font-bold">Unset</span>
                              )}
                            </td>
                            <td className="p-4 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                              ₪{totalEarned}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMMISSIONS LEDGER */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">Financial Commission Ledger</h3>
                  <p className="text-xs text-zinc-500">Audit trail of all listing fees, rental commissions, sub-referrals & reversals</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
                  {['all', 'pending', 'approved', 'paid', 'reversed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setCommissionFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        commissionFilter === st ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredCommissions.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-sm">
                  No commission entries found for filter "{commissionFilter}".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-4">Type</th>
                        <th className="p-4">Apartment Title</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {filteredCommissions.map((comm) => (
                        <tr key={comm.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${comm.type === 'reversal' ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''}`}>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded font-bold uppercase text-[10px] ${
                              comm.type === 'listing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                              comm.type === 'rental' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              comm.type === 'sub-referral' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {comm.type}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-zinc-900 dark:text-white">
                            {comm.apartmentTitle}
                            {comm.reversalReason && (
                              <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">Reason: {comm.reversalReason}</div>
                            )}
                          </td>
                          <td className="p-4 text-zinc-500">
                            {new Date(comm.earnedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                              comm.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              comm.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              comm.status === 'paid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {comm.status}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-black text-sm ${comm.amount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {comm.amount < 0 ? `-₪${Math.abs(comm.amount)}` : `+₪${comm.amount}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL LINK APARTMENT FORM */}
        {activeTab === 'manual' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-1">Manually Link Property</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Claim attribution for an owner who created a listing without using your referral link.
              </p>

              {manualResult && (
                <div className={`p-4 rounded-xl mb-6 text-xs font-medium border ${
                  manualResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {manualResult.msg}
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Owner Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Cohen"
                    value={manualForm.ownerName}
                    onChange={(e) => setManualForm({ ...manualForm, ownerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Owner Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="050-123-4567"
                    value={manualForm.ownerPhone}
                    onChange={(e) => setManualForm({ ...manualForm, ownerPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Owner Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@example.com"
                    value={manualForm.ownerEmail}
                    onChange={(e) => setManualForm({ ...manualForm, ownerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Select Commission Model *
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      manualForm.model === 'A' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <input
                        type="radio"
                        name="model"
                        value="A"
                        checked={manualForm.model === 'A'}
                        onChange={() => setManualForm({ ...manualForm, model: 'A' })}
                        className="sr-only"
                      />
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">Model A</div>
                      <p className="text-[11px] text-zinc-500 mt-1">₪15 Listing + ₪25 per rental for 12 months</p>
                    </label>

                    <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      manualForm.model === 'B' ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30' : 'border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <input
                        type="radio"
                        name="model"
                        value="B"
                        checked={manualForm.model === 'B'}
                        onChange={() => setManualForm({ ...manualForm, model: 'B' })}
                        className="sr-only"
                      />
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">Model B</div>
                      <p className="text-[11px] text-zinc-500 mt-1">₪25 Listing + ₪40 1st Rental Ever</p>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-all mt-4 text-sm"
                >
                  Submit Manual Claim
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: MY SUB-AMBASSADORS */}
        {activeTab === 'sub' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-1">Recruited Sub-Ambassadors</h3>
              <p className="text-xs text-zinc-500 mb-6">
                You earn <span className="font-bold text-zinc-900 dark:text-white">₪5 per apartment listed</span> by ambassadors you directly recruited.
              </p>

              {subAmbassadors.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-sm">
                  You haven't recruited any sub-ambassadors yet. Share your ambassador signup link with friends!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subAmbassadors.map((sub) => {
                    const allAttributions = getAllAttributions();
                    const subAttributions = allAttributions.filter((a) => a.ambassadorId === sub.id && a.status === 'active');
                    const listedCount = sub.status === 'active' ? subAttributions.length : 0;
                    const subEarned = listedCount * 5;

                    return (
                      <div key={sub.id} className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col justify-between gap-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-base text-zinc-900 dark:text-white">{sub.name}</div>
                            <div className="text-xs text-zinc-500">{sub.email} • Code: {sub.referralCode || 'Pending Approval'}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {sub.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Apartments Listed: <strong className="text-zinc-900 dark:text-white font-black">{listedCount}</strong></span>
                          </div>

                          <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                            Sub-Referral Earned: <strong>₪{subEarned}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PAYOUT REQUEST */}
        {activeTab === 'payout' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-1">Payout Request</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Minimum payout threshold is <span className="font-bold text-zinc-900 dark:text-white">₪{MINIMUM_PAYOUT_THRESHOLD}</span>.
              </p>

              {payoutResult && (
                <div className={`p-4 rounded-xl mb-6 text-xs font-medium border ${
                  payoutResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {payoutResult.msg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Available Approved Balance</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    ₪{balances.approvedBalance}
                  </div>
                </div>

                <button
                  onClick={handleRequestPayoutSubmit}
                  disabled={balances.approvedBalance < MINIMUM_PAYOUT_THRESHOLD}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all text-sm"
                >
                  Request Payout Now
                </button>
              </div>
            </div>

            {/* Payout History Ledger */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-base">Payout Request History</h3>
              </div>

              {payouts.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">No payout requests submitted yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-4">Requested Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Reference Code</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {payouts.map((p) => (
                        <tr key={p.id}>
                          <td className="p-4 text-zinc-600 dark:text-zinc-400">
                            {new Date(p.requestedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                              p.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              p.status === 'requested' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-zinc-500">{p.referenceCode || '—'}</td>
                          <td className="p-4 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                            ₪{p.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-1">Ambassador Settings</h3>
              <p className="text-xs text-zinc-500 mb-6">Configure your default model for auto-assignments & future referrals.</p>

              {settingsResult && (
                <div className="p-4 rounded-xl mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-medium">
                  {settingsResult}
                </div>
              )}

              <div className="space-y-6 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Default Commission Model Preference
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      defaultModelSetting === 'A' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <input
                        type="radio"
                        name="defaultModel"
                        value="A"
                        checked={defaultModelSetting === 'A'}
                        onChange={() => setDefaultModelSetting('A')}
                        className="sr-only"
                      />
                      <div className="font-bold text-base text-zinc-900 dark:text-white mb-1">Model A</div>
                      <p className="text-zinc-500 leading-relaxed text-[11px]">
                        ₪15 Listing Commission + ₪25 per rental for 12 months from listing creation.
                      </p>
                    </label>

                    <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      defaultModelSetting === 'B' ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30' : 'border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <input
                        type="radio"
                        name="defaultModel"
                        value="B"
                        checked={defaultModelSetting === 'B'}
                        onChange={() => setDefaultModelSetting('B')}
                        className="sr-only"
                      />
                      <div className="font-bold text-base text-zinc-900 dark:text-white mb-1">Model B</div>
                      <p className="text-zinc-500 leading-relaxed text-[11px]">
                        ₪25 Listing Commission + ₪40 1st Rental Ever (1-time payout).
                      </p>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs">
                  <span className="font-bold block mb-1">⚠️ Important UX Note:</span>
                  Changing your default model preference applies ONLY to future referrals and 7-day auto-assignments. Existing attributed apartments will retain their currently locked models.
                </div>

                <button
                  onClick={handleSaveDefaultModel}
                  className="w-full py-3.5 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-all text-sm"
                >
                  Save Settings Preference
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <DevSimulatorBar onDataChange={loadData} />
    </div>
  );
}
