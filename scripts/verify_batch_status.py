import json

with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    ts_data = f.read()

count_ts = ts_data.count('"id":')
print(f"Total vacancies in jobDetails.json: {len(details)}")
print(f"Total entries in jobsData.ts: {count_ts}")

with open('src/data/jobUploadDates.json', 'r', encoding='utf-8') as f:
    upload_dates = json.load(f)

print(f"Total in jobUploadDates.json: {len(upload_dates)}")
