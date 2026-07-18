"use client";

import { Home, ShieldCheck, Heart, MapPin, Users, Building, ArrowRight } from "lucide-react";
import Link from "next/link";
import MainNavbar from "@/components/layout/MainNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[60vh] pt-20 pb-32">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80" 
              alt="About ShabbosRent Background" 
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-zinc-900/60 dark:bg-zinc-950/70" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 mt-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Connecting Communities, <br /> 
              <span className="text-blue-400">One Shabbos at a Time.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 drop-shadow-md">
              ShabbosRent is the premier platform designed specifically for the Jewish community, making it easy to find and swap Kosher-friendly apartments for Shabbat and Yom Tov.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <Link href="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Find an Apartment <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Kosher Verified</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Rest assured knowing every apartment meets community standards for kashrut and Shabbat observance.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Community First</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Built by the community, for the community. We prioritize trust, safety, and shared values above all.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Prime Locations</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Find places within walking distance to local shuls, mikvahs, and kosher eateries effortlessly.</p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 mt-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Traveling for Shabbat or Yom Tov often comes with unique challenges—finding a place with a kosher kitchen, ensuring you're within the eruv, and being close to a shul. We experienced these challenges firsthand.
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                That's why we built ShabbosRent. Our mission is to seamlessly connect families who want to experience different communities without compromising on their religious standards. Whether you're looking to rent for a weekend getaway or swap apartments to save costs, our platform provides a trusted environment to make it happen.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-black text-[#4c55a4] dark:text-indigo-400 mb-2">1,000+</div>
                  <div className="text-sm font-semibold text-zinc-500">Happy Families</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[#4c55a4] dark:text-indigo-400 mb-2">50+</div>
                  <div className="text-sm font-semibold text-zinc-500">Global Communities</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200" alt="Beautiful apartment interior" className="w-full h-full object-cover aspect-[4/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-white w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">A</div>
                      <div>
                        <p className="font-bold">Avraham & Sarah</p>
                        <p className="text-xs text-white/80">Jerusalem Hosts</p>
                      </div>
                    </div>
                    <p className="text-sm italic">"ShabbosRent has completely transformed how we travel for Yom Tov."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
