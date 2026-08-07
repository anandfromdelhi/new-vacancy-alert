import json
import re

# Load jobsData.ts and jobDetails.ts
with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    jobs_text = f.read()

with open('src/data/jobDetails.ts', 'r', encoding='utf-8') as f:
    details_text = f.read()

# Define new entries for jobsData
new_jobs = [
  {
    "id": "kea-land-surveyor-bhoomapaka-recruitment-2026",
    "b": "Karnataka Examinations Authority (KEA) / SSLR Dept",
    "t": "KEA Land Surveyor (Bhoomapaka) Recruitment 2026 – Apply Online for 750 Posts (RPC 560 + KK 190) | B.Sc / B.E / B.Tech / Diploma / Agri / Sericulture | Last Date Extended 20 August 2026",
    "d": "05-08-2026",
    "l": "20-08-2026",
    "a": "EDI/KEA/ADMN/RECRUITMENT-19/2026(K.K) & RD 42 FLR 2022",
    "q": "Degree in Engineering/Tech OR B.Sc with Mathematics/Physics OR Diploma in Engineering OR B.Sc in Agriculture / Horticulture / Fisheries / Forestry / Sericulture",
    "desc": "Karnataka Examinations Authority (KEA) & Survey Settlement and Land Records Department (SSLR) announce direct recruitment of 750 Land Surveyors (Bhoomapaka) including 560 Residual Parent Cadre (RPC) and 190 Kalyana Karnataka (KK) posts. Educational qualifications expanded and last date to apply online extended up to 20 August 2026 (Fee payment till 21 August 2026).",
    "u": "https://cetonline.karnataka.gov.in/kea/"
  },
  {
    "id": "icds-sonbhadra-up-anganwadi-worker-recruitment-2026",
    "b": "Child Development Services & Nutrition, District Sonbhadra, Govt. of Uttar Pradesh",
    "t": "ICDS Sonbhadra UP Anganwadi Worker Recruitment 2026 – Apply Online for 201 Posts | 12th Pass Female Candidates | Last Date 26 August 2026",
    "d": "05-08-2026",
    "l": "26-08-2026",
    "a": "01/Ji.Ka.A./A.Wa.Vi./2026-27",
    "q": "12th Pass (Intermediate / 10+2) from a recognized Board (Female candidates local resident of concerned Gram Sabha / Ward)",
    "desc": "Office of District Programme Officer, Bal Vikas Seva evam Pushtahar Vibhag, Sonbhadra (UP) invites online applications for selection of 201 Anganwadi Workers (आंगनवाड़ी कार्यकत्री) across Babhani, Chatra, Chopan, Dudhi, Ghorawal, Myorpur, Nagwa, and Robertsganj projects. Last date to apply online on upanganwadibharti.in is 26 August 2026 (Midnight 12:00).",
    "u": "https://upanganwadibharti.in"
  },
  {
    "id": "tnstc-tamilnadu-apprentice-recruitment-2026",
    "b": "Tamil Nadu State Transport Corporation (TNSTC) / BOAT SR",
    "t": "TNSTC Tamil Nadu Apprentice Recruitment 2026 – Apply Online for 1,518 Graduate & Diploma Apprentice Posts across Villupuram, Kumbakonam, Salem, Madurai, Tirunelveli & MTC Chennai | Last Date 28 August 2026",
    "d": "28-07-2026",
    "l": "28-08-2026",
    "a": "BOAT/SR/TNSTC/2026-27",
    "q": "B.E / B.Tech Degree OR Diploma in Engineering OR Non-Engineering Graduate (BA / B.Sc / B.Com / BBA / BCA) passed during 2022 to 2026",
    "desc": "Tamil Nadu State Transport Corporation (TNSTC) Corporations HQ Villupuram, Kumbakonam, Salem, Madurai, Tirunelveli, MTC Chennai, and SETC TN Ltd under BOAT (Southern Region) invite online applications for 1,518 One-Year Apprenticeship slots (457 Graduate Engg @ ₹12,300/mo, 438 Diploma Engg @ ₹10,900/mo, 623 Non-Engg Graduate). Apply online via NATS Portal by 28 August 2026.",
    "u": "https://nats.education.gov.in"
  },
  {
    "id": "kea-grama-adhikari-vao-kalyana-karnataka-recruitment-2026",
    "b": "Karnataka Examinations Authority (KEA) / Revenue Dept",
    "t": "KEA Grama Adhikari (VAO) Kalyana Karnataka Recruitment 2026 – Apply Online for 67 Group C Posts in Kalaburagi, Bidar & Raichur | PUC (12th Pass) / Diploma | Kannada Exam Oct 2026",
    "d": "10-07-2026",
    "l": "30-07-2026",
    "a": "EDI/KEA/27/NE.VI./2026(K.K.)",
    "q": "PUC (12th Pass / 10+2) OR 3-Year Diploma OR 2-Year ITI Course or equivalent",
    "desc": "Karnataka Examinations Authority (KEA) invites online applications for direct recruitment of 67 Group-C Grama Adhikari (Village Administrative Officer - VAO) posts in Revenue Department for Kalyana Karnataka (KK) Region across Kalaburagi (40), Bidar (17), and Raichur (10) districts. Pay Scale ₹27,000 – ₹52,650. Compulsory Kannada Language Exam scheduled for 25 October 2026.",
    "u": "https://cetonline.karnataka.gov.in/kea/"
  },
  {
    "id": "kea-grama-adhikari-vao-rpc-recruitment-2026",
    "b": "Karnataka Examinations Authority (KEA) / Revenue Dept",
    "t": "KEA Grama Adhikari (VAO) Residual Parent Cadre Recruitment 2026 – Apply Online for 505 Group C Posts across 21 Districts | PUC (12th Pass) / Diploma / ITI | Exam Oct 2026",
    "d": "10-07-2026",
    "l": "30-07-2026",
    "a": "EDI/KEA/26/NE.VI./2026(RPC)",
    "q": "PUC (12th Pass / 10+2) OR 3-Year Diploma OR 2-Year ITI Course or equivalent",
    "desc": "Karnataka Examinations Authority (KEA) invites online applications for direct recruitment of 505 Group-C Grama Adhikari (Village Administrative Officer - VAO) posts in Revenue Department for Residual Parent Cadre (RPC) Region across 21 districts including Tumakuru, Mysuru, Mandya, Belagavi, Hassan, etc. Pay Scale ₹27,000 – ₹52,650. Competitive Offline OMR Exam scheduled for 04 October 2026.",
    "u": "https://cetonline.karnataka.gov.in/kea/"
  }
]

# Form TS snippet for jobsData
jobs_ts_adds = ""
for item in new_jobs:
    jobs_ts_adds += f"""  {{
    id: '{item["id"]}',
    b: '{item["b"]}',
    t: '{item["t"]}',
    d: '{item["d"]}',
    l: '{item["l"]}',
    a: '{item["a"]}',
    q: '{item["q"]}',
    desc: '{item["desc"]}',
    u: '{item["u"]}'
  }},
"""

# Insert into jobsData.ts before closing ];
idx_jobs = jobs_text.rfind("];")
if idx_jobs != -1:
    jobs_text = jobs_text[:idx_jobs] + jobs_ts_adds + jobs_text[idx_jobs:]

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(jobs_text)

print("Added 5 new jobs to jobsData.ts!")
