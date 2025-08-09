import { supabase } from "./supabaseClient";
import { toast } from "sonner";

export interface InvitationFormData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  customMessage?: string;
  selectedTemplate?: string;
  rsvpDeadline?: string;
}

// Generate unique slug for invitation URL
const generateInvitationSlug = (groomName: string, brideName: string): string => {
  const cleanName = (name: string) => 
    name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  const groomSlug = cleanName(groomName);
  const brideSlug = cleanName(brideName);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  
  return `${groomSlug}-${brideSlug}-${timestamp}`;
};

// Generate invitation view URL
export const generateInvitationURL = (slug: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/invitation/${slug}`;
};

// Direct Supabase save with URL generation
export const saveInvitationToSupabase = async (
  user: any,
  formData: InvitationFormData,
): Promise<{ success: boolean; error?: string; data?: any; url?: string }> => {
  console.log("🚀 Direct Supabase invitation save started...");

  // Validate inputs
  if (!user?.id) {
    toast.error("❌ Xatolik", {
      description: "Tizimga kirishingiz kerak",
      duration: 3000,
    });
    return { success: false, error: "User not authenticated" };
  }

  // Validate required fields
  const missingFields = [];
  if (!formData.groomName?.trim()) missingFields.push("Kuyov ismi");
  if (!formData.brideName?.trim()) missingFields.push("Kelin ismi");
  if (!formData.weddingDate) missingFields.push("To'y sanasi");
  if (!formData.venue?.trim()) missingFields.push("Joy nomi");
  if (!formData.address?.trim()) missingFields.push("Manzil");

  if (missingFields.length > 0) {
    toast.error("❌ Ma'lumotlar to'liq emas", {
      description: `Quyidagi maydonlarni to'ldiring: ${missingFields.join(", ")}`,
      duration: 4000,
    });
    return {
      success: false,
      error: `Missing fields: ${missingFields.join(", ")}`,
    };
  }

  // Generate unique slug
  const slug = generateInvitationSlug(formData.groomName, formData.brideName);
  const invitationURL = generateInvitationURL(slug);

  // Show loading toast
  toast.loading("💾 Supabase ga taklifnoma saqlanmoqda...", {
    description: "URL yaratilmoqda...",
    id: "saving-invitation",
  });

  try {
    // Prepare invitation data for Supabase
    const invitationToSave = {
      user_id: user.id,
      groom_name: formData.groomName.trim(),
      bride_name: formData.brideName.trim(),
      wedding_date: formData.weddingDate,
      wedding_time: formData.weddingTime || null,
      venue: formData.venue.trim(),
      address: formData.address.trim(),
      city: formData.city?.trim() || null,
      state: formData.state?.trim() || null,
      zip_code: formData.zipCode?.trim() || null,
      custom_message: formData.customMessage?.trim() || null,
      template_id: formData.selectedTemplate || "classic-rose",
      rsvp_deadline: formData.rsvpDeadline || null,
      slug: slug,
      is_active: true,
    };

    console.log("📤 Saving invitation to Supabase:", invitationToSave);
    console.log("🔗 Generated URL:", invitationURL);

    // Always save to localStorage first as a backup
    const fallbackResult = saveInvitationToLocalStorage(user, formData, slug);
    console.log("💾 Backup saved to localStorage");

    try {
      // Try Supabase with improved timeout handling
      const savePromise = supabase
        .from("invitations")
        .insert(invitationToSave)
        .select()
        .single();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 5000) // Reduced to 5 seconds
      );

      const result = await Promise.race([savePromise, timeoutPromise]);
      const { data, error } = result as any;

      if (error) {
        console.warn("⚠️ Supabase error:", error.message);

        toast.dismiss("saving-invitation");
        toast.warning("⚠️ Supabase xatosi, mahalliy saqlandi", {
          description: `Xatolik: ${error.message}`,
          duration: 4000,
        });

        return {
          success: true, // Still success because saved locally
          error: error.message,
          data: fallbackResult.data,
          url: invitationURL
        };
      }

      // Success with Supabase!
      toast.dismiss("saving-invitation");
      toast.success("🎉 Taklifnoma Supabase ga saqlandi!", {
        description: `URL: ${invitationURL}`,
        duration: 4000,
        action: {
          label: "Ko'rish",
          onClick: () => window.open(invitationURL, '_blank')
        }
      });

      console.log("✅ Invitation successfully saved to Supabase:", data);
      console.log("🔗 Invitation URL:", invitationURL);

      return {
        success: true,
        data: { ...data, url: invitationURL },
        url: invitationURL
      };

    } catch (supabaseError: any) {
      console.warn("⚠️ Supabase connection failed:", supabaseError.message);

      toast.dismiss("saving-invitation");

      if (supabaseError.message?.includes("timeout") || supabaseError.message?.includes("Connection timeout")) {
        toast.success("💾 Taklifnoma mahalliy saqlandi!", {
          description: "Ulanish vaqti tugadi, lekin ma'lumotlar xavfsiz saqlandi",
          duration: 4000,
        });
      } else {
        toast.success("💾 Taklifnoma mahalliy saqlandi!", {
          description: "Internet ulanishi yo'q, lekin ma'lumotlar xavfsiz saqlandi",
          duration: 4000,
        });
      }

      return {
        success: true, // Always success since we have localStorage backup
        error: supabaseError.message,
        data: fallbackResult.data,
        url: invitationURL
      };
    }

  } catch (err: any) {
    console.error("❌ Invitation save process failed:", err);
    
    // Fallback to localStorage
    const fallbackResult = saveInvitationToLocalStorage(user, formData, slug);
    
    toast.dismiss("saving-invitation");
    
    if (err.message?.includes("6 soniyalik vaqt tugadi")) {
      toast.warning("⚠️ Vaqt tugadi", {
        description: "Taklifnoma mahalliy xotiraga saqlandi",
        duration: 6000,
      });
    } else {
      toast.warning("⚠️ Kutilmagan xatolik", {
        description: `Xatolik: ${err.message}. Mahalliy saqlandi.`,
        duration: 6000,
      });
    }

    return {
      success: true,
      error: err.message,
      data: fallbackResult.data,
      url: invitationURL
    };
  }
};

