import re

with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"].*?a:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
for j_id, b, t, a in matches:
    if 'pnb' in j_id.lower() or 'local bank officer' in t.lower() or 'cuttack' in j_id.lower():
        print(f"ID: {j_id}\nBoard: {b}\nTitle: {t}\nAdvt: {a}\n")
