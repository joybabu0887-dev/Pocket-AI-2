import React, { useState } from "react";
import { 
  Search, 
  Trash, 
  Copy, 
  Check, 
  Heart, 
  Clock, 
  ExternalLink,
  Compass,
  Layers,
  Youtube,
  Sparkles,
  Inbox
} from "lucide-react";
import { SavedPrompt, Dict, CategoryId } from "../types";

interface PromptHistoryProps {
  prompts: SavedPrompt[];
  lang: "en" | "bn";
  dict: Dict;
  onToggleFavorite: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onSelectPrompt: (prompt: SavedPrompt) => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({
  prompts,
  lang,
  dict,
  onToggleFavorite,
  onDeletePrompt,
  onSelectPrompt
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHistoryTab, setActiveHistoryTab] = useState<"all" | "favorites">("all");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCategoryIcon = (category: CategoryId) => {
    switch (category) {
      case "logo":
        return <Compass className="h-4 w-4 text-indigo-500" />;
      case "poster":
        return <Layers className="h-4 w-4 text-purple-500" />;
      case "thumbnail":
        return <Youtube className="h-4 w-4 text-rose-500" />;
      case "image":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
    }
  };

  const getCategoryText = (category: CategoryId) => {
    switch (category) {
      case "logo":
        return lang === "en" ? "Logo" : "লোগো";
      case "poster":
        return lang === "en" ? "Poster" : "পোস্টার";
      case "thumbnail":
        return lang === "en" ? "Thumbnail" : "থাম্বনেইল";
      case "image":
        return lang === "en" ? "AI Image" : "এআই প্রম্পট";
    }
  };

  const copyToClipboard = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter criteria
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = 
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.data.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.data.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeHistoryTab === "all" ? true : p.isFavorite;

    const matchesCategory = activeCategoryFilter === "all" ? true : p.category === activeCategoryFilter;

    return matchesSearch && matchesTab && matchesCategory;
  });

  return (
    <div 
      id="prompt-history-box"
      className="bg-white/60 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-lg backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-900">
        <div>
          <h3 className="font-sans font-bold text-lg text-gray-900 dark:text-white flex items-center">
            <Clock className="mr-2 h-5 w-5 text-indigo-500" />
            {activeHistoryTab === "all" ? dict.historyTitle : dict.favoritesTitle}
            <span className="ml-2.5 text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.2 py-0.5 rounded-full font-bold">
              {filteredPrompts.length}
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "en" ? "Review or recall generated items locally" : "আপনার ব্রাউজারে সংরক্ষিত কাজগুলো এখানে দেখুন"}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-0.5 bg-gray-100 dark:bg-gray-900 rounded-xl grow sm:grow-0 w-full md:w-auto">
          <button
            onClick={() => setActiveHistoryTab("all")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeHistoryTab === "all"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {lang === "en" ? "History" : "হিস্ট্রি"}
          </button>
          <button
            onClick={() => setActiveHistoryTab("favorites")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeHistoryTab === "favorites"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/15"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {lang === "en" ? "Favorites" : "ফেভারিটস"}
          </button>
        </div>
      </div>

      {/* Instant Search Bar and Category filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 text-sm bg-white/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white placeholder-gray-400 font-sans"
          />
        </div>

        {/* Quick Category filter buttons inside History */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter("all")}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
              activeCategoryFilter === "all"
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                : "bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {dict.searchFilterAll}
          </button>
          {(["logo", "poster", "thumbnail", "image"] as CategoryId[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 flex items-center space-x-1 ${
                activeCategoryFilter === cat
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                  : "bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{getCategoryText(cat)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List */}
      <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPrompt(item)}
              className="group/item relative border border-gray-100 dark:border-gray-900/70 hover:border-indigo-500/20 dark:hover:border-indigo-500/40 bg-white/55 dark:bg-gray-900/10 hover:bg-white dark:hover:bg-gray-900/30 p-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                    {getCategoryText(item.category)} • {item.language === "bn" ? "🇧🇩 বাংলা" : "🇺🇸 En"}
                  </span>
                </div>

                <div className="flex items-center space-x-1 opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-opacity">
                  {/* Toggle favorite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`p-1.5 rounded-lg border transition-all ${
                      item.isFavorite
                        ? "bg-rose-500/10 border-rose-200 dark:border-rose-900/30 text-rose-500"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50/50"
                    }`}
                    title="Toggle Favorite"
                  >
                    <Heart className={`h-3.5 w-3.5 ${item.isFavorite ? "fill-rose-500" : ""}`} />
                  </button>

                  {/* Copy Prompt Text directly */}
                  <button
                    onClick={(e) => copyToClipboard(e, item.data.prompt, item.id)}
                    className="p-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all"
                    title="Copy prompt text instantly"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Trash Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePrompt(item.id);
                    }}
                    className="p-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition-all"
                    title="Delete record"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Title representation */}
              <h4 className="font-sans font-bold text-sm text-gray-900 dark:text-gray-100 group-hover/item:text-indigo-500 transition-colors line-clamp-1 mb-1">
                {item.data.title || item.topic}
              </h4>

              {/* Prompt snippet */}
              <p className="font-mono text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
                {item.data.prompt}
              </p>

              {/* Footer Timestamp info */}
              <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-mono">
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                {item.data.aspectRatio && (
                  <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase font-bold text-[9px]">
                    Ratio: {item.data.aspectRatio}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-100 dark:border-gray-900/50 bg-gray-50/20 dark:bg-gray-900/5">
            <Inbox className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {prompts.length === 0 ? dict.noHistoryYet : dict.noResults}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
