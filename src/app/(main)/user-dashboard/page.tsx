"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Home, LogOut, Settings, Building, RefreshCw, LayoutDashboard, MapPin, BedDouble, Bath, Users, Info, AlignLeft, CalendarCheck, Eye, Check, User, Heart, Lock, CalendarDays, Edit3, Clock, Phone, Gift, Copy, CheckCircle2, UserPlus, MoreHorizontal, Wallet, Banknote, Lightbulb, Bell, ShieldCheck, X, MessageCircle, Bookmark, Mail } from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";
import CreateListingModal from "@/components/layout/CreateListingModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import EditProfileModal from "@/components/settings/EditProfileModal";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

// Base Mock Data for all apartments
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
];

const mockApartments: ApartmentData[] = Array.from({ length: 3 }).flatMap((_, i) => 
  baseApartments.map(apt => ({
    ...apt,
    id: `${apt.id}-${i}`,
  }))
);

const telAvivApartments: ApartmentData[] = [
  { id: "ta-1", title: "Luxury Penthouse near Beach", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 4000, rating: 4.9, reviews: 120, beds: 3, baths: 2, guests: 6, isSwapAvailable: true, verified: true },
  { id: "ta-2", title: "Modern Studio in City Center", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2500, rating: 4.8, reviews: 85, beds: 1, baths: 1, guests: 2, isSwapAvailable: false, verified: true },
  { id: "ta-3", title: "Spacious Family Apartment", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price: 3200, rating: 4.7, reviews: 65, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false },
  { id: "ta-4", title: "Boutique Apartment with Sea View", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", price: 3800, rating: 5.0, reviews: 200, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: true },
];

const jerusalemApartments: ApartmentData[] = [
  { id: "jr-1", title: "Historic Stone House in Old City", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 4500, rating: 4.9, reviews: 150, beds: 4, baths: 3, guests: 10, isSwapAvailable: false, verified: true },
  { id: "jr-2", title: "Cozy Apartment near Mahane Yehuda", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2800, rating: 4.6, reviews: 90, beds: 2, baths: 1, guests: 5, isSwapAvailable: true, verified: false },
  { id: "jr-3", title: "Elegant Residence with Panoramic View", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 5000, rating: 4.8, reviews: 110, beds: 5, baths: 4, guests: 12, isSwapAvailable: true, verified: true },
  { id: "jr-4", title: "Modern Duplex in Rehavia", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", price: 3600, rating: 4.7, reviews: 75, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
];

const tzfatApartments: ApartmentData[] = [
  { id: "tz-1", title: "Artistic Villa with Mountain Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 3000, rating: 4.9, reviews: 105, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: true },
  { id: "tz-2", title: "Charming Old City Guest House", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2200, rating: 4.8, reviews: 60, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: false },
  { id: "tz-3", title: "Modern Cabin near the Forest", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 2800, rating: 4.7, reviews: 45, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
  { id: "tz-4", title: "Spacious Retreat with Galilee Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 3500, rating: 5.0, reviews: 130, beds: 5, baths: 3, guests: 10, isSwapAvailable: true, verified: true },
];

const allPossibleApartments = [...mockApartments, ...telAvivApartments, ...jerusalemApartments, ...tzfatApartments];

const SHABBATOT = [
  { id: "devarim", name: "Devarim", date: "17/7" },
  { id: "vaetchanan", name: "Vaetchanan", date: "24/7" },
  { id: "eikev", name: "Eikev", date: "31/7" },
  { id: "reeh", name: "Re'eh", date: "07/8" },
  { id: "shoftim", name: "Shoftim", date: "14/8" },
  { id: "ki-teitzei", name: "Ki Teitzei", date: "21/8" },
  { id: "ki-tavo", name: "Ki Tavo", date: "28/8" },
  { id: "nitzavim-vayelech", name: "Nitzavim-Vayelech", date: "04/9" },
  { id: "rosh-hashana", name: "Rosh Hashana", date: "11/9" },
  { id: "haazinu", name: "Ha'azinu", date: "18/9" },
  { id: "sukkot", name: "Sukkot", date: "25/9" },
  { id: "vzot-haberachah", name: "V'Zot HaBerachah", date: "02/10" },
  { id: "bereshit", name: "Bereshit", date: "09/10" },
  { id: "noach", name: "Noach", date: "16/10" },
  { id: "lech-lecha", name: "Lech-Lecha", date: "23/10" },
  { id: "vayeira", name: "Vayeira", date: "30/10" },
  { id: "chayei-sara", name: "Chayei Sara", date: "06/11" },
  { id: "toldot", name: "Toldot", date: "13/11" },
  { id: "vayetzei", name: "Vayetzei", date: "20/11" },
  { id: "vayishlach", name: "Vayishlach", date: "27/11" },
  { id: "vayeshev", name: "Vayeshev", date: "04/12" },
  { id: "miketz", name: "Miketz", date: "11/12" },
  { id: "vayigash", name: "Vayigash", date: "18/12" },
  { id: "vayechi", name: "Vayechi", date: "25/12" }
];

const mockRenterBookings = [
  {
    id: "b-1",
    refCode: "SR-8492",
    apartmentId: "1",
    title: "Luxury Penthouse with Kosher Kitchen",
    location: "Rehavia, Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    dateRange: "Oct 13 - 15, 2024",
    hostName: "Moshe & Chaim Estates",
    hostPhone: "+972 54-123-4567",
    hostEmail: "owner@rehavia-estates.com",
    totalPrice: 3500,
    status: "Upcoming",
  },
  {
    id: "b-2",
    refCode: "SR-7210",
    apartmentId: "2",
    title: "Cozy Family Apartment near Kotel",
    location: "Jewish Quarter, Jerusalem",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
    dateRange: "Sep 27 - 29, 2024",
    hostName: "Sarah Cohen",
    hostPhone: "+972 50-987-6543",
    hostEmail: "sarah.cohen@jerusalemhomes.com",
    totalPrice: 1800,
    status: "Completed",
  },
  {
    id: "b-3",
    refCode: "SR-5811",
    apartmentId: "3",
    title: "Modern Villa with Private Garden",
    location: "Baka, Jerusalem",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    dateRange: "Aug 18 - 20, 2024",
    hostName: "David Goldstein",
    hostPhone: "+972 52-444-3322",
    hostEmail: "david@bakavilla.co.il",
    totalPrice: 5200,
    status: "Completed",
  },
];

export default function UserDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("add");
  const [isSwapEnabled, setIsSwapEnabled] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [hasListing, setHasListing] = useState(false);
  const [manageSubTab, setManageSubTab] = useState("my_listing");
  const [settingsSubTab, setSettingsSubTab] = useState("profile");
  const [isApartmentVisible, setIsApartmentVisible] = useState(true);
  const [selectedShabbatot, setSelectedShabbatot] = useState<string[]>([]);
  const [createdListingDate, setCreatedListingDate] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [savedApartments, setSavedApartments] = useState<ApartmentData[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Email & Notification Preferences State
  const [emailOptInState, setEmailOptInState] = useState(true);
  const [emailBookingsState, setEmailBookingsState] = useState(true);
  const [emailPromosState, setEmailPromosState] = useState(true);
  const [emailNewsletterState, setEmailNewsletterState] = useState(true);
  const [emailSavedToast, setEmailSavedToast] = useState(false);

  // Renter Dashboard State
  const [selectedContactBooking, setSelectedContactBooking] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmailOptInState(localStorage.getItem("emailOptIn") !== "false");
      setEmailBookingsState(localStorage.getItem("emailBookings") !== "false");
      setEmailPromosState(localStorage.getItem("emailPromos") !== "false");
      setEmailNewsletterState(localStorage.getItem("emailNewsletter") !== "false");
    }
  }, []);

  const handleSaveEmailPreferences = (optIn: boolean, bookings: boolean, promos: boolean, newsletter: boolean) => {
    setEmailOptInState(optIn);
    setEmailBookingsState(bookings);
    setEmailPromosState(promos);
    setEmailNewsletterState(newsletter);

    localStorage.setItem("emailOptIn", optIn ? "true" : "false");
    localStorage.setItem("emailBookings", bookings ? "true" : "false");
    localStorage.setItem("emailPromos", promos ? "true" : "false");
    localStorage.setItem("emailNewsletter", newsletter ? "true" : "false");

    setEmailSavedToast(true);
    setTimeout(() => setEmailSavedToast(false), 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem("dashboardTab");
      const hasListingVal = localStorage.getItem("hasUserListing") === "true";
      
      if (hasListingVal) {
        setHasListing(true);
      }
      
      let initialTabSet = false;
      
      if (localStorage.getItem("pendingSwapAction") === "true") {
        setActiveTab("swap");
        sessionStorage.setItem("dashboardTab", "swap");
        setIsSwapEnabled(true);
        localStorage.removeItem("pendingSwapAction");
        initialTabSet = true;
      }
      if (localStorage.getItem("pendingSettingsAction") === "true") {
        setActiveTab("settings");
        sessionStorage.setItem("dashboardTab", "settings");
        localStorage.removeItem("pendingSettingsAction");
        initialTabSet = true;
      }
      if (localStorage.getItem("pendingNotificationAction") === "true") {
        setActiveTab("notifications");
        sessionStorage.setItem("dashboardTab", "notifications");
        localStorage.removeItem("pendingNotificationAction");
        initialTabSet = true;
      }
      
      if (!initialTabSet && savedTab) {
        if (hasListingVal && savedTab === "add") {
          setActiveTab("manage");
          sessionStorage.setItem("dashboardTab", "manage");
        } else {
          setActiveTab(savedTab);
        }
      } else if (!initialTabSet && !savedTab) {
        if (hasListingVal) {
          setActiveTab("manage");
          sessionStorage.setItem("dashboardTab", "manage");
        }
      }
      
      const savedVisibility = localStorage.getItem("isApartmentVisible");
      if (savedVisibility !== null) {
        setIsApartmentVisible(savedVisibility === "true");
      }
      
      const savedShabbatot = localStorage.getItem("selectedShabbatot");
      if (savedShabbatot) {
        try {
          setSelectedShabbatot(JSON.parse(savedShabbatot));
        } catch (e) {
          console.error("Failed to parse selected Shabbatot");
        }
      }
      
      const savedDate = localStorage.getItem("createdListingDate");
      if (savedDate) {
        setCreatedListingDate(savedDate);
      }

      // Saved apartments logic
      const updateSaved = () => {
        const savedIds = JSON.parse(localStorage.getItem("savedApartments") || "[]");
        const matchingApts = allPossibleApartments.filter(apt => savedIds.includes(apt.id));
        if (savedIds.includes("dummy")) {
          matchingApts.unshift({ id: "dummy", title: "Bright luxury apartment in city center", location: "City Center, Jerusalem", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", price: 1500, rating: 5.0, reviews: 0, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false });
        }
        setSavedApartments(matchingApts);
      };
      updateSaved();
      window.addEventListener("savedApartmentsChanged", updateSaved);
      return () => window.removeEventListener("savedApartmentsChanged", updateSaved);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const navItems = [
    !hasListing ? { id: "add", label: t("dashboard.nav.add"), icon: PlusCircle, color: "text-emerald-600" } : null,
    { id: "manage", label: t("dashboard.nav.manage"), icon: Building, color: "text-blue-600" },
    { id: "swap", label: t("dashboard.nav.swap"), icon: RefreshCw, color: "text-indigo-500" },
    { id: "favorites", label: "Favorites & Saved", icon: Heart, color: "text-pink-500" },
    { id: "bookings", label: "Booking History", icon: CalendarDays, color: "text-amber-500" },
    { id: "affiliate", label: t("dashboard.nav.affiliate"), icon: Gift, color: "text-purple-500" },
    { id: "notifications", label: t("dashboard.nav.notifications"), icon: Bell, color: "text-blue-500" },
    { id: "settings", label: t("dashboard.nav.settings"), icon: Settings, color: "text-zinc-600 dark:text-zinc-400" },
  ].filter(Boolean) as Array<{ id: string, label: string, icon: any, color: string }>;

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      <MainNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-[#121212] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hidden md:flex z-10">
          <div className="p-4 flex flex-col flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                O
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">{t("dashboard.owner_dashboard")}</h3>
                <p className="text-xs text-zinc-500">{t("dashboard.property_owner")}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[150px]">owner@demo.com</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className={classNames(
                    index !== 0 ? "border-t border-zinc-100 dark:border-zinc-800/60" : ""
                  )}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        sessionStorage.setItem("dashboardTab", item.id);
                      }}
                      className={classNames(
                        isActive 
                          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30" 
                          : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                        "group w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all my-1 text-left"
                      )}
                    >
                      <item.icon className={classNames(item.color, "h-5 w-5 shrink-0")} aria-hidden="true" />
                      <span className={classNames(
                        isActive ? "text-blue-900 dark:text-blue-300" : "text-zinc-900 dark:text-white",
                        "text-[15px] font-bold leading-tight"
                      )}>
                        {item.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <Link 
              href="/"
              className="group w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all my-1 text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              <Home className="w-5 h-5 shrink-0 text-sky-500" />
              <span className="text-[15px] font-bold leading-tight text-zinc-900 dark:text-white">{t("dashboard.nav.home")}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-[15px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{t("dashboard.nav.logout")}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 w-full">
          <div className="w-full mx-auto">
            {activeTab === "add" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{t("dashboard.add.title")}</h1>
                <p className="text-zinc-500 mb-8">{t("dashboard.add.desc")}</p>
                
                {hasListing ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm w-full flex flex-col md:flex-row">
                    <div className="relative h-56 md:h-auto md:w-2/5 lg:w-1/3 shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" alt="Apartment" className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm text-zinc-900 dark:text-white">Jerusalem</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-amber-500/90 text-white backdrop-blur-md rounded-lg text-xs font-bold shadow-sm">{t("dashboard.add.under_review")}</span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                          <div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">Bright luxury apartment in city center</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base">Beautiful 4-bedroom apartment with a panoramic view.</p>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <span className="font-black text-2xl text-[#4c55a4] dark:text-indigo-400">₪1,500</span>
                            <span className="block text-sm text-zinc-500 font-medium">{t("dashboard.add.night")}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                          <MapPin className="w-4 h-4" /> City Center, Jerusalem
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 mb-6">
                          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                            <BedDouble className="w-4 h-4 text-blue-500" />
                            <span>4 {t("dashboard.add.beds")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                            <Bath className="w-4 h-4 text-emerald-500" />
                            <span>2 {t("dashboard.add.baths")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>8 {t("dashboard.add.guests")}</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{t("dashboard.add.availability_events")}</h4>
                          {(selectedShabbatot.length > 0 || createdListingDate) ? (
                            <div className="flex flex-wrap gap-3">
                              {createdListingDate && (
                                <div className="flex flex-col bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                                  <span className="text-indigo-700 dark:text-indigo-300 text-sm font-bold">{createdListingDate.split(' (')[0]}</span>
                                  <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-medium">{createdListingDate.split(' (')[1]?.replace(')', '') || createdListingDate}</span>
                                </div>
                              )}
                              {SHABBATOT.filter(s => selectedShabbatot.includes(s.id)).map(shabbat => (
                                <div key={shabbat.id} className="flex flex-col bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                                  <span className="text-indigo-700 dark:text-indigo-300 text-sm font-bold">{shabbat.date}</span>
                                  <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-medium">Shabbat {shabbat.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-500 italic">{t("dashboard.add.no_dates")}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                        <button 
                          onClick={() => { setModalMode("edit"); setIsCreateModalOpen(true); }}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          {t("dashboard.add.edit_listing")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("dashboard.add.start_new")}</h3>
                      <p className="text-zinc-500 max-w-sm mx-auto mb-6">{t("dashboard.add.enter_details")}</p>
                      <button 
                        onClick={() => { setModalMode("create"); setIsCreateModalOpen(true); }}
                        className="inline-block px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20"
                      >
                        {t("dashboard.add.create_listing")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "manage" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{t("dashboard.manage.title")}</h1>
                <p className="text-zinc-500 mb-8">{t("dashboard.manage.desc")}</p>
                
                {hasListing ? (
                  <div className="flex flex-col">
                    {/* Premium Tabs Above */}
                    <div className="flex items-center p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl mb-8 border border-zinc-200/80 dark:border-zinc-700/50 w-fit shadow-sm">
                      <button 
                        onClick={() => setManageSubTab("my_listing")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "my_listing" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        {t("dashboard.manage.tabs.my_listing")}
                      </button>
                      <button 
                        onClick={() => setManageSubTab("interested_request")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "interested_request" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        {t("dashboard.manage.tabs.interested")}
                      </button>
                      <button 
                        onClick={() => setManageSubTab("report_renter")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "report_renter" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        {t("dashboard.manage.tabs.report_renter")}
                      </button>
                      <button 
                        onClick={() => setManageSubTab("report_history")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "report_history" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        {t("dashboard.manage.tabs.report_history")}
                      </button>
                      <button 
                        onClick={() => setManageSubTab("apartment_calendar")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "apartment_calendar" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        {t("dashboard.manage.tabs.calendar")}
                      </button>
                    </div>

                    <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
                      {manageSubTab === "my_listing" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm h-fit w-full flex flex-col md:flex-row">
                          <div className="relative h-56 md:h-auto md:w-2/5 lg:w-1/3 shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" alt="Apartment" className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm text-zinc-900 dark:text-white">Jerusalem</span>
                            </div>
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1.5 bg-green-500/90 text-white backdrop-blur-md rounded-lg text-xs font-bold shadow-sm">{t("dashboard.manage.active")}</span>
                            </div>
                          </div>
                          <div className="p-6 md:p-8 flex flex-col justify-between w-full">
                            <div>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">Bright luxury apartment in city center</h3>
                                  <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base">Beautiful 4-bedroom apartment with a panoramic view.</p>
                                </div>
                                <div className="sm:text-right shrink-0">
                                  <span className="font-black text-2xl text-[#4c55a4] dark:text-indigo-400">₪1,500</span>
                                  <span className="block text-sm text-zinc-500 font-medium">{t("dashboard.add.night")}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                                <MapPin className="w-4 h-4" /> City Center, Jerusalem
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 mb-6">
                                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                                  <BedDouble className="w-4 h-4 text-blue-500" />
                                  <span>4 {t("dashboard.add.beds")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                                  <Bath className="w-4 h-4 text-emerald-500" />
                                  <span>2 {t("dashboard.add.baths")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                                  <Users className="w-4 h-4 text-orange-500" />
                                  <span>8 {t("dashboard.add.guests")}</span>
                                </div>
                              </div>
                              
                              <div className="mb-6">
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{t("dashboard.add.availability_events")}</h4>
                                {(selectedShabbatot.length > 0 || createdListingDate) ? (
                                  <div className="flex flex-wrap gap-3">
                                    {createdListingDate && (
                                      <div className="flex flex-col bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                                        <span className="text-indigo-700 dark:text-indigo-300 text-sm font-bold">{createdListingDate.split(' (')[0]}</span>
                                        <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-medium">{createdListingDate.split(' (')[1]?.replace(')', '') || createdListingDate}</span>
                                      </div>
                                    )}
                                    {SHABBATOT.filter(s => selectedShabbatot.includes(s.id)).map(shabbat => (
                                      <div key={shabbat.id} className="flex flex-col bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                                        <span className="text-indigo-700 dark:text-indigo-300 text-sm font-bold">{shabbat.date}</span>
                                        <span className="text-indigo-600/80 dark:text-indigo-400/80 text-xs font-medium">Shabbat {shabbat.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-zinc-500 italic">{t("dashboard.add.no_dates")}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                              <button 
                                onClick={() => { setModalMode("edit"); setIsCreateModalOpen(true); }}
                                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                {t("dashboard.add.edit_listing")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {manageSubTab === "interested_request" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col gap-4 w-full">
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("dashboard.manage.interested_requests")} (2)</h3>
                          
                          <div className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shadow-sm">
                                DC
                              </div>
                              <div>
                                <h4 className="font-bold text-zinc-900 dark:text-white text-lg">David Cohen</h4>
                                <p className="text-sm text-zinc-500 mb-1">david.c@example.com</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                  {t("dashboard.manage.requested")} Oct 24-25 Shabbos
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full mb-1">
                                <p className="font-extrabold text-green-700 dark:text-green-400">₪1,450</p>
                              </div>
                              <p className="text-xs text-zinc-500 font-medium">2 {t("dashboard.manage.hours_ago")}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg shadow-sm">
                                SL
                              </div>
                              <div>
                                <h4 className="font-bold text-zinc-900 dark:text-white text-lg">Sarah Levy</h4>
                                <p className="text-sm text-zinc-500 mb-1">sarah.levy@example.com</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                  {t("dashboard.manage.requested")} Nov 1-2 Shabbos
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full mb-1">
                                <p className="font-extrabold text-green-700 dark:text-green-400">₪1,500</p>
                              </div>
                              <p className="text-xs text-zinc-500 font-medium">1 {t("dashboard.manage.days_ago")}</p>
                            </div>
                          </div>
                          
                        </div>
                      )}
                      
                      {manageSubTab === "report_renter" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 shadow-sm flex flex-col items-center justify-center text-center w-full">
                          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                            <Info className="w-10 h-10 text-red-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{t("dashboard.manage.report_renter_title")}</h3>
                          <p className="text-zinc-500 max-w-md text-lg mb-8">{t("dashboard.manage.report_renter_desc")}</p>
                          <button className="px-8 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold transition-colors shadow-sm text-lg">
                            {t("dashboard.manage.file_report")}
                          </button>
                        </div>
                      )}
                      
                      {manageSubTab === "report_history" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 shadow-sm flex flex-col items-center justify-center text-center w-full">
                          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <AlignLeft className="w-10 h-10 text-zinc-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{t("dashboard.manage.no_report_history")}</h3>
                          <p className="text-zinc-500 max-w-md text-lg">{t("dashboard.manage.no_report_desc")}</p>
                        </div>
                      )}

                      {manageSubTab === "apartment_calendar" && (
                        <div className="flex flex-col gap-6">


                          {/* Calendar Grid Card */}
                          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm w-full">
                            <div className="mb-8 flex items-start gap-4">
                              <CalendarCheck className="w-7 h-7 text-[#4c55a4] shrink-0 mt-0.5" />
                              <div>
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">{t("dashboard.manage.manage_availability")}</h3>
                                <p className="text-[15px] text-zinc-500">{t("dashboard.manage.mark_shabatot")}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                              {SHABBATOT.map((shabbat, index) => {
                                const isSelected = selectedShabbatot.includes(shabbat.id);
                                const isUpcoming = index === 0;

                                return (
                                  <button
                                    key={shabbat.id}
                                    onClick={() => {
                                      setSelectedShabbatot(prev => 
                                        prev.includes(shabbat.id) 
                                          ? prev.filter(id => id !== shabbat.id)
                                          : [...prev, shabbat.id]
                                      );
                                    }}
                                    className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 h-32 flex flex-col justify-end bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/15
                                      ${isSelected 
                                        ? 'border-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/10' 
                                        : 'border-transparent hover:border-[#8B5CF6]/40 dark:hover:border-[#8B5CF6]/40'
                                      }`}
                                  >
                                    {isUpcoming && (
                                      <span className="absolute top-4 left-4 bg-[#E0E7FF] dark:bg-indigo-900/50 text-[#4c55a4] dark:text-indigo-300 text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase">
                                        {t("dashboard.manage.upcoming_shabbat")}
                                      </span>
                                    )}
                                    
                                    {isSelected && (
                                      <div className="absolute top-4 right-4 bg-[#8B5CF6] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </div>
                                    )}

                                    <div className="mt-auto">
                                      <h4 className="font-extrabold text-zinc-900 dark:text-white text-[17px] leading-tight mb-1">{shabbat.name}</h4>
                                      <p className="text-sm text-zinc-500 font-semibold">{shabbat.date}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-4">
                              <button 
                                onClick={() => {
                                  // Discard changes
                                  const saved = localStorage.getItem("selectedShabbatot");
                                  if (saved) {
                                    try { setSelectedShabbatot(JSON.parse(saved)); } catch (e) {}
                                  } else {
                                    setSelectedShabbatot([]);
                                  }
                                }}
                                className="px-6 py-3 rounded-xl font-bold text-[15px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                Discard Changes
                              </button>
                              <button 
                                onClick={() => {
                                  localStorage.setItem("selectedShabbatot", JSON.stringify(selectedShabbatot));
                                  setManageSubTab("my_listing");
                                }}
                                className="px-8 py-3 rounded-xl font-bold text-[15px] text-white bg-[#4c55a4] hover:bg-[#3d4484] shadow-md shadow-[#4c55a4]/20 transition-all"
                              >
                                Save Availability
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                    <Building className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No active listings</h3>
                    <p className="text-zinc-500">You haven't added any apartments yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "swap" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Apartment Swap</h1>
                <p className="text-zinc-500 mb-8">Manage your swap requests and active swaps.</p>
                
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm mb-8">
                  <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Enable Swaps</h4>
                      <p className="text-sm text-zinc-500">Allow other users to request swaps with you</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isSwapEnabled} 
                        onChange={(e) => setIsSwapEnabled(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#4c55a4]"></div>
                    </label>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">Active & Past Swaps</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Swap Card 1 */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col relative group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 font-bold text-xs rounded-full">Confirmed</span>
                    </div>
                    
                    <div className="text-sm font-semibold text-zinc-500 mb-6 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Nov 14 - Nov 16 • Shabbat Chayei Sara
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 relative">
                      {/* Connecting Line for Desktop */}
                      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-10" />
                      
                      {/* My Apartment */}
                      <div className="flex-1 flex flex-col gap-3 w-full bg-white dark:bg-zinc-900">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest text-center md:text-left">Your Listing</p>
                        <div className="flex items-center gap-3">
                          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150" className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="Your Apartment" />
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white text-[15px] line-clamp-1">Bright luxury apartment</h4>
                            <p className="text-xs text-zinc-500">Jerusalem, Israel</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Swap Icon */}
                      <div className="w-10 h-10 rounded-full bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-zinc-900">
                        <RefreshCw className="w-4 h-4 text-[#4c55a4] dark:text-indigo-400" />
                      </div>
                      
                      {/* Their Apartment */}
                      <div className="flex-1 flex flex-col gap-3 w-full bg-white dark:bg-zinc-900">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest text-center md:text-right">David's Listing</p>
                        <div className="flex items-center gap-3 md:flex-row-reverse">
                          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150" className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="David's Apartment" />
                          <div className="md:text-right">
                            <h4 className="font-bold text-zinc-900 dark:text-white text-[15px] line-clamp-1">Modern Studio</h4>
                            <p className="text-xs text-zinc-500">Tel Aviv, Israel</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">DC</div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Swapped with <span className="font-bold text-zinc-900 dark:text-white">David Cohen</span></span>
                      </div>
                      <button className="text-sm font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline">Message</button>
                    </div>
                  </div>

                  {/* Swap Card 2 */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col relative group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 font-bold text-xs rounded-full">Pending</span>
                    </div>
                    
                    <div className="text-sm font-semibold text-zinc-500 mb-6 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Dec 04 - Dec 06 • Shabbat Vayeshev
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 relative">
                      {/* Connecting Line for Desktop */}
                      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-10" />
                      
                      {/* My Apartment */}
                      <div className="flex-1 flex flex-col gap-3 w-full bg-white dark:bg-zinc-900">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest text-center md:text-left">Your Listing</p>
                        <div className="flex items-center gap-3">
                          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150" className="w-14 h-14 rounded-xl object-cover shadow-sm grayscale opacity-70" alt="Your Apartment" />
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white text-[15px] line-clamp-1">Bright luxury apartment</h4>
                            <p className="text-xs text-zinc-500">Jerusalem, Israel</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Swap Icon */}
                      <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-zinc-900">
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                      </div>
                      
                      {/* Their Apartment */}
                      <div className="flex-1 flex flex-col gap-3 w-full bg-white dark:bg-zinc-900">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest text-center md:text-right">Sarah's Listing</p>
                        <div className="flex items-center gap-3 md:flex-row-reverse">
                          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=150" className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="Sarah's Apartment" />
                          <div className="md:text-right">
                            <h4 className="font-bold text-zinc-900 dark:text-white text-[15px] line-clamp-1">Artistic Villa</h4>
                            <p className="text-xs text-zinc-500">Tzfat, Israel</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs">SL</div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Request from <span className="font-bold text-zinc-900 dark:text-white">Sarah Levy</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700">Decline</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#4c55a4] text-white hover:bg-[#3d4484]">Accept</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "affiliate" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                    Refer Friends and Earn <br className="hidden md:block" /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c55a4] to-indigo-500">Along the Way!</span>
                  </h1>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    Help us grow and invite apartment owners to join the platform. Anyone who signs up through your link and rents their apartment for the first time earns you <span className="font-bold text-[#4c55a4] dark:text-indigo-400">₪40</span>.
                  </p>
                </div>
                
                {/* Sharing Link Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Your Personal Sharing Link</h3>
                      <p className="text-sm text-zinc-500">Send this link to friends, family, and relevant groups.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="flex-1 md:w-96 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-3.5 text-zinc-700 dark:text-zinc-300 font-medium text-sm truncate">
                        https://shabbosrent.co.il/?ref=B453V3
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://shabbosrent.co.il/?ref=B453V3");
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-sm shrink-0 ${isCopied ? "bg-green-500 text-white hover:bg-green-600" : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"}`}
                      >
                        {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 text-[#4c55a4] dark:text-blue-400">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="text-5xl font-black text-[#4c55a4] dark:text-indigo-400 mb-2">0</div>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Registered via your link</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4 text-green-500">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-5xl font-black text-[#4c55a4] dark:text-indigo-400 mb-2">0</div>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">First rentals completed</p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4 text-amber-500">
                      <MoreHorizontal className="w-6 h-6" />
                    </div>
                    <div className="text-5xl font-black text-[#4c55a4] dark:text-indigo-400 mb-2">0</div>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Rewards pending</p>
                  </div>
                </div>

                {/* 2 Financial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 dark:bg-zinc-800/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet className="w-6 h-6 text-[#4c55a4] dark:text-indigo-400" />
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Money Owed to You</h3>
                    </div>
                    <p className="text-sm text-zinc-500 mb-8">Earnings available for withdrawal (successfully referred)</p>
                    
                    <div className="text-6xl font-black text-[#4c55a4] dark:text-indigo-400 mb-8 tracking-tighter">
                      <span className="text-4xl mr-1">₪</span>0
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      <Info className="w-4 h-4" /> No earnings available for withdrawal yet.
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="w-6 h-6 text-green-600 dark:text-green-500" />
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Amount Paid to You</h3>
                    </div>
                    <p className="text-sm text-zinc-500 mb-8">Total amount previously transferred to you</p>
                    
                    <div className="text-6xl font-black text-[#4c55a4] dark:text-indigo-400 mb-8 tracking-tighter">
                      <span className="text-4xl mr-1">₪</span>0
                    </div>
                    
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-500">
                      <CheckCircle2 className="w-4 h-4" /> Transaction history is empty.
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-br from-[#f8f9fc] to-[#f1f3f9] dark:from-zinc-900/50 dark:to-zinc-800/30 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/50 p-8 shadow-inner">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-12 h-12 bg-[#002f5d] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#002f5d] dark:text-indigo-300 mb-6">How It Works</h3>
                      
                      <div className="space-y-4">
                        <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <span className="font-bold text-[#002f5d] dark:text-indigo-400">1. Share:</span> Copy your unique link and send it to potential apartment owners who might want to list their property on Shabos Rent.
                        </p>
                        <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <span className="font-bold text-[#002f5d] dark:text-indigo-400">2. Sign Up:</span> The owner must register using your link. You'll see them appear in your registered stats.
                        </p>
                        <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <span className="font-bold text-[#002f5d] dark:text-indigo-400">3. First Booking:</span> Once their first guest completes their stay and the transaction is successfully processed, ₪40 will be credited to your account.
                        </p>
                        <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <span className="font-bold text-[#002f5d] dark:text-indigo-400">4. Withdraw:</span> Requests for withdrawal are processed within 7 business days once your pending amount reaches the minimum threshold.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1 flex items-center gap-2.5">
                    <Heart className="w-7 h-7 text-pink-500 fill-pink-500" /> Favorites & Saved Apartments
                  </h1>
                  <p className="text-zinc-500 text-sm">Apartments you have bookmarked or loved for future Shabbos stays.</p>
                </div>

                {savedApartments.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-pink-50 dark:bg-pink-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-100 dark:border-pink-900/50">
                      <Heart className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Saved Apartments Yet</h3>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
                      Click the heart icon on any apartment card while searching to save it to your personal favorites list.
                    </p>
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all text-sm"
                    >
                      Explore Apartments
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedApartments.map(apt => (
                      <ApartmentCard key={apt.id} apartment={apt} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1 flex items-center gap-2.5">
                    <CalendarDays className="w-7 h-7 text-amber-500" /> Booking History
                  </h1>
                  <p className="text-zinc-500 text-sm">View all your Shabbos apartment bookings as a Renter.</p>
                </div>

                {/* Bookings List */}
                <div className="space-y-6">
                  {mockRenterBookings.map(booking => (
                      <div key={booking.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                          <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative">
                            <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md text-white shadow-xs ${booking.status === "Upcoming" ? "bg-emerald-600" : "bg-zinc-700"}`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-1">
                              <span>Ref: {booking.refCode}</span>
                              <span>•</span>
                              <span>{booking.dateRange}</span>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{booking.title}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-3">
                              <MapPin className="w-3.5 h-3.5" /> {booking.location}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                              <span>Host: <strong>{booking.hostName}</strong></span>
                              <span>Total: <strong className="text-zinc-900 dark:text-white">₪{booking.totalPrice}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800">
                          <button
                            onClick={() => setSelectedContactBooking(booking)}
                            className="px-4 py-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                          >
                            Contact Host
                          </button>
                          <Link
                            href={`/apartments/${booking.apartmentId}`}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            View Apartment
                          </Link>
                          <button
                            onClick={() => alert(`Downloading official receipt for ${booking.refCode}...`)}
                            className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold rounded-xl transition-colors"
                          >
                            Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Notifications</h1>
                    <p className="text-zinc-500">Stay updated with your apartment and swap requests.</p>
                  </div>
                  <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    Mark all as read
                  </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    
                    {/* Notification Item 1 */}
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex gap-4 cursor-pointer relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r-md"></div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 border-2 border-white dark:border-zinc-900 shadow-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">DC</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-base">New Swap Request</h4>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">2 hours ago</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">
                          <span className="font-semibold text-zinc-900 dark:text-white">David Cohen</span> wants to swap his <strong>Modern Studio in Tel Aviv</strong> with your <strong>Luxury Penthouse</strong> for Shabbat Bereshit.
                        </p>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-1.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-lg text-xs font-bold transition-colors">View Details</button>
                        </div>
                      </div>
                    </div>

                    {/* Notification Item 2 */}
                    <div className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex gap-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 border-2 border-white dark:border-zinc-900 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-base">Listing Approved</h4>
                          <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">Yesterday, 10:45 AM</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                          Great news! Your apartment listing <strong>Luxury Penthouse with Kosher Kitchen</strong> has been verified and is now live on Shabos Rent.
                        </p>
                      </div>
                    </div>

                    {/* Notification Item 3 */}
                    <div className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex gap-4 cursor-pointer opacity-75">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 border-2 border-white dark:border-zinc-900 shadow-sm">
                        <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-zinc-900 dark:text-white text-base">Affiliate Points Earned</h4>
                          <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">Oct 12, 2026</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                          You just earned <strong>50 points</strong> because Sarah Levy signed up using your referral link!
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Settings</h1>
                <p className="text-zinc-500 mb-8">Manage your profile and account preferences.</p>
                
                <div className="flex flex-col">
                  {/* Premium Tabs Above */}
                  <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl mb-8 border border-zinc-200/80 dark:border-zinc-700/50 w-fit shadow-sm">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "security", label: "Security & Password", icon: Lock },
                      { id: "notifications", label: "Email Preferences", icon: Bell },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setSettingsSubTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${settingsSubTab === tab.id ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
                    {/* Profile Tab */}
                    {settingsSubTab === "profile" && (
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-3xl shadow-sm overflow-hidden shrink-0">
                              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center md:text-left flex-1">
                              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">User Name</h2>
                              <p className="text-zinc-500 dark:text-zinc-400 mb-2">user@shabbosrent.com</p>
                              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-500">
                                <Clock className="w-4 h-4" /> Member since July 2024
                              </div>
                            </div>
                            <button 
                              onClick={() => setIsEditProfileModalOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-sm font-bold transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit Profile
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div>
                              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium">
                                <Phone className="w-4 h-4 text-zinc-400" /> +972 50-123-4567
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Location</label>
                              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium">
                                <MapPin className="w-4 h-4 text-zinc-400" /> Jerusalem, Israel
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visibility Toggle Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex items-start justify-between shadow-sm w-full">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">
                                {t("dashboard.manage.apartment_status")} {isApartmentVisible ? t("dashboard.manage.visible") : t("dashboard.manage.hidden")}
                              </h3>
                              <p className="text-[15px] text-zinc-500 max-w-xl leading-relaxed">
                                {t("dashboard.manage.hide_desc")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 mt-2">
                            <span className="text-[15px] font-bold text-zinc-600 dark:text-zinc-400">{isApartmentVisible ? t("dashboard.manage.active") : t("dashboard.manage.hidden")}</span>
                            <button 
                              onClick={() => {
                                const newVal = !isApartmentVisible;
                                setIsApartmentVisible(newVal);
                                localStorage.setItem("isApartmentVisible", newVal.toString());
                              }}
                              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${isApartmentVisible ? 'bg-[#4c55a4]' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                            >
                              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${isApartmentVisible ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </div>

                        {/* Merged Bookings Section */}
                        <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">My Bookings</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mock Booking 1 */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                              <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Apartment" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800' }} />
                                <div className="absolute top-3 right-3">
                                  <span className="px-2.5 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-md text-xs font-bold shadow-sm">Upcoming</span>
                                </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="mb-4">
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 line-clamp-1">Cozy Family Apartment near Kotel</h3>
                                  <p className="text-zinc-500 text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Jewish Quarter, Jerusalem</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                  <div className="flex flex-col text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    <span>Aug 16 - Aug 18</span>
                                  </div>
                                  <Link href="/apartments/2" className="text-sm font-bold text-[#4c55a4] hover:underline">View Details</Link>
                                </div>
                              </div>
                            </div>

                            {/* Mock Booking 2 */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow opacity-75">
                              <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale" alt="Apartment" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800' }} />
                                <div className="absolute top-3 right-3">
                                  <span className="px-2.5 py-1 bg-zinc-600/90 text-white backdrop-blur-sm rounded-md text-xs font-bold shadow-sm">Completed</span>
                                </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="mb-4">
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 line-clamp-1">Charming Studio in the City Center</h3>
                                  <p className="text-zinc-500 text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Nachlaot, Jerusalem</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                  <div className="flex flex-col text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    <span>Jun 07 - Jun 09</span>
                                  </div>
                                  <Link href="/apartments/4" className="text-sm font-bold text-zinc-500 hover:underline">Receipt</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Merged Saved Apartments Section */}
                        <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">Saved Apartments</h2>
                          {savedApartments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                              {savedApartments.map(apt => (
                                <ApartmentCard key={apt.id} apartment={apt} />
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                              <Heart className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No saved apartments yet</h3>
                              <p className="text-zinc-500 max-w-sm mx-auto mb-6">Explore the search page and click the heart icon to save your favorite apartments here.</p>
                              <a href="/search" className="inline-block px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-colors">
                                Explore Apartments
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Security Tab */}
                    {settingsSubTab === "security" && (
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Password</h3>
                            <p className="text-zinc-500 text-sm">Regularly updating your password helps keep your account secure.</p>
                          </div>
                          <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-colors text-sm shrink-0"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Email & Notifications Tab */}
                    {settingsSubTab === "notifications" && (
                      <div className="space-y-6">
                        {emailSavedToast && (
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-semibold text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            Email preferences saved successfully!
                          </div>
                        )}

                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                            <div>
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#4c55a4]" /> Email Preferences & Notifications
                              </h3>
                              <p className="text-zinc-500 text-sm mt-1">Manage what emails and notifications you receive from Shabos Rent.</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {emailOptInState ? (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed (Opted In)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold">
                                  Unsubscribed from Marketing
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-6">
                            {/* Master Toggle */}
                            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                              <div>
                                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Receive Email Notifications</h4>
                                <p className="text-xs text-zinc-500 mt-0.5">Master toggle for promotional emails and platform updates</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !emailOptInState;
                                  handleSaveEmailPreferences(next, emailBookingsState, next, next);
                                }}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailOptInState ? "bg-[#4c55a4]" : "bg-zinc-300 dark:bg-zinc-700"}`}
                              >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${emailOptInState ? "translate-x-5" : "translate-x-0"}`} />
                              </button>
                            </div>

                            {/* Unsubscribe Footer */}
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleSaveEmailPreferences(false, emailBookingsState, false, false)}
                                className="px-4 py-2 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-bold transition-colors"
                              >
                                Unsubscribe from Marketing Emails
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />

      <CreateListingModal 
        isOpen={isCreateModalOpen} 
        isEditMode={modalMode === "edit"}
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={(date) => {
          setHasListing(true);
          localStorage.setItem("hasUserListing", "true");
          if (date) {
            setCreatedListingDate(date);
            localStorage.setItem("createdListingDate", date);
          }
        }} 
      />

      {selectedContactBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedContactBooking(null)} 
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4c55a4]/10 text-[#4c55a4] flex items-center justify-center font-bold text-lg">
                {selectedContactBooking.hostName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{selectedContactBooking.hostName}</h3>
                <p className="text-xs text-zinc-500">Host of {selectedContactBooking.title}</p>
              </div>
            </div>

            <div className="space-y-3 mb-2">
              <a
                href={`tel:${selectedContactBooking.hostPhone}`}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 transition-colors text-sm font-semibold text-zinc-900 dark:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#4c55a4]" /> Call Host
                </span>
                <span className="text-xs text-zinc-500">{selectedContactBooking.hostPhone}</span>
              </a>

              <a
                href={`https://wa.me/${selectedContactBooking.hostPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 transition-colors text-sm font-semibold text-emerald-900 dark:text-emerald-200"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Host
                </span>
                <span className="text-xs text-emerald-600 font-bold">Open Chat</span>
              </a>

              <a
                href={`mailto:${selectedContactBooking.hostEmail}`}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 transition-colors text-sm font-semibold text-zinc-900 dark:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600" /> Send Email
                </span>
                <span className="text-xs text-zinc-500">{selectedContactBooking.hostEmail}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
