"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ChevronDown, 
  Eye, 
  Ban, 
  Image as ImageIcon,
  BellRing,
  CheckCircle2,
  Mail,
  User,
  PhoneCall,
  Phone,
  X,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { OwnerStatus } from "@/types";

export type ReminderChannel = "email_only" | "phone_only" | "both";

interface AdminApartmentItem {
  id: string;
  code: string;
  title: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  status: "Active" | "Suspended";
  ownerStatus: OwnerStatus;
  preferredChannel: ReminderChannel;
  image?: string;
}

const initialApartments: AdminApartmentItem[] = [
  {
    id: "A-101",
    code: "A-101",
    title: "Luxury Penthouse near Beach",
    ownerName: "David Cohen",
    ownerEmail: "david.cohen@gmail.com",
    ownerPhone: "+972 54-123-4567",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "available",
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
  },
  {
    id: "A-102",
    code: "A-102",
    title: "Spacious Family Apartment in Rehavia",
    ownerName: "Rachel Levi",
    ownerEmail: "rachel.levi@outlook.com",
    ownerPhone: "+972 52-987-6543",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "pending", // Gray: Not Updated
    preferredChannel: "both", // Email + Phone
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  },
  {
    id: "A-103",
    code: "A-103",
    title: "Cozy Studio near City Center",
    ownerName: "Moshe Klein",
    ownerEmail: "moshe.k@yahoo.com",
    ownerPhone: "+972 50-456-7890",
    city: "Bnei Brak",
    status: "Active",
    ownerStatus: "unavailable", // Red: Unavailable
    preferredChannel: "phone_only",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  },
  {
    id: "A-104",
    code: "A-104",
    title: "Old City Heritage Stone House",
    ownerName: "Sarah Friedman",
    ownerEmail: "sarah.f@gmail.com",
    ownerPhone: "+972 53-111-2233",
    city: "Tzfat",
    status: "Active",
    ownerStatus: "pending", // Gray: Not Updated
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&q=80",
  },
  {
    id: "A-105",
    code: "A-105",
    title: "Modern Apartment with Sea View",
    ownerName: "Yossi Stern",
    ownerEmail: "yossi.stern@gmail.com",
    ownerPhone: "+972 58-777-8899",
    city: "Tel Aviv",
    status: "Active",
    ownerStatus: "available",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: "A-106",
    code: "A-106",
    title: "Quiet Villa in Geula",
    ownerName: "Chaim Weiss",
    ownerEmail: "chaim.w@gmail.com",
    ownerPhone: "+972 54-333-4455",
    city: "Jerusalem",
    status: "Suspended",
    ownerStatus: "pending", // Gray: Not Updated
    preferredChannel: "phone_only",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
  },
  {
    id: "A-107",
    code: "A-107",
    title: "Boutique Duplex with Sun Terrace",
    ownerName: "Avrum Shapiro",
    ownerEmail: "avrum.s@gmail.com",
    ownerPhone: "+972 52-222-3344",
    city: "Tel Aviv",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=400&q=80",
  },
  {
    id: "A-108",
    code: "A-108",
    title: "Garden Apartment near Synagogue",
    ownerName: "Miriam Katz",
    ownerEmail: "miriam.k@outlook.com",
    ownerPhone: "+972 50-666-5544",
    city: "Bnei Brak",
    status: "Active",
    ownerStatus: "available",
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80",
  },
  {
    id: "A-109",
    code: "A-109",
    title: "Artistic Loft in Artists Quarter",
    ownerName: "Eliezer Greenberg",
    ownerEmail: "eliezer.g@yahoo.com",
    ownerPhone: "+972 53-888-9900",
    city: "Tzfat",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "phone_only",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80",
  },
  {
    id: "A-110",
    code: "A-110",
    title: "Penthouse overlooking Kotel Plaza",
    ownerName: "Shimon Schwartz",
    ownerEmail: "shimon.s@gmail.com",
    ownerPhone: "+972 54-999-1122",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "unavailable",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
  },
  {
    id: "A-111",
    code: "A-111",
    title: "Beachfront Suite with Kosher Dining",
    ownerName: "Rivka Adler",
    ownerEmail: "rivka.a@gmail.com",
    ownerPhone: "+972 58-123-9988",
    city: "Tel Aviv",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  },
  {
    id: "A-112",
    code: "A-112",
    title: "Family Residence in Har Nof",
    ownerName: "Baruch Goldberg",
    ownerEmail: "baruch.g@gmail.com",
    ownerPhone: "+972 52-444-5566",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "available",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  },
  {
    id: "A-113",
    code: "A-113",
    title: "Central Apartment near Main Shul",
    ownerName: "Tzipora Rosenberg",
    ownerEmail: "tzipora.r@outlook.com",
    ownerPhone: "+972 50-111-4477",
    city: "Bnei Brak",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "phone_only",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&q=80",
  },
  {
    id: "A-114",
    code: "A-114",
    title: "Galilee Mountain View Villa",
    ownerName: "Noam Feldmann",
    ownerEmail: "noam.f@gmail.com",
    ownerPhone: "+972 53-333-2211",
    city: "Tzfat",
    status: "Active",
    ownerStatus: "available",
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: "A-115",
    code: "A-115",
    title: "Historic Apartment in German Colony",
    ownerName: "Leah Bronstein",
    ownerEmail: "leah.b@gmail.com",
    ownerPhone: "+972 54-555-6677",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
  },
  {
    id: "A-116",
    code: "A-116",
    title: "Modern Seafront Studio",
    ownerName: "Gadi Eisenberg",
    ownerEmail: "gadi.e@yahoo.com",
    ownerPhone: "+972 58-666-3322",
    city: "Tel Aviv",
    status: "Active",
    ownerStatus: "unavailable",
    preferredChannel: "phone_only",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=400&q=80",
  },
  {
    id: "A-117",
    code: "A-117",
    title: "Spacious Kosher Apartment in Ramat Shlomo",
    ownerName: "Yitzchak Levin",
    ownerEmail: "yitzchak.l@gmail.com",
    ownerPhone: "+972 52-888-4433",
    city: "Jerusalem",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "email_only",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80",
  },
  {
    id: "A-118",
    code: "A-118",
    title: "Quiet Retreat in Old City Tzfat",
    ownerName: "Esther Marcus",
    ownerEmail: "esther.m@gmail.com",
    ownerPhone: "+972 50-777-1122",
    city: "Tzfat",
    status: "Active",
    ownerStatus: "pending",
    preferredChannel: "both",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80",
  },
];

