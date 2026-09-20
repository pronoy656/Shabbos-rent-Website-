import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportRentedService } from "@/services/report-rented.service";
import {
  ICreateReportRentedIntentPayload,
  IPaySingleReportRentedPayload,
  IPayAllReportRentedDuesPayload,
} from "@/types/report-rented.types";

export const useReportRentedStats = () => {
  return useQuery({
    queryKey: ["report-rented-stats"],
    queryFn: reportRentedService.getStats,
  });
};

export const useMyUnpaidDues = () => {
  return useQuery({
    queryKey: ["my-unpaid-dues"],
    queryFn: reportRentedService.getMyDues,
  });
};

export const useMyReportRentedHistory = () => {
  return useQuery({
    queryKey: ["my-report-rented-history"],
    queryFn: reportRentedService.getMyReports,
  });
};

export const useCreateReportIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateReportRentedIntentPayload) =>
      reportRentedService.createIntent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-rented-stats"] });
      queryClient.invalidateQueries({ queryKey: ["my-unpaid-dues"] });
      queryClient.invalidateQueries({ queryKey: ["my-report-rented-history"] });
    },
  });
};

export const usePaySingleReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IPaySingleReportRentedPayload;
    }) => reportRentedService.paySingleReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-rented-stats"] });
      queryClient.invalidateQueries({ queryKey: ["my-unpaid-dues"] });
      queryClient.invalidateQueries({ queryKey: ["my-report-rented-history"] });
    },
  });
};

export const useBatchPayAllReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IPayAllReportRentedDuesPayload) =>
      reportRentedService.payAllDues(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-rented-stats"] });
      queryClient.invalidateQueries({ queryKey: ["my-unpaid-dues"] });
      queryClient.invalidateQueries({ queryKey: ["my-report-rented-history"] });
    },
  });
};
