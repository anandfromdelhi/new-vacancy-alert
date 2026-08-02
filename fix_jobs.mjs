import fs from 'fs';

let content = fs.readFileSync('src/data/jobDetails.ts', 'utf8');

// Replace metaDescription with seoDescription
content = content.replace(/metaDescription:/g, 'seoDescription:');

// Remove publishedDate
content = content.replace(/\s*publishedDate: '[^']+',/g, '');

// Add missing required fields for the new jobs
// The new jobs are at the top, let's just insert them after id: '...'

const jobsToFix = [
  'dudc-bidar-pourakarmika-recruitment-2026',
  'tnsrlm-kanchipuram-block-coordinator-2026',
  'msrlm-solapur-ifc-anchor-crp-2026'
];

for (const j of jobsToFix) {
  content = content.replace(new RegExp(`(id: '${j}',)`), 
    `$1\n    seoTitle: '${j.replace(/-/g, ' ')}',\n    lastUpdated: 'July 29, 2026',\n    overview: [],\n    highlights: [],\n    faqs: [],`
  );
}

fs.writeFileSync('src/data/jobDetails.ts', content, 'utf8');
console.log('Fixed interface compliance!');
