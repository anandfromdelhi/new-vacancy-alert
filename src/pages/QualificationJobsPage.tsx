import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { JobCard, JobTable } from '../components/JobList';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import { QUAL_CATEGORIES, getStateFromJob, toSlug } from '../utils/categoryUtils';
import { 
  Search, GraduationCap, ArrowLeft, RotateCcw, LayoutGrid, TableProperties,
  Sparkles, AlertCircle, ChevronDown, CheckCircle2, Building2, MapPin,
  ArrowUp
} from 'lucide-react';

interface QualificationMeta {
  slug: string;
  shortLabel: string;
  title: string;
  badge: string;
  description: string;
  keywords: string;
}

const QUALIFICATION_MAP: Record<string, QualificationMeta> = {
  '10th-pass': {
    slug: '10th-pass',
    shortLabel: '10th Pass',
    title: 'Latest 10th Pass Government Jobs 2026',
    badge: '10th Pass / Matriculation',
    description: 'Verified active public sector vacancies, apprenticeships, and Sarkari jobs for 10th pass / Matriculation candidates across India.',
    keywords: '10th Pass Govt Jobs 2026, Matriculation Sarkari Vacancy, 10th Pass Railway Jobs, Staff Selection 10th Pass'
  },
  '12th-pass': {
    slug: '12th-pass',
    shortLabel: '12th Pass',
    title: 'Latest 12th Pass Government Jobs 2026',
    badge: '12th Pass / Intermediate',
    description: 'Active central and state government job alerts for 12th pass / Intermediate / Higher Secondary passed candidates.',
    keywords: '12th Pass Govt Jobs 2026, Intermediate Sarkari Bharti, 12th Pass Police Vacancy, 12th Pass Railway Jobs'
  },
  'ba': {
    slug: 'ba',
    shortLabel: 'Any Graduate / BA',
    title: 'Latest BA & Graduate Government Jobs 2026',
    badge: 'Bachelor of Arts (BA) / Any Graduate',
    description: 'Active recruitment notifications for BA graduates and general degree holders across public sector departments.',
    keywords: 'BA Govt Jobs 2026, Graduate Govt Jobs, Arts Graduate Vacancy, General Graduation Sarkari Bharti'
  },
  'bcom': {
    slug: 'bcom',
    shortLabel: 'B.Com / Commerce',
    title: 'Latest B.Com & Commerce Government Jobs 2026',
    badge: 'B.Com / Commerce / Finance',
    description: 'Verified public sector job alerts for B.Com, Commerce, Accounts, and Audit graduates.',
    keywords: 'BCom Govt Jobs 2026, Commerce Graduate Jobs, Accountant Vacancy, Bank PO Clerk Commerce Jobs'
  },
  'bsc': {
    slug: 'bsc',
    shortLabel: 'B.Sc / Science',
    title: 'Latest B.Sc & Science Government Jobs 2026',
    badge: 'B.Sc / Science / Nursing / Agriculture',
    description: 'Active central and state government recruitment notifications for B.Sc Science, Nursing, Agriculture, and Allied Healthcare graduates.',
    keywords: 'BSc Govt Jobs 2026, Science Graduate Vacancy, B.Sc Nursing Jobs, Agriculture Officer Vacancy'
  },
  'btech': {
    slug: 'btech',
    shortLabel: 'B.Tech / B.E',
    title: 'Latest B.Tech & Engineering Government Jobs 2026',
    badge: 'B.E / B.Tech / Engineering',
    description: 'Verified engineering job notifications for B.E / B.Tech graduates across ISRO, DRDO, PSUs, Railways, and Public Works Departments.',
    keywords: 'BTech Govt Jobs 2026, Engineering Sarkari Vacancy, Executive Trainee PSUs, Assistant Engineer Jobs'
  },
  'diploma': {
    slug: 'diploma',
    shortLabel: 'Diploma',
    title: 'Latest Diploma & Polytechnic Government Jobs 2026',
    badge: 'Diploma / Polytechnic',
    description: 'Active public sector, railway, and government vacancies for Polytechnic and Engineering Diploma holders.',
    keywords: 'Diploma Govt Jobs 2026, Polytechnic Sarkari Vacancy, Junior Engineer Diploma Jobs, Railway Diploma Jobs'
  },
  'iti': {
    slug: 'iti',
    shortLabel: 'ITI / NAC',
    title: 'Latest ITI & Trade Apprentice Government Jobs 2026',
    badge: 'ITI / NAC / NTC Trade Certificate',
    description: 'Verified job and apprenticeship alerts for ITI NCVT/SCVT and National Apprenticeship Certificate (NAC) holders.',
    keywords: 'ITI Govt Jobs 2026, ITI Apprentice Vacancy, Railway ITI Jobs, Ordnance Factory ITI Bharti'
  },
  'post-graduation': {
    slug: 'post-graduation',
    shortLabel: 'Post Graduate / Master\'s',
    title: 'Latest Post Graduate & Master\'s Government Jobs 2026',
    badge: 'Post Graduation / M.Sc / M.Tech / MCA / MBA',
    description: 'Active recruitment alerts for Post Graduates, Master\'s degree holders, MBA, MCA, M.Sc, and M.Tech candidates.',
    keywords: 'Post Graduate Govt Jobs 2026, Master Degree Sarkari Vacancy, MCA Jobs, MBA Govt Jobs'
  },
  'mbbs-doctor': {
    slug: 'mbbs-doctor',
    shortLabel: 'MBBS / Doctor',
    title: 'Latest MBBS Doctor & Medical Officer Government Jobs 2026',
    badge: 'MBBS / MD / MS / DNB / DM / Medical Officer',
    description: 'Verified job notifications for MBBS Doctors, Medical Officers, Senior Residents, Tutors, and Specialist Physicians in government hospitals, AIIMS, ESIC, Railways, and Defence.',
    keywords: 'MBBS Govt Jobs 2026, Medical Officer Vacancy, Senior Resident Jobs, Doctor Sarkari Bharti, AIIMS Doctor Recruitment'
  },
  'nursing': {
    slug: 'nursing',
    shortLabel: 'Nursing / GNM / ANM',
    title: 'Latest Nursing, GNM & ANM Government Jobs 2026',
    badge: 'B.Sc Nursing / GNM / ANM / Staff Nurse',
    description: 'Active government nursing vacancies for GNM, ANM, B.Sc Nursing, and Staff Nurse posts across AIIMS, ESIC, State Health Departments, and Railways.',
    keywords: 'Nursing Govt Jobs 2026, GNM Staff Nurse Vacancy, ANM Sarkari Bharti, BSc Nursing Recruitment'
  },
  'pharmacist': {
    slug: 'pharmacist',
    shortLabel: 'Pharmacist / B.Pharm',
    title: 'Latest Pharmacist & B.Pharm Government Jobs 2026',
    badge: 'B.Pharm / D.Pharm / Pharmacist',
    description: 'Verified public sector recruitment alerts for Pharmacists, B.Pharm, D.Pharm graduates across government hospitals, ESIC, Railways, and CGHS.',
    keywords: 'Pharmacist Govt Jobs 2026, B.Pharm Vacancy, D.Pharm Sarkari Bharti, Government Pharmacist Recruitment'
  },
  'dental-bds': {
    slug: 'dental-bds',
    shortLabel: 'Dental / BDS',
    title: 'Latest Dental Surgeon & BDS Government Jobs 2026',
    badge: 'BDS / MDS / Dental Surgeon / Dental Hygienist',
    description: 'Active government job alerts for BDS, MDS graduates, Dental Surgeons, and Dental Hygienists in AIIMS, state health departments, and public hospitals.',
    keywords: 'BDS Govt Jobs 2026, Dental Surgeon Vacancy, MDS Sarkari Bharti, Government Dental Officer Recruitment'
  },
  'finance-ca': {
    slug: 'finance-ca',
    shortLabel: 'CA / CMA / CS',
    title: 'Latest CA, CMA & Finance Professional Government Jobs 2026',
    badge: 'CA / CMA / ICWA / CS / Finance',
    description: 'Verified public sector recruitment alerts for Chartered Accountants (CA), Cost Accountants (CMA), and Finance Professionals.',
    keywords: 'CA Govt Jobs 2026, CMA Finance Vacancy, Chartered Accountant PSU Jobs, Finance Executive Recruitment'
  },
  'law-llb': {
    slug: 'law-llb',
    shortLabel: 'Law / LL.B / Advocates',
    title: 'Latest Law, LL.B & Advocate Government Jobs 2026',
    badge: 'LL.B / LL.M / Advocate / Legal Officer',
    description: 'Verified government job alerts for Law Graduates, LL.B, LL.M, Legal Officers, Law Assistants, and Panel Advocates across public sector undertakings, courts, and central/state departments.',
    keywords: 'Law Govt Jobs 2026, LLB Vacancy, Legal Officer Sarkari Bharti, Advocate Panel Recruitment, Court Law Assistant Jobs'
  },
  'teaching-bed': {
    slug: 'teaching-bed',
    shortLabel: 'B.Ed / Teaching / D.El.Ed',
    title: 'Latest B.Ed, Teaching & D.El.Ed Government Jobs 2026',
    badge: 'B.Ed / D.El.Ed / TET / Teacher / Lecturer',
    description: 'Active government teaching vacancy notifications for B.Ed, D.El.Ed, TET/CTET qualified candidates, Assistant Professors, Tutors, and School Teachers across central & state education boards.',
    keywords: 'B.Ed Govt Jobs 2026, Teaching Vacancy, Primary Teacher Sarkari Bharti, Assistant Professor Jobs, TET CTET Jobs'
  },
  'phd': {
    slug: 'phd',
    shortLabel: 'Ph.D / Doctorate',
    title: 'Latest Ph.D, Scientist & Professor Government Jobs 2026',
    badge: 'Ph.D / Doctorate / Research',
    description: 'Active recruitment alerts for Ph.D holders, Research Scholars, Scientists, and University Professors.',
    keywords: 'Phd Govt Jobs 2026, Scientist Vacancy, Assistant Professor Jobs, Research Fellow Sarkari Bharti'
  },
  'mba': {
    slug: 'mba',
    shortLabel: 'Management / MBA / PGDM',
    title: 'Latest MBA & Management Government Jobs 2026',
    badge: 'MBA / PGDM / Management Trainee / HR / Finance',
    description: 'Active public sector recruitment alerts for MBA graduates, Management Trainees, HR Officers, and Marketing Executives across PSUs, banks, and government organizations.',
    keywords: 'MBA Govt Jobs 2026, Management Trainee Sarkari Bharti, MBA Finance Jobs, PSU Management Recruitment'
  },
  'driver': {
    slug: 'driver',
    shortLabel: 'Driver / Heavy Vehicle',
    title: 'Latest Driver & Heavy Vehicle Government Jobs 2026',
    badge: 'LMV / HMV Driving License / Fire Engine Driver',
    description: 'Active central and state government recruitment notifications for Drivers, Heavy Vehicle Operators, CMTD, and Fire Engine Drivers across transport and municipal corporations.',
    keywords: 'Driver Govt Jobs 2026, HMV Driver Sarkari Bharti, LMV Driver Vacancy, Government Driver Recruitment'
  },
  'defence-police': {
    slug: 'defence-police',
    shortLabel: 'Defence & Security',
    title: 'Latest Defence, Police & Security Guard Government Jobs 2026',
    badge: 'Police / Constable / Security Guard / Havildar',
    description: 'Verified public sector alerts for Police Constables, Sub-Inspectors, Security Guards, and Havildar posts across state police forces and central public sector undertakings.',
    keywords: 'Police Govt Jobs 2026, Security Guard Sarkari Bharti, Havildar Recruitment, Defence Security Jobs'
  }
};

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

