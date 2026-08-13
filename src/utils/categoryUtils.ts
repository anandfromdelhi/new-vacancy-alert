import { JobEntry } from '../data/jobsData';

/**
 * Converts a name to a URL-friendly slug.
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Converts a slug back to title case for display purposes (fallback).
 */
export function fromSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// All-India recruiting bodies and central open recruitments (anyone in India can apply)
const ALL_INDIA_KEYWORDS = [
  'upsc', 'union public service commission', 'ssc', 'rrb', 'railway', 'isro', 'drdo', 'indian army', 'indian navy', 'indian air force', 'iaf',
  'ongc', 'iocl', 'bpcl', 'hpcl', 'esic', 'aiims', 'ibps', 'hal', 'bel', 'beml', 'ntpc',
  'sjvn', 'nlcil', 'nalco', 'stpi', 'railtel', 'rcil', 'krcl', 'nrsc', 'sinp', 'mecl',
  'spmcil', 'cert-in', 'nhsrcl', 'nhidcl', 'ihmcl', 'fagmil', 'pdil', 'ngel', 'rcf ltd', 'rites', 'irel',
  'wcl', 'ncl', 'nicl', 'sidbi', 'tmb', 'nabard', 'icai', 'icsi', 'icar', 'aai', 'prl', 'edcil',
  'avnl', 'niper', 'ofdr', 'munitions india', 'ccras', 'ccrum', 'rwf', 'iifcl',
  'india post', 'department of posts', 'aweil', 'csir', 'jipmer', 'sspl', 'ncra-tifr',
  'institute of banking personnel', 'union bank', 'punjab national bank', 'pnb',
  'sbi', 'reserve bank', 'rbi', 'national insurance company', 'tamilnad mercantile bank', 'iob', 'indian overseas bank'
];

// State & UT mapping keywords
export const STATE_MAP: Record<string, string[]> = {
  'Uttar Pradesh': ['uttar pradesh', 'uppsc', 'aligarh muslim university', 'amu', 'azamgarh', 'bulandshahr', 'banda', 'farrukhabad', 'sant kabir nagar', 'hapur', 'raebareli'],
  'Odisha': ['odisha', 'opsc', 'bhadrak'],
  'Dadra & Nagar Haveli and Daman & Diu': ['dadra and nagar haveli', 'dadra & nagar haveli', 'dadra', 'daman', 'dnh', 'dnhdd', 'diu'],
  'Haryana': ['haryana', 'wcd haryana', 'hartron', 'kurukshetra', 'panchkula'],
  'Delhi': ['delhi', 'igdtuw', 'sddmasc', 'rtrmh', 'dhas', 'pmmh', 'university of delhi', 'nct of delhi', 'niscpr', 'sspl'],
  'Himachal Pradesh': ['himachal pradesh', 'hpjsv', 'shimla', 'hamirpur', 'hppsc'],
  'Jammu & Kashmir': ['jammu and kashmir', 'jammu & kashmir', 'jammu', 'kashmir', 'jkpsc', 'jkssb', 'j&k'],
  'Maharashtra': ['maharashtra', 'mumbai', 'pune', 'thane municipal', 'msrlm', 'solapur', 'sindhudurg', 'dehu road'],
  'Goa': ['panaji', 'echs panaji', 'goa'],
  'Tamil Nadu': ['tamil nadu', 'cutn', 'thiruvarur', 'tnstc', 'tnsrlm'],
  'Karnataka': ['karnataka', 'bengaluru', 'dharwad', 'davanagere', 'vijayapura', 'chamarajanagar', 'ramanagara', 'yadgir', 'bidar', 'kea', 'sjicr', 'dudc', 'cims', 'ursc'],
  'Punjab': ['punjab', 'ludhiana', 'mohali', 'sas nagar', 'sikhiya bharti', 'verka', 'milkfed'],
  'Assam': ['assam', 'apsc', 'amtron', 'guwahati', 'dme assam'],
  'Gujarat': ['gujarat', 'gsssb'],
  'Telangana': ['telangana', 'hyderabad', 'karimnagar', 'tslprb', 'medchal-malkajgiri', 'medchal', 'wanaparthy', 'drdl', 'ngri'],
  'Manipur': ['manipur', 'mssc'],
  'Rajasthan': ['rajasthan', 'rvunl', 'rvun', 'rvpn', 'jvvn', 'avvn', 'jdvvn', 'dlb rajasthan'],
  'West Bengal': ['west bengal', 'clw', 'chittaranjan', 'contai', 'purba medinipur', 'kolkata', 'kalyani', 'nscbi', 'sinp'],
  'Andhra Pradesh': ['andhra pradesh', 'kadapa'],
  'Chhattisgarh': ['chhattisgarh', 'baloda bazar', 'janjgir', 'cgssb', 'raipur'],
  'Bihar': ['bihar', 'jamui', 'dcpu'],
  'Madhya Pradesh': ['madhya pradesh', 'mpypil', 'bhopal', 'ujjain', 'indore', 'gwalior', 'mpesb'],
  'Mizoram': ['mizoram public service', 'mizoram']
};

