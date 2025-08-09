import { supabase, getCurrentUserId } from "./supabaseAuthFixed";
import { Database } from "./database.types";

type InvitationData = Database["public"]["Tables"]["invitations"]["Insert"];

// Generate invitation slug from names
const generateInvitationSlug = (groomName: string, brideName: string): string => {
  const timestamp = Date.now();
  const cleanName = (name: string) => 
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  
  const groomSlug = cleanName(groomName);
  const brideSlug = cleanName(brideName);
  
  return `${groomSlug}-${brideSlug}-${timestamp}`;
};

// Save invitation with anonymous user support
export const saveInvitation = async (invitationData: Omit<InvitationData, 'user_id' | 'slug'>): Promise<{
  success: boolean;
  invitation?: any;
  url?: string;
  error?: string;
}> => {
  console.log("💾 Starting invitation save process...");

  try {
    // Get current user ID (anonymous or authenticated)
    const userId = getCurrentUserId();
    console.log("👤 Using user ID:", userId);

    // Generate unique slug
    const slug = generateInvitationSlug(invitationData.groom_name, invitationData.bride_name);
    console.log("🔗 Generated slug:", slug);

    // Prepare invitation data
    const completeInvitationData: InvitationData = {
      ...invitationData,
      user_id: userId,
      slug: slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to localStorage first (immediate backup)
    const localStorageKey = 'taklifnoma_invitations';
    let localInvitations = [];
    
    try {
      const stored = localStorage.getItem(localStorageKey);
      localInvitations = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("⚠️ Could not read from localStorage:", e);
      localInvitations = [];
    }

    // Add to local storage
    const localInvitation = {
      ...completeInvitationData,
      id: `local_${Date.now()}`,
      is_local: true,
    };
    
    localInvitations.unshift(localInvitation);
    
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(localInvitations));
      console.log("💾 Invitation saved locally as backup");
    } catch (e) {
      console.warn("⚠️ Could not save to localStorage:", e);
    }

    // Attempt Supabase save with timeout
    console.log("📤 Attempting to save to Supabase...");
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 4000)
    );

    const savePromise = supabase
      .from("invitations")
      .insert(completeInvitationData)
      .select()
      .single();

    try {
      const result = await Promise.race([savePromise, timeoutPromise]);

      if (result.error) {
        console.warn("⚠️ Supabase save failed:", result.error.message);
        
        // Return success with local data
        return {
          success: true,
          invitation: localInvitation,
          url: `/invitation/${slug}`,
          error: undefined, // Don't show error since we have local backup
        };
      }

      console.log("✅ Invitation saved to Supabase successfully");
      
      // Update local storage with Supabase ID
      localInvitations[0] = {
        ...result.data,
        is_local: false,
      };
      
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(localInvitations));
      } catch (e) {
        console.warn("⚠️ Could not update localStorage with Supabase ID");
      }

      return {
        success: true,
        invitation: result.data,
        url: `/invitation/${slug}`,
        error: undefined,
      };

    } catch (timeoutError) {
      console.warn("⏰ Supabase save timeout, using local storage");
      
      // Return success with local data (offline mode)
      return {
        success: true,
        invitation: localInvitation,
        url: `/invitation/${slug}`,
        error: undefined, // Don't show error for timeout
      };
    }

  } catch (error) {
    console.error("❌ Critical error in invitation save:", error);
    
    // Even in critical error, try to return local data if available
    const localStorageKey = 'taklifnoma_invitations';
    try {
      const stored = localStorage.getItem(localStorageKey);
      const localInvitations = stored ? JSON.parse(stored) : [];
      
      if (localInvitations.length > 0) {
        const latestInvitation = localInvitations[0];
        return {
          success: true,
          invitation: latestInvitation,
          url: `/invitation/${latestInvitation.slug}`,
          error: undefined,
        };
      }
    } catch (e) {
      console.warn("⚠️ Could not read from localStorage in error handler");
    }

    return {
      success: false,
      error: "Invitation save failed. Please try again.",
    };
  }
};

