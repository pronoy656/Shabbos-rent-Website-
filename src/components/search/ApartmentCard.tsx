import Link from "next/link";
import { MapPin, BedDouble, Bath, Users, ShieldCheck, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { ApartmentData } from "@/types";

export default function ApartmentCard({ apartment, mode }: { apartment: ApartmentData, mode?: "swap" | "rent" }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApartments = JSON.parse(localStorage.getItem("savedApartments") || "[]");
      setIsSaved(savedApartments.includes(apartment.id));
    }
  }, [apartment.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedApartments = JSON.parse(localStorage.getItem("savedApartments") || "[]");
    let newSaved;
    if (savedApartments.includes(apartment.id)) {
      newSaved = savedApartments.filter((id: string) => id !== apartment.id);
      setIsSaved(false);
    } else {
      newSaved = [...savedApartments, apartment.id];
      setIsSaved(true);
    }
    localStorage.setItem("savedApartments", JSON.stringify(newSaved));
    // Dispatch a custom event to notify other components if they are listening
    window.dispatchEvent(new Event("savedApartmentsChanged"));
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300">
      <Link href={`/apartments/${apartment.id}${mode === 'swap' ? '?mode=swap' : ''}`}>
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={apartment.image}
            alt={apartment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Left Badges */}
          {apartment.verified && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500/90 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1.5 text-xs font-bold text-white z-10">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </div>
          )}

          {/* Top Right Actions */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={toggleSave}
              className="p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform duration-200"
            >
              <Heart 
                className={`w-5 h-5 transition-colors duration-200 ${isSaved ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-300"}`} 
              />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                {apartment.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {apartment.location}
              </div>
            </div>
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-4 py-4 mt-2 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <BedDouble className="w-4 h-4 text-zinc-400" />
              {apartment.beds} Beds
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <Bath className="w-4 h-4 text-zinc-400" />
              {apartment.baths} Baths
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <Users className="w-4 h-4 text-zinc-400" />
              {apartment.guests} Guests
            </div>
          </div>

          {/* Footer (Price) */}
          <div className="flex items-end justify-between pt-4">
            <div>
              <span className="text-xl font-black text-zinc-900 dark:text-white">₪{apartment.price}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium"> / weekend</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
