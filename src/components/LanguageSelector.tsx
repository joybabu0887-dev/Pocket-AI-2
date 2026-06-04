import React from "react";
import { Sparkles, ArrowRight, Languages } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: "en" | "bn";
  onSelectLang: (lang: "en" | "bn") => void;
  showWelcomeOverlay: boolean;
  onDismissOverlay: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLang,
  showWelcomeOverlay,
  onDismissOverlay
}) => {
  if (showWelcomeOverlay) {
    return (
      <div 
        id="language-overlay-screen"
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4"
      >
        <div 
          id="welcome-card-box"
          className="w-full max-w-lg bg-white/90 dark:bg-gray-950/90 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-500"
        >
          {/* Back glows */}
          <div className="absolute top-[-30%] right-[-20%] w-72 h-72 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-20%] w-72 h-72 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-8 relative">
            <div className="h-14 w-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-gray-900 dark:text-white">
              Pocket AI
            </h1>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider mt-1 uppercase">
              Premium Prompt Suite
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
              Please choose your language to customize your professional design workspace.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              আপনার প্রফেশনাল ডিজাইন ওয়ার্কস্পেস সেটআপ করতে ভাষা নির্বাচন করুন।
            </p>
          </div>

          {/* Language Picker Triggers */}
          <div className="space-y-4 mb-6">
            {/* Bengali Selection */}
            <button
              onClick={() => {
                onSelectLang("bn");
                onDismissOverlay();
              }}
              className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 hover:border-emerald-500 dark:hover:border-emerald-500 dark:hover:bg-emerald-500/5 hover:bg-emerald-50/30 text-left transition-all group duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <div className="flex items-center space-x-4">
                <span className="text-4xl filter drop-shadow">🇧🇩</span>
                <div>
                  <span className="block font-bold text-gray-900 dark:text-white text-lg">
                    বাংলা ভাষা (Bengali)
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
                    সম্পূর্ণ বাংলা ইন্টারফেস ও গাইডলাইনস
                  </span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1.5 transition-all" />
            </button>

            {/* English Selection */}
            <button
              onClick={() => {
                onSelectLang("en");
                onDismissOverlay();
              }}
              className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 hover:border-indigo-500 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/5 hover:bg-indigo-50/30 text-left transition-all group duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <div className="flex items-center space-x-4">
                <span className="text-4xl filter drop-shadow">🇺🇸</span>
                <div>
                  <span className="block font-bold text-gray-900 dark:text-white text-lg">
                    English Language
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
                    Standard global design guidelines
                  </span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1.5 transition-all" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Pocket AI • Designed for Creators
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Mini language switcher for header bar
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => onSelectLang(currentLang === "en" ? "bn" : "en")}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title={currentLang === "en" ? "বাংলা ভাষায় পরিবর্তন করুন" : "Switch to English"}
      >
        <Languages className="h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
        <span className="text-sm font-semibold">
          {currentLang === "en" ? "🇧🇩 বাংলা" : "🇺🇸 English"}
        </span>
      </button>
    </div>
  );
};
