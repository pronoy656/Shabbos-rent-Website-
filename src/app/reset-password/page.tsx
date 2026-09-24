"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/useAuth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const resetPasswordMutation = useResetPassword();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!newPassword || newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await resetPasswordMutation.mutateAsync({
        newPassword,
        confirmNewPassword,
        token,
      });

      toast.success(res?.data?.message || res?.message || "Password updated successfully!");
      router.push("/login?reset=success");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to reset password. Token might be expired.";
      setError(errorMsg || "Failed to reset password.");
      toast.error(errorMsg || "Failed to reset password.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Left Image Section */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-zinc-900 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Beautiful office interior"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-zinc-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-20 z-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Secure Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Account.
              </span>
            </h1>
            <p className="text-lg text-zinc-300 max-w-md font-medium leading-relaxed">
              Create a strong, new password to safely access your dashboard and manage your apartments.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center md:text-left mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-6 text-blue-600 dark:text-blue-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              Please enter your new password below.
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-2xl md:border border-zinc-200 dark:border-zinc-800 md:p-8 md:shadow-xl shadow-zinc-200/50 dark:shadow-none relative">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm rounded-xl font-semibold flex flex-col items-start gap-1">
                <span>{error}</span>
              </div>
            )}

            {!token ? (
              <div className="text-center py-6">
                <p className="text-red-500 text-sm font-bold mb-4">
                  Missing reset token. Please use the exact link sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="group relative flex w-full justify-center items-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                  >
                    {resetPasswordMutation.isPending ? "Updating Password..." : "Reset Password"}
                    {!resetPasswordMutation.isPending && (
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
