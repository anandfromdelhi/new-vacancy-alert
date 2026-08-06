with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read().lower()

print("TSLPRB in jobsData?", 'tslprb' in text or 'telangana state level police' in text)
