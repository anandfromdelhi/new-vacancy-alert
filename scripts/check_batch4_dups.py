with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read().lower()

print("PNB LBO in jobsData?", 'local bank officer' in text or 'lbo' in text or 'pnb' in text and '545' in text)
print("SBS Nagar Clerk in jobsData?", 'shaheed bhagat singh' in text or 'sbs nagar' in text or 'nawanshahr' in text)
print("Sonepur Court in jobsData?", 'sonepur' in text or 'subarnapur' in text)
print("Balasore Court in jobsData?", 'balasore' in text)
print("Cuttack Court in jobsData?", 'cuttack' in text and 'salaried amin' in text)
