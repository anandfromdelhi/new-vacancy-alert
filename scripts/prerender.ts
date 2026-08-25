import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jobDetailsData } from '../src/data/jobDetails.js';
import { JOBS_DATA } from '../src/data/jobsData.js';
import { getPageMetaData, injectMetaTags } from '../src/utils/metaHelper.js';
import { QUAL_CATEGORIES, getStatesWithCounts, getBoardsWithCounts } from '../src/utils/categoryUtils.js';
import { generateRssXml } from '../src/utils/rssGenerator.js';
import jobsIndexData from '../src/data/jobs-index-generated.json' with { type: 'json' };

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

function parseBaseSalary(salaryObj: any): object {
  if (!salaryObj) {
    return {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": 25500,
        "unitText": "MONTH"
      }
    };
  }

  const rawText = [
    salaryObj.initialPay || '',
    salaryObj.payLevel || '',
    typeof salaryObj.allowances === 'string' ? salaryObj.allowances : (salaryObj.allowances || []).join(' ')
  ].join(' ');

  const matches = [...rawText.matchAll(/(?:₹|Rs\.?|INR|\b)\s*([1-9]\d{0,2}(?:,\d{2,3})+|[1-9]\d{3,5})\b/gi)]
    .map(m => parseInt(m[1].replace(/,/g, ''), 10))
    .filter(n => n >= 5000 && n <= 350000);

  if (matches.length >= 2) {
    const min = Math.min(matches[0], matches[1]);
    const max = Math.max(matches[0], matches[1]);
    if (min !== max) {
      return {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": min,
          "maxValue": max,
          "unitText": "MONTH"
        }
      };
    }
  }

  if (matches.length === 1) {
    return {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": matches[0],
        "unitText": "MONTH"
      }
    };
  }

  return {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "value": 25500,
      "unitText": "MONTH"
    }
  };
}

