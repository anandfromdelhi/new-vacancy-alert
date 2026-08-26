import json
import re

fixes = {
    'homi-bhabha-cancer-hospital-research-centre-total-posts-recruitment-2026': 'M.B.B.S / Medical Degree with Internship',
    'district-health-society-cuddalore-dhs-cuddalore---under-national-monthly-salary-rs-recruitment-2026': 'MBBS / GNM / B.Sc Nursing / Ayush Medical',
    'odisha-adarsha-vidyalaya-balangir-total-posts-recruitment-2026': '10th Pass / Matriculation / Any Graduate (Warden, Cook, Chowkidar)',
    'dr-br-ambedkar-university-delhi-aud-a-state-university-established-vacancies-recruitment-2026': "Any Graduate / Post Graduate / Master's Degree",
    'national-health-mission-nhm-chhattisgarh---office-of-the-vacancies-recruitment-2026': 'MBBS / B.Sc Nursing / GNM / Paramedical Degree',
    'central-pollution-control-board-cpcb-ministry-of-environment-forest-climate-monthly-emoluments-consolidated-recruitment-2026': 'B.Tech / B.E / B.Sc / Post Graduate in Environmental Science / Engineering',
    'esic-medical-college-hospital-bihta-patna-under-the-employees-state-vacancies-recruitment-2026': 'MBBS / MD / MS / Medical Post Graduate Degree',
    'nalanda-university-vacancies-recruitment-2026': "Any Graduate / Post Graduate / Master's Degree"
}

# Update jobDetails.json
with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

for jid, qval in fixes.items():
    if jid in details:
        details[jid]['eligibility']['education'] = qval

with open('src/data/jobDetails.json', 'w', encoding='utf-8') as f:
    json.dump(details, f, indent=2, ensure_ascii=False)

# Update jobsData.ts
with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    ts_text = f.read()

for jid, qval in fixes.items():
    pattern = r'("id":\s*"' + re.escape(jid) + r'"[\s\S]*?"q":\s*")([^"]*)(")'
    ts_text = re.sub(pattern, r'\g<1>' + qval + r'\g<3>', ts_text)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_text)

print('Successfully applied fixes for 8 entries!')
