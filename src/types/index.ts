
export interface UserProfile {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  profilePicture?: string;
}

export interface NumerologyData {
  number: number | string;
  colors: string[];
  gems: string[];
  keyPhrase: string;
  description: string;
  meditation: string;
  // Add color hex and other display properties
  colorHex?: string;
  color?: string;
  gem?: string;
  powerWord?: string;
  affirmation?: string;
  meaning?: string;
  luckyNumber?: number;
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: NumerologyData;
}
