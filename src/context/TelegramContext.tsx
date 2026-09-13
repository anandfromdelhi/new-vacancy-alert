import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { doc, onSnapshot, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { TelegramLink } from '../types/alertTypes';
import { API_BASE_URL } from '../utils/apiConfig';
import ConnectTelegramModal from '../components/ConnectTelegramModal';

interface TelegramContextType {
  telegramLink: TelegramLink | null;
  isTelegramConnected: boolean;
  telegramLoading: boolean;
  isTelegramModalOpen: boolean;
  pairingLoading: boolean;
  disconnectLoading: boolean;
  timeLeftSeconds: number;
  pairingData: { token: string; deepLink: string; expiresAt: string; botUsername: string } | null;
  checkTelegramStatus: () => Promise<TelegramLink | null>;
  openTelegramModal: (onSuccessAction?: () => void, title?: string, subtitle?: string) => Promise<void>;
  closeTelegramModal: () => void;
  disconnectTelegram: () => Promise<boolean>;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const { user, loginWithGoogle } = useAuth();

  const [telegramLink, setTelegramLink] = useState<TelegramLink | null>(null);
  const [telegramLoading, setTelegramLoading] = useState<boolean>(true);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Connect Telegram');
  const [modalSubtitle, setModalSubtitle] = useState<string>('Link in 3 simple steps to activate instant job alerts');
  const [pairingData, setPairingData] = useState<{ token: string; deepLink: string; expiresAt: string; botUsername: string } | null>(null);
  const [pairingLoading, setPairingLoading] = useState<boolean>(false);
  const [disconnectLoading, setDisconnectLoading] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const isTelegramConnected = Boolean(telegramLink && telegramLink.isActive);

  // Server & Firestore verified Telegram status check with automatic modal sync
  const checkTelegramStatus = useCallback(async (): Promise<TelegramLink | null> => {
    if (!user?.uid) {
      setTelegramLink(null);
      setTelegramLoading(false);
      return null;
    }
    setTelegramLoading(true);
    try {
      // 1. Direct Firestore check (fastest, most reliable)
      const snap = await getDoc(doc(db, 'telegram_links', user.uid));
      if (snap.exists()) {
        const data = snap.data() as TelegramLink;
        setTelegramLink(data);
        if (data.isActive) {
          setIsTelegramModalOpen(false);
          if (pendingActionRef.current) {
            const actionToRun = pendingActionRef.current;
            pendingActionRef.current = null;
            setTimeout(() => {
              try {
                actionToRun();
              } catch (err) {
                console.error('Error running pending action after Telegram connection:', err);
              }
            }, 150);
          }
          return data;
        }
      }

      // 2. Fallback check to API if configured
      if (API_BASE_URL) {
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/telegram/user-status`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.link && data.link.isActive) {
            setTelegramLink(data.link);
            setIsTelegramModalOpen(false);
            if (pendingActionRef.current) {
              const actionToRun = pendingActionRef.current;
              pendingActionRef.current = null;
              setTimeout(() => {
                try {
                  actionToRun();
                } catch (err) {
                  console.error('Error running pending action after Telegram connection:', err);
                }
              }, 150);
            }
            return data.link;
          }
        }
      }
    } catch (err) {
      console.warn('Notice checking Telegram status:', err);
    } finally {
      setTelegramLoading(false);
    }
    return null;
  }, [user]);

  // Real-time listener: strictly decoupled from modal & pending action states to prevent loop
  useEffect(() => {
    if (!user?.uid) {
      setTelegramLink(null);
      setTelegramLoading(false);
      return;
    }

    setTelegramLoading(true);

    // Real-time Firestore snapshot listener
    let unsub = () => {};
    try {
      unsub = onSnapshot(
        doc(db, 'telegram_links', user.uid),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as TelegramLink;
            setTelegramLink(data);
            if (data.isActive) {
              setIsTelegramModalOpen(false);
              if (pendingActionRef.current) {
                const actionToRun = pendingActionRef.current;
                pendingActionRef.current = null;
                setTimeout(() => {
                  try {
                    actionToRun();
                  } catch (err) {
                    console.error('Error running pending action after Telegram connection:', err);
                  }
                }, 150);
              }
            }
          } else {
            setTelegramLink(null);
          }
          setTelegramLoading(false);
        },
        (error) => {
          console.warn('Firestore telegram link listener notice:', error.message);
          setTelegramLoading(false);
        }
      );
    } catch {
      setTelegramLoading(false);
    }

    // Refresh when returning to tab from Telegram app (debounced to 2s to prevent multiple rapid triggers)
    let lastFocusTime = 0;
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusTime < 2000) return;
      lastFocusTime = now;
      checkTelegramStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleFocus);
    }

    return () => {
      unsub();
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleFocus);
      }
    };
  }, [user?.uid, checkTelegramStatus]);

  // Fast polling (every 2.5s) ONLY while Telegram pairing modal is open
  useEffect(() => {
    if (!isTelegramModalOpen || !user) return;

    const pollInterval = setInterval(() => {
      checkTelegramStatus();
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [isTelegramModalOpen, user, checkTelegramStatus]);

  // Expiration countdown timer for Telegram pairing modal
  useEffect(() => {
    if (!isTelegramModalOpen || !pairingData) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(pairingData.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTelegramModalOpen, pairingData]);

  // Request new pairing token from server and open modal
  const openTelegramModal = async (
    onSuccessAction?: () => void,
    title?: string,
    subtitle?: string
  ) => {
    if (onSuccessAction) {
      pendingActionRef.current = onSuccessAction;
    } else {
      pendingActionRef.current = null;
    }

    if (title) setModalTitle(title);
    else setModalTitle('Connect Telegram');

    if (subtitle) setModalSubtitle(subtitle);
    else setModalSubtitle('Link in 3 simple steps to activate instant job alerts');

    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = await loginWithGoogle();
        if (!currentUser) return;
      } catch {
        return;
      }
    }

    setPairingLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/telegram/create-pairing-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('API server returned unexpected response format. Please verify connection.');
      }

      const data = await res.json();
      if (data.success && data.deepLink) {
        setPairingData(data);
        const remaining = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));
        setTimeLeftSeconds(remaining);
        setIsTelegramModalOpen(true);
      } else {
        console.error('Failed to create pairing token:', data.error);
        alert(data.error || 'Failed to generate Telegram connection link.');
      }
    } catch (err: any) {
      console.error('Network error while connecting to Telegram:', err);
      alert(err.message || 'Network error while connecting to Telegram.');
    } finally {
      setPairingLoading(false);
    }
  };

  const closeTelegramModal = () => {
    setIsTelegramModalOpen(false);
    pendingActionRef.current = null;
  };

  // Disconnect Telegram: updates Firestore directly via client SDK and notifies server
  const disconnectTelegram = async (): Promise<boolean> => {
    if (!user?.uid) return false;

    setDisconnectLoading(true);
    let firestoreUpdated = false;

    // 1. Direct client-side Firestore update (works instantly across all deployments)
    try {
      const linkDocRef = doc(db, 'telegram_links', user.uid);
      await updateDoc(linkDocRef, {
        isActive: false,
        updatedAt: new Date().toISOString()
      });
      firestoreUpdated = true;
    } catch (err: any) {
      try {
        const linkDocRef = doc(db, 'telegram_links', user.uid);
        await deleteDoc(linkDocRef);
        firestoreUpdated = true;
      } catch (delErr: any) {
        console.warn('Client-side direct Firestore disconnect notice:', delErr.message);
      }
    }

    // 2. Also notify backend API (in case backend synchronization is active)
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/telegram/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          firestoreUpdated = true;
        }
      }
    } catch {
      // Ignore network errors if backend is not deployed as a separate service
    } finally {
      setDisconnectLoading(false);
    }

    // 3. Immediately set state to disconnected
    setTelegramLink((prev) => (prev ? { ...prev, isActive: false } : null));
    return firestoreUpdated;
  };

  return (
    <TelegramContext.Provider
      value={{
        telegramLink,
        isTelegramConnected,
        telegramLoading,
        isTelegramModalOpen,
        pairingLoading,
        disconnectLoading,
        timeLeftSeconds,
        pairingData,
        checkTelegramStatus,
        openTelegramModal,
        closeTelegramModal,
        disconnectTelegram
      }}
    >
      {children}
      <ConnectTelegramModal
        isOpen={isTelegramModalOpen}
        onClose={closeTelegramModal}
        pairingData={pairingData}
        timeLeftSeconds={timeLeftSeconds}
        telegramLoading={telegramLoading}
        onCheckStatus={checkTelegramStatus}
        title={modalTitle}
        subtitle={modalSubtitle}
      />
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}
