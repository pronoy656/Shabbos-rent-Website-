"use client";

import { useState } from "react";
import { 
  Clock,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  Download,
  AlertTriangle,
  ChevronDown
} from "lucide-react";

export default function WorkerHoursPage() {
  const [payPeriod, setPayPeriod] = useState("August 2026");

  const logs = [
    {
      id: "LOG-102",
      worker: "Sarah Levy",
      date: "Aug 15, 2026",
      clockIn: "09:00",
      clockOut: "17:30",
      totalHours: "8.5",
      payRate: "₪40/hr",
      earned: "₪340",
      status: "Approved"
    },
    {
      id: "LOG-101",
      worker: "Yossi Klein",
      date: "Aug 15, 2026",
      clockIn: "14:00",
      clockOut: "18:00",
      totalHours: "4.0",
      payRate: "₪45/hr",
      earned: "₪180",
      status: "Approved"
    },
    {
      id: "LOG-100",
      worker: "Sarah Levy",
      date: "Aug 14, 2026",
      clockIn: "09:00",
      clockOut: "14:00",
      totalHours: "5.0",
      payRate: "₪40/hr",
      earned: "₪200",
      status: "Paid"
    }
  ];

  const paychecks = [
    { worker: "Sarah Levy", period: "August 2026 (To Date)", hours: "85.5", totalPay: "₪3,420", status: "Pending" },
    { worker: "Yossi Klein", period: "August 2026 (To Date)", hours: "64.0", totalPay: "₪2,880", status: "Pending" }
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-8 h-8 text-indigo-500" /> Worker Hours & Payroll
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track staff clock-in times and generate payroll reports.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-colors">
            <Download className="mr-2 h-4 w-4" /> Export Payroll CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Clock className="w-4 h-4 text-indigo-500" /> Total Hours Logged
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">149.5</div>
            <div className="text-xs text-zinc-500 font-medium">For August 2026</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <DollarSign className="w-4 h-4 text-emerald-500" /> Pending Payroll
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">₪6,300</div>
            <div className="text-xs text-emerald-600 font-medium">Ready to be paid out</div>
         </div>
         <div className="p-6 rounded-xl border border-orange-200 bg-orange-50/50 shadow-sm dark:border-orange-900/30 dark:bg-orange-950/20">
            <div className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <AlertTriangle className="w-4 h-4" /> Discrepancies
            </div>
            <div className="text-3xl font-black text-orange-700 dark:text-orange-500 mb-1">0</div>
            <div className="text-xs text-orange-600/80 font-medium">All timesheets match schedule</div>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         
         <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Daily Logs</h2>
               <div className="relative">
                  <select 
                     value={payPeriod}
                     onChange={(e) => setPayPeriod(e.target.value)}
                     className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                     <option>August 2026</option>
                     <option>July 2026</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                     <tr>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Date & Worker</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Clock In/Out</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Total Hours</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Earned</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                           <td className="px-5 py-4">
                              <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-1">
                                 <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {log.date}
                              </div>
                              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{log.worker}</div>
                           </td>
                           <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                 <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.clockIn}</span>
                                 <span className="text-zinc-400">-</span>
                                 <span className="text-blue-600 dark:text-blue-400 font-bold">{log.clockOut}</span>
                              </div>
                              <div className="text-xs text-zinc-500 font-mono mt-1">Log ID: {log.id}</div>
                           </td>
                           <td className="px-5 py-4 font-black text-zinc-900 dark:text-white">
                              {log.totalHours}h
                           </td>
                           <td className="px-5 py-4 text-right">
                              <div className="font-black text-zinc-900 dark:text-white text-base">{log.earned}</div>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${
                                 log.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                 {log.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                                 {log.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 flex flex-col h-full">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center justify-between">
                  Payout Generator
               </h2>
               
               <div className="space-y-4 flex-1">
                  {paychecks.map((check, i) => (
                     <div key={i} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="font-bold text-sm text-zinc-900 dark:text-white mb-1">{check.worker}</div>
                        <div className="text-xs text-zinc-500 mb-3">{check.period} • {check.hours} Hours</div>
                        <div className="flex justify-between items-end">
                           <div className="font-black text-zinc-900 dark:text-white text-lg">{check.totalPay}</div>
                           <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors">
                              Generate PDF
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> Mark All as Paid
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}
