"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LockKeyhole,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  X,
  Phone,
} from "lucide-react";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useLogin, useForgotPassword, useVerifyOtp, useChangePassword } from "@/hooks/useAuth";
import { toast } from "sonner";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // Auth Hook
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyOtp();
  const changePasswordMutation = useChangePassword();

  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS">("EMAIL");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // Normal Login Submit (supports email or phone number as identifier)
  const handleFormLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const identifier = noEmail ? phone.trim() : email.trim();
    if (!identifier || !password) {
      setLoginError("Please enter your email or phone and password.");
      toast.error("Please enter your email or phone and password.");
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({
        identifier,
        password,
      });

      toast.success(res?.message || "Signed in successfully!");

      const userRole = res?.data?.user?.role;
      const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

      setTimeout(() => {
        if (isAdmin) {
          window.location.href = redirectUrl || "/dashboard";
        } else {
          // If not admin but redirectUrl is an admin route, ignore the redirectUrl
          if (redirectUrl && redirectUrl.startsWith("/dashboard")) {
            window.location.href = "/user-dashboard";
          } else {
            window.location.href = redirectUrl || "/user-dashboard";
          }
        }
      }, 400);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : "Invalid credentials. Please verify your details.";
      setLoginError(errorMsg || "Invalid credentials. Please check your details.");
      toast.error(errorMsg || "Invalid credentials. Please check your details.");
    }
  };

  // Quick Demo / Admin Login
  const handleAdminQuickLogin = async () => {
    setLoginError(null);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@gmail.com";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "12345678";

    setEmail(adminEmail);
    setPassword(adminPass);
    setNoEmail(false);

    try {
      const res = await loginMutation.mutateAsync({
        identifier: adminEmail,
        password: adminPass,
      });
      toast.success(res?.message || "Admin login successful!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Admin login failed.";
      setLoginError(errorMsg || "Admin login failed.");
      toast.error(errorMsg || "Admin login failed.");
    }
  };

  // Forgot Password: Step 1 Send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      const res = await forgotPasswordMutation.mutateAsync({ email: forgotEmail.trim() });
      const msg = res?.message || "OTP code sent to your email!";
      setForgotSuccessMessage(msg);
      toast.success(msg);
      setForgotStep("OTP");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to send reset code.";
      setForgotError(errorMsg || "Failed to send reset code.");
      toast.error(errorMsg || "Failed to send reset code.");
    }
  };

  // Forgot Password: Step 2 Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const numericOtp = parseInt(forgotOtp.replace(/\D/g, ""), 10);
    if (!numericOtp || isNaN(numericOtp)) {
      setForgotError("Please enter a valid OTP code.");
      toast.error("Please enter a valid OTP code.");
      return;
    }

    try {
      const res = await verifyOtpMutation.mutateAsync({
        email: forgotEmail.trim(),
        otp: numericOtp,
      });
      toast.success(res?.message || "OTP code verified successfully!");
      setForgotStep("NEW_PASSWORD");
      setForgotSuccessMessage(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Invalid or expired OTP code.";
      setForgotError(errorMsg || "Invalid or expired OTP code.");
      toast.error(errorMsg || "Invalid or expired OTP code.");
    }
  };

  // Forgot Password: Step 3 Change Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!newPassword || newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await changePasswordMutation.mutateAsync({
        newPassword,
      });
      toast.success(res?.message || "Password updated successfully!");
      setForgotStep("SUCCESS");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update password.";
      setForgotError(errorMsg || "Failed to update password.");
      toast.error(errorMsg || "Failed to update password.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Left Image/Graphic Section */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-zinc-900 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            alt="Beautiful luxury apartment interior"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-20 z-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl mb-8 border border-white/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/launchericon-192x192.png"
                alt="Shabos Rent Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                Shabos Rent.
              </span>
            </h1>
            <p className="text-lg text-zinc-200 max-w-lg font-medium leading-relaxed">
              The premier platform for discovering and managing premium short-term rentals in Israel's most beautiful neighborhoods.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-8 lg:flex-none lg:w-[55%] xl:w-[52%] lg:px-14 xl:px-18 border-l border-zinc-100 dark:border-zinc-900 z-10 bg-white dark:bg-black">
        <div className="mx-auto w-full max-w-lg lg:w-[540px] xl:max-w-[560px]">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/launchericon-192x192.png"
              alt="Shabos Rent Logo"
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Shabos Rent
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
              Enter your email or phone number to access your account.
            </p>
          </div>

          {redirectUrl && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl flex items-center gap-3 text-[#4c55a4] dark:text-indigo-300 shadow-sm">
              <div className="p-2 bg-[#4c55a4] text-white rounded-xl shrink-0">
                <LockKeyhole className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold block text-sm mb-0.5">Login Required</span>
                Please log in or sign up to view full apartment details.
              </div>
            </div>
          )}

          {loginError && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs font-semibold shadow-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={handleFormLogin} className="space-y-5">
              {noEmail ? (
                <div className="space-y-1.5">
                  <PhoneInput
                    label="Phone number"
                    required
                    value={phone}
                    onChange={(val) => setPhone(val)}
                  />
                  <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={noEmail}
                      onChange={(e) => setNoEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      I do not have an email address
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-500/20 transition-all shadow-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={noEmail}
                      onChange={(e) => setNoEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      I do not have an email address
                    </span>
                  </label>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep("EMAIL");
                      setForgotEmail(email || "");
                      setForgotError(null);
                      setForgotSuccessMessage(null);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[13px] font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-11 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In to Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  disabled={loginMutation.isPending}
                  onClick={handleAdminQuickLogin}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 dark:border-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-zinc-800 dark:hover:bg-zinc-700 focus-visible:outline-none cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Quick Super Admin Login (admin@gmail.com)
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                href={`/signup${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: Enter Email */}
            {forgotStep === "EMAIL" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Reset your password
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                  Enter your registered email and we'll send you an OTP verification code.
                </p>

                {forgotError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                    {forgotError}
                  </div>
                )}

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send Verification Code"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === "OTP" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Enter OTP Code
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{forgotEmail}</span>.
                </p>

                {forgotSuccessMessage && (
                  <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl font-medium">
                    {forgotSuccessMessage}
                  </div>
                )}

                {forgotError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                    {forgotError}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-4 py-2.5 text-center tracking-widest font-mono text-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifyOtpMutation.isPending}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP Code"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: Enter New Password */}
            {forgotStep === "NEW_PASSWORD" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Create New Password
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                  Choose a secure password with at least 8 characters.
                </p>

                {forgotError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                    {forgotError}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {changePasswordMutation.isPending ? "Updating Password..." : "Set New Password"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: Success */}
            {forgotStep === "SUCCESS" && (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Password Updated!
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  Your password has been changed successfully. You can now log in with your new credentials.
                </p>

                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
