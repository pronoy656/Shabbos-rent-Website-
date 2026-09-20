"use client";

import { Phone, PhoneCall, MessageSquare, Clock } from "lucide-react";
import { getTelLink, getWhatsAppLink, formatPhoneNumber } from "@/utils/phoneUtils";

export default function CallLogPage() {
  const callLogs = [
    {
      id: "call-1",
      phone: "+972 50-123-4567",
      callerName: "Interested Guest",
      timestamp: "Today, 10:45 AM",
      duration: "2m 14s",
      status: "Answered",
      notes: "Inquired about Shabbat Vayeira availability and crib for baby.",
    },
    {
      id: "call-2",
      phone: "+972 54-987-6543",
      callerName: "Anonymous Caller",
      timestamp: "Yesterday, 4:20 PM",
      duration: "0m 45s",
      status: "Missed",
      notes: "Callback requested regarding Sukkot week pricing.",
    },
    {
      id: "call-3",
      phone: "+972 52-333-8899",
      callerName: "David Levi",
      timestamp: "Sep 12, 2024, 7:15 PM",
      duration: "4m 02s",
      status: "Answered",
      notes: "Asked for kosher certificate details and parking availability.",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#4c55a4]" />
            Hotline & Inquiry Call Log
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Automated hotline inquiry tracking and caller connect history for your listing.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {callLogs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  log.status === "Answered"
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {formatPhoneNumber(log.phone)}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.status === "Answered"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{log.notes}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {log.timestamp}
                  </span>
                  <span>•</span>
                  <span>Duration: {log.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={getTelLink(log.phone)}
                className="p-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                title="Call Back"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <a
                href={getWhatsAppLink(log.phone, "Hello! I received your inquiry about my apartment on Shabbos Rent.")}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                title="WhatsApp Message"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
