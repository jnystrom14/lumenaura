import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { logWithEmoji } from "@/utils/consoleLogger"; // Added import

interface AuthenticationProps {
  onContinueWithoutAccount: () => void;
  defaultToSignUp?: boolean;
}

const Authentication: React.FC<AuthenticationProps> = ({
  onContinueWithoutAccount,
  defaultToSignUp = false
}) => {
  const [isSignUp, setIsSignUp] = useState(defaultToSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [authAttempted, setAuthAttempted] = useState(false);
  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    user,
    isLoggedOut,
    authError,
    clearAuthError,
    isSamsungBrowser,
    isLoadingProfile, // New state from useAuth
    isProfileReady    // New state from useAuth
  } = useAuth();
  const {
    toast
  } = useToast();
  
  // Reset auth attempted flag when user switches between signup and signin
  useEffect(() => {
    clearAuthError();
    setAuthAttempted(false);
  }, [isSignUp, clearAuthError]);
  
  // Effect for redirection based on auth and profile status
  useEffect(() => {
    console.log('[AuthEffect] State changed:', { user, isLoggedOut, isLoadingProfile, isProfileReady });

    if (!user || isLoggedOut) {
      console.log('[AuthEffect] No user or logged out. Conditions not met for redirecting.');
      return;
    }

    if (isLoadingProfile) {
      console.log('[AuthEffect] Profile is loading, waiting to redirect...');
      // UI shows a loading message based on isLoadingProfile state
      return;
    }

    // At this point, user exists, is not logged out, and profile is not loading.
    // Now check profile readiness.
    if (isProfileReady === true) {
      logWithEmoji("✅ User authenticated and profile ready, redirecting...", "success");
      onContinueWithoutAccount();
    } else if (isProfileReady === false) {
      // Profile is explicitly not ready (e.g., new user needing onboarding)
      logWithEmoji("⏳ User authenticated but profile not ready. Proceeding (likely to onboarding)...", "info");
      // The UI shows "Finalizing account..." based on isProfileReady === false
      // For now, we assume onContinueWithoutAccount handles the next step (e.g. onboarding)
      onContinueWithoutAccount(); 
    } else {
      // isProfileReady is null (e.g. initial state, or error during profile check handled by authError)
      console.log('[AuthEffect] Profile readiness is null, waiting or error is displayed.');
    }
  }, [user, isLoggedOut, isLoadingProfile, isProfileReady, onContinueWithoutAccount]);

  // Check for URL parameters that might indicate an auth redirect with error
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error || errorDescription) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorDescription || error || "There was a problem signing you in"
      });
      
      // Clean the URL to prevent showing the error again on refresh
      const cleanUrl = window.location.origin + window.location.pathname; // More robust clean URL
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [toast]);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthAttempted(true);
    try {
      let result;
      if (isSignUp) {
        result = await signUpWithEmail(email, password);
      } else {
        result = await signInWithEmail(email, password);
      }
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: result.error
        });
      } else if (isSignUp) {
        toast({
          title: "Account created",
          description: "Please check your email for verification instructions."
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: err.message || "An error occurred during authentication"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true); // General loading for the button action
    setAuthAttempted(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Google Sign-In Error",
          description: result.error
        });
      }
      // The redirect and subsequent profile check will happen via useAuth
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Google Authentication Error",
        description: err.message || "An error occurred during Google authentication"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <SplashCursor 
        DENSITY_DISSIPATION={4.0}
        DYE_RESOLUTION={1024}
        SPLAT_FORCE={4000}
        colorPalette={["#9b87f5", "#FFDEE2", "#E5DEFF", "#FEF7CD", "#D3E4FD"]}
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
        <div className="w-full max-w-md crystal-card p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">LumenAura</h1>
            <p className="text-gray-600">Your Daily Numerology Guide</p>
          </div>
          
          <div className="text-center space-y-2 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? "Sign up to start your journey" : "Sign in to continue your journey"}
            </p>
          </div>
          
          {authError && (
            <Alert variant="destructive" className="text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          {/* Loading states */}
          {isLoading && !authError && ( // General loading for form submission
            <Alert variant="default" className="text-sm bg-blue-50 border-blue-200 text-blue-700">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>Processing your request...</AlertDescription>
            </Alert>
          )}

          {isLoadingProfile && !authError && ( // Profile specific loading
            <Alert variant="default" className="text-sm bg-purple-50 border-purple-200 text-purple-700">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>Checking your profile status, please wait...</AlertDescription>
            </Alert>
          )}

          {user && !isLoadingProfile && isProfileReady === false && !authError && ( // Profile not ready message
               <Alert variant="default" className="text-sm bg-indigo-50 border-indigo-200 text-indigo-700">
                  <Info className="h-4 w-4 mr-2" />
                  <AlertDescription>Finalizing your account setup. You will be redirected shortly...</AlertDescription>
               </Alert>
          )}
          
          {isSamsungBrowser && authAttempted && (
            <Alert className="bg-amber-50 text-amber-700 border-amber-200">
              <Info className="h-4 w-4 mr-2 text-amber-600" />
              <AlertDescription className="text-xs">
                Some Samsung devices may experience authentication issues. If you're having trouble, try using a different browser like Chrome.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Hide form if profile is loading or user exists and profile isn't ready yet (being finalized) */}
          {(!isLoadingProfile && !(user && isProfileReady === false)) && (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="crystal-input" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} className="crystal-input" minLength={6} required />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity" disabled={isLoading || isLoadingProfile}>
                {isLoading || isLoadingProfile ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={isLoading || isLoadingProfile}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Continue with Google
              </Button>
              
              <p className="text-center text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account?"} 
                <button type="button" className="text-primary hover:underline ml-1" onClick={() => {
                  setIsSignUp(!isSignUp);
                }}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
export default Authentication;
