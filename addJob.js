const fs = require('fs');
const path = './src/data/jobDetails.ts';
let content = fs.readFileSync(path, 'utf8');

const newJob = `  'cwc-young-professional-2026': {
    id: 'cwc-young-professional-2026',
    seoTitle: 'CWC Young Professional Recruitment 2026 - Apply Online for 06 Posts',
    seoDescription: 'Central Warehousing Corporation (CWC) is recruiting 06 Young Professionals. Check eligibility, salary, dates, and apply online at cewacor.nic.in.',
    focusKeywords: 'CWC Young Professional Recruitment 2026, CWC Recruitment, CWC Vacancy 2026',
    lsiKeywords: 'Central Warehousing Corporation Jobs, Young Professional Jobs, cewacor.nic.in, CWC Notification 2026',
    title: 'Young Professional Recruitment 2026',
    board: 'Central Warehousing Corporation (CWC)',
    advtNo: 'CWC/I-Engagement/Young Professional/2026/01',
    vacancies: 6,
    jobLocation: 'PAN India (New Delhi, Hapur, Patna, Hyderabad, Jaipur)',
    applicationMode: 'Online',
    applicationStatus: 'Active',
    lastUpdated: '18 July 2026',
    overview: [
      'Central Warehousing Corporation, a Navratna, Central Public Sector Undertaking under the administrative control of Ministry of Consumer Affairs, Food & Public Distribution, proposes to engage six (06) Young Professionals.',
      'The Corporation provides scientific storage facilities for agricultural inputs, produce and other notified commodities besides providing logistics infrastructure like CFSs/ICDs, Land Custom Stations, Air Cargo Complexes etc. for import-export cargo.',
      'The engagement is initially for a fixed period of two years which may be extended by one year up to a maximum period of three years i.e. 2+1 years.'
    ],
    highlights: [
      { label: 'Organization', value: 'Central Warehousing Corporation (CWC)' },
      { label: 'Post Name', value: 'Young Professional' },
      { label: 'Advt No.', value: 'CWC/I-Engagement/Young Professional/2026/01' },
      { label: 'Vacancies', value: '06 Posts' },
      { label: 'Qualification', value: 'B.Sc / MBA / PGDM' },
      { label: 'Age Limit', value: 'Max 35 Years' },
      { label: 'Selection Process', value: 'Personal Interaction' },
      { label: 'Salary', value: 'Rs. 50,000 to Rs. 60,000' },
      { label: 'Application Mode', value: 'Online' },
      { label: 'Official Website', value: 'www.cewacor.nic.in' }
    ],
    importantDates: [
      { event: 'Notification Released', date: '09.07.2026' },
      { event: 'Starting Date to Apply Online', date: '09.07.2026 (00:00 Hrs)' },
      { event: 'Closing Date to Apply Online', date: '22.07.2026 (23:59 Hrs)' }
    ],
    vacanciesDetails: [
      { category: 'Total Vacancies', count: 6 },
      { category: 'Young Professional (Learning & Development)', count: 1 },
      { category: 'Young Professional (PCS Marketing)', count: 1 },
      { category: 'Young Professional (Marketing & Business Development) - Hyderabad', count: 2 },
      { category: 'Young Professional (Marketing & Business Development) - Jaipur', count: 2 }
    ],
    eligibility: {
      education: [
        'Young Professional (Learning & Development): Full time MBA/PGDM with specialization in Human Resources.',
        'Young Professional (PCS Marketing): Full time B.Sc in Agriculture along with Entomology from a recognised University. Preference will be given to candidates with MBA (Marketing) or relevant experience in pest control/services sector.',
        'Young Professional (Marketing & Business Development): Two years Full-time Regular Post Graduate Diploma/Post Graduate Degree in General Management/Marketing/ Logistics/Supply Chain Management/Sales & Marketing Management from a recognized University or Institution.'
      ],
      ageLimit: '35 Years (as on 22.07.2026)',
      ageRelaxation: [
        { category: 'All Categories', relaxation: 'Not Mentioned in Official Notification' }
      ],
      medicalStandards: [
        'Not Mentioned in Official Notification'
      ]
    },
    salary: {
      payLevel: 'Consolidated Remuneration',
      initialPay: 'Rs. 50,000/- to Rs. 60,000/-'
    },
    applicationFee: [
      { category: 'All Candidates', fee: 'Not Mentioned', refund: 'N/A' }
    ],
    selectionProcess: [
      { stage: 'Application Shortlisting', description: 'The Corporation reserves the right to fix criteria for shortlisting the candidates to commensurate with the number of positions advertised.' },
      { stage: 'Personal Interaction', description: 'Shortlisted candidates will be called for Personal Interaction.' }
    ],
    howToApply: [
      'Step 1: Visit the official CWC website (www.cewacor.nic.in).',
      'Step 2: Find the recruitment notification for Young Professionals 2026.',
      'Step 3: Eligible candidates may apply online between 09.07.2026 and 22.07.2026.',
      'Step 4: Carefully fill all the information in the application form; no information should be left blank.',
      'Step 5: Upload all required documents, including photo, signature, educational certificates, and experience proofs.',
      'Step 6: Submit the online application before 23:59 Hrs on 22.07.2026.'
    ],
    documentsRequired: [
      'Mark sheets/Certificates confirming eligibility as on last day of application.',
      'In cases where Qualifying Degree/Provisional Certificate is not received, all mark sheets up to the final semester exam taken.',
      'Certificate indicating the qualifying degree/diploma is of regular course (if not mentioned in the degree).',
      'Post Qualification Work Experience certificates issued by past/present employers with pay details and duration (Salary/Pay Slip shall NOT be considered as proof).',
      'Recent Passport Size Photo.',
      'Signature.'
    ],
    importantInstructions: [
      'CRITICAL: Incomplete applications (like educational qualifications not filled, experience details not filled, photo/signature not uploaded etc.) will be out rightly rejected.',
      'Experience: Only the post qualification experience will be considered. The experience only in the fields specified for the positions will be counted.',
      'Reckoning Date: The reckoning date for calculation of age and experience will be the last date of application (22.07.2026).',
      'Multiple Posts: Candidate may apply for more than one position as per eligibility.',
      'Intimations: Any intimations will be sent by email only to the email ID registered in the online application form.',
      'Code of Conduct: Young Professionals shall be required to work by maintaining the code of ethics, integrity and in a professional manner.'
    ],
    urls: [
      { label: 'Official Website', url: 'https://cewacor.nic.in' },
      { label: 'Apply Online', url: 'https://cewacor.nic.in' }
    ],
    faqs: [
      { question: 'What is the last date to apply for CWC Young Professional 2026?', answer: 'The last date to apply online is 22.07.2026 till 23:59 Hrs.' },
      { question: 'What is the age limit for the Young Professional posts in CWC?', answer: 'The upper age limit is 35 years as on the last date of application.' },
      { question: 'What is the salary of a Young Professional in CWC?', answer: 'The consolidated monthly remuneration is Rs. 50,000/- for 0 to 3 years of experience, and Rs. 60,000/- for more than 3 years of experience.' },
      { question: 'Can a candidate apply for more than one position?', answer: 'Yes, candidates may apply for more than one position as per their eligibility.' },
      { question: 'What is the selection process for this recruitment?', answer: 'Candidates will be shortlisted based on fixed criteria and called for Personal Interaction.' }
    ]
  },
`;

content = content.replace('};', newJob + '};');
fs.writeFileSync(path, content);
console.log('Done');
