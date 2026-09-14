import { getAdminDb } from './firebaseAdmin';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import { getJobUploadDate } from '../utils/jobUploadDate';
import { get24HourDispatchWindow, isJobEligibleForDispatch } from '../utils/jobDateFilter';
import { dispatchJobAlert } from './jobAlertDispatcher';
import { DispatchMetrics } from '../types/alertTypes';

export const BASELINE_COLLECTION = 'job_alert_baseline';
export const SCHEDULER_RUNS_COLLECTION = 'scheduler_runs';
export const SCHEDULER_STATE_COLLECTION = 'scheduler_state';

export interface AutomaticDispatchOptions {
  dryRun?: boolean;
  forceRun?: boolean;
  limitPerJob?: number;
  referenceDate?: Date;
  trigger?: 'github_actions' | 'manual_workflow' | 'admin' | 'test';
}

export interface AutomaticDispatchResult {
  success: boolean;
  runId: string;
  windowStart: string;
  windowEnd: string;
  windowStartIst: string;
  windowEndIst: string;
  totalCanonicalJobsScanned: number;
  baselinedJobsCount: number;
  eligibleJobs: number;
  eligibleJobIds: string[];
  jobsProcessed: number;
  matchedSubscriptions: number;
  telegramConnected: number;
  sent: number;
  skipped: number;
  duplicates: number;
  failed: number;
  durationMs: number;
  dryRun: boolean;
  status: 'success' | 'partial_failure' | 'failed';
  message?: string;
  perJobResults?: Array<{
    jobId: string;
    uploadDate: string;
    metrics: DispatchMetrics;
  }>;
}

/**
 * Loads set of pre-existing job IDs from the baseline collection in Firestore.
 */
export async function getBaselinedJobIds(): Promise<Set<string>> {
  const db = getAdminDb();
  if (!db) {
    console.warn('[Scheduler] Firestore Admin DB unavailable for baseline lookup. Proceeding with empty baseline set.');
    return new Set<string>();
  }

  try {
    const snap = await db.collection(BASELINE_COLLECTION).get();
    const set = new Set<string>();
    snap.forEach((doc) => set.add(doc.id));
    return set;
  } catch (err: any) {
    console.warn('[Scheduler] Could not fetch baselined jobs from Firestore:', err.message);
    return new Set<string>();
  }
}

/**
 * Core Automatic Job Alert Dispatcher (Phase 4).
 * 
 * 1. Calculates the previous 24-hour window ending at current execution time.
 * 2. Scans canonical static jobs from JOBS_DATA.
 * 3. Identifies jobs whose existing Upload Date falls within that window.
 * 4. Checks against the first-run baseline so pre-existing jobs are never sent.
 * 5. Passes eligible jobs sequentially through the existing Phase 3 dispatcher.
 * 6. Enforces duplicate protection, rate-limiting, and error-resilience.
 * 7. Logs the run to Firestore and returns a clean, sanitized response.
 */
export async function runAutomaticJobAlertDispatch(
  options: AutomaticDispatchOptions = {}
): Promise<AutomaticDispatchResult> {
  const startTime = Date.now();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const dryRun = Boolean(options.dryRun);
  const trigger = options.trigger || 'github_actions';

  // 1. Determine 24-hour window
  const windowInfo = get24HourDispatchWindow(options.referenceDate);
  const { windowStart, windowEnd, windowStartIso, windowEndIso, windowStartIst, windowEndIst } = windowInfo;

  console.log(`[Scheduler:${runId}] Starting job alert dispatch run.`);
  console.log(`[Scheduler:${runId}] Window: ${windowStartIst} -> ${windowEndIst} (UTC: ${windowStartIso} -> ${windowEndIso})`);

  // 2. Fetch baseline set (to prevent first-run blast of pre-existing jobs)
  const baselinedJobIds = await getBaselinedJobIds();

  // 3. Scan canonical jobs and filter by existing Upload Date
  const eligibleJobEntries: Array<{ job: JobEntry; uploadDate: string }> = [];

  for (const job of JOBS_DATA) {
    if (!job.id) continue;

    // A. Check if job is part of the established pre-existing baseline
    if (baselinedJobIds.has(job.id) && !options.forceRun) {
      continue;
    }

    // B. Retrieve existing Upload Date (source of truth)
    const uploadDateStr = getJobUploadDate(job.id, (job as any).lastUpdated || job.d);

    // C. Check 24-hour window eligibility
    const evalResult = isJobEligibleForDispatch(uploadDateStr, windowStart, windowEnd);
    if (evalResult.isEligible) {
      eligibleJobEntries.push({
        job,
        uploadDate: uploadDateStr
      });
    }
  }

  console.log(
    `[Scheduler:${runId}] Scanned ${JOBS_DATA.length} canonical jobs. ` +
    `Found ${eligibleJobEntries.length} eligible jobs within previous 24 hours ` +
    `(${baselinedJobIds.size} jobs excluded via baseline).`
  );

  const result: AutomaticDispatchResult = {
    success: true,
    runId,
    windowStart: windowStartIso,
    windowEnd: windowEndIso,
    windowStartIst,
    windowEndIst,
    totalCanonicalJobsScanned: JOBS_DATA.length,
    baselinedJobsCount: baselinedJobIds.size,
    eligibleJobs: eligibleJobEntries.length,
    eligibleJobIds: eligibleJobEntries.map((e) => e.job.id!),
    jobsProcessed: 0,
    matchedSubscriptions: 0,
    telegramConnected: 0,
    sent: 0,
    skipped: 0,
    duplicates: 0,
    failed: 0,
    durationMs: 0,
    dryRun,
    status: 'success',
    perJobResults: []
  };

  // If no eligible jobs found in this 24-hour cycle, exit cleanly
  if (eligibleJobEntries.length === 0) {
    result.durationMs = Date.now() - startTime;
    result.message = 'No new jobs were uploaded in the previous 24-hour window.';
    await logSchedulerRun(result, trigger);
    return result;
  }

  // 4. Dispatch alerts for each eligible job through the existing Phase 3 dispatcher
  for (const item of eligibleJobEntries) {
    const jobId = item.job.id!;
    try {
      console.log(`[Scheduler:${runId}] Processing eligible job: ${jobId} (Upload Date: ${item.uploadDate})...`);
      const jobMetrics = await dispatchJobAlert({
        jobId,
        dryRun,
        limit: options.limitPerJob
      });

      result.jobsProcessed++;
      result.matchedSubscriptions += jobMetrics.matchedSubscriptions;
      result.telegramConnected += jobMetrics.telegramConnected;
      result.sent += jobMetrics.sent;
      result.skipped += jobMetrics.skipped;
      result.duplicates += jobMetrics.duplicates;
      result.failed += jobMetrics.failed;

      result.perJobResults!.push({
        jobId,
        uploadDate: item.uploadDate,
        metrics: jobMetrics
      });
    } catch (jobErr: any) {
      console.error(`[Scheduler:${runId}] Error processing job ${jobId}:`, jobErr.message);
      result.failed++;
      result.status = 'partial_failure';
    }
  }

  result.durationMs = Date.now() - startTime;
  if (result.failed > 0 && result.sent === 0 && result.matchedSubscriptions > 0) {
    result.status = 'failed';
  } else if (result.failed > 0) {
    result.status = 'partial_failure';
  } else {
    result.status = 'success';
  }

  console.log(
    `[Scheduler:${runId}] Finished dispatch. Status: ${result.status}. ` +
    `Processed: ${result.jobsProcessed}/${result.eligibleJobs} jobs. ` +
    `Matched: ${result.matchedSubscriptions}, Telegram Connected: ${result.telegramConnected}, ` +
    `Sent: ${result.sent}, Skipped: ${result.skipped}, Duplicates: ${result.duplicates}, Failed: ${result.failed}. ` +
    `Duration: ${result.durationMs}ms`
  );

  // 5. Record run log in Firestore
  await logSchedulerRun(result, trigger);

  return result;
}

