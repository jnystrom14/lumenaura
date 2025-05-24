import * as React from "react"

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isMatching, setIsMatching] = React.useState<boolean>(true); // Mobile-first default
  const [hasMounted, setHasMounted] = React.useState(false);
  
  React.useEffect(() => {
    setHasMounted(true);
    
    const width = BREAKPOINTS[breakpoint];
    const mql = window.matchMedia(`(max-width: ${width - 1}px)`);
    
    const onChange = () => {
      setIsMatching(mql.matches);
    };
    
    // Set initial state immediately
    setIsMatching(mql.matches);
    
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  
  // During SSR or before hydration, assume mobile for better UX
  if (!hasMounted) {
    return true;
  }
  
  return isMatching;
}

export function useIsSmallerThan(breakpoint: Breakpoint) {
  return useBreakpoint(breakpoint);
}

export function useIsLargerThan(breakpoint: Breakpoint) {
  const [isMatching, setIsMatching] = React.useState<boolean>(false); // Desktop-first for larger than
  const [hasMounted, setHasMounted] = React.useState(false);
  
  React.useEffect(() => {
    setHasMounted(true);
    
    const width = BREAKPOINTS[breakpoint];
    const mql = window.matchMedia(`(min-width: ${width}px)`);
    
    const onChange = () => {
      setIsMatching(mql.matches);
    };
    
    // Set initial state immediately
    setIsMatching(mql.matches);
    
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  
  // During SSR or before hydration, assume not larger for better UX
  if (!hasMounted) {
    return false;
  }
  
  return isMatching;
}
