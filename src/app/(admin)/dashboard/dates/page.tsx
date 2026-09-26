"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Calendar as CalendarIcon,
  Search,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  useWeekendCalendars,
  useCreateWeekendCalendar,
  useUpdateWeekendCalendar,
  useDeleteWeekendCalendar,
} from "@/hooks/useWeekendCalendar";
import type { WeekendCalendar } from "@/types/weekendCalendar.types";
import { toast } from "sonner";

export default function WeekendsPage() {
  // Queries & Mutations
  const { data: calendarData, isLoading, isError, refetch } = useWeekendCalendars();
  const createMutation = useCreateWeekendCalendar();
  const updateMutation = useUpdateWeekendCalendar();
  const deleteMutation = useDeleteWeekendCalendar();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WeekendCalendar | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
  });

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  // Extract items from API response
  const weekendList = calendarData?.data || [];

  const filteredWeekends = [...weekendList]
    .filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = item.date.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || dateMatch;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalPages = Math.max(1, Math.ceil(filteredWeekends.length / PAGE_SIZE));
  const paginatedWeekends = filteredWeekends.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: WeekendCalendar) => {
    setEditingItem(item);
    // Format date string to YYYY-MM-DD for <input type="date" />
    let dateStr = "";
    if (item.date) {
      dateStr = item.date.includes("T") ? item.date.split("T")[0] : item.date;
    }
    setFormData({
      title: item.title,
      date: dateStr,
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.date) {
      toast.error("Please fill in both title and date.");
      return;
    }

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          weekendId: editingItem.id,
          payload: {
            title: formData.title.trim(),
            date: formData.date,
          },
        });
        toast.success("Weekend calendar updated successfully!");
      } else {
        await createMutation.mutateAsync({
          title: formData.title.trim(),
          date: formData.date,
        });
        toast.success("Weekend calendar created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const rawMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : "Failed to save weekend date.";

      // If it looks like a duplicate-date error, enrich with the actual date
      const isDuplicateError =
        rawMsg &&
        (rawMsg.toLowerCase().includes("already exists") ||
          rawMsg.toLowerCase().includes("duplicate"));

      let displayMsg = rawMsg || "Failed to save weekend date.";
      if (isDuplicateError && formData.date) {
        const formatted = new Date(formData.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        displayMsg = `Weekend calendar for ${formatted} already exists.`;
      }

      toast.error(displayMsg);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Weekend date deleted successfully.");
      setDeletingId(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : "Failed to delete date.";
      toast.error(errorMsg || "Failed to delete date.");
    }
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-orange-500" />
            Weekends & Available Dates
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage the Shabbat weekend calendar dates available for hosts and renters.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-xl bg-[#4c55a4] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#3d4484] transition-colors cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Weekend
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Shabbat name or date..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#4c55a4] transition-colors"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4c55a4]" />
            <p className="text-sm font-medium">Loading weekend calendars...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              Failed to load weekend dates
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-white bg-[#4c55a4] rounded-lg hover:bg-[#3d4484]"
            >
              Retry
            </button>
          </div>
        ) : filteredWeekends.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-base font-bold text-zinc-900 dark:text-white mb-1">
              No weekend dates found
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
              {searchTerm
                ? "No dates matched your search query."
                : "Create your first Shabbat weekend calendar date to get started."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#4c55a4] rounded-xl hover:bg-[#3d4484] shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Weekend
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/75 dark:bg-zinc-800/40 text-zinc-900 dark:text-white font-bold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Shabbat / Display Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {paginatedWeekends.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {item.createdAt ? formatDateDisplay(item.createdAt) : "-"}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {formatDateDisplay(item.date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
            </div>


          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredWeekends.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-zinc-900 dark:text-white">{filteredWeekends.length}</span>{" "}
                weekends
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-zinc-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                          currentPage === p
                            ? "border-[#4c55a4] bg-[#4c55a4] text-white"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#4c55a4]" />
                {editingItem ? "Edit Weekend Date" : "Add New Weekend Date"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                    Shabbat Title / Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parshat Lech Lecha 1"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-2 focus:ring-[#4c55a4]/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                    Weekend Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="block w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#4c55a4] focus:ring-2 focus:ring-[#4c55a4]/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-xl bg-[#4c55a4] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#4c55a4]/20 hover:bg-[#3d4484] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update Weekend"
                  ) : (
                    "Save Weekend"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                Delete Weekend Date?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                This action cannot be undone. This weekend calendar date will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
