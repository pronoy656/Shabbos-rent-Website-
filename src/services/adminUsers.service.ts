import { api } from "@/lib/api";
import type { AdminUsersQueryParams, AdminUsersResponse } from "@/types/user.types";

const BASE = "/user/admin/users";

/**
 * GET /user/admin/users
 * Fetches all registered users with search, role/status filtering, and pagination.
 */
export const getAdminUsers = async (
  params?: AdminUsersQueryParams
): Promise<AdminUsersResponse> => {
  const cleanParams: Record<string, any> = {};

  if (params) {
    if (params.searchTerm?.trim()) cleanParams.searchTerm = params.searchTerm.trim();
    if (params.role && params.role !== "ALL") cleanParams.role = params.role;
    if (params.status && params.status !== "ALL") cleanParams.status = params.status;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.sortOrder) cleanParams.sortOrder = params.sortOrder;
  }

  const res = await api.get<AdminUsersResponse>(BASE, { params: cleanParams });
  return res.data;
};
