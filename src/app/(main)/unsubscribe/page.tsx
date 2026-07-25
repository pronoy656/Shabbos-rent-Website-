"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, BellOff, Bell } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "user@example.com";
  
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [emailBookings, setEmailBookings] = useState(true);
  const [emailPromos, setEmailPromos] = useState(false);
  const [emailNewsletter, setEmailNewsletter] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const optIn = localStorage.getItem("emailOptIn") !== "false";
      setIsUnsubscribed(!optIn);
    }
  }, []);

  const handleUnsubscribeAll = () => {
    setIsUnsubscribed(true);
    setEmailPromos(false);
    setEmailNewsletter(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("emailOptIn", "false");
      localStorage.setItem("emailPromos", "false");
      localStorage.setItem("emailNewsletter", "false");
    }
  };

  const handleResubscribe = () => {
    setIsUnsubscribed(false);
    setEmailPromos(true);
    setEmailNewsletter(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("emailOptIn", "true");
      localStorage.setItem("emailPromos", "true");
      localStorage.setItem("emailNewsletter", "true");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />

      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 text-[#4c55a4] dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-sm">
            {isUnsubscribed ? <BellOff className="w-8 h-8 text-amber-600" /> : <Bell className="w-8 h-8" />}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Email Subscription Preferences
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Managing email preferences for <span className="font-bold text-zinc-800 dark:text-zinc-200">{emailParam}</span>
          </p>

          {isUnsubscribed ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl mb-8 text-left text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <span className="font-bold block text-sm mb-1 text-amber-800 dark:text-amber-300">You are unsubscribed</span>
              You will no longer receive marketing, promotional deals, or monthly newsletters from Shabos Rent. Transactional updates regarding active bookings will still be delivered.
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl mb-8 text-left text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed">
              <span className="font-bold block text-sm mb-1 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Subscriber
              </span>
              You are currently subscribed to receive promotional deals and monthly updates.
            </div>
          )}

          <div className="space-y-3 mb-8">
            {isUnsubscribed ? (
              <button
                type="button"
                onClick={handleResubscribe}
                className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all text-sm"
              >
                Re-subscribe to Marketing Emails
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUnsubscribeAll}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 transition-all text-sm"
              >
                Unsubscribe from Marketing Emails
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link href="/user-dashboard" className="text-xs font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">
              Manage in Dashboard Settings
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#4c55a4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
