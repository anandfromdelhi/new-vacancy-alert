---
name: expired-jobs-cleaner
description: High-speed, zero-bug skill to scan and remove expired vacancies (jobs where application closing date has passed) from the site database, generated files, and sitemaps in seconds.
---

# Expired Jobs Cleaner Skill

Use this skill whenever the user asks to remove expired jobs from the website (i.e. vacancies where the application deadline / last date to apply has passed).

## When to Trigger
Trigger this skill whenever:
- The user asks: *"Remove expired jobs"*, *"Clean up old vacancies"*, *"Delete jobs past their last date"*, *"Purge expired listings"*, or asks to audit/clean the database for outdated recruitment posts.
- The user requests a fast scan and removal of past-deadline vacancies without manual review of 500+ files.

---

## Key Goals & Zero-Bug Principles

1. **Lightning Speed (< 1s local scan, zero network lag)**:
   - Evaluates dates purely against local databases (`src/data/jobsData.ts` and `src/data/jobDetails.json`).
   - **NEVER** initiates slow web scraping, HTTP fetches, or remote PDF downloads.

2. **Multi-Format Date Engine (No False Expirations)**:
   - Robustly parses all standard Indian recruitment date formats:
     - `DD Month YYYY` (e.g. `28 September 2026`, `05-Aug-2026`, `1st July 2026`)
     - `Month DD, YYYY` (e.g. `September 28, 2026`)
     - `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY` (e.g. `25-08-2026, 12:00 Midnight`)
     - `YYYY-MM-DD`
   - Strips extraneous time annotations (`5:00 PM`, `11:59 PM`, `Midnight`) automatically.

3. **Fallback to Detailed Schema**:
   - If `l` in `jobsData.ts` contains descriptive text (e.g. *"See details"* or *"Refer notification"*), the engine checks `jobDetails.json`'s `importantDates` array to retrieve the exact closing/submission event date.

4. **Ongoing & Flexible Recruitment Protection**:
   - Explicitly preserves postings with flexible/ongoing schedules (e.g. *"Walk-in"*, *"Ongoing"*, *"Interview"*), preventing accidental deletion of valid active opportunities.

5. **Clean Synchronized Cascade Removal**:
   - Safely removes expired entries across all 4 database layers:
     1. [`src/data/jobsData.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/new-vacancy-alert/src/data/jobsData.ts) (summary list)
     2. [`src/data/jobDetails.json`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/new-vacancy-alert/src/data/jobDetails.json) (rich schemas)
     3. [`src/data/jobUploadDates.json`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/new-vacancy-alert/src/data/jobUploadDates.json)
     4. [`src/data/jobs-generated/`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/new-vacancy-alert/src/data/jobs-generated) & `public/data/jobs-generated/` (orphaned JSONs)

6. **Automatic SSG Pre-rendering & Sitemap Synchronization**:
   - Executes `npm run build` to update `jobs-index-generated.json`, regenerate static HTML in `dist/`, and refresh `sitemap.xml`, `robots.txt`, and RSS feeds.

---

## Fast Step-by-Step Workflow

### Step 1: Run Fast Dry-Run Scan
Inspect expired jobs without modifying any files (takes < 0.2s):
```bash
python scripts/remove_expired_jobs.py
```
- Displays total job count, active count, expired count, and a preview table with days expired.
- Optional: Add `--grace-days N` (e.g. `--grace-days 1` to only remove jobs expired by more than 1 full day).

### Step 2: Apply Removals
Execute the fast database cleaner:
```bash
python scripts/remove_expired_jobs.py --apply
```
- Instantly cleans `jobsData.ts`, `jobDetails.json`, `jobUploadDates.json`, and deletes orphaned generated JSONs.

### Step 3: Rebuild Site & Pre-render SSG Pages
Re-generate modular indexes and pre-rendered pages (~15s):
```bash
npm run build
```
This automatically:
1. Updates `src/data/jobs-index-generated.json` and modular per-job files.
2. Re-compiles Vite production bundles.
3. Pre-renders active HTML pages in `dist/`.
4. Refreshes `sitemap.xml`, `robots.txt`, and RSS feeds so search engines drop expired URLs.

### Step 4: Commit and Push
Commit changes using MinGit at `C:\Users\Administrator\MinGit\cmd\git.exe`:
```powershell
& "C:\Users\Administrator\MinGit\cmd\git.exe" add .
& "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "chore(jobs): clean up expired vacancy listings from site"
& "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
```
