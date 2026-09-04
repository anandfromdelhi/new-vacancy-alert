import React from 'react';
import { Link } from 'react-router';
import { 
  Building2, Calendar, Clock, ArrowRight, ChevronRight,
  Briefcase, GraduationCap, Shield, HeartPulse, HardHat, Scale, UploadCloud
} from 'lucide-react';
import jobsIndexData from '../data/jobs-index-generated.json';
import { useNavigationLoader } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { getJobUploadDate } from '../utils/jobUploadDate';

export interface JobEntry {
  id?: string;
  d: string; // post date
  b: string; // board
  t: string; // title / posts
  q: string; // qualification
  a: string; // advt no
  l: string; // last date
  u: string; // source link
  desc?: string; // simple english description
}

export function isAllIndiaJob(job: JobEntry): boolean {
  const id = (job.id || '').toLowerCase();
  const board = job.b.toLowerCase();
  const title = job.t.toLowerCase();

  const stateKeywords = [
    'up-bulandshahr', 'tumakuru', 'pmmh-delhi', 'daman-government-college', 
    'rajasthan-safai', 'assam-allied', 'cgssb', 'mpsc', 'college-of-art-delhi',
    'esic-bhubaneswar', 'esic-varanasi', 'district court', 'anganwadi',
    'govt of nct of delhi', 'mizoram public service', 'chhattisgarh staff selection',
    'local self government department', 'dme assam', 'government college daman',
    'district program office bulandshahr', 'principal district',
    'pt. madan mohan malaviya hospital', 'manit-bhopal'
  ];

  if (stateKeywords.some(k => id.includes(k) || board.includes(k))) {
    return false;
  }

  const allIndiaKeywords = [
    'upsc', 'ssc', 'rrb', 'isro', 'army', 'navy', 'air force', 'iaf', 'drdo', 'ongc',
    'iocl', 'esic', 'aai', 'nicl', 'sidbi', 'union bank', 'pnb', 'irel', 'wcl',
    'rites', 'icai', 'cert-in', 'ngel', 'pdil', 'nhsrcl', 'nhidcl', 'ihmcl', 'spmcil',
    'ccras', 'stpi', 'prl', 'nfr', 'edcil', 'fagmil', 'beml', 'ncl', 'hpcl', 'icar',
    'icsi', 'avnl', 'nalco', 'tmb', 'norcet', 'iifcl', 'rail wheel factory'
  ];

  if (allIndiaKeywords.some(k => id.includes(k) || board.includes(k) || title.includes(k))) {
    return true;
  }

  return true;
}

