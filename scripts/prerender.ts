import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { getPageMetaData, injectMetaTags } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  const distDir = path.join(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`❌ Pre-render failed: ${indexHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const rawHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Collect all static routes
  const routes = new Set<string>([
    '/',
    '/archives',
    '/articles',
    '/about',
    '/contact',
    '/privacy-policy',
    '/rss-feed',
    '/salary-calculator',
    '/ssc-exam-calendar',
    '/rrb-exam-calendar-2026-27',
    '/aiims-norcet-11-nursing-officer-2026/cutoff',
    '/aiims-norcet-11-cutoff-marks',
    '/marketing-partner',
    '/marketing-partner/dashboard',
    '/marketing-partner/terms',
  ]);

  // Add 32 Notification Detailed Sub-Pages
  const subPages = [
    'posts-and-vacancies',
    'important-dates',
    'important-instructions',
    'general-instructions',
    'vacancy-details',
    'medical-standards',
    'nationality-citizenship',
    'age-limit',
    'age-relaxation',
    'educational-qualification',
    'application-fee',
    'reservation',
    'ex-serviceman',
    'pwbd',
    'scribe-facility',
    'recruitment-process',
    'cbt-details',
    'document-verification',
    'how-to-apply',
    'create-account',
    'application-guidelines',
    'live-photo-instructions',
    'documents-required',
    'application-correction',
    'invalid-applications',
    'e-call-letter',
    'original-document-verification',
    'unfair-means-and-debarment',
    'rrb-websites',
    'post-parameters',
    'zone-wise-vacancy',
    'merged-post-categories'
  ];

  subPages.forEach(sp => {
    routes.add(`/rrb-technician-cen-02-2026/${sp}`);
  });

  // Add all Job Detail pages (200+ jobs)
  Object.keys(jobDetailsData).forEach(jobId => {
    routes.add(`/${jobId}`);
  });

  let generatedCount = 0;

  for (const routePath of routes) {
    const meta = getPageMetaData(routePath);
    const html = injectMetaTags(rawHtml, meta);

    if (routePath === '/') {
      fs.writeFileSync(indexHtmlPath, html);
    } else {
      const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
      const targetDir = path.join(distDir, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), html);
    }

    generatedCount++;
  }

  console.log(`🚀 SSG Pre-rendering completed! Successfully pre-rendered HTML for ${generatedCount} URLs.`);
}

prerender().catch(err => {
  console.error('❌ Error during SSG prerendering:', err);
  process.exit(1);
});
