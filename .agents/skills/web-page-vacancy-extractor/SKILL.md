---
name: web-page-vacancy-extractor
description: Capability to source, extract, and convert recruitment data directly from live webpages, URLs, HTML tables, and official portal notices into structured website vacancy entries.
---

# Live Web Page Vacancy Extractor & Sourcing Skill

Use this skill whenever the user provides a web URL (or asks to fetch, scrape, source, or extract vacancy notifications directly from a live web page or portal) to extract post titles, category breakdowns, dates, fee structures, eligibility criteria, and downloadable PDF links to add new entries to the site.

## Key Capabilities
- **URL & Web Page Sourcing**: Fetches live web pages from official government portals, PSUs, universities, banks, and recruitment boards.
- **Automated HTML Table & Text Extraction**: Extracts job tables, eligibility criteria, pay scales, application start/end dates, and fee details directly from web content.
- **Link & PDF Discovery**: Automatically discovers downloadable official notification PDFs (`.pdf`), application forms, and online portal links embedded on the web page.
- **Multi-Source Ingestion**: Combines live webpage text with linked PDF notifications for 100% accurate, zero-loss recruitment data entries.

---

## Workflow

### Step 1: Run Live Web Page Extractor Command
Run the web extraction script in terminal using the target URL:
```bash
python scripts/extract_web_vacancy.py "<URL>"
```
*Example:*
```bash
python scripts/extract_web_vacancy.py "https://ada.gov.in"
```

Alternatively, for static pages, use the internal `read_url_content` tool to fetch markdown content from the URL directly.

### Step 2: Download or Inspect Linked Notification PDFs (If Discovered)
If the live webpage links to official PDF notifications (e.g. `ADV_138_noti.pdf`), download or inspect the PDF using:
```bash
python scripts/extract_pdf_data.py "<path_or_url_to_pdf>"
```

### Step 3: Parse and Structure Vacancy Data
Organize the extracted web page information into standard recruitment fields:
1. **Recruiting Organization / Board Name**
2. **Notification / Advt Number**
3. **Job Title & Disciplines**
4. **Total Vacancies & Post-wise Breakdown**
5. **Educational & Experience Eligibility**
6. **Pay Scale / Salary / Monthly Stipend**
7. **Important Dates**: Start date, Last date to apply, Exam/Interview dates (**MANDATORY: ALWAYS spell out the English month in full, e.g. `06 October 2026`; NEVER use numeric dates like `06.10.2026` or `06/10/2026`**).
8. **Application Fee & Mode of Payment**
9. **Selection Process** (Written test, GATE score, Interview, Physical test)
10. **Official URLs** (Apply link & Notification PDF link)

### Step 4: Run Duplicate Checker & Create Site Entry
1. **MANDATORY Duplicate Scan**: Run `check_duplicate_vacancy.py` with all 5 parameters to prevent duplicate entries:
   ```bash
   python scripts/check_duplicate_vacancy.py "<Job Title>" "<Board>" "<Advt No>" "<PDF/Page URL>" "<Total Vacancies>"
   ```
   If a match is found with score >= 70% or matching PDF URL / Advt No: **DO NOT CREATE A DUPLICATE ENTRY.** Update the existing entry or ask the user.

2. **Short, Acronym-First URL Slug Standard (< 45 chars) with Year**:
   - URL slug (`id`) MUST be concise, prioritize **board and exam/post acronyms**, and include the recruitment year (e.g. `-2026`).
   - Formula: `<board-acronym>-[campus-]<exam-or-post-acronym>-recruitment-<year>`
   - Examples:
     - `ssc-je-recruitment-2026` (instead of `staff-selection-commission-junior-engineer-...`)
     - `upsc-cse-recruitment-2026` (instead of `union-public-service-commission-civil-services-...`)
     - `aiims-delhi-sr-recruitment-2026` (instead of `all-india-institute-of-medical-sciences-delhi-senior-resident-...`)
     - `tnpsc-ctse-recruitment-2026` (instead of `tamil-nadu-public-service-commission-combined-technical-...`)

3. **Save and Ingest**:
   - Save the formatted JSON to `scratch/temp_job.json`
   - Ingest into the database using:
     ```bash
     python scripts/add_job_entry.py scratch/temp_job.json
     ```
     *(This script automatically runs duplicate verification and date normalization).*

### Step 5: Build and Push
Run:
```bash
npm run prebuild
npm run build
```
Verify TypeScript compilation and verify that per-job JSON files in `src/data/jobs-generated/` and sitemap are refreshed, then commit and push.
