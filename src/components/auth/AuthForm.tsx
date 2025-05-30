
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  isSignUp: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  onToggleAuthMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  isSignUp,
  onSubmit,
  onGoogleSignIn,
  onToggleAuthMode
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="crystal-input" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Create a password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="crystal-input" 
          minLength={6} 
          required 
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity" 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
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
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={onGoogleSignIn} 
        disabled={isLoading}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      
      <p className="text-center text-sm">
        {isSignUp ? "Already have an account?" : "Don't have an account?"} 
        <button 
          type="button" 
          className="text-primary hover:underline ml-1" 
          onClick={onToggleAuthMode}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);

export default AuthForm;
