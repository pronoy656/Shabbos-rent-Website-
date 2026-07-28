"use client";

import { useState } from "react";
import { 
  Megaphone,
  Mail,
  Smartphone,
  MessageSquare,
  Bell,
  Users,
  Send,
  Plus,
  PlayCircle,
  PauseCircle,
  BarChart2,
  Calendar,
  CheckCircle2
} from "lucide-react";

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("active");

  const campaigns = [
    {
      id: "CMP-01",
      name: "Elul Early Booking Promo",
      audience: "Past Renters",
      size: 1250,
      channels: ["WhatsApp", "Email"],
      status: "Active",
      sent: 850,
      engagement: "24%",
      cost: "₪42",
      startDate: "Aug 1"
    },
    {
      id: "CMP-02",
      name: "New System Features Announcement",
      audience: "Registered Owners",
      size: 420,
      channels: ["Email", "Push"],
      status: "Draft",
      sent: 0,
      engagement: "0%",
      cost: "₪0",
      startDate: "TBD"
    },
    {
      id: "CMP-03",
      name: "Shavuot Last Minute Deals",
      audience: "All Users",
      size: 3400,
      channels: ["SMS", "WhatsApp"],
      status: "Completed",
      sent: 3400,
      engagement: "68%",
      cost: "₪280",
      startDate: "May 15"
    }
  ];

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === "active") return c.status === "Active" || c.status === "Draft";
    if (activeTab === "completed") return c.status === "Completed";
    return true;
  });

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-8 h-8 text-pink-500" /> Mass Campaigns
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, manage, and track mass messaging campaigns across multiple channels.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-pink-700 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Users className="w-4 h-4 text-blue-500" /> Total Reachable
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">4,820</div>
            <div className="text-xs text-zinc-500 font-medium">Unique users across all lists</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Send className="w-4 h-4 text-emerald-500" /> Messages Sent
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">12.4k</div>
            <div className="text-xs text-zinc-500 font-medium">This month</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <BarChart2 className="w-4 h-4 text-purple-500" /> Avg Engagement
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">45%</div>
            <div className="text-xs text-emerald-600 font-medium">+5% vs last month</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <MessageSquare className="w-4 h-4 text-orange-500" /> Est. Monthly Cost
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">₪450</div>
            <div className="text-xs text-zinc-500 font-medium">Based on SMS & API usage</div>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex space-x-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
               {["Active", "Completed", "All"].map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab.toLowerCase())}
                     className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                        activeTab === tab.toLowerCase()
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Campaign Details</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Audience & Channels</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Progress</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Performance</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredCampaigns.map((camp) => (
                     <tr key={camp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white mb-1">{camp.name}</div>
                           <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                 camp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                 camp.status === 'Completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'
                              }`}>
                                 {camp.status === 'Active' && <PlayCircle className="w-3 h-3" />}
                                 {camp.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                 {camp.status === 'Draft' && <PauseCircle className="w-3 h-3" />}
                                 {camp.status}
                              </span>
                              <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                                 <Calendar className="w-3 h-3" /> {camp.startDate}
                              </span>
                           </div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-medium text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-zinc-400" /> {camp.audience}
                           </div>
                           <div className="flex gap-1.5">
                              {camp.channels.map(ch => (
                                 <span key={ch} title={ch} className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                    {ch === 'SMS' && <Smartphone className="w-3.5 h-3.5" />}
                                    {ch === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5" />}
                                    {ch === 'Email' && <Mail className="w-3.5 h-3.5" />}
                                    {ch === 'Push' && <Bell className="w-3.5 h-3.5" />}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="flex justify-between text-xs font-medium mb-1">
                              <span className="text-zinc-500">Sent: {camp.sent} / {camp.size}</span>
                              <span className="text-zinc-900 dark:text-white">{Math.round((camp.sent/camp.size)*100)}%</span>
                           </div>
                           <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${camp.status === 'Completed' ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${(camp.sent/camp.size)*100}%` }}></div>
                           </div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="text-sm font-black text-zinc-900 dark:text-white">{camp.engagement}</div>
                           <div className="text-xs text-zinc-500 font-medium">Est. Cost: {camp.cost}</div>
                        </td>
                        <td className="px-5 py-4 text-right">
                           <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors">
                              View Report
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
