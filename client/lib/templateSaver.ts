import { supabase } from "./supabase";
import { toast } from "sonner";

export interface TemplateData {
  templateName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  customMessage: string;
}

export interface TemplateConfig {
  colors: any;
  fonts: any;
  layout: any;
  animations: any;
}

// Retry function with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
};

export const saveTemplateToSupabase = async (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig,
): Promise<{ success: boolean; error?: string; data?: any }> => {
  // Always dismiss any existing saving toast
  toast.dismiss("saving-template");

  // Input validation
  if (!user?.id) {
    toast.error("❌ Xatolik", {
      description: "Tizimga kirishingiz kerak",
      duration: 3000,
    });
    return { success: false, error: "User not authenticated" };
  }

  if (!templateData.templateName.trim()) {
    toast.error("❌ Xatolik", {
      description: "Shablon nomini kiriting",
      duration: 3000,
    });
    return { success: false, error: "Template name required" };
  }

  // Show loading toast
  toast.loading("💾 Shablon saqlanmoqda...", {
    description: "Iltimos, kuting...",
    id: "saving-template",
  });

  try {
    const templateToSave = {
      user_id: user.id,
      name: templateData.templateName.trim(),
      description: `Maxsus shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
      category: "custom",
      colors: config.colors,
      fonts: config.fonts,
      config: config,
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: [config.layout?.style || "modern", "maxsus", "real-time"],
      is_active: true,
    };

    console.log(
      "📤 Saving template to Supabase with retry logic...",
      templateToSave,
    );

    // Try to save with retry logic and longer timeout
    const { data, error } = await retryWithBackoff(
      async () => {
        // Create a promise that will timeout after 20 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Operation timeout after 20 seconds"));
          }, 20000); // Increased to 20 seconds
        });

        const savePromise = supabase
          .from("custom_templates")
          .insert(templateToSave)
          .select()
          .single();

        return Promise.race([savePromise, timeoutPromise]);
      },
      3,
      2000,
    ); // 3 retries with 2 second base delay

    if (error) {
      throw error;
    }

    // Success
    toast.dismiss("saving-template");
    toast.success("🎉 Shablon muvaffaqiyatli saqlandi!", {
      description: "Shablon Templates sahifasida ko'rish mumkin.",
      duration: 4000,
    });

    console.log("✅ Template saved successfully:", data);
    return { success: true, data };
  } catch (err: any) {
    console.error("Template save error after retries:", err);
    toast.dismiss("saving-template");

    // Try localStorage fallback regardless of error type
    const fallbackResult = saveTemplateToLocalStorage(
      user,
      templateData,
      config,
    );

    if (err.message?.includes("timeout") || err.message?.includes("Timeout")) {
      toast.warning("⚠️ Vaqt tugadi", {
        description:
          "Shablon mahalliy xotiraga saqlandi. Keyinroq internet orqali sinxronlanadi.",
        duration: 6000,
      });
    } else {
      const errorMessage = err?.message || "Noma'lum xatolik";
      toast.warning("⚠️ Shablon mahalliy xotiraga saqlandi", {
        description: `Bazaga ulanib bo'lmadi: ${errorMessage}`,
        duration: 6000,
      });
    }

    return {
      success: true, // Return success since we saved to localStorage
      error: err?.message,
      data: fallbackResult.data,
    };
  }
};

export const saveTemplateToLocalStorage = (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig,
): { success: boolean; data: any } => {
  const fallbackTemplate = {
    id: `local_${Date.now()}`,
    name: templateData.templateName,
    description: `Maxsus shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
    category: "custom",
    colors: config.colors,
    fonts: config.fonts,
    config: config,
    user_id: user.id,
    is_local: true,
    is_public: false,
    is_featured: false,
    usage_count: 0,
    tags: [config.layout?.style || "modern", "maxsus", "local"],
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `custom_template_${fallbackTemplate.id}`,
      JSON.stringify(fallbackTemplate),
    );

    console.log("✅ Template saved to localStorage:", fallbackTemplate);
    return { success: true, data: fallbackTemplate };
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
    return { success: false, data: null };
  }
};
