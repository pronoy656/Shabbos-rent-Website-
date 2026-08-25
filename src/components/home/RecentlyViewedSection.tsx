"use client";

import { useState, useEffect } from "react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Clock, Trash2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// Fallback recommended apartments if recently viewed list is empty
const defaultFallbackApartments: ApartmentData[] = [
  { 
    id: "jr-1", 
    title: "Historic Stone House in Old City", 
    location: "Jerusalem, Israel", 
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", 
    price: 4500, 
    rating: 4.9, 
    reviews: 150, 
    beds: 4, 
    baths: 3, 
    guests: 10, 
    isSwapAvailable: false, 
    verified: true, 
    availabilityStatus: "available" 
  },
  { 
    id: "ta-1", 
    title: "Luxury Penthouse near Beach", 
    location: "Tel Aviv, Israel", 
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", 
    price: 4000, 
    rating: 4.9, 
    reviews: 120, 
    beds: 3, 
    baths: 2, 
    guests: 6, 
    isSwapAvailable: true, 
    verified: true, 
    availabilityStatus: "available" 
  },
  { 
    id: "tz-1", 
    title: "Artistic Villa with Mountain Views", 
    location: "Tzfat, Israel", 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", 
    price: 3000, 
    rating: 4.9, 
    reviews: 105, 
    beds: 4, 
    baths: 2, 
    guests: 8, 
    isSwapAvailable: true, 
    verified: true, 
    availabilityStatus: "available" 
  },
  { 
    id: "jr-3", 
    title: "Elegant Residence with Panoramic View", 
    location: "Jerusalem, Israel", 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", 
    price: 5000, 
    rating: 4.8, 
    reviews: 110, 
    beds: 5, 
    baths: 4, 
    guests: 12, 
    isSwapAvailable: true, 
    verified: true, 
    availabilityStatus: "unavailable_upcoming" 
  },
];

export default function RecentlyViewedSection() {
  const { language } = useLanguage();
  const [recentlyViewed, setRecentlyViewed] = useState<ApartmentData[]>([]);
  const [isHistoryCleared, setIsHistoryCleared] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isHebrew = language === "HE";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole");
      if (userRole) {
        setIsLoggedIn(true);
        try {
          const storedStr = localStorage.getItem("recently_viewed_apartments");
          if (storedStr) {
            const parsed = JSON.parse(storedStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRecentlyViewed(parsed);
            }
          }
        } catch (err) {
          console.error("Error loading recently viewed apartments:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoaded(true);
    }
  }, []);

  const handleClearHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("recently_viewed_apartments");
    }
    setRecentlyViewed([]);
    setIsHistoryCleared(true);
  };

  const displayList = recentlyViewed.length > 0 ? recentlyViewed : defaultFallbackApartments;
  const isUsingFallback = recentlyViewed.length === 0;

  if (!isLoaded || !isLoggedIn) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-950 font-sans border-t border-zinc-100 dark:border-zinc-900">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#4c55a4] dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>{isHebrew ? "היסטוריית צפייה" : "YOUR BROWSING HISTORY"}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {isHebrew ? "דירות שנצפו לאחרונה" : "Recently Viewed Apartments"}
            </h2>
            
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              {isUsingFallback
                ? isHebrew
                  ? "הנה כמה מהדירות המומלצות והפופולריות ביותר לשבת"
                  : "Explore popular Shabbat listings or return to apartments you've inspected."
                : isHebrew
                  ? "חזור בקלות לדירות שבדקת לאחרונה לקראת השבת הקרובה"
                  : "Quickly return to properties you inspected for upcoming Shabbatot."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {!isUsingFallback && (
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                title="Clear your browsing history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHebrew ? "נקה היסטוריה" : "Clear History"}</span>
              </button>
            )}

            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4c55a4] hover:bg-[#3d4484] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>{isHebrew ? "לכל הדירות" : "Explore All"}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.slice(0, 4).map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </div>
    </section>
  );
}
