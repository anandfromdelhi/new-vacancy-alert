import re

with open('src/data/jobDetails.ts', 'r', encoding='utf-8') as f:
    text = f.read()

required_fields = [
    'overview',
    'highlights',
    'importantDates',
    'vacanciesDetails',
    'eligibility',
    'salary',
    'applicationFee',
    'selectionProcess',
    'officialLinks',
    'faqs',
    'howToApply',
    'documentsRequired',
    'importantInstructions'
]

# Match job key blocks
# Keys are like 'id-string': {
entry_matches = list(re.finditer(r"'([a-z0-9-]+)':\s*\{", text))
print(f"Total entries found in jobDetails.ts: {len(entry_matches)}")

missing_report = {}

for i in range(len(entry_matches)):
    start_pos = entry_matches[i].start()
    end_pos = entry_matches[i+1].start() if i + 1 < len(entry_matches) else len(text)
    block = text[start_pos:end_pos]
    key = entry_matches[i].group(1)
    
    missing = []
    for field in required_fields:
        if not re.search(r'\b' + field + r'\s*:', block):
            missing.append(field)
    if missing:
        missing_report[key] = missing

print("\n--- Audit Results: Entries with Missing Fields ---")
for k, miss in missing_report.items():
    print(f"{k}: missing -> {miss}")

print(f"\nTotal entries missing at least one required field: {len(missing_report)}")
