"use client";

import { useState } from "react";
import { Search, CreditCard, ChevronDown, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const payments = [
    {
      id: "TXN-9281A",
      owner: "David Cohen",
      amount: 150.00,
      type: "Payout", // Money going out to owner
      date: "Oct 12, 2026",
      status: "Completed",
      method: "Bank Transfer",
    },
    {
      id: "TXN-9281B",
      owner: "Sarah Levy",
      amount: 45.00,
      type: "Fee", // Money coming in (platform fee)
      date: "Oct 12, 2026",
      status: "Pending",
      method: "Credit Card",
    },
    {
      id: "TXN-9281C",
      owner: "Moshe Goldberg",
      amount: 300.00,
      type: "Payout",
      date: "Oct 10, 2026",
      status: "Failed",
      method: "PayPal",
    },
    {
      id: "TXN-9281D",
      owner: "Rivka Shapiro",
      amount: 75.50,
      type: "Fee",
      date: "Oct 09, 2026",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: "TXN-9281E",
      owner: "Chaim Stern",
      amount: 420.00,
      type: "Payout",
      date: "Oct 08, 2026",
      status: "Completed",
      method: "Bank Transfer",
    }
  ];

  const filteredPayments = payments.filter(payment => 
    payment.owner.toLowerCase().includes(searchQuery.toLowerCase()) || 
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending": return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "Completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "Failed": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Pending": return <Clock className="mr-1.5 h-3.5 w-3.5" />;
      case "Completed": return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />;
      case "Failed": return <XCircle className="mr-1.5 h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Payments & Transactions</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage all platform payouts, fees, and transaction history.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                placeholder="Search by owner or transaction ID"
              />
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center justify-between w-[130px] rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <span>All Statuses</span>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Transaction ID</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Owner</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Amount</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Method</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {payment.owner}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {payment.type === "Payout" ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                      )}
                      <span className={`font-bold ${payment.type === "Payout" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                        ${payment.amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-zinc-400" />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
