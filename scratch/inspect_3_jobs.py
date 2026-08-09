import json

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect q values of those 3 jobs
ids = ['upsc-recruitment-advt-10-2026', 'iob-local-bank-officer-recruitment-2026', 'hp-hamirpur-retired-patwari-kanungo-recruitment-2026']

import re
for jid in ids:
    m = re.search(r'"id":\s*"' + jid + r'".*?"q":\s*"([^"]+)"', text, re.DOTALL)
    if m:
        print(f"Job {jid} q:", m.group(1))

# Fix them explicitly in JOBS_DATA
text = re.sub(
    r'("id":\s*"upsc-recruitment-advt-10-2026".*?"q":\s*")([^"]+)(")',
    r'\1BE / B.Tech (Civil / Electronics / Mech / Agri) / LLM / LLB / Master\'s (Geography/Geology/GIS) / B.Sc (Agri/Hort) / Graduation in Any Discipline\3',
    text,
    flags=re.DOTALL
)

text = re.sub(
    r'("id":\s*"iob-local-bank-officer-recruitment-2026".*?"q":\s*")([^"]+)(")',
    r'\1Graduation Degree in Any Discipline from Recognized University\3',
    text,
    flags=re.DOTALL
)

text = re.sub(
    r'("id":\s*"hp-hamirpur-retired-patwari-kanungo-recruitment-2026".*?"q":\s*")([^"]+)(")',
    r'\1Retired Patwari / Kanungo / Passed Class 10th / Matriculation or Graduate Degree\3',
    text,
    flags=re.DOTALL
)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed q fields for all 3 jobs!")
