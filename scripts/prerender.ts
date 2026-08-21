import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { getPageMetaData, injectMetaTags } from '../server.js';
import { render } from '../src/entry-server.js';
import { QUAL_CATEGORIES, STATE_MAP } from '../src/utils/categoryUtils.js';
import { generateRssXml } from '../src/utils/rssGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://newvacancyalert.in';
const CONCURRENCY = 60;

function parseIso(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  const str = raw.trim();
  const matchDmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (matchDmy) {
    return `${matchDmy[3]}-${matchDmy[2].padStart(2, '0')}-${matchDmy[1].padStart(2, '0')}`;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return fallback;
}

async function prerender() {
  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`❌ Pre-render failed: ${indexHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const rawTemplate = await fs.promises.readFile(indexHtmlPath, 'utf-8');

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

  QUAL_CATEGORIES.forEach(cat => {
    routes.add(`/jobs-for/${cat.slug}`);
  });

  Object.keys(STATE_MAP).forEach(stateKey => {
    routes.add(`/state/${stateKey}`);
  });

  const subPages = [
    'posts-and-vacancies', 'important-dates', 'important-instructions', 'general-instructions',
    'vacancy-details', 'medical-standards', 'nationality-citizenship', 'age-limit', 'age-relaxation',
    'educational-qualification', 'application-fee', 'reservation', 'ex-serviceman', 'pwbd',
    'scribe-facility', 'recruitment-process', 'cbt-details', 'document-verification', 'how-to-apply',
    'create-account', 'application-guidelines', 'live-photo-instructions', 'documents-required',
    'application-correction', 'invalid-applications', 'e-call-letter', 'original-document-verification',
    'unfair-means-and-debarment', 'rrb-websites', 'post-parameters', 'zone-wise-vacancy',
    'merged-post-categories'
  ];

  subPages.forEach(sp => {
    routes.add(`/rrb-technician-cen-02-2026/${sp}`);
  });

  Object.keys(jobDetailsData).forEach(jobId => {
    routes.add(`/${jobId}`);
  });

  async function renderRoute(routePath: string): Promise<void> {
    let pageHtml = rawTemplate;

    try {
      const { html: renderedContent } = render(routePath);
      if (renderedContent) {
        pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${renderedContent}</div>`);
      }
    } catch (ssrError) {
      console.warn(`⚠️ SSR render warning for route ${routePath}:`, ssrError);
    }

    const meta = getPageMetaData(routePath);
    pageHtml = injectMetaTags(pageHtml, meta);

    const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
    const job = (jobDetailsData as Record<string, any>)[cleanRoute] || null;

    if (job) {
      const jsonLdScripts: string[] = [];
      const rawLastDate = job.importantDates?.find((d: any) => d.event && d.event.toLowerCase().includes('last date'))?.date;

      const jobSchema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.seoDescription || (job.overview ? job.overview.join(' ') : job.title),
        "identifier": {
          "@type": "PropertyValue",
          "name": job.board,
          "value": job.advtNo || job.id
        },
        "datePosted": parseIso(job.lastUpdated, "2026-08-01"),
        "validThrough": parseIso(rawLastDate, "2026-12-31"),
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.board,
          "sameAs": "https://newvacancyalert.in",
          "logo": "https://newvacancyalert.in/logo.png"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.jobLocation || "India",
            "addressCountry": "IN"
          }
        }
      };
      jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(jobSchema)}\n</script>`);

      if (job.faqs && job.faqs.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": job.faqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        };
        jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(faqSchema)}\n</script>`);
      }

      jsonLdScripts.push(`<script id="__SSR_JOB_DATA__" type="application/json">${JSON.stringify(job)}</script>`);
      pageHtml = pageHtml.replace('</head>', `${jsonLdScripts.join('\n')}\n</head>`);
    }

    if (routePath === '/') {
      await fs.promises.writeFile(indexHtmlPath, pageHtml, 'utf-8');
    } else {
      const targetDir = path.join(distDir, cleanRoute);
      await fs.promises.mkdir(targetDir, { recursive: true });
      await fs.promises.writeFile(path.join(targetDir, 'index.html'), pageHtml, 'utf-8');
    }
  }

  // --- Batch execution in parallel ---
  const routeList = Array.from(routes);
  let generatedCount = 0;

  for (let i = 0; i < routeList.length; i += CONCURRENCY) {
    const batch = routeList.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async routePath => {
        await renderRoute(routePath);
        generatedCount++;
      })
    );
  }

  console.log(`🚀 SSG Pre-rendering completed! Successfully pre-rendered full HTML content & JSON-LD for ${generatedCount} URLs.`);

  // Generate Sitemap, RSS feeds, and robots.txt asynchronously in parallel
  const now = new Date().toISOString().split('T')[0];
  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/articles', priority: '0.8', changefreq: 'daily' },
    { url: '/archives', priority: '0.8', changefreq: 'daily' },
    { url: '/salary-calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/ssc-exam-calendar', priority: '0.8', changefreq: 'monthly' },
    { url: '/rrb-exam-calendar-2026-27', priority: '0.8', changefreq: 'monthly' },
    { url: '/aiims-norcet-11-nursing-officer-2026/cutoff', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/rss-feed', priority: '0.5', changefreq: 'monthly' },
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  staticRoutes.forEach(route => {
    xml += `\n  <url><loc>${BASE_URL}${route.url}</loc><lastmod>${now}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
  });
  Object.values(jobDetailsData).forEach(job => {
    const lastMod = parseIso(job.lastUpdated, now);
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

prerender().catch(err => {
  console.error('❌ Error during SSG prerendering:', err);
  process.exit(1);
});
