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
  ChevronRight,
  Trash2,
  Lock,
  Unlock,
  Activity
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { OwnerStatus } from "@/types";
import {
  useDeleteApartmentAdmin, 
  useUpdateApartmentStatus, 
  useBlockApartment, 
  ApartmentStatus,
  useGetAllApartmentsAdmin
} from "@/hooks/useAdminApartments";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendAvailabilityReminder } from "@/services/ownerService";
import type { NotificationChannel, SendReminderPayload } from "@/types/owner";
import { getImageUrl } from "@/utils/imageUrl";

export type ReminderChannel = "email_only" | "phone_only" | "both";

export type ListingConfirmationStatus = "CONFIRMED" | "PENDING" | "REJECTED" | "SUSPENDED" | "BLOCKED" | string;

interface AdminApartmentItem {
  id: string;
  ownerId: string;
  code: string;
  title: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  listingStatus: ListingConfirmationStatus;
  status: string;
  ownerStatus: OwnerStatus;
  preferredChannel: ReminderChannel;
  image?: string;
}

export default function ApartmentsPage() {
  const queryClient = useQueryClient();
  const { data: apiResponse, isLoading, refetch } = useGetAllApartmentsAdmin();
  const rawApartments = Array.isArray(apiResponse?.data) 
    ? apiResponse.data 
    : (Array.isArray(apiResponse?.data?.data) 
        ? apiResponse.data.data 
        : (Array.isArray(apiResponse) ? apiResponse : []));

  const apartments: AdminApartmentItem[] = useMemo(() => {
    return rawApartments.map((apt: any) => ({
      id: apt.id,
      ownerId: apt.userId || apt.user?.id || apt.id,
      code: apt.propertyId || apt.id.substring(0, 8),
      title: apt.title || "No Title",
      ownerName: apt.user?.username || "Unknown",
      ownerEmail: apt.user?.email || "No Email",
      ownerPhone: apt.user?.phone || "No Phone",
      city: apt.city || "Unknown",
      listingStatus: (apt.status || "PENDING").toUpperCase(),
      status: apt.status || "PENDING",
      ownerStatus: apt.upcomingAvailability?.isAvailableNextWeekend === true ? "available" :
                   apt.upcomingAvailability?.isAvailableNextWeekend === false ? "unavailable" : "pending",
      preferredChannel: (apt.user?.ownerNotificationPreference?.channel || apt.ownerNotificationPreference?.channel) === "BOTH" ? "both" :
                        (apt.user?.ownerNotificationPreference?.channel || apt.ownerNotificationPreference?.channel) === "PHONE" ? "phone_only" : "email_only",
      image: apt.coverImage || (apt.images && apt.images.length > 0 ? apt.images[0] : ""),
    }));
  }, [rawApartments]);

  
  // Mutations
  const { mutate: deleteApartment, isPending: isDeleting } = useDeleteApartmentAdmin();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateApartmentStatus();
  const { mutate: blockApartment, isPending: isBlocking } = useBlockApartment();

  // Availability Reminder Mutation (Real Backend Integration)
  const { mutate: triggerAvailabilityReminder, isPending: isSendingReminder } = useMutation({
    mutationFn: ({ ownerId, payload }: { ownerId: string; payload: SendReminderPayload }) =>
      sendAvailabilityReminder(ownerId, payload),
    onSuccess: (res) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (selectedApartmentForReminder) {
        setSentReminders((prev) => ({
          ...prev,
          [selectedApartmentForReminder.id]: {
            channel: activeModalTab,
            time: timeStr,
          },
        }));
      }
      showToast({
        title: "Availability Reminder Dispatched! ✅",
        message: res?.message || `Processed for ${selectedApartmentForReminder?.ownerName || "owner"}.`,
        type: "info",
      });
      setSelectedApartmentForReminder(null);
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to send availability reminder.";
      showToast({
        title: "Reminder Failed",
        message: errMsg,
        type: "info",
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedListingStatus, setSelectedListingStatus] = useState<string>("All Statuses");
  const [selectedOwnerStatus, setSelectedOwnerStatus] = useState<string>("All Shabbat Statuses");
  const [sentReminders, setSentReminders] = useState<Record<string, { channel: "email" | "phone"; time: string }>>({});

  // Modal State
  const [apartmentToDelete, setApartmentToDelete] = useState<AdminApartmentItem | null>(null);
  const [selectedApartmentForReminder, setSelectedApartmentForReminder] = useState<AdminApartmentItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"email" | "phone">("email");
  const [customEmailSubject, setCustomEmailSubject] = useState("Shabbat Availability Check - Shabos Rent");
  const [customEmailMessage, setCustomEmailMessage] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleOpenReminderModal = (apt: AdminApartmentItem) => {
    setSelectedApartmentForReminder(apt);
    if (apt.preferredChannel === "phone_only") {
      setActiveModalTab("phone");
    } else {
      setActiveModalTab("email");
    }
    setCustomEmailSubject(`Shabbat Availability Check - ${apt.code} (${apt.title})`);
    setCustomEmailMessage(
      `Shalom ${apt.ownerName},\n\nPlease take a quick 10 seconds to update your apartment listing (${apt.code} - "${apt.title}") availability for the upcoming Shabbat.\n\nThank you,\nShabos Rent Admin Team`
    );
  };

  const handleConfirmSendReminder = (channel: "email" | "phone") => {
    if (!selectedApartmentForReminder) return;

    const apt = selectedApartmentForReminder;
    const targetOwnerId = apt.ownerId;
    const apiChannel: NotificationChannel = channel === "email" ? "EMAIL" : "PHONE";

    triggerAvailabilityReminder({
      ownerId: targetOwnerId,
      payload: {
        channel: apiChannel,
        emailSubject: customEmailSubject,
        emailBody: customEmailMessage,
      },
    });
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

      const matchesCity = selectedCity === "All Cities" || apt.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesListingStatus =
        selectedListingStatus === "All Statuses" ||
        apt.listingStatus.toUpperCase() === selectedListingStatus.toUpperCase();

      const matchesOwnerStatus =
        selectedOwnerStatus === "All Shabbat Statuses" ||
        (selectedOwnerStatus === "Available" && apt.ownerStatus === "available") ||
        (selectedOwnerStatus === "Not Updated" && apt.ownerStatus === "pending") ||
        (selectedOwnerStatus === "Unavailable" && apt.ownerStatus === "unavailable");

      return matchesSearch && matchesCity && matchesListingStatus && matchesOwnerStatus;
    });
  }, [apartments, searchQuery, selectedCity, selectedListingStatus, selectedOwnerStatus]);

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
            Review and confirm property listings, monitor Shabbat availability status, and send reminders to owners.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          
          {/* Left Side: Search */}
          <div className="relative w-full lg:max-w-xs">
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
              placeholder="Search code, owner, email, city..."
            />
          </div>

          {/* Right Side: Filters */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* City Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[130px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none transition-colors shrink-0">
                <span>{selectedCity}</span>
                <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-500 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {["All Cities", "Jerusalem", "Tel Aviv", "Bnei Brak", "Tzfat", "Beit Shemesh", "Modiin Illit"].map((city) => (
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

            {/* Confirmation Status Filter (New!) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[155px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none transition-colors shrink-0">
                <span className="flex items-center gap-1.5 truncate">
                  Status: {selectedListingStatus}
                </span>
                <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-500 opacity-60 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("All Statuses"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold">
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("CONFIRMED"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> CONFIRMED
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("PENDING"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> PENDING
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("REJECTED"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-red-600 dark:text-red-400">
                  <X className="w-3.5 h-3.5 mr-1.5 text-red-500" /> REJECTED
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("SUSPENDED"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400">
                  <Ban className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> SUSPENDED
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedListingStatus("BLOCKED"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> BLOCKED
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Owner Shabbat Availability Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[170px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none transition-colors shrink-0">
                <span className="flex items-center gap-1.5 truncate">
                  Shabbat: {selectedOwnerStatus}
                </span>
                <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-500 opacity-60 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem onClick={() => { setSelectedOwnerStatus("All Shabbat Statuses"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold">
                  All Shabbat Statuses
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
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Photo</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Code / Title</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Owner Info</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">City</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Shabbat Availability</th>
                <th className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading apartments data from server...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedApartments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    No apartments match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedApartments.map((apt) => {
                  const reminderState = sentReminders[apt.id];

                  return (
                    <tr key={apt.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Photo */}
                      <td className="px-5 py-4">
                        <div className="h-11 w-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {apt.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={getImageUrl(apt.image)} alt={apt.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Code / Title */}
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-zinc-900 dark:text-white text-sm">{apt.code}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-[180px] mt-0.5">{apt.title}</div>
                      </td>

                      {/* Owner Info Only (Name & Email) */}
                      <td className="px-5 py-4">
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
                      <td className="px-5 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {apt.city}
                      </td>

                      {/* Listing Confirmation Status (NEW!) */}
                      <td className="px-5 py-4">
                        {apt.listingStatus === "CONFIRMED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-extrabold shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            CONFIRMED
                          </span>
                        )}

                        {apt.listingStatus === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-extrabold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            PENDING
                          </span>
                        )}

                        {apt.listingStatus === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full text-xs font-extrabold shadow-sm">
                            <X className="w-3.5 h-3.5 text-red-500" />
                            REJECTED
                          </span>
                        )}

                        {apt.listingStatus === "SUSPENDED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-full text-xs font-extrabold shadow-sm">
                            <Ban className="w-3.5 h-3.5 text-orange-500" />
                            SUSPENDED
                          </span>
                        )}

                        {apt.listingStatus === "BLOCKED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-full text-xs font-extrabold shadow-sm">
                            <Lock className="w-3.5 h-3.5 text-rose-500" />
                            BLOCKED
                          </span>
                        )}

                        {apt.listingStatus !== "CONFIRMED" &&
                         apt.listingStatus !== "PENDING" &&
                         apt.listingStatus !== "REJECTED" &&
                         apt.listingStatus !== "SUSPENDED" &&
                         apt.listingStatus !== "BLOCKED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-extrabold">
                            {apt.listingStatus}
                          </span>
                        )}
                      </td>

                      {/* Shabbat Availability Status */}
                      <td className="px-5 py-4">
                        {apt.ownerStatus === "available" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </span>
                        )}

                        {apt.ownerStatus === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            Not Updated
                          </span>
                        )}

                        {apt.ownerStatus === "unavailable" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Unavailable
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Accept Button for Pending listings */}
                          {apt.listingStatus === "PENDING" && (
                            <button
                              onClick={() => {
                                updateStatus(
                                  { id: apt.id, status: "CONFIRMED" },
                                  {
                                    onSuccess: () => {
                                      showToast({
                                        title: "Listing Confirmed! ✅",
                                        message: `Apartment "${apt.title}" is now confirmed.`,
                                        type: "success",
                                      });
                                    },
                                  }
                                );
                              }}
                              disabled={isUpdatingStatus}
                              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
                              title="Accept & Confirm Listing"
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Accept
                            </button>
                          )}

                          <Link 
                            href={`/dashboard/apartments/${apt.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors shrink-0"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </Link>
                                                 {/* Availability Reminder Button */}
                          <button
                            onClick={() => handleOpenReminderModal(apt)}
                            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 ${
                              reminderState
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/60 active:scale-95"
                            }`}
                            title="Send Shabbat Availability Reminder to Owner"
                          >
                            {reminderState ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Reminded</span>
                              </>
                            ) : (
                              <>
                                <BellRing className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Remind</span>
                              </>
                            )}
                          </button>

                          <button 
                            onClick={() => setApartmentToDelete(apt)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                            title="Delete Apartment"
                          >
                            <Trash2 className="h-4 w-4" />
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
                  <BellRing className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Shabbat Availability Reminder
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-medium">
                  Send a Shabbat availability update request to owner <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApartmentForReminder.ownerName}</span> for <span className="font-semibold">{selectedApartmentForReminder.code} - {selectedApartmentForReminder.title}</span>
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
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={customEmailSubject}
                    onChange={(e) => setCustomEmailSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Custom Email Draft Message
                  </label>
                  <textarea
                    rows={6}
                    value={customEmailMessage}
                    onChange={(e) => setCustomEmailMessage(e.target.value)}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium leading-relaxed text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSelectedApartmentForReminder(null)}
                    className="px-5 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSendingReminder}
                    onClick={() => handleConfirmSendReminder("email")}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSendingReminder ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Email Reminder</span>
                      </>
                    )}
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
                    className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSendingReminder}
                    onClick={() => handleConfirmSendReminder("phone")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    {isSendingReminder ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initiating...</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Initiate Voice Call Reminder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {apartmentToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h3 className="text-xl font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Confirm Deletion
              </h3>
              <button
                onClick={() => setApartmentToDelete(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-8">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                Are you absolutely sure you want to delete the apartment listing for <strong className="text-zinc-900 dark:text-white">{apartmentToDelete.title}</strong> (Code: {apartmentToDelete.code})?
              </p>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  This action cannot be undone. All data associated with this listing will be permanently removed from the system.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setApartmentToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteApartment(apartmentToDelete.id, {
                    onSuccess: () => {
                      showToast({ title: "Deleted", message: "Apartment successfully deleted", type: "success" });
                      setApartmentToDelete(null);
                    },
                    onError: (err: any) => {
                      showToast({ title: "Error", message: err?.message || "Failed to delete apartment", type: "info" });
                    }
                  });
                }}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
