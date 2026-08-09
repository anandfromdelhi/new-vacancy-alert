import { JOBS_DATA, JobEntry } from '../src/data/jobsData.js';
import jobDetailsJson from '../src/data/jobDetails.json' assert { type: 'json' };
import { getStateFromJob, getBoardNameFromJob, getQualificationsWithCounts, toSlug, STATE_MAP } from '../src/utils/categoryUtils.js';

console.log('=======================================================');
console.log('   SITE CATEGORIZATION & HOME PAGE CARD AUDITOR REPORT  ');
console.log('=======================================================\n');

const jobDetailsData = jobDetailsJson as Record<string, any>;
const totalJobs = JOBS_DATA.length;
console.log(`📊 Total Job Entries in JOBS_DATA: ${totalJobs}`);
console.log(`📊 Total Detailed Entries in jobDetails.json: ${Object.keys(jobDetailsData).length}\n`);

let orphanJobs: string[] = [];
let missingHomeProps: { id: string; missing: string[] }[] = [];
let stateUnassigned: string[] = [];
let boardUnassigned: string[] = [];
let qualUnassigned: string[] = [];

// 15 Defined Qualification Categories & Keywords
const QUAL_CATEGORIES = [
  { name: '10th Pass', slug: '10th-pass', keywords: ['10th', 'matriculation', 'matric', 'secondary', '8th', 'literate'] },
  { name: '12th Pass', slug: '12th-pass', keywords: ['12th', 'intermediate', 'higher secondary', '10+2', 'puc'] },
  { name: 'Any Graduate', slug: 'ba', keywords: ['graduation', 'graduate', 'degree', 'b.a', 'ba', 'any degree', 'bachelor'] },
  { name: 'B.Tech / B.E', slug: 'btech', keywords: ['b.tech', 'b.e', 'btech', 'be', 'engineering', 'b.arch', 'b.plan'] },
  { name: 'B.Sc / Science', slug: 'bsc', keywords: ['b.sc', 'bsc', 'b.vsc', 'science', 'agriculture'] },
  { name: 'B.Com / Commerce', slug: 'bcom', keywords: ['b.com', 'bcom', 'commerce', 'accountant', 'accounts'] },
  { name: 'Diploma', slug: 'diploma', keywords: ['diploma', 'polytechnic'] },
  { name: 'ITI / NAC', slug: 'iti', keywords: ['iti', 'nac', 'ntc', 'trade certificate', 'apprentice'] },
  { name: 'Post Graduate / Master\'s', slug: 'post-graduation', keywords: ['master', 'post graduation', 'pg', 'm.sc', 'm.tech', 'm.com', 'mca', 'mba', 'pgdm', 'llm', 'm.arch', 'm.plan', 'mvsc', 'm.ch'] },
  { name: 'MBBS / Doctor', slug: 'mbbs-doctor', keywords: ['mbbs', 'md', 'ms', 'dnb', 'dm', 'medical officer', 'senior resident', 'tutor', 'registrar', 'demonstrator'] },
  { name: 'Nursing / GNM / ANM', slug: 'nursing', keywords: ['nursing', 'gnm', 'anm', 'b.sc nursing', 'staff nurse', 'nurse', 'fmphw', 'mmphw'] },
  { name: 'Pharmacist / B.Pharm', slug: 'pharmacist', keywords: ['pharmacy', 'pharmacist', 'b.pharm', 'd.pharm', 'pharm.d', 'drug inspector'] },
  { name: 'Dental / BDS', slug: 'dental-bds', keywords: ['bds', 'dental', 'mds', 'dental surgeon', 'dental hygienist'] },
  { name: 'CA / CMA / CS', slug: 'finance-ca', keywords: ['ca', 'cma', 'icwai', 'chartered accountant', 'icai', 'icmai', 'icsi', 'company secretary'] },
  { name: 'Ph.D / Doctorate', slug: 'phd', keywords: ['ph.d', 'phd', 'doctorate'] }
];

function containsKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefix = /^[\w]/.test(keyword) ? '\\b' : '';
  const suffix = /[\w]$/.test(keyword) ? '\\b' : '';
  return new RegExp(`${prefix}${escaped}${suffix}`, 'i').test(text);
}

const stateCounts: Record<string, number> = {};
const boardCounts: Record<string, number> = {};
const qualCounts: Record<string, number> = {};

