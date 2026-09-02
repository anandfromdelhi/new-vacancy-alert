import json
import re

months = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September'
}

def format_date_str(s):
    if not isinstance(s, str):
        return s
    def repl(m):
        d, mon, y = m.group(1), m.group(2), m.group(3)
        mon_name = months.get(mon, mon)
        return f"{int(d):02d} {mon_name} {y}"
    # match DD.MM.YYYY or DD/MM/YYYY
    s = re.sub(r'\b([0-3]?[0-9])[\./]([0-1]?[0-9])[\./](202[4-9])\b', repl, s)
    return s

# 1. Update jobDetails.json
with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

# Sync tnpsc duplicate entry
if 'tnpsc-ctse-interview-posts-recruitment-2026' in details:
    source = details['tnpsc-ctse-interview-posts-recruitment-2026']
    dup = dict(source)
    dup['id'] = 'tnpsc-ctse-interview-posts-research-assistant-assistant-m-recruitment-2026'
    details['tnpsc-ctse-interview-posts-research-assistant-assistant-m-recruitment-2026'] = dup

converted_count = 0
for jid, job in details.items():
    if 'importantDates' in job and isinstance(job['importantDates'], list):
        for item in job['importantDates']:
            if 'date' in item:
                old = item['date']
                new = format_date_str(old)
                if old != new:
                    item['date'] = new
                    converted_count += 1

with open('src/data/jobDetails.json', 'w', encoding='utf-8') as f:
    json.dump(details, f, indent=2, ensure_ascii=False)

print(f"Converted {converted_count} dates in jobDetails.json")

# 2. Update jobsData.ts
with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '"l":' in line or '"d":' in line:
        m = re.search(r'\"([ld])\":\s*\"([^\"]+)\"', line)
        if m:
            key = m.group(1)
            val = m.group(2)
            formatted = format_date_str(val)
            line = re.sub(r'\"([ld])\":\s*\"([^\"]+)\"', f'"{key}": "{formatted}"', line)
    new_lines.append(line)

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated jobsData.ts with spelled-out month names!")
