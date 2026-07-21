"use client";
import Link from "next/link";
import { useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { 
  MapPin, BedDouble, Bath, Users, Star, ArrowRightLeft, 
  ShieldCheck, CalendarCheck, Wifi, Tent, Monitor, ChefHat, X, Mail,
  Coffee, Tv, Snowflake, Car, WashingMachine, Phone, MessageCircle, Copy, ChevronDown, Home, Footprints, Check
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Mock Data
const galleryImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
];

// We will use the URL parameter `id` to mock availability
// If id === '1', show dates. Otherwise, empty.
const mockAvailableDates = [
  { id: 1, date: "Oct 13 - 15", day: "Fri - Sun", reason: "Shabbos Parshat Bereishit" },
  { id: 2, date: "Oct 27 - 29", day: "Fri - Sun", reason: "Shabbos Parshat Lech Lecha" },
  { id: 3, date: "Nov 24 - 26", day: "Fri - Sun", reason: "Special Weekend" },
];

const similarApartments: ApartmentData[] = [
  { id: "sim-1", title: "Luxury Penthouse near Beach", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 4000, rating: 4.9, reviews: 120, beds: 3, baths: 2, guests: 6, isSwapAvailable: true, verified: true },
  { id: "sim-2", title: "Historic Stone House in Old City", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 4500, rating: 4.9, reviews: 150, beds: 4, baths: 3, guests: 10, isSwapAvailable: false, verified: true },
  { id: "sim-3", title: "Elegant Residence with Panoramic View", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 5000, rating: 4.8, reviews: 110, beds: 5, baths: 4, guests: 12, isSwapAvailable: true, verified: true },
  { id: "sim-4", title: "Artistic Villa with Mountain Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 3000, rating: 4.9, reviews: 105, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: true },
];

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
  const [landlordModalState, setLandlordModalState] = useState<"initial" | "options">("initial");
  const [isCopied, setIsCopied] = useState(false);
  
  const searchParams = useSearchParams();
  const isSwapMode = searchParams.get("mode") === "swap";
  const [isNumberRevealed, setIsNumberRevealed] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapModalState, setSwapModalState] = useState<"initial" | "contact">("initial");
  
  const hasUserListing = typeof window !== 'undefined' && localStorage.getItem("hasUserListing") === "true";

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

  // MOCK LOGIC: Always show mock available dates for the dropdown to work in testing
  const availableDates = mockAvailableDates;

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
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 text-sm"
                      >
                         {t("apartment_details.interested")}
                      </button>
                    )}
                    {isSwapMode && (
                      <button 
                        onClick={() => setIsSwapModalOpen(true)}
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
                   <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t("apartment_details.like_apartment")}</h2>
                   <p className="text-zinc-600 dark:text-zinc-400">{t("apartment_details.get_in_touch")}</p>
                </div>
                {!isNumberRevealed ? (
                  <button 
                     onClick={() => {
                       setLandlordModalState("initial");
                       setIsLandlordModalOpen(true);
                     }}
                     className="px-8 py-3.5 bg-white dark:bg-zinc-900 text-[#4c55a4] hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-[#4c55a4]/20 dark:border-[#4c55a4]/30 rounded-xl font-bold transition-all shadow-sm shadow-[#4c55a4]/5 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                     {t("apartment_details.contact_landlord")}
                  </button>
                ) : (
                  <div className="flex flex-col items-center sm:items-end">
                    <button 
                       onClick={() => {
                         setLandlordModalState("options");
                         setIsLandlordModalOpen(true);
                       }}
                       className="group px-6 py-3 bg-white dark:bg-zinc-900 border-2 border-[#4c55a4] hover:bg-[#4c55a4]/5 rounded-xl font-black text-[#4c55a4] text-2xl transition-all shadow-sm shadow-[#4c55a4]/10 flex items-center gap-4 whitespace-nowrap"
                    >
                       +972 50-123-4567
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4c55a4] text-white shadow-sm group-hover:scale-110 transition-transform animate-vibrate">
                          <Phone className="w-4 h-4" />
                       </span>
                    </button>
                    <p className="text-sm text-zinc-500 mt-3 font-medium flex items-center gap-1.5">
                       {t("apartment_details.click_view_options")} <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 sm:rotate-0" />
                    </p>
                  </div>
                )}
            </div>

            {/* Map Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">{t("apartment_details.location_map")}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">Rehavia, Jerusalem (Approx. 10 mins walk to city center)</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#4c55a4]" /> {t("apartment_details.contact_landlord")}
              </h3>
              <button 
                onClick={() => setIsLandlordModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
               {landlordModalState === "initial" && (
                 <div className="py-4">
                    <h3 className="text-[28px] font-bold text-[#5c70a8] mb-4 leading-tight">{t("apartment_details.before_close")}</h3>
                    <p className="text-[#555a64] dark:text-zinc-400 mb-10 leading-relaxed text-[17px]">
                       {t("apartment_details.remind_host")} <span className="font-bold text-[#5c70a8]">{t("apartment_details.shabbos_rent")}</span>, {t("apartment_details.maintain_site")}
                    </p>
                    <button 
                      onClick={() => {
                        setIsNumberRevealed(true);
                        setIsLandlordModalOpen(false);
                      }}
                      className="w-full py-4 bg-[#758bc6] hover:bg-[#5c70a8] text-white rounded-[14px] text-[19px] font-medium transition-all shadow-md shadow-[#758bc6]/20"
                    >
                      {t("apartment_details.show_number")}
                    </button>
                 </div>
               )}

               {landlordModalState === "options" && (
                 <div className="py-2">
                    <h4 className="text-center font-bold text-lg text-zinc-900 dark:text-white mb-4">{t("apartment_details.contact_owner")}</h4>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6 flex items-center justify-between">
                       <div>
                         <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-1">{t("apartment_details.apartment_code")}</p>
                         <p className="text-xl font-bold text-zinc-900 dark:text-white tracking-wide">APT-{id}</p>
                       </div>
                       <button onClick={() => navigator.clipboard.writeText(`APT-${id}`)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" title="Copy Code">
                         <Copy className="w-5 h-5 text-zinc-500" />
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
                    </div>
                 </div>
               )}
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
                          <span className="flex items-center gap-1 w-1/2"><Bath className="w-3.5 h-3.5 text-[#4c55a4]" /> 2 Baths</span>
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
                          <span className="flex items-center gap-1 w-1/2"><Bath className="w-3.5 h-3.5 text-[#4c55a4]" /> 3 Baths</span>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
