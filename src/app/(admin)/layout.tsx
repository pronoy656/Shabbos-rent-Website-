"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  CheckSquare,
  ArrowRightLeft,
  Calendar,
  Megaphone,
  Image as ImageIcon,
  BarChart3,
  BellRing,
  CreditCard,
  MessageSquare,
  Eye,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const navigation = [
    { name: t("admin.nav.dashboard"), href: "/dashboard", icon: LayoutDashboard, color: "text-blue-600" },
    { name: t("admin.nav.apartments"), href: "/dashboard/apartments", icon: Building2, color: "text-purple-600" },
    { name: t("admin.nav.owners"), href: "/dashboard/owners", icon: Users, color: "text-emerald-600" },
    { name: t("admin.nav.renters"), href: "/dashboard/renters", icon: UserCheck, color: "text-orange-600" },
    { name: t("admin.nav.rentals"), href: "/dashboard/rentals", icon: CheckSquare, color: "text-blue-500" },
    { name: t("admin.nav.swaps"), href: "/dashboard/swaps", icon: ArrowRightLeft, color: "text-indigo-500" },
    { name: t("admin.nav.weekends"), href: "/dashboard/dates", icon: Calendar, color: "text-orange-500" },
    { name: t("admin.nav.news"), href: "/dashboard/news", icon: Megaphone, color: "text-blue-600" },
    { name: t("admin.nav.advertisements"), href: "/dashboard/advertisements", icon: ImageIcon, color: "text-purple-500" },
    { name: t("admin.nav.alerts"), href: "/dashboard/alerts", icon: BellRing, color: "text-orange-600" },
    { name: t("admin.nav.payments"), href: "/dashboard/payments", icon: CreditCard, color: "text-green-600" },
    { name: "Ambassadors", href: "/dashboard/ambassadors", icon: Users, color: "text-indigo-600" },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#121212] hidden md:flex flex-col z-10 text-zinc-600 dark:text-zinc-300">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#121212] z-10">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            <img
              src="/launchericon-192x192.png"
              alt="Shabos Rent Logo"
              className="w-7 h-7 object-contain"
            />
            <span>Shabos Rent</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs ml-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">Admin</span>
          </Link>
        </div>
        <nav className="p-4 flex flex-col flex-1 overflow-y-auto">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className={classNames(
                index !== 0 ? "border-t border-zinc-100 dark:border-zinc-800/60" : ""
              )}>
                <Link
                  href={item.href}
                  className={classNames(
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30"
                      : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                    "group flex items-center gap-4 px-3 py-3 rounded-lg transition-all my-1"
                  )}
                >
                  <item.icon
                    className={classNames(item.color, "h-5 w-5 shrink-0")}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className={classNames(
                      isActive ? "text-blue-900 dark:text-blue-300" : "text-zinc-900 dark:text-white",
                      "text-[15px] font-bold leading-tight"
                    )}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <LogOut className="h-5 w-5 shrink-0" />
            {t("admin.logout")}
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 md:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-black/80">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
            <Link href="/dashboard/alerts" className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors mr-2">
              <BellRing className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 outline-none rounded-full border border-zinc-200 bg-white p-1.5 pr-4 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 group">
                <Avatar className="h-8 w-8 border border-zinc-100 dark:border-zinc-700 shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start hidden md:block text-left">
                  <span className="text-[13px] font-bold leading-none text-zinc-900 dark:text-white block pb-0.5">{t("admin.admin_user")}</span>
                  <span className="text-[11px] font-medium leading-none text-zinc-500 dark:text-zinc-400 block">{t("admin.superadmin")}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-400 hidden md:block ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 font-sans rounded-xl p-2 shadow-lg border-zinc-200 dark:border-zinc-800">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-2">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-bold leading-none text-zinc-900 dark:text-white">{t("admin.admin_user")}</p>
                      <p className="text-xs font-medium leading-none text-zinc-500 dark:text-zinc-400">
                        admin@shabbosrent.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>{t("admin.settings_password")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem className="p-2 rounded-lg text-red-600 focus:text-red-700 dark:text-red-400 font-medium focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("admin.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
