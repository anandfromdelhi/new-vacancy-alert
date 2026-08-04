import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { getStatesWithCounts, getBoardsWithCounts } from '../utils/categoryUtils';
import { GraduationCap, MapPin, Building2, X, ChevronRight, Briefcase } from 'lucide-react';

interface JobEntry {
  id: string;
  title: string;
  link: string;
  lastDate: string | null;
  state: string;
  board: string;
  category: string;
  qualifications: string[];
}

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

  const statesData = activePopup === 'state' ? getStatesWithCounts(activeJobs) : [];
  const boardsData = activePopup === 'board' ? getBoardsWithCounts(activeJobs) : [];

  const qualifications = [
    { name: '10th Pass', slug: '10th-pass', icon: <Briefcase className="w-5 h-5 text-blue-500" /> },
    { name: '12th Pass', slug: '12th-pass', icon: <Briefcase className="w-5 h-5 text-emerald-500" /> },
    { name: 'BA', slug: 'ba', icon: <GraduationCap className="w-5 h-5 text-purple-500" /> },
    { name: 'B.Sc', slug: 'bsc', icon: <GraduationCap className="w-5 h-5 text-orange-500" /> },
    { name: 'B.Com', slug: 'bcom', icon: <GraduationCap className="w-5 h-5 text-rose-500" /> },
    { name: 'B.Tech', slug: 'btech', icon: <GraduationCap className="w-5 h-5 text-indigo-500" /> },
  ];

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

      {/* Popup Overlay */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
                {activePopup === 'qualification' && <><GraduationCap className="w-5 h-5 text-blue-600" /> Qualifications</>}
                {activePopup === 'state' && <><MapPin className="w-5 h-5 text-blue-600" /> States</>}
                {activePopup === 'board' && <><Building2 className="w-5 h-5 text-blue-600" /> Departments / Boards</>}
              </h3>
              <button
                onClick={closePopup}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto overflow-x-hidden pb-6 p-3 sm:p-5 flex-1 custom-scrollbar bg-slate-50">
              <div className="grid gap-2">
                {activePopup === 'qualification' &&
                  qualifications.map((q) => (
                    <Link
                      key={q.slug}
                      to={`/jobs-for/${q.slug}`}
                      onClick={closePopup}
                      className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                          {q.icon}
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                          {q.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}

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
                          <MapPin className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                          {s.name}
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
                          {b.name}
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
        </div>
      )}
    </div>
  );
}
