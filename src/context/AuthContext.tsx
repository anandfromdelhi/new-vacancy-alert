import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import GoogleLoginModal from '../components/GoogleLoginModal';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  loginModalTitle: string;
  loginModalSubtitle: string;
  openLoginModal: (onSuccessAction?: () => void, title?: string, subtitle?: string) => void;
  closeLoginModal: () => void;
  requireAuthForAction: (action: () => void, title?: string, subtitle?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalTitle, setLoginModalTitle] = useState<string>('Google Login Required');
  const [loginModalSubtitle, setLoginModalSubtitle] = useState<string>('Sign in with your Google Account to download PDFs, official notifications, and question papers for free.');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const openLoginModal = (onSuccessAction?: () => void, title?: string, subtitle?: string) => {
    if (onSuccessAction) {
      setPendingAction(() => onSuccessAction);
    } else {
      setPendingAction(null);
    }
    if (title) setLoginModalTitle(title);
    else setLoginModalTitle('Google Login Required');

    if (subtitle) setLoginModalSubtitle(subtitle);
    else setLoginModalSubtitle('Sign in with your Google Account to download PDFs, official notifications, and question papers for free.');

    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPendingAction(null);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (pendingAction) {
      const actionToRun = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        actionToRun();
      }, 100);
    }
  };

  const requireAuthForAction = (action: () => void, title?: string, subtitle?: string) => {
    if (user) {
      action();
    } else {
      openLoginModal(action, title, subtitle);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        isLoginModalOpen,
        loginModalTitle,
        loginModalSubtitle,
        openLoginModal,
        closeLoginModal,
        requireAuthForAction
      }}
    >
      {children}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
        title={loginModalTitle}
        subtitle={loginModalSubtitle}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
