/**
 * Daily PDF Download Tracker Utility
 * Enforces a maximum limit of 5 PDF downloads per user per day.
 * Displays a warning alert as soon as the user reaches 4 downloads.
 */

const MAX_DAILY_DOWNLOADS = 5;

// Helper to get today's date string in YYYY-MM-DD format
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get storage key for a user (or guest fallback)
function getStorageKey(userUid?: string | null): string {
  const dateStr = getTodayDateString();
  const uid = userUid || 'guest';
  return `pdf_download_count_${dateStr}_${uid}`;
}

/**
 * Get current PDF download count for today
 */
export function getTodayDownloadCount(userUid?: string | null): number {
  if (typeof window === 'undefined') return 0;
  const key = getStorageKey(userUid);
  const countStr = localStorage.getItem(key);
  return countStr ? parseInt(countStr, 10) : 0;
}

/**
 * Check if user can perform a PDF download today
 */
export function canDownloadPdf(userUid?: string | null): boolean {
  const currentCount = getTodayDownloadCount(userUid);
  return currentCount < MAX_DAILY_DOWNLOADS;
}

/**
 * Attempt to execute a PDF download action with daily limit checking & alerts.
 * Returns true if download was executed, false if blocked.
 */
export function executeGatedPdfDownload(
  userUid: string | null | undefined,
  downloadAction: () => void
): boolean {
  const currentCount = getTodayDownloadCount(userUid);

  // Block if daily limit of 5 downloads is already reached
  if (currentCount >= MAX_DAILY_DOWNLOADS) {
    alert(
      "⛔ Daily Download Limit Reached!\n\nYou have already reached your maximum limit of 5 PDF downloads for today. Please come back tomorrow to download more files!"
    );
    return false;
  }

  // Perform the actual download
  downloadAction();

  // Increment download count for today
  const newCount = currentCount + 1;
  const key = getStorageKey(userUid);
  localStorage.setItem(key, String(newCount));

  // Alerts based on download threshold
  if (newCount === 4) {
    setTimeout(() => {
      alert(
        "⚠️ Download Warning:\n\nYou have completed 4 PDF downloads today. You have 1 download remaining for today (Daily Limit: 5)."
      );
    }, 300);
  } else if (newCount === 5) {
    setTimeout(() => {
      alert(
        "ℹ️ Daily Limit Reached:\n\nYou have completed 5 PDF downloads today. You have reached your maximum daily limit for today!"
      );
    }, 300);
  }

  return true;
}
