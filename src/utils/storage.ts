
import { UserProfile } from "../types";

const USER_PROFILE_KEY = 'colorpath_user_profile';

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
