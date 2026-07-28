"use client";

import { useState } from "react";
import { 
  Briefcase,
  Users,
  Link as LinkIcon,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function PartnersHubPage() {
  const [activeTab, setActiveTab] = useState("affiliates");

  const affiliates = [
    {
      id: "PT-01",
      name: "Shalom Real Estate",
      tier: "Gold",
      leads: 145,
      converted: 82,
      commission: "₪4,100",
      status: "Active"
    },
    {
      id: "PT-02",
      name: "Jerusalem Rentals Group",
      tier: "Silver",
      leads: 64,
      converted: 30,
      commission: "₪1,200",
      status: "Active"
    },
    {
      id: "PT-03",
      name: "Avi's Travel Agency",
      tier: "Bronze",
      leads: 12,
      converted: 3,
      commission: "₪150",
      status: "Pending Review"
    }
  ];

  const payouts = [
    {
      id: "PAY-104",
      partner: "Shalom Real Estate",
      amount: "₪1,500",
      date: "Today, 10:30",
      status: "Pending"
    },
    {
      id: "PAY-103",
      partner: "Jerusalem Rentals Group",
      amount: "₪400",
      date: "Yesterday",
      status: "Paid"
    }
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-indigo-500" /> Partners & Affiliates Hub
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage affiliate networks, commission tiers, lead tracking, and partner payouts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-400 transition-colors">
            Generate Partner Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Users className="w-4 h-4 text-indigo-500" /> Total Partners
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">34</div>
            <div className="text-xs text-emerald-600 font-medium">+5 new this month</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <TrendingUp className="w-4 h-4 text-emerald-500" /> Total Leads
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">1,245</div>
            <div className="text-xs text-zinc-500 font-medium">32% conversion rate</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <DollarSign className="w-4 h-4 text-purple-500" /> Unpaid Commissions
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">₪2,450</div>
            <div className="text-xs text-orange-600 font-medium flex items-center gap-1">
               <Clock className="w-3 h-3" /> 3 pending requests
            </div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Award className="w-4 h-4 text-amber-500" /> Top Tier (Gold)
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">8</div>
            <div className="text-xs text-zinc-500 font-medium">Partners generating 50+ leads</div>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         
         <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Partner Network</h2>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                     <tr>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Partner Details</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Tier & Status</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Performance</th>
                        <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Commission</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {affiliates.map((partner) => (
                        <tr key={partner.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer group">
                           <td className="px-5 py-4">
                              <div className="font-bold text-zinc-900 dark:text-white mb-0.5 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                 {partner.name} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </div>
                              <div className="text-xs font-mono text-zinc-400 flex items-center gap-1 mt-1">
                                 <LinkIcon className="w-3 h-3" /> shabbosrent.com/ref/{partner.id.toLowerCase()}
                              </div>
                           </td>
                           <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 ${
                                 partner.tier === 'Gold' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                 partner.tier === 'Silver' ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' :
                                 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                                 <Award className="w-3 h-3" /> {partner.tier}
                              </span>
                              <div className="text-xs font-medium text-zinc-500">{partner.status}</div>
                           </td>
                           <td className="px-5 py-4">
                              <div className="flex items-center gap-4 text-sm font-medium">
                                 <div>
                                    <div className="text-zinc-500 text-xs">Leads</div>
                                    <div className="text-zinc-900 dark:text-white">{partner.leads}</div>
                                 </div>
                                 <div>
                                    <div className="text-zinc-500 text-xs">Converted</div>
                                    <div className="text-emerald-600 dark:text-emerald-400">{partner.converted}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-5 py-4 text-right">
                              <div className="font-black text-zinc-900 dark:text-white text-base">{partner.commission}</div>
                              <div className="text-xs text-zinc-500 font-medium">Total earned</div>
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
                  Payout Requests
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">1 Action Req</span>
               </h2>
               
               <div className="space-y-4 flex-1">
                  {payouts.map((req) => (
                     <div key={req.id} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="flex justify-between items-start mb-2">
                           <div className="font-bold text-sm text-zinc-900 dark:text-white">{req.partner}</div>
                           <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              req.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                           }`}>
                              {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                              {req.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                              {req.status}
                           </span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="text-xs text-zinc-500 font-mono">{req.date} • {req.id}</div>
                           <div className="font-black text-zinc-900 dark:text-white">{req.amount}</div>
                        </div>
                        {req.status === 'Pending' && (
                           <button className="mt-3 w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1">
                              Approve & Pay <ChevronRight className="w-3 h-3" />
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
