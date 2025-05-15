
export interface UserProfile {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  profilePicture?: string;
}

export interface NumerologyData {
  number: number;
  color: string;
  colorHex: string;
  gem: string;
  luckyNumber: number;
  powerWord: string;
  affirmation: string;
  meaning: string;
}

export interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: NumerologyData;
}
