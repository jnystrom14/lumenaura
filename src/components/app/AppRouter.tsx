
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from "../../types";
import Dashboard from "../Dashboard";
import NotFound from "../../pages/NotFound";
import ProfilePage from "../../pages/ProfilePage";
import Onboarding from "../Onboarding";

interface AppRouterProps {
  userProfile: UserProfile | null;
  isLoggedOut: boolean;
  showAuth: boolean;
  onLogout: () => Promise<void>;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onboardingComplete: () => void;
}

const AppRouter: React.FC<AppRouterProps> = ({
  userProfile,
  isLoggedOut,
  showAuth,
  onLogout,
  onProfileUpdate,
  onboardingComplete,
}) => {
  if (!userProfile || isLoggedOut) {
    return null; // Auth component will be rendered by parent
  }
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            userProfile={userProfile}
            onLogout={onLogout}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <ProfilePage
            userProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
