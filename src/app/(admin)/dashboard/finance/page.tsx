"use client";

import { useState } from "react";
import { 
  PieChart, 
  DollarSign, 
  Download, 
  Calendar,
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  CheckCircle2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from "recharts";

export default function FinancePage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  const revenueData = [
    { name: "Week 1", subscription: 1200, rental: 800, payouts: 400 },
    { name: "Week 2", subscription: 900, rental: 1100, payouts: 600 },
    { name: "Week 3", subscription: 1500, rental: 1300, payouts: 750 },
    { name: "Week 4", subscription: 800, rental: 1600, payouts: 850 },
  ];

  const budgetData = [
    { name: "Development & Servers", value: 3500, color: "#3b82f6" },
    { name: "Marketing & Ads", value: 2000, color: "#ec4899" },
    { name: "Operations & Admin", value: 1500, color: "#10b981" },
    { name: "Partner Payouts", value: 2600, color: "#f59e0b" },
  ];

  const transactions = [
    { id: "TX-9021", date: "Today, 14:30", type: "Subscription (₪28)", entity: "David Cohen (A-1204)", amount: "+₪28", status: "Completed" },
    { id: "TX-9020", date: "Today, 11:15", type: "Rental Fee (₪50)", entity: "Rivka (A-0551)", amount: "+₪50", status: "Completed" },
    { id: "TX-9019", date: "Yesterday", type: "Partner Payout", entity: "Shalom Affiliates", amount: "-₪150", status: "Processed" },
    { id: "TX-9018", date: "Yesterday", type: "Subscription (₪28)", entity: "Moshe (A-0892)", amount: "+₪28", status: "Completed" },
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-8 h-8 text-emerald-600" /> Finance & Budget
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Comprehensive financial overview, revenue tracking, and budget allocation.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button className="inline-flex items-center justify-center rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-colors">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <DollarSign className="w-4 h-4 text-emerald-500" /> Total Revenue
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-2">₪9,200</div>
            <div className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md">
               <TrendingUp className="w-3 h-3 mr-1" /> +14.5% vs last period
            </div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <CreditCard className="w-4 h-4 text-blue-500" /> Subscriptions (₪28)
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-2">₪4,400</div>
            <div className="text-xs font-medium text-zinc-500">157 active renewals</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <FileText className="w-4 h-4 text-purple-500" /> Rental Fees (₪50)
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-2">₪4,800</div>
            <div className="text-xs font-medium text-zinc-500">96 reported rentals</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Users className="w-4 h-4 text-orange-500" /> Partner Payouts
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-2">₪2,600</div>
            <div className="text-xs font-medium text-zinc-500">28% of total revenue</div>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* Charts */}
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Revenue Breakdown Over Time</h2>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₪${value}`} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--tw-bg-opacity)' }}
                           itemStyle={{ fontWeight: 600 }}
                           formatter={(value: any) => `₪${value}`}
                           cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="subscription" name="Subscriptions" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="rental" name="Rental Fees" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="payouts" name="Partner Payouts" fill="#f97316" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
               <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Transactions</h2>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                           <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Date & ID</th>
                           <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Type</th>
                           <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Entity</th>
                           <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Amount</th>
                           <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {transactions.map((tx) => (
                           <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                              <td className="px-5 py-4">
                                 <div className="font-bold text-zinc-900 dark:text-white">{tx.date}</div>
                                 <div className="text-xs text-zinc-500 font-mono mt-0.5">{tx.id}</div>
                              </td>
                              <td className="px-5 py-4">
                                 <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                                    tx.type.includes('Subscription') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30' :
                                    tx.type.includes('Rental') ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30' :
                                    'bg-orange-50 text-orange-700 dark:bg-orange-900/30'
                                 }`}>
                                    {tx.type}
                                 </span>
                              </td>
                              <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">{tx.entity}</td>
                              <td className="px-5 py-4">
                                 <span className={`font-black text-base ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-zinc-900 dark:text-white'}`}>
                                    {tx.amount}
                                 </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                 <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                                    <CheckCircle2 className="w-3 h-3" /> {tx.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Budget Breakdown Sidebar */}
         <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 flex flex-col h-full">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Budget Allocation</h2>
               <p className="text-sm text-zinc-500 mb-8">Where the revenue is being spent</p>
               
               <div className="h-48 w-full relative mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                     <RechartsPieChart>
                        <Pie
                           data={budgetData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                        >
                           {budgetData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip 
                           formatter={(value: any) => `₪${value}`}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                     </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                     <span className="text-sm font-medium text-zinc-500">Total Spent</span>
                     <span className="text-xl font-black text-zinc-900 dark:text-white">₪9,600</span>
                  </div>
               </div>

               <div className="space-y-4 mt-auto">
                  {budgetData.map((item, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                           <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">₪{item.value.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
               
               <button className="mt-8 w-full inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors">
                  Adjust Budgets
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
