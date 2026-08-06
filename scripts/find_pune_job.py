import re

with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
for j_id, b, t in matches:
    if 'pune' in j_id.lower() or 'pune' in b.lower() or 'pune' in t.lower() or 'bibvewadi' in j_id.lower() or 'bibvewadi' in t.lower():
        print(f"ID: {j_id}\nBoard: {b}\nTitle: {t}\n")
