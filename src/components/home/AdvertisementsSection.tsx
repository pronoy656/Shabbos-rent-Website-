"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Tag, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  Gift, 
  PhoneCall, 
  ArrowRight, 
  Building,
  Info,
  X,
  Send,
  Zap
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PhoneInput } from "@/components/common/PhoneInput";

interface AdItem {
  id: number;
  title: string;
  partner: string;
  category: "all" | "catering" | "transport" | "services" | "supplies";
  categoryLabel: string;
  discountBadge?: string;
  badgeText: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  ctaText: string;
  link: string;
  isPopular?: boolean;
}

export default function AdvertisementsSection() {
  const { language } = useLanguage();
  const isHebrew = language === "HE";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [submittedAdForm, setSubmittedAdForm] = useState<boolean>(false);
  const [adPhone, setAdPhone] = useState<string>("");

  const categories = [
    { id: "all", label: isHebrew ? "כל הפרסומות" : "All Ads" },
    { id: "catering", label: isHebrew ? "קייטרינג ואוכל" : "Catering & Meals" },
    { id: "transport", label: isHebrew ? "הסעות ורכב" : "Transport & Cars" },
    { id: "services", label: isHebrew ? "שירותי ניקיון ותחזוקה" : "Cleaning & Services" },
    { id: "supplies", label: isHebrew ? "ציוד ומוצרי שבת" : "Shabbat Supplies" },
  ];

  const ads: AdItem[] = [
    {
      id: 1,
      title: isHebrew ? "קייטרינג גלאט כשר לשבת" : "Glatt Kosher Gourmet Shabbat Catering",
      partner: "Jerusalem Gourmet Glatt",
      category: "catering",
      categoryLabel: isHebrew ? "קייטרינג" : "Catering",
      discountBadge: "15% OFF",
      badgeText: isHebrew ? "חסות מומלצת" : "Sponsored Partner",
      rating: 4.9,
      reviewsCount: 128,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
      description: isHebrew 
        ? "ארוחות שבת מוכנות ברמת כשרות מהודרת. משלוח ישיר לדירת הנופש לפני כניסת השבת."
        : "Pre-packaged gourmet Shabbat meals delivered straight to your rental before Shabbat candle lighting.",
      features: [
        isHebrew ? "הכשר מהודר גלאט" : "Glatt Kosher Certified",
        isHebrew ? "משלוח חינם לדירה" : "Free Delivery to Rental",
        isHebrew ? "תפריט לכל המשפחה" : "Family Feast Packages"
      ],
      ctaText: isHebrew ? "הזמן תפריט שבת" : "Order Shabbat Menu",
      link: "#",
      isPopular: true,
    },
    {
      id: 2,
      title: isHebrew ? "הסעות VIP ושירות רכב לשבת" : "Chaverim Airport & Shabbat Shuttle",
      partner: "Chaverim Transport Ltd",
      category: "transport",
      categoryLabel: isHebrew ? "תחבורה" : "Transport",
      discountBadge: "Fixed Rates",
      badgeText: isHebrew ? "שותף מאומת" : "Verified Partner",
      rating: 5.0,
      reviewsCount: 210,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      description: isHebrew
        ? "שירותי הסעה מנמל התעופה לדירה וחזרה. כולל תיאום מפתח שבת ומנעול מכני."
        : "Direct airport transfers to your Shabbat rental with pre-cleared mechanical key drop-offs.",
      features: [
        isHebrew ? "נהגים יראי שמיים" : "Courteous Drivers",
        isHebrew ? "זמינות 24/6" : "24/6 Availability",
        isHebrew ? "תיאום שעות כניסת שבת" : "Shabbat Entrance Sync"
      ],
      ctaText: isHebrew ? "הזמן הסעה" : "Book Shuttle",
      link: "#",
    },
    {
      id: 3,
      title: isHebrew ? "שירותי ניקיון יסודי לפני צ'ק-אין" : "Pre-Checkin Deep Cleaning Services",
      partner: "CleanShabos Pros",
      category: "services",
      categoryLabel: isHebrew ? "ניקיון" : "Cleaning",
      discountBadge: "₪50 Voucher",
      badgeText: isHebrew ? "שירות מבוקש" : "Top Service",
      rating: 4.8,
      reviewsCount: 94,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      description: isHebrew
        ? "הכנת הדירה לאורחים: ניקיון יסודי, החלפת מצעים, והכנת מיחם ופלטת שבת."
        : "Professional apartment sanitization, fresh linen turnover, and pre-setting Shabbat urns.",
      features: [
        isHebrew ? "הכשרת מטבח מקצועית" : "Kitchen Sanitization",
        isHebrew ? "סידור שעוני שבת" : "Shabbat Timers Setup",
        isHebrew ? "בדיקת תקינות מנעולים" : "Lock Checks"
      ],
      ctaText: isHebrew ? "הזמן ניקיון" : "Hire Cleaning Team",
      link: "#",
    },
    {
      id: 4,
      title: isHebrew ? "השכרת מוצרי שבת ושעונים חכמים" : "Smart Shabbat Appliances & Lamp Rentals",
      partner: "KosherHome Rentals",
      category: "supplies",
      categoryLabel: isHebrew ? "ציוד שבת" : "Supplies",
      discountBadge: "Free Delivery",
      badgeText: isHebrew ? "ציוד כשר" : "Kosher Certified",
      rating: 4.9,
      reviewsCount: 156,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      description: isHebrew
        ? "מיחמי נירוסטה לשבת, פלטות שבת, מנורות שבת מתכווננות ומיטות תינוק מתקפלות."
        : "Heavy-duty water urns, Shabbat hot plates, adjustable Kosher lamps, and fold-up baby cribs.",
      features: [
        isHebrew ? "אישור מכון מדעי טכנולוגי" : "Halachic Certification",
        isHebrew ? "אספקה עד פתח הדירה" : "Doorstep Delivery",
        isHebrew ? "תמיכה טלפונית" : "Telephone Support"
      ],
      ctaText: isHebrew ? "השכר ציוד" : "Rent Equipment",
      link: "#",
      isPopular: true,
    }
  ];

  const filteredAds = activeCategory === "all" 
    ? ads 
    : ads.filter(ad => ad.category === activeCategory);

  const handleAdFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAdForm(true);
    setTimeout(() => {
      setSubmittedAdForm(false);
      setIsAdModalOpen(false);
    }, 3000);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-zinc-950 font-sans border-t border-zinc-200 dark:border-zinc-800 relative">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            {isHebrew ? "פרסומות ומבצעים מיוחדים" : "Featured Advertisements & Deals"}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            {isHebrew ? "הצעות מיוחדות ושירותים נלווים לשבת" : "Exclusive Partner Offers & Shabbat Services"}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
            {isHebrew 
              ? "גלו קייטרינג גלאט, שירותי הסעות, ציוד שבת וניקיון מבעלי מקצוע מאומתים בקהילה."
              : "Discover verified kosher catering, Shabbat transport, equipment rentals, and cleaning partners."}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#4c55a4] text-white shadow-md shadow-indigo-500/20"
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Banner Image */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      {ad.badgeText}
                    </span>
                    {ad.discountBadge && (
                      <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        {ad.discountBadge}
                      </span>
                    )}
                  </div>

                  {/* Partner Name on Image */}
                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                    <Building className="w-3.5 h-3.5 text-purple-300" />
                    {ad.partner}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-2">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{ad.rating.toFixed(1)}</span>
                    <span className="text-zinc-400 font-normal">({ad.reviewsCount} {isHebrew ? "ביקורות" : "reviews"})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {ad.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                    {ad.description}
                  </p>

                  {/* Bullet features */}
                  <ul className="space-y-1.5 mb-4">
                    {ad.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => alert(isHebrew ? `מועבר לאתר השותף: ${ad.partner}` : `Redirecting to ${ad.partner}...`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 font-bold text-xs md:text-sm transition-all duration-200 border border-purple-200 dark:border-purple-800/60"
                >
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner: Invite Businesses to Advertise */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#4c55a4] via-indigo-600 to-purple-700 text-white p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-start">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                {isHebrew ? "בעל עסק או נותן שירות?" : "Business Owner or Service Provider?"}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                {isHebrew ? "פרסם את העסק שלך באתר Shabos Rent" : "Promote Your Business to Thousands of Shabbat Renters"}
              </h3>
              <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
                {isHebrew
                  ? "הגע ישירות לאלפי משפחות ואורחים המחפשים שירותי קייטרינג, ניקיון ותחבורה לשבת."
                  : "Reach thousands of families looking for kosher food, shuttle services, and holiday supplies."}
              </p>
            </div>
            <button
              onClick={() => setIsAdModalOpen(true)}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-[#4c55a4] hover:bg-indigo-50 font-extrabold text-sm md:text-base shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{isHebrew ? "בקש לפרסם מודעה" : "Request Ad Placement"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Request Ad Placement Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
            <button
              onClick={() => setIsAdModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedAdForm ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {isHebrew ? "הבקשה נשלחה בהצלחה!" : "Ad Request Submitted!"}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {isHebrew 
                    ? "צוות הפרסום שלנו יצור עמך קשר בהקדם להשלמת הפרטים."
                    : "Our advertising sales team will reach out to you shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdFormSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg mb-1">
                  <Sparkles className="w-5 h-5" />
                  <h3>{isHebrew ? "פרסום עסק ב-Shabos Rent" : "Advertise on Shabos Rent"}</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  {isHebrew ? "מלא את הפרטים ונחזור אליך עם הצעת פרסום מותאמת." : "Fill out your business details and we'll send you an ad package quote."}
                </p>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isHebrew ? "שם העסק / החברה" : "Business Name"}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jerusalem Shabbat Catering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      {isHebrew ? "איש קשר" : "Contact Person"}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <PhoneInput
                      label={isHebrew ? "טלפון ליצירת קשר" : "Phone Number"}
                      required
                      value={adPhone}
                      onChange={setAdPhone}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isHebrew ? "תחום עיסוק" : "Category"}
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                    <option>{isHebrew ? "קייטרינג ומזון" : "Catering & Food"}</option>
                    <option>{isHebrew ? "תחבורה והסעות" : "Transportation"}</option>
                    <option>{isHebrew ? "שירותי ניקיון" : "Cleaning & Maintenance"}</option>
                    <option>{isHebrew ? "ציוד שבת" : "Shabbat Supplies"}</option>
                    <option>{isHebrew ? "אחר" : "Other Services"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isHebrew ? "תיאור קצר של המודעה" : "Brief Ad Description"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what offer or discount you'd like to promote..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isHebrew ? "שלח בקשת פרסום" : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
