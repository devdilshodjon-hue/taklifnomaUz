import { supabase } from "./supabase";
import { toast } from "sonner";

export interface ConnectionStatus {
  isConnected: boolean;
  authenticated: boolean;
  latency: number;
  error?: string;
  details?: any;
}

// Enhanced connection testing with authentication check
export const testSupabaseConnection = async (): Promise<ConnectionStatus> => {
  const startTime = Date.now();

  try {
    console.log("🔍 Supabase ulanishini tekshirmoqda...");

    // First test basic connectivity
    const { data: healthCheck, error: healthError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    const latency = Date.now() - startTime;

    if (healthError) {
      console.warn("❌ Supabase ulanish xatosi:", healthError);

      // Handle specific error types
      if (
        healthError.message?.includes("401") ||
        healthError.message?.includes("unauthorized")
      ) {
        return {
          isConnected: true,
          authenticated: false,
          latency,
          error: "Authentication required",
          details: healthError,
        };
      }

      return {
        isConnected: false,
        authenticated: false,
        latency,
        error: healthError.message,
        details: healthError,
      };
    }

    // Test authentication status
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("✅ Supabase ulanish muvaffaqiyatli:", {
      latency: `${latency}ms`,
      authenticated: !!user,
      user: user?.email || user?.id?.substring(0, 8),
    });

    return {
      isConnected: true,
      authenticated: !!user,
      latency,
      error: authError?.message,
    };
  } catch (error: any) {
    console.error("❌ Supabase ulanish testi muvaffaqiyatsiz:", error);
    return {
      isConnected: false,
      authenticated: false,
      latency: Date.now() - startTime,
      error: error?.message || "Unknown connection error",
    };
  }
};

// Create or get demo user session
export const createDemoSession = async () => {
  console.log("🔧 Demo session yaratilmoqda...");

  const demoUser = {
    id: "demo-user-" + Date.now(),
    email: "demo@taklifnoma.uz",
    created_at: new Date().toISOString(),
    user_metadata: {
      first_name: "Demo",
      last_name: "Foydalanuvchi",
    },
  };

  // Store demo session
  localStorage.setItem("demo_user", JSON.stringify(demoUser));
  localStorage.setItem("demo_session_active", "true");

  console.log("✅ Demo session yaratildi:", demoUser.email);
  return demoUser;
};

// Enhanced template save with proper authentication
export const saveTemplateWithAuth = async (templateData: any, config: any) => {
  console.log("🚀 Template saqlash jarayoni boshlandi...");

  // Check connection first
  const connectionStatus = await testSupabaseConnection();

  if (!connectionStatus.isConnected) {
    console.log("❌ Ulanish yo'q, localStorage ga saqlash...");
    toast.warning("⚠️ Internet ulanishi yo'q", {
      description: "Shablon mahalliy xotiraga saqlandi",
      duration: 4000,
    });

    // Save to localStorage as fallback
    const localTemplate = {
      id: `local_${Date.now()}`,
      ...templateData,
      config,
      is_local: true,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(
      `custom_template_${localTemplate.id}`,
      JSON.stringify(localTemplate),
    );
    return { success: true, data: localTemplate, isLocal: true };
  }

  // If connected but not authenticated, try demo mode
  if (!connectionStatus.authenticated) {
    console.log("🔧 Authentication yo'q, demo user ishlatilmoqda...");

    const demoUser = await createDemoSession();

    // Create demo template
    const demoTemplate = {
      id: `demo_${Date.now()}`,
      user_id: demoUser.id,
      name: templateData.templateName,
      description: `Demo shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
      category: "demo",
      colors: config.colors,
      fonts: config.fonts,
      config: config,
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: ["demo", "template"],
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage with demo prefix
    localStorage.setItem(
      `demo_template_${demoTemplate.id}`,
      JSON.stringify(demoTemplate),
    );

    toast.success("🎉 Demo shablon saqlandi!", {
      description: "Demo rejimda ishlayapti",
      duration: 4000,
    });

    return { success: true, data: demoTemplate, isDemo: true };
  }

  // Full authenticated save
  try {
    console.log("💾 Authenticated save to Supabase...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not found after authentication check");
    }

    const templateToSave = {
      user_id: user.id,
      name: templateData.templateName.trim(),
      description: `Professional shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
      category: "custom",
      colors: config.colors,
      fonts: config.fonts,
      config: config,
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: [config.layout?.style || "modern", "custom", "professional"],
      is_active: true,
    };

    const { data, error } = await supabase
      .from("custom_templates")
      .insert(templateToSave)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("🎉 Shablon muvaffaqiyatli saqlandi!", {
      description: "Templates sahifasida ko'rish mumkin",
      duration: 4000,
    });

    console.log("✅ Template successfully saved to Supabase:", data);
    return { success: true, data, isSupabase: true };
  } catch (error: any) {
    console.error("❌ Supabase save error:", error);

    // Fallback to localStorage
    const fallbackTemplate = {
      id: `fallback_${Date.now()}`,
      ...templateData,
      config,
      is_local: true,
      error: error.message,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(
      `custom_template_${fallbackTemplate.id}`,
      JSON.stringify(fallbackTemplate),
    );

    toast.warning("⚠️ Shablon mahalliy saqlandi", {
      description: `Supabase xatosi: ${error.message}`,
      duration: 6000,
    });

    return {
      success: true,
      data: fallbackTemplate,
      isLocal: true,
      error: error.message,
    };
  }
};

// Check and initialize authentication
export const initializeAuth = async () => {
  console.log("🔧 Authentication initsializatsiyasi...");

  const connectionStatus = await testSupabaseConnection();

  if (!connectionStatus.isConnected) {
    console.log("🔧 Offline rejim, demo user yaratilmoqda...");
    await createDemoSession();
    return { mode: "offline", user: "demo" };
  }

  if (!connectionStatus.authenticated) {
    console.log("🔧 Autentifikatsiya yo'q, demo rejim...");
    await createDemoSession();
    return { mode: "demo", user: "demo" };
  }

  console.log("✅ To'liq autentifikatsiya qilingan");
  return { mode: "authenticated", user: "real" };
};
