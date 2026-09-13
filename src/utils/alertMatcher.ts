import { extractQualificationsFromJob, extractLocationsFromJob, extractValidCombinations } from './alertOptionsExtractor';
import { JobAlertSubscription, NotificationLog } from '../types/alertTypes';

/**
 * Evaluates whether a given job matches a user's explicit subscription combination.
 * 
 * Returns true if and only if:
 * 1. subscription.qualification matches one of the job's derived qualifications.
 * 2. subscription.location matches one of the job's derived locations.
 * 3. The qualification + location pair forms a valid combination for this job.
 * 
 * Canonically uses `job.id` and derived attributes, ignoring whatever URL or section the job was viewed in.
 */
export function matchJobWithSubscription(
  job: any,
  subscription: Pick<JobAlertSubscription, 'qualification' | 'location'>
): boolean {
  if (!job || !subscription || !subscription.qualification || !subscription.location) {
    return false;
  }

  const validCombinations = extractValidCombinations(job);

  // If the job has explicitly derived combinations, check for an exact match
  if (validCombinations.length > 0) {
    return validCombinations.some(
      (combo) =>
        combo.qualificationSlug === subscription.qualification &&
        combo.locationSlug === subscription.location
    );
  }

  // Fallback to independent qualification and location set membership
  const jobQualifications = extractQualificationsFromJob(job);
  const jobLocations = extractLocationsFromJob(job);

  const hasQual = jobQualifications.some((q) => q.slug === subscription.qualification);
  const hasLoc = jobLocations.some((l) => l.slug === subscription.location);

  return hasQual && hasLoc;
}

/**
 * Filters a list of user subscriptions and returns all active subscriptions that match the job.
 * Ensures that even if a job appears in multiple website sections, matching is evaluated
 * against the single canonical job.
 */
export function findMatchingSubscriptionsForJob(
  job: any,
  subscriptions: JobAlertSubscription[]
): JobAlertSubscription[] {
  if (!job || !Array.isArray(subscriptions)) return [];

  return subscriptions.filter(
    (sub) => sub.isActive && matchJobWithSubscription(job, sub)
  );
}

/**
 * Checks whether a notification log already exists for a given canonical job ID and subscription ID.
 * Prevents sending duplicate notifications across Telegram or any other channel.
 */
export function isNotificationAlreadySent(
  logs: NotificationLog[],
  jobId: string,
  subscriptionId: string
): boolean {
  if (!Array.isArray(logs) || !jobId || !subscriptionId) return false;
  return logs.some(
    (log) => log.jobId === jobId && log.subscriptionId === subscriptionId && log.status === 'sent'
  );
}
