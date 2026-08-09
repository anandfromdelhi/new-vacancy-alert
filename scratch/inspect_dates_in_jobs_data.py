import json, re

with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract top 10 objects in JOBS_DATA
matches = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"b":\s*"([^"]+)",\s*"t":\s*"([^"]+)",\s*"d":\s*"([^"]+)"', text)

print("=== TOP 10 JOBS IN JOBS_DATA WITH DATES ===")
for idx, (jid, b, t, d) in enumerate(matches[:10], 1):
    print(f"{idx}. ID: {jid}")
    print(f"   Date: {d}")
    print(f"   Board: {b[:50]}")
    print("-" * 50)
