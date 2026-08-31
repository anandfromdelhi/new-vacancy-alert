---
name: batch-url-vacancy-adder
description: Handles batch processing of multiple webpage URLs. Sequentially fetches each URL, extracts rich recruitment data directly from page text, checks for duplicates and skips if already present, creates complete job entries one-by-one, commits and pushes to GitHub every 10 added jobs, and completes sitemap generation, build, and push after all URLs are processed.
---

# Batch URL Vacancy Adder Skill

Use this skill whenever the user provides a list of multiple webpage URLs and asks to extract and add job vacancy notifications to the website.

## Core Rules & Principles

1. **Strict Sequential Execution**:
   - Process each URL **one-by-one** in strict sequence.
   - Fetch URL, extract data, check duplicates, generate complete schema, and add it to `jobsData.ts` and `jobDetails.json`.
   - Proceed sequentially from URL 1 to the end of the list.
2. **Mandatory Duplicate Check & Auto-Skip**:
   - **BEFORE** adding any new vacancy, always run the duplicate checker.
   - If a duplicate is detected (Score >= 50 or matching Board + Advt No / Title in `jobsData.ts` / `jobDetails.json`), **IMMEDIATELY SKIP** that job.
   - Note it in the summary as skipped (Duplicate) and proceed directly to the next URL.
3. **Zero-Loss Data Extraction**:
   - Extracts every post code, pay level, qualification, date, fee structure, syllabus, and document rule from the webpage.
4. **Strict Application Closing Date (`l` field)**:
   - In `jobsData.ts`, **ALWAYS** set `l` to the actual application closing / last date (e.g. `16 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date — putting a release date in `l` causes `isJobExpired()` to prematurely hide active jobs from the Home Page!
5. **Adaptive Representation of Unique Tables & Atypical Data**:
   - Many webpage notifications feature specialized tables and uncommon data structures (e.g., Physical Measurement & Endurance Standards / PET / PST, Typing / Stenography speed benchmarks, Medical & Eye Vision criteria, Trade / Discipline / Branch seat matrices, Service Bonds & Training Stipend terms, Multi-stage marking schemes, or Photo/Signature upload specs).
   - Never omit or flatten these unique tables into plain paragraphs. Convert them into structured data and render them with tailored, visually appealing UI elements.
6. **Lightweight & High-Performance Visual Elements**:
   - **Zero JS Bloat**: Never import external charting libraries or heavy UI dependencies. Use native Tailwind CSS utility classes (`grid`, `flex`, `divide-y`, `rounded-xl`, `border`, `bg-gradient-to-br`, `backdrop-blur-sm`).
   - **Responsive Card Decks & Metric Grids**: Replace wide, horizontally overflowing HTML tables with responsive card grids (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`) featuring metric callouts, pill badges, and clean key-value rows.
   - **Right Sidebar Strict Vertical Tiling Rule**: Any widgets placed inside the right sidebar (such as **Related & Trending Government Vacancies 2026**, author cards, social handles) MUST ALWAYS tile vertically in a single column (`flex flex-col space-y-2.5` or `grid grid-cols-1 gap-2.5`). **NEVER** use horizontal multi-column classes (`grid-cols-2`, `grid-cols-3`, `lg:grid-cols-3`) inside the sidebar.
   - **Visual Callouts & Badge Clusters**: Highlight critical clauses using alert badges (`border-l-4`, badge chips `bg-emerald-50 text-emerald-700 border-emerald-200`, `bg-amber-50`, `bg-indigo-50`).
   - **No Horizontal Scroll**: Guarantees all tables, cards, and grids are 100% responsive (`w-full`, `max-w-full`, `break-words`, `overflow-hidden`).
7. **Periodic Git Commit & Push (Every 10 Jobs Added)**:
   - Track the count of successfully added jobs (`added_jobs_count`).
   - **After every 10 jobs added** (e.g., 10th, 20th, 30th job):
     1. Run `npm run build`
     2. Commit and push to GitHub:
        ```powershell
        & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
        & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): batch add 10 vacancies from official portals"
        & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
        ```
     3. Continue processing the remaining URLs.
   - At the end of the entire list, update the sitemap (`npx tsx scripts/generate-sitemap.ts`), run production build, commit, and push.
8. **Text-Direct Sourcing (No PDF Inspection)**:
   - Extract 100% of the recruitment data directly from the text and tables on the webpage.
   - Do **NOT** download, OCR, or inspect linked PDF files unless explicitly requested.
9. **Official Govt Links Only (Filter Out 3rd-Party References)**:
   - Identify, verify, and retain **only official government portals, department websites, and recruiting authority links**.
   - Ignore and strip out all references, backlinks, or promotions to private coaching centers, job forums, blogs, or 3rd-party aggregators.
