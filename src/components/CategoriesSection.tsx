import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { getStatesWithCounts, getBoardsWithCounts, getQualificationsWithCounts } from '../utils/categoryUtils';
import { GraduationCap, MapPin, Building2, X, ChevronRight } from 'lucide-react';

import { JobEntry } from '../data/jobsData';

interface CategoriesSectionProps {
  activeJobs: JobEntry[];
}

export default function CategoriesSection({ activeJobs }: CategoriesSectionProps) {
  const [activePopup, setActivePopup] = useState<'qualification' | 'state' | 'board' | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopup(null);
      }
    };
    if (activePopup) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activePopup]);

  const closePopup = () => setActivePopup(null);

  const qualificationsData = activePopup === 'qualification' ? getQualificationsWithCounts(activeJobs) : [];
  const statesData = activePopup === 'state' ? getStatesWithCounts(activeJobs) : [];
  const boardsData = activePopup === 'board' ? getBoardsWithCounts(activeJobs) : [];

  return (
    <div className="pt-2 space-y-2 text-center">
      {/* Label */}
      <span className="text-xs sm:text-sm font-black text-emerald-300 tracking-wide block">
        Browse by Category <span className="text-[10px] sm:text-xs font-medium text-blue-200 normal-case opacity-90 ml-1">tap to explore</span>
      </span>
      {/* 3 Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActivePopup('qualification')}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-white/10 hover:bg-emerald-400 hover:text-slate-950 text-blue-50 border border-white/25 hover:border-emerald-300 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" /> Qualification Wise
        </button>
        <button
          onClick={() => setActivePopup('state')}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-white/10 hover:bg-emerald-400 hover:text-slate-950 text-blue-50 border border-white/25 hover:border-emerald-300 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <MapPin className="w-4 h-4" /> State Wise
        </button>
        <button
          onClick={() => setActivePopup('board')}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-white/10 hover:bg-emerald-400 hover:text-slate-950 text-blue-50 border border-white/25 hover:border-emerald-300 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Building2 className="w-4 h-4" /> Board Wise
        </button>
      </div>

      {/* Popup Overlay using React Portal to render at body root */}
      {activePopup && createPortal(
        <div className="fixed inset-0 z-[9999] text-left flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closePopup}
          ></div>

          {/* Panel */}
          <div
            ref={panelRef}
            className="relative w-full sm:w-[480px] max-h-[75vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col transform transition-transform animate-slide-up sm:animate-none overflow-hidden"
            style={{
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>
            {/* Drag Handle (Mobile only) */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {activePopup === 'qualification' && (
                  <>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span>Qualification Wise Vacancies</span>
                  </>
                )}
                {activePopup === 'state' && (
                  <>
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span>State Wise Vacancies</span>
                  </>
                )}
                {activePopup === 'board' && (
                  <>
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Board / Org Wise</span>
                  </>
                )}
              </h3>
              <button
                onClick={closePopup}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 flex-1">
              <div className="space-y-2">
                {/* Qualification List */}
                {activePopup === 'qualification' &&
                  qualificationsData.map((q) => (
                    <Link
                      key={q.slug}
                      to={`/jobs-for/${q.slug}`}
                      onClick={closePopup}
                      className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors shrink-0">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {q.name} <span className="text-slate-400 font-bold text-xs ml-1">({q.count})</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                          {q.count}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  ))}

                 {activePopup === 'qualification' && qualificationsData.length === 0 && (
                   <div className="py-8 text-center text-slate-500 font-medium">No qualification vacancies currently available.</div>
                 )}

                {/* State List */}
                {activePopup === 'state' &&
                  statesData.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/state/${s.slug}`}
                      onClick={closePopup}
                      className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                          {s.name} <span className="text-slate-400 font-bold text-xs ml-1">({s.count})</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                          {s.count}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </Link>
                  ))}

                 {activePopup === 'state' && statesData.length === 0 && (
                   <div className="py-8 text-center text-slate-500 font-medium">No state vacancies currently available.</div>
                 )}

                {/* Board List */}
                {activePopup === 'board' &&
                  boardsData.map((b) => (
                    <Link
                      key={b.slug}
                      to={`/board/${b.slug}`}
                      onClick={closePopup}
                      className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors shrink-0">
                          <Building2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors truncate">
                          {b.name} <span className="text-slate-400 font-bold text-xs ml-1">({b.count})</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                          {b.count}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                  
                   {activePopup === 'board' && boardsData.length === 0 && (
                     <div className="py-8 text-center text-slate-500 font-medium">No board vacancies currently available.</div>
                  )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
