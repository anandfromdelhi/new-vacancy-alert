with open(r'c:\Users\Administrator\.gemini\antigravity\scratch\new-vacancy-alert\src\data\jobDetails.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("tslprb-si-asi-constable-recruitment-2026': {")
end_pos = text.find("tslprb-constable-firemen-warder-recruitment-2026': {")
if pos != -1:
    print(text[pos:pos+3500])
