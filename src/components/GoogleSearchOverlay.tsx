import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowLeft, X, ArrowUpLeft, Sparkles, TrendingUp, Briefcase, ChevronRight, RotateCcw } from 'lucide-react';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { useNavigationLoader } from '../context/NavigationContext';

interface GoogleSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  archiveOnly?: boolean;
  customJobsPool?: JobEntry[];
  contextTitle?: string;
}

interface AdditionalSearchPage {
  id: string;
  title: string;
  category: string;
  path: string;
  subtitle?: string;
}

function parseDateString(dateStr: string): Date {
  if (!dateStr || dateStr === '–' || dateStr.trim() === '' || dateStr.toLowerCase().includes('instant')) {
    return new Date(1970, 0, 1);
  }
  const cleanStr = dateStr.replace(/\//g, '-').trim();
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1000) {
      return new Date(year, month, day);
    }
  }
  const nativeParsed = new Date(dateStr);
  if (!isNaN(nativeParsed.getTime())) {
    return nativeParsed;
  }
  return new Date(1970, 0, 1);
}

function isJobExpired(lastDateStr: string): boolean {
  if (!lastDateStr) return false;
  const parsed = parseDateString(lastDateStr);
  if (parsed.getFullYear() < 2000) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed < today;
}

const ADDITIONAL_PAGES: AdditionalSearchPage[] = [
  {
    id: 'aiims-norcet-11-nursing-officer-2026',
    title: 'AIIMS NORCET-11 Nursing Officer 2218+ Vacancies',
    category: 'Medical Alert',
    path: '/aiims-norcet-11-nursing-officer-2026',
    subtitle: 'Official recruitment notification, qualifications, last date & online apply'
  },
  {
    id: 'aiims-norcet-11-cutoff-marks',
    title: 'AIIMS NORCET-11 Cutoff Marks & Rank Predictor',
    category: 'Medical Article',
    path: '/aiims-norcet-11-nursing-officer-2026/cutoff',
    subtitle: 'Nursing Officer expected cut-off percentile and qualifying marks'
  },
  {
    id: 'rrb-exam-calendar-2026-27',
    title: 'RRB Exam Calendar 2026-27 & Railway Schedule',
    category: 'Railway Alert',
    path: '/rrb-exam-calendar-2026-27',
    subtitle: 'Official RRB recruitment schedules, ALP, NTPC & Group D dates'
  },
  {
    id: 'ssc-exam-calendar-2026-27',
    title: 'SSC Exam Calendar 2026-27 – CGL, CHSL, MTS & CPO Dates',
    category: 'SSC Alert',
    path: '/ssc-exam-calendar',
    subtitle: 'Staff Selection Commission notification and exam dates'
  },
  {
    id: 'govt-job-salary-calculator',
    title: '7th Pay Commission Salary Calculator 2026',
    category: 'Tool',
    path: '/salary-calculator',
    subtitle: 'Calculate in-hand pay, DA (53%), HRA, TA & Grade Pay'
  },
  {
    id: 'articles',
    title: 'All Government Recruitment Guides & Articles',
    category: 'Guides',
    path: '/articles',
    subtitle: 'Browse all exam preparation articles and Sarkari guidelines'
  }
];

const TRENDING_SEARCHES = [
  'MPYPIL Management 2026',
  'HARTRON Junior Programmer',
  'District Court Bhadrak',
  'UPSC Principal Delhi',
  'RRB Railway Jobs 2026',
  'KGBV Teacher Bulandshahr',
  'AIIMS NORCET-11',
  'ISRO Apprentices 2026',
  '10th Pass Govt Jobs',
  'Anganwadi Helper UP'
];

const ARCHIVED_TRENDING_SEARCHES = [
  'Thane Municipal Corporation',
  'Davanagere DHFWS Nurse',
  'Vijayapura DHFWS',
  'RVUNL Rajasthan Power',
  'Delhi RTRMH Senior Resident',
  'Jamui DCPU Support Person',
  'PMMH Delhi Senior Resident',
  'ICAI Executive Officer'
];

