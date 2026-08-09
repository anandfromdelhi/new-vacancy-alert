import re

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all "id": "..." occurrences in jobsData.ts
matches = re.findall(r'"id":\s*"([^"]+)"', text)
print("=== FIRST 10 JOBS IN JOBS_DATA ARRAY ===")
for idx, jid in enumerate(matches[:10], 1):
    print(f"{idx}. {jid}")
