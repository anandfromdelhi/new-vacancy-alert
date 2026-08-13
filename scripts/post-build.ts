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
}

runPostBuild().catch(err => {
  console.error('❌ Post-build failed:', err);
  process.exit(1);
});
