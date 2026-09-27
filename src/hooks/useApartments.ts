import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApartments,
  getMyApartment,
  getMyApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  getApartmentAvailabilities,
  addApartmentAvailability,
  removeApartmentAvailability,
  bulkSetApartmentAvailability,
  setApartmentSpecialPrice,
  toggleApartmentSpecialPrice,
  getListedCities,
  getListedNeighborhoods,
} from "@/services/apartment.service";
import type {
  ApartmentSearchParams,
  BulkSetAvailabilityPayload,
  SpecialPricePayload,
} from "@/types/apartment.types";

export const APARTMENTS_KEY = ["apartments"] as const;
export const MY_APARTMENT_KEY = ["apartments", "my"] as const;
export const CITIES_KEY = ["apartment-cities"] as const;
export const neighborhoodsKey = (city?: string) =>
  ["apartment-neighborhoods", city || "all"] as const;
export const apartmentDetailKey = (id: string) => ["apartments", id] as const;
export const apartmentAvailabilitiesKey = (apartmentId: string) =>
  ["apartment-availabilities", apartmentId] as const;

/** Get list of cities that have active listings */
export const useListedCities = () =>
  useQuery({
    queryKey: CITIES_KEY,
    queryFn: getListedCities,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

/** Get list of neighborhoods for a given city that have active listings */
export const useListedNeighborhoods = (city?: string) =>
  useQuery({
    queryKey: neighborhoodsKey(city),
    queryFn: () => getListedNeighborhoods(city),
    enabled: Boolean(city && city.trim() && city.trim() !== "any"),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

/** List & search apartments */
export const useApartments = (params?: ApartmentSearchParams) =>
  useQuery({
    queryKey: [...APARTMENTS_KEY, params],
    queryFn: () => getApartments(params),
  });

/** Get current owner's list of all apartments */
export const useMyApartments = () =>
  useQuery({
    queryKey: MY_APARTMENT_KEY,
    queryFn: getMyApartments,
    enabled:
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("auth_token") || localStorage.getItem("accessToken") || localStorage.getItem("userRole")),
    retry: 1,
  });

/** Get current owner's primary apartment (supports multi-apartment lookup) */
export const useMyApartment = () => {
  const query = useMyApartments();
  const list = query.data;
  const firstApartment = Array.isArray(list) && list.length > 0 ? list[0] : null;
  return {
    ...query,
    data: firstApartment,
    apartmentsList: Array.isArray(list) ? list : [],
  };
};

/** Get single apartment detail */
export const useApartment = (id: string) =>
  useQuery({
    queryKey: apartmentDetailKey(id),
    queryFn: () => getApartmentById(id),
    enabled: Boolean(id),
  });

/** Create apartment listing */
export const useCreateApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createApartment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APARTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

/** Update apartment listing */
export const useUpdateApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateApartment(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: APARTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
      queryClient.invalidateQueries({ queryKey: apartmentDetailKey(id) });
    },
  });
};

/** Delete apartment */
export const useDeleteApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APARTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

/** Get apartment availability schedule */
export const useApartmentAvailabilities = (apartmentId: string) =>
  useQuery({
    queryKey: apartmentAvailabilitiesKey(apartmentId),
    queryFn: () => getApartmentAvailabilities(apartmentId),
    enabled: Boolean(apartmentId),
  });

/** Add single availability */
export const useAddApartmentAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { apartmentId: string; weekendId: string }) =>
      addApartmentAvailability(payload),
    onSuccess: (_, { apartmentId }) => {
      queryClient.invalidateQueries({
        queryKey: apartmentAvailabilitiesKey(apartmentId),
      });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

/** Remove single availability */
export const useRemoveApartmentAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { apartmentId: string; weekendId: string }) =>
      removeApartmentAvailability(payload),
    onSuccess: (_, { apartmentId }) => {
      queryClient.invalidateQueries({
        queryKey: apartmentAvailabilitiesKey(apartmentId),
      });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

/** Bulk set availability */
export const useBulkSetApartmentAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkSetAvailabilityPayload) =>
      bulkSetApartmentAvailability(payload),
    onSuccess: (_, { apartmentId }) => {
      queryClient.invalidateQueries({
        queryKey: apartmentAvailabilitiesKey(apartmentId),
      });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

/** Set special pricing */
export const useSetApartmentSpecialPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SpecialPricePayload) =>
      setApartmentSpecialPrice(payload),
    onSuccess: (_, { apartmentId }) => {
      queryClient.invalidateQueries({
        queryKey: apartmentAvailabilitiesKey(apartmentId),
      });
      queryClient.invalidateQueries({ queryKey: MY_APARTMENT_KEY });
    },
  });
};

export const APARTMENTS_BY_CITIES_KEY = ["apartments", "by-cities"] as const;

/** Hook to fetch apartments grouped by cities for Explore Premium Destinations */
export const useApartmentsByCities = (
  cityLimit: number = 3,
  limitPerCity: number = 4,
  cities?: string
) => {
  return useQuery({
    queryKey: [...APARTMENTS_BY_CITIES_KEY, cityLimit, limitPerCity, cities],
    queryFn: async () => {
      const { ApartmentService } = await import("@/services/apartmentService");
      return ApartmentService.getApartmentsByCities(cityLimit, limitPerCity, cities);
    },
    staleTime: 2 * 60 * 1000,
  });
};

