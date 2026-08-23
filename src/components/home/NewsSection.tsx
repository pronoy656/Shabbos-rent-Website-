"use client";

import { useState } from "react";
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Pin, 
  Tag, 
  X, 
  Sparkles, 
  ChevronRight,
  Share2,
  Bookmark
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  isPinned?: boolean;
  image: string;
  author: string;
}

export default function NewsSection() {
  const { language } = useLanguage();
  const isHebrew = language === "HE";
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<number[]>([]);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: isHebrew ? "הנחיות להזמנות שבת וחגי תשרי 2026" : "High Holiday & Shabbat Booking Guidelines 2026",
      summary: isHebrew 
        ? "כל מה שצריך לדעת על הזמנת דירות מראש לשבתות חתן, ראש השנה וסוכות עם כשרות מובטחת." 
        : "Everything you need to know about early bookings for Shabbat, Rosh Hashanah, and Sukkot with guaranteed Kosher standards.",
      content: isHebrew
        ? "לקראת עונת החגים והשבתות העמוסות, Shabos Rent שמחה להשיק את מערכת הסינון והאימות המשודרגת. כל הדירות הנרשמות לעונה הקרובה עוברות בדיקת כשרות מטבח, פלטת שבת, מיחם מים מותאם ומנעולי שבת ללא חילול שבת. מומלץ להזמין לפחות 3 שבועות מראש כדי להבטיח את מיקומכם ליד בתי הכנסת המבוקשים."
        : "Ahead of the upcoming busy High Holidays and Shabbat seasons, Shabos Rent is proud to launch our upgraded verification protocol. All listings enrolled for the upcoming season undergo strict kitchen kosher verification, Shabbat hot plates, compliant water urns, and mechanical Shabbat key-locks. We strongly advise booking at least 3 weeks in advance to secure prime walk-to-synagogue locations.",
      category: isHebrew ? "הודעה רשמית" : "Official Notice",
      categoryColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      date: "Sep 1, 2026",
      readTime: "3 min read",
      isPinned: true,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      author: "Shabos Rent Team"
    },
    {
      id: 2,
      title: "הורחב שירות הקו החם הקולי להזמנת דירות בירושלים והסביבה",
      summary: isHebrew
        ? "מעכשיו ניתן לבצע שאלות, לברר זמינות ולהירשם לדירות שבת באמצעות המערכת הקולית האוטומטית."
        : "You can now query availability, inspect listings, and book Shabbat rentals directly via our interactive voice hotline.",
      content: isHebrew
        ? "במטרה להנגיש את השירות לכלל הקהילה, השקנו את הקו החם הקולי. המערכת המאובטחת מאפשרת לבעלי דירות ולאורחים לקבל עדכוני בזמן אמת, לשמוע פרטי דירות פנויות לשבת הקרובה ולבקש חזרה מנציג - הכל בשיחת טלפון פשוטה וללא צורך באינטרנט."
        : "To make our platform accessible to everyone in the community, we have officially rolled out the Shabos Rent Voice Hotline. The automated phone system allows hosts and guests to listen to live Shabbat availability, verify amenities, and request call-backs—all with a simple phone call without requiring internet access.",
      category: isHebrew ? "עדכון טכנולוגי" : "Platform Feature",
      categoryColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
      date: "Aug 25, 2026",
      readTime: "4 min read",
      isPinned: true,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      author: "Tech & Product Dept"
    },
    {
      id: 3,
      title: "מדריך לארח נכון: טיפים להכנת הדירה לאורחי שבת",
      summary: isHebrew
        ? "כך תכינו את הדירה שלכם בצורה המושלמת עבור השוכרים - שעוני שבת, כיבוד קל ומפה מקומית."
        : "How to prepare your apartment for Shabbat guests—Shabbat timers, welcome hampers, and synagogue walk maps.",
      content: isHebrew
        ? "אירוח מוצלח מתחיל בפרטים הקטנים. שוכרי דירות לשבת מעריכים מאוד מפתח שבת רזרבי, הוראות ברורות להפעלת שעוני השבת, מידע על זמני כניסת ויציאת השבת במקום, ורשימת בתי כנסת ומקווים קרובים במרחק הליכה. קראו את המדריך המלא לקבלת דירוג 5 כוכבים מכל אורח."
        : "Successful Shabbat hosting is all in the details. Shabbat renters deeply appreciate a backup mechanical key, clear instructions for pre-set Shabbat timers, candle lighting times, and a list of walk-to synagogues and Mikvaot nearby. Read our complete host guide to maintain 5-star reviews.",
      category: isHebrew ? "מדריכים וטיפים" : "Tips & Guides",
      categoryColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      date: "Aug 18, 2026",
      readTime: "5 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      author: "Host Community Guild"
    },
    {
      id: 4,
      title: "מתחמים חדשים נוספו: בני ברק, בית שמש וביתר עילית",
      summary: isHebrew
        ? "מאות דירות איכותיות לשבתות וסופי שבוע הצטרפו לאחרונה לפלטפורמה בערים המבוקשות."
        : "Hundreds of high-quality apartments for Shabbat and weekends have joined Shabos Rent across prime demand locations.",
      content: isHebrew
        ? "אנו נרגשים להודיע על הרחבת המערך במרכז ובאזור ירושלים. עשרות דירות חדשות ומאובזרות היטב זמינות כעת להזמנה מידית עם מחירים שקופים, אפשרות להחלפת דירות (Swaps) וערבות איכות של Shabos Rent."
        : "We are thrilled to announce major expansion in central Israel and greater Jerusalem regions. Dozens of pristine, newly furnished apartments are now available for instant booking with transparent pricing, swap opportunities, and Shabos Rent quality assurance.",
      category: isHebrew ? "חדשות קהילה" : "Community News",
      categoryColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      date: "Aug 10, 2026",
      readTime: "2 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      author: "Regional Operations"
    }
  ];

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedNewsIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50 font-sans border-t border-zinc-200 dark:border-zinc-800/80 relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {isHebrew ? "חדשות ועדכונים" : "News & Announcements"}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {isHebrew ? "עדכונים אחרונים מקהילת Shabos Rent" : "Latest Updates & Platform News"}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-base md:text-lg max-w-2xl">
              {isHebrew 
                ? "הישארו מעודכנים בחדשות האחרונות, הנחיות השבת, פיצ'רים חדשים וטיפים לאירוח מושלם."
                : "Stay informed with community announcements, Shabbat hosting guides, new feature rollouts, and holiday updates."}
            </p>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((news) => {
            const isSaved = savedNewsIds.includes(news.id);
            return (
              <article
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    {/* Category Tag */}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${news.categoryColor}`}>
                      {news.category}
                    </span>

                    {/* Pinned Badge */}
                    {news.isPinned && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Pin className="w-3.5 h-3.5 fill-white" />
                        {isHebrew ? "נעוץ" : "Pinned"}
                      </span>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleSave(news.id, e)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-md backdrop-blur-sm"
                      title={isSaved ? "Remove bookmark" : "Save article"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" : ""}`} />
                    </button>
                  </div>

                  {/* Content Container */}
                  <div className="p-5">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {news.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {news.readTime}
                      </span>
                    </div>

                    {/* News Title */}
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {news.title}
                    </h3>

                    {/* News Summary */}
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm line-clamp-3 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>{isHebrew ? "קרא את הכתבה המלאה" : "Read Full Story"}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800 relative p-6 md:p-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header image inside modal */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${selectedNews.categoryColor}`}>
                {selectedNews.category}
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                {selectedNews.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                {selectedNews.readTime}
              </span>
              <span>•</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                {selectedNews.author}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 leading-tight">
              {selectedNews.title}
            </h2>

            {/* Content Body */}
            <div className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed space-y-4 mb-8">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg border-l-4 border-blue-600 rtl:border-r-4 rtl:border-l-0 pl-4 rtl:pr-4 py-1">
                {selectedNews.summary}
              </p>
              <p>{selectedNews.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(isHebrew ? "הקישור הועתק ללוח" : "Link copied to clipboard!")}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {isHebrew ? "שתף כתבה" : "Share"}
                </button>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                {isHebrew ? "סגור" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