export default function ApartmentsPage() {
  const [apartments] = useState<AdminApartmentItem[]>(initialApartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedOwnerStatus, setSelectedOwnerStatus] = useState<string>("All Statuses");
  const [sentReminders, setSentReminders] = useState<Record<string, { channel: "email" | "phone"; time: string }>>({});

  // Modal State
  const [selectedApartmentForReminder, setSelectedApartmentForReminder] = useState<AdminApartmentItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"email" | "phone">("email");
  const [customEmailMessage, setCustomEmailMessage] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleOpenReminderModal = (apt: AdminApartmentItem) => {
    setSelectedApartmentForReminder(apt);
    // Set default tab based on owner's preference
    if (apt.preferredChannel === "phone_only") {
      setActiveModalTab("phone");
    } else {
      setActiveModalTab("email");
    }
    setCustomEmailMessage(
      `Shalom ${apt.ownerName},\n\nPlease take a quick 10 seconds to update your apartment listing (${apt.code} - "${apt.title}") availability for the upcoming Shabbat.\n\nClick the link below to confirm if your apartment is available or occupied.\n\nThank you,\nShabos Rent Admin Team`
    );
  };

  const handleConfirmSendReminder = (channel: "email" | "phone") => {
    if (!selectedApartmentForReminder) return;

    const apt = selectedApartmentForReminder;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSentReminders((prev) => ({
      ...prev,
      [apt.id]: { channel, time: timeStr },
    }));

    if (channel === "email") {
      showToast({
        title: "Email Reminder Sent! ✉️",
        message: `Shabbat availability reminder email sent to ${apt.ownerName} (${apt.ownerEmail}).`,
        type: "info",
      });
    } else {
      showToast({
        title: "Voice Call Initiated! 📞",
        message: `Automated voice reminder call triggered to ${apt.ownerName} at ${apt.ownerPhone}.`,
        type: "info",
      });
    }

    setSelectedApartmentForReminder(null);
  };

  // Filtered List
  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      const matchesSearch =
        searchQuery === "" ||
        apt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === "All Cities" || apt.city === selectedCity;

      const matchesOwnerStatus =
        selectedOwnerStatus === "All Statuses" ||
        (selectedOwnerStatus === "Available" && apt.ownerStatus === "available") ||
        (selectedOwnerStatus === "Not Updated" && apt.ownerStatus === "pending") ||
        (selectedOwnerStatus === "Unavailable" && apt.ownerStatus === "unavailable");

      return matchesSearch && matchesCity && matchesOwnerStatus;
    });
  }, [apartments, searchQuery, selectedCity, selectedOwnerStatus]);

  // Reset to page 1 on filter changes
  const totalPages = Math.ceil(filteredApartments.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedApartments = filteredApartments.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Apartments Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor property availability status and send Shabbat availability update reminders to owners via Email or Phone Call.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          
          {/* Left Side: Search */}
          <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-colors"
              placeholder="Search by code, owner, email, city..."
            />
          </div>

          {/* Right Side: Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {/* City Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[140px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0">
                <span>{selectedCity}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {["All Cities", "Jerusalem", "Tel Aviv", "Bnei Brak", "Tzfat"].map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer rounded-lg text-xs font-semibold"
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Owner Availability Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[170px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0">
                <span className="flex items-center gap-1.5">
                  Status: {selectedOwnerStatus}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem onClick={() => { setSelectedOwnerStatus("All Statuses"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold">
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedOwnerStatus("Available"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  🟢 Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedOwnerStatus("Not Updated"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  ⚪ Not Updated (Pending)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedOwnerStatus("Unavailable"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-red-600 dark:text-red-400">
                  🔴 Unavailable
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-white font-bold text-xs">
              <tr>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Photo</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Code / Title</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Owner Info</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">City</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Shabbat Availability Status</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedApartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    No apartments match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedApartments.map((apt) => {
                  const reminderState = sentReminders[apt.id];

                  return (
                    <tr key={apt.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Photo */}
                      <td className="px-6 py-4">
                        <div className="h-11 w-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {apt.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={apt.image} alt={apt.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Code / Title */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-zinc-900 dark:text-white text-sm">{apt.code}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-[200px] mt-0.5">{apt.title}</div>
                      </td>

                      {/* Owner Info Only (Name & Email) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{apt.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span>{apt.ownerEmail}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {apt.city}
                      </td>

                      {/* Shabbat Availability Status */}
                      <td className="px-6 py-4">
                        {apt.ownerStatus === "available" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-extrabold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            🟢 Available
                          </span>
                        )}

                        {apt.ownerStatus === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-extrabold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-zinc-400" />
                            ⚪ Not Updated
                          </span>
                        )}

                        {apt.ownerStatus === "unavailable" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full text-xs font-extrabold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            🔴 Unavailable
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/dashboard/apartments/${apt.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Link>

                          {/* Send Reminder Button - Specific for ⚪ Not Updated rows */}
                          {apt.ownerStatus === "pending" && (
                            <button
                              onClick={() => handleOpenReminderModal(apt)}
                              className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
                                reminderState
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/60 active:scale-95"
                              }`}
                            >
                              {reminderState ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Sent ({reminderState.channel})</span>
                                </>
                              ) : (
                                <>
                                  <BellRing className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                  <span>Send Reminder</span>
                                </>
                              )}
                            </button>
                          )}

                          <button 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Suspend Apartment"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredApartments.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Showing <span className="font-bold text-zinc-900 dark:text-white">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-zinc-900 dark:text-white">{Math.min(startIndex + pageSize, filteredApartments.length)}</span> of{" "}
              <span className="font-bold text-zinc-900 dark:text-white">{filteredApartments.length}</span> apartments
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-[#4c55a4] text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Send Availability Reminder Modal */}
      {selectedApartmentForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
                  <BellRing className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Send Availability Reminder
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-medium">
                  Send a Shabbat availability update request to owner <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApartmentForReminder.ownerName}</span> ({selectedApartmentForReminder.code})
                </p>
              </div>

              <button
                onClick={() => setSelectedApartmentForReminder(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Registered Preferences Note */}
            <div className="mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                Registered Owner Communication Preference:
              </div>
              <div>
                {selectedApartmentForReminder.preferredChannel === "email_only" && (
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Mail className="w-3.5 h-3.5" /> Email Only
                  </span>
                )}
                {selectedApartmentForReminder.preferredChannel === "phone_only" && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <PhoneCall className="w-3.5 h-3.5" /> Phone Call Only
                  </span>
                )}
                {selectedApartmentForReminder.preferredChannel === "both" && (
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-3.5 h-3.5" /> Accepts Email & Phone
                  </span>
                )}
              </div>
            </div>

            {/* Reminder Channel Options Tabs */}
            <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl mb-6 border border-zinc-200/80 dark:border-zinc-700/50">
              <button
                type="button"
                onClick={() => setActiveModalTab("email")}
                disabled={selectedApartmentForReminder.preferredChannel === "phone_only"}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  activeModalTab === "email"
                    ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email Reminder</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("phone")}
                disabled={selectedApartmentForReminder.preferredChannel === "email_only"}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  activeModalTab === "phone"
                    ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Voice Call Reminder</span>
              </button>
            </div>

            {/* Email Tab Content */}
            {activeModalTab === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Recipient Email Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedApartmentForReminder.ownerEmail}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Custom Email Draft Message
                  </label>
                  <textarea
                    rows={7}
                    value={customEmailMessage}
                    onChange={(e) => setCustomEmailMessage(e.target.value)}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium leading-relaxed text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSelectedApartmentForReminder(null)}
                    className="px-5 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmSendReminder("email")}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email Reminder</span>
                  </button>
                </div>
              </div>
            )}

            {/* Phone Call Tab Content */}
            {activeModalTab === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Owner Phone Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedApartmentForReminder.ownerPhone}
                    className="w-full px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-400"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Automated Voice Call Message Script</span>
                  </div>
                  <p className="text-xs text-emerald-950/80 dark:text-emerald-200/80 leading-relaxed italic">
                    "Shalom {selectedApartmentForReminder.ownerName}! This is Shabos Rent calling to check if your apartment ({selectedApartmentForReminder.code}) is available for the upcoming Shabbat. Press 1 for Available, Press 2 for Unavailable."
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSelectedApartmentForReminder(null)}
                    className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmSendReminder("phone")}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Initiate Voice Call Reminder</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
