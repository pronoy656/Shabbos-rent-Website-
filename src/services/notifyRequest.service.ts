import { api } from "@/lib/api";
import type {
  ICreateNotifyRequestPayload,
  IMyNotifyRequestsResponse,
  INotifyRequest,
  IApiResponse,
} from "@/types/apartment.types";

const BASE_URL = "/notify-request";

export const sendNotifyRequest = async (
  payload: ICreateNotifyRequestPayload
): Promise<INotifyRequest> => {
  const res = await api.post<IApiResponse<INotifyRequest>>(`${BASE_URL}/`, payload);
  return res.data.data;
};

export const getMyNotifyRequests = async (): Promise<IMyNotifyRequestsResponse> => {
  const res = await api.get<IApiResponse<IMyNotifyRequestsResponse>>(`${BASE_URL}/my-requests`);
  return res.data.data;
};
