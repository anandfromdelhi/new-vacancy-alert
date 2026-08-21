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

async function splitJobs() {
  if (!fs.existsSync(jobDetailsPath)) {
    console.error(`❌ Source file not found: ${jobDetailsPath}`);
    process.exit(1);
  }

  const rawData = await fs.promises.readFile(jobDetailsPath, 'utf-8');
  const jobDetailsData: Record<string, any> = JSON.parse(rawData);

  await Promise.all([
    fs.promises.mkdir(outputDir, { recursive: true }),
    fs.promises.mkdir(publicOutputDir, { recursive: true })
  ]);

  const indexMap: Record<string, any> = {};
  const writePromises: Promise<any>[] = [];
  let count = 0;

  for (const [id, job] of Object.entries(jobDetailsData)) {
    const jobFilePath = path.join(outputDir, `${id}.json`);
    const publicJobFilePath = path.join(publicOutputDir, `${id}.json`);
    const jsonContent = JSON.stringify(job);
    
    writePromises.push(
      fs.promises.writeFile(jobFilePath, jsonContent, 'utf-8'),
      fs.promises.writeFile(publicJobFilePath, jsonContent, 'utf-8')
    );

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

  writePromises.push(fs.promises.writeFile(indexPath, JSON.stringify(indexMap), 'utf-8'));
  await Promise.all(writePromises);

  console.log(`✅ [split-job-details] Successfully generated ${count} per-job files in src/data/jobs-generated/ and updated src/data/jobs-index-generated.json`);
}

splitJobs().catch(err => {
  console.error('❌ split-job-details failed:', err);
  process.exit(1);
});
