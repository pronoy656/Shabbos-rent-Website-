import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PopularCities() {
  const { t } = useLanguage();
  const cities = [
    { name: t("search_widget.jerusalem"), query: "jerusalem", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop" },
    { name: t("popular_cities.bnei_brak"), query: "bnei-brak", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" },
    { name: t("search_widget.tzfat"), query: "tzfat", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
    { name: t("popular_cities.beit_shemesh"), query: "beit-shemesh", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop" },
    { name: t("popular_cities.modiin_illit"), query: "modiin-illit", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <section className="container mx-auto px-4 pb-20 font-sans">
      <div className="relative mb-8 text-center flex flex-col items-center justify-center min-h-[60px]">
        <h2 className="text-[32px] font-extrabold text-[#0B1536] dark:text-white mb-1 tracking-tight">{t("popular_cities.title")}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t("popular_cities.subtitle")}</p>
        <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
          <Link href="/search" className="px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-[#4c55a4] dark:text-indigo-400 text-sm font-bold bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm">
            {t("popular_cities.view_all")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
        {cities.map((city, idx) => (
          <Link key={idx} href={`/search?city=${city.query}`} className="group relative h-[240px] rounded-[20px] overflow-hidden block bg-transparent p-[3px]">
            {/* Animated Border Background (Visible on Hover) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#8b5cf6_33%,#ec4899_66%,#e4e4e7_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#27272a_0%,#8b5cf6_33%,#ec4899_66%,#27272a_100%)]" />
            </div>
            
            {/* Inner Content Container */}
            <div className="relative w-full h-full rounded-[17px] overflow-hidden z-10 bg-zinc-100 dark:bg-zinc-900">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1536]/90 via-[#0b1536]/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight drop-shadow-sm">{city.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-[#4c55a4]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
