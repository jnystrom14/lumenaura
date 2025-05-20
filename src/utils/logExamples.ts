
import { 
  logUserJourney, 
  logFunctionCall, 
  logSuccess, 
  logError, 
  logWarning 
} from './consoleLogger';

/**
 * Examples of how to use the console logger
 * For reference purposes only
 */
export const logExamples = () => {
  // User journey tracking
  logUserJourney('App Loaded');
  logUserJourney('Navigated to Dashboard', { route: '/dashboard' });
  logUserJourney('User Profile Viewed', { userId: 123 });
  
  // Function calls
  logFunctionCall('fetchUserData', { userId: 123 });
  logFunctionCall('calculateNumerology', { birthDate: '1990-05-15' });
  
  // Success messages
  logSuccess('Data saved successfully');
  logSuccess('Profile updated', { fields: ['name', 'email'] });
  
  // Errors
  logError('Failed to fetch data');
  logError(new Error('Network request failed'), 'API Call');
  
  // Warnings
  logWarning('Rate limit approaching');
  logWarning('Using fallback data', { reason: 'API timeout' });
};
