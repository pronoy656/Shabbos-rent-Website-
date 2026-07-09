"use client";

import { useState } from "react";
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
  DollarSign
} from "lucide-react";

type Owner = {
  id: string;
  name: string;
  phone: string;
  listings: number;
  earnings: string;
  unpaid: string;
  due: string;
};

export default function OwnersPage() {
  const [selectedOwnerForReminder, setSelectedOwnerForReminder] = useState<Owner | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const owners: Owner[] = [
    {
      id: "david-cohen",
      name: "David Cohen",
      phone: "+972-50-123-4567",
      listings: 3,
      earnings: "₪1,250",
      unpaid: "₪50",
      due: "₪50",
    },
    {
      id: "rachel-levy",
      name: "Rachel Levy",
      phone: "+972-52-987-6543",
      listings: 1,
      earnings: "₪450",
      unpaid: "₪0",
      due: "₪0",
    },
    {
      id: "moshe-katz",
      name: "Moshe Katz",
      phone: "+972-54-321-0987",
      listings: 5,
      earnings: "₪3,800",
      unpaid: "₪150",
      due: "₪150",
    },
  ];

  const handleSendReminder = (type: string) => {
    if (!selectedOwnerForReminder) return;
    
    const ownerName = selectedOwnerForReminder.name;
    setSelectedOwnerForReminder(null);
    
    setToastMessage(`Successfully sent '${type}' notification to ${ownerName}`);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Owners</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage all property owners on the platform
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Left Side: Search */}
          <div className="relative w-full sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-colors"
              placeholder="Search owner by name / phone"
            />
          </div>

          {/* Right Side: Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[140px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                Select Due Status
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">All Owners</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Has Due (Unpaid)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">No Due</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Name</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Phone</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Listings</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Earnings</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Unpaid</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-red-600 dark:text-red-400">Due</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {owner.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {owner.phone}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {owner.listings}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {owner.earnings}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {owner.unpaid}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                      {owner.due}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/owners/${owner.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Link>
                      <button 
                        onClick={() => setSelectedOwnerForReminder(owner)}
                        className="inline-flex items-center justify-center rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        <BellRing className="mr-1.5 h-3.5 w-3.5" />
                        Remind
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Modal */}
      {selectedOwnerForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BellRing className="h-5 w-5 text-orange-500" />
                Send Reminder
              </h3>
              <button 
                onClick={() => setSelectedOwnerForReminder(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Select the type of notification you want to send to <span className="font-bold text-zinc-900 dark:text-white">{selectedOwnerForReminder.name}</span>:
              </p>
              
              <button 
                onClick={() => handleSendReminder("Availability Reminder")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:border-blue-500 transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Availability Reminder</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Remind owner to update their available dates.</p>
                </div>
              </button>

              <button 
                onClick={() => handleSendReminder("Request Due Payment")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 dark:hover:border-orange-500 transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Request Due Payment</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Request payment for pending platform fees.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
