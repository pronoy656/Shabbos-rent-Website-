"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Calendar, BedDouble, Search, MoreVertical, CheckCircle2, Clock, XCircle } from "lucide-react";

const SWAP_STATUSES = ["All", "Pending", "Completed", "Cancelled"];

const MOCK_SWAPS = [
  {
    id: "SWP-1042",
    status: "Pending",
    date: "2026-08-15 to 2026-08-20",
    owner1: {
      name: "David Cohen",
      apartment: {
        title: "Modern Jerusalem Flat",
        code: "APT-104",
        beds: 3,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop"
      }
    },
    owner2: {
      name: "Sarah Levy",
      apartment: {
        title: "Luxury Tel Aviv Condo",
        code: "APT-882",
        beds: 4,
        image: "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=2000&auto=format&fit=crop"
      }
    }
  },
  {
    id: "SWP-0921",
    status: "Completed",
    date: "2026-07-01 to 2026-07-08",
    owner1: {
      name: "Moshe Goldberg",
      apartment: {
        title: "Spacious Safed Villa",
        code: "APT-551",
        beds: 6,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"
      }
    },
    owner2: {
      name: "Rivka Shapiro",
      apartment: {
        title: "Haifa Seaside Apartment",
        code: "APT-339",
        beds: 2,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000&auto=format&fit=crop"
      }
    }
  },
  {
    id: "SWP-0899",
    status: "Cancelled",
    date: "2026-06-12 to 2026-06-15",
    owner1: {
      name: "Chaim Stern",
      apartment: {
        title: "Central Bnei Brak Suite",
        code: "APT-210",
        beds: 5,
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2000&auto=format&fit=crop"
      }
    },
    owner2: {
      name: "Rachel Weiss",
      apartment: {
        title: "Netanya Beach House",
        code: "APT-741",
        beds: 4,
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2000&auto=format&fit=crop"
      }
    }
  }
];

export default function SwapsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSwaps = MOCK_SWAPS.filter(swap => {
    const matchesTab = activeTab === "All" || swap.status === activeTab;
    const matchesSearch = 
      swap.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.owner1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.owner2.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Pending": return <Clock className="h-3.5 w-3.5" />;
      case "Completed": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "Cancelled": return <XCircle className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending": return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "Completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Swaps Management</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Track and manage all apartment exchanges between owners.
        </p>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {/* Premium Segmented Control Tabs */}
        <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
          {SWAP_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`relative px-5 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 ${
                activeTab === status
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            placeholder="Search owners or swap ID..."
          />
        </div>
      </div>

      {/* Grid of Swaps */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSwaps.map((swap) => (
          <Link href={`/dashboard/swaps/${swap.id}`} key={swap.id} className="block group/card">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col group-hover/card:border-blue-300 dark:group-hover/card:border-blue-700 group-hover/card:shadow-md transition-all duration-300">
            
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{swap.id}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" /> {swap.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(swap.status)}`}>
                  {getStatusIcon(swap.status)}
                  {swap.status}
                </span>
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Card Body (Side-by-side comparison) */}
            <div className="flex flex-col sm:flex-row items-center p-5 gap-4 relative flex-1">
              
              {/* Owner 1 */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate" title={swap.owner1.name}>{swap.owner1.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Initiator</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={swap.owner1.apartment.image} alt={swap.owner1.apartment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold truncate">{swap.owner1.apartment.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/90 text-[10px] font-medium">{swap.owner1.apartment.code}</span>
                      <span className="flex items-center gap-1 text-white/90 text-[10px] font-medium">
                        <BedDouble className="h-3 w-3" /> {swap.owner1.apartment.beds}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Icon */}
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 z-10 mx-[-20px] ring-4 ring-white dark:ring-zinc-900">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <div className="flex sm:hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 z-10 rotate-90 my-[-10px] ring-4 ring-white dark:ring-zinc-900">
                <ArrowRightLeft className="h-4 w-4" />
              </div>

              {/* Owner 2 */}
              <div className="flex-1 w-full space-y-3">
                 <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate" title={swap.owner2.name}>{swap.owner2.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Recipient</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={swap.owner2.apartment.image} alt={swap.owner2.apartment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold truncate">{swap.owner2.apartment.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/90 text-[10px] font-medium">{swap.owner2.apartment.code}</span>
                      <span className="flex items-center gap-1 text-white/90 text-[10px] font-medium">
                        <BedDouble className="h-3 w-3" /> {swap.owner2.apartment.beds}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </Link>
        ))}

        {filteredSwaps.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <ArrowRightLeft className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No swaps found</h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
