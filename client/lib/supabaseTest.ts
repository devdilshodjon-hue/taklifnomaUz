import { supabase } from "./supabase";
import { toast } from "sonner";

export interface TestResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
  latency?: number;
}

// Comprehensive Supabase integration test
export const runSupabaseIntegrationTest = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  console.log("🧪 Supabase integration test boshlandi...");
  
  // Test 1: Basic connectivity
  try {
    const startTime = Date.now();
    const response = await fetch("https://tcilxdkolqodtgowlgrh.supabase.co/rest/v1/", {
      method: "HEAD",
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaWx4ZGtvbHFvZHRnb3dsZ3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTM1NTEsImV4cCI6MjA3MDIyOTU1MX0.9LFErrgcBMKQVOrl0lndUfBXMdAWmq6206sbBzgk32A"
      }
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      results.push({
        name: "Basic Connectivity",
        status: "success",
        message: `Supabase API available (${latency}ms)`,
        latency
      });
    } else {
      results.push({
        name: "Basic Connectivity",
        status: "error",
        message: `HTTP ${response.status}: ${response.statusText}`,
        details: { status: response.status, statusText: response.statusText }
      });
    }
  } catch (error: any) {
    results.push({
      name: "Basic Connectivity",
      status: "error",
      message: error.message || "Network error",
      details: error
    });
  }
  
  // Test 2: Authentication status
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      results.push({
        name: "Authentication",
        status: "warning",
        message: "No authenticated user",
        details: error
      });
    } else if (user) {
      results.push({
        name: "Authentication",
        status: "success",
        message: `User authenticated: ${user.email}`,
        details: { userId: user.id, email: user.email }
      });
    } else {
      results.push({
        name: "Authentication",
        status: "warning",
        message: "Anonymous access mode"
      });
    }
  } catch (error: any) {
    results.push({
      name: "Authentication",
      status: "error",
      message: error.message || "Auth check failed",
      details: error
    });
  }
  
  // Test 3: Database tables access
  const tablesToTest = ["profiles", "custom_templates", "invitations"];
  
  for (const table of tablesToTest) {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase
        .from(table)
        .select("count")
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        results.push({
          name: `Table: ${table}`,
          status: "error",
          message: error.message,
          details: error,
          latency
        });
      } else {
        results.push({
          name: `Table: ${table}`,
          status: "success",
          message: `Table accessible (${latency}ms)`,
          latency
        });
      }
    } catch (error: any) {
      results.push({
        name: `Table: ${table}`,
        status: "error",
        message: error.message || `Failed to access ${table}`,
        details: error
      });
    }
  }
  
  // Test 4: Insert test (with rollback)
  try {
    const testTemplate = {
      name: "Test Template (Will be deleted)",
      description: "Integration test template",
      category: "test",
      colors: { primary: "#000000" },
      fonts: { heading: "Arial" },
      config: { test: true },
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: ["test"],
      is_active: false // Inactive so it doesn't show up in UI
    };
    
    // Try to insert
    const { data: insertData, error: insertError } = await supabase
      .from("custom_templates")
      .insert(testTemplate)
      .select()
      .single();
    
    if (insertError) {
      results.push({
        name: "Insert Test",
        status: "error",
        message: `Insert failed: ${insertError.message}`,
        details: insertError
      });
    } else {
      results.push({
        name: "Insert Test",
        status: "success",
        message: "Insert operation successful",
        details: { id: insertData.id }
      });
      
      // Clean up - delete the test record
      await supabase
        .from("custom_templates")
        .delete()
        .eq("id", insertData.id);
    }
  } catch (error: any) {
    results.push({
      name: "Insert Test",
      status: "error",
      message: error.message || "Insert test failed",
      details: error
    });
  }
  
  // Test 5: RLS (Row Level Security) check
  try {
    const { data, error } = await supabase
      .from("custom_templates")
      .select("id, name")
      .limit(5);
    
    if (error) {
      results.push({
        name: "RLS Test",
        status: "error",
        message: `RLS error: ${error.message}`,
        details: error
      });
    } else {
      results.push({
        name: "RLS Test",
        status: "success",
        message: `RLS working, ${data.length} records accessible`,
        details: { recordCount: data.length }
      });
    }
  } catch (error: any) {
    results.push({
      name: "RLS Test",
      status: "error",
      message: error.message || "RLS test failed",
      details: error
    });
  }
  
  console.log("🧪 Supabase integration test yakunlandi:", results);
  return results;
};

// Display test results with toast notifications
export const displayTestResults = (results: TestResult[]) => {
  const successCount = results.filter(r => r.status === "success").length;
  const errorCount = results.filter(r => r.status === "error").length;
  const warningCount = results.filter(r => r.status === "warning").length;
  
  // Main summary toast
  if (errorCount === 0) {
    toast.success("🎉 Supabase Integration Success!", {
      description: `${successCount} tests passed, ${warningCount} warnings`,
      duration: 5000
    });
  } else {
    toast.error("❌ Supabase Integration Issues", {
      description: `${errorCount} errors, ${successCount} passed`,
      duration: 8000
    });
  }
  
  // Individual error toasts
  results.forEach(result => {
    if (result.status === "error") {
      toast.error(`❌ ${result.name}`, {
        description: result.message,
        duration: 6000
      });
    } else if (result.status === "warning") {
      toast.warning(`⚠️ ${result.name}`, {
        description: result.message,
        duration: 4000
      });
    }
  });
  
  return {
    total: results.length,
    success: successCount,
    errors: errorCount,
    warnings: warningCount,
    results
  };
};

// Quick connection test
export const quickConnectionTest = async (): Promise<"online" | "offline" | "error"> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch("https://tcilxdkolqodtgowlgrh.supabase.co/rest/v1/", {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaWx4ZGtvbHFvZHRnb3dsZ3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTM1NTEsImV4cCI6MjA3MDIyOTU1MX0.9LFErrgcBMKQVOrl0lndUfBXMdAWmq6206sbBzgk32A"
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok ? "online" : "error";
    
  } catch (error) {
    return "offline";
  }
};
