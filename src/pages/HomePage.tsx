import React, { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import AdsterraBanner from '../components/AdsterraBanner';
import { 
  getBoardAcronym, 
  getNumberOfPostsInfo, 
  formatLastDateOnly, 
  getCategoryAndColor 
} from '../components/JobList';
import { 
  getQualificationGroups,
  GroupedCategory,
  getStateFromJob,
  toSlug
} from '../utils/categoryUtils';
import { useUserLocation } from '../utils/useUserLocation';
import { useNavigationLoader } from '../context/NavigationContext';
import { 
  Search, Clock, ArrowRight, Building2, GraduationCap, 
  Sparkles, RotateCcw, AlertCircle, ChevronRight, CheckCircle2, 
  HelpCircle, Facebook, Instagram, BookOpen, LayoutGrid, Maximize2, X
} from 'lucide-react';

function parseDateString(dateStr: string): Date {
  if (!dateStr || dateStr === '–' || dateStr.trim() === '' || dateStr.toLowerCase().includes('instant')) {
    return new Date(1970, 0, 1);
  }
  const cleanStr = dateStr.replace(/[\/.]/g, '-').trim();
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

/**
 * Compact preview tile for individual jobs inside each category section
 */
/**
 * Compact preview tile for individual jobs inside each category section
 */
function JobTile({ job, isLocal }: { job: JobEntry; isLocal?: boolean; key?: React.Key }) {
  const { startLoading } = useNavigationLoader();
  const boardAcronym = getBoardAcronym(job.b);
  const postsInfo = getNumberOfPostsInfo(job.t, job.id);
  const formattedLastDate = formatLastDateOnly(job.l);

  return (
    <Link
      to={`/${job.id}`}
      onClick={() => startLoading(`Loading ${boardAcronym} Details...`)}
      className={`group block rounded-xl p-3 sm:p-3.5 transition-all duration-150 relative overflow-hidden ${
        isLocal
          ? 'bg-emerald-50/80 hover:bg-emerald-100/70 border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-400/20'
          : 'bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-sm'
      }`}
    >
      {/* Top row: Board Badge + Local Badge + Vacancy Count */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0 max-w-[72%]">
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border truncate ${
            isLocal 
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
              : 'bg-blue-50 text-blue-700 border-blue-200/80'
          }`}>
            <Building2 className={`w-3 h-3 shrink-0 ${isLocal ? 'text-emerald-700' : 'text-blue-600'}`} />
            <span className="truncate">{boardAcronym}</span>
          </span>
          {isLocal && (
            <span className="shrink-0 inline-flex items-center gap-0.5 text-[9.5px] font-black px-1.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
              <span>📍 Your State</span>
            </span>
          )}
        </div>
        {postsInfo.display && (
          <span className="shrink-0 inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            🔥 {postsInfo.display}
          </span>
        )}
      </div>

      {/* Job Title */}
      <h4 className={`text-xs sm:text-[13px] font-black leading-snug line-clamp-2 mb-2 transition-colors ${
        isLocal ? 'text-slate-900 group-hover:text-emerald-800' : 'text-slate-800 group-hover:text-blue-700'
      }`}>
        {job.t}
      </h4>

      {/* Bottom meta: Last Date + Details link */}
      <div className={`flex items-center justify-between text-[11px] font-bold pt-1.5 border-t ${
        isLocal ? 'border-emerald-200/60 text-emerald-900' : 'border-slate-100 text-slate-500'
      }`}>
        <span className="inline-flex items-center gap-1 text-rose-600 font-extrabold text-[10.5px]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Last Date: {formattedLastDate}</span>
        </span>
        <span className={`inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px] font-black ${
          isLocal ? 'text-emerald-700' : 'text-blue-600'
        }`}>
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

interface SectionData {
  name: string;
  slug: string;
  count: number;
  jobs: JobEntry[];
  moreUrl: string;
}

/**
 * Section box for a qualification category featuring its top 3 most recently published jobs + View More button
 * If user has a detected state, entries from that state appear at the top of the 3 preview jobs and are highlighted.
 */
function CategorySectionCard({ 
  section, 
  userStateSlug,
  key
}: { 
  section: SectionData; 
  userStateSlug?: string | null;
  key?: React.Key;
}) {
  // Prioritize user's local state entries into the top 3 preview jobs
  const topPreviewJobs = useMemo(() => {
    if (!userStateSlug) return section.jobs.slice(0, 3);

    const localJobs: JobEntry[] = [];
    const otherJobs: JobEntry[] = [];

    for (let i = 0; i < section.jobs.length; i++) {
      const j = section.jobs[i];
      if (toSlug(getStateFromJob(j)) === userStateSlug) {
        localJobs.push(j);
      } else {
        otherJobs.push(j);
      }
    }

    return [...localJobs, ...otherJobs].slice(0, 3);
  }, [section.jobs, userStateSlug]);

  return (
    <div 
      id={`section-${section.slug}`}
      data-section-slug={section.slug}
      className="category-card-contain bg-slate-50/70 border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 border-t-4 border-t-blue-600 hover:border-blue-400 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Section Header - Clickable to open dedicated qualification page */}
      <div>
        <Link 
          to={section.moreUrl}
          className="group/header block pb-3 mb-3 border-b border-slate-200/80 hover:bg-blue-50/60 rounded-xl p-1.5 -m-1.5 transition-colors"
          title={`Browse all ${section.name} jobs grouped by state`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl border bg-blue-50 text-blue-600 border-blue-200 shrink-0 group-hover/header:bg-blue-600 group-hover/header:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 group-hover/header:text-blue-600 tracking-tight truncate transition-colors">
                {section.name}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white border border-slate-200 text-slate-700 shadow-3xs group-hover/header:border-blue-300">
                {section.count} {section.count === 1 ? 'Job' : 'Jobs'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/header:text-blue-600 group-hover/header:translate-x-0.5 transition-all" />
            </div>
          </div>
        </Link>

        {/* Top 3 Job Tiles */}
        <div className="space-y-2.5 mb-4">
          {topPreviewJobs.map((job, idx) => {
            const isLocal = !!userStateSlug && toSlug(getStateFromJob(job)) === userStateSlug;
            return (
              <JobTile key={job.id || `${section.slug}-${idx}`} job={job} isLocal={isLocal} />
            );
          })}
        </div>
      </div>

      {/* View More Button */}
      <Link
        to={section.moreUrl}
        className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs group border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
      >
        <span>View All {section.count} {section.name} Jobs (State Wise)</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { userLocation } = useUserLocation();
  const userStateSlug = userLocation?.stateSlug;

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const [isHeroScrolledPast, setIsHeroScrolledPast] = useState(false);
  const [activeSectionSlug, setActiveSectionSlug] = useState<string>('');
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const bottomBarNavRef = useRef<HTMLDivElement>(null);

  // Active non-expired jobs list - PRE-SORTED ONCE by newest first
  const activeJobsData = useMemo(() => {
    return JOBS_DATA.filter(job => !isJobExpired(job.l))
      .sort((a, b) => parseDateString(b.d).getTime() - parseDateString(a.d).getTime());
  }, []);

  // Master qualification group cache (computed once in O(N) single-pass)
  const allQualGroups = useMemo(() => getQualificationGroups(activeJobsData), [activeJobsData]);

  // Compute filtered sections using deferredSearch
  const currentSections = useMemo(() => {
    const searchLower = deferredSearch.toLowerCase().trim();
    if (!searchLower) {
      return allQualGroups;
    }

    return allQualGroups
      .map(group => {
        const matchingJobs = group.jobs.filter(job => 
          job.b.toLowerCase().includes(searchLower) ||
          job.t.toLowerCase().includes(searchLower) ||
          job.q.toLowerCase().includes(searchLower) ||
          job.a.toLowerCase().includes(searchLower)
        );
        return {
          ...group,
          count: matchingJobs.length,
          jobs: matchingJobs
        };
      })
      .filter(group => group.count > 0);
  }, [deferredSearch, allQualGroups]);

  const displayedSections = currentSections;

  // Scroll monitoring for floating search bar & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect if scrolled past hero
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        setIsHeroScrolledPast(heroRect.bottom < 50);
      } else {
        setIsHeroScrolledPast(window.scrollY > 300);
      }

      // 2. Detect active section
      if (displayedSections.length === 0) return;
      const scrollPos = window.scrollY + 140;
      let active = displayedSections[0].slug;

      for (const sec of displayedSections) {
        const el = document.getElementById(`section-${sec.slug}`);
        if (el) {
          if (el.offsetTop <= scrollPos) {
            active = sec.slug;
          } else {
            break;
          }
        }
      }
      setActiveSectionSlug(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedSections]);

  // Keep the active pill centered in the bottom sticky bar
  useEffect(() => {
    if (!activeSectionSlug) return;
    const activePill = document.getElementById(`bottom-pill-${activeSectionSlug}`);
    if (activePill && bottomBarNavRef.current) {
      activePill.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeSectionSlug]);

  const scrollToSection = (slug: string) => {
    setActiveSectionSlug(slug);
    const element = document.getElementById(`section-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectSection = (slug: string) => {
    setIsSectionPickerOpen(false);
    setPickerSearchQuery('');
    setActiveSectionSlug(slug);

    setTimeout(() => {
      const element = document.getElementById(`section-${slug}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50 relative">
      <Helmet>
        <title>Latest Government Jobs 2026 & Free Job Alerts | NewVacancyAlert</title>
        <meta name="description" content="Access active central and state government recruitment notifications for 2026. Search engineering, banking, railway, defense, and public sector job vacancies." />
        <meta name="keywords" content="Latest Government Jobs 2026, Free Job Alerts, Sarkari Vacancy 2026, Central Government Jobs, Railway Recruitment 2026, Banking Jobs, Defense Vacancy, SSC, UPSC, State Public Service" />
        <link rel="canonical" href="https://newvacancyalert.in/" />
        <meta property="og:title" content="Latest Government Jobs 2026 & Free Job Alerts | NewVacancyAlert" />
        <meta property="og:description" content="Access active central and state government recruitment notifications for 2026. Search engineering, banking, railway, defense, and public sector job vacancies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://newvacancyalert.in/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest Government Jobs 2026 & Free Job Alerts" />
        <meta name="twitter:description" content="Search verified government job vacancies, upcoming recruitments, exam dates, and eligibility criteria." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "NewVacancyAlert.in",
            "alternateName": "New Vacancy Alert India",
            "url": "https://newvacancyalert.in/",
            "description": "Unified central and state government recruitment alert portal with verified official notifications, eligibility criteria, and application timelines.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://newvacancyalert.in/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NewVacancyAlert.in",
            "url": "https://newvacancyalert.in/",
            "logo": "https://newvacancyalert.in/logo.png",
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61592714690988",
              "https://www.instagram.com/newvacancyalert.in/",
              "https://instagram.com/pharmacistanand"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Active Government Job Vacancies 2026",
            "numberOfItems": JOBS_DATA.length,
            "itemListElement": JOBS_DATA.slice(0, 20).map((job, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": `${job.b} - ${job.t}`,
              "url": `https://newvacancyalert.in/${job.id}`
            }))
          })}
        </script>
      </Helmet>

      {/* Floating Search Bar (Appears when scrolled past Hero section with margins around it) */}
      <div 
        className={`fixed top-3 inset-x-0 mx-auto z-40 w-[92%] sm:w-[85%] max-w-2xl transition-all duration-300 transform ${
          isHeroScrolledPast 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <div 
          onClick={() => setIsGoogleSearchOpen(true)}
          className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 sm:p-2 shadow-2xl border-2 border-emerald-500/80 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-400/30 transition-all text-slate-800 cursor-pointer"
        >
          <Search className="absolute left-3.5 sm:left-4.5 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-blue-600 shrink-0" />
          <input 
            type="text" 
            placeholder="Search jobs, board, post, qualification or advt no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsGoogleSearchOpen(true)}
            className="w-full pl-9 sm:pl-12 pr-20 sm:pr-28 py-2 sm:py-2.5 text-slate-900 placeholder-slate-400 font-bold text-xs sm:text-sm bg-transparent focus:outline-none cursor-pointer"
          />
          {searchTerm && (
            <button 
              onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
              className="absolute right-20 sm:right-28 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100 transition-all"
              title="Clear search"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsGoogleSearchOpen(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 hidden sm:inline" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Hero Header Area */}
      <div ref={heroRef} className="w-full bg-[#1e40af] text-white py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden shrink-0 border-b-4 border-[#16a34a]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-20 -ml-16 -mb-16"></div>
        
        <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Live Vacancy Board
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-none text-white max-w-4xl 2xl:max-w-5xl mx-auto">
            Latest Central & State Government Jobs <span className="text-emerald-300">2026</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-blue-100 font-medium max-w-3xl mx-auto leading-relaxed">
            Your ultimate portal for verified <strong>Free Job Alerts</strong>, latest recruitments, active notifications, and public service pathways across India.
          </p>

          {/* Prominent Hero Search Bar (Clean search without buttons below) */}
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto pt-2">
            <div 
              onClick={() => setIsGoogleSearchOpen(true)}
              className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border-2 border-emerald-400/60 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/30 transition-all text-slate-800 cursor-pointer"
            >
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 shrink-0" />
              <input 
                type="text" 
                placeholder="Search jobs, board, post, qualification or advt no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsGoogleSearchOpen(true)}
                className="w-full pl-10 sm:pl-12 pr-24 sm:pr-32 py-2.5 sm:py-3.5 text-slate-900 placeholder-slate-400 font-bold text-xs sm:text-sm md:text-base bg-transparent focus:outline-none cursor-pointer"
              />
              {searchTerm && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                  className="absolute right-28 sm:right-32 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100 transition-all"
                  title="Clear search"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsGoogleSearchOpen(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl flex items-center gap-2 shrink-0 shadow-md transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 hidden sm:inline" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto p-4 sm:p-6 2xl:p-8 pb-24 md:pb-8 space-y-6">
        
        {/* Adsterra Display Banner */}
        <AdsterraBanner />

        {/* Category Sections Container */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-4 sm:p-6">
          

          {deferredSearch && (
            <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">
                Showing matching sections for: <span className="font-black">"{deferredSearch}"</span> ({currentSections.length} sections found)
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs font-black text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Search</span>
              </button>
            </div>
          )}

          {displayedSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {displayedSections.map((section) => (
                <CategorySectionCard
                  key={section.slug}
                  section={section}
                  userStateSlug={userStateSlug}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 my-8">
              <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-black text-slate-800">No Matching Vacancies Found</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                We couldn't find any notifications matching "<span className="font-bold text-slate-700">{deferredSearch}</span>".
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition shadow-sm"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Official Social Handles & Marketing Partner Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          
          {/* Social Handles Box */}
          <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 rounded-2xl p-5 text-white shadow-md space-y-3.5 border border-blue-600/40">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-200">Official Social Handles</h3>
                <p className="text-sm font-black text-white">Follow NewVacancyAlert.in</p>
              </div>
            </div>
            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Get instant government job notifications, admit cards, and application deadline alerts directly on your feed!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="https://www.facebook.com/profile.php?id=61592714690988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white text-blue-950 hover:bg-blue-50 font-black text-xs transition shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600 fill-current" />
                  <span>Facebook Page</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/newvacancyalert.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95 font-black text-xs transition shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-white" />
                  <span>Instagram Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Exam Guides & Marketing Partner Banner */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Exam Guides & Calendars</h3>
                  <p className="text-sm font-black text-slate-800">Read Official Preparation Articles</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Explore in-depth syllabus breakdowns, previous cutoffs, RRB/SSC annual calendars, and salary calculators.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <Link
                to="/articles"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-blue-950 font-black text-xs transition shadow-xs text-center border border-amber-300"
              >
                Browse Articles & Guides
              </Link>
              <Link 
                to="/marketing-partner" 
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 underline underline-offset-2"
              >
                Become a Marketing Partner
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Information & FAQ Section for Search Engine Optimization */}
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6 mt-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
              Frequently Asked Questions & Free Government Job Alerts 2026
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Essential guide to applying for active Central and State Public Sector vacancies across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
            <div className="space-y-1.5">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                How do I receive instant free government job alerts for 2026?
              </h3>
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                Bookmark NewVacancyAlert.in or save our portal to your home screen. We issue immediate alerts for active vacancies across HAL, ICSI, AAI, ISRO (VSSC), Railway Recruitment Boards, and Defense Services.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Are official notifications verified with direct PDF sources?
              </h3>
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                Yes. Every job entry is verified against recruiting board portals with explicit advertisement numbers, academic qualification rules, age limits, pay scales, and official direct PDF links.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Which qualifications are eligible for public sector jobs?
              </h3>
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                Vacancies cover 10th Pass, 12th Pass, ITI, Diploma, B.E/B.Tech, B.Com, MBA, M.Sc, CA/ICWA, and Medical degrees. Click on your qualification from the Qualification Wise section on the home page to view all vacancies organized into state-wise sections.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                How are jobs organized when I click on a qualification?
              </h3>
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                Clicking on any qualification section opens a dedicated page containing state-wise sections (including All India central government jobs and individual state recruitments), allowing you to quickly find openings in your state.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Fullscreen Google Search Overlay */}
      <GoogleSearchOverlay 
        isOpen={isGoogleSearchOpen} 
        onClose={() => setIsGoogleSearchOpen(false)} 
        initialQuery={searchTerm}
      />

      {/* Mobile Bottom Sticky Section Navigator Bar (Horizontal quick-jump bar with auto active sync) */}
      {currentSections.length > 0 && (
        <div className="fixed bottom-3 inset-x-0 mx-auto z-40 w-[94%] max-w-lg lg:hidden transition-all duration-300 pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2 shadow-2xl border border-slate-700/90 flex items-center gap-2">
            {/* Expand / Grid Button: Opens full scrollable section picker popup */}
            <button
              type="button"
              onClick={() => setIsSectionPickerOpen(true)}
              className="shrink-0 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-emerald-400 border border-slate-700 hover:border-emerald-500/60 shadow-xs transition-all cursor-pointer flex items-center justify-center group"
              title="View All Sections"
              aria-label="View All Sections"
            >
              <LayoutGrid className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Horizontally scrolling pill list */}
            <div 
              ref={bottomBarNavRef}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 py-0.5"
            >
              {displayedSections.map((sec) => {
                const isActive = activeSectionSlug === sec.slug;
                return (
                  <button
                    key={`bottom-pill-${sec.slug}`}
                    id={`bottom-pill-${sec.slug}`}
                    onClick={() => scrollToSection(sec.slug)}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black ring-2 ring-emerald-300 scale-105'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/90 border border-slate-700/80'
                    }`}
                  >
                    <span>{sec.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {sec.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Section Picker Bottom Sheet Modal (Opens on expand icon click) */}
      {isSectionPickerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity lg:hidden animate-fadeIn">
          {/* Backdrop click to dismiss */}
          <div 
            className="fixed inset-0"
            onClick={() => { setIsSectionPickerOpen(false); setPickerSearchQuery(''); }}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 flex flex-col max-h-[82vh] overflow-hidden animate-slideInUp">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-800 leading-tight truncate">
                    All Qualification Sections
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500">
                    Tap any qualification to jump directly ({currentSections.length} available)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsSectionPickerOpen(false); setPickerSearchQuery(''); }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                aria-label="Close section picker"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Filter Search inside Modal */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search qualifications..."
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                {pickerSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPickerSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Section Items List */}
            <div className="p-3 overflow-y-auto space-y-1.5 max-h-[58vh]">
              {currentSections
                .filter(sec => 
                  !pickerSearchQuery || 
                  sec.name.toLowerCase().includes(pickerSearchQuery.toLowerCase().trim())
                )
                .map((sec) => {
                  const isActive = activeSectionSlug === sec.slug;
                  return (
                    <button
                      key={`modal-item-${sec.slug}`}
                      type="button"
                      onClick={() => handleSelectSection(sec.slug)}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-1 ring-emerald-400'
                          : 'bg-slate-50 hover:bg-blue-50/70 text-slate-800 font-extrabold hover:text-blue-700 border border-slate-200/80'
                      }`}
                    >
                      <span className="text-xs">{sec.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        {sec.count} {sec.count === 1 ? 'Job' : 'Jobs'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

