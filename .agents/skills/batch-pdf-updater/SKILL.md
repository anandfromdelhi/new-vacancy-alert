---
name: batch-pdf-updater
description: Processes a folder/directory containing multiple PDF vacancy files sequentially. Starts with the 1st PDF file and executes the command "find this job and update from information in this pdf file using single-pdf-job-updater skill", moves to the next PDF file once done, and after strictly sequential execution across all files in the directory, runs SSG build and provides a comprehensive summary report.
---

# Batch PDF Vacancy Updater Skill

Use this skill whenever the user provides a folder or directory path containing multiple PDF files (recruitment notices, rulebooks, syllabi, or corrigenda) and requests to update existing jobs on the website sequentially across all the files.

## When to Trigger
Trigger this skill whenever:
- The user provides a directory/folder path containing multiple PDF files (e.g., `C:\Users\...\Downloads\job_pdfs\` or `./vacancies/august_updates/`) and asks:
  - *"Here is a directory of PDF files, start with 1st file and execute 'find this job and update from information in this pdf file using single-pdf-job-updater skill', once done move to next file, and give me a summary"*
  - *"Batch update existing jobs from this folder of PDFs: [directory_path]"*
  - *"Process all PDF files in [folder] sequentially and update existing site entries"*
  - *"Update all vacancies from this directory using single-pdf-job-updater"*

---

## Core Execution Principles

1. **Strictly Sequential File-by-File Execution**:
   - Always enumerate and process files in **strict sequential order** (File 1 of $N$, File 2 of $N$, ..., File $N$ of $N$).
   - Never run parallel batch updates that risk file corruption or race conditions in `jobsData.ts` and `jobDetails.json`.
   - Complete the full update workflow for File $i$ before advancing to File $i+1$.

2. **Preserve Existing Job ID (`id`)**:
   - Locate the target job using `scripts/check_duplicate_vacancy.py`.
   - Always retain the **exact existing `id`** (URL slug) to preserve SEO ranking, external backlinks, and bookmarks.

3. **Zero-Loss Information Enrichment**:
   - Extract and update complete granular information:
     - Exact post-wise and category-wise vacancies (UR, OBC, SC, ST, EWS, PwBD, ESM).
     - Pay level, 7th CPC scale, basic pay, and allowances.
     - Crucial cut-off dates for age and qualifications.
     - Full multi-stage selection process and detailed syllabus/exam pattern.
     - Application fees, how to apply steps, document specifications, and 4–6 comprehensive FAQs.

4. **Strict Application Closing Date (`l` field)**:
   - MUST set `l` in `jobsData.ts` to the **actual application closing/last date** (e.g., `30 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date.

5. **Right Sidebar Strict Vertical Tiling Rule**:
   - Any widgets placed inside the right sidebar (such as **Related & Trending Government Vacancies 2026**) MUST ALWAYS tile vertically in a single column (`flex flex-col space-y-2.5` or `grid grid-cols-1 gap-2.5`). **NEVER** use horizontal multi-column classes (`grid-cols-2`, `grid-cols-3`, `lg:grid-cols-3`) inside the sidebar.

6. **Mandatory Post-wise & Category Seat Matrix Representation (`vacanciesDetails`)**:
   - MUST ALWAYS structure `vacanciesDetails` with explicit fields for every post:
     `{"postName": "...", "total": N, "ur": X, "obc": Y, "sc": Z, "st": W, "ews": V, "qualification": "...", "payScale": "..."}`
   - Alternatively for simple category quotas: `{"category": "UR", "count": N}`.
   - Every single post and quota announced in the PDF must be populated so the interactive seat matrix table is 100% rendered on the live page without omission.

---

## Step-by-Step Batch Execution Protocol

### Step 1: Scan & Enumerate All PDF Files in Directory
Discover and list all `.pdf` / `.PDF` files in the target directory in sorted order:

```bash
python scripts/scan_folder_pdfs.py "<folder_directory_path>"
```

Display the indexed batch queue to the user:
```text
=======================================================
      BATCH PDF QUEUE INITIALIZED
=======================================================
Target Directory: <folder_directory_path>
Total PDF Files : N
Queue:
[1/N] <file_1.pdf>
[2/N] <file_2.pdf>
...
[N/N] <file_N.pdf>
=======================================================
```

---

### Step 2: Strictly Sequential Loop (File 1 to File N)

For each file index `i` from `1` to `N`:

#### 1. Announce Current File Execution
```text
>>> [Processing File i of N]: <current_pdf_filename>
Executing: "find this job and update from information in this pdf file using single-pdf-job-updater skill"
```

#### 2. Extract Document Data
Run the fast text and table extractor:
```bash
python scripts/extract_pdf_data.py "<path_to_current_pdf>"
```
Extract key recruitment attributes:
- Board / Organization Name & Advt / Notification Number
- Post Titles, Classifications, Pay Scale, and Category-wise Vacancies
- Crucial Dates (Start Date, Closing Date `l`, Fee Deadline, Exam Date)
- Complete Eligibility (Education, Age Limit on crucial date, Experience)
- Selection Scheme, Syllabus, Exam Pattern, and Marking Scheme
- Application Fee, Online Portal URL, and FAQs

#### 3. Locate Existing Job on Website
Search for the existing vacancy entry in `src/data/jobsData.ts` and `src/data/jobDetails.json`:
```bash
python scripts/check_duplicate_vacancy.py "<Post Title / Keywords>" "<Board Name>" "<Advt No>"
```
- **Match Found**: Note the existing `job_id` (e.g., `upsc-engineering-services-ese-prelims-recruitment-2026`).
- **No Match Found**: If no existing post corresponds to this PDF, log status as `NOT FOUND / NEW CANDIDATE` (can be created with `single-pdf-job-adder` if intended).

#### 4. Prepare Updated Job JSON Payload
Save the complete enriched JSON structure to `scratch/temp_job.json` using the **exact existing `id`**:
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
    {"label": "Online Application Dates", "value": "..."},
    {"label": "Selection Process", "value": "..."},
    {"label": "Official Website", "value": "..."}
  ],
  "importantDates": [
    {"event": "Detailed Notification Released", "date": "..."},
    {"event": "Online Application Starting Date", "date": "..."},
    {"event": "Online Application Closing Date", "date": "..."},
    {"event": "Last Date for Fee Payment", "date": "..."},
    {"event": "Exam Date", "date": "..."}
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
    "ageRelaxation": ["..."]
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
    {"category": "SC / ST / PwBD / Ex-SM", "fee": "..."}
  ],
  "selectionProcess": [
    {"stage": "Stage 1", "description": "..."},
    {"stage": "Stage 2", "description": "..."}
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
    {"question": "...", "answer": "..."}
  ]
}
```

#### 5. Execute Job Entry Updater
Apply the update to `src/data/jobDetails.json`, `src/data/jobsData.ts`, and `src/data/jobUploadDates.json`:
```bash
python scripts/update_job_entry.py scratch/temp_job.json
```

#### 6. Record State & Advance to Next File
- Log completion of File $i$.
- Record metadata for the final summary table (Filename, Job ID, Board, Vacancies, Closing Date `l`, Status).
- **Immediately advance to File $i+1$** and repeat steps 1–6 until all $N$ files are processed.

---

### Step 3: Build & SSG Pre-Rendering
Once all $N$ files in the directory have been processed:
```bash
npm run build
```
This automatically runs:
1. `split-job-details.ts`: Modularizes updated records into `src/data/jobs-generated/<job-id>.json`.
2. `vite build`: Compiles production bundle.
3. `prerender.ts`: Pre-renders full static HTML pages into `dist/<job-id>/index.html` and `dist/<job-id>.html`.
4. Regenerates `sitemap.xml`, `robots.txt`, and RSS feeds.

---

### Step 4: Commit & Push to Repository
Commit and push all changes using MinGit:
```powershell
& "C:\Users\Administrator\MinGit\cmd\git.exe" add .
& "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "fix(jobs): batch update vacancies from folder (<count> files processed)"
& "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
```

---

### Step 5: Final Execution Summary Report
Present a comprehensive, formatted markdown summary to the user:

```markdown
### 📋 Batch Folder PDF Update Summary Report

**Target Folder**: `<folder_directory_path>`
**Total Files Scanned**: `N`

| # | PDF File | Matched Job ID | Board / Organization | Vacancies | Closing Date (`l`) | Status |
|---|---|---|---|---|---|---|
| 1 | `advt_01_ssc.pdf` | `ssc-cgl-recruitment-2026` | Staff Selection Commission | 14,582 | 28 Sep 2026 | ✅ Updated |
| 2 | `rrb_technician.pdf` | `rrb-technician-grade-i-iii-recruitment-2026` | Railway Recruitment Boards | 9,144 | 15 Oct 2026 | ✅ Updated |
| 3 | `upsc_ese_detailed.pdf` | `upsc-engineering-services-ese-prelims-2026` | Union Public Service Commission | 412 | 22 Sep 2026 | ✅ Updated |

#### 📊 Execution Metrics:
- **Total PDFs Processed**: `N`
- **Successfully Updated**: `X`
- **Unmatched / Skipped**: `Y`
- **SSG Pre-rendering**: Passed (0 errors)
- **Deployment Status**: Pushed to `main` branch
```
