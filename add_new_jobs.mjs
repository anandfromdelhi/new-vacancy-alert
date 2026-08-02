import fs from 'fs';

const homePath = 'src/pages/HomePage.tsx';
let homeContent = fs.readFileSync(homePath, 'utf8');

const newHomeJobs = `  {
    id: 'dudc-bidar-pourakarmika-recruitment-2026',
    b: 'District Urban Development Cell (DUDC), Bidar',
    t: 'Pourakarmika (Bidar Mahanagara Palike & Basavakalyana) – 264 Posts',
    d: '29-07-2026',
    l: '19-08-2026',
    a: 'CR-20/2026-27/665',
    q: 'Literate / Kannada Speaking',
    desc: 'Direct recruitment of Pourakarmikas in Bidar Mahanagara Palike and Nagarasabe Basavakalyana.'
  },
  {
    id: 'tnsrlm-kanchipuram-block-coordinator-2026',
    b: 'Tamil Nadu State Rural Livelihood Mission (TNSRLM), Kanchipuram',
    t: 'Block Coordinator (Women) – 14 Posts',
    d: '29-07-2026',
    l: '07-08-2026',
    a: 'Dated 24/07/2026',
    q: 'Any Degree / B.Sc CS / BCA',
    desc: 'Recruitment of Block Coordinators for various Block Mission Management Units in Kanchipuram.'
  },
  {
    id: 'msrlm-solapur-ifc-anchor-crp-2026',
    b: 'UMED - Maharashtra State Rural Livelihoods Mission (MSRLM), Solapur',
    t: 'IFC Block Anchor & Senior CRP – 17 Posts',
    d: '29-07-2026',
    l: '07-08-2026',
    a: '–',
    q: '12th Pass / Agri Degree',
    desc: 'Contractual recruitment for IFC Block Anchor and Senior CRP positions under UMED MSRLM.'
  },
`;

homeContent = homeContent.replace('const JOBS_DATA: JobEntry[] = [', 'const JOBS_DATA: JobEntry[] = [\n' + newHomeJobs);
fs.writeFileSync(homePath, homeContent, 'utf8');


const detailsPath = 'src/data/jobDetails.ts';
let detailsContent = fs.readFileSync(detailsPath, 'utf8');

