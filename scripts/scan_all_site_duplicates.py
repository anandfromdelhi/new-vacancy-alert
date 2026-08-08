import json
import re
from collections import defaultdict
from difflib import SequenceMatcher

def clean_str(s):
    if not s:
        return ""
    # remove punctuation and whitespace, lowercase
    return re.sub(r'[^a-zA-Z0-9]', '', str(s)).lower()

def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

# Load jobsData.ts
jobs_data_path = 'src/data/jobsData.ts'
with open(jobs_data_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JOBS_DATA array items using regex or json extraction
# Parse objects in jobsData.ts
entries = []
pattern = re.compile(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*b:\s*[\'"]([^\'"]+)[\'"],\s*t:\s*[\'"]([^\'"]+)[\'"],\s*d:\s*[\'"]([^\'"]+)[\'"],\s*l:\s*[\'"]([^\'"]+)[\'"],\s*a:\s*[\'"]([^\'"]+)[\'"],\s*q:\s*[\'"]([^\'"]+)[\'"],\s*desc:\s*[\'"]([^\'"]+)[\'"],\s*u:\s*[\'"]([^\'"]+)[\'"]\s*\}', re.DOTALL)

for m in pattern.finditer(content):
    entries.append({
        'id': m.group(1),
        'b': m.group(2),
        't': m.group(3),
        'd': m.group(4),
        'l': m.group(5),
        'a': m.group(6),
        'q': m.group(7),
        'desc': m.group(8),
        'u': m.group(9)
    })

print(f"Total parsed entries from jobsData.ts: {len(entries)}")

# Load jobDetails.json
job_details_path = 'src/data/jobDetails.json'
with open(job_details_path, 'r', encoding='utf-8') as f:
    job_details = json.load(f)

print(f"Total keys in jobDetails.json: {len(job_details)}")

# 1. Check Duplicate IDs in jobsData.ts
id_counts = defaultdict(list)
for idx, entry in enumerate(entries):
    id_counts[entry['id']].append(idx)

duplicate_ids = {k: v for k, v in id_counts.items() if len(v) > 1}
if duplicate_ids:
    print(f"\n⚠️ DUPLICATE IDs FOUND IN jobsData.ts ({len(duplicate_ids)}):")
    for k, v in duplicate_ids.items():
        print(f"  ID: {k} -> Indices: {v}")
else:
    print("\n✅ No duplicate IDs in jobsData.ts.")

# 2. Check Duplicate Advt Numbers
advt_map = defaultdict(list)
for entry in entries:
    clean_advt = clean_str(entry['a'])
    if len(clean_advt) > 3 and clean_advt not in ['nil', 'na', 'notmentioned', 'various']:
        advt_map[clean_advt].append(entry)

duplicate_advts = {k: v for k, v in advt_map.items() if len(v) > 1}
if duplicate_advts:
    print(f"\n⚠️ DUPLICATE ADVERTISEMENT NUMBERS FOUND ({len(duplicate_advts)} groups):")
    for k, v in duplicate_advts.items():
        print(f"\n  Advt Group: {k}")
        for e in v:
            print(f"    - ID: {e['id']} | Advt: '{e['a']}' | Title: {e['t'][:80]}...")

# 3. Check High Title & Board Similarity Pairs
print("\nScanning for duplicate / highly similar vacancies (Title & Board)...")
similar_pairs = []
for i in range(len(entries)):
    for j in range(i + 1, len(entries)):
        e1 = entries[i]
        e2 = entries[j]
        
        # Board similarity
        b_sim = similarity(clean_str(e1['b']), clean_str(e2['b']))
        # Title similarity
        t_sim = similarity(clean_str(e1['t']), clean_str(e2['t']))
        
        if (b_sim > 0.8 and t_sim > 0.75) or t_sim > 0.85:
            similar_pairs.append((i, j, b_sim, t_sim, e1, e2))

if similar_pairs:
    print(f"\n⚠️ HIGH SIMILARITY VACANCY PAIRS FOUND ({len(similar_pairs)}):")
    for idx1, idx2, b_sim, t_sim, e1, e2 in similar_pairs:
        print(f"\n  Pair: {e1['id']} <---> {e2['id']}")
        print(f"    Board Sim: {b_sim:.2f} | Title Sim: {t_sim:.2f}")
        print(f"    Item 1: {e1['t'][:80]} | Advt: '{e1['a']}'")
        print(f"    Item 2: {e2['t'][:80]} | Advt: '{e2['a']}'")
else:
    print("\n✅ No high-similarity duplicate vacancies found.")

# 4. Check Mismatches between jobsData.ts and jobDetails.json
jobs_data_ids = set(e['id'] for e in entries)
details_ids = set(job_details.keys())

missing_in_details = jobs_data_ids - details_ids
missing_in_jobs_data = details_ids - jobs_data_ids

if missing_in_details:
    print(f"\n⚠️ IDs in jobsData.ts but missing in jobDetails.json ({len(missing_in_details)}):")
    for mid in missing_in_details:
        print(f"  - {mid}")

if missing_in_jobs_data:
    print(f"\n⚠️ IDs in jobDetails.json but missing in jobsData.ts ({len(missing_in_jobs_data)}):")
    for mid in missing_in_jobs_data:
        print(f"  - {mid}")
