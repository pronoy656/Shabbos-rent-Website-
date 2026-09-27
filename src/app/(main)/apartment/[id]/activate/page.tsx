"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useListingFeeStatus } from "@/hooks/useListingFeeStatus";
import { activateFreeListing } from "@/lib/payment/listingFlowApi";
import { useListingPayment } from "@/hooks/useListingPayment";
import { NedarimPaymentModal } from "@/components/payment/NedarimPaymentModal";
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Lock, Building2, HelpCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ApartmentActivationPage() {
  const params = useParams() as { id: string };
  const apartmentId = params?.id || "";
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: feeStatus, isLoading: isFeeLoading } = useListingFeeStatus();
  const [activatingFree, setActivatingFree] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  const {
    intent,
    iframeUrl,
    isLoading: isIntentLoading,
    createIntent,
    verifyPayment,
  } = useListingPayment({
    onSuccess: (result) => {
      setShowPaidModal(false);
      if (typeof window !== "undefined" && apartmentId) {
        localStorage.setItem(`apartment_activated_${apartmentId}`, "true");
      }
      queryClient.invalidateQueries({ queryKey: ["apartments", "my"] });
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      toast.success("Payment confirmed! Your listing is activated for 1 full year 🎉");
      router.push(`/owner/welcome?apartmentId=${apartmentId}`);
    },
    onError: (err) => {
      toast.error(err || "Payment processing failed");
    },
  });

  const handleFreeActivation = async () => {
    if (!apartmentId) return;
    try {
      setActivatingFree(true);
      await activateFreeListing(apartmentId);
      if (typeof window !== "undefined" && apartmentId) {
        localStorage.setItem(`apartment_activated_${apartmentId}`, "true");
      }
      queryClient.invalidateQueries({ queryKey: ["apartments", "my"] });
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      toast.success("Good news! Your listing has been activated for FREE for 1 full year 🎉");
      router.push(`/owner/welcome?apartmentId=${apartmentId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to activate listing.");
    } finally {
      setActivatingFree(false);
    }
  };

  const handlePaidFlow = async () => {
    if (!apartmentId) return;
    const ok = await createIntent(apartmentId);
    if (ok) {
      setShowPaidModal(true);
    }
  };

  if (isFeeLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <Loader2 className="w-10 h-10 animate-spin text-[#4c55a4] mb-3" />
        <p className="text-sm font-semibold text-zinc-500">Checking listing fee promotion status...</p>
      </div>
    );
  }

  const isOnSale = Boolean(feeStatus?.isOnSale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4 sm:p-6 py-16">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 relative overflow-hidden transition-all">
        
        {/* Top Floating Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3-Step Flow Breadcrumbs */}
        <div className="flex items-center justify-between max-w-sm mx-auto mb-8 px-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">1. Details</span>
          </div>
          <div className="h-0.5 flex-1 bg-indigo-500 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-bold text-xs ring-4 ring-indigo-100 dark:ring-indigo-900/40 shadow-md">
              2
            </div>
            <span className="text-[11px] font-extrabold text-[#4c55a4] dark:text-indigo-300">2. Activation</span>
          </div>
          <div className="h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">3. Set Dates</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-[#4c55a4] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold rounded-full mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Step 2 of 3: 1-Year Host Pass</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Activate Your Listing
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Your listing details are saved. Activate your 1-year pass to publish and start receiving Shabbat rental inquiries.
          </p>
        </div>

        {/* OPTION A: PROMO ON SALE (FREE ₪0) */}
        {isOnSale ? (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700/60 rounded-3xl p-6 sm:p-8 text-center mb-8 relative shadow-lg shadow-emerald-500/5">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mb-1">
              Good news — no fee right now! 🎉
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300/90 text-sm mb-6 max-w-sm mx-auto leading-relaxed font-medium">
              The standard yearly fee (₪28) is completely waived during our special promotional period.
            </p>

            <div className="flex items-baseline justify-center gap-3 mb-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm py-4 px-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 w-fit mx-auto shadow-sm">
              <span className="line-through text-zinc-400 text-xl font-bold">₪28</span>
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₪0</span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">/ 1st Year Free</span>
            </div>

            <button
              onClick={handleFreeActivation}
              disabled={activatingFree}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl transition-all duration-150 shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 text-[16px] disabled:opacity-50 cursor-pointer"
            >
              {activatingFree ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Activating Your Listing...</span>
                </>
              ) : (
                <>
                  <span>Activate My Listing for Free</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* OPTION B: REGULAR ₪28 NEDARIM PLUS PAYMENT */
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center mb-8 relative">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-1">
              Annual Listing Subscription
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-6">
              Secure 1 full year of verified listing visibility and inquiries.
            </p>

            <div className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-6">
              ₪28 <span className="text-sm font-bold text-zinc-500">/ Year</span>
            </div>

            <ul className="text-left text-sm text-zinc-700 dark:text-zinc-300 space-y-3 mb-8 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Publish unlimited Shabbat availability</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Receive verified renter contact requests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Full access to Apartment Swap feature</span>
              </li>
            </ul>

            <button
              onClick={handlePaidFlow}
              disabled={isIntentLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-black py-4 px-6 rounded-2xl transition-all duration-150 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 text-[16px] disabled:opacity-50 cursor-pointer"
            >
              {isIntentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing Nedarim Plus...</span>
                </>
              ) : (
                <>
                  <span>Pay ₪28 via Nedarim Plus</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Nedarim Modal (for Paid Flow) */}
        {showPaidModal && intent && (
          <NedarimPaymentModal
            isOpen={showPaidModal}
            onClose={() => setShowPaidModal(false)}
            onSuccess={() => {
              setShowPaidModal(false);
              router.push(`/owner/welcome?apartmentId=${apartmentId}`);
            }}
            onVerify={verifyPayment}
            intent={intent}
            iframeUrl={iframeUrl}
          />
        )}

        <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure 256-bit SSL encrypted verification via Nedarim Plus</span>
        </div>
      </div>
    </div>
  );
}
