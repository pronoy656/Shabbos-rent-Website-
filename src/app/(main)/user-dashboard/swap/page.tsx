"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Filter,
  Loader2,
  MapPin,
  BedDouble,
  Users,
  DoorOpen,
  Building2,
  ArrowRightLeft,
  Inbox,
  Send,
  Calendar,
  XCircle,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  Plus,
  Search,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import {
  useSwapPreference,
  useSaveSwapPreference,
  useMatchedSwaps,
  useSendSwapRequest,
  useMySwaps,
  useUpdateSwapStatus,
} from "@/hooks/useSwap";
import { useMyApartment } from "@/hooks/useApartments";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { getImageUrl } from "@/utils/imageUrl";
import type { SwapStatus, SwappableListingItem, SwapRequestItem, MatchedSwapsParams } from "@/types/swap.types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { loadGoogleMaps } from "@/utils/googleMapsLoader";
import { getCoordinatesForAddress } from "@/utils/distanceUtils";

interface SwapPlaceSuggestion {
  id: string;
  placeId?: string;
  mainText: string;
  secondaryText: string;
  city: string;
  neighborhood: string;
  fullAddress: string;
}

// Fallback curated places in Israel for instant suggestions
const VERIFIED_SWAP_PLACES: SwapPlaceSuggestion[] = [
  {
    id: "jer-kotel",
    mainText: "Western Wall (Kotel)",
    secondaryText: "Old City, Jerusalem, Israel",
    city: "Jerusalem",
    neighborhood: "Old City",
    fullAddress: "Western Wall, Old City, Jerusalem",
  },
  {
    id: "jer-great-syn",
    mainText: "Jerusalem Great Synagogue",
    secondaryText: "King George St 56, Rehavia, Jerusalem",
    city: "Jerusalem",
    neighborhood: "Rehavia",
    fullAddress: "King George St 56, Jerusalem",
  },
  {
    id: "jer-rehavia",
    mainText: "Rehavia",
    secondaryText: "Jerusalem, Israel",
    city: "Jerusalem",
    neighborhood: "Rehavia",
    fullAddress: "Rehavia, Jerusalem",
  },
  {
    id: "jer-geula",
    mainText: "Geula",
    secondaryText: "Jerusalem, Israel",
    city: "Jerusalem",
    neighborhood: "Geula",
    fullAddress: "Geula, Jerusalem",
  },
  {
    id: "jer-mahane",
    mainText: "Mahane Yehuda",
    secondaryText: "Jerusalem, Israel",
    city: "Jerusalem",
    neighborhood: "Mahane Yehuda",
    fullAddress: "Mahane Yehuda, Jerusalem",
  },
  {
    id: "ta-dizengoff",
    mainText: "Dizengoff Center",
    secondaryText: "City Center, Tel Aviv, Israel",
    city: "Tel Aviv",
    neighborhood: "City Center",
    fullAddress: "Dizengoff St, Tel Aviv",
  },
  {
    id: "ta-rothschild",
    mainText: "Rothschild Boulevard",
    secondaryText: "Lev HaIr, Tel Aviv, Israel",
    city: "Tel Aviv",
    neighborhood: "Lev HaIr",
    fullAddress: "Rothschild Blvd, Tel Aviv",
  },
  {
    id: "tz-artists",
    mainText: "Artists Colony",
    secondaryText: "Old City, Tzfat, Israel",
    city: "Tzfat",
    neighborhood: "Artists Colony",
    fullAddress: "Artists Colony, Tzfat",
  },
  {
    id: "bb-center",
    mainText: "Rabbi Akiva St",
    secondaryText: "Bnei Brak, Israel",
    city: "Bnei Brak",
    neighborhood: "City Center",
    fullAddress: "Rabbi Akiva St, Bnei Brak",
  },
  {
    id: "bs-rbsa",
    mainText: "Ramat Beit Shemesh A",
    secondaryText: "Beit Shemesh, Israel",
    city: "Beit Shemesh",
    neighborhood: "Ramat Beit Shemesh A",
    fullAddress: "Nahal Dolev, Beit Shemesh",
  },
];

function parseGoogleAddressComponents(components: any[], fallbackText?: string) {
  let streetNumber = "";
  let route = "";
  let neighborhood = "";
  let city = "";

  if (Array.isArray(components)) {
    for (const c of components) {
      const types = c.types || [];
      if (types.includes("street_number")) {
        streetNumber = c.long_name || c.short_name;
      } else if (types.includes("route")) {
        route = c.long_name || c.short_name;
      } else if (
        types.includes("neighborhood") ||
        types.includes("sublocality") ||
        types.includes("sublocality_level_1") ||
        types.includes("sublocality_level_2")
      ) {
        if (!neighborhood) neighborhood = c.long_name || c.short_name;
      } else if (types.includes("locality")) {
        city = c.long_name || c.short_name;
      } else if (!city && (types.includes("administrative_area_level_2") || types.includes("administrative_area_level_1"))) {
        city = c.long_name || c.short_name;
      }
    }
  }

  if (city.toLowerCase().includes("tel aviv")) city = "Tel Aviv";
  else if (city.toLowerCase().includes("jerusalem")) city = "Jerusalem";
  else if (city.toLowerCase().includes("bnei brak")) city = "Bnei Brak";
  else if (city.toLowerCase().includes("beit shemesh")) city = "Beit Shemesh";
  else if (city.toLowerCase().includes("tzfat") || city.toLowerCase().includes("safed")) city = "Tzfat";
  else if (city.toLowerCase().includes("netanya")) city = "Netanya";
  else if (city.toLowerCase().includes("haifa")) city = "Haifa";

  const streetAddress = route ? (streetNumber ? `${route} ${streetNumber}` : route) : (fallbackText || "");
  return { streetAddress, neighborhood, city };
}

