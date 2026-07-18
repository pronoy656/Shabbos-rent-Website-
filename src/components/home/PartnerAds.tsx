"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, Users2 } from "lucide-react";

const partnerAds = [
  {
    id: 1,
    partner: "Home Style Furniture",
    partnerIcon: "🛋️",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    headline: "Make Your Shabbos Stay Even More Comfortable",
    sub: "Up to 20% off on premium furniture rentals.",
    cta: "Explore Now",
    link: "#",
    dark: true,
    features: [],
    badge: "",
  },
  {
    id: 2,
    partner: "Mizrachi Transport",
    partnerIcon: "🚗",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    headline: "Airport Transfers",
    sub: "Reliable rides to and from the airport.",
    cta: "Book Your Ride",
    link: "#",
    dark: true,
    features: ["Professional Drivers", "24/7 Availability", "Fixed Prices"],
    badge: "",
  },
  {
    id: 3,
    partner: "Bakery House",
    partnerIcon: "🥐",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80",
    headline: "Fresh. Local. For Shabbos.",
    sub: "Order delicious homemade meals, challah & more.",
    cta: "Order Now",
    link: "#",
    dark: false,
    features: [],
    badge: "10% OFF\nOn your first order",
  },
  {
    id: 4,
    partner: "Community Care",
    partnerIcon: "🫶",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80",
    headline: "We Care For Your Peace of Mind",
    sub: "Housekeeping & cleaning services you can trust.",
    cta: "Learn More",
    link: "#",
    dark: false,
    features: ["Deep Cleaning", "Before Your Arrival", "After Your Stay"],
    badge: "",
  },
  {
    id: 5,
    partner: "Shabbos Catering",
    partnerIcon: "🍽️",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    headline: "Full Shabbos Meal Packages",
    sub: "Delivered fresh to your rental. Mehadrin certified.",
    cta: "Order Meals",
    link: "#",
    dark: true,
    features: ["Mehadrin Certified", "Friday Delivery", "Full Menu"],
    badge: "",
  },
  {
    id: 6,
    partner: "Jerusalem Tours",
    partnerIcon: "🕌",
    image: "https://images.unsplash.com/photo-1586699253884-e199770f63b9?w=800&q=80",
    headline: "Explore the Holy City",
    sub: "Guided Motzei Shabbos walking tours of the Old City.",
    cta: "Book a Tour",
    link: "#",
    dark: true,
    features: [],
    badge: "FREE\nFirst Session",
  },
];

const GAP = 16;
const VISIBLE = 4;

export default function PartnerAds() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = partnerAds.length - VISIBLE;

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, totalSlides));
    setCurrentIndex(clamped);
    if (trackRef.current && containerRef.current) {
      const cardWidth = (containerRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE;
      trackRef.current.style.transform = `translateX(-${clamped * (cardWidth + GAP)}px)`;
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
            <Users2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Our Partners</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            Special Offers &amp; Local Deals
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Exclusive discounts and services from trusted partners for our community.
          </p>
        </div>

        {/* Carousel Row: arrows + slides side-by-side */}
        <div className="flex items-center gap-4">

          {/* LEFT ARROW */}
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-lg flex items-center justify-center text-zinc-600 dark:text-white
                       disabled:opacity-25 disabled:cursor-not-allowed
                       hover:enabled:bg-[#4c55a4] hover:enabled:border-[#4c55a4] hover:enabled:text-white hover:enabled:shadow-xl hover:enabled:-translate-x-0.5
                       transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* SLIDES */}
          <div ref={containerRef} className="flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ gap: `${GAP}px` }}
            >
              {partnerAds.map((ad) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  className="relative flex-none rounded-3xl overflow-hidden group"
                  style={{
                    width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})`,
                    minHeight: 340,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.image}
                    alt={ad.partner}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${ad.dark ? "bg-zinc-900/60" : "bg-white/55"} backdrop-blur-[1px]`} />

                  <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: 340 }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{ad.partnerIcon}</span>
                      <div>
                        <p className={`text-[10px] font-extrabold uppercase tracking-widest leading-none ${ad.dark ? "text-white/60" : "text-zinc-500"}`}>
                          {ad.partner.split(" ")[0]}
                        </p>
                        <p className={`text-[10px] font-extrabold uppercase tracking-widest leading-none ${ad.dark ? "text-white/60" : "text-zinc-500"}`}>
                          {ad.partner.split(" ").slice(1).join(" ")}
                        </p>
                      </div>
                    </div>

                    <div>
                      {ad.badge && (
                        <div className="mb-3 inline-block bg-amber-400 text-zinc-900 text-xs font-extrabold px-3 py-2 rounded-xl leading-tight whitespace-pre-line">
                          {ad.badge}
                        </div>
                      )}
                      <h3 className={`text-xl font-extrabold leading-snug mb-2 ${ad.dark ? "text-white" : "text-zinc-900"}`}>
                        {ad.headline}
                      </h3>
                      <p className={`text-sm mb-3 leading-relaxed ${ad.dark ? "text-white/70" : "text-zinc-600"}`}>
                        {ad.sub}
                      </p>
                      {ad.features.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {ad.features.map((f, i) => (
                            <li key={i} className={`flex items-center gap-1.5 text-xs font-semibold ${ad.dark ? "text-white/80" : "text-zinc-700"}`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group-hover:gap-3 shadow-md ${
                        ad.dark ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"
                      }`}>
                        {ad.cta} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex >= totalSlides}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-lg flex items-center justify-center text-zinc-600 dark:text-white
                       disabled:opacity-25 disabled:cursor-not-allowed
                       hover:enabled:bg-[#4c55a4] hover:enabled:border-[#4c55a4] hover:enabled:text-white hover:enabled:shadow-xl hover:enabled:translate-x-0.5
                       transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? "w-6 h-2.5 bg-[#4c55a4]"
                  : "w-2.5 h-2.5 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
