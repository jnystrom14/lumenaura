
// src/utils/api.ts
import { UserProfile } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Given a logged-in user's ID, return their saved profile from Supabase.
 */
export async function fetchUserProfileFromServer(
  userId: string
): Promise<UserProfile> {
  // Query the profiles table in Supabase instead of calling an API endpoint
  const { data, error } = await supabase
    .from('profiles')
    .select('name, birth_day, birth_month, birth_year, profile_picture')
    .eq('id', userId)
    .single();

  if (error) {
    // Profile doesn't exist or there was another error
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  if (!data) {
    throw new Error('Profile not found');
  }

  // Map the Supabase data format to our UserProfile type
  return {
    name: data.name || "",
    birthDay: data.birth_day || 1,
    birthMonth: data.birth_month || 1,
    birthYear: data.birth_year || 1990,
    profilePicture: data.profile_picture || ""
  };
}
