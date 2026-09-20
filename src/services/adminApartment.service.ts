import { api } from "@/lib/api";

export type ApartmentStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "SUSPENDED" | "BLOCKED";

const BASE_ADMIN_APARTMENTS = "/apartments";

/** GET /apartment/admin/all — Get all apartments for admin */
export const getAllApartmentsAdmin = async (params?: { limit?: number; page?: number }): Promise<any> => {
  const res = await api.get(`/apartment/admin/all`, {
    params: { limit: 1000, pageSize: 1000, size: 1000, perPage: 1000, ...params }
  });
  return res.data;
};

/** DELETE /apartment/admin/:apartmentId — Delete user's apartment listing (Super Admin) */
export const deleteApartmentAdmin = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/apartment/admin/${id}`);
  return res.data;
};

/** GET /apartment/admin-details/:id — View complete admin diagnostics for an apartment (Super Admin) */
export const getApartmentAdminDetails = async (id: string): Promise<any> => {
  const res = await api.get(`/apartment/admin-details/${id}`);
  return res.data;
};

/** PATCH /apartment/status/:id — Update listing status (Super Admin) */
export const updateApartmentStatus = async (
  id: string,
  status: ApartmentStatus
): Promise<{ success: boolean; message: string; data?: any }> => {
  const res = await api.patch(`/apartment/status/${id}`, { status });
  return res.data;
};

/** PATCH /apartments/block/:id — Block or unblock an apartment (Super Admin) */
export const blockApartment = async (
  id: string,
  isBlocked: boolean
): Promise<{ success: boolean; message: string; data?: any }> => {
  const res = await api.patch(`${BASE_ADMIN_APARTMENTS}/block/${id}`, { isBlocked });
  return res.data;
};
