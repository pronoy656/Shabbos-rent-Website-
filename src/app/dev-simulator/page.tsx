"use client";

import Link from 'next/link';
import DevSimulatorBar from '@/components/ambassador/DevSimulatorBar';
import { Terminal, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export default function DevSimulatorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl w-full z-10 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-amber-400" />
          Developer Sandbox
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Ambassador Developer Simulator
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Use the Developer Simulator panel below to switch test users (Moshe, David, Sara, Admin) and simulate business logic events (referral listings, fee approval, rental bookings, reversals, deadlines).
        </p>

        {/* Quick Route Links */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/ambassador/dashboard"
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-850 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 mb-1">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Ambassador Dashboard
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-zinc-400">View logged-in ambassador portal</p>
          </Link>

          <Link
            href="/dashboard/ambassadors"
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-850 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-zinc-400">Manage applicants & commission ledger</p>
          </Link>
        </div>
      </div>

      {/* The Exact Developer Simulator Panel Component */}
      <DevSimulatorBar />
    </div>
  );
}
