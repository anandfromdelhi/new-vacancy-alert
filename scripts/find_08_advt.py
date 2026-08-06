import re

with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"].*?a:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
for j_id, b, t, a in matches:
    if '08' in a or '08' in j_id or '08' in t:
        print(f"ID: {j_id}\nBoard: {b}\nTitle: {t}\nAdvt: {a}\n")
