---
name: batch-pdf-processor
description: Handles batch uploads of multiple PDF vacancy notices (e.g. 5 PDFs at once). Sequentially scans each PDF, checks for duplicates against existing site entries, and adds new entries with full detailed schemas, builds, and pushes to GitHub.
---

# Batch PDF Vacancy Processor Skill

Use this skill whenever the user uploads multiple PDF files of different government job recruitment notices in a single prompt or batch.

## When to Trigger
Trigger this skill whenever:
- The user uploads 2, 3, 4, 5, or more PDF files in a single session.
- The user asks: "Process these PDFs", "Add all these uploaded vacancies", "Scan and add these job notifications", or requests batch processing of multiple job files.

## Sequential Batch Workflow

For each uploaded PDF file in the batch (e.g. File 1 of 5, File 2 of 5, etc.):

### Step 1: Extract Document Text & Metadata
Run the fast PDF extractor:
```bash
python scripts/extract_pdf_data.py "<pdf_filepath>"
```
Extract key parameters: Board Name, Advt/Letter No., Post Titles, Total Vacancies, Application Dates, Qualification, Age Limit, Fee, Salary/Stipend, Selection Scheme, and Documents.

### Step 2: Duplicate Check
Run the duplicate scanner against `jobsData.ts`:
```bash
python scripts/check_duplicate_vacancy.py "<Title/Text>" "<Board Name>" "<Advt No>"
```
- **If Duplicate (Score >= 50 or matching Advt No)**: Mark file as `DUPLICATE SKIPPED` or update existing entry.
- **If New (NO MATCH)**: Proceed to generate full job entry.

### Step 3: Create Full Job Schema & Entry
Construct complete detailed entries for the new vacancy:
1. **`jobsData.ts`**: Add unique `id`, `b` (board), `t` (title with post count & last date), `d` (post date, e.g. `31 August 2026`), `l` (actual closing/last date, e.g. `16 September 2026` — NEVER use release/start date for `l`, and NEVER use numeric `DD.MM.YYYY` / `DD/MM/YYYY` format; always spell out the month in full), `a` (advt no), `q` (qualification summary), `desc` (rich description), `u` (official website).
2. **`jobDetails.ts`**: Add full `JobDetail` schema containing:
   - `id`, `seoTitle`, `seoDescription`, `focusKeywords`, `lsiKeywords`
   - `title`, `board`, `advtNo`, `vacancies`, `jobLocation`, `applicationMode`, `applicationStatus`, `lastUpdated`
   - `overview` (3-4 paragraphs)
   - `highlights` array (10-12 key-value pairs)
   - `importantDates` array
   - `vacanciesDetails` array: MUST ALWAYS be structured with explicit keys for every post (`postName`, `total`, `ur`, `obc`, `sc`, `st`, `ews`, `qualification`, `payScale`) or categories (`category`, `count`) so the interactive post-wise seat matrix table renders on the live page without omission.
   - `eligibility` object (`education`, `ageLimit`, `ageRelaxation`, `experience`, `medicalStandards`)
   - `salary` object (`payScale`/`payLevel`, `basicPay`/`initialPay`, `gradePay`, `inHandSalary`, `allowances`)
   - `applicationFee` array & `howToPayFee` array (net banking, UPI, cards)
   - `examCentres` object (`details`, `centres`)
   - `selectionProcess` array
   - `howToApply` array
   - `documentsRequired` array
   - `importantInstructions` array
   - `urls` array
   - `faqs` array (4-6 comprehensive Q&As)
3. **`JobDetailPage.tsx` Visual Elements & Sidebar Rule**:
   - Ensure custom visual cards in main content are responsive grids.
   - Any widgets placed in the right sidebar (such as **Related & Trending Government Vacancies 2026**) must strictly tile vertically (`flex flex-col space-y-2.5`) and never use horizontal multi-column grids.

### Step 4: Verify & Deploy
After processing all PDFs in the batch:
1. Run `npm run build` to verify clean compilation and fast SSG page pre-rendering (should finish in ~1 minute).
2. Stage, commit, and push changes to GitHub using MinGit at `C:\Users\Administrator\MinGit\cmd\git.exe`:
   ```powershell
   & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
   & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): batch add <count> recruitment notifications"
   & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
   ```
3. Present a structured summary table for all uploaded files (Status: Added / Duplicate, Job ID, Board, Vacancies, Last Date).
