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

// Target duplicate IDs to remove:
// 1. mpesb-group-2-sub-group-4-patwari-recruitment-2026 (Duplicate of mpesb-group-2-subgroup-4-patwari-recruitment-2026)
// 2. isro-assistant-jpa-udc-stenographer-2026 (Duplicate of isro-icrb-assistants-jpa-udc-stenographer-recruitment-2026)

const duplicatesToRemove = [
  'mpesb-group-2-sub-group-4-patwari-recruitment-2026',
  'isro-assistant-jpa-udc-stenographer-2026'
];

console.log("Removing duplicate entries from jobsData.ts and jobDetails.json...");

// Remove from jobDetails.json
duplicatesToRemove.forEach(id => {
  if (jobDetails[id]) {
    delete jobDetails[id];
    console.log(`✅ Removed '${id}' from jobDetails.json`);
  } else {
    console.log(`ℹ️ '${id}' not found in jobDetails.json`);
  }
});

// Write updated jobDetails.json
fs.writeFileSync(jobDetailsPath, JSON.stringify(jobDetails, null, 2), 'utf8');

// Remove from jobsData.ts using AST/Regex parsing
// We can filter out items in JOBS_DATA array
import { JOBS_DATA } from '../src/data/jobsData.js';

const filteredJobsData = JOBS_DATA.filter(item => !duplicatesToRemove.includes(item.id || ''));

console.log(`Original JOBS_DATA length: ${JOBS_DATA.length}`);
console.log(`Filtered JOBS_DATA length: ${filteredJobsData.length}`);

// Generate new jobsData.ts content
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
