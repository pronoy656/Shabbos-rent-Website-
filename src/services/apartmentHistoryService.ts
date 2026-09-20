import { api } from "@/lib/api";
import type {
  IApiResponse,
  IPopularCity,
  IRecentlyViewedApartment,
} from "@/types/apartment.types";

export const ApartmentHistoryService = {
  /**
   * 1. Get Top Popular Cities (Public)
   * GET /apartments/popular-cities?limit=5
   */
  getPopularCities: async (limit: number = 5): Promise<IPopularCity[]> => {
    try {
      const res = await api.get<IApiResponse<IPopularCity[]>>(
        `/apartments/popular-cities`,
        {
          params: { limit },
        }
      );
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch popular cities:", error);
      return [];
    }
  },

  /**
   * 2. Track Apartment Click / View (Authenticated)
   * POST /apartments/view-history/:apartmentId
   */
  trackApartmentView: async (
    apartmentId: string,
    token?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!apartmentId) return { success: false };
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      const res = await api.post(
        `/apartments/view-history/${apartmentId}`,
        {},
        config
      );
      return { success: true, message: res.data?.message };
    } catch (error) {
      console.warn("Failed to record view history:", error);
      return { success: false };
    }
  },

  /**
   * 3. Get Recently Viewed Apartments (Authenticated)
   * GET /apartments/recently-viewed?page=1&limit=4
   */
  getRecentlyViewed: async (
    page: number = 1,
    limit: number = 4,
    token?: string
  ): Promise<IApiResponse<IRecentlyViewedApartment[]>> => {
    const config = token
      ? {
          params: { page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      : {
          params: { page, limit },
        };

    const res = await api.get<IApiResponse<IRecentlyViewedApartment[]>>(
      `/apartments/recently-viewed`,
      config
    );
    return res.data;
  },

  /**
   * 4. Clear Browsing History (Authenticated)
   * DELETE /apartments/recently-viewed
   */
  clearHistory: async (
    token?: string
  ): Promise<{ success: boolean; message: string }> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;

    const res = await api.delete<{ success: boolean; message: string }>(
      `/apartments/recently-viewed`,
      config
    );
    return res.data;
  },
};