export function getCategoryAndColor(board: string, title: string) {
  const b = board.toLowerCase();
  const t = title.toLowerCase();

  if (b.includes('bank') || b.includes('sidbi') || b.includes('pnb') || b.includes('union bank') || b.includes('idbi') || b.includes('ipl')) {
    return { cat: 'Banking', icon: Briefcase, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', border: 'border-l-emerald-500', pill: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (b.includes('army') || b.includes('navy') || b.includes('air force') || b.includes('iaf') || b.includes('defense') || b.includes('ta') || b.includes('cert-in')) {
    return { cat: 'Defense', icon: Shield, color: 'bg-amber-50 text-amber-700 border-amber-200', border: 'border-l-amber-500', pill: 'bg-amber-100 text-amber-800 border-amber-300' };
  }
  if (b.includes('health') || b.includes('hospital') || b.includes('esic') || b.includes('medical') || b.includes('norcet') || t.includes('nurse') || t.includes('doctor')) {
    return { cat: 'Medical', icon: HeartPulse, color: 'bg-rose-50 text-rose-700 border-rose-200', border: 'border-l-rose-500', pill: 'bg-rose-100 text-rose-800 border-rose-300' };
  }
  if (b.includes('ongc') || b.includes('iocl') || b.includes('wcl') || b.includes('ncl') || b.includes('hpcl') || b.includes('beml') || b.includes('rites') || b.includes('engineering') || b.includes('isro') || b.includes('drdo') || b.includes('rail wheel')) {
    return { cat: 'Engineering', icon: HardHat, color: 'bg-blue-50 text-blue-700 border-blue-200', border: 'border-l-blue-500', pill: 'bg-blue-100 text-blue-800 border-blue-300' };
  }
  if (b.includes('court') || b.includes('law') || b.includes('legal')) {
    return { cat: 'Judicial', icon: Scale, color: 'bg-purple-50 text-purple-700 border-purple-200', border: 'border-l-purple-500', pill: 'bg-purple-100 text-purple-800 border-purple-300' };
  }
  if (b.includes('college') || b.includes('university') || b.includes('school') || b.includes('principal') || b.includes('teaching') || b.includes('education')) {
    return { cat: 'Education', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-700 border-indigo-200', border: 'border-l-indigo-500', pill: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
  }
  return { cat: 'General', icon: Building2, color: 'bg-slate-50 text-slate-700 border-slate-200', border: 'border-l-slate-400', pill: 'bg-slate-100 text-slate-800 border-slate-300' };
}

export function getBoardAcronym(board: string): string {
  if (!board) return '';
  const lower = board.toLowerCase().trim();

  if (lower.includes('district program office bulandshahr') || lower.includes('wcd uttar pradesh')) return 'WCD Bulandshahr';
  if (lower.includes('principal district & sessions court') || lower.includes('tumakuru')) return 'Tumakuru Dist Court';
  if (lower.includes('rail wheel factory') || lower.includes('rwf')) return 'RWF Yelahanka';
  if (lower.includes('madan mohan malaviya hospital') || lower.includes('pmmmh')) return 'PMMH Delhi';
  if (lower.includes('master control facility') || lower.includes('mcf')) return 'ISRO-MCF';
  if (lower.includes('government college daman')) return 'Govt College Daman';
  if (lower.includes('national institute for tribal health research') || lower.includes('nithr')) return 'ICMR-NITHR';
  if (lower.includes('local self government department') || lower.includes('dlb')) return 'DLB Rajasthan';
  if (lower.includes('assam allied and healthcare council') || lower.includes('dme assam')) return 'DME Assam';
  if (lower.includes('national aluminium company') || lower.includes('nalco')) return 'NALCO';
  if (lower.includes('isro centralised recruitment board') || lower.includes('icrb')) return 'ISRO-ICRB';
  if (lower.includes('armoured vehicles nigam') || lower.includes('avnl')) return 'AVNL';
  if (lower.includes('security printing and minting corporation') || lower.includes('spmcil')) return 'SPMCIL';
  if (lower.includes('esic medical college') && lower.includes('bhubaneswar')) return 'ESIC Bhubaneswar';
  if (lower.includes('esic medical college') && lower.includes('varanasi')) return 'ESIC Varanasi';
  if (lower.includes('employees\' state insurance corporation') || lower === 'esic') return 'ESIC';
  if (lower.includes('maulana azad national institute') || lower.includes('manit')) return 'MANIT Bhopal';
  if (lower.includes('college of art')) return 'College of Art Delhi';
  if (lower.includes('chhattisgarh staff selection board') || lower.includes('cgssb') || lower.includes('vyapam')) return 'CGSSB / Vyapam';
  if (lower.includes('mizoram public service commission') || lower.includes('mpsc')) return 'MPSC';
  if (lower.includes('central council for research in ayurvedic sciences') || lower.includes('ccras')) return 'CCRAS';
  if (lower.includes('software technology parks of india') || lower.includes('stpi')) return 'STPI';
  if (lower.includes('physical research laboratory') || lower.includes('prl')) return 'PRL';
  if (lower.includes('northeast frontier railway') || lower.includes('nfr')) return 'NFR';
  if (lower.includes('territorial army')) return 'TA';
  if (lower.includes('union public service commission') || lower === 'upsc') return 'UPSC';
  if (lower.includes('staff selection commission') || lower === 'ssc') return 'SSC';
  if (lower.includes('tamilnad mercantile bank') || lower.includes('tmb')) return 'TMB';
  if (lower.includes('all india institute of medical sciences') || lower.includes('aiims')) return 'AIIMS New Delhi';
  if (lower.includes('airports authority of india') || lower.includes('aai')) return lower.includes('edcil') ? 'EdCIL / AAI' : 'AAI';
  if (lower.includes('hindustan aeronautics') || lower === 'hal') return 'HAL';
  if (lower.includes('company secretaries of india') || lower.includes('icsi')) return 'ICSI';
  if (lower.includes('national institute on foot and mouth disease') || lower.includes('nifmd')) return 'ICAR-NIFMD';
  if (lower.includes('small industries development bank') || lower.includes('sidbi')) return 'SIDBI';
  if (lower.includes('central railway')) return 'Central Railway';
  if (lower.includes('indian space research organisation') || lower.includes('isro')) return 'ISRO';
  if (lower.includes('fci aravali gypsum') || lower.includes('fagmil')) return 'FAGMIL';
  if (lower.includes('union bank of india')) return 'Union Bank';
  if (lower.includes('punjab national bank') || lower.includes('pnb')) return 'PNB';
  if (lower.includes('irel (india) limited') || lower === 'irel') return 'IREL';
  if (lower.includes('western coalfields') || lower.includes('wcl')) return 'WCL';
  if (lower.includes('indian air force') || lower.includes('iaf')) return 'IAF';
  if (lower.includes('rites')) return 'RITES';
  if (lower.includes('icai')) return 'ICAI';
  if (lower.includes('nicl') || lower.includes('national insurance company')) return 'NICL';
  if (lower.includes('iifcl') || lower.includes('ipl')) return 'IIFCL';
  if (lower.includes('beml') || lower.includes('bharat earth movers')) return 'BEML';
  if (lower.includes('ongc') || lower.includes('oil and natural gas')) return 'ONGC';
  if (lower.includes('railway recruitment board') || lower === 'rrb') return 'RRB';
  if (lower.includes('northern coalfields') || lower === 'ncl') return 'NCL';
  if (lower.includes('hindustan petroleum') || lower === 'hpcl') return 'HPCL';
  if (lower.includes('cert-in') || lower.includes('computer emergency response team')) return 'CERT-In';
  if (lower.includes('indian oil corporation') || lower === 'iocl') return 'IOCL';
  if (lower.includes('ntpc green energy') || lower === 'ngel') return 'NGEL';
  if (lower.includes('projects & development india') || lower === 'pdil') return 'PDIL';
  if (lower.includes('national high speed rail') || lower === 'nhsrcl') return 'NHSRCL';
  if (lower.includes('highways & infrastructure development') || lower === 'nhidcl') return 'NHIDCL';
  if (lower.includes('highways management company') || lower === 'ihmcl') return 'IHMCL';
  if (lower.includes('central council for research in unani') || lower === 'ccrum') return 'CCRUM';
  if (lower.includes('indian army')) return 'Indian Army';
  if (lower.includes('indian navy')) return 'Indian Navy';
  if (lower.includes('defence research and development') || lower === 'drdo') return 'DRDO';

  const match = board.match(/\(([^)]+)\)/);
  if (match) {
    const parenthesized = match[1].trim();
    if (parenthesized.length <= 15 && !parenthesized.toLowerCase().includes('vigilance') && !parenthesized.toLowerCase().includes('e02')) {
      return parenthesized;
    }
  }

  if (board.length <= 15) return board;

  return board.substring(0, 15).trim() + '...';
}

export function formatLastDateOnly(lastDateStr: string): string {
  if (!lastDateStr || lastDateStr.trim() === '' || lastDateStr === '–') return '–';
  
  const str = lastDateStr.trim();

  // Match DD-MM-YYYY, DD/MM/YYYY, or DD.MM.YYYY
  const dateNumMatch = str.match(/\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/);
  if (dateNumMatch) {
    return dateNumMatch[1];
  }

  // Match DD Month YYYY (e.g. 15 August 2026, 15 Aug 2026, 15-Aug-2026)
  const dateTextMatch = str.match(/\b(\d{1,2}[\s\-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]+\d{4})\b/i);
  if (dateTextMatch) {
    return dateTextMatch[1];
  }

  // Fallback: take portion before any parenthesis
  const beforeParen = str.split('(')[0].trim();
  if (beforeParen && beforeParen.length > 0) {
    return beforeParen;
  }

  return str;
}

export function getCompactQualification(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('b.e/b.tech') || lower.includes('engineering')) return 'Engineering';
  if (lower.includes('graduate') || lower.includes('graduation')) return 'Degree / Grad';
  if (lower.includes('10th') || lower.includes('matriculation')) return '10th Pass';
  if (lower.includes('12th') || lower.includes('intermediate')) return '12th Pass';
  if (lower.includes('diploma')) return 'Diploma';
  if (q.length > 25) return q.substring(0, 25).trim() + '...';
  return q;
}

