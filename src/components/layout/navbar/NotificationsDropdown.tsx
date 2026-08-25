"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onToggle, onClose }: NotificationsDropdownProps) {
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

  const handleViewAllNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingNotificationAction", "true");
    onClose();
    window.location.href = "/user-dashboard";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 dark:text-white">{t("nav.notifications")}</h3>
            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              2 New
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">DC</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-900 dark:text-white">
                    <span className="font-bold">David Cohen</span> requested to swap apartments with you.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer opacity-70">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">SR</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Your apartment listing <span className="font-bold text-zinc-900 dark:text-white">Luxury Penthouse</span> was approved.
                  </p>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleViewAllNotifications}
              className="block w-full text-center text-sm font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
            >
              {t("nav.view_all")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
