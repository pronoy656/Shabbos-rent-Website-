"use client";

import React from "react";
import { 
  Phone,
  Home,
  CreditCard, 
  Edit3, 
  MessageSquare, 
  Sparkles,
  Check,
  Headphones,
  Mail,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Custom WhatsApp SVG Icon for pixel-perfect brand rendering
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm3.364 8.167c-.145.409-.844.757-1.18.793-.306.033-.707.05-2.227-.58-1.942-.805-3.184-2.776-3.28-2.905-.097-.129-.785-1.045-.785-1.993 0-.948.497-1.414.673-1.608.177-.194.387-.243.516-.243.129 0 .258.002.37.008.119.006.279-.045.436.333.161.387.548 1.336.596 1.433.048.097.081.21.016.339-.065.129-.097.21-.194.323-.097.113-.204.252-.291.339-.097.097-.198.203-.085.397.113.194.502.828 1.077 1.341.74.66 1.365.865 1.559.962.194.097.306.081.42-.048.113-.129.484-.564.613-.757.129-.194.258-.161.436-.097.177.065 1.129.532 1.323.629.194.097.323.145.371.226.048.081.048.468-.097.877z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.982-1.307A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.61 0-3.116-.45-4.404-1.23l-.316-.189-3.268.857.872-3.188-.207-.33A8.163 8.163 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z" />
    </svg>
  );
}

