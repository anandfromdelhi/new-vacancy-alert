---
name: batch-url-vacancy-adder
description: Handles batch processing of multiple webpage URLs. Sequentially fetches each URL, extracts rich recruitment data directly from page text (with smart fallback to linked official notification PDFs), enforces strict anti-hallucination and zero-loss rules, checks for duplicates, creates complete rich job entries one-by-one, commits and pushes to GitHub every 10 added jobs, and completes sitemap generation, build, and push after all URLs are processed.
---

# Batch URL Vacancy Adder Skill (High-Fidelity & Anti-Hallucination)

Use this skill whenever the user provides a list of multiple webpage URLs and asks to extract and add comprehensive, rich job vacancy notifications to the website.

## Core Rules & Principles

1. **Strict Sequential Execution**:
   - Process each URL **one-by-one** in strict sequence.
   - Fetch URL, extract data, check duplicates, generate complete schema, and add it to `jobsData.ts` and `jobDetails.json`.
   - Complete processing of URL 1 before moving to URL 2. Proceed sequentially through the entire list.

2. **Zero Hallucination & Strict Grounding Directive**:
   - **NEVER invent, extrapolate, or guess any data**:
     - Do NOT guess age limits (do NOT assume 18–30 or 18–35 unless explicitly written).
     - Do NOT guess application fees (do NOT assume General is ₹100 or ₹500 unless stated).
     - Do NOT guess salary, pay scale, pay level, or grade pay.
     - Do NOT invent exam dates, exam patterns, or negative marking rules.
     - Do NOT create fabricated or generic answers in FAQs.
   - **Explicit Handling of Unspecified Fields**:
     - If a particular detail (e.g. exam date, fee exemption, age relaxation) is not stated in the source notice, write: `"Not specified in official notification"` or omit the optional sub-field.
     - In FAQs, if a question cannot be answered from the notification, explicitly state: `"The official notification does not specify this detail. Candidates should refer to the official portal at [official link] for subsequent updates."`
   - **Math & Vacancy Verification**:
     - The sum of category quotas (UR + OBC + SC + ST + EWS) or individual post counts MUST match the declared total `vacancies`.
     - If the source document has an internal mismatch, note the figures verbatim as reported by the board.

3. **Smart Official PDF / Circular Fallback**:
   - Extract all available data directly from the webpage.
   - **Official Notice / PDF Fallback**: Many government websites (e.g. State PSCs, High Courts, AIIMS, DRDO, BEL, Railway boards) post only a brief 1-to-2 line notification stub on the web page containing a link like `Download Advertisement (PDF)` or `Detailed Notification.pdf`.
   - In such cases, download or inspect the linked official PDF using:
     ```bash
     python scripts/extract_pdf_data.py "<path_or_url_to_pdf>"
     ```
   - Use the extracted PDF content to populate the full vacancy matrix, syllabus, exam pattern, and eligibility criteria so the page has complete, 100% verified information without guesswork.

4. **Mandatory Duplicate Check & Auto-Skip**:
   - **BEFORE** adding any new vacancy, always run the duplicate checker:
     ```bash
     python scripts/check_duplicate_vacancy.py "<Job Title / Board>" "<Board Name>" "<Advt No>"
     ```
   - If a duplicate is detected (Score >= 50 or matching Board + Advt No / Title in `jobsData.ts` / `jobDetails.json`), **IMMEDIATELY SKIP** that job.
   - Note it in the summary as skipped (Duplicate) and proceed directly to the next URL.

5. **Exhaustive Zero-Loss Data Extraction (No Skipping or Summarizing)**:
   - **Zero Truncation**: Never compress, omit, or summarize tables.
   - **Complete Post Breakdown (`vacanciesDetails`)**:
     - If a notification lists 10, 20, or 50 distinct posts, trades, or disciplines, **every single post must be an entry in `vacanciesDetails`**.
     - Never write "Various other posts: see notice" or aggregate distinct trades into a generic label.
     - Capture all quota columns (`ur`, `obc`, `sc`, `st`, `ews`, `pwbd`, `exsm`).
   - **Verbatim Eligibility & Experience**:
     - Capture exact degrees, disciplines, minimum qualifying percentages (e.g. 60% for UR, 55% for SC/ST), professional registrations (State Nursing Council, Bar Council, Medical Council, Apprenticeship portal), and exact years of post-qualification experience required.