function parseJobLocationAddress(locationStr?: string, boardStr?: string) {
  const cleanLoc = (locationStr || boardStr || 'India').trim();
  const pinMatch = cleanLoc.match(/\b([1-9]\d{5})\b/);
  const postalCode = pinMatch ? pinMatch[1] : '110001';

  let locality = 'India';
  let region = 'India';

  if (cleanLoc.includes(',')) {
    const parts = cleanLoc.split(',').map(p => p.trim());
    locality = parts[0];
    region = parts[parts.length - 1].replace(/\b[1-9]\d{5}\b/g, '').replace(/[\(\)\-]/g, '').trim() || 'India';
  } else if (cleanLoc.includes('(') && cleanLoc.includes(')')) {
    const match = cleanLoc.match(/^(.*?)\((.*?)\)/);
    if (match) {
      locality = match[1].trim();
      region = match[2].trim();
    } else {
      locality = cleanLoc;
      region = cleanLoc;
    }
  } else {
    locality = cleanLoc;
    region = cleanLoc;
  }

  const streetAddress = cleanLoc.length > 120 ? cleanLoc.substring(0, 120) : cleanLoc;

  return {
    "@type": "PostalAddress",
    "streetAddress": streetAddress || 'Central / State Govt Office',
    "addressLocality": locality || 'India',
    "addressRegion": region || 'India',
    "postalCode": postalCode,
    "addressCountry": "IN"
  };
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
    '/articles',
    '/about',
    '/contact',
    '/privacy-policy',
    '/rss-feed',
    '/salary-calculator',
    '/ssc-exam-calendar',
    '/rrb-exam-calendar-2026-27',
    '/best-books-for-rrb-ntpc',
    '/rrb-ntpc-best-books',
    '/aiims-norcet-11-nursing-officer-2026/cutoff',
    '/aiims-norcet-11-cutoff-marks',
    '/ssc-cgl-master-guide',
    '/ssc-cgl-notification-vacancies-trend',
    '/ssc-cgl-posts-salary-pay-scale-hierarchy',
    '/ssc-cgl-eligibility-physical-standards-pst-pet',
    '/ssc-cgl-exam-pattern-syllabus-dest-typing',
    '/ssc-cgl-cutoffs-post-preference-ranking-guide',
    '/ssc-cgl-preparation-strategy-study-plan-books-mocks',
    '/ssc-cgl-admit-card-selection-dv-checklist',
    '/marketing-partner',
    '/marketing-partner/dashboard',
    '/marketing-partner/terms',
  ]);

  // 1. Qualification Category Routes
  QUAL_CATEGORIES.forEach(cat => {
    routes.add(`/jobs-for/${cat.slug}`);
  });

  // 2. State Routes (slugified)
  const stateList = getStatesWithCounts(JOBS_DATA);
  stateList.forEach(st => {
    routes.add(`/state/${st.slug}`);
  });
  routes.add('/state/all-india');

  // 3. Board Routes (slugified)
  const boardList = getBoardsWithCounts(JOBS_DATA);
  boardList.forEach(bd => {
    routes.add(`/board/${bd.slug}`);
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

  Object.keys(jobsIndexData).forEach(jobId => {
    routes.add(`/${jobId}`);
  });

  JOBS_DATA.forEach(job => {
    if (job.id) routes.add(`/${job.id}`);
  });

  console.log(`📋 Discovered ${routes.size} total routes to pre-render for SSG...`);

  async function renderRoute(routePath: string): Promise<void> {
    let pageHtml = rawTemplate;

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
          "sameAs": job.urls?.[0]?.url || "https://newvacancyalert.in",
          "logo": "https://newvacancyalert.in/logo.png"
        },
        "jobLocation": {
          "@type": "Place",
          "address": parseJobLocationAddress(job.jobLocation, job.board)
        },
        "baseSalary": parseBaseSalary(job.salary)
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

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://newvacancyalert.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": job.board || "Government Jobs",
            "item": "https://newvacancyalert.in/#search"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": job.title,
            "item": `https://newvacancyalert.in/${job.id || cleanRoute}`
          }
        ]
      };
      jsonLdScripts.push(`<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema)}\n</script>`);

      jsonLdScripts.push(`<script id="__SSR_JOB_DATA__" type="application/json">${JSON.stringify(job)}</script>`);
      pageHtml = pageHtml.replace('</head>', `${jsonLdScripts.join('\n')}\n</head>`);
    }

    if (routePath === '/') {
      await fs.promises.writeFile(indexHtmlPath, pageHtml, 'utf-8');
    } else {
      const targetDir = path.join(distDir, cleanRoute);
      await fs.promises.mkdir(targetDir, { recursive: true });
      await fs.promises.writeFile(path.join(targetDir, 'index.html'), pageHtml, 'utf-8');

      // Also create flat .html file for hosts that lookup route.html before directory index
      const flatHtmlPath = path.join(distDir, `${cleanRoute}.html`);
      const flatParentDir = path.dirname(flatHtmlPath);
      if (flatParentDir !== distDir) {
        await fs.promises.mkdir(flatParentDir, { recursive: true });
      }
      await fs.promises.writeFile(flatHtmlPath, pageHtml, 'utf-8');
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
    console.log(`  ⚡ Prerendered ${generatedCount}/${routeList.length} pages...`);
  }

  console.log(`🚀 SSG Pre-rendering completed! Successfully pre-rendered full HTML content & JSON-LD for ${generatedCount} URLs.`);

  // Generate Sitemap, RSS feeds, and robots.txt asynchronously in parallel
  const now = new Date().toISOString().split('T')[0];
  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/articles', priority: '0.8', changefreq: 'daily' },
    { url: '/salary-calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/ssc-exam-calendar', priority: '0.8', changefreq: 'monthly' },
    { url: '/rrb-exam-calendar-2026-27', priority: '0.8', changefreq: 'monthly' },
    { url: '/best-books-for-rrb-ntpc', priority: '0.8', changefreq: 'weekly' },
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  staticRoutes.forEach(route => {
    xml += `\n  <url><loc>${BASE_URL}${route.url}</loc><lastmod>${now}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
  });

  // Qualification Category pages
  QUAL_CATEGORIES.forEach(cat => {
    xml += `\n  <url><loc>${BASE_URL}/jobs-for/${cat.slug}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`;
  });

  // State pages
  stateList.forEach(st => {
    xml += `\n  <url><loc>${BASE_URL}/state/${st.slug}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`;
  });

  // Board pages
  boardList.forEach(bd => {
    xml += `\n  <url><loc>${BASE_URL}/board/${bd.slug}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`;
  });

  // Job Detail pages
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

prerender()
  .then(() => {
    console.log('✨ All static pages successfully generated. Exiting process.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error during SSG prerendering:', err);
    process.exit(1);
  });

