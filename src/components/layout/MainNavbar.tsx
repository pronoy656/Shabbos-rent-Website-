"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, Settings, LogOut, LayoutDashboard, ChevronDown, Bell, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AddApartmentModal from "./AddApartmentModal";
import { useLanguage } from "@/context/LanguageContext";

export default function MainNavbar() {
  const pathname = usePathname();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasApartment, setHasApartment] = useState(false);
  const [isApartmentVisible, setIsApartmentVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    setHasApartment(localStorage.getItem("hasUserListing") === "true");
    setIsApartmentVisible(localStorage.getItem("isApartmentVisible") !== "false");

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    { href: "/about", label: t("nav.about") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* A simple placeholder logo icon similar to the design */}
            <div className="flex -space-x-1">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  S
               </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              ShabbosRent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/');
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

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button 
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsDropdownOpen(false);
                  setIsNotifDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 font-medium text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute end-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/50 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <button
                    onClick={() => {
                      setLanguage("EN");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${language === 'EN' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  >
                    English
                    {language === 'EN' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("HE");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${language === 'HE' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  >
                    עברית
                    {language === 'HE' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
                  </button>
                </div>
              )}
            </div>

            {!userRole && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="relative inline-flex h-10 overflow-hidden rounded-xl p-[2px] focus:outline-none"
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#8b5cf6_33%,#ec4899_66%,#e4e4e7_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#8b5cf6_33%,#ec4899_66%,#27272a_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 backdrop-blur-3xl transition-all shadow-sm">
                  {t("nav.add_apartment")}
                </span>
              </button>
            )}
            {userRole ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => {
                      setIsNotifDropdownOpen(!isNotifDropdownOpen);
                      setIsDropdownOpen(false);
                    }}
                    className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
                  </button>

                  {isNotifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
                        <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">2 New</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">DC</span>
                            </div>
                            <div>
                              <p className="text-sm text-zinc-900 dark:text-white"><span className="font-bold">David Cohen</span> requested to swap apartments with you.</p>
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
                              <p className="text-sm text-zinc-600 dark:text-zinc-300">Your apartment listing <span className="font-bold text-zinc-900 dark:text-white">Luxury Penthouse</span> was approved.</p>
                              <p className="text-xs text-zinc-500 font-medium mt-1">Yesterday</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/user-dashboard"
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.setItem("pendingNotificationAction", "true");
                            setIsNotifDropdownOpen(false);
                            window.location.href = "/user-dashboard";
                          }}
                          className="block w-full text-center text-sm font-bold text-[#4c55a4] hover:text-[#3d4484] dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      setIsNotifDropdownOpen(false);
                    }}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-sm"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/50 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">User Account</p>
                      <p className="text-xs text-zinc-500 truncate">user@shabbosrent.com</p>
                    </div>
                    {hasApartment && (
                      <>
                        <div className="px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Available Status</span>
                          <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={isApartmentVisible} 
                              onChange={(e) => {
                                const newVal = e.target.checked;
                                setIsApartmentVisible(newVal);
                                localStorage.setItem("isApartmentVisible", newVal.toString());
                              }}
                            />
                            <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
                      </>
                    )}
                    <Link
                      href={userRole === "admin" ? "/dashboard" : "/user-dashboard"}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/user-dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        localStorage.setItem("pendingSettingsAction", "true");
                        setIsDropdownOpen(false);
                        window.location.href = "/user-dashboard";
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-zinc-500" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <AddApartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
