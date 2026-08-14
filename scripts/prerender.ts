import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { getPageMetaData, injectMetaTags } from '../server.js';
import { render } from '../src/entry-server.js';
import { QUAL_CATEGORIES, STATE_MAP } from '../src/utils/categoryUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Add qualification category pages
  QUAL_CATEGORIES.forEach(cat => {
    routes.add(`/jobs-for/${cat.slug}`);
  });

  // Add state category pages
  Object.keys(STATE_MAP).forEach(stateKey => {
    routes.add(`/state/${stateKey}`);
  });

  // Add 32 Notification Detailed Sub-Pages for RRB Technician
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

  // Add all Job Detail pages (240+ jobs)
  Object.keys(jobDetailsData).forEach(jobId => {
    routes.add(`/${jobId}`);
  });

  // Build O(1) job lookup map to eliminate O(N^2) search overhead
  const jobMap = new Map<string, any>();
  Object.entries(jobDetailsData).forEach(([k, v]) => {
    jobMap.set(k.toLowerCase(), v);
  });

  const routeList = Array.from(routes);
  let generatedCount = 0;

  // Process routes in parallel batches of 25
  const CONCURRENCY = 25;
  for (let i = 0; i < routeList.length; i += CONCURRENCY) {
    const batch = routeList.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (routePath) => {
        let pageHtml = rawTemplate;

        // 1. Full React Server-Side Component Tree Rendering
        try {
          const { html: renderedContent } = render(routePath);
          if (renderedContent) {
            pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${renderedContent}</div>`);
          }
        } catch (ssrError) {
          console.warn(`⚠️ SSR render warning for route ${routePath}:`, ssrError);
        }

        // 2. Inject Meta Tags (title, description, OG tags)
        const meta = getPageMetaData(routePath);
        pageHtml = injectMetaTags(pageHtml, meta);

        // 3. Inject JobPosting & FAQPage JSON-LD Structured Data for job pages
        const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
        const job = jobMap.get(cleanRoute.toLowerCase());
        if (job) {
          const jsonLdScripts: string[] = [];

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
            "datePosted": job.lastUpdated || "2026-08-01",
            "validThrough": job.importantDates?.find((d: any) => d.event && d.event.toLowerCase().includes('last date'))?.date || "2026-12-31",
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
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            };
            jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`);
          }

          const jsonLdHtml = jsonLdScripts.join('\n');
          pageHtml = pageHtml.replace('</head>', `${jsonLdHtml}\n</head>`);
        }

        // 4. Save HTML to disk
        if (routePath === '/') {
          await fs.promises.writeFile(indexHtmlPath, pageHtml);
        } else {
          const targetDir = path.join(distDir, cleanRoute);
          await fs.promises.mkdir(targetDir, { recursive: true });
          await fs.promises.writeFile(path.join(targetDir, 'index.html'), pageHtml);
        }

        generatedCount++;
      })
    );
  }

  console.log(`🚀 SSG Pre-rendering completed! Successfully pre-rendered full HTML content & JSON-LD for ${generatedCount} URLs.`);
}

prerender().catch(err => {
  console.error('❌ Error during SSG prerendering:', err);
  process.exit(1);
});