// Fallback localStorage save
export const saveInvitationToLocalStorage = (
  user: any,
  formData: InvitationFormData,
  slug: string,
): { success: boolean; data: any } => {
  const fallbackInvitation = {
    id: `local_${Date.now()}`,
    user_id: user.id,
    groom_name: formData.groomName.trim(),
    bride_name: formData.brideName.trim(),
    wedding_date: formData.weddingDate,
    wedding_time: formData.weddingTime || null,
    venue: formData.venue.trim(),
    address: formData.address.trim(),
    city: formData.city?.trim() || null,
    state: formData.state?.trim() || null,
    zip_code: formData.zipCode?.trim() || null,
    custom_message: formData.customMessage?.trim() || null,
    template_id: formData.selectedTemplate || "classic-rose",
    rsvp_deadline: formData.rsvpDeadline || null,
    slug: slug,
    is_active: true,
    is_local: true,
    created_at: new Date().toISOString(),
    url: generateInvitationURL(slug)
  };

  try {
    localStorage.setItem(
      `invitation_${fallbackInvitation.id}`,
      JSON.stringify(fallbackInvitation),
    );

    // Update local count
    const currentCount = parseInt(
      localStorage.getItem("demo_invitation_count") || "0",
    );
    localStorage.setItem(
      "demo_invitation_count",
      (currentCount + 1).toString(),
    );

    console.log("��� Invitation saved to localStorage:", fallbackInvitation);
    return { success: true, data: fallbackInvitation };
  } catch (err) {
    console.error("❌ Failed to save invitation to localStorage:", err);
    return { success: false, data: null };
  }
};

// Test invitation table access
export const testInvitationTableAccess = async () => {
  try {
    console.log("🔍 Testing invitations table access...");
    
    const { data, error } = await supabase
      .from("invitations")
      .select("id, groom_name, bride_name")
      .limit(1);
    
    if (error) {
      console.error("❌ Invitation table access failed:", error);
      return { accessible: false, error: error.message };
    }
    
    console.log("✅ Invitation table accessible, found:", data?.length || 0, "invitations");
    return { accessible: true, count: data?.length || 0 };
    
  } catch (err: any) {
    console.error("❌ Invitation table test failed:", err);
    return { accessible: false, error: err.message };
  }
};

// Get invitation by slug for public viewing
export const getInvitationBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select(`
        *,
        custom_templates (
          name,
          colors,
          fonts,
          config
        )
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    
    if (error) {
      console.error("❌ Error fetching invitation:", error);
      return { success: false, error: error.message };
    }
    
    console.log("✅ Invitation loaded:", data);
    return { success: true, data };
    
  } catch (err: any) {
    console.error("❌ Error in getInvitationBySlug:", err);
    return { success: false, error: err.message };
  }
};
