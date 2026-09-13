import fs from 'fs';
import path from 'path';
import { JOBS_DATA, JobEntry } from '../data/jobsData';

export interface ResolvedJob {
  id: string;
  title: string;
  board: string;
  qualification: string;
  jobLocation?: string;
  lastDate?: string;
  desc?: string;
  vacanciesDetails?: any[];
  eligibility?: any;
  importantDates?: { event: string; date: string }[];
  canonicalUrl: string;
  [key: string]: any;
}

let cachedJobDetails: Record<string, any> | null = null;

/**
 * Loads jobDetails.json on demand from the filesystem at runtime.
 * Avoids inlining 13MB of JSON into the esbuild bundle.
 */
function getJobDetailsMap(): Record<string, any> {
  if (cachedJobDetails) {
    return cachedJobDetails;
  }

  try {
    const baseDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
    const candidatePaths = [
      path.resolve(process.cwd(), 'src/data/jobDetails.json'),
      path.resolve(baseDir, '../src/data/jobDetails.json'),
      path.resolve(baseDir, '../../src/data/jobDetails.json'),
      path.resolve(baseDir, '../data/jobDetails.json'),
      path.resolve(baseDir, 'src/data/jobDetails.json'),
      path.resolve(baseDir, 'data/jobDetails.json')
    ];

    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        cachedJobDetails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return cachedJobDetails!;
      }
    }
  } catch (err) {
    console.warn('[JobResolver] Notice: Could not read jobDetails.json from disk:', err);
  }

  return {};
}

/**
 * Resolves a canonical job record by its canonical job ID.
 * Merges high-level summary metadata from JOBS_DATA with granular post/location details
 * from jobDetails.json if present.
 */
export function resolveJobById(jobId: string): ResolvedJob | null {
  if (!jobId || typeof jobId !== 'string') {
    return null;
  }

  const cleanId = jobId.trim().toLowerCase();

  // 1. Check detailed data
  const detailsMap = getJobDetailsMap();
  const detailedJob = detailsMap[cleanId] || null;

  // 2. Check canonical summary data
  const summaryJob: JobEntry | undefined = JOBS_DATA.find((j) => (j.id || '').toLowerCase() === cleanId);

  if (!detailedJob && !summaryJob) {
    return null;
  }

  // Derive last date from detailed important dates or summary 'l' field
  let lastDate = summaryJob?.l || '';
  if (Array.isArray(detailedJob?.importantDates)) {
    const matchedDate = detailedJob.importantDates.find(
      (d: any) => /last date|closing|application end/i.test(d.event || '')
    );
    if (matchedDate?.date) {
      lastDate = matchedDate.date;
    }
  }

  return {
    ...(summaryJob || {}),
    ...(detailedJob || {}),
    id: cleanId,
    title: detailedJob?.title || summaryJob?.t || cleanId,
    board: detailedJob?.board || summaryJob?.b || '',
    qualification: summaryJob?.q || (Array.isArray(detailedJob?.eligibility?.education) ? detailedJob.eligibility.education.join(' | ') : ''),
    jobLocation: detailedJob?.jobLocation || '',
    lastDate: lastDate || undefined,
    desc: summaryJob?.desc || (detailedJob?.overview && detailedJob.overview[0]) || '',
    canonicalUrl: `https://newvacancyalert.in/${cleanId}`
  };
}
