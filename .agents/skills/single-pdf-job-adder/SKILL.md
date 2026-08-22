---
name: single-pdf-job-adder
description: Ultra-fast single-command skill to extract, duplicate-check, build detailed job entries, and add visual cards for government vacancy PDFs.
---

# Single PDF Job Adder Skill

Use this skill whenever the user uploads a single PDF vacancy notification, screenshot, or official notice and asks to add it to the website with rich details, tables, visual cards, and no horizontal scrolling.

## Key Goals & Principles
1. **Instant Duplicate Check**: Ensures job is not already on the site.
2. **Zero-Loss Data Extraction**: Extracts every post code, pay level, qualification, date, fee structure, syllabus, and document rule from the PDF.
3. **Strict Application Closing Date (`l` field)**: MUST set `l` in `jobsData.ts` to the **actual application closing/last date** (e.g. `16 September 2026`). **NEVER** set `l` to the notification release date or application start date — putting a release date in `l` causes `isJobExpired()` to prematurely hide active jobs from the Home Page!
4. **Rich Aesthetic & Visual Cards**: Includes hero mission banner, post code breakdown cards, and document upload specification boxes in `JobDetailPage.tsx`.
5. **No Horizontal Scroll**: Guarantees all tables and grids are 100% responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `w-full`, `max-w-full`, `break-words`).
6. **Full SSG Pre-rendering & SEO Optimization**:
   - Pre-renders full raw HTML markup into `dist/<job-id>/index.html` and `dist/<job-id>.html` so search engines (Googlebot) can index 100% of the job content without executing client JavaScript.
   - Generates route-specific `<title>`, `<meta name="description">`, Open Graph, Twitter, and Schema.org JSON-LD tags (`JobPosting`, `FAQPage`, `BreadcrumbList`).
   - Injects `__SSR_JOB_DATA__` for immediate client-side React 19 hydration via `hydrateRoot`.
7. **Dynamic Sitemap & Robots Synchronization**: Automatically updates `public/sitemap.xml`, `dist/sitemap.xml`, and `robots.txt` with the new vacancy URL.

## Fast Workflow

### Step 1: Duplicate Scan
Run the fast duplicate checker:
```bash
python scripts/check_duplicate_vacancy.py "<Full Title or Text>" "<Board Name>" "<Advt / Letter No>"
```
- If duplicate is found (Score >= 50), report existing job ID to user and ask if update is needed.
- If match score < 20, proceed to Step 2.

### Step 2: PDF Text & Table Extraction
Run fast PDF extractor:
```bash
python scripts/extract_pdf_data.py "<path_to_pdf>"
```

### Step 3: Create Job JSON & Execute Automated Inserter
Save complete job schema JSON to `scratch/temp_job.json` and run:
```bash
python scripts/add_job_entry.py scratch/temp_job.json
```

### Step 4: Add Visual Cards & Rich Content (If Applicable)
In `JobDetailPage.tsx`:
- Add hero banner for special recruitment drives or major boards.
- Add post code / discipline breakdown grid cards under Educational Qualification.
- Add document/image upload specification cards under How to Apply.

### Step 5: Data Splitting & SSG Pre-Rendering
Split new job data into modular JSON and run production SSG pre-rendering:
```bash
npm run build
```
This automatically executes:
1. `npm run prebuild` (`scripts/split-job-details.ts`): Splits details into `src/data/jobs-generated/<job-id>.json` and updates `src/data/jobs-index-generated.json`.
2. `vite build`: Compiles production bundles.
3. `scripts/prerender.ts`: Pre-renders full HTML and JSON-LD for all vacancy paths, generating `dist/<job-id>/index.html` and `dist/<job-id>.html`.
4. `sitemap.xml`, `robots.txt`, and RSS feed regeneration for `public/` and `dist/`.

### Step 6: Commit and Push
Stage, commit, and push using MinGit:
```powershell
& "C:\Users\Administrator\MinGit\cmd\git.exe" add .
& "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): add <job-title> recruitment notification"
& "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
```
