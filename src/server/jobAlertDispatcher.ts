import { getAdminDb } from './firebaseAdmin';
import { resolveJobById, ResolvedJob } from './jobResolver';
import { extractValidCombinations } from '../utils/alertOptionsExtractor';
import { sendTelegramMessage } from './telegramService';
import { 
  JobAlertSubscription, 
  TelegramLink, 
  NotificationLog, 
  DispatchMetrics, 
  AlertCombination 
} from '../types/alertTypes';

const NOTIFICATION_LOGS_COLLECTION = 'notification_logs';
const TELEGRAM_LINKS_COLLECTION = 'telegram_links';
const SUBSCRIPTIONS_COLLECTION = 'job_alert_subscriptions';

// Conservative defaults to prevent runaway execution
const DEFAULT_MAX_BATCH_SIZE = 100;
const ABSOLUTE_MAX_BATCH_SIZE = 500;
const MAX_EXECUTION_TIMEOUT_MS = 60_000; // 60 seconds
const INTER_MESSAGE_DELAY_MS = 75; // ~13 msgs/sec, safe under Telegram's 30/sec limit

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Escapes characters for Telegram HTML parse mode safely.
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generates the deterministic collision-safe notification log ID.
 */
export function buildNotificationLogId(userId: string, subscriptionId: string, jobId: string): string {
  return `${userId}_${subscriptionId}_${jobId}`;
}

/**
 * Formats a clean, high-clarity Telegram notification in HTML parse mode.
 * Explicitly includes the matched qualification and location as required.
 */
export function formatTelegramJobAlert(params: {
  job: ResolvedJob;
  qualificationLabel: string;
  locationLabel: string;
}): string {
  const { job, qualificationLabel, locationLabel } = params;

  let message = `🔔 <b>NEW JOB ALERT</b>\n\n`;
  message += `<b>${escapeHtml(job.title)}</b>\n\n`;
  message += `🎓 <b>Qualification:</b> ${escapeHtml(qualificationLabel)}\n`;
  message += `📍 <b>Location:</b> ${escapeHtml(locationLabel)}\n`;

  if (job.board) {
    message += `🏢 <b>Organization:</b> ${escapeHtml(job.board)}\n`;
  }

  if (job.lastDate) {
    message += `📅 <b>Last Date:</b> ${escapeHtml(job.lastDate)}\n`;
  }

  message += `\n👉 <b>View Job Details:</b>\n${job.canonicalUrl}\n\n`;
  message += `ℹ️ <i>You are receiving this because you subscribed to:</i>\n`;
  message += `<b>${escapeHtml(qualificationLabel)} → ${escapeHtml(locationLabel)}</b>`;

  return message;
}

export interface DispatchOptions {
  jobId: string;
  dryRun?: boolean;
  limit?: number;
}

/**
 * Main Dispatcher: Finds active subscriptions, matches against job valid combinations,
 * verifies Telegram connectivity, prevents duplicates via atomic Firestore transaction,
 * and sends alerts with controlled rate-limiting.
 */
