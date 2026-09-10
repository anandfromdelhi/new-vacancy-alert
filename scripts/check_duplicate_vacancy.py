import re
import sys
import os
import json

BOARD_ALIASES = {
    'ssc': 'staff selection commission',
    'staff selection commission': 'ssc',
    'uksssc': 'uttarakhand subordinate service selection commission',
    'uttarakhand subordinate service selection commission': 'uksssc',
    'tnpsc': 'tamil nadu public service commission',
    'tamil nadu public service commission': 'tnpsc',
    'gims': 'government institute of medical sciences',
    'government institute of medical sciences': 'gims',
    'tmc': 'tata memorial centre',
    'tata memorial centre': 'tmc',
    'hbchrc': 'homi bhabha cancer hospital and research centre',
    'homi bhabha cancer hospital': 'hbchrc',
    'leda': 'lakshadweep energy development agency',
    'lakshadweep energy development': 'leda',
    'concor': 'container corporation of india',
    'container corporation of india': 'concor',
    'rars': 'regional agricultural research station',
    'regional agricultural research station': 'rars',
    'apsp': 'andhra pradesh police',
    'ap police': 'andhra pradesh police',
    'wcd': 'women and child development',
    'iit': 'indian institute of technology',
    'nit': 'national institute of technology',
    'aiims': 'all india institute of medical sciences',
    'iibf': 'indian institute of banking and finance',
    'psssb': 'subordinate services selection board punjab',
    'sssb punjab': 'subordinate services selection board punjab'
}

