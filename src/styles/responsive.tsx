
import React from "react";

interface ResponsiveSpacingProps {
  children: React.ReactNode;
  className?: string;
}

// A component that applies appropriate spacing based on screen size
export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`
      p-3 xs:p-4 md:p-6
      space-y-3 xs:space-y-4 md:space-y-6
      ${className}
    `}>
      {children}
    </div>
  );
};

// A component that ensures touch-friendly buttons
export const TouchFriendlyButton: React.FC<React.ComponentProps<"button">> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`
        min-h-11 min-w-11 
        px-3 py-2 xs:px-4 xs:py-2.5
        flex items-center justify-center
        touch-manipulation
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// A component for fluid typography
export const FluidText: React.FC<{
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'small';
  className?: string;
}> = ({ 
  children, 
  variant = 'body',
  className = "" 
}) => {
  const variantClasses = {
    heading: "text-xl xs:text-2xl md:text-3xl font-serif font-medium",
    subheading: "text-lg xs:text-xl md:text-2xl font-medium",
    body: "text-sm xs:text-base md:text-base",
    small: "text-xs xs:text-sm md:text-sm"
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Helper component to create a safe area around interactive elements
export const TouchSafeArea: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
};

export default {
  ResponsiveSpacing,
  TouchFriendlyButton,
  FluidText,
  TouchSafeArea
};