10. **Zero-Loss Rich Schemas & 20+ FAQs**:
    - Every job must have rich, comprehensive data including:
      - `id`, `seoTitle`, `seoDescription`, `focusKeywords`, `lsiKeywords`
      - `title`, `board`, `advtNo`, `vacancies`, `jobLocation`, `applicationMode`, `applicationStatus`, `lastUpdated`
      - `overview` (2-3 detailed paragraphs)
      - `highlights` (10-12 key parameters)
      - `importantDates` (all key milestones)
      - **Prominent "Click to Apply" CTA / Button / Section**: Include a prominent "Click to Apply" / "Apply Online" action button or section placed just below the Important Dates section, directing applicants straight to the official government application portal. Extract the apply URL from the page text (e.g. within "How to Apply" steps, application links, or table notes); only if no application URL is found anywhere on the webpage, omit this button.
      - `vacanciesDetails` (complete category/post breakdown)
      - `eligibility` (`education`, `ageLimit`, `medicalStandards`)
      - `salary` (`payLevel`, `initialPay`, `allowances`)
      - `applicationFee` (category-wise breakdown)
      - `selectionProcess` (stages, marks, negative marking, qualifying cutoffs)
      - `howToApplySteps` (step-by-step application instructions)
      - `documentsRequired` (certificates, photo/sign specifications)
      - `faqs` (15-20+ practical FAQs addressing all candidate questions)
      - `urls` (official government recruitment and application portals)

---

## Step-by-Step Batch Workflow

### State / Counter Tracking:
Maintain a counter `added_jobs_count = 0` throughout the session.

---

### For Each URL in the Provided List:

#### Step 1: Fetch Webpage Content
Use the `read_url_content` tool to fetch the text and tables of the target URL.

#### Step 2: Filter & Structure Vacancy Data
- Extract: Board Name, Advt No., Post Names, Vacancy Counts, Category Breakdowns, Dates, Qualifications, Age Limits, Fees, Salary/Pay Levels, Selection Stages, Official Govt URLs, and Apply Online Portal link.
- Filter out private aggregators, ads, and non-official websites.

#### Step 3: Duplicate Check (Look Before Adding)
Run the duplicate checker:
```bash
python scripts/check_duplicate_vacancy.py "<Job Title / Board>" "<Board Name>" "<Advt No>"
```
- **If duplicate is found (Score >= 50 or exact match)**:
  - Log: `[SKIPPED DUPLICATE] <Job Title> (<Board Name>) already exists.`
  - **Do NOT add.**
  - **Move immediately to the next URL.**
- **If no duplicate**:
  - Proceed to Step 4.

#### Step 4: Insert Complete Job Entry
1. Save job schema JSON to `scratch/temp_job.json` and execute:
   ```bash
   python scripts/add_job_entry.py scratch/temp_job.json
   ```
2. Verify entry is added to `src/data/jobDetails.json` and `src/data/jobsData.ts`, and update `src/data/jobUploadDates.json`.

#### Step 5: Add Visual Cards & Lightweight UI Elements for Unique Data
In `JobDetailPage.tsx` or job details structure:
- **Hero & Mission Banners**: For flagship recruitment drives (e.g. AIIMS NORCET, SSC CGL, UPSC, Defence drives).
- **Post Code / Discipline / Branch Breakdown Grid**: Multi-card responsive grids for category/discipline-wise post distribution.
- **Physical Standards & Endurance (PET/PST) Metric Cards**: Clean 2-3 column metric cards with measurement badges (Height, Chest, Running time, Long Jump).
- **Typing & Skill Test Specification Badges**: Badges showing WPM speeds, keystrokes, allowed error percentages, and font details.
- **Service Bond & Stipend Callouts**: Highlight boxes for bond duration, amount, and training stipend details.
- **Sidebar Widgets & Related Vacancies**: Ensure right sidebar components (including **Related & Trending Government Vacancies 2026**) are strictly single-column vertical stacks (`flex flex-col space-y-2.5`) for optimal readability.
- **Strict Lightweight Principle**: Keep all custom elements pure Tailwind CSS without adding external packages or heavy DOM nodes.
- Increment counter: `added_jobs_count += 1`.

#### Step 6: Check 10-Job Milestone for Commit & Push
- If `added_jobs_count > 0` and `added_jobs_count % 10 == 0`:
  1. Run production build:
     ```bash
     npm run build
     ```
  2. Commit and push:
     ```powershell
     & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
     & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): batch add 10 vacancies from official portals (total: $added_jobs_count)"
     & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
     ```
  3. Resume with the next URL in the list.

---

### Step 7: Sitemap Update, Final Production SSG Build & Git Push (After All URLs Are Done)

Once all URLs have been processed:
1. **Regenerate & Update Sitemap and Feeds**:
   Always run the sitemap generator to ensure all newly added URLs are included in `public/sitemap.xml`, `rss.xml`, `feed.xml`, and `robots.txt`:
   ```bash
   npx tsx scripts/generate-sitemap.ts
   ```
2. **Run Production SSG Build**:
   ```bash
   npm run build
   ```
3. **Stage, Commit, and Push**:
   ```powershell
   & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
   & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): update sitemap and final batch add remaining vacancies from official portals"
   & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
   ```
4. **Present Summary Table**:
   - **Added Jobs**: Title, Board, Vacancies, Closing Date, Official Link
   - **Skipped Jobs (Duplicates / Ineligible)**: Title, Board, Reason
