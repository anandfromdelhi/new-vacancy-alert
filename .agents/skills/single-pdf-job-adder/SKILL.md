---
name: single-pdf-job-adder
description: Ultra-fast single-command skill to extract, duplicate-check, build detailed job entries, and add visual cards for government vacancy PDFs.
---

# Single PDF Job Adder Skill

Use this skill whenever the user uploads a single PDF vacancy notification, screenshot, or official notice and asks to add it to the website with rich details, tables, visual cards, and no horizontal scrolling.

## Key Goals & Principles
1. **Instant Duplicate Check**: Ensures job is not already on the site.
2. **Zero-Loss Data Extraction**: Extracts every post code, pay level, qualification, date, fee structure, syllabus, and document rule from the PDF.
3. **Strict Application Closing Date (`l` field) & Mandatory Spelled-Out Month Formatting**:
   - MUST set `l` in `jobsData.ts` to the **actual application closing/last date** (e.g. `16 September 2026`). **NEVER** set `l` to the notification release date or application start date — putting a release date in `l` causes `isJobExpired()` to prematurely hide active jobs from the Home Page!
   - **MANDATORY: NEVER USE NUMERIC DATES** like `DD.MM.YYYY` or `DD/MM/YYYY` (e.g. `06.10.2026` or `06/10/2026`). In Indian government notices, `06.10.2026` is 06 October, NOT 10 June. Numeric dates cause severe user confusion with US `MM/DD` format.
   - **ALWAYS spell out the English month name in full** across all fields (`importantDates`, `highlights`, `jobsData.ts` `l` & `d`, `overview`, and `faqs`): e.g. **`06 October 2026 (11:59 PM)`**, **`07 September 2026`**, **`31 August 2026`**.
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
10. **Short, Acronym-First URL Slug Standard (`id` field)**:
    - **MANDATORY**: Keep generated URL slugs **short, clean, human-readable, and concise (< 45 characters)**.
    - **Board Acronym Priority**: Always use the official board/organization acronym instead of typing out long repetitive names:
      - E.g. use `ssc` (not `staff-selection-commission`), `upsc` (not `union-public-service-commission`), `rrb` (not `railway-recruitment-board`), `uksssc` (not `uttarakhand-subordinate-service-selection-commission`), `tnpsc` (not `tamil-nadu-public-service-commission`), `gims` (not `government-institute-of-medical-sciences`), `iit-<city>` (e.g. `iit-delhi`, `iit-goa`), `aiims-<city>` (e.g. `aiims-delhi`), `concor`, `bel`, `bhel`, `sail`, `ongc`, `drdo`, `isro`, `tmc`, `iibf`, `psssb`.
    - **Recruitment / Exam Acronym Priority**: Use standard exam/post acronyms where available:
      - E.g. `je`, `cgl`, `chsl`, `mts`, `cpo`, `alp`, `ntpc`, `ctse`, `srf`, `jrf`, `mo`, `gds`, `patwari`, `constable`, `staff-nurse`.
    - **Always Include the Year**: Always end the slug with the recruitment year (`-<year>`, e.g. `-2026`).
    - **Formula**: `<board-acronym>-[campus-]<post-or-exam-acronym>-recruitment-<year>` (or `<board-acronym>-<post-or-exam-acronym>-<year>`).
    - **Target Length**: 25–45 characters. Never exceed 50 characters.
    - **Good vs Bad Slug Examples**:
      - ✅ `ssc-je-recruitment-2026` *(Bad: `staff-selection-commission-ssc-je-civil-je-electrical-je-mech-recruitment-2026`)*
      - ✅ `tnpsc-ctse-recruitment-2026` *(Bad: `tnpsc-ctse-interview-posts-research-assistant-assistant-m-recruitment-2026`)*
      - ✅ `uksssc-group-c-intermediate-2026` *(Bad: `uttarakhand-subordinate-servic-computer-assistant-junior-assi-recruitment-2026`)*
      - ✅ `gims-staff-nurse-recruitment-2026` *(Bad: `gims-staff-nurse-staff-nurse-non-teaching-recruitment-2026`)*
      - ✅ `iit-goa-sports-coach-2026` *(Bad: `indian-institute-of-technology-sports-coach-recruitment-2026`)*
      - ✅ `concor-management-trainee-2026` *(Bad: `container-corporation-of-india-management-trainee-assistant-o-recruitment-2026`)*
      - ✅ `india-post-gds-recruitment-2026` *(Bad: `department-of-posts-ministry-o-branch-postmaster-bpm-assistan-recruitment-2026`)*

## Fast Workflow

