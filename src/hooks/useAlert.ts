import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAlerts,
  getMyAlerts,
  markAllAlertsAsRead,
  createAlert,
  updateAlert,
  deleteAlert,
} from "@/services/alert.service";
import {
  AlertSearchParams,
  CreateAlertPayload,
  UpdateAlertPayload,
} from "@/types/alert.types";

export const ALERTS_KEY = ["alerts"] as const;
export const MY_ALERTS_KEY = ["my-alerts"] as const;

export const useAlerts = (params?: AlertSearchParams) =>
  useQuery({
    queryKey: [...ALERTS_KEY, params],
    queryFn: () => getAlerts(params),
  });

export const useMyAlerts = (enabled: boolean = true) =>
  useQuery({
    queryKey: MY_ALERTS_KEY,
    queryFn: getMyAlerts,
    enabled,
    refetchInterval: 30000, // Optional: Poll every 30s to keep it fresh
  });

export const useMarkAllAlertsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAlertsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ALERTS_KEY });
    },
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAlertPayload) => createAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_KEY });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlertPayload }) =>
      updateAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_KEY });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_KEY });
    },
  });
};
