/*
"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Phone,
  MessageSquare,
  Star,
  CheckCircle2,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { mockRenterBookings } from "@/components/dashboard/dashboardData";
import { getTelLink, getWhatsAppLink, formatPhoneNumber } from "@/utils/phoneUtils";

export default function BookingHistoryPage() {
  const [allRenterBookings, setAllRenterBookings] = useState(mockRenterBookings);
  const [selectedContactBooking, setSelectedContactBooking] = useState<any>(null);

  // Review State
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isReviewSuccessModalOpen, setIsReviewSuccessModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerNameInput, setReviewerNameInput] = useState("");
  const [reviewTitleInput, setReviewTitleInput] = useState("");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStr = localStorage.getItem("user_booking_history");
      if (savedStr) {
        try {
          const savedBookings = JSON.parse(savedStr);
          const formattedSaved = savedBookings.map((b: any) => ({
            id: b.id,
            refCode: b.confirmationCode || b.refCode || "SR-8492",
            apartmentId: b.apartmentId || "1",
            title: b.title || "Beautiful Apartment in Jerusalem",
            location: b.address || "Rehavia, Jerusalem",
            image: b.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            dateRange: b.dates || "Oct 13 - 15, 2024",
            hostName: b.hostName || "Moshe & Chaim Estates",
            hostPhone: b.hostPhone || "+972 54-123-4567",
            hostEmail: b.hostEmail || "owner@shabbosrent.com",
            totalPrice: b.amount ? parseInt(String(b.amount).replace(/[^0-9]/g, "")) : 4500,
            status: b.status || "Confirmed",
          }));
          setAllRenterBookings([...formattedSaved, ...mockRenterBookings]);
        } catch {}
      }
    }
  }, []);

  const handleOpenReviewModal = (booking: any) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setIsWriteReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      apartmentId: selectedBookingForReview.apartmentId || "1",
      apartmentTitle: selectedBookingForReview.title,
      reviewerName: reviewerNameInput || "Guest",
      rating: reviewRating,
      title: reviewTitleInput,
      comment: reviewCommentInput,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Pending",
    };

    if (typeof window !== "undefined") {
      const existingPending = localStorage.getItem("pending_reviews");
      const pendingArr = existingPending ? JSON.parse(existingPending) : [];
      localStorage.setItem("pending_reviews", JSON.stringify([newReview, ...pendingArr]));
    }

    setIsWriteReviewModalOpen(false);
    setReviewTitleInput("");
    setReviewCommentInput("");
    setIsReviewSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-amber-500" />
          Renter Booking History & Stays ({allRenterBookings.length})
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Review your upcoming and completed weekend stays, contact apartment hosts, and leave reviews.
        </p>
      </div>

      <div className="space-y-4">
        {allRenterBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#4c55a4] bg-[#4c55a4]/10 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-lg">
                    {b.refCode}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                      b.status === "Completed"
                        ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-1">
                  {b.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {b.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {b.dateRange}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
              <div className="md:text-right mr-2">
                <span className="text-xs text-zinc-400 block">Total</span>
                <span className="text-lg font-black text-zinc-900 dark:text-white">
                  ₪{b.totalPrice}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedContactBooking(b)}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Contact Host
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenReviewModal(b)}
                  className="px-4 py-2.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedContactBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedContactBooking(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
              Host Contact Information
            </h3>
            <p className="text-xs text-zinc-500 mb-6">{selectedContactBooking.title}</p>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl space-y-3 mb-6">
              <div>
                <span className="text-xs text-zinc-400 block">Host Name</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {selectedContactBooking.hostName}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Phone</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {formatPhoneNumber(selectedContactBooking.hostPhone)}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Email</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {selectedContactBooking.hostEmail}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={getTelLink(selectedContactBooking.hostPhone)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Host
              </a>
              <a
                href={getWhatsAppLink(selectedContactBooking.hostPhone, `Hello! Inquiring about booking ${selectedContactBooking.refCode}`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {isWriteReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsWriteReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
              Write a Review
            </h3>
            <p className="text-xs text-zinc-500 mb-6">{selectedBookingForReview?.title}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewerNameInput}
                  onChange={(e) => setReviewerNameInput(e.target.value)}
                  placeholder="e.g. David Levi"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitleInput}
                  onChange={(e) => setReviewTitleInput(e.target.value)}
                  placeholder="e.g. Wonderful Shabbat stay near the Kotel!"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Feedback & Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewCommentInput}
                  onChange={(e) => setReviewCommentInput(e.target.value)}
                  placeholder="Describe the apartment cleanliness, kosher kitchen setup, location, and host communication..."
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {isReviewSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Review Submitted!
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Thank you for sharing your experience. Your review has been submitted for moderation and will appear publicly once approved.
            </p>
            <button
              type="button"
              onClick={() => setIsReviewSuccessModalOpen(false)}
              className="w-full py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
*/

export default function BookingHistoryPage() {
  return null;
}
