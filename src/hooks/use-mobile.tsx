import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with mobile-first assumption to prevent hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean>(true)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    console.log("🔍 useIsMobile: Component mounted, checking screen size")
    setHasMounted(true)
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
      console.log(`📱 useIsMobile: Screen size changed - Width: ${window.innerWidth}px, isMobile: ${newIsMobile}`)
      setIsMobile(newIsMobile)
    }
    
    // Set initial state immediately
    const initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT
    console.log(`📱 useIsMobile: Initial check - Width: ${window.innerWidth}px, isMobile: ${initialIsMobile}`)
    setIsMobile(initialIsMobile)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // During SSR or before hydration, assume mobile for better UX
  if (!hasMounted) {
    console.log("⏳ useIsMobile: Not yet mounted, returning mobile-first default (true)")
    return true
  }

  console.log(`✅ useIsMobile: Returning final value: ${isMobile}`)
  return isMobile
}