6. **Strict Application Closing Date (`l` field) & Mandatory Spelled-Out Month Formatting**:
   - In `jobsData.ts`, **ALWAYS** set `l` to the actual application closing / last date (e.g. `16 September 2026`).
   - **NEVER** set `l` to the notification release date or application start date — putting a release date in `l` causes `isJobExpired()` to prematurely hide active jobs from the Home Page!
   - If the closing date is not yet announced, set `l` to `"To be announced"`. For continuous walk-in recruitments, set `l` to `"Walk-in (See schedule)"`.
   - **MANDATORY: NEVER USE NUMERIC DATES** like `DD.MM.YYYY` or `DD/MM/YYYY` (e.g. `06.10.2026` or `06/10/2026`). In Indian government notices, `06.10.2026` is 06 October, NOT 10 June. Numeric dates cause severe user confusion with US `MM/DD` format.
   - **ALWAYS spell out the English month name in full** across all fields (`importantDates`, `highlights`, `jobsData.ts` `l` & `d`, `overview`, and `faqs`): e.g. **`06 October 2026 (11:59 PM)`**, **`07 September 2026`**, **`31 August 2026`**.

7. **Full Schema Utilization for Deep Richness**:
   Every job must have rich, comprehensive, and grounded data including:
   - `id`, `seoTitle`, `seoDescription`, `focusKeywords`, `lsiKeywords`
   - `title`, `board`, `advtNo`, `vacancies`, `jobLocation`, `applicationMode`, `applicationStatus`, `lastUpdated`
   - `overview` (2-3 detailed paragraphs)
   - `highlights` (10-14 key parameters)
   - `importantDates` (all key milestones with spelled-out months)
   - **Prominent "Click to Apply" CTA / Button / Section**: Directing applicants straight to the official government application portal.
   - `vacanciesDetails` (exhaustive post-wise, discipline-wise, and category-wise breakdown)
   - `eligibility` (`education`, `ageLimit`, `ageRelaxation`, `experience`, `medicalStandards`)
   - `salary` (`payScale`, `basicPay`, `gradePay`, `inHandSalary`, `allowances`)
   - `applicationFee` (category-wise breakdown) & `howToPayFee`
   - `selectionProcess` (stages, marks, negative marking, qualifying cutoffs)
   - `examPattern` (paper names, subjects, questions, marks, duration)
   - `syllabus` (subject-wise topic lists)
   - `examCentres` (district and city testing centres)
   - `howToApply` (step-by-step application instructions)
   - `documentsRequired` (certificates, photo/sign specifications)
   - `importantInstructions` (crucial examination and verification guidelines)
   - `urls` (official government recruitment and application portals)
   - `faqs` (15-20 strictly grounded candidate FAQs — no fabricated answers)

8. **Adaptive Representation of Unique Tables & Atypical Data**:
   - Many webpage notifications feature specialized tables and uncommon data structures (e.g., Physical Measurement & Endurance Standards / PET / PST, Typing / Stenography speed benchmarks, Medical & Eye Vision criteria, Trade / Discipline / Branch seat matrices, Service Bonds & Training Stipend terms, Multi-stage marking schemes, or Photo/Signature upload specs).
   - Never omit or flatten these unique tables into plain paragraphs. Convert them into structured data and render them with tailored, visually appealing UI elements.

