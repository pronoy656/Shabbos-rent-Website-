"use client";

import { useState } from "react";
import { 
  FileText,
  AlertTriangle,
  Search,
  Filter,
  MessageSquare,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  Send
} from "lucide-react";

export default function OpenDebtsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const debts = [
    {
      id: "D-8902",
      apartmentId: "A-1204",
      owner: "David Cohen",
      phone: "+972 50-987-6543",
      amount: "₪50",
      dueDate: "Aug 15, 2026",
      status: "Overdue",
      rentalDates: "Aug 8-9 (Re'eh)",
      remindersSent: 2,
      lastReminder: "2 days ago"
    },
    {
      id: "D-8901",
      apartmentId: "A-0551",
      owner: "Rivka",
      phone: "+972 54-444-5555",
      amount: "₪50",
      dueDate: "Aug 17, 2026",
      status: "Warning Sent",
      rentalDates: "Aug 8-9 (Re'eh)",
      remindersSent: 1,
      lastReminder: "Yesterday"
    },
    {
      id: "D-8899",
      apartmentId: "A-0892",
      owner: "Sarah Klein",
      phone: "+972 53-222-1111",
      amount: "₪100",
      dueDate: "Aug 20, 2026",
      status: "Pending",
      rentalDates: "Aug 15-16 (Shoftim)",
      remindersSent: 0,
      lastReminder: "N/A"
    },
    {
      id: "D-8895",
      apartmentId: "A-0102",
      owner: "Yitzhak",
      phone: "+972 52-111-9999",
      amount: "₪50",
      dueDate: "Jul 30, 2026",
      status: "Severely Overdue",
      rentalDates: "Jul 24-25 (Pinchas)",
      remindersSent: 4,
      lastReminder: "1 week ago"
    }
  ];

  const totalOwed = "₪1,450";
  const overdueCount = 12;

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-red-500" /> Open Debts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track and collect unpaid ₪50 rental report fees from apartment owners.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 transition-colors">
            <Send className="mr-2 h-4 w-4" /> Send Bulk Reminders
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-6 rounded-xl border border-red-200 bg-red-50/50 shadow-sm dark:border-red-900/30 dark:bg-red-950/20">
            <div className="text-sm font-bold text-red-800 dark:text-red-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
               <DollarSign className="w-4 h-4" /> Total Outstanding
            </div>
            <div className="text-4xl font-black text-red-700 dark:text-red-500">{totalOwed}</div>
            <p className="text-xs text-red-600/80 mt-2 font-medium">Across 28 unpaid reports</p>
         </div>
         
         <div className="p-6 rounded-xl border border-orange-200 bg-orange-50/50 shadow-sm dark:border-orange-900/30 dark:bg-orange-950/20">
            <div className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
               <AlertTriangle className="w-4 h-4" /> Overdue Debts
            </div>
            <div className="text-4xl font-black text-orange-700 dark:text-orange-500">{overdueCount}</div>
            <p className="text-xs text-orange-600/80 mt-2 font-medium">Past their 7-day grace period</p>
         </div>

         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Collected This Week
            </div>
            <div className="text-4xl font-black text-zinc-900 dark:text-white">₪850</div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">+15% vs last week</p>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex space-x-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
               {["All", "Pending", "Warning Sent", "Overdue"].map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab.toLowerCase())}
                     className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                        activeTab === tab.toLowerCase()
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input 
                     type="text" 
                     placeholder="Search owners or Apt ID..." 
                     className="w-64 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs shadow-sm focus:ring-2 focus:ring-red-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
               </div>
               <button className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 transition-colors">
                  <Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Owner & Apt</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Rental Context</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Amount & Status</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Reminders</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {debts.map((debt) => (
                     <tr key={debt.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white mb-0.5">{debt.owner}</div>
                           <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                              <Building2 className="w-3.5 h-3.5" /> {debt.apartmentId}
                           </div>
                           <div className="text-xs font-mono text-zinc-400 mt-1">{debt.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="text-zinc-900 dark:text-white font-medium">{debt.rentalDates}</div>
                           <div className="text-xs text-zinc-500 mt-0.5 font-mono">Report ID: {debt.id}</div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-black text-zinc-900 dark:text-white text-base mb-1.5">{debt.amount}</div>
                           <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              debt.status === 'Severely Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                              debt.status === 'Overdue' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                              debt.status === 'Warning Sent' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                              'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'
                           }`}>
                              {debt.status === 'Severely Overdue' && <AlertTriangle className="w-3 h-3" />}
                              {debt.status}
                           </span>
                        </td>
                        <td className="px-5 py-4">
                           <div className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-1.5">
                              {debt.remindersSent} Sent
                           </div>
                           {debt.remindersSent > 0 && (
                              <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> Last: {debt.lastReminder}
                              </div>
                           )}
                        </td>
                        <td className="px-5 py-4 text-right space-y-2">
                           <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 transition-colors border border-green-200 dark:border-green-800">
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Reminder
                           </button>
                           <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-zinc-200 text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-300">
                              Mark Paid
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
