import re

with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
for j_id, b, t in matches:
    if 'nicl' in j_id or 'insurance' in b.lower() or 'national insurance' in t.lower():
        print(f"ID: {j_id}\nBoard: {b}\nTitle: {t}\n")
