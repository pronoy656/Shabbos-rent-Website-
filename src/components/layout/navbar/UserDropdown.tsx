"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Settings, LogOut, Building } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMe } from "@/hooks/useAuth";
import UserAvatar from "@/components/common/UserAvatar";
import type { AuthUser } from "@/types/auth.types";

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
  const { data: meUser } = useMe();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);

  const syncUser = () => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [isOpen, meUser]);

  const currentUser = meUser || localUser;
  const displayName = currentUser?.username || t("nav.user_account") || "My Account";
  const displayEmail = currentUser?.email || currentUser?.phone || "";

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

  const handleMyApartmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingManageAction", "true");
    sessionStorage.setItem("dashboardTab", "manage");
    onClose();
    window.location.href = "/user-dashboard?tab=manage";
  };

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
        className="flex items-center gap-2 px-1.5 py-1.5 rounded-full md:rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs group"
        aria-label="User menu"
      >
        <UserAvatar
          src={currentUser?.profileImage}
          name={displayName}
          email={displayEmail}
          size="sm"
          className="group-hover:scale-105 transition-transform"
        />
        <ChevronDown className="w-4 h-4 text-zinc-500 mr-1 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2 w-60 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
            <div className="flex items-center gap-3">
              <UserAvatar
                src={currentUser?.profileImage}
                name={displayName}
                email={displayEmail}
                size="md"
              />
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {displayEmail}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={userRole === "admin" ? "/dashboard" : "/user-dashboard"}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
            {t("nav.dashboard")}
          </Link>
          <Link
            href="/user-dashboard?tab=manage"
            onClick={handleMyApartmentClick}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Building className="w-4 h-4 text-zinc-500" />
            {t("nav.go_to_my_apartment") || "Go to my apartment"}
          </Link>
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left rtl:text-right"
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            {t("nav.settings")}
          </button>
          <div className="h-px bg-zinc-100 dark:border-zinc-800 my-1"></div>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer text-left rtl:text-right"
          >
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

