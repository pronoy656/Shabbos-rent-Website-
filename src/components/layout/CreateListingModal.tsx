"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Info, MapPin, Phone, Building, Sparkles, Image as ImageIcon, 
  UploadCloud, AlignLeft, Check, Plus, X, Search, DollarSign, ChevronDown, PartyPopper, Star, Clock, Wand2, Calendar, CheckCircle2, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PhoneInput } from '@/components/common/PhoneInput';
import GooglePlacesAutocomplete, { PlaceSuggestion } from "@/components/common/GooglePlacesAutocomplete";
import { toast } from "sonner";
import { useCreateApartment, useUpdateApartment } from "@/hooks/useApartments";
import { getImageUrl } from "@/utils/imageUrl";
import { getCoordinatesForAddress } from "@/utils/distanceUtils";

const PROPERTY_TYPES = [
  "Apartment",
  "Penthouse",
  "Villa",
  "Duplex",
  "Triplex",
  "Studio",
  "Cottage",
  "Garden Apartment",
  "Roof Apartment",
  "Guest Suite / Zimmer",
  "Townhouse",
  "Private House",
  "Boutique Suite",
  "Loft",
  "Basement Unit",
  "Hotel Suite",
  "Cabin / Chalet",
  "Vacation Home",
];

const RENT_FREQUENCY_OPTIONS = [
  { value: "1", label: "1 time a year" },
  { value: "2", label: "2 times a year" },
  { value: "3", label: "3 times a year" },
  { value: "4-5", label: "4 - 5 times a year" },
  { value: "6-8", label: "6 - 8 times a year" },
  { value: "9-12", label: "9 - 12 times a year (Monthly)" },
  { value: "more-than-12", label: "More than 12 times a year (Year-round)" },
];

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (apartmentId: string) => void;
  isEditMode?: boolean;
  initialApartment?: any;
}

