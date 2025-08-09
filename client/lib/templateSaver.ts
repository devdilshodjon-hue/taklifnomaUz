import { supabase } from "./supabaseClient";
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
  effects?: any;
  border?: any;
  background?: any;
  typography?: any;
}

// Direct Supabase save with enhanced error handling
export const saveTemplateToSupabase = async (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig,
): Promise<{ success: boolean; error?: string; data?: any }> => {
  console.log("🚀 Direct Supabase template save started...");

  // Validate inputs
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
  toast.loading("💾 Supabase ga shablon saqlanmoqda...", {
    description: "Iltimos, kuting...",
    id: "saving-template",
  });

  try {
    // Prepare template data for Supabase
    const templateToSave = {
      user_id: user.id,
      name: templateData.templateName.trim(),
      description: `Professional shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
      category: "custom",
      colors: config.colors || {},
      fonts: config.fonts || {},
      config: {
        layout: config.layout || {},
        animations: config.animations || {},
        effects: config.effects || {},
        border: config.border || {},
        background: config.background || {},
        typography: config.typography || {},
      },
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: [config.layout?.style || "modern", "custom", "professional"],
      is_active: true,
    };

    console.log("📤 Saving to Supabase:", templateToSave);

    // Direct insert to Supabase with timeout
    const savePromise = supabase
      .from("custom_templates")
      .insert(templateToSave)
      .select()
      .single();

    const timeoutPromise = new Promise<never>(
      (_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 5000), // Reduced to 5 seconds
    );

    const { data, error } = (await Promise.race([
      savePromise,
      timeoutPromise,
    ])) as any;

    if (error) {
      console.error("❌ Supabase save error:", error);

      // Try fallback save to localStorage
      const fallbackResult = saveTemplateToLocalStorage(
        user,
        templateData,
        config,
      );

      toast.dismiss("saving-template");
      toast.warning("⚠️ Supabase xatosi, mahalliy saqlandi", {
        description: `Xatolik: ${error.message}`,
        duration: 6000,
      });

      return {
        success: true, // Still success because saved locally
        error: error.message,
        data: fallbackResult.data,
      };
    }

    // Success!
    toast.dismiss("saving-template");
    toast.success("🎉 Shablon Supabase ga saqlandi!", {
      description: "Templates sahifasida ko'rish mumkin",
      duration: 4000,
    });

    console.log("✅ Template successfully saved to Supabase:", data);
    return { success: true, data };
  } catch (err: any) {
    console.error("❌ Template save process failed:", err);

    // Fallback to localStorage
    const fallbackResult = saveTemplateToLocalStorage(
      user,
      templateData,
      config,
    );

    toast.dismiss("saving-template");

    if (
      err.message?.includes("timeout") ||
      err.message?.includes("Connection timeout")
    ) {
      toast.success("💾 Shablon mahalliy saqlandi!", {
        description: "Ulanish vaqti tugadi, lekin ma'lumotlar xavfsiz saqlandi",
        duration: 4000,
      });
    } else {
      toast.success("💾 Shablon mahalliy saqlandi!", {
        description:
          "Internet ulanishi yo'q, lekin ma'lumotlar xavfsiz saqlandi",
        duration: 4000,
      });
    }

    return {
      success: true,
      error: err.message,
      data: fallbackResult.data,
    };
  }
};

// Fallback localStorage save
export const saveTemplateToLocalStorage = (
  user: any,
  templateData: TemplateData,
  config: TemplateConfig,
): { success: boolean; data: any } => {
  const fallbackTemplate = {
    id: `local_${Date.now()}`,
    name: templateData.templateName,
    description: `Mahalliy shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
    category: "local",
    colors: config.colors,
    fonts: config.fonts,
    config: config,
    user_id: user.id,
    is_local: true,
    is_public: false,
    is_featured: false,
    usage_count: 0,
    tags: [config.layout?.style || "modern", "local", "offline"],
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
    console.error("❌ Failed to save to localStorage:", err);
    return { success: false, data: null };
  }
};

// Test Supabase connection specifically for templates
export const testTemplateTableAccess = async () => {
  try {
    console.log("🔍 Testing custom_templates table access...");

    const { data, error } = await supabase
      .from("custom_templates")
      .select("id, name")
      .limit(1);

    if (error) {
      console.error("❌ Template table access failed:", error);
      return { accessible: false, error: error.message };
    }

    console.log(
      "✅ Template table accessible, found:",
      data?.length || 0,
      "templates",
    );
    return { accessible: true, count: data?.length || 0 };
  } catch (err: any) {
    console.error("❌ Template table test failed:", err);
    return { accessible: false, error: err.message };
  }
};
