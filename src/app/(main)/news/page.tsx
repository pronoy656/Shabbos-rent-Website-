"use client";

import { useState } from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import MainFooter from "@/components/layout/MainFooter";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Megaphone, 
  Search, 
  Calendar, 
  Clock, 
  Pin, 
  Bookmark, 
  Share2, 
  X, 
  ChevronRight, 
  Filter, 
  Sparkles,
  Mail,
  CheckCircle2,
  BellRing
} from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: "all" | "notice" | "feature" | "tips" | "community";
  categoryLabel: string;
  categoryColor: string;
  date: string;
  readTime: string;
  isPinned?: boolean;
  image: string;
  author: string;
}

export default function NewsPage() {
  const { language } = useLanguage();
  const isHebrew = language === "HE";
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = [
    { id: "all", label: isHebrew ? "כל העדכונים" : "All News" },
    { id: "notice", label: isHebrew ? "הודעות רשמיות" : "Official Notices" },
    { id: "feature", label: isHebrew ? "עדכוני פלטפורמה" : "Platform Features" },
    { id: "tips", label: isHebrew ? "מדריכים וטיפים" : "Tips & Guides" },
    { id: "community", label: isHebrew ? "חדשות קהילה" : "Community News" },
  ];

  const newsList: NewsItem[] = [
    {
      id: 1,
      title: isHebrew ? "הנחיות להזמנות שבת וחגי תשרי 2026" : "High Holiday & Shabbat Booking Guidelines 2026",
      summary: isHebrew 
        ? "כל מה שצריך לדעת על הזמנת דירות מראש לשבתות חתן, ראש השנה וסוכות עם כשרות מובטחת." 
        : "Everything you need to know about early bookings for Shabbat, Rosh Hashanah, and Sukkot with guaranteed Kosher standards.",
      content: isHebrew
        ? "לקראת עונת החגים והשבתות העמוסות, Shabos Rent שמחה להשיק את מערכת הסינון והאימות המשודרגת. כל הדירות הנרשמות לעונה הקרובה עוברות בדיקת כשרות מטבח, פלטת שבת, מיחם מים מותאם ומנעולי שבת ללא חילול שבת. מומלץ להזמין לפחות 3 שבועות מראש כדי להבטיח את מיקומכם ליד בתי הכנסת המבוקשים."
        : "Ahead of the upcoming busy High Holidays and Shabbat seasons, Shabos Rent is proud to launch our upgraded verification protocol. All listings enrolled for the upcoming season undergo strict kitchen kosher verification, Shabbat hot plates, compliant water urns, and mechanical Shabbat key-locks. We strongly advise booking at least 3 weeks in advance to secure prime walk-to-synagogue locations.",
      category: "notice",
      categoryLabel: isHebrew ? "הודעה רשמית" : "Official Notice",
      categoryColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      date: "Sep 1, 2026",
      readTime: "3 min read",
      isPinned: true,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      author: "Shabos Rent Team"
    },
    {
      id: 2,
      title: isHebrew ? "הורחב שירות הקו החם הקולי להזמנת דירות בירושלים והסביבה" : "Voice Hotline Booking Service Expanded for Jerusalem Region",
      summary: isHebrew
        ? "מעכשיו ניתן לבצע שאלות, לברר זמינות ולהירשם לדירות שבת באמצעות המערכת הקולית האוטומטית."
        : "You can now query availability, inspect listings, and book Shabbat rentals directly via our interactive voice hotline.",
      content: isHebrew
        ? "במטרה להנגיש את השירות לכלל הקהילה, השקנו את הקו החם הקולי. המערכת המאובטחת מאפשרת לבעלי דירות ולאורחים לקבל עדכוני בזמן אמת, לשמוע פרטי דירות פנויות לשבת הקרובה ולבקש חזרה מנציג - הכל בשיחת טלפון פשוטה וללא צורך באינטרנט."
        : "To make our platform accessible to everyone in the community, we have officially rolled out the Shabos Rent Voice Hotline. The automated phone system allows hosts and guests to listen to live Shabbat availability, verify amenities, and request call-backs—all with a simple phone call without requiring internet access.",
      category: "feature",
      categoryLabel: isHebrew ? "עדכון טכנולוגי" : "Platform Feature",
      categoryColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
      date: "Aug 25, 2026",
      readTime: "4 min read",
      isPinned: true,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      author: "Tech & Product Dept"
    },
    {
      id: 3,
      title: isHebrew ? "מדריך לארח נכון: טיפים להכנת הדירה לאורחי שבת" : "Host Masterclass: Preparing Your Apartment for Shabbat Guests",
      summary: isHebrew
        ? "כך תכינו את הדירה שלכם בצורה המושלמת עבור השוכרים - שעוני שבת, כיבוד קל ומפה מקומית."
        : "How to prepare your apartment for Shabbat guests—Shabbat timers, welcome hampers, and synagogue walk maps.",
      content: isHebrew
        ? "אירוח מוצלח מתחיל בפרטים הקטנים. שוכרי דירות לשבת מעריכים מאוד מפתח שבת רזרבי, הוראות ברורות להפעלת שעוני השבת, מידע על זמני כניסת ויציאת השבת במקום, ורשימת בתי כנסת ומקווים קרובים במרחק הליכה. קראו את המדריך המלא לקבלת דירוג 5 כוכבים מכל אורח."
        : "Successful Shabbat hosting is all in the details. Shabbat renters deeply appreciate a backup mechanical key, clear instructions for pre-set Shabbat timers, candle lighting times, and a list of walk-to synagogues and Mikvaot nearby. Read our complete host guide to maintain 5-star reviews.",
      category: "tips",
      categoryLabel: isHebrew ? "מדריכים וטיפים" : "Tips & Guides",
      categoryColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      date: "Aug 18, 2026",
      readTime: "5 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      author: "Host Community Guild"
    },
    {
      id: 4,
      title: isHebrew ? "מתחמים חדשים נוספו: בני ברק, בית שמש וביתר עילית" : "New Neighborhood Clusters: Bnei Brak, Bet Shemesh & Beitar Illit",
      summary: isHebrew
        ? "מאות דירות איכותיות לשבתות וסופי שבוע הצטרפו לאחרונה לפלטפורמה בערים המבוקשות."
        : "Hundreds of high-quality apartments for Shabbat and weekends have joined Shabos Rent across prime demand locations.",
      content: isHebrew
        ? "אנו נרגשים להודיע על הרחבת המערך במרכז ובאזור ירושלים. עשרות דירות חדשות ומאובזרות היטב זמינות כעת להזמנה מידית עם מחירים שקופים, אפשרות להחלפת דירות (Swaps) וערבות איכות של Shabos Rent."
        : "We are thrilled to announce major expansion in central Israel and greater Jerusalem regions. Dozens of pristine, newly furnished apartments are now available for instant booking with transparent pricing, swap opportunities, and Shabos Rent quality assurance.",
      category: "community",
      categoryLabel: isHebrew ? "חדשות קהילה" : "Community News",
      categoryColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      date: "Aug 10, 2026",
      readTime: "2 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      author: "Regional Operations"
    },
    {
      id: 5,
      title: isHebrew ? "עדכון אבטחה ופרטיות: אימות זהות משתמשים כפול" : "Security & Privacy Update: Enhanced Host & Guest Verification",
      summary: isHebrew
        ? "השקנו שירות אימות זהות חדש המבטיח בטיחות מלאה לבעלי הדירות ולאורחים בעת ההזמנה."
        : "Introducing multi-factor identity verification to ensure total peace of mind for hosts and Shabbat guests.",
      content: isHebrew
        ? "בטיחות הקהילה היא בעדיפות העליונה שלנו. מעתה, כל משתמש שנרשם לפלטפורמה עובר אימות מספר טלפון וזהות אישית, מה שמבטיח שרק אורחים ומארחים מאומתים יקיימו אינטראקציה במערכת."
        : "Community trust is our highest priority. Moving forward, all platform members undergo phone verification and identity checks, ensuring only verified guests and hosts transact on Shabos Rent.",
      category: "feature",
      categoryLabel: isHebrew ? "עדכון טכנולוגי" : "Platform Feature",
      categoryColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
      date: "Aug 02, 2026",
      readTime: "3 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      author: "Security Team"
    },
    {
      id: 6,
      title: "שירות החלפת דירות (Swaps) צבר מעל 1,000 החלפות מוצלחות",
      summary: isHebrew
        ? "חברי הקהילה חוסכים אלפי שקלים מדי שבת באמצעות החלפות דירות הדדיות בין ערים."
        : "Community members have saved thousands of Shekels every Shabbat through seamless apartment swaps.",
      content: isHebrew
        ? "תכונת ה-Swap של Shabos Rent חוגגת אבן דרך דרמטית. משפחות מירושלים המעוניינות לבקר בני משפחה במרכז מחליפות דירות עם משפחות מבני ברק או אשדוד - ללא תשלום שכירות!"
        : "The Shabos Rent Swap feature celebrates a major milestone. Families visiting relatives in Jerusalem swap homes with families in Bnei Brak or Ashdod—completely rent-free!",
      category: "community",
      categoryLabel: isHebrew ? "חדשות קהילה" : "Community News",
      categoryColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      date: "Jul 28, 2026",
      readTime: "4 min read",
      isPinned: false,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      author: "Community Engagement"
    }
  ];

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNews = newsList.find((item) => item.isPinned);

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedNewsIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans flex flex-col justify-between">
      <div>
        <MainNavbar />

        {/* Hero Header */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-blue-50/50 via-white to-zinc-50 dark:from-zinc-900/80 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800/50 shadow-sm">
                <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {isHebrew ? "חדשות והודעות" : "News & Announcements"}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4 leading-tight">
                {isHebrew ? "חדשות ועדכוני פלטפורמה" : "Shabos Rent Newsroom"}
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
                {isHebrew
                  ? "כל העדכונים, ההודעות הרשמיות, המדריכים והחדשות האחרונות מקהילת Shabos Rent."
                  : "Stay connected with community announcements, Shabbat hosting guides, technology updates, and seasonal news."}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHebrew ? "חפש בחדשות..." : "Search news articles, guides, updates..."}
                  className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-12 md:py-16">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#4c55a4] text-white shadow-md shadow-indigo-500/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured Hero Article (if pinned and no search active) */}
          {pinnedNews && !searchQuery && activeCategory === "all" && (
            <div className="mb-16">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
                {isHebrew ? "כתבה מומלצת" : "Featured Announcement"}
              </div>

              <div
                onClick={() => setSelectedNews(pinnedNews)}
                className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 relative h-72 lg:h-full min-h-[320px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={pinnedNews.image}
                    alt={pinnedNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${pinnedNews.categoryColor}`}>
                    {pinnedNews.categoryLabel}
                  </span>
                </div>

                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {pinnedNews.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {pinnedNews.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4 leading-snug">
                      {pinnedNews.title}
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-6">
                      {pinnedNews.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-bold text-zinc-500">{pinnedNews.author}</span>
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>{isHebrew ? "קרא בהרחבה" : "Read Full Story"}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          <div className="mb-16">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              {isHebrew ? "כל הכתבות והעדכונים" : "All Articles & Updates"} ({filteredNews.length})
            </h3>

            {filteredNews.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <Search className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  {isHebrew ? "לא נמצאו כתבות" : "No news items found"}
                </h4>
                <p className="text-sm text-zinc-500">
                  {isHebrew ? "נסה לחפש מילות מפתח אחרות." : "Try adjusting your search query or category filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((news) => {
                  const isSaved = savedNewsIds.includes(news.id);
                  return (
                    <article
                      key={news.id}
                      onClick={() => setSelectedNews(news)}
                      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${news.categoryColor}`}>
                            {news.categoryLabel}
                          </span>
                          <button
                            onClick={(e) => toggleSave(news.id, e)}
                            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-md backdrop-blur-sm"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" : ""}`} />
                          </button>
                        </div>

                        <div className="p-6">
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

                          <h4 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 leading-snug">
                            {news.title}
                          </h4>

                          <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm line-clamp-3 leading-relaxed">
                            {news.summary}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        <span>{isHebrew ? "קרא כתבה" : "Read Article"}</span>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Newsletter Box */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#4c55a4] text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-white">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {isHebrew ? "הירשם לעדכוני חדשות שבת" : "Stay Updated with Shabos Rent News"}
              </h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                {isHebrew 
                  ? "קבל עדכוני דירות פנויות לשבת, הודעות חגים ומבצעים בלעדיים ישירות למייל."
                  : "Get seasonal booking announcements, Shabbat hosting guides, and platform updates delivered to your inbox."}
              </p>

              {isSubscribed ? (
                <div className="p-4 rounded-xl bg-white/20 text-white font-bold text-sm inline-flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{isHebrew ? "תודה! נרשמת בהצלחה לעדכונים." : "Thank you! You are subscribed to updates."}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                  <input
                    required
                    type="email"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    placeholder={isHebrew ? "הכנס כתובת מייל..." : "Enter your email address..."}
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-zinc-900 text-sm outline-none shadow-md"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-sm transition-colors shadow-md shrink-0"
                  >
                    {isHebrew ? "הרשם" : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Modal Detail View */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800 relative p-6 md:p-8">
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${selectedNews.categoryColor}`}>
                  {selectedNews.categoryLabel}
                </span>
              </div>

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

              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 leading-tight">
                {selectedNews.title}
              </h2>

              <div className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed space-y-4 mb-8">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg border-l-4 border-blue-600 rtl:border-r-4 rtl:border-l-0 pl-4 rtl:pr-4 py-1">
                  {selectedNews.summary}
                </p>
                <p>{selectedNews.content}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => alert(isHebrew ? "הקישור הועתק ללוח" : "Link copied to clipboard!")}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {isHebrew ? "שתף כתבה" : "Share"}
                </button>

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
      </div>

      <MainFooter />
    </div>
  );
}
