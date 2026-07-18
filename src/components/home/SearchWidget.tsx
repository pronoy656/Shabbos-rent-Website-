"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, BedDouble, Users, ArrowRightLeft, Home, Navigation, ChevronDown, Bath } from "lucide-react";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
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
}

function CustomSelect({ icon: Icon, value, onChange, options, placeholder }: CustomSelectProps) {
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div className="relative w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all">
          <div className="ps-3.5 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
          <span className={`flex-1 text-start ps-2.5 text-sm ${value ? 'font-medium text-zinc-700 dark:text-zinc-300' : 'text-zinc-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="pe-3.5 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </div>
        </DropdownMenuTrigger>
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
      </DropdownMenu>
    </div>
  );
}

interface SearchWidgetProps {
  onSwapSearch?: (active: boolean) => void;
}

export default function SearchWidget({ onSwapSearch }: SearchWidgetProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"rent" | "swap">("rent");
  const [isMySwipeOn, setIsMySwipeOn] = useState(false);
  const [showSwipeModal, setShowSwipeModal] = useState(false);
  const [hasSearchedSwap, setHasSearchedSwap] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [walkingTime, setWalkingTime] = useState("10");
  const [weekend, setWeekend] = useState("");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [beds, setBeds] = useState("");
  const [guests, setGuests] = useState("");

  return (
    <>
      <div className="container mx-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-6 relative z-10 -mt-12 md:-mt-20 lg:-mt-24">
      
      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1 mb-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => {
            setActiveTab("rent");
            setHasSearchedSwap(false);
            onSwapSearch?.(false);
          }}
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
          onClick={() => {
            if (!isMySwipeOn) {
              setShowSwipeModal(true);
            } else {
              setActiveTab("swap");
            }
          }}
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
          <CustomSelect
            icon={MapPin}
            value={city}
            onChange={setCity}
            placeholder="Select City"
            options={[
              { value: "jerusalem", label: "Jerusalem" },
              { value: "tel-aviv", label: "Tel Aviv" },
              { value: "tzfat", label: "Tzfat" },
            ]}
          />
        </div>

        {/* Neighborhood */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Neighborhood</label>
          <CustomSelect
            icon={Navigation}
            value={neighborhood}
            onChange={setNeighborhood}
            placeholder="Select Neighborhood"
            options={[
              { value: "rehavia", label: "Rehavia" },
              { value: "geula", label: "Geula" },
              { value: "bakat", label: "Baka" },
            ]}
          />
        </div>

        {/* Walking Time */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Walking Time</label>
          <CustomSelect
            icon={MapPin}
            value={walkingTime}
            onChange={setWalkingTime}
            placeholder="Select Walking Time"
            options={[
              { value: "5", label: "5 mins" },
              { value: "10", label: "10 mins" },
              { value: "15", label: "15 mins" },
              { value: "20", label: "20 mins" },
            ]}
          />
        </div>

        {/* Weekend */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Weekend</label>
          <CustomSelect
            icon={Calendar}
            value={weekend}
            onChange={setWeekend}
            placeholder="Select Weekend"
            options={[
              { value: "next", label: "This Weekend" },
              { value: "following", label: "Next Weekend" },
            ]}
          />
        </div>

        {/* Rooms */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Rooms</label>
          <CustomSelect
            icon={BedDouble}
            value={rooms}
            onChange={setRooms}
            placeholder="Select Rooms"
            options={[
              { value: "any", label: "Any" },
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "3", label: "3+" },
              { value: "4", label: "4+" },
            ]}
          />
        </div>
      </div>

      {/* Row 2: Additional Fields & Search Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end mt-5">
        
        {/* Bathrooms */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Bathrooms</label>
          <CustomSelect
            icon={Bath}
            value={bathrooms}
            onChange={setBathrooms}
            placeholder="Select Bathrooms"
            options={[
              { value: "any", label: "Any" },
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "3", label: "3+" },
            ]}
          />
        </div>

        {/* Beds */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Beds</label>
          <CustomSelect
            icon={BedDouble}
            value={beds}
            onChange={setBeds}
            placeholder="Select Beds"
            options={[
              { value: "any", label: "Any" },
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "4", label: "4+" },
              { value: "6", label: "6+" },
            ]}
          />
        </div>

        {/* Guests */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-zinc-900 dark:text-white">Guests / Seats</label>
          <CustomSelect
            icon={Users}
            value={guests}
            onChange={setGuests}
            placeholder="Select Guests"
            options={[
              { value: "any", label: "Any" },
              { value: "2", label: "2+" },
              { value: "4", label: "4+" },
              { value: "6", label: "6+" },
              { value: "8", label: "8+" },
              { value: "10", label: "10+" },
            ]}
          />
        </div>

        {/* Search Button */}
        <div className="lg:col-span-3">
          {activeTab === "swap" ? (
            <button 
              onClick={() => {
                setHasSearchedSwap(true);
                onSwapSearch?.(true);
              }}
              className="flex items-center justify-center gap-2 py-3 w-full bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Search className="w-5 h-5" />
              Search Apartments
            </button>
          ) : (
            <Link 
              href={`/search?${new URLSearchParams({
                ...(city ? { city } : {}),
              }).toString()}`} 
              className="flex items-center justify-center gap-2 py-3 w-full bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Search className="w-5 h-5" />
              Search Apartments
            </Link>
          )}
        </div>

      </div>

      </div>

      {/* Swap Results Section */}
      {activeTab === "swap" && hasSearchedSwap && (
        <div className="container mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
             <div>
               <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Swap Matches</h3>
               <p className="text-lg font-medium text-zinc-500">
                  9 properties found
               </p>
             </div>
             
             <button 
               onClick={() => setShowMap(!showMap)}
               className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-xl shadow-md transition-colors"
             >
                <MapPin className="w-4 h-4" />
                {showMap ? "Hide map" : "Show on map"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 18 }).map((_, i) => ({ 
                  id: `swap-demo-${i}`,
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
                  location: [
                    "Rehavia, Jerusalem",
                    "City Center, Jerusalem",
                    "Rehavia, Jerusalem",
                    "Baka, Jerusalem",
                    "Tel Aviv, Israel",
                    "Jerusalem, Israel",
                    "Old City, Jerusalem",
                    "City Center, Jerusalem",
                    "Tzfat, Israel"
                  ][i % 9],
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
                  price: 0,
                  rating: 4.8 + (i % 3) * 0.1,
                  reviews: 10 + i * 5,
                  beds: 2 + (i % 4),
                  baths: 1 + (i % 2),
                  guests: 4 + (i % 5) * 2,
                  isSwapAvailable: true,
                  verified: i % 2 === 0
            })).slice((currentPage - 1) * 9, currentPage * 9).map(apt => (
              <ApartmentCard 
                key={apt.id}
                apartment={apt} 
                mode="swap"
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
             <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold'}`}
             >
                &lt;
             </button>
             <button 
                onClick={() => setCurrentPage(1)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === 1 ? 'bg-[#4c55a4] text-white shadow-md shadow-[#4c55a4]/20' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
             >
                1
             </button>
             <button 
                onClick={() => setCurrentPage(2)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === 2 ? 'bg-[#4c55a4] text-white shadow-md shadow-[#4c55a4]/20' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
             >
                2
             </button>
             <button 
                onClick={() => setCurrentPage(p => Math.min(2, p + 1))}
                disabled={currentPage === 2}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ${currentPage === 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold'}`}
             >
                &gt;
             </button>
          </div>
        </div>
      )}

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
