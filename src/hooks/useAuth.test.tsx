import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/profileService';
import { User, Session } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(),
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Mock profileService
jest.mock('@/services/profileService', () => ({
  fetchUserProfile: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper to create a mock user
const createMockUser = (id: string, overrides = {}): User => ({
  id,
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  ...overrides,
});

// Helper to create a mock session
const createMockSession = (user: User, overrides = {}): Session => ({
  access_token: 'mock_access_token',
  refresh_token: 'mock_refresh_token',
  user,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  ...overrides,
});

describe('useAuth Hook', () => {
  let mockOnAuthStateChangeCallback: ((event: string, session: Session | null) => void) | null = null;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();

    // Setup default mock for onAuthStateChange to capture the callback
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      mockOnAuthStateChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: jest.fn() } },
      };
    });

    // Default mock for getSession (no initial session)
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null }, error: null });
  });

  test('should initialize with correct default states', async () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(true); // Initially true, then false after getSession
    expect(result.current.isLoggedOut).toBe(false);
    expect(result.current.authError).toBeNull();
    expect(result.current.isLoadingProfile).toBe(false);
    expect(result.current.isProfileReady).toBeNull();

    // Wait for getSession to resolve
    await act(async () => {});
    expect(result.current.loading).toBe(false);
  });

  describe('onAuthStateChange Event Handling', () => {
    const mockUser = createMockUser('user1');
    const mockSession = createMockSession(mockUser);

    test('SIGNED_IN event should update state and check profile', async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {}); // Initial getSession

      (fetchUserProfile as jest.Mock).mockResolvedValueOnce({ name: 'Test User', birthDay: 1, birthMonth: 1, birthYear: 1990 });

      expect(mockOnAuthStateChangeCallback).not.toBeNull();
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', mockSession);
      });
      
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.session).toEqual(mockSession);
      expect(result.current.isLoggedOut).toBe(false);
      expect(result.current.authError).toBeNull();
      expect(fetchUserProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result.current.isLoadingProfile).toBe(false); // Should be false after check completes
      expect(result.current.isProfileReady).toBe(true);
    });

    test('SIGNED_OUT event should clear user, session, and profile states', async () => {
      // Setup initial logged-in state
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({ data: { session: mockSession }, error: null });
      (fetchUserProfile as jest.Mock).mockResolvedValueOnce({ name: 'Test User', birthDay: 1, birthMonth: 1, birthYear: 1990 });
      const { result } = renderHook(() => useAuth());
      await act(async () => {}); // Initial getSession & profile check
      
      expect(result.current.user).not.toBeNull();
      expect(result.current.isProfileReady).toBe(true);

      expect(mockOnAuthStateChangeCallback).not.toBeNull();
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_OUT', null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoggedOut).toBe(true);
      expect(result.current.authError).toBeNull();
      expect(result.current.isLoadingProfile).toBe(false);
      expect(result.current.isProfileReady).toBeNull();
    });

    test('USER_UPDATED event should update user state', async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {}); 

      const updatedUser = createMockUser('user1', { user_metadata: { name: 'Updated Name' } });
      const updatedSession = createMockSession(updatedUser);
      
      await act(async () => {
        mockOnAuthStateChangeCallback!('USER_UPDATED', updatedSession);
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(result.current.session).toEqual(updatedSession); // Session also updates
    });

    test('TOKEN_REFRESHED (success) event should update session and user', async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {});

      const refreshedUser = createMockUser('user1', { email: 'refreshed@example.com' });
      const refreshedSession = createMockSession(refreshedUser, { access_token: 'new_access_token'});
      
      await act(async () => {
        mockOnAuthStateChangeCallback!('TOKEN_REFRESHED', refreshedSession);
      });

      expect(result.current.session).toEqual(refreshedSession);
      expect(result.current.user).toEqual(refreshedUser);
      expect(result.current.isLoggedOut).toBe(false);
      expect(result.current.authError).toBeNull();
    });

    test('TOKEN_REFRESHED (failure - null session) event should log out user and set error', async () => {
      // Setup initial logged-in state
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({ data: { session: mockSession }, error: null });
      (fetchUserProfile as jest.Mock).mockResolvedValueOnce({ name: 'Test User', birthDay: 1, birthMonth: 1, birthYear: 1990 });
      const { result } = renderHook(() => useAuth());
      await act(async () => {}); 
      
      expect(result.current.user).not.toBeNull();

      await act(async () => {
        mockOnAuthStateChangeCallback!('TOKEN_REFRESHED', null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoggedOut).toBe(true);
      expect(result.current.authError).toBe("Your session has expired or token refresh failed. Please sign in again.");
    });
  });

  describe('signInWithEmail', () => {
    const email = 'test@example.com';
    const password = 'password123';

    test('successful sign-in should clear authError', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error: null });
      const { result } = renderHook(() => useAuth());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signInWithEmail(email, password);
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
      expect(result.current.authError).toBeNull();
      expect(signInResult).toEqual({ success: true, error: null });
    });

    test('failed sign-in should set authError', async () => {
      const error = { message: 'Invalid credentials' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error });
      const { result } = renderHook(() => useAuth());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signInWithEmail(email, password);
      });
      
      expect(result.current.authError).toBe(error.message);
      expect(signInResult).toEqual({ success: false, error: error.message });
    });
  });

  describe('signUpWithEmail', () => {
    const email = 'newuser@example.com';
    const password = 'newpassword123';

    test('successful sign-up should clear authError', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: null });
      const { result } = renderHook(() => useAuth());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUpWithEmail(email, password);
      });
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({ email, password });
      expect(result.current.authError).toBeNull();
      expect(signUpResult).toEqual({ success: true, error: null });
    });

    test('failed sign-up should set authError', async () => {
      const error = { message: 'User already exists' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error });
      const { result } = renderHook(() => useAuth());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUpWithEmail(email, password);
      });

      expect(result.current.authError).toBe(error.message);
      expect(signUpResult).toEqual({ success: false, error: error.message });
    });
  });

  describe('signInWithGoogle', () => {
    test('successful initiation should clear authError', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: null });
      const { result } = renderHook(() => useAuth());

      let googleSignInResult;
      await act(async () => {
        googleSignInResult = await result.current.signInWithGoogle();
      });
      
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        },
      });
      expect(result.current.authError).toBeNull();
      expect(googleSignInResult).toEqual({ success: true, error: null });
    });

    test('failed initiation should set authError', async () => {
      const error = { message: 'OAuth error' };
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error });
      const { result } = renderHook(() => useAuth());
      
      let googleSignInResult;
      await act(async () => {
        googleSignInResult = await result.current.signInWithGoogle();
      });

      expect(result.current.authError).toBe(error.message);
      expect(googleSignInResult).toEqual({ success: false, error: error.message });
    });
  });

  describe('signOut', () => {
    const mainAuthTokenKey = 'sb-bpolzfohirmqkmvubjzo-auth-token';
    const legacyTokenKey = 'supabase.auth.token';

    beforeEach(() => {
      localStorageMock.setItem(mainAuthTokenKey, 'some-token');
      localStorageMock.setItem(legacyTokenKey, 'some-legacy-token');
    });

    test('successful Supabase sign-out should clear local state and localStorage', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({ error: null });
      const { result } = renderHook(() => useAuth());
      
      // Simulate initial logged-in state for this test
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(createMockUser('test-user')));
      });
      expect(result.current.user).not.toBeNull();


      let signOutResult;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoggedOut).toBe(true);
      expect(localStorageMock.getItem(mainAuthTokenKey)).toBeNull();
      expect(localStorageMock.getItem(legacyTokenKey)).toBeNull();
      expect(signOutResult).toEqual({ success: true, error: null });
    });

    test('failed Supabase sign-out (Session not found) should still clear local state', async () => {
      const error = { message: 'Session not found' };
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({ error });
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(createMockUser('test-user')));
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoggedOut).toBe(true);
      expect(localStorageMock.getItem(mainAuthTokenKey)).toBeNull();
    });
    
    test('exception during Supabase sign-out should still clear local state', async () => {
      (supabase.auth.signOut as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(createMockUser('test-user')));
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoggedOut).toBe(true);
      expect(localStorageMock.getItem(mainAuthTokenKey)).toBeNull();
    });
  });

  describe('checkAndSetUserProfileStatus', () => {
    const mockUser = createMockUser('profileUser');

    test('complete profile should set isProfileReady to true', async () => {
      (fetchUserProfile as jest.Mock).mockResolvedValueOnce({ name: 'Test User', birthDay: 1, birthMonth: 1, birthYear: 1990 });
      const { result } = renderHook(() => useAuth());

      // Simulate SIGNED_IN to trigger the check
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(mockUser));
      });
      
      expect(fetchUserProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result.current.isLoadingProfile).toBe(false);
      expect(result.current.isProfileReady).toBe(true);
    });

    test('incomplete profile should set isProfileReady to false', async () => {
      (fetchUserProfile as jest.Mock).mockResolvedValueOnce({ name: 'Test User', birthDay: null, birthMonth: 1, birthYear: 1990 }); // Incomplete
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(mockUser));
      });

      expect(result.current.isProfileReady).toBe(false);
      expect(result.current.isLoadingProfile).toBe(false);
    });
    
    test('null profile (not found) should set isProfileReady to false', async () => {
      (fetchUserProfile as jest.Mock).mockResolvedValueOnce(null);
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(mockUser));
      });

      expect(result.current.isProfileReady).toBe(false);
      expect(result.current.isLoadingProfile).toBe(false);
    });

    test('fetchUserProfile error should set isProfileReady to false and set authError', async () => {
      const error = new Error('Failed to fetch');
      (fetchUserProfile as jest.Mock).mockRejectedValueOnce(error);
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        mockOnAuthStateChangeCallback!('SIGNED_IN', createMockSession(mockUser));
      });
      
      expect(result.current.isProfileReady).toBe(false);
      expect(result.current.isLoadingProfile).toBe(false);
      expect(result.current.authError).toBe("Could not verify profile status. Please try again.");
    });
  });
  
  describe('isSamsungBrowser', () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
      // Restore original user agent
      Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
    });

    test('should return true for Samsung user agent', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36', configurable: true });
      const { result } = renderHook(() => useAuth());
      expect(result.current.isSamsungBrowser).toBe(true);
    });
    
    test('should return true for sm- user agent', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 (Linux; Android 9; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36', configurable: true });
      const { result } = renderHook(() => useAuth());
      expect(result.current.isSamsungBrowser).toBe(true);
    });

    test('should return false for non-Samsung user agent', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36', configurable: true });
      const { result } = renderHook(() => useAuth());
      expect(result.current.isSamsungBrowser).toBe(false);
    });
  });

  test('loading and isLoadingProfile states should be managed correctly', async () => {
    (supabase.auth.getSession as jest.Mock).mockReturnValue(new Promise(resolve => setTimeout(() => resolve({ data: { session: null }, error: null }), 50)));
    (fetchUserProfile as jest.Mock).mockReturnValue(new Promise(resolve => setTimeout(() => resolve({ name: 'Test User', birthDay: 1, birthMonth: 1, birthYear: 1990 }), 100)));
    
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true); // Initial auth loading

    await act(async () => {
      // Wait for getSession to complete
      await new Promise(resolve => setTimeout(resolve, 60));
    });
    expect(result.current.loading).toBe(false); // Auth loading done

    // Simulate SIGNED_IN to trigger profile loading
    const mockUser = createMockUser('loadingUser');
    const mockSession = createMockSession(mockUser);
    
    //isLoadingProfile becomes true immediately when checkAndSetUserProfileStatus is called
    // then false when it finishes
    await act(async () => {
       if (mockOnAuthStateChangeCallback) mockOnAuthStateChangeCallback('SIGNED_IN', mockSession);
    });

    // Since fetchUserProfile is async, isLoadingProfile will be true while it runs.
    // The state update inside checkAndSetUserProfileStatus will set isLoadingProfile to true, then to false.
    // We need to wait for the fetchUserProfile mock to resolve.
    expect(result.current.isLoadingProfile).toBe(true); // Right after calling, before fetchUserProfile resolves in this tick
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 110)); // Wait for fetchUserProfile
    });
    
    expect(result.current.isLoadingProfile).toBe(false); // Profile loading done
    expect(result.current.isProfileReady).toBe(true);
  });

});

// Example of how to manually trigger onAuthStateChange for more complex scenarios if needed:
//
// const { result } = renderHook(() => useAuth());
// // ... later in a test
// act(() => {
//   if (mockOnAuthStateChangeCallback) {
//     mockOnAuthStateChangeCallback('SOME_EVENT', null);
//   }
// });
//
// This ensures that React processes the state update triggered by the callback.
