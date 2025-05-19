
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
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: NumerologyData;
}
