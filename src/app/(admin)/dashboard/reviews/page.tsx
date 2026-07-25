"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Check, X, ShieldCheck, CheckCircle2, AlertCircle, Clock, Filter, ArrowLeft, Plus } from "lucide-react";

export default function ReviewModerationPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [pendingReviews, setPendingReviews] = useState<any[]>([
    {
      id: "pending-demo-1",
      apartmentId: "1",
      apartmentTitle: "Luxury Penthouse in Jerusalem",
      reviewerName: "David Cohen",
      rating: 5,
      title: "Absolutely Stunning Shabbos Apartment!",
      comment: "Host was extremely accommodating. Hot plate and urn were already set up. Will definitely stay here again!",
      date: "Jul 24, 2026",
      status: "Pending"
    },
    {
      id: "pending-demo-2",
      apartmentId: "2",
      apartmentTitle: "Cozy Garden Suite in Rehavia",
      reviewerName: "Sarah Klein",
      rating: 4,
      title: "Very comfortable and great location",
      comment: "Super close to local shuls and quiet neighborhood. Kitchen was clean and spacious.",
      date: "Jul 23, 2026",
      status: "Pending"
    }
  ]);

  const [approvedReviews, setApprovedReviews] = useState<any[]>([
    {
      id: "rev-default-1",
      apartmentId: "1",
      apartmentTitle: "Luxury Penthouse in Jerusalem",
      reviewerName: "Chaim Gold",
      rating: 5,
      title: "Perfect Shabbos Stay",
      comment: "The apartment was spotless and the kosher kitchen setup made our Shabbos prep so easy. Highly recommend!",
      date: "Jul 10, 2026",
      status: "Approved"
    },
    {
      id: "rev-default-2",
      apartmentId: "1",
      apartmentTitle: "Luxury Penthouse in Jerusalem",
      reviewerName: "Miriam S.",
      rating: 5,
      title: "Great Location in Rehavia",
      comment: "Walking distance to Great Synagogue and Kotel. Very quiet building and comfortable beds.",
      date: "Jun 24, 2026",
      status: "Approved"
    }
  ]);

  // Admin Add Custom Testimonial Modal State (for About Us page)
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addRating, setAddRating] = useState(5);
  const [addQuote, setAddQuote] = useState("");
  const [addAvatar, setAddAvatar] = useState("");

  const handleAddAboutTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial = {
      id: `ab-t-${Date.now()}`,
      name: addName || "Chaim Goldberg",
      role: addRole || "Community Member",
      location: addLocation || "Jerusalem",
      avatar: addAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      rating: addRating,
      quote: addQuote,
    };

    if (typeof window !== "undefined") {
      const existingStr = localStorage.getItem("about_testimonials");
      const existingArr = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem("about_testimonials", JSON.stringify([newTestimonial, ...existingArr]));
    }

    setIsAddReviewModalOpen(false);
    setAddName("");
    setAddRole("");
    setAddLocation("");
    setAddQuote("");
    setAddAvatar("");
    showToast(`New About Us Testimonial added successfully! It is now live on the /about page.`, "success");
  };

  const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setToastMessage({ message: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPendingStr = localStorage.getItem("pending_reviews");
      if (savedPendingStr) {
        try {
          const savedPending = JSON.parse(savedPendingStr);
          setPendingReviews(prev => [...savedPending, ...prev]);
        } catch (e) {
          console.error(e);
        }
      }

      const savedApprovedStr = localStorage.getItem("approved_reviews");
      if (savedApprovedStr) {
        try {
          const savedApproved = JSON.parse(savedApprovedStr);
          setApprovedReviews(prev => [...savedApproved, ...prev]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleApproveReview = (review: any) => {
    if (typeof window !== "undefined") {
      const existingApprovedStr = localStorage.getItem("approved_reviews");
      const existingApproved = existingApprovedStr ? JSON.parse(existingApprovedStr) : [];
      const updatedApproved = [{ ...review, status: "Approved" }, ...existingApproved];
      localStorage.setItem("approved_reviews", JSON.stringify(updatedApproved));

      const existingPendingStr = localStorage.getItem("pending_reviews");
      if (existingPendingStr) {
        const existingPending = JSON.parse(existingPendingStr);
        const filteredPending = existingPending.filter((r: any) => r.id !== review.id);
        localStorage.setItem("pending_reviews", JSON.stringify(filteredPending));
      }
    }

    setApprovedReviews(prev => [{ ...review, status: "Approved" }, ...prev]);
    setPendingReviews(prev => prev.filter(r => r.id !== review.id));
    showToast(`Review by "${review.reviewerName}" has been APPROVED and published live!`, "success");
  };

  const handleRejectReview = (review: any) => {
    if (typeof window !== "undefined") {
      const existingPendingStr = localStorage.getItem("pending_reviews");
      if (existingPendingStr) {
        const existingPending = JSON.parse(existingPendingStr);
        const filteredPending = existingPending.filter((r: any) => r.id !== review.id);
        localStorage.setItem("pending_reviews", JSON.stringify(filteredPending));
      }
    }
    setPendingReviews(prev => prev.filter(r => r.id !== review.id));
    showToast(`Review by "${review.reviewerName}" has been rejected.`, "info");
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* Toast Notification Banner - Centered Top */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-extrabold ${
            toastMessage.type === "success" 
              ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20" 
              : "bg-zinc-900 text-white border-zinc-700 shadow-zinc-900/30 dark:bg-white dark:text-zinc-900"
          }`}>
            {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span>Review Moderation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" /> Review Moderation Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Moderate guest reviews and add testimonials for the About Us page.
          </p>
        </div>

        <button
          onClick={() => setIsAddReviewModalOpen(true)}
          className="px-5 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-[#4c55a4]/20 flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Review / Testimonial
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl w-fit border border-zinc-200 dark:border-zinc-700/60">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === "pending"
              ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Clock className="w-4 h-4" /> Pending Moderation ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === "approved"
              ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Approved & Live ({approvedReviews.length})
        </button>
      </div>

      {/* Tab Content: Pending */}
      {activeTab === "pending" && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          {pendingReviews.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Queue is Empty</h3>
              <p className="text-xs">There are no pending reviews requiring moderation at this time.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {pendingReviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-extrabold text-zinc-900 dark:text-white text-base">{review.reviewerName}</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-[#4c55a4] dark:text-indigo-400">Target Apartment: {review.apartmentTitle || `Apartment #${review.apartmentId}`}</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-medium text-zinc-500">{review.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white ml-1">{review.title}</span>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveReview(review)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                    >
                      <Check className="w-4 h-4 stroke-[3]" /> Approve & Publish
                    </button>
                    <button
                      onClick={() => handleRejectReview(review)}
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-rose-100 dark:bg-zinc-800 dark:hover:bg-rose-950/40 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-bold transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 active:scale-95"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Approved */}
      {activeTab === "approved" && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {approvedReviews.map((review) => (
              <div key={review.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-extrabold text-zinc-900 dark:text-white text-base">{review.reviewerName}</span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs font-semibold text-[#4c55a4] dark:text-indigo-400">{review.apartmentTitle || `Apartment #${review.apartmentId}`}</span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Live</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white ml-1">{review.title}</span>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    "{review.comment}"
                  </p>
                </div>

                <Link
                  href={`/apartments/${review.apartmentId || '1'}`}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  View on Apartment
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Testimonial Modal (for About Us page) */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative p-6 md:p-8">
            <button 
              onClick={() => setIsAddReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#4c55a4] flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Add About Us Testimonial
                </h3>
                <p className="text-xs text-zinc-500">This testimonial will display on the /about page section "What People Say About Us".</p>
              </div>
            </div>

            <form onSubmit={handleAddAboutTestimonial} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    placeholder="e.g. Chaim Goldberg"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={addRole}
                    onChange={e => setAddRole(e.target.value)}
                    placeholder="e.g. Regular Renter"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Location / Tag</label>
                  <input
                    type="text"
                    required
                    value={addLocation}
                    onChange={e => setAddLocation(e.target.value)}
                    placeholder="e.g. Jerusalem Stay"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Rating</label>
                  <select
                    value={addRating}
                    onChange={e => setAddRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={addAvatar}
                  onChange={e => setAddAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Testimonial Quote</label>
                <textarea
                  required
                  rows={3}
                  value={addQuote}
                  onChange={e => setAddQuote(e.target.value)}
                  placeholder="Write the testimonial text here..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4c55a4] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-[#4c55a4]/20 active:scale-95"
                >
                  Publish Testimonial to About Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