for (const job of JOBS_DATA) {
  const jId = job.id || '';
  
  // A. Check Orphan status (JOBS_DATA vs jobDetails.json)
  if (!jobDetailsData[jId]) {
    orphanJobs.push(jId);
  }

  // B. Check Home Page required card properties
  const missing: string[] = [];
  if (!job.id) missing.push('id');
  if (!job.b) missing.push('board (b)');
  if (!job.t) missing.push('title (t)');
  if (!job.d) missing.push('post_date (d)');
  if (!job.l) missing.push('last_date (l)');
  if (!job.q) missing.push('qualification (q)');
  if (!job.a) missing.push('advt_no (a)');
  if (missing.length > 0) {
    missingHomeProps.push({ id: jId, missing });
  }

  // C. Check State-wise categorization
  const state = getStateFromJob(job);
  if (!state || state === 'Unknown') {
    stateUnassigned.push(jId);
  } else {
    stateCounts[state] = (stateCounts[state] || 0) + 1;
  }

  // D. Check Board-wise categorization
  const board = getBoardNameFromJob(job);
  if (!board) {
    boardUnassigned.push(jId);
  } else {
    boardCounts[board] = (boardCounts[board] || 0) + 1;
  }

  // E. Check Qualification-wise categorization
  const fullText = `${job.q} ${job.t} ${job.b}`.toLowerCase();
  let matchedQuals = 0;
  for (const cat of QUAL_CATEGORIES) {
    if (cat.keywords.some(kw => containsKeyword(fullText, kw))) {
      matchedQuals++;
      qualCounts[cat.name] = (qualCounts[cat.name] || 0) + 1;
    }
  }
  if (matchedQuals === 0) {
    qualUnassigned.push(jId);
  }
}

// ─── AUDIT REPORT SUMMARY ──────────────────────────────────────────────────

console.log('───────────────────────────────────────────────────────');
console.log('1. HOME PAGE CARD INTEGRITY & ORPHAN CHECK');
console.log('───────────────────────────────────────────────────────');
if (orphanJobs.length === 0) {
  console.log('✅ ALL JOBS MATCH: 100% of jobs in JOBS_DATA have detailed pages in jobDetails.json!');
} else {
  console.log(`⚠️ FOUND ${orphanJobs.length} ORPHAN JOBS (Missing in jobDetails.json):`);
  orphanJobs.forEach(id => console.log(`   - ${id}`));
}

if (missingHomeProps.length === 0) {
  console.log('✅ HOME PAGE CARDS COMPLETE: 100% of jobs have all required card properties (id, board, title, date, last date, qual, advt no)!');
} else {
  console.log(`⚠️ FOUND ${missingHomeProps.length} JOBS WITH MISSING HOME CARD PROPS:`);
  missingHomeProps.forEach(item => console.log(`   - ${item.id}: Missing [${item.missing.join(', ')}]`));
}

console.log('\n───────────────────────────────────────────────────────');
console.log('2. STATE-WISE CATEGORIZATION AUDIT');
console.log('───────────────────────────────────────────────────────');
if (stateUnassigned.length === 0) {
  console.log(`✅ 100% STATE COVERAGE: All ${totalJobs} jobs are classified under an Indian State/UT or All India!`);
  console.log(`   - Total States/UTs Covered: ${Object.keys(stateCounts).length} States & All India`);
} else {
  console.log(`⚠️ FOUND ${stateUnassigned.length} JOBS UNASSIGNED TO ANY STATE:`);
  stateUnassigned.forEach(id => console.log(`   - ${id}`));
}

console.log('\n───────────────────────────────────────────────────────');
console.log('3. BOARD-WISE CATEGORIZATION AUDIT');
console.log('───────────────────────────────────────────────────────');
if (boardUnassigned.length === 0) {
  console.log(`✅ 100% BOARD COVERAGE: All ${totalJobs} jobs are classified under a Board/Organization!`);
  console.log(`   - Total Recruiting Boards/Bodies: ${Object.keys(boardCounts).length}`);
} else {
  console.log(`⚠️ FOUND ${boardUnassigned.length} JOBS UNASSIGNED TO ANY BOARD:`);
  boardUnassigned.forEach(id => console.log(`   - ${id}`));
}

console.log('\n───────────────────────────────────────────────────────');
console.log('4. QUALIFICATION-WISE CATEGORIZATION AUDIT');
console.log('───────────────────────────────────────────────────────');
if (qualUnassigned.length === 0) {
  console.log(`✅ 100% QUALIFICATION COVERAGE: All ${totalJobs} jobs match at least 1 qualification category!`);
  console.log(`   - Qualification Categories Active: ${Object.keys(qualCounts).length} / ${QUAL_CATEGORIES.length}`);
} else {
  console.log(`⚠️ FOUND ${qualUnassigned.length} JOBS UNASSIGNED TO ANY QUALIFICATION:`);
  qualUnassigned.forEach(id => console.log(`   - ${id}`));
}

console.log('\n=======================================================');
console.log('                 AUDIT COMPLETED                       ');
console.log('=======================================================\n');
process.exit(0);
