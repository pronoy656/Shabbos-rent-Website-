"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, BedDouble, Users, ArrowRightLeft, Home, Navigation, ChevronDown, Bath, Footprints, Lock, X, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { ApartmentSearchParams } from "@/types/apartment.types";
import { useApartments, useMyApartment } from "@/hooks/useApartments";
import { useLanguage } from "@/context/LanguageContext";
import { useSwapPreference, useSaveSwapPreference } from "@/hooks/useSwap";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import SearchAutocompleteInput from "@/components/common/SearchAutocompleteInput";

const ApartmentMap = dynamic(() => import("@/components/search/ApartmentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-800 animate-pulse">
      Loading Google Map...
    </div>
  ),
});
import { getCoordinatesForAddress, calculateWalkingMinutes } from "@/utils/distanceUtils";

export interface SearchFilters {
  activeTab: "rent" | "swap";
  city: string;
  neighborhood: string;
  walkingTime: string;
  weekend: string;
  rooms: string;
  minPrice: string;
  maxPrice: string;
  guests: string;
  destinationAddress: string;
}

export interface SearchWidgetProps {
  onSearch?: (active: boolean) => void;
  isSearchPage?: boolean;
  initialCity?: string;
  initialType?: "rent" | "swap";
  hideResults?: boolean;
  onFilterChange?: (filters: SearchFilters) => void;
}

