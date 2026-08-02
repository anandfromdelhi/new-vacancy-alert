import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, Loader2, X, Settings, RefreshCw, AlertTriangle } from 'lucide-react';

export default function SubscribeWidget({ 
  variant = 'desktop', 
  mode = 'top' 
}: { 
  variant?: 'desktop' | 'mobile'; 
  mode?: 'top' | 'bottom'; 
}) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<string>('default');
  const [showInstructions, setShowInstructions] = useState(false);

  const updateStatus = () => {
    const OneSignal = (window as any).OneSignal;
    
    // Update permission status
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }

    if (OneSignal?.User?.PushSubscription) {
      setIsSubscribed(OneSignal.User.PushSubscription.optedIn || false);
      setIsLoading(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    let checkInterval: any;
    let changeListenerAdded = false;

    const initStatus = () => {
      const OneSignal = (window as any).OneSignal;
      const success = updateStatus();
      
      if (success && OneSignal?.User?.PushSubscription && !changeListenerAdded) {
        try {
          OneSignal.User.PushSubscription.addEventListener("change", (event: any) => {
            if (event?.current?.optedIn !== undefined) {
              setIsSubscribed(event.current.optedIn);
            }
            if (typeof Notification !== 'undefined') {
              setPermission(Notification.permission);
            }
          });
          changeListenerAdded = true;
        } catch (e) {
          console.warn("Could not register OneSignal change listener:", e);
        }
      }
      return success;
    };

    // Try immediately
    if (initStatus()) {
      return;
    }

    // Otherwise poll for a few seconds until OneSignal is loaded
    checkInterval = setInterval(() => {
      if (initStatus()) {
        clearInterval(checkInterval);
      }
    }, 500);

    // Limit polling to 10 seconds max to avoid infinite loop if OneSignal fails to load
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      setIsLoading(false);
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleSubscribe = async () => {
    const OneSignal = (window as any).OneSignal;
    if (!OneSignal) {
      console.warn("OneSignal Web SDK is not fully loaded yet.");
      return;
    }

    // If notifications are blocked, show the instructional modal instead of failing silently
    if (permission === 'denied') {
      setShowInstructions(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isSubscribed) {
        await OneSignal.User.PushSubscription.optOut();
        setIsSubscribed(false);
      } else {
        await OneSignal.User.PushSubscription.optIn();
        
        // Give a brief delay for permission state to reflect
        setTimeout(() => {
          if (typeof Notification !== 'undefined') {
            setPermission(Notification.permission);
          }
          setIsSubscribed(OneSignal.User.PushSubscription?.optedIn || false);
        }, 500);
      }
    } catch (err) {
      console.error("Error toggling OneSignal subscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshPermission = () => {
    // Manually trigger a check of the permission state
    if (typeof Notification !== 'undefined') {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      
      if (currentPermission !== 'denied') {
        // If they fixed it, attempt to opt-in automatically and close the instructions
        const OneSignal = (window as any).OneSignal;
        if (OneSignal?.User?.PushSubscription) {
          OneSignal.User.PushSubscription.optIn().then(() => {
            setIsSubscribed(true);
            setShowInstructions(false);
          }).catch(console.error);
        } else {
          // Fallback refresh to reinitialize properly
          window.location.reload();
        }
      } else {
        // Still blocked, alert the user or show a state
        alert("Notification permission is still showing as blocked. Please ensure you clicked 'Allow' in your browser settings before clicking this button.");
      }
    }
  };

  // Check if browser notifications are permanently blocked
  const isBlocked = permission === 'denied';

  // Bottom Variant (Unsubscribe card if subscribed, Subscribe card if not subscribed)
  if (mode === 'bottom') {
    if (isSubscribed) {
      return (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 relative overflow-hidden print:hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full filter blur-xl -mr-6 -mt-6"></div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl shrink-0 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                Live Job Alerts Active
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">You are successfully subscribed to receive instant government job updates.</p>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-600 border border-slate-200 hover:border-slate-300 rounded-xl transition duration-150 active:scale-95 flex items-center justify-center gap-1.5 shrink-0 shadow-3xs"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <BellOff className="h-3.5 w-3.5" />
                <span>Unsubscribe Alerts</span>
              </>
            )}
          </button>
        </div>
      );
    }
  }

  // Top Mode Logic
  // If subscribed, we do not show any notification banner or confirmation badge at the top of the page anymore, as requested.
  if (isSubscribed) {
    return null;
  }

  // Desktop Card Variant (When NOT subscribed)
  return (
    <>
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl -mr-6 -mt-6"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl -ml-6 -mb-6"></div>
        
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-xl border-2 shrink-0 flex items-center justify-center transition-all ${
            isBlocked
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            {isBlocked ? (
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            ) : (
              <Bell className="h-6 w-6 animate-pulse" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                isBlocked
                  ? 'bg-amber-50 border-amber-200 text-amber-800 animate-pulse'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                {isBlocked ? 'Action Required' : 'Recommended'}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Push Notifications</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              {isBlocked
                ? 'Notifications are currently blocked by your browser'
                : 'Get Instant Job Notifications directly on your screen'}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
              {isBlocked 
                ? 'Your web browser settings are blocking job alerts. To start receiving instant government vacancy updates, please unblock them using the button below.'
                : 'Be the first to apply! Never miss critical active vacancy deadlines, application form updates, or newly published syllabus links.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSubscribe}
            disabled={isLoading && !isBlocked}
            className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${
              isBlocked
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-b-4 border-amber-700 active:border-b-0 shadow-md hover:shadow-lg'
                : 'bg-[#16a34a] hover:bg-[#15803d] text-white border-b-4 border-[#15803d] active:border-b-0 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading && !isBlocked ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isBlocked ? (
              <>
                <Settings className="h-4 w-4 shrink-0" />
                <span>How to Unblock?</span>
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 shrink-0 fill-white" />
                <span>Subscribe to Job Alerts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern High-Contrast Step-by-Step Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-slate-100 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150 relative">
            
            {/* Close button */}
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-500 rounded-2xl shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800">Unblock Web Push Alerts</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Instructions for newvacancyalert.in</p>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To start receiving instant government job alerts, please enable notifications by following these simple steps:
              </p>

              <div className="space-y-3">
                <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-800">Locate the address bar</p>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Look at the very top of your browser screen next to <strong>newvacancyalert.in</strong>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-800">Tap the Lock 🔒 or Settings icon</p>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Tap the lock or settings toggle next to the website address in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-800">Enable "Notifications"</p>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Locate the <strong>Notifications</strong> permission switch and toggle it to <strong>Allow</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleRefreshPermission}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 border-b-4 border-[#15803d] active:border-b-0"
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                <span>Verify & Refresh Status</span>
              </button>
              
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold transition"
              >
                Cancel / Close
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center leading-normal">
              Note: If you don't see these settings, you may be using an in-app browser (like Telegram or Facebook). Please open this site in normal Google Chrome or Safari.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
