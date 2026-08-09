import json, re

with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Search for any references to the 4 job IDs in JobDetailPage.tsx
ids = [
    'isro-hsfc-scientist-engineer-sd-recruitment-2026',
    'krcl-apprentice-recruitment-2026',
    'iob-local-bank-officer-recruitment-2026',
    'upsc-recruitment-advt-10-2026'
]

for jid in ids:
    count = code.count(jid)
    print(f"ID '{jid}' appears {count} times in JobDetailPage.tsx")

with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

for jid in ids:
    if jid not in details:
        print(f"CRITICAL ERROR: {jid} is MISSING from jobDetails.json!")
    else:
        obj = details[jid]
        # Check required fields used in JobDetailPage
        for req in ['title', 'board', 'advtNo', 'vacancies', 'jobLocation', 'overview', 'highlights', 'importantDates', 'vacanciesDetails', 'eligibility', 'salary', 'applicationFee', 'selectionProcess', 'howToApplySteps', 'documentsRequired', 'importantInstructions', 'faqs']:
            if req not in obj or obj[req] is None:
                print(f"WARNING: '{req}' is missing or null in {jid}")