export function getNumberOfPostsInfo(title: string, jobId?: string): { display: string; count: number } {
  const indexObj = (jobsIndexData as Record<string, any>);
  if (jobId && indexObj[jobId]) {
    const v = indexObj[jobId].vacancies;
    if (typeof v === 'number') {
      return { display: `${v} ${v === 1 ? 'Post' : 'Posts'}`, count: v };
    }
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (/^(\d+[\d,]*)\s*Posts?/i.test(trimmed)) {
        const match = trimmed.match(/^(\d+[\d,]*)/);
        if (match) {
          const num = parseInt(match[1].replace(/,/g, ''), 10);
          return { display: `${num} ${num === 1 ? 'Post' : 'Posts'}`, count: num };
        }
      }
      if (/^\d+[\d,]*$/.test(trimmed)) {
        const num = parseInt(trimmed.replace(/,/g, ''), 10);
        return { display: `${num} ${num === 1 ? 'Post' : 'Posts'}`, count: num };
      }
      if (trimmed.toLowerCase().includes('various') || trimmed.toLowerCase().includes('multiple') || trimmed.toLowerCase().includes('not mentioned')) {
        return { display: 'Various Posts', count: 0 };
      }
      const numMatch = trimmed.match(/(\d+[\d,]*)\s*Posts?/i) || trimmed.match(/(\d+[\d,]*)/);
      if (numMatch) {
        const num = parseInt(numMatch[1].replace(/,/g, ''), 10);
        if (num < 50000) {
          return { display: `${num} ${num === 1 ? 'Post' : 'Posts'}`, count: num };
        }
      }
    }
  }

  const match = title.match(/(\d+[\d,]*)\s*\+?\s*(?:Posts?|Vacanc|Positions?|Contractual Posts?|Profiles?|Seats?|Openings?)/i)
             || title.match(/–\s*(\d+[\d,]*)\s*Posts?/i);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    return { display: `${num} ${num === 1 ? 'Post' : 'Posts'}`, count: num };
  }

  if (title.toLowerCase().includes('various') || title.toLowerCase().includes('multiple')) {
    return { display: 'Various Posts', count: 0 };
  }

  return { display: '1 Post', count: 1 };
}

