import json
import os
import re

details_file = 'src/data/jobDetails.json'
jobs_file = 'src/data/jobsData.ts'
dates_file = 'src/data/jobUploadDates.json'

job_id = 'national-health-mission-nhm-di-staff-nurse-support-staff-and-recruitment-2026'

with open(details_file, 'r', encoding='utf-8') as f:
    details = json.load(f)

job = {
    'id': job_id,
    'seoTitle': 'NHM Goa Recruitment 2026 (135 Posts) CHO, MO, Staff Nurse Apply Online | NewVacancyAlert',
    'seoDescription': 'NHM Goa Recruitment 2026 notification for 135 contractual posts including CHO (45), Medical Officer, Staff Nurse, Pharmacist, Support Staff & more. Check eligibility, salary Rs. 10000 - 100000 & apply online by 18 September 2026.',
    'focusKeywords': 'NHM Goa Recruitment 2026, National Health Mission Goa CHO Vacancy, DHS Goa Staff Nurse Recruitment 2026, NHM Goa Medical Officer 135 Posts',
    'lsiKeywords': 'NHM Goa Pharmacist Recruitment, Directorate of Health Services Panaji Contract Jobs, Goa CHO MLHP Eligibility 2026, nhm.goa.gov.in application form',
    'title': 'National Health Mission (NHM) Goa Recruitment 2026 – Apply Online for 135 CHO, Medical Officer, Staff Nurse, Pharmacist & Various Posts',
    'board': 'National Health Mission (NHM), Directorate of Health Services, Panaji – Goa',
    'advtNo': 'DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537, Dated 26 August 2026',
    'vacancies': 135,
    'jobLocation': 'Goa (North Goa & South Goa Districts)',
    'applicationMode': 'Online (via Official Google Form: https://forms.gle/F5rw7ULinXEjSUJZ9)',
    'applicationStatus': 'Active - Apply Online before 18 September 2026',
    'lastUpdated': '2026-08-27',
    'overview': [
        'National Health Mission (NHM), Directorate of Health Services (DHS), State Health Society, Panaji, Goa has officially issued recruitment notification DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537 dated 26 August 2026 inviting online applications for 135 contractual vacancies across 28 diverse clinical, nursing, paramedical, managerial, and support designations for a period of one (1) year.',
        'Major vacancies include 45 Community Health Officers (CHO - B.Sc Nursing with MLHP), 8 Medical Officers (MBBS), 1 Specialist Cardiologist, 4 Staff Nurses, 9 Pharmacists, 9 Counsellors, 14 Support Staff (Class 8th Pass), 3 Audiologists, 2 ANMs, 2 Dental Technicians, and multiple technical/administrative supervisory roles. Monthly consolidated remuneration ranges from Rs. 10,000/- up to Rs. 1,00,000/- per month.',
        'Candidates holding required qualifications, 15 years Goa residence certificate, and essential knowledge of Konkani can apply online via the official Google application form before the closing date of 18th September 2026.'
    ],
    'highlights': [
        {'label': 'Recruiting Body', 'value': 'National Health Mission (NHM), Directorate of Health Services, Goa'},
        {'label': 'Authority', 'value': 'State Health Society, Campal, Panaji – 403 001, Goa'},
        {'label': 'Advt Notification No.', 'value': 'DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537 dated 26.08.2026'},
        {'label': 'Total Vacancies', 'value': '135 Vacancies across 28 Designations'},
        {'label': 'Key Posts', 'value': 'CHO (45), Medical Officer (8), Staff Nurse (4), Pharmacist (9), Support Staff (14), Counsellor (9)'},
        {'label': 'Employment Nature', 'value': 'Contractual Basis for 1 Year under National Health Mission'},
        {'label': 'Monthly Remuneration', 'value': 'Rs. 10,000/- to Rs. 1,00,000/- per month (Consolidated)'},
        {'label': 'Educational Qualification', 'value': '8th Pass / 10th / 12th / DMLT / GNM / B.Sc Nursing / B.Pharm / B.Com / B.Sc / MCA / MBBS / MD'},
        {'label': 'Age Limit', 'value': '18 to 40 Years (Age relaxation: SC/ST: 5 yrs, OBC: 3 yrs, PwBD: 10 yrs)'},
        {'label': 'Mandatory Requirement', 'value': '15 Years Goa Residence Certificate + Essential Knowledge of Konkani'},
        {'label': 'Application Fee', 'value': 'NIL (No Application Fee / Free)'},
        {'label': 'Application Deadline', 'value': '18 September 2026'},
        {'label': 'Selection Process', 'value': 'Scrutiny of Online Applications + Document Verification + Personal Interview'},
        {'label': 'Posting Location', 'value': 'North Goa & South Goa District Hospitals, CHCs, PHCs & UHCs'},
        {'label': 'Official Online Form Link', 'value': 'https://forms.gle/F5rw7ULinXEjSUJZ9'}
    ],
    'importantDates': [
        {'event': 'Official Notification Release Date', 'date': '26 August 2026'},
        {'event': 'Online Application Submission Starts', 'date': '26 August 2026'},
        {'event': 'Last Date for Online Application Submission', 'date': '18 September 2026'},
        {'event': 'Scrutiny and Shortlisting of Candidates', 'date': 'To be announced on NHM Goa website'},
        {'event': 'Document Verification & Interview Dates', 'date': 'To be communicated to shortlisted candidates'}
    ],
    'vacanciesDetails': [
        {'postName': 'Specialist Cardiologist (NPCDCS)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'M.D. in Medicine or equivalent from MCI recognized institution + Specialist training in Endocrinology or Cardiology. Desirable: 2 years hospital specialist experience.'},
        {'postName': 'Medical Officer (NTEP & NUHM)', 'vacancies': '8 Posts (UR: 6, OBC: 2)', 'qualification': 'MBBS from recognized university with valid Goa Medical Council registration + Compulsory rotatory internship completion.'},
        {'postName': 'Block Entomologist (BPHU)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'M.Sc. (Zoology) with Entomology as a subject + Computer knowledge of MS Office.'},
        {'postName': 'Clinical Psychologist (DEIC)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'M.Phil Clinical Psychology / Masters in Clinical / Child / Rehabilitation Psychology + 1 year work exp with special needs children. RCI registration preferred.'},
        {'postName': 'Audiologist (NCDC-NPPCD & DEIC)', 'vacancies': '3 Posts (UR: 3)', 'qualification': 'Graduate in Audiology & Speech Language Pathology (BASLP) from RCI recognized institute + Valid RCI registration.'},
        {'postName': 'Consultant - ARSH (PM)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'BAMS / BHMS + Master in Hospital Management / Health Management / Public Health Management (2 years full-time).'},
        {'postName': 'Vaccine Cold Chain Logistic Manager (VCCLM)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'Graduate in BBA / Public Health OR Diploma in Hospital / Supply Chain Management OR Degree/Diploma in Medical Electronic Engg.'},
        {'postName': 'Community Health Officer (CHO - B.Sc Nursing HWC)', 'vacancies': '45 Posts (UR: 24, ST: 5, OBC: 12, EWS: 4)', 'qualification': 'B.Sc Nursing with integrated Mid-Level Health Provider (MLHP) course (Batch 2019-20 onward only) + Enrolled with Goa Nursing Council + MS Office.'},
        {'postName': 'Palliative Nurse (NPPC)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'B.Sc Nursing / Diploma in Nursing + Goa Nursing Council registration + At least 2 years hospital experience.'},
        {'postName': 'Lactation Counsellor (Nurse)', 'vacancies': '3 Posts (UR: 3)', 'qualification': 'B.Sc Nursing / Diploma in Basic Nursing + Goa Nursing Council registration.'},
        {'postName': 'Staff Nurse (NUHM / NHM / DEIC)', 'vacancies': '4 Posts (UR: 3, OBC: 1)', 'qualification': 'B.Sc Nursing / Diploma in Basic Nursing (GNM) recognized by Nursing Council.'},
        {'postName': 'District Data Manager (IDSP)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'Post Graduate in Computer Science (M.Sc CS / MCA) OR B.E in IT / Electronics / Computer Science.'},
        {'postName': 'Instructor for Hearing Impaired Children (NPPCD)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'SSC / HSC (10th/12th) + Indian Sign Language (ISL) C Certificate OR DISLIC (Diploma in Sign Language Interpreter Course).'},
        {'postName': 'Audiometric Assistant (NPPCD)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'HSSC (12th Pass) + One-year Diploma in Audiology.'},
        {'postName': 'District PPM Coordinator (NTEP)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'Post Graduate degree + 1 year experience in health projects / communication / ACSM + Permanent two-wheeler driving license.'},
        {'postName': 'Demographer (PC-PNDT)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'B.Com with Statistics as a subject + Diploma / 6-month certificate course in Computers.'},
        {'postName': 'Secretarial Assistant (PM)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'Graduate in Computer Application (BCA / B.Sc CS) with MS Office + 1 year MIS & file record keeping experience + Knowledge of Konkani.'},
        {'postName': 'Technical Supervisor (HR Flexipool)', 'vacancies': '1 Post (UR: 1)', 'qualification': 'Graduate with Diploma or Certificate course in Medical Laboratory Technology (DMLT) + 2 years medical lab experience.'},
        {'postName': 'Senior Treatment Supervisor (NTEP)', 'vacancies': '3 Posts (UR: 3)', 'qualification': 'Bachelor\'s Degree OR Sanitary Inspector\'s course + 2-month computer certificate + Permanent two-wheeler driving license.'},
        {'postName': 'Pharmacist (NUHM & AYUSH / RBSK)', 'vacancies': '9 Posts (UR: 6, OBC: 2, ST: 1)', 'qualification': 'B.Pharm / D.Pharm + Valid registration with Goa State Pharmacy Council.'},
        {'postName': 'Dental Technician (DEIC)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'Class 12th Pass + Successful completion of Dental Technician Course.'},
        {'postName': 'Dental Assistant (Dental Cell - Part-time)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'Class 12th Pass + Dental clinic/hospital/lab work experience.'},
        {'postName': 'IEC Supervisor (IEC)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'Graduate in Science (B.Sc) + Diploma / 5-month certificate course in Computer Application.'},
        {'postName': 'Counsellor (RMNCHAN)', 'vacancies': '9 Posts (UR: 6, OBC: 2, ST: 1)', 'qualification': 'Bachelor\'s (or equivalent) Degree in Social Work (BSW) / Sociology / Psychology + MS Office skills.'},
        {'postName': 'ANM (NUHM & RBSK)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'SSCE (10th) with 1.5 years Multipurpose Health Worker training OR 2 years Auxiliary Nurse Midwife (ANM) training.'},
        {'postName': 'TB Health Visitor (NTEP)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'Graduate in Science OR 10+2 in Science with MPW/LHV/ANM experience OR TB Health Visitor course + 2 months computer certificate.'},
        {'postName': 'Lady Health Visitor - LHV (HR)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'Served as an ANM with at least 5 years of verified experience.'},
        {'postName': 'Early Interventionist cum Special Educator (DEIC)', 'vacancies': '2 Posts (UR: 2)', 'qualification': 'B.Ed / D.Ed in Special Education (Mental Retardation / Locomotor) OR PG Diploma in Special Education recognized by RCI.'},
        {'postName': 'Support Staff (NUHM)', 'vacancies': '14 Posts (UR: 9, OBC: 3, EWS: 1, ST: 1)', 'qualification': 'Middle Pass or Class VIII (8th) Pass + Knowledge of Konkani.'}
    ],
    'eligibility': {
        'education': 'Post-specific qualifications range from Class 8th Pass (Support Staff), 10th/12th/ANM (ANM, Dental Tech, Audiometric Asst), Diploma/GNM/B.Sc Nursing (Staff Nurse, CHO, Palliative Nurse), B.Pharm/D.Pharm (Pharmacist), B.Com/B.Sc/BSW/BCA/BE/B.Tech (Supervisors, Data Mgr, Counsellor), to MBBS/BAMS/BHMS/MD (Medical Officers, Specialists).',
        'ageLimit': 'Between 18 and 40 years as of the application date. Age relaxation: SC/ST - 5 years, OBC - 3 years, PwBD/PH - 10 years.',
        'medicalStandards': 'Shortlisted candidates must be medically fit and produce original council registrations and certificates during document verification.'
    },
    'salary': {
        'payLevel': 'Monthly Consolidated Remuneration (1-Year Contract under NHM)',
        'initialPay': 'Rs. 10,000/- to Rs. 1,00,000/- per month based on designation',
        'allowances': 'Specialist Cardiologist: Rs. 1,00,000/- | Medical Officer: Rs. 65,000/- | Block Entomologist: Rs. 40,000/- | Audiologist/Psychologist/Consultant: Rs. 30,000/- | Special Educator: Rs. 25,000/- | VCCLM: Rs. 22,000 + Rs. 10,000 TA | CHO / Palliative Nurse: Rs. 20,000/- | Data Mgr: Rs. 18,000/- | LHV: Rs. 16,000/- | Staff Nurse/Lactation Counsellor/PPM Coord/Demographer/Secretarial Asst/Audiometric Asst: Rs. 15,000/- | Tech Supervisor: Rs. 14,000/- | STS: Rs. 12,000/- | Pharmacist/Counsellor/Dental Tech/IEC Supervisor: Rs. 11,000/- | ANM/TB Health Visitor/Support Staff: Rs. 10,000/- | Part-time Dental Asst: Rs. 8,000/-'
    },
    'applicationFee': [
        {'category': 'All Categories (General / OBC / EWS / SC / ST / PwBD / Female)', 'fee': 'NIL (No Application Fee / Free Online Form)'}
    ],
    'selectionProcess': [
        'Submission of online application through the official Google Application Form (https://forms.gle/F5rw7ULinXEjSUJZ9).',
        'Scrutiny and shortlisting of applications based on mandatory eligibility criteria, academic qualifications, and 15-year Goa domicile requirement.',
        'Document verification of original mark sheets, council registrations, residence certificate, category certificate, and experience proof.',
        'Personal Interview conducted by the Selection Committee at Directorate of Health Services, Panaji.',
        'Final merit listing and issuance of contractual appointment letters for 1 year under NHM Goa.'
    ],
    'howToApplySteps': [
        'Open the official Google Form application link: https://forms.gle/F5rw7ULinXEjSUJZ9.',
        'Select the exact Designation / Post you are applying for from the dropdown menu.',
        'Fill in your personal details, permanent address in Goa, contact email, and mobile number.',
        'Enter educational qualifications, marks percentage, council registration number (GMC / GNC / Pharmacy Council / RCI), and work experience details.',
        'Upload required documents such as 15 years Goa residence certificate, degree/diploma certificates, marksheets, and caste certificate.',
        'Verify all entered details carefully and submit the online application form before 18 September 2026.',
        'Retain a copy of the submitted application responses and carry original documents along with hard copies to the interview.'
    ],
    'documentsRequired': [
        'Printout of the submitted Online Application Form.',
        'Mandatory 15 Years\' Residence Certificate in Goa issued by Mamlatdar / Competent Authority.',
        'Proof of Date of Birth (Class 10th Certificate / Birth Certificate).',
        'All Educational Marksheets and Passing Certificates (8th / 10th / 12th / ITI / Diploma / Degree / PG / MBBS / MD).',
        'Valid Council Registration Certificate (Goa Medical Council / Goa Nursing Council / Goa State Pharmacy Council / RCI) where applicable.',
        'Experience Certificates from recognized hospitals / healthcare institutions.',
        'Caste Certificate (SC / ST / OBC) / EWS Certificate issued by Competent Authority of Goa (if applicable).',
        'Valid Two-Wheeler Driving License (for STS and PPM Coordinator posts).',
        'Recent passport-size color photographs and valid Govt Photo ID Proof (Aadhaar / Voter ID / Driving License).'
    ],
    'faqs': [
        {
            'question': 'What is the official advertisement number for NHM Goa Recruitment 2026?',
            'answer': 'The official notification advertisement number is DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537 dated 26 August 2026 issued by Directorate of Health Services, Panaji - Goa.'
        },
        {
            'question': 'How many total vacancies are announced in NHM Goa Recruitment 2026?',
            'answer': 'A total of 135 vacancies are available across 28 diverse designations including Community Health Officer (45), Medical Officer (8), Staff Nurse (4), Support Staff (14), Pharmacist (9), Counsellor (9), and various specialist/technical roles.'
        },
        {
            'question': 'What is the last date to apply online for NHM Goa vacancies 2026?',
            'answer': 'The last date for submitting the online application form via Google Forms is 18th September 2026.'
        },
        {
            'question': 'Is 15 years\' Goa residence certificate mandatory to apply for NHM Goa posts?',
            'answer': 'Yes, a 15-year residence certificate in Goa is mandatory for all applicants. Exemptions are granted only to children of Goa Govt employees serving outside the state, candidates married to a 15-year resident residing together for 5 years, and retired armed forces personnel residing in Goa for 2 years.'
        },
        {
            'question': 'Is knowledge of Konkani mandatory for NHM Goa recruitment?',
            'answer': 'Yes, knowledge of Konkani is essential for all posts. Knowledge of Marathi is considered desirable.'
        },
        {
            'question': 'What is the monthly salary / remuneration for CHO and Staff Nurse in NHM Goa?',
            'answer': 'Community Health Officers (CHO) receive a consolidated remuneration of Rs. 20,000/- per month, while Staff Nurses receive Rs. 15,000/- per month.'
        },
        {
            'question': 'What is the monthly remuneration for Specialist Cardiologist and Medical Officers?',
            'answer': 'Specialist Cardiologists receive Rs. 1,00,000/- per month, while Medical Officers receive Rs. 65,000/- per month.'
        },
        {
            'question': 'What is the application fee for NHM Goa Recruitment 2026?',
            'answer': 'There is NO application fee (NIL). Applying through the official Google Form is completely free for all candidates.'
        },
        {
            'question': 'What is the age limit for NHM Goa recruitment?',
            'answer': 'The age limit is 18 to 40 years as on the date of application. Upper age relaxation of 5 years for SC/ST, 3 years for OBC, and 10 years for PwBD/PH candidates is applicable.'
        },
        {
            'question': 'What is the educational qualification for Community Health Officer (CHO) in Goa?',
            'answer': 'Candidates must possess B.Sc. (Nursing) with integrated Mid-Level Health Provider (MLHP) course passed from batch 2019-20 onward only, and must be enrolled with the Goa Nursing Council at the time of interview, along with basic MS Office skills.'
        },
        {
            'question': 'What is the minimum qualification for Support Staff (NUHM)?',
            'answer': 'Candidates must have passed Middle School (Class 8th Pass) and possess knowledge of Konkani.'
        },
        {
            'question': 'Are these NHM Goa jobs permanent or contractual?',
            'answer': 'These positions are purely on a contract basis for a period of one (1) year under the National Health Mission (NHM). Selected candidates will have no claim for regular absorption in State Govt service.'
        },
        {
            'question': 'Where can I apply online for NHM Goa Recruitment 2026?',
            'answer': 'Candidates must fill out and submit the official Google Application Form at: https://forms.gle/F5rw7ULinXEjSUJZ9.'
        },
        {
            'question': 'Where can I download the official notification PDF for NHM Goa Recruitment?',
            'answer': 'The official notification PDF is available on the NHM Goa portal: https://nhm.goa.gov.in/wp-content/uploads/2026/08/Advertisement-26-08-2026-1537-2026-27-1.pdf.'
        },
        {
            'question': 'What is the contact email and phone number for NHM Goa Directorate of Health Services?',
            'answer': 'Candidates can contact NHM Goa via email at nhm-dhs.goa@gov.in or by phone at 70301 45821.'
        }
    ],
    'urls': [
        {
            'title': 'Download NHM Goa Recruitment 2026 Official Notification PDF',
            'url': 'https://nhm.goa.gov.in/wp-content/uploads/2026/08/Advertisement-26-08-2026-1537-2026-27-1.pdf'
        },
        {
            'title': 'Apply Online via Official NHM Goa Google Form (forms.gle/F5rw7ULinXEjSUJZ9)',
            'url': 'https://forms.gle/F5rw7ULinXEjSUJZ9'
        },
        {
            'title': 'National Health Mission (NHM) Goa Official Portal',
            'url': 'https://nhm.goa.gov.in/'
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
    'b': 'National Health Mission (NHM), Directorate of Health Services, Panaji, Goa',
    't': 'NHM Goa Recruitment 2026 – Apply Online for 135 CHO, Medical Officer, Staff Nurse, Pharmacist & More Posts',
    'd': '26 August 2026',
    'l': '18 September 2026',
    'a': 'DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537',
    'q': '8th / 10th / 12th / GNM / B.Sc Nursing / DMLT / B.Pharm / B.Com / B.Sc / MCA / MBBS / MD',
    'desc': 'National Health Mission (NHM), Directorate of Health Services, Panaji, Goa has officially released employment advertisement notification DHS/NHM-ADM/29/Staff-Recruitment/2026-27/1537 for the recruitment of 135 vacancies for CHO, Medical Officer, Staff Nurse, Pharmacist, Support Staff and various posts.',
    'u': 'https://nhm.goa.gov.in/wp-content/uploads/2026/08/Advertisement-26-08-2026-1537-2026-27-1.pdf'
}

entry_str = json.dumps(new_summary, indent=4, ensure_ascii=False)

if re.search(pattern, jobs_text):
    jobs_text = re.sub(pattern, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Updated {job_id} in jobsData.ts')
else:
    print(f'[ERROR] Could not find {job_id} in jobsData.ts')

