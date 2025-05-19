
import { NumerologyData } from "../types";

export const numerologyDataset: NumerologyData[] = [
  {
    number: 1,
    color: "Red",
    colorHex: "#E53935",
    gem: "Ruby",
    luckyNumber: 9,
    powerWord: "Beginnings",
    affirmation: "I am a powerful creator and manifest my desires easily.",
    meaning: "A day for new beginnings, leadership, and taking initiative. Today favors bold actions and self-assertion."
  },
  {
    number: 2,
    color: "Orange",
    colorHex: "#FFA726",
    gem: "Moonstone",
    luckyNumber: 8,
    powerWord: "Cooperate",
    affirmation: "I flow with life's rhythms and find balance in all situations.",
    meaning: "A day for cooperation, diplomacy, and partnerships. Focus on relationships and finding peaceful solutions."
  },
  {
    number: 3,
    color: "Yellow",
    colorHex: "#FFEB3B",
    gem: "Topaz",
    luckyNumber: 6,
    powerWord: "Enjoyment",
    affirmation: "I express my unique gifts with joy and enthusiasm.",
    meaning: "A day for creativity, communication, and social connection. Share your ideas and enjoy artistic pursuits."
  },
  {
    number: 4,
    color: "Green",
    colorHex: "#66BB6A",
    gem: "Emerald/Jade",
    luckyNumber: 4,
    powerWord: "Practical",
    affirmation: "I build solid foundations for lasting success in all areas of my life.",
    meaning: "A day for organization, stability, and practical matters. Focus on building solid foundations and managing details."
  },
  {
    number: 5,
    color: "Blue",
    colorHex: "#42A5F5",
    gem: "Turquoise/Aquamarine",
    luckyNumber: 1,
    powerWord: "Change",
    affirmation: "I embrace change and adventure as pathways to growth.",
    meaning: "A day for change, freedom, and adventure. Explore new possibilities and embrace unexpected opportunities."
  },
  {
    number: 6,
    color: "Indigo (Navy Blue)",
    colorHex: "#3949AB",
    gem: "Pearl/Sapphire/Lapis",
    luckyNumber: 6,
    powerWord: "Responsibility",
    affirmation: "I create harmony and beauty in my environment and relationships.",
    meaning: "A day for responsibility, nurturing, and service. Focus on caring for others and creating harmony at home."
  },
  {
    number: 7,
    color: "Purple/Violet",
    colorHex: "#AB47BC",
    gem: "Amethyst",
    luckyNumber: 7,
    powerWord: "Faith",
    affirmation: "I trust my inner wisdom and follow my spiritual path with confidence.",
    meaning: "A day for reflection, analysis, and spiritual insight. Take time for solitude and connect with your inner guidance."
  },
  {
    number: 8,
    color: "Beige/Brown/Pink",
    colorHex: "#F48FB1",
    gem: "Diamond",
    luckyNumber: 4,
    powerWord: "Achievement",
    affirmation: "I attract unlimited abundance through the power of love and gratitude.",
    meaning: "A day for manifesting abundance, power, and achievement. Focus on practical goals and material success."
  },
  {
    number: 9,
    color: "All Pastels",
    colorHex: "#FFC107",
    gem: "Opal/Gold",
    luckyNumber: 9,
    powerWord: "Completion",
    affirmation: "I release the old with love and welcome new beginnings with open arms.",
    meaning: "A day for completion, service, and humanitarian efforts. Let go of what no longer serves you and focus on the greater good."
  },
  {
    number: 11,
    color: "Black/White or Pearl Gray",
    colorHex: "#B0BEC5",
    gem: "Silver",
    luckyNumber: 11,
    powerWord: "Intuition",
    affirmation: "I am a channel for divine wisdom and inspired ideas.",
    meaning: "A day for intuition, inspiration, and spiritual insight. Pay attention to your dreams and intuitive flashes."
  },
  {
    number: 22,
    color: "Coral/Russet",
    colorHex: "#E0E0E0",
    gem: "Coral/Copper",
    luckyNumber: 22,
    powerWord: "Greatness",
    affirmation: "I transform visions into reality through practical action and divine guidance.",
    meaning: "A day for mastery, large-scale projects, and material manifestation. Think big and act with practical wisdom."
  }
];

export const getDataForNumber = (number: number): NumerologyData => {
  // For master numbers 11 and 22
  if (number === 11 || number === 22) {
    return numerologyDataset.find(data => data.number === number) || numerologyDataset[0];
  }
  
  // For other numbers, reduce to single digit if needed
  let reducedNumber = number;
  while (reducedNumber > 9) {
    reducedNumber = Array.from(String(reducedNumber), Number).reduce((a, b) => a + b, 0);
  }
  
  return numerologyDataset.find(data => data.number === reducedNumber) || numerologyDataset[0];
};
