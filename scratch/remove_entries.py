import re

entries_to_remove = [
    'bank-of-baroda-specialist-officer-recruitment-2026',
    'apcob-dccb-staff-assistant-assistant-manager-recruitment-2026',
    'shs-bihar-specialist-doctor-recruitment-2026'
]

# 1. Update jobsData.ts
with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    jobs_content = f.read()

for eid in entries_to_remove:
    pattern = r"\s*\{\s*id:\s*'" + re.escape(eid) + r"'[\s\S]*?\n  \},?"
    jobs_content = re.sub(pattern, "", jobs_content)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(jobs_content)

# 2. Update jobDetails.ts
with open('src/data/jobDetails.ts', 'r', encoding='utf-8') as f:
    details_content = f.read()

for eid in entries_to_remove:
    pattern = r"\s*'" + re.escape(eid) + r"':\s*\{[\s\S]*?\n  \},?"
    details_content = re.sub(pattern, "", details_content)

with open('src/data/jobDetails.ts', 'w', encoding='utf-8') as f:
    f.write(details_content)

print("Successfully removed the 3 entries from jobsData.ts and jobDetails.ts!")
