import React, { useState } from 'react';
import { Send, X, ExternalLink, RefreshCw, Copy, Check, Loader2 } from 'lucide-react';

interface ConnectTelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairingData: { token: string; deepLink: string; expiresAt: string; botUsername: string } | null;
  timeLeftSeconds: number;
  telegramLoading: boolean;
  onCheckStatus: () => void;
  title?: string;
  subtitle?: string;
}

export default function ConnectTelegramModal({
  isOpen,
  onClose,
  pairingData,
  timeLeftSeconds,
  telegramLoading,
  onCheckStatus,
  title = 'Connect Telegram',
  subtitle = 'Link in 3 simple steps to activate instant job alerts'
}: ConnectTelegramModalProps) {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 border border-white/20 shadow-xs">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black">{title}</h3>
              <p className="text-[11px] text-sky-100 font-medium">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {pairingData ? (
            <>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Click <strong>"Open Telegram"</strong> below to launch our verified bot chat.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    In Telegram, press the <strong>"START"</strong> button at the bottom of the screen.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Return to this window. Your account will link and enable alerts automatically.
                  </span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Link valid for:</span>
                <span
                  className={`font-mono font-black ${
                    timeLeftSeconds < 120 ? 'text-rose-600' : 'text-blue-700'
                  }`}
                >
                  {Math.floor(timeLeftSeconds / 60)}:
                  {(timeLeftSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={pairingData.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Open Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onCheckStatus}
                  disabled={telegramLoading}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${telegramLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {telegramLoading
                      ? 'Verifying...'
                      : "I've pressed Start in Telegram (Check Status)"}
                  </span>
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
            </>
          ) : (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-7 h-7 text-sky-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-bold">Generating secure Telegram pairing link...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