const newDetails = `  'dudc-bidar-pourakarmika-recruitment-2026': {
    id: 'dudc-bidar-pourakarmika-recruitment-2026',
    publishedDate: '29-07-2026',
    metaDescription: 'District Urban Development Cell (DUDC), Bidar invites applications for the recruitment of 264 Pourakarmikas in Bidar Mahanagara Palike and Basavakalyana Nagarasabe.',
    focusKeywords: 'DUDC Bidar Pourakarmika Recruitment 2026, Bidar Mahanagara Palike Jobs, Basavakalyana Nagarasabe Recruitment, Pourakarmika Vacancy Karnataka',
    lsiKeywords: 'Bidar local body jobs, sweeper jobs Karnataka, district urban development cell bidar, pourakarmika direct payment jobs',
    title: 'DUDC Bidar Pourakarmika Recruitment 2026 – 264 Posts',
    board: 'District Urban Development Cell (DUDC), Bidar',
    advtNo: 'CR-20/2026-27/665',
    vacancies: 264,
    jobLocation: 'Bidar & Basavakalyana (Karnataka)',
    applicationMode: 'Offline',
    applicationStatus: 'Active - Apply Offline before 19.08.2026',
    importantDates: [
      { event: 'Notification Date', date: '17-07-2026' },
      { event: 'Starting Date for Receipt of Application', date: '18-07-2026' },
      { event: 'Last Date for Receipt of Application', date: '19-08-2026 (05:30 PM)' }
    ],
    applicationFee: [
      { category: 'All Candidates', fee: 'No Fee mentioned' }
    ],
    eligibility: {
      education: [
        'No formal education required. Candidates must be able to speak Kannada.',
        'Experience: Must have a minimum of 1 year of experience working as a Pourakarmika (Sweeper/Cleaner) on contract/daily wage basis under the local bodies of Bidar District.',
        'Candidates must possess ESI/PF/bank passbook or attendance records to prove their prior service.'
      ],
      ageLimit: 'Minimum: 18 Years, Maximum: 50 Years',
      ageRelaxation: []
    },
    vacancyDetails: [
      {
        postName: 'Pourakarmika (Bidar Mahanagara Palike)',
        vacancies: 205
      },
      {
        postName: 'Pourakarmika (Nagarasabe Basavakalyana)',
        vacancies: 59
      }
    ],
    salary: {
      payLevel: 'Direct Payment System',
      initialPay: 'As per minimum wages and government rules.'
    },
    selectionProcess: [
      { stage: 'Stage 1', description: 'Screening of applications and verification of prior service documents (ESI/PF/Bank Passbook/Attendance).' },
      { stage: 'Stage 2', description: 'Preparation of merit/seniority list based on experience and roster system.' }
    ],
    howToApply: [
      'Step 1: Obtain the prescribed application form from the office of the Commissioner, Bidar Mahanagara Palike or Chief Officer, Nagarasabe Basavakalyana.',
      'Step 2: Fill in the application form completely and affix a recent passport-size photograph.',
      'Step 3: Attach self-attested copies of age proof (Aadhaar/EPIC/Birth Certificate), prior experience proof (ESI/PF statements, bank passbook, attendance records).',
      'Step 4: Submit the application in person to the respective office during working hours (10:30 AM to 05:30 PM) on or before 19.08.2026.'
    ],
    documentsRequired: [
      'Age Proof (Aadhaar Card, Voter ID, Ration Card, Birth Certificate).',
      'Proof of prior service (ESI/EPF statements, bank passbook, attendance records).',
      'Death certificate of family member (if claiming appointment under compassionate grounds due to death of Pourakarmika by Covid-19 or other reasons).',
      'Caste Certificate (if claiming reservation).'
    ],
    importantInstructions: [
      '10% of the posts are reserved for manual scavengers.',
      'Candidates selected will undergo medical examination.',
      'Incomplete applications or applications received after the due date will be rejected.'
    ],
    urls: [
      { label: 'Official Website', url: 'https://bidar.nic.in' }
    ]
  },
  'tnsrlm-kanchipuram-block-coordinator-2026': {
    id: 'tnsrlm-kanchipuram-block-coordinator-2026',
    publishedDate: '29-07-2026',
    metaDescription: 'TNSRLM Kanchipuram invites applications from eligible female candidates for 14 Block Coordinator posts across various Block Mission Management Units.',
    focusKeywords: 'TNSRLM Kanchipuram Block Coordinator Recruitment 2026, Tamil Nadu State Rural Livelihood Mission Jobs, Kanchipuram Block Coordinator Vacancy, TNSRLM Recruitment',
    lsiKeywords: 'Kanchipuram District Women Project Office jobs, SHG PLF jobs Kanchipuram, Block Coordinator female jobs Tamil Nadu',
    title: 'TNSRLM Kanchipuram Block Coordinator Recruitment 2026 – 14 Posts',
    board: 'Tamil Nadu State Rural Livelihood Mission (TNSRLM), Kanchipuram',
    advtNo: 'Dated 24/07/2026',
    vacancies: 14,
    jobLocation: 'Kanchipuram, Kundrathur, Uthiramerur, Walajabad, Sriperumbudur (Tamil Nadu)',
    applicationMode: 'Offline',
    applicationStatus: 'Active - Apply Offline before 07.08.2026',
    importantDates: [
      { event: 'Notification Date', date: '24-07-2026' },
      { event: 'Last Date for Receipt of Application', date: '07-08-2026' }
    ],
    applicationFee: [
      { category: 'All Candidates', fee: 'No Fee' }
    ],
    eligibility: {
      education: [
        'Any Degree with a minimum of 3 months MS Office computer training certificate OR Degree in Computer Science / Computer Applications.',
        'Experience: Minimum 5 years of prior experience in SHG / PLF (Self Help Group / Panchayat Level Federation).',
        'Gender: Only female candidates are eligible.',
        'Residence: Must be a resident of the respective block.'
      ],
      ageLimit: 'Must be under 35 Years.',
      ageRelaxation: []
    },
    vacancyDetails: [
      { postName: 'Block Coordinator (Kanchipuram-2, Kundrathur-3, Uthiramerur-2, Walajabad-4, Sriperumbudur-3)', vacancies: 14 }
    ],
    salary: { payLevel: 'Consolidated Pay', initialPay: 'As per TNSRLM norms.' },
    selectionProcess: [
      { stage: 'Stage 1', description: 'Screening of applications and verification of documents.' },
      { stage: 'Stage 2', description: 'Personal Interview.' }
    ],
    howToApply: [
      'Step 1: Write an application or prepare a resume with complete details.',
      'Step 2: Attach copies of educational certificates, computer certificates, experience certificates, address proof, and driving license.',
      'Step 3: Send the application by post or deliver in person to the District Mission Management Unit on or before 07.08.2026.',
      'Step 4: Alternatively, applications may also be emailed to dpiu_kpm@yahoo.com (please verify with the office).'
    ],
    documentsRequired: [
      'Educational Certificates and MS Office Certificate.',
      'Experience Certificate (SHG/PLF).',
      'Address Proof.',
      'Valid Two-Wheeler Driving License.',
      'Good Conduct Certificate.'
    ],
    importantInstructions: [
      'Candidates must possess a valid two-wheeler driving license.',
      'Must produce a good conduct certificate.',
      'Candidates previously terminated or removed from TNSRLM, Pudhu Vaazhvu, IFAD, or other govt projects due to administrative or financial irregularities are NOT eligible.'
    ],
    urls: [
      { label: 'Official Email', url: 'mailto:dpiu_kpm@yahoo.com' }
    ]
  },
  'msrlm-solapur-ifc-anchor-crp-2026': {
    id: 'msrlm-solapur-ifc-anchor-crp-2026',
    publishedDate: '29-07-2026',
    metaDescription: 'UMED MSRLM Solapur invites applications for IFC Block Anchor and Senior CRP posts on a contract basis. Last date to apply is 07.08.2026.',
    focusKeywords: 'MSRLM Solapur Recruitment 2026, UMED Solapur IFC Block Anchor Jobs, Senior CRP Vacancy Solapur, Maharashtra State Rural Livelihoods Mission',
    lsiKeywords: 'Solapur UMED block anchor recruitment, MSRLM contractual jobs Maharashtra, Senior CRP agriculture jobs Solapur',
    title: 'MSRLM Solapur IFC Block Anchor & Senior CRP Recruitment 2026 – 17 Posts',
    board: 'UMED - Maharashtra State Rural Livelihoods Mission (MSRLM), Solapur',
    advtNo: 'Contractual Recruitment 2026',
    vacancies: 17,
    jobLocation: 'Akkalkot, Malshiras, Pandharpur, South Solapur, North Solapur (Maharashtra)',
    applicationMode: 'Offline (In-person)',
    applicationStatus: 'Active - Apply In-person by 07.08.2026',
    importantDates: [
      { event: 'Last Date for Receipt of Application (In-person)', date: '07-08-2026' }
    ],
    applicationFee: [
      { category: 'All Candidates', fee: 'No Fee' }
    ],
    eligibility: {
      education: [
        'IFC Block Anchor: Degree in Agriculture or allied subjects (B.Sc Agriculture, B.Sc Horticulture, B.Tech Agriculture, B.Sc Fishery, B.Sc Forestry, B.Sc Veterinary, B.Sc Animal Husbandry, BBA). Minimum 1 year experience and computer knowledge required.',
        'Senior CRP: 12th Pass. Must be currently working or have worked as Krushi Sakhi, Pashu Sakhi, M-CRP (Krushi), Udyog Sakhi, Van Sakhi, etc., under MSRLM. Minimum 3 years of experience required.'
      ],
      ageLimit: 'Maximum 43 Years',
      ageRelaxation: []
    },
    vacancyDetails: [
      { postName: 'IFC Block Anchor', vacancies: 5 },
      { postName: 'Senior CRP', vacancies: 12 }
    ],
    salary: {
      payLevel: 'Consolidated Honorarium',
      initialPay: 'IFC Block Anchor: ₹ 20,000/- per month | Senior CRP: ₹ 7,500/- per month'
    },
    selectionProcess: [
      { stage: 'Stage 1', description: 'Scrutiny of Applications.' },
      { stage: 'Stage 2', description: 'Interview / Document Verification.' }
    ],
    howToApply: [
      'Step 1: Applications will NOT be accepted via email.',
      'Step 2: Candidates must submit their applications in the prescribed format in person.',
      'Step 3: Submit the application at the respective Taluka Campaign Management Unit (Panchayat Samiti / DRDA office) on or before 07.08.2026.',
      'Step 4: An applicant can apply for only one post at a time.'
    ],
    documentsRequired: [
      'Educational Certificates (12th / Graduation).',
      'Experience Certificates (from MSRLM for CRPs).',
      'Age Proof.',
      'ID Proof.'
    ],
    importantInstructions: [
      'The recruitment is strictly on a contractual basis for a project duration of 03 years, with an initial contract of 11 months.',
      'Applications sent via email will be rejected.',
      'Candidates must apply in person at the respective taluka offices: Akkalkot (Panchayat Samiti), Malshiras (Panchayat Samiti), Pandharpur (Panchayat Samiti), South Solapur (DRDA Building, Treasury Office Opposite), North Solapur (DRDA Building, Treasury Office Opposite).'
    ],
    urls: []
  },
`;

detailsContent = detailsContent.replace('export const jobDetailsData: Record<string, JobDetail> = {', 'export const jobDetailsData: Record<string, JobDetail> = {\n' + newDetails);
fs.writeFileSync(detailsPath, detailsContent, 'utf8');

console.log('Successfully added the three new recruitments.');
