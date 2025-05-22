
import React from "react";

interface AuthFormContainerProps {
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md crystal-card p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">LumenAura</h1>
          <p className="text-gray-600">Your Daily Numerology Guide</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;
