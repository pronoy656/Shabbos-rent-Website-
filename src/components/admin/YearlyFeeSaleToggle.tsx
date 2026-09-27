"use client";

import React from "react";
import { useListingFeeStatus, useToggleYearlyFeeSale } from "@/hooks/useListingFeeStatus";
import { Tag, Sparkles, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const YearlyFeeSaleToggle: React.FC = () => {
  const { data: feeStatus, isLoading } = useListingFeeStatus();
  const toggleMutation = useToggleYearlyFeeSale();

  const isOnSale = Boolean(feeStatus?.isOnSale);

  const handleToggle = async () => {
    try {
      const newStatus = !isOnSale;
      await toggleMutation.mutateAsync(newStatus);
      toast.success(
        newStatus
          ? "🎉 Yearly listing fee promotion enabled! All new listings can activate for FREE."
          : "Yearly listing fee set back to normal (₪28/year via Nedarim Plus)."
      );
    } catch (err) {
      toast.error("Failed to update yearly fee promotion status");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all">
      <div className="flex items-start sm:items-center gap-4">
        <div
          className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
            isOnSale
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          }`}
        >
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Yearly Listing Fee Promotion (ON SALE)
            </h3>
            {isOnSale ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-full">
                <Sparkles className="w-3 h-3 text-amber-500" /> ACTIVE PROMO (₪0 FREE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold rounded-full">
                NORMAL (₪28 / Year)
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            When ON, first-time owners and renewing hosts see <em>"Good news — no fee right now!"</em> and can activate their listing for 365 days instantly without paying ₪28.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {toggleMutation.isPending && (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
        )}
        <button
          onClick={handleToggle}
          disabled={isLoading || toggleMutation.isPending}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isOnSale ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
          } disabled:opacity-50`}
          aria-label="Toggle yearly fee sale"
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isOnSale ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default YearlyFeeSaleToggle;
