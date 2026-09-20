import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInterestedRequest, getMyInterestedRequests } from "@/services/interestedRequest.service";
import type { ICreateInterestedRequestPayload } from "@/types/apartment.types";

export const INTERESTED_REQUESTS_KEY = ["my-interested-requests"] as const;

export const useMyInterestedRequests = () =>
  useQuery({
    queryKey: INTERESTED_REQUESTS_KEY,
    queryFn: getMyInterestedRequests,
  });

export const useCreateInterestedRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateInterestedRequestPayload) => sendInterestedRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERESTED_REQUESTS_KEY });
    },
  });
};
