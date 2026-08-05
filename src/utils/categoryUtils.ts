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
  'upsc', 'ssc', 'rrb', 'railway', 'isro', 'drdo', 'indian army', 'indian navy', 'indian air force', 'iaf',
  'ongc', 'iocl', 'bpcl', 'hpcl', 'esic', 'ibps', 'hal', 'bel', 'beml', 'ntpc',
  'sjvn', 'nlcil', 'nalco', 'stpi', 'railtel', 'rcil', 'krcl', 'nrsc', 'sinp', 'mecl',
  'spmcil', 'cert-in', 'nhsrcl', 'nhidcl', 'ihmcl', 'fagmil', 'pdil', 'ngel', 'rcf ltd', 'rites', 'irel',
  'wcl', 'ncl', 'nicl', 'sidbi', 'tmb', 'nabard', 'icai', 'icsi', 'icar', 'aai', 'prl', 'edcil',
  'avnl', 'niper', 'ofdr', 'munitions india', 'ccras', 'ccrum', 'rwf', 'iifcl',
  'india post', 'department of posts', 'aweil', 'csir', 'jipmer', 'sspl', 'ncra-tifr',
  'institute of banking personnel', 'union bank', 'punjab national bank', 'pnb',
  'sbi', 'reserve bank', 'rbi', 'national insurance company', 'tamilnad mercantile bank'
];

// State & UT mapping keywords
const STATE_MAP: Record<string, string[]> = {
  'Uttar Pradesh': ['uttar pradesh', 'uppsc', 'aligarh muslim university', 'amu', 'azamgarh', 'bulandshahr', 'banda', 'farrukhabad', 'sant kabir nagar', 'hapur', 'raebareli'],
  'Odisha': ['odisha', 'opsc', 'bhadrak'],
  'Dadra & Nagar Haveli and Daman & Diu': ['dadra and nagar haveli', 'dadra & nagar haveli', 'dadra', 'daman', 'dnh', 'dnhdd', 'diu'],
  'Haryana': ['haryana', 'wcd haryana', 'hartron', 'kurukshetra'],
  'Delhi': ['delhi', 'igdtuw', 'sddmasc', 'rtrmh', 'dhas', 'pmmh', 'university of delhi', 'nct of delhi'],
  'Himachal Pradesh': ['himachal pradesh', 'hpjsv', 'shimla', 'hamirpur'],
  'Jammu & Kashmir': ['jammu and kashmir', 'jammu & kashmir', 'jammu', 'kashmir', 'jkpsc', 'jkssb', 'j&k'],
  'Maharashtra': ['maharashtra', 'mumbai', 'pune', 'thane municipal', 'msrlm', 'solapur', 'sindhudurg'],
  'Goa': ['panaji', 'echs panaji', 'goa'],
  'Tamil Nadu': ['tamil nadu', 'cutn', 'thiruvarur', 'tnstc', 'tnsrlm'],
  'Karnataka': ['karnataka', 'bengaluru', 'dharwad', 'davanagere', 'vijayapura', 'chamarajanagar', 'ramanagara', 'yadgir', 'bidar', 'kea', 'sjicr', 'dudc', 'cims'],
  'Punjab': ['punjab', 'ludhiana', 'mohali', 'sas nagar', 'sikhiya bharti'],
  'Assam': ['assam', 'apsc', 'amtron', 'guwahati', 'dme assam'],
  'Gujarat': ['gujarat', 'gsssb'],
  'Telangana': ['telangana', 'hyderabad', 'karimnagar', 'tslprb', 'medchal-malkajgiri', 'medchal'],
  'Manipur': ['manipur', 'mssc'],
  'Rajasthan': ['rajasthan', 'rvunl', 'rvun', 'rvpn', 'jvvn', 'avvn', 'jdvvn', 'dlb rajasthan'],
  'West Bengal': ['west bengal', 'clw', 'chittaranjan', 'contai', 'purba medinipur'],
  'Andhra Pradesh': ['andhra pradesh', 'kadapa'],
  'Chhattisgarh': ['chhattisgarh', 'baloda bazar', 'janjgir', 'cgssb'],
  'Bihar': ['bihar', 'jamui', 'dcpu'],
  'Madhya Pradesh': ['madhya pradesh', 'mpypil'],
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
 * 1. Checks candidate eligibility scope / domicile / state recruitment board.
 * 2. Checks if job is an All India open recruitment (Central Govt, Central PSUs, National Bodies open to all Indian citizens).
 * 3. Fallback: Checks board location / state keywords.
 */
export function getStateFromJob(job: JobEntry): string {
  const idStr = job.id || '';
  const text = `${job.b} ${job.t} ${idStr}`.toLowerCase();

  // Indicators that a job is specifically a state/UT recruitment or restricted by state domicile
  const stateGovTriggers = [
    'public service commission', 'services selection board', 'state level police',
    'samagra shiksha', 'jal shakti', 'district health', 'district court', 'district judge',
    'municipal corporation', 'district urban development', 'anganwadi', 'zila panchayat',
    'sikhiya bharti', 'state power sector', 'state transport', 'sub-divisional officer',
    'state electronics development', 'deputation basis in women and child'
  ];

  let isStateSpecific = stateGovTriggers.some(trigger => text.includes(trigger));

  if (text.includes('western region') && (text.includes('mumbai') || text.includes('daman') || text.includes('diu') || text.includes('maharashtra'))) {
    isStateSpecific = true;
  }

  // If state-specific, match to state/UT first
  if (isStateSpecific) {
    for (const [state, keywords] of Object.entries(STATE_MAP)) {
      for (const kw of keywords) {
        if (containsKeyword(text, kw)) {
          return state;
        }
      }
    }
  }

  // Check All India open recruitments
  for (const kw of ALL_INDIA_KEYWORDS) {
    if (containsKeyword(text, kw)) {
      return 'All India';
    }
  }

  // Fallback: Check all state location patterns
  for (const [state, keywords] of Object.entries(STATE_MAP)) {
    for (const kw of keywords) {
      if (containsKeyword(text, kw)) {
        return state;
      }
    }
  }

  return 'All India';
}

/**
 * Extracts the primary board/organization short name from the `b` field.
 */
export function getBoardNameFromJob(job: JobEntry): string {
  const b = job.b;

  // Manual overrides for long, complex names without clear acronyms
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
    .sort((a, b) => b.count - a.count);
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
    .sort((a, b) => b.count - a.count);
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
