"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Info, MapPin, Phone, Building, Sparkles, Image as ImageIcon, 
  UploadCloud, AlignLeft, Check, Plus, X, Search, DollarSign, ChevronDown, PartyPopper, Star
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (date: string) => void;
  isEditMode?: boolean;
}

export default function CreateListingModal({ isOpen, onClose, onSave, isEditMode }: CreateListingModalProps) {
  const router = useRouter();
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [modalStep, setModalStep] = useState<"form" | "success" | "payment" | "approval">("form");
  const coverImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && isEditMode) {
      setAmenities(["Fast High-Speed WiFi", "Kosher Kitchen", "Panoramic View"]);
      setWhatsappEnabled(true);
      setEmailEnabled(true);
      setCoverImagePreview("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800");
      setGalleryPreviews([
        "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
      ]);
    } else if (isOpen && !isEditMode) {
      setAmenities([]);
      setWhatsappEnabled(false);
      setEmailEnabled(false);
      setCoverImagePreview(null);
      setGalleryPreviews([]);
    }
  }, [isOpen, isEditMode]);

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
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setGalleryPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    }
  };

  const handleRemoveAmenity = (item: string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleSaveAndContinue = () => {
    setModalStep("success");
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
                Awesome, I'm Done!
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
                <span className="font-black text-2xl text-[#4c55a4] dark:text-indigo-400">₪28</span>
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
              Pay ₪28 Now
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
                router.push("/user-dashboard");
              }}
              className="w-full sm:w-auto px-12 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-[16px] font-bold rounded-full transition-colors shadow-sm"
            >
              Go to Dashboard
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
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-50 dark:bg-zinc-950/30">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              
              {/* Basic Information */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4c55a4]/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-[#4c55a4]" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Basic Information</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Listing Title <span className="text-red-500">*</span></label>
                    <input defaultValue={isEditMode ? "Bright luxury apartment in city center" : ""} type="text" placeholder="e.g.: Bright luxury apartment in city center" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] outline-none transition-all duration-200" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">City <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input defaultValue={isEditMode ? "Jerusalem" : ""} type="text" placeholder="Type city name..." className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] outline-none transition-all duration-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Neighborhood <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input defaultValue={isEditMode ? "City Center" : ""} type="text" placeholder="Select a city first..." disabled={!isEditMode} className="w-full pl-12 pr-4 py-3.5 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white outline-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Street & Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                      <input defaultValue={isEditMode ? "King George St 15" : ""} type="text" placeholder="Street and house number" className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] outline-none transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Specifications */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none">
                <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Property Specifications</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Property Type</label>
                      <input defaultValue={isEditMode ? "Apartment" : ""} type="text" placeholder="e.g. Villa, Duplex" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Bedrooms <span className="text-red-500">*</span></label>
                      <input defaultValue={isEditMode ? "4" : ""} type="text" placeholder="e.g. 4" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Bathrooms</label>
                      <input defaultValue={isEditMode ? "2" : ""} type="text" placeholder="e.g. 2" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Max Guests <span className="text-red-500">*</span></label>
                      <input defaultValue={isEditMode ? "8" : ""} type="text" placeholder="e.g. 8" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Price per Shabbat (₪) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
                        <input defaultValue={isEditMode ? "1500" : ""} type="text" placeholder="e.g. 1500" className="w-full pl-12 pr-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200" />
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
                      <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
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
                            <img src={preview} alt={`Gallery ${index}`} className="absolute inset-0 w-full h-full object-cover" />
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
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" defaultValue={isEditMode ? "+972 50 123 4567" : ""} placeholder="+972 XX XXX XXXX" className="w-full px-4 py-3.5 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-200" />
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
                  {/* Phone (Always on) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Phone</p>
                      <p className="text-sm text-zinc-500">Renters can call your provided phone number</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#4c55a4] transition-colors opacity-50 cursor-not-allowed">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </div>
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

                  {/* Available */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Available</p>
                      <p className="text-sm text-zinc-500">Show renters you are currently available</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setEmailEnabled(!emailEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c55a4] ${emailEnabled ? 'bg-[#4c55a4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
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
                  <textarea 
                    rows={5}
                    placeholder="Write some details about the apartment here..."
                    className="w-full px-5 py-4 bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all duration-200 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:px-8 md:py-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] mt-auto">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button onClick={handleClose} className="px-6 py-3 text-[15px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
              Cancel
            </button>
            
            <button 
              onClick={handleSaveAndContinue}
              className="px-8 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-[#4c55a4]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Submit Listing
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
