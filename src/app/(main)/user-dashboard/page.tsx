"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Home, LogOut, Settings, Building, RefreshCw, LayoutDashboard, MapPin, BedDouble, Bath, DoorOpen, Users, Info, AlignLeft, CalendarCheck, Eye, Check, User, Heart, Lock, CalendarDays, Edit3, Clock, Phone, PhoneCall, MessageSquare, Gift, Copy, CheckCircle2, UserPlus, MoreHorizontal, Wallet, Banknote, Lightbulb, Bell, ShieldCheck, X, MessageCircle, Bookmark, Mail, Star, AlertCircle, CreditCard, Receipt, ChevronRight, DollarSign } from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";
import CreateListingModal from "@/components/layout/CreateListingModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import EditProfileModal from "@/components/settings/EditProfileModal";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Select } from "@/components/ui/Select";

// Report Rented Data Type
type ReportedRental = {
  id: string;
  week: string;       // e.g. "July 31"
  weekId: string;     // shabbat id
  parshat: string;    // e.g. "Parshat Eikev"
  amount: number;     // always 50
  status: "Paid" | "Pending";
  reportedAt: string;
};

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

// Call Log Data Type
type CallLog = {
  id: string;
  callerNumber: string;
  callerName: string;
  date: string;
  time: string;
};

const mockCallLogs: CallLog[] = [
  {
    id: "call-1",
    callerNumber: "+972 50-***-4321",
    callerName: "Yosef Levi",
    date: "Oct 24, 2024",
    time: "14:30",
  },
  {
    id: "call-2",
    callerNumber: "+1 (347) ***-9876",
    callerName: "Miriam Schwartz",
    date: "Oct 24, 2024",
    time: "09:15",
  },
  {
    id: "call-3",
    callerNumber: "+972 52-***-5678",
    callerName: "Avi Cohen",
    date: "Oct 23, 2024",
    time: "18:45",
  },
  {
    id: "call-4",
    callerNumber: "+44 20-****-1234",
    callerName: "Rachel Klein",
    date: "Oct 22, 2024",
    time: "11:20",
  },
];

