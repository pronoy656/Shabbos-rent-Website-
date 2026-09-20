"use client";

import { useState, useMemo } from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import MainFooter from "@/components/layout/MainFooter";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Megaphone, 
  Search, 
  Calendar, 
  Bookmark, 
  Share2, 
  X, 
  ArrowRight,
  User,
  Check,
  FileText,
  Users,
  TrendingUp,
  ShieldCheck,
  Eye,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { showToast } from "@/utils/toast";
import { useNewsList } from "@/hooks/useNews";
import type { NewsArticle } from "@/types/news.types";

interface DisplayNewsItem {
  id: string | number;
  title: string;
  summary: string;
  content: string;
  category: "all" | "notice" | "feature" | "tips" | "community" | "security" | "trending";
  categoryLabel: string;
  date: string;
  readTime: string;
  views?: string | number;
  image: string;
  author: string;
  authorRole: string;
}

// Default Fallback Articles in case API database is empty initially
const fallbackArticles: DisplayNewsItem[] = [
  {
    id: "fb-1",
    title: "High Holiday & Shabbat Booking Guidelines 2026",
    summary: "Everything you need to know about early bookings for Shabbat, Rosh Hashanah, and Sukkot with guaranteed kosher standards.",
    content: "Ahead of the upcoming busy High Holidays and Shabbat seasons, Shabos Rent is proud to launch our upgraded verification protocol. All listings enrolled for the upcoming season undergo strict kitchen kosher verification, Shabbat hot plates, compliant water urns, and mechanical Shabbat key-locks. We strongly advise booking at least 3 weeks in advance to secure prime walk-to-synagogue locations.",
    category: "notice",
    categoryLabel: "OFFICIAL NOTICE",
    date: "May 1, 2026",
    readTime: "5 min read",
    views: "12.5K views",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
    author: "Shabos Rent Team",
    authorRole: "Official Announcement",
  },
  {
    id: "fb-2",
    title: "Voice Hotline Booking Service Expanded for Smoother Planning",
    summary: "You can now enjoy availability, request changes, and book Shabbat rentals easily via our interactive voice hotline.",
    content: "To make our platform accessible to everyone in the community, we have officially rolled out the Shabos Rent Voice Hotline. Callers can search kosher accommodations, verify Shabbat appliance equipment, and confirm bookings 24/6 without requiring computer access.",
    category: "feature",
    categoryLabel: "GUIDE",
    date: "Apr 30, 2026",
    readTime: "4 min read",
    views: "8.2K views",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    author: "Tech & Product Dept.",
    authorRole: "Product Team",
  },
  {
    id: "fb-3",
    title: "Host Masterclass: Preparing Your Apartment for Shabbat Guests",
    summary: "Practical tips on cleaning, setup, and creating a warm, inviting space with all necessary Shabbat essentials.",
    content: "Successful Shabbat hosting is all in the details. Shabbat renters deeply appreciate a backup mechanical key, timers pre-set for hallway lights, kosher salt, and clear instructions for the warming plate and hot water urn.",
    category: "tips",
    categoryLabel: "TIPS & GUIDES",
    date: "Apr 28, 2026",
    readTime: "6 min read",
    views: "9.4K views",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    author: "Host Guide Advisory",
    authorRole: "Host Guild",
  },
  {
    id: "fb-4",
    title: "New Neighborhood Clusters Go Live: Find the Best Fit",
    summary: "We've launched 5 new neighborhood clusters to help you discover Shabbat-friendly stays in the perfect location.",
    content: "We are thrilled to announce major expansion in central Israel and greater Jerusalem regions. Find vetted kosher apartments within steps of major synagogues, minyanim, and kosher bakeries.",
    category: "community",
    categoryLabel: "COMMUNITY NEWS",
    date: "Apr 25, 2026",
    readTime: "7 min read",
    views: "5.1K views",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    author: "Regional Operations",
    authorRole: "Expansion Team",
  },
  {
    id: "fb-5",
    title: "Security & Privacy Update: Enhanced Host & Guest Verification",
    summary: "We've upgraded verification and privacy protocols to ensure a safer and more trusted community.",
    content: "Community trust is our highest priority. Moving forward, all platform members undergo phone verification and identity checks to safeguard all home bookings.",
    category: "security",
    categoryLabel: "SECURITY",
    date: "Apr 22, 2026",
    readTime: "4 min read",
    views: "6.8K views",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    author: "Security Team",
    authorRole: "Safety Guild",
  },
  {
    id: "fb-6",
    title: "Shabbat Apartment Swaps Pass 1,000 Successful Matches",
    summary: "Our community apartment swap initiative has reached a major milestone—over 1,000 successful swaps!",
    content: "The Shabos Rent Swap feature celebrates a major milestone. Families visiting relatives in Jerusalem swap homes completely rent-free with fellow vetted community members.",
    category: "community",
    categoryLabel: "COMMUNITY PORTFOLIO",
    date: "Apr 18, 2026",
    readTime: "6 min read",
    views: "14.2K views",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    author: "Community Portfolio",
    authorRole: "Community Manager",
  },
  {
    id: "fb-7",
    title: "Behind the Scenes: How We Ensure Kosher Standards",
    summary: "A closer look at our verification process, partnerships, and commitment to quality.",
    content: "Every Shabbat listing undergoes rigorous checks to confirm kitchen kosher status, urns, plates, and key-lock compliance.",
    category: "feature",
    categoryLabel: "FEATURE",
    date: "Apr 15, 2026",
    readTime: "5 min read",
    views: "11.3K views",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&q=80",
    author: "Quality & Standards",
    authorRole: "Verification Team",
  },
];

