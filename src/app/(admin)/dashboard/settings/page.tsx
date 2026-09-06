"use client";

import { useState, useEffect } from "react";
import { Gift } from "lucide-react";

export default function SettingsPage() {
  const [isFirstYearFreeActive, setIsFirstYearFreeActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isFirstYearFreeActive");
      if (saved !== null) {
        setIsFirstYearFreeActive(saved === "true");
      }
    }
  }, []);

  const toggleFirstYearFree = () => {
    const newVal = !isFirstYearFreeActive;
    setIsFirstYearFreeActive(newVal);
    localStorage.setItem("isFirstYearFreeActive", String(newVal));
  };

  return (
    <div className="font-sans space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white capitalize">Settings Management</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage system-wide configuration and promotions.
        </p>
      </div>
      
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-w-2xl">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-indigo-500" /> Promotions & Offers
        </h2>
        
        <div className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-800 rounded-lg">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">First Year Free Promotion</h3>
            <p className="text-sm text-zinc-500 mt-1">
              If enabled, new owners will get their first year subscription (normally ₪28) for free.
            </p>
          </div>
          <button
            onClick={toggleFirstYearFree}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isFirstYearFreeActive ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isFirstYearFreeActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
