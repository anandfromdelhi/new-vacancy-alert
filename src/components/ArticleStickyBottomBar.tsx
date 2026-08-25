import React, { useState } from 'react';
import { 
  FileDown, Share2, MessageSquare, Check, Copy, 
  Send, ExternalLink, ArrowUp, Sparkles, Printer
} from 'lucide-react';

interface ArticleStickyBottomBarProps {
  title?: string;
  description?: string;
  commentsCount?: number;
  commentsTargetId?: string;
}

export default function ArticleStickyBottomBar({
  title,
  description,
  commentsCount,
  commentsTargetId = 'comments-section'
}: ArticleStickyBottomBarProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleDownloadPdf = () => {
    // Triggers clean browser print to save as PDF
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://newvacancyalert.in';
    const shareTitle = title || (typeof document !== 'undefined' ? document.title : 'NewVacancyAlert.in');
    const shareText = description || shareTitle;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy/menu
        if ((err as any).name !== 'AbortError') {
          setShowShareMenu(!showShareMenu);
        }
        return;
      }
    }

    // Toggle fallback share menu
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`*${title || document.title}*\n\nRead complete article here: ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      setShowShareMenu(false);
    }
  };

  const handleTelegramShare = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(title || document.title);
      window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      setShowShareMenu(false);
    }
  };

  const handleScrollToComments = () => {
    const commentsEl = document.getElementById(commentsTargetId) || document.querySelector('[data-comments-section]');
    if (commentsEl) {
      commentsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a subtle brief pulse highlight
      commentsEl.classList.add('ring-4', 'ring-blue-400', 'transition-all', 'duration-500');
      setTimeout(() => {
        commentsEl.classList.remove('ring-4', 'ring-blue-400');
      }, 2000);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Toast Notification when link copied */}
      {copied && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Article link copied to clipboard!</span>
        </div>
      )}

      {/* Fallback Share Popover Menu */}
      {showShareMenu && (
        <div className="fixed bottom-18 sm:bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-[90%] max-w-sm space-y-3 animate-scale-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-600" /> Share this Article
            </span>
            <button 
              onClick={() => setShowShareMenu(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-md"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200/60"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleTelegramShare}
              className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer border border-sky-200/60"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Telegram</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Action Bar / Floating Dock */}
      <aside 
        aria-label="Article Actions"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.12)] px-3 py-2.5 print:hidden safe-area-bottom
                   md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto md:max-w-max md:rounded-full md:bg-slate-900/90 md:backdrop-blur-lg md:border md:border-slate-700/70 md:shadow-2xl md:px-3 md:py-2 md:border-t-0"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between md:justify-center gap-2 md:gap-2.5">
          
          {/* 1. Download as PDF Button */}
          <button
            onClick={handleDownloadPdf}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-2.5 md:py-2 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs md:text-sm rounded-xl md:rounded-full shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Download full article as PDF or print"
          >
            <FileDown className="w-4 h-4 shrink-0 text-white" />
            <span className="whitespace-nowrap">Download as PDF</span>
          </button>

          {/* 2. Share Button */}
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-2.5 md:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 md:bg-slate-800/80 md:hover:bg-slate-700 md:text-slate-100 md:hover:text-white font-bold text-xs md:text-sm rounded-xl md:rounded-full border border-indigo-200/80 md:border-slate-700 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Share article with friends or study groups"
          >
            <Share2 className="w-4 h-4 text-indigo-600 md:text-indigo-400 shrink-0" />
            <span className="whitespace-nowrap">Share</span>
          </button>

          {/* 3. Comments Button */}
          <button
            onClick={handleScrollToComments}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-2.5 md:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 md:bg-blue-600 md:hover:bg-blue-500 md:text-white font-bold text-xs md:text-sm rounded-xl md:rounded-full border border-blue-200/80 md:border-blue-500/50 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Jump to reader discussion & comments"
          >
            <div className="relative flex items-center">
              <MessageSquare className="w-4 h-4 text-blue-600 md:text-white shrink-0" />
              {typeof commentsCount === 'number' && commentsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-600 md:bg-amber-400 md:text-slate-950 text-white text-[9px] font-black px-1 rounded-full">
                  {commentsCount}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap">Comments</span>
          </button>

          {/* 4. Quick Scroll to Top Button */}
          <button
            onClick={handleScrollToTop}
            className="hidden md:flex items-center justify-center p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full border border-slate-700 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

        </div>
      </aside>
    </>
  );
}
