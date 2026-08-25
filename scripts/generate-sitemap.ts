import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { JOBS_DATA } from '../src/data/jobsData.js';
import { QUAL_CATEGORIES, getStatesWithCounts, getBoardsWithCounts } from '../src/utils/categoryUtils.js';
import { generateRssXml } from '../src/utils/rssGenerator.js';
import jobsIndexData from '../src/data/jobs-index-generated.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://newvacancyalert.in';

async function generateSitemap() {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const rssPath = path.join(__dirname, '../public/rss.xml');
  const feedPath = path.join(__dirname, '../public/feed.xml');
  const robotsPath = path.join(__dirname, '../public/robots.txt');

  const jobs = Object.values(jobDetailsData);
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const stateList = getStatesWithCounts(JOBS_DATA);
  const boardList = getBoardsWithCounts(JOBS_DATA);

  // Define static routes
  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/articles', priority: '0.8', changefreq: 'daily' },
    { url: '/salary-calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/ssc-exam-calendar', priority: '0.8', changefreq: 'monthly' },
    { url: '/rrb-exam-calendar-2026-27', priority: '0.8', changefreq: 'monthly' },
    { url: '/aiims-norcet-11-nursing-officer-2026/cutoff', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/rss-feed', priority: '0.5', changefreq: 'monthly' },
    { url: '/ssc-cgl-master-guide', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-notification-vacancies-trend', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-posts-salary-pay-scale-hierarchy', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-eligibility-physical-standards-pst-pet', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-exam-pattern-syllabus-dest-typing', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-cutoffs-post-preference-ranking-guide', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-preparation-strategy-study-plan-books-mocks', priority: '0.8', changefreq: 'weekly' },
    { url: '/ssc-cgl-admit-card-selection-dv-checklist', priority: '0.8', changefreq: 'weekly' },
    { url: '/marketing-partner', priority: '0.6', changefreq: 'monthly' },
    { url: '/marketing-partner/dashboard', priority: '0.5', changefreq: 'monthly' },
    { url: '/marketing-partner/terms', priority: '0.4', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/posts-and-vacancies', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/important-dates', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/important-instructions', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/general-instructions', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/vacancy-details', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/medical-standards', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/nationality-citizenship', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/age-limit', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/age-relaxation', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/educational-qualification', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/application-fee', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/reservation', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/ex-serviceman', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/pwbd', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/scribe-facility', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/recruitment-process', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/cbt-details', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/document-verification', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/how-to-apply', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/create-account', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/application-guidelines', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/live-photo-instructions', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/documents-required', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/application-correction', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/invalid-applications', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/e-call-letter', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/original-document-verification', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/unfair-means-and-debarment', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/rrb-websites', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/post-parameters', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/zone-wise-vacancy', priority: '0.7', changefreq: 'monthly' },
    { url: '/rrb-technician-cen-02-2026/merged-post-categories', priority: '0.7', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Add qualification category routes
  QUAL_CATEGORIES.forEach(cat => {
    xml += `
  <url>
    <loc>${BASE_URL}/jobs-for/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add state routes
  stateList.forEach(st => {
    xml += `
  <url>
    <loc>${BASE_URL}/state/${st.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add board routes
  boardList.forEach(bd => {
    xml += `
  <url>
    <loc>${BASE_URL}/board/${bd.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  function parseToIsoDate(dateStr: string, defaultDate: string): string {
    if (!dateStr) return defaultDate;
    const str = dateStr.trim();
    const matchDmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (matchDmy) {
      const day = matchDmy[1].padStart(2, '0');
      const month = matchDmy[2].padStart(2, '0');
      const year = matchDmy[3];
      return `${year}-${month}-${day}`;
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return defaultDate;
  }

  // Add dynamic job routes
  const allJobMap = new Map<string, any>();
  Object.values(jobDetailsData).forEach((job: any) => {
    if (job && job.id) allJobMap.set(job.id, job);
  });
  Object.values(jobsIndexData).forEach((job: any) => {
    if (job && job.id && !allJobMap.has(job.id)) allJobMap.set(job.id, job);
  });
  JOBS_DATA.forEach((job: any) => {
    if (job && job.id && !allJobMap.has(job.id)) allJobMap.set(job.id, job);
  });

  allJobMap.forEach(job => {
    const lastMod = parseToIsoDate(job.lastUpdated, now);

    xml += `
  <url>
    <loc>${BASE_URL}/${job.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `\n</urlset>`;

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap generated with ${allJobMap.size} vacancies at ${sitemapPath}`);

  // Generate RSS feeds
  const rssXmlContent = generateRssXml();
  fs.writeFileSync(rssPath, rssXmlContent);
  fs.writeFileSync(feedPath, rssXmlContent);
  console.log(`✅ RSS Feed generated at ${rssPath} and ${feedPath}`);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`✅ robots.txt generated at ${robotsPath}`);
}

generateSitemap()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error generating sitemap:', err);
    process.exit(1);
  });


