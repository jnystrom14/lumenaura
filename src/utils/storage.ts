
import { UserProfile } from "../types";

const USER_PROFILE_KEY = 'lumenaura_user_profile';

export const saveUserProfile = (userProfile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
};

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(USER_PROFILE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as UserProfile;
  } catch (error) {
    console.error('Error parsing stored user profile:', error);
    return null;
  }
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(USER_PROFILE_KEY);
};

export const hasUserProfile = (): boolean => {
  return localStorage.getItem(USER_PROFILE_KEY) !== null;
};

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

/** NEW: persist profile so other tabs/browsers pick it up */
export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