/**
 * Admin-Only First-Run Baseline Initialization.
 * 
 * Scans all existing canonical jobs and marks them as known/baselined.
 * SENDS ZERO Telegram messages.
 * Completely idempotent.
 */
export async function initializeJobAlertBaseline(): Promise<{
  success: boolean;
  totalBaselined: number;
  baselinedAt: string;
  message: string;
}> {
  const db = getAdminDb();
  if (!db) {
    throw new Error('Firestore Admin SDK is not available. Please verify credentials.');
  }

  const nowIso = new Date().toISOString();
  let baselinedCount = 0;
  const jobsToBaseline = JOBS_DATA.filter((j) => Boolean(j.id));

  // Process in batches of 400 (under Firestore limit of 500)
  for (let i = 0; i < jobsToBaseline.length; i += 400) {
    const chunk = jobsToBaseline.slice(i, i + 400);
    const batch = db.batch();

    for (const job of chunk) {
      const jobId = job.id!;
      const uploadDateStr = getJobUploadDate(jobId, (job as any).lastUpdated || job.d);
      const ref = db.collection(BASELINE_COLLECTION).doc(jobId);

      batch.set(ref, {
        jobId,
        title: job.t || '',
        board: job.b || '',
        uploadDate: uploadDateStr,
        baselinedAt: nowIso,
        status: 'baselined'
      }, { merge: true });
    }

    await batch.commit();
    baselinedCount += chunk.length;
  }

  // Update baseline summary document
  await db.collection(SCHEDULER_STATE_COLLECTION).doc('baseline_summary').set({
    totalBaselined: baselinedCount,
    baselinedAt: nowIso,
    status: 'complete',
    notes: 'Initial Phase 4 baseline established. Pre-existing jobs will not trigger alert blasts.'
  }, { merge: true });

  console.log(`[Baseline] Successfully baselined ${baselinedCount} canonical jobs. ZERO Telegram messages sent.`);

  return {
    success: true,
    totalBaselined: baselinedCount,
    baselinedAt: nowIso,
    message: `Successfully marked ${baselinedCount} existing jobs as baselined. ZERO Telegram alerts sent.`
  };
}

/**
 * Safely writes a sanitized execution log to Firestore.
 * Never logs secrets, bot tokens, or private credentials.
 */
async function logSchedulerRun(result: AutomaticDispatchResult, trigger: string): Promise<void> {
  const db = getAdminDb();
  if (!db) return;

  try {
    await db.collection(SCHEDULER_RUNS_COLLECTION).doc(result.runId).set({
      runId: result.runId,
      trigger,
      status: result.status,
      windowStart: result.windowStart,
      windowEnd: result.windowEnd,
      windowStartIst: result.windowStartIst,
      windowEndIst: result.windowEndIst,
      totalCanonicalJobsScanned: result.totalCanonicalJobsScanned,
      baselinedJobsCount: result.baselinedJobsCount,
      eligibleJobs: result.eligibleJobs,
      eligibleJobIds: result.eligibleJobIds,
      jobsProcessed: result.jobsProcessed,
      matchedSubscriptions: result.matchedSubscriptions,
      telegramConnected: result.telegramConnected,
      sent: result.sent,
      skipped: result.skipped,
      duplicates: result.duplicates,
      failed: result.failed,
      durationMs: result.durationMs,
      dryRun: result.dryRun,
      createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.warn(`[Scheduler] Notice: Could not write scheduler run log to Firestore:`, err.message);
  }
}
