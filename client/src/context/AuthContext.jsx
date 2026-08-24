import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from '../services/firebase';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync profile from backend
  const refreshProfile = async () => {
    try {
      const res = await apiRequest('/api/auth/profile');
      if (res?.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('[AuthContext] Profile sync warning:', err.message);
    }
  };

  useEffect(() => {
    // Check if dev mock user is active
    const savedDevUser = localStorage.getItem('qrflex_dev_user');
    if (savedDevUser) {
      try {
        const parsed = JSON.parse(savedDevUser);
        setUser(parsed);
        refreshProfile().finally(() => setLoading(false));
        return;
      } catch (e) {
        localStorage.removeItem('qrflex_dev_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'QR Creator',
          photoURL: firebaseUser.photoURL || '',
          emailVerified: firebaseUser.emailVerified,
        });

        // Sync with backend MongoDB
        try {
          await apiRequest('/api/auth/sync', { method: 'POST' });
          await refreshProfile();
        } catch (err) {
          console.error('[AuthContext] Backend sync error:', err.message);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Sign In
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      if (auth?.app?.options?.apiKey && !auth.app.options.apiKey.includes('NotReal')) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      }
      throw new Error('FallbackToLocalAuth');
    } catch (error) {
      if (
        error.message === 'FallbackToLocalAuth' ||
        error.code === 'auth/api-key-not-valid' ||
        error.message?.includes('api-key-not-valid') ||
        error.message?.includes('invalid-api-key')
      ) {
        // Seamless Local Fallback: create session and sync with backend
        const uid = 'user_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
        const name = email.split('@')[0];
        const localUser = {
          uid,
          email,
          displayName: name,
          photoURL: '',
        };
        const mockToken = `token_${uid}`;
        localStorage.setItem('qrflex_dev_token', mockToken);
        localStorage.setItem('qrflex_dev_user', JSON.stringify(localUser));
        setUser(localUser);
        try {
          await apiRequest('/api/auth/sync', { method: 'POST' });
          await refreshProfile();
        } catch (e) {
          console.warn('Sync notice:', e.message);
        }
        return localUser;
      }
      setAuthError(error.message);
      throw error;
    }
  };

  // Email & Password Sign Up
  const registerWithEmail = async (email, password, displayName = '') => {
    setAuthError(null);
    try {
      if (auth?.app?.options?.apiKey && !auth.app.options.apiKey.includes('NotReal')) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      }
      throw new Error('FallbackToLocalAuth');
    } catch (error) {
      if (
        error.message === 'FallbackToLocalAuth' ||
        error.code === 'auth/api-key-not-valid' ||
        error.message?.includes('api-key-not-valid') ||
        error.message?.includes('invalid-api-key')
      ) {
        const uid = 'user_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
        const name = displayName || email.split('@')[0];
        const localUser = {
          uid,
          email,
          displayName: name,
          photoURL: '',
        };
        const mockToken = `token_${uid}`;
        localStorage.setItem('qrflex_dev_token', mockToken);
        localStorage.setItem('qrflex_dev_user', JSON.stringify(localUser));
        setUser(localUser);
        try {
          await apiRequest('/api/auth/sync', { method: 'POST' });
          await refreshProfile();
        } catch (e) {
          console.warn('Sync notice:', e.message);
        }
        return localUser;
      }
      setAuthError(error.message);
      throw error;
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential.user;
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
        const msg = 'Google Sign-In requires your real Firebase API Key. You can sign in with Email/Password or 1-Click Demo Login right now!';
        setAuthError(msg);
        const customErr = new Error(msg);
        throw customErr;
      }
      setAuthError(error.message);
      throw error;
    }
  };

  // Password Reset Email
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Demo / Quick Sign In (Enables testing immediately without configuring Firebase)
  const loginAsDemoUser = async (demoEmail = 'demo@qrflex.local', name = 'SaaS Demo User') => {
    const demoUser = {
      uid: 'demo_user_uid_1001',
      email: demoEmail,
      displayName: name,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isDemo: true,
    };
    localStorage.setItem('qrflex_dev_token', 'demo-token-1001');
    localStorage.setItem('qrflex_dev_user', JSON.stringify(demoUser));
    setUser(demoUser);
    await refreshProfile();
    return demoUser;
  };

  // Sign Out
  const logout = async () => {
    localStorage.removeItem('qrflex_dev_token');
    localStorage.removeItem('qrflex_dev_user');
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        loginAsDemoUser,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
