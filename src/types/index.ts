
export interface UserProfile {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  profilePicture?: string;
}

export interface PersonalYearData {
  yearNumber: number;
  description: string;
}

export interface NumerologyData {
  number: number | string;
  colors: string[];
  gems: string[];
  keyPhrase: string;
  description: string;
  meditation: string;
  // Color hex values for display
  colorHex?: string;
  colorHexSecondary?: string;
  colorHexTertiary?: string;
  colorHexQuaternary?: string;
  // Additional properties
  powerWord?: string;
  affirmation?: string;
  meaning?: string;
  todaysTheme?: string;
  keyWord?: string;
  personalYear?: PersonalYearData;
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: NumerologyData;
}
