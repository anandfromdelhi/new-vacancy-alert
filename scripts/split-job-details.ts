import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const jobDetailsPath = path.join(rootDir, 'src/data/jobDetails.json');
const outputDir = path.join(rootDir, 'src/data/jobs-generated');
const publicOutputDir = path.join(rootDir, 'public/data/jobs-generated');
const indexPath = path.join(rootDir, 'src/data/jobs-index-generated.json');

if (!fs.existsSync(jobDetailsPath)) {
  console.error(`❌ Source file not found: ${jobDetailsPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(jobDetailsPath, 'utf-8');
const jobDetailsData: Record<string, any> = JSON.parse(rawData);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(publicOutputDir)) {
  fs.mkdirSync(publicOutputDir, { recursive: true });
}

const indexMap: Record<string, any> = {};
let count = 0;

for (const [id, job] of Object.entries(jobDetailsData)) {
  // Write individual job file in both src/ and public/
  const jobFilePath = path.join(outputDir, `${id}.json`);
  const publicJobFilePath = path.join(publicOutputDir, `${id}.json`);
  const jsonContent = JSON.stringify(job, null, 2);
  fs.writeFileSync(jobFilePath, jsonContent, 'utf-8');
  fs.writeFileSync(publicJobFilePath, jsonContent, 'utf-8');

  // Build lightweight index entry
  indexMap[id] = {
    id: job.id || id,
    title: job.title || '',
    board: job.board || '',
    jobLocation: job.jobLocation || '',
    vacancies: job.vacancies ?? 0,
    seoTitle: job.seoTitle || '',
    seoDescription: job.seoDescription || '',
    lastUpdated: job.lastUpdated || '',
    overviewSummary: Array.isArray(job.overview) && job.overview.length > 0 ? job.overview[0] : ''
  };

  count++;
}

// Write generated index file
fs.writeFileSync(indexPath, JSON.stringify(indexMap, null, 2), 'utf-8');

console.log(`✅ [split-job-details] Successfully generated ${count} per-job files in src/data/jobs-generated/ and updated src/data/jobs-index-generated.json`);
