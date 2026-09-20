"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  X,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";
import { 
  useMyReportRentedHistory, 
  useMyUnpaidDues, 
  useBatchPayAllReports 
} from "@/hooks/useReportRented";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { toast } from "sonner";

export default function RentalHistoryPage() {
  const { data: reportedRentals = [], isLoading } = useMyReportRentedHistory();
  const { data: duesData, isLoading: duesLoading } = useMyUnpaidDues();
  const { data: weekendData } = useWeekendCalendars();
  const { mutate: batchPay, isPending: isPaying } = useBatchPayAllReports();
  
  const pendingAmount = duesData?.totalDueAmount || 0;
  const realShabbatot = weekendData?.data || [];

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentExpiry, setPaymentExpiry] = useState("");
  const [paymentCVV, setPaymentCVV] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOpenPayment = () => {
    setPaymentCardNumber("");
    setPaymentExpiry("");
    setPaymentCVV("");
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

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
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Rental History</h3>
            <p className="text-sm text-zinc-500 mt-0.5">
              All reported rentals and payment statuses
            </p>
          </div>
          {pendingAmount > 0 && (
            <button
              type="button"
              onClick={handleOpenPayment}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              Pay ₪{pendingAmount}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-zinc-500">Loading rental history...</div>
        ) : reportedRentals.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-zinc-400" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              No rentals reported yet
            </h4>
            <p className="text-zinc-500 text-sm mb-6">
              Your reported rentals will appear here.
            </p>
            <Link
              href="/user-dashboard/manage/report-renter"
              className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all inline-block"
            >
              Report Your First Rental
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    Weekend
                  </th>
                  <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    Reported At
                  </th>
                  <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {reportedRentals.map((r) => {
                  const shabbat = realShabbatot.find((s) => s.date === r.weekend);
                  
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {r.reportType === "SWAP" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold text-xs uppercase">
                            <ArrowRightLeft className="w-3.5 h-3.5" /> Swap
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs uppercase">
                            <Receipt className="w-3.5 h-3.5" /> Rent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900 dark:text-white">
                          {r.weekend ? new Date(r.weekend).toLocaleDateString() : "Unknown"}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {shabbat ? shabbat.title : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {r.payment?.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-zinc-900 dark:text-white">
                        ₪{r.payment?.amount || 50}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {r.payment?.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={handleOpenPayment}
                            className="text-xs font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
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
                      <p className="text-xs text-zinc-500">Secure platform fee payment</p>
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
                    <span>Secured & encrypted payment</span>
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
    </>
  );
}
