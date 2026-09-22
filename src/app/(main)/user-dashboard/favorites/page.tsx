"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import ApartmentCard from "@/components/search/ApartmentCard";

export default function FavoritesPage() {
  const { savedApartments, isLoading } = useFavorites();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          Favorites & Saved Apartments ({savedApartments.length})
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Your shortlisted kosher apartments for quick access and weekend reservations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm"
            >
              <div className="h-56 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl" />
                <div className="h-10 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : savedApartments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            No saved apartments yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
            Click the heart icon on any apartment listing while browsing to save it to your wishlist.
          </p>
          <Link
            href="/search"
            className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4" />
            Explore Apartments
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      )}
    </div>
  );
}
