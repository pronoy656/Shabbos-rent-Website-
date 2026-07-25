"use client";

import { MapPin, Navigation, Calendar, BedDouble, Bath, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface FilterSidebarProps {
  selectedAmenities?: string[];
  onAmenityToggle?: (amenityKey: string) => void;
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

export default function FilterSidebar({
  selectedAmenities = [],
  onAmenityToggle,
  onApplyFilters,
  onClearFilters,
}: FilterSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("filters.title")}</h2>
        {selectedAmenities.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-[#4c55a4] hover:underline font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.location")}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.city")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-zinc-400" />
              </div>
              <select className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="jerusalem">{t("search_widget.jerusalem")}</option>
                <option value="tel-aviv">{t("search_widget.tel_aviv")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.neighborhood")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Navigation className="h-4 w-4 text-zinc-400" />
              </div>
              <select className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="rehavia">{t("search_widget.rehavia")}</option>
                <option value="geula">{t("search_widget.geula")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800 mb-6" />

      {/* Date */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.date")}</h3>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.weekend")}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-zinc-400" />
            </div>
            <select className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="any">{t("search_widget.any")} {t("search_widget.weekend")}</option>
              <option value="next">{t("search_widget.this_weekend")}</option>
              <option value="following">{t("search_widget.next_weekend")}</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800 mb-6" />

      {/* Rooms & Details */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t("filters.rooms_details")}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.rooms")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BedDouble className="h-4 w-4 text-zinc-400" />
              </div>
              <select className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="any">{t("search_widget.any")}</option>
                <option value="1">{t("search_widget.plus_1")}</option>
                <option value="2">{t("search_widget.plus_2")}</option>
                <option value="3">{t("search_widget.plus_3")}</option>
                <option value="4">{t("search_widget.plus_4")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("search_widget.bathrooms")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bath className="h-4 w-4 text-zinc-400" />
              </div>
              <select className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="any">{t("search_widget.any")}</option>
                <option value="1">{t("search_widget.plus_1")}</option>
                <option value="2">{t("search_widget.plus_2")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
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
        <div className="flex flex-col gap-2.5">
          {AMENITIES_OPTIONS.map((item) => {
            const isChecked = selectedAmenities.includes(item.key);
            return (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onAmenityToggle?.(item.key)}
                    className="peer appearance-none w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-[#4c55a4] checked:border-[#4c55a4] transition-colors"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors ${isChecked ? 'font-bold text-[#4c55a4] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
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
