"use client";

import { Phone, ShieldCheck, Lightbulb, Users, Globe, Clock, Mail, Headset, ArrowRight, Quote, Truck, Package } from "lucide-react";
import Link from "next/link";
import MainNavbar from "@/components/layout/MainNavbar";
import MainFooter from "@/components/layout/MainFooter";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();
  const isRtl = language === "HE";

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <MainNavbar />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 overflow-hidden">
          {/* Faint dotted background pattern (optional, mimicking the image background) */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
              
              {/* Left Content */}
              <div className="lg:w-[45%] z-20">
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider rounded-full mb-6">
                  About Us
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
                  We Deliver More <br className="hidden md:block" />
                  <span className="text-blue-600">Than Packages</span>
                </h1>
                <p className="text-[#475569] text-base md:text-lg leading-relaxed mb-8 max-w-[480px]">
                  We are a global logistics company committed to delivering your shipments safely, on time, every time. Our mission is to connect people and businesses through reliable, innovative, and efficient shipping solutions.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 text-sm">
                    <Truck className="w-4 h-4" />
                    Track Your Shipment
                  </button>
                  <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:w-[55%] relative w-full lg:-mr-10 xl:-mr-20 mt-10 lg:mt-0 pl-10 pr-4">
                {/* The angled and rounded image container */}
                <div 
                  className="relative h-[400px] md:h-[500px] lg:h-[550px] w-full overflow-hidden rounded-[40px] shadow-2xl"
                  style={{ transform: "skewX(-10deg)" }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80" 
                    alt="Logistics" 
                    className="w-[120%] max-w-none h-full object-cover"
                    style={{ transform: "skewX(10deg) translateX(-10%)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-[45%] bg-white rounded-xl p-5 shadow-2xl border border-zinc-100 flex items-center gap-4 w-[90%] max-w-[380px] z-30">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] text-[15px] leading-tight">Trusted by thousands of customers</p>
                    <p className="text-[13px] text-[#64748b] mt-0.5">to deliver what matters most.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            {/* Left Image & Quote */}
            <div className="lg:w-[45%] relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="rounded-3xl overflow-hidden h-[400px] md:h-[480px] shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" 
                  alt="Team Working" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-blue-600 p-8 rounded-2xl shadow-xl w-[260px] md:w-[280px] text-white z-10 border-4 border-white">
                <Quote className="w-8 h-8 text-white/30 mb-4 fill-white/20" />
                <p className="font-bold text-lg md:text-xl leading-snug mb-6">
                  We don't just move packages, we build connections.
                </p>
                <p className="text-white/90 text-sm font-medium">- Our Promise</p>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-[55%] mt-12 lg:mt-0">
              <span className="inline-block text-blue-600 font-bold text-[11px] uppercase tracking-wider mb-3">
                OUR MISSION
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] leading-[1.2] mb-6 tracking-tight">
                Connecting the World, <br />
                <span className="text-blue-600">One Delivery</span> at a Time
              </h2>
              <p className="text-[#475569] mb-12 leading-relaxed text-[15px] max-w-lg">
                We strive to provide world-class logistics services through technology, innovation, and a customer-first approach. Our goal is to make shipping simple, transparent, and dependable for everyone.
              </p>

              {/* 3 Columns Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="w-12 h-12 rounded-full border border-blue-100 flex items-center justify-center mb-4 bg-blue-50/50">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-[#0f172a] mb-2 text-[15px]">Reliable</h4>
                  <p className="text-[#64748b] text-[13px] leading-relaxed pr-4">
                    We deliver on our promises with consistency.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full border border-blue-100 flex items-center justify-center mb-4 bg-blue-50/50">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-[#0f172a] mb-2 text-[15px]">Innovative</h4>
                  <p className="text-[#64748b] text-[13px] leading-relaxed pr-4">
                    We use technology to create smarter logistics solutions.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full border border-blue-100 flex items-center justify-center mb-4 bg-blue-50/50">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-[#0f172a] mb-2 text-[15px]">Customer First</h4>
                  <p className="text-[#64748b] text-[13px] leading-relaxed pr-4">
                    Your satisfaction is at the heart of everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-6">
          <div className="bg-[#f8fafc] rounded-2xl py-10 px-6 border border-zinc-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 rtl:divide-x-reverse">
              
              <div className="flex items-center justify-center gap-4 px-2 pt-4 sm:pt-0 first:pt-0">
                <div className="w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-[28px] font-extrabold text-[#0f172a] leading-none mb-1">150+</div>
                  <div className="text-[11px] text-[#64748b] font-medium">Countries Served</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 px-2 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-[28px] font-extrabold text-[#0f172a] leading-none mb-1">10M+</div>
                  <div className="text-[11px] text-[#64748b] font-medium">Shipments Delivered</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 px-2 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-[28px] font-extrabold text-[#0f172a] leading-none mb-1">50K+</div>
                  <div className="text-[11px] text-[#64748b] font-medium">Happy Customers</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 px-2 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-[28px] font-extrabold text-[#0f172a] leading-none mb-1">99.8%</div>
                  <div className="text-[11px] text-[#64748b] font-medium">On-Time Delivery</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <span className="inline-block text-blue-600 font-bold text-[11px] uppercase tracking-wider mb-3">
            OUR TEAM
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            The People Behind Our Promise
          </h2>
          {/* Blue underline below title */}
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-[#475569] max-w-2xl mx-auto mb-16 leading-relaxed text-[15px]">
            Our diverse and passionate team works around the clock to ensure your shipments reach their destination safely and on time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
              <div className="pt-6 px-6 bg-gradient-to-b from-[#f8fafc] to-white h-[220px] flex items-end justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" alt="James Carter" className="w-[85%] object-cover object-top rounded-t-full" />
              </div>
              <div className="p-6 text-center bg-white">
                <h4 className="font-bold text-[#0f172a] text-[16px] mb-1">James Carter</h4>
                <p className="text-blue-600 text-[12px] font-bold mb-5">Chief Executive Officer</p>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
              <div className="pt-6 px-6 bg-gradient-to-b from-[#f8fafc] to-white h-[220px] flex items-end justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" alt="Sophia Martinez" className="w-[85%] object-cover object-top rounded-t-full" />
              </div>
              <div className="p-6 text-center bg-white">
                <h4 className="font-bold text-[#0f172a] text-[16px] mb-1">Sophia Martinez</h4>
                <p className="text-blue-600 text-[12px] font-bold mb-5">Chief Operations Officer</p>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
              <div className="pt-6 px-6 bg-gradient-to-b from-[#f8fafc] to-white h-[220px] flex items-end justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400" alt="Daniel Lee" className="w-[85%] object-cover object-top rounded-t-full" />
              </div>
              <div className="p-6 text-center bg-white">
                <h4 className="font-bold text-[#0f172a] text-[16px] mb-1">Daniel Lee</h4>
                <p className="text-blue-600 text-[12px] font-bold mb-5">Head of Technology</p>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col">
              <div className="pt-6 px-6 bg-gradient-to-b from-[#f8fafc] to-white h-[220px] flex items-end justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400" alt="Olivia Bennett" className="w-[85%] object-cover object-top rounded-t-full" />
              </div>
              <div className="p-6 text-center bg-white">
                <h4 className="font-bold text-[#0f172a] text-[16px] mb-1">Olivia Bennett</h4>
                <p className="text-blue-600 text-[12px] font-bold mb-5">Head of Customer Success</p>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="container mx-auto px-4 pb-12">
          <div className="bg-[#1d4ed8] rounded-2xl p-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/20 max-w-6xl mx-auto">
            <div className="flex items-center gap-6 text-white text-center md:text-start">
              <div className="w-[60px] h-[60px] rounded-full border border-white/30 flex items-center justify-center shrink-0 hidden sm:flex">
                <Headset className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 tracking-wide">We're Always Here to Help</h3>
                <p className="text-white/80 text-[13px]">Have questions or need support?<br className="md:hidden" /> Our team is ready to assist you 24/7.</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm w-full md:w-auto justify-center shadow-md">
              Contact Support
              <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </div>
        </section>

      </main>
      
      <MainFooter />
    </div>
  );
}
