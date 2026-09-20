import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendNotifyRequest, getMyNotifyRequests } from "@/services/notifyRequest.service";
import type { ICreateNotifyRequestPayload } from "@/types/apartment.types";

export const NOTIFY_REQUESTS_KEY = ["my-notify-requests"] as const;

export const useMyNotifyRequests = () =>
  useQuery({
    queryKey: NOTIFY_REQUESTS_KEY,
    queryFn: getMyNotifyRequests,
  });

export const useCreateNotifyRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateNotifyRequestPayload) => sendNotifyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFY_REQUESTS_KEY });
    },
  });
};
