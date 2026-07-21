import Link from "next/link";
import { Home, ArrowRight, Star, Users, ShieldCheck, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CTABanner() {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "2,400+", label: t("cta.stats.happy_families") },
    { icon: Star, value: "4.9", label: t("cta.stats.avg_rating") },
    { icon: ShieldCheck, value: "100%", label: t("cta.stats.verified_owners") },
    { icon: TrendingUp, value: "₪3,200", label: t("cta.stats.avg_earn") },
  ];

  return (
    <section className="py-16 bg-white dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-[#4c55a4]/20">

          {/* Background gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a4292] via-[#4c55a4] to-[#6b75c9]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.2)_0%,_transparent_60%)]" />

          {/* Floating decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Dotted grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-14 md:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left: Text */}
              <div className="max-w-xl text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-6">
                  <Home className="w-3.5 h-3.5" />
                  {t("cta.badge")}
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  {t("cta.title1")}{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">{t("cta.title2")}</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-white/20 rounded-full -z-0" />
                  </span>
                </h2>

                <p className="text-indigo-100 text-base md:text-lg leading-relaxed mb-8">
                  {t("cta.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/user-dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 text-[#4c55a4] font-extrabold rounded-2xl transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 text-sm"
                  >
                    {t("cta.btn_list")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all text-sm backdrop-blur-sm"
                  >
                    {t("cta.btn_browse")}
                  </Link>
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2 w-36 h-32 bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl backdrop-blur-sm transition-all"
                  >
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <s.icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                    </div>
                    <span className="text-2xl font-extrabold text-white leading-none">{s.value}</span>
                    <span className="text-xs text-indigo-200 font-semibold text-center leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
