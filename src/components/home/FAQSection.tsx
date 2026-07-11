"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Headset, Star, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "How do I search for properties on ShabbosRent?",
    answer: "You can easily search by city, neighborhood, walking distance to synagogues, and the number of rooms or beds. Our unique walking distance feature ensures you find a place perfectly suited for Shabbos."
  },
  {
    question: "Can I list my property for sale or rent?",
    answer: "Absolutely! You can easily list your apartment for weekend rentals or swaps. Just click the 'Add Your Apartment' button in the navigation bar to get started."
  },
  {
    question: "What types of properties are available?",
    answer: "We offer a wide range of properties including luxury penthouses, cozy family apartments, modern villas, and charming studios across various cities and neighborhoods in Israel."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-[#fafafa] dark:bg-zinc-950 overflow-hidden relative">
      {/* Premium Background Mesh Gradients */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#4c55a4]/10 via-[#4c55a4]/5 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-purple-600/10 via-purple-600/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Premium Floating Composition */}
          <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
             {/* Offset Decorative Background */}
             <div className="absolute inset-4 md:inset-8 bg-gradient-to-tr from-[#4c55a4]/20 to-purple-500/20 rounded-[3rem] transform -rotate-6 scale-95 blur-sm" />
             
             {/* Main Image Card */}
             <div className="absolute inset-4 md:inset-8 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/60 dark:border-zinc-800/60 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                  alt="Premium Support Agent" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 via-transparent to-transparent" />
             </div>
             
             {/* Floating Glassmorphism Badge 1: Support */}
             <div className="absolute -left-2 md:-left-8 top-1/4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-zinc-700/50 flex items-center gap-4 z-20 animate-[bounce_4s_infinite_ease-in-out]">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4c55a4] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-[#4c55a4]/30">
                   <Headset className="w-7 h-7 text-white" />
                </div>
                <div className="pr-2">
                  <p className="text-base font-extrabold text-zinc-900 dark:text-white">24/7 Support</p>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Always here to help</p>
                </div>
             </div>

             {/* Floating Glassmorphism Badge 2: Ratings */}
             <div className="absolute -right-2 md:-right-8 bottom-1/4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-zinc-700/50 flex items-center gap-4 z-20 animate-[bounce_5s_infinite_ease-in-out_reverse]">
                <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                  <img src="https://i.pravatar.cc/100?img=9" className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-900 dark:text-white shadow-sm">+2k</div>
                </div>
                <div className="pr-2">
                  <div className="flex text-yellow-400 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/>
                  </div>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white">Happy Renters</p>
                </div>
             </div>
          </div>

          {/* Right Side: Sleek Minimalist FAQ */}
          <div className="lg:pl-8">
            <div className="mb-12">
              <div className="relative inline-block mb-6">
                <span className="relative z-10 font-bold tracking-widest uppercase text-sm text-zinc-900 dark:text-white px-5 py-2">
                  FAQ
                </span>
                <svg 
                  className="absolute inset-0 w-full h-full -z-10"
                  viewBox="0 0 100 40" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M10,20 Q10,5 50,5 T90,20 Q90,35 50,35 T10,20" 
                    fill="none" 
                    stroke="#eab308" 
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={`transition-all duration-[1.5s] ease-out ${isVisible ? 'path-animate' : 'opacity-0'}`}
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: isVisible ? 0 : 300,
                    }}
                  />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-[1.15] tracking-tight">
                Got Questions? <br />
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">We've got answers.</span>
              </h2>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border-b border-zinc-200 dark:border-zinc-800 last:border-0"
                  >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full text-left py-6 flex items-center justify-between group"
                    >
                      <span className={`font-bold text-xl transition-colors duration-300 pr-8 ${isOpen ? "text-[#4c55a4] dark:text-[#6b75c8]" : "text-zinc-900 dark:text-white group-hover:text-[#4c55a4] dark:group-hover:text-[#6b75c8]"}`}>
                        {faq.question}
                      </span>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${isOpen ? "bg-[#4c55a4] border-[#4c55a4] text-white rotate-180" : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:border-[#4c55a4] group-hover:text-[#4c55a4]"}`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-64 pb-8 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium pr-12">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
