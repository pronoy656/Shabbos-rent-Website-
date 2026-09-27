"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Inbox,
  ArrowRight,
  Sparkles,
  Sliders,
  CalendarCheck,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("apartmentId") || "";

  const handleSetDates = () => {
    if (apartmentId) {
      router.push(`/user-dashboard/manage/calendar?apartmentId=${apartmentId}`);
    } else {
      router.push("/user-dashboard/manage/calendar");
    }
  };

  const handleGoDashboard = () => {
    router.push("/user-dashboard/manage");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4 sm:p-6 py-16 font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 relative overflow-hidden transition-all">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3-Step Flow Breadcrumbs */}
        <div className="flex items-center justify-between max-w-sm mx-auto mb-8 px-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">1. Details</span>
          </div>
          <div className="h-0.5 flex-1 bg-emerald-500 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">2. Activated</span>
          </div>
          <div className="h-0.5 flex-1 bg-amber-500 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-amber-100 dark:ring-amber-900/40 shadow-md">
              3
            </div>
            <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">3. Set Dates</span>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#4c55a4] to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-black rounded-full mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            1-Year Listing Pass Active
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Almost Done! Welcome to ShabbosRent
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Your pass is active. Now select the Shabbat dates your apartment is open to start receiving guest bookings.
          </p>
        </div>

        {/* CRITICAL CALLOUT: Make Apartment Available */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-50/30 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-lg shadow-amber-500/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="p-4 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl shadow-md shadow-amber-500/30 shrink-0">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 dark:text-amber-200">
                Important: Make Your Apartment Available
              </h2>
              <p className="text-amber-900/90 dark:text-amber-300/90 text-xs sm:text-sm leading-relaxed font-medium">
                To start receiving guest inquiries and swap matches, you must select the Shabbatot/weekends your apartment is open for rent.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleSetDates}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm py-3 px-6 rounded-xl transition duration-150 shadow-md shadow-amber-600/20 hover:shadow-amber-600/30 cursor-pointer"
                >
                  <span>Set Available Dates Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Feature Highlights */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            What you can do in your Host Dashboard:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Manage Dates</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Open or close specific Shabbatot with one click.</p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Rent Requests</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Review renter profiles and accept contact inquiries.</p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Apartment Swap</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Swap your home with other verified owners across Israel.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleGoDashboard}
            className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
          >
            Skip to Dashboard Overview →
          </button>

          <button
            onClick={handleSetDates}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold py-3.5 px-6 rounded-xl transition text-sm cursor-pointer shadow-md"
          >
            <span>Go to Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default function FirstTimeOwnerWelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="w-8 h-8 border-4 border-[#4c55a4] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
