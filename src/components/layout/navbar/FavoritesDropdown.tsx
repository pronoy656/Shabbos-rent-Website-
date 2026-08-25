"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoritesDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function FavoritesDropdown({ isOpen, onToggle, onClose }: FavoritesDropdownProps) {
  const { savedApartments, savedCount, removeFavorite } = useFavorites();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleRemove = (e: React.MouseEvent, aptId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(aptId, title);
  };

  const handleViewAllFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingFavoritesAction", "true");
    onClose();
    window.location.href = "/user-dashboard";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Pill Button */}
      <button
        onClick={onToggle}
        title="Saved Favorites"
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 group cursor-pointer active:scale-95 shadow-sm ${
          savedCount > 0
            ? "bg-red-50/90 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-950/70"
            : "bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-950/30 hover:text-red-600"
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
            savedCount > 0 ? "fill-red-500 text-red-500" : "text-zinc-500 dark:text-zinc-400 group-hover:text-red-500"
          }`}
        />
        <span className="text-xs font-bold tracking-tight">Saved</span>
        <span
          className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full font-extrabold text-[11px] transition-colors ${
            savedCount > 0
              ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 group-hover:bg-red-100 group-hover:text-red-600 dark:group-hover:bg-red-900/60 dark:group-hover:text-red-300"
          }`}
        >
          {savedCount}
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-zinc-900/15 dark:shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="font-extrabold text-zinc-900 dark:text-white text-base">Saved Favorites</h3>
            </div>
            <span className="text-xs font-extrabold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800/50">
              {savedCount} Saved
            </span>
          </div>

          {savedCount === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-3 text-red-500">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">No favorite apartments saved</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[220px]">
                Click the heart icon on any apartment card while browsing to save it here.
              </p>
              <Link
                href="/search"
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Explore Apartments
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {savedApartments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center gap-3 group"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/apartments/${apt.id}`}
                      onClick={onClose}
                      className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={apt.image} alt={apt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/apartments/${apt.id}`}
                        onClick={onClose}
                        className="font-bold text-xs text-zinc-900 dark:text-white hover:text-[#4c55a4] dark:hover:text-indigo-400 line-clamp-1 block"
                      >
                        {apt.title}
                      </Link>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {apt.location || `${apt.city}, ${apt.neighborhood || ""}`}
                      </p>
                      {apt.price ? (
                        <p className="text-xs font-extrabold text-[#4c55a4] dark:text-indigo-400 mt-1">
                          ${apt.price} <span className="text-[10px] font-normal text-zinc-400">/ weekend</span>
                        </p>
                      ) : null}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(e, apt.id, apt.title)}
                      title="Remove from favorites"
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Dropdown Footer */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <button
                  onClick={handleViewAllFavorites}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full cursor-pointer"
                >
                  <span>View All Saved Favorites</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
