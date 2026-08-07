import fs from 'fs';

// Check jobDetails.ts syntax and keys
const jobDetailsFile = fs.readFileSync('src/data/jobDetails.ts', 'utf-8');

const keys = [
  'kea-land-surveyor-bhoomapaka-recruitment-2026',
  'icds-sonbhadra-up-anganwadi-worker-recruitment-2026',
  'tnstc-tamilnadu-apprentice-recruitment-2026',
  'kea-grama-adhikari-vao-kalyana-karnataka-recruitment-2026',
  'kea-grama-adhikari-vao-rpc-recruitment-2026'
];

keys.forEach(key => {
  const exists = jobDetailsFile.includes(`'${key}':`);
  console.log(`Key ${key}: ${exists}`);
});
