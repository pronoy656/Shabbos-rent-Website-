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
  BellRing,
  X,
  CheckCircle2,
  CalendarCheck,
  DollarSign,
  Mail,
  PhoneCall,
  Phone,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowLeft
} from "lucide-react";
import { showToast } from "@/utils/toast";

export type ReminderChannel = "email_only" | "phone_only" | "both";

type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  listings: number;
  earnings: string;
  unpaid: string;
  due: string;
  preferredChannel: ReminderChannel;
  city: string;
};

const initialOwners: Owner[] = [
  {
    id: "david-cohen",
    name: "David Cohen",
    email: "david.cohen@gmail.com",
    phone: "+972 50-123-4567",
    city: "Jerusalem",
    listings: 3,
    earnings: "₪1,250",
    unpaid: "₪50",
    due: "₪50",
    preferredChannel: "email_only",
  },
  {
    id: "rachel-levy",
    name: "Rachel Levy",
    email: "rachel.levy@outlook.com",
    phone: "+972 52-987-6543",
    city: "Jerusalem",
    listings: 1,
    earnings: "₪450",
    unpaid: "₪0",
    due: "₪0",
    preferredChannel: "both",
  },
  {
    id: "moshe-katz",
    name: "Moshe Katz",
    email: "moshe.k@yahoo.com",
    phone: "+972 54-321-0987",
    city: "Bnei Brak",
    listings: 5,
    earnings: "₪3,800",
    unpaid: "₪150",
    due: "₪150",
    preferredChannel: "phone_only",
  },
  {
    id: "sarah-friedman",
    name: "Sarah Friedman",
    email: "sarah.f@gmail.com",
    phone: "+972 53-111-2233",
    city: "Tzfat",
    listings: 2,
    earnings: "₪2,100",
    unpaid: "₪80",
    due: "₪80",
    preferredChannel: "email_only",
  },
  {
    id: "yossi-stern",
    name: "Yossi Stern",
    email: "yossi.stern@gmail.com",
    phone: "+972 58-777-8899",
    city: "Tel Aviv",
    listings: 4,
    earnings: "₪4,200",
    unpaid: "₪200",
    due: "₪200",
    preferredChannel: "both",
  },
  {
    id: "chaim-weiss",
    name: "Chaim Weiss",
    email: "chaim.w@gmail.com",
    phone: "+972 54-333-4455",
    city: "Jerusalem",
    listings: 2,
    earnings: "₪1,800",
    unpaid: "₪0",
    due: "₪0",
    preferredChannel: "phone_only",
  },
  {
    id: "avrum-shapiro",
    name: "Avrum Shapiro",
    email: "avrum.s@gmail.com",
    phone: "+972 52-222-3344",
    city: "Tel Aviv",
    listings: 3,
    earnings: "₪3,100",
    unpaid: "₪120",
    due: "₪120",
    preferredChannel: "both",
  },
  {
    id: "miriam-katz",
    name: "Miriam Katz",
    email: "miriam.k@outlook.com",
    phone: "+972 50-666-5544",
    city: "Bnei Brak",
    listings: 2,
    earnings: "₪1,500",
    unpaid: "₪0",
    due: "₪0",
    preferredChannel: "email_only",
  },
  {
    id: "eliezer-greenberg",
    name: "Eliezer Greenberg",
    email: "eliezer.g@yahoo.com",
    phone: "+972 53-888-9900",
    city: "Tzfat",
    listings: 1,
    earnings: "₪900",
    unpaid: "₪40",
    due: "₪40",
    preferredChannel: "phone_only",
  },
  {
    id: "shimon-schwartz",
    name: "Shimon Schwartz",
    email: "shimon.s@gmail.com",
    phone: "+972 54-999-1122",
    city: "Jerusalem",
    listings: 6,
    earnings: "₪5,600",
    unpaid: "₪250",
    due: "₪250",
    preferredChannel: "both",
  },
  {
    id: "rivka-adler",
    name: "Rivka Adler",
    email: "rivka.a@gmail.com",
    phone: "+972 58-123-9988",
    city: "Tel Aviv",
    listings: 2,
    earnings: "₪2,400",
    unpaid: "₪0",
    due: "₪0",
    preferredChannel: "email_only",
  },
  {
    id: "baruch-goldberg",
    name: "Baruch Goldberg",
    email: "baruch.g@gmail.com",
    phone: "+972 52-444-5566",
    city: "Jerusalem",
    listings: 3,
    earnings: "₪3,300",
    unpaid: "₪110",
    due: "₪110",
    preferredChannel: "both",
  },
];

