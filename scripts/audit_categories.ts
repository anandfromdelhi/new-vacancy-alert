import { JOBS_DATA, JobEntry } from '../src/data/jobsData.js';
import { getStateFromJob, getBoardNameFromJob, getQualificationsWithCounts, toSlug, STATE_MAP } from '../src/utils/categoryUtils.js';

console.log('=== AUDITING ALL 211 JOBS FOR CATEGORIZATION DISCREPANCIES ===\n');

interface StateDiscrepancy {
  id: string;
  board: string;
  title: string;
  detectedState: string;
  expectedStateHint?: string;
  reason: string;
}

interface QualificationDiscrepancy {
  id: string;
  qText: string;
  title: string;
  matchedCategories: string[];
  reason: string;
}

interface BoardDiscrepancy {
  id: string;
  rawBoard: string;
  extractedBoard: string;
  slug: string;
  reason: string;
}

const stateDiscrepancies: StateDiscrepancy[] = [];
const qualDiscrepancies: QualificationDiscrepancy[] = [];
const boardDiscrepancies: BoardDiscrepancy[] = [];

// 17 Defined Qualification Categories & Keywords
const QUAL_CATEGORIES = [
  { name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate'] },
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

function containsKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefix = /^[\w]/.test(keyword) ? '\\b' : '';
  const suffix = /[\w]$/.test(keyword) ? '\\b' : '';
  return new RegExp(`${prefix}${escaped}${suffix}`, 'i').test(text);
}

// Perform audit on all 211 jobs
for (const job of JOBS_DATA) {
  const text = `${job.b} ${job.t} ${job.id}`.toLowerCase();
  const detectedState = getStateFromJob(job);
  const extractedBoard = getBoardNameFromJob(job);

  // ─── A. STATE / ALL-INDIA CHECKS ──────────────────────────────────────────
  // Check if job mentions a specific state in title/board but was assigned 'All India' or a different state
  let expectedState: string | null = null;

  if (text.includes('madhya pradesh') || text.includes(' mp ') || text.includes('ujjain') || text.includes('bhopal') || text.includes('mpesb') || text.includes('dlsa ujjain')) {
    expectedState = 'Madhya Pradesh';
  } else if (text.includes('telangana') || text.includes('hyderabad') || text.includes('wanaparthy') || text.includes('gmc wanaparthy') || text.includes('tslprb')) {
    expectedState = 'Telangana';
  } else if (text.includes('himachal') || text.includes('hppsc') || text.includes('hp police') || text.includes('shimla')) {
    expectedState = 'Himachal Pradesh';
  } else if (text.includes('jharkhand') || text.includes('jssc') || text.includes('ranchi')) {
    expectedState = 'Jharkhand';
  } else if (text.includes('uttar pradesh') || text.includes('uppsc') || text.includes('bulandshahr') || text.includes('banda') || text.includes('farrukhabad')) {
    expectedState = 'Uttar Pradesh';
  } else if (text.includes('odisha') || text.includes('opsc') || text.includes('bhadrak')) {
    expectedState = 'Odisha';
  } else if (text.includes('karnataka') || text.includes('bengaluru') || text.includes('kea') || text.includes('ramanagara')) {
    expectedState = 'Karnataka';
  } else if (text.includes('punjab') || text.includes('ludhiana') || text.includes('mohali')) {
    expectedState = 'Punjab';
  } else if (text.includes('maharashtra') || text.includes('mumbai') || text.includes('pune') || text.includes('solapur')) {
    expectedState = 'Maharashtra';
  } else if (text.includes('chhattisgarh') || text.includes('raipur') || text.includes('cgssb')) {
    expectedState = 'Chhattisgarh';
  } else if (text.includes('rajasthan') || text.includes('jaipur')) {
    expectedState = 'Rajasthan';
  } else if (text.includes('haryana') || text.includes('hartron')) {
    expectedState = 'Haryana';
  } else if (text.includes('west bengal') || text.includes('kolkata')) {
    expectedState = 'West Bengal';
  } else if (text.includes('delhi') || text.includes('dsssbb')) {
    expectedState = 'Delhi';
  } else if (text.includes('gujarat')) {
    expectedState = 'Gujarat';
  } else if (text.includes('bihar')) {
    expectedState = 'Bihar';
  } else if (text.includes('assam') || text.includes('guwahati')) {
    expectedState = 'Assam';
  }

  // If it's a central open recruitment (UPSC, SSC, RRB, SBI, IBPS, Army, Navy, Air Force, DRDO, ISRO, IOCL All India), expectedState should be 'All India'
  const isCentralOpenBody = [
    'upsc', 'ssc', 'rrb', 'isro', 'drdo', 'indian army', 'indian navy', 'indian air force', 'ibps', 'sbi'
  ].some(kw => text.includes(kw));

  if (isCentralOpenBody && !text.includes('hppsc') && !text.includes('jssc') && !text.includes('uppsc') && !text.includes('opsc')) {
    expectedState = 'All India';
  }

  if (expectedState && detectedState !== expectedState) {
    stateDiscrepancies.push({
      id: job.id,
      board: job.b,
      title: job.t,
      detectedState,
      expectedStateHint: expectedState,
      reason: `Classified as "${detectedState}" but expected "${expectedState}" based on board/title/location keywords.`,
    });
  }

  // ─── B. QUALIFICATION CHECKS ──────────────────────────────────────────────
  const qualText = `${job.q || ''} ${job.t || ''} ${job.desc || ''}`.toLowerCase();
  const matchedQuals = QUAL_CATEGORIES.filter(cat =>
    cat.keywords.some(kw => containsKeyword(qualText, kw))
  ).map(c => c.name);

  if (matchedQuals.length === 0) {
    qualDiscrepancies.push({
      id: job.id,
      qText: job.q || '(empty)',
      title: job.t,
      matchedCategories: [],
      reason: `UNMATCHED: Does not match ANY of the 15 qualification filter categories! Will be hidden from all /jobs-for/* pages.`,
    });
  }

  // ─── C. BOARD NAME CHECKS ─────────────────────────────────────────────────
  const boardSlug = toSlug(extractedBoard);
  if (!extractedBoard || extractedBoard.length < 2 || extractedBoard.length > 50 || boardSlug.length < 2) {
    boardDiscrepancies.push({
      id: job.id,
      rawBoard: job.b,
      extractedBoard,
      slug: boardSlug,
      reason: `Extracted board name "${extractedBoard}" is too long, too short, or malformed.`,
    });
  }
}

// ─── OUTPUT SUMMARY ─────────────────────────────────────────────────────────

console.log(`📊 SUMMARY OF AUDIT FINDINGS FOR 211 JOBS:`);
console.log(`--------------------------------------------------`);
console.log(`1. State / Location Discrepancies: ${stateDiscrepancies.length}`);
console.log(`2. Qualification Unmatched Jobs: ${qualDiscrepancies.length}`);
console.log(`3. Board Name Extraction Issues: ${boardDiscrepancies.length}`);
console.log(`--------------------------------------------------\n`);

if (stateDiscrepancies.length > 0) {
  console.log(`\n🔴 STATE / LOCATION DISCREPANCIES (${stateDiscrepancies.length}):`);
  stateDiscrepancies.forEach((d, idx) => {
    console.log(`\n${idx + 1}. ID: ${d.id}`);
    console.log(`   Board: ${d.board}`);
    console.log(`   Detected State: "${d.detectedState}" | Expected: "${d.expectedStateHint}"`);
    console.log(`   Title: ${d.title.substring(0, 90)}...`);
  });
}

if (qualDiscrepancies.length > 0) {
  console.log(`\n🔴 QUALIFICATION UNMATCHED JOBS (${qualDiscrepancies.length}):`);
  qualDiscrepancies.forEach((d, idx) => {
    console.log(`\n${idx + 1}. ID: ${d.id}`);
    console.log(`   q field: "${d.qText}"`);
    console.log(`   Title: ${d.title.substring(0, 90)}...`);
  });
}

if (boardDiscrepancies.length > 0) {
  console.log(`\n🔴 BOARD NAME ISSUES (${boardDiscrepancies.length}):`);
  boardDiscrepancies.forEach((d, idx) => {
    console.log(`\n${idx + 1}. ID: ${d.id}`);
    console.log(`   Raw Board: "${d.rawBoard}"`);
    console.log(`   Extracted Board: "${d.extractedBoard}" (Slug: ${d.slug})`);
  });
}
