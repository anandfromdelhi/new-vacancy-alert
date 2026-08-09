import re

pages = [
    'src/pages/HomePage.tsx',
    'src/pages/BoardJobsPage.tsx',
    'src/pages/QualificationJobsPage.tsx',
    'src/pages/StateJobsPage.tsx'
]

for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f"=== {p} ===")
    print("Uses JOBS_DATA:", 'JOBS_DATA' in text)
    print("Uses jobDetailsData:", 'jobDetailsData' in text or 'jobDetails' in text)
