"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import FilterSidebar from "@/components/search/FilterSidebar";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { SlidersHorizontal, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data for Apartments
const baseApartments: ApartmentData[] = [
  {
    id: "1",
    title: "Luxury Penthouse with Kosher Kitchen",
    location: "Rehavia, Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 3500,
    rating: 4.9,
    reviews: 124,
    beds: 4,
    baths: 3,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "2",
    title: "Cozy Family Apartment near Kotel",
    location: "Jewish Quarter, Jerusalem",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
    price: 1800,
    rating: 4.7,
    reviews: 89,
    beds: 3,
    baths: 2,
    guests: 6,
    isSwapAvailable: false,
    verified: true,
  },
  {
    id: "3",
    title: "Modern Villa with Private Garden",
    location: "Baka, Jerusalem",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    price: 5200,
    rating: 5.0,
    reviews: 42,
    beds: 5,
    baths: 4,
    guests: 10,
    isSwapAvailable: true,
    verified: false,
  },
  {
    id: "4",
    title: "Charming Studio in the City Center",
    location: "Nachlaot, Jerusalem",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    price: 900,
    rating: 4.5,
    reviews: 210,
    beds: 1,
    baths: 1,
    guests: 2,
    isSwapAvailable: false,
    verified: true,
  },
  {
    id: "5",
    title: "Spacious Duplex near Great Synagogue",
    location: "Talbiya, Jerusalem",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
    price: 2900,
    rating: 4.8,
    reviews: 65,
    beds: 4,
    baths: 2,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "6",
    title: "Boutique Apartment with Balcony",
    location: "German Colony, Jerusalem",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    price: 2100,
    rating: 4.6,
    reviews: 112,
    beds: 2,
    baths: 1,
    guests: 4,
    isSwapAvailable: false,
    verified: false,
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
  const [dummyVisible, setDummyVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasListing = localStorage.getItem("hasUserListing") === "true";
      const isVisible = localStorage.getItem("isApartmentVisible") !== "false";
      setDummyVisible(hasListing && isVisible);
    }
  }, []);
  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Highest Rated"];
  
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");
  const typeParam = searchParams.get("type");

  const formattedCity = cityParam 
    ? cityParam.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  const allApartments = dummyVisible 
    ? [
        { id: "dummy", title: "Bright luxury apartment in city center", location: "City Center, Jerusalem", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", price: 1500, rating: 5.0, reviews: 0, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false },
        ...apartments
      ]
    : apartments;

  let filteredApartments = cityParam
    ? allApartments.filter(apt => apt.location.toLowerCase().includes(cityParam.replace("-", " ").toLowerCase()))
    : allApartments;

  if (typeParam === "swap") {
    filteredApartments = filteredApartments.filter(apt => apt.isSwapAvailable);
  }
  
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE) || 1;
  const currentApartments = filteredApartments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Search Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 capitalize">
                {typeParam === "swap" ? "Swap Matches" : "Search Results"} {formattedCity ? `in ${formattedCity}` : ""}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                {filteredApartments.length} {typeParam === "swap" ? "properties available for swap" : "places to stay"} {formattedCity ? `in ${formattedCity} ` : ""}for Shabbos
              </p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by keywords, locations, or apartment names..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors md:hidden">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-white hover:text-[#4c55a4] dark:hover:text-[#4c55a4] focus:outline-none transition-colors">
                    {sortBy}
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl">
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
            <FilterSidebar />
          </div>

          {/* Right Main Area (Apartment Cards) */}
          <div className="lg:col-span-9">
            {filteredApartments.length === 0 ? (
              <div className="flex flex-col items-center pt-12 pb-16 px-4 text-center bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm h-full min-h-[350px]">
                <div className="flex items-center justify-center w-32 h-32 mb-8 rounded-full bg-indigo-50/40 dark:bg-indigo-900/10">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100/60 dark:bg-indigo-900/30">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-100 dark:border-zinc-700">
                      <Search className="w-7 h-7 text-[#4c55a4] dark:text-indigo-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-3 tracking-tight">
                  No apartments found
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto mb-10 leading-relaxed text-[15px]">
                  We couldn't find any apartments matching your search {formattedCity ? 
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">for "{formattedCity}"</span> : 
                    "criteria"
                  }. Try adjusting your filters or searching for a different destination.
                </p>
                <a 
                  href="/search"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#4c55a4] to-[#606aba] hover:from-[#3b438b] hover:to-[#4c55a4] text-white font-bold rounded-xl transition-colors shadow-md shadow-[#4c55a4]/20"
                >
                  View All Apartments
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentApartments.map((apt) => (
                    <ApartmentCard key={apt.id} apartment={apt} />
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

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
