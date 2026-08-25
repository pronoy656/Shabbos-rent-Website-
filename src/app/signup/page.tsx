"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, Clock, CheckCircle2, ArrowRight, Building, HelpCircle, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { registerAmbassador } from "@/services/ambassadorAuthService";
import DevSimulatorBar from "@/components/ambassador/DevSimulatorBar";

const REFERRAL_SOURCES = [
  "Facebook / Social Media",
  "YouTube",
  "Instagram",
  "Twitter / X",
  "Newspaper / Print Ad",
  "Radio / Voice Hotline",
  "Friend / Word of Mouth",
  "Synagogue / Community Bulletin",
  "Google Search / Other",
];

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State: 'renter' | 'owner' | 'ambassador'
  const [activeTab, setActiveTab] = useState<"renter" | "owner" | "ambassador">("renter");

  // Renter Signup State
  const [renterName, setRenterName] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [renterPassword, setRenterPassword] = useState("");
  const [renterReferralSource, setRenterReferralSource] = useState("");

  // Owner Signup State
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerReferralSource, setOwnerReferralSource] = useState("");

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ambassador Signup State
  const [ambFormData, setAmbFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    recruitmentCode: "",
  });
  const [ambError, setAmbError] = useState<string | null>(null);
  const [ambSubmitted, setAmbSubmitted] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "ambassador") {
      setActiveTab("ambassador");
    } else if (tabParam === "owner") {
      setActiveTab("owner");
    }
  }, [searchParams]);

  const redirectUrl = searchParams.get("redirect");

  const handleSignupSubmit = (accountType: "renter" | "owner") => {
    setSignupError(null);
    if (!termsAccepted) {
      setSignupError("You must agree to the Terms & Conditions and Privacy Policy to create an account.");
      return;
    }

    const currentSource = accountType === "renter" ? renterReferralSource : ownerReferralSource;
    if (!currentSource) {
      setSignupError("Please select how you heard about Shabos Rent.");
      return;
    }

    setIsLoading(true);
    localStorage.setItem("userRole", accountType);
    localStorage.setItem("termsAccepted", "true");
    localStorage.setItem("termsAcceptedAt", new Date().toISOString());
    localStorage.setItem("emailOptIn", emailOptIn ? "true" : "false");
    localStorage.setItem("emailOptInAt", new Date().toISOString());
    localStorage.setItem("referralSource", currentSource);

    // Set default sub-preferences
    localStorage.setItem("emailBookings", "true");
    localStorage.setItem("emailPromos", emailOptIn ? "true" : "false");
    localStorage.setItem("emailNewsletter", emailOptIn ? "true" : "false");

    if (accountType === "owner") {
      localStorage.setItem("hasUserListing", "true");
    } else {
      localStorage.setItem("hasUserListing", "false");
    }

    setTimeout(() => {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (accountType === "owner") {
        router.push("/user-dashboard/add");
      } else {
        router.push("/user-dashboard");
      }
    }, 1200);
  };

  const handleAmbassadorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAmbError(null);

    if (!ambFormData.name || !ambFormData.email || !ambFormData.phone) {
      setAmbError("Please fill in all required fields.");
      return;
    }

    const res = registerAmbassador(ambFormData);
    if (!res.success) {
      setAmbError(res.error || "Registration failed.");
      return;
    }

    setAmbSubmitted(true);
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
          <div className="absolute inset-0 bg-zinc-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent"></div>

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
              Join <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                Shabos Rent.
              </span>
            </h1>
            <p className="text-lg text-zinc-200 max-w-lg font-medium leading-relaxed">
              Create a Renter Account to find weekend rentals, an Owner Account to list your property, or partner as an Ambassador.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 border-l border-zinc-100 dark:border-zinc-900 z-10 bg-white dark:bg-black overflow-y-auto">
        <div className="mx-auto w-full max-w-md lg:w-[480px]">
          
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/launchericon-192x192.png"
              alt="Shabos Rent Logo"
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Shabos Rent</span>
          </Link>

          {/* Account Type Tabs (3 Tabs: Renter Account, Owner Account, Ambassador Partner) */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-8 border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => { setActiveTab("renter"); setSignupError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "renter"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Renter Account
            </button>

            <button
              onClick={() => { setActiveTab("owner"); setSignupError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "owner"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Owner Account
            </button>

            <button
              onClick={() => { setActiveTab("ambassador"); setSignupError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === "ambassador"
                  ? "bg-[#4c55a4] text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Ambassador
            </button>
          </div>

          {/* TAB 1: RENTER ACCOUNT SIGNUP */}
          {activeTab === "renter" && (
            <div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Create Renter Account
                </h2>
                <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
                  Enter your details to start exploring and renting Shabbat apartments.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Full name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      placeholder="John Doe"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Email address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={renterEmail}
                      onChange={(e) => setRenterEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={renterPassword}
                      onChange={(e) => setRenterPassword(e.target.value)}
                      placeholder="Create a password"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-11 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Referral Source Shadcn Dropdown Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-zinc-400" /> How did you hear about Shabos Rent? <span className="text-red-500">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 py-3 px-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4c55a4] transition-all shadow-sm cursor-pointer">
                      <span className={renterReferralSource ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-400"}>
                        {renterReferralSource || "Select Source..."}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--anchor-width] max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                      {REFERRAL_SOURCES.map((source) => (
                        <DropdownMenuItem
                          key={source}
                          onClick={() => {
                            setRenterReferralSource(source);
                            setSignupError(null);
                          }}
                          className="flex items-center justify-between cursor-pointer rounded-lg py-2.5 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                          <span>{source}</span>
                          {renterReferralSource === source && <Check className="w-4 h-4 text-[#4c55a4]" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {signupError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                    {signupError}
                  </div>
                )}

                {/* Checkboxes Section */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setSignupError(null);
                        }}
                        className="peer appearance-none w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-0.5">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={emailOptIn}
                        onChange={(e) => setEmailOptIn(e.target.checked)}
                        className="peer appearance-none w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight">
                      I want to receive email updates, promotional offers, and weekend rental deals.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSignupSubmit("renter")}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-[#4c55a4] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#3d4484] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4c55a4]/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#4c55a4]/20 cursor-pointer"
                >
                  {isLoading ? "Creating Renter Account..." : "Sign Up as Renter"}
                </button>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white dark:bg-black px-4 text-zinc-500 dark:text-zinc-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 transition-all shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OWNER ACCOUNT SIGNUP */}
          {activeTab === "owner" && (
            <div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                  Create Owner Account <Building className="w-6 h-6 text-[#4c55a4]" />
                </h2>
                <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
                  Register as a host to list and rent out your property for Shabbatot.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Full name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="David Cohen"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Email address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="david.cohen@example.com"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Phone number (For Shabbat availability checks)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Phone className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+972 54-123-4567"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Create a password"
                      className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-11 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-[#4c55a4]/20 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Referral Source Shadcn Dropdown Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-zinc-400" /> How did you hear about Shabos Rent? <span className="text-red-500">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 py-3 px-4 text-sm font-medium text-zinc-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4c55a4] transition-all shadow-sm cursor-pointer">
                      <span className={ownerReferralSource ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-400"}>
                        {ownerReferralSource || "Select Source..."}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--anchor-width] max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                      {REFERRAL_SOURCES.map((source) => (
                        <DropdownMenuItem
                          key={source}
                          onClick={() => {
                            setOwnerReferralSource(source);
                            setSignupError(null);
                          }}
                          className="flex items-center justify-between cursor-pointer rounded-lg py-2.5 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                          <span>{source}</span>
                          {ownerReferralSource === source && <Check className="w-4 h-4 text-[#4c55a4]" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {signupError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                    {signupError}
                  </div>
                )}

                {/* Checkboxes Section */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setSignupError(null);
                        }}
                        className="peer appearance-none w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-0.5">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={emailOptIn}
                        onChange={(e) => setEmailOptIn(e.target.checked)}
                        className="peer appearance-none w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight">
                      I want to receive email updates and Shabbat availability check notifications.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSignupSubmit("owner")}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-[#4c55a4] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#3d4484] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4c55a4]/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#4c55a4]/20 cursor-pointer"
                >
                  {isLoading ? "Creating Owner Account..." : "Sign Up as Property Owner"}
                </button>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white dark:bg-black px-4 text-zinc-500 dark:text-zinc-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 transition-all shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AMBASSADOR SIGNUP */}
          {activeTab === "ambassador" && (
            <div>
              {ambSubmitted ? (
                /* Ambassador Pending Confirmation Card */
                <div className="bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-3xl p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    Application Submitted!
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed mb-6">
                    Candidate account created for <span className="font-bold">{ambFormData.name}</span>. Status is <span className="font-bold text-amber-700 dark:text-amber-300">Pending Admin Review</span>.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/ambassador/login"
                      className="py-3 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      Go to Ambassador Login
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setAmbSubmitted(false)}
                      className="py-2.5 px-4 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs border border-zinc-200 dark:border-zinc-700"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                /* Ambassador Registration Form */
                <div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      Ambassador Application
                    </h2>
                    <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
                      Earn recurring commissions by introducing apartment owners to Shabos Rent.
                    </p>
                  </div>

                  {/* Pre-fill Demo Helpers */}
                  <div className="mt-6 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                    <span className="font-bold text-[#4c55a4] dark:text-indigo-400 block mb-1">
                      Quick Demo Candidate Pre-fill:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAmbFormData({
                          name: "Sara Klein",
                          email: "sara@shabosrent.com",
                          phone: "0541112233",
                          password: "password123",
                          recruitmentCode: "MOSHE50",
                        })
                      }
                      className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 rounded font-semibold text-[11px] text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
                    >
                      Pre-fill Candidate "Sara Klein"
                    </button>
                  </div>

                  {ambError && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium">
                      {ambError}
                    </div>
                  )}

                  <form onSubmit={handleAmbassadorSubmit} className="mt-6 space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sara Klein"
                        value={ambFormData.name}
                        onChange={(e) => setAmbFormData({ ...ambFormData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="sara@example.com"
                        value={ambFormData.email}
                        onChange={(e) => setAmbFormData({ ...ambFormData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="054-111-2233"
                        value={ambFormData.phone}
                        onChange={(e) => setAmbFormData({ ...ambFormData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={ambFormData.password}
                        onChange={(e) => setAmbFormData({ ...ambFormData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Recruiter Code (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. MOSHE50"
                        value={ambFormData.recruitmentCode}
                        onChange={(e) => setAmbFormData({ ...ambFormData, recruitmentCode: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2 cursor-pointer"
                    >
                      Apply for Ambassador Partner Account
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          <p className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <DevSimulatorBar />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-zinc-500 font-medium text-sm">Loading...</div>}>
      <SignupFormContent />
    </Suspense>
  );
}
