import { jobDetailsData, JobDetail } from '../data/jobDetails.js';

const BASE_URL = 'https://newvacancyalert.in';

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseRfc822Date(dateStr?: string): string {
  if (!dateStr) return new Date().toUTCString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toUTCString();
    }
  } catch {
    // Fallback to current time
  }
  return new Date().toUTCString();
}

export function generateRssXml(): string {
  const jobs: JobDetail[] = Object.values(jobDetailsData);
  const buildDate = new Date().toUTCString();

  let itemsXml = '';

  jobs.forEach((job) => {
    const jobUrl = `${BASE_URL}/${job.id}`;
    const pubDate = parseRfc822Date(job.lastUpdated);
    const category = job.board ? `${job.board} Recruitment` : 'Government Jobs';
    const summary = `${job.title} by ${job.board || 'Govt Department'}. Location: ${job.jobLocation || 'India'}. Total Vacancies: ${job.vacancies || 'Various'}. ${job.overview?.[0] || job.seoDescription || ''}`;

    itemsXml += `
    <item>
      <title>${escapeXml(job.title)}</title>
      <link>${escapeXml(jobUrl)}</link>
      <guid isPermaLink="true">${escapeXml(jobUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(summary)}</description>
      <category>${escapeXml(category)}</category>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>NewVacancyAlert.in - Latest Govt Jobs &amp; Recruitment Alerts 2026</title>
    <link>${BASE_URL}</link>
    <description>Latest central and state government job notifications, vacancies, eligibility, admit cards, and online application links across India.</description>
    <language>en-in</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>NewVacancyAlert.in - Govt Jobs Portal</title>
      <link>${BASE_URL}</link>
    </image>${itemsXml}
  </channel>
</rss>`;
}
