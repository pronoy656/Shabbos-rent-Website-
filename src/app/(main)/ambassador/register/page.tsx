"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerAmbassador } from '@/services/ambassadorAuthService';
import { useLanguage } from '@/context/LanguageContext';
import DevSimulatorBar from '@/components/ambassador/DevSimulatorBar';
import { UserCheck, ShieldCheck, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { PhoneInput } from '@/components/common/PhoneInput';

export default function AmbassadorRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    recruitmentCode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = registerAmbassador(formData);
    if (!res.success) {
      setError(res.error || 'Registration failed.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Brand Header */}
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
            Ambassador Partner Program
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Earn recurring commissions by connecting property owners and hosting communities on Shabos Rent.
          </p>
        </div>

        {submitted ? (
          /* Confirmation Screen after Submission */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Application Submitted!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              Thank you, <span className="font-bold text-zinc-900 dark:text-white">{formData.name}</span>. Your ambassador candidate account has been created with status <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Pending Review</span>.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 text-left text-xs space-y-2 mb-8 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Next Step: Admin Application Review</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 pl-6 leading-relaxed">
                Once an Admin reviews and approves your application, your account will be activated, a unique referral code will be generated, and your commission rates will be locked for 12 months.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/ambassador/login"
                className="flex-1 py-3 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md"
              >
                Go to Ambassador Login
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sara Klein"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sara@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>

              <div>
                <PhoneInput
                  label="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Recruiter Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MOSHE50"
                  value={formData.recruitmentCode}
                  onChange={(e) => setFormData({ ...formData, recruitmentCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  If another Ambassador invited you, enter their code so they receive recruiter rewards.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2"
              >
                Submit Ambassador Application
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Already registered?{' '}
                <Link
                  href="/ambassador/login"
                  className="font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400"
                >
                  Log in to your account
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
