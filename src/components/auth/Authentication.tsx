
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import AuthFormContainer from "./AuthFormContainer";
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";
import AuthAlerts from "./AuthAlerts";

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
  const [isLoading, setIsLoading] = useState(false);
  const [authAttempted, setAuthAttempted] = useState(false);
  
  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    user,
    isLoggedOut,
    authError,
    clearAuthError,
    isSamsungBrowser
  } = useAuth();
  
  const { toast } = useToast();
  
  // Reset auth attempted flag when user switches between signup and signin
  useEffect(() => {
    clearAuthError();
    setAuthAttempted(false);
  }, [isSignUp, clearAuthError]);
  
  // If the user is already authenticated and hasn't just logged out,
  // call onContinueWithoutAccount to move to the next screen
  useEffect(() => {
    if (!user || isLoggedOut) return;
    onContinueWithoutAccount();
  }, [user, isLoggedOut, onContinueWithoutAccount]);

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
      const cleanUrl = window.location.pathname;
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
    setIsLoading(true);
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
      // The redirect will happen automatically, no need for additional code here
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
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <AuthFormContainer>
      <AuthHeader isSignUp={isSignUp} />
      
      <AuthAlerts 
        authError={authError} 
        isSamsungBrowser={isSamsungBrowser} 
        authAttempted={authAttempted} 
      />
      
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        isSignUp={isSignUp}
        onSubmit={handleAuth}
        onGoogleSignIn={handleGoogleSignIn}
        onToggleAuthMode={toggleAuthMode}
      />
    </AuthFormContainer>
  );
};

export default Authentication;
