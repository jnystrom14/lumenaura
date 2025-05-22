
import React from "react";

interface AuthHeaderProps {
  isSignUp: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isSignUp }) => {
  return (
    <div className="text-center space-y-2 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {isSignUp ? "Create an account" : "Welcome back"}
      </h2>
      <p className="text-gray-600">
        {isSignUp ? "Sign up to start your journey" : "Sign in to continue your journey"}
      </p>
    </div>
  );
};

export default AuthHeader;
