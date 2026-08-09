import re

files_to_check = [
    'src/data/jobsData.ts',
    'src/data/jobDetails.ts',
    'src/utils/categoryUtils.ts',
    'src/pages/HomePage.tsx'
]

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    imports = re.findall(r'import\s+.*?;', text)
    print(f"=== Imports in {filepath} ===")
    for imp in imports[:10]:
        print(" ", imp)
