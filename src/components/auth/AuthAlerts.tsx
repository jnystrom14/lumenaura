import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface AuthAlertsProps {
  authError: string | null;
  isSamsungBrowser: boolean;
  authAttempted: boolean;
}

const AuthAlerts: React.FC<AuthAlertsProps> = ({ 
  authError, 
  isSamsungBrowser, 
  authAttempted 
}) => {
  if (!authError && !(isSamsungBrowser && authAttempted)) {
    return null;
  }
  
  const getTroubleshootingSteps = (error: string) => {
    if (error.toLowerCase().includes('localstorage')) {
      return 'Please enable cookies and localStorage in your browser settings.';
    }
    if (error.toLowerCase().includes('popup')) {
      return 'Please disable popup blockers for this site and try again.';
    }
    if (error.toLowerCase().includes('network')) {
      return 'Please check your internet connection and try again.';
    }
    return 'Please try using a different browser (Chrome recommended) or clear your browser cache and cookies.';
  };
  
  return (
    <>
      {authError && (
        <Alert variant="destructive" className="text-sm mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            <div className="font-medium">{authError}</div>
            <div className="text-xs mt-1 text-red-200">
              {getTroubleshootingSteps(authError)}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {isSamsungBrowser && authAttempted && (
        <Alert className="bg-amber-50 text-amber-700 border-amber-200">
          <Info className="h-4 w-4 mr-2 text-amber-600" />
          <AlertDescription className="text-xs">
            <div className="font-medium">Browser Compatibility Notice</div>
            <div className="mt-1">
              Some Samsung devices may experience authentication issues. If you're having trouble:
              <ul className="list-disc list-inside mt-1">
                <li>Try using Chrome browser instead</li>
                <li>Clear your browser cache and cookies</li>
                <li>Disable any privacy extensions temporarily</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AuthAlerts;