export function getNumberOfPosts(title: string, jobId?: string): number {
  return getNumberOfPostsInfo(title, jobId).count;
}

export function JobCard({ job }: { job: JobEntry; key?: React.Key }) {
  const { cat, icon: CategoryIcon, color, border, pill } = getCategoryAndColor(job.b, job.t);
  const boardAcronym = getBoardAcronym(job.b);
  const postsInfo = getNumberOfPostsInfo(job.t, job.id);
  const isAllIndia = isAllIndiaJob(job);
  const { startLoading } = useNavigationLoader();
  const formattedLastDate = formatLastDateOnly(job.l);
  const { isAdmin } = useAuth();
  const uploadDate = getJobUploadDate(job.id, job.d);

  return (
    <div className={`bg-white border-2 border-slate-200 hover:border-blue-400 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-5 relative overflow-hidden border-l-[5px] sm:border-l-[6px] ${border} min-h-[140px] md:min-h-[135px]`}>
      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
        <div className={`p-3 rounded-xl border-2 ${color} shrink-0 hidden sm:flex items-center justify-center`}>
          <CategoryIcon className="h-5 w-5" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
              isAllIndia ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {isAllIndia ? '🇮🇳 All India' : '🏛️ State Govt'}
            </span>
            <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${pill}`}>
              <CategoryIcon className="h-3 w-3 shrink-0" />
              {cat}
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              Posted: {job.d}
            </span>
            {isAdmin && (
              <span className="bg-purple-100 border border-purple-300 text-purple-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs" title="Admin Only: Date when job was added to site">
                <UploadCloud className="h-3 w-3 shrink-0 text-purple-700" />
                Upload Date: {uploadDate}
              </span>
            )}
            {postsInfo.display && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full">
                🔥 {postsInfo.display}
              </span>
            )}
          </div>

          <h3 className="text-[13px] sm:text-base font-black text-slate-800 leading-snug line-clamp-2 min-h-[2.25rem] flex items-center">
            <span><span className="text-blue-700">{boardAcronym}</span> - <span className="text-slate-900">{job.t}</span></span>
          </h3>

          {job.desc && (
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-normal sm:leading-relaxed max-w-3xl bg-slate-50/70 p-2 rounded-lg border border-slate-100 line-clamp-2">
              {job.desc}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-wider">Qualification:</span>
            <span className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-md truncate max-w-full">
              {job.q}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-100 pt-2.5 sm:pt-3 md:pt-0 gap-2.5 sm:gap-3 shrink-0 md:min-w-[140px]">
        <div className="text-left md:text-right space-y-0.5">
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-wider block">Deadline</span>
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {formattedLastDate}
          </span>
        </div>

        {job.id ? (
          <Link 
            to={`/${job.id}`}
            onClick={() => startLoading(`Loading ${boardAcronym} Notification...`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs sm:shadow-md transition-all hover:scale-105 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        ) : (
          <button 
            disabled
            className="bg-slate-100 border border-slate-200 text-slate-400 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-not-allowed select-none opacity-85 shrink-0"
          >
            <span>Details Disabled</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function JobTable({ jobs, navigate }: { jobs: JobEntry[]; navigate: (path: string) => void }) {
  const { startLoading } = useNavigationLoader();
  const { isAdmin } = useAuth();

  const handleRowClick = (job: JobEntry) => {
    if (job.id) {
      const boardAcronym = getBoardAcronym(job.b);
      startLoading(`Loading ${boardAcronym} Details...`);
      navigate(`/${job.id}`);
    }
  };

  return (
    <div className="overflow-hidden bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50/85">
              <th className="px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Date Posted</th>
              <th className="px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500">Exam Board & Job Title</th>
              <th className="px-3 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 text-center whitespace-nowrap">Posts</th>
              <th className="px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500">Qualification</th>
              <th className="px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Last Date</th>
              <th className="px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job, idx) => {
              const { icon: CategoryIcon, color } = getCategoryAndColor(job.b, job.t);
              const compactBoard = getBoardAcronym(job.b);
              const postsInfo = getNumberOfPostsInfo(job.t, job.id);
              const formattedLastDate = formatLastDateOnly(job.l);
              const uploadDate = getJobUploadDate(job.id, job.d);

              return (
                <tr 
                  key={`tbl-${job.id || idx}`} 
                  onClick={() => handleRowClick(job)}
                  className={`hover:bg-blue-50/40 active:bg-blue-50/70 cursor-pointer transition-all group ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                  }`}
                >
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    <div>{job.d}</div>
                    {isAdmin && (
                      <div className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 mt-1 inline-flex items-center gap-1" title="Admin Only: Site Upload Date">
                        <UploadCloud className="h-2.5 w-2.5 shrink-0" />
                        <span>Added: {uploadDate}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 min-w-[280px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-md border ${color} shrink-0 inline-flex`}>
                          <CategoryIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80 inline-block" title={job.b}>
                          {compactBoard}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-800 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                        {job.t}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center font-extrabold text-slate-800 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-2.5 py-1 rounded text-xs min-w-[48px] text-center">
                      {postsInfo.display}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 max-w-[280px]">
                    <span 
                      className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md block line-clamp-2 leading-tight" 
                      title={job.q}
                    >
                      {job.q}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                      <Clock className="h-3 w-3 shrink-0 inline-block" />
                      <span>{formattedLastDate}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 group-hover:text-blue-700 bg-blue-50 group-hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Compact preview tile for individual jobs inside each category / state section
 * Minimal info: Board acronym, vacancies, job title, last date, and details link.
 */
