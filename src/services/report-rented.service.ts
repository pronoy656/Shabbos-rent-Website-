import { api as axiosInstance } from "@/lib/api";
import {
  ICreateReportRentedIntentPayload,
  IPaySingleReportRentedPayload,
  IPayAllReportRentedDuesPayload,
  IReportRentedStats,
  IReportRentedDuesSummary,
  IReportRentedItem,
  IReportRentedIntentResponse,
  IPayReportRentedResult,
  IApiResponse,
} from "@/types/report-rented.types";

export const reportRentedService = {
  createIntent: async (
    payload: ICreateReportRentedIntentPayload
  ): Promise<IReportRentedIntentResponse[]> => {
    const response = await axiosInstance.post<IApiResponse<IReportRentedIntentResponse[]>>(
      "/report-rented/create-intent",
      payload
    );
    return response.data.data;
  },

  getStats: async (): Promise<IReportRentedStats> => {
    const response = await axiosInstance.get<IApiResponse<IReportRentedStats>>("/report-rented/stats");
    return response.data.data;
  },

  getMyDues: async (): Promise<IReportRentedDuesSummary> => {
    const response = await axiosInstance.get<IApiResponse<IReportRentedDuesSummary>>("/report-rented/my-dues");
    return response.data.data;
  },

  getMyReports: async (): Promise<IReportRentedItem[]> => {
    const response = await axiosInstance.get<IApiResponse<IReportRentedItem[]>>("/report-rented/my-reports");
    return response.data.data;
  },

  paySingleReport: async (
    id: string,
    payload: IPaySingleReportRentedPayload
  ): Promise<IPayReportRentedResult> => {
    const response = await axiosInstance.post<IApiResponse<IPayReportRentedResult>>(
      `/report-rented/${id}/pay`,
      payload
    );
    return response.data.data;
  },

  payAllDues: async (
    payload: IPayAllReportRentedDuesPayload
  ): Promise<IPayReportRentedResult> => {
    const response = await axiosInstance.post<IApiResponse<IPayReportRentedResult>>(
      "/report-rented/pay-all",
      payload
    );
    return response.data.data;
  },
};
