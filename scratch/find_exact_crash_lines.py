import re

with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines, 1):
    for prop in ['howToApply', 'reservation', 'examPattern', 'examCentres']:
        if f'job.{prop}' in line:
            print(f"Line {idx}: {line.strip()}")