export const GoogleSearchOverlay: React.FC<GoogleSearchOverlayProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  archiveOnly = false,
  customJobsPool,
  contextTitle
}) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { startLoading } = useNavigationLoader();

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Target jobs pool: If customJobsPool is passed, use ONLY that pool
  const jobsPool = customJobsPool
    ? customJobsPool
    : archiveOnly
    ? JOBS_DATA.filter(job => isJobExpired(job.l))
    : JOBS_DATA;

  // Search logic for jobs
  const jobResults = cleanQuery
    ? jobsPool.filter(job => {
        const board = (job.b || '').toLowerCase();
        const title = (job.t || '').toLowerCase();
        const qual = (job.q || '').toLowerCase();
        const advt = (job.a || '').toLowerCase();
        const desc = (job.desc || '').toLowerCase();
        const id = (job.id || '').toLowerCase();

        return (
          title.includes(cleanQuery) ||
          board.includes(cleanQuery) ||
          qual.includes(cleanQuery) ||
          advt.includes(cleanQuery) ||
          desc.includes(cleanQuery) ||
          id.includes(cleanQuery)
        );
      }).slice(0, 20)
    : [];

  // Search logic for additional pages (disabled when customJobsPool or archiveOnly is active)
  const pageResults = (!customJobsPool && !archiveOnly && cleanQuery)
    ? ADDITIONAL_PAGES.filter(p => 
        p.title.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(cleanQuery))
      )
    : [];

  const totalResultsCount = jobResults.length + pageResults.length;

  const handleSelectJob = (jobId?: string) => {
    if (!jobId) return;
    startLoading('Loading search result...');
    onClose();
    navigate(`/${jobId}`);
  };

  const handleSelectPage = (path: string) => {
    startLoading('Loading requested page...');
    onClose();
    navigate(path);
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageResults.length > 0) {
      handleSelectPage(pageResults[0].path);
    } else if (jobResults.length > 0 && jobResults[0].id) {
      handleSelectJob(jobResults[0].id);
    }
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // Utility to highlight search query within text
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + highlight.length);
    const after = text.substring(index + highlight.length);

    return (
      <>
        {before}
        <span className="text-blue-600 font-extrabold underline decoration-blue-500/40 underline-offset-2">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-50 text-slate-900 flex flex-col font-sans animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Top Search Bar Row - Styled like Website Light Search */}
      <div className="w-full bg-white border-b border-slate-200 px-3 py-2.5 sm:py-3 flex items-center gap-2 shadow-xs shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          aria-label="Back / Close search"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <form 
          onSubmit={handleSubmitSearch}
          className="flex-1 relative flex items-center bg-slate-100 border border-slate-300 rounded-full px-3.5 py-1.5 sm:py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2.5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              contextTitle 
                ? `Search within ${contextTitle}...` 
                : archiveOnly 
                ? "Search archived recruitments (closed applications)... font-semibold" 
                : "Search jobs, board, qualification..."
            }
            className="w-full bg-transparent text-slate-900 text-sm sm:text-base font-semibold placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </form>
      </div>

      {/* Main Search Body / Indexed Results List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 bg-slate-50">
        {!cleanQuery ? (
          /* Empty Query State: Show Trending Searches & Quick Badges */
          <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 mb-3">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>{archiveOnly ? 'Trending Archived Recruitments' : 'Trending Searches in India'}</span>
              </div>
              <div className="space-y-1">
                {(archiveOnly ? ARCHIVED_TRENDING_SEARCHES : TRENDING_SEARCHES).map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="w-full text-left flex items-center justify-between py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50/80 text-slate-800 hover:text-amber-800 transition group border border-slate-200/80 hover:border-amber-200 shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0" />
                      <span className="text-sm font-bold truncate">{term}</span>
                    </div>
                    <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-2.5">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Railway Jobs', query: 'Railway' },
                  { name: 'UPSC Recruitment', query: 'UPSC' },
                  { name: '10th / 12th Pass', query: '10th' },
                  { name: 'District Courts', query: 'District Court' },
                  { name: 'Anganwadi Posts', query: 'Anganwadi' },
                  { name: 'ISRO / Defence', query: 'ISRO' },
                  { name: 'Apprenticeships', query: 'Apprentice' },
                  { name: 'Engineering', query: 'B.Tech' }
                ].map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTrendingClick(tag.query)}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-700 transition shadow-2xs cursor-pointer"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Search Results List */
          <div className="w-full">
            {totalResultsCount === 0 ? (
              <div className="p-8 text-center space-y-3 max-w-md mx-auto">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  No matching recruitment notifications found
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try searching for keywords like <strong className="text-slate-800">"Railway"</strong>, <strong className="text-slate-800">"UPSC"</strong>, <strong className="text-slate-800">"District Court"</strong>, or board names like <strong className="text-slate-800">"HARTRON"</strong> or <strong className="text-slate-800">"MPYPIL"</strong>.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Search</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-extrabold text-slate-500">
                  <span>{totalResultsCount} Indexed Results</span>
                  <span className="text-[11px] text-blue-600 font-bold">Tap to view subpage</span>
                </div>

                {/* Additional Pages Matching Query */}
                {pageResults.length > 0 && (
                  <div className="border-b border-slate-200">
                    {pageResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPage(p.path)}
                        className="w-full text-left px-4 py-3 sm:py-3.5 flex items-center justify-between bg-white hover:bg-blue-50/70 active:bg-blue-100 transition border-b border-slate-200/80 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 block truncate">
                              {renderHighlightedText(p.title, cleanQuery)}
                            </span>
                            {p.subtitle && (
                              <span className="text-xs text-slate-500 truncate block">
                                {p.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="hidden sm:inline text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            {p.category}
                          </span>
                          <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Single Line Indexed Job Results */}
                {jobResults.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job.id)}
                    className="w-full text-left px-4 py-3 sm:py-3.5 flex items-center justify-between bg-white hover:bg-blue-50/70 active:bg-blue-100 transition border-b border-slate-200/80 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      <div className="truncate">
                        {/* Single line display: Board - Title */}
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate transition">
                          <span className="text-slate-800 font-extrabold mr-1">
                            {renderHighlightedText(job.b, cleanQuery)}:
                          </span>
                          <span>
                            {renderHighlightedText(job.t, cleanQuery)}
                          </span>
                        </div>
                        {/* Compact sub-info: Qualification & Last Date */}
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-2">
                          <span className="truncate">Qual: {job.q}</span>
                          <span className="text-slate-300">•</span>
                          <span className="shrink-0 text-amber-700 font-bold">Last Date: {job.l}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer helper */}
      <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500 shrink-0 font-medium">
        Direct navigation to official job notification sub-pages • NewVacancyAlert.in
      </div>
    </div>
  );
};
