import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  testConnection,
  isUserAdmin 
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isCloudSyncing: boolean;
  setIsCloudSyncing: (syncing: boolean) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Run connection test on app boot
    testConnection().catch((err) => {
      console.warn('Initial Firebase connectivity test returned:', err);
    });

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setAuthError(null);
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setAuthError(err?.message || 'Authentication failed');
      }
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      await logoutUser();
    } catch (err: any) {
      setAuthError(err?.message || 'Sign out failed');
    }
  };

  const clearAuthError = () => setAuthError(null);
  const isAdmin = Boolean(user && isUserAdmin(user));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isCloudSyncing,
        setIsCloudSyncing,
        signIn,
        signOut,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
