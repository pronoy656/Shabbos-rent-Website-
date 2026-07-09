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
  Image as ImageIcon 
} from "lucide-react";

export default function ApartmentsPage() {
  const apartments = [
    {
      id: "A-102",
      code: "A-102",
      owner: "David",
      city: "Jerusalem",
      status: "Active",
      available: "2 weekends",
    },
    // We can add more mock data here if needed to show a list
    {
      id: "A-103",
      code: "A-103",
      owner: "Rachel",
      city: "Bnei Brak",
      status: "Active",
      available: "Fully Booked",
    },
    {
      id: "A-104",
      code: "A-104",
      owner: "Moshe",
      city: "Tzfat",
      status: "Suspended",
      available: "0 weekends",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Apartments</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage all property listings on the platform
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Left Side: Search */}
          <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-colors"
              placeholder="Search apartment / code / owner"
            />
          </div>

          {/* Right Side: Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[140px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0">
                Select a city
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">All Cities</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Jerusalem</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Tel Aviv</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Bnei Brak</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Tzfat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[140px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0">
                Select a status
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">All Statuses</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Active</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Inactive</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md text-[13px]">Suspended</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Photo</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Code</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Owner</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">City</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Available</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {apartments.map((apt) => (
                <tr key={apt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {apt.code}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {apt.owner}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {apt.city}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      apt.status === "Active" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      apt.available.includes("weekends") && !apt.available.includes("0")
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {apt.available}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/apartments/${apt.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Link>
                      <button 
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                        title="Suspend"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
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
