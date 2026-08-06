with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobDetails.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("Is tslprb-si-asi-constable-recruitment-2026 in jobDetails.ts?", 'tslprb-si-asi-constable-recruitment-2026' in text)
if 'tslprb-si-asi-constable-recruitment-2026' in text:
    pos = text.find('tslprb-si-asi-constable-recruitment-2026')
    print("Snippet:")
    print(text[pos:pos+1200])
