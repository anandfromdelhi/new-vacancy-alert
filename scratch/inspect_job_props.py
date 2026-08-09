import json

with open('src/data/jobDetails.json', 'r', encoding='utf-8') as f:
    details = json.load(f)

added_jobs = [
    'isro-hsfc-scientist-engineer-sd-recruitment-2026',
    'krcl-apprentice-recruitment-2026',
    'iob-local-bank-officer-recruitment-2026',
    'upsc-recruitment-advt-10-2026'
]

for jid in added_jobs:
    job = details.get(jid, {})
    print(f"=== Job: {jid} ===")
    print("  howToApply type:", type(job.get('howToApply')).__name__, job.get('howToApply'))
    print("  howToApplySteps type:", type(job.get('howToApplySteps')).__name__, len(job.get('howToApplySteps', [])) if isinstance(job.get('howToApplySteps'), list) else 'N/A')
    print("  reservation type:", type(job.get('reservation')).__name__)
    print("  examPattern type:", type(job.get('examPattern')).__name__)
