"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface UserDropdownProps {
  isOpen: boolean;
  userRole: string | null;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export default function UserDropdown({ isOpen, userRole, onToggle, onClose, onLogout }: UserDropdownProps) {
  const { t } = useLanguage();
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

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingSettingsAction", "true");
    onClose();
    window.location.href = "/user-dashboard";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-2 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
        />
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/50 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">{t("nav.user_account")}</p>
            <p className="text-xs text-zinc-500 truncate">user@shabbosrent.com</p>
          </div>

          <Link
            href={userRole === "admin" ? "/dashboard" : "/user-dashboard"}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t("nav.dashboard")}
          </Link>
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
          >
            <Settings className="w-4 h-4" />
            {t("nav.settings")}
          </button>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
