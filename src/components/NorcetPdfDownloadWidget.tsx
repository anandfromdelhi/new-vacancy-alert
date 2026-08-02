import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Lock, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NorcetPdfDownloadWidgetProps {
  variant?: 'in-content' | 'sidebar' | 'banner' | 'compact';
  title?: string;
  subtitle?: string;
}

export default function NorcetPdfDownloadWidget({
  variant = 'in-content',
  title = 'AIIMS NORCET Previous Years Solved Question Papers (2017–2023)',
  subtitle = 'Download 8+ Full Solved Exam Question Papers with Answer Keys (AIIMS Raipur, Jodhpur, Bhopal, Delhi, NORCET 2020–2023) in PDF format.'
}: NorcetPdfDownloadWidgetProps) {
  const { user, requireAuthForAction } = useAuth();
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const candidatePaths = [
    '/aiims-norcet-previous-years-question-paperss.pdf',
    '/aiims-norcet-previous-years-question-papers.pdf',
    '/aiims-norcet-previous-years-question-paper.pdf',
    '/aiims-norcet-previous-years-questions-papers.pdf',
    '/aiims-norcet-previous-year-question-papers.pdf',
    '/aiims-norcet-previous-year-question-paper.pdf'
  ];

  const triggerDirectDownload = async () => {
    let targetPath = candidatePaths[0];

    // Auto-detect which file actually exists on server
    for (const path of candidatePaths) {
      try {
        const res = await fetch(path, { method: 'HEAD' });
        if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
          targetPath = path;
          break;
        }
      } catch (e) {
        // continue
      }
    }

    // Open PDF in a new browser tab
    window.open(targetPath, '_blank', 'noopener,noreferrer');

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 6000);
  };

  const handleDownloadClick = () => {
    requireAuthForAction(
      triggerDirectDownload,
      "Google Sign-In Required for PDF Download",
      "Please sign in with your Google Account to unlock and download AIIMS NORCET Solved Papers PDF for free."
    );
  };

  return (
    <>
      {/* Toast Alert on Successful Download */}
      {downloadSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-black">PDF Opened in New Tab!</p>
            <p className="text-emerald-200">View, save or print AIIMS NORCET Papers in the new tab.</p>
          </div>
        </div>
      )}

      {/* Sidebar Variant */}
      {variant === 'sidebar' && (
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-blue-500/30 shadow-xl space-y-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600/90 text-white rounded-xl shadow-md flex items-center justify-center shrink-0 border border-blue-400/40">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" /> NORCET Question Bank
              </span>
              <h4 className="text-xs font-black text-white leading-tight">Previous Papers PDF</h4>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            Get 8+ Memory-Based AIIMS Solved Papers (2017–2023) with complete official Answer Keys.
          </p>

          <div className="bg-white/10 rounded-xl p-2.5 space-y-1 border border-white/10 text-[10px] text-slate-200">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>AIIMS Raipur, Jodhpur, Bhopal & Delhi</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>NORCET 2020, 2021, 2022 & 2023</span>
            </div>
          </div>

          <button
            onClick={handleDownloadClick}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-400/40 group"
          >
            {user ? (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF Papers</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-300" />
                <span>Google Sign-In to Download PDF</span>
              </>
            )}
          </button>

          {!user && (
            <p className="text-[9.5px] text-slate-300 font-semibold text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400 inline" /> Free instant unlock with Google Login
            </p>
          )}
        </div>
      )}

      {/* Compact 1-Liner In-Content Variant */}
      {variant === 'compact' && (
        <div className="my-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-500/40 shadow-lg relative overflow-hidden print:hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-600/30 text-amber-300 border border-blue-400/30 shrink-0 shadow-xs">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30 shrink-0">
                    PDF Papers
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">
                    {title || 'AIIMS NORCET Previous Years Question Papers (2017–2023 Solved PDF)'}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                  {subtitle || '8+ Full Solved Question Papers with Answer Keys (AIIMS Raipur, Jodhpur, Bhopal, Delhi & NORCET)'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadClick}
              className="w-full sm:w-auto shrink-0 py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-400/40 whitespace-nowrap"
            >
              {user ? (
                <>
                  <Download className="h-4 w-4 text-white" />
                  <span>Download Papers PDF</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-300" />
                  <span>Sign-In & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* In-Content CTA Variant (Placed in-between content) */}
      {(variant === 'in-content' || variant === 'banner') && (
        <div className="my-8 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-blue-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-60 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-[11px] font-black text-blue-300 uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>Exclusive NORCET Study Material</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {subtitle}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  'AIIMS Raipur 2017',
                  'AIIMS Jodhpur 2017',
                  'AIIMS Bhopal 2018',
                  'AIIMS Delhi 2018',
                  'NORCET 2020 Paper',
                  'NORCET 2021 Paper',
                  'NORCET 2022 Paper',
                  'NORCET 2023 Paper'
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold text-blue-100 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-2">
              <button
                onClick={handleDownloadClick}
                className="w-full md:w-auto py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-3 cursor-pointer active:scale-98 border border-blue-400/40"
              >
                {user ? (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download Solved Papers PDF</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4.5 w-4.5 text-amber-300" />
                    <span>Sign-In & Download Papers PDF</span>
                  </>
                )}
              </button>

              {!user && (
                <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Free instant unlock with Google Login
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
