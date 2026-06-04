export type CategoryId = "logo" | "poster" | "thumbnail" | "image";

export interface Category {
  id: CategoryId;
  iconName: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  placeholderEn: string;
  placeholderBn: string;
  suggestionsEn: string[];
  suggestionsBn: string[];
}

export interface GeneratedResponse {
  prompt: string;
  title: string;
  explanation: string;
  aspectRatio: string;
  negativePrompt: string;
  proTips: string[];
  isDemo?: boolean;
}

export interface SavedPrompt {
  id: string;
  timestamp: number;
  category: CategoryId;
  topic: string;
  language: "en" | "bn";
  data: GeneratedResponse;
  isFavorite: boolean;
}

export interface Dict {
  welcomeTitle: string;
  welcomeSubtitle: string;
  selectLanguage: string;
  chooseCategory: string;
  enterTopicLabel: string;
  enterTopicPlaceholderAlt: string;
  generateBtn: string;
  generatingBtn: string;
  regenerateBtn: string;
  copyBtn: string;
  copiedBtn: string;
  downloadBtn: string;
  downloadingBtn: string;
  favoriteTooltip: string;
  unfavoriteTooltip: string;
  searchPlaceholder: string;
  noResults: string;
  historyTitle: string;
  favoritesTitle: string;
  clearHistory: string;
  noHistoryYet: string;
  demoModeWarning: string;
  aspectRatioLabel: string;
  negativePromptLabel: string;
  proTipsLabel: string;
  explanationLabel: string;
  sidebarToolsHeader: string;
  sidebarDevHeader: string;
  sidebarSubTitle: string;
  trySuggestions: string;
  placeholderLogoLabel: string;
  activePromptHeader: string;
  searchFilterAll: string;
  saveToast: string;
  unsaveToast: string;
  deleteToast: string;
  copiedToast: string;
}

export const translationEn: Dict = {
  welcomeTitle: "Pocket AI",
  welcomeSubtitle: "Generate highly professional prompts for creative design models instantly with Gemini intelligence.",
  selectLanguage: "Select Language / ভাষা নির্বাচন করুন",
  chooseCategory: "Choose Design Category",
  enterTopicLabel: "Enter your design concept or topic",
  enterTopicPlaceholderAlt: "Describe what you want to create (e.g., organic coffee shop, sci-fi astronaut)...",
  generateBtn: "Generate Professional Prompt",
  generatingBtn: "Cooking Prompt with Gemini...",
  regenerateBtn: "Regenerate Prompt",
  copyBtn: "Copy Prompt",
  copiedBtn: "Copied!",
  downloadBtn: "Download PDF/Image Sheet",
  downloadingBtn: "Preparing Download...",
  favoriteTooltip: "Save to Favorites",
  unfavoriteTooltip: "Remove from Favorites",
  searchPlaceholder: "Search in history & favorites...",
  noResults: "No saved prompts matched your query.",
  historyTitle: "Prompt History",
  favoritesTitle: "Your Favorites",
  clearHistory: "Clear All History",
  noHistoryYet: "No prompts generated yet. Start cooking above!",
  demoModeWarning: "Ready to connect standard GEMINI_API_KEY! Currently running on pre-optimized design algorithms.",
  aspectRatioLabel: "Recommended Aspect Ratio",
  negativePromptLabel: "Negative Prompt Keywords",
  proTipsLabel: "Pocket Pro Tips",
  explanationLabel: "Aesthetic Composition Explanation",
  sidebarToolsHeader: "AI Models & Playgrounds",
  sidebarDevHeader: "Developer Portals",
  sidebarSubTitle: "AI Craft Station",
  trySuggestions: "Or try a popular concept:",
  placeholderLogoLabel: "UPLOAD LOGO PLACEHOLDER",
  activePromptHeader: "Generated Masterpiece Prompt",
  searchFilterAll: "All Categories",
  saveToast: "Added to favorites!",
  unsaveToast: "Removed from favorites!",
  deleteToast: "Prompt deleted from history",
  copiedToast: "Copied to clipboard successfully!"
};

