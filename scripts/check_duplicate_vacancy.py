import re
import sys
import os
import json

def load_jobs_data():
    details_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobDetails.json')
    jobs_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobsData.ts')
    
    jobs = []
    seen_ids = set()
    
    if os.path.exists(details_path):
        try:
            with open(details_path, 'r', encoding='utf-8') as f:
                details = json.load(f)
                for jid, j in details.items():
                    jobs.append({
                        'id': jid,
                        'board': j.get('board', ''),
                        'title': j.get('title', ''),
                        'advtNo': j.get('advtNo', '')
                    })
                    seen_ids.add(jid)
        except Exception:
            pass
            
    if os.path.exists(jobs_path):
        try:
            with open(jobs_path, 'r', encoding='utf-8') as f:
                content = f.read()
                entries = re.findall(r'\"id\":\s*\"([^\"]+)\"[\s\S]*?\"b\":\s*\"([^\"]+)\"[\s\S]*?\"t\":\s*\"([^\"]+)\"[\s\S]*?\"a\":\s*\"([^\"]+)\"', content)
                for j_id, b, t, a in entries:
                    if j_id not in seen_ids:
                        jobs.append({
                            'id': j_id,
                            'board': b,
                            'title': t,
                            'advtNo': a
                        })
                        seen_ids.add(j_id)
        except Exception:
            pass

    return jobs

STOPWORDS = {
    'all', 'india', 'institute', 'technology', 'medical', 'sciences', 'university',
    'department', 'recruitment', 'online', 'offline', 'posts', 'post', 'vacancies',
    'vacancy', '2026', 'total', 'various', 'apply', 'walkin', 'walk-in', 'notification',
    'notice', 'dated', 'govt', 'government', 'state', 'central', 'commission', 'board',
    'national', 'public'
}

CAMPUS_CITIES = [
    'delhi', 'new delhi', 'tirupati', 'mandi', 'kanpur', 'roorkee', 'kharagpur',
    'dhanbad', 'bhu', 'banaras', 'varanasi', 'bhilai', 'indore', 'amritsar',
    'udaipur', 'jodhpur', 'rishikesh', 'nagpur', 'bhubaneswar', 'guwahati',
    'patna', 'raipur', 'bhopal', 'farrukhabad', 'chitrakoot', 'muzaffarnagar',
    'hamirpur', 'mathura', 'ballia', 'dhamtari', 'kondagaon', 'ambikapur',
    'munger', 'sangrur', 'kapurthala', 'sivaganga', 'kancheepuram', 'kanchipuram',
    'khammam', 'prakasam', 'shibpur', 'kolkata', 'pune', 'mumbai', 'trichy', 'madras',
    'deoghar', 'kozhikode'
]

GENERIC_ADVTS = {"notification2026", "advtno", "various", "notice", "sric06", "sric", "sricrev0917", "rev0917"}

def extract_distinctive_tokens(text):
    if not text:
        return set()
    tokens = set(re.findall(r'[a-z0-9]{3,}', text.lower()))
    return tokens - STOPWORDS

def check_duplicate(query_text, board_query="", advt_query=""):
    jobs = load_jobs_data()
    matches = []
    
    clean_advt_query = re.sub(r'[^a-z0-9]', '', advt_query.lower()) if advt_query else ""
    is_valid_advt = bool(clean_advt_query and len(clean_advt_query) >= 5 and not clean_advt_query.endswith("2026") and clean_advt_query not in GENERIC_ADVTS)
    
    board_tokens = extract_distinctive_tokens(board_query)
    post_tokens = extract_distinctive_tokens(query_text) - board_tokens

    # Detect if query specifies a particular city/campus
    q_lower = f"{query_text} {board_query}".lower()
    query_campus = [c for c in CAMPUS_CITIES if c in q_lower]

    for job in jobs:
        score = 0
        reasons = []
        
        job_id = job['id'].lower()
        job_title = job['title'].lower()
        job_board = job['board'].lower()
        job_advt = job['advtNo'].lower()
        
        # 1. Exact or authoritative Advt No match
        clean_job_advt = re.sub(r'[^a-z0-9]', '', job_advt)
        if is_valid_advt and clean_job_advt and clean_job_advt not in GENERIC_ADVTS:
            if clean_advt_query == clean_job_advt:
                score += 55
                reasons.append(f"Exact Advt No. match ({advt_query})")

        # 2. Check campus mismatch (e.g. IIT Delhi vs IIT Tirupati)
        job_full_text = f"{job_id} {job_title} {job_board}"
        job_campus = [c for c in CAMPUS_CITIES if c in job_full_text]
        if query_campus and job_campus:
            if not set(query_campus).intersection(set(job_campus)):
                continue

        # 3. Organization match
        job_board_tokens = extract_distinctive_tokens(job_board)
        board_match = False
        if board_tokens and job_board_tokens:
            common_board = board_tokens.intersection(job_board_tokens)
            if len(common_board) >= max(1, min(len(board_tokens), len(job_board_tokens)) * 0.6):
                board_match = True

        # 4. Post designation match
        job_title_tokens = extract_distinctive_tokens(job_title) - job_board_tokens
        post_match = False
        if board_match:
            if is_valid_advt and clean_job_advt and clean_job_advt not in GENERIC_ADVTS:
                if clean_advt_query != clean_job_advt:
                    continue

            if post_tokens and job_title_tokens:
                # Disambiguate Junior vs Senior
                if ('junior' in post_tokens and 'senior' in job_title_tokens) or ('senior' in post_tokens and 'junior' in job_title_tokens):
                    continue
                # Disambiguate Assistant vs Associate vs Fellow vs Scientist
                if ('assistant' in post_tokens and any(k in job_title_tokens for k in ['associate', 'fellow', 'scientist'])) or \
                   ('associate' in post_tokens and any(k in job_title_tokens for k in ['assistant', 'fellow', 'scientist'])):
                    continue

                common_post = post_tokens.intersection(job_title_tokens)
                if len(post_tokens) <= 2:
                    if common_post == post_tokens and len(job_title_tokens) <= 3:
                        post_match = True
                else:
                    if len(common_post) >= max(2, len(post_tokens) * 0.7):
                        post_match = True

        if board_match and post_match:
            score += 45
            reasons.append(f"Same Board and matching Post designation ({', '.join(post_tokens.intersection(job_title_tokens))})")
        elif board_match and not post_match:
            score += 15
            reasons.append(f"Board match only ({board_query}), post appears distinct")
        elif post_match and not board_match:
            score += 10
            reasons.append("Post keyword overlap only, different board")

        if score >= 40:
            matches.append({
                'score': score,
                'id': job['id'],
                'board': job['board'],
                'title': job['title'],
                'advtNo': job['advtNo'],
                'reasons': reasons
            })

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
