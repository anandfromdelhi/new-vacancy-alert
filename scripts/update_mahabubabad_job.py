import json
import os
import re

details_file = 'src/data/jobDetails.json'
jobs_file = 'src/data/jobsData.ts'

job_id = 'wdcw-mahabubabad-district-icds-anganwadi-teacher-awt-anganwad-recruitment-2026'

with open(details_file, 'r', encoding='utf-8') as f:
    details = json.load(f)

job = {
    'id': job_id,
    'seoTitle': 'WDCW Mahabubabad Anganwadi Recruitment 2026 (231 Posts) Apply Online | NewVacancyAlert',
    'seoDescription': 'Telangana WDCW Mahabubabad District ICDS Anganwadi Recruitment 2026 notification for 231 posts (101 Teachers & 130 Helpers). Check project-wise vacancy in Dornakal, Gudur, Mahabubabad, Maripeda & Thorrur. Apply online at wdcw.tg.nic.in by 03.09.2026.',
    'focusKeywords': 'WDCW Mahabubabad Anganwadi Recruitment 2026, Telangana Anganwadi Teacher Vacancy 2026, Mahabubabad ICDS Anganwadi Helper 231 Posts, wdcw.tg.nic.in apply online',
    'lsiKeywords': 'Telangana WDCW Anganwadi Notification 2026, Mahabubabad AWT AWH Online Application, Dornakal Gudur Thorrur Maripeda ICDS Vacancies, Telangana Govt Jobs 2026',
    'title': 'Telangana WDCW Mahabubabad District (ICDS) Recruitment 2026 – Apply Online for 231 Anganwadi Teacher & Helper Posts',
    'board': 'Department of Women Development & Child Welfare (WDCW), Mahabubabad District, Government of Telangana',
    'advtNo': 'A2/ICDS/137-1/2026 to A2/ICDS/137-5/2026 (DIPR R.O.No. 8548-PP/CL/ADVT/2026-27 dated 24-08-2026)',
    'vacancies': 231,
    'jobLocation': 'Mahabubabad District (Telangana)',
    'applicationMode': 'Online (via Official Portal: https://wdcw.tg.nic.in)',
    'applicationStatus': 'Active - Apply Online before 03 September 2026 (5:00 PM)',
    'lastUpdated': '2026-08-27',
    'overview': [
        'Government of Telangana, Department of Women, Children, Disabled and Senior Citizens (WDCW), Mahabubabad District has officially issued employment advertisement notifications (Ref Nos. A2/ICDS/137-1/2026, A2/ICDS/137-2/2026, A2/ICDS/137-3/2026, A2/ICDS/137-4/2026, and A2/ICDS/137-5/2026 dated 24.08.2026 / DIPR R.O.No. 8548-PP/CL/ADVT/2026-27) for the recruitment of 231 Anganwadi vacancies.',
        'The vacancies are available across five (5) ICDS projects in Mahabubabad District: Dornakal (51 posts), Gudur (69 posts), Mahabubabad (69 posts), Maripeda (13 posts), and Thorrur (29 posts). Positions include 101 Anganwadi Teachers (AWT) and 130 Anganwadi Helpers / Aayas (AWH).',
        'Eligible local resident women candidates who have passed Intermediate (10+2) or SSC (10th) aged between 18 and 35 years as on 01/07/2026 can apply online through the official portal https://wdcw.tg.nic.in from 25th August 2026 until 3rd September 2026 (05:00 PM). Physical document verification will take place at respective ICDS project offices from 7th September to 19th September 2026.'
    ],
    'highlights': [
        {'label': 'Recruiting Department', 'value': 'Department of Women, Children, Disabled & Senior Citizens (WDCW), Telangana'},
        {'label': 'District & Authority', 'value': 'District Collector & Chairperson / District Welfare Officer, Mahabubabad District'},
        {'label': 'Scheme / Project', 'value': 'Integrated Child Development Services (ICDS)'},
        {'label': 'Notification Numbers', 'value': 'A2/ICDS/137-1/2026 to A2/ICDS/137-5/2026 dated 24.08.2026'},
        {'label': 'DIPR Reference', 'value': 'DIPR R.O.No. 8548-PP/CL/ADVT/2026-27 dated 24-08-2026'},
        {'label': 'Total Vacancies', 'value': '231 Vacancies (101 Anganwadi Teachers + 130 Anganwadi Helpers)'},
        {'label': 'Project Breakdown', 'value': 'Dornakal: 51 | Gudur: 69 | Mahabubabad: 69 | Maripeda: 13 | Thorrur: 29'},
        {'label': 'Target Applicants', 'value': 'Only Local Resident Women Candidates of the respective Habitation / Village / Ward'},
        {'label': 'Educational Qualification', 'value': 'Intermediate (10+2 / 12th Pass) for AWT | Intermediate or SSC (10th Pass) for AWH'},
        {'label': 'Age Limit', 'value': '18 to 35 Years as on 01/07/2026'},
        {'label': 'Application Fee', 'value': 'NIL (No Application Fee / Free Online Registration)'},
        {'label': 'Online Application Dates', 'value': '25 August 2026 to 03 September 2026 (5:00 PM)'},
        {'label': 'Document Verification Dates', 'value': '07 September 2026 to 19 September 2026 at concerned ICDS Project Office'},
        {'label': 'Selection Process', 'value': 'Online Application + Local Domicile Scrutiny + Certificate Verification + Merit'},
        {'label': 'Official Application Portal', 'value': 'https://wdcw.tg.nic.in'}
    ],
    'importantDates': [
        {'event': 'Official Notification Release Date', 'date': '24 August 2026'},
        {'event': 'Online Application Submission Starts', 'date': '25 August 2026'},
        {'event': 'Last Date for Online Application Submission', 'date': '03 September 2026 (up to 5:00 PM)'},
        {'event': 'Physical Verification of Original Certificates at ICDS Offices', 'date': '07 September 2026 to 19 September 2026 (Office Working Hours)'},
        {'event': 'Final Selection & Posting Orders', 'date': 'To be notified on wdcw.tg.nic.in'}
    ],
    'vacanciesDetails': [
        {
            'postName': 'Dornakal ICDS Project (Notif No. A2/ICDS/137-1/2026)',
            'vacancies': '51 Posts (Anganwadi Teachers: 16, Anganwadi Helpers: 35)',
            'qualification': 'Intermediate (10+2) Pass for Teacher; Intermediate or SSC (10th) Pass for Helper. Must be a local resident woman of the concerned Anganwadi center village/ward.'
        },
        {
            'postName': 'Gudur ICDS Project (Notif No. A2/ICDS/137-2/2026)',
            'vacancies': '69 Posts (Anganwadi Teachers: 15, Anganwadi Helpers: 54)',
            'qualification': 'Intermediate (10+2) Pass for Teacher; Intermediate or SSC (10th) Pass for Helper. Must be a local resident woman of the concerned Anganwadi center village/ward.'
        },
        {
            'postName': 'Mahabubabad ICDS Project (Notif No. A2/ICDS/137-3/2026)',
            'vacancies': '69 Posts (Anganwadi Teachers: 28, Anganwadi Helpers: 41)',
            'qualification': 'Intermediate (10+2) Pass for Teacher; Intermediate or SSC (10th) Pass for Helper. Must be a local resident woman of the concerned Anganwadi center village/ward.'
        },
        {
            'postName': 'Maripeda ICDS Project (Notif No. A2/ICDS/137-4/2026)',
            'vacancies': '13 Posts (Anganwadi Teachers: 13)',
            'qualification': 'Intermediate (10+2) Pass for Teacher. Must be a local resident woman of the concerned Anganwadi center village/ward.'
        },
        {
            'postName': 'Thorrur ICDS Project (Notif No. A2/ICDS/137-5/2026)',
            'vacancies': '29 Posts (Anganwadi Teachers: 29)',
            'qualification': 'Intermediate (10+2) Pass for Teacher. Must be a local resident woman of the concerned Anganwadi center village/ward.'
        }
    ],
    'eligibility': {
        'education': 'Anganwadi Teacher (AWT): Must have passed Intermediate (10+2 / 12th Standard). Anganwadi Helper (AWH / Aya): Must have passed Intermediate (10+2). In case candidates with Intermediate are not available for Helper posts, candidates who passed Class 10th (SSC) will be considered. Applicant must be a local married woman resident of the concerned village / Gram Panchayat / ward.',
        'ageLimit': '18 to 35 years as on 01/07/2026 (Candidate must be born between 02/07/1991 and 01/07/2008).',
        'medicalStandards': 'Women with hearing impairment (using hearing aid), mild visual impairment (manageable without escort), and loco-motor disabilities of limbs who can take care of young children and teach pre-school education are also eligible to apply.'
    },
    'salary': {
        'payLevel': 'Monthly Honorarium / Remuneration (as per Telangana State Government & ICDS Norms)',
        'initialPay': 'Anganwadi Teacher: Approx. Rs. 13,650/- per month | Anganwadi Helper: Approx. Rs. 7,800/- per month',
        'allowances': 'Honorarium paid monthly under Integrated Child Development Services (ICDS) scheme.'
    },
    'applicationFee': [
        {'category': 'All Candidates (Local Women Applicants)', 'fee': 'NIL (No Application Fee / Free Online Registration)'}
    ],
    'selectionProcess': [
        'Online registration and application submission on the official portal https://wdcw.tg.nic.in by 03.09.2026 (5:00 PM).',
        'Scrutiny of applications for local domicile / residence certificate issued by the concerned Tahsildar (issued within 1 year).',
        'Physical Document Verification from 07.09.2026 to 19.09.2026 at the respective ICDS Project Office with original certificates and two (2) sets of attested Xerox copies.',
        'Preparation of final merit and roster point reservation list approved by the District Collector & District Welfare Officer, Mahabubabad.',
        'Issuance of appointment orders for selected Anganwadi Teachers and Helpers.'
    ],
    'howToApplySteps': [
        'Visit the official website of Women Development and Child Welfare Department, Telangana at https://wdcw.tg.nic.in.',
        'Click on the link for "Mahabubabad District Anganwadi Recruitment 2026 (ICDS Projects: Dornakal, Gudur, Mahabubabad, Maripeda, Thorrur)".',
        'Select the ICDS Project and the specific Anganwadi Center / Post (Teacher or Helper) applicable to your village/ward.',
        'Fill in personal details, Aadhaar number, educational qualifications (Intermediate / SSC marks), date of birth, and social category.',
        'Upload scanned copies of required documents (SSC certificate, Caste certificate, Intermediate marks memo, Residence certificate from Tahsildar, SADAREM/Widow certificate if applicable).',
        'Submit the online application before 03.09.2026 (5:00 PM) and print the submitted application form.',
        'Attend physical verification with original certificates and 2 sets of attested photocopies at the concerned ICDS Project Office between 07.09.2026 and 19.09.2026 during working hours.'
    ],
    'documentsRequired': [
        'Printout of the online submitted Application Form.',
        'SSC / 10th Class Marks Memo / Certificate as Proof of Date of Birth.',
        'Intermediate (10+2) Marks Memo and Passing Certificate.',
        'Residence / Nativity Certificate (నివాస ధృవీకరణ పత్రము) issued by concerned Tahsildar within the last one year.',
        'Integrated Community / Caste Certificate (SC / ST / BC) issued by Tahsildar.',
        'SADAREM Disability Certificate issued by Medical Board (for PwD candidates, if applicable).',
        'Death Certificate of Husband (for Widow candidates, if applicable).',
        'Orphan Certificate (for Orphan applicants, if applicable).',
        'Sports Certificate / Ex-Serviceman Certificate / EWS Certificate (if applicable).',
        'Two (2) sets of self-attested/gazetted attested photocopies of all certificates.'
    ],
    'faqs': [
        {
            'question': 'What are the official notification numbers for Mahabubabad Anganwadi Recruitment 2026?',
            'answer': 'The official notification numbers are A2/ICDS/137-1/2026 (Dornakal), A2/ICDS/137-2/2026 (Gudur), A2/ICDS/137-3/2026 (Mahabubabad), A2/ICDS/137-4/2026 (Maripeda), and A2/ICDS/137-5/2026 (Thorrur) dated 24.08.2026 (DIPR R.O.No. 8548-PP/CL/ADVT/2026-27).'
        },
        {
            'question': 'How many total Anganwadi posts are available in Mahabubabad District?',
            'answer': 'A total of 231 posts are available, comprising 101 Anganwadi Teachers (AWT) and 130 Anganwadi Helpers (AWH) across 5 ICDS Projects.'
        },
        {
            'question': 'What is the project-wise vacancy breakdown in Mahabubabad District?',
            'answer': 'Dornakal: 51 posts (16 Teachers, 35 Helpers); Gudur: 69 posts (15 Teachers, 54 Helpers); Mahabubabad: 69 posts (28 Teachers, 41 Helpers); Maripeda: 13 posts (13 Teachers); Thorrur: 29 posts (29 Teachers).'
        },
        {
            'question': 'What is the educational qualification for Anganwadi Teacher (AWT)?',
            'answer': 'Candidates must have passed Intermediate (10+2 / 12th standard) from a recognized Board.'
        },
        {
            'question': 'What is the qualification required for Anganwadi Helper (AWH)?',
            'answer': 'Intermediate (10+2) is preferred. If Intermediate candidates are not available in that village/habitation, Class 10th (SSC) passed candidates will be considered.'
        },
        {
            'question': 'What is the age limit for Mahabubabad Anganwadi recruitment 2026?',
            'answer': 'Candidates must be between 18 and 35 years of age as on 01/07/2026 (born between 02/07/1991 and 01/07/2008).'
        },
        {
            'question': 'Can candidates from other districts or villages apply?',
            'answer': 'No, only local resident married women belonging to the specific village / Gram Panchayat / ward / habitation of the Anganwadi center with a valid Tahsildar residence certificate are eligible.'
        },
        {
            'question': 'What is the last date to apply online for Mahabubabad Anganwadi jobs?',
            'answer': 'The last date to submit online applications on wdcw.tg.nic.in is 3rd September 2026 up to 5:00 PM.'
        },
        {
            'question': 'When and where should original documents be submitted for verification?',
            'answer': 'Shortlisted candidates must submit original documents and 2 sets of attested photocopies at the concerned ICDS Project Office between 07.09.2026 and 19.09.2026 during office working hours.'
        },
        {
            'question': 'What is the application fee for Telangana Anganwadi recruitment?',
            'answer': 'There is NO application fee (NIL). Online registration on wdcw.tg.nic.in is completely free.'
        },
        {
            'question': 'Where can I apply online for Mahabubabad Anganwadi vacancies?',
            'answer': 'Online applications must be submitted through the official portal https://wdcw.tg.nic.in.'
        },
        {
            'question': 'Who is the recruiting and appointing authority for these posts?',
            'answer': 'The District Collector & Chairperson and District Welfare Officer, Department of Women, Children, Disabled & Senior Citizens, Mahabubabad.'
        }
    ],
    'urls': [
        {
            'title': 'Download WDCW Mahabubabad Anganwadi Recruitment Official Notification PDF',
            'url': 'https://mis.tgwdcw.in/AWTNotification2026/MAHABUBABAD_NOTIFICATION_26.08.2026.pdf'
        },
        {
            'title': 'Apply Online at Telangana WDCW Official Portal (wdcw.tg.nic.in)',
            'url': 'https://wdcw.tg.nic.in'
        },
        {
            'title': 'Telangana Women & Child Development MIS Portal',
            'url': 'https://mis.tgwdcw.in/'
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
    'b': 'WD&CW, Mahabubabad District (ICDS)',
    't': 'WDCW Mahabubabad Recruitment 2026 – Apply Online for 231 Anganwadi Teacher & Helper Posts',
    'd': '25 August 2026',
    'l': '03 September 2026',
    'a': 'A2/ICDS/137-1/2026 to A2/ICDS/137-5/2026',
    'q': '10th (SSC) / 12th (Intermediate) Pass (Local Resident Women Only)',
    'desc': 'Department of Women Development & Child Welfare (WDCW), Mahabubabad District, Telangana has officially released employment notifications A2/ICDS/137-1/2026 to A2/ICDS/137-5/2026 for the recruitment of 231 vacancies for Anganwadi Teachers and Anganwadi Helpers across Dornakal, Gudur, Mahabubabad, Maripeda, and Thorrur ICDS Projects.',
    'u': 'https://mis.tgwdcw.in/AWTNotification2026/MAHABUBABAD_NOTIFICATION_26.08.2026.pdf'
}

entry_str = json.dumps(new_summary, indent=4, ensure_ascii=False)

if re.search(pattern, jobs_text):
    jobs_text = re.sub(pattern, entry_str + ',\n  ', jobs_text, count=1)
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(jobs_text)
    print(f'[SUCCESS] Updated {job_id} in jobsData.ts')
else:
    print(f'[ERROR] Could not find {job_id} in jobsData.ts')

