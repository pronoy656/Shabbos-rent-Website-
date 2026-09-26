"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import MainFooter from "@/components/layout/MainFooter";
import FilterSidebar from "@/components/search/FilterSidebar";
import ApartmentCard from "@/components/search/ApartmentCard";
import SearchWidget, { SearchFilters } from "@/components/home/SearchWidget";
import { ApartmentData } from "@/types";
import { ApartmentSearchParams } from "@/types/apartment.types";
import { useApartments } from "@/hooks/useApartments";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Search, MapPin, ChevronLeft, ChevronRight, X, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getCoordinatesForAddress, calculateWalkingMinutes } from "@/utils/distanceUtils";

const ApartmentMap = dynamic(() => import("@/components/search/ApartmentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-800 animate-pulse">
      Loading Google Map...
    </div>
  ),
});

const ITEMS_PER_PAGE = 12;

function normalizeCityParam(city: string): string {
  if (!city) return "";
  const clean = city.trim();
  const map: Record<string, string> = {
    "jerusalem": "Jerusalem",
    "tel-aviv": "Tel Aviv",
    "tel aviv": "Tel Aviv",
    "tzfat": "Tzfat",
    "bnei-brak": "Bnei Brak",
    "bnei brak": "Bnei Brak",
    "beit-shemesh": "Beit Shemesh",
    "beit shemesh": "Beit Shemesh",
    "modiin-illit": "Modiin Illit",
    "modiin illit": "Modiin Illit",
  };
  return map[clean.toLowerCase()] || clean;
}

