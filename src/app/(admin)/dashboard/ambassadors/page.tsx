"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getAllAmbassadors,
  getPendingAmbassadors,
  approveAmbassadorApplication,
  rejectAmbassadorApplication,
} from '@/services/ambassadorService';
import {
  getAllAttributions,
  adminRelinkAttribution,
} from '@/services/attributionService';
import {
  getAllCommissions,
  approveListingCommission,
  reverseCommission,
} from '@/services/commissionService';
import {
  getAllPayouts,
  approvePayout,
  rejectPayout,
} from '@/services/payoutService';
import { Ambassador, Attribution, Commission, Payout, CommissionModel } from '@/types/ambassador';
import DevSimulatorBar from '@/components/ambassador/DevSimulatorBar';
import {
  Users,
  UserCheck,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function AdminAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [pendingApplicants, setPendingApplicants] = useState<Ambassador[]>([]);
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'applicants' | 'master' | 'attributions' | 'commissions' | 'payouts'>('applicants');

  // Relink Modal state
  const [selectedAttrForRelink, setSelectedAttrForRelink] = useState<Attribution | null>(null);
  const [relinkAmbassadorId, setRelinkAmbassadorId] = useState<string>('');
  const [relinkModel, setRelinkModel] = useState<CommissionModel>('A');
  const [relinkResult, setRelinkResult] = useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const loadAdminData = () => {
    setAmbassadors(getAllAmbassadors());
    setPendingApplicants(getPendingAmbassadors());
    setAttributions(getAllAttributions());
    setCommissions(getAllCommissions());
    setPayouts(getAllPayouts());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveApplicant = (id: string) => {
    const res = approveAmbassadorApplication(id);
    if (res.success) {
      alert(`Applicant approved! Unique referral code "${res.ambassador?.referralCode}" generated and rates locked for 12 months.`);
      loadAdminData();
    } else {
      alert(res.error);
    }
  };

  const handleRejectApplicant = (id: string) => {
    if (confirm('Are you sure you want to reject this ambassador application?')) {
      rejectAmbassadorApplication(id);
      loadAdminData();
    }
  };

  const handleExecuteRelink = () => {
    if (!selectedAttrForRelink || !relinkAmbassadorId) return;
    const res = adminRelinkAttribution({
      attributionId: selectedAttrForRelink.id,
      newAmbassadorId: relinkAmbassadorId,
      newModel: relinkModel,
    });
    if (res.success) {
      setRelinkResult('Attribution successfully relinked!');
      setSelectedAttrForRelink(null);
      loadAdminData();
      setTimeout(() => setRelinkResult(null), 3000);
    } else {
      alert(res.error);
    }
  };

  const handleApproveListingFee = (sourceListingId: string) => {
    approveListingCommission(sourceListingId);
    loadAdminData();
  };

  const handleReverseCommission = (commissionId: string) => {
    const reason = prompt('Enter reason for reversal (e.g. Listing fee refunded / Rental invalid):', 'Listing fee refunded');
    if (reason !== null) {
      const res = reverseCommission(commissionId, reason);
      if (res.success) {
        alert('Reversal line item generated successfully in commission ledger!');
        loadAdminData();
      } else {
        alert(res.error);
      }
    }
  };

  const handleApprovePayout = (payoutId: string) => {
    const ref = prompt('Enter payment reference code (optional):', `PAY-${Math.floor(100000 + Math.random() * 900000)}`);
    if (ref !== null) {
      const res = approvePayout(payoutId, ref);
      if (res.success) {
        alert('Payout approved and marked as paid!');
        loadAdminData();
      } else {
        alert(res.error);
      }
    }
  };

  const handleRejectPayout = (payoutId: string) => {
    const reason = prompt('Enter rejection reason:', 'Information mismatch or payout under review');
    if (reason !== null) {
      rejectPayout(payoutId, reason);
      loadAdminData();
    }
  };

  return (
    <div className="space-y-8 font-sans pb-24 text-zinc-900 dark:text-white">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Admin Management Panel
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ambassador Program Control Center</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review pending applications, manage attributions, inspect financial ledgers & process payout approvals.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Data
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Applicants</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingApplicants.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Applications awaiting approval</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Ambassadors</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black">{ambassadors.filter((a) => a.status === 'active').length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Approved referral partners</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Attributed Properties</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black">{attributions.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Total referral listings</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Payout Requests</span>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {payouts.filter((p) => p.status === 'requested').length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Requests pending payout</p>
        </div>
      </div>

      {relinkResult && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
          {relinkResult}
        </div>
      )}

      {/* Admin Tabs Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminTab('applicants')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeAdminTab === 'applicants'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Queue ({pendingApplicants.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('master')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeAdminTab === 'master'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Master Ambassador List ({ambassadors.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('attributions')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeAdminTab === 'attributions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Attribution Relinking ({attributions.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('commissions')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeAdminTab === 'commissions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Commission Audit Ledger ({commissions.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('payouts')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeAdminTab === 'payouts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Payout Approvals ({payouts.length})
        </button>
      </div>

      {/* TAB 1: PENDING APPLICANTS QUEUE */}
      {activeAdminTab === 'applicants' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg">Ambassador Application Approval Queue</h3>
            <p className="text-xs text-zinc-500">Review pending candidate accounts and activate referral codes</p>
          </div>

          {pendingApplicants.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No pending ambassador applications in queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-4">Applicant Name</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Recruiter Code</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {pendingApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 font-bold text-sm text-zinc-900 dark:text-white">{app.name}</td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        <div>{app.email}</div>
                        <div>{app.phone}</div>
                      </td>
                      <td className="p-4 text-zinc-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="font-mono text-zinc-500">{app.recruitedBy ? 'Recruited' : 'Direct'}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveApplicant(app.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve Candidate
                          </button>
                          <button
                            onClick={() => handleRejectApplicant(app.id)}
                            className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-bold text-xs transition-all flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASTER AMBASSADOR LIST */}
      {activeAdminTab === 'master' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Master Ambassador Roster</h3>
              <p className="text-xs text-zinc-500">Overview of all active, pending and inactive ambassadors</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Name / Contact</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Default Model</th>
                  <th className="p-4">Rate Lock Status</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Properties Attributed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {ambassadors.map((amb) => {
                  const ambAttrs = attributions.filter((a) => a.ambassadorId === amb.id);
                  return (
                    <tr key={amb.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-zinc-900 dark:text-white">{amb.name}</div>
                        <div className="text-zinc-500">{amb.email} • {amb.phone}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {amb.referralCode || '— (Pending)'}
                      </td>
                      <td className="p-4 font-bold">Model {amb.defaultModel}</td>
                      <td className="p-4 text-zinc-500">
                        {amb.rateLockedUntil ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Locked until {new Date(amb.rateLockedUntil).toLocaleDateString()}
                          </span>
                        ) : (
                          'Not locked'
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          amb.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          amb.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {amb.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-sm">{ambAttrs.length} properties</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ATTRIBUTION RELINKING */}
      {activeAdminTab === 'attributions' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg">Attribution Management & Relinking</h3>
            <p className="text-xs text-zinc-500">Override assigned ambassador or change locked commission models</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Apartment Title / Owner</th>
                  <th className="p-4">Current Ambassador</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Model</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {attributions.map((attr) => {
                  const amb = ambassadors.find((a) => a.id === attr.ambassadorId);
                  return (
                    <tr key={attr.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-zinc-900 dark:text-white">{attr.apartmentTitle}</div>
                        <div className="text-zinc-500">{attr.ownerName} ({attr.ownerPhone})</div>
                      </td>
                      <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                        {amb ? amb.name : attr.ambassadorId}
                      </td>
                      <td className="p-4 uppercase font-bold text-[10px] text-zinc-500">{attr.method}</td>
                      <td className="p-4 font-bold">{attr.model ? `Model ${attr.model}` : 'Unset'}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAttrForRelink(attr);
                            setRelinkAmbassadorId(attr.ambassadorId);
                            setRelinkModel(attr.model || 'A');
                          }}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold rounded-lg text-xs transition-all"
                        >
                          Relink / Override
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Relink Modal Confirmation */}
          {selectedAttrForRelink && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Admin Relink Confirmation</span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  You are overriding attribution for <strong className="text-zinc-900 dark:text-white">"{selectedAttrForRelink.apartmentTitle}"</strong>.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Assign to Ambassador:</label>
                    <select
                      value={relinkAmbassadorId}
                      onChange={(e) => setRelinkAmbassadorId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    >
                      {ambassadors.filter((a) => a.status === 'active').map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.referralCode})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Assigned Commission Model:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="radio"
                          name="rModel"
                          value="A"
                          checked={relinkModel === 'A'}
                          onChange={() => setRelinkModel('A')}
                        />
                        Model A (₪15 List + ₪25/Rental 12M)
                      </label>
                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="radio"
                          name="rModel"
                          value="B"
                          checked={relinkModel === 'B'}
                          onChange={() => setRelinkModel('B')}
                        />
                        Model B (₪25 List + ₪40 1st Rental)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => setSelectedAttrForRelink(null)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteRelink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    Confirm Relink Override
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMMISSION AUDIT LEDGER */}
      {activeAdminTab === 'commissions' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg">System-wide Commission Audit Ledger</h3>
            <p className="text-xs text-zinc-500">Approve pending listing fees or generate reversal entries</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Ambassador</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Apartment Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {commissions.map((c) => {
                  const amb = ambassadors.find((a) => a.id === c.ambassadorId);
                  return (
                    <tr key={c.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${c.type === 'reversal' ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''}`}>
                      <td className="p-4 font-bold">{amb ? amb.name : c.ambassadorId}</td>
                      <td className="p-4 uppercase font-bold text-[10px] text-zinc-500">{c.type}</td>
                      <td className="p-4">{c.apartmentTitle}</td>
                      <td className="p-4 font-bold capitalize">{c.status}</td>
                      <td className={`p-4 text-right font-black text-sm ${c.amount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {c.amount < 0 ? `-₪${Math.abs(c.amount)}` : `+₪${c.amount}`}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.type === 'listing' && c.status === 'pending' && (
                            <button
                              onClick={() => handleApproveListingFee(c.sourceListingId)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]"
                            >
                              Approve Fee
                            </button>
                          )}
                          {c.status !== 'reversed' && (
                            <button
                              onClick={() => handleReverseCommission(c.id)}
                              className="px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded font-bold text-[11px] hover:bg-rose-200"
                            >
                              Reverse (-₪)
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYOUT APPROVALS */}
      {activeAdminTab === 'payouts' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg">Ambassador Payout Approvals</h3>
            <p className="text-xs text-zinc-500">Approve payout requests and generate payment reference codes</p>
          </div>

          {payouts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">No payout requests in system.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-4">Ambassador Name</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Reference Code</th>
                    <th className="p-4 text-right">Requested Amount</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 font-bold text-sm text-zinc-900 dark:text-white">{p.ambassadorName}</td>
                      <td className="p-4 text-zinc-500">{new Date(p.requestedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          p.status === 'requested' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-600 dark:text-zinc-400">{p.referenceCode || '—'}</td>
                      <td className="p-4 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">₪{p.amount}</td>
                      <td className="p-4 text-right">
                        {p.status === 'requested' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprovePayout(p.id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve Payout
                            </button>
                            <button
                              onClick={() => handleRejectPayout(p.id)}
                              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-50 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <DevSimulatorBar onDataChange={loadAdminData} />
    </div>
  );
}
