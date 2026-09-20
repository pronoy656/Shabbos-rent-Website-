"use client";

import { useState, useEffect, useMemo } from "react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { IRecentlyViewedApartment } from "@/types/apartment.types";
import { useLanguage } from "@/context/LanguageContext";
import { useRecentlyViewed, useClearRecentlyViewed } from "@/hooks/useApartmentHistory";
import { Clock, Trash2, ArrowRight, Compass, LogIn, Loader2, Sparkles, Building } from "lucide-react";
import Link from "next/link";

function mapRecentApartment(apt: IRecentlyViewedApartment): ApartmentData {
  return {
    id: apt.id,
    propertyId: apt.propertyId || undefined,
    userId: apt.userId,
    title: apt.title,
    description: apt.description || undefined,
    city: apt.city,
    neighborhood: apt.neighborhood,
    street1: apt.street1 || undefined,
    street2: apt.street2 || undefined,
    lat: apt.lat ?? undefined,
    lng: apt.lng ?? undefined,
    propertyType: apt.propertyType,
    bedrooms: apt.bedrooms,
    beds: apt.bedrooms,
    bathrooms: apt.bathrooms,
    baths: apt.bathrooms,
    maxGuest: apt.maxGuest,
    guests: apt.maxGuest,
    pricePerShabbat: apt.pricePerShabbat,
    price: apt.pricePerShabbat,
    amenities: apt.amenities || [],
    coverImage: apt.coverImage || (apt.images && apt.images.length > 0 ? apt.images[0] : undefined),
    image: apt.coverImage || (apt.images && apt.images.length > 0 ? apt.images[0] : undefined),
    images: apt.images,
    phoneNumber: apt.phoneNumber || undefined,
    whatsApp: apt.whatsApp || undefined,
    status: apt.status,
    averageRating: apt.averageRating,
    rating: apt.averageRating,
    totalReviews: apt.totalReviews,
    upcomingAvailability: apt.upcomingAvailability,
    user: apt.user,
    location: `${apt.neighborhood || ""}, ${apt.city || ""}`.replace(/^,\s*|,\s*$/g, ""),
  };
}

export default function RecentlyViewedSection() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [localCleared, setLocalCleared] = useState(false);

  const isHebrew = language === "HE";

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("userRole");
      setIsLoggedIn(Boolean(token || userRole));
    }
  }, []);

  const { data: recentData, isLoading } = useRecentlyViewed(1, 4, isLoggedIn && !localCleared);
  const clearHistoryMutation = useClearRecentlyViewed();

  const handleClearHistory = async () => {
    try {
      setIsClearing(true);
      await clearHistoryMutation.mutateAsync();
      setLocalCleared(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem("recently_viewed_apartments");
      }
    } catch (err) {
      console.error("Failed to clear browsing history:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const apiItems = useMemo(() => {
    if (localCleared) return [];
    if (recentData?.data && Array.isArray(recentData.data)) {
      return recentData.data.map(mapRecentApartment);
    }
    return [];
  }, [recentData, localCleared]);

  const hasViewHistory = apiItems.length > 0;

  if (!isMounted) return null;

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
              {hasViewHistory
                ? isHebrew
                  ? "חזור בקלות לדירות שבדקת לאחרונה לקראת השבת הקרובה"
                  : "Quickly return to properties you inspected for upcoming Shabbatot."
                : isHebrew
                  ? "כאן יוצגו הדירות שתצפה בהן במהלך הגלישה באתר"
                  : "Listings you browse across Israel will automatically appear here."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {hasViewHistory && isLoggedIn && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer disabled:opacity-50"
                title="Clear your browsing history"
              >
                {isClearing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
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

        {/* Content: Loading Skeleton / Real Items / Empty State */}
        {isLoading && isLoggedIn && !localCleared ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse border border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>
        ) : hasViewHistory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiItems.slice(0, 4).map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        ) : !isLoggedIn ? (
          /* Not Logged In Empty State */
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50/50 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-900/60 p-10 md:p-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4c55a4]/10 dark:bg-indigo-500/20 text-[#4c55a4] dark:text-indigo-400 mb-5 shadow-inner">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
              {isHebrew ? "התחבר כדי לשמור היסטוריית צפייה" : "Sign in to Track Your Shabbat Browsing"}
            </h3>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
              {isHebrew
                ? "התחבר לחשבונך כדי לראות את כל הדירות שבדקת ולחזור אליהן בקלות בכל עת."
                : "Log in to view all apartments you've recently explored and resume your Shabbat search seamlessly."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login?redirect=/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4c55a4] hover:bg-[#3d4484] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isHebrew ? "התחברות" : "Log In"}</span>
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#4c55a4]" />
                <span>{isHebrew ? "עיין בדירות" : "Browse Apartments"}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Logged In - No History Empty State */
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50/50 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-900/60 p-10 md:p-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#4c55a4] dark:text-indigo-400 mb-5 shadow-inner">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
              {isHebrew ? "אין דירות שנצפו לאחרונה" : "No Recently Viewed Apartments Yet"}
            </h3>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
              {isHebrew
                ? "טרם צפית בדירות. התחל לחפש דירות בירושלים, בני ברק, צפת ועוד כדי לראותן כאן."
                : "You haven't viewed any apartments yet. Start exploring listings in Jerusalem, Bnei Brak, Tzfat, and more to see them here."}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4c55a4] hover:bg-[#3d4484] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>{isHebrew ? "התחל לחפש דירות" : "Start Exploring Listings"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
