import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Sparkles, 
  Compass, 
  Layers, 
  Youtube, 
  CornerDownRight, 
  Volume2, 
  Rocket, 
  Plus, 
  X,
  AlertCircle,
  Inbox,
  Languages,
  Check
} from "lucide-react";
import { 
  CategoryId, 
  SavedPrompt, 
  categoriesList, 
  translationEn, 
  translationBn, 
  GeneratedResponse 
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { ThemeToggle } from "./components/ThemeToggle";
import { LanguageSelector } from "./components/LanguageSelector";
import { PromptCard } from "./components/PromptCard";
import { PromptHistory } from "./components/PromptHistory";

export default function App() {
  // Themes & Languages
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);

  // App Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  // Active generation response & local records list
  const [activeResponse, setActiveResponse] = useState<GeneratedResponse | null>(null);
  const [history, setHistory] = useState<SavedPrompt[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Select dictionary matching the current lang
  const dict = lang === "en" ? translationEn : translationBn;

  // 1. Core mount effects
  useEffect(() => {
    // Determine language from localStorage
    const savedLang = localStorage.getItem("pocket_ai_lang") as "en" | "bn";
    if (savedLang) {
      setLang(savedLang);
      setShowWelcomeOverlay(false);
    } else {
      setShowWelcomeOverlay(true);
    }

    // Determine theme from localStorage or system theme
    const savedTheme = localStorage.getItem("pocket_ai_theme");
    const darkActive = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(darkActive);
    if (darkActive) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load History
    const savedHistory = localStorage.getItem("pocket_ai_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse prompt history", e);
      }
    }
  }, []);

  // 2. State trigger modifications
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("pocket_ai_theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSelectLang = (newLang: "en" | "bn") => {
    setLang(newLang);
    localStorage.setItem("pocket_ai_lang", newLang);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 3. Toggle Favorites
  const handleToggleFavorite = (id: string, customHistory?: SavedPrompt[]) => {
    const targetHistory = customHistory || [...history];
    const updated = targetHistory.map((item) => {
      if (item.id === id) {
        const nextState = !item.isFavorite;
        showToast(nextState ? dict.saveToast : dict.unsaveToast);
        return { ...item, isFavorite: nextState };
      }
      return item;
    });

    setHistory(updated);
    localStorage.setItem("pocket_ai_history", JSON.stringify(updated));

    // Also update activeResponse favorite state if it matches
    const activeItem = updated.find((it) => it.id === id);
    if (activeItem && activeResponse && activeResponse.prompt === activeItem.data.prompt) {
      // Just visually syncs
    }
  };

  // Compare if activeResponse is currently favorited in the history indexer
  const isCurrentlyFavorited = () => {
    if (!activeResponse) return false;
    const matched = history.find((p) => p.data.prompt === activeResponse.prompt);
    return matched ? matched.isFavorite : false;
  };

  const handleActiveFavoriteToggle = () => {
    if (!activeResponse) return;
    // Find matching prompt in history
    const matched = history.find((p) => p.data.prompt === activeResponse.prompt);
    if (matched) {
      handleToggleFavorite(matched.id);
    } else {
      // Create lazy history item and favorite it
      const categoryToUse = activeCategory || "image";
      const newItem: SavedPrompt = {
        id: "p_" + Date.now(),
        timestamp: Date.now(),
        category: categoryToUse,
        topic: topic || "Dynamic Design Concept",
        language: lang,
        data: activeResponse,
        isFavorite: true
      };
      
      const updated = [newItem, ...history];
      setHistory(updated);
      localStorage.setItem("pocket_ai_history", JSON.stringify(updated));
      showToast(dict.saveToast);
    }
  };

  // 4. Delete Prompts
  const handleDeletePrompt = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("pocket_ai_history", JSON.stringify(updated));
    showToast(dict.deleteToast);
  };

  // 5. Select/Recall Prompt from History
  const handleSelectPrompt = (item: SavedPrompt) => {
    setActiveCategory(item.category);
    setTopic(item.topic);
    setActiveResponse(item.data);
    // Smooth scroll to card
    setTimeout(() => {
      document.getElementById("prompt-result-card")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 6. Clear Complete History index list
  const handleClearAllHistory = () => {
    if (window.confirm(lang === "en" ? "Are you sure you want to delete all saved items?" : "আপনি কি নিশ্চিত যে সমস্ত সেভ করা জিনিস মুছে ফেলতে চান?")) {
      setHistory([]);
      localStorage.removeItem("pocket_ai_history");
      showToast(lang === "en" ? "History cleared" : "সমস্ত ইতিহাস সফলভাবে মুছে ফেলা হয়েছে");
    }
  };

  // 7. Core Generate Action via standard endpoint of Express
  const handleGeneratePrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    const currentCat = activeCategory || "image";
    setLoading(true);
    setActiveResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          category: currentCat,
          language: lang,
        }),
      });

      const parsedResult = await res.json();
      if (parsedResult?.success) {
        const generationPayload: GeneratedResponse = {
          prompt: parsedResult.prompt,
          title: parsedResult.title,
          explanation: parsedResult.explanation,
          aspectRatio: parsedResult.aspectRatio,
          negativePrompt: parsedResult.negativePrompt,
          proTips: parsedResult.proTips || [],
          isDemo: parsedResult.isDemo,
        };

        setActiveResponse(generationPayload);

        // Append to local history list persistently
        const newItem: SavedPrompt = {
          id: "p_" + Date.now(),
          timestamp: Date.now(),
          category: currentCat,
          topic: topic.trim(),
          language: lang,
          data: generationPayload,
          isFavorite: false,
        };

        const updatedHistory = [newItem, ...history];
        setHistory(updatedHistory);
        localStorage.setItem("pocket_ai_history", JSON.stringify(updatedHistory));
      } else {
        throw new Error(parsedResult?.error || "Invalid response format received");
      }
    } catch (err: any) {
      console.error("Call error to prompt generator API:", err);
      showToast(lang === "en" ? "Connection timeout. Loading safe rendering rules..." : "সংযোগ ত্রুটি! সুরক্ষিত লোকাল রুলস দিয়ে প্রম্পট তৈরি হচ্ছে...");
    } finally {
      setLoading(false);
    }
  };

  // Render Category Icon Helper
  const renderCategoryIcon = (catId: CategoryId) => {
    switch (catId) {
      case "logo":
        return <Compass className="h-6 w-6 text-indigo-500 transition-colors group-hover:text-indigo-400" />;
      case "poster":
        return <Layers className="h-6 w-6 text-purple-500 transition-colors group-hover:text-purple-400" />;
      case "thumbnail":
        return <Youtube className="h-6 w-6 text-rose-500 transition-colors group-hover:text-rose-400" />;
      case "image":
        return <Sparkles className="h-6 w-6 text-amber-500 transition-colors group-hover:text-amber-400" />;
    }
  };

  // Get dynamic category-specific item fields
  const currentCategoryObj = categoriesList.find((c) => c.id === (activeCategory || "logo"));

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-[#fafbfc] dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* 1. Modal Welcome First screen language preferences overlay */}
      <LanguageSelector 
        currentLang={lang}
        onSelectLang={handleSelectLang}
        showWelcomeOverlay={showWelcomeOverlay}
        onDismissOverlay={() => {
          setShowWelcomeOverlay(false);
          // Set standard starting screen default
          setActiveCategory("logo");
        }}
      />

      {/* 2. Responsive drawer Sidebar context */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        lang={lang}
        dict={dict}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setTopic("");
          setActiveResponse(null);
        }}
      />

      {/* 3. Main Workstation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic header navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 md:px-8 py-4">
          <div className="flex items-center space-x-3">
            {/* Hamburger trigger on mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Title Brand context */}
            <div className="flex items-center space-x-2">
              <span className="font-sans font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                Pocket AI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                GenAI Workspace
              </span>
            </div>
          </div>

          {/* Setting / utility quick widgets */}
          <div className="flex items-center space-x-2.5">
            <LanguageSelector 
              currentLang={lang}
              onSelectLang={handleSelectLang}
              showWelcomeOverlay={false}
              onDismissOverlay={() => {}}
            />
            <ThemeToggle 
              isDark={isDark} 
              onToggle={toggleTheme} 
              lang={lang}
            />
          </div>
        </header>

        {/* Workspace body columns layout */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* A. Gemini API integration prepare warning alert */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-sm">
            <Rocket className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-xs md:text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
                {lang === "en" ? "Gemini API Connection Environment" : "জেমিনি এআই ইঞ্জিন যুক্ত করুন"}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">
                {dict.demoModeWarning}
              </p>
            </div>
          </div>

          {/* B. Welcome banner in standard minimalist workspace design */}
          <section className="text-center md:text-left py-6 relative rounded-3xl overflow-hidden bg-white/40 dark:bg-gray-950/40 p-6 md:p-10 border border-gray-100 dark:border-gray-900/60 shadow-sm backdrop-blur-md">
            {/* Background absolute gradients */}
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/10 to-rose-500/10 blur-3xl pointer-events-none" />
            
            <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight text-gray-900 dark:text-white leading-tight">
              {lang === "en" ? "Pocket AI Prompt Laboratory" : "পকেট এআই প্রম্পট ল্যাবরেটরি"}
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              {dict.welcomeSubtitle}
            </p>
          </section>

          {/* C. Quick Category Bento Grid (shown when category is not pre-picked or as a central picker menu) */}
          <section className="space-y-4">
            <h3 className="font-sans font-bold text-base text-gray-900 dark:text-white flex items-center">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-indigo-500" />
              {dict.chooseCategory}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoriesList.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setTopic("");
                      setActiveResponse(null);
                    }}
                    className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-white dark:bg-gray-900/60 border-gray-100 dark:border-gray-900 hover:border-indigo-500/30 hover:bg-gray-50/50 dark:hover:bg-gray-900/80 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {/* Decorative flare on hover */}
                    <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-indigo-500/5 group-hover:scale-150 transition-transform duration-300 pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl transition-all ${
                        isSelected 
                          ? "bg-white/20 text-white" 
                          : "bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105"
                      }`}>
                        {renderCategoryIcon(cat.id)}
                      </div>
                      
                      {/* Active category check indicator */}
                      {isSelected && (
                        <span className="bg-white/25 text-white p-1 rounded-full text-xs">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    <h4 className={`font-sans font-bold text-base mb-1 ${
                      isSelected ? "text-white" : "text-gray-900 dark:text-white"
                    }`}>
                      {lang === "en" ? cat.titleEn : cat.titleBn}
                    </h4>
                    
                    <p className={`text-xs ${
                      isSelected ? "text-indigo-100" : "text-gray-400 dark:text-gray-500"
                    } line-clamp-2 leading-relaxed`}>
                      {lang === "en" ? cat.descEn : cat.descBn}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* D. Topic formulation generator input container */}
          <section className="bg-white/70 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-900 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />
            
            <form onSubmit={handleGeneratePrompt} className="space-y-6">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3.5 flex items-center">
                  <CornerDownRight className="h-4.5 w-4.5 mr-2 text-indigo-500" />
                  {dict.enterTopicLabel} (
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {lang === "en" ? currentCategoryObj?.titleEn : currentCategoryObj?.titleBn}
                  </span>
                  )
                </label>
                
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={lang === "en" ? currentCategoryObj?.placeholderEn : currentCategoryObj?.placeholderBn}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-4 font-sans text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-gray-900 dark:text-orange-50 placeholder-gray-400 leading-relaxed"
                  disabled={loading}
                />
              </div>

              {/* Keyword recommendations of category */}
              {currentCategoryObj && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {dict.trySuggestions}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "en" ? currentCategoryObj.suggestionsEn : currentCategoryObj.suggestionsBn).map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTopic(sug)}
                        className="text-xs bg-gray-50 dark:bg-gray-900 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-gray-600 dark:text-gray-400 px-3.5 py-2 border border-gray-100 dark:border-gray-800 rounded-xl font-medium transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons controls */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 border-t border-gray-100 dark:border-gray-900 pt-5">
                <div className="text-xs text-gray-400 font-mono">
                  {lang === "en" ? "Ready parameters parsed natively" : "ইনপুট প্যারামিটার অটোমেটিক বিশ্লেষণ করা হবে"}
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  {topic.trim() && (
                    <button
                      type="button"
                      onClick={() => setTopic("")}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 font-semibold text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all uppercase tracking-wider"
                    >
                      {lang === "en" ? "Clear" : "মুছে ফেলুন"}
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !topic.trim()}
                    className={`flex-1 sm:flex-none flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      loading || !topic.trim()
                        ? "bg-gray-300 dark:bg-gray-800 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-tr from-indigo-600 to-purple-600 hover:shadow-indigo-600/25 cursor-pointer transform hover:translate-y-[-1px] hover:brightness-105"
                    }`}
                  >
                    <Sparkles className={`h-4.5 w-4.5 ${loading ? "animate-spin" : ""}`} />
                    <span>{loading ? dict.generatingBtn : dict.generateBtn}</span>
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* E. Prompt Result Display Card */}
          {activeResponse && (
            <PromptCard 
              data={activeResponse}
              category={activeCategory || "image"}
              topic={topic}
              lang={lang}
              dict={dict}
              isFavorite={isCurrentlyFavorited()}
              onToggleFavorite={handleActiveFavoriteToggle}
              onRegenerate={handleGeneratePrompt}
              onCopy={() => showToast(dict.copiedToast)}
            />
          )}

          {/* F. Local History List Display block */}
          <PromptHistory 
            prompts={history}
            lang={lang}
            dict={dict}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
            onDeletePrompt={handleDeletePrompt}
            onSelectPrompt={handleSelectPrompt}
          />
        </main>
      </div>

      {/* 4. Global Temporary Notification Toast Box */}
      {toastMessage && (
        <div 
          id="toast-notification-panel"
          className="fixed bottom-6 right-6 bg-slate-900/95 dark:bg-gray-150 text-white dark:text-gray-950 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 dark:border-gray-200 flex items-center space-x-3.5 z-[99999] animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
        >
          <div className="h-5 w-5 bg-indigo-500/10 text-indigo-400 dark:text-indigo-600 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3" />
          </div>
          <p className="text-xs font-semibold font-sans">
            {toastMessage}
          </p>
        </div>
      )}
    </div>
  );
}
