
import { NumerologyDataItem } from "./types";
import { numbers1to3 } from "./numbers1-3";
import { numbers4to6 } from "./numbers4-6";
import { numbers7to9 } from "./numbers7-9";
import { masterNumbers } from "./masterNumbers";

export const numerologyDataset: NumerologyDataItem[] = [
  ...numbers1to3,
  ...numbers4to6,
  ...numbers7to9,
  ...masterNumbers
];

export const getDataForNumber = (number: number): NumerologyDataItem => {
  // For master numbers 11 and 22
  if (number === 11) {
    return numerologyDataset.find(data => data.number === "11/2") || numerologyDataset[0];
  } else if (number === 22) {
    return numerologyDataset.find(data => data.number === "22/4") || numerologyDataset[0];
  }
  
  // For other numbers, reduce to single digit if needed
  let reducedNumber = number;
  while (reducedNumber > 9) {
    reducedNumber = Array.from(String(reducedNumber), Number).reduce((a, b) => a + b, 0);
  }
  
  return numerologyDataset.find(data => 
    typeof data.number === 'number' && data.number === reducedNumber
  ) || numerologyDataset[0];
};
