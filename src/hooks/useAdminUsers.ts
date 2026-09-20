import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/services/adminUsers.service";
import type { AdminUsersQueryParams } from "@/types/user.types";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

/**
 * Hook to retrieve all users with search, filtering, and pagination
 */
export const useAdminUsers = (params?: AdminUsersQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => getAdminUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    retry: 1,
  });
};