def normalize_url(u):
    if not u or not isinstance(u, str):
        return ""
    u = u.strip().lower()
    # strip protocol and trailing slash
    u = re.sub(r'^https?://(www\.)?', '', u).rstrip('/')
    return u

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
                    # Collect all URLs
                    urls_list = []
                    if j.get('u'):
                        urls_list.append(normalize_url(j.get('u')))
                    if isinstance(j.get('urls'), list):
                        for u_item in j.get('urls', []):
                            if isinstance(u_item, dict) and u_item.get('url'):
                                urls_list.append(normalize_url(u_item.get('url')))
                            elif isinstance(u_item, str):
                                urls_list.append(normalize_url(u_item))
                    
                    jobs.append({
                        'id': jid,
                        'board': j.get('board', ''),
                        'title': j.get('title', ''),
                        'advtNo': j.get('advtNo', ''),
                        'vacancies': str(j.get('vacancies', '')).strip(),
                        'urls': [u for u in set(urls_list) if u and len(u) > 10]
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
                            'advtNo': a,
                            'vacancies': '',
                            'urls': []
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
    'deoghar', 'kozhikode', 'greater noida', 'chintapalle', 'yadgir'
]

GENERIC_ADVTS = {"notification2026", "advtno", "various", "notice", "sric06", "sric", "sricrev0917", "rev0917"}

def extract_distinctive_tokens(text):
    if not text:
        return set()
    tokens = set(re.findall(r'[a-z0-9]{3,}', text.lower()))
    return tokens - STOPWORDS

def check_duplicate(query_text, board_query="", advt_query="", url_query="", vacancies_query=None):
    jobs = load_jobs_data()
    matches = []
    
    clean_advt_query = re.sub(r'[^a-z0-9]', '', advt_query.lower()) if advt_query else ""
    is_valid_advt = bool(clean_advt_query and len(clean_advt_query) >= 4 and not clean_advt_query.endswith("2026") and clean_advt_query not in GENERIC_ADVTS)
    
    norm_url_query = normalize_url(url_query)
    is_valid_url = bool(norm_url_query and len(norm_url_query) > 15 and not norm_url_query.endswith('.gov.in') and not norm_url_query.endswith('.nic.in'))
    
    board_tokens = extract_distinctive_tokens(board_query)
    # Check alias expansion
    b_lower = board_query.lower().strip()
    for alias, expansion in BOARD_ALIASES.items():
        if alias in b_lower:
            board_tokens.update(extract_distinctive_tokens(expansion))

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
        job_vacancies = job['vacancies']
        job_urls = job.get('urls', [])

        # 1. Exact Source / PDF URL match
        if is_valid_url:
            for u in job_urls:
                if norm_url_query == u or (norm_url_query.endswith('.pdf') and norm_url_query in u) or (u.endswith('.pdf') and u in norm_url_query):
                    score += 90
                    reasons.append(f"Identical official notification / PDF URL ({url_query})")
                    break

        # 2. Exact or authoritative Advt No match
        clean_job_advt = re.sub(r'[^a-z0-9]', '', job_advt)
        if is_valid_advt and clean_job_advt and clean_job_advt not in GENERIC_ADVTS:
            if clean_advt_query == clean_job_advt or clean_job_advt.startswith(clean_advt_query) or clean_advt_query.startswith(clean_job_advt):
                score += 55
                reasons.append(f"Exact Advt No. match ({advt_query})")

        # 3. Check campus mismatch (e.g. IIT Delhi vs IIT Tirupati)
        job_full_text = f"{job_id} {job_title} {job_board}"
        job_campus = [c for c in CAMPUS_CITIES if c in job_full_text]
        if query_campus and job_campus:
            if not set(query_campus).intersection(set(job_campus)):
                # Different campus/city -> skip unless URL or Advt perfectly matched
                if score < 50:
                    continue

        # 4. Organization match (with alias expansion)
        job_board_tokens = extract_distinctive_tokens(job_board)
        for alias, expansion in BOARD_ALIASES.items():
            if alias in job_board:
                job_board_tokens.update(extract_distinctive_tokens(expansion))

        board_match = False
        if board_tokens and job_board_tokens:
            common_board = board_tokens.intersection(job_board_tokens)
            if len(common_board) >= max(1, min(len(board_tokens), len(job_board_tokens)) * 0.5):
                board_match = True

        # 5. Post designation match
        job_title_tokens = extract_distinctive_tokens(job_title) - job_board_tokens
        post_match = False
        if board_match:
            if post_tokens and job_title_tokens:
                # Disambiguate Junior vs Senior
                if ('junior' in post_tokens and 'senior' in job_title_tokens) or ('senior' in post_tokens and 'junior' in job_title_tokens):
                    pass
                elif ('assistant' in post_tokens and any(k in job_title_tokens for k in ['associate', 'fellow', 'scientist'])) or \
                     ('associate' in post_tokens and any(k in job_title_tokens for k in ['assistant', 'fellow', 'scientist'])):
                    pass
                else:
                    common_post = post_tokens.intersection(job_title_tokens)
                    if len(post_tokens) <= 2:
                        if common_post == post_tokens:
                            post_match = True
                    else:
                        if len(common_post) >= max(2, len(post_tokens) * 0.6):
                            post_match = True

        if board_match and post_match:
            score += 45
            reasons.append(f"Same Board and matching Post designation ({', '.join(post_tokens.intersection(job_title_tokens))})")
        elif board_match and not post_match:
            score += 15
            reasons.append(f"Board match ({board_query}), post designation appears distinct")
        elif post_match and not board_match:
            score += 10
            reasons.append("Post keyword overlap only, different board")

        # 6. Total Vacancies match
        if vacancies_query and job_vacancies and str(vacancies_query).strip() == job_vacancies and str(vacancies_query).strip() not in ['1', '0', '']:
            if board_match or score >= 30:
                score += 30
                reasons.append(f"Matching total vacancy count: {job_vacancies}")

        if score >= 40:
            matches.append({
                'score': score,
                'id': job['id'],
                'board': job['board'],
                'title': job['title'],
                'advtNo': job['advtNo'],
                'vacancies': job['vacancies'],
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
        print("Usage: python check_duplicate_vacancy.py <query_text_or_advt> [board_name] [advt_no] [url_or_pdf] [vacancies]")
        sys.exit(1)
        
    query_text = sys.argv[1]
    board_query = sys.argv[2] if len(sys.argv) > 2 else ""
    advt_query = sys.argv[3] if len(sys.argv) > 3 else ""
    url_query = sys.argv[4] if len(sys.argv) > 4 else ""
    vacancies_query = sys.argv[5] if len(sys.argv) > 5 else None

    results = check_duplicate(query_text, board_query, advt_query, url_query, vacancies_query)
    
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
            if m.get('vacancies'):
                print(f"    Vacancies: {m['vacancies']}")
            print(f"    Reasons : {', '.join(m['reasons'])}")
            print("-" * 55)
    else:
        print("[OK] NO DUPLICATE FOUND!")
        print("The uploaded job notification appears to be NEW and is NOT currently present on your site.")
    print("=======================================================\n")

