---
name: single-pdf-job-updater
description: Updates and enriches an existing vacancy entry on the site with full details, tables, and visual cards from an official detailed PDF notification, rulebook, or corrigendum.
---

# Single PDF Job Updater Skill

Use this skill whenever the user uploads a detailed PDF notification, official rulebook, syllabus document, or corrigendum for a vacancy that already exists on the website (e.g., previously created from a short notice, press release, or placeholder) and wants to update the existing entry with complete, granular details.

## When to Trigger
Trigger this skill whenever:
- The user uploads a detailed PDF and asks: *"Update this existing job with this PDF"*, *"Enrich this vacancy with the full rulebook"*, *"Replace the short notice with this official detailed notification"*, or *"Update dates/syllabus/vacancies for [Job Title/ID]"*.
- A duplicate check on an uploaded PDF matches an existing job on the site (Score >= 50 or matching Advt/Board/Post), and the user wants to update the existing post rather than creating a duplicate.

---

## Key Goals & Principles

1. **Locate & Preserve Existing Job ID**:
   - Locate the target job using `scripts/check_duplicate_vacancy.py` or by matching the Board and Advt No.
   - **CRITICAL**: Maintain the existing `id` (URL slug) in both `jobsData.ts` and `jobDetails.json` (e.g., `national-informatics-centre-ni-scientifictechnical-assistant-recruitment-2026`). Preserving the original ID preserves Google Search indexation, user bookmarks, and external backlinks.

2. **Zero-Loss Data Enrichment**:
   - Extract and overwrite placeholder/short data with 100% complete information from the detailed PDF:
     - Exact post-wise and category-wise vacancy breakdowns (UR, OBC, SC, ST, EWS, PwBD, ESM).
     - Pay level, 7th CPC scale, basic pay, and allowances.
     - Strict crucial cut-off dates for age calculation, educational qualification, and caste/EWS certificates.
     - Complete multi-stage selection scheme (Tier-1, Tier-2, Skill Test, PET/PST, Interview, Document Verification).
     - Detailed syllabus, exam pattern, subject-wise weightage, duration, and negative marking scheme.
     - Complete step-by-step How to Apply instructions, application fee structure, and document/photo/signature upload specifications.
     - 4–6 comprehensive FAQs answering key applicant questions.

3. **Strict Application Closing Date (`l` field)**:
   - MUST set `l` in `jobsData.ts` to the **actual application closing/last date** (e.g., `30 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date — setting a release date in `l` causes `isJobExpired()` to prematurely hide active jobs from the Home Page!

4. **Adaptive Representation of Unique Tables & Atypical Data**:
   - Specialized tables (e.g., Physical Measurement & Endurance Standards / PET / PST, Typing / Stenography speed benchmarks, Medical & Eye Vision criteria, Trade / Discipline / Branch seat matrices, Service Bonds & Training Stipend terms) must never be flattened into plain text paragraphs.
   - Convert them into structured data and render with tailored visual UI cards.

5. **Lightweight & High-Performance Visual Elements**:
   - **Zero JS Bloat**: Never import external charting libraries or heavy UI dependencies. Use native Tailwind CSS utility classes (`grid`, `flex`, `divide-y`, `rounded-xl`, `border`, `bg-gradient-to-br`, `backdrop-blur-sm`).
   - **Responsive Card Decks & Metric Grids**: Replace wide, horizontally overflowing HTML tables with responsive card grids (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`) featuring metric callouts, pill badges, and clean key-value rows.
   - **Right Sidebar Strict Vertical Tiling Rule**: Any widgets placed inside the right sidebar (such as **Related & Trending Government Vacancies 2026**, author cards, social handles) MUST ALWAYS tile vertically in a single column (`flex flex-col space-y-2.5` or `grid grid-cols-1 gap-2.5`). **NEVER** use horizontal multi-column classes (`grid-cols-2`, `grid-cols-3`, `lg:grid-cols-3`) inside the sidebar.
   - **Visual Callouts & Badge Clusters**: Highlight critical clauses (bonds, physical cut-offs, typing metrics, certificate validity dates) using alert badges (`border-l-4`, badge chips `bg-emerald-50 text-emerald-700 border-emerald-200`, `bg-amber-50`, `bg-indigo-50`).
   - **No Horizontal Scroll**: Guarantees all tables, cards, and grids are 100% responsive (`w-full`, `max-w-full`, `break-words`, `overflow-hidden`).

