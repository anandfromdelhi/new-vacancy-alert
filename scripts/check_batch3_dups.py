with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read().lower()

print("AIIMS Bhubaneswar Deputation in jobsData?", 'bhubaneswar' in text and 'deputation/02/2026' in text)
print("JKSSB 08/2026 in jobsData?", '08 of 2026' in text or '08/2026' in text)
print("IISER Pune 62/2026 in jobsData?", 'iiser' in text or '62/2026' in text)
