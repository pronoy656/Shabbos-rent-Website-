import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getCitySearchDemand,
  getRecentActivity,
} from "@/services/admin-dashboard.service";

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getDashboardStats,
    refetchInterval: 60000, // Refetch every 1 minute
  });
};

export const useAdminMonthlyRevenue = (year?: number, month?: number) => {
  return useQuery({
    queryKey: ["adminMonthlyRevenue", year, month],
    queryFn: () => getMonthlyRevenue(year, month),
    refetchInterval: 300000, // 5 minutes
  });
};

export const useAdminCitySearchDemand = (limit: number = 5, year?: number, month?: number) => {
  return useQuery({
    queryKey: ["adminCitySearchDemand", limit, year, month],
    queryFn: () => getCitySearchDemand(limit, year, month),
    refetchInterval: 300000,
  });
};

export const useAdminRecentActivity = (page: number = 1, limit: number = 10, type?: string) => {
  return useQuery({
    queryKey: ["adminRecentActivity", page, limit, type],
    queryFn: () => getRecentActivity(page, limit, type),
    refetchInterval: 30000, // 30 seconds
  });
};
