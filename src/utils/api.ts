// src/utils/api.ts
import { UserProfile } from "../types";

/**
 * Given a logged-in user’s ID, return their saved profile from your backend.
 */
export async function fetchUserProfileFromServer(
  userId: string
): Promise<UserProfile> {
  const res = await fetch(`/api/profiles/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }
  return (await res.json()) as UserProfile;
}
