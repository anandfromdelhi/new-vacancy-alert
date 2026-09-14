/**
 * Utility for parsing canonical job Upload Dates and evaluating
 * eligibility within the 24-hour alert dispatch window.
 * 
 * Supports both:
 * 1. Exact timestamps / ISO-8601 strings (evaluated down to millisecond precision)
 * 2. Date-only strings (e.g. "13 September 2026", "2026-09-13", "29-07-2026")
 *    evaluated against the 24-hour IST operational window.
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

export interface ParsedDateInfo {
  isValid: boolean;
  hasTime: boolean;
  timestamp: number | null;
  year?: number;
  month?: number; // 0-indexed
  day?: number;
  raw: string;
}

/**
 * Parses an existing Upload Date string into structured date/timestamp information.
 * Does NOT invent or forge a fake upload timestamp.
 */
export function parseUploadDateString(input?: string | number | Date | null): ParsedDateInfo {
  if (input === null || input === undefined) {
    return { isValid: false, hasTime: false, timestamp: null, raw: '' };
  }

  if (typeof input === 'number') {
    const d = new Date(input);
    const valid = !isNaN(d.getTime());
    return {
      isValid: valid,
      hasTime: true,
      timestamp: valid ? d.getTime() : null,
      year: valid ? d.getUTCFullYear() : undefined,
      month: valid ? d.getUTCMonth() : undefined,
      day: valid ? d.getUTCDate() : undefined,
      raw: String(input)
    };
  }

  if (input instanceof Date) {
    const valid = !isNaN(input.getTime());
    return {
      isValid: valid,
      hasTime: true,
      timestamp: valid ? input.getTime() : null,
      year: valid ? input.getUTCFullYear() : undefined,
      month: valid ? input.getUTCMonth() : undefined,
      day: valid ? input.getUTCDate() : undefined,
      raw: input.toISOString()
    };
  }

  const raw = String(input).trim();
  if (!raw || raw === '–' || raw === '-') {
    return { isValid: false, hasTime: false, timestamp: null, raw };
  }

  // 1. Check for ISO 8601 or strings with explicit time (e.g. 2026-09-13T08:00:00Z or containing ":")
  if (/T\d{2}:\d{2}/.test(raw) || /\s\d{1,2}:\d{2}/.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return {
        isValid: true,
        hasTime: true,
        timestamp: d.getTime(),
        year: d.getUTCFullYear(),
        month: d.getUTCMonth(),
        day: d.getUTCDate(),
        raw
      };
    }
  }

  // 2. Format: YYYY-MM-DD (e.g. "2026-09-13")
  const matchIsoDateOnly = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (matchIsoDateOnly) {
    const year = parseInt(matchIsoDateOnly[1], 10);
    const month = parseInt(matchIsoDateOnly[2], 10) - 1;
    const day = parseInt(matchIsoDateOnly[3], 10);
    return {
      isValid: true,
      hasTime: false,
      timestamp: null,
      year,
      month,
      day,
      raw
    };
  }

  // 3. Format: DD MMMM YYYY or MMMM DD, YYYY (e.g. "13 September 2026", "08 August 2026")
  const matchNamedMonth = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (matchNamedMonth) {
    const day = parseInt(matchNamedMonth[1], 10);
    const mStr = matchNamedMonth[2].toLowerCase();
    const year = parseInt(matchNamedMonth[3], 10);
    const month = MONTH_MAP[mStr];
    if (month !== undefined) {
      return {
        isValid: true,
        hasTime: false,
        timestamp: null,
        year,
        month,
        day,
        raw
      };
    }
  }

  // 4. Format: DD-MM-YYYY or DD/MM/YYYY (e.g. "29-07-2026")
  const matchDmy = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (matchDmy) {
    const day = parseInt(matchDmy[1], 10);
    const month = parseInt(matchDmy[2], 10) - 1;
    const year = parseInt(matchDmy[3], 10);
    return {
      isValid: true,
      hasTime: false,
      timestamp: null,
      year,
      month,
      day,
      raw
    };
  }

  // 5. Fallback generic JS Date parse
  const fallbackDate = new Date(raw);
  if (!isNaN(fallbackDate.getTime())) {
    const hasTimeInRaw = /:\d{2}/.test(raw);
    return {
      isValid: true,
      hasTime: hasTimeInRaw,
      timestamp: hasTimeInRaw ? fallbackDate.getTime() : null,
      year: fallbackDate.getFullYear(),
      month: fallbackDate.getMonth(),
      day: fallbackDate.getDate(),
      raw
    };
  }

  return { isValid: false, hasTime: false, timestamp: null, raw };
}

/**
 * Returns formatted IST date string parts: { year, month, day, hour, minute }
 */
export function getIstParts(date: Date): { year: number; month: number; day: number; hour: number; minute: number } {
  // IST is UTC+5:30 (offset: +330 minutes)
  const utc = date.getTime();
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  return {
    year: istTime.getUTCFullYear(),
    month: istTime.getUTCMonth(),
    day: istTime.getUTCDate(),
    hour: istTime.getUTCHours(),
    minute: istTime.getUTCMinutes()
  };
}

/**
 * Formats a Date object in IST for logging and readable outputs.
 */
