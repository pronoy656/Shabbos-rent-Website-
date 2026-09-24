"use client";

import { useState, useEffect } from "react";
import { Sparkles, Home, RefreshCw, SlidersHorizontal, X, PlusCircle, ArrowRight, ArrowLeft } from "lucide-react";
import OtherChannelsTab from "@/components/dashboard/OtherChannelsTab";

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApartment: () => void;
}

export default function WelcomeGuideModal({ isOpen, onClose, onAddApartment }: WelcomeGuideModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Reset to step 1 every time it opens
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`bg-white dark:bg-[#071022] rounded-[32px] shadow-2xl w-full max-w-5xl border border-zinc-200 dark:border-zinc-800 relative transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'} flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden`}
      >
        {/* Absolute Close Button - Higher z-index */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white bg-zinc-100/50 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-700 rounded-full transition-all z-[100] cursor-pointer backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto overflow-x-hidden relative w-full h-full flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {step === 1 ? (
            <div className="p-8 md:p-12 lg:p-14 flex flex-col items-center text-center relative w-full min-h-full justify-center">
              {/* Background Glows */}
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
                <div className="absolute inset-0 border-2 border-white/20 rounded-[28px]" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 mb-4 tracking-tight z-10">
                Welcome to Your Dashboard!
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mb-12 text-base md:text-lg leading-relaxed z-10 font-medium">
                You are just one step away from unlocking the full potential of Shabbos Rent. Add your apartment to start enjoying these exclusive benefits:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-12 text-left z-10">
                <div className="bg-white/50 dark:bg-[#0c162d]/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-200/50 dark:border-blue-900/30 shadow-lg shadow-zinc-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">List & Earn</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Rent out your apartment for Shabbatot and earn extra income securely.
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-[#0c162d]/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-200/50 dark:border-emerald-900/30 shadow-lg shadow-zinc-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">Free Swaps</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Trade weekends with other owners in different cities without paying rent.
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-[#0c162d]/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-200/50 dark:border-purple-900/30 shadow-lg shadow-zinc-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <SlidersHorizontal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">Full Control</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Set strict preferences for who can swap or book, and easily control your calendar.
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-4 max-w-xl mx-auto z-10">
                <button
                  onClick={onClose}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-base transition-colors cursor-pointer border border-transparent dark:border-zinc-700 w-full sm:w-1/3"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full relative animate-in fade-in zoom-in-95 duration-300">
              
              {/* Sticky Header for Step 2 */}
              <div className="sticky top-0 z-[50] bg-white/80 dark:bg-[#071022]/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 p-4 md:px-8 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors text-sm font-bold bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Welcome
                </button>
                <h3 className="text-zinc-900 dark:text-white font-bold hidden sm:block">How to Manage Your Apartment</h3>
                <div className="w-[100px]" /> {/* spacer to balance close button */}
              </div>

              {/* Step 2 Content - Reuse the Explainer Tab Component */}
              <div className="p-4 md:p-8 flex-1">
                <OtherChannelsTab />
              </div>

              {/* Sticky Footer for Step 2 with CTA */}
              <div className="sticky bottom-0 z-[50] bg-white/90 dark:bg-[#071022]/95 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 p-5 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                  Ready to add your apartment?
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => onAddApartment(), 300);
                  }}
                  className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-[15px] transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add Your Apartment Now</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
