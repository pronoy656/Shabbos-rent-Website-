import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApartmentAdmin,
  getApartmentAdminDetails,
  updateApartmentStatus,
  blockApartment,
  getAllApartmentsAdmin,
  type ApartmentStatus,
} from "@/services/adminApartment.service";

export type { ApartmentStatus };

export const ADMIN_APARTMENTS_KEY = ["admin", "apartments"] as const;
export const adminApartmentDetailKey = (id: string) => ["admin", "apartment", id] as const;

/** Hook to get all apartments for admin */
export const useGetAllApartmentsAdmin = () =>
  useQuery({
    queryKey: ADMIN_APARTMENTS_KEY,
    queryFn: () => getAllApartmentsAdmin(),
  });

/** Hook to delete an apartment (Super Admin) */
export const useDeleteApartmentAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApartmentAdmin(id),
    onSuccess: () => {
      // Invalidate the admin apartments list to refresh the UI
      queryClient.invalidateQueries({ queryKey: ADMIN_APARTMENTS_KEY });
    },
  });
};

/** Hook to get complete admin diagnostics for an apartment (Super Admin) */
export const useAdminApartmentDetails = (id: string) =>
  useQuery({
    queryKey: adminApartmentDetailKey(id),
    queryFn: () => getApartmentAdminDetails(id),
    enabled: Boolean(id),
  });

/** Hook to update listing status (Super Admin) */
export const useUpdateApartmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApartmentStatus }) =>
      updateApartmentStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_APARTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: adminApartmentDetailKey(id) });
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.invalidateQueries({ queryKey: ["apartments", "my"] });
    },
  });
};

/** Hook to block or unblock an apartment (Super Admin) */
export const useBlockApartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      blockApartment(id, isBlocked),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_APARTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: adminApartmentDetailKey(id) });
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.invalidateQueries({ queryKey: ["apartments", "my"] });
    },
  });
};
