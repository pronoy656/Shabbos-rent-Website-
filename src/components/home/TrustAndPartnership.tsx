"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, TrendingUp, Handshake, Lock } from "lucide-react";

export default function TrustAndPartnership() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            Future-Proof Your Journey
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
            Whether you are looking for a place to stay or offering your property, we are committed to building a secure, sustainable, and thriving environment for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* User Focus */}
          <div className="relative group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lock className="w-32 h-32 text-[#4c55a4]" />
            </div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#4c55a4] mb-6 relative z-10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 relative z-10">For Users: Safe & Secure</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 relative z-10">
              Your safety is our top priority. We ensure that every interaction is secure, verified, and reliable. With our platform, you are completely future-proof—enjoy peace of mind knowing your future stays and transactions are protected.
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4c55a4] mr-3 rtl:ml-3 rtl:mr-0"></span>
                Verified Properties & Hosts
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4c55a4] mr-3 rtl:ml-3 rtl:mr-0"></span>
                Secure Communication
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4c55a4] mr-3 rtl:ml-3 rtl:mr-0"></span>
                Future-Proof Reliability
              </li>
            </ul>
          </div>

          {/* Provider Focus */}
          <div className="relative group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 mb-6 relative z-10">
              <Handshake className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 relative z-10">For Providers: Grow With Us</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 relative z-10">
              You are more than just providers; you are our partners. We offer a future-proof platform where you can expand your business plans, operate independently, and significantly increase your income streams.
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 rtl:ml-3 rtl:mr-0"></span>
                Independent Business Growth
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 rtl:ml-3 rtl:mr-0"></span>
                Expanded Income Sources
              </li>
              <li className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 rtl:ml-3 rtl:mr-0"></span>
                Long-Term Partnership
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