export default function UserDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manage");
  const [isSwapEnabled, setIsSwapEnabled] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [swapPrefCity, setSwapPrefCity] = useState("Jerusalem");
  const [swapPrefNeighborhood, setSwapPrefNeighborhood] = useState("Any");
  const [swapPrefRooms, setSwapPrefRooms] = useState("5");
  const [swapPrefBeds, setSwapPrefBeds] = useState("5");
  const [swapPrefWeekend, setSwapPrefWeekend] = useState("");
  const [isSwapSuccessModalOpen, setIsSwapSuccessModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [hasListing, setHasListing] = useState(false);
  const [manageSubTab, setManageSubTab] = useState("my_listing");
  const [interestedSubTab, setInterestedSubTab] = useState("notify");
  const [settingsSubTab, setSettingsSubTab] = useState("profile");
  const [isApartmentVisible, setIsApartmentVisible] = useState(true);
  const [acceptRequestsWhenUnavailable, setAcceptRequestsWhenUnavailable] = useState(false);
  const [notifyWhenAvailable, setNotifyWhenAvailable] = useState(false);
  const [isHideReasonModalOpen, setIsHideReasonModalOpen] = useState(false);
  const [hideReason, setHideReason] = useState("");
  const [selectedShabbatot, setSelectedShabbatot] = useState<string[]>([]);
  const [createdListingDate, setCreatedListingDate] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { savedApartments } = useFavorites();
  const [isCopied, setIsCopied] = useState(false);
  
  // Dashboard Requests State
  const [notifyRequests, setNotifyRequests] = useState<any[]>([]);
  const [offerRequests, setOfferRequests] = useState<any[]>([]);
  // Communication Preferences State
  const [emailOptInState, setEmailOptInState] = useState(true);
  const [phoneCommState, setPhoneCommState] = useState(true);
  const [emailBookingsState, setEmailBookingsState] = useState(true);
  const [emailPromosState, setEmailPromosState] = useState(true);
  const [emailNewsletterState, setEmailNewsletterState] = useState(true);
  const [emailSavedToast, setEmailSavedToast] = useState(false);

  // Renter Dashboard State
  const [selectedContactBooking, setSelectedContactBooking] = useState<any>(null);
  const [allRenterBookings, setAllRenterBookings] = useState(mockRenterBookings);

  // Review Submission State from Booking History (R1)
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isReviewSuccessModalOpen, setIsReviewSuccessModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewerNameInput, setReviewerNameInput] = useState("");
  const [reviewTitleInput, setReviewTitleInput] = useState("");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  // Report Rented State (O4 — P1)
  const [reportedRentals, setReportedRentals] = useState<ReportedRental[]>([]);
  const [isReportRentedModalOpen, setIsReportRentedModalOpen] = useState(false);
  const [selectedRentedWeeks, setSelectedRentedWeeks] = useState<string[]>([]);
  const [reportRentedStep, setReportRentedStep] = useState<1 | 2>(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentExpiry, setPaymentExpiry] = useState("");
  const [paymentCVV, setPaymentCVV] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reportRentedSuccess, setReportRentedSuccess] = useState(false);
  const pendingAmount = reportedRentals.filter(r => r.status === "Pending").reduce((sum, r) => sum + r.amount, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const notifies = localStorage.getItem("notify_me_requests");
      if (notifies) setNotifyRequests(JSON.parse(notifies));
      
      const offers = localStorage.getItem("apartment_offers");
      if (offers) setOfferRequests(JSON.parse(offers));
    }
  }, [manageSubTab]);

  const handleOpenReviewModal = (booking: any) => {
    setSelectedBookingForReview(booking);
    setReviewRating(0);
    setIsWriteReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    const finalRating = reviewRating > 0 ? reviewRating : 5;

    const newReview = {
      id: `rev-${Date.now()}`,
      apartmentId: selectedBookingForReview.apartmentId || "1",
      apartmentTitle: selectedBookingForReview.title || "Beautiful Apartment in Jerusalem",
      reviewerName: reviewerNameInput || "Renter User",
      rating: finalRating,
      title: reviewTitleInput,
      comment: reviewCommentInput,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending",
    };

    if (typeof window !== "undefined") {
      const existingPending = localStorage.getItem("pending_reviews");
      const pendingArr = existingPending ? JSON.parse(existingPending) : [];
      localStorage.setItem("pending_reviews", JSON.stringify([newReview, ...pendingArr]));
    }

    setIsWriteReviewModalOpen(false);
    setReviewTitleInput("");
    setReviewCommentInput("");
    setIsReviewSuccessModalOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmailOptInState(localStorage.getItem("emailOptIn") !== "false");
      setEmailBookingsState(localStorage.getItem("emailBookings") !== "false");
      setEmailPromosState(localStorage.getItem("emailPromos") !== "false");
      setEmailNewsletterState(localStorage.getItem("emailNewsletter") !== "false");

      const savedStr = localStorage.getItem("user_booking_history");
      if (savedStr) {
        try {
          const savedBookings = JSON.parse(savedStr);
          const formattedSaved = savedBookings.map((b: any) => ({
            id: b.id,
            refCode: b.confirmationCode || b.refCode || "SR-8492",
            apartmentId: b.apartmentId || "1",
            title: b.title || "Beautiful Apartment in Jerusalem",
            location: b.address || "Rehavia, Jerusalem",
            image: b.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            dateRange: b.dates || "Oct 13 - 15, 2026",
            hostName: b.hostName || "Moshe & Chaim Estates",
            hostPhone: b.hostPhone || "+972 54-123-4567",
            hostEmail: b.hostEmail || "owner@shabbosrent.com",
            totalPrice: b.amount ? parseInt(b.amount.replace(/[^0-9]/g, '')) : 4500,
            status: b.status || "Confirmed",
          }));
          setAllRenterBookings([...formattedSaved, ...mockRenterBookings]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Load reportedRentals from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reported_rentals");
      if (saved) {
        try { setReportedRentals(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  // Handler: open Report Rented modal
  const handleOpenReportRented = () => {
    setSelectedRentedWeeks([]);
    setReportRentedStep(1);
    setReportRentedSuccess(false);
    setIsReportRentedModalOpen(true);
  };

  // Handler: confirm rental report
  const handleConfirmReportRented = () => {
    const alreadyReportedIds = reportedRentals.map(r => r.weekId);
    const newRentals: ReportedRental[] = selectedRentedWeeks
      .filter(wId => !alreadyReportedIds.includes(wId))
      .map(wId => {
        const shabbat = SHABBATOT.find(s => s.id === wId);
        return {
          id: `rr-${Date.now()}-${wId}`,
          week: shabbat?.date || wId,
          weekId: wId,
          parshat: shabbat?.name || wId,
          amount: 50,
          status: "Pending" as const,
          reportedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      });
    const updated = [...newRentals, ...reportedRentals];
    setReportedRentals(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("reported_rentals", JSON.stringify(updated));
    }
    setIsReportRentedModalOpen(false);
    setReportRentedSuccess(true);
    setTimeout(() => setReportRentedSuccess(false), 4000);
  };

  // Handler: open payment modal
  const handleOpenPayment = () => {
    setPaymentSuccess(false);
    setIsPaymentProcessing(false);
    setIsPaymentModalOpen(true);
  };

  // Handler: pay now (simulated)
  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentProcessing(true);
    setTimeout(() => {
      const updated = reportedRentals.map(r =>
        r.status === "Pending" ? { ...r, status: "Paid" as const } : r
      );
      setReportedRentals(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("reported_rentals", JSON.stringify(updated));
      }
      setIsPaymentProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setIsPaymentModalOpen(false);
        setPaymentCardNumber("");
        setPaymentExpiry("");
        setPaymentCVV("");
      }, 2500);
    }, 1800);
  };

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

      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam) {
        const targetTab = (tabParam === "history" || tabParam === "booking" || tabParam === "bookings") ? "bookings" : tabParam;
        setActiveTab(targetTab);
        sessionStorage.setItem("dashboardTab", targetTab);
        initialTabSet = true;
      }
      
      if (localStorage.getItem("pendingBookingsAction") === "true") {
        setActiveTab("bookings");
        sessionStorage.setItem("dashboardTab", "bookings");
        localStorage.removeItem("pendingBookingsAction");
        initialTabSet = true;
      }

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
      if (localStorage.getItem("pendingFavoritesAction") === "true") {
        setActiveTab("favorites");
        sessionStorage.setItem("dashboardTab", "favorites");
        localStorage.removeItem("pendingFavoritesAction");
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

      const savedPhoneComm = localStorage.getItem("phoneCommState");
      if (savedPhoneComm !== null) {
        setPhoneCommState(savedPhoneComm === "true");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const navItems = [
    { id: "manage", label: t("dashboard.nav.manage"), icon: Building, color: "text-blue-600" },
    { id: "swap", label: t("dashboard.nav.swap"), icon: RefreshCw, color: "text-indigo-500" },
    { id: "favorites", label: "Favorites & Saved", icon: Heart, color: "text-red-500" },
    { id: "bookings", label: "Booking History", icon: CalendarDays, color: "text-amber-500" },
    { id: "affiliate", label: t("dashboard.nav.affiliate"), icon: Gift, color: "text-purple-500" },
    { id: "notifications", label: t("dashboard.nav.notifications"), icon: Bell, color: "text-blue-500" },
    { id: "settings", label: t("dashboard.nav.settings"), icon: Settings, color: "text-zinc-600 dark:text-zinc-400" },
  ].filter(Boolean) as Array<{ id: string, label: string, icon: any, color: string }>;

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
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
        <main className="flex-1 overflow-y-auto w-full">
          {/* Mobile Navigation Tabs */}
          <div className="md:hidden bg-white dark:bg-[#121212] border-b border-zinc-200 dark:border-zinc-800 px-4 pt-4 pb-4 sticky top-0 z-30 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex items-center gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sessionStorage.setItem("dashboardTab", item.id);
                  }}
                  className={classNames(
                    activeTab === item.id 
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 shadow-sm" 
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all shrink-0"
                  )}
                >
                  <item.icon className={classNames(item.color, "w-4 h-4")} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 md:p-8 lg:p-12 w-full mx-auto max-w-7xl">
            {activeTab === "manage" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {hasListing ? (
                  <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{t("dashboard.manage.title")}</h1>
                    <p className="text-zinc-500 mb-8">{t("dashboard.manage.desc")}</p>
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
                      <button 
                        onClick={() => setManageSubTab("call_log")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${manageSubTab === "call_log" ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
                      >
                        Call Log
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
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 bg-[#4c55a4]/10 dark:bg-indigo-900/30 text-[#4c55a4] dark:text-indigo-400 rounded-lg text-xs font-black tracking-widest uppercase">
                                    <span className="opacity-60">Code:</span> 456
                                  </div>
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
                                  <DoorOpen className="w-4 h-4 text-emerald-500" />
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
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col w-full overflow-hidden">
                          
                          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                            <button 
                              onClick={() => setInterestedSubTab("notify")}
                              className={`flex-1 py-4 font-bold text-center transition-colors ${interestedSubTab === "notify" ? "text-[#4c55a4] dark:text-indigo-400 border-b-2 border-[#4c55a4] dark:border-indigo-400 bg-zinc-50 dark:bg-zinc-800/30" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`}
                            >
                              Notify Requests ({notifyRequests.length})
                            </button>
                            <button 
                              onClick={() => setInterestedSubTab("offer")}
                              className={`flex-1 py-4 font-bold text-center transition-colors ${interestedSubTab === "offer" ? "text-[#4c55a4] dark:text-indigo-400 border-b-2 border-[#4c55a4] dark:border-indigo-400 bg-zinc-50 dark:bg-zinc-800/30" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`}
                            >
                              Interested Requests ({offerRequests.length})
                            </button>
                          </div>

                          <div className="p-6 flex flex-col gap-4">
                            {interestedSubTab === "notify" && (
                              <>
                                {notifyRequests.length === 0 && (
                                  <p className="text-zinc-500 text-center py-4">No notify requests yet.</p>
                                )}
                                {notifyRequests.map(req => (
                                  <div key={req.id} className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shadow-sm">
                                        N
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{req.apartmentTitle}</h4>
                                        <p className="text-sm text-zinc-500 mb-1">{req.userEmail}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                          Notify when available
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <div className="text-right flex flex-col items-end">
                                        <p className="text-xs text-zinc-500 font-medium mb-2">{req.date}</p>
                                      </div>
                                      <a href={`mailto:${req.userEmail}`} title="Email User" className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 rounded-full transition-colors">
                                        <Mail className="w-5 h-5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                            {interestedSubTab === "offer" && (
                              <>
                                {offerRequests.length === 0 && (
                                  <p className="text-zinc-500 text-center py-4">No interested requests yet.</p>
                                )}
                                {offerRequests.map(req => (
                                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors gap-4">
                                    <div className="flex items-start sm:items-center gap-4">
                                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg shadow-sm shrink-0">
                                        O
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{req.apartmentTitle}</h4>
                                          <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs rounded font-bold uppercase tracking-wider">
                                            Code: APT-{req.apartmentId}
                                          </span>
                                        </div>
                                        <p className="text-sm text-zinc-500 mb-1">{req.userEmail}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                          Requested: {req.weekend || "Any Weekend"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right flex flex-col sm:items-end">
                                      <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full mb-1 inline-block">
                                        <p className="font-extrabold text-green-700 dark:text-green-400">Offer: ₪{req.offerPrice}</p>
                                      </div>
                                      <p className="text-xs text-zinc-500 font-medium">Submitted: {req.date}</p>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {manageSubTab === "report_renter" && (
                        <div className="flex flex-col gap-6 w-full">

                          {/* Red Debt Bar */}
                          {pendingAmount > 0 && (
                            <button
                              onClick={handleOpenPayment}
                              className="w-full flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-600/30 animate-pulse"
                            >
                              <AlertCircle className="w-5 h-5 shrink-0" />
                              <span className="flex-1 text-left">
                                You owe ₪{pendingAmount} for reported rentals — Click here to pay
                              </span>
                              <ChevronRight className="w-5 h-5 shrink-0" />
                            </button>
                          )}

                          {/* Success Toast */}
                          {reportRentedSuccess && (
                            <div className="w-full flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg">
                              <CheckCircle2 className="w-5 h-5 shrink-0" />
                              <span>Rental reported successfully! Platform fee of ₪{selectedRentedWeeks.length * 50 || 50} is now due.</span>
                            </div>
                          )}

                          {/* Main Question Card */}
                          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden">
                            {/* Top Banner */}
                            <div className="px-8 pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                                    <Receipt className="w-6 h-6 text-[#4c55a4]" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-1">
                                      Did you rent out your apartment for a Shabbat weekend?
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-lg">
                                      If your apartment was rented for any specific Shabbat week, please report that week here.
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-md text-white flex items-center gap-4 shrink-0 min-w-[240px]">
                                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                    <Banknote className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-emerald-100 font-bold uppercase tracking-wider mb-0.5">Total Earnings</p>
                                    <h4 className="text-2xl font-black leading-none">₪12,500</h4>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Report a Rental Section */}
                            <div className="px-8 py-6">
                              <div className="mb-5">
                                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white mb-1">Report a Rental</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                  Select the Shabbat week your apartment was rented and submit a report.
                                  A{" "}
                                  <span className="font-bold text-[#4c55a4] dark:text-indigo-400">₪50 platform fee</span> applies per reported rental.
                                </p>
                              </div>

                              <button
                                onClick={handleOpenReportRented}
                                id="report-rented-btn"
                                className="w-full sm:w-auto px-8 py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-[#4c55a4]/25 hover:shadow-[#4c55a4]/40 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5"
                              >
                                <Receipt className="w-5 h-5" />
                                Report Rented
                              </button>
                            </div>

                            {/* How It Works — Step Flow */}
                            <div className="mx-8 mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">How it works</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 text-xs font-semibold">
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">1</div>
                                  <span>Was your apartment rented?</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">2</div>
                                  <span>Select that Shabbat week</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-[#4c55a4] text-white flex items-center justify-center font-black text-[10px] shrink-0">3</div>
                                  <span>Click Report Rented</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">4</div>
                                  <span>₪50 fee becomes pending</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">5</div>
                                  <span>Complete your payment</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Summary Info Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Reported Rentals */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-xl flex items-center justify-center">
                                  <Receipt className="w-4.5 h-4.5 text-[#4c55a4]" />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Reported Rentals</span>
                              </div>
                              <div className="text-3xl font-black text-zinc-900 dark:text-white">{reportedRentals.length}</div>
                              <p className="text-xs text-zinc-500 mt-1">Total rentals you have reported so far</p>
                            </div>

                            {/* Pending Payment */}
                            <button
                              onClick={pendingAmount > 0 ? handleOpenPayment : undefined}
                              className={`bg-white dark:bg-zinc-900 rounded-2xl border p-5 shadow-sm text-left transition-all ${pendingAmount > 0 ? "border-red-300 dark:border-red-800/60 hover:border-red-400 cursor-pointer hover:shadow-md" : "border-zinc-200 dark:border-zinc-800 cursor-default"}`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingAmount > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}`}>
                                  <CreditCard className={`w-4.5 h-4.5 ${pendingAmount > 0 ? "text-red-600" : "text-emerald-600"}`} />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Pending Payment</span>
                              </div>
                              <div className={`text-3xl font-black ${pendingAmount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                ₪{pendingAmount}
                              </div>
                              <p className="text-xs text-zinc-500 mt-1">
                                {pendingAmount > 0 ? "Click to pay now →" : "No pending payments ✓"}
                              </p>
                            </button>

                            {/* Rental History Link */}
                            <button
                              onClick={() => setManageSubTab("report_history")}
                              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm text-left hover:border-[#4c55a4]/40 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                  <AlignLeft className="w-4.5 h-4.5 text-zinc-500" />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Rental History</span>
                              </div>
                              <div className="text-3xl font-black text-zinc-900 dark:text-white">{reportedRentals.length}</div>
                              <p className="text-xs text-zinc-500 mt-1 group-hover:text-[#4c55a4] transition-colors">
                                View all reported rentals →
                              </p>
                            </button>
                          </div>

                          {/* Quick History Preview */}
                          {reportedRentals.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm w-full">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Recent Reports</h4>
                                <button
                                  onClick={() => setManageSubTab("report_history")}
                                  className="text-xs text-[#4c55a4] dark:text-indigo-400 font-bold hover:underline"
                                >
                                  View all →
                                </button>
                              </div>
                              <div className="space-y-2">
                                {reportedRentals.slice(0, 3).map(r => (
                                  <div key={r.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                    <div>
                                      <span className="font-bold text-zinc-900 dark:text-white text-sm">{r.week}</span>
                                      <span className="text-zinc-500 text-xs ml-2">Parshat {r.parshat}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">₪{r.amount}</span>
                                      {r.status === "Paid" ? (
                                        <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">✓ Paid</span>
                                      ) : (
                                        <button
                                          onClick={handleOpenPayment}
                                          className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                          Pay Now
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {manageSubTab === "report_history" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden">
                          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Rental History</h3>
                              <p className="text-sm text-zinc-500 mt-0.5">All reported rentals and payment statuses</p>
                            </div>
                            {pendingAmount > 0 && (
                              <button
                                onClick={handleOpenPayment}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay ₪{pendingAmount}
                              </button>
                            )}
                          </div>

                          {reportedRentals.length === 0 ? (
                            <div className="p-16 text-center">
                              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt className="w-8 h-8 text-zinc-400" />
                              </div>
                              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No rentals reported yet</h4>
                              <p className="text-zinc-500 text-sm mb-6">Your reported rentals will appear here.</p>
                              <button
                                onClick={() => setManageSubTab("report_renter")}
                                className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all"
                              >
                                Report Your First Rental
                              </button>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                    <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Week</th>
                                    <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Parshat</th>
                                    <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Reported</th>
                                    <th className="text-left px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-3.5 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3.5"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                  {reportedRentals.map(r => (
                                    <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{r.week}</td>
                                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">Parshat {r.parshat}</td>
                                      <td className="px-6 py-4 text-zinc-500 text-xs">{r.reportedAt}</td>
                                      <td className="px-6 py-4">
                                        {r.status === "Paid" ? (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 text-right font-extrabold text-zinc-900 dark:text-white">₪{r.amount}</td>
                                      <td className="px-6 py-4 text-right">
                                        {r.status === "Pending" && (
                                          <button
                                            onClick={handleOpenPayment}
                                            className="text-xs font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline"
                                          >
                                            Pay Now
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                    <td colSpan={4} className="px-6 py-4 font-bold text-zinc-900 dark:text-white text-sm">Total</td>
                                    <td className="px-6 py-4 text-right font-extrabold text-zinc-900 dark:text-white">
                                      ₪{reportedRentals.reduce((sum, r) => sum + r.amount, 0)}
                                    </td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          )}
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

                      {manageSubTab === "call_log" && (
                        <div className="flex flex-col gap-6">
                          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm w-full">
                            <div className="mb-8 flex items-start gap-4">
                              <Phone className="w-7 h-7 text-[#4c55a4] shrink-0 mt-0.5" />
                              <div>
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">Call Log</h3>
                                <p className="text-[15px] text-zinc-500">History of hotline calls regarding your property.</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {mockCallLogs.map((log) => (
                                <div key={log.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#4c55a4]/10 text-[#4c55a4] dark:bg-indigo-900/30 dark:text-indigo-400">
                                      <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-zinc-900 dark:text-white text-base">{log.callerName}</p>
                                      <p className="text-sm text-zinc-500 font-medium mt-0.5">{log.callerNumber}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                      <CalendarDays className="w-4 h-4 text-zinc-400" /> {log.date}
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-zinc-500 mt-1">
                                      <Clock className="w-3.5 h-3.5" /> {log.time}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {mockCallLogs.length === 0 && (
                                <div className="text-center py-10">
                                  <Phone className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                                  <p className="text-zinc-500">No calls recorded yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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
                  
                  {isSwapEnabled && (
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in duration-300">
                      <h4 className="font-extrabold text-zinc-900 dark:text-white mb-4">I want to swap to:</h4>
                      <form onSubmit={(e) => { e.preventDefault(); setIsSwapSuccessModalOpen(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">City</label>
                          <input required type="text" value={swapPrefCity} onChange={(e) => setSwapPrefCity(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]" placeholder="Enter interested city" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Neighborhood</label>
                          <input required type="text" value={swapPrefNeighborhood} onChange={(e) => setSwapPrefNeighborhood(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]" placeholder="Enter interested neighborhood" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Rooms</label>
                          <input required type="number" value={swapPrefRooms} onChange={(e) => setSwapPrefRooms(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]" placeholder="Enter room number" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Beds</label>
                          <input required type="number" value={swapPrefBeds} onChange={(e) => setSwapPrefBeds(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]" placeholder="Enter bed number" />
                        </div>
                        <div className="md:col-span-2 -mb-2 mt-1">
                          <Select
                            label="Preferred Dates / Weekend"
                            required
                            value={swapPrefWeekend}
                            onChange={(e) => setSwapPrefWeekend(e.target.value)}
                            options={[
                              { value: "", label: "Select a weekend..." },
                              { value: "Any", label: "Any Weekend" },
                              ...SHABBATOT.map(shabbat => ({
                                value: shabbat.id,
                                label: `${shabbat.name} (${shabbat.date})`
                              }))
                            ]}
                          />
                        </div>
                        <div className="md:col-span-2 mt-2 flex justify-end">
                          <button type="submit" className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#4c55a4]/20">
                            Save Preferences
                          </button>
                        </div>
                      </form>
                      <p className="text-xs text-zinc-500 mt-5 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 leading-relaxed">
                        <strong className="text-blue-700 dark:text-blue-400">Note:</strong> The more specific your preferences, the fewer but more relevant matches you will get. Leaving details open (like "Any") will result in more possible matches.
                      </p>
                    </div>
                  )}
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
                    <Heart className="w-7 h-7 text-red-500 fill-red-500" /> Favorites & Saved Apartments
                  </h1>
                  <p className="text-zinc-500 text-sm">Apartments you have bookmarked or loved for future Shabbos stays.</p>
                </div>

                {savedApartments.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/50">
                      <Heart className="w-10 h-10 text-red-500" />
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
                  {allRenterBookings.map(booking => (
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
                            onClick={() => handleOpenReviewModal(booking)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" /> Give Review
                          </button>
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
                      { id: "notifications", label: "Communication Preferences", icon: MessageSquare },
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
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm w-full gap-4">
                          <div className="flex items-start justify-between w-full">
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
                                  if (isApartmentVisible) {
                                    setIsHideReasonModalOpen(true);
                                  } else {
                                    setIsApartmentVisible(true);
                                    setHideReason("");
                                    localStorage.setItem("isApartmentVisible", "true");
                                  }
                                }}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${isApartmentVisible ? 'bg-[#4c55a4]' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                              >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${isApartmentVisible ? 'translate-x-7' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>

                          {!isApartmentVisible && hideReason !== 'booked_website' && (
                            <>
                              <div className="flex items-center justify-between w-full pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div>
                                  <p className="font-bold text-zinc-900 dark:text-white">Accept Requests When Unavailable</p>
                                  <p className="text-sm text-zinc-500">Allow renters to send requests even when hidden/unavailable</p>
                                </div>
                                <button 
                                  onClick={() => setAcceptRequestsWhenUnavailable(!acceptRequestsWhenUnavailable)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${acceptRequestsWhenUnavailable ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${acceptRequestsWhenUnavailable ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                              </div>
                              <div className="flex items-center justify-between w-full pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                                <div>
                                  <p className="font-bold text-zinc-900 dark:text-white">Notify Me When Available</p>
                                  <p className="text-sm text-zinc-500">Allow renters to request a notification for when your apartment becomes available.</p>
                                </div>
                                <button 
                                  onClick={() => setNotifyWhenAvailable(!notifyWhenAvailable)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${notifyWhenAvailable ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyWhenAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                              </div>
                            </>
                          )}
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

                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                            <div>
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#4c55a4]" /> Shabbat Availability & Communication Preferences
                              </h3>
                              <p className="text-zinc-500 text-sm mt-1">Control how Shabos Rent contacts you to check your apartment's availability for upcoming Shabbatot.</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {emailOptInState || phoneCommState ? (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Reminders Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold">
                                  Availability Reminders Muted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Shabbat Availability Context Box */}
                          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3 mb-6 text-xs text-indigo-900 dark:text-indigo-200">
                            <CalendarCheck className="w-5 h-5 text-[#4c55a4] dark:text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-sm text-[#4c55a4] dark:text-indigo-300">Shabbat Apartment Availability Checks</p>
                              <p className="mt-0.5 opacity-90 leading-relaxed">
                                To ensure renters see accurate listings, Shabos Rent reaches out before upcoming Shabbatot to confirm if your apartment is available. Choose your preferred channels below to receive these availability reminders.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Option 1: Email Communication */}
                            <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                  <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">Email Notifications & Reminders</h4>
                                  <p className="text-xs text-zinc-500 mt-0.5">Receive weekly email reminders to confirm your apartment's availability for upcoming Shabbatot, plus booking requests.</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !emailOptInState;
                                  setEmailOptInState(next);
                                  localStorage.setItem("emailOptIn", next ? "true" : "false");
                                }}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailOptInState ? "bg-[#4c55a4]" : "bg-zinc-300 dark:bg-zinc-700"}`}
                              >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${emailOptInState ? "translate-x-5" : "translate-x-0"}`} />
                              </button>
                            </div>

                            {/* Option 2: Phone Call Communication */}
                            <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <PhoneCall className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">Phone Call & Automated Voice Reminders</h4>
                                  <p className="text-xs text-zinc-500 mt-0.5">Receive phone calls & voice reminders to quickly confirm if your apartment is open for Shabbat, plus urgent rental calls.</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !phoneCommState;
                                  setPhoneCommState(next);
                                  localStorage.setItem("phoneCommState", next ? "true" : "false");
                                }}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${phoneCommState ? "bg-[#4c55a4]" : "bg-zinc-300 dark:bg-zinc-700"}`}
                              >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${phoneCommState ? "translate-x-5" : "translate-x-0"}`} />
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

      {/* R1 — Write Review Modal from Booking History */}
      {isWriteReviewModalOpen && selectedBookingForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative p-6 md:p-8">
            <button 
              onClick={() => setIsWriteReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>

            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">
              Give a Review
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Share your verified experience staying at <strong className="text-zinc-900 dark:text-white">{selectedBookingForReview.title}</strong>.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              {/* Star Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform active:scale-110"
                    >
                      <Star className={`w-7 h-7 ${star <= reviewRating ? "text-amber-500 fill-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-xs text-amber-600 dark:text-amber-400">
                    {reviewRating > 0 ? `${reviewRating}.0 / 5.0` : "Select rating"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerNameInput}
                  onChange={e => setReviewerNameInput(e.target.value)}
                  placeholder="e.g. Chaim S."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitleInput}
                  onChange={e => setReviewTitleInput(e.target.value)}
                  placeholder="e.g. Excellent Shabbos experience!"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Your Review Comments</label>
                <textarea
                  required
                  rows={4}
                  value={reviewCommentInput}
                  onChange={e => setReviewCommentInput(e.target.value)}
                  placeholder="Tell other renters about the kosher kitchen, beds, location, cleanliness, etc..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                Submit Review for Moderation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* R1 — Review Submission Success Modal */}
      {isReviewSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative text-center p-6 md:p-8">
            <button 
              onClick={() => setIsReviewSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Shield Icon */}
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">
              Review Submitted!
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
              Thank you! Your review has been submitted to the <strong className="text-purple-600 dark:text-purple-400">Admin Moderation Queue</strong>. It will go live once approved by an Admin.
            </p>

            <button
              onClick={() => setIsReviewSuccessModalOpen(false)}
              className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-[#4c55a4]/20 active:scale-95"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>

      {/* ===== Report Rented Modal ===== */}
      {isReportRentedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-[#4c55a4]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">Report Rented</h3>
                  <p className="text-xs text-zinc-500">Step {reportRentedStep} of 2</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportRentedModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Week Selection */}
            {reportRentedStep === 1 && (
              <div className="p-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 font-medium">
                  Which Shabbat week(s) was your apartment rented? Select all that apply.
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {SHABBATOT.map(shabbat => {
                    const alreadyReported = reportedRentals.some(r => r.weekId === shabbat.id);
                    const isSelected = selectedRentedWeeks.includes(shabbat.id);
                    return (
                      <button
                        key={shabbat.id}
                        disabled={alreadyReported}
                        onClick={() => {
                          setSelectedRentedWeeks(prev =>
                            prev.includes(shabbat.id)
                              ? prev.filter(id => id !== shabbat.id)
                              : [...prev, shabbat.id]
                          );
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all
                          ${alreadyReported
                            ? "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? "border-[#4c55a4] bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10"
                              : "border-zinc-200 dark:border-zinc-700 hover:border-[#4c55a4]/40"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                            ${isSelected ? "border-[#4c55a4] bg-[#4c55a4]" : "border-zinc-300 dark:border-zinc-600"}`}>
                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-zinc-900 dark:text-white">{shabbat.date}</div>
                            <div className="text-xs text-zinc-500">Parshat {shabbat.name}</div>
                          </div>
                        </div>
                        {alreadyReported && (
                          <span className="text-xs text-zinc-400 font-semibold">Already reported</span>
                        )}
                        {isSelected && !alreadyReported && (
                          <span className="text-xs font-bold text-[#4c55a4]">₪50</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsReportRentedModalOpen(false)}
                    className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={selectedRentedWeeks.length === 0}
                    onClick={() => setReportRentedStep(2)}
                    className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {reportRentedStep === 2 && (
              <div className="p-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 font-medium">
                  You are reporting <strong className="text-zinc-900 dark:text-white">{selectedRentedWeeks.length} rental{selectedRentedWeeks.length > 1 ? "s" : ""}</strong>. Please review and confirm.
                </p>
                
                {/* Selected weeks list */}
                <div className="space-y-2 mb-5">
                  {selectedRentedWeeks.map(wId => {
                    const shabbat = SHABBATOT.find(s => s.id === wId);
                    return (
                      <div key={wId} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white text-sm">{shabbat?.date}</span>
                          <span className="text-zinc-500 text-xs ml-2">Parshat {shabbat?.name}</span>
                        </div>
                        <span className="font-bold text-[#4c55a4] dark:text-indigo-400">₪50</span>
                      </div>
                    );
                  })}
                </div>

                {/* Total calculation */}
                <div className="bg-[#4c55a4]/5 dark:bg-[#4c55a4]/10 border-2 border-[#4c55a4]/20 rounded-2xl p-4 mb-6">
                  <div className="flex flex-col gap-1.5 text-sm mb-3">
                    {selectedRentedWeeks.map((_, i) => (
                      <div key={i} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Rental {i + 1} × ₪50</span>
                        <span>₪50</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-extrabold text-lg text-zinc-900 dark:text-white pt-2 border-t border-[#4c55a4]/20">
                    <span>Total Due</span>
                    <span className="text-[#4c55a4] dark:text-indigo-400">₪{selectedRentedWeeks.length * 50}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setReportRentedStep(1)}
                    className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirmReportRented}
                    className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#4c55a4]/20"
                  >
                    Confirm Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Hide Reason Modal ===== */}
      {isHideReasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">Hide Apartment</h3>
              <button onClick={() => setIsHideReasonModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-500 mb-2">Please select a reason for hiding your apartment:</p>
              <button 
                onClick={() => setHideReason("booked_website")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${hideReason === "booked_website" ? "border-[#4c55a4] bg-[#4c55a4]/5 dark:bg-[#4c55a4]/20" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
              >
                <div className="font-bold text-zinc-900 dark:text-white text-[15px]">Booked through Shabbos Rent</div>
                <p className="text-xs text-zinc-500 mt-1">This apartment was successfully rented via the website.</p>
              </button>
              <button 
                onClick={() => setHideReason("unavailable")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${hideReason === "unavailable" ? "border-[#4c55a4] bg-[#4c55a4]/5 dark:bg-[#4c55a4]/20" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
              >
                <div className="font-bold text-zinc-900 dark:text-white text-[15px]">Unavailable / Not Renting</div>
                <p className="text-xs text-zinc-500 mt-1">I am unavailable or do not want to rent it out right now.</p>
              </button>
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                disabled={!hideReason}
                onClick={() => {
                  setIsApartmentVisible(false);
                  localStorage.setItem("isApartmentVisible", "false");
                  setIsHideReasonModalOpen(false);
                }}
                className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Swap Success Modal ===== */}
      {isSwapSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden text-center p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-3">Preferences Saved!</h3>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Yes, now your apartment will be available for swap based on your preferences.
            </p>
            <button 
              onClick={() => setIsSwapSuccessModalOpen(false)}
              className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}

      {/* ===== Payment Modal ===== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            
            {!paymentSuccess ? (
              <>
                {/* Payment Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">Complete Payment</h3>
                      <p className="text-xs text-zinc-500">Secure platform fee payment</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePayNow} className="p-6 space-y-5">
                  {/* Amount Due */}
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-bold text-sm text-red-700 dark:text-red-300">Amount Due</span>
                    </div>
                    <span className="font-extrabold text-2xl text-red-600 dark:text-red-400">₪{pendingAmount}</span>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={paymentCardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const formatted = val.replace(/(\d{4})/g, "$1 ").trim();
                          setPaymentCardNumber(formatted);
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={paymentExpiry}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted = val.length > 2 ? val.slice(0, 2) + "/" + val.slice(2) : val;
                          setPaymentExpiry(formatted);
                        }}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">CVV</label>
                      <input
                        type="text"
                        required
                        maxLength={3}
                        value={paymentCVV}
                        onChange={e => setPaymentCVV(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-mono text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                      />
                    </div>
                  </div>

                  {/* Security note */}
                  <p className="text-xs text-zinc-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secured & encrypted payment</span>
                  </p>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={isPaymentProcessing}
                    className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-[#4c55a4]/25 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ₪{pendingAmount} Now
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Payment Success State */
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-zinc-500 text-sm mb-2">Your platform fee has been paid.</p>
                <p className="font-extrabold text-[#4c55a4] dark:text-indigo-400 text-lg">₪{reportedRentals.reduce((sum, r) => sum + r.amount, 0)} paid</p>
                <p className="text-xs text-zinc-400 mt-4">All rentals are now marked as Paid.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
