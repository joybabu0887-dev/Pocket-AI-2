import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  lang: "en" | "bn";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle, lang }) => {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      aria-label="Toggle Theme"
      title={isDark ? (lang === "en" ? "Switch to Light Mode" : "লাইট মোড চালু করুন") : (lang === "en" ? "Switch to Dark Mode" : "ডার্ক মোড চালু করুন")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600" />
      )}
    </button>
  );
};
