
import { UserProfile } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { saveUserProfile } from "../utils/storage";
import { User } from "@supabase/supabase-js";

export async function saveProfileToSupabase(profile: UserProfile, user: User | null): Promise<{ success: boolean; error?: string }> {
  if (!user) {
    return { success: false, error: "No authenticated user found" };
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: profile.name,
        birth_day: profile.birthDay,
        birth_month: profile.birthMonth,
        birth_year: profile.birthYear,
        profile_picture: profile.profilePicture,
      });
      
    if (error) {
      console.error("Failed to save profile:", error);
      return { success: false, error: "Unable to save profile to server" };
    }
    
    // Save locally as well
    saveUserProfile({
      ...profile,
      profilePicture: profile.profilePicture || ""
    });
    
    return { success: true };
  } catch (err) {
    console.error("Exception saving profile:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
