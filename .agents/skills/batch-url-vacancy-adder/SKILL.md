---
name: batch-url-vacancy-adder
description: Handles batch processing of multiple webpage URLs. Sequentially fetches each URL, extracts rich recruitment data directly from page text (filtering out 3rd-party/private references and retaining official government links without inspecting PDFs), creates complete job entries one-by-one, and runs a single production build and Git push after all URLs are processed.
---

# Batch URL Vacancy Adder Skill

Use this skill whenever the user provides a list of multiple webpage URLs and asks to extract and add job vacancy notifications to the website.

## Core Rules & Principles

1. **Strict Sequential Execution**:
   - Process each URL **one-by-one** in strict sequence.
   - Fetch URL 1, extract data, check duplicates, generate complete schema, and add it to `jobsData.ts` and `jobDetails.json`.
   - **ONLY AFTER** URL 1 is fully integrated and saved, proceed to URL 2, then URL 3, etc.
2. **Text-Direct Sourcing (No PDF Inspection)**:
   - Extract 100% of the recruitment data directly from the text and tables on the webpage.
   - Do **NOT** download, OCR, or inspect linked PDF files unless explicitly requested.
3. **Official Govt Links Only (Filter Out 3rd-Party References)**:
   - Identify, verify, and retain **only official government portals, department websites, and recruiting authority links**.
   - Ignore and strip out all references, backlinks, or promotions to private coaching centers, job forums, blogs, or 3rd-party aggregators.
4. **Strict Application Closing Date (`l` field)**:
   - In `jobsData.ts`, **ALWAYS** set `l` to the actual application closing / last date (e.g. `15 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date.
5. **Zero-Loss Rich Schemas & 20+ FAQs**:
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
6. **Single Final Build & GitHub Deployment**:
   - Do not rebuild after every single URL.
   - Once all URLs in the user's list have been processed and added to `jobsData.ts` and `jobDetails.json`, run `npm run build` once to pre-render static SSG pages and synchronize `sitemap.xml` and RSS feeds.
   - Commit and push to GitHub using `C:\Users\Administrator\MinGit\cmd\git.exe`.

---

## Step-by-Step Batch Workflow

### For Each URL in the Provided List:

#### Step 1: Fetch Webpage Content
Use the `read_url_content` tool to fetch the text and tables of the target URL.

#### Step 2: Filter & Structure Vacancy Data
- Extract: Board Name, Advt No., Post Names, Vacancy Counts, Category Breakdowns, Dates, Qualifications, Age Limits, Fees, Salary/Pay Levels, Selection Stages, and Official Govt URLs.
- Filter out private aggregators, ads, and non-official websites.

#### Step 3: Duplicate Check
Run the duplicate checker:
```bash
python scripts/check_duplicate_vacancy.py "<Job Title / Board>" "<Board Name>" "<Advt No>"
```
- If duplicate is found (Score >= 50), report and skip or update.
- If no duplicate, proceed to insertion.

#### Step 4: Insert Complete Job Entry
Save job schema JSON to `scratch/temp_job.json` and execute:
```bash
python scripts/add_job_entry.py scratch/temp_job.json
```
Verify entry is added to `src/data/jobDetails.json` and `src/data/jobsData.ts`, and update `src/data/jobUploadDates.json`.

*(Now move to the next URL in the list and repeat Steps 1 to 4).*

---

### Step 5: Final Production SSG Build & Git Push (After All URLs Are Done)

Once all URLs are processed:
1. Run the production build & SSG pre-rendering:
   ```bash
   npm run build
   ```
2. Verify pre-rendering of static HTML routes and sitemap synchronization.
3. Stage, commit, and push to GitHub:
   ```powershell
   & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
   & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): batch add <N> vacancies from official portal sources"
   & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
   ```
4. Present a clear summary table of all added jobs (Job Title, Board, Vacancies, Last Date, Official Link).
