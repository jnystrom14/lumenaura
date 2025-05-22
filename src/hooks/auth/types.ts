
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoggedOut: boolean;
  authError: string | null;
}

export interface AuthActions {
  clearAuthError: () => void;
  setIsLoggedOut: (value: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

export interface AuthResult {
  success: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState, AuthActions {
  isSamsungBrowser: boolean;
}