export async function dispatchJobAlert(options: DispatchOptions): Promise<DispatchMetrics> {
  const startTime = Date.now();
  const { jobId, dryRun = false } = options;
  const batchLimit = Math.min(options.limit || DEFAULT_MAX_BATCH_SIZE, ABSOLUTE_MAX_BATCH_SIZE);

  const metrics: DispatchMetrics = {
    jobId,
    matchedSubscriptions: 0,
    telegramConnected: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    duplicates: 0,
    dryRun,
    durationMs: 0
  };

  // 1. Resolve canonical job
  const job = resolveJobById(jobId);
  if (!job) {
    throw new Error(`Job not found with canonical ID: ${jobId}`);
  }
  metrics.jobTitle = job.title;

  // 2. Extract job's explicit valid qualification + location combinations
  const validCombinations = extractValidCombinations(job);
  if (validCombinations.length === 0) {
    console.log(`[JobAlertDispatcher] No valid combinations for job ${jobId}. Ending dispatch.`);
    metrics.durationMs = Date.now() - startTime;
    return metrics;
  }

  const validComboMap = new Map<string, AlertCombination>();
  for (const combo of validCombinations) {
    validComboMap.set(`${combo.qualificationSlug}_${combo.locationSlug}`, combo);
  }

  const db = getAdminDb();
  if (!db) {
    throw new Error('Firestore Admin SDK is not available. Please verify Firebase credentials.');
  }

  // 3. Query active subscriptions across the database
  const subsSnap = await db.collection(SUBSCRIPTIONS_COLLECTION)
    .where('isActive', '==', true)
    .get();

  if (subsSnap.empty) {
    console.log(`[JobAlertDispatcher] No active subscriptions found in database.`);
    metrics.durationMs = Date.now() - startTime;
    return metrics;
  }

  // 4. In-memory matching against explicit valid combinations
  const matchedSubscriptions: (JobAlertSubscription & { combo: AlertCombination })[] = [];
  for (const doc of subsSnap.docs) {
    const data = doc.data() as JobAlertSubscription;
    const key = `${data.qualification}_${data.location}`;
    const matchedCombo = validComboMap.get(key);
    if (matchedCombo) {
      matchedSubscriptions.push({
        ...data,
        id: doc.id,
        combo: matchedCombo
      });
    }
  }

  metrics.matchedSubscriptions = matchedSubscriptions.length;
  if (matchedSubscriptions.length === 0) {
    console.log(`[JobAlertDispatcher] Zero subscriptions matched valid combinations for job ${jobId}.`);
    metrics.durationMs = Date.now() - startTime;
    return metrics;
  }

  // Enforce batch size limit
  const subscriptionsToProcess = matchedSubscriptions.slice(0, batchLimit);

  // 5. Batch-retrieve Telegram links for matched candidate users
  const uniqueUserIds = Array.from(new Set(subscriptionsToProcess.map((s) => s.userId)));
  const userTelegramMap = new Map<string, TelegramLink>();

  // Chunk user ID reads in groups of 100 (Firestore getAll limit is 1000)
  for (let i = 0; i < uniqueUserIds.length; i += 100) {
    const chunk = uniqueUserIds.slice(i, i + 100);
    const refs = chunk.map((uid) => db.collection(TELEGRAM_LINKS_COLLECTION).doc(uid));
    const snaps = await db.getAll(...refs);
    for (const snap of snaps) {
      if (snap.exists) {
        const data = snap.data() as TelegramLink;
        if (data.isActive && data.telegramChatId) {
          userTelegramMap.set(snap.id, data);
        }
      }
    }
  }

  // 6. Process subscriptions sequentially with atomic claim and rate-limiting
  for (const sub of subscriptionsToProcess) {
    // Check timeout
    if (Date.now() - startTime > MAX_EXECUTION_TIMEOUT_MS) {
      console.warn(`[JobAlertDispatcher] Dispatch execution time exceeded ${MAX_EXECUTION_TIMEOUT_MS}ms. Stopping batch.`);
      break;
    }

    const telegramLink = userTelegramMap.get(sub.userId);
    if (!telegramLink) {
      // User has not connected Telegram or connection is paused
      metrics.skipped++;
      continue;
    }

    metrics.telegramConnected++;

    const logId = buildNotificationLogId(sub.userId, sub.id, job.id);
    const logRef = db.collection(NOTIFICATION_LOGS_COLLECTION).doc(logId);

    // Format message customized for this subscription
    const messageText = formatTelegramJobAlert({
      job,
      qualificationLabel: sub.combo.qualificationLabel || sub.qualificationLabel,
      locationLabel: sub.combo.locationLabel || sub.locationLabel
    });

    if (dryRun) {
      // In dry run, check if log already exists without modifying it
      const existingSnap = await logRef.get();
      if (existingSnap.exists && existingSnap.data()?.status === 'sent') {
        metrics.duplicates++;
      } else {
        metrics.sent++;
      }
      continue;
    }

    // ATOMIC FIRESTORE CLAIM (Adjustment 1 & 2):
    // Use an atomic transaction so two simultaneous dispatch requests cannot double-send
    let canSend = false;
    let skipReason = '';

    try {
      await db.runTransaction(async (transaction) => {
        const snap = await transaction.get(logRef);
        if (snap.exists) {
          const data = snap.data();
          if (data?.status === 'sent') {
            canSend = false;
            skipReason = 'already_sent';
            return; // Leave original 'sent' document completely untouched!
          }
          if (data?.status === 'in-flight') {
            const claimedAtMs = new Date(data.claimedAt || 0).getTime();
            // If claimed less than 2 minutes ago, another process is actively delivering
            if (Date.now() - claimedAtMs < 120_000) {
              canSend = false;
              skipReason = 'in_flight';
              return;
            }
          }
        }

        // Atomically claim the delivery slot
        const nowIso = new Date().toISOString();
        transaction.set(logRef, {
          id: logId,
          userId: sub.userId,
          subscriptionId: sub.id,
          jobId: job.id,
          jobTitle: job.title,
          channel: 'telegram',
          status: 'in-flight',
          telegramChatId: telegramLink.telegramChatId,
          qualification: sub.qualification,
          qualificationLabel: sub.combo.qualificationLabel || sub.qualificationLabel,
          location: sub.location,
          locationLabel: sub.combo.locationLabel || sub.locationLabel,
          claimedAt: nowIso,
          createdAt: snap.exists ? (snap.data()?.createdAt || nowIso) : nowIso
        }, { merge: true });

        canSend = true;
      });
    } catch (txErr: any) {
      console.error(`[JobAlertDispatcher] Transaction error for log ${logId}:`, txErr.message);
      metrics.failed++;
      continue;
    }

    if (!canSend) {
      if (skipReason === 'already_sent' || skipReason === 'in_flight') {
        metrics.duplicates++;
      } else {
        metrics.skipped++;
      }
      continue;
    }

    // Execute real Telegram send
    const sendResult = await sendTelegramMessage(telegramLink.telegramChatId, messageText);

    if (sendResult.success) {
      await logRef.update({
        status: 'sent',
        sentAt: new Date().toISOString(),
        telegramMessageId: sendResult.messageId || null
      });
      metrics.sent++;
    } else {
      await logRef.update({
        status: 'failed',
        errorMessage: sendResult.error || 'Failed to send Telegram message'
      });
      metrics.failed++;

      // If user blocked or deactivated bot, update connection status
      if (sendResult.blockedOrDeactivated) {
        console.warn(`[JobAlertDispatcher] User ${sub.userId} blocked bot. Deactivating telegram_links record.`);
        try {
          await db.collection(TELEGRAM_LINKS_COLLECTION).doc(sub.userId).update({
            isActive: false,
            updatedAt: new Date().toISOString(),
            disconnectReason: 'bot_blocked_by_user'
          });
        } catch {}
      }
    }

    // Rate-limiting delay between messages
    if (sendResult.rateLimited && sendResult.retryAfterSeconds) {
      console.warn(`[JobAlertDispatcher] Rate limited. Pausing for ${sendResult.retryAfterSeconds}s...`);
      await sleep(sendResult.retryAfterSeconds * 1000);
    } else {
      await sleep(INTER_MESSAGE_DELAY_MS);
    }
  }

  metrics.durationMs = Date.now() - startTime;
  console.log(
    `[JOB ALERT] job=${job.id} matched=${metrics.matchedSubscriptions} ` +
    `telegramConnected=${metrics.telegramConnected} sent=${metrics.sent} ` +
    `skipped=${metrics.skipped} duplicates=${metrics.duplicates} failed=${metrics.failed} ` +
    `dryRun=${metrics.dryRun} duration=${metrics.durationMs}ms`
  );

  return metrics;
}

