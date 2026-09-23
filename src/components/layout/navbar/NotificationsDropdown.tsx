"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Info, AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMyAlerts, useMarkAllAlertsAsRead } from "@/hooks/useAlert";
import { AlertType } from "@/types/alert.types";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case AlertType.INFO:
      return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case AlertType.WARNING:
      return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case AlertType.SUCCESS:
      return <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case AlertType.URGENT:
      return <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
  }
};

const getAlertBg = (type: string) => {
  switch (type) {
    case AlertType.INFO:
      return "bg-blue-100 dark:bg-blue-900/40";
    case AlertType.WARNING:
      return "bg-amber-100 dark:bg-amber-900/40";
    case AlertType.SUCCESS:
      return "bg-emerald-100 dark:bg-emerald-900/40";
    case AlertType.URGENT:
      return "bg-red-100 dark:bg-red-900/40";
    default:
      return "bg-zinc-100 dark:bg-zinc-800";
  }
};

export default function NotificationsDropdown({ isOpen, onToggle, onClose }: NotificationsDropdownProps) {
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: alertsData, isLoading } = useMyAlerts(isOpen); // Fetch when open or always enabled based on preference
  const { mutate: markAsRead } = useMarkAllAlertsAsRead();

  const alerts = alertsData?.data || [];
  const unreadCount = alerts.length; // Assuming they are removed when read, or filter by a read field if available. Here we assume all returned are active/unread.

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

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 dark:text-white">{t("nav.notifications") || "Notifications"}</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-zinc-500 text-sm">Loading...</div>
            ) : alerts.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No new notifications</div>
            ) : (
              alerts.map((alert) => (
                <Link 
                  href={alert.link || "#"} 
                  key={alert.id}
                  onClick={onClose}
                >
                  <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${getAlertBg(alert.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-900 dark:text-white font-bold">
                          {alert.title}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-2">
                          {alert.message}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium mt-1">
                          {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="block w-full text-center text-sm font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