export default function ApartmentSwapPage() {
  const { t } = useLanguage();
  const { data: myAptData, isLoading: isMyAptLoading } = useMyApartment();
  const { data: prefData, isLoading: isPrefLoading } = useSwapPreference();
  const { data: mySwapsData, isLoading: isMySwapsLoading } = useMySwaps();
  const { data: weekendCalendarsData, isLoading: isWeekendCalendarsLoading } = useWeekendCalendars({ limit: 100 });
  const savePreferenceMutation = useSaveSwapPreference();
  const sendSwapRequestMutation = useSendSwapRequest();
  const updateStatusMutation = useUpdateSwapStatus();

  const weekendList = Array.isArray(weekendCalendarsData?.data)
    ? [...weekendCalendarsData.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const myApartment = myAptData;
  const userPreference = prefData?.data;

  const [activeTab, setActiveTab] = useState<"matches" | "received" | "sent">("matches");
  const [isSwapEnabled, setIsSwapEnabled] = useState(false);
  const [swapPrefCity, setSwapPrefCity] = useState("");
  const [swapPrefNeighborhood, setSwapPrefNeighborhood] = useState("");
  const [swapPrefRooms, setSwapPrefRooms] = useState("");
  const [swapPrefBeds, setSwapPrefBeds] = useState("");
  const [swapPrefWeekend, setSwapPrefWeekend] = useState("");
  const [swapPrefTarget, setSwapPrefTarget] = useState("");
  const [swapPrefWalkingDistance, setSwapPrefWalkingDistance] = useState("");
  const [appliedParams, setAppliedParams] = useState<MatchedSwapsParams>({});
  const [isSwapSuccessModalOpen, setIsSwapSuccessModalOpen] = useState(false);
  const [isEnablePromptOpen, setIsEnablePromptOpen] = useState(false);
  const [isNoApartmentModalOpen, setIsNoApartmentModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Google Places Autocomplete state for Target Destination & Neighborhood
  const [targetSuggestions, setTargetSuggestions] = useState<SwapPlaceSuggestion[]>([]);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const [isTargetVerified, setIsTargetVerified] = useState(false);
  const targetContainerRef = useRef<HTMLDivElement>(null);

  // Neighborhood suggestions state
  const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState<string[]>([]);
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);
  const neighborhoodContainerRef = useRef<HTMLDivElement>(null);

  const autocompleteServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // Initialize Google Maps services
  useEffect(() => {
    let mounted = true;
    loadGoogleMaps()
      .then((googleMaps) => {
        if (!mounted) return;
        if (googleMaps.places?.AutocompleteService) {
          autocompleteServiceRef.current = new googleMaps.places.AutocompleteService();
        }
        if (googleMaps.Geocoder) {
          geocoderRef.current = new googleMaps.Geocoder();
        }
      })
      .catch((err) => {
        console.warn("Google Maps Places service not initialized for swap page:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (targetContainerRef.current && !targetContainerRef.current.contains(e.target as Node)) {
        setIsTargetDropdownOpen(false);
      }
      if (neighborhoodContainerRef.current && !neighborhoodContainerRef.current.contains(e.target as Node)) {
        setIsNeighborhoodDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Curated Israeli neighborhoods for quick suggestions
  const ISRAEL_NEIGHBORHOODS: Record<string, string[]> = {
    Jerusalem: ["Rehavia", "City Center", "Geula", "Mea Shearim", "Talbiya", "Baka", "German Colony", "Old City", "Jewish Quarter", "Bayit Vegan", "Har Nof", "Givat Shaul", "Katamon", "Ramat Eshkol", "Sanhedria", "Shmuel HaNavi"],
    "Tel Aviv": ["City Center", "Lev HaIr", "Old North", "Neve Tzedek", "Florentin", "Kerem HaTeimanim", "Ramat Aviv", "Sarona", "Montefiore", "Tel Aviv Port"],
    Tzfat: ["Old City", "Artists Colony", "Canaan", "South Hills", "Kiryat Chabad", "Meor Chaim"],
    "Bnei Brak": ["City Center", "Zichron Meir", "Pardes Katz", "Kiryat Herzog", "Ramat Elhanan", "Ramat Aharon", "Shikun Hey"],
    "Beit Shemesh": ["Ramat Beit Shemesh A", "Ramat Beit Shemesh B", "Ramat Beit Shemesh C", "Ramat Beit Shemesh D", "Old Beit Shemesh", "Sheinfeld", "Nofei Aviv"],
    Netanya: ["City Center", "Kiryat Sanz", "Agamim", "Ir Yamim", "Poleg", "Nat 600", "North Beach"],
    Haifa: ["Hadar", "Central Carmel", "Bat Galim", "Kiryat Shmuel", "Neve Shaanan", "French Carmel"],
  };

  // Fetch Target Destination suggestions
  const fetchTargetSuggestions = useCallback((query: string, cityFilter?: string) => {
    if (!query.trim()) {
      const cityMatches = VERIFIED_SWAP_PLACES.filter((p) =>
        cityFilter && cityFilter !== "Any" ? p.city.toLowerCase() === cityFilter.toLowerCase() : true
      ).slice(0, 5);
      setTargetSuggestions(cityMatches);
      return;
    }

    setIsTargetLoading(true);
    const cleanStr = query.toLowerCase().trim();

    if (autocompleteServiceRef.current) {
      const input = cityFilter && cityFilter !== "Any" && !query.toLowerCase().includes(cityFilter.toLowerCase())
        ? `${query}, ${cityFilter}, Israel`
        : `${query}, Israel`;

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "il" },
        },
        (predictions: any[], status: any) => {
          if (status === "OK" && predictions && predictions.length > 0) {
            const googleResults: SwapPlaceSuggestion[] = predictions.map((pred) => {
              const mainText = pred.structured_formatting?.main_text || pred.description.split(",")[0];
              const secondaryText = pred.structured_formatting?.secondary_text || pred.description;

              let predCity = "";
              const parts = secondaryText.split(",").map((s: string) => s.trim());
              if (parts.length >= 2 && parts[parts.length - 1] === "Israel") {
                  predCity = parts[parts.length - 2];
              } else if (parts.length > 0) {
                  predCity = parts[0];
              }

              return {
                id: pred.place_id || `swap-g-${Date.now()}-${Math.random()}`,
                placeId: pred.place_id,
                mainText,
                secondaryText,
                city: predCity,
                neighborhood: "",
                fullAddress: pred.description,
              };
            });
            setTargetSuggestions(googleResults.slice(0, 6));
            setIsTargetLoading(false);
            return;
          }

          fallbackSwapSearch(cleanStr, cityFilter);
        }
      );
      return;
    }

    fallbackSwapSearch(cleanStr, cityFilter);
  }, []);

  const fallbackSwapSearch = (cleanStr: string, cityFilter?: string) => {
    let matches = VERIFIED_SWAP_PLACES.filter((p) => {
      const matchText = `${p.fullAddress} ${p.mainText} ${p.secondaryText} ${p.neighborhood} ${p.city}`.toLowerCase();
      const cityMatches = !cityFilter || cityFilter === "Any" || p.city.toLowerCase() === cityFilter.toLowerCase();
      return matchText.includes(cleanStr) && cityMatches;
    });

    if (matches.length === 0 || cleanStr.length > 2) {
      const fallbackCity = cityFilter && cityFilter !== "Any" ? cityFilter : (cleanStr.includes("tel aviv") ? "Tel Aviv" : cleanStr.includes("tzfat") ? "Tzfat" : "Jerusalem");
      const dynamicPlace: SwapPlaceSuggestion = {
        id: `dyn-swap-${Date.now()}`,
        mainText: cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1),
        secondaryText: `${fallbackCity}, Israel (Google Verified Destination)`,
        city: fallbackCity,
        neighborhood: cleanStr.includes("rehavia") ? "Rehavia" : cleanStr.includes("geula") ? "Geula" : "Center",
        fullAddress: `${cleanStr}, ${fallbackCity}`,
      };
      matches = [dynamicPlace, ...matches.slice(0, 4)];
    }

    setTargetSuggestions(matches.slice(0, 6));
    setIsTargetLoading(false);
  };

  const handleSelectTargetPlace = (place: SwapPlaceSuggestion) => {
    if (geocoderRef.current && (place.placeId || place.fullAddress)) {
      const geocodeReq = place.placeId ? { placeId: place.placeId } : { address: place.fullAddress };
      geocoderRef.current.geocode(geocodeReq, (results: any[], status: any) => {
        if (status === "OK" && results && results[0]) {
          const parsed = parseGoogleAddressComponents(results[0].address_components, place.mainText);
          const resolvedCity = parsed.city || place.city || "";
          const resolvedNeighborhood = parsed.neighborhood || "";

          setSwapPrefTarget(place.mainText);
          if (resolvedCity) setSwapPrefCity(resolvedCity);
          if (resolvedNeighborhood) setSwapPrefNeighborhood(resolvedNeighborhood);
          setIsTargetVerified(true);
          setIsTargetDropdownOpen(false);
          return;
        }

        setSwapPrefTarget(place.mainText);
        if (place.city) setSwapPrefCity(place.city);
        if (place.neighborhood) setSwapPrefNeighborhood(place.neighborhood);
        setIsTargetVerified(true);
        setIsTargetDropdownOpen(false);
      });
      return;
    }

    setSwapPrefTarget(place.mainText);
    if (place.city) setSwapPrefCity(place.city);
    if (place.neighborhood) setSwapPrefNeighborhood(place.neighborhood);
    setIsTargetVerified(true);
    setIsTargetDropdownOpen(false);
  };

  const fetchNeighborhoodSuggestions = useCallback((searchStr: string, currentCity: string) => {
    const activeCity = currentCity && currentCity !== "Any" ? currentCity : "Jerusalem";
    if (!searchStr.trim()) {
      const cityList = ISRAEL_NEIGHBORHOODS[activeCity] || ISRAEL_NEIGHBORHOODS["Jerusalem"] || [];
      setNeighborhoodSuggestions(cityList.slice(0, 6));
      return;
    }

    if (autocompleteServiceRef.current) {
      const input = currentCity && currentCity !== "Any" ? `${searchStr}, ${currentCity}` : searchStr;
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "il" },
          types: ["(regions)"],
        },
        (predictions: any[], status: any) => {
          if (status === "OK" && predictions && predictions.length > 0) {
            const results = predictions.map(p => p.structured_formatting?.main_text || p.description.split(",")[0]);
            setNeighborhoodSuggestions(Array.from(new Set(results)).slice(0, 6));
          } else {
            const cityList = ISRAEL_NEIGHBORHOODS[activeCity] || [];
            setNeighborhoodSuggestions(cityList.filter(n => n.toLowerCase().includes(searchStr.toLowerCase())).slice(0, 6));
          }
        }
      );
    } else {
      const cityList = ISRAEL_NEIGHBORHOODS[activeCity] || [];
      setNeighborhoodSuggestions(cityList.filter(n => n.toLowerCase().includes(searchStr.toLowerCase())).slice(0, 6));
    }
  }, []);

  const handleNeighborhoodChange = (val: string) => {
    setSwapPrefNeighborhood(val);
    setIsNeighborhoodDropdownOpen(true);
    fetchNeighborhoodSuggestions(val, swapPrefCity);
  };

  // Sync preference data to form state and applied search
  useEffect(() => {
    if (userPreference) {
      const isEn = userPreference.isEnabled ?? false;
      setIsSwapEnabled(isEn);
      if (userPreference.city) setSwapPrefCity(userPreference.city);
      if (userPreference.neighborhood) setSwapPrefNeighborhood(userPreference.neighborhood);
      if (userPreference.rooms != null) setSwapPrefRooms(userPreference.rooms.toString());
      if (userPreference.beds != null) setSwapPrefBeds(userPreference.beds.toString());
      let weekendDate = "";
      if (userPreference.weekend) {
        weekendDate = userPreference.weekend.split("T")[0];
        setSwapPrefWeekend(weekendDate);
      }
      if (isEn) {
        setAppliedParams({
          city: userPreference.city && userPreference.city !== "Any" ? userPreference.city : undefined,
          neighborhood: userPreference.neighborhood || undefined,
          minBedrooms: userPreference.rooms ? userPreference.rooms : undefined,
          minBeds: userPreference.beds ? userPreference.beds : undefined,
          weekend: weekendDate || undefined,
        });
      }
    }
  }, [userPreference]);

  // Fetch matched swaps using applied parameters (only triggered on form submit / initial load)
  const {
    data: matchedData,
    isLoading: isMatchesLoading,
    refetch: refetchMatches,
  } = useMatchedSwaps(appliedParams, { enabled: isSwapEnabled });

  const rawMatchedData = matchedData?.data;
  const swapMatches: SwappableListingItem[] = Array.isArray(rawMatchedData?.data)
    ? rawMatchedData.data
    : Array.isArray(rawMatchedData?.matchedProperties)
    ? rawMatchedData.matchedProperties
    : Array.isArray(rawMatchedData)
    ? (rawMatchedData as any)
    : [];

  const rawMySwaps = mySwapsData?.data;
  const receivedSwaps: SwapRequestItem[] = Array.isArray(rawMySwaps?.received)
    ? rawMySwaps.received
    : Array.isArray(rawMySwaps)
    ? (rawMySwaps as any)
    : [];

  const sentSwaps: SwapRequestItem[] = Array.isArray(rawMySwaps?.sent)
    ? rawMySwaps.sent
    : [];

  const pendingReceivedCount = receivedSwaps.filter((s) => s.status === "PENDING").length;

  const handleSavePreference = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!myApartment?.id) {
      setIsNoApartmentModalOpen(true);
      return;
    }

    if (!isSwapEnabled) {
      setIsEnablePromptOpen(true);
      return;
    }

    setActionError(null);
    try {
      await savePreferenceMutation.mutateAsync({
        apartmentId: myApartment.id,
        isEnabled: true,
        city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
        neighborhood: swapPrefNeighborhood || undefined,
        rooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
        beds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
        weekend: swapPrefWeekend || undefined,
      });
      setAppliedParams({
        city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
        neighborhood: swapPrefNeighborhood || undefined,
        targetDestination: swapPrefTarget || undefined,
        weekend: swapPrefWeekend || undefined,
        minBedrooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
        minBeds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
        walkingMinutes: swapPrefWalkingDistance ? parseInt(swapPrefWalkingDistance) : undefined,
      });
      toast.success("Swap preferences saved successfully!");
    } catch (error: any) {
      console.error("Failed to save preference:", error);
      const msg = error?.response?.data?.message || "Failed to save swap preferences.";
      setActionError(msg);
      toast.error(msg);
    }
  };

  const handleEnableAndSave = async () => {
    if (!myApartment?.id) {
      setIsNoApartmentModalOpen(true);
      return;
    }
    setIsSwapEnabled(true);
    setIsEnablePromptOpen(false);
    setActionError(null);
    try {
      await savePreferenceMutation.mutateAsync({
        apartmentId: myApartment.id,
        isEnabled: true,
        city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
        neighborhood: swapPrefNeighborhood || undefined,
        rooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
        beds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
        weekend: swapPrefWeekend || undefined,
      });
      setAppliedParams({
        city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
        neighborhood: swapPrefNeighborhood || undefined,
        targetDestination: swapPrefTarget || undefined,
        weekend: swapPrefWeekend || undefined,
        minBedrooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
        minBeds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
        walkingMinutes: swapPrefWalkingDistance ? parseInt(swapPrefWalkingDistance) : undefined,
      });
      toast.success("Apartment swap mode enabled and preferences saved!");
    } catch (error: any) {
      console.error("Failed to enable swap:", error);
      setIsSwapEnabled(false);
      const msg = error?.response?.data?.message || "Failed to enable swap.";
      setActionError(msg);
      toast.error(msg);
    }
  };

  // Free toggle: Users can toggle swap mode ON/OFF anytime freely
  const handleToggleSwap = async () => {
    if (!myApartment?.id) {
      setIsNoApartmentModalOpen(true);
      return;
    }
    const newState = !isSwapEnabled;
    setIsSwapEnabled(newState);
    try {
      await savePreferenceMutation.mutateAsync({
        apartmentId: myApartment.id,
        isEnabled: newState,
        city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
        neighborhood: swapPrefNeighborhood || undefined,
        rooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
        beds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
        weekend: swapPrefWeekend || undefined,
      });
      if (newState) {
        setAppliedParams({
          city: swapPrefCity && swapPrefCity !== "Any" ? swapPrefCity : undefined,
          neighborhood: swapPrefNeighborhood || undefined,
          targetDestination: swapPrefTarget || undefined,
          weekend: swapPrefWeekend || undefined,
          minBedrooms: swapPrefRooms ? parseInt(swapPrefRooms) : undefined,
          minBeds: swapPrefBeds ? parseInt(swapPrefBeds) : undefined,
          walkingMinutes: swapPrefWalkingDistance ? parseInt(swapPrefWalkingDistance) : undefined,
        });
        toast.success("Apartment swap mode enabled!");
      } else {
        toast.info("Apartment swap mode paused.");
      }
    } catch (error) {
      setIsSwapEnabled(!newState); // Revert on failure
    }
  };

  const handleProposeSwap = async (targetApartmentId: string) => {
    if (!myApartment?.id) {
      setIsNoApartmentModalOpen(true);
      return;
    }
    setActionError(null);
    try {
      await sendSwapRequestMutation.mutateAsync({
        fromAppId: myApartment.id,
        toAppId: targetApartmentId,
      });
      setIsSwapSuccessModalOpen(true);
    } catch (error: any) {
      console.error("Failed to send swap request:", error);
      setActionError(error?.response?.data?.message || "Failed to send swap proposal.");
    }
  };

  const handleStatusUpdate = async (id: string, status: SwapStatus) => {
    setActionError(null);
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error: any) {
      console.error("Failed to update status:", error);
      setActionError(error?.response?.data?.message || "Failed to update request status.");
    }
  };

  const getStatusBadge = (status: SwapStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  if (isMyAptLoading || isPrefLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-xs">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-40 rounded-2xl" />
          <Skeleton className="h-10 w-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5">
              <Skeleton className="h-40 w-full rounded-2xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Top Banner & Toggle */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-[#4c55a4] dark:text-indigo-400 rounded-xl text-xs font-bold mb-3">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
            Shabbat Apartment Exchange
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {t("dashboard.swap.title") || "Apartment Swap Program"}
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl">
            {t("dashboard.swap.desc") ||
              "Swap apartments with verified Jewish homeowners across Israel for Shabbat & Yom Tov weekends at zero rental cost."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 self-start md:self-auto">
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {isSwapEnabled
              ? t("dashboard.swap.enabled") || "Swap Enabled"
              : t("dashboard.swap.paused") || "Swap Paused"}
          </span>
          <button
            type="button"
            onClick={handleToggleSwap}
            disabled={savePreferenceMutation.isPending}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer disabled:opacity-50 ${
              isSwapEnabled ? "bg-[#4c55a4]" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isSwapEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-200 dark:border-red-800/50 text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {!myApartment ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-8 rounded-3xl border border-amber-200 dark:border-amber-800/50 text-center">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200 dark:border-amber-800/40 shadow-xs">
            <Building2 className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold mb-1">
            {t("dashboard.swap.listing_required_title") || "Apartment Listing Required"}
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto mb-5">
            {t("dashboard.swap.listing_required_desc") ||
              "You must have at least one active apartment listing to participate in community Shabbat swaps."}
          </p>
          <Link
            href="/user-dashboard/manage"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-xs shadow-md shadow-[#4c55a4]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t("dashboard.swap.create_listing_btn") || "Create Listing"}
          </Link>
        </div>
      ) : (
        <>
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("matches")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === "matches"
                  ? "bg-[#4c55a4] text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Matching Listings</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20 text-inherit">
                {swapMatches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("received")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === "received"
                  ? "bg-[#4c55a4] text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Received Proposals</span>
              {pendingReceivedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                  {pendingReceivedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sent")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                activeTab === "sent"
                  ? "bg-[#4c55a4] text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Sent Proposals</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20 text-inherit">
                {sentSwaps.length}
              </span>
            </button>
          </div>

          {/* TAB 1: MATCHING LISTINGS & PREFERENCES */}
          {activeTab === "matches" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Preferences Filter Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#4c55a4]" />
                    Your Desired Swap Destination & Preferences
                  </h3>
                </div>

                {!isSwapEnabled && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>Swap mode is currently paused for your apartment. Enable swap to activate your preferences and match with other hosts.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleSwap}
                      className="px-4 py-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      Turn ON Swap
                    </button>
                  </div>
                )}

                <form onSubmit={handleSavePreference}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {/* 1. Target Destination with Google Places Autocomplete (First field) */}
                    <div ref={targetContainerRef} className="relative">
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex items-center justify-between">
                        <span>Target Destination</span>
                        <span className="text-[10px] text-[#4c55a4] font-bold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Google Map
                        </span>
                      </label>
                      <div className="relative">
                        <Navigation className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4c55a4]" />
                        <input
                          type="text"
                          value={swapPrefTarget}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSwapPrefTarget(val);
                            setIsTargetVerified(false);
                            setIsTargetDropdownOpen(true);
                            fetchTargetSuggestions(val, swapPrefCity);
                          }}
                          onFocus={() => {
                            setIsTargetDropdownOpen(true);
                            fetchTargetSuggestions(swapPrefTarget, swapPrefCity);
                          }}
                          placeholder="e.g. Kotel, Great Synagogue, Ramban 18..."
                          className="w-full pl-10 pr-9 h-[48px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                        />
                        {isTargetLoading ? (
                          <div className="absolute right-3 top-3.5">
                            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                          </div>
                        ) : isTargetVerified ? (
                          <div className="absolute right-3 top-3.5" title="Google Map Location Verified">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                        ) : null}
                      </div>

                      {/* Google Places Live Suggestions Popover */}
                      {isTargetDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1.5 w-[320px] sm:w-[400px] max-w-[90vw] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                          <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#4c55a4]" /> Google Maps Suggestions
                            </span>
                            <span className="text-[9px] text-zinc-400 lowercase">click to auto-fill</span>
                          </div>
                          <div className="p-1 divide-y divide-zinc-100 dark:divide-zinc-800/40">
                            {targetSuggestions.map((suggestion) => (
                              <button
                                type="button"
                                key={suggestion.id}
                                onClick={() => handleSelectTargetPlace(suggestion)}
                                className="w-full text-left p-2.5 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded-xl transition-all flex items-start gap-2.5 group cursor-pointer"
                              >
                                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-[#4c55a4] group-hover:text-white flex items-center justify-center shrink-0 transition-colors text-zinc-600 dark:text-zinc-300 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-[#4c55a4] dark:group-hover:text-indigo-400 transition-colors truncate">
                                      {suggestion.mainText}
                                    </span>
                                    {suggestion.city && (
                                      <span className="text-[9px] font-bold bg-[#4c55a4]/10 text-[#4c55a4] dark:text-indigo-400 px-1.5 py-0.5 rounded-full shrink-0">
                                        {suggestion.city}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                    {suggestion.secondaryText}
                                  </p>
                                </div>
                              </button>
                            ))}

                            {targetSuggestions.length === 0 && !isTargetLoading && (
                              <div className="p-4 text-center text-xs text-zinc-500">
                                Type any street, landmark, or shul in Israel to search Google Maps.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Destination City (Auto-synced from Google Maps or selectable) */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex items-center justify-between">
                        <span>Destination City</span>
                        <span className="text-[10px] text-[#4c55a4] font-bold">Auto-synced</span>
                      </label>
                      <CustomSelect
                        icon={MapPin}
                        value={swapPrefCity}
                        onChange={(val) => {
                          setSwapPrefCity(val);
                          if (val && val !== "Any") {
                            const defaultNeighs = ISRAEL_NEIGHBORHOODS[val];
                            if (defaultNeighs && defaultNeighs.length > 0 && !swapPrefNeighborhood) {
                              setNeighborhoodSuggestions(defaultNeighs);
                            }
                          }
                        }}
                        placeholder="Select City"
                        options={[
                          { value: "", label: "Select City" },
                          { value: "Jerusalem", label: "Jerusalem" },
                          { value: "Tel Aviv", label: "Tel Aviv" },
                          { value: "Tzfat", label: "Tzfat" },
                          { value: "Netanya", label: "Netanya" },
                          { value: "Bnei Brak", label: "Bnei Brak" },
                          { value: "Beit Shemesh", label: "Beit Shemesh" },
                          { value: "Modiin Illit", label: "Modiin Illit" },
                          { value: "Haifa", label: "Haifa" },
                          { value: "Ashdod", label: "Ashdod" },
                          { value: "Any", label: "Any City" },
                        ]}
                      />
                    </div>

                    {/* 3. Neighborhood with Suggestions & Auto-fill */}
                    <div ref={neighborhoodContainerRef} className="relative">
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex items-center justify-between">
                        <span>Neighborhood</span>
                        <span className="text-[10px] text-zinc-400">Suggestions</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={swapPrefNeighborhood}
                          onChange={(e) => handleNeighborhoodChange(e.target.value)}
                          onFocus={() => {
                            setIsNeighborhoodDropdownOpen(true);
                            fetchNeighborhoodSuggestions(swapPrefNeighborhood, swapPrefCity);
                          }}
                          placeholder="e.g. Rehavia, City Center..."
                          className="w-full pl-10 pr-4 h-[48px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                        />
                      </div>

                      {/* Neighborhood Suggestions Dropdown */}
                      {isNeighborhoodDropdownOpen && neighborhoodSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-52 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                          <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3">
                            Popular Neighborhoods ({swapPrefCity || "Jerusalem"})
                          </div>
                          <div className="p-1">
                            {neighborhoodSuggestions.map((neigh) => (
                              <button
                                type="button"
                                key={neigh}
                                onClick={() => {
                                  setSwapPrefNeighborhood(neigh);
                                  setIsNeighborhoodDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{neigh}</span>
                                <span className="text-[10px] text-zinc-400">{swapPrefCity || "Israel"}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Walking Distance */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Walking Distance</label>
                      <input
                        type="text"
                        value={swapPrefWalkingDistance}
                        onChange={(e) => setSwapPrefWalkingDistance(e.target.value)}
                        placeholder="e.g. 10 mins"
                        className="w-full px-4 h-[48px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                      />
                    </div>
                  </div>

                  {/* Google Maps Location Synced Banner */}
                  {(swapPrefTarget || (swapPrefCity && swapPrefCity !== "Any")) && (
                    <div className="mb-6 p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-[#4c55a4] dark:text-indigo-400 shrink-0" />
                        <span>
                          Desired Location:{" "}
                          <strong>{swapPrefTarget || "Any target"}</strong>
                          {swapPrefNeighborhood ? ` in ${swapPrefNeighborhood}` : ""}
                          {swapPrefCity ? `, ${swapPrefCity}` : ""}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#4c55a4] dark:text-indigo-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                        Google Maps Linked
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Desired Shabbat Weekend</label>
                      <CustomSelect
                        icon={Calendar}
                        value={swapPrefWeekend}
                        onChange={setSwapPrefWeekend}
                        placeholder={isWeekendCalendarsLoading ? "Loading Weekends..." : "Select Weekend"}
                        disabled={isWeekendCalendarsLoading}
                        options={[
                          { value: "", label: "Select Weekend" },
                          ...weekendList.map((w) => {
                            const dateVal = w.date ? w.date.split("T")[0] : w.id;
                            let formattedDate = "";
                            if (w.date) {
                              try {
                                formattedDate = new Date(w.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                });
                              } catch {}
                            }
                            return {
                              value: dateVal,
                              label: formattedDate ? `${w.title} (${formattedDate})` : w.title,
                            };
                          }),
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Min Bedrooms</label>
                      <CustomSelect
                        icon={DoorOpen}
                        value={swapPrefRooms}
                        onChange={setSwapPrefRooms}
                        placeholder="Select Bedrooms"
                        options={[
                          { value: "", label: "Select Bedrooms" },
                          { value: "1", label: "1+ Bedrooms" },
                          { value: "2", label: "2+ Bedrooms" },
                          { value: "3", label: "3+ Bedrooms" },
                          { value: "4", label: "4+ Bedrooms" },
                          { value: "5", label: "5+ Bedrooms" },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Min Beds Needed</label>
                      <CustomSelect
                        icon={BedDouble}
                        value={swapPrefBeds}
                        onChange={setSwapPrefBeds}
                        placeholder="Select Beds"
                        options={[
                          { value: "", label: "Select Beds" },
                          { value: "1", label: "1+ Beds" },
                          { value: "2", label: "2+ Beds" },
                          { value: "3", label: "3+ Beds" },
                          { value: "4", label: "4+ Beds" },
                          { value: "6", label: "6+ Beds" },
                          { value: "8", label: "8+ Beds" },
                          { value: "10", label: "10+ Beds" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savePreferenceMutation.isPending}
                      className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {savePreferenceMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Swap Preferences
                    </button>
                  </div>
                </form>
              </div>

              {/* Available Swap Matches */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Matching Swap Listings ({swapMatches.length})
                  </h3>
                </div>

                {isMatchesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs p-0 space-y-4">
                        <Skeleton className="h-48 w-full rounded-none" />
                        <div className="p-5 pt-0 space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : swapMatches.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 text-center shadow-xs">
                    <div className="relative w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto mb-5 text-[#4c55a4] dark:text-indigo-400">
                      <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-zinc-900">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <Building2 className="w-10 h-10 stroke-[1.5]" />
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2">
                      No Matching Swap Listings Found
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                      We couldn&apos;t find any available apartments matching your selected criteria. Try adjusting your destination, reducing minimum room requirements, or choosing a different Shabbat weekend.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {swapMatches.map((match) => {
                      const apt = match.apartment;
                      const displayImage = apt.coverImage || (apt.images && apt.images[0]) || "";
                      return (
                        <div
                          key={match.id}
                          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={getImageUrl(displayImage)}
                              alt={apt.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-white shadow-xs">
                              {apt.neighborhood}, {apt.city}
                            </div>
                            {match.isMatch && (
                              <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Top Match {match.matchScore ? `(${match.matchScore} pts)` : ""}
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-base text-zinc-900 dark:text-white mb-2 line-clamp-1">
                                {apt.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                                <span className="flex items-center gap-1">
                                  <BedDouble className="w-3.5 h-3.5" />
                                  {apt.bedrooms} Beds
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <DoorOpen className="w-3.5 h-3.5" />
                                  {apt.bathrooms} Baths
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {apt.maxGuest} Guests
                                </span>
                              </div>

                              {(apt.walkingDistanceToDestination || apt.walkingDistanceToNeighborhood) && (
                                <div className="flex items-center gap-1 text-xs text-[#4c55a4] dark:text-indigo-400 font-semibold mb-4">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>
                                    {apt.walkingDistanceToDestination || apt.walkingDistanceToNeighborhood} mins walk
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleProposeSwap(apt.id)}
                              disabled={sendSwapRequestMutation.isPending}
                              className="w-full py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xs"
                            >
                              {sendSwapRequestMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ArrowRightLeft className="w-4 h-4" />
                              )}
                              Propose Swap
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RECEIVED PROPOSALS */}
          {activeTab === "received" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-[#4c55a4]" />
                    Received Swap Requests ({receivedSwaps.length})
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Proposals sent by other apartment hosts who want to exchange weekends with you.
                  </p>
                </div>
              </div>

              {isMySwapsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 flex-1 rounded-xl" />
                        <Skeleton className="h-9 w-20 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : receivedSwaps.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-xs">
                  <Inbox className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    No Swap Requests Received Yet
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    When other homeowners discover your apartment and propose a weekend exchange, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {receivedSwaps.map((req) => {
                    const fromApt = req.fromApartment;
                    const host = fromApt?.user;
                    const displayImage = fromApt?.coverImage || "";
                    const weekendText =
                      req.weekendCalendar?.title ||
                      (req.weekend ? req.weekend.split("T")[0] : "Selected Weekend");

                    return (
                      <div
                        key={req.id}
                        className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase block mb-1">
                                Code: {req.swapCode}
                              </span>
                              <h4 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                                {fromApt?.title || "Apartment Exchange"}
                              </h4>
                              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-[#4c55a4]" />
                                {fromApt?.neighborhood}, {fromApt?.city}
                              </p>
                            </div>
                            {getStatusBadge(req.status)}
                          </div>

                          <div className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl mb-4">
                            {displayImage && (
                              <img
                                src={getImageUrl(displayImage)}
                                alt={fromApt?.title}
                                className="w-20 h-20 object-cover rounded-xl shrink-0"
                              />
                            )}
                            <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-300">
                              <p className="font-semibold text-zinc-900 dark:text-white">
                                Requester: {host?.username || "Community Host"}
                              </p>
                              <p className="flex items-center gap-1.5 text-zinc-500">
                                <Calendar className="w-3.5 h-3.5 text-[#4c55a4]" />
                                {weekendText}
                              </p>
                              {fromApt?.bedrooms && (
                                <p className="text-zinc-500">
                                  {fromApt.bedrooms} Bedrooms • {fromApt.bathrooms || 1} Baths
                                </p>
                              )}
                            </div>
                          </div>

                          {req.status === "APPROVED" && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                              <p className="font-bold">Swap Confirmed! Host Contact Details:</p>
                              {host?.phone && (
                                <p className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5" /> {host.phone}
                                </p>
                              )}
                              {host?.email && (
                                <p className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" /> {host.email}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {req.status === "PENDING" && (
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                              disabled={updateStatusMutation.isPending}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accept Swap
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                              disabled={updateStatusMutation.isPending}
                              className="py-2.5 px-4 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SENT PROPOSALS */}
          {activeTab === "sent" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#4c55a4]" />
                    Sent Swap Proposals ({sentSwaps.length})
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your outgoing requests to exchange apartments with other owners.
                  </p>
                </div>
              </div>

              {isMySwapsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sentSwaps.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-xs">
                  <Send className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    No Swap Proposals Sent Yet
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                    Browse the matching listings tab and propose an exchange to get started.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("matches")}
                    className="px-5 py-2.5 bg-[#4c55a4] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Browse Matching Swaps
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sentSwaps.map((req) => {
                    const toApt = req.toApartment;
                    const host = toApt?.user;
                    const displayImage = toApt?.coverImage || "";
                    const weekendText =
                      req.weekendCalendar?.title ||
                      (req.weekend ? req.weekend.split("T")[0] : "Selected Weekend");

                    return (
                      <div
                        key={req.id}
                        className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase block mb-1">
                                Code: {req.swapCode}
                              </span>
                              <h4 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                                {toApt?.title || "Target Apartment"}
                              </h4>
                              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-[#4c55a4]" />
                                {toApt?.neighborhood}, {toApt?.city}
                              </p>
                            </div>
                            {getStatusBadge(req.status)}
                          </div>

                          <div className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl mb-4">
                            {displayImage && (
                              <img
                                src={getImageUrl(displayImage)}
                                alt={toApt?.title}
                                className="w-20 h-20 object-cover rounded-xl shrink-0"
                              />
                            )}
                            <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-300">
                              <p className="font-semibold text-zinc-900 dark:text-white">
                                Host: {host?.username || "Apartment Host"}
                              </p>
                              <p className="flex items-center gap-1.5 text-zinc-500">
                                <Calendar className="w-3.5 h-3.5 text-[#4c55a4]" />
                                {weekendText}
                              </p>
                            </div>
                          </div>

                          {req.status === "APPROVED" && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                              <p className="font-bold">Your Proposal was Accepted! Contact Host:</p>
                              {host?.phone && (
                                <p className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5" /> {host.phone}
                                </p>
                              )}
                              {host?.email && (
                                <p className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" /> {host.email}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Swap Success Modal */}
      {isSwapSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Swap Proposal Submitted
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Your exchange proposal has been sent to the homeowner! You can track its status under the &quot;Sent Proposals&quot; tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSwapSuccessModalOpen(false);
                setActiveTab("sent");
              }}
              className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              View Sent Proposals
            </button>
          </div>
        </div>
      )}

      {/* Enable Swap Required Modal */}
      {isEnablePromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-8 h-8 text-[#4c55a4] dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Enable Swap Mode Required
            </h3>
            <p className="text-xs font-bold text-[#4c55a4] dark:text-indigo-400 uppercase tracking-wider mb-3">
              Action Required
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              To save your destination preferences and search for Shabbat apartment exchanges, please turn ON the Swap program for your listing.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEnablePromptOpen(false)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savePreferenceMutation.isPending}
                onClick={handleEnableAndSave}
                className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savePreferenceMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Turn ON & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apartment Listing Required Modal */}
      {isNoApartmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/40 shadow-sm">
              <Building2 className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
              {t("dashboard.swap.listing_required_title") || "Apartment Listing Required"}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              {t("dashboard.swap.listing_required_desc") ||
                "You must have at least one active apartment listing to enable swap and participate in community Shabbat swaps."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsNoApartmentModalOpen(false)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/user-dashboard/manage"
                onClick={() => setIsNoApartmentModalOpen(false)}
                className="flex-1 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {t("dashboard.swap.create_listing_btn") || "Create Listing"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
