export interface AdminDashboardStats {
  totalApartments: number;
  totalApartmentsLabel: string;
  totalApartmentsBadge: string;
  activeApartments: number;
  activeApartmentsLabel: string;
  activeApartmentsBadge: string;
  newApartmentsThisMonth: number;
  completedRentals: number;
  completedRentalsLabel: string;
  completedRentalsBadge: string;
  completedRentalsThisMonth: number;
  completedRentalsLastMonth: number;
  completedRentalsGrowthPercentage: number;
  completedSwaps: number;
  pendingApartments: number;
  blockedApartments: number;
  unpaidFees: {
    totalUnpaidAmount: number;
    totalUnpaidCount: number;
    feePerUnit: number;
    badge: string;
    label: string;
    listingFees: { count: number; amount: number };
    reportRentedFees: { count: number; amount: number };
    swapFees: { count: number; amount: number };
  };
}

export interface AdminDashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AdminDashboardStats;
}

export interface CumulativeTrajectoryItem {
  label: string;
  weekNumber: number;
  weeklyRevenue: number;
  cumulativeRevenue: number;
}

export interface WeeklyRevenueItem {
  week: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  listingRevenue: number;
  reportRentedRevenue: number;
  swapRevenue: number;
  transactionCount: number;
}

export interface AdminMonthlyRevenue {
  year: number;
  month: number;
  monthName: string;
  totalMonthlyRevenue: number;
  totalTransactions: number;
  cumulativeTrajectory: CumulativeTrajectoryItem[];
  weeks: WeeklyRevenueItem[];
}

export interface AdminMonthlyRevenueResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AdminMonthlyRevenue;
}

export interface CitySearchDemand {
  city: string;
  searchVolume: number;
  apartmentCount: number;
  interestedCount: number;
  totalDemandScore: number;
}

export interface AdminCitySearchDemandResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CitySearchDemand[];
}

export type RecentActivityType = "RENTED" | "PAYMENT_PENDING" | "SWAP_MATCH" | "NEW_LISTING";

export interface RecentActivityUser {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
}

export interface RecentActivity {
  id: string;
  type: RecentActivityType;
  title: string;
  subtitle: string;
  relativeTime: string;
  iconType: string;
  iconColor: string;
  status: string;
  amount?: number;
  currency?: string;
  targetType: string;
  targetId: string;
  link: string;
  timestamp: string;
  user?: RecentActivityUser;
}

export interface RecentActivityMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminRecentActivityResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: RecentActivityMeta;
  data: RecentActivity[];
}
