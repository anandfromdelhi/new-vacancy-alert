---
name: vacancy-duplicate-checker
description: Automatically scans uploaded PDF notifications or text snippets of government vacancy notices against existing entries in jobsData.ts and jobDetails.ts to instantly determine if the job is already present on the site.
---

# Vacancy Duplicate Checker Skill

Use this skill whenever the user uploads a new PDF file, screenshot, or text notification of a government job recruitment and asks to add or check it.

## When to Trigger
Trigger this skill immediately when:
- The user uploads a PDF notification or image of a government vacancy.
- The user asks: "Is this job already on my site?", "Check if we have this vacancy", "Scan for duplicates", or requests to add a new job notification.

## Workflow

### Step 1: Extract Key Attributes from the Uploaded Document
Extract the following key identification fields from the PDF/text:
1. **Recruiting Board / Organization Name & Acronyms** (e.g. `SSC` / `Staff Selection Commission`, `UKSSSC`, `TNPSC`, `AIIMS`, `IIT`, `GIMS`)
2. **Advertisement Number / Letter Number / Circular No.** (e.g. `Advt No. 80/2026`, `F. No. HQ-C-3019/1/2026-C-3`, `SAN.66/2019/89`)
3. **Job / Post Title & Total Vacancies Count** (e.g. `Junior Engineer - 1748 Posts`, `553 Junior Assistant`)
4. **Official Notification PDF URL or Source URL** (e.g. `https://ssc.gov.in/.../notice_of_adv_je_2026.pdf`)
5. **State / Region / Location** (e.g. `Uttarakhand`, `Tamil Nadu`, `All India`)

### Step 2: Run the Multi-Factor Duplicate Scanner Tool
Always provide the official PDF / notification URL and vacancies count along with title, board, and advertisement number:
```bash
python scripts/check_duplicate_vacancy.py "<Full Title or Post Name>" "<Board Name or Acronym>" "<Advt / Letter No>" "<Official PDF or Source URL>" "<Total Vacancies Count>"
```

### Step 3: Interpret Results & Prevent Duplicate Additions

- **If Match Score >= 70 or Exact URL/Advt Match**:
  - State clearly: `⚠️ DUPLICATE FOUND: This recruitment notification is ALREADY present on the site.`
  - Display the existing Job ID, Title, Board, Advt No, Vacancies, and Last Date.
  - **DO NOT create a duplicate entry with a new slug.**
  - If the uploaded document contains newer dates (e.g. extension corrigendum), update the existing entry using `single-pdf-job-updater` instead of creating a second entry.

- **If Match Score between 40 and 69**:
  - Check carefully: Are the post titles and campuses distinct (e.g., `IIT Kanpur` vs `IIT Delhi`, or `Assistant Professor` vs `Lab Assistant`)? If it's a distinct post from the same board, ensure the new job ID has a distinct slug suffix.
  - If it's the exact same recruitment (e.g. same vacancies count and same board), treat as duplicate and do NOT add.

- **If Match Score < 40 or NO MATCH**:
  - State clearly: `✅ NEW VACANCY: This job is NOT present on your site.`
  - Proceed to extract full PDF details and add the job. Notice that `scripts/add_job_entry.py` also features an automated duplicate guard that will refuse insertion if a duplicate is detected.

