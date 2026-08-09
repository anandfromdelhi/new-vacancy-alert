---
name: vacancy-category-auditor
description: Audits all site job entries to verify that 100% of jobs have corresponding cards on the home page and are correctly displayed under board-wise, qualification-wise, and state-wise categories.
---

# Vacancy Category & Home Page Card Auditor Skill

Use this skill whenever the user asks to:
- "Check if all job entries have corresponding cards on home page"
- "Are jobs displayed under board wise, qualification wise, state wise?"
- "Audit job categories"
- "Verify home page cards and category mappings"

## Key Verification Checks
1. **Home Page Card Integrity & Orphan Check**:
   - Verifies 100% of entries in `jobsData.ts` have a corresponding detailed entry in `jobDetails.json`.
   - Verifies all required card fields (`id`, `b`, `t`, `d`, `l`, `q`, `a`, `desc`, `u`) are populated for home page rendering.
2. **State-Wise Categorization Coverage**:
   - Verifies every job maps to a valid Indian State/UT or `All India` via `getStateFromJob()`.
3. **Board-Wise Categorization Coverage**:
   - Verifies every job extracts a valid Board/Organization name via `getBoardNameFromJob()`.
4. **Qualification-Wise Categorization Coverage**:
   - Verifies every job matches at least 1 of the 15 qualification categories (10th, 12th, Graduate, B.Tech, B.Sc, B.Com, Diploma, ITI, Post Graduate, MBBS, Nursing, Pharmacist, Dental, CA, Ph.D).

## Fast Workflow

### Step 1: Run Category Audit Command
Execute the automated auditor script in terminal:
```bash
npx tsx scripts/verify_site_categories.ts
```

### Step 2: Interpret Audit Results
- **Home Page Match**: Ensures 100% of jobs appear as cards on the homepage.
- **State-Wise Coverage**: Ensures 0 unassigned states.
- **Board-Wise Coverage**: Ensures 0 unassigned boards.
- **Qualification-Wise Coverage**: Ensures 0 unassigned qualifications.

### Step 3: Auto-Fix Any Discrepancies
If any unassigned jobs are detected, update `q` or `b` fields in `src/data/jobsData.ts` and re-run `npx tsx scripts/verify_site_categories.ts` until 100% coverage is achieved across all categories.