6. **Mandatory Post-wise & Category Seat Matrix Representation (`vacanciesDetails`)**:
   - MUST ALWAYS structure `vacanciesDetails` with explicit fields for every post:
     `{"postName": "...", "total": N, "ur": X, "obc": Y, "sc": Z, "st": W, "ews": V, "qualification": "...", "payScale": "..."}`
   - Alternatively for simple category quotas: `{"category": "UR", "count": N}`.
   - Ensure every single post, cadre, and reservation quota announced in the PDF is populated so the interactive seat matrix table renders completely on the page without missing rows.

7. **Full SSG Pre-rendering & SEO Optimization**:
   - Pre-renders full raw HTML markup into `dist/<job-id>/index.html` and `dist/<job-id>.html` so search engines index updated content immediately without client JavaScript.
   - Updates route-specific `<title>`, `<meta name="description">`, Open Graph, Twitter, and Schema.org JSON-LD tags (`JobPosting`, `FAQPage`, `BreadcrumbList`).
   - Synchronizes `__SSR_JOB_DATA__` for immediate client-side React 19 hydration.

8. **Dynamic Sitemap & Robots Synchronization**:
   - Automatically synchronizes `public/sitemap.xml`, `dist/sitemap.xml`, and `robots.txt`.

---

## Fast Step-by-Step Workflow

### Step 1: Identify Existing Job Entry
Run the duplicate & search scanner to find the existing `job_id`:
```bash
python scripts/check_duplicate_vacancy.py "<Full Title or Text>" "<Board Name>" "<Advt / Letter No>"
```
- Note the existing `id` (e.g. `upsc-engineering-services-ese-prelims-recruitment-2026`).
- Inspect the existing entry if needed to preserve any custom verified links or notes.

### Step 2: Extract Detailed PDF Text & Tables
Run the fast PDF extractor:
```bash
python scripts/extract_pdf_data.py "<path_to_detailed_pdf>"
```
- Extract complete structured data:
  - Official Advt No. & Notice Release Date
  - Post names, group classifications, pay matrix levels, and seat matrices
  - Crucial application start date, closing date, fee deadline, correction window, and exam dates
  - Complete eligibility (Education, Experience, Age limit as on crucial date, Category relaxations)
  - Detailed selection stages, syllabus topics, marking schemes, and exam pattern
  - Physical/medical/typing standards if applicable
  - Application fee per category and fee payment modes
  - Step-by-step application instructions and direct official URLs

### Step 3: Construct Updated Job JSON Schema
Construct the updated JSON payload ensuring the **exact existing `id`** is used. Save to `scratch/temp_job.json`:

