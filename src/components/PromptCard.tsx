import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  Heart, 
  Download, 
  RotateCcw, 
  Sparkles, 
  BadgeHelp,
  Compass,
  Layers,
  Youtube,
  Image,
  ExternalLink
} from "lucide-react";
import { GeneratedResponse, CategoryId, Dict } from "../types";

interface PromptCardProps {
  data: GeneratedResponse;
  category: CategoryId;
  topic: string;
  lang: "en" | "bn";
  dict: Dict;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRegenerate?: () => void;
  onCopy?: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  data,
  category,
  topic,
  lang,
  dict,
  isFavorite,
  onToggleFavorite,
  onRegenerate,
  onCopy
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case "logo":
        return <Compass className="h-5 w-5 text-indigo-500 animate-spin-slow" />;
      case "poster":
        return <Layers className="h-5 w-5 text-purple-500" />;
      case "thumbnail":
        return <Youtube className="h-5 w-5 text-rose-500" />;
      case "image":
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getCategoryText = () => {
    switch (category) {
      case "logo":
        return lang === "en" ? "Logo Design" : "লোগো ডিজাইন ";
      case "poster":
        return lang === "en" ? "Poster Design" : "পোস্টার ডিজাইন ";
      case "thumbnail":
        return lang === "en" ? "YouTube Thumbnail" : "ইউটিউব থাম্বনেইল ";
      case "image":
        return lang === "en" ? "AI Image Prompt" : "এআই প্রম্পট মাস্টার";
      default:
        return lang === "en" ? "General Concept" : "সাধারণ প্রম্পট";
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(data.negativePrompt);
    setCopiedNeg(true);
    setTimeout(() => setCopiedNeg(false), 2000);
  };

  // Download logic keeping Pocket AI branding highly visible
  const handleDownloadTxt = () => {
    setDownloading(true);

    const boundary = "=========================================";
    const docContent = `${boundary}
          POCKET AI - PROMPT SPEC SHEET
${boundary}
Generated on: ${new Date().toLocaleDateString()}
Created for: "${topic.toUpperCase()}"
Category: ${getCategoryText().toUpperCase()}
Selected Language: ${lang === "bn" ? "Bangla" : "English"}

[ CORE GENERATED PROMPT - EN ]
-----------------------------------------
${data.prompt}

[ RECOMMENDED METRICS ]
-----------------------------------------
Recommended Aspect Ratio: ${data.aspectRatio || "1:1"}
Negative Prompts: ${data.negativePrompt || "N/A"}

[ AESTHETIC DESIGN RATIO & EXPLANATION ]
-----------------------------------------
Title: ${data.title}
Explanation: 
${data.explanation}

[ POCKET PRO TIPS FOR OPTIMIZATION ]
-----------------------------------------
${data.proTips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}

${boundary}
Generated with ❤️ via Pocket AI Prompt Suite
"Your Essential Portable SaaS Prompt Master"
Keep this branding visible for professional licensing.
${boundary}`;

    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pocket_ai_${category}_${topic.replace(/\s+/g, "_").toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1200);
  };

  return (
    <div 
      id="prompt-result-card"
      className="relative bg-white/70 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl transition-all duration-300 animate-in fade-in duration-500 overflow-hidden"
    >
      {/* Dynamic Background Flare */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      {/* Header section with brand, category meta, stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-900 pb-5 mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-indigo-600 dark:text-indigo-400">
            {getCategoryIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase px-2 py-0.5 rounded-md bg-indigo-500/10">
                {getCategoryText()}
              </span>
              {data.isDemo && (
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase px-1.5 py-0.5 rounded-md bg-amber-500/10">
                  DEMO MODE
                </span>
              )}
            </div>
            <h3 className="font-sans font-bold text-gray-900 dark:text-white text-lg mt-1">
              {data.title || topic}
            </h3>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          {/* Favorite button toggle */}
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              isFavorite 
                ? "bg-rose-500/10 border-rose-200 dark:border-rose-900/30 text-rose-500" 
                : "bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
            }`}
            title={isFavorite ? dict.unfavoriteTooltip : dict.favoriteTooltip}
          >
            <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-rose-500" : ""}`} />
          </button>

          {/* Download Text spec sheet */}
          <button
            onClick={handleDownloadTxt}
            disabled={downloading}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all"
            title={dict.downloadBtn}
          >
            <Download className="h-4 w-4 text-indigo-500" />
            <span className="hidden md:inline">
              {downloading ? dict.downloadingBtn : dict.downloadBtn}
            </span>
          </button>

          {/* Regenerate prompt button */}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all"
              title={dict.regenerateBtn}
            >
              <RotateCcw className="h-4 w-4 text-purple-500" />
              <span className="hidden md:inline">{dict.regenerateBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Copyable Core Prompt Box */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          {dict.activePromptHeader} (English)
        </label>
        <div className="relative group/box rounded-2xl border border-gray-100 dark:border-gray-800/60 bg-slate-50/70 dark:bg-gray-900/50 p-5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/30">
          <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200 pr-12 break-words select-all whitespace-pre-line">
            {data.prompt}
          </p>
          <button
            onClick={handleCopyPrompt}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all hover:scale-105 active:scale-95"
            title={dict.copyBtn}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          
          {/* Toast-style copied anchor button indicator */}
          {copied && (
            <span className="absolute bottom-3 right-4 text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {dict.copiedBtn}
            </span>
          )}
        </div>
      </div>

      {/* Recommended Parameters & Metas Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Aspect Ratio Recommended */}
        <div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100/50 dark:border-gray-800/30 rounded-2xl p-5">
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400 mb-2 flex items-center">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {dict.aspectRatioLabel}
          </h4>
          <span className="inline-block font-mono font-semibold text-sm text-gray-800 dark:text-gray-200 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg">
            {data.aspectRatio || "1:1"}
          </span>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
            {category === "thumbnail" 
              ? (lang === "en" ? "Standard wide YouTube layout." : "আদর্শ ওয়াইড ইউটিউব লেআউট।")
              : category === "poster"
              ? (lang === "en" ? "Excellent portrait aspect ratio for print grids." : "প্রিন্ট গ্রিডের জন্য আদর্শ পোর্ট্রেট অ্যাসপেক্ট রেশিও।")
              : (lang === "en" ? "Square size optimization." : "স্কয়ার সাইজ অপ্টিমাইজেশন।")
            }
          </p>
        </div>

        {/* Negative keyword set */}
        <div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100/50 dark:border-gray-800/30 rounded-2xl p-5 relative">
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400 mb-2 flex items-center">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            {dict.negativePromptLabel}
          </h4>
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-xs text-gray-600 dark:text-gray-400 pr-9 leading-relaxed break-words select-all">
              {data.negativePrompt || "N/A"}
            </p>
            <button
              onClick={handleCopyNegative}
              className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-800/80 hover:bg-gray-200/50 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all shrink-0"
              title="Copy Negative Keywords"
            >
              {copiedNeg ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Style Translation Explanation Box with Hind Siliguri font support */}
      <div className="mb-6 border-t border-gray-100 dark:border-gray-900 pt-5">
        <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400 mb-2.5 flex items-center">
          <BadgeHelp className="h-4 w-4 mr-2 text-indigo-500" />
          {dict.explanationLabel}
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans font-light">
          {data.explanation}
        </p>
      </div>

      {/* Pro Tips Box with interactive layout */}
      {data.proTips && data.proTips.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 dark:border-indigo-500/5 rounded-2xl p-5">
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-3 flex items-center">
            <Sparkles className="h-3.5 w-3.5 mr-2 animate-pulse" />
            {dict.proTipsLabel}
          </h4>
          <ul className="space-y-2">
            {data.proTips.map((tip, idx) => (
              <li 
                key={idx}
                className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 font-mono text-[9px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-sans font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
