import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export default function GoogleLoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Google Login Required",
  subtitle = "Sign in with your Google Account to download PDFs, official notifications, and question papers for free."
}: GoogleLoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggingIn(false);
      onSuccess();
    } catch (error: any) {
      console.error("Login popup failed:", error);
      setIsLoggingIn(false);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage("Sign-in popup was closed. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setErrorMessage(`Domain Unauthorized (${domain}): Please ensure BOTH '${domain}' AND 'www.${domain.replace('www.', '')}' are added in Firebase Console -> Authentication -> Settings -> Authorised domains. (Allow 2-5 min for Firebase to update).`);
      } else {
        setErrorMessage(error.message || "Failed to sign in with Google. Please try again.");
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm print:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-300/40 text-white flex items-center justify-center mb-3 shadow-lg">
            <Lock className="h-6 w-6 text-amber-300" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-400/30">
            Authentication Required
          </span>

          <h3 className="text-lg sm:text-xl font-black text-white mt-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <ul className="space-y-2.5 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Unlimited access to all Job Notification PDFs</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Download Exam Syllabus, Cutoffs & Question Papers</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Fast 1-click Google account verification</span>
            </li>
          </ul>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-lg border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-75"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>100% Free & Secure. No password required.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
