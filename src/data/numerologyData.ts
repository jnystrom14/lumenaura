
// Re-export all numerology data from the new structure
export { numerologyDataset, getDataForNumber } from "./numerology";

// Also re-export the types for backwards compatibility
export type { NumerologyDataItem as NumerologyData } from "./numerology/types";
