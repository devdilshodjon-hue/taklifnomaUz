import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Supabase URL va Key ni environment variables dan olish
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables not found! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
  );
}

console.log("🔧 Supabase client initializing with:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + "...",
});

// Enhanced Supabase client with improved permission handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session for anonymous access
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: "pkce",
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-client-info": "taklifnoma-app@1.0.0",
      "x-application-name": "TaklifNoma.uz",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test connection with permission error handling
export const testConnection = async (): Promise<boolean> => {
  try {
    // Test with a simple query to detect permission issues
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      if (
        error.message?.includes("permission denied") ||
        error.message?.includes("schema public")
      ) {
        // Suppress permission errors - this is expected for non-configured databases
        return false; // Will use localStorage fallback
      } else {
        console.warn("⚠️ Supabase connection failed:", error.message);
        return false;
      }
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error: any) {
    if (
      error.message?.includes("permission denied") ||
      error.message?.includes("schema public")
    ) {
      // Suppress permission errors - use localStorage
    } else {
      console.warn("⚠️ Supabase connection error:", error);
    }
    return false;
  }
};

// Wrapper function to handle permission errors gracefully
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<{ data: T; error: any }>,
): Promise<{ data: T | null; error: any; isPermissionError: boolean }> => {
  try {
    const result = await operation();

    if (result.error) {
      const isPermissionError =
        result.error.message?.includes("permission denied") ||
        result.error.message?.includes("schema public") ||
        result.error.code === "42501";

      console.warn("⚠️ Supabase operation failed:", result.error.message);

      return {
        data: null,
        error: result.error,
        isPermissionError,
      };
    }

    return {
      data: result.data,
      error: null,
      isPermissionError: false,
    };
  } catch (error: any) {
    const isPermissionError =
      error.message?.includes("permission denied") ||
      error.message?.includes("schema public");

    console.warn("⚠️ Supabase operation error:", error.message);

    return {
      data: null,
      error: error,
      isPermissionError,
    };
  }
};

// Test connection on initialization (non-blocking)
testConnection();

// Export types
export type SupabaseClient = typeof supabase;
export * from "./database.types";
