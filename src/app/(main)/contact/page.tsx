"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";

export default function ContactPage() {
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
    }, 1500);
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
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <MapPin className="w-6 h-6 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-indigo-50 mb-1">Our Location</h4>
                      <p className="text-indigo-200/80 leading-relaxed">
                        123 Jerusalem Boulevard, <br />
                        Jerusalem, Israel 90123
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-6 h-6 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-indigo-50 mb-1">Phone Number</h4>
                      <p className="text-indigo-200/80 leading-relaxed">
                        +972 50-123-4567<br />
                        Sun-Thu, 9am - 5pm IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-6 h-6 text-indigo-100" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-indigo-50 mb-1">Email Address</h4>
                      <p className="text-indigo-200/80 leading-relaxed">
                        support@shabbosrent.com<br />
                        info@shabbosrent.com
                      </p>
                    </div>
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
                  className="px-10 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold transition-all shadow-md"
                >
                  OK
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Message</label>
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
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
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
