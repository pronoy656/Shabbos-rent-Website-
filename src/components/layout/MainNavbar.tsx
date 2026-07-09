"use client";

import Link from "next/link";
import { User, Menu } from "lucide-react";

export default function MainNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* A simple placeholder logo icon similar to the design */}
          <div className="flex -space-x-1">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                S
             </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            ShabbosRent
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</Link>
          <Link href="/search" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Search Apartments</Link>
          <Link href="#" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Swap Apartments</Link>
          <Link href="#" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Weekends</Link>
          <Link href="#" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/list"
            className="px-4 py-2.5 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            List Your Apartment
          </Link>
          <Link 
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            <User className="w-4 h-4 text-zinc-500" />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
