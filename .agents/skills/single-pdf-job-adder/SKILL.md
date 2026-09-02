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
4. **Adaptive Representation of Unique Tables & Atypical Data**:
   - Many PDF notifications feature specialized tables and uncommon data structures unlike standard notifications (e.g., Physical Measurement & Endurance Standards / PET / PST, Typing / Stenography speed benchmarks, Medical & Eye Vision criteria, Trade / Discipline / Branch seat matrices, Service Bonds & Training Stipend terms, Multi-stage marking & weightage schemes, or Photo/Signature/Thumb/Live-photo capture specifications).
   - Never omit or flatten these unique tables into plain paragraphs. Convert them into structured data and render them with tailored, visually appealing UI elements.
5. **Lightweight & High-Performance Visual Elements**:
   - **Zero JS Bloat**: Never import external charting libraries or heavy UI dependencies. Use native Tailwind CSS utility classes (`grid`, `flex`, `divide-y`, `rounded-xl`, `border`, `bg-gradient-to-br`, `backdrop-blur-sm`).
   - **Responsive Card Decks & Metric Grids**: Replace wide, horizontally overflowing HTML tables with responsive card grids (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`) featuring metric callouts, pill badges, and clean key-value rows.
   - **Right Sidebar Strict Vertical Tiling Rule**: Any widgets placed inside the right sidebar (such as **Related & Trending Government Vacancies 2026**, author cards, social handles) MUST ALWAYS tile vertically in a single column (`flex flex-col space-y-2.5` or `grid grid-cols-1 gap-2.5`). **NEVER** use horizontal multi-column classes (`grid-cols-2`, `grid-cols-3`, `lg:grid-cols-3`) inside the sidebar, which makes cards unreadable and squished in desktop view.
   - **Visual Callouts & Badge Clusters**: Highlight critical clauses (bonds, physical cut-offs, typing metrics, certificate validity dates) using alert badges (`border-l-4`, badge chips `bg-emerald-50 text-emerald-700 border-emerald-200`, `bg-amber-50`, `bg-indigo-50`).
   - **No Horizontal Scroll**: Guarantees all tables, cards, and grids are 100% responsive (`w-full`, `max-w-full`, `break-words`, `overflow-hidden`).
6. **Mandatory Post-wise & Category Seat Matrix Representation (`vacanciesDetails`)**:
   - MUST ALWAYS structure `vacanciesDetails` with explicit fields for every post:
     `{"postName": "...", "total": N, "ur": X, "obc": Y, "sc": Z, "st": W, "ews": V, "qualification": "...", "payScale": "..."}`
   - Alternatively for simple category quotas: `{"category": "UR", "count": N}`.
   - Ensure every post listed in the PDF is populated into `vacanciesDetails` so the interactive seat matrix table is 100% rendered on the live page without omission.
7. **Prominent "Click to Apply" CTA / Button / Section**:
   - Include a prominent "Click to Apply" / "Apply Online" action button or section placed just below the Important Dates section, directing applicants straight to the official government application portal.
   - Extract the apply URL from the PDF / official notification text (e.g. within "How to Apply" guidelines, official portal URLs, or online registration links); only if no application URL is found anywhere in the notice, omit this button.
8. **Full SSG Pre-rendering & SEO Optimization**:
   - Pre-renders full raw HTML markup into `dist/<job-id>/index.html` and `dist/<job-id>.html` so search engines (Googlebot) can index 100% of the job content without executing client JavaScript.
   - Generates route-specific `<title>`, `<meta name="description">`, Open Graph, Twitter, and Schema.org JSON-LD tags (`JobPosting`, `FAQPage`, `BreadcrumbList`).
   - Injects `__SSR_JOB_DATA__` for immediate client-side React 19 hydration via `hydrateRoot`.
9. **Dynamic Sitemap & Robots Synchronization**: Automatically updates `public/sitemap.xml`, `dist/sitemap.xml`, and `robots.txt` with the new vacancy URL.

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
- Identify both standard sections and any **unique / non-standard tables or atypical clauses** (e.g. PET/PST standards, Typing speeds, Medical standards, Discipline matrices, Service bond terms, Document upload specs).

### Step 3: Create Job JSON & Execute Automated Inserter
Save complete job schema JSON to `scratch/temp_job.json` and run:
```bash
python scripts/add_job_entry.py scratch/temp_job.json
```

### Step 4: Add Visual Cards & Lightweight UI Elements for Unique Data
In `JobDetailPage.tsx` or job details structure:
- **Hero & Mission Banners**: For flagship recruitment drives (e.g. AIIMS NORCET, SSC CGL, UPSC, Defence drives).
- **Post Code / Discipline / Branch Breakdown Grid**: Multi-card responsive grids for category/discipline-wise post distribution.
- **Physical Standards & Endurance (PET/PST) Metric Cards**: Clean 2-3 column metric cards with measurement badges (Height, Chest, Running time, Long Jump).
- **Typing & Skill Test Specification Badges**: Badges showing WPM speeds, keystrokes, allowed error percentages, and font details.
- **Service Bond & Stipend Callouts**: Highlight boxes for bond duration, amount, and training stipend details.
- **Sidebar Widgets & Related Vacancies**: Ensure right sidebar components (including **Related & Trending Government Vacancies 2026**) are strictly single-column vertical stacks (`flex flex-col space-y-2.5`) for optimal readability.
- **Strict Lightweight Principle**: Keep all custom elements pure Tailwind CSS without adding external packages or heavy DOM nodes.

### Step 5: Data Splitting & SSG Pre-Rendering
Split new job data into modular JSON and run production SSG pre-rendering:
```bash
npm run build
```
This automatically executes:
1. `npm run prebuild` (`scripts/split-job-details.ts`): Splits details into `src/data/jobs-generated/<job-id>.json` and updates `src/data/jobs-index-generated.json`.
2. `vite build`: Compiles production client bundles.
3. `scripts/prerender.ts`: High-speed SSG generator pre-rendering 550+ HTML pages, meta tags, and Schema.org JSON-LD scripts (`JobPosting`, `FAQPage`, `BreadcrumbList`) in ~15s without heavy Node-side SSR overhead.
4. `sitemap.xml`, `robots.txt`, and RSS feed regeneration for `public/` and `dist/`.
*Note: Keep `scripts/prerender.ts` lightweight using fast static HTML/metadata injection to ensure total build time stays ~1 minute and never freezes.*

### Step 6: Commit and Push
Always first look for and use Git inside `C:\Users\Administrator\MinGit\cmd` (specifically `C:\Users\Administrator\MinGit\cmd\git.exe`) when executing this step:
```powershell
& "C:\Users\Administrator\MinGit\cmd\git.exe" add .
& "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): add <job-title> recruitment notification"
& "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
```
