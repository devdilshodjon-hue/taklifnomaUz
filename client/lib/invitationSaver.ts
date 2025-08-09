import { supabase } from "./supabase";
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

export const saveInvitationToSupabase = async (
  user: any,
  formData: InvitationFormData,
  slug: string,
): Promise<{ success: boolean; error?: string; data?: any }> => {
  // Always dismiss any existing saving toast
  toast.dismiss("saving-invitation");

  // Input validation
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

  // Show loading toast
  toast.loading("💾 Taklifnoma saqlanmoqda...", {
    description: "Iltimos, kuting...",
    id: "saving-invitation",
  });

  // Retry function for invitations
  const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, i);
        console.log(
          `Invitation retry ${i + 1}/${maxRetries} after ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries exceeded");
  };

  try {
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

    console.log(
      "📤 Saving invitation to Supabase with retry logic...",
      invitationToSave,
    );

    // Try direct save first (no timeout race condition)
    console.log("📤 Attempting direct invitation save to Supabase...");
    let result;

    try {
      // Add 6-second timeout as requested
      const savePromise = supabase
        .from("invitations")
        .insert(invitationToSave)
        .select()
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("6 soniyalik vaqt tugadi")), 6000)
      );

      const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;
      result = { data, error };
      console.log("✅ Direct invitation save result:", result);
    } catch (directError) {
      console.log("❌ Direct invitation save failed, trying with retry logic...", directError);

      // If direct save fails, try with retry (with 6-second timeout)
      result = await retryWithBackoff(async () => {
        const retryPromise = supabase
          .from("invitations")
          .insert(invitationToSave)
          .select()
          .single();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("6 soniyalik vaqt tugadi")), 6000)
        );

        return await Promise.race([retryPromise, timeoutPromise]) as any;
      }, 2, 3000); // 2 retries with 3 second delay
    }

    const { data, error } = result;

    if (error) {
      throw error;
    }

    // Success
    toast.dismiss("saving-invitation");
    toast.success("🎉 Taklifnoma muvaffaqiyatli yaratildi!", {
      description: "Taklifnoma Dashboard'da ko'rish mumkin.",
      duration: 4000,
    });

    console.log("✅ Invitation saved successfully:", data);
    return { success: true, data };
  } catch (err: any) {
    console.error("Invitation save error:", err);
    toast.dismiss("saving-invitation");

    // Try localStorage fallback regardless of error type
    const fallbackResult = saveInvitationToLocalStorage(user, formData, slug);

    if (err.message?.includes("timeout") || err.message?.includes("Timeout")) {
      toast.warning("⚠️ Vaqt tugadi", {
        description:
          "Taklifnoma mahalliy xotiraga saqlandi. Keyinroq internet orqali sinxronlanadi.",
        duration: 6000,
      });
    } else {
      const errorMessage = err?.message || "Noma'lum xatolik";
      toast.warning("⚠️ Taklifnoma mahalliy xotiraga saqlandi", {
        description: `Bazaga ulanib bo'lmadi: ${errorMessage}`,
        duration: 6000,
      });
    }

    return {
      success: true, // Return success since we saved to localStorage
      error: err?.message,
      data: fallbackResult.data,
    };
  }
};

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

    console.log("✅ Invitation saved to localStorage:", fallbackInvitation);
    return { success: true, data: fallbackInvitation };
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
    return { success: false, data: null };
  }
};
