"use client";

import { useState } from "react";
import { 
  MapPin,
  TrendingUp,
  Search,
  Plus,
  Home,
  BarChart,
  Edit,
  Trash2,
  ChevronDown
} from "lucide-react";

export default function NeighborhoodsPage() {
  const [cityFilter, setCityFilter] = useState("Jerusalem");

  const neighborhoods = [
    {
      id: "N-1",
      name: "Geula",
      city: "Jerusalem",
      apartments: 245,
      avgPrice: "₪850",
      demand: "Very High",
      searchVolume: "12,500/mo"
    },
    {
      id: "N-2",
      name: "Ramat Eshkol",
      city: "Jerusalem",
      apartments: 180,
      avgPrice: "₪1,200",
      demand: "High",
      searchVolume: "8,200/mo"
    },
    {
      id: "N-3",
      name: "Mea Shearim",
      city: "Jerusalem",
      apartments: 120,
      avgPrice: "₪700",
      demand: "Medium",
      searchVolume: "4,100/mo"
    },
    {
      id: "N-4",
      name: "Romema",
      city: "Jerusalem",
      apartments: 310,
      avgPrice: "₪950",
      demand: "High",
      searchVolume: "10,000/mo"
    }
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-8 h-8 text-teal-600" /> Neighborhoods
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure regions, track average pricing, and monitor search demand per neighborhood.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-700 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> Add Neighborhood
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <MapPin className="w-4 h-4 text-teal-500" /> Total Regions
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">42</div>
            <div className="text-xs text-zinc-500 font-medium">Across 8 cities</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <Home className="w-4 h-4 text-blue-500" /> Most Dense
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white mb-1 truncate">Romema</div>
            <div className="text-xs text-zinc-500 font-medium">310 Active Listings</div>
         </div>
         <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
               <BarChart className="w-4 h-4 text-orange-500" /> Highest Demand
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-white mb-1 truncate">Geula</div>
            <div className="text-xs text-orange-600 font-medium flex items-center gap-1">
               <TrendingUp className="w-3 h-3" /> Trending Up
            </div>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2">
               <div className="relative">
                  <select 
                     value={cityFilter}
                     onChange={(e) => setCityFilter(e.target.value)}
                     className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-bold text-zinc-700 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                     <option>Jerusalem</option>
                     <option>Bnei Brak</option>
                     <option>Tzfat</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
               </div>
            </div>
            
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
               <input 
                  type="text" 
                  placeholder="Search neighborhoods..." 
                  className="w-64 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs shadow-sm focus:ring-2 focus:ring-teal-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-white dark:bg-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Neighborhood</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Listings</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Avg Price</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">Search Demand</th>
                     <th className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {neighborhoods.map((n) => (
                     <tr key={n.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white mb-0.5">{n.name}</div>
                           <div className="text-xs text-zinc-500 font-medium">{n.city}</div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                              <Home className="w-4 h-4 text-blue-500" /> {n.apartments}
                           </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-zinc-900 dark:text-white">
                           {n.avgPrice}
                        </td>
                        <td className="px-5 py-4">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                 n.demand === 'Very High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                 n.demand === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              }`}>
                                 {n.demand}
                              </span>
                           </div>
                           <div className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                              <Search className="w-3 h-3" /> {n.searchVolume} searches
                           </div>
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                           <button className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-300 transition-colors">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button className="inline-flex items-center justify-center p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 shadow-sm hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
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
