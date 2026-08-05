with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("NICL in jobsData?", 'nicl' in text.lower() or 'national insurance' in text.lower())
