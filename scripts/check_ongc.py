with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("ONGC in jobsData?", 'ongc' in text.lower())
