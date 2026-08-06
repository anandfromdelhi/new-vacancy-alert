import re

with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
for j_id, b, t in matches:
    if 'ongc' in j_id or 'ongc' in b.lower() or 'ongc' in t.lower():
        print(f"ID: {j_id}\nBoard: {b}\nTitle: {t}\n")
