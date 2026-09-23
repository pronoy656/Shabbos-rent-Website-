"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Building2,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ArrowRightLeft,
  Activity,
  Home
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
import {
  useAdminDashboardStats,
  useAdminMonthlyRevenue,
  useAdminCitySearchDemand,
  useAdminRecentActivity
} from "@/hooks/useAdminDashboard";
import { RecentActivity } from "@/types/admin-dashboard.types";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Generate dynamic recent months for selectors
  const recentMonthsList = useMemo(() => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      months.push({
        label: date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  }, []);

  const [revenueSelection, setRevenueSelection] = useState(recentMonthsList[0]);
  const [demandSelection, setDemandSelection] = useState(recentMonthsList[0]);

  // Fetch Hooks
  const { data: statsResponse, isLoading: isLoadingStats } = useAdminDashboardStats();
  const { data: revenueResponse, isLoading: isLoadingRevenue } = useAdminMonthlyRevenue(revenueSelection.year, revenueSelection.month);
  const { data: demandResponse, isLoading: isLoadingDemand } = useAdminCitySearchDemand(5, demandSelection.year, demandSelection.month);
  const { data: activityResponse, isLoading: isLoadingActivity } = useAdminRecentActivity(1, 10);

  const stats = statsResponse?.data;
  const revenueData = revenueResponse?.data?.cumulativeTrajectory || [];
  const demandData = demandResponse?.data || [];
  const activities = activityResponse?.data || [];

  const metrics = [
    {
      title: t("admin_dashboard.metrics.total_apartments") || "Total Apartments",
      value: stats?.totalApartments || 0,
      subtext: stats?.totalApartmentsLabel || "All registered listings",
      icon: Building2,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      badge: stats?.totalApartmentsBadge || "Total",
      badgeColor: "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10",
    },
    {
      title: t("admin_dashboard.metrics.active_apartments") || "Active Apartments",
      value: stats?.activeApartments || 0,
      subtext: stats?.activeApartmentsLabel || "Currently live on site",
      icon: CheckCircle2,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      badge: stats?.activeApartmentsBadge || "-",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: t("admin_dashboard.metrics.completed_rentals") || "Completed Rentals",
      value: stats?.completedRentals || 0,
      subtext: stats?.completedRentalsLabel || "This month",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge: stats?.completedRentalsBadge || "-",
      badgeColor: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
    {
      title: t("admin_dashboard.metrics.unpaid_fees") || "Unpaid ₪50 Fees",
      value: stats?.unpaidFees?.totalUnpaidCount || 0,
      subtext: stats?.unpaidFees?.label || "Needs follow-up",
      icon: DollarSign,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      badge: stats?.unpaidFees?.badge || "Pending",
      badgeColor: "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10",
    },
  ];

  const getActivityConfig = (type: string) => {
    switch (type) {
      case "RENTED":
        return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-[#E8F8F0] dark:bg-emerald-900/30" };
      case "PAYMENT_PENDING":
        return { icon: DollarSign, color: "text-amber-600", bg: "bg-[#FFF4E6] dark:bg-amber-900/30" };
      case "SWAP_MATCH":
        return { icon: ArrowRightLeft, color: "text-purple-600", bg: "bg-[#F3E8FF] dark:bg-purple-900/30" };
      case "NEW_LISTING":
        return { icon: Home, color: "text-blue-600", bg: "bg-[#EBF5FF] dark:bg-blue-900/30" };
      default:
        return { icon: Activity, color: "text-zinc-600", bg: "bg-zinc-100 dark:bg-zinc-800" };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t("admin_dashboard.title") || "Dashboard"}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("admin_dashboard.overview") || "Overview of platform performance and recent activities."}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
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
                {isLoadingStats ? <div className="h-9 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-md"></div> : metric.value}
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
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{t("admin_dashboard.charts.monthly_revenue") || "Monthly Revenue"}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("admin_dashboard.charts.total_earnings") || "Total earnings"}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[120px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                {revenueSelection.label}
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {recentMonthsList.map((m, idx) => (
                  <DropdownMenuItem 
                    key={idx} 
                    className="cursor-pointer rounded-md text-[13px]"
                    onClick={() => setRevenueSelection(m)}
                  >
                    {m.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            {isLoadingRevenue ? (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.2} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₪${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#18181b', fontWeight: 600 }}
                    formatter={(value: any) => [`₪${value}`, t("admin_dashboard.charts.revenue") || "Revenue"]}
                  />
                  <Area type="monotone" dataKey="cumulativeRevenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Search Demand by City Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{t("admin_dashboard.charts.search_demand") || "Search Demand"}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("admin_dashboard.charts.top_searches") || "Top searched cities"}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between min-w-[120px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                {demandSelection.label}
                <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px] rounded-lg border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg">
                {recentMonthsList.map((m, idx) => (
                  <DropdownMenuItem 
                    key={idx} 
                    className="cursor-pointer rounded-md text-[13px]"
                    onClick={() => setDemandSelection(m)}
                  >
                    {m.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            {isLoadingDemand ? (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" strokeOpacity={0.2} />
                  <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f4f4f5' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#18181b', fontWeight: 600 }}
                    formatter={(value: any) => [value, t("admin_dashboard.charts.searches") || "Searches"]}
                  />
                  <Bar dataKey="totalDemandScore" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("admin_dashboard.recent_activity.title") || "Recent Activity"}</h2>
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t("admin_dashboard.recent_activity.view_all") || "View all"}
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {isLoadingActivity ? (
            <div className="px-6 py-8 text-center text-zinc-400">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-400">No recent activities found.</div>
          ) : (
            activities.map((activity: RecentActivity) => {
              const config = getActivityConfig(activity.type);
              const ActivityIcon = config.icon;
              return (
                <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-full ${config.bg}`}>
                      <ActivityIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{activity.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{activity.subtitle}</span>
                        <span>•</span>
                        <span>{activity.relativeTime}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(activity.link)}
                    className="shrink-0 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {t("admin_dashboard.recent_activity.view") || "View"}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
