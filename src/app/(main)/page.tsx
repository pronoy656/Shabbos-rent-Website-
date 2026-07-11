import MainNavbar from "@/components/layout/MainNavbar";
import SearchWidget from "@/components/home/SearchWidget";
import Features from "@/components/home/Features";
import FAQSection from "@/components/home/FAQSection";
import { ArrowRightLeft, Navigation, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-24 md:pt-20 md:pb-36 overflow-hidden">
        
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-white dark:bg-zinc-950">
          <div className="w-full h-full relative">
            <img 
              src="/ChatGPT%20Image%20Jul%2010,%202026,%2002_11_20%20AM.png" 
              alt="Hero Background" 
              className="w-full h-full object-cover object-center md:object-right"
            />
          </div>
          {/* Gradient to fade from solid white on the left, to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 w-full md:w-[70%]"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-[3.5rem] md:text-6xl lg:text-[4rem] leading-[1.1] font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Find. Stay. Enjoy <br />
              Your Perfect <span className="text-[#4c55a4]">Shabbos.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed mb-10 max-w-xl">
              Experience the ultimate convenience for Shabbos and Yom Tov. 
              Seamlessly <strong className="font-bold text-zinc-900 dark:text-white">Swap</strong> apartments or find the perfect rental with our unique <strong className="font-bold text-zinc-900 dark:text-white">Walking Distance</strong> search.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <ArrowRightLeft className="w-4 h-4 text-[#4c55a4]" />
                Rent or Swap
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <Navigation className="w-4 h-4 text-[#4c55a4]" />
                Walking Distance Search
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#4c55a4]" />
                Trusted Community
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget Component (Overlaps the hero bottom) */}
      <div className="px-4 pb-20">
        <SearchWidget />
      </div>

      <FAQSection />
    </div>
  );
}
