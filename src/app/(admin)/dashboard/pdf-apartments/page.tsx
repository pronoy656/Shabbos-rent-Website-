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
  Ban, 
  Image as ImageIcon,
  LayoutGrid,
  List,
  CheckCircle,
  Clock,
  MapPin,
  Home
} from "lucide-react";

export default function ApartmentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [cityFilter, setCityFilter] = useState("All Cities");

  const apartments = [
    {
      id: "A-102",
      code: "A-102",
      title: "Luxury Penthouse with View",
      owner: "David Cohen",
      city: "Jerusalem",
      neighborhood: "Rehavia",
      status: "Active",
      available: "2 weekends",
      price: "₪1,200/weekend",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "A-103",
      code: "A-103",
      title: "Cozy Family Apartment",
      owner: "Rachel Levy",
      city: "Bnei Brak",
      neighborhood: "Ramat Aharon",
      status: "Active",
      available: "Fully Booked",
      price: "₪800/weekend",
      image: "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "A-104",
      code: "A-104",
      title: "Spacious Villa near Shul",
      owner: "Moshe Klein",
      city: "Tzfat",
      neighborhood: "Old City",
      status: "Suspended",
      available: "0 weekends",
      price: "₪1,500/weekend",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=300&auto=format&fit=crop"
    },
  ];

  const pendingApartments = [
    {
      id: "P-201",
      code: "P-201",
      title: "New Garden Suite",
      owner: "Yossi Friedman",
      city: "Jerusalem",
      neighborhood: "Katamon",
      status: "Pending",
      submitted: "2 hours ago"
    },
    {
      id: "P-202",
      code: "P-202",
      title: "Central Studio",
      owner: "Sara Gold",
      city: "Tel Aviv",
      neighborhood: "Florentin",
      status: "Pending",
      submitted: "1 day ago"
    }
  ];

  const filteredApartments = cityFilter === "All Cities" 
    ? apartments 
    : apartments.filter(a => a.city === cityFilter);

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" /> Apartments
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage all property listings, approvals, and availability
          </p>
        </div>
        
        <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "all" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            All Apartments
          </button>
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === "pending" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Pending Approval
            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingApartments.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "pending" ? (
        // Pending Approval Queue
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" /> Pending Approval Queue
          </h2>
          <div className="space-y-4">
            {pendingApartments.map(apt => (
              <div key={apt.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-orange-50/30 dark:bg-orange-900/10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{apt.title} <span className="text-xs text-zinc-400 font-normal">({apt.code})</span></h3>
                    <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {apt.neighborhood}, {apt.city}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.submitted}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                  <span className="text-sm font-medium mr-4">Owner: {apt.owner}</span>
                  <Link href={`/dashboard/pdf-apartments/${apt.id}`} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 font-semibold rounded-md text-sm transition-colors">
                    Review Listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // All Apartments View
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          
          {/* Filters & View Toggle Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl">
            
            {/* Left Side: Search & City Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-colors shadow-sm"
                  placeholder="Search code, title, owner..."
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-between w-full sm:w-40 rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                  {cityFilter}
                  <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                  {["All Cities", "Jerusalem", "Tel Aviv", "Bnei Brak", "Tzfat"].map(city => (
                    <DropdownMenuItem 
                      key={city}
                      onClick={() => setCityFilter(city)}
                      className="cursor-pointer rounded-md text-[13px]"
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Side: View Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "list" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "grid" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-0">
            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
                    <tr>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 w-16">Photo</th>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Details</th>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Location</th>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Available</th>
                      <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredApartments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="h-12 w-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                            <img src={apt.image} alt={apt.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-900 dark:text-white">{apt.title}</div>
                          <div className="text-zinc-500 text-xs mt-1">{apt.code} • {apt.owner}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-zinc-700 dark:text-zinc-300">{apt.city}</div>
                          <div className="text-zinc-500 text-xs mt-1">{apt.neighborhood}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            apt.status === "Active" 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          }`}>
                            {apt.status === "Active" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            apt.available.includes("weekends") && !apt.available.includes("0")
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}>
                            {apt.available}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/dashboard/apartments/${apt.id}`}
                            className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {filteredApartments.map(apt => (
                  <div key={apt.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 group hover:shadow-md transition-all flex flex-col">
                    <div className="relative h-48 bg-zinc-200 dark:bg-zinc-800">
                      <img src={apt.image} alt={apt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-zinc-900 dark:text-white shadow-sm">
                        {apt.code}
                      </div>
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                            apt.status === "Active" 
                              ? "bg-emerald-500 text-white"
                              : "bg-red-500 text-white"
                          }`}>
                        {apt.status}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight mb-1">{apt.title}</h3>
                      <p className="text-zinc-500 text-sm flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" /> {apt.neighborhood}, {apt.city}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-zinc-400">Owner</p>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{apt.owner}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-zinc-400">Availability</p>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{apt.available}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-white">{apt.price}</span>
                        <Link 
                            href={`/dashboard/apartments/${apt.id}`}
                            className="inline-flex items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-xs font-bold shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                          >
                            Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
