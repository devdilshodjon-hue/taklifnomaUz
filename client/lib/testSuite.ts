import { supabase } from "./supabaseClient";
import {
  saveTemplateToSupabase,
  testTemplateTableAccess,
} from "./templateSaver";
import {
  saveInvitationToSupabase,
  testInvitationTableAccess,
  getInvitationBySlug,
} from "./invitationSaver";
import { toast } from "sonner";

interface TestResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
  timing?: number;
}

// Comprehensive test suite for TaklifNoma.uz
export const runFullTestSuite = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  console.log("🧪 Starting comprehensive test suite...");

  // Test 1: Basic Supabase Connection
  try {
    const startTime = Date.now();
    const { error } = await supabase.from("profiles").select("count").limit(1);
    const timing = Date.now() - startTime;

    if (error) {
      results.push({
        name: "Supabase Connection",
        status: "error",
        message: `Connection failed: ${error.message}`,
        details: error,
        timing,
      });
    } else {
      results.push({
        name: "Supabase Connection",
        status: "success",
        message: `Connection successful (${timing}ms)`,
        timing,
      });
    }
  } catch (err: any) {
    results.push({
      name: "Supabase Connection",
      status: "error",
      message: err.message || "Connection failed",
      details: err,
    });
  }

  // Test 2: Authentication Check
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      results.push({
        name: "Authentication",
        status: "warning",
        message: "No authenticated user",
        details: error,
      });
    } else if (user) {
      results.push({
        name: "Authentication",
        status: "success",
        message: `User authenticated: ${user.email}`,
        details: { userId: user.id, email: user.email },
      });
    } else {
      results.push({
        name: "Authentication",
        status: "warning",
        message: "Anonymous access mode",
      });
    }
  } catch (err: any) {
    results.push({
      name: "Authentication",
      status: "error",
      message: err.message || "Auth check failed",
      details: err,
    });
  }

  // Test 3: Custom Templates Table
  try {
    const templateResult = await testTemplateTableAccess();

    if (templateResult.accessible) {
      results.push({
        name: "Custom Templates Table",
        status: "success",
        message: `Table accessible, ${templateResult.count || 0} templates found`,
        details: templateResult,
      });
    } else {
      results.push({
        name: "Custom Templates Table",
        status: "error",
        message: templateResult.error || "Table not accessible",
        details: templateResult,
      });
    }
  } catch (err: any) {
    results.push({
      name: "Custom Templates Table",
      status: "error",
      message: err.message || "Table test failed",
      details: err,
    });
  }

  // Test 4: Invitations Table
  try {
    const invitationResult = await testInvitationTableAccess();

    if (invitationResult.accessible) {
      results.push({
        name: "Invitations Table",
        status: "success",
        message: `Table accessible, ${invitationResult.count || 0} invitations found`,
        details: invitationResult,
      });
    } else {
      results.push({
        name: "Invitations Table",
        status: "error",
        message: invitationResult.error || "Table not accessible",
        details: invitationResult,
      });
    }
  } catch (err: any) {
    results.push({
      name: "Invitations Table",
      status: "error",
      message: err.message || "Table test failed",
      details: err,
    });
  }

  // Test 5: Template Save Test (if authenticated)
  const authResult = results.find((r) => r.name === "Authentication");
  if (authResult?.status === "success") {
    try {
      const testTemplateData = {
        templateName: "Test Template " + Date.now(),
        groomName: "Test Kuyov",
        brideName: "Test Kelin",
        weddingDate: "2024-12-31",
        weddingTime: "18:00",
        venue: "Test Joy",
        address: "Test Manzil",
        customMessage: "Test xabar",
      };

      const testConfig = {
        colors: { primary: "#007bff", secondary: "#6c757d" },
        fonts: { heading: "Arial", body: "Helvetica" },
        layout: { style: "test", spacing: 16 },
        animations: { enabled: false },
      };

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const saveResult = await saveTemplateToSupabase(
          user,
          testTemplateData,
          testConfig,
        );

        if (saveResult.success) {
          results.push({
            name: "Template Save Test",
            status: "success",
            message: "Template save operation successful",
            details: saveResult,
          });

          // Clean up test template
          if (saveResult.data?.id) {
            await supabase
              .from("custom_templates")
              .delete()
              .eq("id", saveResult.data.id);
          }
        } else {
          results.push({
            name: "Template Save Test",
            status: "error",
            message: saveResult.error || "Template save failed",
            details: saveResult,
          });
        }
      }
    } catch (err: any) {
      results.push({
        name: "Template Save Test",
        status: "error",
        message: err.message || "Template save test failed",
        details: err,
      });
    }
  } else {
    results.push({
      name: "Template Save Test",
      status: "warning",
      message: "Skipped - authentication required",
    });
  }

  // Test 6: Invitation Save Test (if authenticated)
  if (authResult?.status === "success") {
    try {
      const testInvitationData = {
        groomName: "Test Kuyov " + Date.now(),
        brideName: "Test Kelin " + Date.now(),
        weddingDate: "2024-12-31",
        weddingTime: "18:00",
        venue: "Test Joy",
        address: "Test Manzil",
        city: "Toshkent",
        customMessage: "Test taklifnoma xabari",
        selectedTemplate: "classic",
      };

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const saveResult = await saveInvitationToSupabase(
          user,
          testInvitationData,
        );

        if (saveResult.success) {
          results.push({
            name: "Invitation Save Test",
            status: "success",
            message: `Invitation save successful, URL: ${saveResult.url}`,
            details: saveResult,
          });

          // Test invitation retrieval by slug
          if (saveResult.data?.slug) {
            const retrieveResult = await getInvitationBySlug(
              saveResult.data.slug,
            );

            if (retrieveResult.success) {
              results.push({
                name: "Invitation Retrieval Test",
                status: "success",
                message: "Invitation retrieval by slug successful",
                details: retrieveResult,
              });
            } else {
              results.push({
                name: "Invitation Retrieval Test",
                status: "error",
                message: retrieveResult.error || "Invitation retrieval failed",
                details: retrieveResult,
              });
            }

            // Clean up test invitation
            if (saveResult.data?.id) {
              await supabase
                .from("invitations")
                .delete()
                .eq("id", saveResult.data.id);
            }
          }
        } else {
          results.push({
            name: "Invitation Save Test",
            status: "error",
            message: saveResult.error || "Invitation save failed",
            details: saveResult,
          });
        }
      }
    } catch (err: any) {
      results.push({
        name: "Invitation Save Test",
        status: "error",
        message: err.message || "Invitation save test failed",
        details: err,
      });
    }
  } else {
    results.push({
      name: "Invitation Save Test",
      status: "warning",
      message: "Skipped - authentication required",
    });
  }

  // Test 7: RLS Policies Test
  try {
    // Test public template access
    const { data: publicTemplates, error } = await supabase
      .from("custom_templates")
      .select("id, name")
      .eq("is_public", true)
      .limit(5);

    if (error) {
      results.push({
        name: "RLS Policies Test",
        status: "error",
        message: `RLS test failed: ${error.message}`,
        details: error,
      });
    } else {
      results.push({
        name: "RLS Policies Test",
        status: "success",
        message: `RLS working, ${publicTemplates?.length || 0} public templates accessible`,
        details: { publicTemplates: publicTemplates?.length || 0 },
      });
    }
  } catch (err: any) {
    results.push({
      name: "RLS Policies Test",
      status: "error",
      message: err.message || "RLS test failed",
      details: err,
    });
  }

  console.log("🧪 Test suite completed:", results);
  return results;
};

