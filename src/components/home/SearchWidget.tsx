"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, BedDouble, Users, ArrowRightLeft, Home, Navigation, ChevronDown, Bath, Footprints, Lock, X } from "lucide-react";
import { useEffect } from "react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { getCoordinatesForAddress, calculateWalkingMinutes } from "@/utils/distanceUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  icon: any;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
}

function CustomSelect({ icon: Icon, value, onChange, options, placeholder, disabled = false }: CustomSelectProps) {
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div className={`relative w-full ${disabled ? 'pointer-events-none' : ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          className={`w-full relative flex items-center border rounded-xl h-[48px] px-3 focus:outline-none transition-all ${
            disabled
              ? 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 cursor-not-allowed'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 cursor-pointer focus:ring-2 focus:ring-[#4c55a4]'
          }`}
        >
          <div className="flex items-center pointer-events-none shrink-0">
            <Icon className={`h-4 w-4 ${disabled ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`} />
          </div>
          <span className={`flex-1 text-start px-2.5 text-sm truncate ${
            disabled
              ? 'text-zinc-400 dark:text-zinc-600'
              : value
              ? 'font-medium text-zinc-700 dark:text-zinc-300'
              : 'text-zinc-500'
          }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center pointer-events-none shrink-0">
            <ChevronDown className={`h-4 w-4 ${disabled ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`} />
          </div>
        </DropdownMenuTrigger>
        {!disabled && (
          <DropdownMenuContent align="start" className="w-[240px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl">
            {options.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                className={`cursor-pointer rounded-lg text-[13px] px-3 py-2 focus:bg-[#4c55a4]/10 focus:text-[#4c55a4] dark:focus:bg-[#4c55a4]/20 dark:focus:text-[#4c55a4] ${value === option.value ? 'font-bold bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 text-[#4c55a4]' : 'font-medium'}`}
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"rent" | "swap">(initialType || "rent");
  const [isMySwipeOn, setIsMySwipeOn] = useState(false);
  const [showSwipeModal, setShowSwipeModal] = useState(false);
  const [hasSearchedSwap, setHasSearchedSwap] = useState(isSearchPage && initialType === "swap");
  const [hasSearchedRent, setHasSearchedRent] = useState(isSearchPage && initialType !== "swap");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [city, setCity] = useState(initialCity || "");
  const [neighborhood, setNeighborhood] = useState("");
  const [walkingTime, setWalkingTime] = useState("10");
  const [weekend, setWeekend] = useState("");
  const [rooms, setRooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [guests, setGuests] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  useEffect(() => {
    if (initialCity) {
      setCity(initialCity);
    }
  }, [initialCity]);

  useEffect(() => {
    if (initialType) {
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
    onFilterChange?.({
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
    });
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
    onFilterChange
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
            if (!isMySwipeOn) {
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
            placeholder={t("search_widget.select_city")}
            disabled={isTargetDestinationSet}
            options={[
              { value: "jerusalem", label: t("search_widget.jerusalem") },
              { value: "tel-aviv", label: t("search_widget.tel_aviv") },
              { value: "tzfat", label: t("search_widget.tzfat") },
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
            <input 
              type="text" 
              placeholder="e.g. Kotel, Great Synagogue, Rehavia..." 
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
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
            options={[
              { value: "next", label: t("search_widget.this_weekend") },
              { value: "following", label: t("search_widget.next_weekend") },
            ]}
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
                setHasSearchedRent(true);
                onSearch?.(false);
              }}
              className="flex items-center justify-center gap-2 h-[48px] w-full bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Search className="w-5 h-5 shrink-0" />
              <span>{t("search_widget.search_apartments")}</span>
            </button>
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

        const demoApartments = Array.from({ length: 90 }).map((_, i) => {
          const location = [
            "Rehavia, Jerusalem",
            "City Center, Jerusalem",
            "Rehavia, Jerusalem",
            "Baka, Jerusalem",
            "Tel Aviv, Israel",
            "Jerusalem, Israel",
            "Old City, Jerusalem",
            "City Center, Jerusalem",
            "Tzfat, Israel"
          ][i % 9];

          return {
            id: `${activeTab}-demo-${i}`,
            title: [
              "Beautiful Apartment in Jerusalem",
              "Luxury Penthouse with Kosher Kitchen",
              "Cozy Studio in Rehavia",
              "Spacious Family Home near Shul",
              "Modern Apartment in City Center",
              "Elegant Residence with Panoramic View",
              "Historic Stone House in Old City",
              "Bright luxury apartment",
              "Artistic Villa with Mountain Views"
            ][i % 9],
            location,
            image: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
              "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
              "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
            ][i % 9],
            price: activeTab === "rent" ? 450 + (i * 120) % 800 : 0,
            rating: 4.8 + (i % 3) * 0.1,
            reviews: 10 + i * 5,
            beds: 2 + (i % 4),
            baths: 1 + (i % 2),
            guests: 4 + (i % 5) * 2,
            isSwapAvailable: activeTab === "swap",
            verified: i % 2 === 0,
            isAvailable: i !== 1 && i !== 3, // Item 1 and 3 will be unavailable
            acceptRequestsWhenUnavailable: i === 1 // Item 1 accepts requests, Item 3 does not
          };
        });

        const filteredApartments = demoApartments.filter(apt => {
          // 1. Destination Address & Walking Time
          if (destinationAddress.trim()) {
            if (walkingTime) {
              const destCoords = getCoordinatesForAddress(destinationAddress);
              const aptLat = (apt as any).lat ?? 31.7725;
              const aptLng = (apt as any).lng ?? 35.2136;
              const walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
              const maxWalking = parseInt(walkingTime, 10);
              if (!isNaN(maxWalking) && walkingMins > maxWalking + 10) {
                return false;
              }
            }
          } else {
            // 2. City & Neighborhood (inactive when destination is set)
            if (city) {
              const locLower = apt.location.toLowerCase();
              if (city === "jerusalem" && !locLower.includes("jerusalem")) return false;
              if (city === "tel-aviv" && !locLower.includes("tel aviv")) return false;
              if (city === "tzfat" && !locLower.includes("tzfat")) return false;
            }
            if (neighborhood) {
              const locLower = apt.location.toLowerCase();
              if (neighborhood === "rehavia" && !locLower.includes("rehavia")) return false;
              if (neighborhood === "geula" && !locLower.includes("geula")) return false;
              if (neighborhood === "bakat" && !locLower.includes("baka")) return false;
            }
          }

          // 3. Price Range (Rent mode): Both Min and Max are completely optional
          if (activeTab === "rent") {
            const min = minPrice.trim() !== "" ? parseFloat(minPrice) : null;
            const max = maxPrice.trim() !== "" ? parseFloat(maxPrice) : null;

            if (min !== null && !isNaN(min) && apt.price < min) {
              return false;
            }
            if (max !== null && !isNaN(max) && apt.price > max) {
              return false;
            }
          }

          // 4. Rooms filter
          if (rooms && rooms !== "any") {
            const minRooms = parseInt(rooms, 10);
            if (!isNaN(minRooms) && (apt.beds || 0) < minRooms) {
              return false;
            }
          }

          // 5. Guests filter
          if (guests && guests !== "any") {
            const minGuests = parseInt(guests, 10);
            if (!isNaN(minGuests) && (apt.guests || 0) < minGuests) {
              return false;
            }
          }

          return true;
        });

        const totalPages = Math.ceil(filteredApartments.length / 30) || 1;
        const paginatedApartments = filteredApartments.slice((currentPage - 1) * 30, currentPage * 30);

        return (
          <div className="container mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
               <div>
                 <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
                   {activeTab === "swap" ? t("search_widget.swap_matches") : "Search Results"}
                 </h3>
                 <p className="text-lg font-medium text-zinc-500">
                    {filteredApartments.length} {t("search_widget.properties_found")}
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
            <div className="w-full h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl overflow-hidden mb-10 border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300 shadow-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {paginatedApartments.length > 0 ? (
              paginatedApartments.map(apt => {
                let walkingMins: number | undefined = undefined;
                if (destinationAddress.trim()) {
                  const destCoords = getCoordinatesForAddress(destinationAddress);
                  const aptLat = (apt as any).lat ?? 31.7725;
                  const aptLng = (apt as any).lng ?? 35.2136;
                  walkingMins = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
                }
                return (
                  <ApartmentCard 
                    key={apt.id}
                    apartment={apt} 
                    mode={activeTab === "swap" ? "swap" : "rent"}
                    walkingMinutes={walkingMins}
                    targetDestinationText={destinationAddress.trim() || undefined}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-500">
                No properties found matching your criteria.
              </div>
            )}
          </div>

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
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium transition-all"
                >
                  {t("swap_modal.cancel")}
                </button>
                <button 
                  onClick={() => {
                    setIsMySwipeOn(true);
                    setShowSwipeModal(false);
                    setActiveTab("swap");
                    if (isSearchPage) setHasSearchedSwap(true);
                    onSearch?.(isSearchPage ? true : hasSearchedSwap);
                  }}
                  className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-medium transition-all shadow-md shadow-[#4c55a4]/20"
                >
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
