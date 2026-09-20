import { api as axiosInstance } from "@/lib/api";
import { IReportRentedItem, IApiResponse } from "@/types/report-rented.types";

export const adminReportRentedService = {
  getAllReports: async (): Promise<IReportRentedItem[]> => {
    const response = await axiosInstance.get<IApiResponse<IReportRentedItem[]>>(
      "/report-rented/admin/all"
    );
    return response.data.data;
  },

  markReportAsPaid: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.patch<IApiResponse<{ message: string }>>(
      `/report-rented/${id}/mark-paid`
    );
    return response.data.data;
  },
};
