
import { PersonalYearData } from "../../types";

export interface NumerologyDataItem {
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
