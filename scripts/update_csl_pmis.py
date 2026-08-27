import json
import os
import re

details_file = 'src/data/jobDetails.json'
jobs_file = 'src/data/jobsData.ts'
dates_file = 'src/data/jobUploadDates.json'

old_id = 'istc-age-limit-recruitment-2026'
new_id = 'cochin-shipyard-pmis-internship-recruitment-2026'

with open(details_file, 'r', encoding='utf-8') as f:
    details = json.load(f)

# Delete old garbled key if present
if old_id in details:
    del details[old_id]

job = {
    'id': new_id,
    'seoTitle': 'Cochin Shipyard PMIS Internship 2026 (227 Seats) Apply Online | NewVacancyAlert',
    'seoDescription': 'Cochin Shipyard Limited (CSL) PMIS Internship Scheme 2026 notification for 227 seats. Check trade-wise ITI, SSLC, HSE, Diploma, Degree posts, Rs. 11000 - 13000 stipend & apply online at pminternship.mca.gov.in.',
    'focusKeywords': 'Cochin Shipyard PMIS Internship 2026, CSL PM Internship Scheme 2026, Cochin Shipyard 227 Interns Notification, pminternship.mca.gov.in apply online',
    'lsiKeywords': 'Cochin Shipyard ITI Diploma Intern Stipend, PMIS Scheme Eligibility Criteria 18-25 Years, CSL PMIS Selection Process, Cochin Shipyard Careers Apprenticeship 2026',
    'title': 'Cochin Shipyard Limited (CSL) PMIS Internship Scheme 2026 – Apply Online for 227 ITI, SSLC, Diploma & Graduate Intern Seats',
    'board': 'Cochin Shipyard Limited (CSL), A Government of India Enterprise (Ministry of Ports, Shipping & Waterways)',
    'advtNo': 'CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45, Dated 26 August 2026',
    'vacancies': 227,
    'jobLocation': 'Kochi / Cochin (Kerala)',
    'applicationMode': 'Online via PMIS Portal (pminternship.mca.gov.in/login/)',
    'applicationStatus': 'Active - Register Online on PMIS Portal',
    'lastUpdated': '2026-08-27',
    'overview': [
        'Cochin Shipyard Limited (CSL), a listed premier Miniratna Schedule \'A\' Central Public Sector Enterprise under the Ministry of Ports, Shipping and Waterways, Government of India, has officially released notification CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45 dated 26 August 2026 for the engagement of 227 interns under the Prime Minister\'s Internship Scheme (PMIS).',
        'The internship training is offered for a duration of Nine (9) months across multiple educational streams: ITI Trades (92 seats), SSLC Trades (80 seats), HSE/ITI (27 seats), Diploma in Engineering/Allied disciplines (16 seats), General Graduation (11 seats), and Post Graduation (1 seat). Selected interns receive monthly stipends ranging from Rs. 11,000/- to Rs. 13,000/- per month, inclusive of Direct Benefit Transfer (DBT) by the Government of India.',
        'Eligible candidates aged 18 to 25 years who meet the prescribed educational qualifications and family income eligibility criteria must submit their applications online through the official PMIS Portal (pminternship.mca.gov.in).'
    ],
    'highlights': [
        {'label': 'Recruiting Organization', 'value': 'Cochin Shipyard Limited (CSL)'},
        {'label': 'Enterprise Category', 'value': 'Miniratna Schedule \'A\' CPSE (Ministry of Ports, Shipping & Waterways)'},
        {'label': 'Scheme Name', 'value': 'Prime Minister\'s Internship Scheme (PMIS)'},
        {'label': 'Notification No.', 'value': 'CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45 dated 26.08.2026'},
        {'label': 'Total Seats', 'value': '227 Internship Seats (ITI: 92, SSLC: 80, HSE: 27, Diploma: 16, Graduate: 11, PG: 1)'},
        {'label': 'Training Duration', 'value': 'Nine (9) Months'},
        {'label': 'Monthly Stipend', 'value': 'Rs. 11,000/- (SSLC/ITI/HSE) | Rs. 13,000/- (Diploma/Degree/PG) per month (including DBT)'},
        {'label': 'Educational Qualification', 'value': '10th Pass / ITI (NTC) / 12th (HSE) / Diploma in Engg/Allied / Any Graduate (Non-B.Tech) / MA Hindi'},
        {'label': 'Age Limit', 'value': '18 to 25 Years as per PMIS guidelines'},
        {'label': 'Application Fee', 'value': 'NIL (No Application or Processing Fee)'},
        {'label': 'Selection Process', 'value': 'Merit-based Shortlisting on Academic Marks + Certificate Verification + Medical Fitness'},
        {'label': 'Job / Training Location', 'value': 'Kochi / Cochin, Kerala'},
        {'label': 'Application Mode', 'value': 'Online via PMIS Portal (pminternship.mca.gov.in)'},
        {'label': 'Official PMIS Portal', 'value': 'https://pminternship.mca.gov.in/login/'},
        {'label': 'CSL Official Website', 'value': 'https://cochinshipyard.in'}
    ],
    'importantDates': [
        {'event': 'Official Notification Release Date', 'date': '26 August 2026'},
        {'event': 'Online Registration on PMIS Portal', 'date': 'Active / Open on PMIS Portal'},
        {'event': 'Application Submission Deadline', 'date': 'As posted on PMIS Portal (Apply Early)'},
        {'event': 'Issue of Offer of Internship on PMIS Portal', 'date': 'To be notified on PMIS portal'},
        {'event': 'Certificate Verification and Medical Fitness', 'date': 'To be notified in offer letter'}
    ],
    'vacanciesDetails': [
        {'postName': 'ITI Trades (Electrician, Fitter, Welder, Machinist, Draughtsman, Sheet Metal, Diesel Mech, RAC, Marine Fitter & More)', 'vacancies': '92 Seats', 'qualification': 'Pass in 10th Standard + ITI (National Trade Certificate - NTC) in relevant trade'},
        {'postName': 'SSLC Streams (Grinder Intern: 20, Painter Intern: 30, Scaffolder Intern: 30)', 'vacancies': '80 Seats', 'qualification': 'Pass in 10th / SSLC Standard'},
        {'postName': 'HSE / ITI Streams (Intern Warehouse Assistant)', 'vacancies': '27 Seats', 'qualification': 'Pass in 12th Standard (HSE) / ITI (National Trade Certificate)'},
        {'postName': 'Diploma Streams (Civil: 2, Electrical: 2, Electronics: 2, Instrumentation: 2, Mechanical: 2, Catering: 2, Pharmacy: 2, Nursing: 2)', 'vacancies': '16 Seats', 'qualification': 'Diploma in Engineering (Civil/Elect/Mech/ECE/Inst) OR Diploma in Catering/Hotel Mgmt, Pharmacy, Nursing'},
        {'postName': 'Graduation Streams (Clerical Intern)', 'vacancies': '11 Seats', 'qualification': 'Graduation in any discipline (BA / B.Sc / B.Com / BBA / BCA etc. - other than performing arts/B.Tech)'},
        {'postName': 'Post Graduation Streams (Intern Hindi)', 'vacancies': '1 Seat', 'qualification': 'MA Hindi / MA Hindi with Translation'}
    ],
    'eligibility': {
        'education': 'Trade/Discipline specific: (1) ITI Trades: 10th + ITI (NTC) in relevant trade; (2) SSLC: 10th/SSLC pass; (3) HSE/ITI: 12th/HSE or ITI (NTC); (4) Diploma: Diploma in Engineering (Civil/Mech/EEE/ECE/Inst) or Diploma in Catering/Hotel Mgmt, Pharmacy, Nursing; (5) Graduation: BA/BSc/BCom/BBA/BCA (non-B.Tech/non-performing arts); (6) Post Graduation: MA Hindi / MA Hindi with Translation.',
        'ageLimit': '18 to 25 years as per PMIS guidelines.',
        'medicalStandards': 'Provisionally shortlisted candidates must undergo and clear medical fitness examination prior to induction into training.'
    },
    'salary': {
        'payLevel': 'Monthly Internship Stipend (under PMIS Scheme)',
        'initialPay': 'Rs. 11,000/- per month (for SSLC, ITI, HSE Interns) | Rs. 13,000/- per month (for Diploma, Graduate, PG Interns)',
        'allowances': 'Includes Direct Benefit Transfer (DBT) component paid by the Government of India. Note: Boarding/lodging or travel expenses are not provided by CSL.'
    },
    'applicationFee': [
        {'category': 'All Categories (General / OBC / EWS / SC / ST / PwBD / Female)', 'fee': 'NIL (No Application Fee / Free Registration on PMIS Portal)'}
    ],
    'selectionProcess': [
        'Registration and submission of online application on the official PMIS Portal (pminternship.mca.gov.in).',
        'Shortlisting of candidates based strictly on the percentage of marks secured in the prescribed qualification for the respective trade/discipline.',
        'Tie-breaking: In case of equal percentage of marks between two or more candidates, relative merit will be decided based on seniority in age.',
        'Issuance of Offer of Internship Training to shortlisted candidates through the PMIS portal.',
        'Document Verification of original certificates (Age proof, educational qualifications, caste certificate, disability certificate) + self-attested copies at CSL.',
        'Medical fitness examination and final induction for 9 months internship training.'
    ],
    'howToApplySteps': [
        'Visit the official Prime Minister\'s Internship Scheme (PMIS) Portal at https://pminternship.mca.gov.in/login/.',
        'Read the Candidate User Manual available under Manuals > Candidate User Manual on the portal.',
        'Complete registration by creating an account on the PMIS portal with your Aadhaar, mobile number, and email ID.',
        'Fill in personal details, educational qualifications, marks obtained, and upload required documents.',
        'Search and select Internship opportunities at Cochin Shipyard Limited (CSL) matching your qualification.',
        'Submit the application before the deadline. There is NO application fee.',
        'Check the PMIS portal regularly for shortlist status and offer letter updates.'
    ],
    'documentsRequired': [
        'Printout of PMIS Online Application and Offer Letter.',
        'Class 10th (Matriculation / SSLC) Certificate / Marksheet as proof of Date of Birth.',
        'Mark sheets and Passing Certificates of all semesters/years of the prescribed qualification (10th / 12th / ITI NTC / Diploma / Degree / MA).',
        'Equivalency Certificate (if possessing equivalent qualification from competent authority).',
        'Valid Caste / Category Certificate (SC / ST / OBC-NCL / EWS) issued by competent authority (if applicable).',
        'Disability Certificate (PwBD) issued by Competent Medical Authority (if applicable).',
        'Recent passport-size color photographs and valid Govt Photo ID Proof (Aadhaar / Voter ID / PAN / Passport).'
    ],
    'faqs': [
        {
            'question': 'What is the official advertisement number for Cochin Shipyard PMIS Internship 2026?',
            'answer': 'The official notification advertisement number is CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45 dated 26 August 2026.'
        },
        {
            'question': 'How many total internship seats are available in Cochin Shipyard under PMIS 2026?',
            'answer': 'A total of 227 internship seats are available: ITI Trades (92 seats), SSLC (80 seats), HSE/ITI (27 seats), Diploma (16 seats), General Graduation (11 seats), and Post Graduation (1 seat).'
        },
        {
            'question': 'What is the duration of the internship training in CSL?',
            'answer': 'The internship training is for a fixed period of Nine (9) months under the Prime Minister\'s Internship Scheme (PMIS).'
        },
        {
            'question': 'What is the monthly stipend offered to CSL PMIS interns?',
            'answer': 'Interns in SSLC, ITI, and HSE disciplines receive Rs. 11,000/- per month, while Diploma, Graduate, and PG interns receive Rs. 13,000/- per month, inclusive of Direct Benefit Transfer (DBT) by the Government of India.'
        },
        {
            'question': 'What is the age limit for Cochin Shipyard PMIS Internship 2026?',
            'answer': 'Candidates must be between 18 and 25 years of age to apply under the Prime Minister\'s Internship Scheme.'
        },
        {
            'question': 'What is the application fee for CSL PMIS Internship 2026?',
            'answer': 'There is NO application fee (NIL). Applying through the PMIS portal is completely free for all candidates.'
        },
        {
            'question': 'How will candidates be selected for the CSL PMIS internship?',
            'answer': 'Selection is strictly based on the percentage of marks obtained in the prescribed qualification. In case of a tie in marks, relative merit is decided based on seniority in age, followed by certificate verification and medical fitness.'
        },
        {
            'question': 'Who is NOT eligible (Ineligibility Criteria) to apply for PMIS at CSL?',
            'answer': 'Graduates from IITs/IIMs/NLUs/IISER/IIITs/IISc; holders of CA/CMA/CS/MBBS/BDS/MD/MS/MBA/MPhil/PhD; candidates who have already completed NATS/NAPS apprenticeship; candidates currently in govt training; candidates whose family annual income exceeds Rs. 12 Lakhs; or candidates whose family member is a permanent/regular govt employee are NOT eligible.'
        },
        {
            'question': 'Can B.Tech / Engineering Degree holders apply for the Graduate Clerical intern posts?',
            'answer': 'No, the Graduate Clerical intern seats are open for non-B.Tech and non-performing arts graduates (e.g. BA, B.Sc, B.Com, BBA, BCA).'
        },
        {
            'question': 'Are candidates with ITI NTC certificates eligible for ITI trades?',
            'answer': 'Yes, candidates who have passed 10th standard and possess a National Trade Certificate (NTC) in the relevant ITI trade (Fitter, Electrician, Welder, Machinist, Draughtsman, Diesel Mech, etc.) are eligible.'
        },
        {
            'question': 'Does completion of this internship guarantee employment in Cochin Shipyard?',
            'answer': 'No, upon completion of the 9-month internship training, CSL has no obligation to offer regular employment, nor can interns claim any right for appointment on the grounds of internship completion.'
        },
        {
            'question': 'Is boarding or lodging provided by Cochin Shipyard during the internship?',
            'answer': 'No, boarding and lodging are not provided by CSL during the internship period. Interns must make their own living arrangements in Kochi.'
        },
        {
            'question': 'Where and how do I submit the online application for CSL PMIS Internship?',
            'answer': 'Candidates must apply online through the official Prime Minister Internship Scheme Portal at https://pminternship.mca.gov.in/login/ and select Cochin Shipyard Limited opportunities.'
        },
        {
            'question': 'Will offer letters be sent by post?',
            'answer': 'No, offers of internship training will NOT be sent by post. Shortlisted candidates will receive notifications and offer letters directly through the PMIS portal.'
        },
        {
            'question': 'What is the official contact email for queries related to CSL Apprenticeship / PMIS?',
            'answer': 'For queries regarding CSL internship, candidates can email apprenticeship@cochinshipyard.in. For technical issues with the PMIS portal, use the Support section on pminternship.mca.gov.in.'
        },
        {
            'question': 'Where can I download the official notification PDF for CSL PMIS Internship 2026?',
            'answer': 'The official notification PDF can be downloaded directly from Cochin Shipyard website: https://cochinshipyard.in/uploads/career/cd5346e2da18d06f6905eb292e8ce195.pdf.'
        }
    ],
    'urls': [
        {
            'title': 'Download Cochin Shipyard (CSL) PMIS Internship 2026 Official Notification PDF',
            'url': 'https://cochinshipyard.in/uploads/career/cd5346e2da18d06f6905eb292e8ce195.pdf'
        },
        {
            'title': 'Prime Minister Internship Scheme (PMIS) Official Application Portal',
            'url': 'https://pminternship.mca.gov.in/login/'
        },
        {
            'title': 'Cochin Shipyard Limited (CSL) Official Careers Portal',
            'url': 'https://cochinshipyard.in'
        }
    ]
}