export const translationBn: Dict = {
  welcomeTitle: "পকেট এআই",
  welcomeSubtitle: "জেমিনি এআই দিয়ে ডিজাইনের জন্য সেরা এবং প্রফেশনাল প্রম্পট তৈরি করুন মুহূর্তের মধ্যেই।",
  selectLanguage: "Select Language / ভাষা নির্বাচন করুন",
  chooseCategory: "ডিজাইন ক্যাটাগরি বেছে নিন",
  enterTopicLabel: "আপনার ডিজাইন আইডিয়া বা টপিক লিখুন",
  enterTopicPlaceholderAlt: "আপনি যা তৈরি করতে চান তা সংক্ষেপে লিখুন (যেমন: অর্গানিক কফি শপ, সায়েন্স ফিকশন নভোচারী)...",
  generateBtn: "প্রফেশনাল প্রম্পট তৈরি করুন",
  generatingBtn: "জেমিনি প্রম্পট বানাচ্ছে...",
  regenerateBtn: "পুনরায় তৈরি করুন",
  copyBtn: "প্রম্পট কপি করুন",
  copiedBtn: "কপি হয়েছে!",
  downloadBtn: "ডাউনলোড শিট",
  downloadingBtn: "ডাউনলোড হচ্ছে...",
  favoriteTooltip: "ফেভারিট করুন",
  unfavoriteTooltip: "ফেভারিট থেকে বাদ দিন",
  searchPlaceholder: "ইতিহাস ও ফেভারিটে খুঁজুন...",
  noResults: "কোনো সংরক্ষিত প্রম্পট খুঁজে পাওয়া যায়নি।",
  historyTitle: "তৈরিকৃত প্রম্পট হিস্ট্রি",
  favoritesTitle: "আপনার ফেভারিট তালিকা",
  clearHistory: "সব ইতিহাস মুছে ফেলুন",
  noHistoryYet: "এখনো কোনো প্রম্পট তৈরি করা হয়নি। উপরে গিয়ে ঝটপট তৈরি করে ফেলুন!",
  demoModeWarning: "GEMINI_API_KEY দ্বারা চালিত হওয়ার জন্য প্রস্তুত! বর্তমানে উন্নত লোকাল অ্যালগরিদমে চলছে।",
  aspectRatioLabel: "প্রস্তাবিত অ্যাসপেক্ট রেশিও",
  negativePromptLabel: "নেগেটিভ প্রম্পট কিওয়ার্ড",
  proTipsLabel: "পকেট প্রো টিপস",
  explanationLabel: "ডিজাইন ও নান্দনিক ব্যাকব্যাখ্যা",
  sidebarToolsHeader: "এআই টুলস এবং প্লেগ্রাউন্ড",
  sidebarDevHeader: "ডেভেলপার পোর্টালস",
  sidebarSubTitle: "এআই ক্রাফট স্টেশন",
  trySuggestions: "অথবা নিচের জনপ্রিয় টিপসগুলো ট্রাই করুন:",
  placeholderLogoLabel: "আপলোড লোগো প্লেসহোল্ডার",
  activePromptHeader: "জেনারেটেড মাস্টারপিস প্রম্পট",
  searchFilterAll: "সব ক্যাটাগরি",
  saveToast: "ফেভারিট তালিকায় যুক্ত করা হয়েছে!",
  unsaveToast: "ফেভারিট তালিকা থেকে বাদ দেওয়া হয়েছে!",
  deleteToast: "ইতিহাস থেকে প্রম্পট মুছে ফেলা হয়েছে",
  copiedToast: "ক্লিপবোর্ডে সফলভাবে কপি করা হয়েছে!"
};

