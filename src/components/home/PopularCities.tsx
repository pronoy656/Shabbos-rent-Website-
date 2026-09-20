"use client";

import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePopularCities } from "@/hooks/useApartmentHistory";

// Curated high-quality static city landscape photos
const staticCityImages: Record<string, string> = {
  jerusalem: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop",
  "tel aviv": "https://images.unsplash.com/photo-1544971587-b842c27f8e14?q=80&w=800&auto=format&fit=crop",
  "tel-aviv": "https://images.unsplash.com/photo-1544971587-b842c27f8e14?q=80&w=800&auto=format&fit=crop",
  tzfat: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
  safed: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
  "bnei brak": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
  "bnei-brak": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
  "beit shemesh": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
  "beit-shemesh": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
  "modiin illit": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
  "modiin-illit": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
  netanya: "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=800&auto=format&fit=crop",
  haifa: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
};

export default function PopularCities() {
  const { t, language } = useLanguage();
  const { data: apiPopularCities, isLoading } = usePopularCities(5);

  const isHebrew = language === "HE";

  // Translate city names if translation key is available
  const getCityDisplayName = (cityName: string) => {
    const lower = cityName.toLowerCase().trim();
    if (lower.includes("jerusalem") || lower.includes("ירושלים")) return t("search_widget.jerusalem") || "Jerusalem";
    if (lower.includes("tel aviv") || lower.includes("תל אביב")) return isHebrew ? "תל אביב" : "Tel Aviv";
    if (lower.includes("tzfat") || lower.includes("safed") || lower.includes("צפת")) return t("search_widget.tzfat") || "Tzfat";
    if (lower.includes("bnei brak") || lower.includes("בני ברק")) return t("popular_cities.bnei_brak") || "Bnei Brak";
    if (lower.includes("beit shemesh") || lower.includes("בית שמש")) return t("popular_cities.beit_shemesh") || "Beit Shemesh";
    if (lower.includes("modiin") || lower.includes("מודיעין עילית")) return t("popular_cities.modiin_illit") || "Modi'in Illit";
    return cityName;
  };

  // Get static representative image for the city (never user apartment uploaded images)
  const getStaticImage = (cityName: string) => {
    const key = cityName.toLowerCase().trim();
    if (key.includes("jerusalem") || key.includes("ירושלים")) return staticCityImages["jerusalem"];
    if (key.includes("tel aviv") || key.includes("tel-aviv") || key.includes("תל אביב")) return staticCityImages["tel aviv"];
    if (key.includes("tzfat") || key.includes("safed") || key.includes("צפת")) return staticCityImages["tzfat"];
    if (key.includes("bnei brak") || key.includes("bnei-brak") || key.includes("בני ברק")) return staticCityImages["bnei brak"];
    if (key.includes("beit shemesh") || key.includes("beit-shemesh") || key.includes("בית שמש")) return staticCityImages["beit shemesh"];
    if (key.includes("modiin") || key.includes("מודיעין")) return staticCityImages["modiin illit"];
    if (key.includes("netanya") || key.includes("נתניה")) return staticCityImages["netanya"];
    if (key.includes("haifa") || key.includes("חיפה")) return staticCityImages["haifa"];

    return staticCityImages[key] || staticCityImages["jerusalem"];
  };

  // Only render cities returned by the backend Popular Cities API
  const items = (apiPopularCities || []).map((item) => ({
    city: item.city,
    displayName: getCityDisplayName(item.city),
    count: item.apartmentCount ?? 0,
    image: getStaticImage(item.city),
  }));

  // Format exact listing label dynamically (e.g. "1 listing", "0 listings", "5 listings")
  const getListingLabel = (count: number) => {
    if (isHebrew) {
      return count === 1 ? "דירה 1" : `${count} דירות`;
    }
    return count === 1 ? "1 listing" : `${count} listings`;
  };

  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 pb-20 font-sans">
      <div className="relative mb-8 text-center flex flex-col items-center justify-center min-h-[60px]">
        <h2 className="text-[32px] font-extrabold text-[#0B1536] dark:text-white mb-1 tracking-tight">
          {t("popular_cities.title")}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          {t("popular_cities.subtitle")}
        </p>
        <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-[#4c55a4] dark:text-indigo-400 text-sm font-bold bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>{t("popular_cities.view_all")}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[240px] rounded-[20px] bg-zinc-200 dark:bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 lg:gap-5 ${
          items.length === 1
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-sm sm:max-w-none"
            : items.length === 2
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : items.length === 3
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            : items.length === 4
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        }`}>
          {items.map((city, idx) => (
            <Link
              key={idx}
              href={`/search?city=${encodeURIComponent(city.city)}`}
              className="group relative h-[240px] rounded-[20px] overflow-hidden block bg-transparent p-[3px] hover:shadow-xl transition-all duration-300"
            >
              {/* Animated Border Background (Visible on Hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#8b5cf6_33%,#ec4899_66%,#e4e4e7_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#8b5cf6_33%,#ec4899_66%,#27272a_100%)]" />
              </div>

              {/* Inner Content Container */}
              <div className="relative w-full h-full rounded-[17px] overflow-hidden z-10 bg-zinc-100 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={city.image}
                  alt={city.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1536]/90 via-[#0b1536]/30 to-transparent pointer-events-none" />

                {/* Top Badge: Exact Real Listing Count (e.g. 1 listing or 0 listings) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                    <Building2 className="w-3 h-3 text-indigo-300" />
                    <span>{getListingLabel(city.count)}</span>
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-sm truncate">
                      {city.displayName}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-sm opacity-90 group-hover:opacity-100 group-hover:bg-[#4c55a4] group-hover:text-white transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 text-[#4c55a4] group-hover:text-white rtl:rotate-180 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