```json
{
  "id": "<existing-job-id>",
  "seoTitle": "<Updated Rich SEO Title> | NewVacancyAlert",
  "seoDescription": "<150-160 char meta description with exact vacancies, qualification, pay scale, and last date>",
  "focusKeywords": "<Primary keywords>",
  "lsiKeywords": "<Secondary LSI keywords>",
  "title": "<Full Detailed Post Title with Vacancy Count>",
  "board": "<Full Board & Ministry Name>",
  "advtNo": "<Official Advt / Notification Number>",
  "vacancies": 0,
  "jobLocation": "<State / All India>",
  "applicationMode": "Online",
  "applicationStatus": "Online Registration Opens DD/MM/YYYY to DD/MM/YYYY",
  "lastUpdated": "YYYY-MM-DD",
  "overview": [
    "<Paragraph 1: Official notification announcement, board, post, pay scale, vacancy count>",
    "<Paragraph 2: Detailed eligibility, selection process stages, exam pattern>",
    "<Paragraph 3: Application timeline, official portal URL, and direct advice to read notification>"
  ],
  "highlights": [
    {"label": "Recruiting Organization", "value": "..."},
    {"label": "Post Name", "value": "..."},
    {"label": "Advertisement No.", "value": "..."},
    {"label": "Total Vacancies", "value": "..."},
    {"label": "Pay Scale / Salary", "value": "..."},
    {"label": "Educational Qualification", "value": "..."},
    {"label": "Age Limit (as on crucial date)", "value": "..."},
    {"label": "Application Mode", "value": "Online"},
    {"label": "Application Fee", "value": "..."},
    {"label": "Online Application Dates", "value": "DD/MM/YYYY to DD/MM/YYYY"},
    {"label": "Selection Process", "value": "..."},
    {"label": "Official Website", "value": "..."}
  ],
  "importantDates": [
    {"event": "Detailed Notification Released", "date": "..."},
    {"event": "Online Application Starting Date", "date": "..."},
    {"event": "Online Application Closing Date", "date": "..."},
    {"event": "Last Date for Fee Payment", "date": "..."},
    {"event": "Application Form Correction Window", "date": "..."},
    {"event": "Exam Date / Schedule", "date": "..."}
  ],
  "vacanciesDetails": [
    {
      "postName": "...",
      "total": 0,
      "ur": 0,
      "obc": 0,
      "sc": 0,
      "st": 0,
      "ews": 0,
      "qualification": "...",
      "payScale": "..."
    }
  ],
  "eligibility": {
    "education": ["..."],
    "ageLimit": "...",
    "ageRelaxation": ["..."],
    "experience": ["..."],
    "medicalStandards": ["..."]
  },
  "salary": {
    "payScale": "...",
    "basicPay": "...",
    "gradePay": "...",
    "inHandSalary": "...",
    "allowances": ["..."]
  },
  "applicationFee": [
    {"category": "UR / OBC / EWS", "fee": "..."},
    {"category": "SC / ST / PwBD / Ex-SM", "fee": "..."},
    {"category": "Female (All Categories)", "fee": "..."}
  ],
  "howToPayFee": [
    "Fee can be paid online using Net Banking, Debit/Credit Card, or UPI payment gateways."
  ],
  "examCentres": {
    "details": "City 1, City 2, City 3"
  },
  "selectionProcess": [
    {"stage": "Stage 1", "description": "..."},
    {"stage": "Stage 2", "description": "..."},
    {"stage": "Stage 3", "description": "Document Verification (DV)"},
    {"stage": "Stage 4", "description": "Detailed Medical Examination (DME)"}
  ],
  "howToApply": ["..."],
  "documentsRequired": ["..."],
  "importantInstructions": ["..."],
  "urls": [
    {"title": "Download Official Detailed Notification PDF", "url": "..."},
    {"title": "Apply Online Portal", "url": "..."},
    {"title": "Official Website", "url": "..."}
  ],
  "faqs": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}
```

### Step 4: Execute Automated Updater
Run the dedicated job updater:
```bash
python scripts/update_job_entry.py scratch/temp_job.json
```
This automatically:
1. Replaces the full `JobDetail` entry in `src/data/jobDetails.json`.
2. Locates and updates the summary entry in `src/data/jobsData.ts` (title, closing date `l`, post date `d`, qualification `q`, description `desc`, and official link `u`).
3. Updates `src/data/jobUploadDates.json`.

### Step 5: Verify Visual Elements & Sidebar Rules
If the PDF contains specialized criteria (e.g. PET/PST standards, Typing speeds, Medical criteria, Discipline matrices, Service bonds):
- Ensure these are represented as structured items in `highlights`, `overview`, `vacanciesDetails`, or tailored responsive Tailwind metric cards.
- **Strict Sidebar Vertical Tiling Rule**: Check that any right sidebar widgets (such as **Related & Trending Government Vacancies 2026**) strictly use vertical single-column layouts (`flex flex-col space-y-2.5`) and never horizontal multi-column grids.

### Step 6: Data Splitting & SSG Pre-Rendering
Split the updated job data into modular JSON and run production SSG pre-rendering:
```bash
npm run build
```
This automatically executes:
1. `npm run prebuild` (`scripts/split-job-details.ts`): Splits details into `src/data/jobs-generated/<job-id>.json` and updates `src/data/jobs-index-generated.json`.
2. `vite build`: Compiles production client bundles.
3. `scripts/prerender.ts`: Pre-renders full static HTML pages, metadata, and JSON-LD schema into `dist/<job-id>/index.html` and `dist/<job-id>.html` in ~15s.
4. Regenerates `sitemap.xml`, `robots.txt`, and RSS feeds.

### Step 7: Commit and Push
Always use Git from `C:\Users\Administrator\MinGit\cmd\git.exe`:
```powershell
& "C:\Users\Administrator\MinGit\cmd\git.exe" add .
& "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "fix(jobs): update <job-title> with official detailed notification"
& "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
```
