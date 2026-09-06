"use client";

import Link from "next/link";
import { X, Globe, Heart, Building, User, LayoutDashboard, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  userRole: string | null;
  isOwner: boolean;
  pathname: string;
  navLinks: Array<{ href: string; label: string }>;
  onClose: () => void;
  onOpenAddModal: () => void;
  onLogout: () => void;
}

export default function MobileMenuDrawer({
  isOpen,
  userRole,
  isOwner,
  pathname,
  navLinks,
  onClose,
  onOpenAddModal,
  onLogout,
}: MobileMenuDrawerProps) {
  const { language, setLanguage, t } = useLanguage();
  const { savedCount } = useFavorites();

  if (!isOpen) return null;

  const handleSavedFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    localStorage.setItem("pendingFavoritesAction", "true");
    window.location.href = "/user-dashboard";
  };

  const handleMyApartmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    localStorage.setItem("pendingManageAction", "true");
    sessionStorage.setItem("dashboardTab", "manage");
    window.location.href = "/user-dashboard?tab=manage";
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl overflow-y-auto animate-in ltr:slide-in-from-right rtl:slide-in-from-left duration-300 ltr:border-l rtl:border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-10">
          <span className="font-extrabold text-lg text-zinc-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`font-bold text-lg transition-colors py-3 px-4 rounded-xl ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-4 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
            {/* Language Switcher for Mobile */}
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Language
              </span>
              <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                <button
                  onClick={() => setLanguage("EN")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    language === "EN"
                      ? "bg-white dark:bg-zinc-800 text-[#4c55a4] dark:text-indigo-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("HE")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    language === "HE"
                      ? "bg-white dark:bg-zinc-800 text-[#4c55a4] dark:text-indigo-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  HE
                </button>
              </div>
            </div>

            {/* Saved Favorites button for Mobile (Logged in only) */}
            {userRole && (
              <button
                onClick={handleSavedFavoritesClick}
                className="w-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                <span>Saved Favorites ({savedCount})</span>
              </button>
            )}

            {!userRole ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddModal();
                  }}
                  className="w-full bg-gradient-to-r from-[#4c55a4] to-[#6b75c8] hover:opacity-90 text-white py-3.5 rounded-xl font-extrabold shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4" /> {t("nav.add_apartment")}
                </button>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-zinc-900 dark:text-white"
                >
                  <User className="w-4 h-4" /> {t("nav.login")}
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-2 py-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">My Account</p>
                    <p className="text-xs text-zinc-500 truncate">user@shabbosrent.com</p>
                  </div>
                </div>

                <Link
                  href={userRole === "admin" ? "/dashboard" : "/user-dashboard"}
                  onClick={onClose}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-zinc-900 dark:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
                </Link>
                <button
                  onClick={handleMyApartmentClick}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-zinc-900 dark:text-white transition-colors cursor-pointer"
                >
                  <Building className="w-4 h-4" /> {t("nav.go_to_my_apartment") || "Go to my apartment"}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> {t("nav.logout")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
