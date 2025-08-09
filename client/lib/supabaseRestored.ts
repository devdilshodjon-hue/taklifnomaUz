import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Supabase URL va Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables not found! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
  );
}

console.log("🔧 Supabase client initializing for restored database...");

// Tiklangan database uchun optimallashtirilgan client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-client-info": "taklifnoma-restored@2.0.0",
      "x-application-name": "TaklifNoma.uz",
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database connection test
export const testDatabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    console.log("🔍 Testing restored database connection...");

    // Test connection function
    const { data, error } = await supabase.rpc("test_connection");

    if (error) {
      console.warn("⚠️ Database test function failed:", error.message);

      // Fallback test - try simple query
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      if (profileError) {
        console.error("❌ Database connection failed:", profileError.message);
        return {
          success: false,
          message: `Database not ready: ${profileError.message}`,
        };
      }

      console.log("✅ Database connection successful (fallback)");
      return {
        success: true,
        message: "Database connected (fallback test)",
        data: profiles,
      };
    }

    console.log("✅ Database fully restored and working:", data);
    return {
      success: true,
      message: "Database fully restored and working!",
      data,
    };
  } catch (err: any) {
    console.error("❌ Database connection error:", err);
    return {
      success: false,
      message: `Connection error: ${err.message}`,
    };
  }
};

// Enhanced invitation saver for restored database
export const saveInvitationToDatabase = async (
  invitationData: any,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  url?: string;
}> => {
  try {
    console.log("💾 Saving invitation to restored database...");

    const { data, error } = await supabase
      .from("invitations")
      .insert(invitationData)
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to save invitation:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    const invitationUrl = `${window.location.origin}/invitation/${data.slug}`;

    console.log("✅ Invitation saved successfully:", data);
    return {
      success: true,
      data,
      url: invitationUrl,
    };
  } catch (err: any) {
    console.error("❌ Save invitation error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};

// Load invitations from restored database
export const loadInvitationsFromDatabase = async (
  userId?: string,
): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> => {
  try {
    console.log("📋 Loading invitations from restored database...");

    let query = supabase
      .from("invitations")
      .select(
        `
        *,
        custom_templates(name, category, colors),
        rsvps(count),
        guests(count)
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Failed to load invitations:", error.message);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }

    console.log(`✅ Loaded ${data.length} invitations from database`);
    return {
      success: true,
      data: data || [],
    };
  } catch (err: any) {
    console.error("❌ Load invitations error:", err);
    return {
      success: false,
      data: [],
      error: err.message,
    };
  }
};

// Get invitation by slug
export const getInvitationBySlug = async (
  slug: string,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    console.log("🔍 Loading invitation by slug:", slug);

    const { data, error } = await supabase
      .from("invitations")
      .select(
        `
        *,
        custom_templates(name, colors, fonts, config),
        rsvps(id, guest_name, will_attend, message, created_at),
        guests(id, name, email, plus_one)
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("❌ Invitation not found:", error.message);
      return {
        success: false,
        error: "Invitation not found",
      };
    }

    // Increment view count
    await supabase.from("invitation_views").insert({
      invitation_id: data.id,
      visitor_ip: null, // Will be handled by trigger
      user_agent: navigator.userAgent,
      device_type: /Mobi/.test(navigator.userAgent) ? "mobile" : "desktop",
    });

    console.log("✅ Invitation loaded successfully");
    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error("❌ Get invitation error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};

// Get templates from database
export const getTemplatesFromDatabase = async (): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> => {
  try {
    console.log("🎨 Loading templates from database...");

    const { data, error } = await supabase
      .from("custom_templates")
      .select("*")
      .eq("is_public", true)
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("usage_count", { ascending: false });

    if (error) {
      console.error("❌ Failed to load templates:", error.message);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }

    console.log(`✅ Loaded ${data.length} templates from database`);
    return {
      success: true,
      data: data || [],
    };
  } catch (err: any) {
    console.error("❌ Load templates error:", err);
    return {
      success: false,
      data: [],
      error: err.message,
    };
  }
};

// Initialize and test connection
testDatabaseConnection().then((result) => {
  if (result.success) {
    console.log("🎉 Database is ready:", result.message);
  } else {
    console.warn("⚠️ Database needs setup:", result.message);
  }
});

export type SupabaseClient = typeof supabase;
export * from "./database.types";
