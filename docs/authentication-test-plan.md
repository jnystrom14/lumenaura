# Authentication Manual Test Plan

This document outlines the manual test cases for the application's authentication flows.

## Test Case Format

For each test case, the following information will be provided:

*   **Test Case ID:** A unique identifier (e.g., AUTH-MAN-001).
*   **Description:** What is being tested.
*   **Prerequisites:** Any conditions that must be met before testing (e.g., new user, existing user, specific browser).
*   **Steps:** Detailed steps to execute the test.
*   **Expected Result:** What should happen if the test is successful.
*   **Actual Result:** (To be filled in during manual testing)
*   **Status:** (Pass/Fail - to be filled in during manual testing)

---

## Test Cases

### 1. Google Sign-Up (New User)

*   **Test Case ID:** AUTH-MAN-001
*   **Description:** Verify a new user can sign up using Google OAuth.
*   **Prerequisites:** User does not have an existing account. Use Chrome browser. Access to a Google account not previously used with this application.
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  Click the "Continue with Google" button.
    3.  The Google authentication popup/redirect should appear.
    4.  Select or log in with a valid Google account that has not been used with the application before.
    5.  Grant any necessary permissions if prompted.
    6.  Observe redirection back to the application and subsequent screens.
*   **Expected Result:**
    *   User is successfully authenticated.
    *   The "Checking your profile status, please wait..." message appears briefly.
    *   If this is a first-time login and their profile data (name, birthdate) is not yet in the database, the "Finalizing your account setup. You will be redirected shortly..." message appears.
    *   User is then redirected to the appropriate page (e.g., onboarding to complete their profile, or directly to the main application if onboarding is part of a different flow after this).
    *   No authentication errors are displayed.
    *   A user session is created and persisted.
    *   Relevant user information (e.g., from Google profile) might be pre-filled if the onboarding flow fetches it.
*   **Actual Result:**
*   **Status:**

### 2. Google Sign-In (Existing User)

*   **Test Case ID:** AUTH-MAN-002
*   **Description:** Verify an existing user can sign in using Google OAuth.
*   **Prerequisites:** User has an existing account previously created via Google Sign-Up. The user's profile (name, birthdate) is complete in the database. Use Chrome browser.
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  Click the "Continue with Google" button.
    3.  The Google authentication popup/redirect should appear.
    4.  Select or log in with the Google account associated with the existing user.
    5.  Observe redirection back to the application.
*   **Expected Result:**
    *   User is successfully authenticated.
    *   The "Checking your profile status, please wait..." message appears very briefly (as profile should be found quickly).
    *   User is redirected directly to the main application dashboard or landing page.
    *   No authentication errors are displayed.
    *   The existing user session is restored.
*   **Actual Result:**
*   **Status:**

### 3. Email/Password Sign-Up (New User)

*   **Test Case ID:** AUTH-MAN-003
*   **Description:** Verify a new user can sign up using email and password.
*   **Prerequisites:** User does not have an existing account. Access to a valid email address to receive a verification link (though clicking the link is out of scope for this test).
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  If not already on the Sign-Up form, click the "Sign Up" link/button.
    3.  Enter a valid, unique email address in the email field.
    4.  Enter a strong password (meeting any defined criteria, e.g., min 6 characters) in the password field.
    5.  Click the "Sign Up" button.
