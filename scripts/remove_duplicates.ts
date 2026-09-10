import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobsDataPath = path.join(__dirname, '../src/data/jobsData.ts');
const jobDetailsPath = path.join(__dirname, '../src/data/jobDetails.json');

// Read jobDetails.json
const jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

// Read jobsData.ts as text
let jobsDataText = fs.readFileSync(jobsDataPath, 'utf8');

export const DUPLICATE_MAPPINGS: Record<string, string> = {
  // 1. Guru Ghasidas
  'guru-ghasidas-vishwavidyalaya-finance-officer-professors-ass-recruitment-2026':
    'guru-ghasidas-vishwavidyalaya-finance-officer-professors-associat-recruitment-2026',

  // 2. GIMS Staff Nurse
  'gims-staff-nurse-staff-nurse-non-teaching-recruitment-2026':
    'gims-greater-noida-staff-nurse-recruitment-2026',

  // 3. TNPSC CTSE (Triplicate)
  'tnpsc-ctse-interview-posts-research-assistant-assistant-m-recruitment-2026':
    'tnpsc-ctse-interview-posts-recruitment-2026',
  'tnpsc-ctse-interview-post-31-different-post-names-recruitment-2026':
    'tnpsc-ctse-interview-posts-recruitment-2026',

  // 4. UKSSSC Group C (Triplicate)
  'uttarakhand-subordinate-s-computer-assistant-junior-recruitment-2026':
    'uksssc-inter-level-group-c-junior-assistant-registrar-cle-recruitment-2026',
  'uttarakhand-subordinate-servic-computer-assistant-junior-assi-recruitment-2026':
    'uksssc-inter-level-group-c-junior-assistant-registrar-cle-recruitment-2026',

  // 5. Meghalaya Secretariat
  'secretariat-administratio-peon-cleaner-sweeper-chow-recruitment-2026':
    'meghalaya-civil-secretariat-peon-chowkidar-and-more-recruitment-2026',

  // 6. IIT Goa Sports Coach
  'indian-institute-of-technology-sports-coach-recruitment-2026':
    'iit-goa-sports-coach-recruitment-2026',

  // 7. SSC JE
  'staff-selection-commission-ssc-je-civil-je-electrical-je-mech-recruitment-2026':
    'staff-selection-commission-ssc-1748-junior-engineer-recruitment-2026',

  // 8. SSC CHSL
  'staff-selection-commission-ssc-combined-higher-secondary-102-recruitment-2026':
    'ssc-chsl-2026-recruitment',

  // 9. IIT Delhi SRF
  'indian-institute-of-technology-senior-research-fellow-recruitment-2026':
    'iit-delhi-senior-research-fellow-srf-recruitment-2026',

  // 10. TMC Foreman
  'homi-bhabha-cancer-hospital-re-foreman-mechanical-recruitment-2026':
    'tata-memorial-centre-tmc-foreman-mechanical-recruitment-2026',

  // 11. AP Police Prakasam
  'andhra-pradesh-police-dep-37-recruitment-2026':
    'ap-police-prakasam-district-record-assistant-sweeper-and-m-recruitment-2026',

  // 12. LEDA Lakshadweep
  'lakshadweep-administration-senior-energy-consultant-and-a-recruitment-2026':
    'lakshadweep-energy-development-senior-energy-consultant-and-a-recruitment-2026',

  // 13. India Post GDS (23 vs 23,757)
  'department-of-posts-ministry-o-bpm-abpm-dak-sevak-recruitment-2026':
    'department-of-posts-ministry-o-branch-postmaster-bpm-assistan-recruitment-2026',

  // 14. RARS Chintapalle (Salary vs Teaching Associate)
  'regional-agricultural-research-station-chintapalle-rars-chintapalle-salary-recruitment-2026':
    'regional-agricultural-research-teaching-associate-and-teachin-recruitment-2026',

  // 15. Bastar District (Salary Per Month vs Teacher)
  'bastar-district-salary-per-month-recruitment-2026':
    'bastar-district-high-class-teacher-subject-exp-recruitment-2026',

  // 16. CONCOR (Generic vs Management Trainee)
  'container-corporation-of-india-ltd-concor-no-of-posts-recruitment-2026':
    'container-corporation-of-india-management-trainee-assistant-o-recruitment-2026',

  // 17. Yadgir District Court (Subset 9 vs All 18)
  'district-court-yadgir-typist-typist-copyist-recruitment-2026':
    'yadgir-district-court-typist-typist-copyist-process-recruitment-2026',

  // 18. RRB JE (CEN 04/2026 duplicate)
  'railway-recruitment-boards-rrb-junior-engineer-37-disciplined-recruitment-2026':
    'rrb-je-dms-recruitment-2026'
};

const duplicatesToRemove = Object.keys(DUPLICATE_MAPPINGS);

console.log(`Removing ${duplicatesToRemove.length} duplicate entries from jobDetails.json, jobsData.ts, and generated files...`);

// Remove from jobDetails.json
let removedDetailsCount = 0;
duplicatesToRemove.forEach(id => {
  if (jobDetails[id]) {
    delete jobDetails[id];
    removedDetailsCount++;
    console.log(`✅ Removed '${id}' from jobDetails.json`);
  } else {
    console.log(`ℹ️ '${id}' not found in jobDetails.json`);
  }
});
fs.writeFileSync(jobDetailsPath, JSON.stringify(jobDetails, null, 2), 'utf8');
console.log(`✅ Saved jobDetails.json with ${Object.keys(jobDetails).length} items remaining.`);

// Remove from jobsData.ts
import { JOBS_DATA } from '../src/data/jobsData.ts';

const filteredJobsData = JOBS_DATA.filter(item => !duplicatesToRemove.includes(item.id || ''));

console.log(`Original JOBS_DATA length: ${JOBS_DATA.length}`);
console.log(`Filtered JOBS_DATA length: ${filteredJobsData.length}`);

const newJobsDataContent = `export interface JobEntry {
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

export const JOBS_DATA: JobEntry[] = ${JSON.stringify(filteredJobsData, null, 2)};
`;

fs.writeFileSync(jobsDataPath, newJobsDataContent, 'utf8');
console.log("✅ Updated jobsData.ts successfully!");

// Remove from jobUploadDates.json
const uploadDatesPath = path.join(__dirname, '../src/data/jobUploadDates.json');
if (fs.existsSync(uploadDatesPath)) {
  const uploadDates = JSON.parse(fs.readFileSync(uploadDatesPath, 'utf8'));
  let datesRemoved = 0;
  duplicatesToRemove.forEach(id => {
    if (uploadDates[id]) {
      delete uploadDates[id];
      datesRemoved++;
    }
  });
  fs.writeFileSync(uploadDatesPath, JSON.stringify(uploadDates, null, 2), 'utf8');
  console.log(`✅ Cleaned ${datesRemoved} entries from jobUploadDates.json.`);
}

// Remove from src/data/jobs-generated/
const jobsGenDir = path.join(__dirname, '../src/data/jobs-generated');
if (fs.existsSync(jobsGenDir)) {
  let filesDeleted = 0;
  duplicatesToRemove.forEach(id => {
    const fPath = path.join(jobsGenDir, `${id}.json`);
    if (fs.existsSync(fPath)) {
      fs.unlinkSync(fPath);
      filesDeleted++;
    }
  });
  console.log(`✅ Deleted ${filesDeleted} generated files from jobs-generated/.`);
}

