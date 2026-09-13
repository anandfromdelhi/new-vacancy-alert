import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { 
  Bell, CheckCircle2, X, Sparkles, Check, 
  ExternalLink, Loader2, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJobAlertOptions } from '../utils/alertOptionsExtractor';
import { 
  subscribeToAlertCombinations, 
  getUserSubscriptions,
  buildSubscriptionDocId 
} from '../services/alertSubscriptionService';
import { AlertCombination, JobAlertOptions } from '../types/alertTypes';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

export default function JobAlertModal({ isOpen, onClose, job }: JobAlertModalProps) {
  const { user, loginWithGoogle, isLoginModalOpen } = useAuth();

  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [existingDocIds, setExistingDocIds] = useState<Set<string>>(new Set());
  const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<{ saved: number; active: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract structured options from the job
  const alertOptions: JobAlertOptions = useMemo(() => {
    return getJobAlertOptions(job);
  }, [job]);

  // Pre-select all available options when modal opens or job changes
  useEffect(() => {
    if (isOpen) {
      setSelectedQuals(alertOptions.qualifications.map((q) => q.slug));
      setSelectedLocs(alertOptions.locations.map((l) => l.slug));
      setIsSuccess(false);
      setSuccessResult(null);
      setErrorMessage(null);
    }
  }, [isOpen, alertOptions]);

  // Check which combinations the user is already subscribed to
  useEffect(() => {
    if (isOpen && user?.uid) {
      let isMounted = true;
      setIsLoadingExisting(true);
      getUserSubscriptions(user.uid)
        .then((subs) => {
          if (isMounted) {
            const activeIds = new Set<string>();
            subs.forEach((s) => {
              if (s.isActive) {
                activeIds.add(buildSubscriptionDocId(user.uid, s.qualification, s.location));
              }
            });
            setExistingDocIds(activeIds);
            setIsLoadingExisting(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingExisting(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setExistingDocIds(new Set());
    }
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  // Compute the valid combinations that intersect the user's selected qualifications and locations
  const selectedValidCombinations = useMemo(() => {
    return alertOptions.validCombinations.filter((combo) => {
      return (
        selectedQuals.includes(combo.qualificationSlug) &&
        selectedLocs.includes(combo.locationSlug)
      );
    });
  }, [alertOptions.validCombinations, selectedQuals, selectedLocs]);

  const toggleQual = (slug: string) => {
    setSelectedQuals((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleLoc = (slug: string) => {
    setSelectedLocs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Google Sign-In failed. Please try again.');
      }
    }
  };

  const handleSubscribe = async () => {
    if (!user?.uid) {
      handleGoogleLogin();
      return;
    }

    if (selectedValidCombinations.length === 0) {
      setErrorMessage('Please select at least one qualification and location combination.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await subscribeToAlertCombinations({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || 'Candidate',
        combinations: selectedValidCombinations,
        sourceJobId: alertOptions.jobId,
        sourceJobTitle: alertOptions.jobTitle
      });

      if (result.errors.length > 0 && result.savedCount === 0 && result.alreadyActiveCount === 0) {
        setErrorMessage(result.errors[0]);
      } else {
        setIsSuccess(true);
        setSuccessResult({
          saved: result.savedCount,
          active: result.alreadyActiveCount
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save alert preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const singleCombination = alertOptions.isSingleCombination
    ? alertOptions.validCombinations[0]
    : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs print:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 sm:p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Bell className="h-5 w-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30">
                Personalized Job Alert
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight mt-1">
                {alertOptions.isSingleCombination
                  ? 'Instant Vacancy Alert'
                  : 'Choose Your Job Alerts'}
              </h3>
            </div>
          </div>

          <p className="text-xs text-blue-100 mt-2 font-medium line-clamp-1">
            {alertOptions.jobTitle}
          </p>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  Alert Subscriptions Activated!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {successResult?.saved ? (
                    <span>
                      Successfully added <strong>{successResult.saved}</strong> alert {successResult.saved === 1 ? 'preference' : 'preferences'} to your account.
                    </span>
                  ) : null}
                  {successResult?.active ? (
                    <span className="block text-slate-500 mt-0.5">
                      ({successResult.active} alert {successResult.active === 1 ? 'preference was' : 'preferences were'} already active).
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 max-h-40 overflow-y-auto">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Active Alert Profiles:
                </p>
                {selectedValidCombinations.map((combo, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{combo.qualificationLabel}</span>
                    <span className="text-slate-400 font-normal">in</span>
                    <span className="text-blue-700 font-extrabold">{combo.locationLabel}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  to="/manage-alerts"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Manage My Alerts</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Not Logged In Banner */}
              {!user && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-extrabold text-amber-900">Google Account Required</p>
                    <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                      Sign in with your Google account to save and manage your personalized vacancy notifications.
                    </p>
                  </div>
                </div>
              )}

              {/* CASE A: Single Qualification + Single Location */}
              {alertOptions.isSingleCombination && singleCombination ? (
                <div className="space-y-4 py-2">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Direct Alert
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      Get alerts for future{' '}
                      <span className="text-blue-700 font-black underline decoration-blue-300">
                        {singleCombination.qualificationLabel}
                      </span>{' '}
                      jobs in{' '}
                      <span className="text-indigo-700 font-black underline decoration-indigo-300">
                        {singleCombination.locationLabel}
                      </span>.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      You will receive verified notification updates whenever matching vacancies are published.
                    </p>
                  </div>
                </div>
              ) : (
                /* CASE B: Multiple Qualifications and/or Multiple Locations */
                <div className="space-y-4">
                  {/* Qualification Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        1. Select Qualification(s):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedQuals.length === alertOptions.qualifications.length) {
                            setSelectedQuals([]);
                          } else {
                            setSelectedQuals(alertOptions.qualifications.map((q) => q.slug));
                          }
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {selectedQuals.length === alertOptions.qualifications.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alertOptions.qualifications.map((qual) => {
                        const isSelected = selectedQuals.includes(qual.slug);
                        return (
                          <label
                            key={qual.slug}
                            onClick={() => toggleQual(qual.slug)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-3xs'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                            />
                            <span className="truncate">{qual.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        2. Select Location(s):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedLocs.length === alertOptions.locations.length) {
                            setSelectedLocs([]);
                          } else {
                            setSelectedLocs(alertOptions.locations.map((l) => l.slug));
                          }
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {selectedLocs.length === alertOptions.locations.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alertOptions.locations.map((loc) => {
                        const isSelected = selectedLocs.includes(loc.slug);
                        return (
                          <label
                            key={loc.slug}
                            onClick={() => toggleLoc(loc.slug)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-3xs'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                            />
                            <span className="truncate">{loc.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Valid Intersected Combinations Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Active Combinations ({selectedValidCombinations.length}):
                      </span>
                      {selectedValidCombinations.length === 0 && (
                        <span className="text-[10px] font-bold text-rose-600">
                          Select at least 1 combination
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedValidCombinations.length > 0 ? (
                        selectedValidCombinations.map((combo, idx) => {
                          const docId = user?.uid
                            ? buildSubscriptionDocId(user.uid, combo.qualificationSlug, combo.locationSlug)
                            : '';
                          const isAlreadyActive = existingDocIds.has(docId);

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 text-xs bg-white border border-slate-200 p-2 rounded-lg font-bold"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span className="text-slate-800 truncate">
                                  {combo.qualificationLabel}
                                </span>
                                <span className="text-slate-400 font-normal">in</span>
                                <span className="text-blue-700 truncate">
                                  {combo.locationLabel}
                                </span>
                              </div>
                              {isAlreadyActive && (
                                <span className="shrink-0 text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                  Already Active
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 py-2 text-center italic">
                          No valid alert combinations match your current selection.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {user ? (
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={isSubmitting || selectedValidCombinations.length === 0}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Subscriptions...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 fill-white" />
                        <span>
                          {alertOptions.isSingleCombination
                            ? 'Subscribe to Alerts'
                            : `Subscribe to ${selectedValidCombinations.length} Selected Alerts`}
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-black text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
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
                    <span>Sign in with Google to Enable Alerts</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
