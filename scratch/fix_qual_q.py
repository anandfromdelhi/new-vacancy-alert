import json

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix 1: upsc-recruitment-advt-10-2026 q field
text = text.replace(
    '"q": "See eligibility"',
    '"q": "BE / B.Tech (Civil / Electronics / Mech / Agri) / LLM / LLB / Master\'s (Geography/Geology/GIS) / B.Sc (Agri/Hort) / Graduation in Any Discipline"'
)

# Fix 2: iob-local-bank-officer-recruitment-2026 q field if needed
text = text.replace(
    '"q": "See eligibility"',
    '"q": "Graduation Degree in Any Discipline from Recognized University"'
)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated qualification text in jobsData.ts")
