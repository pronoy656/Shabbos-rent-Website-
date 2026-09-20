"use client";

import { useState } from "react";
import { Mail, Bell, Sparkles, Hand } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMyNotifyRequests } from "@/hooks/useNotifyRequests";
import { useMyInterestedRequests } from "@/hooks/useInterestedRequests";
import { useMyOffers } from "@/hooks/useOfferRequests";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterestedRequestsPage() {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<"notify" | "interested" | "offer">("notify");

  const { data: notifyData, isLoading: isNotifyLoading } = useMyNotifyRequests();
  const { data: interestedData, isLoading: isInterestedLoading } = useMyInterestedRequests();
  const { data: offerData, isLoading: isOfferLoading } = useMyOffers();

  const notifyRequests = notifyData?.received || [];
  const interestedRequests = interestedData?.received || [];
  const offerRequests = offerData?.received || [];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col w-full overflow-hidden">
      {/* Sub-Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSubTab("notify")}
          className={`flex-1 py-4 font-bold text-center text-sm transition-colors cursor-pointer ${
            subTab === "notify"
              ? "text-[#4c55a4] dark:text-indigo-400 border-b-2 border-[#4c55a4] dark:border-indigo-400 bg-zinc-50 dark:bg-zinc-800/30"
              : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
          }`}
        >
          Notify Requests ({notifyRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("interested")}
          className={`flex-1 py-4 font-bold text-center text-sm transition-colors cursor-pointer ${
            subTab === "interested"
              ? "text-[#4c55a4] dark:text-indigo-400 border-b-2 border-[#4c55a4] dark:border-indigo-400 bg-zinc-50 dark:bg-zinc-800/30"
              : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
          }`}
        >
          Interested ({interestedRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("offer")}
          className={`flex-1 py-4 font-bold text-center text-sm transition-colors cursor-pointer ${
            subTab === "offer"
              ? "text-[#4c55a4] dark:text-indigo-400 border-b-2 border-[#4c55a4] dark:border-indigo-400 bg-zinc-50 dark:bg-zinc-800/30"
              : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
          }`}
        >
          Offers ({offerRequests.length})
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {subTab === "notify" && (
          <>
            {isNotifyLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 animate-pulse">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-5 w-24 rounded-lg" />
                      </div>
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                ))}
              </div>
            ) : notifyRequests.length === 0 ? (
              <div className="py-16 px-6 text-center bg-gradient-to-b from-zinc-50/80 to-zinc-50 dark:from-zinc-800/20 dark:to-zinc-800/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800/80 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 bg-blue-100/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-200/50 dark:border-blue-900/50">
                  <Bell className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h4 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                  {t("dashboard.manage.no_notify_requests") || "No Request Available"}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  {t("dashboard.manage.no_notify_requests_desc") ||
                    "When renters ask to be notified when your apartment becomes available, they will appear here."}
                </p>
              </div>
            ) : (
              notifyRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shadow-sm">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                        {req.apartment?.title || "Apartment"}
                      </h4>
                      <p className="text-sm text-zinc-500 mb-1">{req.user?.email || "Unknown user"}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        Notify when available
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs text-zinc-400 font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    {req.user?.email && (
                      <a
                        href={`mailto:${req.user.email}?subject=Apartment Availability on Shabbos Rent`}
                        title="Email User"
                        className="p-2.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 rounded-full transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {subTab === "interested" && (
          <>
            {isInterestedLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 animate-pulse">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-5 w-24 rounded-lg" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : interestedRequests.length === 0 ? (
              <div className="py-16 px-6 text-center bg-gradient-to-b from-zinc-50/80 to-zinc-50 dark:from-zinc-800/20 dark:to-zinc-800/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800/80 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 bg-indigo-100/80 dark:bg-indigo-950/50 text-[#4c55a4] dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#4c55a4]/20">
                  <Hand className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h4 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                  {t("dashboard.manage.no_interested_requests") || "No Request Available"}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  {t("dashboard.manage.no_interested_requests_desc") ||
                    "When renters express interest in booking your apartment, their inquiries will appear here."}
                </p>
              </div>
            ) : (
              interestedRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shadow-sm shrink-0">
                      <Hand className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                        {req.apartment?.title || "Apartment"}
                      </h4>
                      <p className="text-sm text-zinc-500 mb-1">{req.user?.email || "Unknown user"}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Interested in booking
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                    {req.user?.email && (
                      <a
                        href={`mailto:${req.user.email}?subject=Re: Your apartment inquiry`}
                        className="px-4 py-2 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Reply
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {subTab === "offer" && (
          <>
            {isOfferLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 animate-pulse">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : offerRequests.length === 0 ? (
              <div className="py-16 px-6 text-center bg-gradient-to-b from-zinc-50/80 to-zinc-50 dark:from-zinc-800/20 dark:to-zinc-800/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800/80 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 bg-amber-100/80 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-200/50 dark:border-amber-900/50">
                  <Sparkles className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h4 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                  {t("dashboard.manage.no_offers") || "No Offers Available"}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  {t("dashboard.manage.no_offers_desc") ||
                    "When renters submit custom price offers for specific dates, you'll find them here."}
                </p>
              </div>
            ) : (
              offerRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg shadow-sm shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                        {req.apartment?.title || "Apartment"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {req.offerPrice && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            Offered: ₪{req.offerPrice}
                          </span>
                        )}
                        {req.shabbosId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Dates: {req.shabbosId}
                          </span>
                        )}
                      </div>
                      {req.message && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 italic mb-2">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