*   **Expected Result:**
    *   The UI indicates that the account creation was successful.
    *   A message is displayed prompting the user to check their email for a verification link (e.g., "Account created. Please check your email for verification instructions.").
    *   The user remains on the login page or a page confirming the sign-up. They should not be automatically logged in or redirected to the main app until email verification (if that's the flow).
    *   No `authError` is displayed on the UI related to the sign-up process itself.
*   **Actual Result:**
*   **Status:**

### 4. Email/Password Sign-In (Existing User)

*   **Test Case ID:** AUTH-MAN-004
*   **Description:** Verify an existing user can sign in using email and password.
*   **Prerequisites:** User has an existing account created via email/password and has verified their email address. Profile is complete.
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  If not already on the Sign-In form, click the "Sign In" link/button.
    3.  Enter the email address of the existing, verified user.
    4.  Enter the correct password for that user.
    5.  Click the "Sign In" button.
*   **Expected Result:**
    *   User is successfully authenticated.
    *   The "Checking your profile status, please wait..." message may appear briefly.
    *   User is redirected to the main application dashboard or landing page.
    *   No authentication errors are displayed.
    *   A user session is created and persisted.
*   **Actual Result:**
*   **Status:**

### 5. Logout

*   **Test Case ID:** AUTH-MAN-005
*   **Description:** Verify user can log out successfully.
*   **Prerequisites:** User is currently logged into the application (either via Google or Email/Password).
*   **Steps:**
    1.  Locate and click the "Logout" button/link within the application.
*   **Expected Result:**
    *   User is successfully logged out.
    *   User is redirected to the login page.
    *   Any local session data (tokens in localStorage, user state in React contexts) is cleared.
    *   The `isLoggedOut` flag in `useAuth` becomes true.
    *   Attempting to navigate to a protected route (e.g., using browser history) should redirect back to the login page or show an unauthorized message.
*   **Actual Result:**
*   **Status:**

### 6. Failed Google Sign-In (e.g., Popup Closed)

*   **Test Case ID:** AUTH-MAN-006
*   **Description:** Verify graceful handling of a failed Google Sign-In attempt when the user closes the popup.
*   **Prerequisites:** None.
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  Click the "Continue with Google" button.
    3.  When the Google authentication popup window appears, close it manually before completing the Google authentication.
    4.  Observe the login page.
*   **Expected Result:**
    *   User remains on the login page.
    *   An appropriate error message is displayed, typically via a toast notification (e.g., "Google Sign-In Error: Popup closed by user." or similar, depending on Supabase's error).
    *   The `authError` state in `useAuth` might be populated with the error message, and this error should be displayed in the Alert component if not cleared.
    *   The application remains stable and allows another login attempt.
*   **Actual Result:**
*   **Status:**

### 7. Failed Email/Password Sign-In (Incorrect Credentials)

*   **Test Case ID:** AUTH-MAN-007
*   **Description:** Verify error handling for incorrect email/password during sign-in.
*   **Prerequisites:** An existing user account.
*   **Steps:**
    1.  Navigate to the application's login page.
    2.  Ensure the "Sign In" form is active.
    3.  Enter the email address of an existing user.
    4.  Enter an incorrect password.
    5.  Click the "Sign In" button.
*   **Expected Result:**
    *   User remains on the login page.
    *   An error message is displayed indicating invalid credentials (e.g., "Invalid login credentials"). This message should come from `authError` and be shown in the Alert component.
    *   The application remains stable and allows another login attempt.
*   **Actual Result:**
*   **Status:**

### 8. Session Expiry / Token Refresh Failure (Conceptual)

*   **Test Case ID:** AUTH-MAN-008
*   **Description:** Verify behavior when a session token needs refreshing but fails. This is primarily a conceptual test for manual execution unless specific developer tools are used to invalidate tokens.
*   **Prerequisites:** User is logged in.
*   **Steps:** (Conceptual - difficult to force manually without tools)
    1.  Log in to the application.
    2.  Leave the application open and idle for a period longer than the access token's validity (e.g., >1 hour if that's the Supabase setting).
    3.  Alternatively, if developer tools allow, manually delete the access token from browser storage (if applicable) and attempt an action that requires authentication, or try to invalidate the refresh token via Supabase dashboard if testing a specific user.
    4.  Attempt to perform an action that requires an authenticated session or wait for an automatic token refresh attempt.
*   **Expected Result:**
    *   The `onAuthStateChange` listener handles the `TOKEN_REFRESHED` event with a `null` session.
    *   The `authError` state is set to "Your session has expired or token refresh failed. Please sign in again." and displayed on the login page.
    *   The user is effectively logged out (local session cleared, `isLoggedOut` set to true).
    *   The user is redirected to the login page.
*   **Actual Result:**
*   **Status:**

### 9. Samsung Browser (Google Sign-In & Email/Password Sign-In)

*   **Test Case ID:** AUTH-MAN-009
*   **Description:** Test Google Sign-In and Email/Password Sign-In functionalities on a Samsung Internet Browser to check for any specific compatibility issues.
*   **Prerequisites:** Access to a Samsung device or an emulator with Samsung Internet Browser installed.
*   **Steps:**
    1.  **Google Sign-In (New User):**
        a.  Open the application in Samsung Internet Browser.
        b.  Follow the steps for Test Case AUTH-MAN-001 (Google Sign-Up).
        c.  Observe if the "Samsung browser issue" alert appears.
    2.  **Google Sign-In (Existing User):**
        a.  Open the application in Samsung Internet Browser.
        b.  Follow the steps for Test Case AUTH-MAN-002 (Google Sign-In).
        c.  Observe if the "Samsung browser issue" alert appears.
    3.  **Email/Password Sign-In (Existing User):**
        a.  Open the application in Samsung Internet Browser.
        b.  Follow the steps for Test Case AUTH-MAN-004 (Email/Password Sign-In).
*   **Expected Result:**
    *   All authentication flows (Google Sign-Up, Google Sign-In, Email/Password Sign-In) work as expected, similar to their behavior in Chrome.
    *   If the "Some Samsung devices may experience authentication issues..." alert appears (due to `isSamsungBrowser` returning true and `authAttempted` true), note its appearance. The functionality should ideally still work.
    *   No unexpected errors or UI glitches specific to Samsung Internet Browser.
*   **Actual Result:**
*   **Status:**

---
