
import React from "react";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "../../types";
import Authentication from "../auth/Authentication";
import Onboarding from "../Onboarding";
import AppRouter from "./AppRouter";
import { useAuthenticationState } from "../../hooks/useAuthenticationState";

const AuthenticationWrapper: React.FC = () => {
  const {
    user,
    userProfile,
    loading,
    showAuth,
    isLoggedOut,
    handleLogout,
    handleProfileUpdate,
    handleOnboardingComplete
  } = useAuthenticationState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full" />
      </div>
    );
  }

  // Render authentication screen
  if (showAuth) {
    return (
      <Authentication
        onContinueWithoutAccount={() => {}} // Empty function as we're removing this feature
        defaultToSignUp={false}
      />
    );
  }

  // Render onboarding for new users
  if (user && !userProfile && !isLoggedOut) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render main app if we have a user profile
  return (
    <AppRouter
      userProfile={userProfile}
      isLoggedOut={isLoggedOut}
      showAuth={showAuth}
      onLogout={handleLogout}
      onProfileUpdate={handleProfileUpdate}
      onboardingComplete={handleOnboardingComplete}
    />
  );
};

export default AuthenticationWrapper;
