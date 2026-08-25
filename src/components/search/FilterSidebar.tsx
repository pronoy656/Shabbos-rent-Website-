"use client";

import { useState } from "react";
import { MapPin, Navigation, Calendar, BedDouble, Bath, DoorOpen, ChevronDown, Footprints, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterSidebarProps {
  selectedAmenities?: string[];
  maxWalkingMinutes?: number;
  onAmenityToggle?: (amenityKey: string) => void;
  onMaxWalkingMinutesChange?: (minutes: number | undefined) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

const AMENITIES_OPTIONS = [
  { key: "WiFi", labelKey: "filters.amenities_list.wifi", name: "WiFi" },
  { key: "Air Conditioning", labelKey: "filters.amenities_list.air_conditioning", name: "Air Conditioning" },
  { key: "Parking", labelKey: "filters.amenities_list.parking", name: "Parking" },
  { key: "Washing Machine", labelKey: "filters.amenities_list.washing_machine", name: "Washing Machine" },
  { key: "Kosher Kitchen", labelKey: "filters.amenities_list.kosher_kitchen", name: "Kosher Kitchen" },
  { key: "Shabbos Elevator", labelKey: "filters.amenities_list.shabbos_elevator", name: "Shabbos Elevator" },
  { key: "Shabbos Plata", labelKey: "filters.amenities_list.shabbos_plata", name: "Shabbos Plata" },
  { key: "Hot Water Urn", labelKey: "filters.amenities_list.hot_water_urn", name: "Hot Water Urn" },
  { key: "Shabbos Clock", labelKey: "filters.amenities_list.shabbos_clock", name: "Shabbos Clock" },
  { key: "Balcony", labelKey: "filters.amenities_list.balcony", name: "Balcony" },
  { key: "Sukkah Balcony", labelKey: "filters.amenities_list.sukkah_balcony", name: "Sukkah Balcony" },
  { key: "Private Garden", labelKey: "filters.amenities_list.private_garden", name: "Private Garden" },
  { key: "Baby Crib", labelKey: "filters.amenities_list.baby_crib", name: "Baby Crib" },
  { key: "Wheelchair Accessible", labelKey: "filters.amenities_list.wheelchair", name: "Wheelchair Accessible" },
  { key: "Sea View", labelKey: "filters.amenities_list.sea_view", name: "Sea View" },
  { key: "Swimming Pool", labelKey: "filters.amenities_list.swimming_pool", name: "Swimming Pool" },
  { key: "Towels & Linen", labelKey: "filters.amenities_list.towels_linen", name: "Towels & Linen" },
  { key: "Coffee Machine", labelKey: "filters.amenities_list.coffee_machine", name: "Coffee Machine" },
];

const WALKING_OPTIONS = [
  { label: "Any distance", value: undefined },
  { label: "Under 5 mins", value: 5 },
  { label: "Under 10 mins", value: 10 },
  { label: "Under 15 mins", value: 15 },
  { label: "Under 20 mins", value: 20 },
  { label: "Under 30 mins", value: 30 },
];

export default function FilterSidebar({
  selectedAmenities = [],
  maxWalkingMinutes,
  onAmenityToggle,
  onMaxWalkingMinutesChange,
  onApplyFilters,
  onClearFilters,
}: FilterSidebarProps) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState("jerusalem");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("rehavia");
  const [selectedWeekend, setSelectedWeekend] = useState("any");
  const [selectedRooms, setSelectedRooms] = useState("any");
  const [selectedBaths, setSelectedBaths] = useState("any");

  const currentWalkingOption = WALKING_OPTIONS.find((opt) => opt.value === maxWalkingMinutes) || WALKING_OPTIONS[0];

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("filters.title")}</h2>
        {(selectedAmenities.length > 0 || maxWalkingMinutes !== undefined) && (
          <button
            onClick={onClearFilters}
            className="text-xs text-[#4c55a4] hover:underline font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Walking Distance & Date Filter (Same Row, 2 Columns) */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Walking Distance Column */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Walking Distance</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer">
                <span className="truncate">{currentWalkingOption.label}</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                {WALKING_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.label}
                    onClick={() => onMaxWalkingMinutesChange?.(opt.value)}
                    className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <span>{opt.label}</span>
                    {maxWalkingMinutes === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Shabbat Date Column */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("filters.date")}</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer">
                <span className="truncate">
                  {selectedWeekend === "next"
                    ? t("search_widget.this_weekend")
                    : selectedWeekend === "following"
                    ? t("search_widget.next_weekend")
                    : `${t("search_widget.any")} ${t("search_widget.weekend")}`}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                {[
                  { value: "any", label: `${t("search_widget.any")} ${t("search_widget.weekend")}` },
                  { value: "next", label: t("search_widget.this_weekend") },
                  { value: "following", label: t("search_widget.next_weekend") },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSelectedWeekend(opt.value)}
                    className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <span>{opt.label}</span>
                    {selectedWeekend === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800 mb-6" />

      {/* Rooms & Details (Shadcn Dropdowns) */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.rooms_details")}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Rooms Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.rooms")}</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 truncate">
                  <BedDouble className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{selectedRooms === "any" ? t("search_widget.any") : `${selectedRooms}+`}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[140px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                {[
                  { value: "any", label: t("search_widget.any") },
                  { value: "1", label: t("search_widget.plus_1") },
                  { value: "2", label: t("search_widget.plus_2") },
                  { value: "3", label: t("search_widget.plus_3") },
                  { value: "4", label: t("search_widget.plus_4") },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSelectedRooms(opt.value)}
                    className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <span>{opt.label}</span>
                    {selectedRooms === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bathrooms Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.bathrooms")}</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between pl-3 pr-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all cursor-pointer">
                <div className="flex items-center gap-1.5 truncate">
                  <DoorOpen className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{selectedBaths === "any" ? t("search_widget.any") : `${selectedBaths}+`}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[140px] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-2xl z-50">
                {[
                  { value: "any", label: t("search_widget.any") },
                  { value: "1", label: t("search_widget.plus_1") },
                  { value: "2", label: t("search_widget.plus_2") },
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSelectedBaths(opt.value)}
                    className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <span>{opt.label}</span>
                    {selectedBaths === opt.value && <Check className="w-3.5 h-3.5 text-[#4c55a4]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800 mb-6" />

      {/* Property Type */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.property_type")}</h3>
        <div className="grid grid-cols-2 gap-2">
          {[t("filters.prop_types.apartment"), t("filters.prop_types.villa"), t("filters.prop_types.penthouse"), t("filters.prop_types.studio")].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors" />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.amenities")}</h3>
          {selectedAmenities.length > 0 && (
            <span className="text-xs font-bold text-[#4c55a4] bg-[#4c55a4]/10 px-2 py-0.5 rounded-full">
              {selectedAmenities.length} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5 gap-x-2">
          {AMENITIES_OPTIONS.map((item) => {
            const isChecked = selectedAmenities.includes(item.key);
            return (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onAmenityToggle?.(item.key)}
                    className="peer appearance-none w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                  />
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-xs font-medium transition-colors line-clamp-1 ${isChecked ? 'font-bold text-[#4c55a4] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                  {t(item.labelKey)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={onApplyFilters}
        className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-bold rounded-xl shadow-md shadow-[#4c55a4]/20 transition-all"
      >
        {t("filters.apply_filters")}
      </button>

    </div>
  );
}
