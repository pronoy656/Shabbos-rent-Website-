"use client";

import { useState } from "react";
import { 
  PhoneCall, 
  Search, 
  Filter, 
  PhoneIncoming, 
  PhoneMissed,
  Clock,
  Play,
  AlertTriangle,
  Building2,
  Calendar
} from "lucide-react";

export default function ApartmentCallsPage() {
  const [filter, setFilter] = useState("All");

  const calls = [
    {
      id: "C-1042",
      apartmentId: "A-1204",
      renter: { name: "Levi", phone: "+972 54-111-2222" },
      owner: { name: "David Cohen", phone: "+972 50-987-6543" },
      status: "Answered",
      duration: "4:20",
      time: "Today, 14:30",
      flagged: false,
      recording: true
    },
    {
      id: "C-1041",
      apartmentId: "A-0892",
      renter: { name: "Unknown", phone: "+972 52-333-4444" },
      owner: { name: "Sarah Klein", phone: "+972 53-222-1111" },
      status: "Missed",
      duration: "0:00",
      time: "Today, 12:15",
      flagged: false,
      recording: false
    },
    {
      id: "C-1040",
      apartmentId: "A-1204",
      renter: { name: "Levi", phone: "+972 54-111-2222" },
      owner: { name: "David Cohen", phone: "+972 50-987-6543" },
      status: "Answered",
      duration: "12:45",
      time: "Yesterday, 18:00",
      flagged: true,
      recording: true
    },
    {
      id: "C-1039",
      apartmentId: "A-0551",
      renter: { name: "Moshe", phone: "+1 212-555-0198" },
      owner: { name: "Rivka", phone: "+972 54-444-5555" },
      status: "Answered",
      duration: "1:30",
      time: "Yesterday, 10:20",
      flagged: false,
      recording: true
    }
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-8 h-8 text-indigo-600" /> Apartment Calls
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Global log of all connected calls between prospective renters and apartment owners.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
             <input 
                type="text" 
                placeholder="Search phone or Apt ID..." 
                className="w-64 pl-9 pr-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
             />
          </div>
          <button className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 transition-colors">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-medium text-zinc-500 mb-1">Total Calls (Today)</div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">124</div>
         </div>
         <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-medium text-zinc-500 mb-1">Answer Rate</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">82%</div>
         </div>
         <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-medium text-zinc-500 mb-1">Avg Duration</div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">2m 14s</div>
         </div>
         <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 shadow-sm dark:border-orange-900/30 dark:bg-orange-950/20">
            <div className="text-sm font-medium text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1.5">
               <AlertTriangle className="w-4 h-4" /> Flagged Calls
            </div>
            <div className="text-3xl font-black text-orange-700 dark:text-orange-500">3</div>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
                  <tr>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Call details</th>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Apartment</th>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Renter (Caller)</th>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Owner (Receiver)</th>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Status & Duration</th>
                     <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {calls.map((call) => (
                     <tr key={call.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors ${call.flagged ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}>
                        <td className="px-5 py-4">
                           <div className="font-mono text-xs text-zinc-500 mb-1">{call.id}</div>
                           <div className="flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-white">
                              <Calendar className="w-3 h-3" /> {call.time}
                           </div>
                           {call.flagged && (
                              <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded">
                                 <AlertTriangle className="w-3 h-3" /> Dispute Flag
                              </span>
                           )}
                        </td>
                        <td className="px-5 py-4">
                           <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                 <Building2 className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-zinc-900 dark:text-white hover:text-blue-600 cursor-pointer">{call.apartmentId}</span>
                           </div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white">{call.renter.name}</div>
                           <div className="text-xs text-zinc-500 font-mono mt-0.5">{call.renter.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white">{call.owner.name}</div>
                           <div className="text-xs text-zinc-500 font-mono mt-0.5">{call.owner.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                           {call.status === "Answered" ? (
                              <div>
                                 <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                                    <PhoneIncoming className="w-4 h-4" /> Answered
                                 </span>
                                 <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" /> {call.duration}
                                 </div>
                              </div>
                           ) : (
                              <div>
                                 <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-bold">
                                    <PhoneMissed className="w-4 h-4" /> Missed
                                 </span>
                              </div>
                           )}
                        </td>
                        <td className="px-5 py-4 text-right">
                           {call.recording ? (
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors border border-blue-200 dark:border-blue-800">
                                 <Play className="w-3 h-3 fill-current" /> Play Audio
                              </button>
                           ) : (
                              <span className="text-xs text-zinc-400 italic">No recording</span>
                           )}
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
