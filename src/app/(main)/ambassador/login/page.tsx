"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAmbassador } from '@/services/ambassadorAuthService';
import DevSimulatorBar from '@/components/ambassador/DevSimulatorBar';
import { Clock, AlertTriangle, ArrowRight, LogIn, Lock } from 'lucide-react';

export default function AmbassadorLoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('moshe@shabosrent.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingStatus(false);

    const res = loginAmbassador(emailOrPhone, password);

    if (!res.success) {
      if (res.status === 'pending') {
        setPendingStatus(true);
      } else {
        setError(res.error || 'Login failed.');
      }
      return;
    }

    // Success! Redirect to Dashboard
    router.push('/ambassador/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative">
      <div className="max-w-md mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/launchericon-192x192.png"
              alt="Shabos Rent Logo"
              className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
            />
            <div className="text-left">
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white block leading-none">
                Shabbat
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mt-1">
                Simply feel the way
              </span>
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Ambassador Portal Login
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to track your referrals, models, earnings, and payouts.
          </p>
        </div>

        {pendingStatus ? (
          /* Pending Review Banner Screen */
          <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Application Under Review
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              Your Ambassador account application is currently <span className="font-bold text-amber-600 dark:text-amber-400">Pending Admin Approval</span>. Access to the active dashboard will be unlocked once approved.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-4 text-left text-xs text-amber-800 dark:text-amber-300 mb-6 border border-amber-200 dark:border-amber-800/40">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Testing Tip for Developer Review:</span>
              </p>
              <p className="leading-relaxed">
                Use the <strong className="underline">Developer Simulator Bar</strong> at the bottom of the screen to switch to <strong className="underline">Admin Panel</strong> and approve this application instantly!
              </p>
            </div>
            <button
              onClick={() => setPendingStatus(false)}
              className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl transition-all text-sm"
            >
              Back to Login Screen
            </button>
          </div>
        ) : (
          /* Login Form */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Quick Demo Pre-fill helper */}
            <div className="mb-6 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <span className="font-bold text-[#4c55a4] dark:text-indigo-400 block mb-1">
                Demo Accounts Available:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrPhone('moshe@shabosrent.com');
                    setPassword('password123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-zinc-800 border rounded font-mono text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-indigo-400"
                >
                  Moshe (Active)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrPhone('david@shabosrent.com');
                    setPassword('password123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-zinc-800 border rounded font-mono text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-indigo-400"
                >
                  David (Sub)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrPhone('sara@shabosrent.com');
                    setPassword('password123');
                  }}
                  className="px-2 py-1 bg-white dark:bg-zinc-800 border rounded font-mono text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-indigo-400"
                >
                  Sara (Pending)
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email or Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="moshe@shabosrent.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Ambassador Portal
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Don't have an Ambassador account?{' '}
                <Link
                  href="/ambassador/register"
                  className="font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400"
                >
                  Apply to become an Ambassador
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <DevSimulatorBar />
    </div>
  );
}
