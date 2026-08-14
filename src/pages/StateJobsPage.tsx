import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = ReactHelmetAsync;
import { JobCard, JobTable } from '../components/JobList';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';
import { getStateName, getJobsForState } from '../utils/categoryUtils';
import { 
  Search, MapPin, ArrowLeft, RotateCcw, LayoutGrid, TableProperties,
  Sparkles, AlertCircle, ChevronDown, CheckCircle2
} from 'lucide-react';

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

function getVacancyCount(title: string): number {
  const match = title.match(/(\d+[\d,]*)\s*\+?\s*(?:Posts?|Vacanc|Positions?|Contractual Posts?|Profiles?|Seats?|Openings?)/i)
             || title.match(/–\s*(\d+[\d,]*)\s*Posts?/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 1;
}

export default function StateJobsPage() {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const slug = (stateSlug || '').toLowerCase();
  const stateName = getStateName(slug);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('date_posted_desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);

  // Active jobs for this state
  const stateActiveJobs = useMemo(() => {
    const activeJobs = JOBS_DATA.filter(job => !isJobExpired(job.l));
    return getJobsForState(activeJobs, slug);
  }, [slug]);

  // If no state name found AND no jobs, redirect
  if (!stateName && stateActiveJobs.length === 0) {
    return <Navigate to="/" replace />;
  }

  const pageTitle = `Latest ${stateName} Government Jobs 2026`;
  const seoTitle = `${stateName} Govt Jobs 2026 | Free Job Alerts | NewVacancyAlert`;
  const description = `Latest ${stateName} government job notifications, active public sector vacancies, and Sarkari jobs in ${stateName}.`;

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    let result = stateActiveJobs.filter(job => {
      const matchesSearch = 
        job.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.a.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    if (sortBy === 'date_posted_desc') {
      result.sort((a, b) => parseDateString(b.d).getTime() - parseDateString(a.d).getTime());
    } else if (sortBy === 'date_posted_asc') {
      result.sort((a, b) => parseDateString(a.d).getTime() - parseDateString(b.d).getTime());
    } else if (sortBy === 'posts_desc') {
      result.sort((a, b) => getVacancyCount(b.t) - getVacancyCount(a.t));
    } else if (sortBy === 'posts_asc') {
      result.sort((a, b) => getVacancyCount(a.t) - getVacancyCount(b.t));
    }

    return result;
  }, [stateActiveJobs, searchTerm, sortBy]);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, sortBy, slug]);

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50 min-h-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${stateName} Govt Jobs 2026, ${stateName} Sarkari Vacancy, ${stateName} Government Jobs`} />
        <link rel="canonical" href={`https://newvacancyalert.in/state/${slug}`} />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-8 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/20 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Government Jobs</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  <MapPin className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {pageTitle}
                </h1>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {stateActiveJobs.length} Active Vacancies
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-100 max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <MarketingPartnerBanner className="my-4" />

        {/* Search & Filter Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          {/* Interactive Search Box */}
          <div 
            onClick={() => setIsGoogleSearchOpen(true)}
            className="relative flex items-center bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-amber-500 rounded-xl p-3 shadow-xs transition-all text-slate-800 cursor-pointer group"
          >
            <Search className="h-5 w-5 text-amber-600 shrink-0 ml-1 group-hover:scale-110 transition-transform" />
            <div className="flex-1 px-3 text-xs sm:text-sm font-medium text-slate-700">
              {searchTerm ? (
                <span className="font-bold text-slate-900">{searchTerm}</span>
              ) : (
                <span className="text-slate-400">Search {stateActiveJobs.length} active {stateName} jobs by title, board, post...</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-lg text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Search Overlay</span>
              <span className="sm:hidden">Search</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              <span>Only Verified Active & Non-Expired Recruitments Shown</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Card / Table View Toggle */}
              <div className="hidden sm:flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'card' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Card View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Table View"
                >
                  <TableProperties className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="date_posted_desc">📅 Date Posted: Newest First</option>
                <option value="date_posted_asc">⏳ Date Posted: Oldest First</option>
                <option value="posts_desc">🔥 Vacancies: High to Low</option>
                <option value="posts_asc">📉 Vacancies: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>{stateName} Active Jobs</span>
            <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-extrabold">
              {filteredJobs.length} Notifications
            </span>
          </h2>

          {(searchTerm || sortBy !== 'date_posted_desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('date_posted_desc');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Jobs Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {viewMode === 'card' ? (
              <div className="space-y-3">
                {filteredJobs.slice(0, visibleCount).map((job, idx) => (
                  <JobCard key={`state-card-${job.id || idx}`} job={job} />
                ))}
              </div>
            ) : (
              <JobTable jobs={filteredJobs.slice(0, visibleCount)} navigate={navigate} />
            )}

            {/* View More Button */}
            {filteredJobs.length > visibleCount && (
              <div className="pt-4 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-500"
                >
                  <span>Show More {stateName} Jobs ({filteredJobs.length - visibleCount} remaining)</span>
                  <ChevronDown className="h-4 w-4 text-blue-100" />
                </button>
                <span className="text-[11px] font-bold text-slate-500">
                  Showing {Math.min(visibleCount, filteredJobs.length)} of {filteredJobs.length} active entries
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No Matching Vacancies Found</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We couldn't find any active {stateName} notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>".
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSortBy('date_posted_desc'); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Search Overlay */}
      <GoogleSearchOverlay 
        isOpen={isGoogleSearchOpen} 
        onClose={() => setIsGoogleSearchOpen(false)} 
        initialQuery={searchTerm}
        customJobsPool={stateActiveJobs}
        contextTitle={`${stateName} Jobs`}
      />
    </main>
  );
}
