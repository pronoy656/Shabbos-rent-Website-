"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  Download,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ArrowRightLeft,
  Activity
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboardPage() {
  const metrics = [
    {
      title: "Total Apartments",
      value: "1,520",
      subtext: "All registered listings",
      icon: Building2,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      badge: "Total",
      badgeColor: "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10",
    },
    {
      title: "Active Apartments",
      value: "1,245",
      subtext: "Currently live on site",
      icon: CheckCircle2,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      badge: "+12",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: "Completed Rentals",
      value: "98",
      subtext: "This month",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge: "+8%",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: "Unpaid ₪50 Fees",
      value: "23",
      subtext: "Needs follow-up",
      icon: DollarSign,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      badge: "Pending",
      badgeColor: "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10",
    },
  ];

  const activities = [
    {
      title: "Apartment A-102 rented",
      time: "5 minutes ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      title: "₪50 payment pending",
      time: "Owner: David",
      icon: DollarSign,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-500/20",
    },
    {
      title: "New swap match found",
      time: "Bnei Brak ↔ Jerusalem",
      icon: ArrowRightLeft,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-500/20",
    },
  ];

  // Generate dynamic recent months
  const getRecentMonths = (count: number) => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < count; i++) {
      months.push(
        date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear()
      );
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };
  
  const recentMonths = getRecentMonths(6);
  const [revenueMonth, setRevenueMonth] = useState(recentMonths[0]);
  const [demandMonth, setDemandMonth] = useState(recentMonths[0]);

  // Mock data for charts based on selected month (randomized for demo)
  const revenueData = [
    { name: "Week 1", revenue: Math.floor(Math.random() * 5000) + 2000 },
    { name: "Week 2", revenue: Math.floor(Math.random() * 5000) + 2000 },
    { name: "Week 3", revenue: Math.floor(Math.random() * 5000) + 2000 },
    { name: "Week 4", revenue: Math.floor(Math.random() * 5000) + 2000 },
  ];

  const demandData = [
    { name: "Jerusalem", searches: Math.floor(Math.random() * 1000) + 500 },
    { name: "Tel Aviv", searches: Math.floor(Math.random() * 1000) + 500 },
    { name: "Bnei Brak", searches: Math.floor(Math.random() * 1000) + 500 },
    { name: "Haifa", searches: Math.floor(Math.random() * 1000) + 500 },
    { name: "Ashdod", searches: Math.floor(Math.random() * 1000) + 500 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Overview of the platform
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${metric.badgeColor}`}>
                {metric.badge}
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {metric.value}
              </div>
              <h3 className="mt-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                {metric.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {metric.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Monthly Revenue Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">Monthly Revenue</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Total earnings</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[120px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                {revenueMonth}
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {recentMonths.map((m) => (
                  <DropdownMenuItem 
                    key={m} 
                    className="cursor-pointer rounded-md text-[13px]"
                    onClick={() => setRevenueMonth(m)}
                  >
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₪${value}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b', fontWeight: 600 }}
                  formatter={(value: any) => [`₪${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Demand by City Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">Search Demand by City</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Top searches</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[120px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                {demandMonth}
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {recentMonths.map((m) => (
                  <DropdownMenuItem 
                    key={m} 
                    className="cursor-pointer rounded-md text-[13px]"
                    onClick={() => setDemandMonth(m)}
                  >
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b', fontWeight: 600 }}
                  formatter={(value: any) => [value, 'Searches']}
                />
                <Bar dataKey="searches" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h2>
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            View All
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.iconBg}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{activity.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
              <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                View
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
