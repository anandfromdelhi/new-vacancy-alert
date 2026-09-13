import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
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
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isTelegramConnected = Boolean(telegramLink && telegramLink.isActive);

  // Server-verified Telegram status check with automatic modal sync
  const checkTelegramStatus = useCallback(async (): Promise<TelegramLink | null> => {
    if (!user) {
      setTelegramLink(null);
      setTelegramLoading(false);
      return null;
    }
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/telegram/user-status`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.link && data.link.isActive) {
            setTelegramLink(data.link);
            if (isTelegramModalOpen) {
              setIsTelegramModalOpen(false);
            }
            if (pendingAction) {
              const actionToRun = pendingAction;
              setPendingAction(null);
              setTimeout(() => {
                actionToRun();
              }, 150);
            }
            return data.link;
          } else {
            setTelegramLink(null);
          }
        }
      }
    } catch (err) {
      console.warn('Notice checking Telegram status from API:', err);
    } finally {
      setTelegramLoading(false);
    }
    return null;
  }, [user, isTelegramModalOpen, pendingAction]);

  // Real-time listener and window focus synchronization
  useEffect(() => {
    if (!user?.uid) {
      setTelegramLink(null);
      setTelegramLoading(false);
      return;
    }

    setTelegramLoading(true);
    // Initial check from server API
    checkTelegramStatus();

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
              if (isTelegramModalOpen) {
                setIsTelegramModalOpen(false);
              }
              if (pendingAction) {
                const actionToRun = pendingAction;
                setPendingAction(null);
                setTimeout(() => {
                  actionToRun();
                }, 150);
              }
            }
          } else {
            checkTelegramStatus();
          }
          setTelegramLoading(false);
        },
        () => {
          checkTelegramStatus();
        }
      );
    } catch {
      checkTelegramStatus();
    }

    // Refresh immediately when returning to tab from Telegram app
    const handleFocus = () => {
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
  }, [user?.uid, isTelegramModalOpen, pendingAction, checkTelegramStatus]);

  // Fast polling (every 2.5s) while Telegram pairing modal is open
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
      setPendingAction(() => onSuccessAction);
    } else {
      setPendingAction(null);
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
    setPendingAction(null);
  };

  // Disconnect Telegram via authenticated server endpoint
  const disconnectTelegram = async (): Promise<boolean> => {
    if (!user) return false;

    setDisconnectLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/telegram/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        setTelegramLink((prev) => prev ? { ...prev, isActive: false } : null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Network error while disconnecting Telegram:', err);
      return false;
    } finally {
      setDisconnectLoading(false);
    }
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