export interface AdminTestResult {
  success: boolean;
  mode: 'ADMIN_TEST_ONLY';
  productionRecipients: 0;
  adminUserId: string;
  adminEmail: string;
  telegramChatId: string;
  jobId: string;
  jobTitle: string;
  matchedCombinations: AlertCombination[];
  messagePreview: string;
  sentAt: string;
  telegramMessageId?: number | null;
}

/**
 * SAFE TEST MODE (Adjustment 5 & Part 11):
 * Structurally admin-only test function.
 * Resolves ONLY the authenticated admin's own connected Telegram chat.
 * Never queries or broadcasts to other users.
 */
export async function dispatchTestJobAlertToAdmin(params: {
  adminUserId: string;
  adminEmail: string;
  jobId: string;
}): Promise<AdminTestResult> {
  const { adminUserId, adminEmail, jobId } = params;

  // 1. Resolve canonical job
  const job = resolveJobById(jobId);
  if (!job) {
    throw new Error(`Job not found with ID: ${jobId}`);
  }

  // 2. Resolve job's valid combinations
  const validCombinations = extractValidCombinations(job);
  if (validCombinations.length === 0) {
    throw new Error(`Job ${jobId} does not have any valid qualification/location combinations.`);
  }

  // 3. Resolve Admin's own connected Telegram chat
  const db = getAdminDb();
  if (!db) {
    throw new Error('Firestore Admin SDK is not available.');
  }

  const adminLinkDoc = await db.collection(TELEGRAM_LINKS_COLLECTION).doc(adminUserId).get();
  if (!adminLinkDoc.exists) {
    throw new Error(
      'Admin Telegram account is not connected. Please open /manage-alerts and connect Telegram before testing.'
    );
  }

  const adminLink = adminLinkDoc.data() as TelegramLink;
  if (!adminLink.isActive || !adminLink.telegramChatId) {
    throw new Error(
      'Admin Telegram link is currently disconnected or inactive. Please reconnect on /manage-alerts.'
    );
  }

  // 4. Format test message using primary matching combination
  const primaryCombo = validCombinations[0];
  const messageText = formatTelegramJobAlert({
    job,
    qualificationLabel: primaryCombo.qualificationLabel,
    locationLabel: primaryCombo.locationLabel
  });

  // 5. Send REAL Telegram message ONLY to the admin's verified chat
  const sendResult = await sendTelegramMessage(adminLink.telegramChatId, messageText);
  if (!sendResult.success) {
    throw new Error(`Failed to deliver test message to Telegram: ${sendResult.error}`);
  }

  // 6. Record test log in notification_logs
  const testLogId = `test_${adminUserId}_${job.id}_${Date.now()}`;
  try {
    await db.collection(NOTIFICATION_LOGS_COLLECTION).doc(testLogId).set({
      id: testLogId,
      userId: adminUserId,
      subscriptionId: 'admin_test',
      jobId: job.id,
      jobTitle: job.title,
      channel: 'telegram',
      status: 'sent',
      telegramChatId: adminLink.telegramChatId,
      telegramMessageId: sendResult.messageId || null,
      qualification: primaryCombo.qualificationSlug,
      qualificationLabel: primaryCombo.qualificationLabel,
      location: primaryCombo.locationSlug,
      locationLabel: primaryCombo.locationLabel,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isTest: true,
      details: `Admin test alert sent to ${adminEmail}`
    });
  } catch (err: any) {
    console.warn('[JobAlertDispatcher] Notice: Could not save test log to Firestore:', err.message);
  }

  return {
    success: true,
    mode: 'ADMIN_TEST_ONLY',
    productionRecipients: 0,
    adminUserId,
    adminEmail,
    telegramChatId: adminLink.telegramChatId,
    jobId: job.id,
    jobTitle: job.title,
    matchedCombinations: validCombinations,
    messagePreview: messageText,
    sentAt: new Date().toISOString(),
    telegramMessageId: sendResult.messageId || null
  };
}
