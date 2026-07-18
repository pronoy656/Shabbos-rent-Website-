"use client";

import { ExternalLink, Sparkles, BadgeCheck } from "lucide-react";

const ads = [
  {
    id: 1,
    sponsor: "Rehavia Estates",
    verified: true,
    badge: "Sponsored",
    headline: "Luxury Shabbos Stay in Rehavia",
    sub: "Steps from the Great Synagogue · Kosher Kitchen · Private Garden",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    cta: "View Listing",
    link: "/apartments/1",
    accent: "from-[#4c55a4] to-blue-500",
  },
  {
    id: 2,
    sponsor: "TelAviv Premium",
    verified: true,
    badge: "Featured",
    headline: "Neve Tzedek — Penthouse with Sea View",
    sub: "Fully Equipped · 4 Beds · Walking Distance to Shul",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
    cta: "Book Now",
    link: "/apartments/2",
    accent: "from-amber-500 to-orange-400",
  },
  {
    id: 3,
    sponsor: "Jerusalem Homes",
    verified: false,
    badge: "New",
    headline: "Jewish Quarter — Family Apartment near Kotel",
    sub: "3 Beds · Mehadrin Kitchen · Shabbos Elevator",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    cta: "See Details",
    link: "/apartments/3",
    accent: "from-emerald-500 to-teal-400",
  },
];

export default function AdSection() {
  return (
    <div className="container mx-auto px-4 mt-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Sponsored Listings
          </span>
        </div>
        <a href="/search" className="text-xs text-[#4c55a4] hover:underline font-semibold">
          View all listings →
        </a>
      </div>

      {/* Ad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <a
            key={ad.id}
            href={ad.link}
            className="group relative rounded-2xl overflow-hidden block shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ad.image}
              alt={ad.headline}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold text-white bg-gradient-to-r ${ad.accent} shadow-md`}>
                {ad.badge}
              </span>
            </div>

            {/* Sponsored label */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full">
              {ad.verified && <BadgeCheck className="w-3 h-3 text-blue-400" />}
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Ad</span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-5 pt-16 h-52 flex flex-col justify-end">
              <p className="text-xs text-white/60 font-semibold mb-1 uppercase tracking-wider">{ad.sponsor}</p>
              <h3 className="text-base font-extrabold text-white leading-snug mb-1.5 line-clamp-2">
                {ad.headline}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-1">{ad.sub}</p>
              <span className={`inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${ad.accent} shadow-md group-hover:shadow-lg transition-all`}>
                {ad.cta} <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