details[new_id] = job
with open(details_file, 'w', encoding='utf-8') as f:
    json.dump(details, f, indent=2, ensure_ascii=False)

print(f'[SUCCESS] Saved {new_id} to jobDetails.json')

# Update jobsData.ts
with open(jobs_file, 'r', encoding='utf-8') as f:
    jobs_text = f.read()

pattern_old = r'\{\s*\"id\":\s*\"' + old_id + r'\"[\s\S]*?\}(?:,\s*)?'
pattern_new = r'\{\s*\"id\":\s*\"' + new_id + r'\"[\s\S]*?\}(?:,\s*)?'

new_summary = {
    'id': new_id,
    'b': 'Cochin Shipyard Limited (CSL)',
    't': 'Cochin Shipyard Limited (CSL) PMIS Internship Scheme 2026 – Apply Online for 227 ITI, SSLC, Diploma & Graduate Intern Seats',
    'd': '26 August 2026',
    'l': 'Apply on PMIS Portal',
    'a': 'CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45',
    'q': '10th / ITI (NTC) / 12th (HSE) / Diploma in Engg / Any Graduate (Non-B.Tech) / MA',
    'desc': 'Cochin Shipyard Limited (CSL) has officially released employment advertisement notification CSL/P&A/HRM/HRM GENERAL/PM_INTERNSHIP_SCHEME/2024/45 for the engagement of 227 interns under the Prime Minister\'s Internship Scheme (PMIS).',
    'u': 'https://cochinshipyard.in/uploads/career/cd5346e2da18d06f6905eb292e8ce195.pdf'
}

entry_str = json.dumps(new_summary, indent=4, ensure_ascii=False)

if re.search(pattern_old, jobs_text):
    jobs_text = re.sub(pattern_old, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Replaced {old_id} with {new_id} in jobsData.ts')
elif re.search(pattern_new, jobs_text):
    jobs_text = re.sub(pattern_new, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Updated {new_id} in jobsData.ts')
else:
    marker = 'export const JOBS_DATA: JobEntry[] = ['
    jobs_text = jobs_text.replace(marker, f'{marker}\n  {entry_str},')
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Inserted {new_id} into jobsData.ts')

# Update jobUploadDates.json
if os.path.exists(dates_file):
    with open(dates_file, 'r', encoding='utf-8') as f:
        upload_dates = json.load(f)
    if old_id in upload_dates:
        del upload_dates[old_id]
    upload_dates[new_id] = '2026-08-27'
    with open(dates_file, 'w', encoding='utf-8') as f:
        json.dump(upload_dates, f, indent=2, ensure_ascii=False)
    print('[SUCCESS] Updated jobUploadDates.json')
