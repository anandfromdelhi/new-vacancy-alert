import { QUAL_CATEGORIES, STATE_MAP, toSlug, getStateFromJob } from './categoryUtils';
import { AlertOptionItem, AlertCombination, JobAlertOptions } from '../types/alertTypes';

/**
 * Checks if a block of text contains any of the provided keywords using word boundary regex.
 */
function hasAnyKeyword(text: string, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = /^[\w]/.test(kw) ? '\\b' : '';
    const suffix = /[\w]$/.test(kw) ? '\\b' : '';
    return new RegExp(`${prefix}${escaped}${suffix}`, 'i').test(lower);
  });
}

/**
 * Extracts all valid qualification categories matching this job.
 */
export function extractQualificationsFromJob(job: any): AlertOptionItem[] {
  if (!job) return [];

  // Aggregate all textual qualification sources
  const textParts: string[] = [
    job.q || '',
    job.qualification || '',
    job.t || '',
    job.title || '',
    job.b || '',
    job.board || '',
    job.desc || '',
    job.overviewSummary || ''
  ];

  if (job.eligibility?.education) {
    if (Array.isArray(job.eligibility.education)) {
      textParts.push(...job.eligibility.education);
    } else if (typeof job.eligibility.education === 'string') {
      textParts.push(job.eligibility.education);
    }
  }

  if (Array.isArray(job.vacanciesDetails)) {
    for (const v of job.vacanciesDetails) {
      if (v.qualification) textParts.push(v.qualification);
      if (v.postName) textParts.push(v.postName);
    }
  }

  const combinedText = textParts.join(' ').toLowerCase();
  const matched: AlertOptionItem[] = [];

  for (const cat of QUAL_CATEGORIES) {
    if (hasAnyKeyword(combinedText, cat.keywords)) {
      matched.push({
        slug: cat.slug,
        label: cat.name
      });
    }
  }

  // If none matched via keywords, check pipe-separated q or fallback to 'Any Graduate'
  if (matched.length === 0) {
    if (job.q && job.q.trim() && job.q !== 'See eligibility') {
      const parts = job.q.split('|').map((p: string) => p.trim()).filter(Boolean);
      for (const part of parts) {
        matched.push({
          slug: toSlug(part),
          label: part
        });
      }
    }
  }

  if (matched.length === 0) {
    matched.push({
      slug: 'ba',
      label: 'Any Graduate'
    });
  }

  // Deduplicate by slug
  const uniqueMap = new Map<string, AlertOptionItem>();
  for (const item of matched) {
    if (!uniqueMap.has(item.slug)) {
      uniqueMap.set(item.slug, item);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Extracts all valid locations (States/UTs or All India) matching this job.
 */
export function extractLocationsFromJob(job: any): AlertOptionItem[] {
  if (!job) return [{ slug: 'all-india', label: 'All India' }];

  const textParts: string[] = [
    job.jobLocation || '',
    job.b || '',
    job.board || '',
    job.t || '',
    job.title || '',
    job.desc || '',
    job.id || ''
  ];

  if (Array.isArray(job.vacanciesDetails)) {
    for (const v of job.vacanciesDetails) {
      if (v.location) textParts.push(v.location);
      if (v.region) textParts.push(v.region);
    }
  }

  if (Array.isArray(job.regionWiseVacancies)) {
    for (const r of job.regionWiseVacancies) {
      if (r.region) textParts.push(r.region);
    }
  }

  const combinedText = textParts.join(' ').toLowerCase();
  const matched: AlertOptionItem[] = [];

  // Check for explicit All-India markers
  const isNationwide = 
    combinedText.includes('across india') ||
    combinedText.includes('all india') ||
    getStateFromJob(job) === 'All India';

  // Check state map keywords
  for (const [stateName, keywords] of Object.entries(STATE_MAP)) {
    if (hasAnyKeyword(combinedText, keywords)) {
      matched.push({
        slug: toSlug(stateName),
        label: stateName
      });
    }
  }

  // If it is explicitly nationwide or no state matched, include All India
  if (isNationwide || matched.length === 0) {
    // If no state matched at all, All India is the only location
    if (matched.length === 0) {
      matched.push({ slug: 'all-india', label: 'All India' });
    } else if (isNationwide) {
      // Put All India at the beginning if nationwide multi-state drive
      matched.unshift({ slug: 'all-india', label: 'All India' });
    }
  }

  // Deduplicate by slug
  const uniqueMap = new Map<string, AlertOptionItem>();
  for (const item of matched) {
    if (!uniqueMap.has(item.slug)) {
      uniqueMap.set(item.slug, item);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Analyzes the job structure and builds all valid qualification + location combinations.
 * If vacanciesDetails specifies post-specific locations or qualifications, it respects them.
 */
export function extractValidCombinations(
  job: any,
  qualifications?: AlertOptionItem[],
  locations?: AlertOptionItem[]
): AlertCombination[] {
  const quals = qualifications || extractQualificationsFromJob(job);
  const locs = locations || extractLocationsFromJob(job);
  const combinations: AlertCombination[] = [];

  // Check if vacanciesDetails has fine-grained post-level mapping
  let hasDetailedPostMapping = false;

  if (Array.isArray(job.vacanciesDetails) && job.vacanciesDetails.length > 0) {
    for (const v of job.vacanciesDetails) {
      if (v.qualification && (v.location || v.region)) {
        hasDetailedPostMapping = true;
        const postQuals = extractQualificationsFromJob({ q: v.qualification, t: v.postName || '' });
        const postLocs = extractLocationsFromJob({ jobLocation: v.location || v.region || '' });

        for (const q of postQuals) {
          for (const l of postLocs) {
            combinations.push({
              qualificationSlug: q.slug,
              qualificationLabel: q.label,
              locationSlug: l.slug,
              locationLabel: l.label
            });
          }
        }
      }
    }
  }

  // If no granular post mapping was detected, each derived qualification applies to each derived location
  if (!hasDetailedPostMapping || combinations.length === 0) {
    for (const q of quals) {
      for (const l of locs) {
        combinations.push({
          qualificationSlug: q.slug,
          qualificationLabel: q.label,
          locationSlug: l.slug,
          locationLabel: l.label
        });
      }
    }
  }

  // Deduplicate combinations
  const uniqueCombinationsMap = new Map<string, AlertCombination>();
  for (const combo of combinations) {
    const key = `${combo.qualificationSlug}_${combo.locationSlug}`;
    if (!uniqueCombinationsMap.has(key)) {
      uniqueCombinationsMap.set(key, combo);
    }
  }

  return Array.from(uniqueCombinationsMap.values());
}

/**
 * Main extractor function that inspects a job and returns structured alert options.
 */
export function getJobAlertOptions(job: any): JobAlertOptions {
  const jobId = job?.id || 'unknown-job';
  const jobTitle = job?.title || job?.t || 'Government Recruitment';

  const qualifications = extractQualificationsFromJob(job);
  const locations = extractLocationsFromJob(job);
  const validCombinations = extractValidCombinations(job, qualifications, locations);

  const isSingleCombination = validCombinations.length === 1;

  return {
    jobId,
    jobTitle,
    qualifications,
    locations,
    validCombinations,
    isSingleCombination
  };
}
