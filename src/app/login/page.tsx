"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login logic
    setTimeout(() => {
      if (email.toLowerCase() === "admin@shabbosrent.com") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Image/Graphic Section (Formerly Right) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-zinc-900 overflow-hidden">
          {/* Real Background Image */}
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            alt="Beautiful luxury apartment interior"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Slight grey tint & gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-zinc-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent"></div>

          {/* Premium Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-20 z-10">
            {/* Logo */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl mb-8 border border-white/20">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                ShabbosRent.
              </span>
            </h1>
            <p className="text-lg text-zinc-200 max-w-lg font-medium leading-relaxed">
              The premier platform for discovering and managing premium short-term rentals in Israel's most beautiful neighborhoods.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section (Formerly Left) */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 border-l border-zinc-100 dark:border-zinc-900 z-10 bg-white dark:bg-black">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">ShabbosRent</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
              Enter your details to access your account.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Email address</label>
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
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Password</label>
                  <a href="#" className="text-[13px] font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                    Forgot password?
                  </a>
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-4 py-3.5 text-sm font-bold text-white dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-zinc-900/10 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-black px-4 text-zinc-500 dark:text-zinc-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 transition-all shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Google
                </button>
                <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/10 transition-all shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                  <svg className="h-5 w-5 dark:fill-white" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.365 7.043c-.87-.042-2.023.513-2.613 1.248-.545.67-.978 1.636-.8 2.534.965.048 2.052-.527 2.62-1.25.553-.702.973-1.644.793-2.532zM17.11 10.742c-1.42.028-2.673 1.018-3.418 1.018-.737 0-1.874-.9-3.08-.875-1.57.032-3.024.912-3.834 2.32-.193.336-1.748 3.12-.51 5.922 1.3 2.94 3.02 5.176 4.96 5.143 1.155-.02 1.606-.723 3.013-.723 1.408 0 1.83.723 3.033.7 2.12-.04 3.655-2.09 4.79-3.738.995-1.436 1.408-2.83 1.432-2.905-.03-.01-2.732-1.045-2.77-4.17-.03-2.612 2.13-3.856 2.228-3.91-1.233-1.802-3.144-2.046-3.844-2.082z" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link href="/" className="font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
