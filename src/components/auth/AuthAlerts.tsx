
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
  
  return (
    <>
      {authError && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{authError}</AlertDescription>
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
    </>
  );
};

export default AuthAlerts;
