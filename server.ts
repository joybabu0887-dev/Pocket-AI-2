import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      // Return a dummy client or throw error that we can handle gracefully
      console.warn("WARNING: GEMINI_API_KEY is not configured or still has placeholder value.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Prompt Generation API Endpoint
app.post("/api/generate", async (req, res): Promise<any> => {
  const { topic, category, language } = req.body;

  if (!topic || !category) {
    return res.status(400).json({ error: "Topic and Category are required fields." });
  }

  try {
    const ai = getAiClient();
    
    // Check if API key is present
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      // If no valid key is configured, let's provide a beautiful mock realistic response 
      // but clearly message that we are in "Demo Mode" so the system is fully robust either way!
      const demoResponse = getDemoPrompt(category, topic, language || "en");
      return res.json({
        success: true,
        isDemo: true,
        ...demoResponse
      });
    }

    // Category descriptions and system prompt definitions for Gemini
    let categoryDetails = "";
    if (category === "logo") {
      categoryDetails = "Create a detailed, creative description for a graphic logo design. Focus on lines, vector elements, colors, shape, minimalism vs mascot, layout, branding mood, and artistic style (e.g., flat, 3D, emblem, lettermark). Ensure it describes a visual concept that an image generator can easily transform into a high-quality logo.";
    } else if (category === "poster") {
      categoryDetails = "Create a professional design description for an advertising, event, movie, or artistic poster. Include composition depth, color schemes, light treatments, atmospheric styles (e.g., retro, cyberpunk, vintage, high-contrast flat), specific visual focal points, and typography placement descriptions.";
    } else if (category === "thumbnail") {
      categoryDetails = "Create an incredibly eye-catching YouTube thumbnail design prompt optimized for extremely high CTR (Click-Through Rate). Emphasize high contrast, strong expressions, bold colors, visual hierarchy, minimal clean layout (no tiny details), and specific emotional focal points.";
    } else {
      categoryDetails = "Create a vivid, realistic, deeply detailed cinematic or artistic prompt for standard image generation models (Midjourney, Stable Diffusion, Imagen). Include details on camera models, lighting type (volumetric, dramatic, golden hour), environment, texture details, depth of field, and stylistic influences.";
    }

    const systemInstruction = `You are "Pocket AI", a premium, state-of-the-art AI Prompt Generator. Your task is to output a professional, ready-to-copy image generation prompt based on the user's input topic, tailored beautifully.

The output MUST be in valid JSON format with exact keys:
{
  "prompt": "the exact copyable prompt in English (always in English as image generation models only understand English)",
  "title": "A short beautiful title for the prompt",
  "explanation": "A detailed professional explanation of the prompt's key details and visual choices",
  "aspectRatio": "recommended aspect ratio, e.g. 1:1, 16:9, 9:16",
  "negativePrompt": "things to avoid, e.g. low quality, blurry, text overlay in bad places",
  "proTips": [
    "Tip 1 for generating or customizing",
    "Tip 2 for getting the best result"
  ]
}

Instructions for Language formatting:
- If language is "bn" (Bangla), output the "title", "explanation", "proTips" in elegant, highly professional Bengala language. Keep the key names exact as specified in English, but translate the values. The main "prompt" and "negativePrompt" values must still remain in English as image generators do not understand Bangla prompts well, but make sure the content is extremely descriptive!
- If language is "en" (English), output all values in English.
- Do not include any JSON markdown wrapping around the output (e.g. do not add \`\`\`json or \`\`\`), output raw valid JSON string only. If anything fails, return valid JSON format.`;

    const userPrompt = `Generate a prompt for Category: "${category}" (${categoryDetails}).
Topic entered by user: "${topic}".
Output language specified: "${language === "bn" ? "Bangla" : "English"}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText.trim());
      return res.json({
        success: true,
        isDemo: false,
        ...parsed
      });
    } catch (parseError) {
      console.error("JSON parse error from Gemini output:", responseText, parseError);
      // Fallback if parsing failed
      return res.json({
        success: true,
        isDemo: true,
        ...getDemoPrompt(category, topic, language || "en")
      });
    }

  } catch (error: any) {
    console.error("Gemini API execution error:", error);
    // Let's provide an elegant fallback response rather than breaking the application
    const fallback = getDemoPrompt(category, topic, language || "en");
    res.json({
      success: true,
      error: error.message || "Something went wrong",
      isDemo: true,
      ...fallback
    });
  }
});

// Helper function to generate clean standard prompts when API key is missing or system is in demo state
function getDemoPrompt(category: string, topic: string, lang: string) {
  const isBn = lang === "bn";
  if (category === "logo") {
    return {
      title: isBn ? `"${topic}" ব্র্যান্ড লোগো` : `"${topic}" Brand Logo Concept`,
      prompt: `Vector logo for "${topic}", minimalist modern design, clean lines, flat colors, white background, high resolution, geometric shape, professional branding, SVG style, corporate symbol, elegant typography spacing.`,
      explanation: isBn 
        ? `এটি "${topic}" ব্র্যান্ডের জন্য একটি অত্যন্ত সুন্দর এবং আধুনিক ডিজাইন। লোগোটি তৈরি করা হয়েছে জ্যামিতিক লাইনের মেলবন্ধনে, যা যেকোনো আধুনিক মিডিয়ামে চমৎকার দেখাবে। ব্যাকগ্রাউন্ড রাখা হয়েছে স্বচ্ছ সাদা ফ্রেম যাতে লোগোটির মূল ডিজাইনে ফোকাস থাকে।`
        : `This minimalist, high-impact vector logo is designed to represent "${topic}" with clean geometric forms. It features flat corporate colors ideal for modern brand assets, presenting high readability at various sizes.`,
      aspectRatio: "1:1",
      negativePrompt: "photorealistic, shades, complex gradients, shadows, text, signature, watermark, blurry, realistic details",
      proTips: isBn 
        ? [
            "রঙ কাস্টমাইজ করতে Midjourney তে 'matte primary orange' বা আপনার ব্র্যান্ডের কালার যোগ করতে পারেন।",
            "সম্পূর্ণ ফ্ল্যাট ডিজাইনের জন্য DALL-E তে 'flat 2d vector design' কিওয়ার্ডটি যুক্ত রাখুন।"
          ]
        : [
            "To customize colors, inject your brand palette (e.g., 'deep teal and warm bronze') into the prompt.",
            "For a purely isolated background, define '--no background shadows' in Midjourney."
          ]
    };
  } else if (category === "poster") {
    return {
      title: isBn ? `"${topic}" থিমড ক্রিয়েটিভ পোস্টার` : `"${topic}" Creative Poster Concept`,
      prompt: `Professional high-contrast graphic poster artwork of "${topic}", creative typography layout, bold complementary color scheme, dramatic lighting, sharp focus, aesthetic graphic design elements, Swiss style minimalism merged with modern vector digital art, 8k resolution.`,
      explanation: isBn 
        ? `"${topic}" থিমকে কেন্দ্র করে তৈরি করা একটি চমৎকার ইনফোগ্রাফিক বা ইভেন্ট পোস্টার। সুইশ মিনিমালিজম এবং ড্রামাটিক লাইটিংয়ের ব্যবহার পোস্টারটিকে দারুণ আকর্ষণীয় করে তুলেছে। নিখুঁত রঙের ব্যবহার সহজেই মানুষের নজর কাড়বে।`
        : `This highly compelling graphic poster is optimized for storytelling around "${topic}". Mixing modern digital vector artwork with bold typography layers, the design establishes high contrast to pull the viewer's eyes to the central theme.`,
      aspectRatio: "3:4",
      negativePrompt: "unclear focal point, boring text, bad formatting, low contrast, out of frame, pixelated, noisy, low definition",
      proTips: isBn 
        ? [
            "আপনি যদি সিনেমাটিক মুড চান, তাহলে প্রম্পটে 'neon glow' বা 'dark cyberpunk atmosphere' যুক্ত করতে পারেন।",
            "পোস্টারের সাইজ লম্বালম্বি রাখার জন্য অবশ্যই '--ar 3:4' বা '--ar 9:16' রেশিও ব্যবহার করুন।"
          ]
        : [
            "For cinematic layouts, append keywords such as 'cinematic volumetric fog, atmospheric cyberpunk styling'.",
            "Use aspect ratio parameters such as '--ar 3:4' or '--ar 9:16' for standard print sizing."
          ]
    };
  } else if (category === "thumbnail") {
    return {
      title: isBn ? `উচ্চ CTR "${topic}" ইউটিউব থাম্বনেইল` : `High CTR "${topic}" YouTube Thumbnail`,
      prompt: `Eye-catching YouTube thumbnail design starring a prominent 3D rendered graphic about "${topic}", ultra-vibrant colors, glowing neon borders, extreme high contrast, clear foreground object holding attention, empty right side for title overlay, super sharp details, 4k.`,
      explanation: isBn 
        ? `এই থাম্বনেইলটি সর্বোচ্চ ক্লিক রেট (CTR) পাওয়ার জন্য অপ্টিমাইজড। এতে উচ্চমাত্রার উজ্জ্বল রঙ ও নিয়ন গ্লো ব্যবহার করা হয়েছে যাতে মোবাইল স্ক্রিনে এটি স্ক্রল করার সময় সহজেই চোখে পড়ে। মূল সাবজেক্টকে পপ-আউট করা হয়েছে।`
        : `An optimized thumbnail designed specifically for modern YouTube CTR guidelines. Using hyper-vibrant contrasting tones alongside sharp radial background glows, it accentuates "${topic}" to immediately grab attention in suggestions.`,
      aspectRatio: "16:9",
      negativePrompt: "small unreadable text, blurry details, chaotic background, low lights, multiple tiny subjects, low contrast",
      proTips: isBn 
        ? [
            "থাম্বনেইলে মানুষের এক্সপ্রেশন চান? প্রম্পটে 'shocked expressive face' শব্দটি যোগ করুন।",
            "ব্যাকগ্রাউন্ড হালকা ঝাপসা করার জন্য 'shallow depth of field, blurred studio background' জুড়ে দিতে পারেন।"
          ]
        : [
            "To include realistic expressions, specify 'expressive human face with shocked reaction looking forward'.",
            "Keep the background simplified by using 'heavily blurred backplate with radial color burst'."
          ]
    };
  } else {
    return {
      title: isBn ? `"${topic}" রিয়েলিস্টিক আর্ট প্রম্পট` : `Cinematic "${topic}" AI Image Prompt`,
      prompt: `Photorealistic close-up photo of "${topic}", hyper-detailed textures, shot on 85mm lens, f/1.8 aperture, incredible details, cinematic volumetric lighting, soft depth of field, dramatic shadows, realistic skin or surface reflection, highly atmospheric masterpiece.`,
      explanation: isBn 
        ? `এটি অত্যন্ত বাস্তবসম্মত এবং সিনেমাটিক ইমেজ তৈরির জন্য একটি নিখুঁত প্রম্পট। পোর্ট্রেট বা নির্দিষ্ট সাবজেক্টকে ফোকাস করে ৮৫ মিমি লেন্সের ডেপথ-অফ-ফিল্ড এবং ড্রামাটিক গোল্ডেন গোল্ডেন লাইটিংয়ের অনুভূতি তৈরি করা হয়েছে।`
        : `A high-end cinematic photography prompt designed to push photorealistic renderers to their limit. Relying on professional camera optics (85mm lens, f/1.8 aperture) combined with light rays, this highlights realistic surface details and shadows.`,
      aspectRatio: "16:9",
      negativePrompt: "illustrations, anime, sketch, cartoon, low quality, unnatural eyes, double limbs, deformed, duplicate, CG render",
      proTips: isBn 
        ? [
            "ছবিটিকে দিনের ভিন্ন সময়ে নিয়ে যেতে 'golden hour glow' অথবা 'overcast moody light' ব্যবহার করুন।",
            "আরো বাস্তবসম্মত টেক্সচারের জন্য 'micro fiber details' বা 'pore texture' শব্দগুলো যুক্ত করা যেতে পারে।"
          ]
        : [
            "Modify the mood by altering the time of day, e.g., 'shot during sunrise golden hour' or 'under soft twilight glow'.",
            "Add camera profiles such as 'shot on Hasselblad camera with natural color rendition' for superior aesthetic quality."
          ]
    };
  }
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
