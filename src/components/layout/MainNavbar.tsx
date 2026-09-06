"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import AddApartmentModal from "./AddApartmentModal";
import { useLanguage } from "@/context/LanguageContext";

import LanguageDropdown from "./navbar/LanguageDropdown";
import FavoritesDropdown from "./navbar/FavoritesDropdown";
import NotificationsDropdown from "./navbar/NotificationsDropdown";
import UserDropdown from "./navbar/UserDropdown";
import MobileMenuDrawer from "./navbar/MobileMenuDrawer";

export default function MainNavbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isFavDropdownOpen, setIsFavDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    setIsOwner(localStorage.getItem("hasUserListing") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  const navLinks = [
    { href: "/", label: t("nav.home") || "Home" },
    { href: "/search", label: t("nav.apartments") },
    { href: "/ambassador/dashboard", label: "Ambassador Program" },
    { href: "/about", label: t("nav.about") },
    { href: "/news", label: t("nav.news") || "News" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/__לוגו רקע שקוף-02_.png"
              alt="Shabos Rent Logo"
              className="w-auto h-[88px] object-contain shrink-0 transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/50"
                      : "text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <LanguageDropdown
              isOpen={isLangDropdownOpen}
              onToggle={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsDropdownOpen(false);
                setIsNotifDropdownOpen(false);
                setIsFavDropdownOpen(false);
              }}
              onClose={() => setIsLangDropdownOpen(false)}
            />

            {/* Favorites Pill Dropdown (Logged in only) */}
            {userRole && (
              <FavoritesDropdown
                isOpen={isFavDropdownOpen}
                onToggle={() => {
                  setIsFavDropdownOpen(!isFavDropdownOpen);
                  setIsNotifDropdownOpen(false);
                  setIsDropdownOpen(false);
                  setIsLangDropdownOpen(false);
                }}
                onClose={() => setIsFavDropdownOpen(false)}
              />
            )}

            {!userRole ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="relative inline-flex h-10 overflow-hidden rounded-xl p-[2px] focus:outline-none cursor-pointer"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#8b5cf6_33%,#ec4899_66%,#e4e4e7_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#8b5cf6_33%,#ec4899_66%,#27272a_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 backdrop-blur-3xl transition-all shadow-sm">
                    {t("nav.add_apartment")}
                  </span>
                </button>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-all shadow-sm"
                >
                  <User className="w-4 h-4 text-zinc-500" />
                  {t("nav.login")}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <NotificationsDropdown
                  isOpen={isNotifDropdownOpen}
                  onToggle={() => {
                    setIsNotifDropdownOpen(!isNotifDropdownOpen);
                    setIsDropdownOpen(false);
                    setIsFavDropdownOpen(false);
                    setIsLangDropdownOpen(false);
                  }}
                  onClose={() => setIsNotifDropdownOpen(false)}
                />

                {/* User Dropdown */}
                <UserDropdown
                  isOpen={isDropdownOpen}
                  userRole={userRole}
                  onToggle={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsNotifDropdownOpen(false);
                    setIsFavDropdownOpen(false);
                    setIsLangDropdownOpen(false);
                  }}
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        userRole={userRole}
        isOwner={isOwner}
        pathname={pathname}
        navLinks={navLinks}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onLogout={handleLogout}
      />

      <AddApartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
