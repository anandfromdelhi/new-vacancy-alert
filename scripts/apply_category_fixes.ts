import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 1. Update src/utils/categoryUtils.ts ───────────────────────────────────

const categoryUtilsPath = path.join(__dirname, '../src/utils/categoryUtils.ts');
let utilsSrc = fs.readFileSync(categoryUtilsPath, 'utf8');

// Replace getStateFromJob function with refined location-first logic
const oldGetStateFromJob = `export function getStateFromJob(job: JobEntry): string {
  const idStr = job.id || '';
  const text = \`\${job.b} \${job.t} \${idStr}\`.toLowerCase();

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
}`;

const newGetStateFromJob = `export function getStateFromJob(job: JobEntry): string {
  const idStr = job.id || '';
  const text = \`\${job.b} \${job.t} \${idStr}\`.toLowerCase();

  // Explicit Nationwide Combined Exams / All-India Multi-State Drives
  const nationwideExams = [
    'norcet', 'civil services examination', 'combined graduate level', 'ssc cgl', 'ssc chsl',
    'rrb technician', 'ibps clerk', 'ibps po', 'sbi clerk', 'sbi po', 'crp csa'
  ];

  if (nationwideExams.some(kw => text.includes(kw))) {
    return 'All India';
  }

  // Check if job matches a specific State / UT location in STATE_MAP
  for (const [state, keywords] of Object.entries(STATE_MAP)) {
    for (const kw of keywords) {
      if (containsKeyword(text, kw)) {
        return state;
      }
    }
  }

  // Fallback to All India
  return 'All India';
}`;

utilsSrc = utilsSrc.replace(oldGetStateFromJob, newGetStateFromJob);

// Add board overrides in getBoardNameFromJob
const oldGetBoardName = `export function getBoardNameFromJob(job: JobEntry): string {
  const b = job.b;

  // Manual overrides for long, complex names without clear acronyms
  if (b.includes('District Basic Education Officer, Bulandshahr')) return 'DBEO Bulandshahr';`;

const newGetBoardName = `export function getBoardNameFromJob(job: JobEntry): string {
  const b = job.b;

  // Manual overrides for long, complex names without clear acronyms
  if (b.includes('NIScPR')) return 'CSIR-NIScPR';
  if (b.includes('Milk Producers') || b.includes('MILKFED')) return 'Verka MILKFED Punjab';
  if (b.includes('District Basic Education Officer, Bulandshahr')) return 'DBEO Bulandshahr';`;

utilsSrc = utilsSrc.replace(oldGetBoardName, newGetBoardName);

// Update qualification category keywords to include llb, law, m.phil, pourakarmika, safai, soldier
utilsSrc = utilsSrc.replace(
  `{ name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate'] },`,
  `{ name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate', 'pourakarmika', 'safai', 'soldier'] },`
);

utilsSrc = utilsSrc.replace(
  `{ name: 'Any Graduate', slug: 'ba', keywords: ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor'] },`,
  `{ name: 'Any Graduate', slug: 'ba', keywords: ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor', 'llb', 'law'] },`
);

utilsSrc = utilsSrc.replace(
  `{ name: 'Post Graduate / Master\'s', slug: 'post-graduation', keywords: ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'llm', 'm.arch', 'm.plan', 'mvsc', 'm.ch'] },`,
  `{ name: 'Post Graduate / Master\'s', slug: 'post-graduation', keywords: ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'llm', 'm.arch', 'm.plan', 'mvsc', 'm.ch', 'm.phil', 'llb', 'law'] },`
);

fs.writeFileSync(categoryUtilsPath, utilsSrc, 'utf8');
console.log('✅ categoryUtils.ts updated with refined location-first state logic & qualification matchers.');

// ─── 2. Update jobsData.ts for the 6 unmatched qualification entries ────────

const jobsDataPath = path.join(__dirname, '../src/data/jobsData.ts');
let jobsDataSrc = fs.readFileSync(jobsDataPath, 'utf8');

const qUpdates: Record<string, string> = {
  'bengaluru-rural-pourakarmika-special-recruitment-2026': '8th / 10th Pass / Literate Pourakarmikas working in ULBs of Bengaluru Rural for >= 2 years',
  'rajasthan-safai-karmchari-recruitment-2026': '10th Pass / Literate Resident of Rajasthan + Min 01 Year Cleaning Experience in ULB/Govt',
  'edcil-aai-consultants-recruitment-2026': 'Graduate / Post Graduate / M.Phil (Psychology) / LLB / Mass Comm / Graphic Design / Video Editing',
  'cr-presenting-officer-recruitment-2026': 'Graduate / Degree (Working Railway employee in Level-7 or Level-8 with 5 Years Service)',
  'indian-army-officer-entries-2026': 'Law Graduate (LLB) with minimum 55% aggregate marks from recognized University',
  'territorial-army-130-inf-bn-2026': 'Matriculation (10th Pass) for Soldier General Duty / Tradesman',
};

for (const [id, newQ] of Object.entries(qUpdates)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"q":\\s*")[^"]*(")`);
  jobsDataSrc = jobsDataSrc.replace(regex, `$1${newQ}$2`);
}

fs.writeFileSync(jobsDataPath, jobsDataSrc, 'utf8');
console.log('✅ jobsData.ts updated for 6 qualification entries.');
