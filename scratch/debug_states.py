import json

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

added_jobs = [
    'isro-hsfc-scientist-engineer-sd-recruitment-2026',
    'krcl-apprentice-recruitment-2026',
    'iob-local-bank-officer-recruitment-2026',
    'upsc-recruitment-advt-10-2026'
]

import re
for jid in added_jobs:
    m_b = re.search(r'"id":\s*"' + jid + r'".*?"b":\s*"([^"]+)"', text, re.DOTALL)
    m_t = re.search(r'"id":\s*"' + jid + r'".*?"t":\s*"([^"]+)"', text, re.DOTALL)
    b_val = m_b.group(1) if m_b else ""
    t_val = m_t.group(1) if m_t else ""
    print(f"Job: {jid}")
    print(f"  b: {b_val}")
    print(f"  t: {t_val}")
