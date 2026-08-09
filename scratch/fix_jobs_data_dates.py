with open('src/data/jobsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"d": "08.08.2026"', '"d": "08-08-2026"')
text = text.replace('"d": "07.08.2026"', '"d": "07-08-2026"')

with open('src/data/jobsData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Standardized dates in jobsData.ts")
