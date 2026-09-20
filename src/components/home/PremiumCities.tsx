"use client";

import { useMemo } from "react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { IApartmentCard, ICityApartmentGroup } from "@/types/apartment.types";
import { useLanguage } from "@/context/LanguageContext";
import { useApartmentsByCities } from "@/hooks/useApartments";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function mapCardToApartmentData(apt: IApartmentCard): ApartmentData {
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

export default function PremiumCities() {
  const { t, language } = useLanguage();
  const isHebrew = language === "HE";

  // Fetch real grouped apartments by cities from backend API
  const { data: cityGroups, isLoading } = useApartmentsByCities(3, 4);

  // Filter groups that have available apartments
  const activeGroups = useMemo(() => {
    if (!cityGroups || !Array.isArray(cityGroups)) return [];
    return cityGroups.filter(
      (group) => group.apartments && group.apartments.length > 0
    );
  }, [cityGroups]);

  const getCityTitle = (cityName: string) => {
    const lower = cityName.toLowerCase().trim();
    if (lower.includes("jerusalem") || lower.includes("ירושלים")) {
      return t("premium_cities.available_jerusalem") || `Available for ${cityName}`;
    }
    if (lower.includes("tel aviv") || lower.includes("תל אביב")) {
      return t("premium_cities.available_tel_aviv") || `Available for ${cityName}`;
    }
    if (lower.includes("tzfat") || lower.includes("safed") || lower.includes("צפת")) {
      return t("premium_cities.available_tzfat") || `Available for ${cityName}`;
    }
    return isHebrew ? `דירות זמינות ב${cityName}` : `Available for ${cityName}`;
  };

  const getAccentColor = (cityName: string) => {
    const lower = cityName.toLowerCase().trim();
    if (lower.includes("jerusalem") || lower.includes("ירושלים")) return "bg-[#e8c547]";
    if (lower.includes("tel aviv") || lower.includes("תל אביב")) return "bg-[#4c55a4]";
    if (lower.includes("tzfat") || lower.includes("safed") || lower.includes("צפת")) return "bg-[#10b981]";
    return "bg-[#4c55a4]";
  };

  const getTagColor = (cityName: string) => {
    const lower = cityName.toLowerCase().trim();
    if (lower.includes("jerusalem") || lower.includes("ירושלים")) return "text-[#e8c547]";
    if (lower.includes("tel aviv") || lower.includes("תל אביב")) return "text-[#4c55a4]";
    if (lower.includes("tzfat") || lower.includes("safed") || lower.includes("צפת")) return "text-[#10b981]";
    return "text-[#4c55a4]";
  };

  if (!isLoading && activeGroups.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fafafa] dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            {t("premium_cities.title")}
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            {t("premium_cities.subtitle")}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-8 w-60 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Dynamic City Sections */
          <div className="space-y-16">
            {activeGroups.map((group) => {
              const queryCity = group.city.toLowerCase().replace(/\s+/g, "-");
              const searchUrl = `/search?city=${encodeURIComponent(queryCity)}`;
              const accentBg = getAccentColor(group.city);
              const tagColor = getTagColor(group.city);
              const title = getCityTitle(group.city);

              return (
                <div key={group.city} className="space-y-6">
                  {/* City Section Header */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-8 h-1 ${accentBg} rounded-full`}></span>
                        <span className={`text-sm font-bold tracking-widest uppercase ${tagColor}`}>
                          {t("premium_cities.premium_city")}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {title}
                      </h3>
                    </div>

                    <Link
                      href={searchUrl}
                      className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
                    >
                      <span>{t("premium_cities.view_all")} {group.totalApartments}</span>
                      <span className="ml-[2px]">+</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>

                  {/* Apartments Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {group.apartments.map((apt) => (
                      <ApartmentCard
                        key={apt.id}
                        apartment={mapCardToApartmentData(apt)}
                      />
                    ))}
                  </div>

                  {/* Mobile View All Button */}
                  <Link
                    href={searchUrl}
                    className="md:hidden mt-6 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
                  >
                    <span>
                      {t("premium_cities.view_all")} {group.totalApartments}+ {isHebrew ? `ב${group.city}` : `in ${group.city}`}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
