"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  DoorOpen,
  Users,
  Edit3,
  Eye,
  PlusCircle,
  X,
  Building2,
  CalendarCheck,
  Star,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMyApartment, useApartmentAvailabilities } from "@/hooks/useApartments";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { getImageUrl } from "@/utils/imageUrl";
import CreateListingModal from "@/components/layout/CreateListingModal";
import { SHABBATOT } from "@/components/dashboard/dashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyListingPage() {
  const { t } = useLanguage();
  const {
    data: myApartment,
    isLoading: isMyApartmentLoading,
    refetch: refetchMyApartment,
  } = useMyApartment();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [modalActiveImage, setModalActiveImage] = useState<string>("");

  const [localSelectedShabbatot, setLocalSelectedShabbatot] = useState<string[]>([]);
  const [localSpecialShabbatot, setLocalSpecialShabbatot] = useState<string[]>([]);

  // Weekend Calendars Query
  const { data: weekendCalendarsRaw } = useWeekendCalendars();
  const rawData = weekendCalendarsRaw as any;
  const weekendCalendarsList: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.data?.data)
    ? rawData.data.data
    : [];

  const allCalendarShabbatot =
    weekendCalendarsList.length > 0
      ? [...weekendCalendarsList]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((w) => {
            let formattedDate = "";
            try {
              if (w.date && typeof w.date === "string") {
                const cleanDateStr = w.date.split("T")[0];
                const parts = cleanDateStr.split("-");
                if (parts.length === 3) {
                  const day = parseInt(parts[2], 10);
                  const month = parseInt(parts[1], 10);
                  const dayStr = day < 10 ? `0${day}` : `${day}`;
                  formattedDate = `${dayStr}/${month}`;
                } else {
                  const d = new Date(w.date);
                  const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
                  const month = d.getMonth() + 1;
                  formattedDate = `${day}/${month}`;
                }
              } else {
                formattedDate = w.date;
              }
            } catch {
              formattedDate = w.date;
            }
            return {
              id: w.id,
              name: w.title,
              date: formattedDate,
              rawDate: w.date,
            };
          })
      : SHABBATOT;

  // Availabilities API Query for this apartment
  const { data: myAvailabilitiesData } = useApartmentAvailabilities(myApartment?.id || "");

  // Read local storage on mount / update
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedShabbatot");
      if (saved) {
        try {
          setLocalSelectedShabbatot(JSON.parse(saved));
        } catch {}
      }
      const special = localStorage.getItem("specialShabbatot");
      if (special) {
        try {
          setLocalSpecialShabbatot(JSON.parse(special));
        } catch {}
      }
    }
  }, []);

  // Compute active availability list (API + local storage fallback)
  const availableShabbatList: Array<{
    id: string;
    name: string;
    date: string;
    isSpecial?: boolean;
  }> = (() => {
    const listMap = new Map<string, { id: string; name: string; date: string; isSpecial?: boolean }>();

    // 1. From API Availabilities
    if (myAvailabilitiesData?.data && Array.isArray(myAvailabilitiesData.data)) {
      myAvailabilitiesData.data.forEach((item: any) => {
        const wkndId = item.weekendId || item.id;
        const matched = allCalendarShabbatot.find((s) => s.id === wkndId);
        if (matched) {
          listMap.set(matched.id, {
            id: matched.id,
            name: matched.name,
            date: matched.date,
            isSpecial: Boolean(item.isSpecial || localSpecialShabbatot.includes(matched.id)),
          });
        } else if (item.weekend) {
          listMap.set(wkndId, {
            id: wkndId,
            name: item.weekend.title || "Shabbat",
            date: item.weekend.date || "",
            isSpecial: Boolean(item.isSpecial || localSpecialShabbatot.includes(wkndId)),
          });
        }
      });
    }

    // 2. From Apartment embedded availabilities (if any)
    if (myApartment?.availabilities && Array.isArray(myApartment.availabilities)) {
      myApartment.availabilities.forEach((item: any) => {
        const wkndId = item.weekendId || item.id;
        const matched = allCalendarShabbatot.find((s) => s.id === wkndId);
        if (matched) {
          listMap.set(matched.id, {
            id: matched.id,
            name: matched.name,
            date: matched.date,
            isSpecial: Boolean(item.isSpecial || localSpecialShabbatot.includes(matched.id)),
          });
        }
      });
    }

    // 3. From Local Storage (selectedShabbatot)
    if (localSelectedShabbatot.length > 0) {
      localSelectedShabbatot.forEach((id) => {
        const matched = allCalendarShabbatot.find((s) => s.id === id);
        if (matched && !listMap.has(matched.id)) {
          listMap.set(matched.id, {
            id: matched.id,
            name: matched.name,
            date: matched.date,
            isSpecial: localSpecialShabbatot.includes(matched.id),
          });
        }
      });
    }

    return Array.from(listMap.values());
  })();

  if (isMyApartmentLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  const hasApartment = Boolean(
    myApartment && (myApartment.id || (myApartment as any)._id || myApartment.title)
  );

  // Empty State if user hasn't added an apartment
  if (!hasApartment) {
    return (
      <>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 bg-[#4c55a4]/10 text-[#4c55a4] dark:bg-indigo-950/40 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
            No Apartment Listed Yet
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            You haven&apos;t added your apartment yet. Create a listing to start managing Shabbat availability, receiving booking inquiries, and earning.
          </p>
          <button
            type="button"
            onClick={() => {
              setModalMode("create");
              setIsCreateModalOpen(true);
            }}
            className="px-8 py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md shadow-[#4c55a4]/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            Add Your Apartment
          </button>
        </div>

        <CreateListingModal
          isOpen={isCreateModalOpen}
          isEditMode={modalMode === "edit"}
          initialApartment={undefined}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={() => {
            setIsCreateModalOpen(false);
            refetchMyApartment();
          }}
        />
      </>
    );
  }

  // Real Apartment Listing
  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm h-fit w-full flex flex-col md:flex-row">
        {/* Apartment Cover Image */}
        <div className="relative h-56 md:h-auto md:w-2/5 lg:w-1/3 shrink-0 bg-zinc-100 dark:bg-zinc-800">
          {myApartment?.coverImage ? (
            <img
              src={getImageUrl(myApartment.coverImage)}
              alt={myApartment?.title || "Apartment"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
              <Building2 className="w-12 h-12 stroke-[1.5] mb-2 text-zinc-300 dark:text-zinc-600" />
              <span className="text-xs font-semibold">No Image Uploaded</span>
            </div>
          )}

          {myApartment?.city && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm text-zinc-900 dark:text-white">
                {myApartment.city}
              </span>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1.5 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm text-white ${
                myApartment?.status === "CONFIRMED" ||
                myApartment?.status === "APPROVED" ||
                myApartment?.status === "ACTIVE" ||
                (myApartment as any)?.isApproved ||
                myApartment?.isListingActive
                  ? "bg-green-500/90"
                  : "bg-amber-500/90"
              }`}
            >
              {myApartment?.status === "CONFIRMED" ||
              myApartment?.status === "APPROVED" ||
              myApartment?.status === "ACTIVE" ||
              (myApartment as any)?.isApproved ||
              myApartment?.isListingActive
                ? "Approved"
                : "Pending Approval"}
            </span>
          </div>
        </div>

        {/* Apartment Information */}
        <div className="p-6 md:p-8 flex flex-col justify-between w-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
              <div>
                {(myApartment?.propertyId || myApartment?.id) && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 bg-[#4c55a4]/10 dark:bg-indigo-900/30 text-[#4c55a4] dark:text-indigo-400 rounded-lg text-xs font-black tracking-widest uppercase">
                    <span className="opacity-60">Code:</span> {myApartment.propertyId || myApartment.id}
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">
                  {myApartment?.title || "Untitled Apartment"}
                </h3>
                {myApartment?.description && (
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base line-clamp-2">
                    {myApartment.description}
                  </p>
                )}
              </div>
              <div className="sm:text-right shrink-0">
                <span className="font-black text-2xl text-[#4c55a4] dark:text-indigo-400">
                  ₪{myApartment?.pricePerShabbat ?? 0}
                </span>
                <span className="block text-sm text-zinc-500 font-medium">
                  {t("dashboard.add.night") || "per Shabbat"}
                </span>
              </div>
            </div>

            {(myApartment?.city || myApartment?.neighborhood) && (
              <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />{" "}
                {myApartment?.neighborhood ? `${myApartment.neighborhood}, ` : ""}
                {myApartment?.city || ""}
              </div>
            )}

            {/* Specifications */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 mb-6">
              <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                <BedDouble className="w-4 h-4 text-blue-500" />
                <span>
                  {myApartment?.bedrooms ?? 0} {t("dashboard.add.beds") || "Beds"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                <DoorOpen className="w-4 h-4 text-emerald-500" />
                <span>
                  {myApartment?.bathrooms ?? 0} {t("dashboard.add.baths") || "Baths"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl">
                <Users className="w-4 h-4 text-orange-500" />
                <span>
                  {myApartment?.maxGuest ?? 0} {t("dashboard.add.guests") || "Guests"}
                </span>
              </div>
            </div>

            {/* Availability & Events Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#4c55a4]" />
                  {t("dashboard.add.availability_events") || "Available Shabbatot & Dates"}
                </h4>
                <Link
                  href="/user-dashboard/manage/calendar"
                  className="text-xs font-bold text-[#4c55a4] dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  Manage Calendar <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {availableShabbatList.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {availableShabbatList.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col px-3.5 py-2 rounded-xl border transition-all ${
                        item.isSpecial
                          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50"
                          : "bg-indigo-50/70 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm font-extrabold ${
                            item.isSpecial
                              ? "text-amber-800 dark:text-amber-300"
                              : "text-indigo-700 dark:text-indigo-300"
                          }`}
                        >
                          {item.date}
                        </span>
                        {item.isSpecial && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          item.isSpecial
                            ? "text-amber-600/90 dark:text-amber-400/90"
                            : "text-indigo-600/80 dark:text-indigo-400/80"
                        }`}
                      >
                        {item.name.startsWith("Shabbat") ? item.name : `Shabbat ${item.name}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                  <p className="text-sm text-zinc-500 italic">
                    {t("dashboard.add.no_dates") || "No Shabbat availability dates marked yet."}
                  </p>
                  <Link
                    href="/user-dashboard/manage/calendar"
                    className="text-xs font-bold px-3 py-1.5 bg-[#4c55a4]/10 hover:bg-[#4c55a4]/20 text-[#4c55a4] dark:text-indigo-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Set Dates
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                setModalMode("edit");
                setIsCreateModalOpen(true);
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              {t("dashboard.add.edit_listing") || "Edit Listing"}
            </button>

            <button
              type="button"
              onClick={() => {
                const defaultImg = myApartment?.coverImage
                  ? getImageUrl(myApartment.coverImage)
                  : myApartment?.images?.[0]
                  ? getImageUrl(myApartment.images[0])
                  : "";
                setModalActiveImage(defaultImg);
                setIsViewDetailsModalOpen(true);
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Edit Listing Modal */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        isEditMode={modalMode === "edit"}
        initialApartment={myApartment}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={() => {
          setIsCreateModalOpen(false);
          refetchMyApartment();
        }}
      />

      {/* View Details Modal */}
      {isViewDetailsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {myApartment?.title || "Apartment Details"}
              </h3>
              <button
                type="button"
                onClick={() => setIsViewDetailsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {modalActiveImage ? (
                  <img
                    src={modalActiveImage}
                    alt="Apartment view"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                    <Building2 className="w-12 h-12 stroke-[1.5] mb-2 text-zinc-300 dark:text-zinc-600" />
                    <span className="text-xs font-semibold">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {myApartment?.images && myApartment.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {myApartment.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setModalActiveImage(getImageUrl(img))}
                      className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-[#4c55a4] transition-all cursor-pointer"
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {myApartment?.description || "No description provided."}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl text-center">
                  <span className="text-xs text-zinc-400 block">Bedrooms</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {myApartment?.bedrooms ?? "-"}
                  </span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl text-center">
                  <span className="text-xs text-zinc-400 block">Bathrooms</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {myApartment?.bathrooms ?? "-"}
                  </span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl text-center">
                  <span className="text-xs text-zinc-400 block">Max Guests</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {myApartment?.maxGuest ?? "-"}
                  </span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl text-center">
                  <span className="text-xs text-zinc-400 block">Type</span>
                  <span className="font-bold text-zinc-900 dark:text-white capitalize">
                    {myApartment?.propertyType?.toLowerCase() ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
