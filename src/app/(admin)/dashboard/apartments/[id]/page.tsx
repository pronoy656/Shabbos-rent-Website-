"use client";

import { use, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  User, 
  Image as ImageIcon, 
  Calendar, 
  X, 
  Check, 
  BellRing, 
  BedDouble, 
  Users, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone, 
  PhoneCall, 
  Send, 
  Sparkles, 
  Ban, 
  Trash2, 
  Maximize2, 
  Tag 
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";
import { 
  useAdminApartmentDetails,
  useUpdateApartmentStatus,
  useDeleteApartmentAdmin,
} from "@/hooks/useAdminApartments";
import { useMutation } from "@tanstack/react-query";
import { sendAvailabilityReminder } from "@/services/ownerService";
import type { NotificationChannel, SendReminderPayload } from "@/types/owner";
import { showToast } from "@/utils/toast";

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const apartmentId = resolvedParams.id;

  // Modals
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Reminder Modal State
  const [reminderChannel, setReminderChannel] = useState<"email" | "phone">("email");
  const [customEmailSubject, setCustomEmailSubject] = useState("");
  const [customEmailMessage, setCustomEmailMessage] = useState("");

  // Data
  const { data: adminDetails, isLoading } = useAdminApartmentDetails(apartmentId);
  const apt = adminDetails?.data;

  // Mutations
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateApartmentStatus();
  const { mutate: deleteApartment, isPending: isDeleting } = useDeleteApartmentAdmin();

  const { mutate: triggerAvailabilityReminder, isPending: isSendingReminder } = useMutation({
    mutationFn: (payload: SendReminderPayload) => {
      const ownerId = apt?.userId || apt?.user?.id || apartmentId;
      return sendAvailabilityReminder(ownerId, payload);
    },
    onSuccess: (res) => {
      showToast({
        title: "Reminder Dispatched! ✅",
        message: res?.message || "Availability reminder sent to owner.",
        type: "info",
      });
      setReminderModalOpen(false);
    },
    onError: (err: any) => {
      showToast({
        title: "Reminder Failed",
        message: err?.response?.data?.message || err?.message || "Failed to send reminder.",
        type: "info",
      });
    },
  });

  const handleOpenReminder = () => {
    const pref = apt?.user?.ownerNotificationPreference?.channel || apt?.ownerNotificationPreference?.channel;
    if (pref === "PHONE") {
      setReminderChannel("phone");
    } else {
      setReminderChannel("email");
    }
    setCustomEmailSubject(`Shabbat Availability Check - ${apt?.propertyId || apartmentId}`);
    setCustomEmailMessage(
      `Shalom ${apt?.user?.username || "Owner"},\n\nPlease take a quick 10 seconds to update your apartment listing (${apt?.propertyId || apt?.title}) availability for the upcoming Shabbat.\n\nThank you,\nShabos Rent Admin Team`
    );
    setReminderModalOpen(true);
  };

  const handleSendReminderConfirm = () => {
    const apiChannel: NotificationChannel = reminderChannel === "email" ? "EMAIL" : "PHONE";
    triggerAvailabilityReminder({
      channel: apiChannel,
      emailSubject: customEmailSubject,
      emailBody: customEmailMessage,
    });
  };

  const allPhotos: string[] = [];
  if (apt?.coverImage) allPhotos.push(apt.coverImage);
  if (apt?.images && Array.isArray(apt.images)) {
    apt.images.forEach((img: string) => {
      if (img && !allPhotos.includes(img)) allPhotos.push(img);
    });
  }

  const currentPhoto = allPhotos[selectedPhotoIndex] || allPhotos[0] || null;

  return (
    <div className="space-y-5 font-sans max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <Link 
            href="/dashboard/apartments" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group mb-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Apartments</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              {apt?.propertyId || apartmentId.substring(0, 8)}
            </h1>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 truncate max-w-xs sm:max-w-md">
              {apt?.title || "Apartment Details"}
            </span>

            {/* Status Badges */}
            {apt?.status === "CONFIRMED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CONFIRMED
              </span>
            )}
            {apt?.status === "PENDING" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> PENDING REVIEW
              </span>
            )}
            {apt?.status === "REJECTED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
                <X className="w-3.5 h-3.5 text-red-500" /> REJECTED
              </span>
            )}
            {apt?.status === "SUSPENDED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800">
                <Ban className="w-3.5 h-3.5 text-orange-500" /> SUSPENDED
              </span>
            )}
            {apt?.status === "BLOCKED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                <Lock className="w-3.5 h-3.5 text-rose-500" /> BLOCKED
              </span>
            )}
          </div>
        </div>

        {/* Primary Action: Accept Listing if pending */}
        {apt?.status !== "CONFIRMED" && (
          <div className="pt-2 sm:pt-0">
            <button
              onClick={() => setAcceptModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Listing</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Visual Media & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Compact Photo Gallery Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-800 group">
              {currentPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={getImageUrl(currentPhoto)} 
                  alt={apt?.title || "Apartment cover"} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setFullSizeImage(getImageUrl(currentPhoto))}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs font-semibold">No Photos Uploaded</span>
                </div>
              )}

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  ₪{apt?.pricePerShabbat || 0} / Shabbat
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  {apt?.city || "Unknown City"}
                </span>
              </div>

              {currentPhoto && (
                <button
                  onClick={() => setFullSizeImage(getImageUrl(currentPhoto))}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}

              {allPhotos.length > 0 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  {selectedPhotoIndex + 1} / {allPhotos.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allPhotos.length > 1 && (
              <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto">
                {allPhotos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhotoIndex === idx 
                        ? "border-blue-600 scale-[1.02] shadow-sm" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compact Specs & Details Tiles */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Property Overview</h3>
            
            {/* 6-Grid Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>City / Area</span>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {apt?.city || "N/A"}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {apt?.neighborhood || "N/A"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Property Type</span>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {apt?.propertyType || "APARTMENT"}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {apt?.street1 || "Standard Unit"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Price / Shabbat</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ₪{apt?.pricePerShabbat || 0}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Per Weekend
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <BedDouble className="w-3.5 h-3.5 text-purple-500" />
                  <span>Bedrooms</span>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {apt?.bedrooms || 0} Beds
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {apt?.bathrooms || 0} Baths
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Max Guests</span>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {apt?.maxGuest || 0} Guests
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Family Capacity
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>Registered</span>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {apt?.createdAt ? new Date(apt.createdAt).toLocaleDateString() : "N/A"}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Listing Date
                </div>
              </div>
            </div>

            {/* Description Text */}
            {apt?.description && (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Description</div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50/50 dark:bg-zinc-800/30 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  {apt.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Owner, Upcoming Availability & Action Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Compact Owner Profile Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                <User className="w-4 h-4 text-purple-500" />
                <span>Property Owner</span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-400">
                Verified Owner
              </span>
            </div>

            {/* Owner Details */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                {(apt?.user?.username || "O")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                  {apt?.user?.username || "Unknown Owner"}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{apt?.user?.email || "No Email"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{apt?.user?.phone || "No Phone"}</span>
                </div>
              </div>
            </div>

            {/* Owner Communication Preferences Pill */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Notification Channel:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                {apt?.user?.ownerNotificationPreference?.channel || apt?.ownerNotificationPreference?.channel || "EMAIL"}
              </span>
            </div>

            {/* Action Button for Owner */}
            <button
              onClick={handleOpenReminder}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Send Shabbat Reminder to Owner</span>
            </button>
          </div>

          {/* Upcoming Shabbat Availability Card (With Date, Title & Status - NO RATE COLUMN) */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Upcoming Shabbat Availability</span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-400">
                {apt?.availabilities?.length || 0} Weekends
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 font-bold">
                  <tr>
                    <th className="px-3.5 py-2.5 rounded-l-xl">Shabbat / Weekend</th>
                    <th className="px-3.5 py-2.5">Date</th>
                    <th className="px-3.5 py-2.5 text-right rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {apt?.availabilities && apt.availabilities.length > 0 ? (
                    apt.availabilities.map((item: any) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-3.5 py-3 font-bold text-zinc-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{item.weekend?.title || "Upcoming Shabbat"}</span>
                          </div>
                        </td>
                        <td className="px-3.5 py-3 text-zinc-600 dark:text-zinc-300 font-medium">
                          {item.weekend?.date 
                            ? new Date(item.weekend.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Upcoming Weekend"}
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          {item.isSpecial ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                              Special Rate
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-3.5 py-6 text-center text-xs text-zinc-400">
                        No custom weekend availabilities recorded. General Shabbat schedule applies.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Listing Actions Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Listing Actions</h3>
            
            <div className="space-y-2">
              {apt?.status !== "CONFIRMED" && (
                <button
                  onClick={() => setAcceptModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Accept Listing</span>
                </button>
              )}

              {apt?.status !== "REJECTED" && (
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Listing</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this listing permanently?")) {
                    deleteApartment(apartmentId, {
                      onSuccess: () => {
                        showToast({ title: "Deleted", message: "Apartment listing deleted.", type: "success" });
                        window.location.href = "/dashboard/apartments";
                      }
                    });
                  }
                }}
                disabled={isDeleting}
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <X className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Reject Listing?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to reject this apartment listing? It will not be shown to guests on the platform.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setRejectModalOpen(false);
                  updateStatus({ id: apartmentId, status: "REJECTED" }, {
                    onSuccess: () => showToast({ title: "Rejected", message: "Apartment has been rejected successfully", type: "success" })
                  });
                }}
                disabled={isUpdatingStatus}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {acceptModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Accept Listing?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to confirm this apartment? It will become visible and active for all users.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setAcceptModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setAcceptModalOpen(false);
                  updateStatus({ id: apartmentId, status: "CONFIRMED" }, {
                    onSuccess: () => showToast({ title: "Accepted", message: "Apartment has been confirmed successfully", type: "success" })
                  });
                }}
                disabled={isUpdatingStatus}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Reminder Modal */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-blue-500" />
                  <span>Send Availability Reminder</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Request owner {apt?.user?.username || "Owner"} to update availability
                </p>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Channel Selector */}
              <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setReminderChannel("email")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    reminderChannel === "email"
                      ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-zinc-500"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 inline mr-1.5" /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setReminderChannel("phone")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    reminderChannel === "phone"
                      ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-zinc-500"
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 inline mr-1.5" /> Voice Call
                </button>
              </div>

              {reminderChannel === "email" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Recipient
                    </label>
                    <input
                      type="text"
                      disabled
                      value={apt?.user?.email || "No email"}
                      className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={customEmailSubject}
                      onChange={(e) => setCustomEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={customEmailMessage}
                      onChange={(e) => setCustomEmailMessage(e.target.value)}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={apt?.user?.phone || "No phone"}
                      className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 italic leading-relaxed">
                    "Shalom {apt?.user?.username || "Owner"}! Shabos Rent calling to check if your apartment ({apt?.propertyId || apt?.title}) is available for the upcoming Shabbat. Press 1 for Available, Press 2 for Unavailable."
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSendingReminder}
                onClick={handleSendReminderConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSendingReminder ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reminder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image Lightbox Modal */}
      {fullSizeImage && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setFullSizeImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-[71]"
            onClick={() => setFullSizeImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full max-h-full aspect-auto rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={fullSizeImage} 
              alt="Full view" 
              className="w-full h-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
