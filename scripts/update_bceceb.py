import json
import os
import re

details_file = 'src/data/jobDetails.json'
jobs_file = 'src/data/jobsData.ts'
job_id = 'health-department-government-o-senior-resident-tutor-tenure-3-recruitment-2026'

with open(details_file, 'r', encoding='utf-8') as f:
    details = json.load(f)

job = {
    'id': job_id,
    'seoTitle': 'Bihar Senior Resident / Tutor Recruitment 2026 (Tenure Posts) Apply Online BCECEB | NewVacancyAlert',
    'seoDescription': 'Bihar Health Department Senior Resident and Tutor Tenure Recruitment 2026 (Notice No. 01/2026). Check MD/MS/DNB/MDS eligibility, Level-9 salary, Rs. 2250 fee, age limits and apply online at bceceboard.bihar.gov.in by 08 Sept 2026.',
    'focusKeywords': 'Bihar Senior Resident Recruitment 2026, BCECEB Senior Resident Tutor 2026, Bihar Health Department Senior Resident Tenure, bceceboard.bihar.gov.in apply online',
    'lsiKeywords': 'Bihar Senior Resident Level 9 Pay Scale, BCECEB Senior Resident Eligibility NMC 2025, Bihar Senior Resident Tutor Age Limit, BCECEB Health SR 2026 II 01 notification',
    'title': 'Bihar Health Department Senior Resident / Tutor (3-Year Tenure) Recruitment 2026 – Apply Online via BCECEB',
    'board': 'Health Department, Government of Bihar (via Bihar Combined Entrance Competitive Examination Board - BCECEB)',
    'advtNo': 'BCECEB/Health(SR)/2026(II)/01, Dated 24.08.2026',
    'vacancies': 118,
    'jobLocation': 'Bihar (State Medical and Dental Colleges and Hospitals)',
    'applicationMode': 'Online via Official Portal (bceceboard.bihar.gov.in)',
    'applicationStatus': 'Active - Apply Online from 25 August to 08 September 2026 (10:00 PM)',
    'lastUpdated': '2026-08-27',
    'overview': [
        'Health Department, Government of Bihar, in coordination with the Bihar Combined Entrance Competitive Examination Board (BCECEB), has officially released employment notification BCECEB/Health(SR)/2026(II)/01 dated 24.08.2026 for the constitution of merit panels for appointment to 3-year tenure posts of Senior Resident / Tutor across State Medical and Dental Colleges and Hospitals.',
        'Appointments will be conducted under the Bihar Medical Education Service Cadre (Recruitment, Appointment, and Promotion) Rules 2008, Amendment Rules 2013, and Amendment Rules 2026. The selection adheres to the National Medical Commission (NMC Teachers Eligibility Qualifications in Medical Institutions Regulations, 2025) and DCI standards for MD, MS, DNB, and MDS degree holders.',
        'Vacancies are distributed as 40% for Bihar State Health Services cadre doctors, 40% for candidates completing PG Degree under Residency Scheme from Bihar Govt Medical/Dental Colleges, and 20% for candidates completing PG Degree from other recognized institutions outside Bihar. Eligible candidates can apply online at bceceboard.bihar.gov.in between 25 August 2026 and 08 September 2026 (10:00 PM).'
    ],
    'highlights': [
        {'label': 'Recruiting Department', 'value': 'Health Department, Government of Bihar'},
        {'label': 'Examining / Nodal Agency', 'value': 'Bihar Combined Entrance Competitive Examination Board (BCECEB)'},
        {'label': 'Post Name', 'value': 'Senior Resident / Tutor (3-Year Tenure Post)'},
        {'label': 'Advertisement / Notice No.', 'value': 'BCECEB/Health(SR)/2026(II)/01 dated 24.08.2026'},
        {'label': 'Total Vacancies', 'value': '118+ Tenure Posts (Discipline-wise as per Prospectus)'},
        {'label': 'Educational Qualification', 'value': 'Postgraduate Degree (MD / MS / DNB / MDS) in concerned specialty as per NMC/DCI Regulations 2025 (PG Diploma eligible with concession if PG degree holders unavailable)'},
        {'label': 'Age Limit (as on 01.08.2026)', 'value': 'UR Male: 37 Yrs | UR Female / BC / EBC: 40 Yrs | SC / ST: 42 Yrs (+5 yrs for Bihar Health Service Doctors, +10 yrs for PwD)'},
        {'label': 'Salary / Pay Scale', 'value': 'Pay Level-09 (वेतनमान लेवल-09) + DA and admissible allowances (Regular salary protected for BSHS doctors)'},
        {'label': 'Counselling / Application Fee', 'value': 'Rs. 2,250/- for all categories (UR / EWS / BC / EBC / SC / ST / DQ-PwD)'},
        {'label': 'Application Mode', 'value': 'Online via BCECEB Portal (bceceboard.bihar.gov.in)'},
        {'label': 'Online Registration Window', 'value': '25 August 2026 to 08 September 2026 (10:00 PM)'},
        {'label': 'Fee Payment Deadline', 'value': '08 September 2026 (11:59 PM)'},
        {'label': 'Application Editing Window', 'value': '09 September 2026 (11:59 PM)'},
        {'label': 'Document Verification Schedule Release', 'value': '11 September 2026'},
        {'label': 'Official Website', 'value': 'https://bceceboard.bihar.gov.in'}
    ],
    'importantDates': [
        {'event': 'Official Notification Release Date', 'date': '24 August 2026'},
        {'event': 'Online Registration & Form Submission Start Date', 'date': '25 August 2026'},
        {'event': 'Online Registration Closing Date', 'date': '08 September 2026 (10:00 PM)'},
        {'event': 'Last Date for Online Fee Payment (Net Banking/Debit/Credit/UPI)', 'date': '08 September 2026 (11:59 PM)'},
        {'event': 'Online Application Editing / Correction Period', 'date': '09 September 2026 (up to 11:59 PM)'},
        {'event': 'Publication of Document Verification Programme Date', 'date': '11 September 2026'},
        {'event': 'Document Verification / Counselling Schedule', 'date': 'September 2026 (To be notified)'}
    ],
    'vacanciesDetails': [
        {'postName': 'Senior Resident / Tutor (Medical Specialties)', 'vacancies': 'As per Prospectus (Total 118+ Posts)', 'qualification': 'MD / MS / DNB in concerned specialty recognized by MCI / NMC'},
        {'postName': 'Senior Resident / Tutor (Dental Specialties)', 'vacancies': 'As per Prospectus', 'qualification': 'MDS degree in concerned specialty recognized by DCI / NMC'}
    ],
    'eligibility': {
        'education': 'Postgraduate Degree (MD / MS / DNB / MDS) in the concerned specialty in accordance with NMC Teachers Eligibility Qualifications in Medical Institutions Regulations, 2025 / DCI regulations. In case of non-availability of qualified PG Degree doctors, PG Diploma holders with 10 marks weightage will be considered below PG degree merit. Quota breakdown: 40% Bihar State Health Services cadre, 40% PG doctors from Bihar Govt Colleges, 20% PG doctors from other recognized institutions.',
        'ageLimit': 'Calculated as on 01.08.2026: Unreserved (Male) - 37 Years; Backward Class (BC) & Extremely Backward Class (EBC) (Male & Female) - 40 Years; Unreserved (Female) - 40 Years; Scheduled Caste (SC) & Scheduled Tribe (ST) (Male & Female) - 42 Years. Age relaxation of 5 years for Bihar State Health Services cadre doctors and 10 years for Divyang (PwD) candidates.',
        'medicalStandards': 'Standard medical and physical fitness required for hospital clinical duties, teaching, and patient care in State Medical/Dental Colleges.'
    },
    'salary': {
        'payLevel': 'Pay Level-09 (वेतनमान लेवल-09)',
        'initialPay': 'Level-09 Pay Matrix (Rs. 53,100 - Rs. 1,67,800 approx.)',
        'allowances': 'Dearness Allowance (DA), HRA, Medical Allowance, and other allowances as sanctioned by the Government of Bihar. Doctors already serving in Bihar State Health Services will continue to draw their existing pay scale + allowances.'
    },
    'applicationFee': [
        {'category': 'All Candidates (Unreserved / EWS / BC / EBC / SC / ST / DQ-PwD)', 'fee': 'Rs. 2,250/- (Two Thousand Two Hundred Fifty only) + online payment gateway processing charges'}
    ],
    'selectionProcess': [
        'Online Application Submission and Fee Payment through BCECEB Portal.',
        'Scrutiny of educational eligibility according to NMC Teachers Eligibility Regulations 2025 and DCI norms.',
        'Preparation of category-wise and specialty-wise merit panel following 40:40:20 quota allocations (40% BSHS, 40% Bihar Govt Medical Colleges, 20% Outside Institutions).',
        'Document Verification of original academic degrees, MCI/NMC/DCI registrations, caste/domicile certificates, and two copies of downloaded Verification Slip (जाँच-पर्ची).',
        'Final allotment and issuance of 3-year tenure appointment orders by Health Department, Govt. of Bihar.'
    ],
    'howToApplySteps': [
        'Visit BCECEB official website at https://bceceboard.bihar.gov.in.',
        'Click on the link Online Portal of Senior Resident / Tutor under Health Dept. and select Apply for Senior Resident / Tutor.',
        'Step 1 (Registration): Enter candidate name, active mobile number, and email ID. Verify mobile and email via separate OTP verification codes.',
        'Step 2 (Multi-Step Application): (a) Select Department/Specialty; (b) Enter Personal Information; (c) Enter Permanent and Correspondence Address; (d) Enter Educational Qualifications (MBBS/BDS & MD/MS/DNB/MDS/Diploma); (e) Upload high-contrast photograph, signature, and capture live photograph.',
        'Step 3 (Preview and Final Submit): Thoroughly verify all entered data. Click Final Submit and Proceed to Payment.',
        'Step 4 (Payment of Counselling Fee): Pay Rs. 2,250/- online via Debit Card, Credit Card, Net Banking, or UPI on or before 08.09.2026 (11:59 PM).',
        'Step 5 (Download Confirmation Page): Download and print the Confirmation Page and Fee Receipt for future reference and Document Verification (Hard copy does NOT need to be sent by post to the Board).'
    ],
    'documentsRequired': [
        'Admit Card / Original Mark-sheet / Certificate of Matriculation (10th) as proof of Date of Birth.',
        'Marks sheet of MBBS / BDS (Part I, II & III).',
        'Passing Certificate of MBBS / BDS.',
        'Attempt Certificate of MBBS / BDS.',
        'Marks Sheet and Passing Certificate of Specialty Subject (MD / MS / DNB / MDS / PG Diploma).',
        'Certificate of Ph.D. / DM / M.Ch. / M.Sc. (if applicable).',
        'Medical / Dental Council Registration Certificate (NMC / MCI / DCI / Bihar State Council).',
        'Experience Certificate (if applicable).',
        'Attested copy of No Objection Certificate (NOC) from employer (for in-service doctors).',
        'Current Caste Certificate with Non-Creamy Layer (NCL) for BC / EBC issued by DM / SDO / CO / Revenue Officer of Bihar.',
        'Residential / Domicile Certificate issued by CO / BDO / Revenue Officer of Bihar.',
        'Four identical passport-size photographs (same as uploaded in online form).',
        'Disability Certificate for DQ candidates issued by Competent Medical Board / Authority.',
        'Certificate for Economically Weaker Section (EWS) issued by DM / SDO in Bihar.',
        'Grandson / Granddaughter of Freedom Fighter Certificate (if applicable).',
        'Verification Slip (जाँच-पर्ची) in 2 copies downloaded from BCECEB website.',
        'Downloaded print of Online filled Application Form (Confirmation Page).'
    ],
    'faqs': [
        {
            'question': 'What is the recruitment advertisement number for Bihar Senior Resident / Tutor Recruitment 2026?',
            'answer': 'The official notification advertisement number is BCECEB/Health(SR)/2026(II)/01 dated 24.08.2026.'
        },
        {
            'question': 'What is the tenure period for Senior Resident / Tutor posts in Bihar Medical Colleges?',
            'answer': 'The appointment for Senior Resident / Tutor posts is on a 3-year tenure basis in State Medical and Dental Colleges and Hospitals of Bihar.'
        },
        {
            'question': 'What is the essential educational qualification for Senior Resident / Tutor under BCECEB?',
            'answer': 'Candidates must hold a Postgraduate Degree (MD / MS / DNB / MDS) in the concerned specialty recognized by NMC / DCI under the Teachers Eligibility Qualifications in Medical Institutions Regulations, 2025. In case of shortage of PG Degree holders, PG Diploma candidates with 10 marks weightage will be considered below PG Degree merit.'
        },
        {
            'question': 'What is the application / counselling fee for Bihar Senior Resident Recruitment 2026?',
            'answer': 'The counselling fee is Rs. 2,250/- for all categories (Unreserved, EWS, BC, EBC, SC, ST, and DQ/PwD candidates), payable strictly through online modes (Net Banking, Debit Card, Credit Card, or UPI).'
        },
        {
            'question': 'What are the age limits for Bihar Senior Resident / Tutor recruitment as on 01.08.2026?',
            'answer': 'Maximum age limits as on 01.08.2026 are: UR Male: 37 years; UR Female, BC & EBC (Male & Female): 40 years; SC & ST (Male & Female): 42 years. Bihar State Health Services doctors get 5 years category-wise age relaxation, and Divyang (PwD) candidates get 10 years additional relaxation.'
        },
        {
            'question': 'What is the quota allocation for Senior Resident / Tutor posts in Bihar?',
            'answer': 'Vacancies are allocated as: 40% for Bihar State Health Services cadre doctors, 40% for doctors completing PG Degree (Residency Scheme) from Bihar State Government Medical/Dental Colleges, and 20% for doctors completing PG Degree from recognized medical institutions outside Bihar.'
        },
        {
            'question': 'What is the salary and pay scale for Senior Resident / Tutor in Bihar?',
            'answer': 'Selected candidates are entitled to Pay Level-09 (वेतनमान लेवल-09) along with Dearness Allowance (DA) and other admissible state allowances. In-service doctors will continue to draw their existing regular salary + allowances.'
        },
        {
            'question': 'What is the starting and closing date for online registration?',
            'answer': 'Online registration starts on 25 August 2026 and closes on 08 September 2026 at 10:00 PM. Fee payment is accepted until 08 September 2026 (11:59 PM).'
        },
        {
            'question': 'Is there an application form correction / editing window?',
            'answer': 'Yes, candidates who successfully submit the online form and pay the fee can edit/rectify discrepancies on 09 September 2026 (up to 11:59 PM) by logging into their account on bceceboard.bihar.gov.in.'
        },
        {
            'question': 'When will the Document Verification programme be published?',
            'answer': 'The schedule/programme for Document Verification and Counselling will be published on the BCECEB website on 11 September 2026.'
        },
        {
            'question': 'Do I need to send a hard copy of the application form to BCECEB?',
            'answer': 'No, candidates do not need to send any hard copy by post. However, you must print and bring the Confirmation Page, Fee Receipt, and 2 copies of the downloaded Verification Slip (जाँच-पर्ची) with original certificates to the Document Verification.'
        },
        {
            'question': 'Can candidates who have already completed a 3-year tenure ship apply again?',
            'answer': 'No, as per official notice clause 6(iv), candidates who have already completed a 3-year Senior Residency / Tutor tenure ship in the same subject are not eligible to apply again for that subject.'
        },
        {
            'question': 'Can in-service government doctors apply for Senior Resident / Tutor?',
            'answer': 'Yes, doctors working in Bihar State Health Services or other Government/PSU organizations can apply provided they produce a valid No Objection Certificate (NOC) from their employer at the time of counselling/verification.'
        },
        {
            'question': 'Are candidates with degrees from outside Bihar eligible?',
            'answer': 'Yes, 20% of the total seats are allocated for eligible doctors who completed their PG Degree under the Residency Scheme from recognized medical institutions outside Bihar, provided they satisfy NMC/DCI norms.'
        },
        {
            'question': 'What should I do if the online fee is deducted but the transaction fails?',
            'answer': 'If the fee transaction fails, candidates must re-pay the full amount before the deadline to ensure submission. Failed transactions will be refunded to the original payment source. For payment issues, contact bangalorepgsd@billdesk.com or helpline 0612-2220230.'
        },
        {
            'question': 'What are the helpdesk contact details for BCECEB Senior Resident Recruitment?',
            'answer': 'Candidates can reach out to BCECEB helpdesk at email helpdesk.bceceboard@bihar.gov.in or phone number 0612-2220230.'
        },
        {
            'question': 'Where can I download the official notification and prospectus for Bihar SR/Tutor 2026(II)?',
            'answer': 'The official notification PDF and detailed prospectus can be downloaded from the official BCECEB portal at bceceboard.bihar.gov.in.'
        }
    ],
    'urls': [
        {
            'title': 'Download Bihar Senior Resident / Tutor 2026(II) Official Notification PDF',
            'url': 'https://bceceboard.bihar.gov.in/pdf_Adv/ADV_2SR26_01.pdf'
        },
        {
            'title': 'BCECEB Official Online Application Portal',
            'url': 'https://bceceboard.bihar.gov.in'
        }
    ]
}

