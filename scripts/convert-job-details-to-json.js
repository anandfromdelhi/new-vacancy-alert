import fs from 'fs';
import path from 'path';
import { jobDetailsData } from '../src/data/jobDetails.js';

const jsonPath = path.join(process.cwd(), 'src', 'data', 'jobDetails.json');
fs.writeFileSync(jsonPath, JSON.stringify(jobDetailsData, null, 2));
console.log(`✅ Converted ${Object.keys(jobDetailsData).length} jobs from jobDetails.ts to jobDetails.json!`);
