
/**
 * Utility functions for color manipulation and styling
 */

// Function to determine if text color should be light or dark based on background
export const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance using the formula for relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

// Get color style for background gradients
export const getColorStyle = (colors: string[] | undefined, colorHex?: string, colorHexSecondary?: string, colorHexTertiary?: string) => {
  if (!colors?.length) return { backgroundColor: "#6B7280" };
  
  // Use the specific hex values
  const primaryColor = colorHex || "#6B7280";
  const secondaryColor = colorHexSecondary;
  const tertiaryColor = colorHexTertiary;
  
  if (colors.length === 1) {
    return { 
      backgroundColor: primaryColor,
      backgroundImage: `radial-gradient(circle at 30% 30%, ${primaryColor}, transparent 80%)` 
    };
  }
  
  // For multiple colors, create a gradient
  if (colors.length === 2 && secondaryColor) {
    return {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    };
  } else if (colors.length === 3 && secondaryColor && tertiaryColor) {
    return {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${tertiaryColor} 100%)`
    };
  } else if (colors.length > 3 && secondaryColor) {
    // For "all pastels" or other multi-color scenarios
    return {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    };
  }
  
  // Default fallback
  return { backgroundColor: primaryColor };
};
