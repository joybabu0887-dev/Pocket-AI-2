import React, { useRef, useState, useEffect } from "react";
import { 
  Compass, 
  Layers, 
  Youtube, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Github, 
  Code,
  Upload,
  Globe,
  Settings,
  HelpCircle,
  X
} from "lucide-react";
import { Dict, CategoryId } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "bn";
  dict: Dict;
  activeCategory: CategoryId | null;
  onSelectCategory: (catId: CategoryId | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  lang,
  dict,
  activeCategory,
  onSelectCategory
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("pocket_ai_custom_logo");
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        localStorage.setItem("pocket_ai_custom_logo", base64);
        setCustomLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem("pocket_ai_custom_logo");
    setCustomLogo(null);
  };

  const aiTools = [
    { name: "ChatGPT", url: "https://chatgpt.com", alias: "AI Chat Master" },
    { name: "Gemini AI", url: "https://gemini.google.com", alias: "Google Intelligence" },
    { name: "Claude AI", url: "https://claude.ai", alias: "Anthropic Assistant" },
    { name: "Google AI Studio", url: "https://aistudio.google.com", alias: "Developer Console" }
  ];

  const devTools = [
    { name: "GitHub", url: "https://github.com", icon: <Github className="h-4 w-4" /> },
    { name: "Vercel", url: "https://vercel.com", icon: <Code className="h-4 w-4" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/45 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation Block */}
      <aside
        id="sidebar-container"
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 max-w-[85vw] border-r border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl z-50 flex flex-col justify-between transition-all duration-300 transform lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Controls */}
        <div className="p-5 flex flex-col border-b border-gray-100 dark:border-gray-900 overflow-y-auto flex-grow scrollbar-thin">
          <div className="flex items-center justify-between mb-6">
            {/* Logo Upload Placeholder Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative cursor-pointer flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1.5 transition-all"
              title={lang === "en" ? "Click to upload your own custom logo" : "ক্লিক করে কাস্টম লোগো আপলোড করুন"}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                {customLogo ? (
                  <img 
                    src={customLogo} 
                    alt="Pocket AI Custom Logo" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-base tracking-tight text-gray-900 dark:text-gray-100 flex items-center">
                  Pocket AI 
                  <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider">
                    SaaS
                  </span>
                </span>
                <span className="text-[11px] font-mono font-medium text-gray-400 group-hover:text-indigo-500 transition-colors">
                  {customLogo ? (lang === "en" ? "Change logo" : "লোগো পরিবর্তন") : (lang === "en" ? "Upload logo" : "লোগো সেট করুন")}
                </span>
              </div>

              {/* Reset Custom Logo Button */}
              {customLogo && (
                <button
                  type="button"
                  onClick={clearLogo}
                  className="absolute -top-1 -left-1 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full shadow-md hover:scale-110 transition-all"
                  title="Remove Custom Logo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Hidden Input for Custom Logo */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Close Button on Mobile Drawer */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SaaS Branding Slogan Placeholder Box */}
          {!customLogo && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mb-6 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-gray-50/50 dark:bg-gray-900/30 text-center cursor-pointer transition-all hover:shadow-inner group/box"
            >
              <Upload className="h-5 w-5 mx-auto text-gray-400 group-hover/box:text-indigo-500 group-hover/box:translate-y-[-2px] transition-all mb-2" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {dict.placeholderLogoLabel}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {lang === "en" ? "Perfect size: square 1:1 format" : "স্কয়ার ১:১ রেশিও সবচেয়ে ভালো হবে"}
              </p>
            </div>
          )}

          {/* Quick Filter Categories Section */}
          <div className="mb-8">
            <p className="text-[11px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-3">
              {lang === "en" ? "Category Filter" : "ক্যাটাগরি ফিল্টার"}
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  onSelectCategory(null);
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === null
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <span className="mr-3 h-4 w-4 flex items-center justify-center font-mono text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                  ★
                </span>
                {lang === "en" ? "All App Workspace" : "সব প্রম্পট ওয়ার্কস্পেস"}
              </button>

              <button
                onClick={() => {
                  onSelectCategory("logo");
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === "logo"
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Compass className="mr-3 h-4 w-4" />
                {lang === "en" ? "Logo Design" : "লোগো ডিজাইন"}
              </button>

              <button
                onClick={() => {
                  onSelectCategory("poster");
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === "poster"
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Layers className="mr-3 h-4 w-4" />
                {lang === "en" ? "Poster Design" : "পোস্টার ডিজাইন"}
              </button>

              <button
                onClick={() => {
                  onSelectCategory("thumbnail");
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === "thumbnail"
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Youtube className="mr-3 h-4 w-4" />
                {lang === "en" ? "Thumbnail Design" : "থাম্বনেইল ডিজাইন"}
              </button>

              <button
                onClick={() => {
                  onSelectCategory("image");
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === "image"
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Sparkles className="mr-3 h-4 w-4" />
                {lang === "en" ? "AI Image Prompts" : "এআই প্রম্পট মাস্টার"}
              </button>
            </nav>
          </div>

          {/* AI Tools Section */}
          <div className="mb-8">
            <p className="text-[11px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-3">
              {dict.sidebarToolsHeader}
            </p>
            <div className="space-y-1">
              {aiTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="font-medium group-hover:text-indigo-500 transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-500 dark:text-gray-600">
                      {tool.alias}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Developer Tools Section */}
          <div>
            <p className="text-[11px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-3">
              {dict.sidebarDevHeader}
            </p>
            <div className="space-y-1">
              {devTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                      {tool.icon}
                    </span>
                    <span className="font-semibold">{tool.name}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Credit Footnote */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 flex items-center justify-between rounded-b-xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Pocket AI Generator
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              v1.5.0 • © 2026
            </span>
          </div>
          <HelpCircle 
            className="h-4.5 w-4.5 text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors" 
            title={lang === "en" ? "Prompt with Gemini & Use Anywhere" : "জেমিনি দিয়ে প্রম্পট বানিয়ে সব জায়গায় ডিজাইন করুন"}
          />
        </div>
      </aside>
    </>
  );
};
