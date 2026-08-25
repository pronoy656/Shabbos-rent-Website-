"use client";

import { useState, useEffect } from "react";
import { Heart, X, CheckCircle2, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: "favorite" | "unfavorite" | "success" | "info";
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isFavorite = toast.type === "favorite";
        const isUnfavorite = toast.type === "unfavorite";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 fade-in border ${
              isFavorite
                ? "bg-zinc-900/95 dark:bg-zinc-900/95 text-white border-red-500/40 shadow-red-500/10"
                : isUnfavorite
                ? "bg-zinc-900/95 dark:bg-zinc-900/95 text-white border-zinc-700/60 shadow-black/30"
                : "bg-zinc-900/95 dark:bg-zinc-900/95 text-white border-blue-500/40 shadow-blue-500/10"
            }`}
          >
            {/* Image Thumbnail or Icon */}
            {toast.apartmentImage ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={toast.apartmentImage} alt="" className="w-full h-full object-cover" />
                {isFavorite && (
                  <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isFavorite
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : isUnfavorite
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {isFavorite ? (
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                ) : isUnfavorite ? (
                  <Heart className="w-5 h-5 text-zinc-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                  {toast.title}
                </h4>
              </div>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>

              {/* Action Link / Button if applicable */}
              {isFavorite && (
                <button
                  onClick={handleViewFavorites}
                  className="mt-2 text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 group/btn transition-colors"
                >
                  <span>View Saved Favorites</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
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
