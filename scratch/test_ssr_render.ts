import { jobDetailsData } from '../src/data/jobDetails';

const testIds = [
  'isro-hsfc-scientist-engineer-sd-recruitment-2026',
  'krcl-apprentice-recruitment-2026',
  'iob-local-bank-officer-recruitment-2026',
  'upsc-recruitment-advt-10-2026'
];

console.log("=== TESTING ALL 4 JOB DETAILS IN MEMORY ===");

for (const id of testIds) {
  const job = (jobDetailsData as Record<string, any>)[id];
  if (!job) {
    console.error(`❌ CRITICAL: ${id} NOT FOUND in jobDetailsData!`);
    continue;
  }
  console.log(`\nChecking '${id}'...`);
  console.log(`  Title: ${job.title}`);
  console.log(`  Board: ${job.board}`);
  console.log(`  Vacancies: ${job.vacancies}`);
  console.log(`  Overview items: ${job.overview?.length}`);
  console.log(`  Highlights items: ${job.highlights?.length}`);
  console.log(`  Important dates items: ${job.importantDates?.length}`);
  console.log(`  Vacancies details items: ${job.vacanciesDetails?.length}`);
  console.log(`  Eligibility education items: ${job.eligibility?.education?.length}`);
  console.log(`  Salary payLevel: ${job.salary?.payLevel}`);
  console.log(`  Application fee general: ${job.applicationFee?.general}`);
  console.log(`  How to apply steps: ${job.howToApplySteps?.length}`);
  console.log(`  Documents required: ${job.documentsRequired?.length}`);
  console.log(`  FAQs items: ${job.faqs?.length}`);
}

console.log("\n✅ In-memory data check complete!");
