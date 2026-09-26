"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";
import { useContactForm } from "@/hooks/useContact";
import { useMe } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const contactMutation = useContactForm();
  const { data: meUser } = useMe();
  const { t } = useLanguage();

  useEffect(() => {
    let authUser = meUser;
    if (!authUser && typeof window !== "undefined") {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        try {
          authUser = JSON.parse(stored);
        } catch {}
      }
    }

    if (authUser) {
      setIsAuth(true);
      // @ts-ignore - in case name exists instead of username
      const userName = authUser.username || authUser.name || authUser.firstName || "";
      setFormData(prev => ({
        ...prev,
        name: userName || prev.name,
        email: authUser.email || prev.email,
        phone: authUser.phone || prev.phone,
      }));
    }
  }, [meUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await contactMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim() || "General Inquiry",
        message: formData.message.trim(),
      });

      toast.success(res?.message || "Your message has been sent successfully!");
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to send message. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Have questions, feedback, or need support? Our team is here to help you out.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 bg-white dark:bg-zinc-900 rounded-[40px] shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 bg-[#4c55a4] text-white p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold tracking-wider uppercase mb-8 self-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  AVAILABLE 24/6
                </div>

                <h2 className="text-3xl font-bold mb-4">Contact Details</h2>
                <p className="text-indigo-100/90 leading-relaxed mb-10 text-sm">
                  Get in touch with us directly. We usually respond within a few hours during business days.
                </p>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <MapPin className="w-5 h-5 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white mb-1">Our Office</h4>
                      <p className="text-indigo-200 text-sm leading-relaxed">
                        Jaffa Street 123,<br />
                        Jerusalem, Israel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <Phone className="w-5 h-5 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white mb-1">Phone Number</h4>
                      <a href="tel:+97221234567" className="text-indigo-200 text-sm hover:text-white transition-colors leading-relaxed">
                        +972 2-123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <Mail className="w-5 h-5 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white mb-1">Email Address</h4>
                      <a href="mailto:info@shabbosrent.com" className="text-indigo-200 text-sm hover:text-white transition-colors leading-relaxed">
                        info@shabbosrent.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <h4 className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-4">Connect With Us</h4>
                  <div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 border border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 border border-white/20 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 p-10 lg:p-12">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Send us a Message</h3>
                <p className="text-zinc-500">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in fade-in duration-300">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Message Sent!</h4>
                  <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                    Thank you for reaching out. We have received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-10 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        readOnly={isAuth && !!formData.name}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all ${(isAuth && !!formData.name) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        readOnly={isAuth && !!formData.email}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all ${(isAuth && !!formData.email) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        readOnly={isAuth && !!formData.phone}
                        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all ${(isAuth && !!formData.phone) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        placeholder="052-123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer shadow-md"
                  >
                    {contactMutation.isPending ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message <Send className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
