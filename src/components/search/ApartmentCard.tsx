import Link from "next/link";
import { MapPin, BedDouble, Bath, Users, Star, ArrowRightLeft, ShieldCheck } from "lucide-react";

export interface ApartmentData {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  beds: number;
  baths: number;
  guests: number;
  isSwapAvailable: boolean;
  verified: boolean;
}

export default function ApartmentCard({ apartment }: { apartment: ApartmentData }) {
  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300">
      <Link href={`/apartments/${apartment.id}`}>
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={apartment.image}
            alt={apartment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {apartment.isSwapAvailable && (
              <div className="px-2.5 py-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-md shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-1.5 text-xs font-bold text-[#4c55a4]">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap Eligible
              </div>
            )}
            {apartment.verified && (
              <div className="px-2.5 py-1 bg-green-500/90 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            {apartment.rating} <span className="text-zinc-500 font-medium">({apartment.reviews})</span>
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
