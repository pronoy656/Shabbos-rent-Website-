"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronRight,
  Banknote,
  AlignLeft,
  Check,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { 
  useReportRentedStats, 
  useMyReportRentedHistory, 
  useMyUnpaidDues, 
  useCreateReportIntent, 
  useBatchPayAllReports 
} from "@/hooks/useReportRented";
import { ReportType } from "@/types/report-rented.types";
import { toast } from "sonner";

export default function ReportRenterPage() {
  const { data: statsData, isLoading: statsLoading } = useReportRentedStats();
  const { data: historyData, isLoading: historyLoading } = useMyReportRentedHistory();
  const { data: duesData, isLoading: duesLoading } = useMyUnpaidDues();
  const { data: weekendData, isLoading: weekendLoading } = useWeekendCalendars();
  const { mutate: createIntent, isPending: isCreatingIntent } = useCreateReportIntent();
  const { mutate: batchPay, isPending: isPaying } = useBatchPayAllReports();

  const reportedRentals = historyData || [];
  const pendingAmount = duesData?.totalDueAmount || 0;
  const stats = statsData;
  const realShabbatot = weekendData?.data || [];

  const [isReportRentedModalOpen, setIsReportRentedModalOpen] = useState(false);
  const [selectedRentedWeeks, setSelectedRentedWeeks] = useState<string[]>([]);
  const [reportType, setReportType] = useState<ReportType>("RENT");
  const [targetApartmentId, setTargetApartmentId] = useState("");
  const [reportRentedStep, setReportRentedStep] = useState<1 | 2>(1);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentExpiry, setPaymentExpiry] = useState("");
  const [paymentCVV, setPaymentCVV] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reportRentedSuccess, setReportRentedSuccess] = useState(false);

  // Handler: open Report Rented modal
  const handleOpenReportRented = () => {
    setSelectedRentedWeeks([]);
    setReportType("RENT");
    setTargetApartmentId("");
    setReportRentedStep(1);
    setReportRentedSuccess(false);
    setIsReportRentedModalOpen(true);
  };

  // Handler: confirm rental report
  const handleConfirmReportRented = () => {
    if (selectedRentedWeeks.length === 0) return;
    
    // For SWAP, only one week is allowed
    const payload = reportType === "SWAP" 
      ? {
          reportType: "SWAP" as ReportType,
          weekend: selectedRentedWeeks[0],
          targetApartmentId,
        }
      : {
          reportType: "RENT" as ReportType,
          weekends: selectedRentedWeeks,
        };

    createIntent(payload, {
      onSuccess: () => {
        setIsReportRentedModalOpen(false);
        setReportRentedSuccess(true);
        setTimeout(() => setReportRentedSuccess(false), 4000);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to submit report");
      }
    });
  };

  // Handler: open payment modal
  const handleOpenPayment = () => {
    setPaymentCardNumber("");
    setPaymentExpiry("");
    setPaymentCVV("");
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  // Handler: process payment (Simulate Nedarim Plus success by submitting dummy tx id)
  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    batchPay(
      {
        paymentMethod: "NEDARIM_PLUS",
        transactionId: `NED-DUMMY-${Date.now()}`
      }, 
      {
        onSuccess: () => {
          setPaymentSuccess(true);
          setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPaymentSuccess(false);
          }, 2000);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Payment failed");
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Red Debt Bar */}
      {pendingAmount > 0 && (
        <button
          type="button"
          onClick={handleOpenPayment}
          className="w-full flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-600/30 animate-pulse cursor-pointer"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-left">
            You owe ₪{pendingAmount} for reported rentals — Click here to pay
          </span>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </button>
      )}

      {/* Success Toast */}
      {reportRentedSuccess && (
        <div className="w-full flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            Rental reported successfully! Platform fee is now due.
          </span>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden">
        {/* Top Banner */}
        <div className="px-8 pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-6 h-6 text-[#4c55a4]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-1">
                  Did you rent out your apartment for a Shabbat weekend?
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-lg">
                  If your apartment was rented for any specific Shabbat week, please report that week here.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Report a Rental Section */}
        <div className="px-8 py-6">
          <div className="mb-5">
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-white mb-1">
              Report a Rental
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Select the Shabbat week your apartment was rented and submit a report. A{" "}
              <span className="font-bold text-[#4c55a4] dark:text-indigo-400">₪50 platform fee</span>{" "}
              applies per reported rental.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenReportRented}
            id="report-rented-btn"
            className="w-full sm:w-auto px-8 py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-[#4c55a4]/25 hover:shadow-[#4c55a4]/40 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Receipt className="w-5 h-5" />
            Report Rented
          </button>
        </div>

        {/* How It Works — Step Flow */}
        <div className="mx-8 mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            How it works
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                1
              </div>
              <span>Was your apartment rented?</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                2
              </div>
              <span>Select that Shabbat week</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                3
              </div>
              <span>Click Report Rented</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                4
              </div>
              <span>₪50 fee becomes pending</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                5
              </div>
              <span>Complete your payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Reported Rentals */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-xl flex items-center justify-center">
              <Receipt className="w-4.5 h-4.5 text-[#4c55a4]" />
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Reported Rentals
            </span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {statsLoading ? "..." : stats?.totalReports || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Total rentals you have reported so far</p>
        </div>

        {/* Pending Payment */}
        <button
          type="button"
          onClick={pendingAmount > 0 ? handleOpenPayment : undefined}
          className={`bg-white dark:bg-zinc-900 rounded-2xl border p-5 shadow-sm text-left transition-all ${
            pendingAmount > 0
              ? "border-red-300 dark:border-red-800/60 hover:border-red-400 cursor-pointer hover:shadow-md"
              : "border-zinc-200 dark:border-zinc-800 cursor-default"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                pendingAmount > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
              }`}
            >
              <CreditCard
                className={`w-4.5 h-4.5 ${pendingAmount > 0 ? "text-red-600" : "text-emerald-600"}`}
              />
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Pending Payment
            </span>
          </div>
          <div
            className={`text-3xl font-black ${
              pendingAmount > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            ₪{pendingAmount}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {pendingAmount > 0 ? "Click to pay now →" : "No pending payments ✓"}
          </p>
        </button>

        {/* Rental History Link */}
        <Link
          href="/user-dashboard/manage/rental-history"
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm text-left hover:border-[#4c55a4]/40 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
              <AlignLeft className="w-4.5 h-4.5 text-zinc-500" />
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Rental History
            </span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {statsLoading ? "..." : stats?.totalReports || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1 group-hover:text-[#4c55a4] transition-colors">
            View all reported rentals →
          </p>
        </Link>
      </div>

      {/* Quick History Preview */}
      {reportedRentals.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Recent Reports</h4>
            <Link
              href="/user-dashboard/manage/rental-history"
              className="text-xs text-[#4c55a4] dark:text-indigo-400 font-bold hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {reportedRentals.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
              >
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">
                    {r.weekend ? new Date(r.weekend).toLocaleDateString() : "Unknown"}
                  </span>
                  <span className="text-zinc-500 text-xs ml-2">
                    {r.reportType === "SWAP" ? "SWAP" : "RENT"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                    ₪{r.payment?.amount || 50}
                  </span>
                  {r.payment?.status === "COMPLETED" ? (
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
                      ✓ Paid
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenPayment}
                      className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Report Rented Modal ===== */}
      {isReportRentedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-[#4c55a4]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">
                    Report Rented
                  </h3>
                  <p className="text-xs text-zinc-500">Step {reportRentedStep} of 2</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportRentedModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Week Selection */}
            {reportRentedStep === 1 && (
              <div className="p-6">
                <div className="flex border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 mb-5 bg-zinc-50 dark:bg-zinc-800/50">
                  <button
                    onClick={() => setReportType("RENT")}
                    className={`flex-1 text-sm font-bold py-2 rounded-md transition-colors ${
                      reportType === "RENT" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    Rented
                  </button>
                  <button
                    onClick={() => {
                      setReportType("SWAP");
                      // Swaps only allow one week, so truncate selected to first one if multiple
                      if (selectedRentedWeeks.length > 1) {
                        setSelectedRentedWeeks([selectedRentedWeeks[0]]);
                      }
                    }}
                    className={`flex-1 text-sm font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      reportType === "SWAP" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    <ArrowRightLeft className="w-4 h-4" /> Swap
                  </button>
                </div>

                {reportType === "SWAP" && (
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Target Apartment ID</label>
                    <input 
                      type="text" 
                      value={targetApartmentId}
                      onChange={(e) => setTargetApartmentId(e.target.value)}
                      placeholder="e.g. apart-002"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                    />
                  </div>
                )}

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 font-medium">
                  {reportType === "SWAP" 
                    ? "Which Shabbat week did you swap? Select exactly one."
                    : "Which Shabbat week(s) was your apartment rented? Select all that apply."}
                </p>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                  {weekendLoading ? (
                    <p className="text-sm text-zinc-500 p-4 text-center">Loading upcoming weekends...</p>
                  ) : realShabbatot.length === 0 ? (
                    <p className="text-sm text-zinc-500 p-4 text-center">No upcoming weekends available to select.</p>
                  ) : realShabbatot.map((shabbat) => {
                    const isSelected = selectedRentedWeeks.includes(shabbat.date);
                    const isAlreadyReported = reportedRentals.some(
                      (report) => report.weekend === shabbat.date
                    );
                    
                    return (
                      <button
                        key={shabbat.id}
                        type="button"
                        disabled={isAlreadyReported}
                        onClick={() => {
                          if (reportType === "SWAP") {
                            setSelectedRentedWeeks([shabbat.date]);
                          } else {
                            setSelectedRentedWeeks((prev) =>
                              prev.includes(shabbat.date)
                                ? prev.filter((d) => d !== shabbat.date)
                                : [...prev, shabbat.date]
                            );
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all ${
                          isAlreadyReported
                            ? "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/20 opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "border-[#4c55a4] bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10 cursor-pointer"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-[#4c55a4]/40 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                              isAlreadyReported
                                ? "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
                                : isSelected
                                ? "border-[#4c55a4] bg-[#4c55a4]"
                                : "border-zinc-300 dark:border-zinc-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isAlreadyReported ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-white'}`}>
                              {new Date(shabbat.date).toLocaleDateString()}
                            </div>
                            <div className={`text-xs ${isAlreadyReported ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500'}`}>
                              {shabbat.title}
                            </div>
                          </div>
                        </div>
                        {isSelected && !isAlreadyReported && (
                          <span className="text-xs font-bold text-[#4c55a4]">₪50</span>
                        )}
                        {isAlreadyReported && (
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Reported</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsReportRentedModalOpen(false)}
                    className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={selectedRentedWeeks.length === 0 || (reportType === "SWAP" && !targetApartmentId)}
                    onClick={() => setReportRentedStep(2)}
                    className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {reportRentedStep === 2 && (
              <div className="p-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 font-medium">
                  You are reporting{" "}
                  <strong className="text-zinc-900 dark:text-white">
                    {selectedRentedWeeks.length} {reportType.toLowerCase()}
                    {selectedRentedWeeks.length > 1 ? "s" : ""}
                  </strong>
                  . Please review and confirm.
                </p>

                {/* Selected weeks list */}
                <div className="space-y-2 mb-5">
                  {selectedRentedWeeks.map((date) => {
                    const shabbat = realShabbatot.find((s) => s.date === date);
                    return (
                      <div
                        key={date}
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                      >
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white text-sm">
                            {shabbat ? new Date(shabbat.date).toLocaleDateString() : new Date(date).toLocaleDateString()}
                          </span>
                          <span className="text-zinc-500 text-xs ml-2">
                            {shabbat?.title}
                          </span>
                        </div>
                        <span className="font-bold text-[#4c55a4] dark:text-indigo-400">₪50</span>
                      </div>
                    );
                  })}
                </div>

                {/* Total calculation */}
                <div className="bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10 border-2 border-[#4c55a4]/20 rounded-2xl p-4 mb-6">
                  <div className="flex flex-col gap-1.5 text-sm mb-3">
                    {selectedRentedWeeks.map((_, i) => (
                      <div key={i} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Report {i + 1} × ₪50</span>
                        <span>₪50</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-extrabold text-lg text-zinc-900 dark:text-white pt-2 border-t border-[#4c55a4]/20">
                    <span>Total Due</span>
                    <span className="text-[#4c55a4] dark:text-indigo-400">
                      ₪{selectedRentedWeeks.length * 50}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReportRentedStep(1)}
                    className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReportRented}
                    disabled={isCreatingIntent}
                    className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#4c55a4]/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    {isCreatingIntent ? "Reporting..." : "Confirm Report"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Payment Modal ===== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {!paymentSuccess ? (
              <>
                {/* Payment Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">
                        Complete Payment
                      </h3>
                      <p className="text-xs text-zinc-500">Secure platform fee payment (Nedarim Plus Mock)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePayNow} className="p-6 space-y-5">
                  {/* Amount Due */}
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-bold text-sm text-red-700 dark:text-red-300">
                        Amount Due
                      </span>
                    </div>
                    <span className="font-extrabold text-2xl text-red-600 dark:text-red-400">
                      ₪{pendingAmount}
                    </span>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Credit Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={paymentCardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const formatted = val.replace(/(\d{4})/g, "$1 ").trim();
                          setPaymentCardNumber(formatted);
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={paymentExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted =
                            val.length > 2 ? val.slice(0, 2) + "/" + val.slice(2) : val;
                          setPaymentExpiry(formatted);
                        }}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={3}
                        value={paymentCVV}
                        onChange={(e) =>
                          setPaymentCVV(e.target.value.replace(/\D/g, "").slice(0, 3))
                        }
                        placeholder="123"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                  </div>

                  {/* Security note */}
                  <p className="text-xs text-zinc-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secured by Nedarim Plus</span>
                  </p>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-[#4c55a4]/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ₪{pendingAmount} Now
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Payment Success State */
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-zinc-500 text-sm mb-2">Your platform fee has been paid.</p>
                <p className="font-extrabold text-[#4c55a4] dark:text-indigo-400 text-lg">
                  ₪{pendingAmount} paid
                </p>
                <p className="text-xs text-zinc-400 mt-4">All rentals are now marked as Paid.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
