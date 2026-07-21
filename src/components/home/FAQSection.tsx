"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircleQuestion, Headset, Mail, ShieldCheck, ChevronDown, ChevronUp, FileText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("faq.a1"),
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2"),
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3"),
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4"),
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-zinc-950 font-sans relative">
      <div className="container mx-auto px-4">
        
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-[#4c55a4] dark:text-indigo-400 font-bold uppercase tracking-wider text-sm mb-4">{t("faq.subtitle")}</p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#0B1536] dark:text-white mb-4 tracking-tight">
            {t("faq.title")}
          </h2>
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
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{t("faq.need_help")}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed mb-8">
                {t("faq.cant_find_answer")}
              </p>
              
              <div className="space-y-3 mb-10">
                <Link href="/contact" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1e58f1] hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20 text-sm">
                  <Headset className="w-5 h-5" />
                  {t("faq.contact_support")}
                </Link>
                <Link href="mailto:support@shabbosrent.com" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-zinc-800 border-2 border-blue-100 text-[#1e58f1] dark:border-zinc-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700/50 rounded-xl font-bold transition-colors text-sm">
                  <Mail className="w-5 h-5" />
                  {t("faq.email_us")}
                </Link>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-[#1e58f1] dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                <div className="flex flex-col text-zinc-500 dark:text-zinc-400 text-xs">
                  <span>{t("faq.reply_within")}</span>
                  <span className="font-bold text-[#1e58f1] dark:text-blue-400">{t("faq.hours_24")}</span>
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
                          {faq.q}
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
                          {faq.a}
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
                {t("faq.still_have_questions")} <Link href="/faq" className="font-bold text-[#1e58f1] dark:text-blue-400 hover:underline">{t("faq.help_center_link")}</Link> {t("faq.for_more_info")}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
