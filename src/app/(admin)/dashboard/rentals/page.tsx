"use client";

import { useAllReportedRentals, useMarkReportPaid } from "@/hooks/useAdminReportRented";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Receipt, ArrowRightLeft } from "lucide-react";

export default function RentalsPage() {
  const { data: rentals, isLoading } = useAllReportedRentals();
  const { mutate: markPaid, isPending: isMarkingPaid } = useMarkReportPaid();

  const handleMarkAsPaid = (id: string) => {
    markPaid(id, {
      onSuccess: () => {
        toast.success("Successfully marked report as paid");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to mark as paid");
      }
    });
  };

  return (
    <div className="font-sans space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white capitalize flex items-center gap-2">
          <Receipt className="w-8 h-8 text-[#4c55a4]" />
          Rentals Management
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Monitor reported rentals (Rent & Swap) and manage platform fee statuses.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading rentals...</div>
        ) : !rentals || rentals.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-zinc-200 dark:ring-zinc-800">
              <Receipt className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
              No Rental Reports Found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
              It looks like no apartment owners have reported any rentals or swaps yet. Once they submit their reports, they will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Report Type</th>
                  <th scope="col" className="px-6 py-4 font-bold">Apartment</th>
                  <th scope="col" className="px-6 py-4 font-bold">Owner / User</th>
                  <th scope="col" className="px-6 py-4 font-bold">Weekend</th>
                  <th scope="col" className="px-6 py-4 font-bold">Fee Status</th>
                  <th scope="col" className="px-6 py-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {rentals.map((report) => (
                  <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      {report.reportType === "SWAP" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold text-xs uppercase">
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Swap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs uppercase">
                          <Receipt className="w-3.5 h-3.5" /> Rent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-white">
                        {report.apartment?.title || "Unknown Apartment"}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {report.apartment?.city || "Unknown City"} 
                        {report.targetApartmentId && ` ↔ Target: ${report.targetApartment?.title || report.targetApartmentId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {report.apartment?.user?.username || "Unknown"}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {report.apartment?.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-700 dark:text-zinc-300">
                      {report.weekend ? new Date(report.weekend).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.payment?.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                          <AlertCircle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.payment?.status === "PENDING" && (
                        <button
                          onClick={() => handleMarkAsPaid(report.id)}
                          disabled={isMarkingPaid}
                          className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
