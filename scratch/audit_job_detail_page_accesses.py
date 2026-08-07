import re

with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Find all job.property accesses
prop_accesses = set(re.findall(r'\bjob\.([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)', code))
print("All property paths accessed off 'job' in JobDetailPage.tsx:")
for p in sorted(prop_accesses):
    print(" - job." + p)
