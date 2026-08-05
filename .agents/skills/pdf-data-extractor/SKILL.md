---
name: pdf-data-extractor
description: High-speed, zero-loss PDF text & table extractor for government job notifications, official rulebooks, and circulars. Extracts complete content page-by-page without data loss or truncation.
---

# Fast Lossless PDF Data Extractor Skill

Use this skill whenever the user uploads a PDF file (government recruitment notification, rulebook, brochure, syllabus, or official circular) and asks to read, analyze, process, or add it to the site.

## Key Capabilities
- **Fast Execution**: Reads multi-page PDFs (from 1-page notices to 150+ page rulebooks) in seconds.
- **Zero-Loss Data Preservation**: Captures exact post titles, category-wise vacancy numbers, key dates, fee structures, stipend amounts, age limits, syllabus topics, and eligibility rules without missing tables or numbers.
- **Page-by-Page Inspection**: Allows focused page extraction or full document parsing.

## Workflow

### Step 1: Run PDF Extractor Command
Run the fast extractor script in terminal:
```bash
python scripts/extract_pdf_data.py "<path_to_pdf>" [max_pages]
```
- Omit `[max_pages]` to extract all pages of the document.
- Pass `[max_pages]` (e.g. `5` or `10`) for quick scanning of long rulebooks.

### Step 2: Structure Extracted Information
After extraction, parse and organize the data into standard recruitment sections:
1. **Recruiting Enterprise / Issuing Authority**
2. **Notification / Advt / Circular Number**
3. **Post Name(s) & Total Vacancies** (Category & discipline-wise breakdown)
4. **Key Dates** (Online start, last date, correction window, exam/joining date)
5. **Application Fees** (UR, SC/ST/OBC/EWS/PwD, portal charges)
6. **Educational & Technical Qualification** (Degree, Diploma, ITI, Experience, Domicile, Age Limit)
7. **Salary / Pay Scale / Stipend** (Basic pay, Level, DBT components)
8. **Selection Scheme & Exam Pattern** (Marks, negative marking, paper sections)
9. **Required Documents & How to Apply Steps**

### Step 3: Run Duplicate Check & Create Job Entry
Follow up with `check_duplicate_vacancy` to ensure the job isn't already present, then format and update `jobsData.ts` and `jobDetails.ts`.
