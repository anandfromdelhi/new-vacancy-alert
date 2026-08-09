import json

with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

for jid, job in details.items():
    dates = job.get('importantDates', [])
    if not isinstance(dates, list):
        print(f"ERROR: importantDates is not a list in {jid}: {dates}")
    else:
        for idx, d in enumerate(dates):
            if not isinstance(d, dict):
                print(f"ERROR: date item {idx} in {jid} is not dict: {d}")
            elif 'event' not in d or not isinstance(d['event'], str):
                print(f"ERROR: date item {idx} in {jid} has bad event: {d}")

    faqs = job.get('faqs', [])
    if not isinstance(faqs, list):
        print(f"ERROR: faqs is not a list in {jid}: {faqs}")
    else:
        for idx, f_item in enumerate(faqs):
            if not isinstance(f_item, dict):
                print(f"ERROR: faq item {idx} in {jid} is not dict: {f_item}")

print("Checked all 215 jobs in jobDetails.json for schema compliance!")
