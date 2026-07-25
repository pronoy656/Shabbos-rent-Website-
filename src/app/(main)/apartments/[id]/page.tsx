"use client";
import Link from "next/link";
import { useState, use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { 
  MapPin, BedDouble, Bath, Users, Star, ArrowRightLeft, 
  ShieldCheck, CalendarCheck, Wifi, Tent, Monitor, ChefHat, X, Mail, Sparkles,
  Coffee, Tv, Snowflake, Car, WashingMachine, Phone, MessageCircle, Copy, ChevronDown, Home, Footprints, Check, LockKeyhole, CheckCircle2, Navigation
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { mockBaseApartments } from "@/data/mockData";
import { getCoordinatesForAddress, calculateWalkingMinutes, calculateDistanceKm } from "@/utils/distanceUtils";

// Mock Data
const galleryImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
];

const mockAvailableDates = [
  { id: 1, date: "Oct 13 - 15", day: "Fri - Sun", reason: "Shabbos Parshat Bereishit" },
  { id: 2, date: "Oct 27 - 29", day: "Fri - Sun", reason: "Shabbos Parshat Lech Lecha" },
  { id: 3, date: "Nov 24 - 26", day: "Fri - Sun", reason: "Special Weekend" },
];

const similarApartments: ApartmentData[] = [
  { id: "sim-1", title: "Luxury Penthouse near Beach", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 4000, rating: 4.9, reviews: 120, beds: 3, baths: 2, guests: 6, isSwapAvailable: true, verified: true, isAvailable: true },
  { id: "sim-2", title: "Historic Stone House in Old City", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 4500, rating: 4.9, reviews: 150, beds: 4, baths: 3, guests: 10, isSwapAvailable: false, verified: true, isAvailable: false },
  { id: "sim-3", title: "Elegant Residence with Panoramic View", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 5000, rating: 4.8, reviews: 110, beds: 5, baths: 4, guests: 12, isSwapAvailable: true, verified: true, isAvailable: true },
  { id: "sim-4", title: "Artistic Villa with Mountain Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 3000, rating: 4.9, reviews: 105, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: true, isAvailable: false },
];

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const isSwapMode = searchParams.get("mode") === "swap";

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
  const [landlordModalState, setLandlordModalState] = useState<"initial" | "options">("initial");
  const [isCopied, setIsCopied] = useState(false);

  const [isNumberRevealed, setIsNumberRevealed] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapModalState, setSwapModalState] = useState<"initial" | "contact">("initial");
  const [destInput, setDestInput] = useState("Great Synagogue, Jerusalem");

  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSelectWeekModalOpen, setIsSelectWeekModalOpen] = useState(false);
  const [selectedAgreedWeek, setSelectedAgreedWeek] = useState(mockAvailableDates[0].date);
  const [confirmedShabbosDate, setConfirmedShabbosDate] = useState("");
  const [activeConfirmationCode, setActiveConfirmationCode] = useState("");
  const [isConfCopied, setIsConfCopied] = useState(false);

  const handleStartRenterConfirm = () => {
    setIsLandlordModalOpen(false);
    setIsSelectWeekModalOpen(true);
  };

  const executeRenterConfirm = (targetWeek: string) => {
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "renter@example.com" : "renter@example.com";
    const currentWeek = targetWeek || "Oct 13 - 15";
    const codeKey = `confirm_${userEmail}_apt${id}_${currentWeek.replace(/[^a-zA-Z0-9]/g, "")}`;
    
    let code = typeof window !== "undefined" ? localStorage.getItem(codeKey) : null;
    if (!code) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let rand = "";
      for (let i = 0; i < 8; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `CONF-${rand}`;
      if (typeof window !== "undefined") {
        localStorage.setItem(codeKey, code);
        const existingBookingsStr = localStorage.getItem("user_booking_history");
        const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
        const newBooking = {
          id: `b-conf-${Date.now()}`,
          apartmentId: id,
          title: "Beautiful Apartment in Jerusalem",
          address: "Ramban St 14, Rehavia, Jerusalem, Israel",
          dates: currentWeek,
          confirmationCode: code,
          hostName: "Moshe & Chaim Estates",
          hostPhone: "+972 54-123-4567",
          hostEmail: "owner@shabbosrent.com",
          status: "Confirmed",
          amount: "₪4,500",
          image: galleryImages[0]
        };
        localStorage.setItem("user_booking_history", JSON.stringify([newBooking, ...existingBookings]));
      }
    }
    
    setActiveConfirmationCode(code);
    setConfirmedShabbosDate(currentWeek);
    setIsSelectWeekModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("userRole") !== null;
      if (!isLoggedIn) {
        const currentPath = `/apartments/${id}${isSwapMode ? '?mode=swap' : ''}`;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        setIsAuthChecked(true);
      }
    }
  }, [id, isSwapMode, router]);

  const hasUserListing = typeof window !== 'undefined' && localStorage.getItem("hasUserListing") === "true";

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-12 h-12 border-4 border-[#4c55a4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Login Required</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            You must be logged in to view apartment details. Redirecting to login page...
          </p>
          <a 
            href={`/login?redirect=${encodeURIComponent(`/apartments/${id}${isSwapMode ? '?mode=swap' : ''}`)}`} 
            className="inline-block px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Click here if not redirected
          </a>
        </div>
      </div>
    );
  }

  const amenitiesList = [
    { icon: Wifi, label: "Fast High-Speed WiFi" },
    { icon: Tent, label: "Private Balcony View" },
    { icon: Monitor, label: "Dedicated Workspace" },
    { icon: ChefHat, label: "Fully Equipped Kosher Kitchen" },
    { icon: Coffee, label: "Coffee Maker" },
    { icon: Tv, label: "Smart TV with Netflix" },
    { icon: Snowflake, label: "Air Conditioning" },
    { icon: Car, label: "Free Parking on Premises" },
    { icon: WashingMachine, label: "Washer & Dryer" },
  ];
  
  const displayedAmenities = showAllAmenities ? amenitiesList : amenitiesList.slice(0, 6);

  // Dynamic Logic: Determine availability based on ID and apartment metadata
  const baseId = id ? id.split("-")[0] : "1";
  const targetApartment = mockBaseApartments.find((a) => a.id === id || a.id === baseId) || similarApartments.find((a) => a.id === id);
  const isApartmentAvailable = targetApartment ? targetApartment.isAvailable !== false : (id !== "2" && id !== "4" && id !== "6");
  const availableDates = isApartmentAvailable ? mockAvailableDates : [];

  // Mock Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert("Message sent successfully!"); // Simulate success
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 relative">
      <MainNavbar />
      
      {/* Title Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-md border border-blue-200 dark:border-blue-800/50">
                   {t("apartment_details.apartment_id")}{id}
                 </span>
                 <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xs rounded-md border border-green-200 dark:border-green-800/50 flex items-center gap-1">
                   <ShieldCheck className="w-3.5 h-3.5" /> {t("apartment_details.verified_listing")}
                 </span>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">
                 Beautiful Apartment in Jerusalem
               </h1>
               <div className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                 <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
                   <MapPin className="w-4 h-4" />
                   Rehavia, Jerusalem
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
         {/* Main Single Column Layout */}
         <div className="space-y-8">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="w-full h-[400px] md:h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl overflow-hidden relative group shadow-sm">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={activeImage} 
                   className="w-full h-full object-cover transition-opacity duration-300" 
                   alt="Apartment Interior Main" 
                 />
              </div>
              {/* Thumbnail Row */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border-4 transition-all shadow-sm ${activeImage === img ? 'border-[#4c55a4] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                     <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("apartment_details.about_home")}</h2>
                  {!isSwapMode && <span className="text-3xl font-black text-zinc-900 dark:text-white">₪4500</span>}
                </div>
                
                {/* Basic Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <BedDouble className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      4 {t("apartment_details.beds")}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Bath className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      3 {t("apartment_details.baths")}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Users className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      {t("apartment_details.up_to")} 8 {t("apartment_details.guests")}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      disabled
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm border cursor-default ${
                        availableDates.length > 0 
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" 
                          : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 cursor-not-allowed"
                      }`}
                    >
                       {availableDates.length > 0 ? t("apartment_details.available_upcoming") : t("apartment_details.unavailable_upcoming")}
                    </button>
                    {!isSwapMode && (
                      isApartmentAvailable ? (
                        <button 
                          onClick={() => setIsLandlordModalOpen(true)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 text-sm"
                        >
                           {t("apartment_details.interested")}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setIsUnavailableModalOpen(true)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 text-sm flex items-center justify-center gap-1.5"
                        >
                           {t("apartment_details.interested")}
                        </button>
                      )
                    )}
                    {isSwapMode && (
                      <button 
                        onClick={() => {
                          if (!isApartmentAvailable) {
                            setIsUnavailableModalOpen(true);
                          } else {
                            setIsSwapModalOpen(true);
                          }
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                      >
                         <ArrowRightLeft className="w-4 h-4" /> {t("apartment_details.swap_now")}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-8">
                   Experience the perfect Shabbos in this beautifully appointed apartment. Centrally located with easy access to shuls and kosher dining. The apartment features a fully equipped kosher kitchen with double sinks, a spacious dining area that comfortably seats your whole family, and comfortable beds with premium linens.
                </p>

                <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{t("apartment_details.what_offers")}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedAmenities.map((amenity, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                      <amenity.icon className="w-5 h-5 text-zinc-400" /> {amenity.label}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  {!showAllAmenities && amenitiesList.length > 6 && (
                    <button 
                      onClick={() => setShowAllAmenities(true)}
                      className="w-full sm:w-auto px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 hover:border-[#4c55a4] hover:bg-blue-50 dark:hover:bg-[#4c55a4]/10 text-zinc-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                    >
                      + {amenitiesList.length - 6} {t("apartment_details.more")}
                    </button>
                  )}
                  {availableDates.length > 0 && (
                    <button 
                      onClick={() => setIsDatesModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold transition-all shadow-md text-sm"
                    >
                      {t("apartment_details.see_all_dates")}
                    </button>
                  )}
                </div>
            </div>

            {/* Contact Landlord Section */}
            <div className="bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10 rounded-3xl p-6 md:p-8 border border-[#4c55a4]/20 dark:border-[#4c55a4]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                   <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                     {isApartmentAvailable ? t("apartment_details.like_apartment") : "Apartment Unavailable for Upcoming Week"}
                   </h2>
                   <p className="text-zinc-600 dark:text-zinc-400">
                     {isApartmentAvailable 
                       ? t("apartment_details.get_in_touch") 
                       : "You can still send an offer or special request to the owner for future stays."}
                   </p>
                </div>
                {isApartmentAvailable ? (
                  <button 
                     onClick={() => setIsLandlordModalOpen(true)}
                     className="px-8 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                  >
                     <Phone className="w-4 h-4" />
                     {t("apartment_details.contact_landlord")}
                  </button>
                ) : (
                  <button 
                     onClick={() => setIsUnavailableModalOpen(true)}
                     className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                  >
                     {t("apartment_details.interested")}
                  </button>
                )}
            </div>

            {/* Map & Walking Distance Calculator Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">{t("apartment_details.location_map")}</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Ramban St 14, Rehavia, Jerusalem</p>
                </div>

                {/* Interactive Walking Distance Calculator Card */}
                {(() => {
                  const targetCoords = getCoordinatesForAddress(destInput || "Jerusalem");
                  const aptLat = 31.7745;
                  const aptLng = 35.2150;
                  const walkingMins = calculateWalkingMinutes(targetCoords.lat, targetCoords.lng, aptLat, aptLng);
                  const distanceKm = calculateDistanceKm(targetCoords.lat, targetCoords.lng, aptLat, aptLng);

                  return (
                    <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/80 dark:from-zinc-800/80 dark:to-zinc-800/50 p-5 rounded-2xl border border-indigo-100 dark:border-zinc-700/80 mb-6 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-[#4c55a4]" /> Walking Distance Calculator
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                        Enter your target destination (e.g. Shul, Kotel, Great Synagogue, Rehavia) to calculate walking time:
                      </p>
                      
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#4c55a4]" />
                        </div>
                        <input 
                          type="text" 
                          value={destInput}
                          onChange={(e) => setDestInput(e.target.value)}
                          placeholder="e.g. Kotel, Great Synagogue, Rehavia..."
                          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-indigo-100 dark:border-zinc-700/60">
                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-100 dark:border-zinc-700/60 shadow-xs">
                          <div className="p-2.5 bg-[#4c55a4]/10 rounded-xl text-[#4c55a4]">
                            <Footprints className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Walking Time</span>
                            <span className="text-base font-black text-[#4c55a4] dark:text-indigo-400">🚶 {walkingMins} Minutes</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-100 dark:border-zinc-700/60 shadow-xs">
                          <div className="p-2.5 bg-[#4c55a4]/10 rounded-xl text-[#4c55a4]">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Distance</span>
                            <span className="text-base font-black text-zinc-900 dark:text-white">📍 {distanceKm} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="w-full h-[350px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=en&amp;q=Rehavia,%20Jerusalem+(Rehavia,%20Jerusalem)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                      className="w-full h-full grayscale-[20%] contrast-[1.1] dark:invert-[90%] dark:hue-rotate-180"
                      title="Apartment Location"
                    />
                </div>
            </div>

         </div>
      </div>

      {/* Similar Luxury Stays Section */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-16 bg-[#fafafa] dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">
            {t("apartment_details.similar_stays")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarApartments.map(apt => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#4c55a4]" /> {t("apartment_details.contact_property")}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                You are contacting <span className="font-bold text-zinc-900 dark:text-white">Beautiful Apartment in Jerusalem</span>. Fill out the details below.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.full_name")}</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.email_address")}</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.phone_number")}</label>
                  <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all" />
                </div>

                {/* Offer Price Input Fields (Min & Max) */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    {t("apartment_details.offer_price")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        {t("apartment_details.min_offer")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">₪</span>
                        <input 
                          type="number" 
                          placeholder="Min ₪"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all text-sm font-semibold" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        {t("apartment_details.max_offer")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">₪</span>
                        <input 
                          type="number" 
                          placeholder="Max ₪"
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all text-sm font-semibold" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {availableDates.length > 0 && (
                  <div className="relative z-20">
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.which_shabbos")}</label>
                    <div className="relative">
                      <div 
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border ${isDateDropdownOpen ? 'border-[#4c55a4] ring-2 ring-[#4c55a4]/20' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white cursor-pointer transition-all flex items-center justify-between`}
                      >
                        <span className={selectedDate ? "font-bold" : "text-zinc-500"}>
                          {selectedDate ? availableDates.find(d => d.id.toString() === selectedDate)?.date + " • " + availableDates.find(d => d.id.toString() === selectedDate)?.reason : t("apartment_details.select_date")}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isDateDropdownOpen ? "rotate-180" : ""}`} />
                      </div>
                      
                      {isDateDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                          {availableDates.map(d => (
                            <div 
                              key={d.id} 
                              onClick={() => {
                                setSelectedDate(d.id.toString());
                                setIsDateDropdownOpen(false);
                              }}
                              className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                            >
                              <div className="font-bold text-zinc-900 dark:text-white">{d.date}</div>
                              <div className="text-sm text-zinc-500">{d.reason}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.message")}</label>
                  <textarea required rows={4} placeholder="Hello, I am interested in this property for..." className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all resize-none"></textarea>
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2">
                    {t("apartment_details.send_message")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dates Modal */}
      {isDatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#4c55a4]" /> {t("apartment_details.available_dates")}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 ml-7 truncate max-w-[280px] sm:max-w-[320px]">
                  {t("apartment_details.upcoming_dates")}
                </p>
              </div>
              <button 
                onClick={() => setIsDatesModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {availableDates.map(date => (
                  <div key={date.id} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-[#4c55a4] hover:bg-blue-50/50 dark:hover:bg-[#4c55a4]/10 transition-colors cursor-pointer group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-[#4c55a4]">{date.date}</span>
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">{date.day}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{date.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Landlord Contact Modal */}
      {isLandlordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/80 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative">
            {/* Ambient Background Blur Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#4c55a4]/20 via-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 relative z-10">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 flex items-center justify-center text-[#4c55a4] dark:text-[#6b75c8]">
                  <Phone className="w-4 h-4" />
                </div>
                {t("apartment_details.contact_landlord")}
              </h3>
              <button 
                onClick={() => setIsLandlordModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 relative z-10 space-y-4">
              
              {/* Apartment Code Box */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                 <div>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{t("apartment_details.apartment_code")}</p>
                   <p className="text-lg font-black text-[#4c55a4] dark:text-[#8892eb] tracking-wide">APT-{id}</p>
                 </div>
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`APT-${id}`);
                     setIsCopied(true);
                     setTimeout(() => setIsCopied(false), 2000);
                   }} 
                   className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5" 
                   title="Copy Code"
                 >
                   {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} Copy Code
                 </button>
              </div>

              {/* DIRECT OWNER CONTACT */}
              <div>
                 <p className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider mb-2.5">DIRECT OWNER CONTACT</p>
                 
                 {/* Row 1: Call Owner & WhatsApp Owner in SAME ROW */}
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <a 
                      href="tel:+972541234567"
                      className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                    >
                      <Phone className="w-4 h-4" /> Call Owner
                    </a>
                    <a 
                      href="https://wa.me/972541234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp Owner
                    </a>
                 </div>

                 {/* Row 2: Contact Owner by Email in Next Row */}
                 <a 
                   href={`mailto:owner@shabbosrent.com?subject=Inquiry%20regarding%20Apartment%20APT-${id}`}
                   className="w-full py-3 bg-white dark:bg-zinc-900 hover:bg-[#4c55a4]/5 dark:hover:bg-indigo-500/10 text-[#4c55a4] dark:text-indigo-300 border-2 border-[#4c55a4] dark:border-indigo-500 rounded-xl font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                 >
                   <Mail className="w-4 h-4 text-[#4c55a4] dark:text-indigo-300" /> Contact Owner by Email
                 </a>
              </div>

              {/* Section 2: ShabbosRent Official Support Hotline in Following Row */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 mb-3">
                 <p className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                   <ShieldCheck className="w-4 h-4 text-emerald-600" /> SHABBOSRENT OFFICIAL SUPPORT HOTLINE
                 </p>
                 <a 
                   href="tel:+97225007890"
                   className="w-full py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-extrabold transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                 >
                   <Phone className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> Call Hotline (+972 2-500-7890)
                 </a>
              </div>

              {/* B1 — Renter Confirmation Section */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={handleStartRenterConfirm}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  I confirmed with the landlord
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Option 1 — Select Agreed Shabbos Date Modal */}
      {isSelectWeekModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative p-6 md:p-8">
            <button 
              onClick={() => setIsSelectWeekModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#4c55a4]/10 text-[#4c55a4] flex items-center justify-center mb-4">
              <CalendarCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">
              Select Agreed Shabbos Date
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Which Shabbos date did you agree on with the landlord?
            </p>

            <div className="space-y-3 mb-6">
              {mockAvailableDates.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedAgreedWeek(d.date)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAgreedWeek === d.date
                      ? "border-[#4c55a4] bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-extrabold text-zinc-900 dark:text-white text-sm">{d.date}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{d.reason}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAgreedWeek === d.date ? "border-[#4c55a4] bg-[#4c55a4]" : "border-zinc-300 dark:border-zinc-600"}`}>
                    {selectedAgreedWeek === d.date && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => executeRenterConfirm(selectedAgreedWeek)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm Booking & Get Code
            </button>
          </div>
        </div>
      )}

      {/* B2 — Confirmation Modal Page */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative text-center p-6 md:p-8">
            <button 
              onClick={() => setIsConfirmationModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Your agreement with the host for <strong className="text-zinc-900 dark:text-white">{confirmedShabbosDate}</strong> has been recorded.
            </p>

            {/* B3 - Confirmation Code Card */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 mb-4 text-left">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Unique Confirmation Code
                </p>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                  {confirmedShabbosDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-emerald-900 dark:text-emerald-200 tracking-wider">
                  {activeConfirmationCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeConfirmationCode);
                    setIsConfCopied(true);
                    setTimeout(() => setIsConfCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                >
                  {isConfCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {isConfCopied ? "Copied" : "Copy Code"}
                </button>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 mb-6 text-left">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#4c55a4]" /> Full Apartment Address
              </p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                Ramban St 14, Rehavia, Jerusalem, Israel
              </p>
            </div>

            {/* Waze Link Button */}
            <div className="space-y-2.5">
              <a
                href="https://waze.com/ul?q=Ramban+St+14+Rehavia+Jerusalem&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#33ccff] hover:bg-[#28b8e6] text-zinc-950 font-extrabold rounded-xl shadow-md shadow-[#33ccff]/20 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4 fill-zinc-950" /> Get Directions with Waze
              </a>

              <Link
                href="/user-dashboard?tab=bookings"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("dashboardTab", "bookings");
                    localStorage.setItem("pendingBookingsAction", "true");
                  }
                }}
                className="block w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold text-xs transition-colors"
              >
                View in My Booking History
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500" /> 
                {hasUserListing ? (swapModalState === "contact" ? t("apartment_details.contact_owner") : t("apartment_details.swap_now")) : t("apartment_details.action_required")}
              </h3>
              <button 
                onClick={() => {
                  setIsSwapModalOpen(false);
                  setTimeout(() => setSwapModalState("initial"), 300);
                }}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!hasUserListing ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("apartment_details.no_listing")}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                    {t("apartment_details.need_listing")}
                  </p>
                  <Link 
                    href="/user-dashboard"
                    className="block w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20"
                  >
                    {t("apartment_details.go_dashboard")}
                  </Link>
                </div>
              ) : swapModalState === "initial" ? (
                <div>
                  <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                    {t("apartment_details.request_swap_match")}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    
                    {/* Your Listing */}
                    <div className="flex-1 w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <div className="h-32 w-full bg-zinc-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" alt="Your Listing" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-white shadow-sm">
                          {t("apartment_details.your_listing")}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 text-zinc-500 mb-2 text-xs">
                          <MapPin className="w-3 h-3" /> Rehavia, Jerusalem
                        </div>
                        <div className="flex flex-wrap items-center text-xs text-zinc-700 dark:text-zinc-300 font-medium gap-y-2">
                          <span className="flex items-center gap-1 w-1/2"><BedDouble className="w-3.5 h-3.5 text-[#4c55a4]" /> 3 Beds</span>
                          <span className="flex items-center gap-1 w-1/2"><Bath className="w-3.5 h-3.5 text-[#4c55a4]" /> 2 Rooms</span>
                          <span className="flex items-center gap-1 w-1/2"><Users className="w-3.5 h-3.5 text-[#4c55a4]" /> 6 Guests</span>
                          <span className="flex items-center gap-1 w-1/2"><Footprints className="w-3.5 h-3.5 text-[#4c55a4]" /> 10m walk</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center justify-center bg-amber-500 text-white rounded-full p-2.5 shadow-md z-10 transform sm:rotate-0 rotate-90 my-2 sm:my-0">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    
                    {/* Target Apartment */}
                    <div className="flex-1 w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-amber-300 dark:border-amber-600 shadow-sm shadow-amber-500/10 ring-1 ring-amber-500/20">
                      <div className="h-32 w-full bg-zinc-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={activeImage} alt="Target Apartment" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {t("apartment_details.this_apartment")}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 text-zinc-500 mb-2 text-xs">
                          <MapPin className="w-3 h-3" /> City Center, Jerusalem
                        </div>
                        <div className="flex flex-wrap items-center text-xs text-zinc-700 dark:text-zinc-300 font-medium gap-y-2">
                          <span className="flex items-center gap-1 w-1/2"><BedDouble className="w-3.5 h-3.5 text-[#4c55a4]" /> 4 Beds</span>
                          <span className="flex items-center gap-1 w-1/2"><Bath className="w-3.5 h-3.5 text-[#4c55a4]" /> 3 Rooms</span>
                          <span className="flex items-center gap-1 w-1/2"><Users className="w-3.5 h-3.5 text-[#4c55a4]" /> 8 Guests</span>
                          <span className="flex items-center gap-1 w-1/2"><Footprints className="w-3.5 h-3.5 text-[#4c55a4]" /> 5m walk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSwapModalState("contact")}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-500/20"
                  >
                    {t("apartment_details.confirm_request")}
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">{t("apartment_details.swap_confirmed")}</h4>
                    <p className="text-sm text-zinc-500">{t("apartment_details.contact_owner_finalize")}</p>
                  </div>
                  
                     <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-700 dark:text-amber-500 font-bold uppercase tracking-wider mb-1">{t("apartment_details.swap_code")}</p>
                          <p className="text-xl font-bold text-amber-900 dark:text-amber-300 tracking-wide">SWP-8472</p>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("SWP-8472");
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }} 
                          className="relative w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors text-amber-700 dark:text-amber-500 overflow-hidden" 
                          title="Copy Swap Code"
                        >
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCopied ? 'scale-0 opacity-0 -translate-y-2' : 'scale-100 opacity-100 translate-y-0'}`}>
                            <Copy className="w-5 h-5" />
                          </div>
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCopied ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-2'}`}>
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        </button>
                     </div>

                  <div className="space-y-3">
                     <a 
                       href="tel:+972501234567"
                       className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
                     >
                       <Phone className="w-5 h-5" /> {t("apartment_details.call_hotline")}
                     </a>
                     <a 
                       href="https://wa.me/972501234567"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 text-lg"
                     >
                       <MessageCircle className="w-5 h-5" /> {t("apartment_details.whatsapp")}
                     </a>
                     <a 
                       href={`mailto:owner@shabbosrent.com?subject=Swap%20Inquiry%20(SWP-8472)%20for%20Apartment%20APT-${id}`}
                       className="w-full py-4 bg-white dark:bg-zinc-900 hover:bg-[#4c55a4]/5 dark:hover:bg-indigo-500/10 text-[#4c55a4] dark:text-indigo-300 border-2 border-[#4c55a4] dark:border-indigo-500 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
                     >
                       <Mail className="w-5 h-5 text-[#4c55a4] dark:text-indigo-300" /> Contact by Email
                     </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unavailable Apartment Interceptor Modal */}
      {isUnavailableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative text-center animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsUnavailableModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <LockKeyhole className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
              Apartment Not Available for Upcoming Week
            </h3>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              This apartment is not available for the upcoming week. However, you can send an offer or special request to the owner.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsUnavailableModalOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2"
              >
                Send Offer / Request
              </button>

              <Link
                href="/search"
                className="block w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl text-sm transition-colors"
              >
                Browse Other Available Apartments
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
