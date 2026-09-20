"use client";

import { useState, useEffect } from "react";
import { Heart, X, CheckCircle2, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: "favorite" | "unfavorite" | "success" | "info" | "error";
  apartmentImage?: string;
  actionUrl?: string;
  actionText?: string;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<Omit<ToastItem, "id">>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...event.detail, id };
      
      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // Keep max 4 toasts

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("showToast" as any, handleShowToast);
    return () => {
      window.removeEventListener("showToast" as any, handleShowToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleViewFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingFavoritesAction", "true");
    window.location.href = "/user-dashboard";
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 sm:top-28 sm:right-8 z-[100] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isFavorite = toast.type === "favorite";
        const isUnfavorite = toast.type === "unfavorite";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 animate-in slide-in-from-top-5 fade-in border-y border-r border-l-4 overflow-hidden ${
              isFavorite
                ? "bg-gradient-to-r from-red-50/90 to-white/95 dark:from-red-950/20 dark:to-zinc-900/95 text-zinc-900 dark:text-white border-y-red-100 border-r-red-100 border-l-red-500 dark:border-y-red-900/30 dark:border-r-red-900/30 dark:border-l-red-500 shadow-red-500/10"
                : isUnfavorite
                ? "bg-gradient-to-r from-zinc-50/90 to-white/95 dark:from-zinc-800/50 dark:to-zinc-900/95 text-zinc-900 dark:text-white border-y-zinc-200 border-r-zinc-200 border-l-zinc-400 dark:border-y-zinc-800 dark:border-r-zinc-800 dark:border-l-zinc-500 shadow-black/5"
                : "bg-gradient-to-r from-[#4c55a4]/10 to-white/95 dark:from-indigo-950/20 dark:to-zinc-900/95 text-zinc-900 dark:text-white border-y-[#4c55a4]/20 border-r-[#4c55a4]/20 border-l-[#4c55a4] dark:border-y-indigo-900/30 dark:border-r-indigo-900/30 dark:border-l-indigo-500 shadow-[#4c55a4]/10"
            }`}
          >
            {/* Image Thumbnail or Icon */}
            {toast.apartmentImage ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={toast.apartmentImage} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {isFavorite && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500 drop-shadow-sm animate-pulse" />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isFavorite
                    ? "bg-red-50 text-red-500 border border-red-100 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
                    : isUnfavorite
                    ? "bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    : "bg-blue-50 text-blue-500 border border-blue-100 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                }`}
              >
                {isFavorite ? (
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                ) : isUnfavorite ? (
                  <Heart className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm tracking-wide flex items-center gap-1.5 text-zinc-900 dark:text-white">
                  {toast.title}
                </h4>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                {toast.message}
              </p>

              {/* Action Link / Button if applicable */}
              {isFavorite && (
                <button
                  onClick={handleViewFavorites}
                  className="mt-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 group/btn transition-colors"
                >
                  <span>View Saved Favorites</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