/**
 * Helper to safely check word boundaries.
 */
function containsKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefix = /^[\w]/.test(keyword) ? '\\b' : '';
  const suffix = /[\w]$/.test(keyword) ? '\\b' : '';
  return new RegExp(`${prefix}${escaped}${suffix}`, 'i').test(text);
}

/**
 * Returns the Indian state/UT name (or 'All India') for a given job.
 * Classification logic:
 * 1. Explicit Nationwide Combined Exams (NORCET, SSC CGL/CHSL, RRB, IBPS, SBI Clerk/PO) -> 'All India'.
 * 2. Explicit State / City Location match in Board/Title/ID -> State (e.g. AIIMS Raipur -> Chhattisgarh, ESIC Pune -> Maharashtra).
 * 3. General All-India Central Bodies -> 'All India'.
 * 4. Fallback -> 'All India'.
 */
export function getStateFromJob(job: JobEntry): string {
  const idStr = job.id || '';
  const text = `${job.b} ${job.t} ${idStr}`.toLowerCase();

  // Explicit Nationwide Combined Exams / All-India Multi-State Drives
  const nationwideExams = [
    'norcet', 'civil services examination', 'combined graduate level', 'ssc cgl', 'ssc chsl',
    'rrb technician', 'ibps clerk', 'ibps po', 'sbi clerk', 'sbi po', 'crp csa'
  ];

  if (nationwideExams.some(kw => text.includes(kw))) {
    return 'All India';
  }

  // FIRST: Check if job explicitly specifies a State/UT or regional city in board/title
  for (const [state, keywords] of Object.entries(STATE_MAP)) {
    for (const kw of keywords) {
      if (containsKeyword(text, kw)) {
        return state;
      }
    }
  }

  // SECOND: Check if job is a Central/National Body open nationwide without regional state binding
  if (ALL_INDIA_KEYWORDS.some(kw => containsKeyword(text, kw))) {
    return 'All India';
  }

  // Fallback to All India
  return 'All India';
}

/**
 * Extracts the primary board/organization short name from the `b` field.
 */
export function getBoardNameFromJob(job: JobEntry): string {
  const b = job.b;

  // Manual overrides for long, complex names without clear acronyms
  if (b.includes('Central Armed Police Forces Medical Officer Selection Board')) return 'CAPF MOSB';
  if (b.includes('NIScPR')) return 'CSIR-NIScPR';
  if (b.includes('Milk Producers') || b.includes('MILKFED')) return 'Verka MILKFED Punjab';
  if (b.includes('District Basic Education Officer, Bulandshahr')) return 'DBEO Bulandshahr';
  if (b.includes('District Basic Education Officer, Banda')) return 'DBEO Banda';
  if (b.includes('Programme Officer, Farrukhabad')) return 'DPO Farrukhabad';
  if (b.includes('Women & Child Development (WDCW), Karimnagar')) return 'WDCW Karimnagar';
  if (b.includes('District and Sessions Court, Ramanagara')) return 'Dist Court Ramanagara';
  if (b.includes('District Judge, Bhadrak')) return 'Dist Court Bhadrak';
  if (b.includes('Child Development Services & Nutrition')) {
    const districtMatch = b.match(/District ([^,]+)/);
    if (districtMatch) return `ICDS ${districtMatch[1]}`;
    return 'ICDS';
  }

  // Attempt to extract acronym in parentheses (e.g., "JKPSC" or "AIIMS")
  const acronymMatch = b.match(/\(([A-Z0-9&]{2,10})\)/);
  if (acronymMatch) {
    const acronym = acronymMatch[1];
    
    // Check if there is a location attached, usually separated by a comma
    const parts = b.split(',');
    if (parts.length > 1) {
      const secondPart = parts[1].trim();
      if (secondPart && !secondPart.includes('Govt') && !secondPart.includes('Dept') && secondPart.length < 20) {
        return `${acronym} ${secondPart}`;
      }
    }
    return acronym;
  }

  // Fallback: Use the first meaningful chunk before a comma or opening parenthesis
  const firstChunk = b.split(',')[0].trim();
  if (firstChunk.includes('(')) {
    return firstChunk.split('(')[0].trim();
  }
  return firstChunk;
}

export interface QualificationCount {
  name: string;
  slug: string;
  count: number;
}

