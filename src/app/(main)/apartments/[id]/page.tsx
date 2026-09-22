"use client";
import Link from "next/link";
import { useState, use, Suspense, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainNavbar from "@/components/layout/MainNavbar";
import ApartmentCard from "@/components/search/ApartmentCard";
import { ApartmentData } from "@/types";
import { 
  MapPin, BedDouble, Bath, DoorOpen, Users, Star, ArrowRightLeft, 
  ShieldCheck, CalendarCheck, Wifi, Tent, Monitor, ChefHat, X, Mail, Sparkles,
  Coffee, Tv, Snowflake, Car, WashingMachine, Phone, MessageCircle, Copy, ChevronDown, Home, Footprints, Check, LockKeyhole, CheckCircle2, Navigation, Heart
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { getCoordinatesForAddress, calculateWalkingMinutes, calculateDistanceKm } from "@/utils/distanceUtils";
import { useFavorites } from "@/hooks/useFavorites";
import { getTelLink, getWhatsAppLink } from "@/utils/phoneUtils";
import { useApartment } from "@/hooks/useApartments";
import { useSubmitOffer } from "@/hooks/useOfferRequests";
import { useCreateInterestedRequest } from "@/hooks/useInterestedRequests";
import { useCreateNotifyRequest } from "@/hooks/useNotifyRequests";
import { useSendSwapRequest } from "@/hooks/useSwap";
import { useMyApartment } from "@/hooks/useApartments";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/imageUrl";
import { ApartmentHistoryService } from "@/services/apartmentHistoryService";
import { loadGoogleMaps } from "@/utils/googleMapsLoader";

interface AvailableDateItem {
  id: string | number;
  date: string;
  day: string;
  reason: string;
  isSpecial?: boolean;
  specialPrice?: string | null;
}

// Constants
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

const mockAvailableDates = [
  { id: 1, date: "Oct 13 - 15", day: "Fri - Sun", reason: "Shabbos Parshat Bereishit" },
  { id: 2, date: "Oct 27 - 29", day: "Fri - Sun", reason: "Shabbos Parshat Lech Lecha" },
  { id: 3, date: "Nov 24 - 26", day: "Fri - Sun", reason: "Special Weekend" },
];

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const isSwapMode = searchParams.get("mode") === "swap";

  const { data: apiApartment, isLoading: isAptLoading } = useApartment(id);
  const { data: myAptData } = useMyApartment();
  const myApartment = myAptData;
  const { mutate: sendSwapRequest, isPending: isSendingSwapRequest } = useSendSwapRequest();

  // Dynamic gallery images from backend
  const apiImages: string[] = [];
  if (apiApartment?.coverImage) {
    apiImages.push(getImageUrl(apiApartment.coverImage));
  }
  if (apiApartment?.images && Array.isArray(apiApartment.images)) {
    apiApartment.images.forEach((img) => {
      if (img) apiImages.push(getImageUrl(img));
    });
  }

  const currentGalleryImages = apiImages.length > 0 ? apiImages : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"];

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeImage, setActiveImage] = useState(currentGalleryImages[0]);

  useEffect(() => {
    if (apiImages.length > 0) {
      setActiveImage(apiImages[0]);
    }
  }, [apiApartment?.coverImage, JSON.stringify(apiApartment?.images)]);

  // Track view history on backend
  useEffect(() => {
    if (id) {
      ApartmentHistoryService.trackApartmentView(id);
    }
  }, [id]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
  const [hasContactedOwner, setHasContactedOwner] = useState(false);
  const [landlordModalState, setLandlordModalState] = useState<"initial" | "options">("initial");
  const [isCopied, setIsCopied] = useState(false);

  const [isNumberRevealed, setIsNumberRevealed] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapModalState, setSwapModalState] = useState<"initial" | "contact">("initial");
  const [destInput, setDestInput] = useState("Great Synagogue, Jerusalem");
  
  // Map and Distance integration states
  const [targetCoords, setTargetCoords] = useState<{lat: number, lng: number} | null>(null);
  const [walkingMinsText, setWalkingMinsText] = useState("");
  const [distanceKmText, setDistanceKmText] = useState("");
  
  const [targetSuggestions, setTargetSuggestions] = useState<any[]>([]);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const targetContainerRef = useRef<HTMLDivElement>(null);

  const autocompleteServiceRef = useRef<any>(null);
  const distanceMatrixServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const aptMarkerRef = useRef<any>(null);
  const fallbackDestMarkerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps().then((googleMaps) => {
      if (!mounted) return;
      if (googleMaps.places?.AutocompleteService) {
        autocompleteServiceRef.current = new googleMaps.places.AutocompleteService();
      }
      if (googleMaps.DistanceMatrixService) {
        distanceMatrixServiceRef.current = new googleMaps.DistanceMatrixService();
      }
      if (googleMaps.Geocoder) {
        geocoderRef.current = new googleMaps.Geocoder();
      }
      if (googleMaps.DirectionsService && googleMaps.DirectionsRenderer) {
        directionsServiceRef.current = new googleMaps.DirectionsService();
        directionsRendererRef.current = new googleMaps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: { strokeColor: "#4c55a4", strokeWeight: 5 }
        });
      }
      
      // Initialize Map
      if (mapContainerRef.current && !mapInstanceRef.current && apiApartment) {
        const aptLat = apiApartment?.lat || apiApartment?.marker?.lat || 31.7745;
        const aptLng = apiApartment?.lng || apiApartment?.marker?.lng || 35.2150;
        
        mapInstanceRef.current = new googleMaps.Map(mapContainerRef.current, {
          center: { lat: aptLat, lng: aptLng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        directionsRendererRef.current.setMap(mapInstanceRef.current);

        aptMarkerRef.current = new googleMaps.Marker({
          position: { lat: aptLat, lng: aptLng },
          map: mapInstanceRef.current,
          title: apiApartment?.title || "Apartment Location",
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
                <path d="M20 0C8.954 0 0 8.954 0 20c0 14.5 20 30 20 30s20-15.5 20-30C40 8.954 31.046 0 20 0z" fill="#ef4444" stroke="#ffffff" stroke-width="2.5"/>
                <path d="M12 18v10h5v-6h6v6h5v-10l-8-7-8 7z" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new googleMaps.Size(40, 50),
            anchor: new googleMaps.Point(20, 50),
          },
          animation: googleMaps.Animation.DROP,
          zIndex: 10
        });

        // Add a subtle bounce when clicked
        aptMarkerRef.current.addListener('click', () => {
          if (aptMarkerRef.current.getAnimation() !== null) {
            aptMarkerRef.current.setAnimation(null);
          } else {
            aptMarkerRef.current.setAnimation(googleMaps.Animation.BOUNCE);
            setTimeout(() => {
              if (aptMarkerRef.current) aptMarkerRef.current.setAnimation(null);
            }, 1400); // Stop bouncing after 2 bounces
          }
        });
      }
    }).catch(console.warn);
    return () => { mounted = false; };
  }, [apiApartment]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (targetContainerRef.current && !targetContainerRef.current.contains(e.target as Node)) {
        setIsTargetDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateDistanceWithGoogle = useCallback((destLat: number, destLng: number) => {
    const aptLat = apiApartment?.lat || apiApartment?.marker?.lat;
    const aptLng = apiApartment?.lng || apiApartment?.marker?.lng;
    
    if (!aptLat || !aptLng) return;
    
    if (distanceMatrixServiceRef.current) {
      distanceMatrixServiceRef.current.getDistanceMatrix({
        origins: [{ lat: aptLat, lng: aptLng }],
        destinations: [{ lat: destLat, lng: destLng }],
        travelMode: "WALKING",
      }, (response: any, status: string) => {
        if (status === "OK" && response?.rows?.[0]?.elements?.[0]?.status === "OK") {
          const element = response.rows[0].elements[0];
          setWalkingMinsText(element.duration.text);
          setDistanceKmText(element.distance.text);
        } else {
          // Fallback to Haversine if Google fails
          const km = calculateDistanceKm(destLat, destLng, aptLat, aptLng);
          const mins = Math.max(2, Math.round(km * 13.33));
          setDistanceKmText(`${km} km`);
          setWalkingMinsText(`${mins} mins`);
        }
      });
    }

    if (directionsServiceRef.current && directionsRendererRef.current) {
      directionsServiceRef.current.route({
        origin: { lat: aptLat, lng: aptLng },
        destination: { lat: destLat, lng: destLng },
        travelMode: "WALKING"
      }, (response: any, status: string) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(response);
          if (aptMarkerRef.current) {
            aptMarkerRef.current.setMap(null); // Hide default marker when route is drawn to avoid overlap
          }
          if (fallbackDestMarkerRef.current) {
             fallbackDestMarkerRef.current.setMap(null);
          }
        } else {
          // Fallback: Drop a destination pin if Directions API is not enabled
          if (!fallbackDestMarkerRef.current && mapInstanceRef.current) {
            fallbackDestMarkerRef.current = new (window as any).google.maps.Marker({
               position: { lat: destLat, lng: destLng },
               map: mapInstanceRef.current,
               title: "Target Destination",
               icon: {
                 url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
                     <path d="M20 0C8.954 0 0 8.954 0 20c0 14.5 20 30 20 30s20-15.5 20-30C40 8.954 31.046 0 20 0z" fill="#3b82f6" stroke="#ffffff" stroke-width="2.5"/>
                     <circle cx="20" cy="18" r="8" fill="#ffffff"/>
                   </svg>
                 `),
                 scaledSize: new (window as any).google.maps.Size(40, 50),
                 anchor: new (window as any).google.maps.Point(20, 50),
               },
               animation: (window as any).google.maps.Animation.DROP,
               zIndex: 20
            });
            
            // Add click interaction for the blue pin too
            fallbackDestMarkerRef.current.addListener('click', () => {
              if (fallbackDestMarkerRef.current.getAnimation() !== null) {
                fallbackDestMarkerRef.current.setAnimation(null);
              } else {
                fallbackDestMarkerRef.current.setAnimation((window as any).google.maps.Animation.BOUNCE);
                setTimeout(() => {
                  if (fallbackDestMarkerRef.current) fallbackDestMarkerRef.current.setAnimation(null);
                }, 1400);
              }
            });

            // Re-center map to fit both pins with padding
            const bounds = new (window as any).google.maps.LatLngBounds();
            bounds.extend({ lat: aptLat, lng: aptLng });
            bounds.extend({ lat: destLat, lng: destLng });
            mapInstanceRef.current.fitBounds(bounds, 50); // 50px padding
          } else if (fallbackDestMarkerRef.current) {
            fallbackDestMarkerRef.current.setPosition({ lat: destLat, lng: destLng });
            fallbackDestMarkerRef.current.setMap(mapInstanceRef.current);
            fallbackDestMarkerRef.current.setAnimation((window as any).google.maps.Animation.DROP);
            
            const bounds = new (window as any).google.maps.LatLngBounds();
            bounds.extend({ lat: aptLat, lng: aptLng });
            bounds.extend({ lat: destLat, lng: destLng });
            mapInstanceRef.current.fitBounds(bounds, 50);
          }
        }
      });
    }
  }, [apiApartment]);

  const handleTargetSearch = (val: string) => {
    setDestInput(val);
    if (!val.trim()) {
      setTargetSuggestions([]);
      setIsTargetDropdownOpen(false);
      return;
    }
    
    setIsTargetLoading(true);
    setIsTargetDropdownOpen(true);
    
    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions({
        input: val + ", Israel",
        componentRestrictions: { country: "il" }
      }, (predictions: any[], status: string) => {
        setIsTargetLoading(false);
        if (status === "OK" && predictions) {
          setTargetSuggestions(predictions.slice(0, 5));
        } else {
          setTargetSuggestions([]);
        }
      });
    }
  };

  const handleSelectTargetPlace = (place: any) => {
    const text = place.structured_formatting?.main_text || place.description;
    setDestInput(text);
    setIsTargetDropdownOpen(false);
    
    if (geocoderRef.current && place.place_id) {
      geocoderRef.current.geocode({ placeId: place.place_id }, (results: any[], status: string) => {
        if (status === "OK" && results?.[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          setTargetCoords({ lat, lng });
          calculateDistanceWithGoogle(lat, lng);
        }
      });
    }
  };

  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  
  const [offerPriceInput, setOfferPriceInput] = useState("");
  const [offerMessageInput, setOfferMessageInput] = useState("");

  const { mutate: createInterested, isPending: isSendingInterested } = useCreateInterestedRequest();
  const { mutate: createNotify, isPending: isSendingNotify } = useCreateNotifyRequest();
  const { mutate: submitOfferMutation, isPending: isSendingOffer } = useSubmitOffer();

  const handleProposeSwapFromDetails = () => {
    if (!myApartment?.id) {
      toast.error("You must list an apartment first to propose a swap.");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a weekend from the calendar first to propose a swap.");
      return;
    }
    sendSwapRequest(
      {
        fromAppId: myApartment.id,
        toAppId: id,
        weekend: selectedDate,
      },
      {
        onSuccess: () => {
          setIsSwapSuccessModalOpen(true);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to send swap request.");
        },
      }
    );
  };

  const handleInterestedClick = () => {
    if (!id) return;
    createInterested(
      { apartmentId: id },
      {
        onSuccess: () => {
          toast.success("Interested request sent successfully!");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to send request.");
        },
      }
    );
  };

  const handleNotifyMe = () => {
    if (!id) return;
    createNotify(
      { apartmentId: id },
      {
        onSuccess: () => {
          setIsNotified(true);
          toast.success("You will be notified when available!");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to setup notification.");
        },
      }
    );
  };

  // Reviews Feature (R1 & R2)
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerNameInput, setReviewerNameInput] = useState("");
  const [reviewTitleInput, setReviewTitleInput] = useState("");
  const [reviewCommentInput, setReviewCommentInput] = useState("");
  const [approvedReviewsList, setApprovedReviewsList] = useState<any[]>([
    {
      id: "rev-default-1",
      reviewerName: "Chaim Gold",
      rating: 5,
      title: "Perfect Shabbos Stay",
      comment: "The apartment was spotless and the kosher kitchen setup made our Shabbos prep so easy. Highly recommend!",
      date: "Jul 10, 2026",
    },
    {
      id: "rev-default-2",
      reviewerName: "Miriam S.",
      rating: 5,
      title: "Great Location in Rehavia",
      comment: "Walking distance to Great Synagogue and Kotel. Very quiet building and comfortable beds.",
      date: "Jun 24, 2026",
    }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApproved = localStorage.getItem("approved_reviews");
      if (savedApproved) {
        try {
          const parsedApproved = JSON.parse(savedApproved);
          const currentAptReviews = parsedApproved.filter((r: any) => r.apartmentId === id || !r.apartmentId);
          if (currentAptReviews.length > 0) {
            setApprovedReviewsList(prev => [...currentAptReviews, ...prev]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: `rev-${Date.now()}`,
      apartmentId: id,
      apartmentTitle: "Beautiful Apartment in Jerusalem",
      reviewerName: reviewerNameInput || "Renter User",
      rating: reviewRating,
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
    alert("Thank you! Your review has been submitted to the Admin Moderation Queue. It will go live once approved by an Admin.");
  };

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSelectWeekModalOpen, setIsSelectWeekModalOpen] = useState(false);
  const [isRequestOfferModalOpen, setIsRequestOfferModalOpen] = useState(false);
  const [isNotifySuccessModalOpen, setIsNotifySuccessModalOpen] = useState(false);
  const [isOfferSuccessModalOpen, setIsOfferSuccessModalOpen] = useState(false);
  
  // Custom dropdown states for Request Offer Modal
  const [isWeekendDropdownOpen, setIsWeekendDropdownOpen] = useState(false);
  const [selectedWeekendForOffer, setSelectedWeekendForOffer] = useState("");
  
  const [isSwapSuccessModalOpen, setIsSwapSuccessModalOpen] = useState(false);
  


  const [selectedAgreedWeek, setSelectedAgreedWeek] = useState("");
  const [confirmedShabbosDate, setConfirmedShabbosDate] = useState("");
  const [activeConfirmationCode, setActiveConfirmationCode] = useState("");
  const [isConfCopied, setIsConfCopied] = useState(false);

  const handleStartRenterConfirm = () => {
    setIsLandlordModalOpen(false);
    setIsSelectWeekModalOpen(true);
  };

  const executeRenterConfirm = (targetWeek: string) => {
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "renter@example.com" : "renter@example.com";
    const currentWeek = targetWeek || (availableDates[0]?.date ?? "Upcoming Shabbat");
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
          title: displayTitle,
          address: `${displayStreet}, ${displayNeighborhood}, ${displayCity}`,
          dates: currentWeek,
          confirmationCode: code,
          hostName: apiApartment?.user?.username || "Host",
          hostPhone: ownerPhone,
          hostEmail: apiApartment?.user?.email || "owner@shabbosrent.com",
          status: "Confirmed",
          amount: displayPrice,
          image: currentGalleryImages[0]
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

  // Record current apartment into Recently Viewed localStorage history (logged in users only)
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthChecked && apiApartment && !isAptLoading) {
      const userRole = localStorage.getItem("userRole");
      if (!userRole) return;

      try {
        const aptToRecord: ApartmentData = apiApartment as unknown as ApartmentData;

        const existingStr = localStorage.getItem("recently_viewed_apartments");
        let existingList: ApartmentData[] = existingStr ? JSON.parse(existingStr) : [];
        existingList = existingList.filter((item) => item.id !== aptToRecord.id);
        const updatedList = [aptToRecord, ...existingList].slice(0, 8);
        localStorage.setItem("recently_viewed_apartments", JSON.stringify(updatedList));
      } catch (err) {
        console.error("Failed to update recently viewed apartments:", err);
      }
    }
  }, [id, isAuthChecked, apiApartment, isAptLoading]);

  const { isSaved: checkIsSaved, toggleFavorite } = useFavorites();
  const isSaved = checkIsSaved(id);

  const hasUserListing = typeof window !== 'undefined' && localStorage.getItem("hasUserListing") === "true";

  const defaultAmenitiesList = [
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

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
    if (lower.includes("balcony") || lower.includes("sukkah") || lower.includes("terrace")) return Tent;
    if (lower.includes("kitchen") || lower.includes("kosher") || lower.includes("cook")) return ChefHat;
    if (lower.includes("coffee") || lower.includes("urn") || lower.includes("tea")) return Coffee;
    if (lower.includes("tv") || lower.includes("netflix") || lower.includes("screen")) return Tv;
    if (lower.includes("air") || lower.includes("ac") || lower.includes("condition")) return Snowflake;
    if (lower.includes("park") || lower.includes("car") || lower.includes("garage")) return Car;
    if (lower.includes("wash") || lower.includes("laundry") || lower.includes("dryer")) return WashingMachine;
    if (lower.includes("linen") || lower.includes("towel") || lower.includes("bed")) return BedDouble;
    if (lower.includes("bath") || lower.includes("tub")) return Bath;
    if (lower.includes("clock") || lower.includes("shabbos")) return Sparkles;
    if (lower.includes("desk") || lower.includes("work")) return Monitor;
    return Sparkles;
  };

  const amenitiesList = (apiApartment?.amenities && apiApartment.amenities.length > 0)
    ? apiApartment.amenities.map((name) => ({ icon: getAmenityIcon(name), label: name }))
    : defaultAmenitiesList;
  
  const displayedAmenities = showAllAmenities ? amenitiesList : amenitiesList.slice(0, 6);

  // Dynamic Logic: Determine availability based on API data and metadata

  const isAvailableForNextWeekend =
    !apiApartment?.unavailable &&
    apiApartment?.upcomingAvailability?.isAvailableNextWeekend === true;

  const isApartmentAvailable = useMemo(() => {
    if (apiApartment) {
      const anyApt = apiApartment as any;
      if (anyApt.unavailable !== undefined) {
        return !anyApt.unavailable;
      }
      if (apiApartment.upcomingAvailability?.isAvailableNextWeekend !== undefined && apiApartment.upcomingAvailability?.isAvailableNextWeekend !== null) {
        return Boolean(apiApartment.upcomingAvailability.isAvailableNextWeekend);
      }
      if (anyApt.availabilityStatus) {
        return anyApt.availabilityStatus === "available";
      }
      if (anyApt.isAvailable !== undefined) {
        return Boolean(anyApt.isAvailable);
      }
      if (apiApartment.status === "CONFIRMED" || (apiApartment as any).isListingActive) {
        return true;
      }
      return true;
    }
    return false;
  }, [apiApartment, id]);

  const isSwapAvailableForApt = apiApartment ? (apiApartment as any).isSwapAvailable !== false : true;

  const isAcceptingRequests = useMemo(() => {
    if (apiApartment) {
      const anyApt = apiApartment as any;
      if (anyApt.receiveRequestWhenUnavailable !== undefined) {
        return Boolean(anyApt.receiveRequestWhenUnavailable);
      }
      if (apiApartment.upcomingAvailability?.canMakeOffer !== undefined && apiApartment.upcomingAvailability?.canMakeOffer !== null) {
        return Boolean(apiApartment.upcomingAvailability.canMakeOffer);
      }
      if (anyApt.availabilityStatus) {
        return anyApt.availabilityStatus === "unavailable_upcoming";
      }
      if (anyApt.acceptRequestsWhenUnavailable !== undefined) {
        return Boolean(anyApt.acceptRequestsWhenUnavailable);
      }
      return true;
    }
    return true;
  }, [apiApartment, id]);

  // Derived available dates from API availabilities
  const availableDates = useMemo<AvailableDateItem[]>(() => {
    if (apiApartment?.availabilities && Array.isArray(apiApartment.availabilities) && apiApartment.availabilities.length > 0) {
      return apiApartment.availabilities.map((item: any, idx: number) => {
        let dateStr = "Upcoming Shabbat";
        if (item.weekend?.date) {
          try {
            dateStr = new Date(item.weekend.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          } catch {
            dateStr = String(item.weekend.date);
          }
        }
        return {
          id: item.id || idx + 1,
          date: dateStr,
          day: "Fri - Sat",
          reason: item.weekend?.title ? `Shabbos ${item.weekend.title}` : (item.isSpecial ? "Special Shabbat Rate" : "Available Shabbat"),
          isSpecial: Boolean(item.isSpecial),
          specialPrice: item.specialPrice ? `₪${item.specialPrice}` : null,
        };
      });
    }
    // Fallback: If apartment is available, generate upcoming Shabbatot
    if (isApartmentAvailable) {
      return SHABBATOT.slice(6, 12).map((shabbat, idx) => ({
        id: idx + 1,
        date: `Shabbat ${shabbat.date}`,
        day: "Fri - Sat",
        reason: `Shabbos Parshat ${shabbat.name}`,
        isSpecial: false,
        specialPrice: null,
      }));
    }
    return mockAvailableDates;
  }, [apiApartment?.availabilities, isApartmentAvailable]);

  // Display Fields (API with fallback)
  const displayTitle = apiApartment?.title || "Apartment Details";
  const displayCity = apiApartment?.city || "";
  const displayNeighborhood = apiApartment?.neighborhood || "";
  const displayStreet = apiApartment?.street1 || "";
  const displayPrice = apiApartment?.pricePerShabbat ? `₪${apiApartment.pricePerShabbat}` : "";
  const displayBeds = apiApartment?.bedrooms ?? 0;
  const displayBaths = apiApartment?.bathrooms ?? 0;
  const displayGuests = apiApartment?.maxGuest ?? 0;
  const displayCode = apiApartment?.propertyId || (id ? `APT-${id}` : "");
  const displayDescription = apiApartment?.description || "";
  const ownerPhone = apiApartment?.user?.phone || (apiApartment as any)?.phoneNumber || "972541234567";
  const ownerWhatsApp = apiApartment?.whatsApp || apiApartment?.user?.phone || (apiApartment as any)?.phoneNumber || "972541234567";
  const isPhoneEnabled = (apiApartment as any)?.phone !== false;
  const isWhatsAppEnabled = (apiApartment as any)?.whatsapp === true || (apiApartment as any)?.whatsApp === true;
  const isEmailEnabled = (apiApartment as any)?.email === true;

  // Submit Offer
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    submitOfferMutation(
      {
        apartmentId: id,
        offerPrice: Number(offerPriceInput),
        message: offerMessageInput,
        shabbosId: selectedDate || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Offer sent successfully!");
          setOfferPriceInput("");
          setOfferMessageInput("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to send offer.");
        },
      }
    );
  };

  const toggleSaveApartment = () => {
    toggleFavorite({
      id: apiApartment?.id || id,
      title: displayTitle,
      image: apiImages[0] || activeImage,
      price: apiApartment?.pricePerShabbat ?? 0,
      city: displayCity,
      location: `${displayNeighborhood}, ${displayCity}`,
      beds: Number(displayBeds),
      baths: Number(displayBaths),
      guests: Number(displayGuests),
    });
  };

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

  if (isAptLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-20 relative">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-8"></div>
            <div className="w-full h-[400px] md:h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl mt-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              </div>
              <div className="md:col-span-1 h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!apiApartment) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col items-center justify-center p-4">
        <MainNavbar />
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Apartment Not Found</h2>
          <p className="text-zinc-500 mb-8">The apartment you are looking for does not exist or has been removed.</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-[#4c55a4] text-white rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

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
                   {displayCode}
                 </span>
                 <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xs rounded-md border border-green-200 dark:border-green-800/50 flex items-center gap-1">
                   <ShieldCheck className="w-3.5 h-3.5" /> {t("apartment_details.verified_listing")}
                 </span>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">
                 {displayTitle}
               </h1>
               {/* Location Details with explicit labels */}
               <div className="mt-3 p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-1 inline-block min-w-[280px]">
                 <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold text-sm">
                   <MapPin className="w-4 h-4 text-[#4c55a4] shrink-0" />
                   <span className="text-zinc-500 dark:text-zinc-400 font-semibold">City:</span>
                   <span className="font-extrabold text-[#4c55a4] dark:text-indigo-400">{displayCity}</span>
                 </div>
                 <div className="pl-5 flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                   <span className="text-zinc-400 dark:text-zinc-500 font-semibold">Neighborhood:</span>
                   <span className="font-bold text-zinc-900 dark:text-zinc-100">{displayNeighborhood}</span>
                 </div>
                 <div className="pl-5 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                   <span className="text-zinc-400 dark:text-zinc-500 font-semibold">Street Name:</span>
                   <span className="font-semibold text-zinc-800 dark:text-zinc-200">{displayStreet}</span>
                 </div>
                 {(apiApartment as any)?.houseNumber && (
                   <div className="pl-5 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                     <span className="text-zinc-400 dark:text-zinc-500 font-semibold">House Number:</span>
                     <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{(apiApartment as any)?.houseNumber}</span>
                   </div>
                 )}
               </div>
             </div>

             {/* Favorite Save Button */}
             <div className="flex items-center gap-3 self-start md:self-auto">
               <button
                 onClick={toggleSaveApartment}
                 className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-extrabold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${
                   isSaved
                     ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shadow-red-500/10"
                     : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
                 }`}
               >
                 <Heart className={`w-5 h-5 transition-transform ${isSaved ? "fill-red-500 text-red-500 scale-110" : ""}`} />
                 <span>{isSaved ? "Saved to Favorites" : "Save to Favorites"}</span>
               </button>
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
                {currentGalleryImages.map((img, index) => (
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
                  {!isSwapMode && <span className="text-3xl font-black text-zinc-900 dark:text-white">{displayPrice}</span>}
                </div>
                
                {/* Basic Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <BedDouble className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      {displayBeds} {t("apartment_details.beds")}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <DoorOpen className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      {displayBaths} {t("apartment_details.baths")}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Users className="w-5 h-5 text-[#4c55a4] dark:text-[#6b75c8]" />
                      {t("apartment_details.up_to")} {displayGuests} {t("apartment_details.guests")}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
                    {isAvailableForNextWeekend ? (
                      <div className="w-full sm:w-auto mt-4 space-y-3">
                        <button 
                          onClick={() => setIsDatesModalOpen(true)}
                          className="w-full px-4 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold transition-all shadow-md text-sm flex items-center justify-center whitespace-nowrap"
                        >
                          View all available dates
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 space-y-3">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-900">
                          Unavailable for upcoming weekend
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsDatesModalOpen(true)}
                            className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 text-white dark:text-zinc-900 rounded-xl font-bold text-sm flex items-center justify-center whitespace-nowrap"
                          >
                            View all available dates
                          </button>
                          <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 px-4 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm flex items-center justify-center whitespace-nowrap"
                          >
                            I'm interested
                          </button>
                        </div>
                        
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={handleNotifyMe}
                            disabled={isSendingNotify || isNotified}
                            className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm disabled:opacity-50 text-zinc-900 dark:text-white"
                          >
                            {isNotified ? "Notified" : "Notify Me"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details Breakdown inside About this home */}
                <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4c55a4]" />
                    <span>Location Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="block text-zinc-400 dark:text-zinc-500 font-semibold mb-0.5">City</span>
                      <span className="font-extrabold text-[#4c55a4] dark:text-indigo-400 text-sm">{displayCity}</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="block text-zinc-400 dark:text-zinc-500 font-semibold mb-0.5">Neighborhood</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{displayNeighborhood}</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="block text-zinc-400 dark:text-zinc-500 font-semibold mb-0.5">Street Name</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{displayStreet}</span>
                    </div>
                    {((apiApartment as any)?.houseNumber) && (
                      <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <span className="block text-zinc-400 dark:text-zinc-500 font-semibold mb-0.5">House Number</span>
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">{(apiApartment as any)?.houseNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-8 whitespace-pre-line">
                   {displayDescription}
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
                       : isAcceptingRequests 
                         ? "This property is currently unavailable, but you can still send a request." 
                         : "This property is currently unavailable."}
                   </p>
                </div>
                {isApartmentAvailable ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                       onClick={() => setIsLandlordModalOpen(true)}
                       className="px-8 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                    >
                       <Phone className="w-4 h-4" />
                       {t("apartment_details.contact_landlord")}
                    </button>
                    {(isSwapMode || isSwapAvailableForApt) && (
                      <button 
                        onClick={handleProposeSwapFromDetails}
                        disabled={isSendingSwapRequest}
                        className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 disabled:opacity-50"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        {isSendingSwapRequest ? "Sending..." : "Propose Swap"}
                      </button>
                    )}
                  </div>
                ) : isAcceptingRequests ? (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                       onClick={() => setIsModalOpen(true)}
                       className="px-6 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center whitespace-nowrap active:scale-95"
                    >
                       I'm interested
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                       onClick={() => setIsModalOpen(true)}
                       className="px-6 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center whitespace-nowrap active:scale-95"
                    >
                       Send request or offer
                    </button>
                  </div>
                )}
            </div>

            {/* Map & Walking Distance Calculator Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">{t("apartment_details.location_map")}</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Ramban St 14, Rehavia, Jerusalem</p>
                </div>

                {/* Interactive Walking Distance Calculator Card */}
                {/* Interactive Walking Distance Calculator Card */}
                {(() => {
                  const fallbackCoords = getCoordinatesForAddress(destInput || "Jerusalem");
                  const aptLat = apiApartment?.lat || apiApartment?.marker?.lat || 31.7745;
                  const aptLng = apiApartment?.lng || apiApartment?.marker?.lng || 35.2150;
                  
                  let displayWalkingMins = walkingMinsText;
                  let displayDistanceKm = distanceKmText;
                  
                  if (!displayWalkingMins) {
                     const km = calculateDistanceKm(fallbackCoords.lat, fallbackCoords.lng, aptLat, aptLng);
                     const mins = Math.max(2, Math.round(km * 13.33));
                     displayDistanceKm = `${km} km`;
                     displayWalkingMins = `${mins} mins`;
                  }

                  return (
                    <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/80 dark:from-zinc-800/80 dark:to-zinc-800/50 p-5 rounded-2xl border border-indigo-100 dark:border-zinc-700/80 mb-6 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-[#4c55a4]" /> Walking Distance Calculator
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                        Enter your target destination (e.g. Shul, Kotel, Great Synagogue, Rehavia) to calculate walking time:
                      </p>
                      
                      <div ref={targetContainerRef} className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#4c55a4]" />
                        </div>
                        <input 
                          type="text" 
                          value={destInput}
                          onChange={(e) => handleTargetSearch(e.target.value)}
                          placeholder="e.g. Kotel, Great Synagogue, Rehavia..."
                          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm"
                        />
                        {isTargetDropdownOpen && (targetSuggestions.length > 0 || isTargetLoading) && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {isTargetLoading ? (
                              <div className="p-4 text-center text-zinc-500 text-sm">Loading suggestions...</div>
                            ) : (
                              <ul className="py-2">
                                {targetSuggestions.map((place, idx) => (
                                  <li 
                                    key={idx}
                                    onClick={() => handleSelectTargetPlace(place)}
                                    className="px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                                  >
                                    <div className="text-sm font-bold text-zinc-900 dark:text-white">
                                      {place.structured_formatting?.main_text || place.description}
                                    </div>
                                    {place.structured_formatting?.secondary_text && (
                                      <div className="text-xs text-zinc-500">
                                        {place.structured_formatting.secondary_text}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-indigo-100 dark:border-zinc-700/60">
                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-100 dark:border-zinc-700/60 shadow-xs">
                          <div className="p-2.5 bg-[#4c55a4]/10 rounded-xl text-[#4c55a4]">
                            <Footprints className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Walking Time</span>
                            <span className="text-base font-black text-[#4c55a4] dark:text-indigo-400">🚶 {displayWalkingMins}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-indigo-100 dark:border-zinc-700/60 shadow-xs">
                          <div className="p-2.5 bg-[#4c55a4]/10 rounded-xl text-[#4c55a4]">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Distance</span>
                            <span className="text-base font-black text-zinc-900 dark:text-white">📍 {displayDistanceKm}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="w-full h-[350px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                  {/* The dynamic Google Map will mount here - isolated from React children */}
                  <div ref={mapContainerRef} className="absolute inset-0" />
                  
                  {!mapInstanceRef.current && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-2 bg-zinc-200 dark:bg-zinc-800 z-10 pointer-events-none">
                       <MapPin className="w-8 h-8 animate-bounce text-[#4c55a4]" />
                       <span className="text-sm font-semibold">Loading Map...</span>
                     </div>
                  )}
                </div>
            </div>

            {/* R1 — Renter Reviews Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  Renter Reviews ({approvedReviewsList.length})
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Verified feedback from guests who completed a stay at this apartment.
                </p>
              </div>

              <div className="space-y-4">
                {approvedReviewsList.map(rev => (
                  <div key={rev.id} className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/60">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base">{rev.title}</h4>
                        <p className="text-xs text-zinc-500 font-medium">By {rev.reviewerName} • {rev.date}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg text-amber-800 dark:text-amber-300 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {rev.rating}.0
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
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
                You are contacting <span className="font-bold text-zinc-900 dark:text-white">{displayTitle}</span>. Fill out the details below.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                {/* Which Shabbos Dropdown */}
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

                {/* Original Price Display */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Apartment Original Price</span>
                  <span className="font-extrabold text-[#4c55a4] dark:text-indigo-400 text-lg">{displayPrice}</span>
                </div>

                {/* Offer Price Input Field */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Your Price Offer
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-400 font-bold text-sm">₪</span>
                    <input 
                      required
                      type="number" 
                      placeholder="Enter your offer"
                      value={offerPriceInput}
                      onChange={(e) => setOfferPriceInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all font-semibold" 
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">{t("apartment_details.message")}</label>
                  <textarea required rows={4} placeholder="Hello, I am interested in this property for..." value={offerMessageInput} onChange={(e) => setOfferMessageInput(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]/50 transition-all resize-none"></textarea>
                </div>
                
                <div className="pt-2">
                  <button type="submit" disabled={isSendingOffer} className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSendingOffer ? "Sending..." : t("apartment_details.send_message")}
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
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-[#4c55a4]">{date.date}</span>
                      {date.specialPrice && (
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-md">
                          {date.specialPrice}
                        </span>
                      )}
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
                   <p className="text-lg font-black text-[#4c55a4] dark:text-[#8892eb] tracking-wide">{displayCode}</p>
                 </div>
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(displayCode);
                     setIsCopied(true);
                     setTimeout(() => setIsCopied(false), 2000);
                   }} 
                   className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5" 
                   title="Copy Code"
                 >
                   {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} Copy Code
                 </button>
              </div>

              {/* Section 2: ShabbosRent Official Support Hotline in Following Row */}
              <div className="mb-3">
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

              {/* DIRECT OWNER CONTACT */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                 <p className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider mb-2.5">DIRECT OWNER CONTACT</p>
                 
                 {/* Row 1: Call Owner & WhatsApp Owner in SAME ROW */}
                 {(isPhoneEnabled || isWhatsAppEnabled) && (
                   <div className={`grid ${isPhoneEnabled && isWhatsAppEnabled ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                      {isPhoneEnabled && (
                        <a 
                          href={getTelLink(ownerPhone)}
                          onClick={() => setHasContactedOwner(true)}
                          className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                        >
                          <Phone className="w-4 h-4" /> Call Owner
                        </a>
                      )}
                      {isWhatsAppEnabled && (
                        <a 
                          href={getWhatsAppLink(ownerWhatsApp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setHasContactedOwner(true)}
                          className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp Owner
                        </a>
                      )}
                   </div>
                 )}

                 {/* Row 2: Contact Owner by Email in Next Row */}
                 {isEmailEnabled && (
                   <a 
                     href={`mailto:${apiApartment?.user?.email || 'owner@shabbosrent.com'}?subject=Inquiry%20regarding%20Apartment%20${displayCode}`}
                     onClick={() => setHasContactedOwner(true)}
                     className="w-full py-3 bg-white dark:bg-zinc-900 hover:bg-[#4c55a4]/5 dark:hover:bg-indigo-500/10 text-[#4c55a4] dark:text-indigo-300 border-2 border-[#4c55a4] dark:border-indigo-500 rounded-xl font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                   >
                     <Mail className="w-4 h-4 text-[#4c55a4] dark:text-indigo-300" /> Contact Owner by Email
                   </a>
                 )}
              </div>

              {/* B1 — Renter Confirmation Section */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={handleStartRenterConfirm}
                  disabled={!hasContactedOwner}
                  className={`w-full py-3.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 text-sm ${hasContactedOwner ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-[0.98]" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"}`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${hasContactedOwner ? "text-white" : "text-zinc-400 dark:text-zinc-500"}`} />
                  {hasContactedOwner ? "I confirmed with the landlord" : "Contact owner to unlock"}
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

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {availableDates.map(d => (
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
                {displayStreet}, {displayNeighborhood}, {displayCity}
              </p>
            </div>

            {/* Waze Link Button */}
            <div className="space-y-2.5">
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(`${displayStreet} ${displayNeighborhood} ${displayCity}`)}&navigate=yes`}
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
                          <span className="flex items-center gap-1 w-1/2"><DoorOpen className="w-3.5 h-3.5 text-[#4c55a4]" /> 2 Rooms</span>
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
                          <span className="flex items-center gap-1 w-1/2"><DoorOpen className="w-3.5 h-3.5 text-[#4c55a4]" /> 3 Rooms</span>
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
                       href={getTelLink(ownerPhone)}
                       onClick={() => setHasContactedOwner(true)}
                       className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                     >
                       <Phone className="w-4 h-4" /> Call Owner
                     </a>
                     <a 
                       href={getWhatsAppLink(ownerWhatsApp)}
                       target="_blank"
                       rel="noopener noreferrer"
                       onClick={() => setHasContactedOwner(true)}
                       className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-extrabold transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                     >
                       <MessageCircle className="w-4 h-4" /> WhatsApp Owner
                     </a>
                     <a 
                       href={`mailto:${apiApartment?.user?.email || "owner@shabbosrent.com"}?subject=Swap%20Inquiry%20(SWP-8472)%20for%20Apartment%20${displayCode}`}
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
              {isAcceptingRequests 
                ? "This property is currently unavailable, but you can still send a request. The owner will contact you if it becomes available for your selected dates."
                : "This property is currently unavailable and the owner is not accepting requests at this time."}
            </p>

            <div className="space-y-3">
              {isAcceptingRequests && (
                <button
                  onClick={() => {
                    setIsUnavailableModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2"
                >
                  Send Offer / Request
                </button>
              )}

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

      {/* Request Offer Modal */}
      {isRequestOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsRequestOfferModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
              Send a Request or Offer
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const weekend = formData.get("weekend") as string;
              const offerPrice = formData.get("offerPrice") as string;
              
              if (typeof window !== "undefined") {
                const existing = localStorage.getItem("apartment_offers");
                const requests = existing ? JSON.parse(existing) : [];
                requests.push({
                  id: `offer-${Date.now()}`,
                  type: 'offer',
                  apartmentId: id,
                  apartmentTitle: apiApartment?.title || "Apartment",
                  userEmail: localStorage.getItem("userEmail") || "user@example.com",
                  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  weekend: weekend,
                  offerPrice: offerPrice || ((apiApartment as any)?.price?.toString() || apiApartment?.pricePerShabbat?.toString() || "690"),
                  status: 'Pending'
                });
                localStorage.setItem("apartment_offers", JSON.stringify(requests));
              }
              setIsRequestOfferModalOpen(false);
              setIsOfferSuccessModalOpen(true);
            }} className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Select Weekend</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsWeekendDropdownOpen(!isWeekendDropdownOpen)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white font-medium cursor-pointer flex justify-between items-center transition-all shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <span className={selectedWeekendForOffer ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500"}>
                      {selectedWeekendForOffer ? selectedWeekendForOffer : "Choose a premium weekend..."}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isWeekendDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                  
                  {isWeekendDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {SHABBATOT.map(shabbat => {
                        const val = `${shabbat.name} (${shabbat.date})`;
                        return (
                          <div 
                            key={shabbat.id}
                            onClick={() => {
                              setSelectedWeekendForOffer(val);
                              setIsWeekendDropdownOpen(false);
                            }}
                            className="px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                          >
                            <div className="font-bold text-zinc-900 dark:text-white">{shabbat.name}</div>
                            <div className="text-sm font-medium text-zinc-500">{shabbat.date}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <input type="hidden" name="weekend" value={selectedWeekendForOffer} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Regular Price</label>
                <div className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-bold shadow-sm">
                  {displayPrice} <span className="text-zinc-400 dark:text-zinc-500 font-medium">/ weekend</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Maximum Offer (Optional)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">₪</span>
                  <input name="offerPrice" type="number" placeholder="Enter your offer" className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-bold focus:outline-none focus:border-[#4c55a4] dark:focus:border-[#4c55a4] transition-all shadow-sm" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold rounded-2xl text-lg transition-all shadow-lg shadow-[#4c55a4]/20 active:scale-[0.98]"
                >
                  Submit Request / Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notify Success Modal */}
      {isNotifySuccessModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
              Request Sent!
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              We'll notify you via email the moment this property becomes available.
            </p>
            
            <button
              onClick={() => setIsNotifySuccessModalOpen(false)}
              className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-[#4c55a4]/20 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Offer Success Modal */}
      {isOfferSuccessModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
              Offer Sent!
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Your request/offer has been successfully sent to the owner. They will review it shortly.
            </p>
            
            <button
              onClick={() => setIsOfferSuccessModalOpen(false)}
              className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-[#4c55a4]/20 active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}


      {/* Swap Success Modal */}
      {isSwapSuccessModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
              Swap Request Submitted
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Your exchange proposal has been sent! You will be notified when the host reviews your request.
            </p>
            
            <button
              onClick={() => setIsSwapSuccessModalOpen(false)}
              className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-[#4c55a4]/20 active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
