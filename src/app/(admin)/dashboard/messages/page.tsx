"use client";

import { useState } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Eye,
  Send,
  X,
  Inbox,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useContactMessages } from "@/hooks/useContact";
import type { ContactMessage } from "@/types/contact.types";

export default function AdminMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useContactMessages();

  const messages: ContactMessage[] = Array.isArray(data?.data) ? data.data : [];

  const filteredMessages = messages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.phone?.toLowerCase().includes(q) ||
      msg.subject?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Contact Messages
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            View and manage user inquiries, feedback, and support messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetch();
              toast.success("Messages refreshed");
            }}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Card (Single Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {messages.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Compact Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by name, email, subject..."
            className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-950/50 text-[12px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Subject</th>
                <th className="py-4 px-6">Message Preview</th>
                <th className="py-4 px-6">Received Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                        <X className="w-6 h-6" />
                      </div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-bold">
                        Failed to load messages
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                        {searchQuery ? "No matching messages found" : "No messages yet"}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {searchQuery
                          ? "Try searching with different keywords or clear your search query."
                          : "Contact form submissions from visitors and users will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedMessage(item)}
                  >
                    {/* Sender */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name || "Anonymous"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <a
                            href={`mailto:${item.email}`}
                            className="hover:text-blue-600 hover:underline truncate max-w-[180px]"
                            title={item.email}
                          >
                            {item.email}
                          </a>
                          <button
                            onClick={() => handleCopy(item.email, "Email")}
                            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            title="Copy email"
                          >
                            {copiedField === "Email" ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {item.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <a
                              href={`tel:${item.phone}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {item.phone}
                            </a>
                            <button
                              onClick={() => handleCopy(item.phone || "", "Phone")}
                              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                              title="Copy phone"
                            >
                              {copiedField === "Phone" ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 max-w-[200px] truncate">
                        {item.subject || "General Inquiry"}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="py-4 px-6">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-[260px] leading-relaxed">
                        {item.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedMessage(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/20">
                  {getInitials(selectedMessage.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {selectedMessage.name || "Anonymous Sender"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Received {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Contact Information Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-800">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="hover:text-blue-600 hover:underline truncate"
                    >
                      {selectedMessage.email}
                    </a>
                    <button
                      onClick={() => handleCopy(selectedMessage.email, "Email")}
                      className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-auto"
                      title="Copy email"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Phone Number
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                      <button
                        onClick={() => handleCopy(selectedMessage.phone || "", "Phone")}
                        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-auto"
                        title="Copy phone"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Subject
                </span>
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-900/40 text-sm font-bold text-blue-900 dark:text-blue-200">
                  {selectedMessage.subject || "No Subject Specified"}
                </div>
              </div>

              {/* Full Message Body */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Message
                </span>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed min-h-[120px] max-h-[260px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject || "Shabbos Rent Inquiry"}`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
