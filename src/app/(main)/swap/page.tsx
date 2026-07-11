"use client";

import { useState } from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import ApartmentCard, { ApartmentData } from "@/components/search/ApartmentCard";
import { ArrowRightLeft, Search, PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock Data for Swap Apartments
const swapApartments: ApartmentData[] = [
  {
    id: "s1",
    title: "Beautiful Apartment in Jerusalem for Swap",
    location: "Rehavia, Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 0, // Swaps might not have a price, but ApartmentCard needs it or we can just say 0
    rating: 4.9,
    reviews: 45,
    beds: 4,
    baths: 3,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "s2",
    title: "Charming Apartment in Baka",
    location: "Baka, Jerusalem",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    price: 0,
    rating: 5.0,
    reviews: 32,
    beds: 5,
    baths: 4,
    guests: 10,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "s3",
    title: "Modern Duplex near the Kotel",
    location: "Jewish Quarter, Jerusalem",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
    price: 0,
    rating: 4.8,
    reviews: 65,
    beds: 4,
    baths: 2,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "s4",
    title: "City Center Studio for Weekend Swap",
    location: "Nachlaot, Jerusalem",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    price: 0,
    rating: 4.5,
    reviews: 80,
    beds: 1,
    baths: 1,
    guests: 2,
    isSwapAvailable: true,
    verified: false,
  },
];

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800 pt-16 pb-12 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-purple-100/50 dark:bg-purple-900/10 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-6 border border-blue-200 dark:border-blue-800/50">
              <Sparkles className="w-4 h-4" />
              <span>Community Swaps</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
              Swap your apartment for <span className="text-blue-600 dark:text-blue-400">Shabbos</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-10 max-w-2xl mx-auto">
              Experience different neighborhoods and cities without spending a dime. Connect with trusted members of the community to arrange mutually beneficial weekend apartment swaps.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20">
                <Search className="w-5 h-5" />
                Find Swaps
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl font-bold transition-all shadow-sm">
                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                List for Swap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Available Swaps
          </h2>
          <Link href="/search?swap=true" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
            View all swaps
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {swapApartments.map((apt) => (
            <ApartmentCard key={apt.id} apartment={apt} />
          ))}
        </div>

        {/* How it works Banner */}
        <div className="mt-20 bg-blue-600 dark:bg-blue-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl shadow-blue-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-4">Ready to swap your apartment?</h2>
            <p className="text-blue-100 font-medium mb-8 text-lg">
              Join thousands of community members who are already enjoying cost-free weekends away through our trusted swap network.
            </p>
            <button className="px-8 py-3.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all shadow-lg">
              Get Started for Free
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
