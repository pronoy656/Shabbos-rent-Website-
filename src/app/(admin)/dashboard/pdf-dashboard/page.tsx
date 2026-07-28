"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ArrowRightLeft,
  Activity,
  RefreshCcw,
  BookOpen,
  AlertCircle,
  Clock,
  Mic,
  MessageSquare,
  Phone,
  Users
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
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState("Good Day");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updateGreeting();
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Mock data for charts
  const revenueData = [
    { name: "Week 1", income: 4000, expenses: 2400 },
    { name: "Week 2", income: 3000, expenses: 1398 },
    { name: "Week 3", income: 2000, expenses: 9800 },
    { name: "Week 4", income: 2780, expenses: 3908 },
  ];

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* 1. Header with Time-of-day greeting and Manual Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            {greeting}, Admin 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here is what's happening with ShabbosRent today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
          Refresh Dashboard
        </button>
      </div>

      {/* 2. Upcoming Shabbos Hero Widget */}
      <div className="rounded-2xl border-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <BookOpen className="w-48 h-48 transform rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
              <CalendarCheck className="w-4 h-4" /> Upcoming Shabbos
            </div>
            <h2 className="text-4xl font-extrabold mb-2">Parshas Re'eh</h2>
            <p className="text-blue-100 text-lg">August 14-15, 2026 • 29 Av 5786</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20 text-center min-w-[200px]">
            <div className="text-5xl font-black mb-1">92%</div>
            <div className="text-blue-100 font-medium">Occupancy Rate</div>
            <div className="mt-3 text-sm text-blue-200 bg-black/20 rounded-full py-1 px-3">
              1,398 / 1,520 booked
            </div>
          </div>
        </div>
      </div>

      {/* 3. "Needs Attention" Actionable Cards */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" /> Needs Attention
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/pdf-apartments?filter=pending" className="group rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm hover:shadow-md transition-all dark:border-orange-900/50 dark:bg-orange-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-200/50 px-2 py-1 rounded-full">Action Required</span>
            </div>
            <div className="text-2xl font-black text-orange-700 dark:text-orange-500">12</div>
            <div className="text-sm font-semibold text-orange-900 dark:text-orange-400 mt-1">Pending Apartment Approvals</div>
          </Link>

          <Link href="/dashboard/open-debts" className="group rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm hover:shadow-md transition-all dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-200/50 px-2 py-1 rounded-full">Overdue</span>
            </div>
            <div className="text-2xl font-black text-red-700 dark:text-red-500">8</div>
            <div className="text-sm font-semibold text-red-900 dark:text-red-400 mt-1">Unpaid Rental Reports</div>
          </Link>

          <Link href="/dashboard/voice-inbox?filter=unread" className="group rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm hover:shadow-md transition-all dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-200/50 px-2 py-1 rounded-full">New Messages</span>
            </div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-500">5</div>
            <div className="text-sm font-semibold text-blue-900 dark:text-blue-400 mt-1">Unread Voicemails in Inbox</div>
          </Link>
        </div>
      </div>

      {/* 4. KPI Stat Cards */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Platform Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-500">Total Apartments</span>
              <Building2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">1,520</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12 this week
            </div>
          </div>
          
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-500">Rental Reports</span>
              <Activity className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">125</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +8% vs last week
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-500">Shabbos Availability</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">45</div>
            <div className="text-xs text-zinc-500 mt-1 font-medium">
              Units remaining for upcoming Shabbos
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-500">Partner Referrals</span>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">34</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> 5 new affiliates
            </div>
          </div>
        </div>
      </div>

      {/* 5. Summary Sections (Finance & Communication) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Finance Summary */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Finance Summary</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Income vs Partner Payouts this month</p>
            </div>
            <Link href="/dashboard/finance" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₪${value}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--tw-bg-opacity)' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: any) => `₪${value}`}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Communication Summary */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Communication</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Today's hotline activity overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Live
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-zinc-100 dark:border-zinc-800/60 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Apt Calls</span>
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">45</div>
              <div className="text-xs text-zinc-500 mt-1">12 missed</div>
            </div>
            <div className="border border-zinc-100 dark:border-zinc-800/60 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">WhatsApp</span>
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">128</div>
              <div className="text-xs text-zinc-500 mt-1">Owner engagements</div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Recent Activity</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full mt-0.5">
                  <Mic className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">New voicemail from +972 54-123-4567</p>
                  <p className="text-xs text-zinc-500">2 mins ago • AI Transcribed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mt-0.5">
                  <ArrowRightLeft className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Apartment #1204 upload approved</p>
                  <p className="text-xs text-zinc-500">15 mins ago • By Sarah (Worker)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full mt-0.5">
                  <Phone className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Forwarded upload hotline call to Yossi</p>
                  <p className="text-xs text-zinc-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
