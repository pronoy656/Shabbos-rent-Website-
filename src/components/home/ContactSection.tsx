"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">{t("contact.title")}</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 bg-white dark:bg-zinc-900 rounded-[32px] shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden min-h-[650px]">
          
          {/* Contact Info (Left Side) */}
          <div className="lg:col-span-2 bg-[#364187] text-white p-12 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 mb-8 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">{t("contact.available")}</span>
              </div>
              
              <h3 className="text-4xl font-bold mb-4">{t("contact.details_title")}</h3>
              <p className="text-white/80 mb-12 text-[15px] leading-relaxed max-w-sm">
                {t("contact.details_desc")}
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t("contact.office")}</h4>
                    <p className="text-[13px] text-white/70 leading-relaxed">
                      Jaffa Street 123,<br />
                      Jerusalem, Israel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t("contact.phone")}</h4>
                    <p className="text-[13px] text-white/70 leading-relaxed">
                      +972 50-123-4567<br />
                      +972 2-123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t("contact.email")}</h4>
                    <p className="text-[13px] text-white/70 leading-relaxed">
                      support@shabbosrent.com<br />
                      info@shabbosrent.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-white/90 mb-5 uppercase tracking-widest">{t("contact.connect")}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all hover:-translate-y-1 group">
                  <svg className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all hover:-translate-y-1 group">
                  <svg className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all hover:-translate-y-1 group">
                  <svg className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all hover:-translate-y-1 group">
                  <svg className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="lg:col-span-3 p-12 lg:pt-16 bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{t("contact.send_message")}</h3>
              <p className="text-zinc-500 text-[15px]">{t("contact.form_desc")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 flex-1 flex flex-col justify-between">
              <div className="grid md:grid-cols-2 gap-7">
                <div className="group">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 group-focus-within:text-[#4c55a4] transition-colors">{t("contact.full_name")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 group-focus-within:text-[#4c55a4] transition-colors">{t("contact.email")}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 group-focus-within:text-[#4c55a4] transition-colors">{t("contact.subject")}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="group flex-1 flex flex-col mb-4">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 group-focus-within:text-[#4c55a4] transition-colors">{t("contact.message")}</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-full min-h-[140px] px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4c55a4]/10 focus:border-[#4c55a4] transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] hover:shadow-lg hover:shadow-[#4c55a4]/20 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-auto"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t("contact.send_btn")}
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
