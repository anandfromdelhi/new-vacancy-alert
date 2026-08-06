with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read().lower()

print("Pune in jobsData?", 'pune' in text or 'bibvewadi' in text)
print("Bikaner in jobsData?", 'bikaner' in text)
print("MANUU in jobsData?", 'manuu' in text or 'darbhanga' in text)
