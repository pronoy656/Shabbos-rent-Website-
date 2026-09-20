import { api } from "@/lib/api";
import type {
  ICreateInterestedRequestPayload,
  IMyInterestedRequestsResponse,
  IInterestedRequest,
  IApiResponse,
} from "@/types/apartment.types";

const BASE_URL = "/interested-request";

export const sendInterestedRequest = async (
  payload: ICreateInterestedRequestPayload
): Promise<IInterestedRequest> => {
  const res = await api.post<IApiResponse<IInterestedRequest>>(`${BASE_URL}/`, payload);
  return res.data.data;
};

export const getMyInterestedRequests = async (): Promise<IMyInterestedRequestsResponse> => {
  const res = await api.get<IApiResponse<IMyInterestedRequestsResponse>>(`${BASE_URL}/my-requests`);
  return res.data.data;
};
