/**
 * 1. Add matching JOBS_DATA list-cards for 6 orphan jobDetails entries
 * 2. Merge HPPSC Male (491) + Female (243) constable entries into one combined entry
 *    - Keep key: hppsc-hp-police-constable-recruitment-2026
 *    - Delete:   hppsc-hp-police-female-constable-recruitment-2026
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 1. JOBS_DATA cards ──────────────────────────────────────────────────────

const jobsDataPath = path.join(__dirname, '../src/data/jobsData.ts');
let src = fs.readFileSync(jobsDataPath, 'utf8');

// Find the insertion point — just before the closing `];`
const INSERT_BEFORE = '  // ===== END OF JOBS DATA =====';
const FALLBACK_INSERT = '\n];';  // last resort

const newCards = `
  // ─── IBPS CRP CSA-XVI Clerk ──────────────────────────────────────────────
  {
    id: 'ibps-crp-csa-xvi-customer-service-associate-clerk-recruitment-2026',
    b: 'Institute of Banking Personnel Selection (IBPS)',
    t: 'IBPS Clerk Recruitment 2026 (CRP CSA-XVI) – Apply Online for 11,102 Customer Service Associate Vacancies in 11 Public Sector Banks | Prelims October 2026 | Last Date 21 August 2026',
    d: '01-08-2026',
    l: '21-08-2026',
    a: 'CRP CSA-XVI (Vacancies of 2027-28) Dated 01.08.2026',
    q: 'Graduation in Any Discipline from a Recognised University',
    desc: 'IBPS has released CRP CSA-XVI notification for 11,102 Customer Service Associate (Clerk) vacancies across 11 public sector banks. Graduates aged 20–28 years can apply online at ibps.in by 21 August 2026. Prelims in October, Mains in December 2026. Basic pay Rs. 24,050/- per month.',
    u: 'https://www.ibps.in',
  },
  // ─── ICMR NITHR Jabalpur Walk-in ─────────────────────────────────────────
  {
    id: 'icmr-nithr-jabalpur-scientist-technician-2026',
    b: 'ICMR – National Institute for Tribal Health Research (NITHR), Jabalpur',
    t: 'ICMR NITHR Jabalpur Walk-in Interview 2026 – Project Research Scientist I/II/III, Lab Technician, DEO & Technical Support – 16 Posts | Advt. No. 04/2026-27 | Walk-in 29 July 2026',
    d: '27-07-2026',
    l: '29-07-2026',
    a: 'Advt. No. 04/2026-27 dated 29-07-2026',
    q: 'MBBS/PhD/MSc/BSc as per post; relevant research experience',
    desc: 'ICMR-NITHR Jabalpur invites walk-in applications for 16 project posts including Research Scientist (I/II/III), Lab Technician, DEO, and Technical Support. Emoluments: Scientist-III ₹78,000+HRA, Scientist-II ₹67,000+HRA, Lab Tech ₹20,000+HRA. Walk-in Interview on 29 July 2026.',
    u: 'https://www.nirth.res.in',
  },
  // ─── ESIC Teaching Faculty (PGIMSRs / Medical Colleges) ──────────────────
  {
    id: 'esic-recruitment-2026',
    b: "Employees' State Insurance Corporation (ESIC)",
    t: 'ESIC Teaching Faculty Recruitment 2026 – 118 Professor / Associate Professor Vacancies in ESIC PGIMSRs & Medical Colleges | Apply Offline by 27 July 2026',
    d: '19-05-2026',
    l: '27-07-2026',
    a: 'Not Mentioned in Official Notification',
    q: 'MBBS + PG Degree (MD/MS/DNB); relevant teaching/clinical experience as per MCI/NMC norms',
    desc: 'ESIC invites applications for 118 Teaching Faculty posts (Professor / Associate Professor) in ESIC PGIMSRs and Medical Colleges across India. Pay Level-13 (Rs. 1,23,100–2,15,900). Last date for offline application: 27 July 2026 (General); 03 August 2026 (Remote/NE).',
    u: 'https://www.esic.gov.in',
  },
  // ─── RRB Technician CEN 02/2026 ──────────────────────────────────────────
  {
    id: 'rrb-technician-2026',
    b: 'Railway Recruitment Boards (RRBs)',
    t: 'RRB Technician Recruitment 2026 (CEN 02/2026) – Apply Online for 6,557 Technician Grade I Signal & Grade III Posts | Last Date 31 July 2026',
    d: '30-06-2026',
    l: '31-07-2026',
    a: 'CEN No. 02/2026',
    q: '10+2 / ITI / B.Sc (Physics / Electronics / CS) as per post; Age 18–36 years',
    desc: 'Railway Recruitment Boards (RRBs) invite online applications for 6,557 Technician posts under CEN 02/2026 — Technician Gr-I Signal (Pay Level 5: ₹29,200/-) and Technician Gr-III (Pay Level 2: ₹19,900/-). Eligible candidates must apply at rrbapply.gov.in by 31 July 2026.',
    u: 'https://rrbapply.gov.in',
  },
  // ─── PDIL Contract Engineers ──────────────────────────────────────────────
  {
    id: 'pdil-engineers-2026',
    b: 'Projects & Development India Limited (PDIL)',
    t: 'PDIL Engineer Recruitment 2026 – Apply Online for 153 Contract Engineer (Civil, Electrical, Mechanical, CS, HR, Safety) Posts | Advt HR/71/26/01 | Last Date 27 July 2026',
    d: '07-07-2026',
    l: '27-07-2026',
    a: 'HR/71/26/01(Contract)',
    q: 'B.E. / B.Tech or Diploma in relevant engineering discipline; experience as applicable',
    desc: 'PDIL (Mini Ratna Category-I PSU) invites online applications for 153 contract Engineer posts across Civil, Electrical, Mechanical, Computer, Fire/Safety, HR, Instrumentation streams. Consolidated pay: Graduate Sc-4 ₹71,000/–; Diploma Sc-3 ₹40,000/–. Apply by 27 July 2026.',
    u: 'https://www.pdilin.com',
  },
  // ─── Indian Navy SSC Officer AT-27 Course ────────────────────────────────
  {
    id: 'indian-navy-ssc-officer-2026',
    b: 'The Indian Navy',
    t: 'Indian Navy SSC Officer Recruitment 2026 (Jun 2027 AT-27 Course) – Apply Online for 275 Short Service Commission Officer Posts (Executive / Technical / Education) | Last Date 27 July 2026',
    d: '25-06-2026',
    l: '27-07-2026',
    a: 'Jun 2027 (AT 27) Course',
    q: 'B.E./B.Tech (60% marks) for Technical; Graduation (60%) for Executive/Education branches',
    desc: 'Indian Navy invites online applications for 275 Short Service Commission (SSC) Officer posts for the Jun 2027 (AT-27) Course across Executive (GS/Hydro/Pilot/NAOO), Technical (Engineering/Electrical), and Education branches. Gross starting salary ~₹1,20,000/month. Apply online by 27 July 2026.',
    u: 'https://www.joinindiannavy.gov.in',
  },
`;

// Check if these IDs already exist in the file
const alreadyHasIbps = src.includes("'ibps-crp-csa-xvi-customer-service-associate-clerk-recruitment-2026'");
const alreadyHasRrb  = src.includes("'rrb-technician-2026'");

if (alreadyHasIbps || alreadyHasRrb) {
  console.log('⚠️  Some cards already present in JOBS_DATA — skipping insertion.');
} else {
  // Insert just before the closing `];` of the JOBS_DATA array
  const closingBracket = src.lastIndexOf('\n];');
  if (closingBracket === -1) {
    throw new Error('Could not find closing ]; in jobsData.ts');
  }
  src = src.slice(0, closingBracket) + '\n' + newCards + src.slice(closingBracket);
  console.log('✅ 6 orphan list-cards inserted into JOBS_DATA');
}

// ─── 2. HPPSC merge: combine Male (491) + Female (243) into one entry ───────
// Keep `hppsc-hp-police-constable-recruitment-2026` as the merged key
// Update its JOBS_DATA card to reflect combined 734 posts

src = src.replace(
  /\{[\s\S]*?id:\s*'hppsc-hp-police-constable-recruitment-2026'[\s\S]*?\},/,
  `  {
    id: 'hppsc-hp-police-constable-recruitment-2026',
    b: 'Himachal Pradesh Public Service Commission (HPPSC) & HP Police Department',
    t: 'HPPSC HP Police Constable Recruitment 2026 – Apply Online for 734 Posts (491 Male + 243 Female Constable) | Advt No. 57 & 58/7-2026 | Last Date 31 August 2026',
    d: '10-07-2026',
    l: '31-08-2026',
    a: 'Advt No. 57/7-2026 (Male) & 58/7-2026 (Female) Dated 10.07.2026',
    q: 'Matriculation (10th) & +2 (12th) from a recognised HP school; Age 18–25 years',
    desc: 'HPPSC invites online applications for 734 HP Police Constable posts — 491 Male (Advt 57/7-2026) and 243 Female (Advt 58/7-2026). Selection via PST, PET, Written Exam (90 marks) + NCC marks (4 marks) + Height marks (6 marks) = 100 marks total. Fee ₹600 for all categories. Apply via ORA portal by 31 August 2026.',
    u: 'https://www.hpora.hp.gov.in',
  },`,
);

// Remove the female-only card from JOBS_DATA (separate entry)
src = src.replace(
  /\{[\s\S]*?id:\s*'hppsc-hp-police-female-constable-recruitment-2026'[\s\S]*?\},\s*/,
  '',
);

