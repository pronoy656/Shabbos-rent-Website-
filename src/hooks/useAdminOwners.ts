import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOwners,
  getOwnerById,
  sendAvailabilityReminder,
  sendPaymentDueReminder,
  type OwnerFilters,
} from "@/services/ownerService";
import type {
  SendReminderPayload,
  SendPaymentReminderPayload,
} from "@/types/owner";

export const OWNERS_LIST_KEY = ["admin", "owners"] as const;
export const ownerDetailKey = (id: string) => ["admin", "owner", id] as const;

/** List all owners with search, channel, filter & pagination */
export const useAllOwners = (filters?: OwnerFilters) =>
  useQuery({
    queryKey: [...OWNERS_LIST_KEY, filters],
    queryFn: () => getAllOwners(filters),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

/** Single owner detail (shows channel + financials) */
export const useOwnerDetail = (id: string) =>
  useQuery({
    queryKey: ownerDetailKey(id),
    queryFn: () => getOwnerById(id),
    enabled: Boolean(id),
  });

/** Send availability reminder */
export const useSendAvailabilityReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ownerId, payload }: { ownerId: string; payload?: SendReminderPayload }) =>
      sendAvailabilityReminder(ownerId, payload),
    onSuccess: (_, { ownerId }) => {
      queryClient.invalidateQueries({ queryKey: OWNERS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: ownerDetailKey(ownerId) });
    },
  });
};

/** Send payment due reminder */
export const useSendPaymentDueReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ownerId, payload }: { ownerId: string; payload?: SendPaymentReminderPayload }) =>
      sendPaymentDueReminder(ownerId, payload),
    onSuccess: (_, { ownerId }) => {
      queryClient.invalidateQueries({ queryKey: OWNERS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: ownerDetailKey(ownerId) });
    },
  });
};
