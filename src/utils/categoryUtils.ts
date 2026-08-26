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
  'Andhra Pradesh': ['andhra pradesh', 'apcrda', 'visakhapatnam', 'chintapalle', 'tirupati', 'vijayawada', 'guntur', 'kurnool', 'anantapur', 'sri sathya sai', 'kadapa', 'rars chintapalle', 'sbc visakhapatnam'],
  'Arunachal Pradesh': ['arunachal pradesh', 'arunachal', 'itanagar', 'changlang', 'pallong', 'emrs pallong'],
  'Assam': ['assam', 'apsc', 'amtron', 'guwahati', 'dme assam', 'tezpur', 'fremaa', 'tezpur university', 'iit guwahati'],
  'Bihar': ['bihar', 'bpsc', 'patna', 'bhagalpur', 'gaya', 'muzaffarpur', 'nalanda', 'bihta', 'bsfc', 'cusb', 'iiit bhagalpur', 'iit patna', 'jamui', 'dcpu'],
  'Chandigarh': ['chandigarh', 'pgimer', 'panjab university'],
  'Chhattisgarh': ['chhattisgarh', 'cgpsc', 'cgvyapam', 'raipur', 'bhilai', 'bilaspur', 'balodabazar', 'baloda bazar', 'bastar', 'surguja', 'ambikapur', 'durg', 'iit bhilai', 'cmho balodabazar', 'cgssb', 'janjgir'],
  'Dadra & Nagar Haveli and Daman & Diu': ['dadra and nagar haveli', 'dadra & nagar haveli', 'dadra', 'daman', 'dnh', 'dnhdd', 'diu'],
  'Delhi': ['delhi', 'igdtuw', 'sddmasc', 'rtrmh', 'dhas', 'pmmh', 'university of delhi', 'nct of delhi', 'niscpr', 'sspl', 'dpcc', 'delhi university', 'cerc', 'wdra', 'nhai', 'supreme court', 'aiims delhi', 'jnu', 'aud'],
  'Goa': ['panaji', 'echs panaji', 'goa'],
  'Gujarat': ['gujarat', 'gpsc', 'gsssb', 'ahmedabad', 'gandhinagar', 'surat', 'vadodara', 'bhavnagar', 'rajkot', 'svnit', 'iiit vadodara', 'bhavnagar municipal'],
  'Haryana': ['haryana', 'hpsc', 'hssc', 'wcd haryana', 'hartron', 'kurukshetra', 'panchkula', 'gurugram', 'gurgaon', 'jhajjar', 'nbrc', 'bric-nbrc', 'aiims jhajjar'],
  'Himachal Pradesh': ['himachal pradesh', 'hpjsv', 'shimla', 'hamirpur', 'hppsc', 'hprca'],
  'Jammu & Kashmir': ['jammu and kashmir', 'jammu & kashmir', 'jammu', 'kashmir', 'jkpsc', 'jkssb', 'j&k'],
  'Jharkhand': ['jharkhand', 'jpsc', 'jssc', 'ranchi', 'dhanbad', 'jamshedpur', 'bokaro', 'hazaribagh', 'chatra', 'dumka', 'iit ism', 'dmft chatra'],
  'Karnataka': ['karnataka', 'kpsc', 'kea', 'bengaluru', 'bangalore', 'mysuru', 'mysore', 'mangalore', 'hubli', 'belagavi', 'chikkaballapur', 'dharwad', 'davanagere', 'vijayapura', 'chamarajanagar', 'ramanagara', 'yadgir', 'bidar', 'sjicr', 'dudc', 'cims', 'ursc', 'cftri', 'csir-cftri'],
  'Kerala': ['kerala', 'kpsc kerala', 'thiruvananthapuram', 'kochi', 'calicut', 'kase'],
  'Madhya Pradesh': ['madhya pradesh', 'mppsc', 'bhopal', 'indore', 'gwalior', 'jabalpur', 'ujjain', 'katni', 'igntu', 'amarkantak', 'mpypil', 'mpesb', 'ordnance factory katni'],
  'Maharashtra': ['maharashtra', 'mpsc', 'mumbai', 'pune', 'nagpur', 'aurangabad', 'chhatrapati sambhajinagar', 'nashik', 'navi mumbai', 'thane', 'solapur', 'actrec', 'neeri', 'csir-neeri', 'circot', 'icar-circot', 'rcfl', 'msrlm', 'sindhudurg', 'dehu road', 'thane municipal'],
  'Manipur': ['manipur', 'mssc', 'imphal', 'tamenglong'],
  'Meghalaya': ['meghalaya', 'mpsc', 'shillong', 'neigrihms', 'nehu', 'tura'],
  'Mizoram': ['mizoram public service', 'mizoram', 'aizawl'],
  'Odisha': ['odisha', 'opsc', 'ossc', 'bhubaneswar', 'cuttack', 'rourkela', 'mayurbhanj', 'balangir', 'garudabasa', 'bhalubasa', 'shirsa', 'morada', 'bhadrak', 'oav', 'adarsha vidyalaya', 'gopabandhu'],
  'Puducherry': ['puducherry', 'pondicherry', 'jipmer', 'karaikal'],
  'Punjab': ['punjab', 'ppsc', 'psssb', 'chandigarh', 'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda', 'faridkot', 'ggsmch', 'mohali', 'sas nagar', 'sikhiya bharti', 'verka', 'milkfed'],
  'Rajasthan': ['rajasthan', 'rpsc', 'rsmssb', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'bikaner', 'ajmer', 'rvunl', 'rvun', 'rvpn', 'jvvn', 'avvn', 'jdvvn', 'dlb rajasthan'],
  'Tamil Nadu': ['tamil nadu', 'chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'trichy', 'erode', 'pudukkottai', 'cuddalore', 'salem', 'vellore', 'thanjavur', 'tnstc', 'tnsrlm', 'tnuavc', 'cutn', 'thiruvarur', 'tmb'],
  'Telangana': ['telangana', 'tspsc', 'hyderabad', 'karimnagar', 'tslprb', 'medchal-malkajgiri', 'medchal', 'wanaparthy', 'drdl', 'ngri'],
  'Tripura': ['tripura', 'tpsc', 'agartala', 'iiit agartala'],
  'Uttar Pradesh': ['uttar pradesh', 'uppsc', 'upsssc', 'lucknow', 'kanpur', 'varanasi', 'prayagraj', 'allahabad', 'agra', 'noida', 'greater noida', 'ghaziabad', 'meerut', 'aligarh', 'azamgarh', 'jhansi', 'bareilly', 'bhu', 'ksssci', 'iit kanpur', 'atal residential school', 'aligarh muslim university', 'amu', 'bulandshahr', 'banda', 'farrukhabad', 'sant kabir nagar', 'hapur', 'raebareli'],
  'Uttarakhand': ['uttarakhand', 'ukpsc', 'roorkee', 'almora', 'dehradun', 'haridwar', 'nainital', 'rishikesh', 'garhwal', 'iit roorkee'],
  'West Bengal': ['west bengal', 'wbpsc', 'wbhrb', 'kolkata', 'howrah', 'kalyani', 'siliguri', 'durgapur', 'asansol', 'bitm', 'aiims kalyani', 'clw', 'chittaranjan', 'contai', 'purba medinipur', 'nscbi', 'sinp']
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
  { name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'sslc', 'literate', 'pourakarmika', 'safai', 'soldier', 'cook', 'attendant', 'helper', 'warden', 'swayampaki', 'chowkidar', 'anganwadi', 'support staff'] },
  { name: '12th Pass', slug: '12th-pass', keywords: ['12th', 'intermediate', 'higher secondary', '10+2', 'puc', 'hsc', 'h.s.c', 'plus two', 'plus 2', 'inter', 'senior secondary'] },
  { name: 'Any Graduate', slug: 'ba', keywords: ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor', 'b.lib', 'blib'] },
  { name: 'B.Tech / B.E', slug: 'btech', keywords: ['b.tech', 'b.e', 'btech', 'be', 'engineering', 'b.arch', 'b.plan', 'engineer', 'section engineer', 'executive engineer', 'assistant engineer', 'project engineer'] },
  { name: 'B.Sc / Science', slug: 'bsc', keywords: ['b.sc', 'bsc', 'b.vsc', 'bvsc', 'science', 'agriculture', 'botany', 'zoology', 'chemistry', 'physics', 'biochemistry', 'biotechnology', 'microbiology', 'horticulture', 'forestry', 'fisheries', 'plant physiology', 'agronomy'] },
  { name: 'B.Com / Commerce', slug: 'bcom', keywords: ['b.com', 'bcom', 'commerce', 'accountant', 'accounts', 'bba', 'bms'] },
  { name: 'Diploma', slug: 'diploma', keywords: ['diploma', 'polytechnic', 'd.pharm', 'dmlt', 'gnm', 'd.el.ed'] },
  { name: 'ITI / NAC', slug: 'iti', keywords: ['iti', 'nac', 'ntc', 'trade certificate', 'apprentice', 'fitter', 'electrician', 'welder', 'turner', 'machinist', 'diesel mechanic', 'draughtsman', 'wireman'] },
  { name: 'Post Graduate / Master\'s', slug: 'post-graduation', keywords: ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'm.arch', 'm.plan', 'mvsc', 'm.v.sc', 'm.ch', 'm.des', 'mdes', 'm.lib', 'mlib', 'post graduate', 'm.ed', 'med'] },
  { name: 'MBBS / Doctor', slug: 'mbbs-doctor', keywords: ['mbbs', 'md', 'ms', 'dnb', 'dm', 'medical officer', 'senior resident', 'junior resident', 'resident doctor', 'tutor', 'registrar', 'demonstrator', 'bams', 'bhms', 'bums', 'ayush', 'ayurveda', 'homeopathy', 'amc', 'specialist doctor'] },
  { name: 'Nursing / GNM / ANM', slug: 'nursing', keywords: ['nursing', 'gnm', 'anm', 'b.sc nursing', 'm.sc nursing', 'staff nurse', 'nurse', 'fmphw', 'mmphw', 'nursing officer', 'community health officer', 'cho'] },
  { name: 'Pharmacist / B.Pharm', slug: 'pharmacist', keywords: ['pharmacy', 'pharmacist', 'b.pharm', 'd.pharm', 'pharm.d', 'drug inspector', 'clinical pharmacist'] },
  { name: 'Dental / BDS', slug: 'dental-bds', keywords: ['bds', 'dental', 'mds', 'dental surgeon', 'dental hygienist', 'dentist'] },
  { name: 'CA / CMA / CS', slug: 'finance-ca', keywords: ['ca', 'cma', 'icwai', 'chartered accountant', 'icai', 'icmai', 'icsi', 'company secretary', 'cost accountant'] },
  { name: 'Law / LL.B / Advocates', slug: 'law-llb', keywords: ['llb', 'll.b', 'llm', 'law', 'advocate', 'counsel', 'legal officer', 'legal assistant', 'judicial', 'civil judge', 'public prosecutor', 'assistant manager-legal'] },
  { name: 'B.Ed / Teaching / Faculty', slug: 'teaching-bed', keywords: ['b.ed', 'bed', 'd.el.ed', 'deled', 'tet', 'ctet', 'teacher', 'lecturer', 'assistant professor', 'associate professor', 'professor', 'tutor', 'teaching associate', 'teaching assistant', 'guest faculty', 'pgt', 'tgt', 'prt', 'faculty', 'mentor'] },
  { name: 'Ph.D / Doctorate', slug: 'phd', keywords: ['ph.d', 'phd', 'doctorate', 'post doctoral', 'pdf', 'research associate', 'jrf', 'srf', 'project fellow', 'fellowship'] },
  { name: 'Management / MBA / PGDM', slug: 'mba', keywords: ['mba', 'pgdm', 'management trainee', 'business administration', 'manager', 'executive', 'marketing', 'human resource', 'finance officer', 'project manager'] },
  { name: 'Driver / Heavy Vehicle', slug: 'driver', keywords: ['driver', 'driving license', 'lmv', 'hmv', 'heavy motor vehicle', 'light motor vehicle', 'fire engine driver', 'cmtd'] },
  { name: 'Defence & Security', slug: 'defence-police', keywords: ['security guard', 'havildar', 'constable', 'head constable', 'sub inspector', 'inspector', 'police', 'fireman', 'security personnel', 'defence'] }
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
