"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Users2, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdvertisements, useRecordAdvertisementClick } from "@/hooks/useAdvertisement";

export default function PartnerAds() {
  const { t } = useLanguage();
  const { data: adsResponse, isLoading } = useAdvertisements({ position: "HOME_MIDDLE", isActive: true });
  const { mutate: recordClick } = useRecordAdvertisementClick();
  
  const partnerAds = adsResponse?.data || [];

  const GAP = 16;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 768) setVisible(2);
      else if (window.innerWidth < 1024) setVisible(3);
      else setVisible(4);
    };
    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(0, partnerAds.length - visible);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, totalSlides));
    setCurrentIndex(clamped);
    if (trackRef.current && containerRef.current) {
      const cardWidth = (containerRef.current.offsetWidth - GAP * (visible - 1)) / visible;
      trackRef.current.style.transform = `translateX(-${clamped * (cardWidth + GAP)}px)`;
    }
  };

  if (!isLoading && partnerAds.length === 0) {
    return null; // Don't show the section if no ads exist
  }

  return (
    <section className="py-16 bg-white dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
            <Users2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">{t("partner_ads.our_partners")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            {t("partner_ads.special_offers")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {t("partner_ads.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c55a4]"></div>
          </div>
        ) : (
          <>
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
                  {partnerAds.map((ad, idx) => (
                    <a
                      key={ad.id}
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordClick(ad.id)}
                      className="relative flex-none rounded-3xl overflow-hidden group"
                      style={{
                        width: `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`,
                        minHeight: 340,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ad.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"}
                        alt={ad.companyName}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 ${idx % 2 === 0 ? "bg-zinc-900/70" : "bg-white/70"} backdrop-blur-[1px]`} />

                      <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: 340 }}>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className={`text-[12px] font-extrabold uppercase tracking-widest leading-none ${idx % 2 === 0 ? "text-white/80" : "text-zinc-600"}`}>
                              {ad.companyName}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className={`text-xl font-extrabold leading-snug mb-2 ${idx % 2 === 0 ? "text-white" : "text-zinc-900"}`}>
                            {ad.title}
                          </h3>
                          {ad.subtitle && (
                            <p className={`text-sm mb-4 leading-relaxed ${idx % 2 === 0 ? "text-white/70" : "text-zinc-600"}`}>
                              {ad.subtitle}
                            </p>
                          )}
                          <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group-hover:gap-3 shadow-md ${
                            idx % 2 === 0 ? "bg-white text-zinc-900" : "bg-[#4c55a4] text-white"
                          }`}>
                            View Offer <ExternalLink className="w-4 h-4" />
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
            {totalSlides > 0 && (
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
            )}
          </>
        )}
      </div>
    </section>
  );
}
