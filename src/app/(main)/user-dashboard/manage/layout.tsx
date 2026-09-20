"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, CheckCircle2, X, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMyApartment } from "@/hooks/useApartments";

export default function ManageApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const { data: myApartment } = useMyApartment();

  const hasApartment = Boolean(
    myApartment && (myApartment.id || (myApartment as any)._id || myApartment.title)
  );

  const isApproved = Boolean(
    myApartment &&
    (myApartment.status === "CONFIRMED" ||
     myApartment.status === "APPROVED" ||
     myApartment.status === "ACTIVE" ||
     (myApartment as any).isApproved === true ||
     myApartment.isListingActive === true)
  );

  const isPendingApproval = hasApartment && !isApproved;
  const [isStatusInfoModalOpen, setIsStatusInfoModalOpen] = useState(false);

  const subTabs = [
    {
      id: "my_listing",
      href: "/user-dashboard/manage",
      label: t("dashboard.manage.tabs.my_listing") || "My Listing",
      isActive: pathname === "/user-dashboard/manage",
    },
    {
      id: "report_renter",
      href: "/user-dashboard/manage/report-renter",
      label: t("dashboard.manage.tabs.report_renter") || "Report Renter",
      isActive: pathname.startsWith("/user-dashboard/manage/report-renter"),
    },
    {
      id: "apartment_calendar",
      href: "/user-dashboard/manage/calendar",
      label: t("dashboard.manage.tabs.calendar") || "Apartment Calendar",
      isActive: pathname.startsWith("/user-dashboard/manage/calendar"),
    },
    {
      id: "interested_request",
      href: "/user-dashboard/manage/interested-requests",
      label: t("dashboard.manage.tabs.interested") || "Interested Requests",
      isActive: pathname.startsWith("/user-dashboard/manage/interested-requests"),
    },
    {
      id: "report_history",
      href: "/user-dashboard/manage/rental-history",
      label: "Rental History",
      isActive: pathname.startsWith("/user-dashboard/manage/rental-history"),
    },
    {
      id: "call_log",
      href: "/user-dashboard/manage/call-log",
      label: "Call Log",
      isActive: pathname.startsWith("/user-dashboard/manage/call-log"),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col relative w-full">
        {/* Title & Pinned Earnings */}
        <div className="relative mb-8 w-full pr-0 sm:pr-64 rtl:pr-0 rtl:pl-64">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {t("dashboard.manage.title") || "Manage Apartment"}
            </h1>

            {/* Status Badge inline with title */}
            {hasApartment && (
              isPendingApproval ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-3 py-1.5 flex items-center shadow-sm animate-in zoom-in-95 gap-3 w-max">
                  <span className="font-semibold text-sm text-amber-700 dark:text-amber-400">
                    Your apartment is currently being approved by admin
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsStatusInfoModalOpen(true)}
                    className="shrink-0 text-xs font-bold px-2.5 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-800/40 dark:hover:bg-amber-700/50 text-amber-800 dark:text-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm w-max">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-sm text-green-700 dark:text-green-400">
                    {myApartment?.daysRemaining
                      ? `Listing Valid: ${myApartment.daysRemaining} days remaining`
                      : "Listing Active"}
                  </span>
                </div>
              )
            )}
          </div>

          <p className="text-zinc-500">
            {t("dashboard.manage.desc") || "Manage your property details, calendar availability, and renter reports."}
          </p>

          <div className="mt-4 sm:mt-0 sm:absolute sm:top-0 sm:right-0 sm:rtl:left-0 sm:rtl:right-auto inline-flex items-center gap-3.5 bg-[#0fa563] rounded-2xl p-3 px-4 shadow-md z-10 w-max self-start text-white border border-[#108752] dark:border-[#0a6c40]">
            <div className="bg-white/20 p-2.5 rounded-xl flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                Total Earnings
              </span>
              <span className="text-2xl font-black leading-none mt-0.5 tracking-tight">
                ₪12,500
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="flex items-center p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl mb-8 border border-zinc-200/80 dark:border-zinc-700/50 w-full overflow-x-auto shadow-sm whitespace-nowrap scrollbar-hide">
          {subTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`shrink-0 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                tab.isActive
                  ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Active Sub-Page Content */}
        <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
          {children}
        </div>
      </div>

      {/* Learn More Status Info Modal */}
      {isStatusInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsStatusInfoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Listing Approval Process
                </h3>
                <p className="text-xs text-zinc-500">Why is my apartment pending?</p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Every apartment is reviewed by our administration team before being publicly listed to ensure kosher standards, verified ownership, and top-tier listing accuracy for all guests. Review typically takes 5 to 10 minutes.
            </p>

            <button
              type="button"
              onClick={() => setIsStatusInfoModalOpen(false)}
              className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