// Display test results with notifications
export const displayTestResults = (results: TestResult[]) => {
  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const warningCount = results.filter((r) => r.status === "warning").length;

  // Summary notification
  if (errorCount === 0) {
    toast.success("🎉 All Tests Passed!", {
      description: `${successCount} tests successful, ${warningCount} warnings`,
      duration: 5000,
    });
  } else if (errorCount < results.length / 2) {
    toast.warning("⚠️ Some Tests Failed", {
      description: `${errorCount} errors, ${successCount} passed, ${warningCount} warnings`,
      duration: 6000,
    });
  } else {
    toast.error("❌ Major Issues Detected", {
      description: `${errorCount} errors out of ${results.length} tests`,
      duration: 8000,
    });
  }

  // Individual notifications for critical errors
  results.forEach((result) => {
    if (
      result.status === "error" &&
      (result.name.includes("Connection") || result.name.includes("Table"))
    ) {
      toast.error(`❌ ${result.name}`, {
        description: result.message,
        duration: 6000,
      });
    }
  });

  return {
    total: results.length,
    success: successCount,
    errors: errorCount,
    warnings: warningCount,
    results,
  };
};

// Quick health check
export const quickHealthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from("profiles").select("count").limit(1);
    return !error;
  } catch {
    return false;
  }
};