export function formatIstString(date: Date): string {
  const parts = getIstParts(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const pad = (n: number) => n.toString().padStart(2, '0');
  const mName = months[parts.month];
  return `${pad(parts.day)} ${mName} ${parts.year} ${pad(parts.hour)}:${pad(parts.minute)} IST`;
}

/**
 * Computes the 24-hour dispatch window ending at the given execution time.
 * - windowEnd: execution time (default: Date.now())
 * - windowStart: 24 hours prior to windowEnd
 */
export function get24HourDispatchWindow(nowDate?: Date): {
  windowStart: Date;
  windowEnd: Date;
  windowStartIso: string;
  windowEndIso: string;
  windowStartIst: string;
  windowEndIst: string;
} {
  const windowEnd = nowDate ? new Date(nowDate.getTime()) : new Date();
  const windowStart = new Date(windowEnd.getTime() - 24 * 60 * 60 * 1000);

  return {
    windowStart,
    windowEnd,
    windowStartIso: windowStart.toISOString(),
    windowEndIso: windowEnd.toISOString(),
    windowStartIst: formatIstString(windowStart),
    windowEndIst: formatIstString(windowEnd)
  };
}

export interface EligibilityResult {
  isEligible: boolean;
  reason: string;
  hasTime: boolean;
  rawDate: string;
}

/**
 * Evaluates whether a job's existing Upload Date falls within the 24-hour window.
 * 
 * Rules:
 * 1. If Upload Date has an exact time / timestamp:
 *    - Strictly inclusive start boundary: uploadTime >= windowStart.getTime()
 *    - Upper bound: uploadTime <= windowEnd.getTime()
 *    - Older than 24h (e.g. 24h + 1s, 25h, 2 days): EXCLUDED
 *    - Exactly 24h ago: INCLUDED
 *    - 23h 59m ago: INCLUDED
 * 
 * 2. If Upload Date is DATE-ONLY (as stored in jobUploadDates.json e.g. "13 September 2026"):
 *    - Evaluated according to IST operational calendar dates covered by the 24-hour window.
 *    - For an 8:00 AM IST execution on day D, the previous 24 hours spans (D-1 at 08:00 IST) to (D at 08:00 IST).
 *    - Jobs uploaded on day D-1 (yesterday) or day D (today before 8 AM) fall within this 24-hour cycle.
 *    - Jobs from day D-2 or older (e.g. 2 days ago, "12 September 2026") are strictly EXCLUDED.
 *    - Jobs with future dates (> D) are strictly EXCLUDED.
 *    - Zero modification or synthetic timestamps are applied to the source job data.
 */
export function isJobEligibleForDispatch(
  uploadDateInput?: string | number | Date | null,
  windowStart?: Date,
  windowEnd?: Date
): EligibilityResult {
  const winEnd = windowEnd || new Date();
  const winStart = windowStart || new Date(winEnd.getTime() - 24 * 60 * 60 * 1000);

  const parsed = parseUploadDateString(uploadDateInput);
  if (!parsed.isValid) {
    return {
      isEligible: false,
      reason: `Invalid or missing upload date: '${uploadDateInput}'`,
      hasTime: false,
      rawDate: String(uploadDateInput || '')
    };
  }

  // Case 1: Upload Date has explicit time / timestamp
  if (parsed.hasTime && parsed.timestamp !== null) {
    const t = parsed.timestamp;
    const startMs = winStart.getTime();
    const endMs = winEnd.getTime();

    if (t >= startMs && t <= endMs) {
      return {
        isEligible: true,
        reason: `Timestamp ${t} is within 24h window [${startMs}, ${endMs}]`,
        hasTime: true,
        rawDate: parsed.raw
      };
    }

    if (t < startMs) {
      const diffSec = Math.round((startMs - t) / 1000);
      return {
        isEligible: false,
        reason: `Job is older than 24h window (${diffSec}s before window start)`,
        hasTime: true,
        rawDate: parsed.raw
      };
    }

    return {
      isEligible: false,
      reason: `Job timestamp is in the future beyond window end`,
      hasTime: true,
      rawDate: parsed.raw
    };
  }

  // Case 2: Upload Date is DATE-ONLY (calendar date)
  // Compute the IST calendar dates intersecting the [winStart, winEnd] window.
  const istEnd = getIstParts(winEnd);
  const istStart = getIstParts(winStart);

  // Convert calendar dates to comparable day numbers (YYYY * 10000 + MM * 100 + DD)
  const jobDayNum = parsed.year! * 10000 + (parsed.month! + 1) * 100 + parsed.day!;
  const startDayNum = istStart.year * 10000 + (istStart.month + 1) * 100 + istStart.day;
  const endDayNum = istEnd.year * 10000 + (istEnd.month + 1) * 100 + istEnd.day;

  // If job is older than startDayNum (e.g. 2 days ago)
  if (jobDayNum < startDayNum) {
    return {
      isEligible: false,
      reason: `Date-only job (${parsed.raw}) is prior to window calendar start (day ${startDayNum})`,
      hasTime: false,
      rawDate: parsed.raw
    };
  }

  // If job is in the future beyond endDayNum
  if (jobDayNum > endDayNum) {
    return {
      isEligible: false,
      reason: `Date-only job (${parsed.raw}) is beyond window calendar end (day ${endDayNum})`,
      hasTime: false,
      rawDate: parsed.raw
    };
  }

  // The job's date falls within [startDayNum, endDayNum]
  return {
    isEligible: true,
    reason: `Date-only job (${parsed.raw}) matches active 24-hour IST operational window [${startDayNum}..${endDayNum}]`,
    hasTime: false,
    rawDate: parsed.raw
  };
}
