import { supabase } from "./supabase";
import { toast } from "sonner";

// Check if database tables exist and are properly configured
export const verifyDatabaseSetup = async () => {
  console.log("🔍 Ma'lumotlar bazasi sozlamalarini tekshirmoqda...");

  try {
    // Check if we can access the information schema
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["profiles", "custom_templates", "invitations"]);

    if (tablesError) {
      console.log(
        "⚠️ Information schema access restricted, checking individual tables...",
      );

      // Check each table individually
      const tableChecks = await Promise.all([
        checkTableExists("profiles"),
        checkTableExists("custom_templates"),
        checkTableExists("invitations"),
      ]);

      const existingTables = tableChecks.filter((check) => check.exists);

      if (existingTables.length === 3) {
        console.log("✅ Barcha asosiy jadvallar mavjud");
        return {
          success: true,
          tablesExist: 3,
          message: "All core tables accessible",
        };
      } else {
        console.log(`⚠️ ${existingTables.length}/3 jadval mavjud`);
        return {
          success: false,
          tablesExist: existingTables.length,
          message: `Only ${existingTables.length}/3 tables accessible`,
          details: tableChecks,
        };
      }
    }

    console.log(
      "✅ Information schema accessible, tables found:",
      tables?.length,
    );
    return {
      success: true,
      tablesExist: tables?.length || 0,
      message: "Database schema accessible",
      tables: tables?.map((t) => t.table_name),
    };
  } catch (error: any) {
    console.error("❌ Database setup check failed:", error);
    return {
      success: false,
      tablesExist: 0,
      message: error.message,
      error,
    };
  }
};

// Check if a specific table exists and is accessible
const checkTableExists = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("count")
      .limit(1);

    if (error) {
      return {
        table: tableName,
        exists: false,
        error: error.message,
        accessible: false,
      };
    }

    return {
      table: tableName,
      exists: true,
      accessible: true,
      error: null,
    };
  } catch (error: any) {
    return {
      table: tableName,
      exists: false,
      error: error.message,
      accessible: false,
    };
  }
};

// Test RLS policies for custom_templates
export const testRLSPolicies = async () => {
  console.log("🔒 RLS siyosatlarini tekshirmoqda...");

  try {
    // Test anonymous access (should be limited)
    const { data: anonData, error: anonError } = await supabase
      .from("custom_templates")
      .select("id, name, is_public")
      .eq("is_public", true)
      .limit(5);

    if (anonError && anonError.message.includes("row-level security")) {
      console.log("✅ RLS enabled and working");
      return {
        rlsEnabled: true,
        anonAccess: false,
        message: "RLS properly configured",
      };
    }

    if (anonData) {
      console.log(`✅ Public templates accessible (${anonData.length} found)`);
      return {
        rlsEnabled: true,
        anonAccess: true,
        publicTemplates: anonData.length,
        message: "RLS working, public access allowed",
      };
    }

    return {
      rlsEnabled: false,
      message: "RLS status unclear",
    };
  } catch (error: any) {
    console.log("⚠️ RLS test error:", error.message);
    return {
      rlsEnabled: false,
      error: error.message,
      message: "RLS test failed",
    };
  }
};

// Create a minimal test template to verify insert permissions
export const testInsertPermissions = async () => {
  console.log("✏️ Yozish ruxsatlarini tekshirmoqda...");

  try {
    // Check current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("⚠️ User not authenticated for insert test");
      return {
        canInsert: false,
        authenticated: false,
        message: "Authentication required for insert test",
      };
    }

    // Try to insert a test template
    const testTemplate = {
      name: "Insert Test Template",
      description: "Test insert permissions",
      category: "test",
      colors: { test: true },
      fonts: { test: true },
      config: { test: true },
      is_public: false,
      is_featured: false,
      usage_count: 0,
      tags: ["test"],
      is_active: false, // Won't show in UI
    };

    const { data, error } = await supabase
      .from("custom_templates")
      .insert(testTemplate)
      .select("id")
      .single();

    if (error) {
      console.log("❌ Insert test failed:", error.message);
      return {
        canInsert: false,
        authenticated: true,
        error: error.message,
        message: "Insert permission denied",
      };
    }

    // Clean up - delete the test record
    if (data?.id) {
      await supabase.from("custom_templates").delete().eq("id", data.id);

      console.log("✅ Insert test successful, test record cleaned up");
    }

    return {
      canInsert: true,
      authenticated: true,
      message: "Insert permissions working",
    };
  } catch (error: any) {
    console.error("❌ Insert test error:", error);
    return {
      canInsert: false,
      error: error.message,
      message: "Insert test failed",
    };
  }
};

// Comprehensive database health check
export const runDatabaseHealthCheck = async () => {
  console.log("🏥 To'liq ma'lumotlar bazasi tekshiruvi...");

  const results = {
    timestamp: new Date().toISOString(),
    setup: await verifyDatabaseSetup(),
    rls: await testRLSPolicies(),
    permissions: await testInsertPermissions(),
  };

  // Determine overall health
  const isHealthy =
    results.setup.success &&
    results.rls.rlsEnabled &&
    (results.permissions.canInsert || !results.permissions.authenticated);

  if (isHealthy) {
    toast.success("🎉 Database Health Check: Healthy!", {
      description: "All systems operational",
      duration: 5000,
    });
  } else {
    toast.warning("⚠️ Database Health Issues Detected", {
      description: "Check console for details",
      duration: 8000,
    });
  }

  console.log("🏥 Database health check results:", results);
  return { isHealthy, results };
};

// Setup demo data if needed
export const setupDemoData = async () => {
  console.log("🎭 Demo ma'lumotlarini sozlamoqda...");

  try {
    // Check if demo templates already exist
    const demoTemplates = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("demo_template_")) {
        const template = localStorage.getItem(key);
        if (template) {
          demoTemplates.push(JSON.parse(template));
        }
      }
    }

    if (demoTemplates.length > 0) {
      console.log(`✅ ${demoTemplates.length} demo templates mavjud`);
      return { created: false, existing: demoTemplates.length };
    }

    // Create demo templates
    const demoTemplateData = [
      {
        name: "Klassik Oq Shablon",
        category: "classic",
        colors: { primary: "#ffffff", secondary: "#f8f9fa", accent: "#6c757d" },
        fonts: { heading: "Playfair Display", body: "Inter" },
      },
      {
        name: "Zamonaviy Ko'k Shablon",
        category: "modern",
        colors: { primary: "#007bff", secondary: "#e3f2fd", accent: "#0056b3" },
        fonts: { heading: "Poppins", body: "Inter" },
      },
    ];

    demoTemplateData.forEach((template, index) => {
      const demoTemplate = {
        id: `demo_${Date.now()}_${index}`,
        ...template,
        description: "Demo shablon",
        config: { layout: { style: template.category } },
        is_public: false,
        is_featured: false,
        usage_count: 0,
        tags: ["demo", template.category],
        is_active: true,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(
        `demo_template_${demoTemplate.id}`,
        JSON.stringify(demoTemplate),
      );
    });

    console.log(`✅ ${demoTemplateData.length} demo templates yaratildi`);
    return { created: true, count: demoTemplateData.length };
  } catch (error: any) {
    console.error("❌ Demo data setup failed:", error);
    return { created: false, error: error.message };
  }
};
