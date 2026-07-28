"use client";

import { useState } from "react";
import { 
  Users,
  Briefcase,
  Search,
  Plus,
  DollarSign,
  Star,
  Activity,
  Edit,
  Phone,
  Mail
} from "lucide-react";

export default function WorkersCRMPage() {
  const workers = [
    {
      id: "W-1",
      name: "Sarah Levy",
      role: "Customer Support",
      payRate: "₪40/hr",
      phone: "+972 50-111-2222",
      email: "sarah@shabbosrent.com",
      status: "Active",
      rating: "4.9",
      hoursThisMonth: 120
    },
    {
      id: "W-2",
      name: "Yossi Klein",
      role: "Listing Approvals",
      payRate: "₪45/hr",
      phone: "+972 54-333-4444",
      email: "yossi@shabbosrent.com",
      status: "Active",
      rating: "4.7",
      hoursThisMonth: 95
    },
    {
      id: "W-3",
      name: "Rivka Cohen",
      role: "Sales & Affiliates",
      payRate: "₪55/hr",
      phone: "+972 52-555-6666",
      email: "rivka@shabbosrent.com",
      status: "On Leave",
      rating: "4.8",
      hoursThisMonth: 0
    }
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" /> Workers CRM
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage internal staff, pay rates, and performance metrics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> Add Worker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Briefcase className="w-4 h-4 text-blue-500" /> Total Staff
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">12</div>
            <div className="text-xs text-emerald-600 font-medium">10 Active, 2 On Leave</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Activity className="w-4 h-4 text-emerald-500" /> Avg Performance
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">4.8</div>
            <div className="flex text-amber-400">
               <Star className="w-4 h-4 fill-current" />
               <Star className="w-4 h-4 fill-current" />
               <Star className="w-4 h-4 fill-current" />
               <Star className="w-4 h-4 fill-current" />
               <Star className="w-4 h-4 fill-current opacity-50" />
            </div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <DollarSign className="w-4 h-4 text-purple-500" /> Total Payroll Est.
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">₪24,500</div>
            <div className="text-xs text-zinc-500 font-medium">Projected for this month</div>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
               <input 
                  type="text" 
                  placeholder="Search workers by name or role..." 
                  className="w-72 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs shadow-sm focus:ring-2 focus:ring-blue-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Worker</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Contact Details</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Pay Rate</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Performance</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {workers.map((worker) => (
                     <tr key={worker.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-5 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400">
                                 {worker.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-zinc-900 dark:text-white mb-0.5">{worker.name}</div>
                                 <div className="text-xs font-medium text-zinc-500">{worker.role}</div>
                              </div>
                           </div>
                           <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              worker.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                              'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                           }`}>
                              {worker.status}
                           </span>
                        </td>
                        <td className="px-5 py-4 space-y-1">
                           <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                              <Phone className="w-3.5 h-3.5" /> {worker.phone}
                           </div>
                           <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                              <Mail className="w-3.5 h-3.5" /> {worker.email}
                           </div>
                        </td>
                        <td className="px-5 py-4 font-black text-zinc-900 dark:text-white text-base">
                           {worker.payRate}
                        </td>
                        <td className="px-5 py-4">
                           <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                              <Star className="w-4 h-4 fill-current" /> {worker.rating}
                           </div>
                           <div className="text-xs text-zinc-500 font-medium">{worker.hoursThisMonth} hours logged (month)</div>
                        </td>
                        <td className="px-5 py-4 text-right">
                           <button className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-300 transition-colors">
                              <Edit className="w-4 h-4" />
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