export default function OwnersPage() {
  const [owners] = useState<Owner[]>(initialOwners);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDueFilter, setSelectedDueFilter] = useState("All Owners");
  const [sentReminders, setSentReminders] = useState<Record<string, { type: string; channel: "email" | "phone" }>>({});

  // Modal Flow State
  const [selectedOwnerForReminder, setSelectedOwnerForReminder] = useState<Owner | null>(null);
  const [reminderType, setReminderType] = useState<"availability" | "due_payment" | null>(null);
  const [activeModalChannel, setActiveModalChannel] = useState<"email" | "phone">("email");
  const [customMessage, setCustomMessage] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleOpenReminderModal = (owner: Owner) => {
    setSelectedOwnerForReminder(owner);
    setReminderType(null); // Step 1: User selects reminder type
  };

  const handleSelectReminderType = (type: "availability" | "due_payment") => {
    if (!selectedOwnerForReminder) return;
    setReminderType(type);

    const owner = selectedOwnerForReminder;

    if (type === "due_payment") {
      // Due Payment requests ALWAYS use Email only (No voice call option)
      setActiveModalChannel("email");
      setCustomMessage(
        `Shalom ${owner.name},\n\nThis is a friendly reminder regarding your pending platform due balance of ${owner.due}.\n\nPlease settle your payment at your earliest convenience to keep your listings active.\n\nThank you,\nShabos Rent Finance Team`
      );
    } else {
      // Availability reminders use owner's preferred channel
      if (owner.preferredChannel === "phone_only") {
        setActiveModalChannel("phone");
      } else {
        setActiveModalChannel("email");
      }
      setCustomMessage(
        `Shalom ${owner.name},\n\nPlease take a moment to update the availability status for your property listings on Shabos Rent for the upcoming Shabbat.\n\nThank you,\nShabos Rent Admin Team`
      );
    }
  };

  const handleConfirmSendReminder = (channel: "email" | "phone") => {
    if (!selectedOwnerForReminder || !reminderType) return;

    const owner = selectedOwnerForReminder;
    const typeLabel = reminderType === "availability" ? "Availability Reminder" : "Payment Due Reminder";

    setSentReminders((prev) => ({
      ...prev,
      [owner.id]: { type: typeLabel, channel },
    }));

    if (channel === "email") {
      showToast({
        title: `${typeLabel} Email Sent! ✉️`,
        message: `Sent to ${owner.name} (${owner.email}).`,
        type: "info",
      });
    } else {
      showToast({
        title: `${typeLabel} Voice Call Initiated! 📞`,
        message: `Automated voice call triggered to ${owner.name} (${owner.phone}).`,
        type: "info",
      });
    }

    setSelectedOwnerForReminder(null);
    setReminderType(null);
  };

  // Filtered List
  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const matchesSearch =
        searchQuery === "" ||
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const hasDue = owner.due !== "₪0";
      const matchesDue =
        selectedDueFilter === "All Owners" ||
        (selectedDueFilter === "Has Due (Unpaid)" && hasDue) ||
        (selectedDueFilter === "No Due" && !hasDue);

      return matchesSearch && matchesDue;
    });
  }, [owners, searchQuery, selectedDueFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOwners.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOwners = filteredOwners.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Property Owners Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage owner accounts, track platform earnings/dues, and dispatch availability & due payment reminders.
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
              placeholder="Search owner by name, email, phone..."
            />
          </div>

          {/* Right Side: Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[160px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                <span>Filter: {selectedDueFilter}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem onClick={() => { setSelectedDueFilter("All Owners"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold">
                  All Owners
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedDueFilter("Has Due (Unpaid)"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-red-600 dark:text-red-400">
                  Has Due (Unpaid)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedDueFilter("No Due"); setCurrentPage(1); }} className="cursor-pointer rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  No Due (Settled)
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
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Owner Name & Email</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Phone</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Preferred Channel</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Listings</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Earnings</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 font-bold text-red-600 dark:text-red-400">Due Balance</th>
                <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedOwners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    No owners match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedOwners.map((owner) => {
                  const reminderState = sentReminders[owner.id];

                  return (
                    <tr key={owner.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-zinc-900 dark:text-white text-sm">{owner.name}</div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span>{owner.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {owner.phone}
                      </td>

                      {/* Preferred Channel */}
                      <td className="px-6 py-4">
                        {owner.preferredChannel === "email_only" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold">
                            <Mail className="w-3 h-3" /> Email Only
                          </span>
                        )}
                        {owner.preferredChannel === "phone_only" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold">
                            <PhoneCall className="w-3 h-3" /> Phone Only
                          </span>
                        )}
                        {owner.preferredChannel === "both" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold">
                            <Mail className="w-3 h-3" /> <PhoneCall className="w-3 h-3" /> Email & Phone
                          </span>
                        )}
                      </td>

                      {/* Listings */}
                      <td className="px-6 py-4 text-xs font-extrabold text-zinc-900 dark:text-white">
                        {owner.listings} properties
                      </td>

                      {/* Earnings */}
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {owner.earnings}
                      </td>

                      {/* Due Balance */}
                      <td className="px-6 py-4">
                        {owner.due !== "₪0" ? (
                          <span className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 shadow-sm">
                            {owner.due} Due
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
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Link>

                          {/* Send Reminder Button */}
                          <button 
                            onClick={() => handleOpenReminderModal(owner)}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
                              reminderState
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/50 active:scale-95"
                            }`}
                          >
                            {reminderState ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Sent ({reminderState.channel})</span>
                              </>
                            ) : (
                              <>
                                <BellRing className="w-3.5 h-3.5 text-orange-500" />
                                <span>Remind</span>
                              </>
                            )}
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

      {/* Multi-Step Interactive Reminder Modal */}
      {selectedOwnerForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <div className="flex items-center gap-3">
                {reminderType && (
                  <button
                    onClick={() => setReminderType(null)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Back to type selection"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
                    <BellRing className="w-6 h-6 text-orange-500" /> Send Owner Reminder
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">
                    Target owner: <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedOwnerForReminder.name}</span> ({selectedOwnerForReminder.email})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedOwnerForReminder(null);
                  setReminderType(null);
                }}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Select Reminder Type */}
            {!reminderType && (
              <div className="space-y-5">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">
                  Select the type of notification reminder to send to {selectedOwnerForReminder.name}:
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
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Request payment for pending platform fee balance ({selectedOwnerForReminder.due}).</p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: Select Channel (Email vs Voice Call) & Send */}
            {reminderType && (
              <div className="space-y-5">
                {/* Preference / Method Badge */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs mb-4">
                  <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Notification Channel:
                  </div>
                  <div>
                    {reminderType === "due_payment" ? (
                      <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
                        <Mail className="w-3.5 h-3.5" /> Email Only (Due Payment Request)
                      </span>
                    ) : (
                      <>
                        {selectedOwnerForReminder.preferredChannel === "email_only" && (
                          <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Mail className="w-3.5 h-3.5" /> Email Only
                          </span>
                        )}
                        {selectedOwnerForReminder.preferredChannel === "phone_only" && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <PhoneCall className="w-3.5 h-3.5" /> Phone Call Only
                          </span>
                        )}
                        {selectedOwnerForReminder.preferredChannel === "both" && (
                          <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
                            <Sparkles className="w-3.5 h-3.5" /> Accepts Email & Phone
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Channel Selector Tabs - ONLY render tabs when reminderType is availability */}
                {reminderType === "availability" && (
                  <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl mb-4 border border-zinc-200/80 dark:border-zinc-700/50">
                    <button
                      type="button"
                      onClick={() => setActiveModalChannel("email")}
                      disabled={selectedOwnerForReminder.preferredChannel === "phone_only"}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        activeModalChannel === "email"
                          ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModalChannel("phone")}
                      disabled={selectedOwnerForReminder.preferredChannel === "email_only"}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        activeModalChannel === "phone"
                          ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Voice Call</span>
                    </button>
                  </div>
                )}

                {/* EMAIL TAB CONTENT */}
                {activeModalChannel === "email" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Recipient Email Address
                      </label>
                      <input
                        type="text"
                        disabled
                        value={selectedOwnerForReminder.email}
                        className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Custom Email Draft Message
                      </label>
                      <textarea
                        rows={7}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium leading-relaxed text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setSelectedOwnerForReminder(null)}
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
                        <span>Send Email</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VOICE CALL TAB CONTENT */}
                {activeModalChannel === "phone" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Owner Phone Number
                      </label>
                      <input
                        type="text"
                        disabled
                        value={selectedOwnerForReminder.phone}
                        className="w-full px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-400"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Automated Voice Call Message Preview</span>
                      </div>
                      <p className="text-[11px] text-emerald-950/80 dark:text-emerald-200/80 leading-relaxed italic">
                        {reminderType === "availability"
                          ? `"Shalom ${selectedOwnerForReminder.name}! This is Shabos Rent calling to remind you to update your property availability for the upcoming Shabbat. Press 1 to confirm available, Press 2 to mark unavailable."`
                          : `"Shalom ${selectedOwnerForReminder.name}! This is Shabos Rent calling regarding your pending platform due balance of ${selectedOwnerForReminder.due}. Please complete payment to maintain your active host status."`}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setSelectedOwnerForReminder(null)}
                        className="px-3.5 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmSendReminder("phone")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Initiate Voice Call</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
