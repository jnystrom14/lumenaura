import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with mobile-first assumption to prevent hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean>(true)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial state immediately
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // During SSR or before hydration, assume mobile for better UX
  if (!hasMounted) {
    return true
  }

  return isMobile
}
