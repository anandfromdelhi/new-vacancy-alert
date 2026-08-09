import re

with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Check for unsafe property accesses like .length, .map, .join, .split, .find without optional chaining
matches = re.findall(r'(\w+(?:\.\w+)+)', text)

unsafe_accesses = []
for m in matches:
    parts = m.split('.')
    if len(parts) > 2:
        # e.g., job.highlights.map
        if 'job' in parts[0]:
            unsafe_accesses.append(m)

print("Potential unsafe accesses in JobDetailPage:")
for u in set(unsafe_accesses):
    print(" ", u)
