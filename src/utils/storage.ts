// src/utils/storage.ts
import { UserProfile } from "../types";
const USER_PROFILE_KEY = "userProfile";

export function hasUserProfile(): boolean {
  try {
    return localStorage.getItem(USER_PROFILE_KEY) !== null;
  } catch (error) {
    console.warn('localStorage access failed:', error);
    return false;
  }
}

export function getUserProfile(): UserProfile | null {
  try {
    const json = localStorage.getItem(USER_PROFILE_KEY);
    return json ? (JSON.parse(json) as UserProfile) : null;
  } catch (error) {
    console.warn('Failed to get user profile from localStorage:', error);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('Failed to save user profile to localStorage:', error);
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.warn('Failed to clear user profile from localStorage:', error);
  }
}

