import re
import sys
import os
import json

def load_jobs_data():
    jobs_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobsData.ts')
    details_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobDetails.ts')
    
    jobs = []
    
    if os.path.exists(jobs_path):
        with open(jobs_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract items from JOBS_DATA array
            entries = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?b:\s*[\'"]([^\'"]+)[\'"].*?t:\s*[\'"]([^\'"]+)[\'"].*?a:\s*[\'"]([^\'"]+)[\'"]', content, re.DOTALL)
            for j_id, b, t, a in entries:
                jobs.append({
                    'id': j_id,
                    'board': b,
                    'title': t,
                    'advtNo': a
                })
    return jobs

def check_duplicate(query_text, board_query="", advt_query=""):
    jobs = load_jobs_data()
    matches = []
    
    query_tokens = set(re.findall(r'\w+', query_text.lower()))
    board_tokens = set(re.findall(r'\w+', board_query.lower())) if board_query else set()
    advt_tokens = set(re.findall(r'\w+', advt_query.lower())) if advt_query else set()

    for job in jobs:
        score = 0
        reasons = []
        
        job_id = job['id'].lower()
        job_title = job['title'].lower()
        job_board = job['board'].lower()
        job_advt = job['advtNo'].lower()
        
        # 1. Exact or partial Advt No / Letter No match (highest confidence)
        if advt_query:
            clean_advt = re.sub(r'[^a-z0-9]', '', advt_query.lower())
            clean_job_advt = re.sub(r'[^a-z0-9]', '', job_advt)
            clean_job_title = re.sub(r'[^a-z0-9]', '', job_title)
            
            if clean_advt and len(clean_advt) >= 4:
                if clean_advt in clean_job_advt or clean_advt in clean_job_title:
                    score += 50
                    reasons.append(f"Advt/Letter No. match ({advt_query})")
        
        # 2. Board / Department match
        if board_query:
            if board_query.lower() in job_board or board_query.lower() in job_title or job_board in board_query.lower():
                score += 30
                reasons.append(f"Board match ({board_query})")
        
        # 3. Text query word overlap
        if query_text:
            text_matches = [w for w in query_tokens if len(w) > 3 and (w in job_id or w in job_title or w in job_board)]
            if text_matches:
                score += len(text_matches) * 5
                reasons.append(f"Keyword matches: {', '.join(text_matches[:5])}")

        if score >= 15:
            matches.append({
                'score': score,
                'id': job['id'],
                'board': job['board'],
                'title': job['title'],
                'advtNo': job['advtNo'],
                'reasons': reasons
            })

    # Sort matches by score descending
    matches.sort(key=lambda x: x['score'], reverse=True)
    return matches

if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    if len(sys.argv) < 2:
        print("Usage: python check_duplicate_vacancy.py <query_text_or_advt> [board_name] [advt_no]")
        sys.exit(1)
        
    query_text = sys.argv[1]
    board_query = sys.argv[2] if len(sys.argv) > 2 else ""
    advt_query = sys.argv[3] if len(sys.argv) > 3 else ""

    results = check_duplicate(query_text, board_query, advt_query)
    
    print("\n=======================================================")
    print("      VACANCY DUPLICATE CHECKER REPORT                 ")
    print("=======================================================\n")
    if results:
        print(f"[!] POSSIBLE DUPLICATE(S) FOUND ({len(results)} matches):\n")
        for idx, m in enumerate(results[:5], 1):
            print(f"[{idx}] Match Score: {m['score']}")
            print(f"    Job ID  : {m['id']}")
            print(f"    Board   : {m['board']}")
            print(f"    Title   : {m['title']}")
            print(f"    Advt No : {m['advtNo']}")
            print(f"    Reasons : {', '.join(m['reasons'])}")
            print("-" * 55)
    else:
        print("[OK] NO DUPLICATE FOUND!")
        print("The uploaded job notification appears to be NEW and is NOT currently present on your site.")
    print("=======================================================\n")
