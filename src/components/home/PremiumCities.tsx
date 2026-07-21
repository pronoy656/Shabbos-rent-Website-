"use client";

import { useState, useEffect } from "react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

// Mock Data
const telAvivApartments: ApartmentData[] = [
  { id: "ta-1", title: "Luxury Penthouse near Beach", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 4000, rating: 4.9, reviews: 120, beds: 3, baths: 2, guests: 6, isSwapAvailable: true, verified: true },
  { id: "ta-2", title: "Modern Studio in City Center", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2500, rating: 4.8, reviews: 85, beds: 1, baths: 1, guests: 2, isSwapAvailable: false, verified: true },
  { id: "ta-3", title: "Spacious Family Apartment", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price: 3200, rating: 4.7, reviews: 65, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false },
  { id: "ta-4", title: "Boutique Apartment with Sea View", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", price: 3800, rating: 5.0, reviews: 200, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: true },
];

const jerusalemApartments: ApartmentData[] = [
  { id: "jr-1", title: "Historic Stone House in Old City", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 4500, rating: 4.9, reviews: 150, beds: 4, baths: 3, guests: 10, isSwapAvailable: false, verified: true },
  { id: "jr-2", title: "Cozy Apartment near Mahane Yehuda", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2800, rating: 4.6, reviews: 90, beds: 2, baths: 1, guests: 5, isSwapAvailable: true, verified: false },
  { id: "jr-3", title: "Elegant Residence with Panoramic View", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 5000, rating: 4.8, reviews: 110, beds: 5, baths: 4, guests: 12, isSwapAvailable: true, verified: true },
  { id: "jr-4", title: "Modern Duplex in Rehavia", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", price: 3600, rating: 4.7, reviews: 75, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
];

const tzfatApartments: ApartmentData[] = [
  { id: "tz-1", title: "Artistic Villa with Mountain Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 3000, rating: 4.9, reviews: 105, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: true },
  { id: "tz-2", title: "Charming Old City Guest House", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2200, rating: 4.8, reviews: 60, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: false },
  { id: "tz-3", title: "Modern Cabin near the Forest", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 2800, rating: 4.7, reviews: 45, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
  { id: "tz-4", title: "Spacious Retreat with Galilee Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 3500, rating: 5.0, reviews: 130, beds: 5, baths: 3, guests: 10, isSwapAvailable: true, verified: true },
];

export default function PremiumCities() {
  const { t } = useLanguage();
  const [dummyVisible, setDummyVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasListing = localStorage.getItem("hasUserListing") === "true";
      const isVisible = localStorage.getItem("isApartmentVisible") !== "false";
      setDummyVisible(hasListing && isVisible);
    }
  }, []);

  const activeJerusalemApartments = dummyVisible 
    ? [
        { id: "dummy", title: "Bright luxury apartment in city center", location: "City Center, Jerusalem", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", price: 1500, rating: 5.0, reviews: 0, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false },
        ...jerusalemApartments
      ]
    : jerusalemApartments;

  return (
    <section className="py-16 bg-[#fafafa] dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4">
        
        {/* Header section (optional global title) */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            {t("premium_cities.title")}
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            {t("premium_cities.subtitle")}
          </p>
        </div>

        {/* Tel Aviv Section */}
        <div className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-1 bg-[#4c55a4] rounded-full"></span>
                <span className="text-sm font-bold tracking-widest uppercase text-[#4c55a4]">{t("premium_cities.premium_city")}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{t("premium_cities.available_tel_aviv")}</h3>
            </div>
            <a href="/search?city=tel-aviv" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
              {t("premium_cities.view_all")} 24<span className="ml-[2px]">+</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {telAvivApartments.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>

          <a href="/search?city=tel-aviv" className="md:hidden mt-6 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
            {t("premium_cities.view_all")} 24<span className="ml-[2px]">+</span> {t("premium_cities.in_tel_aviv")}
          </a>
        </div>

        {/* Jerusalem Section */}
        <div className="mb-10">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-1 bg-[#e8c547] rounded-full"></span>
                <span className="text-sm font-bold tracking-widest uppercase text-[#e8c547]">{t("premium_cities.premium_city")}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{t("premium_cities.available_jerusalem")}</h3>
            </div>
            <a href="/search?city=jerusalem" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
              {t("premium_cities.view_all")} 32<span className="ml-[2px]">+</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeJerusalemApartments.slice(0, 4).map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>

          <a href="/search?city=jerusalem" className="md:hidden mt-6 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
            {t("premium_cities.view_all")} 32<span className="ml-[2px]">+</span> {t("premium_cities.in_jerusalem")}
          </a>
        </div>

        {/* Tzfat Section */}
        <div className="mb-10">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-1 bg-[#10b981] rounded-full"></span>
                <span className="text-sm font-bold tracking-widest uppercase text-[#10b981]">{t("premium_cities.premium_city")}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{t("premium_cities.available_tzfat")}</h3>
            </div>
            <a href="/search?city=tzfat" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
              {t("premium_cities.view_all")} 18<span className="ml-[2px]">+</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tzfatApartments.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>

          <a href="/search?city=tzfat" className="md:hidden mt-6 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
            {t("premium_cities.view_all")} 18<span className="ml-[2px]">+</span> {t("premium_cities.in_tzfat")}
          </a>
        </div>

      </div>
    </section>
  );
}
