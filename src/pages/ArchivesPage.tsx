import React, { useState, useMemo, useEffect } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link, useNavigate } from 'react-router';
import { JobCard, JobTable } from '../components/JobList';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { GoogleSearchOverlay } from '../components/GoogleSearchOverlay';
import { 
  Search, Calendar, Briefcase, CheckCircle2, ChevronRight, ChevronDown,
  Clock, Building2, ShieldAlert, Rocket, BookOpen, Users, 
  AlertCircle, Filter, RotateCcw, LayoutGrid, TableProperties, Archive,
  ArrowLeft, FileText, ExternalLink, Sparkles
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

function getCategoryAndColor(board: string, title: string) {
  const b = board.toLowerCase();
  const t = title.toLowerCase();
  
  if (b.includes('bank') || b.includes('rbi') || b.includes('sbi') || b.includes('iob') || b.includes('ibps') || b.includes('insurance') || b.includes('nicl')) {
    return { cat: 'Banking', icon: Building2 };
  }
  if (b.includes('army') || b.includes('navy') || b.includes('iaf') || b.includes('air force') || b.includes('defense') || b.includes('soldier') || b.includes('territorial')) {
    return { cat: 'Defense', icon: ShieldAlert };
  }
  if (b.includes('rrb') || b.includes('railway') || b.includes('nfr')) {
    return { cat: 'Railway', icon: Rocket };
  }
  if (b.includes('iit') || b.includes('school') || b.includes('university') || b.includes('teaching') || b.includes('professor') || b.includes('assistant editor')) {
    return { cat: 'Education', icon: BookOpen };
  }
  if (b.includes('medical') || b.includes('esic') || b.includes('ccrum') || b.includes('nurse') || b.includes('doctor')) {
    return { cat: 'Medical', icon: Users };
  }
  if (t.includes('engineer') || t.includes('technician') || t.includes('apprentice') || b.includes('fagmil') || b.includes('ongc') || b.includes('rites') || b.includes('isro') || b.includes('hpcl') || b.includes('vssc') || b.includes('pdil') || b.includes('iocl') || b.includes('nhsrcl') || b.includes('nhidcl') || b.includes('wcl')) {
    return { cat: 'Technical', icon: Rocket };
  }
  return { cat: 'Government Job', icon: Briefcase };
}

function getVacancyCount(title: string): number {
  const match = title.match(/(\d+[\d,]*)\s*\+?\s*(?:Posts?|Vacanc|Positions?|Contractual Posts?|Profiles?|Seats?|Openings?)/i)
             || title.match(/–\s*(\d+[\d,]*)\s*Posts?/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 1;
}

export default function ArchivesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScope, setSelectedScope] = useState<'all' | 'all_india' | 'state_specific'>('all');
  const [sortBy, setSortBy] = useState<string>('date_posted_desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const navigate = useNavigate();

  // All expired/archived jobs
  const expiredJobsData = useMemo(() => {
    return JOBS_DATA.filter(job => isJobExpired(job.l));
  }, []);

  // Category list and counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: expiredJobsData.length };
    expiredJobsData.forEach(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [expiredJobsData]);

  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    list.add('All');
    expiredJobsData.forEach(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      list.add(cat);
    });
    return Array.from(list);
  }, [expiredJobsData]);

  // Scope counts
  const scopeCounts = useMemo(() => {
    let allIndia = 0;
    let stateSpecific = 0;
    expiredJobsData.forEach(job => {
      if (isAllIndiaJob(job)) {
        allIndia++;
      } else {
        stateSpecific++;
      }
    });
    return { all: expiredJobsData.length, allIndia, stateSpecific };
  }, [expiredJobsData]);

  // Filtered & Sorted Archived Jobs
  const filteredExpiredJobs = useMemo(() => {
    let result = expiredJobsData.filter(job => {
      const { cat } = getCategoryAndColor(job.b, job.t);
      const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
      const matchesScope = 
        selectedScope === 'all' || 
        (selectedScope === 'all_india' && isAllIndiaJob(job)) ||
        (selectedScope === 'state_specific' && !isAllIndiaJob(job));

      const matchesSearch = 
        job.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.a.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesScope && matchesSearch;
    });

    if (sortBy === 'date_posted_desc') {
      result.sort((a, b) => parseDateString(b.d).getTime() - parseDateString(a.d).getTime());
    } else if (sortBy === 'date_posted_asc') {
      result.sort((a, b) => parseDateString(a.d).getTime() - parseDateString(b.d).getTime());
    } else if (sortBy === 'posts_desc') {
      result.sort((a, b) => getVacancyCount(b.t) - getVacancyCount(a.t));
    } else if (sortBy === 'posts_asc') {
      result.sort((a, b) => getVacancyCount(a.t) - getVacancyCount(b.t));
    } else if (sortBy === 'last_date_soonest') {
      result.sort((a, b) => parseDateString(a.l).getTime() - parseDateString(b.l).getTime());
    }

    return result;
  }, [expiredJobsData, searchTerm, selectedCategory, selectedScope, sortBy]);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, selectedCategory, selectedScope, sortBy]);

  return (
    <main className="flex-1 flex flex-col w-full bg-slate-50 min-h-screen">
      <Helmet>
        <title>Recruitment Archives | Closed Government Jobs & Past Notifications | NewVacancyAlert</title>
        <meta name="description" content="Browse archived government recruitment notifications whose application last date has passed. Search past vacancies across Banking, Railways, Defense, and State Public Services." />
        <meta name="keywords" content="Government Job Archives, Past Recruitment Notifications, Closed Vacancies, Expired Sarkari Result Alerts, Archived Job Notifications" />
        <link rel="canonical" href="https://newvacancyalert.in/archives" />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-slate-900 border-b border-slate-800 text-white py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumb / Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Active Jobs</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Archive className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Recruitment Archives
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {expiredJobsData.length} Past Notifications
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-2xl">
                Search and explore historical government recruitment notifications whose application deadlines have passed.
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    selectedScope === scope.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          {/* Search Box - Tapping opens Home Page-style Fullscreen Search */}
          <div 
            onClick={() => setIsGoogleSearchOpen(true)}
            className="relative flex items-center bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-amber-500 rounded-xl p-3 shadow-xs transition-all text-slate-800 cursor-pointer group"
          >
            <Search className="h-5 w-5 text-amber-600 shrink-0 ml-1 group-hover:scale-110 transition-transform" />
            <div className="flex-1 px-3 text-xs sm:text-sm font-medium text-slate-700">
              {searchTerm ? (
                <span className="font-bold text-slate-900">{searchTerm}</span>
              ) : (
                <span className="text-slate-400">Search archived notifications by title, board, qualification, advt no...</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-lg text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Full Screen Search</span>
              <span className="sm:hidden">Search</span>
            </div>
          </div>

          {/* Category Filter Pills & Sort Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200/90 text-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    selectedCategory === cat ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode & Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
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
                <option value="last_date_soonest">⏰ Last Date Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>Archived Notifications</span>
            <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold">
              {filteredExpiredJobs.length} Found
            </span>
          </h2>

          {(searchTerm || selectedCategory !== 'All' || selectedScope !== 'all' || sortBy !== 'date_posted_desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
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

        {/* Archived Jobs Listings */}
        {filteredExpiredJobs.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop View: Card or Table View */}
            {viewMode === 'card' ? (
              <div className="space-y-3">
                {filteredExpiredJobs.slice(0, visibleCount).map((job, idx) => (
                  <JobCard key={`arch-card-${job.id || idx}`} job={job} />
                ))}
              </div>
            ) : (
              <JobTable jobs={filteredExpiredJobs.slice(0, visibleCount)} navigate={navigate} />
            )}

            {/* View More Button */}
            {filteredExpiredJobs.length > visibleCount && (
              <div className="pt-4 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500"
                >
                  <span>Show More Archived Recruitments ({filteredExpiredJobs.length - visibleCount} remaining)</span>
                  <ChevronDown className="h-4 w-4 text-amber-100" />
                </button>
                <span className="text-[11px] font-bold text-slate-500">
                  Showing {Math.min(visibleCount, filteredExpiredJobs.length)} of {filteredExpiredJobs.length} archived entries
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No Archived Recruitments Found</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We couldn't find any closed notifications matching "<span className="font-bold text-slate-700">{searchTerm}</span>".
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedScope('all'); setSortBy('date_posted_desc'); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Google-like Search Overlay */}
      <GoogleSearchOverlay 
        isOpen={isGoogleSearchOpen} 
        onClose={() => setIsGoogleSearchOpen(false)} 
        initialQuery={searchTerm}
        archiveOnly={true}
      />
    </main>
  );
}
