"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, BedDouble, Users, ArrowRightLeft, Home, Navigation, ChevronDown, Bath } from "lucide-react";

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<"rent" | "swap">("rent");

  return (
    <div className="w-full max-w-[76rem] mx-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-6 relative z-10 -mt-12 md:-mt-20 lg:-mt-24">
      
      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1 mb-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("rent")}
          className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "rent"
              ? "bg-[#4c55a4] text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          <Home className="w-4 h-4" />
          Rent
        </button>
        <button
          onClick={() => setActiveTab("swap")}
          className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "swap"
              ? "bg-[#4c55a4] text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Swap
        </button>
      </div>

      {/* Row 1: Always Visible Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
        
        {/* Where (City) */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Select City</option>
              <option value="jerusalem">Jerusalem</option>
              <option value="tel-aviv">Tel Aviv</option>
              <option value="tzfat">Tzfat</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Neighborhood */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Neighborhood</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Navigation className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Select Neighborhood</option>
              <option value="rehavia">Rehavia</option>
              <option value="geula">Geula</option>
              <option value="bakat">Baka</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Walking Time */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Walking Time</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="5">5 mins</option>
              <option value="10" selected>10 mins</option>
              <option value="15">15 mins</option>
              <option value="20">20 mins</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Weekend */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Weekend</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Select Weekend</option>
              <option value="next">This Weekend</option>
              <option value="following">Next Weekend</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Rooms</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <BedDouble className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Swap Specific Fields & Search Button */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end ${activeTab === 'swap' ? 'mt-5' : 'mt-6'}`}>
        
        {activeTab === "swap" && (
          <>
            {/* Bathrooms */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-white">Bathrooms</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Bath className="h-4 w-4 text-zinc-400" />
                </div>
                <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="any">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Beds */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-white">Beds</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <BedDouble className="h-4 w-4 text-zinc-400" />
                </div>
                <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="any">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="6">6+</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-white">Guests / Seats</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-zinc-400" />
                </div>
                <select className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="any">Any</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="6">6+</option>
                  <option value="8">8+</option>
                  <option value="10">10+</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Search Button (Dynamically placed based on active tab) */}
        <div className={activeTab === "swap" ? "lg:col-span-3" : "lg:col-span-12 flex justify-end"}>
          <button className={`flex items-center justify-center gap-2 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors ${activeTab === 'rent' ? 'w-full md:w-auto md:px-12' : 'w-full'}`}>
            <Search className="w-5 h-5" />
            Search Apartments
          </button>
        </div>

      </div>
    </div>
  );
}
