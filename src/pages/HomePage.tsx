import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import { JobCard, JobTable, getBoardAcronym } from '../components/JobList';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { jobDetailsData } from '../data/jobDetails';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import CategoriesSection from '../components/CategoriesSection';
import AdsterraBanner from '../components/AdsterraBanner';
import { 
  Search, Calendar, Briefcase, FileText, CheckCircle2, ChevronRight, ChevronDown,
  Clock, ArrowRight, Building2, ShieldAlert, Rocket, BookOpen, Users, 
  AlertCircle, Filter, Sparkles, RotateCcw, ArrowUp, LayoutGrid, TableProperties, HelpCircle,
  Facebook, Instagram, Globe, Flag, MapPin, Archive
} from 'lucide-react';

function getCategoryAndColor(board: string, title: string) {
  const b = board.toLowerCase();
  const t = title.toLowerCase();
  
  if (b.includes('bank') || b.includes('rbi') || b.includes('sbi') || b.includes('iob') || b.includes('ibps') || b.includes('insurance') || b.includes('nicl')) {
    return { cat: 'Banking', icon: Building2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', textClr: 'text-emerald-700', border: 'border-l-emerald-500', pill: 'bg-emerald-50/80 border-emerald-200/50 text-emerald-800' };
  }
  if (b.includes('army') || b.includes('navy') || b.includes('iaf') || b.includes('air force') || b.includes('defense') || b.includes('soldier') || b.includes('territorial')) {
    return { cat: 'Defense', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200', textClr: 'text-rose-700', border: 'border-l-rose-500', pill: 'bg-rose-50/80 border-rose-200/50 text-rose-800' };
  }
  if (b.includes('rrb') || b.includes('railway') || b.includes('nfr')) {
    return { cat: 'Railway', icon: Rocket, color: 'text-amber-600 bg-amber-50 border-amber-200', textClr: 'text-amber-700', border: 'border-l-amber-500', pill: 'bg-amber-50/80 border-amber-200/50 text-amber-800' };
  }
  if (b.includes('iit') || b.includes('school') || b.includes('university') || b.includes('teaching') || b.includes('professor') || b.includes('assistant editor')) {
    return { cat: 'Education', icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200', textClr: 'text-purple-700', border: 'border-l-purple-500', pill: 'bg-purple-50/80 border-purple-200/50 text-purple-800' };
  }
  if (b.includes('medical') || b.includes('esic') || b.includes('ccrum') || b.includes('nurse') || b.includes('doctor')) {
    return { cat: 'Medical', icon: Users, color: 'text-pink-600 bg-pink-50 border-pink-200', textClr: 'text-pink-700', border: 'border-l-pink-500', pill: 'bg-pink-50/80 border-pink-200/50 text-pink-800' };
  }
  if (t.includes('engineer') || t.includes('technician') || t.includes('apprentice') || b.includes('fagmil') || b.includes('ongc') || b.includes('rites') || b.includes('isro') || b.includes('hpcl') || b.includes('vssc') || b.includes('pdil') || b.includes('iocl') || b.includes('nhsrcl') || b.includes('nhidcl') || b.includes('wcl')) {
    return { cat: 'Technical', icon: Rocket, color: 'text-blue-600 bg-blue-50 border-blue-200', textClr: 'text-blue-700', border: 'border-l-blue-500', pill: 'bg-blue-50/80 border-blue-200/50 text-blue-800' };
  }
  return { cat: 'Government Job', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', textClr: 'text-indigo-700', border: 'border-l-indigo-500', pill: 'bg-indigo-50/80 border-indigo-200/50 text-indigo-800' };
}



function getCompactQualification(q: string): string {
  const lower = q.toLowerCase();
  
  if (lower.includes('b.e/b.tech/m.e/m.tech or ca/icwa')) return 'Engg / CA + Exp';
  if (lower.includes('graduate in commerce') || lower.includes('b.com')) {
    if (lower.includes('3 years') || lower.includes('3 yr')) return 'B.Com + 3 Yrs Exp';
    return 'B.Com';
  }
  if (lower.includes('chartered accountant')) return 'CA';
  if (lower.includes('working railway employee')) return 'Rly Emp (5 Yrs)';
  if (lower.includes('ncc c certificate')) return 'Grad + NCC C';
  if (lower.includes('music proficiency')) return '10th + Music';
  if (lower.includes('ph.d')) return 'PhD';
  
  let res = q
    .replace(/Graduation/gi, 'Grad')
    .replace(/Graduate/gi, 'Grad')
    .replace(/Post Graduate/gi, 'PG')
    .replace(/Post Graduation/gi, 'PG')
    .replace(/Matriculation/gi, '10th')
    .replace(/Diploma/gi, 'Dip')
    .replace(/Experience/gi, 'Exp')
    .replace(/Years/gi, 'Yrs')
    .replace(/Year/gi, 'Yr');

  if (res.split(',').length > 3) {
    return res.split(',').slice(0, 3).map(s => s.trim()).join('/') + '+';
  }
  
  if (res.length > 25) {
    return res.substring(0, 25).trim() + '...';
  }
  return res;
}

function getNumberOfPosts(title: string, jobId?: string): number {
  if (jobId && jobDetailsData[jobId]) {
    const v = jobDetailsData[jobId].vacancies;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const trimmed = v.trim();
      const match = trimmed.match(/^(\d+[\d,]*)/) || trimmed.match(/(\d+[\d,]*)\s*Posts?/i);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''), 10);
        if (num < 50000) return num;
      }
    }
  }

  const match = title.match(/(\d+[\d,]*)\s*\+?\s*(?:Posts?|Vacanc|Positions?|Contractual Posts?|Profiles?|Seats?|Openings?)/i)
             || title.match(/–\s*(\d+[\d,]*)\s*Posts?/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 1;
}

function parseDateString(dateStr: string): Date {
  if (!dateStr || dateStr === '–' || dateStr.trim() === '' || dateStr.toLowerCase().includes('instant')) {
    return new Date(1970, 0, 1);
  }
  const cleanStr = dateStr.replace(/\//g, '-').trim();
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
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
  if (parsed.getFullYear() < 2000) return false; // Non-standard or ongoing schedule links
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed < today;
}

function isAllIndiaJob(job: JobEntry): boolean {
  const id = (job.id || '').toLowerCase();
  const board = job.b.toLowerCase();
  const title = job.t.toLowerCase();

  // ── PASS 1: Explicit All India / Central Govt / National PSU whitelist ────────
  // These match first to avoid being caught by broad state keywords below
  const allIndiaPatterns = [
    // Constitutional / National Recruitment Bodies
    'upsc', 'ssc', 'union public service', 'staff selection',
    // Railways (Central)
    'rrb', 'railway', 'rail wheel factory', 'railtel', 'rcil', 'konkan railway', 'krcl', 'northeast frontier',
    'central railway', 'nfr',
    // Defence
    'indian army', 'indian navy', 'indian air force', 'iaf', 'drdo', 'territorial army',
    'armoured vehicles nigam', 'avnl', 'ordnance factory', 'munitions india',
    // Space
    'isro', 'nrsc', 'istrac', 'ursc', 'master control facility', 'mcf',
    // National PSUs / CPSEs
    'ongc', 'iocl', 'bpcl', 'bharat petroleum', 'hpcl', 'hindustan petroleum',
    'nalco', 'national aluminium', 'irel', 'wcl', 'western coalfields', 'ncl', 'northern coalfields',
    'nlcil', 'nlc india', 'nlc limited',
    'hal', 'hindustan aeronautics', 'beml', 'bharat electronics', 'bel',
    'sjvn', 'ntpc', 'ngel', 'power grid', 'nhsrcl', 'nhidcl',
    'rcf', 'rashtriya chemicals', 'rites', 'ihmcl', 'iifcl',
    'spmcil', 'security printing', 'fagmil', 'pdil',
    // Banking / Insurance / Finance
    'ibps', 'institute of banking personnel', 'reserve bank', 'rbi', 'sbi',
    'union bank', 'punjab national bank', 'bank of baroda', 'bank of india',
    'central bank', 'indian bank', 'uco bank', 'pnb', 'iob',
    'nicl', 'national insurance', 'sidbi', 'small industries development bank',
    'tmb', 'tamilnad mercantile bank', 'nabard', 'exim bank',
    // AIIMS / National Medical / Research
    'aiims', 'esic', 'icmr', 'niper', 'national institute of pharmaceutical',
    'ccrum', 'ccras', 'central council for research in ayurvedic',
    'sinp', 'saha institute of nuclear physics',
    'csir', 'national geophysical', 'ngri',
    // National Institutes
    'iit', 'nit trichy', 'nitt', 'manit', 'amu', 'aligarh muslim university',
    'icar', 'iifcl',
    // Airports / Civil Aviation
    'airports authority of india', 'aai',
    // IT / Others
    'stpi', 'software technology parks', 'cert-in', 'cert in',
    'edcil', 'prl', 'physical research laboratory',
    'icai', 'icsi', 'institute of company secretaries',
    // Health / NHM National
    'norcet',
  ];

  if (allIndiaPatterns.some(k => id.includes(k) || board.includes(k) || title.includes(k))) {
    // Carve-out: UPSC notification for GNCT Delhi teaching posts is state-specific
    if (id.includes('upsc-principal-vice-principal') || title.includes('gnct delhi')) return false;
    // Carve-out: AAI Kolkata / Eastern region (WB domicile restricted)
    if (id.includes('aai-kolkata') || id.includes('aai-eastern-region') || title.includes('wb domiciles')) return false;
    return true;
  }

  // ── PASS 2: Explicit State / Local / District body blocklist ─────────────────
  const statePatterns = [
    // State PSCs / SSBs / Boards
    'uppsc', 'mpsc', 'cgssb', 'jkssb', 'tslprb', 'hartron',
    'jammu and kashmir services selection', 'jammu & kashmir services selection',
    'telangana state level police', 'telangana state',
    'mizoram public service', 'chhattisgarh staff selection',
    'karnataka examinations authority', 'kea',
    'verka', 'milkfed',
    // State Transport
    'tamil nadu state transport', 'tnstc',
    'madhya pradesh yatri', 'mpypil',
    // State Power
    'rajasthan rajya vidyut', 'rvunl', 'rvun', 'rvpn', 'jvvn', 'avvn', 'jdvvn',
    // State Health / NHM
    'national health mission', 'nhm', 'zilla panchayat', 'district health',
    'dme assam', 'assam allied',
    // State Education
    'shri krishna ayush university', 'skau',
    'rtmnu', 'nagpur university', 'rashtrasant tukadoji',
    'government college daman',
    // State courts / judiciary
    'high court', 'district court', 'sessions court', 'patna high court',
    'principal district', 'district judge',
    // Municipal / Urban Bodies
    'municipal corporation', 'municipal council', 'mahanagara palike',
    'nagarasabe', 'urban local bod', 'nagar parishad',
    'thane municipal', 'district urban development', 'dudc', 'pourakarmika',
    // Local / District / State Govt departments
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
    // State-specific keywords
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

  // ── PASS 3: Default — treat as All India ─────────────────────────────────────
  return true;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScope, setSelectedScope] = useState<'all_india' | 'state_specific'>('all_india');
  const [sortBy, setSortBy] = useState<string>('date_posted_desc');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveVisibleCount, setArchiveVisibleCount] = useState(5);
  const navigate = useNavigate();

  // Active non-expired jobs list
  const activeJobsData = useMemo(() => {
    return JOBS_DATA.filter(job => !isJobExpired(job.l));
  }, []);

  // Expired / Archived jobs list
  const expiredJobsData = useMemo(() => {
    return JOBS_DATA.filter(job => isJobExpired(job.l));
  }, []);

  const filteredExpiredJobs = useMemo(() => {
    if (!archiveSearch.trim()) return expiredJobsData;
    const term = archiveSearch.toLowerCase();
    return expiredJobsData.filter(job =>
      job.b.toLowerCase().includes(term) ||
      job.t.toLowerCase().includes(term) ||
      job.q.toLowerCase().includes(term) ||
      job.a.toLowerCase().includes(term)
    );
  }, [expiredJobsData, archiveSearch]);

  // Region Scope counts for filtering
  const scopeCounts = useMemo(() => {
    let allIndia = 0;
    let stateSpecific = 0;
    activeJobsData.forEach(job => {
      if (isAllIndiaJob(job)) {
        allIndia++;
      } else {
        stateSpecific++;
      }
    });
    return { allIndia, stateSpecific };
  }, [activeJobsData]);

  // Categories list and counts for filtering
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: activeJobsData.length };
    activeJobsData.forEach(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [activeJobsData]);

  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    list.add('All');
    activeJobsData.forEach(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      list.add(cat);
    });
    return Array.from(list);
  }, [activeJobsData]);

  const { filteredJobs, allIndiaJobs, stateJobs } = useMemo(() => {
    // 1. Filter jobs
    let result = activeJobsData.filter(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
      const matchesSearch = 
        job.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.a.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // 2. Apply sorting
    if (sortBy === 'posts_desc') {
      result.sort((a, b) => getNumberOfPosts(b.t, b.id) - getNumberOfPosts(a.t, a.id));
    } else if (sortBy === 'posts_asc') {
      result.sort((a, b) => getNumberOfPosts(a.t, a.id) - getNumberOfPosts(b.t, b.id));
    } else if (sortBy === 'date_posted_desc') {
      result.sort((a, b) => parseDateString(b.d).getTime() - parseDateString(a.d).getTime());
    } else if (sortBy === 'date_posted_asc') {
      result.sort((a, b) => parseDateString(a.d).getTime() - parseDateString(b.d).getTime());
    } else if (sortBy === 'last_date_soonest') {
      result.sort((a, b) => {
        const timeA = parseDateString(a.l).getTime();
        const timeB = parseDateString(b.l).getTime();
        const invalidTime = new Date(1970, 0, 1).getTime();
        
        if (timeA === invalidTime && timeB === invalidTime) return 0;
        if (timeA === invalidTime) return 1;
        if (timeB === invalidTime) return -1;
        return timeA - timeB;
      });
    } else if (sortBy === 'last_date_latest') {
      result.sort((a, b) => {
        const timeA = parseDateString(a.l).getTime();
        const timeB = parseDateString(b.l).getTime();
        const invalidTime = new Date(1970, 0, 1).getTime();
        
        if (timeA === invalidTime && timeB === invalidTime) return 0;
        if (timeA === invalidTime) return 1;
        if (timeB === invalidTime) return -1;
        return timeB - timeA;
      });
    }

    const allIndia = result.filter(j => isAllIndiaJob(j));
    const state = result.filter(j => !isAllIndiaJob(j));

    return { filteredJobs: result, allIndiaJobs: allIndia, stateJobs: state };
  }, [searchTerm, selectedCategory, sortBy]);

  // Reset visible cards count back when search, category, scope, sort order, or viewMode changes
  useEffect(() => {
    setVisibleCount(viewMode === 'table' ? 10 : 5);
  }, [searchTerm, selectedCategory, selectedScope, sortBy, viewMode]);

  // Automatically switch tabs (All India vs State Specific) when searching or filtering
  // if the currently active scope has 0 matching jobs but the other scope has matching jobs.
  useEffect(() => {
    if (searchTerm.trim() !== '' || selectedCategory !== 'All') {
      if (selectedScope === 'all_india' && allIndiaJobs.length === 0 && stateJobs.length > 0) {
        setSelectedScope('state_specific');
      } else if (selectedScope === 'state_specific' && stateJobs.length === 0 && allIndiaJobs.length > 0) {
        setSelectedScope('all_india');
      }
    }
  }, [searchTerm, selectedCategory, allIndiaJobs.length, stateJobs.length, selectedScope]);

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50">
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

      {/* Hero Header Area */}
      <div className="w-full bg-[#1e40af] text-white py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden shrink-0 border-b-4 border-[#16a34a]">
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

          {/* Prominent Hero Search Bar */}
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto pt-2 space-y-3">
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

            {/* Categories Section (Qualification Wise, State Wise, Board Wise popups) */}
            <CategoriesSection activeJobs={activeJobsData} />


          </div>
        </div>
      </div>

      {/* Main Interactive Dashboard Grid with Sidebar for Web View */}
      <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] 3xl:max-w-[2200px] mx-auto p-4 sm:p-6 2xl:p-8 pb-24 md:pb-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 2xl:gap-10 lg:items-start space-y-6 lg:space-y-0">
          
          {/* Left Sticky Sidebar (Web View Filter Section - Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3 3xl:col-span-2 space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4.5 w-4.5 text-blue-600" />
                  <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">
                    Filter & Sort Alerts
                  </h2>
                </div>
                {(selectedCategory !== 'All' || searchTerm !== '' || sortBy !== 'date_posted_desc') && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedScope('all_india'); setSortBy('date_posted_desc'); }}
                    className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Reset all filters"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Active Filter Summary Box */}
              {(selectedCategory !== 'All' || searchTerm !== '') && (
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">
                    Active Filters
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategory !== 'All' && (
                      <span className="inline-flex items-center gap-1 bg-white border border-blue-300 text-blue-700 font-bold text-[11px] px-2 py-0.5 rounded-md shadow-3xs">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-600 ml-0.5 font-black">×</button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 bg-white border border-blue-300 text-blue-700 font-bold text-[11px] px-2 py-0.5 rounded-md shadow-3xs">
                        "{searchTerm}"
                        <button onClick={() => setSearchTerm('')} className="hover:text-rose-600 ml-0.5 font-black">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Region / Location Scope Filter */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Job Location Scope
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: '🇮🇳 All India / Central Govt', value: 'all_india', count: scopeCounts.allIndia },
                    { label: '🏛️ State Wise / Local Body', value: 'state_specific', count: scopeCounts.stateSpecific }
                  ].map((opt) => {
                    const isSelected = selectedScope === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedScope(opt.value as any)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200/80 text-slate-600'
                        }`}>
                          {opt.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Order Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Sort List Order
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: '⭐ Default List Order', value: 'default' },
                    { label: '📅 Date Posted: Newest First', value: 'date_posted_desc' },
                    { label: '⏳ Date Posted: Oldest First', value: 'date_posted_asc' },
                    { label: '🔥 Posts: High to Low', value: 'posts_desc' },
                    { label: '📉 Posts: Low to High', value: 'posts_asc' },
                    { label: '⏰ Deadline: Soonest First', value: 'last_date_soonest' },
                    { label: '📅 Deadline: Furthest First', value: 'last_date_latest' }
                  ].map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Official Social Handles Sidebar Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 rounded-2xl p-4 text-white shadow-md space-y-3 border border-blue-500/30">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-blue-200">Official Social Handles</h3>
                  <p className="text-xs font-black text-white">Follow NewVacancyAlert.in</p>
                </div>
              </div>
              <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
                Get daily government job alerts and instant vacancy notifications directly on your feed!
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=61592714690988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs transition shadow-2xs group"
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
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95 font-black text-xs transition shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-white" />
                    <span>Instagram Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
            
            {/* Marketing Partner Link for Desktop Sidebar */}
            <div className="text-center mt-2 px-2 hidden lg:block">
              <Link to="/marketing-partner" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 underline underline-offset-2 decoration-slate-300">
                Become a Marketing Partner & Earn Rewards
              </Link>
            </div>
          </aside>

          {/* Right Main Column (Listings & Table View) */}
          <main className="lg:col-span-8 xl:col-span-9 2xl:col-span-9 3xl:col-span-10 space-y-6">
            {/* Adsterra Display Banner */}
            <AdsterraBanner />

            {/* Connected Tabs & Listings Container */}
            <div className="rounded-2xl shadow-xs overflow-hidden border-2 border-slate-300 bg-slate-200/90">
              {/* Scope Navigation Tabs & Layout Toggle Header - Authentic Connected Chrome Browser Tabs */}
              <div className="p-1.5 sm:p-2 sm:pb-0 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-300 relative z-10">
                {/* Chrome Browser Tabs Strip */}
                <div className="grid grid-cols-2 gap-1 sm:flex sm:items-end sm:gap-1.5 w-full sm:w-auto">
                  {/* All India Chrome Tab */}
                  <button
                    onClick={() => setSelectedScope('all_india')}
                    className={`group relative flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-5 pt-2.5 pb-2.5 sm:pt-3 sm:pb-3 rounded-t-xl sm:rounded-t-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-t-2 border-x ${
                      selectedScope === 'all_india'
                        ? 'bg-white border-t-blue-600 border-x-slate-300 text-slate-900 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 -mb-2'
                        : 'bg-slate-300/60 hover:bg-slate-300/90 border-t-transparent border-x-transparent text-slate-600 hover:text-slate-900 z-0'
                    }`}
                  >
                    <span className="text-base sm:text-lg leading-none shrink-0">🇮🇳</span>
                    <span className="truncate tracking-tight">
                      <span className="inline sm:hidden">All India</span>
                      <span className="hidden sm:inline">All India Jobs</span>
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black transition-colors ${
                        selectedScope === 'all_india'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-300/80 text-slate-700'
                      }`}
                    >
                      {allIndiaJobs.length}
                    </span>
                  </button>

                  {/* State Wise Chrome Tab */}
                  <button
                    onClick={() => setSelectedScope('state_specific')}
                    className={`group relative flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-5 pt-2.5 pb-2.5 sm:pt-3 sm:pb-3 rounded-t-xl sm:rounded-t-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-t-2 border-x ${
                      selectedScope === 'state_specific'
                        ? 'bg-white border-t-amber-500 border-x-slate-300 text-slate-900 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 -mb-2'
                        : 'bg-slate-300/60 hover:bg-slate-300/90 border-t-transparent border-x-transparent text-slate-600 hover:text-slate-900 z-0'
                    }`}
                  >
                    <span className="text-base sm:text-lg leading-none shrink-0">🏛️</span>
                    <span className="truncate tracking-tight">
                      <span className="inline sm:hidden">State Wise</span>
                      <span className="hidden sm:inline">State Specific Jobs</span>
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black transition-colors ${
                        selectedScope === 'state_specific'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-slate-300/80 text-slate-700'
                      }`}
                    >
                      {stateJobs.length}
                    </span>
                  </button>
                </div>

                {/* Layout Toggle (Detailed View vs Table View) - Chrome Toolbar Controls Style */}
                <div className="hidden lg:flex items-center bg-white/90 border border-slate-300 p-1 rounded-xl mb-1.5 shadow-2xs shrink-0">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      viewMode === 'card'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Detailed View"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Detailed View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Table View"
                  >
                    <TableProperties className="h-3.5 w-3.5" />
                    <span>Table View</span>
                  </button>
                </div>
              </div>

              {/* Main Table/Cards Content Panel - Directly connected to active Chrome tab above */}
              <div className="bg-white p-3 sm:p-5">
                {selectedScope === 'all_india' ? (
                  allIndiaJobs.length > 0 ? (
                    <div className="space-y-4">
                      {/* Mobile View: Strictly Card View */}
                      <div className="lg:hidden space-y-3">
                        {allIndiaJobs.slice(0, visibleCount).map((job, idx) => (
                          <JobCard key={`ai-mob-${job.id || idx}`} job={job} />
                        ))}
                      </div>

                      {/* Desktop View: Card or Table View depending on viewMode */}
                      <div className="hidden lg:block">
                        {viewMode === 'card' ? (
                          <div className="space-y-3">
                            {allIndiaJobs.slice(0, visibleCount).map((job, idx) => (
                              <JobCard key={`ai-desk-${job.id || idx}`} job={job} />
                            ))}
                          </div>
                        ) : (
                          <JobTable jobs={allIndiaJobs.slice(0, visibleCount)} navigate={navigate} />
                        )}
                      </div>

                      {/* View More Button */}
                      {allIndiaJobs.length > visibleCount && (
                        <div className="pt-4 pb-1 flex flex-col items-center justify-center gap-2 border-t border-slate-100">
                          <button
                            onClick={() => setVisibleCount(prev => prev + (viewMode === 'table' ? 10 : 5))}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-500"
                          >
                            <span>View More ({allIndiaJobs.length - visibleCount} remaining)</span>
                            <ChevronDown className="h-4 w-4 text-blue-100" />
                          </button>
                          <span className="text-[11px] font-bold text-slate-500">
                            Showing {Math.min(visibleCount, allIndiaJobs.length)} of {allIndiaJobs.length} All India jobs
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                      <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
                        <AlertCircle className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800">No All India Recruitments Found</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        We couldn't find any notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>" under the selected category.
                      </p>
                      <button 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedScope('all_india'); setSortBy('date_posted_desc'); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )
                ) : (
                  stateJobs.length > 0 ? (
                    <div className="space-y-4">
                      {/* Mobile View: Strictly Card View */}
                      <div className="lg:hidden space-y-3">
                        {stateJobs.slice(0, visibleCount).map((job, idx) => (
                          <JobCard key={`state-mob-${job.id || idx}`} job={job} />
                        ))}
                      </div>

                      {/* Desktop View: Card or Table View depending on viewMode */}
                      <div className="hidden lg:block">
                        {viewMode === 'card' ? (
                          <div className="space-y-3">
                            {stateJobs.slice(0, visibleCount).map((job, idx) => (
                              <JobCard key={`state-desk-${job.id || idx}`} job={job} />
                            ))}
                          </div>
                        ) : (
                          <JobTable jobs={stateJobs.slice(0, visibleCount)} navigate={navigate} />
                        )}
                      </div>

                      {/* View More Button */}
                      {stateJobs.length > visibleCount && (
                        <div className="pt-4 pb-1 flex flex-col items-center justify-center gap-2 border-t border-slate-100">
                          <button
                            onClick={() => setVisibleCount(prev => prev + (viewMode === 'table' ? 10 : 5))}
                            className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500"
                          >
                            <span>View More ({stateJobs.length - visibleCount} remaining)</span>
                            <ChevronDown className="h-4 w-4 text-amber-100" />
                          </button>
                          <span className="text-[11px] font-bold text-slate-500">
                            Showing {Math.min(visibleCount, stateJobs.length)} of {stateJobs.length} State Specific jobs
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                      <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
                        <AlertCircle className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800">No State Specific Recruitments Found</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        We couldn't find any notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>" under the selected category.
                      </p>
                      <button 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedScope('state_specific'); setSortBy('date_posted_desc'); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

          {/* Archives Section Card */}
          <Link
            to="/archives"
            className="block group bg-slate-900 hover:bg-slate-900/95 border-2 border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 sm:p-6 text-white shadow-xl mt-8 transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Archive className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors">
                      Archives <span className="text-slate-400 text-xs sm:text-sm font-semibold">(recruitments whose last date to apply have passed)</span>
                    </h2>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-400"></span>
                    Browse and search through {expiredJobsData.length} archived recruitment notifications.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto px-5 py-2.5 bg-amber-500/10 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950 font-extrabold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs">
                <span>Open Archives Subpage</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

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
                  Enable push notifications on NewVacancyAlert.in or save our portal to your home screen. We issue immediate alerts for active vacancies across HAL, ICSI, AAI, ISRO (VSSC), Railway Recruitment Boards, and Defense Services.
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
                  Vacancies cover 10th Pass, 12th Pass, ITI, Diploma, B.E/B.Tech, B.Com, MBA, M.Sc, CA/ICWA, and Medical degrees. Use our domain filter buttons to view vacancies matching your qualification.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  How can I sort job listings by application last date?
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-600">
                  Select "Last Date: Soonest First" from the list sort dropdown menu to immediately prioritize application deadlines that are closing soon.
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Social Handles Banner - Placed at Bottom of Home Page Above Footer */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white rounded-2xl p-3.5 shadow-sm border border-slate-800/60 flex flex-col gap-2.5 lg:hidden mt-8">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-black text-white">Follow Us for Daily Alerts</p>
                  <p className="text-[10px] text-blue-200 font-medium">@NewVacancyAlert</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href="https://www.facebook.com/profile.php?id=61592714690988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition flex items-center gap-1 text-[11px] border border-blue-400/30"
                  title="Facebook Page"
                >
                  <Facebook className="h-3.5 w-3.5 fill-current" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/newvacancyalert.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white font-black transition flex items-center gap-1 text-[11px] border border-pink-400/30"
                  title="Instagram Profile"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Articles Button Below Follow Us */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-200">Exam Guides & Calendars:</span>
              <Link
                to="/articles"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-400 text-blue-950 border border-amber-300 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-950 shrink-0" />
                <span>Read Articles</span>
              </Link>
            </div>
          </div>

          {/* Mobile Marketing Partner Link - Below Follow Us Section */}
          <div className="lg:hidden text-center mt-3">
            <Link to="/marketing-partner" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 underline underline-offset-2 decoration-slate-300">
              Become a Marketing Partner & Earn Rewards
            </Link>
          </div>
          </main>
        </div>
      </div>

      {/* Floating Action Button at Bottom Right for Mobile View */}
      <button
        onClick={() => setIsMobileFiltersOpen(true)}
        className="fixed bottom-6 right-5 z-40 lg:hidden bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 cursor-pointer transition-all hover:shadow-blue-500/25"
        aria-label="Sort Vacancies"
      >
        <Filter className="h-5 w-5 text-white shrink-0" />
        <span className="text-xs font-black pr-1 hidden sm:inline">Sort Options</span>
        <span className="text-xs font-black pr-0.5 sm:hidden">Sort</span>
        {sortBy !== 'date_posted_desc' && (
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-pulse"></span>
        )}
      </button>

      {/* Mobile Popup Modal / Drawer for Sort Options */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          
          {/* Slide-Up Bottom Sheet Modal Container */}
          <div className="relative bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto shadow-2xl p-5 border-t border-slate-200 z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                  <Filter className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-sm leading-none">Sort Job Alerts</h2>
                  <span className="text-[10px] text-slate-400 font-semibold">{filteredJobs.length} Alerts Shown</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-xs font-black text-slate-500 hover:text-slate-800 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-all"
              >
                ✕ Close
              </button>
            </div>

            {/* Sort Order Option Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Choose Sorting Order
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'date_posted_desc', label: '📅 Date Posted: Newest First' },
                  { id: 'date_posted_asc', label: '⏳ Date Posted: Oldest First' },
                  { id: 'posts_desc', label: '🔥 Number of Posts: High to Low' },
                  { id: 'posts_asc', label: '📉 Number of Posts: Low to High' },
                  { id: 'last_date_soonest', label: '⏰ Deadline: Soonest First' },
                  { id: 'last_date_latest', label: '📅 Deadline: Furthest First' },
                  { id: 'default', label: '⭐ Default List Order' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center justify-between ${
                      sortBy === option.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.id && <span className="text-white text-xs font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 pb-safe">
              <button
                onClick={() => {
                  setSortBy('date_posted_desc');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer border border-slate-200 text-center transition-all"
              >
                Reset Sort
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl cursor-pointer text-center shadow-md transition-all"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google-like Mobile & Desktop Fullscreen Search Overlay */}
      <GoogleSearchOverlay 
        isOpen={isGoogleSearchOpen} 
        onClose={() => setIsGoogleSearchOpen(false)} 
        initialQuery={searchTerm}
      />
    </main>
  );
}