### Step 1: Duplicate Scan
Run the multi-factor duplicate checker passing Title, Board, Advt No, and PDF URL/vacancies:
```bash
python scripts/check_duplicate_vacancy.py "<Full Title or Text>" "<Board Name or Acronym>" "<Advt / Letter No>" "<PDF or Official URL>" "<Total Vacancies>"
```
- If duplicate is found (Score >= 70 or matching PDF URL / Advt No), **DO NOT create a duplicate entry**. Report the existing job ID to user and ask if an update is needed.
- Note: `scripts/add_job_entry.py` contains an automated insertion guard and will block additions if a duplicate is detected.
- If match score < 40 and no URL/Advt match, proceed to Step 2.

### Step 2: PDF Text & Table Extraction
Run fast PDF extractor:
```bash
python scripts/extract_pdf_data.py "<path_to_pdf>"
```
- Identify both standard sections and any **unique / non-standard tables or atypical clauses** (e.g. PET/PST standards, Typing speeds, Medical standards, Discipline matrices, Service bond terms, Document upload specs).

### Step 3: Create Full Job JSON & Execute Automated Inserter
Save complete job schema JSON to `scratch/temp_job.json`:

```json
{
  "id": "<short-acronym-slug-with-year e.g. ssc-je-recruitment-2026 or iit-delhi-srf-2026>",
  "seoTitle": "<Target Keyword Optimized Title> | NewVacancyAlert",
  "seoDescription": "<150-160 char meta description with exact vacancies, qualification, pay scale, and last date>",
  "focusKeywords": "<Primary keywords>",
  "lsiKeywords": "<Secondary LSI keywords>",
  "title": "<Full Post Title with Total Vacancies and Call to Action>",
  "board": "<Full Board / Department / Commission Name>",
  "advtNo": "<Official Advertisement / Notification Number>",
  "vacancies": 0,
  "jobLocation": "<State / All India>",
  "applicationMode": "Online",
  "applicationStatus": "Online Registration Opens DD.MM.YYYY to DD.MM.YYYY",
  "lastUpdated": "YYYY-MM-DD",
  "overview": [
    "<Paragraph 1: Official notification announcement, board, post names, pay scale, vacancy count>",
    "<Paragraph 2: Educational qualifications, age criteria, reservation categories>",
    "<Paragraph 3: Selection stages, exam pattern, official portal URL, and application deadline>"
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
    {"label": "Online Application Dates", "value": "DD.MM.YYYY to DD.MM.YYYY"},
    {"label": "Selection Process", "value": "..."},
    {"label": "Official Website", "value": "..."}
  ],
  "importantDates": [
    {"event": "Notification Published", "date": "..."},
    {"event": "Online Application Commencement", "date": "..."},
    {"event": "Last Date for Online Application", "date": "..."},
    {"event": "Last Date for Application Fee Payment", "date": "..."},
    {"event": "Application Correction Window", "date": "..."},
    {"event": "Written Examination / Skill Test Date", "date": "..."}
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
    "ageRelaxation": [
      "SC / ST Candidates: 5 Years",
      "OBC Candidates: 3 Years",
      "PwBD Candidates: 10 Years"
    ],
    "experience": ["..."],
    "medicalStandards": ["..."]
  },
  "salary": {
    "payScale": "...",
    "basicPay": "...",
    "gradePay": "...",
    "inHandSalary": "...",
    "allowances": ["Dearness Allowance (DA)", "House Rent Allowance (HRA)", "Transport Allowance"]
  },
  "applicationFee": [
    {"category": "General / OBC / EWS", "fee": "..."},
    {"category": "SC / ST / PwBD / Ex-SM", "fee": "..."}
  ],
  "howToPayFee": [
    "Fee can be paid online using Net Banking, Debit/Credit Card, or UPI payment gateways.",
    "Keep transaction reference number / receipt for future verification."
  ],
  "examCentres": {
    "details": "City 1, City 2, City 3, City 4"
  },
  "selectionProcess": [
    {"stage": "Stage 1: Written Competitive Examination", "description": "..."},
    {"stage": "Stage 2: Skill / Typing / Practical Test", "description": "..."},
    {"stage": "Stage 3: Document Verification (DV)", "description": "Verification of original certificates"},
    {"stage": "Stage 4: Medical Examination", "description": "Standard medical fitness check"}
  ],
  "howToApply": [
    "Visit the official website at ...",
    "Complete registration and fill in all educational and personal details.",
    "Upload required documents, photograph, and signature.",
    "Pay the prescribed application fee and submit the application form."
  ],
  "documentsRequired": [
    "10th / Matriculation Certificate for Date of Birth verification.",
    "Educational Qualification Passing Certificates & Marksheets.",
    "Caste / EWS / Disability Certificate if claiming reservation.",
    "Valid Photo ID Proof (Aadhaar / Voter ID / Passport)."
  ],
  "importantInstructions": [
    "Ensure all uploaded documents are legible and valid on the crucial date.",
    "Submit the online form before the closing date to avoid last-minute server rush."
  ],
  "urls": [
    {"title": "Official Online Application Portal", "url": "..."},
    {"title": "Download Official Notification PDF", "url": "..."}
  ],
  "faqs": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}
```

Run automated inserter:
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
