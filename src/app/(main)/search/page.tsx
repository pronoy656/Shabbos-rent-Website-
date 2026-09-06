"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import MainFooter from "@/components/layout/MainFooter";
import FilterSidebar from "@/components/search/FilterSidebar";
import ApartmentCard from "@/components/search/ApartmentCard";
import SearchWidget, { SearchFilters } from "@/components/home/SearchWidget";
import { mockApartments } from "@/data/mockData";
import { ApartmentData } from "@/types";
import { SlidersHorizontal, Search, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getCoordinatesForAddress, calculateWalkingMinutes } from "@/utils/distanceUtils";

const ITEMS_PER_PAGE = 30;

function SearchContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city") || "";
  const typeParam = searchParams.get("type") === "swap" ? "swap" : "rent";

  const [dummyVisible, setDummyVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxWalkingMinutes, setMaxWalkingMinutes] = useState<number | undefined>(undefined);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    activeTab: typeParam,
    city: cityParam,
    neighborhood: "",
    walkingTime: "10",
    weekend: "",
    rooms: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    destinationAddress: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasListing = localStorage.getItem("hasUserListing") === "true";
      const isVisible = localStorage.getItem("isApartmentVisible") !== "false";
      setDummyVisible(hasListing && isVisible);
    }
  }, []);

  const handleAmenityToggle = (amenityKey: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey) ? prev.filter((a) => a !== amenityKey) : [...prev, amenityKey]
    );
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedAmenities([]);
    setMaxWalkingMinutes(undefined);
    setCurrentPage(1);
  };

  // Build apartment dataset
  const allApartments: ApartmentData[] = dummyVisible
    ? [
        {
          id: "dummy",
          title: "Bright luxury apartment in city center",
          location: "City Center, Jerusalem",
          address: "Jaffa St 40, City Center, Jerusalem",
          city: "Jerusalem",
          neighborhood: "City Center",
          lat: 31.7820,
          lng: 35.2190,
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
          price: 1500,
          rating: 5.0,
          reviews: 0,
          beds: 4,
          baths: 2,
          guests: 8,
          isSwapAvailable: true,
          verified: false,
          availabilityStatus: "available",
          amenities: ["WiFi", "Air Conditioning", "Parking", "Kosher Kitchen", "Washing Machine", "Balcony"],
        },
        ...mockApartments,
      ]
    : mockApartments;

  // Process filters
  const isTargetDestinationSet = Boolean(filters.destinationAddress && filters.destinationAddress.trim().length > 0);

  const processedApartments = allApartments.filter((apt) => {
    // 1. Swap mode check
    if (filters.activeTab === "swap" && !apt.isSwapAvailable) {
      return false;
    }

    // 2. Destination Address & Walking Time
    if (isTargetDestinationSet) {
      if (filters.walkingTime) {
        const destCoords = getCoordinatesForAddress(filters.destinationAddress);
        const aptLat = apt.lat ?? 31.7725;
        const aptLng = apt.lng ?? 35.2136;
        const walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
        const maxWalking = parseInt(filters.walkingTime, 10);
        if (!isNaN(maxWalking) && walkingMins > maxWalking + 10) {
          return false;
        }
      }
    } else {
      // 3. City & Neighborhood (only active when destination is not set)
      if (filters.city) {
        const locLower = apt.location.toLowerCase();
        if (filters.city === "jerusalem" && !locLower.includes("jerusalem")) return false;
        if (filters.city === "tel-aviv" && !locLower.includes("tel aviv")) return false;
        if (filters.city === "tzfat" && !locLower.includes("tzfat")) return false;
      }
      if (filters.neighborhood && filters.neighborhood !== "any") {
        const locLower = apt.location.toLowerCase();
        if (filters.neighborhood === "rehavia" && !locLower.includes("rehavia")) return false;
        if (filters.neighborhood === "geula" && !locLower.includes("geula")) return false;
        if (filters.neighborhood === "bakat" && !locLower.includes("baka")) return false;
      }
    }

    // 4. Price Range (Rent mode: both Min & Max optional)
    if (filters.activeTab === "rent") {
      const min = filters.minPrice.trim() !== "" ? parseFloat(filters.minPrice) : null;
      const max = filters.maxPrice.trim() !== "" ? parseFloat(filters.maxPrice) : null;
      if (min !== null && !isNaN(min) && apt.price < min) return false;
      if (max !== null && !isNaN(max) && apt.price > max) return false;
    }

    // 5. Rooms
    if (filters.rooms && filters.rooms !== "any") {
      const minRooms = parseInt(filters.rooms, 10);
      if (!isNaN(minRooms) && (apt.beds || 0) < minRooms) return false;
    }

    // 6. Guests
    if (filters.guests && filters.guests !== "any") {
      const minGuests = parseInt(filters.guests, 10);
      if (!isNaN(minGuests) && (apt.guests || 0) < minGuests) return false;
    }

    // 7. Left Sidebar: Amenities
    if (selectedAmenities.length > 0) {
      const aptAmenities = apt.amenities || [];
      const hasAll = selectedAmenities.every((amenity) => aptAmenities.includes(amenity));
      if (!hasAll) return false;
    }

    // 8. Left Sidebar: Max Walking Minutes (general proximity filter)
    if (maxWalkingMinutes !== undefined) {
      const destCoords = isTargetDestinationSet
        ? getCoordinatesForAddress(filters.destinationAddress)
        : { lat: 31.7745, lng: 35.2150 };
      const aptLat = apt.lat ?? 31.7725;
      const aptLng = apt.lng ?? 35.2136;
      const walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
      if (walkingMins > maxWalkingMinutes) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(processedApartments.length / ITEMS_PER_PAGE) || 1;
  const currentApartments = processedApartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formattedCity = filters.city ? filters.city.replace("-", " ") : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col justify-between">
      <div>
        <MainNavbar />
        
        {/* Top: Home Page Search Widget Layout */}
        <div className="container mx-auto px-4 pt-6">
          <SearchWidget 
            isSearchPage={true}
            initialCity={cityParam}
            initialType={typeParam}
            hideResults={true}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8">
          {/* Header Bar with Count & Map Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white capitalize tracking-tight">
                {filters.activeTab === "swap" ? t("search_widget.swap_matches") : t("search_page.search_results")} {formattedCity ? `${t("search_page.in")} ${formattedCity}` : ""}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mt-1">
                {processedApartments.length} {filters.activeTab === "swap" ? t("search_page.properties_swap") : t("search_page.places_stay")} {t("search_page.for_shabbos")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors lg:hidden shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#4c55a4]" />
                <span>{t("search_page.filters")}</span>
                {selectedAmenities.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#4c55a4] text-white text-xs flex items-center justify-center font-bold">
                    {selectedAmenities.length}
                  </span>
                )}
              </button>

              {/* Map Toggle Button */}
              <button 
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold text-sm rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                <span>{showMap ? t("search_widget.hide_map") : t("search_widget.show_on_map")}</span>
              </button>
            </div>
          </div>

          {/* Interactive Map */}
          {showMap && (
            <div className="w-full h-[380px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden mb-8 border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300 shadow-sm">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=en&amp;q=Jerusalem+(Jerusalem)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                className="w-full h-full grayscale-[10%] contrast-[1.1] dark:invert-[90%] dark:hue-rotate-180"
                title="Apartments Map"
              />
            </div>
          )}

          {/* 2-Column Layout: Left FilterSidebar (3 cols) + Right Apartment Cards (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterSidebar 
                selectedAmenities={selectedAmenities}
                maxWalkingMinutes={maxWalkingMinutes}
                onAmenityToggle={handleAmenityToggle}
                onMaxWalkingMinutesChange={setMaxWalkingMinutes}
                onClearFilters={handleClearAllFilters}
              />
            </div>

            {/* Right Main Area (Apartments Grid) */}
            <div className="lg:col-span-9">
              {processedApartments.length === 0 ? (
                <div className="flex flex-col items-center pt-12 pb-16 px-4 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[350px]">
                  <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                    <Search className="w-8 h-8 text-[#4c55a4] dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
                    {t("search_page.no_apartments")}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto mb-8 text-sm">
                    {t("search_page.no_apartments_desc1")} {formattedCity ? 
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{t("search_page.for")} &quot;{formattedCity}&quot;</span> : 
                      t("search_page.criteria")
                    }. {t("search_page.no_apartments_desc2")}
                  </p>
                  <button 
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl transition-colors shadow-md shadow-[#4c55a4]/20 text-sm"
                  >
                    {t("search_page.view_all")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentApartments.map((apt) => {
                      let walkingMins: number | undefined = undefined;
                      if (isTargetDestinationSet) {
                        const destCoords = getCoordinatesForAddress(filters.destinationAddress);
                        const aptLat = apt.lat ?? 31.7725;
                        const aptLng = apt.lng ?? 35.2136;
                        walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
                      }
                      return (
                        <ApartmentCard 
                          key={apt.id} 
                          apartment={apt}
                          mode={filters.activeTab}
                          walkingMinutes={walkingMins}
                          targetDestinationText={filters.destinationAddress.trim() || undefined}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600 dark:text-zinc-400 shadow-sm"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            currentPage === pageNum
                              ? "bg-[#4c55a4] text-white shadow-md shadow-[#4c55a4]/20"
                              : "border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600 dark:text-zinc-400 shadow-sm"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-10">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white">{t("search_page.filters")}</span>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar 
                selectedAmenities={selectedAmenities}
                maxWalkingMinutes={maxWalkingMinutes}
                onAmenityToggle={handleAmenityToggle}
                onMaxWalkingMinutesChange={setMaxWalkingMinutes}
                onClearFilters={handleClearAllFilters}
              />
              <div className="mt-6">
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#4c55a4] to-[#6b75c8] text-white rounded-xl font-extrabold shadow-md shadow-[#4c55a4]/20"
                >
                  Show Results ({processedApartments.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MainFooter />
    </div>
  );
}

export default function SearchPage() {
  const { t } = useLanguage();
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 font-medium">
          {t("search_page.loading")}
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
