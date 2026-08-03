export interface JobEntry {
  id?: string;
  d: string; // post date
  b: string; // board
  t: string; // title / posts
  q: string; // qualification
  a: string; // advt no
  l: string; // last date
  u: string; // source link
  desc?: string; // simple english description
}

export const JOBS_DATA: JobEntry[] = [
  {
    id: 'apsc-veterinary-officer-recruitment-2026',
    b: 'Assam Public Service Commission (APSC), Guwahati',
    t: 'APSC Veterinary Officer Recruitment 2026 (Advt No. 11/2026) – 137 Vacancies under Animal Husbandry & Veterinary Dept (Pay Scale ₹30,000-1,10,000 + GP ₹12,700) | Apply Online at apscrecruitment.in by 06 September 2026',
    d: '03-08-2026',
    l: '06-09-2026',
    a: 'Advt. No. 11/2026 (eCF No. 819767/96 Dated 03-08-2026)',
    q: 'Degree in Animal Husbandry & Veterinary Science (B.V.Sc & A.H.) + Permanent Resident of Assam / PRC (Age 21-38 Yrs)',
    desc: 'Assam Public Service Commission (APSC) invites online applications for recruitment to 137 posts of Veterinary Officer / Block Veterinary Officer (VO/BVO) under Animal Husbandry & Veterinary Department, Govt of Assam. Pay Scale: Rs. 30,000 - 1,10,000/- with Grade Pay Rs. 12,700/- (Pay Band 4). Apply online at apscrecruitment.in from 07.08.2026 to 06.09.2026.',
    u: 'https://apscrecruitment.in'
  },
  {
    id: 'mecl-executive-trainee-upsc-ese-recruitment-2026',
    b: 'Mineral Exploration and Consultancy Limited (MECL), Nagpur',
    t: 'MECL Executive Trainee Recruitment 2026 (Advt 02/Rectt./2026) – 13 Vacancies for Mechanical & Electrical Engineers through UPSC ESE 2024 Score (Pay Scale ₹40,000-1,40,000) | Apply Online at mecl.co.in by 14 August 2026',
    d: '03-08-2026',
    l: '14-08-2026',
    a: 'Advertisement No. 02/Rectt./2026',
    q: 'B.E./B.Tech (Electrical / Mechanical 60% Marks) + Appeared in UPSC ESE 2024 Interview (Age Max 28 Yrs, Fee ₹500)',
    desc: 'Mineral Exploration and Consultancy Limited (MECL), a Mini-Ratna-I CPSE under Ministry of Mines, invites online applications for recruitment of 13 Executive Trainees (Mechanical & Electrical) in E-1 Grade. Shortlisting based on UPSC ESE 2024 Marks (out of 1200). Pay Scale: Rs. 40,000 - 1,40,000. Apply online at mecl.co.in from 01.08.2026 to 14.08.2026.',
    u: 'https://www.mecl.co.in'
  },
  {
    id: 'jkpsc-assistant-professor-recruitment-2026',
    b: 'Jammu and Kashmir Public Service Commission (JKPSC), J&K',
    t: 'JKPSC Assistant Professor & Librarian Recruitment 2026 (Notification 05-PSC of 2026) – 205 Vacancies in Govt Degree Colleges (Pay Level-10 ₹57,700-1,82,400) | Apply Online at jkpsc.nic.in by 31 August 2026',
    d: '03-08-2026',
    l: '31-08-2026',
    a: 'Notification No. 05-PSC (DR-P) OF 2026 Dated 31-07-2026',
    q: 'Master Degree (55% Marks) + NET/SLET/SET OR Ph.D in relevant discipline (J&K Domicile Mandatory, Age Max 40-43 Yrs)',
    desc: 'Jammu and Kashmir Public Service Commission (JKPSC) invites online applications from J&K domiciles for recruitment to 205 posts of Assistant Professor, College Director of Physical Education & Sports, and Librarian in Higher Education Department Govt Degree Colleges. Pay Scale: Level-10 (Rs. 57,700 - 1,82,400). Apply online at jkpsc.nic.in from 01.08.2026 to 31.08.2026.',
    u: 'https://jkpsc.nic.in'
  },
  {
    id: 'amtron-assam-unified-portal-recruitment-2026',
    b: 'Assam Electronics Development Corporation Ltd. (AMTRON), Guwahati',
    t: 'AMTRON Assam Recruitment 2026 (Advt AEDC/HRD/AUP/672) – 15 IT Vacancies for Developers, DBA, Content Manager & Graphic Designer (Salary up to ₹90,000/pm) | Apply Online at recruitment.amtron.in by 12 August 2026',
    d: '03-08-2026',
    l: '12-08-2026',
    a: 'Advt. No. AEDC/HRD/AUP/Adv./672 Dated 24-07-2026',
    q: 'BE/B.Tech (CS/IT) / MCA / M.Sc (IT) / BCA / Graduate / Diploma + 3 Yrs Exp (No Application Fee, Age 21-38 Yrs)',
    desc: 'Assam Electronics Development Corporation Limited (AMTRON) invites online applications for contractual engagement of 15 IT & Content Personnel under the Assam Unified Portal (AUP) Project. Posts: Frontend Developer, Backend Developer, Drupal Headless CMS Developer, Database Administrator, Content Manager & Graphic Designer. Salary: Rs. 35,000 to Rs. 90,000/pm. No application fee. Apply online at recruitment.amtron.in by 12 August 2026.',
    u: 'https://recruitment.amtron.in'
  },
  {
    id: 'gsssb-horticulture-assistant-recruitment-2026',
    b: 'Gujarat Subordinate Service Selection Board (GSSSB), Gujarat',
    t: 'GSSSB Horticulture Assistant Recruitment 2026 (Advt 454/2026-27) – 100 Vacancies in Agriculture & Farmers Welfare Dept (Pay ₹26,000/pm) | Apply Online at ojas.gujarat.gov.in by 17 August 2026',
    d: '03-08-2026',
    l: '17-08-2026 (23:59 Hrs)',
    a: 'Advt. No. 454/2026-27 Dated 03-08-2026',
    q: 'Diploma in Horticulture from Agricultural University Polytechnic + Computer Knowledge (Age 18-33 Yrs)',
    desc: 'Gujarat Subordinate Service Selection Board (GSSSB) invites online applications for direct recruitment to 100 posts of Horticulture Assistant, Class-III in the Agriculture, Farmers Welfare and Co-operation Department, Govt of Gujarat. Qualification: Diploma in Horticulture with basic computer knowledge. Fixed Pay: Rs. 26,000/pm for first 5 years. Apply online via OJAS portal from 03.08.2026 to 17.08.2026.',
    u: 'https://ojas.gujarat.gov.in'
  },
  {
    id: 'gsssb-multipurpose-health-supervisor-recruitment-2026',
    b: 'Gujarat Subordinate Service Selection Board (GSSSB), Gujarat',
    t: 'GSSSB Multi-Purpose Health Supervisor Recruitment 2026 (Advt 452/2026-27) – 119 Vacancies in Health Dept (Pay ₹26,000/pm) | Apply Online at ojas.gujarat.gov.in by 15 August 2026',
    d: '03-08-2026',
    l: '15-08-2026 (23:59 Hrs)',
    a: 'Advt. No. 452/2026-27 Dated 01-08-2026',
    q: '1-Yr MPHW Course / Sanitary Inspector Diploma / Health Sanitary Inspector ITI + Computer Knowledge (Male Only, Age 18-33 Yrs)',
    desc: 'Gujarat Subordinate Service Selection Board (GSSSB) invites online applications from eligible male candidates for direct recruitment to 119 posts of Multi-Purpose Health Supervisor, Class-III in the Health & Family Welfare Department, Govt of Gujarat. Qualification: 1-Year MPHW or Sanitary Inspector Diploma/ITI course with basic computer knowledge. Fixed Pay: Rs. 26,000/pm for first 5 years. Apply online via OJAS portal from 01.08.2026 to 15.08.2026.',
    u: 'https://ojas.gujarat.gov.in'
  },
  {
    id: 'du-professor-associate-professor-recruitment-2026',
    b: 'University of Delhi (DU), Delhi',
    t: 'DU Professor & Associate Professor Recruitment 2026 (Advt 321/2026 & 322/2026) – 86 Teaching Vacancies in 9 Departments (Pay Level 13A & 14) | Apply Online at du.ac.in by 20 August 2026',
    d: '03-08-2026',
    l: '20-08-2026',
    a: 'Advt. No. R&P/322/2026 & R&P/321/2026 Dated 31.07.2026',
    q: 'Ph.D. Degree in Relevant Subject + 8/10 Yrs Teaching/Research Experience + Research Score 75/120',
    desc: 'University of Delhi (DU) invites online applications for appointment to 86 teaching faculty positions — 30 Professors (Pay Level 14) and 56 Associate Professors (Pay Level 13A) across 9 Departments: Chemistry, Environmental Studies, Genetics, Geology, Hindi, Linguistics, Operational Research, Philosophy, and Zoology. Qualification: Ph.D. with minimum 8/10 years teaching/research experience and required research publications score. Apply online at du.ac.in by 20 August 2026.',
    u: 'https://www.du.ac.in'
  },
  {
    id: 'telangana-karimnagar-anganwadi-teacher-recruitment-2026',
    b: 'Department of Women & Child Development (WDCW), Karimnagar District, Telangana',
    t: 'Telangana Karimnagar Anganwadi Teacher Recruitment 2026 – 60 Vacancies for 12th Pass Women | Apply Online at wdcw.tg.nic.in by 15 August 2026',
    d: '03-08-2026',
    l: '15-08-2026 (5:00 PM)',
    a: 'Notification No. A/1124/2026-27 Dated 31-07-2026',
    q: 'Intermediate (12th Class) Pass | Local Resident Women Candidates Only (Age 18-35 Yrs)',
    desc: 'Department of Women, Children, Disabled and Senior Citizens, Karimnagar District, Government of Telangana, invites online applications from eligible local women candidates for 60 Anganwadi Teacher posts across Gangadhara (20), Huzurabad (16), Karimnagar Rural (16), and Karimnagar Urban (8) ICDS projects. Qualification: 12th Pass. Selection based on Intermediate marks merit (70 marks), special weightage (widow/orphan/PWD), and interview (10 marks). Apply online at wdcw.tg.nic.in from 01.08.2026 to 15.08.2026 (5:00 PM).',
    u: 'https://wdcw.tg.nic.in'
  },
  {
    id: 'mssc-manipur-special-primary-teacher-recruitment-2026',
    b: 'Manipur Staff Selection Commission (MSSC), Govt of Manipur',
    t: 'MSSC Manipur Special Primary Teacher Recruitment 2026 (Advt 02/2026) – 80 Vacancies in Education (S) Dept (Pay Level 6) | Apply Online at manipurssc.mn.gov.in by 20 August 2026',
    d: '03-08-2026',
    l: '20-08-2026 (5:00 PM)',
    a: 'Advt. No. 02/2026 (File No. MS-SSC/1/2026-MSSC-MSSC)',
    q: '10+2 (12th) with 50% Marks + D.Ed / D.El.Ed in Special Education with RCI CRR + Passed TET-1 (Age 18-38 Yrs)',
    desc: 'Manipur Staff Selection Commission (MSSC) invites online applications from Employment Exchange sponsored candidates of Manipur for 80 regular posts of Special Primary Teacher in Education (S) Department. Pay Level 6 (Group-C Non-Gazetted). Qualification: 12th with 50% marks + D.Ed / D.El.Ed in Special Education (RCI CRR Number) + Passed TET-1. Selection through 100-mark CBT (GK, Maths, English). Application fee Rs. 400/- (SC/ST Rs. 200/-, PwD Exempted). Apply online at manipurssc.mn.gov.in from 31.07.2026 to 20.08.2026.',
    u: 'https://manipurssc.mn.gov.in'
  },
  {
    id: 'hp-jal-shakti-vibhag-kasumpti-shimla-recruitment-2026',
    b: 'Himachal Pradesh Jal Shakti Vibhag (HPJSV), Division No-1 Kasumpti Shimla',
    t: 'HP Jal Shakti Vibhag Shimla Recruitment 2026 – 40 Vacancies for Para Pump Operator, Para Fitter & Multipurpose Worker (Honorarium up to Rs. 7,100/PM) | Apply Offline by 20 August 2026',
    d: '03-08-2026',
    l: '20-08-2026 (5:00 PM)',
    a: 'Notice No. JSV-EA-III-Para Pump Operator/2026-13283-86',
    q: '8th Pass / 10th Pass with ITI in Electrician, Wireman, Fitter, Plumber, Motor/Diesel Mechanic (Age 18-45 Yrs)',
    desc: 'Office of Executive Engineer, Jal Shakti Division No-1 Kasumpti Shimla-171009, HP Jal Shakti Vibhag, invites offline application forms for 40 vacancies of Para Pump Operator (12), Para Fitter (3), and Multipurpose Worker (25) on honorarium basis. Monthly Honorarium: Rs 7,100/PM for Para PO/Fitter and Rs 6,000/PM for Multipurpose Worker. Selection based on academic marks, experience, BPL status, skill test, and physical test. Submit offline form by 20 August 2026 upto 5:00 PM.',
    u: 'https://hpjalshakti.gov.in'
  },
  {
    id: 'sddmasc-delhi-junior-resident-walk-in-recruitment-2026',
    b: 'Shri Dada Dev Matri Avum Shishu Chikitsalaya (SDDMASC), Govt of NCT of Delhi',
    t: 'SDDMASC Delhi Junior Resident (JR) Recruitment 2026 – 12 Vacancies for MBBS Doctors (Pay Level 10 Basic Rs. 56,100) | Walk-in Interview on 07 August 2026',
    d: '03-08-2026',
    l: '07-08-2026 (Walk-in Interview)',
    a: 'Notice F.2 (14)/751/Rectt/JR/WII/vol.X/SDDMASC/2024/2612',
    q: 'MBBS Degree from MCI Recognized Institute + Rotatory Internship / FMG Exam + DMC Registration (Age Max 30 Yrs)',
    desc: 'Office of Medical Superintendent, Govt of NCT of Delhi, Shri Dada Dev Matri Avum Shishu Chikitsalaya (SDDMASC), Dabri, New Delhi, invites applications for Walk-in-Interview for 12 vacant posts of Junior Residents (JR) Doctors on Adhoc basis. Pay Level 10 (Basic Rs. 56,100/- + allowances). Registration on 07 August 2026 from 9:00 AM to 11:30 AM at Room No. 201, 2nd Floor, Administrative Block, SDDMASC. Zero application fee.',
    u: 'https://health.delhi.gov.in'
  },
  {
    id: 'mecl-executive-trainee-electrical-mechanical-recruitment-2026',
    b: 'Mineral Exploration and Consultancy Limited (MECL), Ministry of Mines',
    t: 'MECL Executive Trainee Recruitment 2026 via UPSC ESE 2024 (Advt 02/Rectt./2026) – 13 Vacancies for Mechanical & Electrical Engineers (E-1 Grade Pay Rs. 40,000-1,40,000) | Apply Online at mecl.co.in by 14 August 2026',
    d: '03-08-2026',
    l: '14-08-2026',
    a: 'Advertisement No. 02/Rectt./2026 (File No. RECTR/34/2026-HR-MECL)',
    q: 'BE / B.Tech in Mechanical / Electrical Engineering with 60% Marks + Qualified UPSC ESE 2024 Written & Interview (Age Max 28 Yrs)',
    desc: 'Mineral Exploration and Consultancy Limited (MECL), a Miniratna-I CPSE under Ministry of Mines, Govt of India, invites online applications for 13 Executive Trainee (ET) posts in Mechanical (12) and Electrical (01) disciplines through UPSC Engineering Services Examination 2024 (UPSC ESE 2024) score. Pay scale E-1 Grade Rs. 40,000 - 1,40,000/-. Direct selection based on UPSC ESE 2024 marks (out of 1200); no separate written exam or interview. Application fee Rs. 500/- (SC/ST/PwD/Ex-SM Exempted). Apply online at www.mecl.co.in from 01.08.2026 to 14.08.2026.',
    u: 'https://www.mecl.co.in'
  },
  {
    id: 'stpi-chief-administrative-officer-registrar-recruitment-2026',
    b: 'Software Technology Parks of India (STPI), MeitY, Govt of India',
    t: 'STPI Chief Administrative Officer-cum-Registrar Recruitment 2026 (Notice 2(3)/I/STPI-HQ/2026-2027) – Level-13 Group A Vacancy | Apply Online at stpi.in by 14 September 2026',
    d: '03-08-2026',
    l: '14-09-2026 (23:00 Hrs)',
    a: 'Employment Notice No. 2(3)/I/STPI-HQ/2026-2027',
    q: 'MBA / Post Graduate / Graduate with PG Diploma + 15 Yrs Experience (Age Max 50 Yrs for Direct, 56 Yrs for Deputation)',
    desc: 'Software Technology Parks of India (STPI), an autonomous society under the Ministry of Electronics and Information Technology (MeitY), Govt of India, invites online applications for filling Group A Non-S&T post of Chief Administrative Officer-cum-Registrar (A-VIII) on Deputation / Absorption / Direct Recruitment basis. Pay Level 13 (Basic Rs. 1,23,100 - Rs. 2,15,900/-). Selection via Personal Interview. Application fee Rs. 1000/- (Female/SC/ST/PH Exempted). Apply online at www.stpi.in from 01.08.2026 to 14.09.2026.',
    u: 'https://www.stpi.in'
  },
  {
    id: 'indian-air-force-iaf-agniveervayu-intake-01-2027-rally-recruitment-2026',
    b: 'Indian Air Force (IAF), Central Airmen Selection Board (CASB)',
    t: 'Indian Air Force Agniveervayu Recruitment 2026 (Intake 01/2027) – Open Recruitment Rally at Nagaland & Andaman Islands for Male & Female Candidates (Other Than Science Subjects) | Rally Dates 31 Aug to 07 Sep 2026',
    d: '02-08-2026',
    l: '04-09-2026 (Rally Dates: 31 Aug to 07 Sep 2026)',
    a: 'Notification AGNIVEERVAYU INTAKE 01/2027 (Open Rally)',
    q: '10+2 / Intermediate / 2-Yr Vocational / 3-Yr Diploma with 50% Marks & 50% English (Born 01 Jan 2005 to 01 Jul 2009)',
    desc: 'Indian Air Force (IAF) invites unmarried Indian male and female candidates to appear in Open Recruitment Rally for Agniveervayu Intake 01/2027 (Other Than Science Subjects) at Nagaland (NAPTC Chumoukedima for NE States) and Andaman & Nicobar Islands (Netaji Stadium, Port Blair). Open to Domiciles of Assam, Nagaland, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Tripura, Sikkim, and Andaman & Nicobar. 4-year tenure package with starting salary Rs. 30,000/pm and Seva Nidhi Package Rs. 10.04 Lakhs. Zero Application Fee. Reporting at rally venue from 6:00 AM on scheduled dates (01 to 05 Sep 2026).',
    u: 'https://iafrecruitment.edcil.co.in'
  },
  {
    id: 'jkssb-pm-package-kashmiri-migrants-recruitment-2026',
    b: 'Jammu and Kashmir Services Selection Board (JKSSB)',
    t: 'JKSSB PM Package Recruitment 2026 (Advt 07 of 2026) – 72 Vacancies for Kashmiri Migrants & Non-Migrant Kashmiri Pandits (Sub-Inspector, Depot Assistant, Junior Librarian, JSA, Draftsman) | Apply Online at jkssb.nic.in by 08 September 2026',
    d: '08-07-2026',
    l: '08-09-2026',
    a: 'Advertisement Notification No. 07 of 2026 Dated 08/07/2026',
    q: '10th Pass / ITI / Diploma / Graduation / B.Lib.I.Sc / BLIS + Valid J&K Domicile & Migrant Certificate (Age Max 40 - 43 Yrs)',
    desc: 'Jammu and Kashmir Services Selection Board (JKSSB) invites online application forms under Special Drive (PM Package for Kashmiri Migrants & Non-Migrant Kashmiri Pandits) for 72 Divisional Cadre vacancies in Kashmir Division across Sub-Inspector Finance (39), Depot Assistant (14), Junior Librarian (10), Library Assistant (05), Junior Statistical Assistant (02), Motor Vehicle Traffic Assistant (01) and Draftsman Civil (01). Pay scale Level-1 up to Level-5 (Basic Rs. 14,800 to Rs. 92,300). Selection via OMR written exam. Fee Rs. 600 (Rs. 500 reserved). Apply online at www.jkssb.nic.in from 10.08.2026 to 08.09.2026.',
    u: 'https://www.jkssb.nic.in'
  },
  {
    id: 'ibps-crp-csa-xvi-clerk-customer-service-associate-recruitment-2026',
    b: 'Institute of Banking Personnel Selection (IBPS) & 11 Public Sector Banks',
    t: 'IBPS Clerk Recruitment 2026 (CRP CSA-XVI) – State-wise Vacancies for Customer Service Associates (CSA) in 11 Public Sector Banks | Apply Online at ibps.in by 21 August 2026',
    d: '01-08-2026',
    l: '21-08-2026',
    a: 'Notification CRP CSA-XVI (Common Recruitment Process 2027-28)',
    q: 'Graduation in any discipline + Computer Knowledge + Local Language Proficiency (Age 20 - 28 Yrs)',
    desc: 'Institute of Banking Personnel Selection (IBPS) invites online applications for Common Recruitment Process (CRP CSA-XVI) for recruitment of Customer Service Associates (CSA / Clerical Cadre) in 11 Participating Public Sector Banks (PNB, Canara Bank, Bank of Baroda, Bank of India, Central Bank of India, Indian Bank, UCO Bank, Union Bank, etc.). Thousands of vacancies advertised across all 36 States/UTs. Pay Scale Rs. 24,050 - 64,480/- plus allowances. Selection via Prelims Exam (Oct 2026) and Mains Exam (Dec 2026). Fee Rs. 850 (Rs. 175 for SC/ST/PwBD/ESM). Apply online at www.ibps.in from 01.08.2026 to 21.08.2026.',
    u: 'https://www.ibps.in'
  },
  {
    id: 'rcf-ltd-management-trainee-recruitment-2026',
    b: 'Rashtriya Chemicals and Fertilizers Limited (RCF Ltd), Chembur, Mumbai',
    t: 'RCF Ltd Management Trainee Recruitment 2026 (Advt 16022026) – 94 Vacancies for MT Chemical, Mechanical, Electrical, Instrumentation, IT, Finance, Marketing & Civil | Apply Online at rcfltd.com from 08 to 24 August 2026',
    d: '01-08-2026',
    l: '24-08-2026 (5:00 PM IST)',
    a: 'Advertisement No. 16022026',
    q: 'BE / B.Tech Engineering Degree / CA / CMA / MBA / MSc / PhD in relevant discipline (Age Max 27 - 32 Yrs)',
    desc: 'Rashtriya Chemicals and Fertilizers Limited (RCF Ltd), a Navratna Central Public Sector Undertaking, invites online applications for 94 Management Trainee (MT) posts across Chemical (32), Mechanical (04), Electrical (10), Instrumentation (09), IT (05), Finance (10), Marketing (10), Boiler (06), Civil, Fire, Industrial Engg, Rajbhasha & CC Lab. Monthly stipend during 1-yr training Rs. 60,000/-; on absorption E-1 Grade pay scale Rs. 40,000 - 1,40,000/- (Gross Rs. 86,320/pm). Selection via Online Test & Interview. Fee Rs. 1000 (SC/ST/PwBD/ExSM/Female Exempted). Apply online at www.rcfltd.com from 08.08.2026 to 24.08.2026.',
    u: 'https://www.rcfltd.com'
  },
  {
    id: 'isro-nrsc-research-scientist-jrf-project-associate-recruitment-2026',
    b: 'National Remote Sensing Centre (NRSC), ISRO, Dept of Space, Govt of India, Hyderabad',
    t: 'ISRO NRSC Recruitment 2026 (Advt NRSC/RMT/1/2026) – 48 Vacancies for Research Scientist, Junior Research Fellow (JRF), Project Associate & Project Scientist | Apply Online at nrsc.gov.in by 21 August 2026',
    d: '01-08-2026',
    l: '21-08-2026 (5:00 PM IST)',
    a: 'Advt. No. NRSC/RMT/1/2026 Dated 01/08/2026',
    q: 'BE / B.Tech / ME / M.Tech / M.Sc in CSE, IT, Civil, Remote Sensing, GIS, Physics, Geology, Agriculture (Age Max 28 - 35 Yrs)',
    desc: 'National Remote Sensing Centre (NRSC), one of the primary centres of Indian Space Research Organisation (ISRO), invites online applications for 48 temporary research positions including Research Scientist (14), Junior Research Fellow / JRF (19), Project Associate I & II (05), and Project Scientist B & I (10). Emoluments range from Rs. 31,000/- up to Rs. 56,100/- per month plus HRA & DA. Application fee Rs. 250 (100% refundable for Women/SC/ST/PwBD/ExSM upon participating in selection). Apply online at www.nrsc.gov.in from 01.08.2026 to 21.08.2026.',
    u: 'https://www.nrsc.gov.in'
  },
  {
    id: 'krcl-konkan-railway-je-sse-station-master-alp-track-maintainer-recruitment-2026',
    b: 'Konkan Railway Corporation Limited (KRCL), Navi Mumbai',
    t: 'Konkan Railway Recruitment 2026 (Advt CO/P-R/02/2026) – 201 Vacancies for Station Master (15), ALP (30), Junior Engineer (32), SSE (11), Goods Train Manager (10), Track Maintainer (57) & Technicians | Apply Online at konkanrailway.com in August 2026',
    d: '31-07-2026',
    l: 'September 2026 (Online Window opens last week of August 2026)',
    a: 'Employment Notification No. CO/P-R/02/2026 Dated 31/07/2026',
    q: 'Degree / Diploma in Engineering / Graduation / 10th Pass + ITI / CCAA (Age 18 - 36/45 Yrs)',
    desc: 'Konkan Railway Corporation Limited (KRCL) invites online applications for 201 Group C and Group D vacancies across Civil, Electrical, Mechanical, S&T, Operating, and Commercial departments. Posts include Junior Engineer (32), Senior Section Engineer (11), Station Master (15), Assistant Loco Pilot (30), Section Controller (09), Goods Train Manager (10), Track Maintainer IV (57), ESTM-III (15), Technician-III (15), and Commercial Supervisor (07). Pay Levels range from Level 1 to Level 7 (Pay up to Rs. 44,900+). Selection via CBT (Sept 2026), Aptitude Test/PET & DV. Apply online at www.konkanrailway.com starting last week of August 2026.',
    u: 'https://www.konkanrailway.com'
  },
  {
    id: 'jkssb-pwd-rb-draftsman-works-supervisor-recruitment-2026',
    b: 'Jammu & Kashmir Services Selection Board (JKSSB) & Public Works (R&B) Department, J&K',
    t: 'JKSSB PWD Recruitment 2026 (Advt 06/2026) – 357 Vacancies for Draftsman Civil (97) and Works Supervisor (260) in Public Works (R&B) Dept | Apply Online at jkssb.nic.in from 01 to 30 August 2026',
    d: '06-07-2026',
    l: '30-08-2026 (Online Application at jkssb.nic.in)',
    a: 'Advt. Notification No. 06 of 2026 Dated 06/07/2026',
    q: 'Matriculation (10th Pass) + ITI in Building Construction / Carpentry OR 2-Year Draftsman Certificate/Diploma in Civil (Age Max 40 - 43 Yrs)',
    desc: 'Jammu and Kashmir Services Selection Board (JKSSB) invites online applications for 357 Divisional Cadre vacancies in Public Works (R&B) Department under direct recruitment. Posts include Draftsman Civil (97 posts, Level-4 Rs. 25,500-81,100) and Works Supervisor (260 posts, SL-2 Rs. 15,900-50,400) across Jammu and Kashmir divisions. Selection based on OMR Written Examination. J&K Domiciles apply online at www.jkssb.nic.in between 01.08.2026 and 30.08.2026.',
    u: 'https://www.jkssb.nic.in'
  },
  {
    id: 'aiims-kalyani-junior-resident-non-academic-recruitment-2026',
    b: 'All India Institute of Medical Sciences (AIIMS), Kalyani, Nadia, West Bengal',
    t: 'AIIMS Kalyani Junior Resident Recruitment 2026 – 84 Vacancies for Junior Resident (Non-Academic) in Various Departments | Apply Online at aiimskalyani.edu.in by 24 August 2026',
    d: '31-07-2026',
    l: '24-08-2026 (Online Registration)',
    a: 'No. 1650/E-12015/25/26-(SR/T/JR) Dated 31/07/2026',
    q: 'MBBS Degree from NMC Recognized Institute + Internship Completion Certificate & Medical Registration (Age Max 33 Yrs)',
    desc: 'All India Institute of Medical Sciences (AIIMS), Kalyani, an Institute of National Importance under Ministry of Health & Family Welfare, Govt of India, invites online applications for 84 Junior Resident (Non-Academic) tenure posts for 6 months across various clinical departments. Pay Matrix Level 10 (Rs. 15,600 - 39,100 + GP 5,400 + NPA). Selection via Written Test and Walk-in Interview on 08.09.2026. Register online by 24.08.2026 (5 PM).',
    u: 'https://www.aiimskalyani.edu.in'
  },
  {
    id: 'sinp-kolkata-scientist-scientific-assistant-technician-ldc-recruitment-2026',
    b: 'Saha Institute of Nuclear Physics (SINP), Kolkata, Dept of Atomic Energy (DAE), Govt of India',
    t: 'SINP Kolkata Recruitment 2026 – 62 Vacancies for Scientist C (05), Scientific Assistant B (08), Technician B (18), LDC (07), Security Guard (08), Work Assistant (11) & Cook (04) | Apply Online at saha.ac.in by 15 September 2026',
    d: '31-07-2026',
    l: '15-09-2026 (Online Application at saha.ac.in)',
    a: 'Advt. No. SINP/Estt./Advt./11/2026 Dated 31/07/2026',
    q: 'M.Sc in Physics / Diploma in Engineering / ITI / Graduation / 10th Pass (Age 25 - 33 Yrs)',
    desc: 'Saha Institute of Nuclear Physics (SINP), Kolkata, a premier DAE autonomous research institute, invites online applications for 62 vacancies across Scientific, Technical, Administrative, and Auxiliary categories. Posts include Scientist C (05), Scientific Assistant B (08), Technician B (18), LDC (07), Security Guard A (08), Work Assistant A (11), Halwai-cum-Cook (04), and AAO-I. Pay Levels range from Level 1 to Level 10 (Pay up to Rs. 56,100+). Apply online at www.saha.ac.in by 15.09.2026.',
    u: 'https://www.saha.ac.in'
  },
  {
    id: 'sri-jayadeva-institute-assistant-professor-recruitment-2026',
    b: 'Sri Jayadeva Institute of Cardiovascular Sciences & Research (SJICR), Bengaluru, Govt of Karnataka',
    t: 'Sri Jayadeva Institute Recruitment 2026 – 34 Assistant Professor Vacancies in Cardiology, CT Surgery, Electrophysiology, Anaesthesia & Vascular Surgery (Bangalore & Kalaburagi Branches) | Apply Offline by 11 August 2026',
    d: '28-07-2026',
    l: '11-08-2026 (Offline Application with DD/IPO)',
    a: 'Ref No. SJICR/EST(1)/68/2026-27 Dated 28/07/2026',
    q: 'DM / M.Ch / DrNB / DNB in relevant Specialty + BCBR Course (Age up to 40 - 45 Yrs)',
    desc: 'Sri Jayadeva Institute of Cardiovascular Sciences & Research (SJICR), Bengaluru invites offline applications from eligible candidates for 34 Assistant Professor posts across Cardiology, C.T. Surgery, Electrophysiology, Cardiac Anaesthesia, and Vascular Surgery for its Bangalore and Kalaburagi branches. Pay scale Rs. 79,800 - 2,11,500. Submit prescribed application form with Demand Draft or Indian Postal Order (Rs. 4000 GM/OBC / Rs. 2500 SC/ST) to Director SJICR Bangalore by 11.08.2026.',
    u: 'https://www.jayadevacardiology.com'
  },
  {
    id: 'punjab-school-education-pti-recruitment-2026',
    b: 'Directorate of Education Recruitment (Sikhiya Bharti Directorate), Punjab (Sector-60, SAS Nagar Mohali)',
    t: 'Punjab Education Department Recruitment 2026 – 2000 Vacancies for Physical Training Instructor (PTI) Primary Cadre (General: 780, EWS: 200, SC: 400, BC: 200, ESM/Sports/PwD/FF) | Apply Online at erd.punjab.gov.in from 01 to 31 August 2026',
    d: '31-07-2026',
    l: '31-08-2026 (Online Application at erd.punjab.gov.in)',
    a: 'Public Notice Ref No. ਈ-888608/2026208471 Dated 31/07/2026 (School Education Dept Memo No. 1/2026869727/1)',
    q: '10+2 (Senior Secondary) + 2-Year Diploma/Certificate in Physical Education (D.P.Ed / C.P.Ed) | Mandatory 10th Punjabi + Punjabi Qualifying Test 50% Marks (Age 18 to 37 Yrs)',
    desc: 'Education Recruitment Directorate, Punjab invites online applications for 2000 fresh vacancies of Physical Training Instructor (PTI) (Primary Cadre) under School Education Department, Punjab. Candidates passing 10+2 with D.P.Ed/C.P.Ed and Matriculation Punjabi can apply online at erd.punjab.gov.in between 01/08/2026 and 31/08/2026. Selection via 70 Marks Written Test + 30 Marks Sports Achievement Gradation + Qualifying Physical Test (PET). Fixed initial salary Rs. 29,200/pm.',
    u: 'https://erd.punjab.gov.in'
  },
  {
    id: 'cims-chamarajanagar-medical-faculty-cmo-recruitment-2026',
    b: 'Chamarajanagar Institute of Medical Sciences (CIMS), Chamarajanagar, Govt of Karnataka',
    t: 'CIMS Chamarajanagar Recruitment 2026 – 49 Regular Faculty & Medical Officer Vacancies for Professor (01), Associate Professor (06), Assistant Professor (40) & Casualty Medical Officer (02) | Apply Offline by 14 August 2026',
    d: '27-07-2026',
    l: '14-08-2026 (up to 5:00 PM via Registered Post / In Person)',
    a: 'Ref No. CIMS/EST/T.Staff/RPC/12/2026-27 Dated 27.07.2026',
    q: 'MD / MS / DNB / DrNB / MDS / M.Sc Ph.D (as per NMC) | MBBS for Casualty Medical Officer (Age up to 35-47 Yrs)',
    desc: 'Chamarajanagar Institute of Medical Sciences (CIMS) invites offline applications on regular basis for 49 teaching and medical officer posts (Professor: 1, Associate Professor: 6, Assistant Professor: 40, Casualty Medical Officer: 2) across RPC & 371J Kalyan Karnataka cadres. Apply offline in prescribed form with Demand Draft of Rs. 4000 to Director CIMS Chamarajanagar by 14.08.2026 (5:00 PM). Selection based on 90% credentials merit + 10% interview score.',
    u: 'https://cimscrnagara.karnataka.gov.in'
  },
  {
    id: 'thane-municipal-corporation-health-department-recruitment-2026',
    b: 'Thane Municipal Corporation (TMC), Public Health Department, Govt of Maharashtra',
    t: 'Thane Municipal Corporation Recruitment 2026 – 61 Vacancies under 15th Finance Commission for GNM Female (28), GNM Male (03) & Multi-Purpose Worker MPW Male (30) | Apply Online (Google Form)',
    d: '29-07-2026',
    l: '07-08-2026 (up to 2:00 PM via Google Form & Hardcopy/DD Submission)',
    a: 'Public Health Dept Advertisement Dated 29/07/2026 (15th Finance Commission)',
    q: 'B.Sc Nursing / GNM + MNC Registration | 12th Science + Paramedical Basic Training / Sanitary Inspector Course (Age 18 to 38 / 65 Yrs)',
    desc: 'Thane Municipal Corporation (TMC) Public Health Department invites online applications via Google Form for 61 contractual posts (GNM Female: 28, GNM Male: 3, Multi-Purpose Worker Male: 30) for 11 months 29 days under 15th Finance Commission scheme. Apply online via Google Form link and submit self-attested documents with Demand Draft (Rs. 750 Open / Rs. 500 Reserved) at Public Health Dept, 4th Floor TMC Building Panchpakhadi Thane by 07.08.2026 (2:00 PM).',
    u: 'https://www.thanecity.gov.in'
  },
  {
    id: 'dharwad-dhfws-staff-nurse-lab-tech-recruitment-2026',
    b: 'District Health & Family Welfare Officer, Zilla Panchayat, Dharwad, Government of Karnataka',
    t: 'Dharwad DHFWS Recruitment 2026 – 14 Contractual Vacancies for Staff Nurse (12), Jr. Laboratory Technical Officer (1) & Pharmacy Officer (1) | Apply Online (NIC Portal)',
    d: '24-07-2026',
    l: '05-08-2026 (Online Application) | Document Verification: 10-08-2026 to 12-08-2026',
    a: 'Ref No. ZIAKUKA-KADHA/Sibbandi-2/Viv/ /2026-27 dated 24.07.2026',
    q: 'Diploma in Nursing / B.Sc Nursing + KNC Reg | Diploma in Lab Tech + KPB Reg | Diploma in Pharmacy + KPC Reg',
    desc: 'Office of the District Health & Family Welfare Officer, Zilla Panchayat Dharwad invites online applications for 14 contractual posts (Staff Nurse: 12, Jr. Lab Technical Officer: 1, Pharmacy Officer: 1) for 1 year. Apply online via NIC portal from 28.07.2026 to 05.08.2026. Document verification from 10.08.2026 to 12.08.2026 at DHO Office Dharwad on Roster-cum-Merit basis.',
    u: 'https://dharwad.nic.in'
  },
  {
    id: 'bengaluru-rural-pourakarmika-special-recruitment-2026',
    b: 'District Urban Development Cell (DUDC), Office of the Deputy Commissioner, Bengaluru Rural District, Govt of Karnataka',
    t: 'Bengaluru Rural District Pourakarmika Recruitment 2026 – 27 Vacancies under Special Direct Recruitment across 6 Urban Local Bodies (Doddaballapura, Hosakote, Nelamangala, Devanahalli, Vijayapura, Bagalur)',
    d: '22-07-2026',
    l: '24-08-2026 (Offline Application Submission at ULB Offices)',
    a: 'Ref No. ZIANAKO/A(1)/PO.NE.SI.AR/52/2025-26 dated 22/07/2026',
    q: 'Pourakarmikas working continuously in ULBs of Bengaluru Rural for >= 2 years & appointed before 07.08.2017 (Age 18 to 55 Yrs)',
    desc: 'Deputy Commissioner & DUDC Bengaluru Rural District invites offline applications for 27 Pourakarmika (Municipal Sanitation Workers) posts via Special Direct Recruitment across Doddaballapura (6), Hosakote (6), Nelamangala (5), Devanahalli (3), Vijayapura (3), and Bagalur (3). Applicants must have worked continuously for >= 2 yrs and appointed before 07.08.2017. Forms available at respective ULB offices from 22.07.2026 to 24.08.2026.',
    u: 'https://bengalururural.nic.in'
  },
  {
    id: 'davanagere-dhfws-staff-nurse-recruitment-2026',
    b: 'District Health & Family Welfare Officer, Zilla Panchayat, Davanagere District, Govt of Karnataka',
    t: 'Davanagere DHFWS Staff Nurse Recruitment 2026 – 10 Contractual Vacancies | Walk-in Interview on 04 August 2026 (GNM / B.Sc Nursing, KNC Registered)',
    d: '27-07-2026',
    l: '04-08-2026 (Walk-in Interview 11:00 AM to 2:00 PM at DHO Office Davanagere)',
    a: 'Ref No. ZIADA/TENDER/05/2026-27 dated 27/07/2026',
    q: 'Diploma in Nursing (GNM) / B.Sc Nursing from Govt recognized institution + compulsory Karnataka Nursing Council (KNC) registration',
    desc: 'Zilla Panchayat Davanagere DHFWS invites eligible candidates for a Walk-in Interview for 10 Staff Nurse contractual posts (1 year tenure). Candidates holding GNM/B.Sc Nursing registered with Karnataka Nursing Council can attend the walk-in interview on 04.08.2026 (11:00 AM - 2:00 PM) at DHO Office Davanagere with original documents and testimonials.',
    u: 'https://davanagere.nic.in'
  },
  {
    id: 'vijayapura-dhfws-staff-nurse-lab-tech-recruitment-2026',
    b: 'District Health & Family Welfare Officer, Vijayapura, Government of Karnataka',
    t: 'Vijayapura DHFWS Recruitment 2026 – 26 Contractual Vacancies for Staff Nurse (16), Laboratory Technical Officer (7) & Pharmacy Officer (3) | Walk-In Interview on 07 August 2026',
    d: '28-07-2026',
    l: '07-08-2026 (Application submission in-person from 28-07-2026 | Walk-in Interview on 07-08-2026 10:00 AM to 5:30 PM)',
    a: 'Ref No. /Sr. Superintendent/C.R./693/2026-27 dated 28/07/2026',
    q: 'B.Sc / Diploma in Nursing + KNC Reg | DMLT (Lab Tech) | D.Pharma + KPC Reg (Age up to 45 Yrs)',
    desc: 'District Health & Family Welfare Society Vijayapura invites in-person applications and walk-in interviews for 26 contractual posts (Staff Nurse B.Sc quota: 4, Staff Nurse Diploma quota: 12, Laboratory Technical Officer: 7, Pharmacy Officer: 3). Submit prescribed application form in person at DHO Office Vijayapura from 28.07.2026 onward and attend Walk-in Interview on 07.08.2026 (10:00 AM to 5:30 PM). Selection on Roster-cum-Merit basis.',
    u: 'https://vijayapura.nic.in'
  },
  {
    id: 'ofdr-pune-munitions-india-dbw-recruitment-2026',
    b: 'Ordnance Factory Dehu Road (OFDR), Pune, Maharashtra (Unit of Munitions India Limited, Ministry of Defence, Govt. of India)',
    t: 'OFDR Pune Recruitment 2026 – 14 Vacancies for Tenure Based Danger Building Worker (DBW) | Apply Offline (NCTVT/NCVT AOCP or Feeder ITI Trade Pass, Basic Pay Rs. 19,900 + DA, Zero Fee)',
    d: '29-07-2026',
    l: '21 Days from Publication in Employment News',
    a: 'No. 1914/96/AOCP(50)/Phase-II/HRM/2026',
    q: 'Ex-Apprentices of AOCP Trade or Feeder Trades (IMCP, MMCP, LACP, PPO, Fitter, Machinist, Turner, Electrician, etc.) from Ordnance Factories or Govt/Pvt ITI',
    desc: 'Ordnance Factory Dehu Road (OFDR), Pune, Maharashtra (a unit of Munitions India Limited, Govt. of India Enterprise under Ministry of Defence) invites offline applications for 14 tenure-based contractual posts of Danger Building Worker (DBW) in Skilled level. Basic Pay Rs. 19,900/- + DA, HRA, EPF, Bonus & Risk Allowance. Category breakup: SC - 05, ST - 02, OBC - 03, EWS - 04 (Ex-SM: 05 horizontal). Selection via NCTVT (NAC) marks (80% weightage) and Trade Test (20% weightage). Zero application fee.',
    u: 'https://munitionsindia.in/career'
  },
  {
    id: 'rajasthan-power-sector-rvunl-recruitment-2026',
    b: 'Rajasthan Rajya Vidyut Utpadan Nigam Ltd. (RVUNL) & State Power Sector Companies (RVUN, RVPN, JVVN, AVVN, JdVVN), Govt. of Rajasthan',
    t: 'Rajasthan Power Sector Recruitment 2026 – 2005 Vacancies for Junior Engineer (JEN-I), Junior Accountant & Junior Assistant / Commercial Assistant-II across RVUN, RVPN, JVVNL, AVVNL & JdVVNL | Apply Online',
    d: '24-06-2026',
    l: 'August 2026 (Online Applications open 2nd Fortnight of July 2026)',
    a: 'Advertisement No. RVUN/Rectt.-2026-27/01 (No. RVUN/P&A/Rectt.2026-27/F.103/D. 120 dated 24.06.2026)',
    q: 'Degree in Engineering (B.E./B.Tech) for JEN-I | B.Com/BBA/MBA/CA for Jr. Accountant | Graduation + RSCIT/Computer Certificate for Jr. Assistant',
    desc: 'Rajasthan State Power Sector invites online applications for common recruitment of 2,005 vacancies across 5 State Power Companies (RVUN, RVPN, JVVNL, AVVNL, JdVVNL). Posts include Junior Engineer-I (Electrical: 727, Mechanical: 110, Civil: 32 - Total 869 JENs), Junior Accountant (371 posts), and Junior Assistant / Commercial Assistant-II (765 posts). Includes Non-TSP, TSP Area, and Backlog vacancies. Detailed online application forms available on official energy portal.',
    u: 'https://energy.rajasthan.gov.in'
  },
  {
    id: 'amu-cdoe-assistant-professor-recruitment-2026',
    b: 'Centre for Distance and Online Education (CDOE), Aligarh Muslim University (AMU), Aligarh, Uttar Pradesh',
    t: 'AMU CDOE Assistant Professor Recruitment 2026 – 11 Vacancies in Political Science, History, Economics & LIS | Apply Online & Hard Copy (Fixed Pay Rs. 40,000/pm)',
    d: '30-07-2026',
    l: '06-08-2026 (Online Form) | 13-08-2026 till 04:00 PM (Hard Copy Submission)',
    a: 'Local Advertisement No. 02/2026-27/CDOE dated 30/07/2026',
    q: "Master's Degree with 55% marks (50% for SC/ST/OBC/PWD) + UGC/CSIR NET/SLET/SET or Ph.D. degree in concerned discipline",
    desc: 'Centre for Distance and Online Education (CDOE), Aligarh Muslim University (AMU), Aligarh invites online applications for 11 temporary/contractual Assistant Professor posts in Political Science (3), History (3), Economics (3), and Library and Information Science (2) for Academic Session 2026-27. Fixed salary of Rs. 40,000/- per month. Apply online at careers.amuonline.ac.in by 06.08.2026 and submit hard copy with documents to CDOE AMU by 13.08.2026. Walk-in interviews scheduled on 27.08.2026.',
    u: 'https://careers.amuonline.ac.in'
  },
  {
    id: 'nhm-assam-staff-nurse-recruitment-2026',
    b: 'National Health Mission (NHM), Assam',
    t: 'NHM Assam Staff Nurse Recruitment 2026 – 2204 Vacancies | Apply Online for Contractual Staff Nurse Posts (GNM / B.Sc Nursing, Pay Rs. 20,000/pm, Zero Fee)',
    d: '29-07-2026',
    l: '15-08-2026 (11:59 PM)',
    a: 'No. NHM-31013(11)/5/2025-HRD-NHM (ECF : 678091) dated 29.07.2026',
    q: 'B.Sc Nursing / GNM Course from INC recognized institution + Registration with Assam Nurses Midwives & Health Visitors Council',
    desc: 'Office of the Mission Director, National Health Mission (NHM), Assam invites online applications for 2,204 vacancies of Staff Nurse on a contractual basis. Remuneration: Rs. 20,000/- per month. Category breakup includes UR - 1701, SC - 209, Tea Tribes - 170, ST(H) - 80, OBC/MOBC - 44. Candidates with B.Sc Nursing or GNM degree and Assam Council Registration aged up to 40 years (relaxable) can apply online at nhm.assam.gov.in from 01.08.2026 to 15.08.2026. No application fee.',
    u: 'https://nhm.assam.gov.in'
  },
  {
    id: 'up-azamgarh-anganwadi-sahayika-recruitment-2026',
    b: 'Office of District Programme Officer (Zila Karyakram Adhikari), Azamgarh, ICDS, Bal Vikas Seva evam Pushtahar Vibhag, Govt. of Uttar Pradesh',
    t: 'UP Azamgarh Anganwadi Sahayika Recruitment 2026 – 265 Vacancies across 23 Projects/Blocks | Apply Online (Class 12th Pass, Merit Based, No Exam, No Fee)',
    d: '28-07-2026',
    l: '31-08-2026 (12:00 Midnight)',
    a: 'Patrank C-1668 / Ji.Ka.Ka. / 2026-27 dated 28.07.2026',
    q: 'Class 12th (Intermediate) or equivalent from a recognized board (Female Permanent Residents of Ward/Gram Sabha)',
    desc: 'Office of the District Programme Officer, Azamgarh (Bal Vikas Seva evam Pushtahar Vibhag, Uttar Pradesh) invites online applications for 265 vacancies of Anganwadi Sahayika (Helper) across 23 Child Development Projects/Blocks in Azamgarh district. Category breakdown: UR - 139, OBC - 71, SC - 55. Minimum qualification is Intermediate (Class 12th). Selection is 100% merit-based on educational marks without any exam or interview. Zero application fee for all categories.',
    u: 'https://upanganwadibharti.in'
  },
  {
    id: 'up-anganwadi-worker-sahayika-recruitment-2026',
    b: 'Integrated Child Development Services (ICDS), Bal Vikas Seva evam Pushtahar Vibhag, Govt. of Uttar Pradesh',
    t: 'UP Anganwadi Recruitment 2026 – District-Wise Active Vacancies for Anganwadi Karyakatri (Worker) & Sahayika (Helper) – Apply Online (12th Pass, No Exam, No Fee)',
    d: '21-07-2026',
    l: '11-08-2026 (Ayodhya & Unnao) | 07-08-2026 (Ghaziabad) | 06-08-2026 (Raebareli)',
    a: 'District-wise ICDS Recruitment Notices 2026-27 (Ayodhya Patrank C-1088/DM/B.A./Notice/2026-27)',
    q: 'Class 12th (Intermediate) for Anganwadi Worker | Class 8th / 10th for Anganwadi Helper (Female Permanent Residents Only)',
    desc: 'Department of Women & Child Development (Bal Vikas Seva evam Pushtahar Vibhag), Uttar Pradesh announces district-wise recruitment for Anganwadi Karyakatri (Worker) and Anganwadi Sahayika (Helper). Active districts include Ayodhya (220 Karyakatri posts), Raebareli (191 posts), Unnao, Ghaziabad, and others. Selection is 100% merit-based on qualifying educational marks without any written test or interview. Zero application fee for all categories.',
    u: 'https://upanganwadibharti.in'
  },
  {
    id: 'csir-ngri-hyderabad-project-staff-recruitment-2026',
    b: 'CSIR - National Geophysical Research Institute (CSIR-NGRI), Hyderabad, Telangana',
    t: 'CSIR-NGRI Hyderabad Project Staff Recruitment 2026 – 18 Vacancies (Walk-In & Online Interview for Project Assistant, Associate & Scientist Posts, Pay up to ₹78,000/pm + HRA)',
    d: '27-07-2026',
    l: '03-08-2026 (Online Google Form) / 05, 07 & 11 Aug 2026 (Walk-In Interviews)',
    a: 'CSIR-NGRI Notification No. PP - 07/2026 dated 27.07.2026',
    q: 'Diploma (EEE / ECE / EIE) / B.Sc / M.Sc / M.Tech / Ph.D in Geophysics / Geology / Earth Sciences',
    desc: 'CSIR-National Geophysical Research Institute (CSIR-NGRI), Uppal Road, Hyderabad, Telangana invites applications for Walk-In and Online Interviews to fill 18 temporary Project Personnel positions (Project Assistant-II, Project Associate-I, Project Associate-II, Principal Project Associate, Project Scientist-III). Remuneration ranges from ₹20,000 + HRA up to ₹78,000 + HRA per month. Candidates applying for online interviews must submit Google Form and application form by 3rd August 2026.',
    u: 'https://www.ngri.res.in'
  },
  {
    id: 'bel-panchkula-project-engineer-recruitment-2026',
    b: 'Bharat Electronics Limited (BEL), Panchkula (Ministry of Defence)',
    t: 'BEL Project Engineer Recruitment 2026 – 14 Vacancies in Rajasthan & Gujarat (Walk-in Selection at Jodhpur, Pay Scale up to ₹55,000/pm)',
    d: '28-07-2026',
    l: '11-08-2026 (Pre-Registration by 09:00 AM / Walk-in at Jodhpur)',
    a: 'Advt No. 2026-27/07/PK/ PE/006 dated 28.07.2026',
    q: 'B.E. / B.Tech / B.Sc Engg in ECE / EEE / CSE / IT + 02 Years Relevant Experience',
    desc: 'Bharat Electronics Limited (BEL), Panchkula invites applications for Walk-In Selection at Jodhpur for 14 posts of Project Engineer (PE-I) for deployment at site locations in Rajasthan (Jodhpur, Jaisalmer) & Gujarat (Jamnagar, Bhuj, Naliya). Consolidated remuneration starts at ₹40,000/pm in 1st year up to ₹55,000/pm in 4th year plus 10% Area Allowance and ₹1,00,000 retention bonus upon completing 4 years. Pre-registration is mandatory before 09:00 AM on 11th August 2026.',
    u: 'https://bel-india.in'
  },
  {
    id: 'delhi-rtrmh-senior-resident-recruitment-2026',
    b: 'Rao Tula Ram Memorial Hospital (RTRMH), Govt. of NCT of Delhi',
    t: 'Delhi RTRMH Senior Resident Adhoc Recruitment 2026 – 27 Posts across 9 Specialties (7th CPC Level 11, Pay ₹67,700/pm)',
    d: '29-07-2026',
    l: '07-08-2026 (Walk-In Interview 9:30 AM to 11:00 AM)',
    a: 'Public Notice No. RTRMH/1/1/1/Estt.(03)/PF/2025-26/4048 dated 29.07.2026',
    q: 'MD / DNB / Diploma in Concerned Stream (Registered with DMC) OR MBBS + 2 Years Experience (OPD & IPD)',
    desc: 'Rao Tula Ram Memorial Hospital (RTRMH), Jaffarpur, Govt. of NCT of Delhi invites candidates for Walk-in Interview on 7th August 2026 for recruitment of 27 Senior Residents on adhoc basis across 9 medical specialties (Anesthesia: 3, Medicine: 4, Obs & Gynae: 7, Orthopedics: 4, Pediatrics: 5, Surgery: 1, Radiology: 1, Ophthalmology: 1, ENT: 1). Pay Scale 7th CPC Level-11 (Basic ₹67,700/pm plus allowances). Reporting time 09:30 AM to 11:00 AM at Conference Hall, Admn. Block, RTRM Hospital, Jaffarpur, New Delhi.',
    u: 'https://health.delhi.gov.in'
  },
  {
    id: 'niper-raebareli-it-assistant-recruitment-2026',
    b: 'National Institute of Pharmaceutical Education and Research (NIPER) Raebareli',
    t: 'IT Assistant Contractual Recruitment 2026 – 01 Post (Consolidated Salary ₹42,000/pm)',
    d: '31-07-2026',
    l: '24-08-2026 (5:00 PM Offline)',
    a: 'Advt. No. NIPER-R/Contractual Advt./01/2026/ dated 31.07.2026',
    q: 'B.Sc / B.E / B.Tech in Computer Science OR MCA + 3 Years Relevant Experience',
    desc: 'National Institute of Pharmaceutical Education and Research (NIPER) Raebareli invites offline hard copy applications for recruitment of IT Assistant on a purely contractual basis for a duration of 1 year. Consolidated salary ₹42,000/- per month. Download application form from www.niperraebareli.edu.in and submit by post/courier by 24th August 2026.',
    u: 'https://www.niperraebareli.edu.in'
  },
  {
    id: 'iaf-agniveervayu-non-combatant-intake-01-2027',
    b: 'Indian Air Force (IAF)',
    t: 'Agniveervayu Non-Combatant (Hospitality & Housekeeping Streams) Intake 01/2027 Recruitment – Various Posts',
    d: '31-07-2026',
    l: '17-08-2026 (Offline Application)',
    a: 'Intake 01/2027 under Agnipath Scheme',
    q: 'Class 10th / Matriculation Passed (Unmarried Male Candidates Born Between 01 Jan 2005 and 01 Jul 2009)',
    desc: 'Indian Air Force (IAF) invites offline applications from eligible unmarried male candidates for enrolment as Agniveervayu Non-Combatant in Hospitality and Housekeeping streams for Intake 01/2027 under Agnipath scheme. Class 10th passed candidates born between 01 Jan 2005 and 01 Jul 2009 can download application form from iafrecruitment.edcil.co.in and submit by 17th August 2026.',
    u: 'https://iafrecruitment.edcil.co.in'
  },
  {
    id: 'niper-guwahati-bionest-ceo-recruitment-2026',
    b: 'National Institute of Pharmaceutical Education and Research (NIPER) Guwahati',
    t: 'Bio-NEST Incubation Centre CEO – 01 Contractual Post (Consolidated Salary ₹1,00,000/pm)',
    d: '30-07-2026',
    l: '14-08-2026 (5:00 PM Online)',
    a: 'NIPERG/Project-Rectt./2026/05/Re/10 dated 30.07.2026',
    q: 'Ph.D in Life Sciences / Allied Sciences OR MBA / Master in Business Management + 5 to 10 Years Experience',
    desc: 'NIPER Guwahati invites online applications for recruitment of Chief Executive Officer (CEO) for Bio-NEST NIPER-Guwahati Incubation Centre funded by DBT-BIRAC. Consolidated salary ₹1,00,000/- per month. Apply online at niperguwahati.ac.in by 14th August 2026.',
    u: 'http://www.niperguwahati.ac.in'
  },
  {
    id: 'mpypil-management-recruitment-2026',
    b: 'Madhya Pradesh Yatri Parivahan and Infrastructure Limited (MPYPIL), Govt. of MP',
    t: 'Higher, Senior & Junior Management Posts – 399 Contractual Vacancies (Salary up to ₹2,06,808/pm)',
    d: '24-07-2026',
    l: '18-08-2026 (Online Application)',
    a: 'Rule Book Nos: MPYPIL/HR(02)/2026/602(a), 603(a) & 604(a) dated 24.07.2026',
    q: 'BE/B.Tech / MBA / MCA / Graduation / 12th / 11th / ITI + Relevant Experience (Retired Personnel Also Eligible)',
    desc: 'Madhya Pradesh Yatri Parivahan and Infrastructure Limited (MPYPIL), Bhopal invites online applications for 399 contractual positions across Higher Management (146 posts, pay up to ₹2.06 Lakh/pm), Senior Management (54 posts, pay ₹94,248/pm), and Junior Management & Police/Support Cadre (199 posts, pay ₹32,760 to ₹71,736/pm). Apply online via MPOnline Portal from 29th July to 18th August 2026.',
    u: 'https://iforms.mponline.gov.in'
  },
  {
    id: 'odisha-bhadrak-district-court-staff-recruitment-2026',
    b: 'Office of the District Judge, Bhadrak, Government of Odisha',
    t: 'District Court Bhadrak Junior Clerk, Stenographer, Junior Typist & Salaried Amin – 34 Posts',
    d: '28-07-2026',
    l: '28-08-2026 (5:00 PM by Speed Post / Drop Box)',
    a: 'Advertisement Dated 28th July 2026 (Memo No: 3314)',
    q: '+3 (Graduation) + DCA / Stenography / Typing OR Matric + Revenue Inspector Training (Salaried Amin)',
    desc: 'Office of the District Judge, Bhadrak (Odisha) invites offline applications in prescribed format for 34 Group C vacancies including Junior Clerk-cum-Copyist (19), Stenographer Grade-III (5), Junior Typist (5), and Salaried Amin (5). Scale of pay ranges from ₹19,900 to ₹81,100. Submit applications by Speed Post or drop box at Civil Courts Bhadrak by 28th August 2026.',
    u: 'https://bhadrak.dcourts.gov.in'
  },

  {
    id: 'hartron-haryana-junior-programmer-panel-recruitment-2026',
    b: 'Haryana State Electronics Development Corporation Ltd. (HARTRON), Govt. of Haryana',
    t: 'Junior Programmer Panel Recruitment 2026 – 547 Positions Across 23 Districts in Haryana',
    d: '30-07-2026',
    l: '09-08-2026 (Online Application)',
    a: 'Notification No: Hartron/ICTET/2026-27/03',
    q: 'Graduate + PGDCA/PDCA/PGDIT OR BCA / B.Sc (CS/IT) / MCA / M.Sc (CS/IT) / B.Tech / M.Tech / 3-Yr Diploma (55% marks)',
    desc: 'HARTRON invites online applications for empanelment of Junior Programmers on Job Work Basis across 23 districts in Haryana (Ambala, Gurugram, Faridabad, Hisar, Karnal, Rohtak, etc.) with monthly remuneration of ₹24,100/-. Candidates will undergo a 2-stage test (Domain Knowledge Test & Practical Test) with 1-month hands-on training. Apply online from 30th July to 9th August 2026 on hartron.org.in.',
    u: 'https://hartron.org.in'
  },

  {
    id: 'hp-hamirpur-retired-patwari-kanungo-recruitment-2026',
    b: 'Office of Deputy Commissioner, Hamirpur, District Hamirpur, Govt. of Himachal Pradesh',
    t: 'Retired Patwari & Kanungo Re-engagement – 21 Vacancies on ₹40,000/- Fixed Remuneration',
    d: '21-07-2026',
    l: '05-08-2026 (Offline Application)',
    a: 'Endst. No. DCH/Estt./Recruitment/2026-8552-73',
    q: 'Retired Patwari / Kanungo with minimum 5 years service in HP Revenue Department (Max age 65 years)',
    desc: 'Office of Deputy Commissioner, Hamirpur (HP) invites offline applications from retired Patwaris and Kanungos for re-engagement on remuneration basis across vacant Patwar Circles in District Hamirpur. Consolidated monthly remuneration is ₹40,000/-. Applicants must be under 65 years of age with 5 years minimum service experience. Submit completed form to DC Office Hamirpur by 5th August 2026.',
    u: 'https://hamirpur.nic.in'
  },
  {
    id: 'up-kgbv-bulandshahr-teacher-staff-recruitment-2026',
    b: 'Office of District Basic Education Officer, Bulandshahr, Govt. of Uttar Pradesh',
    t: 'Kasturba Gandhi Balika Vidyalaya Teacher & Non-Teaching Staff – 160 Contractual Posts',
    d: '25-07-2026',
    l: '10-08-2026 (5:00 PM by Reg. Post)',
    a: 'Notification No: 3115-23/2026-27 dated 25.07.2026',
    q: 'PG / Graduate + B.Ed / Training + TET (or Class 8th Pass for Class-IV / Intermediate for Clerks)',
    desc: 'Office of District Basic Education Officer, Bulandshahr (Samagra Shiksha, UP) invites offline applications from eligible female candidates for 160 contractual posts in 16 Upgraded KGBVs (Class 9-12) and Class 6-8 KGBVs. Posts include Principal (8), PGTs (48), Computer Teachers (8), Caretakers (8), Lab Assistants (24), Clerks (8), and support staff. Submit form by Registered Post to BSA Bulandshahr by 10th August 2026.',
    u: 'https://bulandshahar.nic.in'
  },

  {
    id: 'up-kgbv-banda-teacher-staff-recruitment-2026',
    b: 'Office of District Basic Education Officer, Banda, Govt. of Uttar Pradesh',
    t: 'Kasturba Gandhi Balika Vidyalaya Teacher & Staff Recruitment – 77 Contractual Posts',
    d: '25-07-2026',
    l: '08-08-2026 (5:00 PM by Reg. Post)',
    a: 'Notification No: 7071-09/2026-27 dated 25.07.2026',
    q: 'PG / Graduate + B.Ed + TET (or Class 8th Pass for Support Staff / Inter for Clerks)',
    desc: 'Office of District Basic Education Officer, Banda (Samagra Shiksha, UP) invites offline applications from eligible female candidates for 77 contractual posts across 4 upgraded KGBVs (Baberu, Badokhar Khurd, Bisanda, Naraini) and existing schools. Posts include Principal (4), PGTs (26), Computer Science (4), Caretakers (4), Lab Assistants (12), Clerks (6), and support staff. Apply by Registered Post to BSA Banda by 8th August 2026 (5:00 PM).',
    u: 'https://banda.nic.in'
  },

  {
    id: 'contai-subdivision-nulia-civil-defence-volunteer-2026',
    b: 'Office of Sub-Divisional Officer, Contai, Purba Medinipur, Govt. of West Bengal',
    t: 'Nulia Civil Defence Volunteer – 45 Vacancies (30 Male, 15 Female) on Daily Wage',
    d: '23-07-2026',
    l: '14-08-2026 (in Person at SDO Office)',
    a: 'Memo No: 47/DMS dated 23.07.2026',
    q: 'Madhyamik (10th) Pass + Mandatory Civil Defence Basic Training (Contai Residents Only)',
    desc: 'Office of Sub-Divisional Officer (SDO), Contai, Purba Medinipur (West Bengal) invites applications for 45 Nulia Civil Defence Volunteer positions (30 Male, 15 Female) on daily wage basis. Applicants must be permanent residents of Contai Sub-Division aged 18–38 years with Madhyamik pass and Civil Defence Basic Training. Submit filled form at SDO Office Contai by 14th August 2026.',
    u: 'https://purbamedinipur.gov.in'
  },
  {
    id: 'drdo-sspl-delhi-paid-internship-2026',
    b: 'Solid State Physics Laboratory (SSPL), DRDO, Ministry of Defence, Delhi',
    t: 'Paid Internship (6 Months) – 65 Vacancies in Advanced Semiconductor Research',
    d: '29-07-2026',
    l: '30-09-2026 (by Post)',
    a: 'Advertisement No: 625/HR/PaidInternship/2026/M/01',
    q: 'Ongoing B.E./B.Tech or M.Sc./M.Tech (Final Year / Last Semester Students Only)',
    desc: 'DRDO Solid State Physics Laboratory (SSPL), Timarpur, Delhi invites hard-copy applications from final-year B.E./B.Tech and M.Sc./M.Tech students for a 6-month Paid Internship in advanced semiconductor materials, MEMS, MMICs, laser diodes, and nanotechnology. Monthly stipend ₹5,000/-. Apply by post by 30th September 2026.',
    u: 'https://www.drdo.gov.in'
  },

  {
    id: 'drdo-sspl-delhi-apprentice-recruitment-2026',
    b: 'Solid State Physics Laboratory (SSPL), DRDO, Ministry of Defence, Delhi',
    t: 'ITI, Diploma & Graduate Apprentice Engagement – 41 Vacancies',
    d: '29-07-2026',
    l: '21-08-2026 (by Post)',
    a: 'Advertisement No: 625/HR/Apprentice/2026/M/02',
    q: '10th + ITI (First Div) / Diploma / Degree (Physics, Chem, Math, CS, Engg, BA, BCom passed in 2022-2026)',
    desc: 'DRDO Solid State Physics Laboratory (SSPL), Timarpur, Delhi invites offline applications for 41 ITI, Diploma, and Graduate Apprentice posts for 12 months training. Candidates must register on NATS/NAPS portal and send filled application form by post to DRDO SSPL Delhi by 21st August 2026.',
    u: 'https://nats.education.gov.in'
  },

  {
    id: 'farrukhabad-anganwadi-helper-recruitment-2026',
    b: 'District Programme Officer, Farrukhabad, Dept of Women & Child Development, UP',
    t: 'Contractual Anganwadi Helper – 140 Posts across 8 Urban/Rural ICDS Projects',
    d: '29-07-2026',
    l: '19-08-2026',
    a: 'DPO Farrukhabad Anganwadi Bharti Notice dated 29.07.2026',
    q: 'Intermediate / Class 12 Passed (Local Female Ward/Village Residents)',
    desc: 'Office of District Programme Officer, Farrukhabad (Uttar Pradesh) invites online applications from eligible local female candidates for 140 contractual Anganwadi Helper vacancies across 8 Urban/Rural ICDS projects (Badhpur, Shamshabad, City, Kamalganj, Kayamganj, Nawabganj, Rajepur, Mohammadabad). Apply online via upanganwadibharti.in by 19th August 2026.',
    u: 'https://upanganwadibharti.in'
  },
  {
    id: 'hyderabad-anganwadi-teacher-recruitment-2026',
    b: 'Dept. of Women, Children, Disabled & Senior Citizens Welfare, Hyderabad District',
    t: 'Main Anganwadi Teachers – 181 Posts across 5 ICDS Projects',
    d: '27-07-2026',
    l: '22-08-2026 (5:00 PM)',
    a: 'Notification No: 1170-1/E.O.II/2026 dated 27.07.2026',
    q: 'Intermediate / Class 12 Passed (Local Female Ward Residents)',
    desc: 'Department of Women, Children, Disabled and Senior Citizens Welfare, Hyderabad District invites online applications from eligible local female candidates for 181 Main Anganwadi Teacher posts across 5 ICDS projects (Charminar, Golconda, Khairatabad, Nampally, Secunderabad). Apply online via wdcw.tg.nic.in by 22nd August 2026.',
    u: 'http://wdcw.tg.nic.in'
  },

  {
    id: 'baloda-bazar-district-court-recruitment-2026',
    b: 'Office of the Principal District & Sessions Judge, Baloda Bazar (Chhattisgarh)',
    t: 'Stenographer Grade-3 (Hindi/English) & Assistant Grade-3 Cadre – 18 Posts',
    d: '23-07-2026',
    l: '14-08-2026 (5:30 PM)',
    a: 'No. 2057/II-12-17/2013 dated 23.07.2026',
    q: 'Graduation + Hindi/English Shorthand/Typing + 1-Year Computer Diploma (Native CG Residents)',
    desc: 'Office of the Principal District & Sessions Judge, Baloda Bazar (Chhattisgarh) invites offline applications for 18 posts including Stenographer Grade-3 Hindi (1), Stenographer Grade-3 English (2), and Assistant Grade-3 Cadre (15). Drop filled application in the box at Baloda Bazar Court by 14th August 2026 (5:30 PM).',
    u: 'https://districts.ecourts.gov.in/balodabazar'
  },

  {
    id: 'jamui-dcpu-pocso-support-person-2026',
    b: 'District Child Protection Unit (DCPU), Collectorate Jamui, Govt. of Bihar',
    t: 'Support Person under POCSO Act – 15 Empanelment Posts',
    d: '24-04-2026',
    l: '15-07-2026 (5:00 PM)',
    a: 'Advertisement No. 02/2026 (Guideline Letter Nos. 748 & 749)',
    q: 'PG in MSW/Sociology/Psychology/Child Dev OR Graduate + Child Rights Diploma + 3 Yrs Exp',
    desc: 'Assistant Director, District Child Protection Unit (DCPU), Jamui (Bihar) invites offline applications for empanelment on 15 temporary posts of Support Person under the POCSO Act 2012. Submit filled form via Speed Post or Registered Post to DCPU Office Jamui by 15th July 2026 (5:00 PM). Honorarium: ₹9,000/- per case.',
    u: 'https://jamui.nic.in'
  },
  {
    id: 'tslprb-constable-firemen-warder-recruitment-2026',
    b: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    t: 'SCT Police Constable (Civil/AR/SAR CPL/SPF), Fire Fighter & Warder – 7,112 Posts',
    d: '29-07-2026',
    l: 'To Be Announced (Online Portal)',
    a: 'Rc No. 189 / Rect. / Rect-2 / 2026 dated 29.07.2026',
    q: 'Intermediate (10+2) or equivalent (Valid LMV driving license for Fire Fighter)',
    desc: 'TSLPRB invites online applications for 7,112 vacancies including Police Constable Civil (3,697), AR (1,052), SAR CPL (24), SPF Constable (1,380), Fire Fighter (751), Warder Male (196), and Warder Female (12). Apply online via www.tgprb.in.',
    u: 'https://www.tgprb.in'
  },

  {
    id: 'medchal-malkajgiri-anganwadi-teacher-helper-2026',
    b: 'Dept. of Women, Children, Disabled & Senior Citizens Welfare, Medchal-Malkajgiri District',
    t: 'Anganwadi Teacher (AWT), Mini Teacher & Anganwadi Helper (AWH) – 62 Posts',
    d: '27-07-2026',
    l: '05-08-2026 (5:00 PM)',
    a: 'Recruitment Notification dated 27.07.2026',
    q: '10th / 12th Class for Teacher | 8th / 10th Class for Helper (Local Female Residents)',
    desc: 'District Welfare Officer, Medchal-Malkajgiri District (Telangana) invites online applications from eligible local female candidates for 62 posts of Anganwadi Teacher (18), Mini Anganwadi Teacher (20), and Anganwadi Helper (24). Apply online at mis.tgwdcw.in by 5th August 2026.',
    u: 'https://mis.tgwdcw.in'
  },

  {
    id: 'sant-kabir-nagar-anganwadi-worker-recruitment-2026',
    b: 'Child Development Services & Nutrition, District Sant Kabir Nagar, Govt. of Uttar Pradesh',
    t: 'Anganwadi Workers (Female Contractual) – 192 Posts across 10 ICDS Projects',
    d: '29-07-2026',
    l: '20-08-2026 (12:00 Midnight)',
    a: 'Contractual Anganwadi Worker Notification dated 29.07.2026',
    q: 'Intermediate (10+2) or equivalent (Female Residents of Gram Sabha/Ward)',
    desc: 'District Programme Officer, Sant Kabir Nagar (UP) invites online applications from eligible female candidates for 192 contractual posts of Anganwadi Workers across 10 ICDS projects. Apply online at upanganwadibharti.in by 20th August 2026.',
    u: 'https://upanganwadibharti.in'
  },
  {
    id: 'ramanagara-district-court-typist-peon-2026',
    b: 'Principal District and Sessions Court, Ramanagara (Bengaluru South District Judiciary)',
    t: 'Typists, Typist-Copyists, Process Servers & Peons – 55 Posts',
    d: '24-07-2026',
    l: '31-08-2026',
    a: 'Notification No. ADM/15/2026 dated 24.07.2026',
    q: '2nd PUC / Diploma / SSLC + Typewriting (Kannada & English) / Computer Knowledge',
    desc: 'Principal District and Sessions Court, Bengaluru South District, Ramanagara invites online applications for 55 vacant posts of Typists (10), Typist-Copyists (1), Process Servers (10), and Peons (34). Apply online via official court portal from 30.07.2026 to 31.08.2026 till 11:59 PM.',
    u: 'https://ramanagara.dcourts.gov.in/online-recruitment/'
  },

  {
    id: 'hapur-anganwadi-worker-helper-recruitment-2026',
    b: 'Child Development Services & Nutrition, District Hapur, Govt. of Uttar Pradesh',
    t: 'Anganwadi Workers & Anganwadi Helpers (Female) – 317 Posts',
    d: '28-07-2026',
    l: '18-08-2026',
    a: 'Letter No. (-541/Dist.P.O./A.W. Appt/2026-27)',
    q: 'Intermediate (10+2) for Worker | 10th Pass for Helper (Female Residents)',
    desc: 'District Programme Officer, Child Development Services & Nutrition, District Hapur (UP) invites online applications from eligible female candidates for 317 honorarium-based posts of Anganwadi Workers (120) and Anganwadi Helpers (197) across 4 rural projects. Apply online at upanganwadibharti.in by 18th August 2026.',
    u: 'https://upanganwadibharti.in'
  },

  {
    id: 'yadgir-anganwadi-worker-helper-recruitment-2026',
    b: 'Women and Child Development Department, Yadgir, Govt. of Karnataka',
    t: 'Anganwadi Workers & Anganwadi Helpers (Women & Transgender) – 232 Posts',
    d: '23-07-2026',
    l: '24-08-2026',
    a: 'No. Uniya/WCD/AWW/AWH/Recruitment/01/2026-27',
    q: 'PUC (10+2) for Worker | SSLC (10th) for Helper (With Kannada Language)',
    desc: 'Deputy Director, Women and Child Development Department, Yadgir District (Karnataka) invites online applications from eligible female and transgender female candidates for 232 honorary posts of Anganwadi Workers (61) and Anganwadi Helpers (171) across 4 project areas. Apply online by 24th August 2026.',
    u: 'https://yadgir.nic.in'
  },
  {
    id: 'tslprb-si-asi-constable-recruitment-2026',
    b: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    t: 'Sub Inspector (SI), ASI (Fingerprint Bureau) & Constable (Mechanic/Driver) – 325 Posts',
    d: '29-07-2026',
    l: 'To Be Announced (Online Portal)',
    a: 'Notification Nos. 225, 279 & 234/Rect./2026 dated 29-07-2026',
    q: 'Degree / B.E / B.Tech / B.Sc (CS) / 10th / Intermediate + ITI / Driving License',
    desc: 'Telangana State Level Police Recruitment Board (TSLPRB) invites online applications for 325 posts including SCT Sub Inspector (Civil/AR/SAR CPL/TGSP/SPF), Station Fire Officer, Deputy Jailor, ASI Fingerprint Bureau, and Police Constable (Mechanic & Driver). Apply online via www.tgprb.in.',
    u: 'https://www.tgprb.in'
  },

  {
    id: 'dsh-kadapa-theatre-assistant-gda-recruitment-2026',
    b: 'Directorate of Secondary Health (DSH), Kadapa, Govt. of Andhra Pradesh',
    t: 'Theatre Assistant & GDA / MNO / FNO (Outsourcing) – 11 Posts',
    d: '28-07-2026',
    l: '04-08-2026',
    a: 'Notification No. 02/2026',
    q: '10th Pass (SSC or Equivalent)',
    desc: 'District Co-Ordinator of Hospital Services (DSH), Kadapa, YSR Kadapa District invites offline applications for 11 posts of Theatre Assistant and GDA/MNO/FNO on outsourcing basis for a period of one year in DSH Hospitals. Apply in person or by registered post by 04th August 2026 (05:00 PM).',
    u: 'https://kadapa.ap.gov.in'
  },

  {
    id: 'sjvn-executive-recruitment-2026',
    b: 'SJVN Limited (A Navratna CPSE - Govt of India & Govt of HP)',
    t: 'Chief General Manager, Dy. Manager & Engineer – 21 Executive Posts',
    d: '30-07-2026',
    l: '26-08-2026',
    a: 'Advt. No. 127/2026',
    q: 'B.E / B.Tech (Mechanical, Electrical, C&I, Chemical) / M.Sc Chemistry + Executive Exp',
    desc: 'SJVN Limited, a Navratna CPSE, invites online applications from experienced professionals for 21 Executive posts (Chief General Manager, Deputy Manager, and Engineer) for its subsidiary STPL 1320 MW Buxar Thermal Power Project in Bihar. Apply online from 05th August to 26th August 2026.',
    u: 'https://www.sjvn.nic.in'
  },

  {
    id: 'railtel-apprentice-recruitment-2026',
    b: 'RailTel Corporation of India Ltd. (RCIL)',
    t: 'Graduate & Diploma Engineer Apprentices – 40 Posts',
    d: '28-07-2026',
    l: '27-08-2026',
    a: 'Advt. No. RCIL/2024/P&A/27/1',
    q: 'B.E/B.Tech, Diploma in Engineering (ECE, CSE, EE, IT, EEE)',
    desc: 'RailTel Corporation of India Ltd. (RCIL), a Navratna PSU under Ministry of Railways, invites online applications for 40 Graduate & Diploma Engineer Apprentice posts under Apprentices Act 1961. Apply online via NATS 2.0 portal by 27th August 2026.',
    u: 'https://nats.education.gov.in'
  },

  {
    id: 'skau-kurukshetra-non-teaching-recruitment-2026',
    b: 'Shri Krishna AYUSH University, Kurukshetra (Haryana)',
    t: 'Staff Nurse, Ayurvedic Pharmacist & Clerk – 60 Posts',
    d: '29-07-2026',
    l: '21-08-2026',
    a: 'Advt. No. NT-01/2026 to 03/2026',
    q: '12th Pass, Diploma, B.Sc Nursing, GNM, Graduation',
    desc: 'Shri Krishna AYUSH University, Kurukshetra invites online applications for 60 non-teaching & para-medical posts (Staff Nurse, Ayurvedic Pharmacist, Clerk). Apply by 21st August 2026.',
    u: 'https://recruitment.skau.ac.in/nonteaching/'
  },

  {
    id: 'nlcil-apprentice-recruitment-2026',
    b: 'NLC India Limited (NLCIL)',
    t: 'Graduate, Diploma, ITI & Non-Engineering Apprentices – 1235 Posts',
    d: '29-07-2026',
    l: '11-08-2026',
    a: 'Advt. No. L&DC/02/2026 & L&DC/03/2026',
    q: 'ITI, Diploma, B.E/B.Tech, B.Com, B.Sc, BCA, BBA, B.Pharm, B.Sc Nursing',
    desc: 'NLCIL Neyveli invites online applications for 1235 Apprenticeship slots for PAP Wards, NLCIL Employee & Contract Wards/Spouses.',
    u: 'https://www.nlcindia.in'
  },

  {
    id: 'kea-karnataka-grama-adhikari-vao-recruitment-2026',
    b: 'Karnataka Examinations Authority (KEA) / Revenue Department',
    t: 'Grama Adhikari (Village Administrative Officer - VAO) – 572 Posts',
    d: '29-07-2026',
    l: '07-08-2026',
    a: 'ED/KEA/26/REC-V/2026 (RPC) & ED/KEA/27/REC-V/2026 (KK)',
    q: '12th Pass / PUC / Diploma',
    desc: 'KEA invites online applications for direct recruitment of 572 Group-C Grama Adhikari (Village Administrative Officer) posts in Revenue Dept across 21 districts. Last date extended to 07.08.2026.',
    u: 'https://cetonline.karnataka.gov.in/kea/'
  },

  {
    id: 'tnstc-apprentice-recruitment-2026',
    b: 'Tamil Nadu State Transport Corporation (TNSTC)',
    t: 'Graduate, Diploma & Non-Engineering Apprentices – 1518 Posts',
    d: '29-07-2026',
    l: '28-08-2026',
    a: 'Apprenticeship Act Notification 2026-27',
    q: 'B.E/B.Tech, Diploma, BA/B.Sc/B.Com/BBA/BCA',
    desc: 'TNSTC, MTC & SETC Tamil Nadu invite online applications for 1518 Graduate, Diploma, and Non-Engineering Apprentice slots across various regions.',
    u: 'https://nats.education.gov.in'
  },
  {
    id: 'isro-ursc-apprentice-recruitment-2026',
    b: 'U R Rao Satellite Centre (URSC), ISRO Bengaluru',
    t: 'Graduate, Technician (Diploma) & Commercial Practice Apprentices – 410 Posts',
    d: '29-07-2026',
    l: '28-08-2026',
    a: 'URSC:03:2026',
    q: 'B.E/B.Tech, Diploma in Engineering/Commercial Practice',
    desc: 'ISRO URSC Bengaluru invites online applications for 410 Graduate, Technician, and Commercial Practice Apprentice slots for 1-year training.',
    u: 'https://web.umang.gov.in/landing/'
  },
  {
    id: 'nhm-janjgir-champa-recruitment-2026',
    b: 'District Health Society, NHM Janjgir-Champa (Chhattisgarh)',
    t: 'CHO, Staff Nurse, Radiographer, Lab Tech & Various Contractual Posts – 66 Posts',
    d: '29-07-2026',
    l: '10-08-2026',
    a: 'N.H.M./2026-27/5533',
    q: '8th, 10th, 12th, ANM, GNM, B.Sc Nursing, Diploma, BDS, Graduation',
    desc: 'NHM Janjgir-Champa invites applications for 66 contractual positions including CHO, Staff Nurse, Lab Technician, Radiographer, and Support Staff.',
    u: 'https://janjgir-champa.gov.in'
  },

  {
    id: 'hal-design-management-trainee-2026',
    b: 'Hindustan Aeronautics Limited (HAL)',
    t: 'Design Trainee & Management Trainee – 120 Posts',
    d: '29-07-2026',
    l: '14-08-2026',
    a: 'HAL/CHRC-TM/RECT-02/2026',
    q: 'B.E. / B.Tech',
    desc: 'Hindustan Aeronautics Limited (HAL) invites online applications for 120 posts of Design Trainees and Management Trainees across various engineering disciplines.',
    u: 'https://www.hal-india.co.in'
  },
  {
    id: 'bpcl-non-management-recruitment-2026',
    b: 'Bharat Petroleum Corporation Limited (BPCL)',
    t: 'Process Technician, Operator & Technician – 154 Posts',
    d: '29-07-2026',
    l: '13-08-2026',
    a: 'BPCL.HR.ER.03.NMGT.RECT',
    q: 'Diploma in Engineering',
    desc: 'BPCL invites online applications for 154 Non-Management posts (Process Technician, Operator, Technician) at Mumbai and Kochi Refineries.',
    u: 'https://www.bharatpetroleum.com'
  },
  {
    id: 'dhas-delhi-senior-resident-2026',
    b: 'Dr. Hedgewar Arogya Sansthan (DHAS), Delhi',
    t: 'Senior Resident (Ad-hoc) – 16 Posts',
    d: '29-07-2026',
    l: '03-08-2026',
    a: 'No.F.1/24/2026/APP/SR/DHAS/ESTT/7513',
    q: 'MBBS with PG Degree/Diploma/DNB',
    desc: 'Dr. Hedgewar Arogya Sansthan, Delhi invites eligible candidates for a Walk-in Interview to fill 16 Senior Resident posts on an ad-hoc basis.',
    u: 'https://health.delhi.gov.in'
  },

  {
    id: 'dudc-bidar-pourakarmika-recruitment-2026',
    u: 'https://bidar.nic.in',
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
    u: '#',
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
    u: '#',
    b: 'UMED - Maharashtra State Rural Livelihoods Mission (MSRLM), Solapur',
    t: 'IFC Block Anchor & Senior CRP – 17 Posts',
    d: '29-07-2026',
    l: '07-08-2026',
    a: '–',
    q: '12th Pass / Agri Degree',
    desc: 'Contractual recruitment for IFC Block Anchor and Senior CRP positions under UMED MSRLM.'
  },

  { id: 'uppsc-pcs-combined-state-services-2026', d: '28 jul 2026', b: 'Uttar Pradesh Public Service Commission (UPPSC)', t: 'Combined State / Upper Subordinate Services (PCS) Examination 2026 – ~500 Posts', q: 'Bachelor\'s Degree in any discipline from recognized University (Postgraduate / specific degree for specialized posts)', a: 'Advt. No. A-1/E-1/2026 Dated: 25/06/2026', l: '03-08-2026', u: 'https://uppsc.up.nic.in', desc: 'Uttar Pradesh Public Service Commission (UPPSC), Prayagraj invites online applications via OTR for ~500 posts under Combined State / Upper Subordinate Services (PCS) 2026 including SDM, DSP, BDO, ARTO, BSA, Treasury Officer & Naib Tehsildar. Apply online via uppsc.up.nic.in. Fee payment till 27 July & correction till 03 August 2026.' },
  { id: 'verka-milkfed-punjab-deputy-manager-2026', d: '28 jul 2026', b: 'The Punjab State Cooperative Milk Producers\' Federation Ltd. (Verka / MILKFED)', t: 'Deputy Manager (Marketing, HR, Finance, Production, QA, Engineering, Civil, MIS, Animal Husbandry) – 169 Posts', q: 'MBA / B.Tech / M.Tech / CA / ICWA / M.Sc / B.VSc & AH + Punjabi up to Matric Standard compulsory', a: 'MILKFED RECRUITMENT NOTICE (Deputy Manager 2026)', l: '25-08-2026', u: 'https://verka.coop/career/', desc: 'The Punjab State Cooperative Milk Producers\' Federation Ltd. (Verka / MILKFED Punjab) invites online applications for 169 Deputy Manager posts across 15 disciplines. Minimum Basic Pay ₹56,100/- during 2-year probation. Apply online via verka.coop/career/ from 05th to 25th August 2026.' },
  { id: 'patna-high-court-ex-cadre-assistant-2026', d: '28 jul 2026', b: 'High Court of Judicature at Patna (Patna High Court)', t: 'Ex-Cadre Assistant (Group-C Post) – 68 Posts', q: 'Graduation in any discipline + Min 6-Month Diploma/Certificate in Computer Application', a: 'Advt No. PHC/03/2026 dated 23/07/2026', l: '27-08-2026', u: 'https://patnahighcourt.gov.in', desc: 'High Court of Judicature at Patna (Patna High Court), Bihar invites online applications for 68 posts of Ex-Cadre Assistant (Group-C). Pay Level-4 (₹25,500 - ₹81,100). Apply online via patnahighcourt.gov.in from 28th July to 27th August 2026.' },
  { id: 'aiims-gorakhpur-senior-resident-2026', d: '28 jul 2026', b: 'All India Institute of Medical Sciences (AIIMS Gorakhpur)', t: 'Senior Resident (Anaesthesiology, Medicine, Surgery, Trauma, Radiology, Ortho, etc.) – 50 Posts', q: 'PG Medical Degree (MD / MS / DNB) in respective specialty discipline + NMC / MCI Registration', a: 'Advt No. AIIMS/GKP/RECT/SR/2026-27/169 dated 28/07/2026', l: '04-08-2026', u: 'http://www.aiimsgorakhpur.edu.in', desc: 'AIIMS Gorakhpur invites applications via Google Form for 50 Senior Resident posts in Level-11 (₹67,700 + NPA). Submit Google Form by 04th August 2026 (10 AM) and attend Walk-In Interview on 04th August 2026 at Admin Block, AIIMS Gorakhpur.' },
  { id: 'nitt-graduate-diploma-apprentice-2026', d: '28 jul 2026', b: 'National Institute of Technology Tiruchirappalli (NIT Trichy)', t: 'Graduate & Diploma Apprentice Trainees – 24 Posts', q: 'B.E / B.Tech / Diploma in Engineering (Registered on NATS within 3 years of passing)', a: 'F. No. NITT/R/RC/Apprentice/2026/1 dated 24/07/2026', l: '04-08-2026', u: 'https://nats.education.gov.in', desc: 'NIT Tiruchirappalli (NITT), Tamil Nadu invites online applications from Graduate and Diploma holders for 24 One-Year Apprentice Trainee positions under NATS. Monthly stipend ₹15,000 for Graduates & ₹14,000 for Diploma holders. Apply online via NATS portal by 04th August 2026.' },
  { id: 'aai-kolkata-nscbi-apprentice-2026', d: '28 jul 2026', b: 'Airports Authority of India (AAI NSCBI Airport Kolkata)', t: 'Graduate, Diploma & ITI Trade Apprentices – 38 Posts (WB Domiciles)', q: 'B.E/B.Tech / Diploma (Civil, Elec, ECE, IT, Tech) / ITI (Elec, Mech, COPA) Passed in 2022 or later', a: '1/2026/AAC/APPRENTICE-GRADUATE/DIPLOMA/ITI(TRADE)/AAI-NSCBI AIRPORT', l: '24-08-2026', u: 'https://nats.education.gov.in', desc: 'Airports Authority of India (AAI), Netaji Subhash Chandra Bose International (NSCBI) Airport, Kolkata invites online applications from West Bengal domiciles for 38 One-Year Apprentice posts (Graduate, Diploma, ITI Trade) in Civil, Electrical, ECE, IT, Technical & COPA. Apply online via NATS / NAPS portals by 24th August 2026.' },
  { id: 'rtmnu-nagpur-assistant-professor-contractual-2026', d: '28 jul 2026', b: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)', t: 'Assistant Professor (Contractual Basis) – 139 Posts', q: 'Master\'s Degree (Min 55%) + NET / SET or Ph.D in relevant subject / B.E/B.Tech/M.E/M.Tech / B.Pharm/M.Pharm / MBA', a: 'Advt. No. RTMNU/GA/657 dated 24/07/2026', l: '10-08-2026', u: 'https://www.nagpuruniversity.ac.in', desc: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU), Nagpur invites online applications for 139 temporary posts of Assistant Professor (Contractual) across Humanities, Social Sciences, Science & Tech, Commerce & Management, Fine Arts, Education, Law, and Specialized Centers on ₹40,000/month salary. Apply online by 10th August 2026.' },
  { id: 'up-bulandshahr-anganwadi-recruitment-2026', d: '27 jul 2026', b: 'District Program Office Bulandshahr, WCD Uttar Pradesh', t: 'Anganwadi Worker (255) & Anganwadi Helper (423) – 678 Posts', q: '12th (Intermediate) Pass (Female candidates resident of same Gram Sabha / Ward)', a: 'Vigyapti/2026-27 dated 24/07/2026', l: '14-08-2026', u: 'https://upanganwadibharti.in', desc: 'Office of District Program Officer Bulandshahr, Dept of Women & Child Development UP invites online applications for 678 posts of Anganwadi Worker and Anganwadi Helper. Apply online via upanganwadibharti.in by 14th August 2026.' },
  { id: 'tumakuru-district-court-stenographer-typist-2026', d: '27 jul 2026', b: 'Principal District & Sessions Court, Tumakuru, Karnataka', t: 'Stenographer Grade-III (10 Posts) & Typist (14 Posts) – 24 Posts', q: '2nd PUC / 3-Year Diploma in Commercial Practice + Senior Grade Kannada & English Typewriting / Shorthand', a: 'Advt No. ADM-I- 144/2026 dated 22/07/2026', l: '24-08-2026', u: 'https://tumakuru.dcourts.gov.in', desc: 'District & Sessions Court Tumakuru invites online applications for 24 posts of Stenographer Grade-III and Typist. Pay scale up to Rs. 83,700/-. Apply online from 25th July to 24th August 2026.' },
  { id: 'rail-wheel-factory-bangalore-sports-quota-2026', d: '27 jul 2026', b: 'Rail Wheel Factory (RWF) Yelahanka, Ministry of Railways', t: 'Sports Quota Posts (Level-2: 10, Level-1: 5) – 15 Posts', q: '10th Pass / ITI / NAC or 12th Pass (+2 Stage) + Active Sports Achievements', a: 'Advt No. RWF/RC-101/996 dated 25/07/2026', l: '24-08-2026', u: 'https://rwf.indianrailways.gov.in', desc: 'Rail Wheel Factory (RWF) Yelahanka, Bangalore invites offline applications against Sports Quota 2025-26 / 2026-27 for 15 posts in Level-2 and Level-1 in Badminton, Table Tennis, Cricket, Hockey, Football & Kabaddi. Apply offline by 24th August 2026.' },
  { id: 'pmmh-delhi-senior-resident-2026', d: '27 jul 2026', b: 'Pt. Madan Mohan Malaviya Hospital (PMMMH), Govt. of NCT of Delhi', t: 'Senior Resident (Radiology, Anesthesia, Obs & Gynae, Surgery, Medicine, Microbiology) – 10 Posts', q: 'MBBS with PG Degree / Diploma or Non-PG with 2 Yrs Exp + DMC Registration', a: 'Advt No. 08/2026 (F.1(9)302/Pt.MMMH/PF-10/SR/24/8122)', l: '30-07-2026', u: 'https://docs.google.com/forms/d/e/1FAIpQLSfl4LGQLdMMabMoTmF14xlwMmF-DFNtbzgRz4ijnXy29hhrsw/viewform', desc: 'Pt. Madan Mohan Malaviya Hospital (Govt. of NCT of Delhi), Malviya Nagar invites online registration and walk-in-interview for 10 Senior Resident posts on adhoc basis. Walk-in on 30th July 2026.' },
  { id: 'isro-mcf-hassan-apprentice-2026', d: '27 jul 2026', b: 'Master Control Facility (MCF), ISRO, Hassan', t: 'Graduate & Technician Apprentices (Engineering, Library Sci, BA, B.Com, B.Sc, Diploma) – 45 Posts', q: 'BE / B.Tech / Graduation (BA, B.Com, B.Sc, Library Sci) / Diploma in Engineering & Commercial Practice (Passed 2022 to 2026)', a: 'Circular No. MCF:ADMIN:02/10/03 dated 13/07/2026', l: '03-08-2026', u: 'https://www.mcf.gov.in', desc: 'Master Control Facility (MCF), ISRO Hassan invites offline/email applications for 45 Graduate and Technician Apprenticeship Trainees for 1-year training. Apply via email before 03rd August 2026.' },
  { id: 'daman-government-college-guest-lecturer-2026', d: '27 jul 2026', b: 'Government College Daman, UT Administration of DNH & Daman & Diu', t: 'Guest Lecturers (Botany, Chemistry, English, Mathematics, Zoology) – 12 Posts', q: 'Post Graduate Degree (55%) in relevant subject with NET / SET / SLET or Ph.D.', a: 'Advt No. GC/DMN/Guest Lecturers/2026-27/560 dated 24/07/2026', l: '06-08-2026', u: 'https://www.govtcollegedaman.ac.in', desc: 'Government College Daman (UT Administration of Dadra & Nagar Haveli and Daman & Diu) invites walk-in-interview applications for 12 Guest Lecturer posts in Botany, Chemistry, English, Maths, and Zoology. Walk-in on 06th August 2026.' },
  { id: 'rajasthan-safai-karmchari-recruitment-2026', d: '27 jul 2026', b: 'Local Self Government Department (DLB), Rajasthan', t: 'Safai Karmchari (Contractual) – 24,752 Posts in 183 Urban Local Bodies', q: 'Native Resident of Rajasthan + Min 01 Year Cleaning Work Experience in ULB/Govt', a: 'Advt No. 01/2026 dated 27/07/2026', l: '28-09-2026', u: 'https://sso.rajasthan.gov.in', desc: 'Department of Local Self Government (DLB), Rajasthan invites online applications for 24,752 Safai Karmchari posts across 183 Urban Local Bodies. Apply online via SSO Portal from 15th August to 28th September 2026.' },
  { id: 'assam-allied-healthcare-council-member-2026', d: '27 jul 2026', b: 'Assam Allied and Healthcare Council (DME Assam)', t: 'Part-Time Council Members (11 Healthcare Categories) – 22 Posts', q: 'Postgraduate / Graduate / Diploma in Allied Health Discipline + 10 Years Experience', a: 'Advt No. DME/AAHC/2026/87 dated 24/07/2026', l: '08-08-2026', u: 'http://www.dmeassam.gov.in', desc: 'Assam Allied and Healthcare Council (DME Assam) invites offline applications for nomination of 22 Part-Time Members across 11 professional categories. Apply within 15 days of notification.' },
  { id: 'nalco-medical-officer-specialist-2026', d: '27 jul 2026', b: 'National Aluminium Company Limited (NALCO)', t: 'Medical Officer (E02) & Specialist Doctors (E02 & E03) – 06 Posts', q: 'MBBS / MD / MS / Post-MBBS Diploma in Respective Discipline + Relevant Experience', a: 'Advt No. 10260301 dated 20/07/2026', l: '17-08-2026', u: 'https://mudira.nalcoindia.co.in/Account/LoginBTv2.aspx?ReturnUrl=%2f', desc: 'National Aluminium Company Limited (NALCO), a Navratna Central PSU, invites online applications for Medical Officer (E02) and Specialist (E02 & E03) posts. No application fee. Apply online by 17th August 2026.' },
  { id: 'isro-assistant-jpa-udc-stenographer-2026', d: '27 jul 2026', b: 'Indian Space Research Organisation (ISRO) – ICRB', t: 'Assistants, Junior Personal Assistants, Upper Division Clerks & Stenographers – 244 Posts', q: 'Graduation (Min 60% / CGPA 6.32) / Diploma in Secretarial Practice + Steno (60 wpm) + Computer Proficiency', a: 'Advt No. ISRO:ICRB:01(A-JPA):2026 dated 27-07-2026', l: '16-08-2026', u: 'https://cdn.digialm.com//EForms/configuredHtml/1258/101396//Index.html', desc: 'ISRO Centralised Recruitment Board (ICRB) invites online applications for 244 posts of Assistants, Junior Personal Assistants (JPA), Upper Division Clerks (UDC), and Stenographers. Apply online by 16th August 2026.' },
  { id: 'avnl-recruitment-2026', d: '27 jul 2026', b: 'Armoured Vehicles Nigam Limited (AVNL)', t: 'Junior Technician, Junior Manager, Assistant Manager, Deputy Manager & More – 1213 Posts', q: 'NCVT ITI / NTC / NAC (Electrician, Fitter, Machinist, Welder, MMTM, QA, etc.) / B.E/B.Tech / MBA / MCA / CA / Degree', a: 'Advt. No. AVNL/CO/HR/2026/06', l: '25-08-2026', u: 'https://cdn.digialm.com//EForms/configuredHtml/1258/100934//Index.html', desc: 'Armoured Vehicles Nigam Limited (AVNL), Ministry of Defence invites online applications for 1213 posts of Junior Technician (1005) and Executive positions (208) on Fixed Term Employment. Apply online by 25th August 2026.' },
  { id: 'spmcil-deputy-manager-assistant-manager-2026', d: '25 jul 2026', b: 'Security Printing and Minting Corporation of India Limited (SPMCIL)', t: 'Deputy Manager (IT) & Assistant Manager (HR, F&A, MM, IT, OL, Safety) – 24 Posts', q: 'B.E/B.Tech (CS/IT/ECE/Mech/Elec/Printing) / MCA / MBA / CA / ICWA / Master\'s (Hindi/Eng)', a: 'Advertisement No. 02/2026', l: '24-08-2026', u: 'https://www.spmcil.com', desc: 'SPMCIL (Mini-Ratna PSU under Ministry of Finance) invites online applications for 24 Deputy Manager (IT) and Assistant Manager (HR, Finance, Materials, IT, OL, Safety) posts. Apply online by 24th August 2026.' },
  { id: 'esic-bhubaneswar-faculty-senior-resident-medical-officer-2026', d: '24 jul 2026', b: 'ESIC Medical College & Hospital, Bhubaneswar (Odisha)', t: 'Teaching Faculty, Senior Resident & Medical Officer – 122 Posts (Walk-In)', q: 'MBBS / MD / MS / DNB / DM / M.Ch in relevant specialty (NMC / MCI registered)', a: 'Advertisement No. 01 of 2026', l: '05-08-2026', u: 'https://www.esic.gov.in', desc: 'ESIC Medical College & Hospital, Bhubaneswar invites candidates for Walk-In-Interviews on 3rd & 5th August 2026 for 122 contractual posts of Teaching Faculty (Professor, Associate & Assistant Professor), Senior Resident, and Medical Officer.' },
  { id: 'esic-varanasi-faculty-senior-resident-tutor-2026', d: '24 jul 2026', b: 'ESIC Medical College & Hospital, Pandeypur, Varanasi', t: 'Teaching Faculty, Senior Resident & Tutor – 59 Posts (Walk-In)', q: 'MBBS / MD / MS / DNB / DM / M.Ch in relevant specialty (NMC / MCI registered)', a: 'Advertisement No. 04/2025', l: '05-08-2026', u: 'https://www.esic.gov.in', desc: 'ESIC Medical College & Hospital, Varanasi invites applications for 59 contractual posts of Professor, Assoc Prof, Asst Prof, Senior Resident, and Tutor across 20 medical disciplines. Email application form by 3rd August and walk-in on 4th & 5th August 2026.' },
  { id: 'manit-bhopal-assistant-professor-faculty-2026', d: '14 jul 2026', b: 'Maulana Azad National Institute of Technology (MANIT) Bhopal', t: 'Assistant Professor Grade-I & Grade-II Faculty Positions', q: 'Ph.D in relevant discipline / M.Arch / M.Plan with 1st Class in preceding degrees', a: 'Advt. No. Rectt/FR/2026/01', l: '24-08-2026', u: 'https://manitrec.samarth.edu.in', desc: 'Maulana Azad National Institute of Technology (MANIT) Bhopal invites online applications for Assistant Professor Grade-I (Level-12) & Grade-II (Level-10) faculty positions across multiple departments. Apply online by 24th August 2026.' },
  { id: 'cgssb-assistant-teacher-lsat26-recruitment-2026', d: '24 jul 2026', b: 'Chhattisgarh Staff Selection Board (CGSSB / CG Vyapam)', t: 'Sahayak Shikshak (Assistant Teacher - LSAT26) Recruitment', q: '12th Pass (Min 50%) + D.El.Ed / B.Ed + CG TET or CTET Primary Level Passed', a: 'Exam No. F-20/2026 / 3202', l: '21-08-2026', u: 'https://cgssb.cgstate.gov.in', desc: 'Chhattisgarh Staff Selection Board (CGSSB) invites online applications for Sahayak Shikshak (Assistant Teacher) written exam LSAT26 under Lok Shikshan Sanchalanalaya. Written exam on 11.10.2026. Apply online by 21st August 2026.' },
  { id: 'mpsc-junior-scientific-officer-jso-2026', d: '24 jul 2026', b: 'Mizoram Public Service Commission (MPSC)', t: 'Junior Scientific Officer (JSO) – 12 Posts', q: 'M.Sc (Forensic/Physics/Maths/Chem/Bio) / B.E/B.Tech (CS/ECE/Civil/Mech) / MCA / M.Sc IT', a: 'Advertisement No.18 of 2026 – 2027', l: '27-08-2026', u: 'https://mpsconline.mizoram.gov.in', desc: 'Mizoram Public Service Commission (MPSC) invites online applications for 12 Group B Non-Gazetted posts of Junior Scientific Officer (JSO) in Directorate of Forensic Science Laboratory (Home Dept) in Pay Level 7. Apply online by 27th August 2026.' },
  { id: 'ccras-research-fellow-consultant-young-professional-2026', d: '24 jul 2026', b: 'Central Council for Research in Ayurvedic Sciences (CCRAS)', t: 'Senior Research Fellow, Consultant & Young Professional – 17 Posts (Walk-In)', q: 'PG (Stats/Maths/Sanskrit) / AYUSH Degree + MPH / MD/MS (Ayurveda) / Bachelor in Design', a: 'Advertisement No. 04/2026', l: '06-08-2026', u: 'https://www.ccras.nic.in', desc: 'Central Council for Research in Ayurvedic Sciences (CCRAS), Ministry of Ayush invites candidates for Walk-In-Interview on 06.08.2026 at Janakpuri, New Delhi for 17 contractual posts of SRF, Senior Consultant, Consultant, and Young Professional.' },
  { id: 'aai-eastern-region-apprentice-2026', d: '28 jul 2026', b: 'Airports Authority of India (AAI Eastern Region)', t: 'Graduate, Diploma & ITI Apprentices – 140 Posts', q: 'Degree / Diploma / ITI Passed in or after 2024 (as on 30.06.2026)', a: '01/2026/ER/APPRENTICE', l: 'Check NATS / NAPS Portal', u: 'https://nats.education.gov.in', desc: 'Airports Authority of India (AAI), Eastern Region invites online applications from eligible candidates from West Bengal, Odisha, Bihar, Jharkhand, Chhattisgarh, Sikkim, and Andaman & Nicobar for 140 One-Year Apprentice posts (35 Graduate, 35 Diploma, 70 ITI) at RHQ Kolkata and Eastern Region Airports. Apply online via NATS/NAPS portals.' },
  { id: 'isro-scientist-engineer-sc-gate-2026', d: '28 jul 2026', b: 'Indian Space Research Organisation (ISRO)', t: 'Scientist / Engineer \'SC\' (Electronics/Mechanical/CS/Civil/Electrical/R&AC/Architecture) – 92 Posts', q: 'B.E / B.Tech / B.Arch with Min 65% Marks + Valid GATE Score', a: 'CBC 49101/11/0007/2627 (ISRO ICRB)', l: '17-08-2026', u: 'https://www.isro.gov.in', desc: 'ISRO Centralised Recruitment Board (ICRB) invites online applications for 92 vacancies of Scientist/Engineer \'SC\' (Group \'A\' Gazetted, Pay Level 10 - ₹56,100) based on valid GATE score in Electronics, Mechanical, CS, Civil, Electrical, R&AC, and Architecture across ISRO Centres & PRL. Apply online by 17th August 2026.' },
  { id: 'stpi-junior-hindi-translator-2026', d: '25 jul 2026', b: 'Software Technology Parks of India (STPI)', t: 'Junior Hindi Translator (JHT) – 09 Posts', q: 'Master\'s Degree in Hindi/English + Translation Diploma/Certificate or 2 Yrs Translation Exp', a: 'Employment Notice No. 2(1)/I/STPI-HQ/2026-27', l: '07-09-2026', u: 'https://www.stpi.in', desc: 'Software Technology Parks of India (STPI), an autonomous society under MeitY, invites online applications for 09 Group A Non-S&T posts of Junior Hindi Translator (JHT) in Pay Level-6 (Rs. 35,400 - 1,12,400). Apply online by 07th September 2026.' },
  { id: 'prl-administrative-accounts-purchase-officer-2026', d: '25 jul 2026', b: 'Physical Research Laboratory (PRL)', t: 'Administrative, Accounts & Purchase Officer (Level-10) – 05 Posts', q: 'Graduate / Post Graduate / MBA / CA / CMA + Relevant Experience (First Class Min 60%)', a: 'Advt. No. 01/2026', l: '24-08-2026', u: 'https://www.prl.res.in/prl-eng/job_vacancies', desc: 'Physical Research Laboratory (PRL), Ahmedabad (Department of Space) invites online applications for Administrative Officer, Accounts Officer, and Purchase & Stores Officer positions in Pay Level-10 (₹56,100 - ₹1,77,500). Apply online by 24th August 2026.' },
  { id: 'nfr-sports-quota-recruitment-2026', d: '25 jul 2026', b: 'Northeast Frontier Railway (NFR)', t: 'Sports Quota Recruitment 2026-27 (Level 1, Level 2 & Level 3) – 56 Posts', q: '10th / ITI / NAC or 12th Pass + Recognized Sports Achievements (on/after 01.04.2024)', a: 'Employment Notification No: 04/2026', l: '24-08-2026', u: 'https://www.nfr.indianrailways.gov.in', desc: 'Northeast Frontier Railway (NFR), Maligaon invites online applications from eligible sportspersons for recruitment against 56 Sports Quota posts across various sports disciplines in Pay Levels 1, 2 & 3. Apply online by 24th August 2026.' },
  { id: 'indian-army-territorial-army-ex-officers-2026', d: '27 jul 2026', b: 'Indian Army (Territorial Army)', t: 'Territorial Army Officer (Ex Armed Forces Commissioned Officers) – 05 Posts', q: 'Ex-Service Commissioned Officer (Army/Navy/Air Force) + Graduation + Gainfully Employed', a: 'ASB Ex Officers - 2026', l: '25-08-2026', u: 'https://www.indianarmy.nic.in', desc: 'Indian Army invites offline applications from gainfully employed Ex Armed Forces Commissioned Officers for selection as Territorial Army Officers (05 Posts - 04 Male, 01 Female) under Army Headquarters Selection Board (ASB). Apply offline by 25th August 2026.' },
  { id: 'upsc-principal-vice-principal-2026', d: '25 jul 2026', b: 'Union Public Service Commission (UPSC)', t: 'Principal & Vice Principal (Education Dept, GNCT Delhi) – 828 Posts', q: 'Master\'s Degree + B.Ed + Teaching Exp (10 Yrs for Principal, 2-3 Yrs for Vice Principal)', a: 'Special Advt No. 51/2026', l: '14-08-2026', u: 'https://upsconline.nic.in/ora/', desc: 'Union Public Service Commission (UPSC) invites online applications for recruitment to 828 posts of Principal (124) and Vice Principal (704) in the Education Department, Govt. of NCT of Delhi. Combined Recruitment Test (CRT) on 01st Nov 2026. Apply online by 14th August 2026.' },
  { id: 'tmb-relationship-manager-2026', d: '23 jul 2026', b: 'Tamilnad Mercantile Bank Ltd. (TMB)', t: 'Relationship Manager (Manager / Assistant Manager) – Various Posts', q: 'Any Graduation or Post Graduation (Min 60%) + 2-3 Yrs Bank Experience', a: 'Recruitment Advertisement – Relationship Manager', l: '03-08-2026', u: 'https://www.ib.tmbonline.bank.in/tmb_careers/', desc: 'Tamilnad Mercantile Bank Ltd. (TMB) invites online applications for Relationship Manager (Manager / Assistant Manager) positions across India. Candidates with Any Graduation/PG (60% Marks) and 2-3 years bank experience can apply online by 03rd August 2026.' },
  { id: 'aiims-norcet-11-nursing-officer-2026', d: '24 jul 2026', b: 'All India Institute of Medical Sciences (AIIMS New Delhi)', t: 'Nursing Officer Recruitment Common Eligibility Test (NORCET-11) – 2218+ Posts', q: 'B.Sc Nursing / Post-Basic B.Sc Nursing OR GNM with 2 Yrs Hospital Exp', a: '103/2026', l: '13-08-2026', u: 'https://www.aiimsexams.ac.in', desc: 'AIIMS New Delhi invites online applications for Nursing Officer Recruitment Common Eligibility Test (NORCET-11) for 2218+ Nursing Officer (Group-B) posts across 19 AIIMS institutes, CAPFIMS, ESIC, and Central Govt hospitals. Apply online by 13th August 2026.' },
  { id: 'edcil-aai-consultants-recruitment-2026', d: '24 jul 2026', b: 'EdCIL / Airports Authority of India (AAI)', t: 'Senior Consultants & Consultants (Law, Psych, Corp Comm) – 10 Posts', q: 'M.Phil (Psychology) RCI, LLB, Mass Comm, Graphic Design, Video Editing', a: '10/2026, 11/2026 & 01/2026/CHQ/CN', l: '06-08-2026', u: 'https://www.aai.aero', desc: 'EdCIL (India) Limited on behalf of Airports Authority of India (AAI) invites online applications for 10 Senior Consultant & Consultant posts in Law, Clinical Psychology, and Corporate Communications at New Delhi. Monthly remuneration up to Rs 1.50 Lakh. Apply online by 6th August 2026.' },
  { id: 'hal-executive-posts-2026', d: '23 jul 2026', b: 'Hindustan Aeronautics Limited (HAL)', t: 'Various Executive Posts (Lateral Entry) – 30 Posts', q: 'B.E/B.Tech/M.E/M.Tech or CA/ICWA + Relevant Experience', a: 'HAL/CHRC-TM/RECT-01/2026', l: '12-08-2026', u: 'https://www.hal-india.co.in', desc: 'Hindustan Aeronautics Limited (HAL) invites online applications for recruitment of 30 Executive Posts including Finance Officer, Dy. Manager (Finance), and Manager (Design) via Lateral Entry. Apply online by 12th August 2026.' },
  { id: 'icsi-executive-assistant-2026', d: '22 jul 2026', b: 'The Institute of Company Secretaries of India (ICSI)', t: 'Executive Assistant – 20 Posts', q: 'Graduate in Commerce (B.Com) + 3 Years Experience', a: '04/2026', l: '12-08-2026', u: 'https://www.icsi.edu', desc: 'The Institute of Company Secretaries of India (ICSI) invites online applications for recruitment of 20 Executive Assistants across India. Commerce graduates with 3 years experience can apply by 12th August 2026.' },
  { id: 'icar-nifmd-young-professional-ii-2026', d: '15 jul 2026', b: 'ICAR-NIFMD', t: 'Young Professional-II (YP-II) – 01 Post', q: 'Graduation (Agri) with 1 Year Exp / Master\'s (Epidemiology/Stats/Public Health)', a: 'Recruitment YP-II/LHDCP/25-26/8-27', l: '05-08-2026', u: 'http://nifmd.res.in', desc: 'ICAR - National Institute on Foot and Mouth Disease invites applications via email for one contractual post of Young Professional-II (YP-II) at Bhubaneswar, Odisha.' },
  { id: 'aai-managers-junior-executives-2026', d: '22 jul 2026', b: 'Airports Authority of India (AAI)', t: 'Managers & Junior Executives – 389 Posts', q: 'B.E/B.Tech, MBA/PGDM, CA, Law, Graduation', a: '12/2026/CHQ/DR-CBT', l: '07-09-2026', u: 'https://www.aai.aero', desc: 'Airports Authority of India (AAI) invites online applications for recruitment of 389 Managers and Junior Executives in various disciplines across India. Apply online by 7th September 2026.' },
  { id: 'sidbi-consultant-credit-analyst-2026', d: '21 jul 2026', b: 'Small Industries Development Bank of India (SIDBI)', t: 'Consultant Credit Analyst (CCA) – 50 Posts', q: 'Chartered Accountant (CA)', a: '03/ 2026-27', l: 'Refer to ICAI Schedule', u: 'https://icaiplacements.icai.org/#/', desc: 'SIDBI invites online applications for 50 posts of Consultant Credit Analyst (CCA) on contractual basis. Qualified Chartered Accountants (CAs) can apply through ICAI Placements.' },
  { id: 'cr-presenting-officer-recruitment-2026', d: '21 jul 2026', b: 'Central Railway (Vigilance Branch)', t: 'Presenting Officer (Ex-Cadre) – 01 Post', q: 'Working Railway employee in Level-7 or Level-8 with 5 Years Service', a: 'G.130/C-125/Presenting Officer/V.Con', l: '31-07-2026', u: 'https://cr.indianrailways.gov.in', desc: 'Central Railway (Vigilance Branch, CSMT Mumbai) invites offline applications from regular employees of Central Railway for selection of 1 ex-cadre post of Presenting Officer in Level-7 on tenure basis. Apply by 31st July 2026.' },
  { id: 'isro-assistants-jpa-udc-recruitment-2026', d: '21 jul 2026', b: 'Indian Space Research Organisation (ISRO)', t: 'Assistants, Junior Personal Assistants (JPA), Upper Division Clerks (UDC) & Stenographers – 242 Posts', q: 'Graduation / Diploma in Commercial/Secretarial Practice', a: 'ISRO:ICRB:01(A-JPA):2026', l: '16-08-2026', u: 'https://www.isro.gov.in', desc: 'Indian Space Research Organisation (ISRO) invites online applications for recruitment of 242 Assistants, Junior Personal Assistants, Upper Division Clerks, and Stenographers. Apply online by 16th August 2026.' },
  { id: 'indian-army-ncc-special-entry-125', d: '21 jul 2026', b: 'Indian Army', t: 'NCC Special Entry Scheme 125th Course (April 2027) - Women – 06 Posts', q: 'Graduation Degree with min 50% & NCC C Certificate (Min B Grade)', a: 'SSCW (NCC)-125 (April 2027)', l: '21-08-2026', u: 'https://www.joinindianarmy.nic.in', desc: 'Join Indian Army via NCC Special Entry Scheme 125th Course (April 2027) for Unmarried Female Candidates. Total 06 vacancies. Apply online by 21 August 2026.' },
  { id: 'union-bank-recruitment-2026', d: '20 jul 2026', b: 'Union Bank of India', t: 'Specialist Officers & General Banking Officers (GBO) – 395 Posts', q: 'Any Graduate, B.E/B.Tech, CA, MBA, LLB', a: 'Recruitment Project 2026-27', l: '10-08-2026', u: 'https://www.unionbankofindia.co.in', desc: 'Union Bank of India (UBI) invites online applications for recruitment of 395 Specialist Officers and General Banking Officers (GBO) across various grades (Scale II to VI).' },
  { id: 'pnb-lbo-recruitment-2026', d: '20 jul 2026', b: 'Punjab National Bank (PNB)', t: 'Local Bank Officer (LBO) – 545 Posts', q: 'Any Graduate, 1 Year Bank Experience', a: 'Recruitment of Local Bank Officers 2026', l: '09-08-2026', u: 'https://www.pnbindia.in', desc: 'Punjab National Bank (PNB) invites online applications for recruitment of 545 Local Bank Officers in JMGS-I scale. Required proficiency in specified local language.' },
  { id: 'nfr-act-apprentice-2026', d: '20 jul 2026', b: 'Northeast Frontier Railway (NFR)', t: 'NFR Act Apprentice – 6777 Posts', q: '10th, 12th, ITI', a: 'NFR/NAPS/ACT APP./2026', l: '19-08-2026', u: 'https://www.nfr.indianrailways.gov.in', desc: 'Northeast Frontier Railway (NFR) invites online applications for engagement of 6777 Act Apprentices for training under the Apprentices Act 1961.' },
  { id: 'indian-army-officer-70-posts-2026', d: '20 jul 2026', b: 'Indian Army', t: 'Officer (Short Service Commission Technical & Non-Technical) – 70 Posts', q: 'B.E/B.Tech, Graduation, LLB', a: 'Officer Entry Course (Apr 2027)', l: '20-08-2026', u: 'https://www.joinindianarmy.nic.in', desc: 'The Indian Army invites online applications from unmarried male and female candidates for Short Service Commission (SSC) Officer entries for 70 posts.' },
  { id: 'irel-executives-recruitment-2026', d: '20 jul 2026', b: 'IREL (India) Limited', t: 'Executives (Technical & Non-Technical) – 73 Posts', q: 'B.E./B.Tech, M.Sc, CA, MBA, MSW, LLB', a: 'CO/HRM/35/2026', l: '10-08-2026', u: 'https://irel.co.in', desc: 'IREL (India) Limited, a CPSE under Department of Atomic Energy, invites online applications for 73 regular Executive posts across technical and non-technical disciplines.' },
  { id: 'wcl-recruitment-2026', d: '20 jul 2026', b: 'Western Coalfields Limited (WCL)', t: 'Mining Sirdar & Assistant Foreman (Electrical) – 444 Posts', q: 'Matriculation with Mining Sirdar Certificate or Diploma (Mining/Electrical Engg)', a: '2026/69', l: '10-08-2026', u: 'https://www.westerncoal.in', desc: 'Western Coalfields Limited (WCL) invites online applications for 444 statutory supervisory positions, including Mining Sirdar and Assistant Foreman (Electrical) in Trainee Grade.' },
  { id: 'iaf-agniveervayu-musician-2026', d: '20 jul 2026', b: 'Indian Air Force (IAF)', t: 'Agniveervayu (Musician) Intake 01/2027 – Recruitment Rally', q: 'Matriculation (10th Pass) with Music Proficiency & Certification', a: 'INTAKE 01/2027', l: '02-08-2026', u: 'https://iafrecruitment.edcil.co.in', desc: 'Indian Air Force invites unmarried Indian male and female candidates for pre-registered recruitment rally as Agniveervayu (Musician) at New Delhi and Bengaluru.' },
  { id: 'indian-army-sscw-tech-68', d: '08 jul 2026', b: 'Indian Army', t: '68th Short Service Commission (Technical) Women Course (Apr 2027) – 30 Posts', q: 'B.Tech/B.E, Graduation', a: 'SSCW(T)-68', l: '06-08-2026', u: 'https://www.joinindianarmy.nic.in', desc: 'Indian Army invites online applications from unmarried female engineering graduates and widows of defence personnel for 68th Short Service Commission (Technical) Women Course starting in April 2027.' },
  { id: 'rites-am-mechanical-2026', d: '17 jul 2026', b: 'RITES', t: 'Assistant Manager (Mechanical) – 24 Posts', q: 'B.E/B.Tech (Mechanical/Production/Industrial/Automobile/Mechatronics)', a: 'RG/11/26', l: '17-08-2026', u: 'http://www.rites.com', desc: 'RITES Limited, a Navratna CPSE under the Ministry of Railways, invites online applications for 24 Assistant Manager (Mechanical) vacancies on regular basis. Required 2 years experience.' },
  { id: 'icai-executive-officer-2026', d: '18 jul 2026', b: 'ICAI', t: 'Executive Officer – 50 Posts', q: 'Chartered Accountant (CA)', a: '07/2026/HRD/04', l: '31-07-2026', u: 'https://www.icai.org', desc: 'The Institute of Chartered Accountants of India (ICAI) invites online applications for regular appointment of 50 Executive Officers. Chartered Accountants, including freshers, are eligible.' },
  { id: 'nicl-assistant-2026', d: '18 jul 2026', b: 'NICL', t: 'Assistant – 500 Posts', q: 'Any Graduate', a: 'Not Mentioned in Official Notification', l: '07-08-2026', u: 'https://nationalinsurance.nic.co.in/recruitment/', desc: 'National Insurance Company Limited (NICL) invites online applications for recruitment of 500 Assistants in Class III cadre from open market.' },
  { id: 'indian-army-officer-entries-2026', d: '17 jul 2026', b: 'Indian Army', t: 'JAG Entry Scheme 125th Course – 10 Posts', q: 'LLB', a: 'CBC 10601/11/0010/2627', l: '17-08-2026', u: 'https://www.joinindianarmy.nic.in', desc: 'The Army is recruiting law graduates as officers to serve as military legal advisors.' },
  { id: 'iifcl-projects-individual-consultant-2026', d: '17 jul 2026', b: 'IPL', t: 'Individual Consultant – 65 Profiles (Rolling Basis)', q: 'B.Tech/B.E, B.Arch, B.Plan, LLB, CA, ICWA, LLM, M.E/M.Tech, MBA/PGDM', a: 'Not Mentioned in Official Notification', l: '16-07-2027', u: 'https://iifclprojects.com', desc: 'IIFCL Projects Limited (IPL), a wholly owned subsidiary of IIFCL (a Govt. of India Enterprise), invites rolling applications for 65+ Individual Consultant positions across infrastructure, finance, legal, and IT fields.' },
  { id: 'beml-executive-2026', d: '17 jul 2026', b: 'BEML', t: 'Executive – 23 Posts', q: 'B.E/B.Tech, M.E/M.Tech, Master\'s Degree', a: 'KP/S/12/2026', l: '01-08-2026', u: 'https://www.freejobalert.com/articles/beml-executive-recruitment-2026-apply-online-for-23-engineer-assistant-manager-and-more-posts-3057401', desc: 'A defence and heavy-equipment manufacturer is hiring executives for engineering and management roles.' },
  { id: 'ongc-geologists-engineers-2026', d: '17 jul 2026', b: 'ONGC', t: 'Geologists, Engineers – 52 Posts', q: 'B.Tech/B.E, M.Sc, M.E/M.Tech', a: '2/2026 (R&P)', l: '31-07-2026', u: 'https://www.freejobalert.com/articles/ongc-graduate-trainee-recruitment-2026-apply-online-for-geologists-engineers-posts-3057609', desc: "India's top oil and gas explorer is hiring geologists and engineers as graduate trainees." },
  { id: 'ncl-mining-sirdar-surveyor-2026', d: '16 jul 2026', b: 'NCL', t: 'Mining Sirdar, Surveyor – 259 Posts', q: 'B.Tech/B.E, Diploma, 10TH', a: 'NCL/SING/HR/Direct-Recruitment/2026-27/246', l: '05-08-2026', u: 'https://www.freejobalert.com/articles/ncl-mining-sirdar-surveyor-recruitment-2026-3057766', desc: 'A coal mining company is hiring supervisors and surveyors for its mines.' },
  { id: 'hpcl-apprentice-2026', d: '16 jul 2026', b: 'HPCL', t: 'Graduate Apprentice Trainee – 373 Posts', q: 'B.Tech/B.E', a: '–', l: '31-07-2026', u: 'https://www.freejobalert.com/articles/hpcl-graduate-apprentice-recruitment-2026-3058199', desc: 'An oil refining company is offering apprentice training to fresh graduates.' },
  { id: 'rrb-section-controller', d: '15 jul 2026', b: 'RRB', t: 'Section Controller – 119 Posts', q: 'Any Graduate', a: '03/2026', l: '14-08-2026', u: 'https://www.freejobalert.com/articles/rrb-section-controller-recruitment-2026-apply-online-for-119-posts-3055121', desc: 'Indian Railways is hiring controllers to manage and track train movement on the network.' },
  { id: 'cert-in-scientist-b-2026', d: '14 jul 2026', b: 'CERT-In', t: 'Scientist-B – 133 Posts', q: 'B.E/B.Tech/M.Sc/MCA (CS/IT/Data Science/AI/Electronics/ECE)', a: 'CERT-In/SCB/2026/1', l: '17-08-2026', u: 'https://www.cert-in.org.in', desc: "Indian Computer Emergency Response Team (CERT-In) under MeitY invites online applications for 133 posts of Scientist-B on Direct Recruitment basis based on GATE 2024/2025/2026 scores. No experience required." },
  { id: 'iocl-panipat-apprentice-2026', d: '14 jul 2026', b: 'IOCL', t: 'Apprentices – 1450 Posts', q: 'B.A, B.Com, B.Sc, Diploma, ITI', a: 'PR/P/Apprentice/60(2026-27)', l: '12-08-2026', u: 'https://www.freejobalert.com/articles/iocl-panipat-refinery-apprentices-recruitment-2026-apply-online-for-1450-posts-3058245', desc: "IOCL's Panipat refinery is offering apprentice training across several trades." },
  { id: 'ngel-deputy-general-manager-assistant-engineer-2026', d: '13 jul 2026', b: 'NGEL', t: 'Deputy General Manager, Assistant Engineer – 114 Posts', q: 'B.Tech/B.E, Diploma', a: '02/26', l: '31-07-2026', u: 'https://www.freejobalert.com/articles/ngel-recruitment-2026-apply-online-for-114-deputy-general-manager-assistant-manager-posts-3055902', desc: "NTPC's clean energy arm is hiring managers and engineers for its solar and green power projects." },
  { id: 'upsc-recruitment-08-2026', d: '10 jul 2026', b: 'UPSC', t: 'Prosecutor, Specialist and More – 48 Posts', q: 'LLB, MBBS, DNB, M.Sc, DM', a: '08/2026', l: '31-07-2026', u: 'https://www.freejobalert.com/articles/upsc-recruitment-2026-apply-online-for-assistant-soil-chemist-prosecutor-and-more-posts-3057787', desc: "UPSC, India's top recruiting body, is filling specialist posts like prosecutors and doctors across departments." },
  { id: 'nhsrcl-technician-2026', d: '07 jul 2026', b: 'NHSRCL', t: 'Technician – 237 Posts', q: 'Diploma, ITI', a: '–', l: '05-08-2026', u: 'https://www.freejobalert.com/articles/nhsrcl-technician-recruitment-2026-apply-online-for-237-posts-3057054', desc: "The company building India's bullet train is hiring technicians for construction and maintenance." },
  { id: 'nhidcl-associate-2026', d: '06 jul 2026', b: 'NHIDCL', t: 'Associate – 100 Posts', q: 'Graduation in Civil Engineering or equivalent (IIT/NIT/NIRF Top 100)', a: 'Hiring Notice No. 07/2026', l: '05-08-2026', u: 'https://www.nhidcl.com', desc: 'National Highways & Infrastructure Development Corporation Limited (NHIDCL) invites online applications for 100 posts of Associates under the State Specific Graduate Scheme (SSGS) on contract.' },
  { id: 'ihmcl-systems-engineer-2026', d: '04 jul 2026', b: 'IHMCL', t: 'Systems Engineer – 30 Posts', q: 'B.Tech/B.E', a: 'IHMCL/HR/Recruit./03/2026/04', l: '02-08-2026', u: 'https://www.freejobalert.com/articles/ihmcl-recruitment-2026-systems-engineer-3056704', desc: 'The company that runs FASTag and highway toll systems is hiring IT engineers.' },
  { id: 'territorial-army-130-inf-bn-2026', d: '26 jun 2026', b: 'Territorial Army', t: 'Soldier – 69 Posts', q: 'Other', a: 'CBC 10120/11/0005/2627', l: '08-08-2026', u: 'https://www.130ta.com', desc: 'A part-time volunteer army unit is recruiting soldiers through an open recruitment rally.' },
  { id: 'ccrum-recruitment-2026', d: '25 jun 2026', b: 'CCRUM', t: 'Staff Nurse, MTS and More – 179 Posts', q: 'Any Graduate, B.Sc, B.Tech/B.E, Any Post Graduate, PG Diploma', a: '01/2026', l: '31-07-2026', u: 'https://www.freejobalert.com/articles/ccrum-recruitment-2026-apply-online-for-176-staff-nurse-mts-and-more-posts-3053323', desc: 'A body that researches Unani medicine is hiring nurses and helpers for its hospitals.' },
  { id: 'isro-istrac-apprentices-2026', d: '23 jun 2026', b: 'ISRO ISTRAC', t: 'Apprentices – 95 Posts', q: 'B.Tech/B.E, B.Sc, Diploma, ITI, MLISc', a: 'ISTRAC:01:2026', l: '31-07-2026', u: 'https://www.istrac.gov.in', desc: "Government of India, Department of Space, ISRO Telemetry Tracking & Command Network (ISTRAC) invites applications from Graduate, Diploma, and Trade ITI Apprentices for the year 2026-2027." }
];
