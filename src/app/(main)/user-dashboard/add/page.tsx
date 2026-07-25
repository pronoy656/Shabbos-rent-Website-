"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Info, MapPin, Phone, Building, Sparkles, Image as ImageIcon, 
  UploadCloud, AlignLeft, Check, Plus, X, Search 
} from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";

export default function AddApartmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState([
    "WiFi", "Private Heated Pool", "Kosher Kitchen", "Parking", "Washing Machine"
  ]);

  const handleAddAmenity = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
        setAmenities([...amenities, amenityInput.trim()]);
        setAmenityInput("");
      }
    }
  };

  const handleRemoveAmenity = (item: string) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleSaveAndContinue = () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      // Mock save action
      localStorage.setItem("hasUserListing", "true");
      router.push("/user-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-24">
      <MainNavbar />
      
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#4c55a4] mb-2">
            List Your Apartment
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Share your beautiful home with our community of travelers and experience seamless property management.
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Information */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Basic Information</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Listing Title *</label>
                  <input type="text" placeholder="e.g.: Bright apartment in city center" className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">City *</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <input type="text" placeholder="Type city name..." className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Neighborhood *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <input type="text" placeholder="Select a city first..." disabled className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 cursor-not-allowed outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Street *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input type="text" placeholder="Street and house number" className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details & Specs */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Contact Details & Specs</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input type="text" placeholder="050-0000000" className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Format: +972501234567 or 0501234567</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Price per Shabbat/Holiday (₪) *</label>
                  <input type="number" placeholder="" className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* How do you want renters to contact you? */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm p-6">
              <div className="mb-4">
                <h2 className="font-bold text-zinc-900 dark:text-white">How do you want renters to contact you?</h2>
                <p className="text-xs text-zinc-500">This can always be managed in Settings</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <Phone className="w-4 h-4 text-zinc-500" /> Phone
                  </div>
                  <div className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Always on
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <MessageSquareIcon className="w-4 h-4 text-zinc-500" /> WhatsApp
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <Building className="w-4 h-4 text-zinc-500" /> Available
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Property Specifications */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Property Specifications</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Property Type</label>
                    <input type="text" placeholder="Suitable for families" className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Beds</label>
                    <input type="text" placeholder="Suitable for families" className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Bathrooms</label>
                    <input type="text" placeholder="Suitable for families" className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Fits how many guests</label>
                    <input type="text" placeholder="Type..." className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Start Date / Weekend</label>
                    <input type="text" placeholder="Select..." className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">End Date / Weekend</label>
                    <input type="text" placeholder="Select..." className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm p-6">
              <div className="mb-4">
                <h2 className="font-bold text-zinc-900 dark:text-white">What this place offers</h2>
                <p className="text-xs text-zinc-500">Adding specific amenities helps guests find your property more easily and sets clear expectations for their stay.</p>
              </div>
              
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Quick Select Amenities</label>
              <div className="flex flex-wrap gap-2 mb-4 max-h-56 overflow-y-auto pr-1">
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
                          setAmenities([...amenities, preset]);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-[#4c55a4] text-white border-[#4c55a4]"
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#4c55a4]"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}{preset}
                    </button>
                  );
                })}
              </div>

              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Add Custom Amenity</label>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={handleAddAmenity}
                  placeholder="Type an amenity and press Enter" 
                  className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all" 
                />
                <button 
                  onClick={handleAddAmenity}
                  className="px-4 py-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Added Amenities ({amenities.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800/30">
                      <Sparkles className="w-3 h-3" />
                      {item}
                      <button onClick={() => handleRemoveAmenity(item)} className="ml-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Cover Image */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="font-bold text-zinc-900 dark:text-white">Apartment cover image</h2>
                <p className="text-xs text-zinc-500">This image appears first on the listing card</p>
              </div>
              <button className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl p-12 flex flex-col items-center justify-center gap-3 transition-colors group bg-zinc-50 dark:bg-zinc-900/50">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-900 dark:text-white">Click to add cover image</p>
                  <p className="text-xs text-zinc-500 mt-1">Recommended: wide landscape photo, high quality</p>
                </div>
              </button>
            </div>

            {/* Additional photo gallery */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="font-bold text-zinc-900 dark:text-white">Additional photo gallery</h2>
                <p className="text-xs text-zinc-500">Showcase the kitchen, bedrooms, and common areas</p>
              </div>
              <button className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl p-12 flex flex-col items-center justify-center gap-3 transition-colors group bg-zinc-50 dark:bg-zinc-900/50">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-900 dark:text-white">Click to upload, drag files, or paste an image (Ctrl+V)</p>
                  <p className="text-xs text-zinc-500 mt-1">Upload up to 20 images. Minimum resolution: 1080p</p>
                </div>
              </button>
            </div>

            {/* Additional details */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 flex items-center gap-2">
                <AlignLeft className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-zinc-900 dark:text-white">Additional apartment details</h2>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <p className="text-xs text-zinc-500">
                  Write a few words to help people understand what's in the apartment and what makes it special.<br/>
                  For example: <span className="text-blue-500 italic">nice view, Shabbat platter, baby crib, close to synagogue.</span>
                </p>
                <textarea 
                  rows={4}
                  placeholder="Write some details about the apartment here..."
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4]/20 focus:border-[#4c55a4] outline-none transition-all resize-none"
                ></textarea>
                
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Enhance description with AI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-4 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            {step === 1 ? (
              <Link href="/user-dashboard" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Back to Dashboard
              </Link>
            ) : (
              <button onClick={() => setStep(1)} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1">
                &larr; Back to Basic Info
              </button>
            )}
            
            <button 
              onClick={handleSaveAndContinue}
              className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              Save and Continue
            </button>
          </div>
        </div>
      </main>
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
