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
1. **Recruiting Board / Organization Name** (e.g. `NLC India Limited`, `MPESB`, `ICDS UP Ambedkarnagar`, `KEA`, `AIIMS`)
2. **Advertisement Number / Letter Number / Circular No.** (e.g. `L&DC/02/2026`, `C-1021`, `ED/KEA/26/REC-V/2026`)
3. **Job / Post Title & Posts Count** (e.g. `Anganwadi Worker & Sahayika`, `Patwari Executive`, `Apprentice`)
4. **State / Region / Location** (e.g. `Uttar Pradesh`, `Madhya Pradesh`, `Tamil Nadu`, `Rajasthan`)

### Step 2: Run the Duplicate Scanner Tool
Execute the fast scanning script in terminal:
```bash
python scripts/check_duplicate_vacancy.py "<Full Title or Text>" "<Board Name>" "<Advt / Letter No>"
```

### Step 3: Interpret Results & Report to User

- **If Match Score >= 50 or Exact Advt/Letter Match**:
  - State clearly: `⚠️ DUPLICATE FOUND: This job is already present on your site.`
  - Display the existing Job ID, Title, Board, Advt No, and last date.
  - Ask if the user wants to update/revise the existing entry instead of creating a new one.

- **If Match Score < 20 or NO MATCH**:
  - State clearly: `✅ NEW VACANCY: This job is NOT present on your site.`
  - Proceed directly to extract full PDF details, construct `jobsData.ts` & `jobDetails.ts` entries, and add the job.
