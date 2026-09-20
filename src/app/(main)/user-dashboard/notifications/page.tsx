"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Phone, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export default function NotificationsPage() {
  const [emailOptInState, setEmailOptInState] = useState(true);
  const [phoneCommState, setPhoneCommState] = useState(true);
  const [emailBookingsState, setEmailBookingsState] = useState(true);
  const [emailPromosState, setEmailPromosState] = useState(true);
  const [emailNewsletterState, setEmailNewsletterState] = useState(true);
  const [emailSavedToast, setEmailSavedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmailOptInState(localStorage.getItem("emailOptIn") !== "false");
      setPhoneCommState(localStorage.getItem("phoneCommState") !== "false");
      setEmailBookingsState(localStorage.getItem("emailBookings") !== "false");
      setEmailPromosState(localStorage.getItem("emailPromos") !== "false");
      setEmailNewsletterState(localStorage.getItem("emailNewsletter") !== "false");
    }
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("emailOptIn", emailOptInState ? "true" : "false");
    localStorage.setItem("phoneCommState", phoneCommState ? "true" : "false");
    localStorage.setItem("emailBookings", emailBookingsState ? "true" : "false");
    localStorage.setItem("emailPromos", emailPromosState ? "true" : "false");
    localStorage.setItem("emailNewsletter", emailNewsletterState ? "true" : "false");

    setEmailSavedToast(true);
    setTimeout(() => setEmailSavedToast(false), 3000);
  };

  const notificationFeed = [
    {
      id: "n-1",
      title: "Apartment Verified",
      desc: "Your apartment listing was approved by the administration team and is now live.",
      time: "2 hours ago",
      type: "success",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      id: "n-2",
      title: "New Shabbat Guest Inquiry",
      desc: "A guest submitted an interest notification for Shabbat Vayeira.",
      time: "1 day ago",
      type: "inquiry",
      icon: Mail,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      id: "n-3",
      title: "Weekly Availability Reminder",
      desc: "Remember to update your calendar for upcoming holiday weekends.",
      time: "3 days ago",
      type: "reminder",
      icon: Clock,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-500" />
          Notifications & Communication Channels
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account alerts, guest inquiry notifications, and automated email reminders.
        </p>
      </div>

      {emailSavedToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold text-sm">
            Notification preferences saved successfully!
          </span>
        </div>
      )}

      {/* Notifications Feed */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {notificationFeed.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{item.title}</h4>
                  <span className="text-xs text-zinc-400">{item.time}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
          Communication Preferences
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Choose what notifications you want to receive via email and SMS.
        </p>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <span className="font-bold text-sm text-zinc-900 dark:text-white block">
                Booking Inquiries & Guest Messages
              </span>
              <span className="text-xs text-zinc-400">
                Receive instant email alerts when a guest inquiries about your apartment.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailBookingsState}
              onChange={(e) => setEmailBookingsState(e.target.checked)}
              className="w-4 h-4 rounded text-[#4c55a4] accent-[#4c55a4] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <span className="font-bold text-sm text-zinc-900 dark:text-white block">
                Weekly Availability Reminders
              </span>
              <span className="text-xs text-zinc-400">
                Automated weekly reminder to keep your Shabbat calendar up to date.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailOptInState}
              onChange={(e) => setEmailOptInState(e.target.checked)}
              className="w-4 h-4 rounded text-[#4c55a4] accent-[#4c55a4] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <span className="font-bold text-sm text-zinc-900 dark:text-white block">
                Phone & Hotline Contact Permissions
              </span>
              <span className="text-xs text-zinc-400">
                Allow guests to contact you via telephone and WhatsApp hotline for confirmed requests.
              </span>
            </div>
            <input
              type="checkbox"
              checked={phoneCommState}
              onChange={(e) => setPhoneCommState(e.target.checked)}
              className="w-4 h-4 rounded text-[#4c55a4] accent-[#4c55a4] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <span className="font-bold text-sm text-zinc-900 dark:text-white block">
                Community Announcements & Newsletters
              </span>
              <span className="text-xs text-zinc-400">
                Occasional updates regarding holiday market demand, pricing tips, and new features.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailNewsletterState}
              onChange={(e) => setEmailNewsletterState(e.target.checked)}
              className="w-4 h-4 rounded text-[#4c55a4] accent-[#4c55a4] cursor-pointer"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
