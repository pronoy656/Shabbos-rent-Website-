"use client";

import { useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function LanguageDropdown({ isOpen, onToggle, onClose }: LanguageDropdownProps) {
  const { language, setLanguage } = useLanguage();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 font-medium text-sm cursor-pointer"
      >
        <Globe className="w-4 h-4" />
        <span>{language}</span>
        <ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto mt-2 w-32 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/50 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
          <button
            onClick={() => {
              setLanguage("EN");
              onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              language === "EN"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            English
            {language === "EN" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
          </button>
          <button
            onClick={() => {
              setLanguage("HE");
              onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              language === "HE"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            עברית
            {language === "HE" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
          </button>
        </div>
      )}
    </div>
  );
}