function SearchContent() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial query params from URL
  const initialSearchTerm = searchParams.get("searchTerm") || searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";
  const initialNeighborhood = searchParams.get("neighborhood") || "";
  const initialType = searchParams.get("type") === "swap" ? "swap" : "rent";
  const initialPropertyType = searchParams.get("propertyType") || "";
  const initialBedrooms = searchParams.get("bedrooms") || searchParams.get("rooms") || "";
  const initialBathrooms = searchParams.get("bathrooms") || "";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialGuests = searchParams.get("guests") || searchParams.get("maxGuest") || "";
  const initialPage = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const initialAmenities = searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : [];
  const initialDestination = searchParams.get("targetDestination") || searchParams.get("destination") || searchParams.get("destinationAddress") || "";
  const initialWalkingTime = searchParams.get("walkingMinutes") || searchParams.get("walkingTime") || "10";
  const initialWeekend = searchParams.get("weekendId") || searchParams.get("weekend") || "any";
  const initialSortBy = searchParams.get("sortBy") || "createdAt";
  const initialSortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    initialPropertyType ? initialPropertyType.split(",") : []
  );
  const [selectedWeekend, setSelectedWeekend] = useState<string>(initialWeekend);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialAmenities);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [maxWalkingMinutes, setMaxWalkingMinutes] = useState<number | undefined>(undefined);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    activeTab: initialType,
    city: initialCity,
    neighborhood: initialNeighborhood,
    walkingTime: initialWalkingTime,
    weekend: initialWeekend,
    rooms: initialBedrooms,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    guests: initialGuests,
    destinationAddress: initialDestination,
  });

  // Keep URL query params synchronized with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm && searchTerm.trim() !== "") params.set("searchTerm", searchTerm.trim());
    if (filters.city) params.set("city", filters.city);
    if (filters.neighborhood && filters.neighborhood !== "any") params.set("neighborhood", filters.neighborhood);
    if (selectedPropertyTypes.length > 0) params.set("propertyType", selectedPropertyTypes.join(","));
    if (filters.rooms && filters.rooms !== "any") params.set("bedrooms", filters.rooms);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.guests && filters.guests !== "any") params.set("guests", filters.guests);
    if (filters.activeTab === "swap") params.set("type", "swap");
    if (selectedWeekend && selectedWeekend !== "any") params.set("weekendId", selectedWeekend);
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    if (filters.destinationAddress) {
      params.set("targetDestination", filters.destinationAddress);
      params.set("destinationAddress", filters.destinationAddress);
    }
    if (filters.walkingTime) {
      params.set("walkingMinutes", filters.walkingTime);
      params.set("walkingTime", filters.walkingTime);
    }
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  }, [
    searchTerm,
    filters,
    selectedPropertyTypes,
    selectedWeekend,
    selectedAmenities,
    sortBy,
    sortOrder,
    currentPage,
    pathname,
  ]);

  // Construct backend API search parameters
  const apiQueryParams: ApartmentSearchParams = useMemo(() => {
    const params: ApartmentSearchParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortBy,
      sortOrder,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      params.searchTerm = searchTerm.trim();
    }

    if (filters.city && filters.city.trim() !== "") {
      params.city = normalizeCityParam(filters.city);
    }

    if (filters.neighborhood && filters.neighborhood !== "any" && filters.neighborhood.trim() !== "") {
      params.neighborhood = filters.neighborhood.trim();
    }

    if (selectedPropertyTypes.length > 0) {
      params.propertyType = selectedPropertyTypes.join(",");
    }

    if (filters.rooms && filters.rooms !== "any" && filters.rooms.trim() !== "") {
      const bedroomsNum = parseInt(filters.rooms, 10);
      if (!isNaN(bedroomsNum)) params.bedrooms = bedroomsNum;
    }

    if (filters.minPrice && filters.minPrice.trim() !== "") {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) params.minPrice = min;
    }

    if (filters.maxPrice && filters.maxPrice.trim() !== "") {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) params.maxPrice = max;
    }

    if (filters.guests && filters.guests !== "any" && filters.guests.trim() !== "") {
      const guestsNum = parseInt(filters.guests, 10);
      if (!isNaN(guestsNum)) params.maxGuest = guestsNum;
    }

    if (selectedWeekend && selectedWeekend !== "any") {
      params.weekendId = selectedWeekend;
    }

    if (selectedAmenities.length > 0) {
      params.amenities = selectedAmenities.join(",");
    }

    if (filters.destinationAddress && filters.destinationAddress.trim() !== "") {
      params.targetDestination = filters.destinationAddress.trim();
      params.walkingMinutes = filters.walkingTime || "10";
      const destCoords = getCoordinatesForAddress(filters.destinationAddress);
      if (destCoords) {
        params.destLat = destCoords.lat;
        params.destLng = destCoords.lng;
      }
    }

    return params;
  }, [
    currentPage,
    searchTerm,
    filters.city,
    filters.neighborhood,
    filters.rooms,
    filters.minPrice,
    filters.maxPrice,
    filters.guests,
    filters.destinationAddress,
    filters.walkingTime,
    selectedPropertyTypes,
    selectedWeekend,
    selectedAmenities,
    sortBy,
    sortOrder,
  ]);

  // Live query from backend API
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useApartments(apiQueryParams);

  const rawApartments: ApartmentData[] = (apiResponse?.data as unknown as ApartmentData[]) || [];
  const meta = apiResponse?.meta;

  const handlePropertyTypeToggle = (typeKey: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(typeKey) ? prev.filter((t) => t !== typeKey) : [...prev, typeKey]
    );
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenityKey: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey) ? prev.filter((a) => a !== amenityKey) : [...prev, amenityKey]
    );
    setCurrentPage(1);
  };

  const handleWeekendChange = (weekend: string) => {
    setSelectedWeekend(weekend);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedPropertyTypes([]);
    setSelectedWeekend("any");
    setSelectedAmenities([]);
    setMaxWalkingMinutes(undefined);
    setSortBy("createdAt");
    setSortOrder("desc");
    setFilters({
      activeTab: "rent",
      city: "",
      neighborhood: "",
      walkingTime: "10",
      weekend: "",
      rooms: "",
      minPrice: "",
      maxPrice: "",
      guests: "",
      destinationAddress: "",
    });
    setCurrentPage(1);
  };

  // Additional client-side filtering for destination walking distance & swap mode
  const isTargetDestinationSet = Boolean(
    filters.destinationAddress && filters.destinationAddress.trim().length > 0
  );

  const processedApartments = useMemo(() => {
    return rawApartments.filter((apt) => {
      // Swap mode check
      if (filters.activeTab === "swap" && !apt.isSwapAvailable) {
        return false;
      }

      // Destination walking time fallback filter if API didn't compute distance
      if (isTargetDestinationSet && filters.walkingTime) {
        const destCoords = getCoordinatesForAddress(filters.destinationAddress);
        const aptLat = apt.lat ?? 31.7725;
        const aptLng = apt.lng ?? 35.2136;
        const walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
        const maxWalking = parseInt(filters.walkingTime, 10);
        if (!isNaN(maxWalking) && walkingMins > maxWalking + 10) {
          return false;
        }
      }

      // Max walking distance filter from sidebar
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
  }, [
    rawApartments,
    filters.activeTab,
    isTargetDestinationSet,
    filters.destinationAddress,
    filters.walkingTime,
    maxWalkingMinutes,
  ]);

  const totalResults = meta?.total ?? processedApartments.length;
  const totalPages = meta?.total
    ? Math.ceil(meta.total / (meta.limit || ITEMS_PER_PAGE))
    : Math.max(1, Math.ceil(processedApartments.length / ITEMS_PER_PAGE));

  const formattedCity = filters.city ? normalizeCityParam(filters.city) : "";

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters((prev) => {
      const isSame =
        prev.activeTab === newFilters.activeTab &&
        prev.city === newFilters.city &&
        prev.neighborhood === newFilters.neighborhood &&
        prev.walkingTime === newFilters.walkingTime &&
        prev.weekend === newFilters.weekend &&
        prev.rooms === newFilters.rooms &&
        prev.minPrice === newFilters.minPrice &&
        prev.maxPrice === newFilters.maxPrice &&
        prev.guests === newFilters.guests &&
        prev.destinationAddress === newFilters.destinationAddress;

      return isSame ? prev : newFilters;
    });
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col justify-between">
      <div>
        <MainNavbar />

        {/* Top: Search Widget Layout */}
        <div className="container mx-auto px-4 pt-6">
          <SearchWidget
            isSearchPage={true}
            initialCity={initialCity}
            initialType={initialType}
            hideResults={true}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8">
          {/* Header Bar with Count, Keyword Search, Sort & Map Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white capitalize tracking-tight">
                  {filters.activeTab === "swap" ? t("search_widget.swap_matches") : t("search_page.search_results")} {formattedCity ? `${t("search_page.in")} ${formattedCity}` : ""}
                </h1>
                {isFetching && (
                  <Loader2 className="w-5 h-5 text-[#4c55a4] animate-spin shrink-0" />
                )}
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mt-1">
                {isLoading ? "Loading apartments..." : `${totalResults} ${filters.activeTab === "swap" ? t("search_page.properties_swap") : t("search_page.places_stay")} ${t("search_page.for_shabbos")}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search title, street, ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-9 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>


              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors lg:hidden shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#4c55a4]" />
                <span>{t("search_page.filters")}</span>
                {(selectedAmenities.length > 0 || selectedPropertyTypes.length > 0) && (
                  <span className="w-5 h-5 rounded-full bg-[#4c55a4] text-white text-[10px] flex items-center justify-center font-bold">
                    {selectedAmenities.length + selectedPropertyTypes.length}
                  </span>
                )}
              </button>

              {/* Map Toggle Button */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center gap-2 h-11 px-5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold text-xs rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                <span>{showMap ? t("search_widget.hide_map") : t("search_widget.show_on_map")}</span>
              </button>
            </div>
          </div>

          {/* Free Interactive OpenStreetMap with Dynamic Apartment Markers */}
          {showMap && (
            <div className="mb-8 animate-in fade-in duration-300">
              <ApartmentMap
                apartments={processedApartments}
                markers={apiResponse?.markers || []}
                defaultCity={formattedCity || "Jerusalem"}
                height="390px"
              />
            </div>
          )}

          {/* 2-Column Layout: Left FilterSidebar (3 cols) + Right Apartment Cards (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterSidebar
                selectedPropertyTypes={selectedPropertyTypes}
                selectedWeekend={selectedWeekend}
                selectedAmenities={selectedAmenities}
                maxWalkingMinutes={maxWalkingMinutes}
                onPropertyTypeToggle={handlePropertyTypeToggle}
                onWeekendChange={handleWeekendChange}
                onAmenityToggle={handleAmenityToggle}
                onMaxWalkingMinutesChange={setMaxWalkingMinutes}
                onClearFilters={handleClearAllFilters}
              />
            </div>

            {/* Right Main Area (Apartments Grid) */}
            <div className="lg:col-span-9">
              {/* Error State */}
              {isError && (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl text-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">
                    Unable to load apartments
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400 max-w-md mb-4">
                    {(error as any)?.message || "An unexpected error occurred while fetching listings from the server."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}

              {/* Loading State Skeleton */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm"
                    >
                      <div className="h-56 bg-zinc-200 dark:bg-zinc-800" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
                        <div className="h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl" />
                        <div className="h-10 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : processedApartments.length === 0 ? (
                <div className="flex flex-col items-center pt-12 pb-16 px-4 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[350px]">
                  <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                    <Search className="w-8 h-8 text-[#4c55a4] dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
                    {t("search_page.no_apartments")}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto mb-8 text-sm">
                    {t("search_page.no_apartments_desc1")}{" "}
                    {formattedCity ? (
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {t("search_page.for")} &quot;{formattedCity}&quot;
                      </span>
                    ) : (
                      t("search_page.criteria")
                    )}
                    . {t("search_page.no_apartments_desc2")}
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
                    {processedApartments.map((apt) => {
                      let walkingMins: number | undefined = undefined;
                      if (isTargetDestinationSet) {
                        const destCoords = getCoordinatesForAddress(filters.destinationAddress);
                        const aptLat = apt.lat ?? 31.7725;
                        const aptLng = apt.lng ?? 35.2136;
                        walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
                      }
                      return (
                        <ApartmentCard
                          key={apt.id || apt.propertyId}
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
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 100, behavior: "smooth" });
                        }}
                        disabled={currentPage === 1}
                        className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600 dark:text-zinc-400 shadow-sm"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 100, behavior: "smooth" });
                          }}
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
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 100, behavior: "smooth" });
                        }}
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
          <div
            className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-10">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                {t("search_page.filters")}
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                selectedPropertyTypes={selectedPropertyTypes}
                selectedWeekend={selectedWeekend}
                selectedAmenities={selectedAmenities}
                maxWalkingMinutes={maxWalkingMinutes}
                onPropertyTypeToggle={handlePropertyTypeToggle}
                onWeekendChange={handleWeekendChange}
                onAmenityToggle={handleAmenityToggle}
                onMaxWalkingMinutesChange={setMaxWalkingMinutes}
                onClearFilters={handleClearAllFilters}
              />
              <div className="mt-6">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#4c55a4] to-[#6b75c8] text-white rounded-xl font-extrabold shadow-md shadow-[#4c55a4]/20"
                >
                  Show Results ({totalResults})
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

