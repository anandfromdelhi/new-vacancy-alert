import sys
import re

updates = {
  'cuh-faculty-recruitment-2026': {
    'howToApply': [
      'Visit the official Central University of Haryana recruitment portal at cuh.ac.in or cuhrec.samarth.edu.in.',
      'Register on the SAMARTH recruitment portal using your email ID and mobile number.',
      'Fill in personal details, educational qualifications, research papers, teaching experience, and API score entries.',
      'Upload scanned copies of 10th marksheet, degree certificates, NET/SET/PhD proof, category certificate, and publication PDFs.',
      'Pay the online application fee (₹1,000 for General/OBC/EWS; Women/SC/ST/PwD are exempt).',
      'Submit the online application form and send a hard copy of the submitted application along with self-attested documents to CUH Mahendergarh before the specified postal deadline.'
    ],
    'documentsRequired': [
      '10th & 12th Standard Marksheets & Certificates for date of birth verification',
      'UG, PG, M.Phil & Ph.D Degree Certificates and Consolidated Marksheets',
      'UGC-NET / CSIR-NET / SLET / SET Qualification Certificate',
      'Caste / Category Certificate (SC / ST / OBC-NCL / EWS) if applicable',
      'Research Publications, Book Chapters, Patent Documents & API Score Proof',
      'No Objection Certificate (NOC) & Experience Certificates from current employer'
    ],
    'importantInstructions': [
      'Candidates must ensure they fulfill minimum eligibility and UGC Regulations 2018 criteria before applying.',
      'API scores will be verified by the Screening Committee based on uploaded documents.',
      'Hard copy of application must reach the Registrar office within the stipulated deadline.'
    ]
  },
  'ada-project-assistant-recruitment-2026': {
    'howToApply': [
      'Visit the official Aeronautical Development Agency (ADA) career page at ada.gov.in.',
      'Navigate to the recruitment section for Project Assistant-I (PA-I) positions.',
      'Complete user registration on the online application portal using valid credentials.',
      'Enter academic marks (B.E / B.Tech / M.E / M.Tech percentage/CGPA) and GATE score details if applicable.',
      'Upload scanned passport photograph, signature, 10th certificate, degree certificates, and GATE scorecard.',
      'Verify filled details and submit the online application form. Download and print the acknowledgment slip.'
    ],
    'documentsRequired': [
      'Class 10th / SSLC Marksheet as proof of Date of Birth',
      'Engineering Degree Certificate (B.E / B.Tech / M.E / M.Tech) and all semester marksheets',
      'Valid GATE Scorecard (if applicable)',
      'Caste / Category Certificate (SC/ST/OBC/EWS) issued by competent authority',
      'Identity Proof (Aadhaar Card / Voter ID / Passport)',
      'Recent passport size color photograph and signature scan'
    ],
    'importantInstructions': [
      'Shortlisting for personal interview will be based on academic performance / GATE score.',
      'Candidates working in Government / PSU / Autonomous bodies must submit No Objection Certificate at interview.',
      'Engagement is purely on temporary project basis for ADA aeronautical programs.'
    ]
  },
  'csir-nal-project-staff-walk-in-recruitment-2026': {
    'howToApply': [
      'Visit the official CSIR-NAL website at nal.res.in and download the prescribed Walk-in Application Form.',
      'Fill out the application form completely with your personal, academic, and research details.',
      'Prepare self-attested photocopies of all educational certificates, marksheets, caste certificate, and experience letters.',
      'Report to CSIR-NAL, Kodihalli, Bengaluru for the Walk-in Interview on the scheduled date between 08:30 AM and 10:00 AM.',
      'Submit the filled application along with original documents for verification at the registration desk before the interview.'
    ],
    'documentsRequired': [
      'Duly filled and signed Walk-in Application Form in prescribed format',
      'Original and self-attested copies of 10th, 12th, Diploma, B.E/B.Tech/M.Sc marksheets and degree certificates',
      'Proof of Date of Birth (SSLC Marksheet / Birth Certificate)',
      'Valid Caste / Category Certificate (SC / ST / OBC-NCL / EWS) if applicable',
      'Original Photo ID Proof (Aadhaar Card / Driving License / Passport)',
      'Two recent passport-size color photographs'
    ],
    'importantInstructions': [
      'Reporting time for registration is strictly 08:30 AM to 10:00 AM; late arrivals will not be entertained.',
      'Candidates must bring all original certificates for verification during registration.',
      'No TA/DA will be paid for attending the Walk-in Interview at CSIR-NAL Bengaluru.'
    ]
  },
  'ntpc-deputy-manager-recruitment-2026': {
    'howToApply': [
      'Visit the official NTPC Careers portal at careers.ntpc.co.in or ntpc.co.in.',
      'Click on the advertisement for recruitment of Deputy Manager (Project Construction / E&M) 2026.',
      'Register on the portal with basic details, mobile number, and email ID.',
      'Fill out the online application form with personal, educational, and post-qualification work experience details.',
      'Upload scanned photograph, signature, degree certificates, experience letters, and pay slip proof.',
      'Pay the non-refundable application fee of ₹300 (SC/ST/PwBD/XSM and Female candidates are exempted).',
      'Submit the online application and take a printout of the generated registration slip for future reference.'
    ],
    'documentsRequired': [
      'Degree Certificate in B.E / B.Tech (Mechanical / Electrical / C&I / Civil)',
      'Post-qualification Executive Work Experience Certificates clearly stating duration and pay scale',
      'Class 10th Certificate for Date of Birth verification',
      'Caste / EWS / PwBD Certificate in prescribed Government of India format',
      'Recent Passport Size Photograph & Signature scan',
      'Current Pay Slip / Form 16 / CTC proof'
    ],
    'importantInstructions': [
      'Post-qualification experience must be in executive cadre in relevant industrial / construction projects.',
      'Fee payment must be made before 11:59 PM on the last date of online application.',
      'Only Indian Nationals are eligible to apply.'
    ]
  },
  'csc-aadhaar-supervisor-operator-recruitment-2026': {
    'howToApply': [
      'Visit the official CSC recruitment portal at career.csccloud.in.',
      'Click on the link for Aadhaar Supervisor / Operator Vacancy 2026.',
      'Fill out the online application form with personal, contact, state/district, and qualification details.',
      'Enter valid UIDAI / NSEIT Aadhaar Operator or Supervisor Certificate number and details.',
      'Upload scanned copy of Aadhaar Card, UIDAI Certificate, 12th Marksheet, and Passport Photograph.',
      'Review all entered information carefully and submit the application online. No application fee is required.'
    ],
    'documentsRequired': [
      'Valid UIDAI / NSEIT Aadhaar Operator or Supervisor Certificate',
      '12th Pass (Intermediate / 10+2) Marksheet and Passing Certificate',
      'Aadhaar Card (Linked with active mobile number for OTP verification)',
      'Active CSC VLE ID or Village Panchayati Raj recommendation letter (if applicable)',
      'Recent Passport Size Color Photograph',
      'Computer / IT Qualification Certificate (Basic/DCA/Tally/B.Sc CS)'
    ],
    'importantInstructions': [
      'Holding a valid UIDAI/NSEIT operator or supervisor certificate is mandatory for selection.',
      'Selection will be on contract/project basis under CSC e-Governance Aadhaar Enrolment Centres.',
      'Applying for CSC Aadhaar Supervisor/Operator recruitment is completely free of cost.'
    ]
  },
  'kea-land-surveyor-bhoomapaka-recruitment-2026': {
    'howToApply': [
      'Visit the official Karnataka Examinations Authority (KEA) website at kea.kar.nic.in or cetonline.karnataka.gov.in.',
      'Select "Bhoomapaka (Land Surveyor) Direct Recruitment 2026" under the recruitment tab.',
      'Click on "New Registration" and create your login ID using mobile number and email ID.',
      'Fill in personal info, qualification (B.E/B.Tech, B.Sc, Diploma, or Agri degree), and RPC / Kalyana Karnataka preference.',
      'Upload scanned photograph, signature, thumb impression, SSLC marksheet, and qualifying degree marksheets.',
      'Pay the application fee online through KEA e-Payment gateway (Net Banking / Credit Card / Debit Card / UPI).',
      'Submit the online application before the extended deadline (20 August 2026) and print the final application form.'
    ],
    'documentsRequired': [
      'SSLC / 10th Standard Markcard for Date of Birth verification',
      'Qualifying Degree / Diploma Certificate & all semester markcards (B.E/B.Tech/B.Sc/Diploma/Agri)',
      'Reservation Certificates (SC / ST / Cat-1 / 2A / 2B / 3A / 3B) issued by Tahsildar with RD number',
      'Rural Medium Certificate & Kannada Medium Certificate (if claiming reservation)',
      'Kalyana Karnataka (Article 371-J) Local Eligibility Certificate (Form-A) for KK posts',
      'Recent Passport Size Photo, Signature scan, and Left Thumb Impression'
    ],
    'importantInstructions': [
      'Candidates claiming reservation must enter valid RD certificate numbers in the online application.',
      'Compulsory Kannada Language Test will be conducted for candidates who did not study Kannada in SSLC.',
      'Extended application deadline is 20-08-2026 (Fee payment till 21-08-2026).'
    ]
  },
  'icds-sonbhadra-up-anganwadi-worker-recruitment-2026': {
    'howToApply': [
      'Visit the official UP Anganwadi recruitment portal at upanganwadibharti.in.',
      'Select District "Sonbhadra", Project Name (Babhani, Chopan, Dudhi, Ghorawal, etc.), and Gram Sabha / Ward.',
      'Fill in personal details, female residency confirmation, income details, and 12th marksheet details.',
      'Upload scanned passport photograph, signature, 12th marksheet, domicile certificate, and income certificate.',
      'Verify all entered details carefully. No application fee is charged.',
      'Submit the online application before 26 August 2026 (12:00 Midnight) and save the registration number and printout.'
    ],
    'documentsRequired': [
      'Class 10th & Class 12th (Intermediate) Marksheets & Passing Certificates',
      'Domicile / Residence Certificate (निवास प्रमाण पत्र) issued by competent Tehsildar',
      'Income Certificate (आय प्रमाण पत्र) for BPL verification',
      'Caste Certificate (जाति प्रमाण पत्र) for SC / ST / OBC candidates',
      'Widow / Divorced / Abandoned Woman Certificate from competent authority (if claiming preference)',
      'Recent passport size photo and signature scan'
    ],
    'importantInstructions': [
      'Only female candidates who are permanent residents of the targeted Gram Sabha / Ward can apply.',
      'Selection is strictly based on the merit percentage obtained in 12th Standard (Intermediate).',
      'Submitting false residence or income certificate will result in immediate disqualification.'
    ]
  },
  'tnstc-tamilnadu-apprentice-recruitment-2026': {
    'howToApply': [
      'Visit the National Apprenticeship Training Scheme (NATS 2.0) portal at nats.education.gov.in.',
      'Click on "Student Register" to create a new profile or "Student Login" if already registered.',
      'Complete profile registration by uploading B.E/B.Tech/Diploma/BA/B.Sc/B.Com degree details and CGPA/Percentage.',
      'Under the dashboard, go to "Apply Against Advertised Vacancies".',
      'Search for "TAMILNADU STATE TRANSPORT CORPORATION" (Villupuram / Kumbakonam / Salem / Madurai / Tirunelveli / MTC / SETC).',
      'Click "Apply" against the desired discipline. No application fee is charged. Take a printout of the application confirmation.'
    ],
    'documentsRequired': [
      'Provisional Certificate / Degree / Diploma Certificate (B.E/B.Tech/Diploma/BA/B.Sc/B.Com/BBA/BCA)',
      'Consolidated Marksheet of all semesters / years with percentage/CGPA to percentage conversion proof',
      'Class 10th & 12th Marksheet for Date of Birth verification',
      'Community Certificate (BC / MBC / SC / ST / EWS) if applicable',
      'Aadhaar Card linked with active bank account',
      'NATS Student Registration / Enrollment Number (12-digit ID)'
    ],
    'importantInstructions': [
      'Candidates must compulsorily enter percentage of marks in the NATS portal (% marks / CGPA x 10).',
      'Only pass outs of 2022, 2023, 2024, 2025, and May 2026 hailing from Tamil Nadu are eligible.',
      'Candidates with 1+ year prior apprenticeship training or work experience are NOT eligible.'
    ]
  },
  'kea-grama-adhikari-vao-kalyana-karnataka-recruitment-2026': {
    'howToApply': [
      'Visit the official KEA portal at cetonline.karnataka.gov.in/kea/.',
      'Click on "Grama Adhikari (VAO) Direct Recruitment 2026 - Kalyana Karnataka Region".',
      'Click "New Registration" and enter basic details to generate User ID and Password.',
      'Fill out personal details, district preference (Kalaburagi, Bidar, Raichur), and 2nd PUC / Diploma qualification.',
      'Upload scanned photo, signature, left thumb impression, SSLC marksheet, and PUC / Diploma certificate.',
      'Pay the application fee online through KEA E-Payment portal (Net Banking / Debit Card / Credit Card / UPI).',
      'Submit the application online and download the acknowledgment form for the Kannada exam & competitive test.'
    ],
    'documentsRequired': [
      'SSLC / 10th Standard Markcard for Age Proof',
      '2nd PUC (12th Pass) Markcard / 3-Year Diploma Certificate / 2-Year ITI Certificate',
      'Article 371-J Kalyana Karnataka Region Local Eligibility Certificate (Form-A)',
      'Caste & Income Certificate (Category 1, 2A, 2B, 3A, 3B, SC, ST) with valid RD number',
      'Rural Candidate Certificate & Kannada Medium Certificate (if applicable)',
      'Recent Passport Size Photo, Signature scan, and Left Thumb Impression'
    ],
    'importantInstructions': [
      'Compulsory Kannada Language Test (150 Marks) will be conducted on 25 October 2026.',
      'Candidates must obtain a minimum of 50 marks in Kannada test to qualify for merit evaluation.',
      'Negative marking of 0.25 marks per wrong answer in the competitive examination.'
    ]
  },
  'kea-grama-adhikari-vao-rpc-recruitment-2026': {
    'howToApply': [
      'Visit the official KEA portal at cetonline.karnataka.gov.in/kea/.',
      'Click on "Grama Adhikari (VAO) Direct Recruitment 2026 - Residual Parent Cadre".',
      'Click "New Registration" to create your applicant profile with email and mobile number.',
      'Fill in personal details, district choice from 21 RPC districts (Tumakuru, Mysuru, Belagavi, etc.), and PUC marks.',
      'Upload scanned photograph, signature, thumb impression, SSLC marksheet, and PUC/Diploma certificate.',
      'Pay application fee online via KEA E-Payment gateway.',
      'Submit the final online application form and print a copy for offline OMR exam admittance.'
    ],
    'documentsRequired': [
      'SSLC / 10th Marksheet as Date of Birth proof',
      '2nd PUC (12th Pass) / 3-Year Diploma / 2-Year ITI Certificate & Marksheet',
      'Caste / Category Certificate (SC / ST / Cat-1 / 2A / 2B / 3A / 3B) with RD number',
      'Rural Medium Certificate (Form-1) & Kannada Medium Certificate (if claiming reservation)',
      'Disability Certificate (PwD) / Ex-Servicemen Discharge Book if applicable',
      'Recent Passport Size Color Photo, Signature scan, and Left Thumb Impression'
    ],
    'importantInstructions': [
      'Offline OMR Competitive Exam scheduled for 04 October 2026 (Paper 1 & Paper 2).',
      'Selection is strictly district-wise based on performance in competitive written exam.',
      'Penalty of 0.25 marks will be deducted for each incorrect response in OMR answer sheet.'
    ]
  }
}

with open('src/data/jobDetails.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for key, data in updates.items():
    # Find the closing bracket of faqs: [ ... ] for this key
    pattern = r"('" + re.escape(key) + r"':\s*\{[\s\S]*?faqs:\s*\[[\s\S]*?\]\s*\n)"
    m = re.search(pattern, text)
    if m:
        matched_str = m.group(1)
        # Format JS arrays
        how_to_apply_js = ",\n    howToApply: [\n" + ",\n".join([f"      '{step}'" for step in data['howToApply']]) + "\n    ]"
        docs_js = ",\n    documentsRequired: [\n" + ",\n".join([f"      '{doc}'" for doc in data['documentsRequired']]) + "\n    ]"
        inst_js = ",\n    importantInstructions: [\n" + ",\n".join([f"      '{inst}'" for inst in data['importantInstructions']]) + "\n    ]"
        
        replacement = matched_str + how_to_apply_js + docs_js + inst_js
        text = text.replace(matched_str, replacement, 1)
        print(f"Updated {key}!")
    else:
        print(f"FAILED to match {key}")

with open('src/data/jobDetails.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("\nDone updating all 10 entries in jobDetails.ts!")
