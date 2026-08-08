import { JOBS_DATA } from '../src/data/jobsData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobDetailsPath = path.join(__dirname, '../src/data/jobDetails.json');
const jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

console.log(`Total entries in JOBS_DATA: ${JOBS_DATA.length}`);
console.log(`Total keys in jobDetails.json: ${Object.keys(jobDetails).length}`);

function cleanStr(s: string): string {
  if (!s) return "";
  return s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function getSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// 1. Check duplicate IDs in JOBS_DATA
const idMap = new Map<string, number[]>();
JOBS_DATA.forEach((item, index) => {
  const id = item.id || `index_${index}`;
  if (!idMap.has(id)) {
    idMap.set(id, []);
  }
  idMap.get(id)!.push(index);
});

const duplicateIds: string[] = [];
idMap.forEach((indices, id) => {
  if (indices.length > 1) {
    duplicateIds.push(id);
    console.log(`⚠️ DUPLICATE ID in JOBS_DATA: ${id} at indices ${indices.join(', ')}`);
  }
});

// 2. Check duplicate IDs in jobDetails.json
const detailsKeys = Object.keys(jobDetails);
const jobsDataIds = JOBS_DATA.map(j => j.id).filter(Boolean) as string[];

const missingInDetails = jobsDataIds.filter(id => !jobDetails[id]);
const missingInJobsData = detailsKeys.filter(id => !jobsDataIds.includes(id));

if (missingInDetails.length > 0) {
  console.log(`\n⚠️ Entries in JOBS_DATA but missing in jobDetails.json (${missingInDetails.length}):`);
  missingInDetails.forEach(id => console.log(`  - ${id}`));
} else {
  console.log(`\n✅ All ${jobsDataIds.length} entries in JOBS_DATA exist in jobDetails.json.`);
}

if (missingInJobsData.length > 0) {
  console.log(`\n⚠️ Entries in jobDetails.json but missing in JOBS_DATA (${missingInJobsData.length}):`);
  missingInJobsData.forEach(id => console.log(`  - ${id}`));
}

// 3. Check duplicate Advertisement numbers / Letter numbers
const advtGroups = new Map<string, typeof JOBS_DATA>();
JOBS_DATA.forEach(item => {
  const clean = cleanStr(item.a);
  if (clean.length > 3 && !['nil', 'na', 'notmentioned', 'various', 'none', 'dated'].includes(clean)) {
    if (!advtGroups.has(clean)) {
      advtGroups.set(clean, []);
    }
    advtGroups.get(clean)!.push(item);
  }
});

console.log(`\n--- ADVERTISEMENT NUMBER DUPLICATE CHECK ---`);
let advtDupCount = 0;
advtGroups.forEach((items, cleanAdvt) => {
  if (items.length > 1) {
    advtDupCount++;
    console.log(`\nAdvt Group [${cleanAdvt}]: ${items.length} entries`);
    items.forEach(item => {
      console.log(`  - ID: ${item.id} | Advt: "${item.a}" | Title: "${item.t.substring(0, 70)}..."`);
    });
  }
});

if (advtDupCount === 0) {
  console.log(`✅ No duplicate advertisement numbers found.`);
}

// 4. Check Title / Board Similarity
console.log(`\n--- TITLE & BOARD SIMILARITY CHECK ---`);
const duplicatePairs: { item1: typeof JOBS_DATA[0]; item2: typeof JOBS_DATA[0]; score: number }[] = [];

for (let i = 0; i < JOBS_DATA.length; i++) {
  for (let j = i + 1; j < JOBS_DATA.length; j++) {
    const item1 = JOBS_DATA[i];
    const item2 = JOBS_DATA[j];

    const t1 = item1.t.toLowerCase();
    const t2 = item2.t.toLowerCase();
    const b1 = item1.b.toLowerCase();
    const b2 = item2.b.toLowerCase();

    const titleSim = getSimilarity(t1, t2);
    const boardSim = getSimilarity(b1, b2);

    if ((titleSim > 0.7 && boardSim > 0.6) || titleSim > 0.85) {
      duplicatePairs.push({ item1, item2, score: Math.round(titleSim * 100) });
    }
  }
}

if (duplicatePairs.length > 0) {
  console.log(`⚠️ Found ${duplicatePairs.length} potential duplicate pairs by title/board similarity:`);
  duplicatePairs.forEach(({ item1, item2, score }) => {
    console.log(`\nSimilarity Score: ${score}%`);
    console.log(`  Item 1: ID=${item1.id} | Advt="${item1.a}" | Title="${item1.t.substring(0, 80)}..."`);
    console.log(`  Item 2: ID=${item2.id} | Advt="${item2.a}" | Title="${item2.t.substring(0, 80)}..."`);
  });
} else {
  console.log(`✅ No duplicate titles/boards found by similarity scan.`);
}
