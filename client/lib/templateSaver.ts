import { supabase } from './supabase';
import { toast } from 'sonner';

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

export const saveTemplateToSupabase = async (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig
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

  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'));
    }, 10000); // 10 second timeout
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

    console.log("📤 Saving template to Supabase...", templateToSave);

    // Race between save operation and timeout
    const savePromise = supabase
      .from("custom_templates")
      .insert(templateToSave)
      .select()
      .single();

    const { data, error } = await Promise.race([savePromise, timeoutPromise]);

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
    console.error("Template save error:", err);
    toast.dismiss("saving-template");

    // Handle different error types
    if (err.message === 'Timeout') {
      // Try localStorage fallback on timeout
      const fallbackResult = saveTemplateToLocalStorage(user, templateData, config);
      toast.warning("⚠️ Vaqt tugadi", {
        description: "Shablon mahalliy xotiraga saqlandi",
        duration: 5000,
      });
      return fallbackResult;
    }

    // For other errors, also fallback to localStorage
    const fallbackResult = saveTemplateToLocalStorage(user, templateData, config);
    
    const errorMessage = err?.message || "Noma'lum xatolik";
    toast.warning("⚠️ Shablon mahalliy xotiraga saqlandi", {
      description: `Bazaga ulanib bo'lmadi: ${errorMessage}`,
      duration: 5000,
    });

    return { 
      success: false, 
      error: errorMessage,
      data: fallbackResult.data 
    };
  }
};

export const saveTemplateToLocalStorage = (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig
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
      JSON.stringify(fallbackTemplate)
    );

    console.log("✅ Template saved to localStorage:", fallbackTemplate);
    return { success: true, data: fallbackTemplate };
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
    return { success: false, data: null };
  }
};
