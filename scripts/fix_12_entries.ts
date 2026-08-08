/**
 * Fix script: Correct applicationFee shape, selectionProcess shape, and officialLinks→urls
 * for the 12 recently-added job entries that are crashing with ErrorBoundary.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobDetailsPath = path.join(__dirname, '../src/data/jobDetails.json');
const data = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

const AFFECTED_IDS = [
  'sbi-junior-associate-special-recruitment-drive-2026',
  'mpesb-group-2-subgroup-4-patwari-recruitment-2026',
  'dlsa-ujjain-plv-recruitment-2026',
  'gmc-wanaparthy-faculty-sr-tutor-recruitment-2026',
  'bank-of-baroda-so-recruitment-2026',
  'drdo-drdl-paid-internship-2026',
  'aiims-raipur-senior-resident-recruitment-2026',
  'jssc-jilcce-recruitment-2026',
  'hppsc-hp-police-female-constable-recruitment-2026',
  'hppsc-hp-police-constable-recruitment-2026',
  'army-aoc-group-c-recruitment-2026',
  'iocl-northern-region-apprentice-recruitment-2026',
];

// ─── Helper: parse a selectionProcess string into { stage, description } ──────
function parseSelectionStage(str: string): { stage: string; description: string } {
  // Remove leading numbering like "1. " or "2. "
  const cleaned = str.replace(/^\d+\.\s*/, '').trim();

  // Try splitting on ": " after the phase/step name
  const colonIdx = cleaned.indexOf(': ');
  if (colonIdx > 0 && colonIdx < 80) {
    const stage = cleaned.slice(0, colonIdx).trim();
    const description = cleaned.slice(colonIdx + 2).trim();
    return { stage, description };
  }

  // Try splitting on " – " or " - "
  const dashIdx = cleaned.search(/\s[–-]\s/);
  if (dashIdx > 0 && dashIdx < 80) {
    const stage = cleaned.slice(0, dashIdx).trim();
    const description = cleaned.slice(dashIdx + 3).trim();
    return { stage, description };
  }

  // No clear split: use first sentence fragment as stage
  const firstPeriod = cleaned.indexOf('. ');
  if (firstPeriod > 0 && firstPeriod < 60) {
    return {
      stage: cleaned.slice(0, firstPeriod).trim(),
      description: cleaned.slice(firstPeriod + 2).trim() || cleaned,
    };
  }

  // Fallback: whole string as description, short prefix as stage
  const words = cleaned.split(' ');
  const stageWords = words.slice(0, Math.min(6, words.length));
  return {
    stage: stageWords.join(' '),
    description: cleaned,
  };
}

let fixedCount = 0;

for (const id of AFFECTED_IDS) {
  const entry = data[id];
  if (!entry) {
    console.warn(`⚠️  Entry not found: ${id}`);
    continue;
  }

  // ── Fix 1: applicationFee object → array ──────────────────────────────────
  if (!Array.isArray(entry.applicationFee) && entry.applicationFee?.breakdown) {
    const oldFee = entry.applicationFee as { details?: string; breakdown: { category: string; amount: string }[] };
    
    // Determine refund string from details text
    let refundNote = '';
    const details = oldFee.details || '';
    if (/non[-\s]?refundable/i.test(details)) {
      refundNote = 'Non-refundable';
    } else if (/refundable/i.test(details)) {
      refundNote = 'Refundable';
    }

    entry.applicationFee = oldFee.breakdown.map(item => ({
      category: item.category,
      fee: item.amount,
      refund: refundNote,
    }));

    console.log(`✅ [${id}] applicationFee: object → array (${entry.applicationFee.length} rows)`);
  } else if (Array.isArray(entry.applicationFee)) {
    console.log(`ℹ️  [${id}] applicationFee already array — skipping fix 1`);
  }

  // ── Fix 2: selectionProcess string[] → {stage,description}[] ─────────────
  if (Array.isArray(entry.selectionProcess) && typeof entry.selectionProcess[0] === 'string') {
    const rawSteps = entry.selectionProcess as string[];
    
    // Filter out sub-items that are continuations (lines starting with spaces/"   -")
    // and fold them into the previous stage's description
    const merged: string[] = [];
    for (const line of rawSteps) {
      if (line.startsWith('   ') || line.startsWith('\t')) {
        // continuation — append to the last merged item
        if (merged.length > 0) {
          merged[merged.length - 1] += ' ' + line.trim();
        }
      } else {
        merged.push(line);
      }
    }

    entry.selectionProcess = merged.map(str => parseSelectionStage(str));
    console.log(`✅ [${id}] selectionProcess: string[] → object[] (${entry.selectionProcess.length} stages)`);
  } else if (Array.isArray(entry.selectionProcess) && typeof entry.selectionProcess[0] === 'object') {
    console.log(`ℹ️  [${id}] selectionProcess already object[] — skipping fix 2`);
  }

  // ── Fix 3: officialLinks → urls ───────────────────────────────────────────
  if ('officialLinks' in entry && !('urls' in entry)) {
    entry.urls = entry.officialLinks;
    delete entry.officialLinks;
    console.log(`✅ [${id}] officialLinks → urls`);
  } else if ('urls' in entry) {
    console.log(`ℹ️  [${id}] Already has 'urls' — skipping fix 3`);
  }

  fixedCount++;
}

// Write updated file
fs.writeFileSync(jobDetailsPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`\n✅ Done. Fixed ${fixedCount} entries in jobDetails.json`);

// ─── Verification pass ────────────────────────────────────────────────────────
console.log('\n=== Verification ===');
const verifyData = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));
let allOk = true;
for (const id of AFFECTED_IDS) {
  const e = verifyData[id];
  if (!e) { console.log(`❌ ${id}: NOT FOUND`); allOk = false; continue; }
  
  const feeOk = Array.isArray(e.applicationFee);
  const spOk = Array.isArray(e.selectionProcess) && (e.selectionProcess.length === 0 || typeof e.selectionProcess[0] === 'object');
  const urlOk = 'urls' in e && !('officialLinks' in e);
  
  const status = feeOk && spOk && urlOk ? '✅' : '❌';
  if (!feeOk || !spOk || !urlOk) allOk = false;
  console.log(`${status} ${id}`);
  if (!feeOk) console.log(`   applicationFee: ${Array.isArray(e.applicationFee) ? 'array' : typeof e.applicationFee} ← WRONG`);
  if (!spOk) console.log(`   selectionProcess[0] type: ${typeof e.selectionProcess?.[0]} ← WRONG`);
  if (!urlOk) console.log(`   urls: ${'urls' in e}, officialLinks: ${'officialLinks' in e} ← WRONG`);
}
console.log(allOk ? '\n🎉 All 12 entries verified OK!' : '\n❌ Some entries still have issues!');
