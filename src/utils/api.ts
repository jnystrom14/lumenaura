
import { UserProfile } from "../types";

/**
 * Fetches the saved profile for this user from your server.
 * Adjust the URL to match your backend (Supabase, Firebase, REST API, etc.).
 */
export async function fetchUserProfileFromServer(
  userId: string
): Promise<UserProfile> {
  const res = await fetch(`/api/profiles/${userId}`);
  if (!res.ok) {
    // e.g. 404 = no profile yet
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }
  return (await res.json()) as UserProfile;
}