fs.writeFileSync(jobsDataPath, src, 'utf8');
console.log('✅ JOBS_DATA updated: HPPSC Male+Female merged, female-only card removed');

// ─── 3. jobDetails.json: merge HPPSC female into male, delete female key ─────

const jobDetailsPath = path.join(__dirname, '../src/data/jobDetails.json');
const details = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

const male   = details['hppsc-hp-police-constable-recruitment-2026'];
const female = details['hppsc-hp-police-female-constable-recruitment-2026'];

if (!male || !female) {
  console.error('❌ Cannot find one or both HPPSC entries in jobDetails.json');
  process.exit(1);
}

// Build the merged entry
const merged = {
  ...male,
  id: 'hppsc-hp-police-constable-recruitment-2026',
  seoTitle: 'HPPSC HP Police Constable Recruitment 2026 – 734 Posts (491 Male + 243 Female) | Advt 57 & 58/7-2026 | Apply by 31 Aug 2026 | NewVacancyAlert',
  seoDescription: 'HPPSC HP Police Constable Recruitment 2026: 491 Male (Advt 57/7-2026) + 243 Female (Advt 58/7-2026) = 734 total posts. Selection via PST, PET, Written Exam 90 Marks + NCC 4 Marks + Height 6 Marks. Fee ₹600. Apply online via ORA portal by 31 August 2026.',
  title: 'HPPSC HP Police Constable Recruitment 2026 Notification Out for 734 Posts (491 Male + 243 Female Constable)',
  advtNo: 'Advt No. 57/7-2026 (Male Constable) & Advt No. 58/7-2026 (Female Constable) — Both Dated 10-07-2026',
  vacancies: 734,
  overview: [
    'Himachal Pradesh Public Service Commission (HPPSC) and HP Police Department have jointly released two concurrent recruitment notifications on 10 July 2026 for the post of Constable (IRB/District Police). Advertisement No. 57/7-2026 covers 491 Male Constable posts and Advertisement No. 58/7-2026 covers 243 Female Constable posts — a combined total of 734 constable vacancies across Himachal Pradesh.',
    'Candidates must apply separately under the respective advertisement number via the Himachal Pradesh Online Recruitment Application (HP ORA) portal. A single application fee of ₹600/- applies for all candidates irrespective of category. Last date for online application for both advertisements is 31 August 2026 (11:59 PM).',
    'Selection is conducted in four stages: Physical Standard Test (PST), Physical Efficiency Test (PET), Written Examination (90 MCQs), and NCC Certificate Evaluation. Final merit list is out of 100 marks: Written Exam (90 Marks) + Height marks (6 Marks) + NCC marks (4 Marks).',
  ],
  highlights: [
    { label: 'Recruiting Organization', value: 'Himachal Pradesh Public Service Commission (HPPSC) & HP Police Department' },
    { label: 'Post Name', value: 'Constable (IRB / District Police)' },
    { label: 'Advt No. (Male)', value: '57/7-2026 Dated 10-07-2026 — 491 Male Posts' },
    { label: 'Advt No. (Female)', value: '58/7-2026 Dated 10-07-2026 — 243 Female Posts' },
    { label: 'Total Vacancies', value: '734 Posts (491 Male + 243 Female)' },
    { label: 'Job Location', value: 'Himachal Pradesh' },
    { label: 'Application Mode', value: 'Online via HP ORA Portal (hpora.hp.gov.in)' },
    { label: 'Educational Qualification', value: 'Matriculation (10th) & +2 (12th) from HP recognised institution' },
    { label: 'Age Limit (General)', value: '18 to 25 years as on 01.01.2026' },
    { label: 'Application Fee', value: '₹600/- for all categories' },
    { label: 'Application Start Date', value: '10 July 2026' },
    { label: 'Application Last Date', value: '31 August 2026 (11:59 PM)' },
    { label: 'Official Website', value: 'hppsc.hp.gov.in / hppolice.gov.in' },
  ],
  eligibility: {
    education: [
      'All candidates (Male & Female) must have passed Matriculation (10th Standard) and +2 (Class 12th) from any recognised School / Board / Institution situated within Himachal Pradesh.',
      'This condition of studying in HP schools shall NOT apply to Bonafide Himachalis who have studied outside HP.',
    ],
    ageLimit: 'Minimum 18 years and Maximum 25 years as on 01.01.2026 for General / EWS candidates. Maximum 27 years for SC/ST/OBC/Gorkhas. Home Guards: 20 to 28 years.',
    ageRelaxation: male.eligibility.ageRelaxation,
    medicalStandards: [
      '--- MALE CONSTABLE STANDARDS ---',
      'Height (General/EWS/OBC/HG): Min 5 Feet 6 Inches (5\'-6"); Chest (unexpanded/expanded): 31" × 32".',
      'Height (SC/ST/Gorkhas/HG SC-ST): Min 5 Feet 4 Inches (5\'-4"); Chest: 29" × 30".',
      'Male Height Marks (PST): 6\'-0" and above = 6 Marks; 5\'-11" to 5\'-12" = 5 Marks; 5\'-10" to 5\'-11" = 4 Marks; 5\'-9" to 5\'-10" = 3 Marks; 5\'-8" to 5\'-9" = 2 Marks; 5\'-7" to 5\'-8" = 1 Mark; Below 5\'-7" = 0 Marks.',
      '--- FEMALE CONSTABLE STANDARDS ---',
      'Height (General/EWS/OBC/HG Female): Min 5 Feet 2 Inches (5\'-2"). No chest requirement.',
      'Height (SC/ST/Gorkhas/HG SC-ST Female): Min 5 Feet 0 Inches (5\'-0").',
      'Female Height Marks (PST): 5\'-8" and above = 6 Marks; 5\'-7" to 5\'-8" = 5 Marks; 5\'-6" to 5\'-7" = 4 Marks; 5\'-5" to 5\'-6" = 3 Marks; 5\'-4" to 5\'-5" = 2 Marks; 5\'-3" to 5\'-4" = 1 Mark; Below 5\'-3" = 0 Marks.',
    ],
  },
  applicationFee: [
    { category: 'All Candidates — Male Constable (Advt 57/7-2026)', fee: '₹600.00', refund: 'Non-refundable' },
    { category: 'All Candidates — Female Constable (Advt 58/7-2026)', fee: '₹600.00', refund: 'Non-refundable' },
  ],
  selectionProcess: [
    {
      stage: 'Stage 1: Physical Standard Test (PST)',
      description: 'Measurement of Height (and Chest for Male candidates). Height marks awarded on scale of 0–6. Male: Min 5\'6" (Gen/OBC/EWS/HG), 5\'4" (SC/ST/Gorkhas). Female: Min 5\'2" (Gen/OBC/EWS/HG), 5\'0" (SC/ST/Gorkhas). Candidates failing PST are eliminated.',
    },
    {
      stage: 'Stage 2: Physical Efficiency Test (PET)',
      description: 'Male PET: 1500m Race (5 min 30 sec), High Jump (1.35m in 3 attempts), 100m Race (14 sec), Broad Jump (4m in 3 attempts). Female PET: 800m Race (3 min 45 sec), High Jump (1.10m in 3 attempts), 100m Race (17 sec), Broad Jump (3m in 3 attempts). PET is qualifying in nature — no marks added to merit.',
    },
    {
      stage: 'Stage 3: Written Examination',
      description: '90 Objective MCQ Questions of 2 Hours duration carrying 90 Marks. Subjects cover General Knowledge, Current Affairs, Reasoning, and HP-specific topics. Negative marking of 0.25 marks per wrong answer. Option E available to attempt 0 marks without negative marking.',
    },
    {
      stage: 'Stage 4: NCC Certificate Evaluation & Document Verification',
      description: 'NCC C Certificate holders = 4 Marks; NCC B Certificate = 2 Marks; NCC A Certificate = 1 Mark. Original certificates and all educational/category documents verified at this stage.',
    },
    {
      stage: 'Stage 5: Final Merit List (100 Marks Total)',
      description: 'Written Exam (90 Marks) + Height PST Marks (06 Marks) + NCC Marks (max 04 Marks) = 100 Marks Total. Separate merit lists prepared for Male (491 posts) and Female (243 posts) candidates.',
    },
  ],
  urls: [
    { label: 'Official HPPSC Recruitment Portal', url: 'http://www.hppsc.hp.gov.in/hppsc' },
    { label: 'HP ORA Online Application Portal', url: 'https://www.hpora.hp.gov.in' },
    { label: 'HPPSC Advt 57/7-2026 – Male Constable Advertisement PDF', url: 'http://www.hppsc.hp.gov.in/hppsc' },
    { label: 'HPPSC Advt 58/7-2026 – Female Constable Advertisement PDF', url: 'http://www.hppsc.hp.gov.in/hppsc' },
    { label: 'Himachal Pradesh Police Department Official Website', url: 'https://hppolice.gov.in' },
  ],
};

