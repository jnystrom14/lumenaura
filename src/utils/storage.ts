// src/utils/storage.ts
import { UserProfile } from "../types";
const USER_PROFILE_KEY = "userProfile";

export function hasUserProfile(): boolean {
  return localStorage.getItem(USER_PROFILE_KEY) !== null;
}

export function getUserProfile(): UserProfile | null {
  const json = localStorage.getItem(USER_PROFILE_KEY);
  return json ? (JSON.parse(json) as UserProfile) : null;
}

// ← ADD THIS:
export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

