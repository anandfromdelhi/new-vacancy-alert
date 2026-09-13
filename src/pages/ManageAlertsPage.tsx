import React, { useState, useEffect, useCallback } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  Bell, CheckCircle2, PauseCircle, PlayCircle, Trash2, 
  Plus, AlertCircle, Loader2, ArrowLeft, ShieldCheck, 
  Send, Sparkles, MapPin, GraduationCap, RefreshCw,
  X, Check, ExternalLink, Copy, Unlink
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  getUserSubscriptions, 
  toggleSubscriptionStatus, 
  deleteSubscription, 
  addManualSubscription 
} from '../services/alertSubscriptionService';
import { JobAlertSubscription, TelegramLink } from '../types/alertTypes';
import { QUAL_CATEGORIES, STATE_MAP, toSlug } from '../utils/categoryUtils';
import { API_BASE_URL } from '../utils/apiConfig';

export default function ManageAlertsPage() {
  const { user, loginWithGoogle } = useAuth();

  const [subscriptions, setSubscriptions] = useState<JobAlertSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedQual, setSelectedQual] = useState<string>('ba');
  const [selectedLoc, setSelectedLoc] = useState<string>('all-india');
  const [isSubmittingManual, setIsSubmittingManual] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Telegram Connection State
  const [telegramLink, setTelegramLink] = useState<TelegramLink | null>(null);
  const [telegramLoading, setTelegramLoading] = useState<boolean>(true);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(false);
  const [pairingData, setPairingData] = useState<{ token: string; deepLink: string; expiresAt: string; botUsername: string } | null>(null);
  const [pairingLoading, setPairingLoading] = useState<boolean>(false);
  const [disconnectLoading, setDisconnectLoading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);

  // Server-verified Telegram status check with automatic modal sync
  const checkTelegramStatus = useCallback(async () => {
    if (!user) return;
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
              setStatusMessage({
                type: 'success',
                text: 'Telegram connected successfully! Your job alerts are now active on Telegram.'
              });
              setTimeout(() => setStatusMessage(null), 5000);
            }
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
  }, [user, isTelegramModalOpen]);

  // Real-time listener and window focus synchronization for Telegram connection status
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
            if (data.isActive && isTelegramModalOpen) {
              setIsTelegramModalOpen(false);
              setStatusMessage({
                type: 'success',
                text: 'Telegram connected successfully! Your job alerts are now active on Telegram.'
              });
              setTimeout(() => setStatusMessage(null), 5000);
            }
          } else {
            // Verify with API before concluding not connected
            checkTelegramStatus();
          }
          setTelegramLoading(false);
        },
        () => {
          // If Firestore direct read encounters permission or network issue, verify with API
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

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      unsub();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [user?.uid, isTelegramModalOpen, checkTelegramStatus]);

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

  // Request new pairing token from server
  const handleOpenTelegramModal = async () => {
    if (!user) {
      loginWithGoogle();
      return;
    }

    setPairingLoading(true);
    try {
      const idToken = await user.getIdToken();
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
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to generate Telegram connection link.'
        });
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error while connecting to Telegram.'
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setPairingLoading(false);
    }
  };

  // Disconnect Telegram via authenticated server endpoint (preserves all job subscriptions)
  const handleDisconnectTelegram = async () => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to disconnect Telegram notifications?\n\nNote: Your active job alert subscriptions will remain completely intact.')) {
      return;
    }

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
        setStatusMessage({
          type: 'success',
          text: 'Telegram account disconnected. Your job alert subscriptions remain saved.'
        });
        setTimeout(() => setStatusMessage(null), 5000);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to disconnect Telegram.'
        });
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error while disconnecting Telegram.'
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setDisconnectLoading(false);
    }
  };

  // Load subscriptions
  const loadSubscriptions = async () => {
    if (!user?.uid) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getUserSubscriptions(user.uid);
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [user?.uid]);

  const handleToggleStatus = async (sub: JobAlertSubscription) => {
    const newStatus = !sub.isActive;
    const success = await toggleSubscriptionStatus(sub.id, newStatus);
    if (success) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, isActive: newStatus } : s))
      );
      setStatusMessage({
        type: 'success',
        text: `Alert for ${sub.qualificationLabel} in ${sub.locationLabel} is now ${newStatus ? 'Active' : 'Paused'}.`
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDelete = async (sub: JobAlertSubscription) => {
    if (!window.confirm(`Are you sure you want to delete the alert for "${sub.qualificationLabel} in ${sub.locationLabel}"?`)) {
      return;
    }

    const success = await deleteSubscription(sub.id);
    if (success) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
      setStatusMessage({
        type: 'success',
        text: `Deleted alert for ${sub.qualificationLabel} in ${sub.locationLabel}.`
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleAddManualAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSubmittingManual(true);
    try {
      const result = await addManualSubscription({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || 'Candidate',
        qualificationSlug: selectedQual,
        locationSlug: selectedLoc
      });

      if (result.success) {
        setStatusMessage({ type: 'success', text: result.message });
        setIsAddModalOpen(false);
        await loadSubscriptions();
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to add alert.' });
    } finally {
      setIsSubmittingManual(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const allStates = Object.keys(STATE_MAP).sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Helmet>
        <title>My Job Alerts & Subscriptions | NewVacancyAlert</title>
        <meta
          name="description"
          content="Manage your active government job alert preferences. Choose specific qualifications and states to receive verified vacancy updates."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md">
                  <Bell className="w-5 h-5 fill-slate-950" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                  My Job Alerts & Subscriptions
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">
                Personalized vacancy notifications customized to your exact qualifications and preferred locations.
              </p>
            </div>

            {user && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Alert</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 relative z-10 space-y-6">
        
        {/* Status Toast Banner */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Telegram Notifications Status Card */}
        {user && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  telegramLink?.isActive 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-sky-50 text-sky-600 border-sky-200'
                }`}>
                  <Send className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Telegram Notifications
                    </h3>
                    {telegramLoading ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Checking...
                      </span>
                    ) : telegramLink?.isActive ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        🟢 Telegram Connected
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        🔴 Telegram Not Connected
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => { setTelegramLoading(true); checkTelegramStatus(); }}
                      disabled={telegramLoading}
                      title="Refresh connection status"
                      className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition inline-flex items-center justify-center cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${telegramLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    {telegramLink?.isActive ? (
                      <>
                        Notifications will be sent to your connected Telegram account
                        {telegramLink.telegramUsername ? (
                          <strong className="text-slate-900"> (@{telegramLink.telegramUsername})</strong>
                        ) : ''}
                        .
                      </>
                    ) : (
                      'Connect your Telegram account to receive instant verified job vacancy alerts directly on your smartphone or desktop.'
                    )}
                  </p>

                  {telegramLink?.isActive && telegramLink.connectedAt && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      Connected since {new Date(telegramLink.connectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center">
                {telegramLink?.isActive ? (
                  <button
                    type="button"
                    onClick={handleDisconnectTelegram}
                    disabled={disconnectLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {disconnectLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Disconnecting...</span>
                      </>
                    ) : (
                      <>
                        <Unlink className="w-3.5 h-3.5" />
                        <span>Disconnect Telegram</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenTelegramModal}
                    disabled={pairingLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {pairingLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Preparing Link...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Connect Telegram</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        {!user ? (
          /* Not Signed In Card */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Sign in to View Your Job Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Sign in with your Google account to access, customize, pause, or delete your active job alert preferences.
              </p>
            </div>
            <button
              onClick={() => loginWithGoogle()}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading your subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          /* Empty Subscriptions Card */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
              <Bell className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                No Active Job Alerts Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You haven't added any job alerts yet. Click below or browse any job page to activate alerts for your qualification and state.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Alert</span>
            </button>
          </div>
        ) : (
          /* List of Subscriptions */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Active Subscriptions ({subscriptions.length})
              </h2>
              <button
                onClick={loadSubscriptions}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-all space-y-3 ${
                    sub.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                        <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{sub.qualificationLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{sub.locationLabel}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        sub.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sub.isActive ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {sub.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {sub.sourceJobTitle && (
                    <p className="text-[11px] text-slate-400 truncate">
                      Source: {sub.sourceJobTitle}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleStatus(sub)}
                      className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        sub.isActive
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {sub.isActive ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(sub)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Delete subscription"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Alert Card alongside added alerts */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white hover:bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-500 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer min-h-[140px]"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs group-hover:scale-110">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors block">
                    Add New Alert
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-500 transition-colors block mt-0.5">
                    Select qualification & location
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Alert Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/30 border border-blue-400/40">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-black">Add Custom Job Alert</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualAlert} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Qualification
                </label>
                <select
                  value={selectedQual}
                  onChange={(e) => setSelectedQual(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {QUAL_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Location / State
                </label>
                <select
                  value={selectedLoc}
                  onChange={(e) => setSelectedLoc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all-india">All India (Nationwide)</option>
                  {allStates.map((state) => (
                    <option key={state} value={toSlug(state)}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingManual ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Alert</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Telegram Modal */}
      {isTelegramModalOpen && pairingData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsTelegramModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/15 border border-white/20">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">Connect Telegram</h3>
                  <p className="text-[11px] text-sky-100 font-medium">Link in 3 simple steps</p>
                </div>
              </div>
              <button
                onClick={() => setIsTelegramModalOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>Click <strong>"Open Telegram"</strong> below to launch our verified bot chat.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span>In Telegram, press the <strong>"START"</strong> button at the bottom of the screen.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span>Return to this page. Your account will link automatically.</span>
                </div>
              </div>

              {/* Countdown timer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Link valid for:</span>
                <span className={`font-mono font-black ${timeLeftSeconds < 120 ? 'text-rose-600' : 'text-blue-700'}`}>
                  {Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={pairingData.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <Send className="w-4 h-4" />
                  <span>Open Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => { setTelegramLoading(true); checkTelegramStatus(); }}
                  disabled={telegramLoading}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${telegramLoading ? 'animate-spin' : ''}`} />
                  <span>{telegramLoading ? 'Verifying...' : "I've pressed Start in Telegram (Check Status)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pairingData.deepLink);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Connection Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
