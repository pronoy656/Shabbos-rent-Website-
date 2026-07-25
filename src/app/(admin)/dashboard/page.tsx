"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Activity,
  Star,
  Check,
  X,
  ShieldCheck,
  MessageSquare
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
  const metrics = [
    {
      title: t("admin_dashboard.metrics.total_apartments"),
      value: "1,520",
      subtext: t("admin_dashboard.metrics.all_registered"),
      icon: Building2,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      badge: t("admin_dashboard.metrics.total"),
      badgeColor: "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10",
    },
    {
      title: t("admin_dashboard.metrics.active_apartments"),
      value: "1,245",
      subtext: t("admin_dashboard.metrics.currently_live"),
      icon: CheckCircle2,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      badge: "+12",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: t("admin_dashboard.metrics.completed_rentals"),
      value: "98",
      subtext: t("admin_dashboard.metrics.this_month"),
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge: "+8%",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: t("admin_dashboard.metrics.unpaid_fees"),
      value: "23",
      subtext: t("admin_dashboard.metrics.needs_follow_up"),
      icon: DollarSign,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      badge: t("admin_dashboard.metrics.pending"),
      badgeColor: "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10",
    },
  ];

  const activities = [
    {
      title: t("admin_dashboard.recent_activity.apt_rented"),
      time: t("admin_dashboard.recent_activity.mins_ago"),
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      title: t("admin_dashboard.recent_activity.payment_pending"),
      time: t("admin_dashboard.recent_activity.owner"),
      icon: DollarSign,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-500/20",
    },
    {
      title: t("admin_dashboard.recent_activity.swap_match"),
      time: t("admin_dashboard.recent_activity.swap_cities"),
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
  
  // R2 — Review Moderation Queue State
  const [pendingReviews, setPendingReviews] = useState<any[]>([
    {
      id: "pending-demo-1",
      apartmentId: "1",
      apartmentTitle: "Luxury Penthouse in Jerusalem",
      reviewerName: "David Cohen",
      rating: 5,
      title: "Absolutely Stunning Shabbos Apartment!",
      comment: "Host was extremely accommodating. Hot plate and urn were already set up. Will definitely stay here again!",
      date: "Just now",
      status: "Pending"
    },
    {
      id: "pending-demo-2",
      apartmentId: "2",
      apartmentTitle: "Cozy Garden Suite in Rehavia",
      reviewerName: "Sarah Klein",
      rating: 4,
      title: "Very comfortable and great location",
      comment: "Super close to local shuls and quiet neighborhood. Kitchen was clean and spacious.",
      date: "2 hours ago",
      status: "Pending"
    }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPendingStr = localStorage.getItem("pending_reviews");
      if (savedPendingStr) {
        try {
          const savedPending = JSON.parse(savedPendingStr);
          setPendingReviews(prev => [...savedPending, ...prev]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleApproveReview = (review: any) => {
    if (typeof window !== "undefined") {
      const existingApprovedStr = localStorage.getItem("approved_reviews");
      const existingApproved = existingApprovedStr ? JSON.parse(existingApprovedStr) : [];
      const updatedApproved = [{ ...review, status: "Approved" }, ...existingApproved];
      localStorage.setItem("approved_reviews", JSON.stringify(updatedApproved));

      const existingPendingStr = localStorage.getItem("pending_reviews");
      if (existingPendingStr) {
        const existingPending = JSON.parse(existingPendingStr);
        const filteredPending = existingPending.filter((r: any) => r.id !== review.id);
        localStorage.setItem("pending_reviews", JSON.stringify(filteredPending));
      }
    }

    setPendingReviews(prev => prev.filter(r => r.id !== review.id));
    alert(`Review by "${review.reviewerName}" has been APPROVED and is now LIVE on the apartment details page!`);
  };

  const handleRejectReview = (review: any) => {
    if (typeof window !== "undefined") {
      const existingPendingStr = localStorage.getItem("pending_reviews");
      if (existingPendingStr) {
        const existingPending = JSON.parse(existingPendingStr);
        const filteredPending = existingPending.filter((r: any) => r.id !== review.id);
        localStorage.setItem("pending_reviews", JSON.stringify(filteredPending));
      }
    }
    setPendingReviews(prev => prev.filter(r => r.id !== review.id));
    alert(`Review by "${review.reviewerName}" has been rejected.`);
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t("admin_dashboard.title")}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("admin_dashboard.overview")}
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
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{t("admin_dashboard.charts.monthly_revenue")}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("admin_dashboard.charts.total_earnings")}</p>
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
                  formatter={(value: any) => [`₪${value}`, t("admin_dashboard.charts.revenue")]}
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
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{t("admin_dashboard.charts.search_demand")}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("admin_dashboard.charts.top_searches")}</p>
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
                  formatter={(value: any) => [value, t("admin_dashboard.charts.searches")]}
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
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("admin_dashboard.recent_activity.title")}</h2>
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t("admin_dashboard.recent_activity.view_all")}
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
                {t("admin_dashboard.recent_activity.view")}
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
