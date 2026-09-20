import { api } from "@/lib/api";
import type {
  ApartmentSearchParams,
  ApartmentsResponse,
  SingleApartmentResponse,
  ApartmentItem,
  BulkSetAvailabilityPayload,
  SpecialPricePayload,
} from "@/types/apartment.types";

const BASE_APARTMENTS = "/apartment";
const BASE_AVAILABILITY = "/apartment-availability";

// ─────────────────────────────────────────────
// Module 1: Apartment Management & Search
// ─────────────────────────────────────────────

/** GET /apartment — Search & filter all apartments */
export const getApartments = async (
  params?: ApartmentSearchParams
): Promise<ApartmentsResponse> => {
  const cleanParams: Record<string, any> = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "any"
      ) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanParams[key] = value.join(",");
          }
        } else {
          cleanParams[key] = value;
        }
      }
    });
  }
  const res = await api.get<ApartmentsResponse>(BASE_APARTMENTS, { params: cleanParams });
  return res.data;
};

/** GET /apartments/my-apartment — Get current logged-in owner's apartment */
export const getMyApartment = async (): Promise<ApartmentItem | null> => {
  const res = await api.get<any>(`${BASE_APARTMENTS}/my-apartment`);
  const data = res.data?.data;
  if (Array.isArray(data)) {
    return data.length > 0 ? (data[0] as ApartmentItem) : null;
  }
  return (data as ApartmentItem) || null;
};

/** GET /apartments/:id — Get single apartment details by ID or propertyId */
export const getApartmentById = async (id: string): Promise<ApartmentItem | null> => {
  const res = await api.get<any>(`${BASE_APARTMENTS}/${id}`);
  const data = res.data?.data;
  if (Array.isArray(data)) {
    return data.length > 0 ? (data[0] as ApartmentItem) : null;
  }
  return (data as ApartmentItem) || null;
};

/** POST /apartments — Create new apartment listing (multipart/form-data) */
export const createApartment = async (formData: FormData): Promise<ApartmentItem> => {
  const res = await api.post<any>(BASE_APARTMENTS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = res.data?.data;
  if (Array.isArray(data)) {
    return data[0] as ApartmentItem;
  }
  return data as ApartmentItem;
};

/** PATCH /apartments/:id — Update apartment listing details (multipart/form-data) */
export const updateApartment = async (
  id: string,
  formData: FormData
): Promise<ApartmentItem> => {
  const res = await api.patch<any>(`${BASE_APARTMENTS}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = res.data?.data;
  if (Array.isArray(data)) {
    return data[0] as ApartmentItem;
  }
  return data as ApartmentItem;
};

/** DELETE /apartments/:id — Delete user's apartment listing */
export const deleteApartment = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(
    `${BASE_APARTMENTS}/${id}`
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Module 2: Apartment Availability
// ─────────────────────────────────────────────

/** GET /apartment-availability/:apartmentId — Get all scheduled availability dates */
export const getApartmentAvailabilities = async (
  apartmentId: string
): Promise<{ success: boolean; data: any[] }> => {
  const res = await api.get(`${BASE_AVAILABILITY}/${apartmentId}`);
  return res.data;
};

/** POST /apartment-availability/add — Mark apartment available for a specific weekend */
export const addApartmentAvailability = async (payload: {
  apartmentId: string;
  weekendId: string;
}): Promise<{ success: boolean; message: string; data?: any }> => {
  const res = await api.post(`${BASE_AVAILABILITY}/add`, payload);
  return res.data;
};

/** POST /apartment-availability/remove — Mark apartment unavailable for a specific weekend */
export const removeApartmentAvailability = async (payload: {
  apartmentId: string;
  weekendId: string;
}): Promise<{ success: boolean; message: string; data?: any }> => {
  const res = await api.post(`${BASE_AVAILABILITY}/remove`, payload);
  return res.data;
};

/** POST /apartment-availability/bulk-set — Set multiple active weekends at once */
export const bulkSetApartmentAvailability = async (
  payload: BulkSetAvailabilityPayload
): Promise<{ success: boolean; message: string; data?: { count: number } }> => {
  const res = await api.post(`${BASE_AVAILABILITY}/bulk-set`, payload);
  return res.data;
};

/** POST /apartment-availability/special-price — Set holiday / special pricing for a weekend */
export const setApartmentSpecialPrice = async (
  payload: SpecialPricePayload
): Promise<{ success: boolean; message: string; data?: any }> => {
  const res = await api.post(`${BASE_AVAILABILITY}/special-price`, payload);
  return res.data;
};

/** PATCH /apartment-availability/:availabilityId/special — Toggle special pricing */
export const toggleApartmentSpecialPrice = async (
  availabilityId: string,
  payload: { isSpecial: boolean; specialPrice?: number }
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch(`${BASE_AVAILABILITY}/${availabilityId}/special`, payload);
  return res.data;
};

// ─────────────────────────────────────────────
// Module 3: Popular Cities & View History
// ─────────────────────────────────────────────

export { ApartmentHistoryService } from "./apartmentHistoryService";
export const getPopularCities = async (limit: number = 5) => {
  const { ApartmentHistoryService } = await import("./apartmentHistoryService");
  return ApartmentHistoryService.getPopularCities(limit);
};
export const trackApartmentView = async (apartmentId: string, token?: string) => {
  const { ApartmentHistoryService } = await import("./apartmentHistoryService");
  return ApartmentHistoryService.trackApartmentView(apartmentId, token);
};
export const getRecentlyViewedApartments = async (page: number = 1, limit: number = 4, token?: string) => {
  const { ApartmentHistoryService } = await import("./apartmentHistoryService");
  return ApartmentHistoryService.getRecentlyViewed(page, limit, token);
};
export const clearRecentlyViewedHistory = async (token?: string) => {
  const { ApartmentHistoryService } = await import("./apartmentHistoryService");
  return ApartmentHistoryService.clearHistory(token);
};

export const getApartmentsByCities = async (
  cityLimit: number = 3,
  limitPerCity: number = 4,
  cities?: string
) => {
  const { ApartmentService } = await import("./apartmentService");
  return ApartmentService.getApartmentsByCities(cityLimit, limitPerCity, cities);
};



export const updateApartmentStatus = async (
  id: string,
  payload: import("@/types/apartment.types").IUpdateApartmentStatusPayload
): Promise<ApartmentItem> => {
  const res = await api.patch<SingleApartmentResponse>("${BASE_APARTMENTS}/${id}", payload);
  return res.data.data;
};
