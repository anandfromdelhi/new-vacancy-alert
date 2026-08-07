import re

eid = 'indian-army-ssc-tech-68-men-course-2026'

# 1. Update jobsData.ts
with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    jobs_content = f.read()

pattern = r"\s*\{\s*id:\s*'" + re.escape(eid) + r"'[\s\S]*?\n  \},?"
jobs_content = re.sub(pattern, "", jobs_content)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(jobs_content)

# 2. Update jobDetails.ts
with open('src/data/jobDetails.ts', 'r', encoding='utf-8') as f:
    details_content = f.read()

pattern = r"\s*'" + re.escape(eid) + r"':\s*\{[\s\S]*?\n  \},?"
details_content = re.sub(pattern, "", details_content)

with open('src/data/jobDetails.ts', 'w', encoding='utf-8') as f:
    f.write(details_content)

print("Successfully removed Indian Army SSC Tech 68 entry!")