// Get invitations for current user
export const getUserInvitations = async (): Promise<{
  success: boolean;
  invitations: any[];
  error?: string;
}> => {
  console.log("📋 Loading user invitations...");

  try {
    // Get current user ID
    const userId = getCurrentUserId();
    console.log("👤 Loading invitations for user:", userId);

    // Load from localStorage first
    const localStorageKey = 'taklifnoma_invitations';
    let localInvitations = [];
    
    try {
      const stored = localStorage.getItem(localStorageKey);
      localInvitations = stored ? JSON.parse(stored) : [];
      console.log(`💾 Found ${localInvitations.length} local invitations`);
    } catch (e) {
      console.warn("⚠️ Could not read from localStorage:", e);
      localInvitations = [];
    }

    // Try to load from Supabase with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 3000)
    );

    const loadPromise = supabase
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    try {
      const result = await Promise.race([loadPromise, timeoutPromise]);

      if (result.error) {
        console.warn("⚠️ Supabase load failed:", result.error.message);
        
        // Return local data
        return {
          success: true,
          invitations: localInvitations,
          error: undefined, // Don't show error since we have local data
        };
      }

      console.log(`✅ Loaded ${result.data.length} invitations from Supabase`);
      
      // Combine Supabase and local data, avoiding duplicates
      const allInvitations = [...result.data];
      
      // Add local invitations that don't exist in Supabase
      localInvitations.forEach(localInv => {
        const existsInSupabase = allInvitations.some(inv => inv.slug === localInv.slug);
        if (!existsInSupabase) {
          allInvitations.push(localInv);
        }
      });

      return {
        success: true,
        invitations: allInvitations,
        error: undefined,
      };

    } catch (timeoutError) {
      console.warn("⏰ Supabase load timeout, using local storage");
      
      return {
        success: true,
        invitations: localInvitations,
        error: undefined, // Don't show error for timeout
      };
    }

  } catch (error) {
    console.error("❌ Critical error loading invitations:", error);
    
    // Try to return local data even in critical error
    const localStorageKey = 'taklifnoma_invitations';
    try {
      const stored = localStorage.getItem(localStorageKey);
      const localInvitations = stored ? JSON.parse(stored) : [];
      
      return {
        success: true,
        invitations: localInvitations,
        error: undefined,
      };
    } catch (e) {
      return {
        success: false,
        invitations: [],
        error: "Could not load invitations",
      };
    }
  }
};

// Get invitation by slug (for public viewing)
export const getInvitationBySlug = async (slug: string): Promise<{
  success: boolean;
  invitation?: any;
  error?: string;
}> => {
  console.log("🔍 Loading invitation by slug:", slug);

  try {
    // Check localStorage first
    const localStorageKey = 'taklifnoma_invitations';
    try {
      const stored = localStorage.getItem(localStorageKey);
      const localInvitations = stored ? JSON.parse(stored) : [];
      const localInvitation = localInvitations.find(inv => inv.slug === slug);
      
      if (localInvitation) {
        console.log("💾 Found invitation in local storage");
        return {
          success: true,
          invitation: localInvitation,
        };
      }
    } catch (e) {
      console.warn("⚠️ Could not check localStorage:", e);
    }

    // Try Supabase with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 3000)
    );

    const loadPromise = supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    try {
      const result = await Promise.race([loadPromise, timeoutPromise]);

      if (result.error) {
        console.warn("⚠️ Invitation not found in Supabase:", result.error.message);
        return {
          success: false,
          error: "Invitation not found",
        };
      }

      console.log("✅ Invitation loaded from Supabase");
      return {
        success: true,
        invitation: result.data,
      };

    } catch (timeoutError) {
      console.warn("⏰ Supabase timeout, invitation not found");
      return {
        success: false,
        error: "Invitation not found",
      };
    }

  } catch (error) {
    console.error("❌ Error loading invitation:", error);
    return {
      success: false,
      error: "Could not load invitation",
    };
  }
};
