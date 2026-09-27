"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Building2, ShieldCheck } from "lucide-react";

interface ListingSuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  apartmentId: string;
  propertyTitle: string;
  propertyId?: string;
}

export const ListingSuccessModal: React.FC<ListingSuccessModalProps> = ({
  isOpen,
  onClose,
  apartmentId,
  propertyTitle,
  propertyId,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceed = () => {
    if (onClose) onClose();
    router.push(`/apartment/${apartmentId}/activate`);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-extrabold rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Listing Created Successfully!
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
          Almost Ready to Go Live!
        </h2>

        {propertyId && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold rounded-xl mb-4 border border-zinc-200 dark:border-zinc-700">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            Property ID: {propertyId}
          </div>
        )}

        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
          Your apartment <strong className="text-zinc-900 dark:text-white">"{propertyTitle || "New Shabbat Apartment"}"</strong> has been saved. Complete the 1-year activation pass to start receiving booking requests from verified guests.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleProceed}
          className="w-full flex items-center justify-center gap-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white font-extrabold py-4 px-6 rounded-2xl transition duration-150 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 text-[15px] cursor-pointer"
        >
          <span>Proceed to Activation</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ListingSuccessModal;
