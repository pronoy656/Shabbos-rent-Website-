"use client";

import { useEffect, useRef, useState } from "react";
import { buildNedarimIframeUrl, extractTransactionId, isNedarimOrigin, formatILS } from "@/lib/payment/helpers";
import type { ListingPaymentIntent } from "@/lib/payment/types";
import { X, ShieldCheck, Loader2, AlertCircle, Lock, CheckCircle2 } from "lucide-react";

interface NedarimPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  onVerify?: (transactionId: string) => Promise<any>;
  intent: ListingPaymentIntent;
  iframeUrl?: string | null;
}

export function NedarimPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  onVerify,
  intent,
  iframeUrl: passedUrl,
}: NedarimPaymentModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTxId, setManualTxId] = useState("");
  const calledRef = useRef(false);

  const fallbackIframeUrl = passedUrl || (intent ? buildNedarimIframeUrl(intent) : "");

  useEffect(() => {
    calledRef.current = false;

    const handler = async (event: MessageEvent) => {
      if (!isNedarimOrigin(event.origin)) return;

      const txId = extractTransactionId(event.data);
      if (txId && !calledRef.current) {
        calledRef.current = true;
        setIsVerifying(true);
        setError(null);
        try {
          if (onVerify) {
            await onVerify(txId);
          }
          onSuccess(txId);
        } catch (err: any) {
          setError(err?.message || "Verification failed");
        } finally {
          setIsVerifying(false);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSuccess, onVerify]);

  // Show manual fallback after 45 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowManualInput(true), 45000);
    return () => clearTimeout(timer);
  }, []);

  const handleManualVerify = async () => {
    if (!manualTxId.trim()) return;
    setIsVerifying(true);
    setError(null);
    try {
      if (onVerify) {
        await onVerify(manualTxId.trim());
      }
      onSuccess(manualTxId.trim());
    } catch (err: any) {
      setError(err?.message || "Manual verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isVerifying) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Nedarim Plus Secure Payment
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Yearly Listing Fee: <strong className="text-emerald-600 dark:text-emerald-400 font-black">{formatILS(intent.amount || 28)}</strong> / Year
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isVerifying}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="relative h-[540px] w-full bg-white dark:bg-zinc-950">
          {isVerifying ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 gap-4 p-6 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div className="space-y-1">
                <p className="text-base font-bold text-zinc-900 dark:text-white">
                  Verifying Payment with Nedarim Plus...
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Activating your listing for 365 days. Please do not close this window.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
              <iframe
                src={fallbackIframeUrl}
                title="Nedarim Plus Payment Gateway"
                className="w-full h-[540px] border-none"
                scrolling="yes"
                allow="payment"
              />
            </div>
          )}
        </div>

        {/* Manual Fallback Option if iframe blocked */}
        {showManualInput && !isVerifying && (
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <p className="text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
              Completed payment in iframe or phone? Enter confirmation code:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TX-123456"
                value={manualTxId}
                onChange={(e) => setManualTxId(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-white"
              />
              <button
                onClick={handleManualVerify}
                className="px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg text-xs hover:opacity-90 transition"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit SSL encrypted via <strong>Nedarim Plus</strong></span>
          </div>
          <span>ILS ₪ only</span>
        </div>
      </div>
    </div>
  );
}

export default NedarimPaymentModal;