export default function OtherChannelsTab() {
  const whatsappNumber = "972541234567";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like to manage my apartment on Shabos Rent.")}`;

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#071022] p-6 sm:p-10 md:p-12 rounded-[32px] border border-[#1b2a4e]/50 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#070e23] via-[#0b1636] to-[#070f26] border border-blue-500/20 p-6 sm:p-10 shadow-2xl">
        
        {/* Modern House Dusk Photo Background Overlay on the Right */}
        <div 
          className="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-1/2 opacity-25 mix-blend-screen bg-cover bg-right bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
            maskImage: `linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)`,
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-28 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="flex-1 max-w-xl">
            
            {/* Quick Guide Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md mb-5 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Quick Guide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.18]">
              Manage Your Apartment<br />
              <span className="text-white">by </span>
              <span className="text-[#22c55e] drop-shadow-[0_0_20px_rgba(34,197,94,0.35)]">
                Phone or WhatsApp
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-lg">
              You can easily manage your entire apartment listing, report rentals, make payments and more — either by calling your registered phone line or through WhatsApp.
            </p>
          </div>

          {/* Right Visual Graphic (Shifted slightly left with proper margin and alignment) */}
          <div className="relative shrink-0 hidden md:flex items-center justify-center self-center lg:self-auto py-2 lg:mr-8 lg:pr-4">
            
            {/* Cursive Floating Badge Top Right */}
            <div className="absolute -top-6 -right-2 z-20 select-none text-right">
              <div className="text-slate-100 font-serif italic text-base sm:text-lg font-bold tracking-wide leading-tight drop-shadow-md">
                Quick. Easy.<br />
                <span className="text-emerald-400">Available 24/7</span>
              </div>
              {/* Decorative sparkle bursts */}
              <div className="flex justify-end gap-1 mt-1 text-emerald-400 text-xs opacity-80">
                <span>✦</span>
                <span className="text-[10px]">✨</span>
              </div>
            </div>

            {/* Smartphone Graphic Mockup */}
            <div className="relative w-48 h-52 flex items-center justify-center -translate-x-12 translate-y-4">
              
              {/* Phone Body with 3D tilt */}
              <div className="relative w-36 h-48 rounded-[2.2rem] bg-gradient-to-b from-[#18233d] to-[#0c1424] border-[3px] border-slate-700/80 shadow-2xl p-2.5 flex flex-col justify-between transform rotate-[10deg] hover:rotate-0 transition-transform duration-500">
                {/* Speaker notch */}
                <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto" />
                
                {/* Screen content */}
                <div className="flex-1 rounded-[1.6rem] bg-[#070d1a] border border-slate-800/60 p-3 flex flex-col items-center justify-center gap-2.5 my-1 relative overflow-hidden">
                  
                  {/* Subtle Grid / Screen Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-emerald-500/10" />
                  
                  {/* Phone Call Icon Inside Phone */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 relative z-10">
                    <Phone className="w-6 h-6 fill-white" />
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto" />
              </div>

              {/* Floating Glowing WhatsApp Icon with connecting arrows */}
              <div className="absolute right-0 bottom-4 z-20 w-14 h-14 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 border-2 border-[#091e1d] transform rotate-[10deg] animate-pulse">
                <WhatsAppIcon className="w-8 h-8" />
              </div>

              {/* Glowing Curved Connecting Line / Neon Arrows around icons */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 200 200">
                {/* Arrow from Phone to WhatsApp */}
                <path 
                  d="M 60 70 C 40 130, 90 170, 140 160" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeDasharray="4 4"
                  className="opacity-70"
                />
                {/* Arrow from WhatsApp to Phone */}
                <path 
                  d="M 150 120 C 170 60, 120 30, 80 45" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeDasharray="4 4"
                  className="opacity-70"
                />
              </svg>

            </div>

          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TWO-COLUMN CARDS GRID (PHONE VS WHATSAPP)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* =========================================================
            LEFT COLUMN: CALL FROM YOUR PHONE LINE
        ========================================================= */}
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Call & Stepper */}
          <div className="bg-[#0b1328] rounded-[24px] border border-[#1b2a4e] p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-13 h-13 rounded-full bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                  <Phone className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Call from Your Phone Line</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    Use the phone number registered with us. It's fast, easy, and gets you directly to your apartment listing.
                  </p>
                </div>
              </div>

              {/* Stepper with connected vertical line */}
              <div className="space-y-3.5 relative pl-1">
                
                {/* Vertical connecting line */}
                <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-blue-600/30 z-0" />

                {/* Step 1 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                    1
                  </div>
                  <div className="flex-1 bg-[#101b38] border border-[#1c2e5c] p-3.5 px-4 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest leading-none">
                      STEP 1
                    </span>
                    <span className="text-sm sm:text-[15px] font-bold text-white mt-1">
                      Call your registered phone number
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                    2
                  </div>
                  <div className="flex-1 bg-[#101b38] border border-[#1c2e5c] p-3.5 px-4 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest leading-none">
                      STEP 2
                    </span>
                    <span className="text-sm sm:text-[15px] font-bold text-white mt-1">
                      Press 3 to get to your apartment listing
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 2: Features inside phone menu */}
          <div className="bg-[#0b1328] rounded-[24px] border border-[#1b2a4e] p-6 sm:p-7 shadow-xl flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-[15px] sm:text-base font-bold text-white">
                Once you're in your apartment listing, you can:
              </h3>
            </div>

            {/* Feature items with distinct colorful icons */}
            <div className="space-y-4">
              
              {/* Feature 1: Manage Availability */}
              <div className="flex items-start gap-4 pb-3.5 border-b border-slate-800/80 last:border-b-0">
                <div className="w-10 h-10 rounded-xl bg-[#063328] border border-[#0d5945] text-[#22c55e] flex items-center justify-center shrink-0 shadow-xs">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                    Manage Availability
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Set your availability for Shabbos or swap dates for another week.
                  </p>
                </div>
              </div>

              {/* Feature 2: Report Rented & Pay */}
              <div className="flex items-start gap-4 pb-3.5 border-b border-slate-800/80 last:border-b-0">
                <div className="w-10 h-10 rounded-xl bg-[#1e1b4b] border border-[#3730a3] text-[#818cf8] flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                    Report Rented & Pay
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Report a rental and complete your payment.
                  </p>
                </div>
              </div>

              {/* Feature 3: Edit Your Listing */}
              <div className="flex items-start gap-4 pb-3.5 border-b border-slate-800/80 last:border-b-0">
                <div className="w-10 h-10 rounded-xl bg-[#0c284e] border border-[#1d4ed8] text-[#60a5fa] flex items-center justify-center shrink-0 shadow-xs">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                    Edit Your Listing
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Update your listing details, send reminders and more.
                  </p>
                </div>
              </div>

              {/* Feature 4: Leave a Message */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#3f0f29] border border-[#831843] text-[#f472b6] flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                    Leave a Message
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Talk to our team or leave a message for us.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* =========================================================
            RIGHT COLUMN: MANAGE VIA WHATSAPP
        ========================================================= */}
        <div className="flex flex-col gap-6">
          
          {/* Card 1: WhatsApp CTA Box */}
          <div className="bg-[#0b1328] rounded-[24px] border border-[#1b2a4e] p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-13 h-13 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
                  <WhatsAppIcon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Manage via WhatsApp</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    You can also manage your apartment through WhatsApp. It's simple, convenient and works right from your phone.
                  </p>
                </div>
              </div>

              {/* Green Action Box */}
              <div className="rounded-2xl bg-[#06201b]/90 border border-[#10b981]/40 p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#22c55e] flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                      Send us a message on WhatsApp
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Click the button below to start a chat with us.
                    </p>
                  </div>
                </div>

                {/* Open WhatsApp Button */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-extrabold py-3.5 px-5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer text-sm sm:text-[15px]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Open WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: On WhatsApp You Can (with Watermark Design & Organic Wave Backdrop) */}
          <div className="bg-[#0b1328] rounded-[24px] border border-[#1b2a4e] p-6 sm:p-7 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden min-h-[280px]">
            
            {/* Watermark Wave / Curved Waterfall Shape on Right */}
            <div className="absolute top-0 right-0 bottom-0 w-2/3 pointer-events-none overflow-hidden select-none">
              <svg 
                className="absolute right-0 top-0 h-full w-full opacity-80" 
                viewBox="0 0 240 220" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M 70 0 C 20 60, 60 130, 10 220 L 240 220 L 240 0 Z" 
                  fill="#061229" 
                />
                <path 
                  d="M 110 0 C 70 70, 110 140, 60 220 L 240 220 L 240 0 Z" 
                  fill="#051024" 
                />
              </svg>
            </div>

            {/* Prominent WhatsApp Logo Watermark in Bottom Right Corner */}
            <div className="absolute -bottom-5 -right-5 z-0 text-emerald-500/20 pointer-events-none select-none drop-shadow-[0_0_25px_rgba(34,197,94,0.15)]">
              <WhatsAppIcon className="w-36 h-36 sm:w-40 sm:h-40" />
            </div>

            <div className="relative z-10">
              <h3 className="text-[15px] sm:text-base font-bold text-white mb-5">
                On WhatsApp you can:
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                {/* 5 Checkmark Items */}
                <ul className="space-y-3.5">
                  {[
                    "Manage availability",
                    "Report rented",
                    "Make a payment",
                    "Leave a message",
                    "And more...",
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#063328] border border-[#22c55e] text-[#22c55e] flex items-center justify-center shrink-0 text-xs shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Handwritten note decoration pointing down to WhatsApp watermark */}
                <div className="relative self-center sm:self-end sm:mb-2 text-center sm:text-right pr-4 z-10">
                  <div className="font-serif italic font-bold text-emerald-400 text-base sm:text-lg transform rotate-[-9deg] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] select-none">
                    Just send<br />
                    us a message!
                  </div>
                  {/* Curvy hand-drawn green arrow pointing down towards watermark */}
                  <svg 
                    className="w-12 h-10 text-emerald-400 mx-auto sm:ml-auto sm:mr-3 transform rotate-[10deg] opacity-95 drop-shadow-sm" 
                    viewBox="0 0 50 40" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  >
                    <path d="M 8 5 Q 35 12, 26 34" />
                    <path d="M 18 28 L 26 35 L 32 27" />
                  </svg>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. NEED HELP? BOTTOM BANNER (WITH WATERMARK ARCH GLOW)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-[24px] bg-[#0b1328] border border-[#1b2a4e] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl overflow-hidden">
        
        {/* Concentric Glow Arcs Watermark on Right */}
        <div className="absolute -right-8 -bottom-16 w-56 h-56 rounded-full border-[1.5px] border-blue-500/15 pointer-events-none select-none" />
        <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full border-[1.5px] border-blue-400/10 pointer-events-none select-none" />
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none select-none" />

        {/* Left icon and message */}
        <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
          <div className="w-13 h-13 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Need help?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Our support team is always here to assist you with any questions or issues.
            </p>
          </div>
        </div>

        {/* Right button */}
        <Link
          href="/contact"
          className="w-full sm:w-auto bg-[#121c38] hover:bg-[#19264c] text-white border border-blue-400/30 rounded-xl px-5 py-3 font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] shrink-0 cursor-pointer relative z-10"
        >
          <Mail className="w-4 h-4 text-blue-400" />
          <span>Contact Support</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

    </div>
  );
}