details[job_id] = job
with open(details_file, 'w', encoding='utf-8') as f:
    json.dump(details, f, indent=2, ensure_ascii=False)

print('[SUCCESS] Updated jobDetails.json with rich PDF data')

with open(jobs_file, 'r', encoding='utf-8') as f:
    jobs_text = f.read()

pattern = r'\{\s*\"id\":\s*\"' + job_id + r'\"[\s\S]*?\}(?:,\s*)?'
new_summary = {
    'id': job_id,
    'b': 'Health Department, Government of Bihar (via BCECEB)',
    't': 'Bihar Health Department Senior Resident / Tutor (3-Year Tenure) Recruitment 2026 – Apply Online via BCECEB',
    'd': '25 August 2026',
    'l': '08 September 2026 (10:00 PM)',
    'a': 'BCECEB/Health(SR)/2026(II)/01',
    'q': 'Postgraduate Degree (MD / MS / DNB / MDS) in concerned specialty as per NMC 2025',
    'desc': 'Health Department, Government of Bihar, in coordination with BCECEB, has released employment notification BCECEB/Health(SR)/2026(II)/01 for 3-year tenure posts of Senior Resident / Tutor across State Medical and Dental Colleges and Hospitals.',
    'u': 'https://bceceboard.bihar.gov.in/pdf_Adv/ADV_2SR26_01.pdf'
}

entry_str = json.dumps(new_summary, indent=4, ensure_ascii=False)
if re.search(pattern, jobs_text):
    jobs_text = re.sub(pattern, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print('[SUCCESS] Updated jobsData.ts entry')
else:
    print('[WARN] Pattern not found in jobsData.ts')
