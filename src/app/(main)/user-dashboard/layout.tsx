"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LogOut,
  Settings,
  Building,
  RefreshCw,
  Heart,
  CalendarDays,
  Clock,
  Phone,
  Bell,
} from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useMe } from "@/hooks/useAuth";
import { logout, clearAuthSession } from "@/services/auth.service";
import UserAvatar from "@/components/common/UserAvatar";
import { toast } from "sonner";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // User Profile State
  const { data: meUser } = useMe();
  const [localAuthUser, setLocalAuthUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        setLocalAuthUser(JSON.parse(stored));
      }
    } catch {}
  }, [meUser]);

  const currentProfileUser = meUser || localAuthUser;
  const profileDisplayName = currentProfileUser?.username || "";
  const profileDisplayEmail = currentProfileUser?.email || "";

  // Auth Protection Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("accessToken");
      const role = localStorage.getItem("userRole");
      if (!token || !role) {
        window.location.href = `/login?redirect=${encodeURIComponent(pathname || "/user-dashboard/manage")}`;
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    clearAuthSession();
    toast.success("Logged out successfully");
    try {
      await logout();
    } catch {}
    router.replace("/login");
  };

  const navItems = [
    {
      id: "manage",
      href: "/user-dashboard/manage",
      label: t("dashboard.nav.manage") || "Manage My Apartment",
      icon: Building,
      color: "text-blue-600",
      isActive: pathname === "/user-dashboard" || pathname.startsWith("/user-dashboard/manage"),
    },
    {
      id: "swap",
      href: "/user-dashboard/swap",
      label: t("dashboard.nav.swap") || "Apartment Swap",
      icon: RefreshCw,
      color: "text-indigo-500",
      isActive: pathname.startsWith("/user-dashboard/swap"),
    },
    {
      id: "favorites",
      href: "/user-dashboard/favorites",
      label: "Favorites & Saved",
      icon: Heart,
      color: "text-red-500",
      isActive: pathname.startsWith("/user-dashboard/favorites"),
    },
    {
      id: "bookings",
      href: "/user-dashboard/bookings",
      label: "Booking History",
      icon: CalendarDays,
      color: "text-amber-500",
      isActive: pathname.startsWith("/user-dashboard/bookings"),
    },
    {
      id: "reminders",
      href: "/user-dashboard/reminders",
      label: "Reminder Settings",
      icon: Clock,
      color: "text-cyan-500",
      isActive: pathname.startsWith("/user-dashboard/reminders"),
    },
    {
      id: "channels",
      href: "/user-dashboard/channels",
      label: "Explain Page",
      icon: Phone,
      color: "text-emerald-500",
      isActive: pathname.startsWith("/user-dashboard/channels"),
    },
    {
      id: "notifications",
      href: "/user-dashboard/notifications",
      label: t("dashboard.nav.notifications") || "Notifications",
      icon: Bell,
      color: "text-blue-500",
      isActive: pathname.startsWith("/user-dashboard/notifications"),
    },
    {
      id: "settings",
      href: "/user-dashboard/settings",
      label: t("dashboard.nav.settings") || "Settings",
      icon: Settings,
      color: "text-zinc-600 dark:text-zinc-400",
      isActive: pathname.startsWith("/user-dashboard/settings"),
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      <MainNavbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop Sidebar */}
        <aside className="w-72 bg-white dark:bg-[#121212] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hidden md:flex z-10">
          <div className="p-4 flex flex-col flex-1 overflow-y-auto">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 mb-6 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <UserAvatar
                src={currentProfileUser?.profileImage}
                name={profileDisplayName || "User"}
                email={profileDisplayEmail}
                size="md"
              />
              <div className="overflow-hidden">
                <h3 className="font-bold text-zinc-900 dark:text-white leading-tight text-sm truncate">
                  {profileDisplayName || t("dashboard.owner_dashboard") || "Owner Dashboard"}
                </h3>
                <p className="text-xs text-zinc-500">{t("dashboard.property_owner") || "Property Owner"}</p>
                {profileDisplayEmail && (
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[150px]">
                    {profileDisplayEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  className={classNames(
                    index !== 0 ? "border-t border-zinc-100 dark:border-zinc-800/60" : ""
                  )}
                >
                  <Link
                    href={item.href}
                    className={classNames(
                      item.isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30"
                        : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                      "group w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all my-1 text-left"
                    )}
                  >
                    <item.icon className={classNames(item.color, "h-5 w-5 shrink-0")} aria-hidden="true" />
                    <span
                      className={classNames(
                        item.isActive
                          ? "text-blue-900 dark:text-blue-300 font-bold"
                          : "text-zinc-900 dark:text-white font-medium",
                        "text-[15px] leading-tight"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <Link
              href="/"
              className="group w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all my-1 text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              <Home className="w-5 h-5 shrink-0 text-sky-500" />
              <span className="text-[15px] font-bold leading-tight text-zinc-900 dark:text-white">
                {t("dashboard.nav.home") || "Home"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-[15px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-left cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{t("dashboard.nav.logout") || "Logout"}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          {/* Mobile Navigation Tabs */}
          <div className="md:hidden bg-white dark:bg-[#121212] border-b border-zinc-200 dark:border-zinc-800 px-4 pt-4 pb-4 sticky top-0 z-30 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={classNames(
                    item.isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all shrink-0"
                  )}
                >
                  <item.icon className={classNames(item.color, "w-4 h-4")} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-8 lg:p-12 w-full mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