export const QUAL_CATEGORIES = [
  { name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate', 'pourakarmika', 'safai', 'soldier'] },
  { name: '12th Pass', slug: '12th-pass', keywords: ['12th', 'intermediate', 'higher secondary', '10+2', 'puc'] },
  { name: 'Any Graduate', slug: 'ba', keywords: ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor'] },
  { name: 'B.Tech / B.E', slug: 'btech', keywords: ['b.tech', 'b.e', 'btech', 'be', 'engineering', 'b.arch', 'b.plan'] },
  { name: 'B.Sc / Science', slug: 'bsc', keywords: ['b.sc', 'bsc', 'b.vsc', 'science', 'agriculture'] },
  { name: 'B.Com / Commerce', slug: 'bcom', keywords: ['b.com', 'bcom', 'commerce', 'accountant', 'accounts'] },
  { name: 'Diploma', slug: 'diploma', keywords: ['diploma', 'polytechnic'] },
  { name: 'ITI / NAC', slug: 'iti', keywords: ['iti', 'nac', 'ntc', 'trade certificate', 'apprentice'] },
  { name: 'Post Graduate / Master\'s', slug: 'post-graduation', keywords: ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'm.arch', 'm.plan', 'mvsc', 'm.ch'] },
  { name: 'MBBS / Doctor', slug: 'mbbs-doctor', keywords: ['mbbs', 'md', 'ms', 'dnb', 'dm', 'medical officer', 'senior resident', 'tutor', 'registrar', 'demonstrator'] },
  { name: 'Nursing / GNM / ANM', slug: 'nursing', keywords: ['nursing', 'gnm', 'anm', 'b.sc nursing', 'staff nurse', 'nurse', 'fmphw', 'mmphw'] },
  { name: 'Pharmacist / B.Pharm', slug: 'pharmacist', keywords: ['pharmacy', 'pharmacist', 'b.pharm', 'd.pharm', 'pharm.d', 'drug inspector'] },
  { name: 'Dental / BDS', slug: 'dental-bds', keywords: ['bds', 'dental', 'mds', 'dental surgeon', 'dental hygienist'] },
  { name: 'CA / CMA / CS', slug: 'finance-ca', keywords: ['ca', 'cma', 'icwai', 'chartered accountant', 'icai', 'icmai', 'icsi', 'company secretary'] },
  { name: 'Law / LL.B / Advocates', slug: 'law-llb', keywords: ['llb', 'll.b', 'llm', 'law', 'advocate', 'counsel', 'legal officer', 'legal assistant', 'judicial'] },
  { name: 'B.Ed / Teaching / D.El.Ed', slug: 'teaching-bed', keywords: ['b.ed', 'bed', 'd.el.ed', 'deled', 'tet', 'ctet', 'teacher', 'lecturer', 'assistant professor', 'professor', 'tutor'] },
  { name: 'Ph.D / Doctorate', slug: 'phd', keywords: ['ph.d', 'phd', 'doctorate'] }
];

/**
 * Given a list of active jobs, returns all qualifications present across active jobs with their vacancy counts.
 */
export function getQualificationsWithCounts(jobs: JobEntry[]): QualificationCount[] {
  return QUAL_CATEGORIES
    .map(cat => {
      const count = jobs.filter(job => {
        const text = `${job.q || ''} ${job.t || ''} ${job.desc || ''}`.toLowerCase();
        return cat.keywords.some(kw => containsKeyword(text, kw));
      }).length;

      return {
        name: cat.name,
        slug: cat.slug,
        count
      };
    })
    .filter(q => q.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Given a list of active jobs, returns all states that have at least one job,
 * sorted descending by job count.
 */
export function getStatesWithCounts(jobs: JobEntry[]): Array<{name: string, slug: string, count: number}> {
  const counts: Record<string, number> = {};
  
  jobs.forEach(job => {
    const state = getStateFromJob(job);
    counts[state] = (counts[state] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, slug: toSlug(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Given a list of active jobs, returns all boards that have at least one job,
 * sorted descending by job count.
 */
export function getBoardsWithCounts(jobs: JobEntry[]): Array<{name: string, slug: string, count: number}> {
  const counts: Record<string, number> = {};
  const names: Record<string, string> = {};
  
  jobs.forEach(job => {
    const boardName = getBoardNameFromJob(job);
    const slug = toSlug(boardName);
    counts[slug] = (counts[slug] || 0) + 1;
    if (!names[slug]) {
      names[slug] = boardName;
    }
  });

  return Object.entries(counts)
    .map(([slug, count]) => ({ name: names[slug], slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns all jobs belonging to the given state slug.
 */
export function getJobsForState(jobs: JobEntry[], stateSlug: string): JobEntry[] {
  return jobs.filter(job => toSlug(getStateFromJob(job)) === stateSlug);
}

/**
 * Returns all jobs belonging to the given board slug.
 */
export function getJobsForBoard(jobs: JobEntry[], boardSlug: string): JobEntry[] {
  return jobs.filter(job => toSlug(getBoardNameFromJob(job)) === boardSlug);
}

/**
 * Given a state slug, returns the proper state display name.
 */
export function getStateName(slug: string): string | null {
  if (slug === 'all-india') return 'All India';
  if (slug === 'other') return 'Other';
  
  const allStates = Object.keys(STATE_MAP);
  const found = allStates.find(s => toSlug(s) === slug);
  
  return found || fromSlug(slug);
}

/**
 * Given a board slug, finds and returns the display name from the jobs data.
 */
export function getBoardDisplayName(slug: string, jobs: JobEntry[]): string | null {
  const job = jobs.find(j => toSlug(getBoardNameFromJob(j)) === slug);
  if (job) {
    return getBoardNameFromJob(job);
  }
  return fromSlug(slug);
}
