import fs from 'fs';

let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
home = home.replace(
  "id: 'dudc-bidar-pourakarmika-recruitment-2026',",
  "id: 'dudc-bidar-pourakarmika-recruitment-2026',\n    u: 'https://bidar.nic.in',"
);
home = home.replace(
  "id: 'tnsrlm-kanchipuram-block-coordinator-2026',",
  "id: 'tnsrlm-kanchipuram-block-coordinator-2026',\n    u: '#',"
);
home = home.replace(
  "id: 'msrlm-solapur-ifc-anchor-crp-2026',",
  "id: 'msrlm-solapur-ifc-anchor-crp-2026',\n    u: '#',"
);
fs.writeFileSync('src/pages/HomePage.tsx', home, 'utf8');

let details = fs.readFileSync('src/data/jobDetails.ts', 'utf8');
details = details.replace(/{ category: 'All Candidates', fee: 'No Fee mentioned' }/g, "{ category: 'All Candidates', fee: 'No Fee mentioned', refund: 'NA' }");
details = details.replace(/{ category: 'All Candidates', fee: 'No Fee' }/g, "{ category: 'All Candidates', fee: 'No Fee', refund: 'NA' }");

// Replace postName -> category, vacancies -> count for these specific blocks
details = details.replace(/postName: 'Pourakarmika \(Bidar Mahanagara Palike\)',\n\s*vacancies: 205/g, "category: 'Pourakarmika (Bidar Mahanagara Palike)', count: 205");
details = details.replace(/postName: 'Pourakarmika \(Nagarasabe Basavakalyana\)',\n\s*vacancies: 59/g, "category: 'Pourakarmika (Nagarasabe Basavakalyana)', count: 59");
details = details.replace(/postName: 'Block Coordinator \(Kanchipuram-2, Kundrathur-3, Uthiramerur-2, Walajabad-4, Sriperumbudur-3\)', vacancies: 14/g, "category: 'Block Coordinator (Kanchipuram-2, Kundrathur-3, Uthiramerur-2, Walajabad-4, Sriperumbudur-3)', count: 14");
details = details.replace(/postName: 'IFC Block Anchor', vacancies: 5/g, "category: 'IFC Block Anchor', count: 5");
details = details.replace(/postName: 'Senior CRP', vacancies: 12/g, "category: 'Senior CRP', count: 12");

fs.writeFileSync('src/data/jobDetails.ts', details, 'utf8');
console.log('Fixed types!');
