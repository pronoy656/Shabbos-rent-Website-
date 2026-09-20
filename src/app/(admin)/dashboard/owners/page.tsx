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
  CalendarCheck,
  DollarSign,
  Mail,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  BellRing,
  Send,
  ArrowLeft,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Clock,
  User,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { useAllOwners, useSendAvailabilityReminder, useSendPaymentDueReminder } from "@/hooks/useAdminOwners";
import type { NotificationChannel } from "@/types/owner";
import { Skeleton } from "@/components/ui/skeleton";

export default function OwnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDueFilter, setSelectedDueFilter] = useState("All Owners");
  const [errorModal, setErrorModal] = useState<{isOpen: boolean, message: string}>({ isOpen: false, message: "" });
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, message: string}>({ isOpen: false, title: "", message: "" });

  const { data: ownersData, isLoading } = useAllOwners({ limit: 1000 });
  const owners = ownersData?.data || [];

  const sendAvailMutation = useSendAvailabilityReminder();
  const sendPaymentMutation = useSendPaymentDueReminder();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Interactive Modal State
  const [selectedOwnerForReminder, setSelectedOwnerForReminder] = useState<any | null>(null);
  const [selectedOwnerForChannelDetails, setSelectedOwnerForChannelDetails] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState<"availability" | "due_payment" | null>(null);
  const [selectedChannelTab, setSelectedChannelTab] = useState<NotificationChannel>("EMAIL");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [customVoiceScript, setCustomVoiceScript] = useState("");

  const handleCopyText = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenReminderModal = (owner: any) => {
    const preferredDay = owner.ownerNotificationPreference?.preferredDay;
    
    if (preferredDay) {
      const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      const currentDay = days[new Date().getDay()];
      
      if (preferredDay !== currentDay) {
        setErrorModal({ 
          isOpen: true, 
          message: `This owner only accepts reminders on ${preferredDay}. Today is ${currentDay}. Reminders cannot be sent today.` 
        });
        return;
      }
    }

    setSelectedOwnerForReminder(owner);
    setReminderType(null); // Step 1: User selects reminder type
  };

  const handleSelectReminderType = (type: "availability" | "due_payment") => {
    if (!selectedOwnerForReminder) return;
    setReminderType(type);

    const ownerName = selectedOwnerForReminder.username || selectedOwnerForReminder.name || "Owner";
    const defaultChannel = (selectedOwnerForReminder.ownerNotificationPreference?.channel ||
      selectedOwnerForReminder.notificationPreference ||
      "EMAIL") as NotificationChannel;
    setSelectedChannelTab(defaultChannel);

    if (type === "due_payment") {
      const due = selectedOwnerForReminder.financials?.totalDue ?? 0;
      setCustomSubject("Pending Platform Fee - Shabos Rent");
      setCustomMessage(
        `Shalom ${ownerName},\n\nThis is a friendly reminder regarding your pending platform due balance of ₪${due}.\n\nPlease settle your payment at your earliest convenience to keep your listings active.\n\nThank you,\nShabos Rent Finance Team`
      );
      setCustomVoiceScript(
        `Shalom ${ownerName}, this is an automated reminder from Shabos Rent regarding your pending platform fee balance of ${due} shekels. Please visit your host dashboard to complete the payment. Press 1 to acknowledge.`
      );
    } else {
      setCustomSubject("Shabbat Availability Update - Shabos Rent");
      setCustomMessage(
        `Shalom ${ownerName},\n\nPlease take a moment to update the availability status for your property listings on Shabos Rent for the upcoming Shabbat.\n\nThank you,\nShabos Rent Admin Team`
      );
      setCustomVoiceScript(
        `Shalom ${ownerName}, this is an automated Shabbat reminder from Shabos Rent. Please update your property availability for the upcoming Shabbat. Press 1 to confirm availability, or press 2 if booked.`
      );
    }
  };

  const handleConfirmSendReminder = () => {
    if (!selectedOwnerForReminder || !reminderType) return;

    const owner = selectedOwnerForReminder;
    const channel = selectedChannelTab;

    if (reminderType === "availability") {
      sendAvailMutation.mutate(
        {
          ownerId: owner.id,
          payload: {
            emailSubject: customSubject,
            emailBody: customMessage,
            channel: channel
          }
        },
        {
          onSuccess: (res: any) => {
            const channelName = channel === "BOTH" ? "Email & Phone Call" : channel === "PHONE" ? "Phone Call (Voice IVR)" : "Email";
            const serverMessage = res?.message || `Availability reminder dispatched successfully via ${channelName}.`;
            setSuccessModal({
              isOpen: true,
              title: "Availability Reminder Sent!",
              message: serverMessage
            });
            setSelectedOwnerForReminder(null);
            setReminderType(null);
          },
          onError: (err: any) => {
            const errMsg = err?.response?.data?.message || err?.message || "Failed to send reminder";
            setErrorModal({ isOpen: true, message: errMsg });
          }
        }
      );
    } else {
      const due = owner.financials?.totalDue ?? 0;
      sendPaymentMutation.mutate(
        {
          ownerId: owner.id,
          payload: {
            emailSubject: customSubject,
            emailBody: customMessage,
            amount: due,
            channel: channel
          }
        },
        {
          onSuccess: (res: any) => {
            const channelName = channel === "BOTH" ? "Email & Phone Call" : channel === "PHONE" ? "Phone Call (Voice IVR)" : "Email";
            const serverMessage = res?.message || `Payment due reminder of ₪${due} dispatched successfully via ${channelName}.`;
            setSuccessModal({
              isOpen: true,
              title: "Payment Reminder Sent!",
              message: serverMessage
            });
            setSelectedOwnerForReminder(null);
            setReminderType(null);
          },
          onError: (err: any) => {
            const errMsg = err?.response?.data?.message || err?.message || "Failed to send payment reminder";
            setErrorModal({ isOpen: true, message: errMsg });
          }
        }
      );
    }
  };

  // Filter Owners
  const filteredOwners = useMemo(() => {
    return owners.filter((owner: any) => {
      const matchesSearch =
        (owner.username || owner.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.phone || "").toLowerCase().includes(searchQuery.toLowerCase());

      const due = owner.financials?.totalDue ?? 0;
      let matchesDue = true;
      if (selectedDueFilter === "Has Pending Due") {
        matchesDue = due > 0;
      } else if (selectedDueFilter === "Zero Balance") {
        matchesDue = due === 0;
      }

      return matchesSearch && matchesDue;
    });
  }, [owners, searchQuery, selectedDueFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredOwners.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOwners = filteredOwners.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Apartment Owners
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage registered hosts, delivery channels, and trigger automated reminders.
          </p>
        </div>

        {/* Global Stats Summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-bold">
            <User className="w-3.5 h-3.5" />
            <span>{owners.length} Total Hosts</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>
              ₪{owners.reduce((sum: number, o: any) => sum + (o.financials?.totalDue ?? 0), 0)} Total Outstanding
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Due Status Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
            {["All Owners", "Has Pending Due", "Zero Balance"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedDueFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDueFilter === tab
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Owners Table Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Host / Email</th>
                <th className="px-6 py-4">Account Phone</th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span>Preferred Channel</span>
                    <span title="Click on badge to view destination details">
                      <Info className="w-3.5 h-3.5 text-zinc-400" />
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4">Scheduled Day</th>
                <th className="px-6 py-4">Listings</th>
                <th className="px-6 py-4">Pending Due</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-20 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedOwners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-zinc-400">
                    <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No owners found</p>
                    <p className="text-xs mt-1">Try refining your search filter criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedOwners.map((owner: any) => {
                  const channel = owner.ownerNotificationPreference?.channel || owner.notificationPreference || "EMAIL";
                  const due = owner.financials?.totalDue ?? 0;
                  const aptCount = owner.apartment ? 1 : 0;

                  return (
                    <tr key={owner.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-zinc-900 dark:text-white text-sm">
                          {owner.username || owner.name || "Owner"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span>{owner.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {owner.phone || "—"}
                      </td>

                      {/* Preferred Channel (Interactive Clickable Badge) */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOwnerForChannelDetails(owner)}
                          className="group text-left cursor-pointer inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                          title="Click to view notification details (Email, Phone & Schedule)"
                        >
                          {channel === "EMAIL" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-extrabold shadow-xs transition-colors">
                              <Mail className="w-3 h-3" /> Email Only
                            </span>
                          )}
                          {channel === "PHONE" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-extrabold shadow-xs transition-colors">
                              <PhoneCall className="w-3 h-3" /> Phone Only
                            </span>
                          )}
                          {channel === "BOTH" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-extrabold shadow-xs transition-colors">
                              <Mail className="w-3 h-3" /> <PhoneCall className="w-3 h-3" /> Email & Phone
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Scheduled Day */}
                      <td className="px-6 py-4">
                        {owner.ownerNotificationPreference?.preferredDay ? (
                          <span className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 shadow-xs">
                            {owner.ownerNotificationPreference.preferredDay}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Listings */}
                      <td className="px-6 py-4 text-xs font-extrabold text-zinc-900 dark:text-white">
                        {aptCount} {aptCount === 1 ? "property" : "properties"}
                      </td>

                      {/* Due Balance */}
                      <td className="px-6 py-4">
                        {due > 0 ? (
                          <span className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 shadow-xs">
                            ₪{due} Due
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400">
                            ₪0 (Settled)
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/dashboard/owners/${owner.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Link>

                          {/* Remind Button */}
                          <button 
                            type="button"
                            onClick={() => handleOpenReminderModal(owner)}
                            className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 shadow-xs hover:bg-orange-100 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors cursor-pointer"
                          >
                            <BellRing className="mr-1.5 h-3.5 w-3.5" />
                            Remind
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
        {filteredOwners.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Showing <span className="font-bold text-zinc-900 dark:text-white">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-zinc-900 dark:text-white">{Math.min(startIndex + pageSize, filteredOwners.length)}</span> of{" "}
              <span className="font-bold text-zinc-900 dark:text-white">{filteredOwners.length}</span> owners
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
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
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? "bg-[#4c55a4] text-white shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
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

      {/* Preferred Channel Details Modal */}
      {selectedOwnerForChannelDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4c55a4]/10 dark:bg-indigo-900/30 text-[#4c55a4] dark:text-indigo-400 flex items-center justify-center font-black">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">
                    Notification Channel Details
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Host: {selectedOwnerForChannelDetails.username || selectedOwnerForChannelDetails.name || "Owner"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOwnerForChannelDetails(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Channel Mode */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Preferred Delivery Channel
                  </span>
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {(selectedOwnerForChannelDetails.ownerNotificationPreference?.channel ||
                      selectedOwnerForChannelDetails.notificationPreference) === "BOTH"
                      ? "Email & Phone (Both Channels)"
                      : (selectedOwnerForChannelDetails.ownerNotificationPreference?.channel ||
                          selectedOwnerForChannelDetails.notificationPreference) === "PHONE"
                      ? "Phone Only (Voice / Automated Call)"
                      : "Email Only (Automated Email)"}
                  </span>
                </div>
                <div className="shrink-0">
                  {((selectedOwnerForChannelDetails.ownerNotificationPreference?.channel ||
                    selectedOwnerForChannelDetails.notificationPreference) || "EMAIL") === "EMAIL" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                  )}
                  {(selectedOwnerForChannelDetails.ownerNotificationPreference?.channel ||
                    selectedOwnerForChannelDetails.notificationPreference) === "PHONE" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold">
                      <PhoneCall className="w-3.5 h-3.5" /> Phone
                    </span>
                  )}
                  {(selectedOwnerForChannelDetails.ownerNotificationPreference?.channel ||
                    selectedOwnerForChannelDetails.notificationPreference) === "BOTH" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold">
                      <Mail className="w-3.5 h-3.5" /> + <PhoneCall className="w-3.5 h-3.5" /> Both
                    </span>
                  )}
                </div>
              </div>

              {/* Notification Email Card */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Notification Email Address
                      </h4>
                    </div>
                  </div>
                  {selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationEmail ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      Custom Reminder Email
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      Default Account Email
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white truncate pr-2">
                    {selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationEmail ||
                      selectedOwnerForChannelDetails.email ||
                      "No email configured"}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationEmail ||
                            selectedOwnerForChannelDetails.email ||
                            "",
                          "email"
                        )
                      }
                      className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 rounded-lg transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {(selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationEmail ||
                      selectedOwnerForChannelDetails.email) && (
                      <a
                        href={`mailto:${
                          selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationEmail ||
                          selectedOwnerForChannelDetails.email
                        }`}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 rounded-lg transition-colors"
                        title="Send Direct Email"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification Phone Card */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Notification Phone Number
                      </h4>
                    </div>
                  </div>
                  {selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationPhone ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      Custom Reminder Phone
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      Default Account Phone
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white truncate pr-2">
                    {selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationPhone ||
                      selectedOwnerForChannelDetails.phone ||
                      "No phone configured"}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationPhone ||
                            selectedOwnerForChannelDetails.phone ||
                            "",
                          "phone"
                        )
                      }
                      className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 rounded-lg transition-colors cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {(selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationPhone ||
                      selectedOwnerForChannelDetails.phone) && (
                      <a
                        href={`tel:${
                          selectedOwnerForChannelDetails.ownerNotificationPreference?.notificationPhone ||
                          selectedOwnerForChannelDetails.phone
                        }`}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 rounded-lg transition-colors"
                        title="Call Direct Phone"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Scheduled Day
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#4c55a4]" />
                    {selectedOwnerForChannelDetails.ownerNotificationPreference?.preferredDay ||
                      "Any Day"}
                  </span>
                </div>
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Scheduled Time
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#4c55a4]" />
                    {selectedOwnerForChannelDetails.ownerNotificationPreference?.preferredTime ||
                      "Any Time (Default)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedOwnerForChannelDetails(null)}
                className="px-5 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const owner = selectedOwnerForChannelDetails;
                  setSelectedOwnerForChannelDetails(null);
                  handleOpenReminderModal(owner);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reminder to Owner</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Customization Modal */}
      {selectedOwnerForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                {reminderType && (
                  <button
                    type="button"
                    onClick={() => setReminderType(null)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors cursor-pointer"
                    title="Back to reminder type selection"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">
                    {reminderType === "availability" ? "Send Availability Reminder" : reminderType === "due_payment" ? "Send Payment Due Reminder" : "Trigger Automated Reminder"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Target: {selectedOwnerForReminder.username || selectedOwnerForReminder.name || "Owner"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOwnerForReminder(null);
                  setReminderType(null);
                }}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Select Type */}
            {!reminderType && (
              <div className="p-6 space-y-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Select Reminder Objective
                </p>

                <button
                  type="button"
                  onClick={() => handleSelectReminderType("availability")}
                  className="w-full flex items-center gap-5 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all text-left group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">Shabbat Availability Reminder</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Remind owner to update property availability for upcoming Shabbat.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReminderType("due_payment")}
                  className="w-full flex items-center gap-5 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 hover:bg-orange-50/60 dark:hover:bg-orange-950/30 transition-all text-left group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">Request Due Payment</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Request payment for pending platform fee balance.</p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: Configure & Send */}
            {reminderType && (
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Channel Selector Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Select Delivery Channel
                    </label>
                    <span className="text-[11px] font-bold text-zinc-400">
                      Host Preference:{" "}
                      <span className="text-[#4c55a4] dark:text-indigo-400 font-extrabold">
                        {(selectedOwnerForReminder.ownerNotificationPreference?.channel ||
                          selectedOwnerForReminder.notificationPreference) === "BOTH"
                          ? "Both (Email & Phone)"
                          : (selectedOwnerForReminder.ownerNotificationPreference?.channel ||
                              selectedOwnerForReminder.notificationPreference) === "PHONE"
                          ? "Phone Only"
                          : "Email Only"}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                    <button
                      type="button"
                      onClick={() => setSelectedChannelTab("EMAIL")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedChannelTab === "EMAIL"
                          ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-zinc-200 dark:ring-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedChannelTab("PHONE")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedChannelTab === "PHONE"
                          ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs ring-1 ring-zinc-200 dark:ring-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Phone Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedChannelTab("BOTH")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedChannelTab === "BOTH"
                          ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs ring-1 ring-zinc-200 dark:ring-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>Both</span>
                    </button>
                  </div>
                </div>

                {/* Recipient Overview Box */}
                {selectedChannelTab === "EMAIL" && (
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                          Recipient Email
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">
                          {selectedOwnerForReminder.ownerNotificationPreference?.notificationEmail ||
                            selectedOwnerForReminder.email ||
                            "No email configured"}
                        </span>
                      </div>
                    </div>
                    {selectedOwnerForReminder.ownerNotificationPreference?.notificationEmail ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        Custom
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        Default
                      </span>
                    )}
                  </div>
                )}

                {selectedChannelTab === "PHONE" && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          Recipient Phone (Voice IVR)
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">
                          {selectedOwnerForReminder.ownerNotificationPreference?.notificationPhone ||
                            selectedOwnerForReminder.phone ||
                            "No phone configured"}
                        </span>
                      </div>
                    </div>
                    {selectedOwnerForReminder.ownerNotificationPreference?.notificationPhone ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Custom
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        Default
                      </span>
                    )}
                  </div>
                )}

                {selectedChannelTab === "BOTH" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center gap-2 text-xs overflow-hidden">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                          Email Target
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px] truncate block">
                          {selectedOwnerForReminder.ownerNotificationPreference?.notificationEmail ||
                            selectedOwnerForReminder.email ||
                            "No email"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-2 text-xs overflow-hidden">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                          Phone IVR Target
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white text-[11px] truncate block">
                          {selectedOwnerForReminder.ownerNotificationPreference?.notificationPhone ||
                            selectedOwnerForReminder.phone ||
                            "No phone"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Inputs (Visible for EMAIL and BOTH) */}
                {(selectedChannelTab === "EMAIL" || selectedChannelTab === "BOTH") && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Email Message Body
                      </label>
                      <textarea
                        rows={selectedChannelTab === "BOTH" ? 5 : 7}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium leading-relaxed text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* Voice Call Script (Visible for PHONE) */}
                {selectedChannelTab === "PHONE" && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          Automated Voice Call Script (Text-to-Speech)
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          Twilio IVR Dispatch
                        </span>
                      </div>
                      <textarea
                        rows={6}
                        value={customVoiceScript}
                        onChange={(e) => setCustomVoiceScript(e.target.value)}
                        className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-mono leading-relaxed text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y"
                      />
                    </div>

                    <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                        The automated voice system will place a phone call to the host and read the message above. The host can interact using phone keypad prompts to update their listing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Voice Call Summary for BOTH tab */}
                {selectedChannelTab === "BOTH" && (
                  <div className="p-3.5 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-300">
                        <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                        <span>Automated Voice Call Dispatch</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        Twilio Voice IVR
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                      "{customVoiceScript}"
                    </p>
                  </div>
                )}

                {/* Modal Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOwnerForReminder(null);
                      setReminderType(null);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSendReminder}
                    disabled={sendAvailMutation.isPending || sendPaymentMutation.isPending}
                    className={`px-6 py-2.5 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${
                      selectedChannelTab === "EMAIL"
                        ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                        : selectedChannelTab === "PHONE"
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                        : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                    }`}
                  >
                    {selectedChannelTab === "EMAIL" ? (
                      <Mail className="w-4 h-4" />
                    ) : selectedChannelTab === "PHONE" ? (
                      <PhoneCall className="w-4 h-4" />
                    ) : (
                      <BellRing className="w-4 h-4" />
                    )}
                    <span>
                      {sendAvailMutation.isPending || sendPaymentMutation.isPending
                        ? "Sending Reminder..."
                        : selectedChannelTab === "EMAIL"
                        ? "Send Email Reminder"
                        : selectedChannelTab === "PHONE"
                        ? "Trigger Voice Call Reminder"
                        : "Send to Both Channels (Email & Phone)"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden my-8">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-red-500"></div>
            
            <div className="p-8 pb-6 text-center">
              <div className="w-16 h-16 mx-auto bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center mb-5 ring-8 ring-orange-50/50 dark:ring-orange-900/10">
                <CalendarCheck className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                Not Scheduled for Today
              </h3>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-6">
                {errorModal.message.replace("Reminders cannot be sent today.", "Please try again on their preferred day.")}
              </p>
              
              <button
                type="button"
                onClick={() => setErrorModal({ isOpen: false, message: "" })}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden my-8">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            
            <div className="p-8 pb-6 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-5 ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                {successModal.title}
              </h3>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-6">
                {successModal.message}
              </p>
              
              <button
                type="button"
                onClick={() => setSuccessModal({ isOpen: false, title: "", message: "" })}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