export default function NewsPage() {
  const { language } = useLanguage();
  const isHebrew = language === "HE";

  const [selectedNews, setSelectedNews] = useState<DisplayNewsItem | null>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch Live Articles from Backend API
  const { data: apiResponse, isLoading, isError, refetch } = useNewsList();

  const categories = [
    { id: "all", label: isHebrew ? "כל העדכונים" : "All News" },
    { id: "notice", label: isHebrew ? "הודעות רשמיות" : "Official Notices" },
    { id: "tips", label: isHebrew ? "מדריכים וטיפים" : "Guides & Tips" },
    { id: "community", label: isHebrew ? "חדשות קהילה" : "Community Stories" },
    { id: "feature", label: isHebrew ? "עדכוני פלטפורמה" : "Features" },
    { id: "trending", label: isHebrew ? "פופולרי" : "Trending" },
  ];

  // Map API response to DisplayNewsItem format
  const displayArticles: DisplayNewsItem[] = useMemo(() => {
    const rawList = apiResponse?.data;
    if (Array.isArray(rawList) && rawList.length > 0) {
      // Filter published articles for the public
      const published = rawList.filter((item) => item.isPublished !== false);
      if (published.length > 0) {
        return published.map((item: NewsArticle, idx: number) => {
          let formattedDate = "Recent";
          if (item.createdAt) {
            try {
              formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } catch {
              formattedDate = item.createdAt;
            }
          }

          // Assign category based on title or default
          const titleLower = (item.title || "").toLowerCase();
          let category: DisplayNewsItem["category"] = "notice";
          let categoryLabel = "OFFICIAL NOTICE";

          if (titleLower.includes("guide") || titleLower.includes("tip") || titleLower.includes("host")) {
            category = "tips";
            categoryLabel = "TIPS & GUIDES";
          } else if (titleLower.includes("community") || titleLower.includes("swap") || titleLower.includes("ambassador")) {
            category = "community";
            categoryLabel = "COMMUNITY NEWS";
          } else if (titleLower.includes("feature") || titleLower.includes("update") || titleLower.includes("voice")) {
            category = "feature";
            categoryLabel = "PLATFORM FEATURE";
          } else if (titleLower.includes("security") || titleLower.includes("privacy")) {
            category = "security";
            categoryLabel = "SECURITY";
          }

          return {
            id: item.id || `api-${idx}`,
            title: item.title,
            summary: item.summary || item.content?.slice(0, 160) || "",
            content: item.content || item.summary || "",
            category,
            categoryLabel,
            date: formattedDate,
            readTime: `${Math.max(2, Math.ceil((item.content?.length || 200) / 250))} min read`,
            views: item.views ? `${item.views} views` : undefined,
            image: item.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
            author: item.author || "ShabbosRent Team",
            authorRole: "Official Announcement",
          };
        });
      }
    }
    return fallbackArticles;
  }, [apiResponse]);

  // Filtered by Search & Category
  const filteredArticles = useMemo(() => {
    return displayArticles.filter((article) => {
      // Category match
      if (activeCategory !== "all" && article.category !== activeCategory) {
        return false;
      }
      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q)
      );
    });
  }, [displayArticles, activeCategory, searchQuery]);

  // Sections
  const heroStory = filteredArticles[0] || displayArticles[0];
  const editorsPicks = filteredArticles.length >= 3 
    ? filteredArticles.slice(0, 3) 
    : displayArticles.slice(0, 3);
  const latestArticles = filteredArticles.length > 3 
    ? filteredArticles.slice(3) 
    : filteredArticles.length > 0 
      ? filteredArticles 
      : fallbackArticles.slice(3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setIsSubscribed(true);
      showToast({
        title: "Subscribed Successfully! 🎉",
        message: "You are now subscribed to Shabos Rent newsletter updates.",
        type: "favorite"
      });
    }
  };

  const toggleSave = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedNewsIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = (news: DisplayNewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast({
        title: "Link Copied! 📋",
        message: `Article link copied to clipboard.`,
        type: "info"
      });
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950 font-sans flex flex-col justify-between selection:bg-[#1b365d]/20 selection:text-[#1b365d]">
      <div>
        <MainNavbar />

        {/* Hero Section (2-Column Banner) */}
        <section className="pt-10 pb-12 md:pt-14 md:pb-16 bg-[#f1f5f9] dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Headline, Subtitle, Search, Stats */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Small Top Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[11px] uppercase tracking-wider mb-5 shadow-xs">
                    <Megaphone className="w-3.5 h-3.5 text-[#1b365d] dark:text-indigo-400" />
                    <span>OFFICIAL SHABOS RENT NEWSROOM</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-[1.12] mb-4">
                    Stories that <br />
                    Inspire. Community <br />
                    that Connects.
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md font-normal leading-relaxed mb-6">
                    Your source for official updates, expert guides, community stories, and everything Shabos Rent.
                  </p>

                  {/* Search Bar Input Pill */}
                  <div className="relative max-w-md mb-8">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles, guides, announcements..."
                      className="w-full pl-5 pr-14 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 shadow-sm focus:outline-none text-xs sm:text-sm font-medium transition-all"
                    />
                    <button
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-none">
                        {displayArticles.length}+
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">Articles Published</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-none">100K+</div>
                      <div className="text-[10px] text-zinc-500 font-medium">Verified Community</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-none">12K+</div>
                      <div className="text-[10px] text-zinc-500 font-medium">Weekly Readers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-none">Verified</div>
                      <div className="text-[10px] text-zinc-500 font-medium">Trusted Updates</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Announcement Big Dark Card */}
              <div className="lg:col-span-6 flex">
                {heroStory && (
                  <div
                    onClick={() => setSelectedNews(heroStory)}
                    className="group relative w-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-end p-8 md:p-10 min-h-[420px] bg-zinc-900"
                  >
                    {/* Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroStory.image}
                      alt={heroStory.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Content Over Background */}
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                        <span className="text-white bg-blue-600/80 px-2 py-0.5 rounded">FEATURED</span>
                        <span>•</span>
                        <span>{heroStory.date}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight group-hover:text-amber-200 transition-colors">
                        {heroStory.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed max-w-xl font-normal">
                        {heroStory.summary}
                      </p>

                      <div className="pt-4 flex items-center justify-between border-t border-white/15">
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                          <User className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="font-bold text-white leading-none">{heroStory.author}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{heroStory.authorRole}</p>
                          </div>
                        </div>

                        <button className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform cursor-pointer">
                          <span>Read Full Story</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Filter Navigation Bar */}
        <section className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3 sticky top-0 z-20 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-3 shrink-0">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0f172a] text-white shadow-sm"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isLoading && (
                  <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Updating...
                  </span>
                )}
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#0f172a] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span>Browse All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 max-w-7xl py-12 md:py-16 space-y-16">
          
          {/* Section 1: Editor's Picks (3 Column Cards) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-[#0f172a] dark:text-white tracking-tight">
                  Editor&apos;s Picks
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  The most important stories, curated for the community.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Pick 1 (Wide 50% Card) */}
              {editorsPicks[0] && (
                <div
                  onClick={() => setSelectedNews(editorsPicks[0])}
                  className="lg:col-span-6 group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer min-h-[360px] flex flex-col justify-end p-7 bg-zinc-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editorsPicks[0].image}
                    alt={editorsPicks[0].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {editorsPicks[0].categoryLabel}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-snug group-hover:text-amber-200 transition-colors">
                      {editorsPicks[0].title}
                    </h3>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                      {editorsPicks[0].summary}
                    </p>

                    <div className="pt-3 flex items-center justify-between border-t border-white/15">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {editorsPicks[0].date} • {editorsPicks[0].readTime}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pick 2 (25% Card) */}
              {editorsPicks[1] && (
                <div
                  onClick={() => setSelectedNews(editorsPicks[1])}
                  className="lg:col-span-3 group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer min-h-[360px] flex flex-col justify-end p-6 bg-zinc-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editorsPicks[1].image}
                    alt={editorsPicks[1].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {editorsPicks[1].categoryLabel}
                    </span>

                    <h3 className="text-lg font-serif font-extrabold text-white leading-snug group-hover:text-purple-200 transition-colors line-clamp-2">
                      {editorsPicks[1].title}
                    </h3>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                      {editorsPicks[1].summary}
                    </p>

                    <div className="pt-3 flex items-center justify-between border-t border-white/15">
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {editorsPicks[1].date} • {editorsPicks[1].readTime}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pick 3 (25% Card) */}
              {editorsPicks[2] && (
                <div
                  onClick={() => setSelectedNews(editorsPicks[2])}
                  className="lg:col-span-3 group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer min-h-[360px] flex flex-col justify-end p-6 bg-zinc-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editorsPicks[2].image}
                    alt={editorsPicks[2].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {editorsPicks[2].categoryLabel}
                    </span>

                    <h3 className="text-lg font-serif font-extrabold text-white leading-snug group-hover:text-emerald-200 transition-colors line-clamp-2">
                      {editorsPicks[2].title}
                    </h3>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                      {editorsPicks[2].summary}
                    </p>

                    <div className="pt-3 flex items-center justify-between border-t border-white/15">
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {editorsPicks[2].date} • {editorsPicks[2].readTime}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Section 2: Latest Articles & Updates (2x2 Horizontal Cards) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-[#0f172a] dark:text-white tracking-tight">
                  Latest Articles & Updates
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Stay informed with all real-time news and stories.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setSelectedNews(article)}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer grid grid-cols-12 items-stretch"
                >
                  {/* Left Side Image (35%) */}
                  <div className="col-span-4 relative h-full min-h-[140px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Right Side Content (65%) */}
                  <div className="col-span-8 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1.5">
                        {article.categoryLabel}
                      </span>

                      <h4 className="font-serif font-extrabold text-sm md:text-base text-[#0f172a] dark:text-white group-hover:text-[#1b365d] dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-1.5">
                        {article.title}
                      </h4>

                      <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal mb-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Section 3: Stay in the Loop (Newsletter Box) */}
          <section className="rounded-3xl bg-[#071328] text-white p-8 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Geometric dark pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Side Content */}
              <div className="max-w-xl text-left rtl:text-right space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Stay in the Loop
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-normal">
                  Get the latest updates, guides, and community stories delivered straight to your inbox.
                </p>
              </div>

              {/* Right Side Form */}
              {isSubscribed ? (
                <div className="px-5 py-3 rounded-xl bg-white/10 text-emerald-300 font-bold text-xs flex items-center gap-2 border border-emerald-500/30">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! You are subscribed to newsletter updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <input
                    required
                    type="email"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 text-xs font-medium outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-zinc-950 font-extrabold text-xs transition-all hover:brightness-110 shadow-md cursor-pointer shrink-0"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </section>

        </main>

        {/* Article Detail Reader Modal */}
        {selectedNews && (
          <div 
            onClick={() => setSelectedNews(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 dark:border-zinc-800 relative p-6 md:p-8 animate-in zoom-in-95 duration-200"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Banner Image */}
              <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-md shadow-md bg-zinc-900 text-white">
                  {selectedNews.categoryLabel}
                </span>
              </div>

              {/* Author & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{selectedNews.author}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">{selectedNews.authorRole} • {selectedNews.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleSave(selectedNews.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedNewsIds.includes(selectedNews.id) ? "fill-[#1b365d] text-[#1b365d]" : ""}`} />
                    <span>{savedNewsIds.includes(selectedNews.id) ? "Saved" : "Save Story"}</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(selectedNews, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b365d] hover:bg-[#132744] text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied!" : "Share Link"}</span>
                  </button>
                </div>
              </div>

              {/* Title & Full Content */}
              <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-[#0f172a] dark:text-white mb-4 leading-snug">
                {selectedNews.title}
              </h2>

              <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-4">
                {selectedNews.summary && (
                  <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 border-l-4 rtl:border-r-4 rtl:border-l-0 border-amber-500 pl-3.5 rtl:pr-3.5 py-1 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-xl">
                    {selectedNews.summary}
                  </p>
                )}
                <p className="pt-2 whitespace-pre-line">
                  {selectedNews.content}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Article
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