function isAllIndiaJob(job: JobEntry): boolean {
  return getStateFromJob(job) === 'All India';
}

function matchesQualification(job: JobEntry, slug: string): boolean {
  const text = `${job.q || ''} ${job.t || ''} ${job.b || ''} ${job.desc || ''}`.toLowerCase();
  const cat = QUAL_CATEGORIES.find(c => c.slug === slug);
  if (!cat) return false;

  return cat.keywords.some(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = /^[\w]/.test(kw) ? '\\b' : '';
    const suffix = /[\w]$/.test(kw) ? '\\b' : '';
    return new RegExp(`${prefix}${escaped}${suffix}`, 'i').test(text);
  });
}

function getVacancyCount(title: string): number {
  const match = title.match(/(\d+[\d,]*)\s*\+?\s*(?:Posts?|Vacanc|Positions?|Contractual Posts?|Profiles?|Seats?|Openings?)/i)
             || title.match(/–\s*(\d+[\d,]*)\s*Posts?/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 1;
}

interface StateJobSection {
  stateName: string;
  stateSlug: string;
  isAllIndia: boolean;
  jobs: JobEntry[];
  totalVacancies: number;
}

export default function QualificationJobsPage() {
  const { qualification } = useParams<{ qualification: string }>();
  const slug = (qualification || '10th-pass').toLowerCase();
  const meta = QUALIFICATION_MAP[slug];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date_posted_desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect if unknown qualification slug
  if (!meta) {
    return <Navigate to="/" replace />;
  }

  // Active jobs strictly non-expired and matching qualification
  const qualificationActiveJobs = useMemo(() => {
    return JOBS_DATA.filter(job => !isJobExpired(job.l) && matchesQualification(job, slug));
  }, [slug]);

  // Distinct states available for this qualification with counts (unfiltered by search/state select)
  const availableStates = useMemo(() => {
    const map = new Map<string, { stateName: string; stateSlug: string; isAllIndia: boolean; count: number }>();
    for (let i = 0; i < qualificationActiveJobs.length; i++) {
      const job = qualificationActiveJobs[i];
      const stateName = getStateFromJob(job);
      const stateSlug = toSlug(stateName);
      const isAllIndia = stateSlug === 'all-india';

      let entry = map.get(stateSlug);
      if (!entry) {
        entry = { stateName, stateSlug, isAllIndia, count: 0 };
        map.set(stateSlug, entry);
      }
      entry.count++;
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.isAllIndia) return -1;
      if (b.isAllIndia) return 1;
      return a.stateName.localeCompare(b.stateName);
    });
  }, [qualificationActiveJobs]);

  // Filtered jobs according to search & optional selected state filter
  const filteredJobs = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    let result = qualificationActiveJobs;

    if (selectedState !== 'all') {
      result = result.filter(job => toSlug(getStateFromJob(job)) === selectedState);
    }

    if (searchLower) {
      result = result.filter(job => 
        job.b.toLowerCase().includes(searchLower) ||
        job.t.toLowerCase().includes(searchLower) ||
        job.q.toLowerCase().includes(searchLower) ||
        job.a.toLowerCase().includes(searchLower) ||
        getStateFromJob(job).toLowerCase().includes(searchLower)
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === 'date_posted_desc') {
      sorted.sort((a, b) => parseDateString(b.d).getTime() - parseDateString(a.d).getTime());
    } else if (sortBy === 'date_posted_asc') {
      sorted.sort((a, b) => parseDateString(a.d).getTime() - parseDateString(b.d).getTime());
    } else if (sortBy === 'posts_desc') {
      sorted.sort((a, b) => getVacancyCount(b.t) - getVacancyCount(a.t));
    } else if (sortBy === 'posts_asc') {
      sorted.sort((a, b) => getVacancyCount(a.t) - getVacancyCount(b.t));
    }

    return sorted;
  }, [qualificationActiveJobs, selectedState, searchTerm, sortBy]);

  // Group filtered jobs into sections based on state
  const stateSections = useMemo(() => {
    const map = new Map<string, { stateName: string; stateSlug: string; isAllIndia: boolean; jobs: JobEntry[] }>();

    for (let i = 0; i < filteredJobs.length; i++) {
      const job = filteredJobs[i];
      const stateName = getStateFromJob(job);
      const stateSlug = toSlug(stateName);
      const isAllIndia = stateSlug === 'all-india';

      let entry = map.get(stateSlug);
      if (!entry) {
        entry = { stateName, stateSlug, isAllIndia, jobs: [] };
        map.set(stateSlug, entry);
      }
      entry.jobs.push(job);
    }

    const list: StateJobSection[] = Array.from(map.values()).map(e => ({
      stateName: e.stateName,
      stateSlug: e.stateSlug,
      isAllIndia: e.isAllIndia,
      jobs: e.jobs,
      totalVacancies: e.jobs.reduce((sum, j) => sum + getVacancyCount(j.t), 0)
    }));

    return list.sort((a, b) => {
      if (a.isAllIndia) return -1;
      if (b.isAllIndia) return 1;
      return a.stateName.localeCompare(b.stateName);
    });
  }, [filteredJobs]);

  const scrollToState = (stateSlug: string) => {
    setSelectedState('all');
    setTimeout(() => {
      const el = document.getElementById(`state-section-${stateSlug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50 min-h-screen">
      <Helmet>
        <title>{`${meta.title} (State Wise) | Free Job Alerts | NewVacancyAlert`}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={`https://newvacancyalert.in/jobs-for/${meta.slug}`} />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-8 px-4 sm:px-6 relative overflow-hidden border-b-4 border-emerald-500">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/20 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Qualifications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {meta.title}
                </h1>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {qualificationActiveJobs.length} Active Vacancies
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {availableStates.length} State Sections
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-100 max-w-3xl">
                Browse verified public sector notifications for <strong>{meta.badge}</strong>, neatly categorized into dedicated sections for All India Central bodies and individual Indian states.
              </p>
            </div>
          </div>

          {/* Quick Qualification Switcher Bar - Fully responsive, no horizontal scroll */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="font-bold text-blue-200 shrink-0 mr-1">Switch Qualification:</span>
            {Object.values(QUALIFICATION_MAP).map(item => (
              <Link
                key={item.slug}
                to={`/jobs-for/${item.slug}`}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all border ${
                  item.slug === slug
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-sm'
                    : 'bg-white/10 hover:bg-white/25 border-white/20 text-blue-100 hover:text-white'
                }`}
              >
                {item.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* Quick State Jump Pill Bar */}
        {availableStates.length > 1 && (
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Jump to State Section ({availableStates.length} States / UTs)</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                Click any state pill to jump directly to its vacancies
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedState('all');
                  window.scrollTo({ top: 280, behavior: 'smooth' });
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  selectedState === 'all'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                All States ({qualificationActiveJobs.length})
              </button>
              {availableStates.map((st) => (
                <button
                  key={`jump-${st.stateSlug}`}
                  type="button"
                  onClick={() => scrollToState(st.stateSlug)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                    st.isAllIndia
                      ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span>{st.stateName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    st.isAllIndia ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Controls Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          {/* Interactive Search Box */}
          <div 
            onClick={() => setIsGoogleSearchOpen(true)}
            className="relative flex items-center bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-xl p-3 shadow-xs transition-all text-slate-800 cursor-pointer group"
          >
            <Search className="h-5 w-5 text-emerald-600 shrink-0 ml-1 group-hover:scale-110 transition-transform" />
            <div className="flex-1 px-3 text-xs sm:text-sm font-medium text-slate-700">
              {searchTerm ? (
                <span className="font-bold text-slate-900">{searchTerm}</span>
              ) : (
                <span className="text-slate-400">Search {qualificationActiveJobs.length} active {meta.badge} jobs by title, board, post or state...</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 rounded-lg text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Search Overlay</span>
              <span className="sm:hidden">Search</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Vacancies grouped into dedicated State Sections below</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
              {/* State Filter Dropdown */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">📍 All States & All India ({qualificationActiveJobs.length})</option>
                {availableStates.map(st => (
                  <option key={st.stateSlug} value={st.stateSlug}>
                    {st.stateName} ({st.count} {st.count === 1 ? 'Job' : 'Jobs'})
                  </option>
                ))}
              </select>

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
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="date_posted_desc">📅 Date Posted: Newest First</option>
                <option value="date_posted_asc">⏳ Date Posted: Oldest First</option>
                <option value="posts_desc">🔥 Vacancies: High to Low</option>
                <option value="posts_asc">📉 Vacancies: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Overview Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>{meta.badge} Active Jobs (State Wise)</span>
            <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full font-extrabold">
              {filteredJobs.length} Notifications across {stateSections.length} {stateSections.length === 1 ? 'State Section' : 'State Sections'}
            </span>
          </h2>

          {(searchTerm || selectedState !== 'all' || sortBy !== 'date_posted_desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
                setSortBy('date_posted_desc');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* State Sections Container */}
        {stateSections.length > 0 ? (
          <div className="space-y-6">
            {stateSections.map((section) => (
              <section 
                key={section.stateSlug}
                id={`state-section-${section.stateSlug}`}
                className="bg-white border-2 border-slate-200/90 rounded-2xl overflow-hidden shadow-xs scroll-mt-24 transition-all"
              >
                {/* State Section Header */}
                <div className={`p-4 sm:p-5 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  section.isAllIndia 
                    ? 'bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white' 
                    : 'bg-gradient-to-r from-amber-50/50 via-slate-50 to-white'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      section.isAllIndia 
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                        : 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                    }`}>
                      {section.isAllIndia ? <Building2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          {section.isAllIndia ? 'All India (Central Government Recruitments)' : `${section.stateName} Government Jobs`}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {meta.shortLabel}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {section.isAllIndia 
                          ? 'Nationwide open recruitments across central ministries, PSUs, RRB, SSC, AIIMS & defence boards' 
                          : `State public service commission, departmental, and public sector vacancies based in ${section.stateName}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-white border border-slate-200 text-slate-700 shadow-3xs">
                      {section.jobs.length} {section.jobs.length === 1 ? 'Job' : 'Jobs'}
                    </span>
                    {section.totalVacancies > 0 && (
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-3xs">
                        🔥 {section.totalVacancies.toLocaleString()} Posts
                      </span>
                    )}
                  </div>
                </div>

                {/* State Section Jobs List */}
                <div className="p-4 sm:p-5">
                  {viewMode === 'card' ? (
                    <div className="space-y-3">
                      {section.jobs.map((job, idx) => (
                        <JobCard key={`job-${job.id || idx}`} job={job} />
                      ))}
                    </div>
                  ) : (
                    <JobTable jobs={section.jobs} navigate={navigate} />
                  )}
                </div>

                {/* Section Bottom Quick Link */}
                <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">
                    Showing all {section.jobs.length} {meta.shortLabel} vacancies in {section.stateName}
                  </span>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="font-black text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Back to Top</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No Matching Vacancies Found</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We couldn't find any active {meta.badge} notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>" {selectedState !== 'all' ? `in the selected state` : ''}.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedState('all'); setSortBy('date_posted_desc'); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Search Overlay */}
      <GoogleSearchOverlay 
        isOpen={isGoogleSearchOpen} 
        onClose={() => setIsGoogleSearchOpen(false)} 
        initialQuery={searchTerm}
        customJobsPool={qualificationActiveJobs}
        contextTitle={`${meta.shortLabel} Vacancies`}
      />
    </main>
  );
}
