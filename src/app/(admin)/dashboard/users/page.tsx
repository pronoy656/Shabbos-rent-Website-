"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Users,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Eye,
  X,
  Filter,
  RefreshCw,
  BellRing,
  PhoneCall,
  Calendar,
  Share2,
  Sparkles,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import type { AdminUserListItem, UserRole, UserStatus } from "@/types/user.types";

export default function AdminUsersPage() {
  // Filters & Query State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("USER");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal State
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AdminUserListItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Search debounce timeout
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Fetch users via React Query
  const { data, isLoading, isFetching, refetch } = useAdminUsers({
    searchTerm: searchTerm || undefined,
    role: selectedRole !== "ALL" ? selectedRole : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const users = data?.data || [];
  const meta = data?.meta || { page: 1, limit: pageSize, total: 0, totalPage: 1 };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Stats calculation
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;

  const hasActiveFilters = searchTerm !== "" || selectedRole !== "ALL" || selectedStatus !== "ALL";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("USER");
    setSelectedStatus("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Browse, search, and inspect all registered accounts, roles, channels, and linked apartments.
          </p>
        </div>

        {/* Global Refresh Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {meta.total ?? users.length}
            </span>
            <span className="text-[11px] font-bold text-zinc-400">Registered Accounts</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Users</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </span>
            <span className="text-[11px] font-bold text-zinc-400">Active on this page</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden">
        {/* Filter / Search Bar */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search username, email, phone..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("USER");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === "USER"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Renters
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("OWNER");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === "OWNER"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Owners
              </button>
            </div>

            {/* Status Filter (shadcn UI) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between gap-2 px-3.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs cursor-pointer min-w-[130px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <span>
                    {selectedStatus === "ALL"
                      ? "All"
                      : selectedStatus === "ACTIVE"
                      ? "Active"
                      : selectedStatus === "BLOCKED"
                      ? "Blocked"
                      : "Suspended"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 rounded-xl p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("ALL");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedStatus === "ALL"
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>All Statuses</span>
                  {selectedStatus === "ALL" && <Check className="w-3.5 h-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("ACTIVE");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedStatus === "ACTIVE"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </div>
                  {selectedStatus === "ACTIVE" && <Check className="w-3.5 h-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("BLOCKED");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedStatus === "BLOCKED"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Blocked</span>
                  </div>
                  {selectedStatus === "BLOCKED" && <Check className="w-3.5 h-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("SUSPENDED");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    selectedStatus === "SUSPENDED"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Suspended</span>
                  </div>
                  {selectedStatus === "SUSPENDED" && <Check className="w-3.5 h-3.5" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline decoration-zinc-300 underline-offset-4 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Page size selector (shadcn UI) */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-zinc-500 font-medium">
            <span>Per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 outline-none hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs cursor-pointer min-w-[65px]">
                <span>{pageSize}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24 rounded-xl p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
                {[10, 20, 50].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                      pageSize === size
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{size}</span>
                    {pageSize === size && <Check className="w-3 h-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                <th className="px-6 py-4">User / Account</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="w-24 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                          <div className="w-16 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="w-32 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm">No users found</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {hasActiveFilters
                          ? "Try adjusting your search criteria or removing active filters."
                          : "No registered users exist on the platform yet."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-3 px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = (user.username || "U")
                    .slice(0, 2)
                    .toUpperCase();
                  const isSuperAdmin = user.role === "SUPER_ADMIN";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* User Account */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4c55a4] to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 overflow-hidden">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-zinc-900 dark:text-white text-sm">
                                {user.username}
                              </span>
                              {user.isVerified && (
                                <span title="Verified User">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isSuperAdmin ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/50 text-[10px] font-black text-purple-700 dark:text-purple-300">
                                  <ShieldCheck className="w-3 h-3" /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                                  <User className="w-3 h-3" /> Member
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 font-mono text-[11px]">
                          {user.email ? (
                            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 group">
                              <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[160px]">{user.email}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(user.email!, "Email")}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-zinc-900 dark:hover:text-white transition-opacity"
                                title="Copy Email"
                              >
                                {copiedField === "Email" ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-zinc-400 italic">No email</span>
                          )}

                          {user.phone ? (
                            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 group">
                              <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate max-w-[160px]">{user.phone}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(user.phone!, "Phone")}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-zinc-900 dark:hover:text-white transition-opacity"
                                title="Copy Phone"
                              >
                                {copiedField === "Phone" ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-zinc-400 italic">No phone</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {user.status === "ACTIVE" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {user.status === "BLOCKED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Blocked
                          </span>
                        )}
                        {user.status === "SUSPENDED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Platform / Marketing Source */}
                      <td className="px-6 py-4">
                        {user.marketingPlatform?.title ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 text-xs font-bold shadow-2xs">
                            <Share2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{user.marketingPlatform.title}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 font-medium">Direct</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForDetail(user)}
                          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta.total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Showing{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {Math.min(currentPage * pageSize, meta.total)}
              </span>{" "}
              of <span className="font-bold text-zinc-900 dark:text-white">{meta.total}</span> users
            </div>

            {/* Controls */}
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

              {Array.from({ length: meta.totalPage || 1 }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(meta.totalPage || 1, currentPage + 2))
                .map((page) => (
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPage || 1))}
                disabled={currentPage === (meta.totalPage || 1)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4c55a4] to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-md overflow-hidden shrink-0">
                  {selectedUserForDetail.profileImage ? (
                    <img
                      src={selectedUserForDetail.profileImage}
                      alt={selectedUserForDetail.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (selectedUserForDetail.username || "U").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">
                      {selectedUserForDetail.username}
                    </h3>
                    {selectedUserForDetail.isVerified && (
                      <span title="Verified User">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    ID: {selectedUserForDetail.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Account Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold ${
                  selectedUserForDetail.role === "SUPER_ADMIN"
                    ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Role: {selectedUserForDetail.role}
                </span>

                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold ${
                  selectedUserForDetail.status === "ACTIVE"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                }`}>
                  Status: {selectedUserForDetail.status}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedUserForDetail.isVerified ? "Verified Account" : "Unverified"}
                </span>
              </div>

              {/* Contact Information Card */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Contact Information
                </h4>

                {/* Email */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {selectedUserForDetail.email || "No email registered"}
                    </span>
                  </div>
                  {selectedUserForDetail.email && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUserForDetail.email!, "Email")}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors"
                        title="Copy Email"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`mailto:${selectedUserForDetail.email}`}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors"
                        title="Send Direct Email"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {selectedUserForDetail.phone || "No phone registered"}
                    </span>
                  </div>
                  {selectedUserForDetail.phone && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUserForDetail.phone!, "Phone")}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors"
                        title="Copy Phone"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`tel:${selectedUserForDetail.phone}`}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors"
                        title="Call Direct Phone"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Preferences */}
              {selectedUserForDetail.ownerNotificationPreference && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Notification & Reminder Preferences
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Channel</span>
                      <span className="font-bold text-zinc-900 dark:text-white mt-0.5 block">
                        {selectedUserForDetail.ownerNotificationPreference.channel || "EMAIL"}
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Preferred Day</span>
                      <span className="font-bold text-zinc-900 dark:text-white mt-0.5 block">
                        {selectedUserForDetail.ownerNotificationPreference.preferredDay || "Any Day"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Apartments Owned */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Apartments Listed ({selectedUserForDetail.apartments?.length || 0})
                  </h4>
                </div>

                {selectedUserForDetail.apartments && selectedUserForDetail.apartments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUserForDetail.apartments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                              {apt.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {apt.city}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/apartments`}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No apartments listed by this user.</p>
                )}
              </div>

              {/* Platform / Marketing Attribution */}
              {selectedUserForDetail.marketingPlatform && (
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                        Platform (Acquisition Channel)
                      </span>
                      <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                        {selectedUserForDetail.marketingPlatform.title}
                      </span>
                      {selectedUserForDetail.marketingPlatform.platform &&
                        selectedUserForDetail.marketingPlatform.platform !== selectedUserForDetail.marketingPlatform.title && (
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                            Network: {selectedUserForDetail.marketingPlatform.platform}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-1">
                <div>
                  <span className="text-[10px] block uppercase font-bold">Created At</span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                    {new Date(selectedUserForDetail.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] block uppercase font-bold">Updated At</span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                    {new Date(selectedUserForDetail.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
