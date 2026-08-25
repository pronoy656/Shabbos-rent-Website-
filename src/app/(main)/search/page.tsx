"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import FilterSidebar from "@/components/search/FilterSidebar";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { SlidersHorizontal, Search, ChevronDown, ChevronLeft, ChevronRight, Footprints, X, Check, MapPin, Navigation } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { getCoordinatesForAddress, calculateWalkingMinutes } from "@/utils/distanceUtils";

// Mock Data for Apartments
const baseApartments: ApartmentData[] = [
  {
    id: "1",
    title: "Luxury Penthouse with Kosher Kitchen",
    location: "Rehavia, Jerusalem",
    address: "Ramban St 14, Rehavia, Jerusalem",
    lat: 31.7745,
    lng: 35.2150,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 3500,
    rating: 4.9,
    reviews: 124,
    beds: 4,
    baths: 3,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
    availabilityStatus: "available",
    amenities: ["WiFi", "Air Conditioning", "Parking", "Kosher Kitchen", "Washing Machine", "Balcony"],
  },
  {
    id: "2",
    title: "Cozy Family Apartment near Kotel",
    location: "Jewish Quarter, Jerusalem",
    address: "HaYehudim St 28, Jewish Quarter, Jerusalem",
    lat: 31.7753,
    lng: 35.2315,
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
    price: 1800,
    rating: 4.7,
    reviews: 89,
    beds: 3,
    baths: 2,
    guests: 6,
    isSwapAvailable: false,
    verified: true,
    availabilityStatus: "unavailable_upcoming",
    amenities: ["WiFi", "Air Conditioning", "Kosher Kitchen", "Shabbos Elevator"],
  },
  {
    id: "3",
    title: "Modern Villa with Private Garden",
    location: "Baka, Jerusalem",
    address: "Derech Bethlehem 45, Baka, Jerusalem",
    lat: 31.7592,
    lng: 35.2210,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    price: 5200,
    rating: 5.0,
    reviews: 42,
    beds: 5,
    baths: 4,
    guests: 10,
    isSwapAvailable: true,
    verified: false,
    availabilityStatus: "available",
    amenities: ["WiFi", "Air Conditioning", "Parking", "Washing Machine", "Kosher Kitchen", "Balcony"],
  },
  {
    id: "4",
    title: "Charming Studio in the City Center",
    location: "Nachlaot, Jerusalem",
    address: "Nassim Behar St 8, Nachlaot, Jerusalem",
    lat: 31.7825,
    lng: 35.2128,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    price: 900,
    rating: 4.5,
    reviews: 210,
    beds: 1,
    baths: 1,
    guests: 2,
    isSwapAvailable: false,
    verified: true,
    availabilityStatus: "unavailable",
    amenities: ["WiFi", "Air Conditioning", "Washing Machine"],
  },
  {
    id: "5",
    title: "Spacious Duplex near Great Synagogue",
    location: "Talbiya, Jerusalem",
    address: "Jabotinsky St 12, Talbiya, Jerusalem",
    lat: 31.7702,
    lng: 35.2178,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
    price: 2900,
    rating: 4.8,
    reviews: 65,
    beds: 4,
    baths: 2,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
    availabilityStatus: "available",
    amenities: ["WiFi", "Air Conditioning", "Parking", "Kosher Kitchen", "Shabbos Elevator"],
  },
  {
    id: "6",
    title: "Boutique Apartment with Balcony",
    location: "German Colony, Jerusalem",
    address: "Emek Refaim St 32, German Colony, Jerusalem",
    lat: 31.7641,
    lng: 35.2205,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    price: 2100,
    rating: 4.6,
    reviews: 112,
    beds: 2,
    baths: 1,
    guests: 4,
    isSwapAvailable: false,
    verified: false,
    availabilityStatus: "unavailable_upcoming",
    amenities: ["WiFi", "Parking", "Washing Machine", "Balcony"],
  },
];

// Generate 18 mock apartments to test pagination with 12 items per page
const apartments: ApartmentData[] = Array.from({ length: 3 }).flatMap((_, i) => 
  baseApartments.map(apt => ({
    ...apt,
    id: `${apt.id}-${i}`,
  }))
);

