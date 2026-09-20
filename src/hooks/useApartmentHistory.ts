import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApartmentHistoryService } from "@/services/apartmentHistoryService";
import type { IPopularCity, IRecentlyViewedApartment, IApiResponse } from "@/types/apartment.types";

export const POPULAR_CITIES_KEY = ["apartments", "popular-cities"] as const;
export const RECENTLY_VIEWED_KEY = ["apartments", "recently-viewed"] as const;

/**
 * Hook to fetch top popular cities
 */
export const usePopularCities = (limit: number = 5) => {
  return useQuery<IPopularCity[]>({
    queryKey: [...POPULAR_CITIES_KEY, limit],
    queryFn: () => ApartmentHistoryService.getPopularCities(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

/**
 * Hook to fetch recently viewed apartments for the authenticated user
 */
export const useRecentlyViewed = (page: number = 1, limit: number = 4, enabled: boolean = true) => {
  return useQuery<IApiResponse<IRecentlyViewedApartment[]>>({
    queryKey: [...RECENTLY_VIEWED_KEY, page, limit],
    queryFn: () => ApartmentHistoryService.getRecentlyViewed(page, limit),
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to record apartment view/click
 */
export const useTrackApartmentView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apartmentId: string) => ApartmentHistoryService.trackApartmentView(apartmentId),
    onSuccess: () => {
      // Invalidate recently viewed queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: RECENTLY_VIEWED_KEY });
    },
  });
};

/**
 * Hook to clear user's browsing history
 */
export const useClearRecentlyViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApartmentHistoryService.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECENTLY_VIEWED_KEY });
    },
  });
};
