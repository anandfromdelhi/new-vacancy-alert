with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'applicationFee', text)]
for idx in matches:
    start = max(0, idx - 100)
    end = min(len(text), idx + 100)
    print("MATCH:", text[start:end])
    print("-" * 50)
