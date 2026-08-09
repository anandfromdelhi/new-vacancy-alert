import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { generateRssXml } from '../src/utils/rssGenerator.js';
import { getPageMetaData, injectMetaTags } from '../src/utils/metaHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://newvacancyalert.in';

async function runPostBuild() {
  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');

  // 1. Generate Sitemap, RSS feeds, and robots.txt asynchronously in parallel
  const jobs = Object.values(jobDetailsData);
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/aiims-norcet-11-nursing-officer-2026/cutoff', priority: '0.8', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  staticRoutes.forEach(route => {
    xml += `\n  <url><loc>${BASE_URL}${route.url}</loc><lastmod>${now}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
  });
  jobs.forEach(job => {
    let lastMod = now;
    try {
      const date = new Date(job.lastUpdated);
      if (!isNaN(date.getTime())) lastMod = date.toISOString().split('T')[0];
    } catch {}
    xml += `\n  <url><loc>${BASE_URL}/${job.id}</loc><lastmod>${lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  });
  xml += `\n</urlset>`;

  const rssXmlContent = generateRssXml();
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;

  await Promise.all([
    fs.promises.writeFile(path.join(publicDir, 'sitemap.xml'), xml),
    fs.promises.writeFile(path.join(publicDir, 'rss.xml'), rssXmlContent),
    fs.promises.writeFile(path.join(publicDir, 'feed.xml'), rssXmlContent),
    fs.promises.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt),
    fs.promises.writeFile(path.join(distDir, 'sitemap.xml'), xml),
    fs.promises.writeFile(path.join(distDir, 'rss.xml'), rssXmlContent),
    fs.promises.writeFile(path.join(distDir, 'feed.xml'), rssXmlContent),
    fs.promises.writeFile(path.join(distDir, 'robots.txt'), robotsTxt)
  ]);
  console.log('✅ Sitemap, RSS feeds & robots.txt generated.');

  // 2. SSG Pre-rendering in Parallel
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`❌ Pre-render failed: ${indexHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const rawHtml = await fs.promises.readFile(indexHtmlPath, 'utf-8');

  const routes = new Set<string>([
    '/', '/archives', '/articles', '/about', '/contact', '/privacy-policy',
    '/rss-feed', '/salary-calculator', '/ssc-exam-calendar',
    '/rrb-exam-calendar-2026-27', '/aiims-norcet-11-nursing-officer-2026/cutoff',
    '/aiims-norcet-11-cutoff-marks', '/marketing-partner',
    '/marketing-partner/dashboard', '/marketing-partner/terms'
  ]);

  const subPages = [
    'posts-and-vacancies', 'important-dates', 'important-instructions',
    'general-instructions', 'vacancy-details', 'medical-standards',
    'nationality-citizenship', 'age-limit', 'age-relaxation',
    'educational-qualification', 'application-fee', 'reservation',
    'ex-serviceman', 'pwbd', 'scribe-facility', 'recruitment-process',
    'cbt-details', 'document-verification', 'how-to-apply', 'create-account',
    'application-guidelines', 'live-photo-instructions', 'documents-required',
    'application-correction', 'invalid-applications', 'e-call-letter',
    'original-document-verification', 'unfair-means-and-debarment',
    'rrb-websites', 'post-parameters', 'zone-wise-vacancy', 'merged-post-categories'
  ];

  subPages.forEach(sp => routes.add(`/rrb-technician-cen-02-2026/${sp}`));
  Object.keys(jobDetailsData).forEach(jobId => routes.add(`/${jobId}`));

  const writePromises = Array.from(routes).map(async routePath => {
    const meta = getPageMetaData(routePath);
    const html = injectMetaTags(rawHtml, meta);

    if (routePath === '/') {
      await fs.promises.writeFile(indexHtmlPath, html);
    } else {
      const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
      const targetDir = path.join(distDir, cleanRoute);
      await fs.promises.mkdir(targetDir, { recursive: true });
      await fs.promises.writeFile(path.join(targetDir, 'index.html'), html);
    }
  });

  await Promise.all(writePromises);
  console.log(`🚀 SSG Pre-rendering completed! Parallel pre-rendered HTML for ${routes.size} URLs.`);
  process.exit(0);
}

runPostBuild().catch(err => {
  console.error('❌ Post-build failed:', err);
  process.exit(1);
});
