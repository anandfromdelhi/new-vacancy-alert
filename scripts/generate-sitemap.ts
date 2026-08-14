import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { generateRssXml } from '../src/utils/rssGenerator.js';

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

  // Define static routes
  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/aiims-norcet-11-nursing-officer-2026/cutoff', priority: '0.8', changefreq: 'monthly' }
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
  jobs.forEach(job => {
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
  console.log(`✅ Sitemap generated at ${sitemapPath}`);

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

generateSitemap().catch(console.error);

