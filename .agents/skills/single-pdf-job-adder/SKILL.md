---
name: single-pdf-job-adder
description: Ultra-fast single-command skill to extract, duplicate-check, build detailed job entries, and add visual cards for government vacancy PDFs.
---

# Single PDF Job Adder Skill

Use this skill whenever the user uploads a single PDF vacancy notification, screenshot, or official notice and asks to add it to the website with rich details, tables, visual cards, and no horizontal scrolling.

## Key Goals & Principles
1. **Instant Duplicate Check**: Ensures job is not already on the site.
2. **Zero-Loss Data Extraction**: Extracts every post code, pay level, qualification, date, fee structure, syllabus, and document rule from the PDF.
3. **Rich Aesthetic & Visual Cards**: Includes hero mission banner, post code breakdown cards, and document upload specification boxes in `JobDetailPage.tsx`.
4. **No Horizontal Scroll**: Guarantees all tables and grids are 100% responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `w-full`, `max-w-full`, `break-words`).
5. **High Speed & Low Compute**: Uses automated scripts to perform check, schema formatting, file updates, and SSG pre-rendering in seconds.

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

### Step 4: Add Visual Cards (If Applicable)
In `JobDetailPage.tsx`:
- Add hero banner for special recruitment drives or major boards.
- Add post code / discipline breakdown grid cards under Educational Qualification.
- Add document/image upload specification cards under How to Apply.

### Step 5: Post-Build Pre-rendering
Run SSG pre-rendering:
```bash
npx tsx scripts/post-build.ts
```
