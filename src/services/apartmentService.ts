import { api } from "@/lib/api";
import type {
  IApiResponse,
  ICityApartmentGroup,
  IPopularCity,
  IApartmentCard,
} from "@/types/apartment.types";

export const ApartmentService = {
  /**
   * 1. Get Grouped Apartments for Premium Destinations
   * GET /apartments/by-cities
   */
  getApartmentsByCities: async (
    cityLimit: number = 3,
    limitPerCity: number = 4,
    cities?: string
  ): Promise<ICityApartmentGroup[]> => {
    try {
      const params: Record<string, any> = {
        cityLimit,
        limitPerCity,
      };
      if (cities) {
        params.cities = cities;
      }

      const res = await api.get<IApiResponse<ICityApartmentGroup[]>>(
        `/apartments/by-cities`,
        { params }
      );
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch apartments by cities:", error);
      return [];
    }
  },

  /**
   * 2. Get Top Popular Cities
   * GET /apartments/popular-cities
   */
  getPopularCities: async (limit: number = 5): Promise<IPopularCity[]> => {
    try {
      const res = await api.get<IApiResponse<IPopularCity[]>>(
        `/apartments/popular-cities`,
        { params: { limit } }
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
   * 3. Track Apartment Click / View
   * POST /apartments/view-history/:apartmentId
   */
  trackApartmentView: async (apartmentId: string): Promise<void> => {
    if (!apartmentId) return;
    try {
      await api.post(`/apartments/view-history/${apartmentId}`, {});
    } catch (error) {
      console.warn("Failed to record view history:", error);
    }
  },

  /**
   * 4. Get Recently Viewed Apartments
   * GET /apartments/recently-viewed
   */
  getRecentlyViewed: async (
    page: number = 1,
    limit: number = 4
  ): Promise<IApiResponse<IApartmentCard[]>> => {
    const res = await api.get<IApiResponse<IApartmentCard[]>>(
      `/apartments/recently-viewed`,
      { params: { page, limit } }
    );
    return res.data;
  },

  /**
   * 5. Clear Browsing History
   * DELETE /apartments/recently-viewed
   */
  clearHistory: async (): Promise<void> => {
    await api.delete(`/apartments/recently-viewed`);
  },
};