function SearchContent() {
  const { t } = useLanguage();
  const [dummyVisible, setDummyVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxWalkingMinutes, setMaxWalkingMinutes] = useState<number | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState("any");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("any");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasListing = localStorage.getItem("hasUserListing") === "true";
      const isVisible = localStorage.getItem("isApartmentVisible") !== "false";
      setDummyVisible(hasListing && isVisible);
    }
  }, []);

  const handleAmenityToggle = (amenityKey: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityKey)
        ? prev.filter(item => item !== amenityKey)
        : [...prev, amenityKey]
    );
    setCurrentPage(1);
  };

  const sortOptions = [
    t("search_page.sort_options.recommended"), 
    t("search_page.sort_options.shortest_walking"),
    t("search_page.sort_options.price_low_high"), 
    t("search_page.sort_options.price_high_low"), 
    t("search_page.sort_options.highest_rated")
  ];
  const [sortBy, setSortBy] = useState(sortOptions[0]);

  const formattedCity = cityParam 
    ? cityParam.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  const dummyApartment: ApartmentData = { 
    id: "dummy", 
    title: "Bright luxury apartment in city center", 
    location: "City Center, Jerusalem", 
    address: "King George St 22, City Center, Jerusalem",
    lat: 31.7810,
    lng: 35.2200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", 
    price: 1500, 
    rating: 5.0, 
    reviews: 0, 
    beds: 4, 
    baths: 2, 
    guests: 8, 
    isSwapAvailable: true, 
    verified: false,
    amenities: ["WiFi", "Air Conditioning", "Parking", "Kosher Kitchen", "Washing Machine"]
  };

  const allApartments = dummyVisible 
    ? [dummyApartment, ...apartments]
    : apartments;

  // Calculate walking distance for all apartments based on destinationAddress
  const destCoords = getCoordinatesForAddress(destinationAddress || "Jerusalem");

  let processedApartments = allApartments.map(apt => {
    const aptLat = apt.lat ?? 31.7725;
    const aptLng = apt.lng ?? 35.2136;
    const walkingMinutes = calculateWalkingMinutes(destCoords.lat, destCoords.lng, aptLat, aptLng);
    return {
      ...apt,
      walkingMinutes,
    };
  });

  if (cityParam) {
    processedApartments = processedApartments.filter(apt => apt.location.toLowerCase().includes(cityParam.replace("-", " ").toLowerCase()));
  }

  if (selectedCity && selectedCity !== "any") {
    processedApartments = processedApartments.filter(apt => apt.location.toLowerCase().includes(selectedCity.toLowerCase()));
  }

  if (selectedNeighborhood && selectedNeighborhood !== "any") {
    processedApartments = processedApartments.filter(apt => apt.location.toLowerCase().includes(selectedNeighborhood.toLowerCase()));
  }

  if (typeParam === "swap") {
    processedApartments = processedApartments.filter(apt => apt.isSwapAvailable);
  }

  if (selectedAmenities.length > 0) {
    processedApartments = processedApartments.filter(apt => {
      if (!apt.amenities || apt.amenities.length === 0) return false;
      return selectedAmenities.every(selected =>
        apt.amenities?.some(a => a.toLowerCase().includes(selected.toLowerCase()))
      );
    });
  }

  if (maxWalkingMinutes !== undefined) {
    processedApartments = processedApartments.filter(apt => apt.walkingMinutes <= maxWalkingMinutes);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    processedApartments = processedApartments.filter(apt =>
      apt.title.toLowerCase().includes(q) ||
      apt.location.toLowerCase().includes(q) ||
      (apt.address && apt.address.toLowerCase().includes(q)) ||
      apt.amenities?.some(a => a.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === t("search_page.sort_options.shortest_walking")) {
    processedApartments.sort((a, b) => a.walkingMinutes - b.walkingMinutes);
  } else if (sortBy === t("search_page.sort_options.price_low_high")) {
    processedApartments.sort((a, b) => a.price - b.price);
  } else if (sortBy === t("search_page.sort_options.price_high_low")) {
    processedApartments.sort((a, b) => b.price - a.price);
  } else if (sortBy === t("search_page.sort_options.highest_rated")) {
    processedApartments.sort((a, b) => b.rating - a.rating);
  }
  
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(processedApartments.length / ITEMS_PER_PAGE) || 1;
  const currentApartments = processedApartments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Search Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 max-w-4xl">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 capitalize">
                {typeParam === "swap" ? t("search_page.swap_matches") : t("search_page.search_results")} {formattedCity ? `${t("search_page.in")} ${formattedCity}` : ""}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                {processedApartments.length} {typeParam === "swap" ? t("search_page.properties_swap") : t("search_page.places_stay")} {formattedCity ? `${t("search_page.in")} ${formattedCity} ` : ""}{t("search_page.for_shabbos")}
              </p>
              
              {/* 4-Column Header Search Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Search Keywords */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Search Keywords</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-zinc-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={t("search_page.search_placeholder")}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm truncate"
                    />
                  </div>
                </div>

                {/* 2. City Dropdown */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    {t("search_widget.city")}
                  </span>
                  <div className="relative w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer shadow-sm">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">
                            {selectedCity === "jerusalem"
                              ? t("search_widget.jerusalem")
                              : selectedCity === "tel-aviv"
                              ? t("search_widget.tel_aviv")
                              : `All Cities`}
                          </span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                        {[
                          { value: "any", label: `All Cities` },
                          { value: "jerusalem", label: t("search_widget.jerusalem") },
                          { value: "tel-aviv", label: t("search_widget.tel_aviv") },
                        ].map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            onClick={() => {
                              setSelectedCity(opt.value);
                              setCurrentPage(1);
                            }}
                            className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          >
                            <span>{opt.label}</span>
                            {selectedCity === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 3. Neighborhood Dropdown */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    {t("search_widget.neighborhood")}
                  </span>
                  <div className="relative w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer shadow-sm">
                        <div className="flex items-center gap-1.5 truncate">
                          <Navigation className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">
                            {selectedNeighborhood === "rehavia"
                              ? t("search_widget.rehavia")
                              : selectedNeighborhood === "geula"
                              ? t("search_widget.geula")
                              : `All Neighborhoods`}
                          </span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                        {[
                          { value: "any", label: `All Neighborhoods` },
                          { value: "rehavia", label: t("search_widget.rehavia") },
                          { value: "geula", label: t("search_widget.geula") },
                        ].map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            onClick={() => {
                              setSelectedNeighborhood(opt.value);
                              setCurrentPage(1);
                            }}
                            className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          >
                            <span>{opt.label}</span>
                            {selectedNeighborhood === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 4. Target Shul Address */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#4c55a4] dark:text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
                    <Footprints className="w-3 h-3" /> Target Shul / Address
                  </span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Footprints className="h-4 w-4 text-[#4c55a4]" />
                    </div>
                    <input 
                      type="text" 
                      value={destinationAddress}
                      onChange={(e) => {
                        setDestinationAddress(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={t("search_page.destination_placeholder")}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm truncate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t("search_page.filters")}
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t("search_page.sort_by")}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-white hover:text-[#4c55a4] dark:hover:text-[#4c55a4] focus:outline-none transition-colors">
                    {sortBy}
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option} 
                        className={`cursor-pointer rounded-lg text-[13px] px-3 py-2 ${sortBy === option ? 'font-bold bg-zinc-50 dark:bg-zinc-900' : 'font-medium'}`}
                        onClick={() => setSortBy(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Filters) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar 
              selectedAmenities={selectedAmenities}
              maxWalkingMinutes={maxWalkingMinutes}
              onAmenityToggle={handleAmenityToggle}
              onMaxWalkingMinutesChange={setMaxWalkingMinutes}
              onClearFilters={() => {
                setSelectedAmenities([]);
                setMaxWalkingMinutes(undefined);
                setSearchQuery("");
                setDestinationAddress("");
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Right Main Area (Apartment Cards) */}
          <div className="lg:col-span-9">
            {processedApartments.length === 0 ? (
              <div className="flex flex-col items-center pt-12 pb-16 px-4 text-center bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm h-full min-h-[350px]">
                <div className="flex items-center justify-center w-32 h-32 mb-8 rounded-full bg-indigo-50/40 dark:bg-indigo-900/10">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100/60 dark:bg-indigo-900/30">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-100 dark:border-zinc-700">
                      <Search className="w-7 h-7 text-[#4c55a4] dark:text-indigo-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-3 tracking-tight">
                  {t("search_page.no_apartments")}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto mb-10 leading-relaxed text-[15px]">
                  {t("search_page.no_apartments_desc1")} {formattedCity ? 
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">{t("search_page.for")} "{formattedCity}"</span> : 
                    t("search_page.criteria")
                  }. {t("search_page.no_apartments_desc2")}
                </p>
                <button 
                  onClick={() => {
                    setSelectedAmenities([]);
                    setMaxWalkingMinutes(undefined);
                    setSearchQuery("");
                    setDestinationAddress("");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#4c55a4] to-[#606aba] hover:from-[#3b438b] hover:to-[#4c55a4] text-white font-bold rounded-xl transition-colors shadow-md shadow-[#4c55a4]/20"
                >
                  {t("search_page.view_all")}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentApartments.map((apt) => (
                    <ApartmentCard 
                      key={apt.id} 
                      apartment={apt}
                      walkingMinutes={apt.walkingMinutes}
                      targetDestinationText={destinationAddress.trim() || undefined}
                    />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-zinc-600 dark:text-zinc-400"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                            currentPage === page 
                              ? 'bg-[#4c55a4] text-white' 
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-zinc-600 dark:text-zinc-400"
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
                onClearFilters={() => {
                  setSelectedAmenities([]);
                  setMaxWalkingMinutes(undefined);
                  setSearchQuery("");
                  setDestinationAddress("");
                  setCurrentPage(1);
                  setIsMobileFiltersOpen(false);
                }}
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

    </div>
  );
}

export default function SearchPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">{t("search_page.loading")}</div>}>
      <SearchContent />
    </Suspense>
  );
}
