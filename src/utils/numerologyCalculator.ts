import { UserProfile, DailyProfile } from "../types";
import { getDataForNumber } from "../data/numerologyData";

export const calculateUniversalYear = (year: number): number => {
  // Sum all digits of the year
  const yearSum = Array.from(String(year), Number).reduce((a, b) => a + b, 0);
  
  // Reduce to a single digit or master number
  if (yearSum === 11 || yearSum === 22) {
    return yearSum;
  }
  
  let result = yearSum;
  while (result > 9) {
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return result;
};

// New function that calculates personal year based on calendar year
// This will be consistent throughout the entire year
export const calculatePersonalYearForCalendarYear = (
  birthMonth: number,
  birthDay: number,
  calendarYear: number
): number => {
  // Sum birth month, birth day, and universal year (based on calendar year)
  const universalYear = calculateUniversalYear(calendarYear);
  const sum = birthMonth + birthDay + universalYear;
  
  // Reduce to a single digit or master number
  if (sum === 11 || sum === 22) {
    return sum;
  }
  
  let result = sum;
  while (result > 9) {
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return result;
};

// Keep the old function for backward compatibility
export const calculatePersonalYear = (
  birthMonth: number,
  birthDay: number,
  universalYear: number
): number => {
  // Sum birth month, birth day, and universal year
  const sum = birthMonth + birthDay + universalYear;
  
  // Reduce to a single digit or master number
  if (sum === 11 || sum === 22) {
    return sum;
  }
  
  let result = sum;
  while (result > 9) {
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return result;
};

export const calculatePersonalMonth = (personalYear: number, month: number): number => {
  // Sum personal year and current month
  const sum = personalYear + month;
  
  // Reduce to a single digit or master number
  if (sum === 11 || sum === 22) {
    return sum;
  }
  
  let result = sum;
  while (result > 9) {
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return result;
};

export const calculatePersonalDay = (personalMonth: number, day: number): number => {
  // Sum personal month and day of month
  const sum = personalMonth + day;
  
  // Reduce to a single digit or master number
  if (sum === 11 || sum === 22) {
    return sum;
  }
  
  let result = sum;
  while (result > 9) {
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return result;
};

export const getDailyProfile = (user: UserProfile, date: Date = new Date()): DailyProfile => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  
  const universalYear = calculateUniversalYear(year);
  
  // Use the calendar year to calculate personal year instead of the universal year
  // This ensures the personal year stays consistent throughout the calendar year
  const personalYear = calculatePersonalYearForCalendarYear(user.birthMonth, user.birthDay, year);
  
  const personalMonth = calculatePersonalMonth(personalYear, month);
  const personalDay = calculatePersonalDay(personalMonth, day);
  
  const numerologyData = getDataForNumber(personalDay);
  
  return {
    date,
    universalYear,
    personalYear,
    personalMonth,
    personalDay,
    numerologyData
  };
};

export const getMonthlyProfiles = (user: UserProfile, year: number, month: number): DailyProfile[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const profiles: DailyProfile[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    profiles.push(getDailyProfile(user, date));
  }
  
  return profiles;
};