export const categoriesList: Category[] = [
  {
    id: "logo",
    iconName: "Compass",
    titleEn: "Logo Design",
    titleBn: "লোগো ডিজাইন",
    descEn: "Clean vectors, brand icons & minimalist marks",
    descBn: "ক্লিন ভেক্টর, ব্র্যান্ড আইকন এবং মিনিমালিস্ট ডিজাইন",
    placeholderEn: "e.g., Luxury organic honey jar brand mascot logo",
    placeholderBn: "যেমন: লাক্সারি অর্গানিক মধু ব্র্যান্ডের মাসকট লোগো",
    suggestionsEn: ["Gourmet Coffee Shop", "Eco Tech Startup", "Retro Barber Icon", "Cyberpunk Apparel Logo"],
    suggestionsBn: ["কফি শপ ব্র্যান্ড", "ইকো টেক স্টার্টআপ", "রেট্রো সেলুন লোগো", "সাইবারপাংক গেমিং লোগো"]
  },
  {
    id: "poster",
    iconName: "Layers",
    titleEn: "Poster Design",
    titleBn: "পোস্টার ডিজাইন",
    descEn: "Stunning Swiss compositions & high-impact visual banners",
    descBn: "সুইস কম্পোজিশন, সিনেমাটিক আর্ট এবং হাই-ইমপ্যাক্ট ব্যানার",
    placeholderEn: "e.g., Retro cyberpunk synthwave concert poster with bold typography",
    placeholderBn: "যেমন: বোল্ড টাইপোগ্রাফি সহ রেট্রো সাইবারপাংক মিউজিক কনসার্ট পোস্টার",
    suggestionsEn: ["Sci-Fi Film Festival", "Organic Farmers Market", "Neon Jazz Night", "Tokyo Street Travel Banner"],
    suggestionsBn: ["সায়েন্স-ফিকশন ফিল্ম ফেস্টিভ্যাল", "কৃষি মেলা পোস্টার", "নিয়ন জ্যাজ নাইট", "টোকিও ট্রাভেল পোস্টার"]
  },
  {
    id: "thumbnail",
    iconName: "Youtube",
    titleEn: "Thumbnail Design",
    titleBn: "থাম্বনেইল ডিজাইন",
    descEn: "High-CTR layouts, vibrant accents & focal points",
    descBn: "উচ্চ-CTR ভিউ ডিজাইন এবং নজরকাড়া কালার গ্লো থাম্বনেইল",
    placeholderEn: "e.g., Extreme survival challenge thumbnail, bright neon contrast",
    placeholderBn: "যেমন: চরম সারভাইভাল চ্যালেঞ্জ থাম্বনেইল, উজ্জ্বল নিয়ন লাইট ইফেক্ট",
    suggestionsEn: ["100 Days Coding Challenge", "Unboxing AI Gadgets", "Secrets of Space", "Ultimate Food Review"],
    suggestionsBn: ["১০০ দিনের কোডিং চ্যালেঞ্জ", "এআই গ্যাজেট আনবক্সিং", "মহাকাশের রহস্য রহস্য", "বিখ্যাত ইটিং চ্যালেঞ্জ"]
  },
  {
    id: "image",
    iconName: "Sparkles",
    titleEn: "AI Image Prompts",
    titleBn: "এআই ইমেজ প্রম্পট",
    descEn: "Photorealistic landscapes, 3D renders & beautiful details",
    descBn: "বাস্তবধর্মী ছবি, নান্দনিক থ্রিডি রেন্ডার এবং বাস্তব টেক্সচার",
    placeholderEn: "e.g., Masterpiece photograph of misty redwood forest during golden hour",
    placeholderBn: "যেমন: সূর্যাস্তের সময় কুয়াশাচ্ছন্ন পাইন বনের বাস্তবসম্মত মাস্টারপিস ছবি",
    suggestionsEn: ["Futuristic Megacity Hub", "Medieval Library Interior", "Steampunk Airship", "Mystic Desert Oasis"],
    suggestionsBn: ["ভবিষ্যতের মেগাসিটি হাব", "প্রাচীন রাজকীয় লাইব্রেরি", "স্টিমপাঙ্ক যুদ্ধজাহাজ", "মরুভূমির রহস্যময় ওয়েসিস"]
  }
];