export default function SearchWidget({ 
  onSearch, 
  isSearchPage = false,
  initialCity = "",
  initialType = "rent",
  hideResults = false,
  onFilterChange
}: SearchWidgetProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: prefData } = useSwapPreference();
  const { data: myAptData } = useMyApartment();
  const { data: weekendCalendarsData, isLoading: isWeekendsLoading } = useWeekendCalendars({ limit: 100 });
  const savePreferenceMutation = useSaveSwapPreference();

  const isBackendSwapEnabled = Boolean(prefData?.data?.isEnabled);

  const [activeTab, setActiveTab] = useState<"rent" | "swap">(initialType || "rent");
  const [localSwapTurnedOn, setLocalSwapTurnedOn] = useState(false);
  const [showSwipeModal, setShowSwipeModal] = useState(false);
  const [isTurningOnSwap, setIsTurningOnSwap] = useState(false);
  const [hasSearchedSwap, setHasSearchedSwap] = useState(isSearchPage && initialType === "swap");
  const [hasSearchedRent, setHasSearchedRent] = useState(isSearchPage && initialType !== "swap");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationError, setValidationError] = useState("");
  
  const [city, setCity] = useState(initialCity || "");
  const [neighborhood, setNeighborhood] = useState("");
  const [walkingTime, setWalkingTime] = useState("");
  const [weekend, setWeekend] = useState("");
  const [rooms, setRooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [guests, setGuests] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEffectiveSwapEnabled = isBackendSwapEnabled || localSwapTurnedOn;

  const weekendOptions = useMemo(() => {
    const rawList = Array.isArray(weekendCalendarsData?.data) ? weekendCalendarsData.data : [];
    const sorted = [...rawList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return [
      { value: "", label: "Select a Weekend" },
      ...sorted.map((w) => {
        const dateVal = w.date ? w.date.split("T")[0] : w.id;
        let formattedDate = "";
        if (w.date) {
          try {
            formattedDate = new Date(w.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch {}
        }
        return {
          value: w.id || dateVal,
          label: formattedDate ? `${w.title} (${formattedDate})` : w.title,
        };
      }),
    ];
  }, [weekendCalendarsData]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const apiQueryParams: ApartmentSearchParams = useMemo(() => {
    const params: ApartmentSearchParams = {
      page: currentPage,
      limit: 12,
    };
    if (city) params.city = city.trim();
    if (neighborhood && neighborhood !== "any") params.neighborhood = neighborhood.trim();
    if (rooms && rooms !== "any") params.bedrooms = parseInt(rooms, 10);
    if (minPrice) params.minPrice = parseFloat(minPrice);
    if (maxPrice) params.maxPrice = parseFloat(maxPrice);
    if (guests && guests !== "any") params.maxGuest = parseInt(guests, 10);
    if (activeTab === "swap") params.type = "swap";
    if (weekend && weekend !== "any") params.weekendId = weekend;
    if (destinationAddress) {
      params.targetDestination = destinationAddress.trim();
      params.walkingMinutes = walkingTime || "10";
      const coords = getCoordinatesForAddress(destinationAddress);
      if (coords) {
        params.destLat = coords.lat;
        params.destLng = coords.lng;
      }
    }
    return params;
  }, [currentPage, city, neighborhood, rooms, minPrice, maxPrice, guests, activeTab, weekend, destinationAddress, walkingTime]);

  const { data: apiResponse, isLoading, isFetching } = useApartments(apiQueryParams);

  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  const prevFiltersJsonRef = useRef<string>("");

  useEffect(() => {
    if (initialCity && initialCity !== city) {
      setCity(initialCity);
    }
  }, [initialCity]);

  useEffect(() => {
    if (initialType && initialType !== activeTab) {
      setActiveTab(initialType);
      if (isSearchPage) {
        if (initialType === "swap") {
          setHasSearchedSwap(true);
        } else {
          setHasSearchedRent(true);
        }
      }
    }
  }, [initialType, isSearchPage]);

  useEffect(() => {
    const currentFilters: SearchFilters = {
      activeTab,
      city,
      neighborhood,
      walkingTime,
      weekend,
      rooms,
      minPrice,
      maxPrice,
      guests,
      destinationAddress,
    };

    const json = JSON.stringify(currentFilters);
    if (json !== prevFiltersJsonRef.current) {
      prevFiltersJsonRef.current = json;
      onFilterChangeRef.current?.(currentFilters);
    }
  }, [
    activeTab,
    city,
    neighborhood,
    walkingTime,
    weekend,
    rooms,
    minPrice,
    maxPrice,
    guests,
    destinationAddress,
  ]);

  const isTargetDestinationSet = Boolean(destinationAddress.trim().length > 0);

  return (
    <>
      <div className={`container mx-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-6 relative z-10 ${
        isSearchPage ? "mt-4 mb-8" : "-mt-12 md:-mt-20 lg:-mt-24"
      }`}>
      
      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1 mb-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => {
            setActiveTab("rent");
            if (isSearchPage) setHasSearchedRent(true);
            onSearch?.(false);
          }}
          className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "rent"
              ? "bg-[#4c55a4] text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          <Home className="w-4 h-4" />
          {t("search_widget.rent")}
        </button>
        <button
          onClick={() => {
            if (!isEffectiveSwapEnabled) {
              setShowSwipeModal(true);
            } else {
              setActiveTab("swap");
              if (isSearchPage) setHasSearchedSwap(true);
              onSearch?.(hasSearchedSwap);
            }
          }}
          className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "swap"
              ? "bg-[#4c55a4] text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          {t("search_widget.swap")}
        </button>
      </div>

      {/* Row 1: Always Visible Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
        
        {/* Where (City) */}
        <div className={`lg:col-span-2 space-y-1.5 transition-all duration-300 ${
          isTargetDestinationSet ? "opacity-40 pointer-events-none select-none cursor-not-allowed" : "opacity-100"
        }`}>
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>{t("search_widget.city")}</span>
            {isTargetDestinationSet && (
              <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 italic">
                Inactive
              </span>
            )}
          </label>
          <CustomSelect
            icon={MapPin}
            value={city}
            onChange={setCity}
            placeholder={t("search_widget.select_city") || "Select a City"}
            disabled={isTargetDestinationSet}
            options={[
              { value: "", label: "Select a City" },
              { value: "jerusalem", label: t("search_widget.jerusalem") || "Jerusalem" },
              { value: "tel-aviv", label: t("search_widget.tel_aviv") || "Tel Aviv" },
              { value: "tzfat", label: t("search_widget.tzfat") || "Tzfat" },
              { value: "bnei-brak", label: "Bnei Brak" },
              { value: "beit-shemesh", label: "Beit Shemesh" },
              { value: "modiin-illit", label: "Modiin Illit" },
              { value: "haifa", label: "Haifa" },
              { value: "netanya", label: "Netanya" },
              { value: "ashdod", label: "Ashdod" },
            ]}
          />
        </div>

        {/* Neighborhood */}
        <div className={`lg:col-span-3 space-y-1.5 transition-all duration-300 ${
          isTargetDestinationSet ? "opacity-40 pointer-events-none select-none cursor-not-allowed" : "opacity-100"
        }`}>
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>{t("search_widget.neighborhood")}</span>
            {isTargetDestinationSet && (
              <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 italic">
                Inactive
              </span>
            )}
          </label>
          <CustomSelect
            icon={Navigation}
            value={neighborhood}
            onChange={setNeighborhood}
            placeholder={t("search_widget.select_neighborhood")}
            disabled={isTargetDestinationSet}
            options={[
              { value: "rehavia", label: t("search_widget.rehavia") },
              { value: "geula", label: t("search_widget.geula") },
              { value: "bakat", label: t("search_widget.baka") },
            ]}
          />
        </div>

        {/* Target Destination / Shul Address */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-[#4c55a4]" /> Target Destination / Shul Address
          </label>
          <div className="relative">
            <SearchAutocompleteInput 
              placeholder="e.g. Kotel, Great Synagogue, Rehavia..." 
              value={destinationAddress}
              onChange={setDestinationAddress}
              onClear={() => setDestinationAddress("")}
              className="w-full h-[48px] px-4 pr-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all text-zinc-900 dark:text-white placeholder-zinc-400 font-medium"
            />
            {destinationAddress && (
              <button
                type="button"
                onClick={() => setDestinationAddress("")}
                className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Clear destination"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Walking Time */}
        <div className={`lg:col-span-3 space-y-1.5 transition-all duration-300 ${
          !isTargetDestinationSet ? "opacity-40 pointer-events-none select-none cursor-not-allowed" : "opacity-100"
        }`}>
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-1">
              {t("search_widget.walking_time")}
            </span>
            {!isTargetDestinationSet && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            )}
          </label>
          <CustomSelect
            icon={!isTargetDestinationSet ? Lock : Footprints}
            value={walkingTime}
            onChange={setWalkingTime}
            placeholder={t("search_widget.select_walking_time")}
            disabled={!isTargetDestinationSet}
            options={[
              { value: "5", label: t("search_widget.mins_5") },
              { value: "10", label: t("search_widget.mins_10") },
              { value: "15", label: t("search_widget.mins_15") },
              { value: "20", label: t("search_widget.mins_20") },
            ]}
          />
        </div>
      </div>

      {/* Row 2: Additional Fields & Search Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end mt-5">
        
        {/* Weekend */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">{t("search_widget.weekend")}</label>
          <CustomSelect
            icon={Calendar}
            value={weekend}
            onChange={setWeekend}
            placeholder={t("search_widget.select_weekend")}
            disabled={isWeekendsLoading}
            options={weekendOptions}
          />
        </div>

        {/* Rooms */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">{t("search_widget.rooms")}</label>
          <CustomSelect
            icon={BedDouble}
            value={rooms}
            onChange={setRooms}
            placeholder={t("search_widget.select_rooms")}
            options={[
              { value: "any", label: t("search_widget.any") },
              { value: "1", label: t("search_widget.plus_1") },
              { value: "2", label: t("search_widget.plus_2") },
              { value: "3", label: t("search_widget.plus_3") },
              { value: "4", label: t("search_widget.plus_4") },
            ]}
          />
        </div>

        {/* Price Range */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>Price Range (₪)</span>
            <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">Optional</span>
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="0"
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (activeTab === "rent") {
                    setHasSearchedRent(true);
                    onSearch?.(false);
                  } else {
                    setHasSearchedSwap(true);
                    onSearch?.(true);
                  }
                }
              }}
              className="w-full h-[48px] px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
            />
            <span className="text-zinc-400 font-bold">-</span>
            <input 
              type="number" 
              min="0"
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (activeTab === "rent") {
                    setHasSearchedRent(true);
                    onSearch?.(false);
                  } else {
                    setHasSearchedSwap(true);
                    onSearch?.(true);
                  }
                }
              }}
              className="w-full h-[48px] px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">{t("search_widget.guests")}</label>
          <CustomSelect
            icon={Users}
            value={guests}
            onChange={setGuests}
            placeholder={t("search_widget.select_guests")}
            options={[
              { value: "any", label: t("search_widget.any") },
              { value: "2", label: t("search_widget.plus_2") },
              { value: "4", label: t("search_widget.plus_4") },
              { value: "6", label: t("search_widget.plus_6") },
              { value: "8", label: t("search_widget.plus_8") },
              { value: "10", label: t("search_widget.plus_10") },
            ]}
          />
        </div>

        {/* Search Button */}
        <div className="lg:col-span-3">
          {activeTab === "swap" ? (
            <button 
              onClick={() => {
                const isAnyFieldSet = city || neighborhood || destinationAddress || weekend || (rooms && rooms !== "any") || (guests && guests !== "any") || minPrice || maxPrice;
                if (!isAnyFieldSet) {
                  setValidationError("Please select at least one search criterion.");
                  return;
                }
                setValidationError("");
                setHasSearchedSwap(true);
                onSearch?.(true);
              }}
              className="flex items-center justify-center gap-2 h-[48px] w-full bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Search className="w-5 h-5 shrink-0" />
              <span>{t("search_widget.search_apartments")}</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                const isAnyFieldSet = city || neighborhood || destinationAddress || weekend || (rooms && rooms !== "any") || (guests && guests !== "any") || minPrice || maxPrice;
                if (!isAnyFieldSet) {
                  setValidationError("Please select at least one search criterion.");
                  return;
                }
                setValidationError("");
                setHasSearchedRent(true);
                onSearch?.(false);
              }}
              className="flex items-center justify-center gap-2 h-[48px] w-full bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Search className="w-5 h-5 shrink-0" />
              <span>{t("search_widget.search_apartments")}</span>
            </button>
          )}
        {validationError && (
        <div className="mt-5 p-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/40">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {validationError}
        </div>
      )}

      </div>

      </div>

      </div>

      {/* Results Section */}
      {!hideResults && (() => {
        const isShowingSwap = activeTab === "swap" && hasSearchedSwap;
        const isShowingRent = activeTab === "rent" && hasSearchedRent;
        const isShowingResults = isShowingSwap || isShowingRent;

        if (!isShowingResults) return null;
        
        const rawApartments: ApartmentData[] = (apiResponse?.data as unknown as ApartmentData[]) || [];
        const totalResults = apiResponse?.meta?.total || rawApartments.length;
        const totalPages = apiResponse?.meta?.total ? Math.ceil(apiResponse.meta.total / 12) : 1;

        return (
          <div className="container mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
               <div>
                 <div className="flex items-center gap-3">
                   <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
                     {activeTab === "swap" ? t("search_widget.swap_matches") : "Search Results"}
                   </h3>
                   {isFetching && <Loader2 className="w-5 h-5 text-[#4c55a4] animate-spin mb-2 shrink-0" />}
                 </div>
                 <p className="text-lg font-medium text-zinc-500">
                    {totalResults} {t("search_widget.properties_found")}
                 </p>
               </div>
             
              <button 
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                {showMap ? t("search_widget.hide_map") : t("search_widget.show_on_map")}
             </button>
          </div>
          
          {showMap && (
            <div className="w-full h-[400px] mb-10 animate-in fade-in duration-300">
              <ApartmentMap
                apartments={rawApartments}
                markers={apiResponse?.markers || []}
                defaultCity={city || "Jerusalem"}
                height="400px"
              />
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl h-80 overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {rawApartments.length > 0 ? (
                rawApartments.map(apt => {
                  let walkingMins: number | undefined = undefined;
                  if (destinationAddress.trim()) {
                    const destCoords = getCoordinatesForAddress(destinationAddress);
                    const aptLat = (apt as any).lat ?? 31.7725;
                    const aptLng = (apt as any).lng ?? 35.2136;
                    walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
                  }
                  return (
                    <ApartmentCard 
                      key={apt.id || apt.propertyId}
                      apartment={apt} 
                      mode={activeTab === "swap" ? "swap" : "rent"}
                      walkingMinutes={walkingMins}
                      targetDestinationText={destinationAddress.trim() || undefined}
                    />
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-zinc-500 font-bold bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  No properties found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
               <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold'}`}
               >
                  &lt;
               </button>
               {Array.from({ length: totalPages }).map((_, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === idx + 1 ? 'bg-[#4c55a4] text-white shadow-md shadow-[#4c55a4]/20' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                 >
                    {idx + 1}
                 </button>
               ))}
               <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold'}`}
               >
                  &gt;
               </button>
            </div>
          )}
        </div>
      );})()}

      {/* Swipe Modal */}
      {showSwipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-2xl text-zinc-900 dark:text-white mb-1">{t("swap_modal.title")}</h3>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">{t("swap_modal.required")}</p>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                {t("swap_modal.desc")}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSwipeModal(false)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium transition-all cursor-pointer"
                >
                  {t("swap_modal.cancel")}
                </button>
                <button 
                  disabled={isTurningOnSwap}
                  onClick={async () => {
                    setIsTurningOnSwap(true);
                    try {
                      if (myAptData?.id) {
                        await savePreferenceMutation.mutateAsync({
                          apartmentId: myAptData.id,
                          isEnabled: true,
                        });
                      }
                      setLocalSwapTurnedOn(true);
                      setShowSwipeModal(false);
                      setActiveTab("swap");
                      if (isSearchPage) setHasSearchedSwap(true);
                      onSearch?.(isSearchPage ? true : hasSearchedSwap);
                      toast.success("Apartment swap mode enabled!");
                    } catch (err: any) {
                      console.error("Failed to enable swap:", err);
                      setLocalSwapTurnedOn(true);
                      setShowSwipeModal(false);
                      setActiveTab("swap");
                    } finally {
                      setIsTurningOnSwap(false);
                    }
                  }}
                  className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-medium transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTurningOnSwap && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("swap_modal.turn_on")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
