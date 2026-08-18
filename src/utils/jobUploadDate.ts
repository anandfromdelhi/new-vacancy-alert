import uploadDatesData from '../data/jobUploadDates.json';

const jobUploadDates: Record<string, string> = uploadDatesData as Record<string, string>;

/**
 * Retrieves the site upload date for a given job ID.
 * Falls back to lastUpdated, posting date, or a default date if missing.
 */
export function getJobUploadDate(jobId?: string, fallbackDate?: string): string {
  if (jobId && jobUploadDates[jobId]) {
    return jobUploadDates[jobId];
  }
  if (fallbackDate && fallbackDate.trim() !== '' && fallbackDate !== '–') {
    return fallbackDate;
  }
  return '18 August 2026';
}
