import { api } from "@/lib/api";
import {
  AdminDashboardStatsResponse,
  AdminMonthlyRevenueResponse,
  AdminCitySearchDemandResponse,
  AdminRecentActivityResponse,
} from "@/types/admin-dashboard.types";

export const getDashboardStats = async (): Promise<AdminDashboardStatsResponse> => {
  const res = await api.get<AdminDashboardStatsResponse>("/admin/dashboard/stats");
  return res.data;
};

export const getMonthlyRevenue = async (
  year?: number,
  month?: number
): Promise<AdminMonthlyRevenueResponse> => {
  const params: Record<string, any> = {};
  if (year) params.year = year;
  if (month) params.month = month;
  
  const res = await api.get<AdminMonthlyRevenueResponse>("/admin/dashboard/monthly-revenue", {
    params,
  });
  return res.data;
};

export const getCitySearchDemand = async (
  limit?: number,
  year?: number,
  month?: number
): Promise<AdminCitySearchDemandResponse> => {
  const params: Record<string, any> = {};
  if (limit) params.limit = limit;
  if (year) params.year = year;
  if (month) params.month = month;

  const res = await api.get<AdminCitySearchDemandResponse>("/admin/dashboard/city-search-demand", {
    params,
  });
  return res.data;
};

export const getRecentActivity = async (
  page: number = 1,
  limit: number = 10,
  type?: string
): Promise<AdminRecentActivityResponse> => {
  const params: Record<string, any> = { page, limit };
  if (type) params.type = type;

  const res = await api.get<AdminRecentActivityResponse>("/admin/dashboard/recent-activity", {
    params,
  });
  return res.data;
};
