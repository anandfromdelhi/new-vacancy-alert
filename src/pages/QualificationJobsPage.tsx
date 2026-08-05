import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { JobCard, JobTable } from '../components/JobList';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import { 
  Search, GraduationCap, ArrowLeft, RotateCcw, LayoutGrid, TableProperties,
  Sparkles, AlertCircle, ChevronDown, CheckCircle2, Building2, ShieldAlert,
  Rocket, BookOpen, Users, Briefcase
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
  'medical-nursing': {
    slug: 'medical-nursing',
    shortLabel: 'MBBS / Medical / Nursing',
    title: 'Latest Medical, Doctor & Nursing Government Jobs 2026',
    badge: 'MBBS / MD / BDS / GNM / Nursing / Pharmacy',
    description: 'Verified job notifications for Doctors, MBBS, Medical Officers, Senior Residents, GNM Nurses, and Pharmacists.',
    keywords: 'Medical Officer Govt Jobs 2026, Doctor Sarkari Vacancy, Nursing Officer Jobs, GNM Nurse Bharti'
  },
  'finance-ca': {
    slug: 'finance-ca',
    shortLabel: 'CA / CMA / CS',
    title: 'Latest CA, CMA & Finance Professional Government Jobs 2026',
    badge: 'CA / CMA / ICWA / CS / Finance',
    description: 'Verified public sector recruitment alerts for Chartered Accountants (CA), Cost Accountants (CMA), and Finance Professionals.',
    keywords: 'CA Govt Jobs 2026, CMA Finance Vacancy, Chartered Accountant PSU Jobs, Finance Executive Recruitment'
  },
  'phd': {
    slug: 'phd',
    shortLabel: 'Ph.D / Doctorate',
    title: 'Latest Ph.D, Scientist & Professor Government Jobs 2026',
    badge: 'Ph.D / Doctorate / Research',
    description: 'Active recruitment alerts for Ph.D holders, Research Scholars, Scientists, and University Professors.',
    keywords: 'Phd Govt Jobs 2026, Scientist Vacancy, Assistant Professor Jobs, Research Fellow Sarkari Bharti'
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
  const id = (job.id || '').toLowerCase();
  const board = job.b.toLowerCase();
  const title = job.t.toLowerCase();

  const allIndiaPatterns = [
    'upsc', 'ssc', 'union public service', 'staff selection',
    'rrb', 'railway', 'rail wheel factory', 'railtel', 'rcil', 'konkan railway', 'krcl', 'northeast frontier',
    'central railway', 'nfr',
    'indian army', 'indian navy', 'indian air force', 'iaf', 'drdo', 'territorial army',
    'armoured vehicles nigam', 'avnl', 'ordnance factory', 'munitions india',
    'isro', 'nrsc', 'istrac', 'ursc', 'master control facility', 'mcf',
    'ongc', 'iocl', 'bpcl', 'bharat petroleum', 'hpcl', 'hindustan petroleum',
    'nalco', 'national aluminium', 'irel', 'wcl', 'western coalfields', 'ncl', 'northern coalfields',
    'nlcil', 'nlc india', 'nlc limited',
    'hal', 'hindustan aeronautics', 'beml', 'bharat electronics', 'bel',
    'sjvn', 'ntpc', 'ngel', 'power grid', 'nhsrcl', 'nhidcl',
    'rcf', 'rashtriya chemicals', 'rites', 'ihmcl', 'iifcl',
    'spmcil', 'security printing', 'fagmil', 'pdil',
    'ibps', 'institute of banking personnel', 'reserve bank', 'rbi', 'sbi',
    'union bank', 'punjab national bank', 'bank of baroda', 'bank of india',
    'central bank', 'indian bank', 'uco bank', 'pnb', 'iob',
    'nicl', 'national insurance', 'sidbi', 'small industries development bank',
    'tmb', 'tamilnad mercantile bank', 'nabard', 'exim bank',
    'aiims', 'esic', 'icmr', 'niper', 'national institute of pharmaceutical',
    'ccrum', 'ccras', 'central council for research in ayurvedic',
    'sinp', 'saha institute of nuclear physics',
    'csir', 'national geophysical', 'ngri',
    'iit', 'nit trichy', 'nitt', 'manit', 'amu', 'aligarh muslim university',
    'icar', 'iifcl',
    'airports authority of india', 'aai',
    'stpi', 'software technology parks', 'cert-in', 'cert in',
    'edcil', 'prl', 'physical research laboratory',
    'icai', 'icsi', 'institute of company secretaries',
    'norcet',
  ];

  if (allIndiaPatterns.some(k => id.includes(k) || board.includes(k) || title.includes(k))) {
    if (id.includes('upsc-principal-vice-principal') || title.includes('gnct delhi')) return false;
    if (id.includes('aai-kolkata') || id.includes('aai-eastern-region') || title.includes('wb domiciles')) return false;
    return true;
  }

  const statePatterns = [
    'uppsc', 'mpsc', 'cgssb', 'jkssb', 'tslprb', 'hartron',
    'jammu and kashmir services selection', 'jammu & kashmir services selection',
    'telangana state level police', 'telangana state',
    'mizoram public service', 'chhattisgarh staff selection',
    'karnataka examinations authority', 'kea',
    'verka', 'milkfed',
    'tamil nadu state transport', 'tnstc',
    'madhya pradesh yatri', 'mpypil',
    'rajasthan rajya vidyut', 'rvunl', 'rvun', 'rvpn', 'jvvn', 'avvn', 'jdvvn',
    'national health mission', 'nhm', 'zilla panchayat', 'district health',
    'dme assam', 'assam allied',
    'shri krishna ayush university', 'skau',
    'rtmnu', 'nagpur university', 'rashtrasant tukadoji',
    'government college daman',
    'high court', 'district court', 'sessions court', 'patna high court',
    'principal district', 'district judge',
    'municipal corporation', 'municipal council', 'mahanagara palike',
    'nagarasabe', 'urban local bod', 'nagar parishad',
    'thane municipal', 'district urban development', 'dudc', 'pourakarmika',
    'anganwadi', 'icds', 'bal vikas',
    'district program office', 'district programme officer',
    'child development services',
    'kasturba gandhi', 'kgbv',
    'sub-divisional officer', 'office of deputy commissioner',
    'sub divisional officer', 'sdo contai',
    'pt. madan mohan malaviya hospital', 'rao tula ram memorial',
    'rtrmh', 'pmmh',
    'dr. hedgewar arogya sansthan', 'dhas',
    'education recruitment directorate, punjab',
    'directorate of education recruitment',
    'local self government department',
    'tnsrlm', 'tamil nadu state rural',
    'msrlm', 'maharashtra state rural',
    'dcpu', 'district child protection',
    'govt of karnataka', 'government of karnataka',
    'govt of maharashtra', 'government of maharashtra',
    'govt of nct of delhi', 'govt. of nct of delhi', 'gnct delhi',
    'govt of uttar pradesh', 'government of uttar pradesh', 'govt. of uttar pradesh',
    'govt of west bengal', 'government of west bengal',
    'govt of bihar', 'government of bihar',
    'govt of odisha', 'government of odisha',
    'govt of andhra pradesh', 'government of andhra pradesh',
    'govt of himachal pradesh', 'government of himachal pradesh',
    'govt of rajasthan', 'government of rajasthan',
    'govt of assam', 'government of assam',
    'govt of chhattisgarh', 'government of chhattisgarh',
    'govt of haryana', 'government of haryana',
    'govt of telangana', 'government of telangana',
    'govt of tamil', 'government of tamil',
    'jayadeva', 'sjicr', 'cims chamarajanagar',
  ];

  if (statePatterns.some(k => id.includes(k) || board.includes(k) || title.includes(k))) {
    return false;
  }

  return true;
}

function matchesQualification(job: JobEntry, slug: string): boolean {
  const text = `${job.q || ''} ${job.t || ''} ${job.desc || ''}`.toLowerCase();

  const kwMap: Record<string, string[]> = {
    '10th-pass': ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate'],
    '12th-pass': ['12th', 'intermediate', 'higher secondary', '10+2', 'puc'],
    'ba': ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor'],
    'btech': ['b.tech', 'b.e', 'btech', 'be', 'engineering', 'b.arch', 'b.plan'],
    'bsc': ['b.sc', 'bsc', 'b.vsc', 'science', 'nursing', 'agriculture'],
    'bcom': ['b.com', 'bcom', 'commerce', 'accountant', 'accounts'],
    'diploma': ['diploma', 'polytechnic'],
    'iti': ['iti', 'nac', 'ntc', 'trade certificate', 'apprentice'],
    'post-graduation': ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'llm', 'm.arch', 'm.plan', 'mvsc', 'm.ch'],
    'medical-nursing': ['mbbs', 'md', 'ms', 'dnb', 'dm', 'bds', 'dental', 'gnm', 'b.pharm', 'pharmacy', 'medical', 'tutor', 'senior resident'],
    'finance-ca': ['ca', 'cma', 'icwai', 'chartered accountant', 'icai', 'icmai', 'icsi', 'company secretary'],
    'phd': ['ph.d', 'phd', 'doctorate']
  };

  const keywords = kwMap[slug];
  if (!keywords) return false;

  return keywords.some(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
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

export default function QualificationJobsPage() {
  const { qualification } = useParams<{ qualification: string }>();
  const slug = (qualification || '10th-pass').toLowerCase();
  const meta = QUALIFICATION_MAP[slug];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'all_india' | 'state_specific'>('all');
  const [sortBy, setSortBy] = useState<string>('date_posted_desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [visibleCount, setVisibleCount] = useState<number>(10);
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

  // Scope counts
  const scopeCounts = useMemo(() => {
    let allIndia = 0;
    let stateSpecific = 0;
    qualificationActiveJobs.forEach(job => {
      if (isAllIndiaJob(job)) {
        allIndia++;
      } else {
        stateSpecific++;
      }
    });
    return { all: qualificationActiveJobs.length, allIndia, stateSpecific };
  }, [qualificationActiveJobs]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    let result = qualificationActiveJobs.filter(job => {
      const matchesScope = 
        selectedScope === 'all' || 
        (selectedScope === 'all_india' && isAllIndiaJob(job)) ||
        (selectedScope === 'state_specific' && !isAllIndiaJob(job));

      const matchesSearch = 
        job.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.a.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesScope && matchesSearch;
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
  }, [qualificationActiveJobs, searchTerm, selectedScope, sortBy]);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, selectedScope, sortBy, slug]);

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50 min-h-screen">
      <Helmet>
        <title>{`${meta.title} | Free Job Alerts | NewVacancyAlert`}</title>
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
            <span>Back to All Government Jobs</span>
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
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-100 max-w-2xl">
                {meta.description}
              </p>
            </div>

            {/* Scope Filter Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: `All (${scopeCounts.all})` },
                { id: 'all_india', label: `All India (${scopeCounts.allIndia})` },
                { id: 'state_specific', label: `State Specific (${scopeCounts.stateSpecific})` }
              ].map(scope => (
                <button
                  key={scope.id}
                  onClick={() => setSelectedScope(scope.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    selectedScope === scope.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                      : 'bg-white/10 text-blue-100 hover:text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
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
        {/* Search & Filter Bar */}
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
                <span className="text-slate-400">Search {qualificationActiveJobs.length} active {meta.badge} jobs by title, board, post...</span>
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
            <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
            <span>{meta.badge} Active Jobs</span>
            <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-extrabold">
              {filteredJobs.length} Notifications
            </span>
          </h2>

          {(searchTerm || selectedScope !== 'all' || sortBy !== 'date_posted_desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedScope('all');
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
                  <JobCard key={`qual-card-${job.id || idx}`} job={job} />
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
                  <span>Show More {meta.badge} Jobs ({filteredJobs.length - visibleCount} remaining)</span>
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
              We couldn't find any active {meta.badge} notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>".
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedScope('all'); setSortBy('date_posted_desc'); }}
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
        customJobsPool={qualificationActiveJobs}
        contextTitle={`${meta.shortLabel} Vacancies`}
      />
    </main>
  );
}
