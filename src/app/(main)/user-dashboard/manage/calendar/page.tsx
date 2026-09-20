"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Check,
  Star,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useMyApartment,
  useApartmentAvailabilities,
  useAddApartmentAvailability,
  useBulkSetApartmentAvailability,
  useSetApartmentSpecialPrice,
} from "@/hooks/useApartments";
import { useWeekendCalendars } from "@/hooks/useWeekendCalendar";
import { toast } from "sonner";
import { SHABBATOT } from "@/components/dashboard/dashboardData";

export default function ApartmentCalendarPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: myApartment } = useMyApartment();

  const [selectedShabbatot, setSelectedShabbatot] = useState<string[]>([]);
  const [specialShabbatot, setSpecialShabbatot] = useState<string[]>([]);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);

  // Weekend Calendar API Query
  const { data: weekendCalendarsRaw } = useWeekendCalendars();
  const rawData = weekendCalendarsRaw as any;
  const weekendCalendarsList: any[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.data?.data)
    ? rawData.data.data
    : [];

  const displayShabbatot =
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

  // Scheduled Availability API Query
  const { data: myAvailabilitiesData } = useApartmentAvailabilities(myApartment?.id || "");

  const addAvailabilityMutation = useAddApartmentAvailability();
  const bulkSetAvailabilityMutation = useBulkSetApartmentAvailability();
  const setSpecialPriceMutation = useSetApartmentSpecialPrice();

  // Sync scheduled availability from backend response
  useEffect(() => {
    if (
      myAvailabilitiesData?.data &&
      Array.isArray(myAvailabilitiesData.data) &&
      myAvailabilitiesData.data.length > 0
    ) {
      const activeWeekendIds: string[] = [];
      const specialWeekendIds: string[] = [];

      myAvailabilitiesData.data.forEach((item: any) => {
        const wkndId = item.weekendId || item.id;
        if (wkndId) {
          activeWeekendIds.push(wkndId);
          if (item.isSpecial) {
            specialWeekendIds.push(wkndId);
          }
        }
      });

      if (activeWeekendIds.length > 0) {
        setSelectedShabbatot(activeWeekendIds);
        if (specialWeekendIds.length > 0) {
          setSpecialShabbatot(specialWeekendIds);
        }
      }
    } else if (typeof window !== "undefined") {
      const savedShabbatot = localStorage.getItem("selectedShabbatot");
      if (savedShabbatot) {
        try {
          setSelectedShabbatot(JSON.parse(savedShabbatot));
        } catch {}
      }
      const savedSpecial = localStorage.getItem("specialShabbatot");
      if (savedSpecial) {
        try {
          setSpecialShabbatot(JSON.parse(savedSpecial));
        } catch {}
      }
    }
  }, [myAvailabilitiesData]);

  const handleSaveAvailability = async () => {
    if (!myApartment?.id) {
      // If local apartment only, save locally
      localStorage.setItem("selectedShabbatot", JSON.stringify(selectedShabbatot));
      localStorage.setItem("specialShabbatot", JSON.stringify(specialShabbatot));
      toast.success("Apartment availability updated successfully!");
      return;
    }

    setIsSavingAvailability(true);
    try {
      if (selectedShabbatot.length === 1) {
        await addAvailabilityMutation.mutateAsync({
          apartmentId: myApartment.id,
          weekendId: selectedShabbatot[0],
        });
      } else {
        await bulkSetAvailabilityMutation.mutateAsync({
          apartmentId: myApartment.id,
          weekendIds: selectedShabbatot,
        });
      }

      for (const specialWkndId of specialShabbatot) {
        if (selectedShabbatot.includes(specialWkndId)) {
          try {
            await setSpecialPriceMutation.mutateAsync({
              apartmentId: myApartment.id,
              weekendId: specialWkndId,
              isSpecial: true,
              specialPrice:
                myApartment.specialShabbatPrice ||
                Math.round((myApartment.pricePerShabbat || 1000) * 1.2),
            });
          } catch (e) {
            console.error("Failed to set special price for weekend:", specialWkndId, e);
          }
        }
      }

      localStorage.setItem("selectedShabbatot", JSON.stringify(selectedShabbatot));
      localStorage.setItem("specialShabbatot", JSON.stringify(specialShabbatot));
      if (myApartment?.id) {
        queryClient.invalidateQueries({
          queryKey: ["apartment-availabilities", myApartment.id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["apartments", "my"] });
      toast.success("Apartment availability updated successfully!");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : "Failed to save availability.";
      toast.error(errorMsg || "Failed to save availability.");
    } finally {
      setIsSavingAvailability(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar Grid Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm w-full">
        <div className="mb-8 flex items-start gap-4">
          <CalendarCheck className="w-7 h-7 text-[#4c55a4] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">
              {t("dashboard.manage.manage_availability") || "Manage Availability"}
            </h3>
            <p className="text-[15px] text-zinc-500">
              {t("dashboard.manage.mark_shabatot") || "Select the Shabbatot when your apartment is available to rent."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayShabbatot.map((shabbat, index) => {
            const isSelected = selectedShabbatot.includes(shabbat.id);
            const isSpecial = specialShabbatot.includes(shabbat.id);
            const isUpcoming = index === 0;

            // Colors based on state
            const borderColor = isSpecial
              ? "border-amber-400"
              : isSelected
              ? "border-[#8B5CF6]"
              : "border-transparent";
            const bgColor = isSpecial
              ? "bg-amber-50 dark:bg-amber-900/10"
              : "bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/15";
            const hoverBorder = isSpecial
              ? "hover:border-amber-500"
              : "hover:border-[#8B5CF6]/40 dark:hover:border-[#8B5CF6]/40";
            const shadow = isSpecial
              ? "shadow-sm shadow-amber-400/20"
              : isSelected
              ? "shadow-sm shadow-[#8B5CF6]/10"
              : "";

            return (
              <div key={shabbat.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShabbatot((prev) =>
                      prev.includes(shabbat.id)
                        ? prev.filter((id) => id !== shabbat.id)
                        : [...prev, shabbat.id]
                    );
                  }}
                  className={`w-full relative text-left p-5 rounded-2xl border-2 transition-all duration-200 h-32 flex flex-col justify-end cursor-pointer ${bgColor} ${borderColor} ${hoverBorder} ${shadow}`}
                >
                  {isUpcoming && (
                    <span
                      className={`absolute top-4 left-4 text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase ${
                        isSpecial
                          ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                          : "bg-[#E0E7FF] dark:bg-indigo-900/50 text-[#4c55a4] dark:text-indigo-300"
                      }`}
                    >
                      {t("dashboard.manage.upcoming_shabbat") || "Upcoming Shabbat"}
                    </span>
                  )}

                  {isSelected && !isSpecial && (
                    <div className="absolute top-4 right-4 bg-[#8B5CF6] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="mt-auto pr-2">
                    <h4 className="font-extrabold text-zinc-900 dark:text-white text-[17px] leading-tight mb-1">
                      {shabbat.name}
                    </h4>
                    <p className="text-sm text-zinc-500 font-semibold">{shabbat.date}</p>
                  </div>
                </button>

                {/* Star Button for Special Shabbos */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpecialShabbatot((prev) => {
                      const next = prev.includes(shabbat.id)
                        ? prev.filter((id) => id !== shabbat.id)
                        : [...prev, shabbat.id];

                      // Automatically mark as available if marked as special
                      if (!prev.includes(shabbat.id) && !selectedShabbatot.includes(shabbat.id)) {
                        setSelectedShabbatot((s) => [...s, shabbat.id]);
                      }
                      return next;
                    });
                  }}
                  className={`absolute top-3 p-1.5 rounded-full transition-all duration-200 z-10 cursor-pointer ${
                    isSelected && !isSpecial ? "right-12" : "right-3"
                  } ${
                    isSpecial
                      ? "text-amber-500 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                      : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 opacity-0 group-hover:opacity-100"
                  }`}
                  title="Mark as Special Shabbos"
                >
                  <Star className={`w-4 h-4 ${isSpecial ? "fill-current" : ""}`} />
                </button>

                {isSpecial && (
                  <span className="absolute bottom-4 right-4 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    Special Price
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              const saved = localStorage.getItem("selectedShabbatot");
              if (saved) {
                try {
                  setSelectedShabbatot(JSON.parse(saved));
                } catch {}
              } else {
                setSelectedShabbatot([]);
              }

              const savedSpecial = localStorage.getItem("specialShabbatot");
              if (savedSpecial) {
                try {
                  setSpecialShabbatot(JSON.parse(savedSpecial));
                } catch {}
              } else {
                setSpecialShabbatot([]);
              }
              toast.info("Changes discarded");
            }}
            className="px-6 py-3 rounded-xl font-bold text-[15px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSaveAvailability}
            disabled={isSavingAvailability}
            className="px-8 py-3 rounded-xl font-bold text-[15px] text-white bg-[#4c55a4] hover:bg-[#3d4484] shadow-md shadow-[#4c55a4]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSavingAvailability && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Save Availability
          </button>
        </div>
      </div>
    </div>
  );
}
