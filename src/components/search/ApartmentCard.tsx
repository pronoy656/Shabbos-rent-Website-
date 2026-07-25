import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, BedDouble, Bath, Users, Heart, Footprints } from "lucide-react";
import { useState, useEffect } from "react";
import { ApartmentData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface ApartmentCardProps {
  apartment: ApartmentData;
  mode?: "swap" | "rent";
  walkingMinutes?: number;
  targetDestinationText?: string;
}

export default function ApartmentCard({
  apartment,
  mode,
  walkingMinutes,
  targetDestinationText,
}: ApartmentCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApartments = JSON.parse(localStorage.getItem("savedApartments") || "[]");
      setIsSaved(savedApartments.includes(apartment.id));
    }
  }, [apartment.id]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("userRole") !== null;
      if (!isLoggedIn) {
        e.preventDefault();
        const targetPath = `/apartments/${apartment.id}${mode === 'swap' ? '?mode=swap' : ''}`;
        router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
      }
    }
  };

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
      <Link href={`/apartments/${apartment.id}${mode === 'swap' ? '?mode=swap' : ''}`} onClick={handleCardClick}>
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={apartment.image}
            alt={apartment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
            {walkingMinutes !== undefined && walkingMinutes !== null && (
              <div className="px-2.5 py-1 bg-[#4c55a4]/95 backdrop-blur-md rounded-lg shadow-md flex items-center gap-1.5 text-xs font-bold text-white border border-white/20">
                <Footprints className="w-3.5 h-3.5" />
                <span>{walkingMinutes} min walk</span>
              </div>
            )}
            {apartment.isAvailable === false && (
              <div className="px-2.5 py-1 bg-red-600/90 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1.5 text-xs font-bold text-white">
                Unavailable
              </div>
            )}
          </div>

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
              {targetDestinationText && (
                <div className="mt-1 text-xs font-semibold text-[#4c55a4] dark:text-indigo-400 flex items-center gap-1">
                  <Footprints className="w-3 h-3" />
                  <span>{walkingMinutes ?? "8"} mins to {targetDestinationText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-4 py-4 mt-2 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <BedDouble className="w-4 h-4 text-zinc-400" />
              {apartment.beds} {t("apartment_card.beds")}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <Bath className="w-4 h-4 text-zinc-400" />
              {apartment.baths} {t("apartment_card.baths")}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              <Users className="w-4 h-4 text-zinc-400" />
              {apartment.guests} {t("apartment_card.guests")}
            </div>
          </div>

          {/* Footer (Price) */}
          <div className="flex items-end justify-between pt-4">
            <div>
              <span className="text-xl font-black text-zinc-900 dark:text-white">₪{apartment.price}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium"> {t("apartment_card.per_weekend")}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