// Write merged entry, delete female key
details['hppsc-hp-police-constable-recruitment-2026'] = merged;
delete details['hppsc-hp-police-female-constable-recruitment-2026'];

fs.writeFileSync(jobDetailsPath, JSON.stringify(details, null, 2), 'utf8');
console.log('✅ jobDetails.json: HPPSC entries merged (734 posts), female-only key deleted');

// ─── 4. Verify ───────────────────────────────────────────────────────────────
console.log('\n=== Verification ===');
const verifyDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));
const verifySrc = fs.readFileSync(jobsDataPath, 'utf8');

const orphanIds = [
  'ibps-crp-csa-xvi-customer-service-associate-clerk-recruitment-2026',
  'icmr-nithr-jabalpur-scientist-technician-2026',
  'esic-recruitment-2026',
  'rrb-technician-2026',
  'pdil-engineers-2026',
  'indian-navy-ssc-officer-2026',
];

for (const id of orphanIds) {
  const inDetails = id in verifyDetails;
  const inJobsData = verifySrc.includes(`'${id}'`);
  const status = inDetails && inJobsData ? '✅' : '❌';
  console.log(`${status} ${id} | details:${inDetails} jobsData:${inJobsData}`);
}

const mergedOk = 'hppsc-hp-police-constable-recruitment-2026' in verifyDetails &&
  verifyDetails['hppsc-hp-police-constable-recruitment-2026'].vacancies === 734 &&
  !('hppsc-hp-police-female-constable-recruitment-2026' in verifyDetails);
const mergedInJs = verifySrc.includes("'hppsc-hp-police-constable-recruitment-2026'") &&
  !verifySrc.includes("'hppsc-hp-police-female-constable-recruitment-2026'");
console.log(`${mergedOk && mergedInJs ? '✅' : '❌'} HPPSC merged (734 posts): details:${mergedOk} jobsData:${mergedInJs}`);
