import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Supabase URL va Key ni environment variables dan olish
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables not found!");
  throw new Error(
    "Supabase environment variables not found! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

console.log("🔧 Enhanced Supabase client initializing...");

// Enhanced Supabase client with improved configuration
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
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Simple connection test function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log("🔍 Testing Supabase connection...");
    
    // Test with a simple function call
    const { data, error } = await supabase.rpc('test_connection');
    
    if (error) {
      console.warn("⚠️ Supabase function test failed:", error.message);
      
      // Fallback test - try to read from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
        
      if (profileError) {
        console.error("❌ Supabase connection failed:", profileError.message);
        return false;
      }
      
      console.log("✅ Supabase connection successful (fallback test)");
      return true;
    }
    
    console.log("✅ Supabase connection successful:", data);
    return true;
  } catch (err) {
    console.error("❌ Supabase connection error:", err);
    return false;
  }
};

// Enhanced user authentication for future use
export const authenticateUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("🔐 Authentication failed:", error.message);
      return { success: false, error: error.message };
    }
    
    console.log("✅ User authenticated successfully");
    return { success: true, user: data.user };
  } catch (err) {
    console.error("❌ Authentication error:", err);
    return { success: false, error: "Authentication failed" };
  }
};

// Create anonymous user session for public access
export const createAnonymousSession = async (): Promise<string> => {
  try {
    // Generate a unique session ID for anonymous users
    const anonymousUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage for persistence
    localStorage.setItem('taklifnoma_anonymous_user_id', anonymousUserId);
    
    console.log("👤 Anonymous session created:", anonymousUserId);
    return anonymousUserId;
  } catch (err) {
    console.error("❌ Failed to create anonymous session:", err);
    return `anon_${Date.now()}`;
  }
};

// Get current user ID (using localStorage for safety)
export const getCurrentUserId = (): string => {
  // Always use anonymous user ID for safety
  let anonymousId = localStorage.getItem('taklifnoma_anonymous_user_id');
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('taklifnoma_anonymous_user_id', anonymousId);
  }

  return anonymousId;
};

// Test connection on module load
testSupabaseConnection();

// Export types
export type SupabaseClient = typeof supabase;
export * from "./database.types";
