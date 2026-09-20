"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Home,
  Search,
  MessageCircle,
  CreditCard,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AddApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddApartmentModal({ isOpen, onClose }: AddApartmentModalProps) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginMutation = useLogin();

  // Check auth state when modal opens
  useEffect(() => {
    if (isOpen) {
      const role = localStorage.getItem("userRole");
      const token = localStorage.getItem("accessToken") || localStorage.getItem("auth_token");
      setIsLoggedIn(!!(role || token));
      setLoginError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setIsLoggedIn(true);
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

  const handleProceedToAdd = () => {
    onClose();
    router.push("/user-dashboard");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-4xl min-h-[560px] overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300 relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Instructions */}
        <div className="p-8 md:p-10 md:w-1/2 bg-zinc-50 dark:bg-zinc-900/50 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
              How It Works
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Adding your apartment to Shabos Rent is simple and free. Here is what you need to know:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#4c55a4] dark:text-blue-400">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-0.5">
                    1. List your details
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Add photos, describe your space, and set your availability for upcoming weekends.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-0.5">
                    2. Get discovered
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Users searching for Shabbos accommodations will find your listing in our search results.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-0.5">
                    3. Connect & Confirm
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    When someone finds your apartment, they can directly communicate with you via hotline or WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-0.5">
                    4. Simple Payment Structure
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Pay a yearly subscription of ₪28 ILS. When your apartment is successfully rented out, a ₪50 ILS success fee applies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400">
            Shabos Rent • The Premier Kosher Accommodation Platform
          </div>
        </div>

        {/* Right Column: Auth / Action */}
        <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-center">
          {!isLoggedIn ? (
            <div className="w-full max-w-sm mx-auto space-y-6">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                  Sign in to continue
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  You must be logged in to add an apartment.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2.5 text-red-700 dark:text-red-300 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
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
                        className="w-4 h-4 rounded border-zinc-300 text-[#4c55a4] focus:ring-[#4c55a4] accent-[#4c55a4]"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        I do not have an email address
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Mail className="h-5 w-5 text-zinc-400" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 pl-11 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#4c55a4] focus:ring-2 focus:ring-[#4c55a4]/20 transition-all text-zinc-900 dark:text-white shadow-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                      <input
                        type="checkbox"
                        checked={noEmail}
                        onChange={(e) => setNoEmail(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-[#4c55a4] focus:ring-[#4c55a4] accent-[#4c55a4]"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        I do not have an email address
                      </span>
                    </label>
                  </div>
                )}

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pl-11 pr-11 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#4c55a4] focus:ring-2 focus:ring-[#4c55a4]/20 transition-all text-zinc-900 dark:text-white shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold text-sm rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.info("Google Sign-In will be available with direct OAuth configuration.");
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </button>

              <p className="text-center text-[13px] text-zinc-500 dark:text-zinc-400 mt-3">
                Don't have an account?{" "}
                <Link
                  href="/signup?tab=owner"
                  onClick={onClose}
                  className="font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="w-full max-w-sm mx-auto text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  You're all set!
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  You can now proceed to add your apartment listing.
                </p>
              </div>
              <button
                onClick={handleProceedToAdd}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 cursor-pointer"
              >
                Continue to Add Apartment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
