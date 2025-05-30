import { UserProfile, DailyProfile, NumerologyNumber } from "../types";
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

// Helper function to reduce numbers while tracking master numbers
const reduceNumberWithMasterTracking = (sum: number): NumerologyNumber => {
  // Check if the sum itself is a master number
  if (sum === 11) {
    return {
      value: 2, // 11 reduces to 2
      isMasterNumber: true,
      masterNumber: 11
    };
  }
  
  if (sum === 22) {
    return {
      value: 4, // 22 reduces to 4
      isMasterNumber: true,
      masterNumber: 22
    };
  }
  
  // Reduce to single digit, but track if we pass through master numbers
  let result = sum;
  let masterNumber: number | undefined;
  
  while (result > 9) {
    // Check if we're reducing from a master number
    if (result === 11 || result === 22) {
      masterNumber = result;
    }
    result = Array.from(String(result), Number).reduce((a, b) => a + b, 0);
  }
  
  return {
    value: result,
    isMasterNumber: masterNumber ? true : false,
    masterNumber
  };
};

// New function that calculates personal year based on calendar year
// This will be consistent throughout the entire year
export const calculatePersonalYearForCalendarYear = (
  birthMonth: number,
  birthDay: number,
  calendarYear: number
): NumerologyNumber => {
  // Sum birth month, birth day, and universal year (based on calendar year)
  const universalYear = calculateUniversalYear(calendarYear);
  const sum = birthMonth + birthDay + universalYear;
  
  return reduceNumberWithMasterTracking(sum);
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

export const calculatePersonalMonth = (personalYear: NumerologyNumber, month: number): NumerologyNumber => {
  // Sum personal year and current month
  const sum = personalYear.value + month;
  
  return reduceNumberWithMasterTracking(sum);
};

export const calculatePersonalDay = (personalMonth: NumerologyNumber, day: number): NumerologyNumber => {
  // Sum personal month and day of month
  const sum = personalMonth.value + day;
  
  return reduceNumberWithMasterTracking(sum);
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
  
  // Fetch data for both personal day and personal year separately
  // Use master number if it's a true master number, otherwise use the reduced value
  const numerologyData = getDataForNumber(personalDay.isMasterNumber ? personalDay.value : personalDay.value);
  const personalYearData = getDataForNumber(personalYear.isMasterNumber ? personalYear.value : personalYear.value);
  
  return {
    date,
    universalYear,
    personalYear,
    personalMonth,
    personalDay,
    numerologyData,
    personalYearData
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
