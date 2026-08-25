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
3. **Periodic Git Commit & Push (Every 10 Jobs Added)**:
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
4. **Text-Direct Sourcing (No PDF Inspection)**:
   - Extract 100% of the recruitment data directly from the text and tables on the webpage.
   - Do **NOT** download, OCR, or inspect linked PDF files unless explicitly requested.
5. **Official Govt Links Only (Filter Out 3rd-Party References)**:
   - Identify, verify, and retain **only official government portals, department websites, and recruiting authority links**.
   - Ignore and strip out all references, backlinks, or promotions to private coaching centers, job forums, blogs, or 3rd-party aggregators.
6. **Strict Application Closing Date (`l` field)**:
   - In `jobsData.ts`, **ALWAYS** set `l` to the actual application closing / last date (e.g. `15 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date.
7. **Zero-Loss Rich Schemas & 20+ FAQs**:
   - Every job must have rich, comprehensive data including:
     - `id`, `seoTitle`, `seoDescription`, `focusKeywords`, `lsiKeywords`
     - `title`, `board`, `advtNo`, `vacancies`, `jobLocation`, `applicationMode`, `applicationStatus`, `lastUpdated`
     - `overview` (2-3 detailed paragraphs)
     - `highlights` (10-12 key parameters)
     - `importantDates` (all key milestones)
     - `vacanciesDetails` (complete category/post breakdown)
     - `eligibility` (`education`, `ageLimit`, `medicalStandards`)
     - `salary` (`payLevel`, `initialPay`, `allowances`)
     - `applicationFee` (category-wise breakdown)
     - `selectionProcess` (stages, marks, negative marking, qualifying cutoffs)
     - `howToApplySteps` (step-by-step application instructions)
     - `documentsRequired` (certificates, photo/sign specifications)
     - `faqs` (15-20+ practical FAQs addressing all candidate questions)
     - `urls` (official government recruitment portals)

---

## Step-by-Step Batch Workflow

### State / Counter Tracking:
Maintain a counter `added_jobs_count = 0` throughout the session.

---

### For Each URL in the Provided List:

#### Step 1: Fetch Webpage Content
Use the `read_url_content` tool to fetch the text and tables of the target URL.

#### Step 2: Filter & Structure Vacancy Data
- Extract: Board Name, Advt No., Post Names, Vacancy Counts, Category Breakdowns, Dates, Qualifications, Age Limits, Fees, Salary/Pay Levels, Selection Stages, and Official Govt URLs.
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
3. Increment counter: `added_jobs_count += 1`.

#### Step 5: Check 10-Job Milestone for Commit & Push
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

### Step 6: Sitemap Update, Final Production SSG Build & Git Push (After All URLs Are Done)

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
