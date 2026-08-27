import json
import os
import re

details_file = 'src/data/jobDetails.json'
jobs_file = 'src/data/jobsData.ts'
dates_file = 'src/data/jobUploadDates.json'

job_id = 'national-informatics-centre-ni-scientifictechnical-assistant-recruitment-2026'

with open(details_file, 'r', encoding='utf-8') as f:
    details = json.load(f)

job = {
    'id': job_id,
    'seoTitle': 'NIC Scientific / Technical Assistant-A Recruitment 2026 (376 Posts) Apply Online | NewVacancyAlert',
    'seoDescription': 'National Informatics Centre (NIC) Recruitment 2026 notification for 376 Scientific/Technical Assistant-A (Group-B Level 6) posts via GATE 2024/2025/2026. Check eligibility, CS/ECE/DA streams, salary Rs. 35400-112400 & apply online at recruitment.nic.in.',
    'focusKeywords': 'NIC Recruitment 2026, NIC Scientific Assistant Recruitment 2026, National Informatics Centre STA-A 376 Posts, recruitment.nic.in apply online',
    'lsiKeywords': 'NIC STA-A GATE 2024 2025 2026 Score, NIC Technical Assistant CS ECE Data Science Vacancy, Level 6 Salary NIC 7th CPC, MeitY Govt Jobs 2026',
    'title': 'National Informatics Centre (NIC) Recruitment 2026 – Apply Online for 376 Scientific/Technical Assistant-A Posts via GATE',
    'board': 'National Informatics Centre (NIC), Ministry of Electronics and Information Technology (MeitY)',
    'advtNo': 'NIC/STA/2026/2',
    'vacancies': 376,
    'jobLocation': 'All India / Anywhere in India (with liability to serve abroad)',
    'applicationMode': 'Online (via Official Recruitment Portal: recruitment.nic.in)',
    'applicationStatus': 'Online Registration Opens 01/09/2026 to 30/09/2026',
    'lastUpdated': '2026-08-27',
    'overview': [
        'National Informatics Centre (NIC), the premier technology organization under the Ministry of Electronics and Information Technology (MeitY), Government of India, has officially released detailed advertisement notification NIC/STA/2026/2 for direct recruitment to 376 vacancies of Scientific/Technical Assistant-A, a Group-B S&T (Non-Gazetted) post in Pay Level 6 (Rs. 35,400 - Rs. 1,12,400) of the 7th Central Pay Commission.',
        'Selection will be based strictly on a valid Graduate Aptitude Test in Engineering (GATE) score from the years 2024, 2025, or 2026 across three engineering disciplines: Computer Sciences & Information Technology (300 posts, GATE Code: CS), Electronics and Communication Engineering (26 posts, GATE Code: EC), and Data Science and Artificial Intelligence (50 posts, GATE Code: DA). Equal weightage will be given to GATE 2024, GATE 2025, and GATE 2026 scores.',
        'Eligible Indian citizens with B.E./B.Tech/M.Sc/MCA/MS in relevant engineering and computer science fields with a valid GATE score can apply online through the official portal https://recruitment.nic.in from 1st September 2026 (10:00 AM) to 30th September 2026 (05:30 PM).'
    ],
    'highlights': [
        {'label': 'Recruiting Body', 'value': 'National Informatics Centre (NIC)'},
        {'label': 'Parent Ministry', 'value': 'Ministry of Electronics and Information Technology (MeitY), Govt. of India'},
        {'label': 'Post Name', 'value': 'Scientific / Technical Assistant - A (Group-B S&T, Non-Gazetted)'},
        {'label': 'Advt Notification No.', 'value': 'Detailed Advertisement Ref. No: NIC/STA/2026/2'},
        {'label': 'Total Vacancies', 'value': '376 Posts (CS/IT: 300, ECE: 26, Data Science & AI: 50)'},
        {'label': 'Recruitment Mode', 'value': 'Direct Recruitment based on Valid GATE Score (2024 / 2025 / 2026)'},
        {'label': 'Pay Scale', 'value': 'Level-6 (Rs. 35,400 - Rs. 1,12,400) in 7th CPC Pay Matrix'},
        {'label': 'Educational Qualification', 'value': 'B.E. / B.Tech / M.Sc. / MS / MCA in CS / IT / ECE / Data Science / Allied streams'},
        {'label': 'Mandatory GATE Requirement', 'value': 'Valid GATE Score (2024 / 2025 / 2026) in CS, EC, or DA paper code'},
        {'label': 'Experience Required', 'value': 'NIL (No Experience Required - Freshers Eligible)'},
        {'label': 'Upper Age Limit', 'value': '30 Years for UR/EWS (SC/ST: 35 yrs, OBC-NCL: 33 yrs, PwBD: 40 yrs)'},
        {'label': 'Application Fee', 'value': 'Rs. 800/- for UR/OBC/EWS | NIL for SC/ST/PwBD/Women'},
        {'label': 'Online Application Window', 'value': '01/09/2026 (10:00 AM) to 30/09/2026 (05:30 PM)'},
        {'label': 'Selection Process', 'value': 'GATE Score Merit List + Document Verification (No Written Exam/Interview)'},
        {'label': 'Posting Location', 'value': 'Anywhere in India and outside India (All India Service Liability)'},
        {'label': 'Official Application Portal', 'value': 'https://recruitment.nic.in'}
    ],
    'importantDates': [
        {'event': 'Official Detailed Notification Release Date', 'date': '26 August 2026'},
        {'event': 'Opening Date for Online Applications', 'date': '01 September 2026 (10:00 AM)'},
        {'event': 'Closing Date for Online Applications', 'date': '30 September 2026 (05:30 PM)'},
        {'event': 'Crucial Cut-off Date for Age & Eligibility', 'date': '30 September 2026'},
        {'event': 'Schedule for Document Verification of Shortlisted Candidates', 'date': 'To be announced on recruitment.nic.in'}
    ],
    'vacanciesDetails': [
        {
            'postName': 'Scientific/Technical Assistant-A (Computer Sciences & Information Technology - CS/IT)',
            'vacancies': '300 Posts (UR: 122, SC: 45, ST: 22, OBC-NCL: 81, EWS: 30, PwBD: 15)',
            'qualification': 'Pass in M.Sc./MS/MCA/B.E./B.Tech. in Computer Sciences, IT, Software System, Networking Security, Informatics, Electronics or combination + VALID GATE Score (2024, 2025 or 2026) in Paper Code CS (Computer Science & Information Technology).'
        },
        {
            'postName': 'Scientific/Technical Assistant-A (Electronics and Communication Engineering - ECE)',
            'vacancies': '26 Posts (UR: 13, SC: 3, ST: 1, OBC-NCL: 7, EWS: 2, PwBD: 2)',
            'qualification': 'Pass in M.Sc./MS/MCA/B.E./B.Tech. in Electronics, Electronics & Communication, Electronics & Telecommunication or combination + VALID GATE Score (2024, 2025 or 2026) in Paper Code EC (Electronics and Communication Engineering).'
        },
        {
            'postName': 'Scientific/Technical Assistant-A (Data Science and Artificial Intelligence - DA)',
            'vacancies': '50 Posts (UR: 22, SC: 7, ST: 3, OBC-NCL: 13, EWS: 5, PwBD: 2)',
            'qualification': 'Pass in M.Sc./MS/MCA/B.E./B.Tech. in Computer Science, Data Science, AI, IT, Electronics, Informatics or combination + VALID GATE Score (2024, 2025 or 2026) in Paper Code DA (Data Science and Artificial Intelligence).'
        }
    ],
    'eligibility': {
        'education': 'A Pass in M.Sc. / MS / MCA / B.E. / B.Tech. in single or combination of: Electronics, Electronics and Communication, Electronics & Telecommunication, Computer Sciences, Computer and Networking Security, Software System, Information Technology, Informatics from a recognized University/Institution. Must possess a valid GATE score (2024, 2025, or 2026) in GATE paper CS, EC, or DA.',
        'ageLimit': 'Maximum 30 years for UR/EWS as on 30/09/2026. Age relaxations: SC/ST - 5 years (up to 35 yrs), OBC (NCL) - 3 years (up to 33 yrs), PwBD (UR/EWS) - 10 years (up to 40 yrs), PwBD (OBC) - 13 years (up to 43 yrs), PwBD (SC/ST) - 15 years (up to 45 yrs), In-service Central Govt employees - 5 years.',
        'medicalStandards': 'Candidates shortlisted for provisional appointment must satisfy standard Government of India physical and medical fitness requirements.'
    },
    'salary': {
        'payLevel': 'Level 6 in 7th CPC Pay Matrix (Group-B S&T Non-Gazetted)',
        'initialPay': 'Rs. 35,400/- per month (Basic Pay)',
        'allowances': 'Total gross monthly salary approx. Rs. 55,000/- to Rs. 65,000/- per month including Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), CGHS medical facilities, and NPS pension benefits as per Central Government rules.'
    },
    'applicationFee': [
        {'category': 'UR / OBC (NCL) / EWS Candidates', 'fee': 'Rs. 800/- per discipline (Online payment mode only)'},
        {'category': 'SC / ST / PwBD / Women Candidates', 'fee': 'NIL (Exempted from Application Fee)'}
    ],
    'selectionProcess': [
        'Registration and submission of online application on the official portal https://recruitment.nic.in.',
        'Shortlisting of candidates strictly in order of merit based on valid GATE score of 2024, 2025, or 2026 (Equal weightage for all three years).',
        'Resolution of Ties: (1) Older year GATE score ranked higher; (2) Candidate older in age ranked higher; (3) Candidate with higher % marks in essential qualifying degree ranked higher.',
        'Document Verification at Delhi or other designated regional centres with original certificates and downloaded Authorization Letter.',
        'Medical fitness examination and issuance of formal Offer of Appointment.'
    ],
    'howToApplySteps': [
        'Visit the official NIC Recruitment portal at https://recruitment.nic.in between 01/09/2026 (10:00 AM) and 30/09/2026 (05:30 PM).',
        'Step 1 - Registration: Register with your basic details, active Mobile Number, and valid Email ID.',
        'Step 2 - Application Form: Log in as registered candidate, fill in academic qualifications, select discipline (CS/IT, ECE, or Data Science & AI), enter GATE Registration Number, Year (2024/2025/2026), and GATE Score.',
        'Upload required scanned documents: Photograph (50-200 KB), Signature (10-50 KB), and self-attested PDF copies of Date of Birth certificate, 10th & 12th marksheet, Essential Degree/Provisional Certificate, CGPA conversion certificate, Category Certificate, and GATE Score Card (10-500 KB).',
        'Step 3 - Fee Payment: Pay application fee of Rs. 800/- online via Debit/Credit Card or Net Banking (SC/ST/PwBD/Women candidates are exempted).',
        'Step 4 - Confirmation Page: Download and print the final Confirmation Page and Application Form for future reference and document verification.'
    ],
    'documentsRequired': [
        'Printout of the online submitted Application Form and Authorization Letter.',
        'Valid GATE Score Card (for year 2024, 2025, or 2026).',
        'Proof of Date of Birth (Class 10th / Matriculation Certificate / Birth Certificate).',
        'Class 10th & 12th (Senior Secondary) Certificates and Marksheets.',
        'Essential Qualification Degree Certificate (B.E./B.Tech/M.Sc/MCA/MS) and semester-wise marksheets.',
        'CGPA to Percentage Conversion Certificate from the Registrar of University (if applicable).',
        'Valid Caste/Category Certificate (SC/ST/OBC-NCL/EWS) in prescribed Govt of India format.',
        'PwBD Certificate (minimum 40% disability) issued by Government Medical Board (if applicable).',
        'No Objection Certificate (NOC) for candidates working in Central/State Govt/PSU/Autonomous bodies.',
        'Aadhaar Card (for Aadhaar-based authentication) and valid Govt Photo ID (PAN Card / Voter ID / Passport).'
    ],
    'faqs': [
        {
            'question': 'What is the official advertisement number for NIC Scientific/Technical Assistant-A Recruitment 2026?',
            'answer': 'The official notification advertisement number is NIC/STA/2026/2 issued by National Informatics Centre (NIC), Ministry of Electronics and Information Technology (MeitY).'
        },
        {
            'question': 'How many total vacancies are announced in NIC STA-A Recruitment 2026?',
            'answer': 'A total of 376 vacancies are available: Computer Sciences & IT (300 posts), Electronics & Communication Engineering (26 posts), and Data Science & Artificial Intelligence (50 posts).'
        },
        {
            'question': 'Is GATE Score mandatory for NIC Scientific/Technical Assistant-A recruitment 2026?',
            'answer': 'Yes, candidates must possess a valid GATE Score from GATE 2024, GATE 2025, or GATE 2026 in paper codes CS (Computer Science), EC (Electronics & Communication), or DA (Data Science & AI).'
        },
        {
            'question': 'Is there any written examination or interview conducted by NIC?',
            'answer': 'No, selection is made purely on direct recruitment merit based on valid GATE scores (2024/2025/2026) followed by Document Verification.'
        },
        {
            'question': 'What is the pay scale for Scientific/Technical Assistant-A in NIC?',
            'answer': 'The post is in Level-6 of 7th CPC Pay Matrix with basic pay of Rs. 35,400 - Rs. 1,12,400 (Gross salary approx. Rs. 55,000 - Rs. 65,000 per month plus central government allowances).'
        },
        {
            'question': 'What are the application start and end dates for NIC Recruitment 2026?',
            'answer': 'Online applications open on 1st September 2026 (10:00 AM) and close on 30th September 2026 (05:30 PM).'
        },
        {
            'question': 'What is the upper age limit for NIC STA-A recruitment?',
            'answer': 'The upper age limit is 30 years for UR/EWS as on 30/09/2026. Age relaxations of 5 years for SC/ST (up to 35 yrs), 3 years for OBC-NCL (up to 33 yrs), and 10-15 years for PwBD candidates are applicable.'
        },
        {
            'question': 'What is the application fee for NIC Recruitment 2026?',
            'answer': 'The application fee is Rs. 800/- for UR, OBC (NCL), and EWS candidates. SC, ST, PwBD, and Women candidates are completely exempted from paying any fee.'
        },
        {
            'question': 'Are candidates with M.Sc or MCA eligible to apply?',
            'answer': 'Yes, candidates with M.Sc, MS, MCA, B.E., or B.Tech in relevant disciplines (CS, IT, Electronics, Software, Data Science, AI) with a valid GATE score in CS, EC, or DA are eligible.'
        },
        {
            'question': 'Is previous work experience required for NIC Scientific/Technical Assistant-A?',
            'answer': 'No, experience is not required. Fresh graduates with the required qualification and valid GATE score are fully eligible.'
        },
        {
            'question': 'Can a candidate apply for more than one discipline in NIC?',
            'answer': 'Yes, candidates fulfilling the eligibility criteria for multiple disciplines can apply by submitting separate applications and paying the prescribed fee of Rs. 800/- for each discipline.'
        },
        {
            'question': 'Where will the selected candidates be posted?',
            'answer': 'The post carries All India Service Liability, and selected candidates may be posted anywhere in India or abroad in the interest of the organization.'
        },
        {
            'question': 'Where can I apply online for NIC Recruitment 2026?',
            'answer': 'Applications can be submitted online exclusively through the official NIC recruitment portal at https://recruitment.nic.in.'
        },
        {
            'question': 'Where can I download the official notification PDF for NIC STA-A 2026?',
            'answer': 'The detailed 20-page notification PDF is available on the official portal: https://recruitment.nic.in/DetailedSTA.pdf.'
        },
        {
            'question': 'What is the official email helpdesk for NIC recruitment queries?',
            'answer': 'For any technical assistance or queries related to the online application, candidates can email helpdesk-nic@nic.in mentioning the advertisement number.'
        }
    ],
    'urls': [
        {
            'title': 'Download NIC Scientific/Technical Assistant-A 2026 Official Notification PDF',
            'url': 'https://recruitment.nic.in/DetailedSTA.pdf'
        },
        {
            'title': 'Apply Online at NIC Official Recruitment Portal (recruitment.nic.in)',
            'url': 'https://recruitment.nic.in'
        },
        {
            'title': 'National Informatics Centre (NIC) Official Website',
            'url': 'https://www.nic.gov.in'
        }
    ]
}

