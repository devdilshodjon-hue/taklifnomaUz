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
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`,
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test connection with better error handling
export const testConnection = async (): Promise<boolean> => {
  try {
    // Simple health check that doesn't require permissions
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    if (response.ok) {
      console.log("✅ Supabase connection successful");
      return true;
    } else {
      console.warn("⚠️ Supabase connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.warn("⚠️ Supabase connection error:", error);
    return false;
  }
};

// Wrapper function to handle permission errors gracefully
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<{ data: T; error: any }>
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
        isPermissionError
      };
    }

    return {
      data: result.data,
      error: null,
      isPermissionError: false
    };
  } catch (error: any) {
    const isPermissionError =
      error.message?.includes("permission denied") ||
      error.message?.includes("schema public");

    console.warn("⚠️ Supabase operation error:", error.message);

    return {
      data: null,
      error: error,
      isPermissionError
    };
  }
};

// Test connection on initialization (non-blocking)
testConnection();

// Export types
export type SupabaseClient = typeof supabase;
export * from "./database.types";
