import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReportRentedService } from "@/services/admin-report-rented.service";

export const useAllReportedRentals = () => {
  return useQuery({
    queryKey: ["admin-all-reported-rentals"],
    queryFn: adminReportRentedService.getAllReports,
  });
};

export const useMarkReportPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminReportRentedService.markReportAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-reported-rentals"] });
    },
  });
};