9. **Lightweight & High-Performance Visual Elements**:
   - **Zero JS Bloat**: Never import external charting libraries or heavy UI dependencies. Use native Tailwind CSS utility classes (`grid`, `flex`, `divide-y`, `rounded-xl`, `border`, `bg-gradient-to-br`, `backdrop-blur-sm`).
   - **Responsive Card Decks & Metric Grids**: Replace wide, horizontally overflowing HTML tables with responsive card grids (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`) featuring metric callouts, pill badges, and clean key-value rows.
   - **Right Sidebar Strict Vertical Tiling Rule**: Any widgets placed inside the right sidebar (such as **Related & Trending Government Vacancies 2026**, author cards, social handles) MUST ALWAYS tile vertically in a single column (`flex flex-col space-y-2.5` or `grid grid-cols-1 gap-2.5`). **NEVER** use horizontal multi-column classes (`grid-cols-2`, `grid-cols-3`, `lg:grid-cols-3`) inside the sidebar.
   - **Visual Callouts & Badge Clusters**: Highlight critical clauses using alert badges (`border-l-4`, badge chips `bg-emerald-50 text-emerald-700 border-emerald-200`, `bg-amber-50`, `bg-indigo-50`).
   - **No Horizontal Scroll**: Guarantees all tables, cards, and grids are 100% responsive (`w-full`, `max-w-full`, `break-words`, `overflow-hidden`).

10. **Official Govt Links Only (Filter Out 3rd-Party References)**:
    - Identify, verify, and retain **only official government portals, department websites, and recruiting authority links**.
    - Ignore and strip out all references, backlinks, or promotions to private coaching centers, job forums, blogs, or 3rd-party aggregators.

11. **Periodic Git Commit & Push (Every 10 Jobs Added)**:
    - Track the count of successfully added jobs (`added_jobs_count`).
    - **After every 10 jobs added** (e.g., 10th, 20th, 30th job):
      1. Run `npm run build`
      2. Commit and push to GitHub:
         ```powershell
         & "C:\Users\Administrator\MinGit\cmd\git.exe" add .
         & "C:\Users\Administrator\MinGit\cmd\git.exe" commit -m "feat(jobs): batch add 10 vacancies from official portals (total: $added_jobs_count)"
         & "C:\Users\Administrator\MinGit\cmd\git.exe" push origin main
         ```
      3. Continue processing the remaining URLs.
    - At the end of the entire list, update the sitemap (`npx tsx scripts/generate-sitemap.ts`), run production build, commit, and push.

---

## Step-by-Step Batch Workflow

### State / Counter Tracking:
Maintain a counter `added_jobs_count = 0` throughout the session.

---

### For Each URL in the Provided List:

#### Step 1: Fetch Webpage Content
Use `read_url_content` or `python scripts/extract_web_vacancy.py "<URL>"` to fetch the text and tables of the target URL.

#### Step 2: Smart Discovery & Inspection of Linked Official PDF
- If the webpage is a brief summary or announcement stub linking to an official PDF / circular notice:
  1. Extract the PDF URL from discovered links.
  2. Inspect the PDF using:
     ```bash
     python scripts/extract_pdf_data.py "<path_or_url_to_pdf>"
     ```
  3. Combine webpage text and official PDF text for 100% complete, verified extraction without guesswork.

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

#### Step 4: Build Complete Grounded Job JSON Schema
Save complete job schema JSON to `scratch/temp_job.json`:

```json
{
  "id": "<generated-unique-slug-id>",
  "seoTitle": "<Optimized Title with Board & Year> | NewVacancyAlert",
  "seoDescription": "<150-160 char meta description with exact vacancies, qualification, pay scale, and last date>",
  "focusKeywords": "<Primary keywords>",
  "lsiKeywords": "<Secondary LSI keywords>",
  "title": "<Full Official Post Title with Total Vacancies>",
  "board": "<Full Board / Department / Commission Name>",
  "advtNo": "<Official Advertisement / Notification Number>",
  "vacancies": 0,
  "jobLocation": "<State / All India>",
  "applicationMode": "Online",
  "applicationStatus": "Online Registration Opens DD Month YYYY to DD Month YYYY",
  "lastUpdated": "YYYY-MM-DD",
  "overview": [
    "<Paragraph 1: Official notification announcement, board, post names, pay scale, vacancy count>",
    "<Paragraph 2: Educational qualifications, age criteria, reservation categories>",
    "<Paragraph 3: Selection stages, exam pattern, official portal URL, and application deadline>"
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
    {"label": "Online Application Dates", "value": "DD Month YYYY to DD Month YYYY"},
    {"label": "Selection Process", "value": "..."},
    {"label": "Official Website", "value": "..."}
  ],
  "importantDates": [
    {"event": "Notification Published Date", "date": "DD Month YYYY"},
    {"event": "Online Application Commencement", "date": "DD Month YYYY"},
    {"event": "Last Date for Online Application", "date": "DD Month YYYY (11:59 PM)"},
    {"event": "Last Date for Application Fee Payment", "date": "DD Month YYYY"},
    {"event": "Application Correction Window", "date": "DD Month YYYY to DD Month YYYY"},
    {"event": "Written Exam / Skill Test Date", "date": "DD Month YYYY / To be announced"}
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
    "ageRelaxation": [
      "SC / ST Candidates: 5 Years",
      "OBC Candidates: 3 Years",
      "PwBD Candidates: 10 Years"
    ],
    "experience": ["..."],
    "medicalStandards": ["..."]
  },
  "salary": {
    "payScale": "...",
    "basicPay": "...",
    "gradePay": "...",
    "inHandSalary": "...",
    "allowances": ["Dearness Allowance (DA)", "House Rent Allowance (HRA)", "Transport Allowance"]
  },
  "applicationFee": [
    {"category": "General / OBC / EWS", "fee": "..."},
    {"category": "SC / ST / PwBD / Ex-SM", "fee": "..."}
  ],
  "howToPayFee": [
    "Online via Debit Card, Credit Card, Net Banking, or UPI payment gateways.",
    "Retain e-receipt and transaction reference number for future verification."
  ],
  "examCentres": {
    "details": "City 1, City 2, City 3, City 4"
  },
  "selectionProcess": [
    {"stage": "Stage 1: Written Examination / CBT", "description": "..."},
    {"stage": "Stage 2: Skill / Typing / Practical Test", "description": "..."},
    {"stage": "Stage 3: Document Verification", "description": "Verification of original certificates"},
    {"stage": "Stage 4: Medical Examination", "description": "Medical fitness assessment"}
  ],
  "howToApply": [
    "Visit official website at ...",
    "Complete one-time registration and login with generated credentials.",
    "Fill application details and upload required scanned documents.",
    "Pay prescribed application fee online and submit final application form."
  ],
  "documentsRequired": [
    "Scanned passport-size photograph (as per prescribed KB/pixel specifications).",
    "Scanned signature on white paper with black/blue ink.",
    "10th / Matriculation Certificate as Date of Birth proof.",
    "Educational Qualification mark sheets and passing certificates.",
    "Category / Caste / EWS / Disability certificate (if claiming reservation)."
  ],
  "importantInstructions": [
    "Ensure all uploaded documents are clear and valid on the crucial date.",
    "Submit the online form before the closing date to avoid last-minute server rush."
  ],
  "urls": [
    {"title": "Official Online Application Portal", "url": "..."},
    {"title": "Download Official Notification PDF", "url": "..."}
  ],
  "faqs": [
    {"question": "What is the last date to apply for <Job Title>?", "answer": "..."},
    {"question": "What is the application fee for <Job Title>?", "answer": "..."},
    {"question": "What is the age limit and relaxation criteria?", "answer": "..."},
    {"question": "What is the educational qualification required?", "answer": "..."}
  ]
}
```

#### Step 5: Pre-Flight Verification Checklist
Before running the inserter, verify:
1. **Application Closing Date (`l`)**: Is it set to the actual application closing date (not release date)?
2. **Month Names**: Are all dates formatted with spelled-out English month names (`DD Month YYYY`)?
3. **Factual Grounding**: Are all qualifications, fees, and post counts taken directly from the document without guessing?
4. **All Posts Captured**: Are all posts/branches from the source included in `vacanciesDetails`?
5. **Official Links**: Are the URLs strictly official `.gov.in`, `.nic.in`, `.ac.in`, `.edu.in`, or official board links?

#### Step 6: Insert Complete Job Entry
Execute the automated insertion script:
```bash
python scripts/add_job_entry.py scratch/temp_job.json
```
Verify entry is added to `src/data/jobDetails.json` and `src/data/jobsData.ts`, and updated in `src/data/jobUploadDates.json`.

#### Step 7: Add Visual Cards & Lightweight UI Elements for Unique Data
In `JobDetailPage.tsx` or job details structure:
- **Hero & Mission Banners**: For flagship recruitment drives (e.g. AIIMS NORCET, SSC CGL, UPSC, Defence drives).
- **Post Code / Discipline / Branch Breakdown Grid**: Multi-card responsive grids for category/discipline-wise post distribution.
- **Physical Standards & Endurance (PET/PST) Metric Cards**: Clean 2-3 column metric cards with measurement badges (Height, Chest, Running time, Long Jump).
- **Typing & Skill Test Specification Badges**: Badges showing WPM speeds, keystrokes, allowed error percentages, and font details.
- **Service Bond & Stipend Callouts**: Highlight boxes for bond duration, amount, and training stipend details.
- **Right Sidebar Widgets & Related Vacancies**: Ensure right sidebar components (including **Related & Trending Government Vacancies 2026**) are strictly single-column vertical stacks (`flex flex-col space-y-2.5`) for optimal readability.
- **Strict Lightweight Principle**: Keep all custom elements pure Tailwind CSS without adding external packages or heavy DOM nodes.
- Increment counter: `added_jobs_count += 1`.

#### Step 8: Check 10-Job Milestone for Commit & Push
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

### Step 9: Sitemap Update, Final Production SSG Build & Git Push (After All URLs Are Done)

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
