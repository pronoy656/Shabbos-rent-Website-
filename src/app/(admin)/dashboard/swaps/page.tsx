"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  Calendar,
  BedDouble,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";
import { useAdminSwaps, useAdminUpdateSwapStatus } from "@/hooks/useAdminSwap";
import { SwapStatus } from "@/types/swap.types";
import { getImageUrl } from "@/utils/imageUrl";
import { Skeleton } from "@/components/ui/skeleton";

const SWAP_STATUSES = ["All", "Pending", "Completed", "Cancelled"];

export default function SwapsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: swapsData,
    isLoading,
    refetch,
  } = useAdminSwaps({
    status: activeTab !== "All" ? (activeTab.toUpperCase() as SwapStatus) : undefined,
  });

  const updateStatusMutation = useAdminUpdateSwapStatus();

  const handleUpdateStatus = async (e: React.MouseEvent, id: string, status: SwapStatus) => {
    e.preventDefault(); // prevent navigation
    await updateStatusMutation.mutateAsync({ id, status });
  };

  const allSwaps = swapsData?.data || [];

  const filteredSwaps = allSwaps.filter((swap) => {
    const matchesSearch =
      swap.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (swap.fromApartment?.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (swap.toApartment?.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (swap.fromApartment?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (swap.toApartment?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-3.5 w-3.5" />;
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "CANCELLED":
      case "REJECTED":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "COMPLETED":
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Swaps Management</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Track and manage all apartment exchanges between owners.
        </p>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {/* Premium Segmented Control Tabs */}
        <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
          {SWAP_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`relative px-5 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === status
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            placeholder="Search owners or swap ID..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 w-full space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredSwaps.map((swap) => {
            // Determine image URLs
            const fromImage = getImageUrl(
              swap.fromApartment?.coverImage || (swap.fromApartment?.images && swap.fromApartment.images[0]) || ""
            );
            const toImage = getImageUrl(
              swap.toApartment?.coverImage || (swap.toApartment?.images && swap.toApartment.images[0]) || ""
            );

            return (
              <div key={swap.id} className="block group/card relative">
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col group-hover/card:border-blue-300 dark:group-hover/card:border-blue-700 group-hover/card:shadow-md transition-all duration-300">
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {swap.id.substring(0, 8)}...
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {swap.weekend
                          ? new Date(swap.weekend).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                          swap.status
                        )}`}
                      >
                        {getStatusIcon(swap.status)}
                        {swap.status}
                      </span>
                      <div className="group/dropdown relative">
                        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/dropdown:block w-32 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
                          <button
                            onClick={(e) => handleUpdateStatus(e, swap.id, "APPROVED")}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => handleUpdateStatus(e, swap.id, "REJECTED")}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={(e) => handleUpdateStatus(e, swap.id, "COMPLETED")}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body (Side-by-side comparison) */}
                  <div className="flex flex-col sm:flex-row items-center p-5 gap-4 relative flex-1">
                    {/* Owner 1 */}
                    <div className="flex-1 w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <h4
                          className="text-sm font-bold text-zinc-900 dark:text-white truncate"
                          title={swap.fromApartment?.user?.username || "Initiator"}
                        >
                          {swap.fromApartment?.user?.username || "Initiator"}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          Initiator
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group aspect-video bg-zinc-100 dark:bg-zinc-800">
                        {fromImage && (
                          <img
                            src={fromImage}
                            alt={swap.fromApartment?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                          <p className="text-white text-xs font-bold truncate">{swap.fromApartment?.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-white/90 text-[10px] font-medium">
                              {swap.fromApartment?.propertyId || `APT-${swap.fromApartment?.id.substring(0, 4)}`}
                            </span>
                            <span className="flex items-center gap-1 text-white/90 text-[10px] font-medium">
                              <BedDouble className="h-3 w-3" /> {swap.fromApartment?.bedrooms || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swap Icon */}
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 z-10 mx-[-20px] ring-4 ring-white dark:ring-zinc-900">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <div className="flex sm:hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 z-10 rotate-90 my-[-10px] ring-4 ring-white dark:ring-zinc-900">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>

                    {/* Owner 2 */}
                    <div className="flex-1 w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <h4
                          className="text-sm font-bold text-zinc-900 dark:text-white truncate"
                          title={swap.toApartment?.user?.username || "Recipient"}
                        >
                          {swap.toApartment?.user?.username || "Recipient"}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          Recipient
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group aspect-video bg-zinc-100 dark:bg-zinc-800">
                        {toImage && (
                          <img
                            src={toImage}
                            alt={swap.toApartment?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                          <p className="text-white text-xs font-bold truncate">{swap.toApartment?.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-white/90 text-[10px] font-medium">
                              {swap.toApartment?.propertyId || `APT-${swap.toApartment?.id.substring(0, 4)}`}
                            </span>
                            <span className="flex items-center gap-1 text-white/90 text-[10px] font-medium">
                              <BedDouble className="h-3 w-3" /> {swap.toApartment?.bedrooms || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSwaps.length === 0 && (
            <div className="col-span-full py-16 px-6 text-center bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#4c55a4]/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                {/* Glowing Icon Badge */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-[#4c55a4] dark:text-indigo-400 shadow-lg shadow-[#4c55a4]/10">
                    <ArrowRightLeft className="w-9 h-9" />
                  </div>
                </div>

                {/* Title & Contextual Message */}
                {searchQuery || activeTab !== "All" ? (
                  <>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                      No Swaps Found Matching Filters
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-md">
                      No exchange proposals match your search for &quot;
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {searchQuery || activeTab}
                      </span>
                      &quot;. Try adjusting your keywords or clearing the active filters.
                    </p>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveTab("All");
                        }}
                        className="inline-flex items-center px-5 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-xs shadow-md shadow-[#4c55a4]/20 transition-all cursor-pointer"
                      >
                        Reset Search & Filters
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                      No Apartment Swaps Recorded Yet
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                      When registered homeowners initiate or complete Shabbat apartment exchanges, they will appear here in real-time with full side-by-side details and admin moderation controls.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