export default function CreateListingModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isEditMode,
  initialApartment 
}: CreateListingModalProps) {
  const router = useRouter();
  
  // API Mutations
  const createMutation = useCreateApartment();
  const updateMutation = useUpdateApartment();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Information & Address state
  const [listingTitle, setListingTitle] = useState(isEditMode ? "Bright luxury apartment in city center" : "");
  const [city, setCity] = useState(isEditMode ? "Jerusalem" : "");
  const [neighborhood, setNeighborhood] = useState(isEditMode ? "City Center" : "");
  const [streetAddress, setStreetAddress] = useState(isEditMode ? "King George St 15" : "");
  const [isAddressVerified, setIsAddressVerified] = useState<boolean>(!!isEditMode);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    isEditMode ? { lat: 31.7810, lng: 35.2200 } : null
  );
  
  // Specifications state
  const [propertyType, setPropertyType] = useState("Apartment");
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const [bedrooms, setBedrooms] = useState(isEditMode ? "4" : "");
  const [bathrooms, setBathrooms] = useState(isEditMode ? "2" : "");
  const [maxGuests, setMaxGuests] = useState(isEditMode ? "8" : "");
  const [price, setPrice] = useState(isEditMode ? "1500" : "");
  const [yomTovPrice, setYomTovPrice] = useState(isEditMode ? "1800" : "");
  const [specialShabbatPrice, setSpecialShabbatPrice] = useState(isEditMode ? "2000" : "");

  const [phones, setPhones] = useState<string[]>([""]);
  const [email, setEmail] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [acceptRequestsWhenUnavailable, setAcceptRequestsWhenUnavailable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const [modalStep, setModalStep] = useState<"form" | "success" | "payment" | "approval">("form");
  const [isFirstYearFreeActive, setIsFirstYearFreeActive] = useState(false);
  const [description, setDescription] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [rentFrequency, setRentFrequency] = useState("");
  const [isRentFrequencyOpen, setIsRentFrequencyOpen] = useState(false);
  const rentFrequencyRef = useRef<HTMLDivElement>(null);
  const [hasAnsweredRentFrequency, setHasAnsweredRentFrequency] = useState(false);
  
  const coverImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Click outside listener for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(e.target as Node)) {
        setIsPropertyTypeOpen(false);
      }
      if (rentFrequencyRef.current && !rentFrequencyRef.current.contains(e.target as Node)) {
        setIsRentFrequencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsFirstYearFreeActive(localStorage.getItem("isFirstYearFreeActive") === "true");
      setHasAnsweredRentFrequency(localStorage.getItem("hasAnsweredRentFrequency") === "true");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && (isEditMode || initialApartment)) {
      setListingTitle(initialApartment?.title || (isEditMode ? "Bright luxury apartment in city center" : ""));
      setCity(initialApartment?.city || (isEditMode ? "Jerusalem" : ""));
      setNeighborhood(initialApartment?.neighborhood || (isEditMode ? "City Center" : ""));
      setStreetAddress(initialApartment?.street1 || (isEditMode ? "King George St 15" : ""));
      setIsAddressVerified(true);
      setCoordinates(
        initialApartment?.lat && initialApartment?.lng
          ? { lat: Number(initialApartment.lat), lng: Number(initialApartment.lng) }
          : { lat: 31.7810, lng: 35.2200 }
      );
      setPropertyType(initialApartment?.propertyType || "Apartment");
      setBedrooms(String(initialApartment?.bedrooms || "4"));
      setBathrooms(String(initialApartment?.bathrooms || "2"));
      setMaxGuests(String(initialApartment?.maxGuest || "8"));
      setPrice(String(initialApartment?.pricePerShabbat || "1500"));
      setYomTovPrice(String(initialApartment?.yomTovPrice || "1800"));
      setSpecialShabbatPrice(String(initialApartment?.specialShabbatPrice || "2000"));
      setAmenities(initialApartment?.amenities || ["Fast High-Speed WiFi", "Kosher Kitchen", "Panoramic View"]);
      setPhoneEnabled(initialApartment?.phone !== false);
      setWhatsappEnabled(initialApartment?.whatsapp === true);
      setEmailEnabled(initialApartment?.email === true);
      setIsAvailable(initialApartment?.unavailable !== true);
      setAcceptRequestsWhenUnavailable(initialApartment?.receiveRequestWhenUnavailable === true);
      setIsActive(initialApartment?.isActive !== false);
      setDescription(initialApartment?.description || "");
      if (initialApartment?.coverImage) {
        setCoverImagePreview(initialApartment.coverImage);
      } else if (isEditMode) {
        setCoverImagePreview("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800");
      }
      if (initialApartment?.images && Array.isArray(initialApartment.images)) {
        setGalleryPreviews(initialApartment.images);
      } else if (isEditMode) {
        setGalleryPreviews([
          "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
        ]);
      }
    } else if (isOpen && !isEditMode && !initialApartment) {
      setListingTitle("");
      setCity("");
      setNeighborhood("");
      setStreetAddress("");
      setIsAddressVerified(false);
      setCoordinates(null);
      setPropertyType("Apartment");
      setBedrooms("");
      setBathrooms("");
      setMaxGuests("");
      setPrice("");
      setYomTovPrice("");
      setSpecialShabbatPrice("");
      setAmenities([]);
      setPhoneEnabled(true);
      setWhatsappEnabled(false);
      setEmailEnabled(false);
      setIsAvailable(true);
      setAcceptRequestsWhenUnavailable(false);
      setIsActive(true);
      setCoverImageFile(null);
      setCoverImagePreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
    }
  }, [isOpen, isEditMode, initialApartment]);

  const handleAddAmenity = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
        setAmenities([...amenities, amenityInput.trim()]);
        setAmenityInput("");
      }
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files].slice(0, 4));
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setGalleryPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    }
  };

  const handleRemoveAmenity = (item: string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleSaveAndContinue = async () => {
    if (!listingTitle.trim()) {
      toast.error("Please enter a listing title.");
      return;
    }
    if (!city.trim()) {
      toast.error("Please enter or select a city.");
      return;
    }
    if (!streetAddress.trim()) {
      toast.error("Please enter a street address.");
      return;
    }

    // Ensure valid coordinates (from Google Places or calculated fallback)
    let finalCoords = coordinates;
    if (!finalCoords || !finalCoords.lat || !finalCoords.lng) {
      finalCoords = getCoordinatesForAddress(`${streetAddress} ${neighborhood ? neighborhood + " " : ""}${city}`);
    }

    if (!propertyType) {
      toast.error("Please select a property type.");
      return;
    }
    if (!bedrooms.trim()) {
      toast.error("Please enter the number of bedrooms.");
      return;
    }
    if (!bathrooms.trim()) {
      toast.error("Please enter the number of bathrooms.");
      return;
    }
    if (!maxGuests.trim()) {
      toast.error("Please enter max guests.");
      return;
    }
    if (!price.trim()) {
      toast.error("Please enter price per Shabbat.");
      return;
    }

    const formData = new FormData();
    formData.append("title", listingTitle.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("city", city.trim());
    formData.append("neighborhood", neighborhood.trim() || city.trim());
    formData.append("street1", streetAddress.trim());
    if (finalCoords?.lat) formData.append("lat", String(finalCoords.lat));
    if (finalCoords?.lng) formData.append("lng", String(finalCoords.lng));
    formData.append("propertyType", propertyType.toUpperCase().replace(/\s+/g, "_"));
    formData.append("bedrooms", String(parseInt(bedrooms, 10) || 1));
    formData.append("bathrooms", String(parseInt(bathrooms, 10) || 1));
    formData.append("maxGuest", String(parseInt(maxGuests, 10) || 1));
    formData.append("pricePerShabbat", String(parseFloat(price) || 0));

    if (amenities.length > 0) {
      amenities.forEach((amenity) => {
        formData.append("amenities[]", amenity);
      });
    }

    const mainPhone = phones.find((p) => p.trim()) || "";
    if (mainPhone) formData.append("phoneNumber", mainPhone);
    if (whatsappEnabled && mainPhone) formData.append("whatsApp", mainPhone);

    formData.append("phone", String(phoneEnabled));
    formData.append("whatsapp", String(whatsappEnabled));
    formData.append("email", String(emailEnabled));
    formData.append("unavailable", String(!isAvailable));
    formData.append("receiveRequestWhenUnavailable", String(!isAvailable && acceptRequestsWhenUnavailable));
    formData.append("isActive", String(isActive));

    if (coverImageFile) {
      formData.append("coverImage", coverImageFile);
    }
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (!hasAnsweredRentFrequency && rentFrequency) {
      localStorage.setItem("hasAnsweredRentFrequency", "true");
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && initialApartment?.id) {
        const res = await updateMutation.mutateAsync({
          id: initialApartment.id,
          formData,
        });
        toast.success("Apartment listing updated successfully! 🎉");
        if (onSave) onSave(res?.id || initialApartment.id);
        setModalStep("success");
      } else {
        const res = await createMutation.mutateAsync(formData);
        toast.success("Apartment listing created successfully! 🎉");
        if (onSave) onSave(res?.id || "");
        setModalStep("success");
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to save apartment listing.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnhanceDescription = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setDescription(description + (description ? " " : "") + "This beautiful apartment is perfectly located, featuring a stunning view and all the amenities needed for a comfortable Shabbat, including a Shabbat platter and close proximity to the synagogue.");
      setIsEnhancing(false);
    }, 1500);
  };

  const handleFinalClose = () => {
    if (onSave) onSave("");
    onClose();
    setTimeout(() => setModalStep("form"), 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setModalStep("form"), 300);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white dark:bg-[#121212] rounded-3xl shadow-2xl w-full ${modalStep !== "form" ? 'max-w-3xl' : 'max-w-5xl'} max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300 relative transition-all`}>
        {modalStep === "success" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300 bg-white dark:bg-[#121212] overflow-hidden relative">
            
            {/* Colorful Animated Background Elements (Balloons/Confetti Vibe) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-10 left-[10%] w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"></div>
              <div className="absolute top-[20%] right-[10%] w-40 h-40 bg-blue-400/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[10%] left-[20%] w-36 h-36 bg-amber-400/30 rounded-full blur-2xl"></div>
              <div className="absolute top-[50%] left-[5%] w-24 h-24 bg-purple-400/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[20%] right-[20%] w-32 h-32 bg-emerald-400/30 rounded-full blur-2xl"></div>
              <div className="absolute top-[10%] left-[40%] w-28 h-28 bg-rose-400/30 rounded-full blur-2xl"></div>
              <div className="absolute top-[40%] right-[30%] w-20 h-20 bg-indigo-400/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[40%] left-[35%] w-28 h-28 bg-yellow-400/30 rounded-full blur-2xl"></div>
              
              {/* Floating Icons */}
              <PartyPopper className="absolute top-[15%] left-[20%] w-8 h-8 text-pink-500 opacity-60" />
              <Star className="absolute top-[25%] right-[25%] w-6 h-6 text-amber-400 opacity-60" />
              <Sparkles className="absolute bottom-[30%] right-[15%] w-7 h-7 text-blue-500 opacity-60" />
              <Star className="absolute bottom-[20%] left-[15%] w-5 h-5 text-emerald-400 opacity-60" />
              <PartyPopper className="absolute top-[60%] right-[8%] w-6 h-6 text-indigo-500 opacity-50" />
              <Sparkles className="absolute top-[45%] left-[12%] w-5 h-5 text-rose-500 opacity-50" />
            </div>

            <div className="max-w-2xl mx-auto flex flex-col items-center w-full relative z-10">
              <div className="relative mb-8 mt-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 relative z-10">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-green-500/20 rounded-full"></div>
              </div>
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4c55a4] via-purple-500 to-pink-500 mb-4 drop-shadow-sm leading-tight">
                Woohoo! Apartment<br/>Submitted Successfully!
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-lg mb-8 font-medium">
                Thank you for adding your amazing apartment to Shabos Rent. Get ready to welcome some guests!
              </p>
              <button 
                onClick={() => setModalStep("payment")}
                className="w-full sm:w-auto px-16 py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-[16px] font-bold rounded-full shadow-lg transition-colors"
              >
                OK, Awesome!
              </button>
            </div>
          </div>
        ) : modalStep === "payment" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300 bg-white dark:bg-[#121212] relative overflow-hidden">
            <div className="mb-8 mt-4 relative">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 relative z-10">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Yearly Subscription Fee
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-lg mb-8 font-medium">
              Activate your listing for a full year and start receiving guest inquiries.
            </p>
            
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm mb-10 text-left shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Shabos Rent Yearly</span>
                {isFirstYearFreeActive ? (
                  <div className="flex flex-col items-end">
                    <span className="font-black text-2xl text-green-600 dark:text-green-500">Free</span>
                    <span className="text-xs text-zinc-500 line-through">₪28</span>
                  </div>
                ) : (
                  <span className="font-black text-2xl text-[#4c55a4] dark:text-indigo-400">₪28</span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[15px] font-medium text-zinc-600 dark:text-zinc-400">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                  </div>
                  Unlimited inquiries
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-zinc-600 dark:text-zinc-400">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                  </div>
                  Instant visibility
                </div>
              </div>
            </div>

            <button 
              onClick={() => setModalStep("approval")}
              className="w-full max-w-sm px-8 py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-[16px] font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              {isFirstYearFreeActive ? "Get First Year Free" : "Pay ₪28 Now"}
            </button>
          </div>
        ) : modalStep === "approval" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300 bg-white dark:bg-[#121212] relative overflow-hidden">
            <div className="mb-8 mt-4 relative">
              <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 relative z-10">
                <Info className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Pending Admin Approval
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-lg mb-8 font-medium">
              We are verifying your pictures to ensure quality and safety. This will take some time. Please wait for the admin approval to complete.
            </p>
            
            <button 
              onClick={() => {
                handleFinalClose();
                router.push("/user-dashboard/manage");
              }}
              className="w-full sm:w-auto px-12 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-[16px] font-bold rounded-full transition-colors shadow-sm cursor-pointer"
            >
              OK, Go to Dashboard
            </button>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#121212] sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              List Your Apartment
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-36 bg-zinc-50 dark:bg-zinc-950/30">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              
              {/* Basic Information */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none relative z-30">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4c55a4]/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-[#4c55a4]" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Basic Information</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                      Listing Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={listingTitle}
                      onChange={(e) => setListingTitle(e.target.value)}
                      placeholder="e.g.: Bright luxury apartment in city center" 
                      className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] outline-none transition-all duration-200" 
                    />
                  </div>
                  
                  {/* Google Places Autocomplete: City + Street & Number + Coordinates Lock */}
                  <GooglePlacesAutocomplete
                    streetAddress={streetAddress}
                    city={city}
                    neighborhood={neighborhood}
                    isAddressVerified={isAddressVerified}
                    coordinates={coordinates}
                    onAddressSelect={(place: PlaceSuggestion) => {
                      setStreetAddress(place.mainText);
                      setCity(place.city);
                      setNeighborhood(place.neighborhood);
                      setIsAddressVerified(true);
                      setCoordinates({ lat: place.lat, lng: place.lng });
                    }}
                    onAddressChange={(val: string) => {
                      setStreetAddress(val);
                      setIsAddressVerified(false);
                      setCoordinates(null);
                    }}
                    onCityChange={(c: string) => setCity(c)}
                    onNeighborhoodChange={(n: string) => setNeighborhood(n)}
                  />
                </div>
              </div>

              {/* Property Specifications */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none relative z-20">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Property Specifications</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Structured Property Type Dropdown */}
                    <div ref={propertyTypeRef} className="relative">
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Property Type <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
                        className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] font-medium text-zinc-900 dark:text-white flex items-center justify-between outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Building className="w-4 h-4 text-blue-500 shrink-0" />
                          {propertyType || "Select Property Type"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isPropertyTypeOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isPropertyTypeOpen && (
                        <div className="absolute top-full left-0 right-0 sm:w-[280px] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[150] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                            Select Property Type
                          </div>
                          <div className="p-1.5 max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {PROPERTY_TYPES.map((pt) => (
                              <button
                                type="button"
                                key={pt}
                                onClick={() => {
                                  setPropertyType(pt);
                                  setIsPropertyTypeOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-sm ${
                                  propertyType === pt
                                    ? "bg-[#4c55a4]/10 dark:bg-indigo-900/30 text-[#4c55a4] dark:text-indigo-400 font-bold"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
                                }`}
                              >
                                <span>{pt}</span>
                                {propertyType === pt && <Check className="w-4 h-4 text-[#4c55a4] shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Bedrooms <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        placeholder="e.g. 4" 
                        className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Bathrooms <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        placeholder="e.g. 2" 
                        className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Max Guests <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(e.target.value)}
                        placeholder="e.g. 8" 
                        className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 truncate" title="Price per Shabbat (₪)">
                        Price per Shabbat (₪) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input 
                          type="number" 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 1500" 
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 truncate" title="Yom Tov / Chagim Price (₪)">
                        Yom Tov / Chagim (₪)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input 
                          type="number" 
                          value={yomTovPrice}
                          onChange={(e) => setYomTovPrice(e.target.value)}
                          placeholder="e.g. 1800" 
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 truncate" title="Special Shabbos Default Price (₪)">
                        Special Shabbos (₪)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input 
                          type="number" 
                          value={specialShabbatPrice}
                          onChange={(e) => setSpecialShabbatPrice(e.target.value)}
                          placeholder="e.g. 2000" 
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">What this place offers <span className="text-red-500">*</span></h2>
                  <p className="text-sm text-zinc-500 mt-1">Specific amenities help guests find your property easily and set clear expectations.</p>
                </div>
                
                <label className="block text-xs font-black text-zinc-400 mb-2 uppercase tracking-wider">Quick Select Amenities</label>
                <div className="flex flex-wrap gap-2 mb-6 max-h-56 overflow-y-auto pr-1">
                  {[
                    "WiFi", "Air Conditioning", "Parking", "Washing Machine", 
                    "Kosher Kitchen", "Shabbos Elevator", "Shabbos Plata", "Hot Water Urn", 
                    "Shabbos Clock", "Balcony", "Sukkah Balcony", "Private Garden", 
                    "Baby Crib", "Wheelchair Accessible", "Sea View", "Swimming Pool", 
                    "Towels & Linen", "Coffee Machine"
                  ].map((preset) => {
                    const isSelected = amenities.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveAmenity(preset);
                          } else {
                            setAmenities(prev => [...prev, preset]);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-[#4c55a4] text-white border-[#4c55a4] shadow-sm"
                            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#4c55a4]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}{preset}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-xs font-black text-zinc-400 mb-2 uppercase tracking-wider">Add Custom Amenity</label>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <input 
                    type="text" 
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={handleAddAmenity}
                    placeholder="Type an amenity (e.g. Swimming Pool) and press Enter" 
                    className="flex-1 px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] outline-none transition-all duration-200" 
                  />
                  <button 
                    onClick={handleAddAmenity}
                    className="px-6 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-[#4c55a4]/20"
                  >
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">Included Amenities ({amenities.length})</h3>
                  {amenities.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 py-1 font-medium">
                      <Info className="w-4 h-4" />
                      No selected amenities
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-4 py-2 bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 text-[#4c55a4] dark:text-indigo-300 rounded-xl text-sm font-bold border border-[#4c55a4]/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          {item}
                          <button onClick={() => handleRemoveAmenity(item)} className="ml-1 text-[#4c55a4]/60 hover:text-[#4c55a4] dark:hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Apartment Cover Image</h2>
                    <p className="text-sm text-zinc-500 mt-1">This image appears first on the listing card</p>
                  </div>
                </div>
                <button 
                  onClick={() => coverImageRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#4c55a4] dark:hover:border-indigo-400 rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-all group bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 relative"
                  style={{ minHeight: '240px' }}
                >
                  <input type="file" ref={coverImageRef} accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                  {coverImagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={getImageUrl(coverImagePreview)} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <span className="font-bold">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-16 flex flex-col items-center justify-center gap-4 w-full h-full">
                      <div className="w-16 h-16 bg-white dark:bg-zinc-800 shadow-sm rounded-full flex items-center justify-center text-[#4c55a4] group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-zinc-900 dark:text-white text-lg">Click to add cover image</p>
                        <p className="text-sm text-zinc-500 mt-1">Recommended: wide landscape photo, high quality</p>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Additional photo gallery */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Additional Photo Gallery</h2>
                    <p className="text-sm text-zinc-500 mt-1">Showcase the kitchen, bedrooms, and common areas</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => {
                    const preview = galleryPreviews[index];
                    return (
                      <button 
                        key={index} 
                        onClick={() => galleryRef.current?.click()}
                        className="aspect-square relative overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#4c55a4] dark:hover:border-indigo-400 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        {preview ? (
                          <>
                            <img src={getImageUrl(preview)} alt={`Gallery ${index}`} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                              <span className="text-xs font-bold">Change</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-white dark:bg-zinc-800 shadow-sm rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                              <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500">Add Photo</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                  <input type="file" multiple ref={galleryRef} accept="image/*" className="hidden" onChange={handleGalleryChange} />
                </div>
              </div>

              {/* Contact Details & Specs */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Contact Details & Specs</h2>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {phones.map((phoneVal, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-1">
                          <PhoneInput
                            label={index === 0 ? "1.2 Number *" : "Additional Number"}
                            required={index === 0}
                            value={phoneVal}
                            onChange={(val) => {
                              const newPhones = [...phones];
                              newPhones[index] = val;
                              setPhones(newPhones);
                            }}
                          />
                        </div>
                        {phones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newPhones = [...phones];
                              newPhones.splice(index, 1);
                              setPhones(newPhones);
                            }}
                            className="mt-7 w-11 h-11 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-500 flex items-center justify-center transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setPhones([...phones, ""])}
                      className="text-sm font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add another number
                    </button>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                      more then one number gives you flexibility to manage your apartment with more then 1 phone ... or you can set then when a renter calls you it rings both phones...
                    </p>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <MessageSquareIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">How do you want renters to contact you?</h2>
                </div>
                <div className="p-8 space-y-6">
                  {/* Phone */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Phone</p>
                      <p className="text-sm text-zinc-500">Renters can call your provided phone number</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setPhoneEnabled(!phoneEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${phoneEnabled ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${phoneEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {/* WhatsApp */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">WhatsApp</p>
                      <p className="text-sm text-zinc-500">Allow renters to message you on WhatsApp</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${whatsappEnabled ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${whatsappEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Email</p>
                        <p className="text-sm text-zinc-500">Allow renters to contact you via email</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setEmailEnabled(!emailEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${emailEnabled ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    {emailEnabled && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-200 pt-2">
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="owner@example.com" 
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Settings */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-rose-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Availability Settings</h2>
                </div>
                <div className="p-8 space-y-6">
                  {/* Mark as Available/Unavailable */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Listing Availability</p>
                      <p className="text-sm text-zinc-500">Is your apartment currently available for rent?</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${isAvailable ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Accept Requests when Unavailable */}
                  {!isAvailable && (
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Accept Requests When Unavailable</p>
                        <p className="text-sm text-zinc-500">Allow renters to send requests even when unavailable</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setAcceptRequestsWhenUnavailable(!acceptRequestsWhenUnavailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${acceptRequestsWhenUnavailable ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${acceptRequestsWhenUnavailable ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  )}

                  {/* Active / Inactive Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Active Listing</p>
                      <p className="text-sm text-zinc-500">Uncheck this to completely hide the listing from search results.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${isActive ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional details */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <AlignLeft className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Additional Details</h2>
                </div>
                <div className="p-8 space-y-5">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Write a few words to help people understand what's in the apartment and what makes it special.<br/>
                    For example: <span className="text-purple-500 font-medium">nice view, Shabbat platter, baby crib, close to synagogue.</span>
                  </p>
                  <div>
                    <textarea 
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write some details about the apartment here..."
                      className="w-full px-5 py-4 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all duration-200 resize-none"
                    ></textarea>
                    
                    <button 
                      type="button"
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancing}
                      className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70"
                    >
                      {isEnhancing ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                         <Wand2 className="w-5 h-5" />
                      )}
                      {isEnhancing ? "Enhancing..." : "Enhance description with AI"}
                    </button>
                  </div>
                </div>
              </div>

              {/* One-time Question */}
              {!hasAnsweredRentFrequency && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none mt-6 relative z-30">
                  <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 rounded-t-3xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Quick Question</h2>
                  </div>
                  <div className="p-8 space-y-4">
                    <label className="block text-sm font-bold text-zinc-900 dark:text-white">
                      How many times will you rent out your apartment a year?
                    </label>
                    <div ref={rentFrequencyRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsRentFrequencyOpen(!isRentFrequencyOpen)}
                        className="w-full px-5 py-4 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 flex justify-between items-center text-left cursor-pointer"
                      >
                        <span className="font-medium">
                          {RENT_FREQUENCY_OPTIONS.find((opt) => opt.value === rentFrequency)?.label || (
                            <span className="text-zinc-400">Select rental frequency</span>
                          )}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${isRentFrequencyOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isRentFrequencyOpen && (
                        <div className="absolute top-full mt-2 left-0 right-0 sm:w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[150] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                            Select Rental Frequency
                          </div>
                          <div className="p-2 max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {RENT_FREQUENCY_OPTIONS.map((opt) => (
                              <button
                                type="button"
                                key={opt.value}
                                onClick={() => {
                                  setRentFrequency(opt.value);
                                  setIsRentFrequencyOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-sm ${
                                  rentFrequency === opt.value
                                    ? "bg-[#4c55a4]/10 dark:bg-indigo-900/30 text-[#4c55a4] dark:text-indigo-400 font-bold"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
                                }`}
                              >
                                <span>{opt.label}</span>
                                {rentFrequency === opt.value && <Check className="w-4 h-4 text-[#4c55a4] shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:px-8 md:py-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] mt-auto">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button onClick={handleClose} className="px-6 py-3 text-[15px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
              Cancel
            </button>
            
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveAndContinue}
              className="px-8 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-[#4c55a4]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : isEditMode ? (
                "Update Listing"
              ) : (
                "Submit Listing"
              )}
            </button>
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}

function MessageSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
