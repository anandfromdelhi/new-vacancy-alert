import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { getPageMetaData, injectMetaTags } from '../server.js';
import { render } from '../src/entry-server.js';
import { QUAL_CATEGORIES, STATE_MAP } from '../src/utils/categoryUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// How many pages to render concurrently. 10-20 is usually the sweet spot —
// too high and you just thrash the CPU/GC instead of actually going faster.
const CONCURRENCY = 15;

async function prerender() {
  const distDir = path.join(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`❌ Pre-render failed: ${indexHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');

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

  // --- Per-route work, unchanged logic, just extracted into a function ---
  function renderRoute(routePath: string) {
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
    const matchedKey = Object.keys(jobDetailsData).find(
      k => k === cleanRoute || k.toLowerCase() === cleanRoute.toLowerCase()
    );
    const job = matchedKey ? jobDetailsData[matchedKey] : null;

    if (job) {
      const jsonLdScripts: string[] = [];

      const parseIso = (raw: string | undefined, fallback: string): string => {
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
      };

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
      jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(jobSchema, null, 2)}\n</script>`);

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
        jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`);
      }

      jsonLdScripts.push(`<script id="__SSR_JOB_DATA__" type="application/json">${JSON.stringify(job)}</script>`);

      pageHtml = pageHtml.replace('</head>', `${jsonLdScripts.join('\n')}\n</head>`);
    }

    if (routePath === '/') {
      fs.writeFileSync(indexHtmlPath, pageHtml);
    } else {
      const targetDir = path.join(distDir, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    }
  }

  // --- Batch execution instead of one-at-a-time ---
  const routeList = Array.from(routes);
  let generatedCount = 0;

  for (let i = 0; i < routeList.length; i += CONCURRENCY) {
    const batch = routeList.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(routePath =>
        Promise.resolve().then(() => {
          renderRoute(routePath);
          generatedCount++;
        })
      )
    );
  }

  console.log(`🚀 SSG Pre-rendering completed! Successfully pre-rendered full HTML content & JSON-LD for ${generatedCount} URLs.`);
}

prerender().catch(err => {
  console.error('❌ Error during SSG prerendering:', err);
  process.exit(1);
});
