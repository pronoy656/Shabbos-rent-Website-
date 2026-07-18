"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircleQuestion, Headset, Mail, ShieldCheck, ChevronDown, ChevronUp, FileText } from "lucide-react";
import Link from "next/link";

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
  },
  {
    question: "How does the apartment swap feature work?",
    answer: "Our apartment swap feature allows verified users to securely exchange homes for a Shabbos or Yom Tov. You can set your availability and connect directly with other hosts."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white dark:bg-zinc-950 font-sans relative">
      <div className="container mx-auto px-4">
        
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-6 bg-blue-50/50 dark:bg-blue-900/10">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1B3D] dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg">
            Find answers to the most common questions about our services and how we work.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Help Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-white to-[#f4f7fb] dark:from-zinc-900 dark:to-zinc-900/80 rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {/* Dotted pattern and gradient blob */}
            <div 
              className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none" 
              style={{ backgroundImage: "radial-gradient(#2563eb 2px, transparent 2px)", backgroundSize: "16px 16px" }} 
            />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-gradient-to-bl from-blue-100 via-blue-50/50 to-transparent dark:from-blue-900/20 rounded-full blur-3xl opacity-80 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8 shadow-sm border border-zinc-100 dark:border-zinc-700 relative overflow-hidden">
                <MessageCircleQuestion className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Need more help?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed mb-8">
                Can't find the answer you're looking for? Our support team is here to help you.
              </p>
              
              <div className="space-y-3 mb-10">
                <Link href="/contact" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1e58f1] hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20 text-sm">
                  <Headset className="w-5 h-5" />
                  Contact Support
                </Link>
                <Link href="mailto:support@shabbosrent.com" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-zinc-800 border-2 border-blue-100 text-[#1e58f1] dark:border-zinc-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700/50 rounded-xl font-bold transition-colors text-sm">
                  <Mail className="w-5 h-5" />
                  Email Us
                </Link>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-[#1e58f1] dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                <div className="flex flex-col text-zinc-500 dark:text-zinc-400 text-xs">
                  <span>We typically reply within</span>
                  <span className="font-bold text-[#1e58f1] dark:text-blue-400">24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-2 space-y-3 lg:pl-6">
            <div className="bg-white dark:bg-zinc-950 rounded-3xl p-4 md:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm shadow-zinc-200/20 dark:shadow-none">
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={index} 
                      className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                        isOpen 
                          ? 'border-blue-100 bg-gradient-to-b from-[#f8faff] to-white dark:border-blue-900/30 dark:from-blue-900/10 dark:to-zinc-900/50' 
                          : 'border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-100/50'
                      }`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full text-left px-6 py-5 flex items-center gap-5 focus:outline-none"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? 'bg-[#1e58f1] text-white shadow-sm' : 'bg-[#f0f4ff] text-[#1e58f1] dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <span className={`flex-1 font-bold text-[16px] transition-colors ${isOpen ? 'text-[#1e58f1] dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0 text-zinc-400 dark:text-zinc-500">
                          {isOpen ? <ChevronUp className="w-5 h-5 text-[#1e58f1] dark:text-blue-400" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                        </div>
                      </button>
                      
                      <div 
                        className={`px-6 md:pl-[4.5rem] pr-6 overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Help center note */}
            <div className="flex items-center gap-2 mt-8 px-6 text-[15px] text-zinc-500 dark:text-zinc-400">
              <FileText className="w-5 h-5 text-[#1e58f1] dark:text-blue-400" />
              <span>
                Still have questions? Visit our <Link href="/faq" className="font-bold text-[#1e58f1] dark:text-blue-400 hover:underline">Help Center</Link> for more information.
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