details[job_id] = job
with open(details_file, 'w', encoding='utf-8') as f:
    json.dump(details, f, indent=2, ensure_ascii=False)

print(f'[SUCCESS] Saved {job_id} to jobDetails.json')

# Update jobsData.ts
with open(jobs_file, 'r', encoding='utf-8') as f:
    jobs_text = f.read()

pattern = r'\{\s*\"id\":\s*\"' + job_id + r'\"[\s\S]*?\}(?:,\s*)?'

new_summary = {
    'id': job_id,
    'b': 'National Informatics Centre (NIC)',
    't': 'National Informatics Centre (NIC) Recruitment 2026 – Apply Online for 376 Scientific/Technical Assistant-A Posts via GATE',
    'd': '26 August 2026',
    'l': '30 September 2026',
    'a': 'NIC/STA/2026/2',
    'q': 'B.E / B.Tech / M.Sc / MS / MCA (CS / IT / ECE / Data Science) + Valid GATE (CS / EC / DA)',
    'desc': 'National Informatics Centre (NIC), Ministry of Electronics and Information Technology (MeitY) has officially released employment advertisement notification NIC/STA/2026/2 for direct recruitment to 376 vacancies for Scientific/Technical Assistant-A posts based on valid GATE scores (2024/2025/2026).',
    'u': 'https://recruitment.nic.in/DetailedSTA.pdf'
}

entry_str = json.dumps(new_summary, indent=4, ensure_ascii=False)

if re.search(pattern, jobs_text):
    jobs_text = re.sub(pattern, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Updated {job_id} in jobsData.ts')
else:
    print(f'[ERROR] Could not find {job_id} in jobsData.ts')