export function JobTile({ job }: { job: JobEntry; key?: React.Key }) {
  const { startLoading } = useNavigationLoader();
  const boardAcronym = getBoardAcronym(job.b);
  const postsInfo = getNumberOfPostsInfo(job.t, job.id);
  const formattedLastDate = formatLastDateOnly(job.l);

  return (
    <Link
      to={`/${job.id}`}
      onClick={() => startLoading(`Loading ${boardAcronym} Details...`)}
      className="group block bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-400 rounded-xl p-3 sm:p-3.5 shadow-2xs hover:shadow-sm transition-all duration-150 relative overflow-hidden"
    >
      {/* Top row: Board Badge + Vacancy Count */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 max-w-[65%] truncate">
          <Building2 className="w-3 h-3 shrink-0 text-blue-600" />
          <span className="truncate">{boardAcronym}</span>
        </span>
        {postsInfo.display && (
          <span className="shrink-0 inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            🔥 {postsInfo.display}
          </span>
        )}
      </div>

      {/* Job Title */}
      <h4 className="text-xs sm:text-[13px] font-black text-slate-800 group-hover:text-blue-700 leading-snug line-clamp-2 mb-2 transition-colors">
        {job.t}
      </h4>

      {/* Bottom meta: Last Date + Details link */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1.5 border-t border-slate-100">
        <span className="inline-flex items-center gap-1 text-rose-600 font-extrabold text-[10.5px]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Last Date: {formattedLastDate}</span>
        </span>
        <span className="inline-flex items-center gap-0.5 text-blue-600 group-hover:translate-x-0.5 transition-transform text-[11px] font-black">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
