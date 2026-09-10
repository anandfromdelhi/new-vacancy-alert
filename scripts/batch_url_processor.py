import sys
import os
import re
import json
import ssl
import time
import subprocess
import datetime
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
        sys.stderr.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DETAILS_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobDetails.json')
JOBS_DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobsData.ts')
UPLOAD_DATES_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobUploadDates.json')
URLS_FILE = os.path.join(PROJECT_ROOT, 'scripts', 'urls_to_process.json')
PROGRESS_FILE = os.path.join(PROJECT_ROOT, 'scratch', 'batch_progress.json')
GIT_PATH = r"C:\Users\Administrator\MinGit\cmd\git.exe" if os.name == 'nt' else "git"
NPM_CMD = "npm.cmd" if os.name == 'nt' else "npm"
NPX_CMD = "npx.cmd" if os.name == 'nt' else "npx"

with open(URLS_FILE, 'r', encoding='utf-8-sig') as f:
    INPUT_URLS = json.load(f)

MONTHS_MAP = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September'
}

def clean_text(text):
    if not text:
        return ""
    if isinstance(text, list):
        text = " | ".join(str(item) for item in text if item)
    elif not isinstance(text, str):
        text = str(text)
    text = text.replace('\xa0', ' ').replace('\u2013', '-').replace('\u2014', '-').replace('\ufffd', ' ')
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

BOARD_ACRONYM_MAP = {
    'staff selection commission': 'ssc',
    'union public service commission': 'upsc',
    'railway recruitment board': 'rrb',
    'uttarakhand subordinate service selection commission': 'uksssc',
    'tamil nadu public service commission': 'tnpsc',
    'government institute of medical sciences': 'gims',
    'tata memorial centre': 'tmc',
    'homi bhabha cancer hospital': 'hbchrc',
    'lakshadweep energy development': 'leda',
    'container corporation of india': 'concor',
    'subordinate services selection board punjab': 'psssb',
    'rajasthan staff selection board': 'rsmssb',
    'madhya pradesh employees selection board': 'mpesb',
    'national institute of technology': 'nit',
    'indian institute of technology': 'iit',
    'all india institute of medical sciences': 'aiims',
    'institute of banking personnel selection': 'ibps',
    'defence research and development': 'drdo',
    'indian space research': 'isro',
    'bharat electronics limited': 'bel',
    'bharat heavy electricals': 'bhel',
    'steel authority of india': 'sail',
    'oil and natural gas': 'ongc'
}

EXAM_ACRONYM_MAP = {
    'junior engineer': 'je',
    'combined graduate level': 'cgl',
    'combined higher secondary level': 'chsl',
    'combined higher secondary': 'chsl',
    'multi tasking staff': 'mts',
    'assistant loco pilot': 'alp',
    'non technical popular categories': 'ntpc',
    'combined technical services': 'ctse',
    'senior research fellow': 'srf',
    'junior research fellow': 'jrf',
    'medical officer': 'mo',
    'general duty': 'gd',
    'central police': 'cpo',
    'gramin dak sevak': 'gds'
}

def generate_short_slug(board, post_name, year="2026"):
    b_lower = board.lower()
    p_lower = post_name.lower()

    b_key = None
    m_paren = re.search(r'\(([A-Z0-9\s-]{2,10})\)', board)
    if m_paren:
        cand = slugify(m_paren.group(1))
        if 2 <= len(cand) <= 12:
            b_key = cand

    if not b_key:
        for full_name, acro in BOARD_ACRONYM_MAP.items():
            if full_name in b_lower:
                b_key = acro
                for city in ['delhi', 'mandi', 'kanpur', 'roorkee', 'kharagpur', 'madras', 'bombay', 'goa', 'tirupati', 'patna', 'bhubaneswar', 'rishikesh', 'jodhpur', 'deoghar']:
                    if city in b_lower:
                        b_key = f"{acro}-{city}"
                        break
                break

    if not b_key:
        b_key = slugify(board)[:18].strip('-')

    p_key = None
    for full_exam, acro in EXAM_ACRONYM_MAP.items():
        if full_exam in p_lower:
            p_key = acro
            break

    if not p_key:
        p_clean = slugify(post_name)
        p_clean = re.sub(r'(recruitment|notification|apply|online|offline|posts?|vacanc\w*|total)', '', p_clean)
        p_words = [w for w in p_clean.split('-') if len(w) > 1]
        p_key = '-'.join(p_words[:2]) if p_words else 'jobs'

    p_key = p_key[:20].strip('-')
    slug = f"{b_key}-{p_key}-recruitment-{year}"
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug

def format_clean_date(date_str):
    if not date_str:
        return "Refer Notification"
    date_str = clean_text(date_str)

    def _replace_num_date(match):
        d_val, m_val, y_val = int(match.group(1)), int(match.group(2)), int(match.group(3))
        if m_val > 12 and d_val <= 12:
            d_val, m_val = m_val, d_val
        try:
            dt = datetime.date(y_val, m_val, d_val)
            return dt.strftime("%d %B %Y")
        except Exception:
            return match.group(0)

    formatted = re.sub(r'(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})', _replace_num_date, date_str)
    
    month_map = {
        'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
        'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
        'sep': 'September', 'sept': 'September', 'oct': 'October',
        'nov': 'November', 'dec': 'December'
    }
    formatted = re.sub(
        r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b(?:\.?)',
        lambda m: month_map[m.group(1).lower()],
        formatted,
        flags=re.IGNORECASE
    )
    formatted = re.sub(r'(\d{1,2})-(January|February|March|April|May|June|July|August|September|October|November|December)-(\d{4})', r'\1 \2 \3', formatted)
    return formatted

def format_short_qualification(qual_text):
    if not qual_text:
        return "See eligibility criteria"
    clean_q = clean_text(qual_text)
    degrees = []
    patterns = [
        (r'\b10th\b|\bMatriculation\b|\bSecondary\b|\b8th\b', '10th / 8th Pass'),
        (r'\b12th\b|\bIntermediate\b|\b10\+2\b|\bPUC\b', '12th Pass'),
        (r'\bITI\b|\bNAC\b|\bNTC\b', 'ITI'),
        (r'\bDiploma\b|\bPolytechnic\b', 'Diploma'),
        (r'\bB\.?E\b|\bB\.?Tech\b|\bEngineering\b', 'B.Tech / B.E'),
        (r'\bM\.?E\b|\bM\.?Tech\b', 'M.Tech / M.E'),
        (r'\bB\.?Sc\b|\bBSc\b', 'B.Sc'),
        (r'\bM\.?Sc\b|\bMSc\b', 'M.Sc'),
        (r'\bB\.?Com\b|\bBCom\b', 'B.Com'),
        (r'\bM\.?Com\b|\bMCom\b', 'M.Com'),
        (r'\bBBA\b|\bMBA\b|\bPGDM\b', 'MBA / BBA'),
        (r'\bBCA\b|\bMCA\b', 'MCA / BCA'),
        (r'\bB\.?Ed\b|\bBEd\b|\bCTET\b|\bTET\b', 'B.Ed / Teacher'),
        (r'\bLL\.?B\b|\bLLB\b|\bLL\.?M\b|\bLaw\b', 'Law (LL.B / LL.M)'),
        (r'\bMBBS\b|\bMD\b|\bMS\b|\bDNB\b|\bMedical\b', 'MBBS / Medical PG'),
        (r'\bB\.?Pharm\b|\bD\.?Pharm\b|\bPharmacy\b', 'B.Pharm / D.Pharm'),
        (r'\bGNM\b|\bANM\b|\bNursing\b', 'Nursing (GNM / B.Sc)'),
        (r'\bBDS\b|\bMDS\b|\bDental\b', 'BDS / Dental'),
        (r'\bPh\.?D\b|\bDoctorate\b', 'Ph.D / Doctorate'),
        (r'\bGraduate\b|\bGraduation\b|\bDegree\b|\bBachelor\'?s?\b', "Any Bachelor's Degree"),
        (r'\bMaster\'?s?\b|\bPost Graduat\w+', "Master's / PG Degree"),
    ]
    for pat, label in patterns:
        if re.search(pat, clean_q, re.IGNORECASE):
            if label not in degrees:
                degrees.append(label)
                
    if degrees:
        return " | ".join(degrees[:3])
    if len(clean_q) > 75:
        return clean_q[:72] + "..."
    return clean_q

def load_existing_db():
    existing_jobs = {}
    if os.path.exists(DETAILS_FILE):
        try:
            with open(DETAILS_FILE, 'r', encoding='utf-8') as f:
                existing_jobs = json.load(f)
        except Exception:
            pass
            
    existing_list = []
    if os.path.exists(JOBS_DATA_FILE):
        try:
            with open(JOBS_DATA_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = re.findall(r'\"id\":\s*\"([^\"]+)\"[\s\S]*?\"b\":\s*\"([^\"]+)\"[\s\S]*?\"t\":\s*\"([^\"]+)\"[\s\S]*?\"a\":\s*\"([^\"]+)\"', content)
                for jid, b, t, a in matches:
                    existing_list.append({'id': jid, 'board': b, 'title': t, 'advtNo': a})
        except Exception:
            pass
            
    return existing_jobs, existing_list

STOPWORDS = {
    'all', 'india', 'institute', 'technology', 'medical', 'sciences', 'university',
    'department', 'recruitment', 'online', 'offline', 'posts', 'post', 'vacancies',
    'vacancy', '2026', 'total', 'various', 'apply', 'walkin', 'walk-in', 'notification',
    'notice', 'dated', 'govt', 'government', 'state', 'central', 'commission', 'board',
    'national', 'public', 'for', 'and', 'the', 'under'
}

CAMPUS_CITIES = [
    'delhi', 'new delhi', 'tirupati', 'mandi', 'kanpur', 'roorkee', 'kharagpur',
    'dhanbad', 'bhu', 'banaras', 'varanasi', 'bhilai', 'indore', 'amritsar',
    'udaipur', 'jodhpur', 'rishikesh', 'nagpur', 'bhubaneswar', 'guwahati',
    'patna', 'raipur', 'bhopal', 'farrukhabad', 'chitrakoot', 'muzaffarnagar',
    'hamirpur', 'mathura', 'ballia', 'dhamtari', 'kondagaon', 'ambikapur',
    'munger', 'sangrur', 'kapurthala', 'sivaganga', 'kancheepuram', 'kanchipuram',
    'khammam', 'prakasam', 'shibpur', 'kolkata', 'pune', 'mumbai', 'trichy', 'madras',
    'deoghar', 'kozhikode', 'chittoor', 'dharwad', 'calicut', 'jammu', 'gandhinagar',
    'bijnor', 'balangir', 'krishnagiri', 'nagarkurnool', 'kashipur'
]

GENERIC_ADVTS = {"notification2026", "advtno", "various", "notice", "sric06", "sric", "sricrev0917", "rev0917"}

def extract_distinctive_tokens(text):
    if not text:
        return set()
    tokens = set(re.findall(r'[a-z0-9]{3,}', text.lower()))
    return tokens - STOPWORDS

def check_duplicate(candidate_id, board, title, advt_no, existing_jobs, existing_list, post_name="", date_str=""):
    a_norm = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    if a_norm and len(a_norm) >= 6 and not a_norm.endswith("2026") and a_norm not in GENERIC_ADVTS:
        for jid, j in existing_jobs.items():
            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if ex_advt and ex_advt not in GENERIC_ADVTS and ex_advt == a_norm:
                return True, f"Advt No '{j.get('advtNo')}' matches existing '{jid}'"

    q_lower = f"{board} {title}".lower()
    query_campus = [c for c in CAMPUS_CITIES if c in q_lower]

    board_tokens = extract_distinctive_tokens(board)
    post_tokens = extract_distinctive_tokens(post_name if post_name else title) - board_tokens

    for jid, j in existing_jobs.items():
        ex_board = j.get('board', '')
        ex_title = j.get('title', '')
        ex_lower = f"{jid} {ex_board} {ex_title}".lower()
        
        job_campus = [c for c in CAMPUS_CITIES if c in ex_lower]
        if query_campus and job_campus:
            if not set(query_campus).intersection(set(job_campus)):
                continue

        ex_board_tokens = extract_distinctive_tokens(ex_board)
        board_match = False
        if board_tokens and ex_board_tokens:
            common_board = board_tokens.intersection(ex_board_tokens)
            if len(common_board) >= max(1, min(len(board_tokens), len(ex_board_tokens)) * 0.6):
                board_match = True

        if board_match:
            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if a_norm and ex_advt and len(a_norm) >= 5 and len(ex_advt) >= 5 and a_norm not in GENERIC_ADVTS and ex_advt not in GENERIC_ADVTS:
                if a_norm != ex_advt:
                    continue

            ex_post_tokens = extract_distinctive_tokens(ex_title) - ex_board_tokens
            if post_tokens and ex_post_tokens:
                if ('junior' in post_tokens and 'senior' in ex_post_tokens) or ('senior' in post_tokens and 'junior' in ex_post_tokens):
                    continue
                if ('assistant' in post_tokens and any(k in ex_post_tokens for k in ['associate', 'fellow', 'scientist'])) or \
                   ('associate' in post_tokens and any(k in ex_post_tokens for k in ['assistant', 'fellow', 'scientist'])):
                    continue
                num_q = set(re.findall(r'\b(?:1|2|3|4|5|i|ii|iii|iv|v)\b', (post_name or title).lower()))
                num_ex = set(re.findall(r'\b(?:1|2|3|4|5|i|ii|iii|iv|v)\b', ex_title.lower()))
                if num_q and num_ex and not num_q.intersection(num_ex):
                    continue

                if ('medical' in q_lower and 'medical' not in ex_lower) or ('medical' not in q_lower and 'medical' in ex_lower):
                    if 'scientist' in q_lower and 'scientist' in ex_lower:
                        continue

                common_post = post_tokens.intersection(ex_post_tokens)
                if len(post_tokens) <= 2:
                    if common_post == post_tokens and len(ex_post_tokens) <= 3:
                        return True, f"Same board '{ex_board}' and matching post designation with '{jid}'"
                else:
                    if len(common_post) >= max(2, len(post_tokens) * 0.7):
                        return True, f"Same board '{ex_board}' and matching post designation with '{jid}'"

    return False, ""

def fetch_page(url, ctx):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=25) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            if attempt == 2:
                print(f"[FETCH ERROR] {url}: {e}")
                return None
            time.sleep(1.0)

def try_extract_advt_from_pdf(pdf_url, ctx):
    if not pdf_url or not pdf_url.startswith('http') or not pdf_url.lower().endswith('.pdf'):
        return ""
    try:
        req = urllib.request.Request(pdf_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read(2 * 1024 * 1024)
        if not data.startswith(b'%PDF'):
            return ""
        tmp_path = os.path.join(PROJECT_ROOT, 'scratch', 'temp_notice.pdf')
        with open(tmp_path, 'wb') as f:
            f.write(data)
        res = subprocess.run(['pdftotext', '-l', '2', tmp_path, '-'], capture_output=True, text=True, errors='ignore', timeout=5)
        text = res.stdout if res.returncode == 0 else ""
        if text:
            m = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?|CEN\s*No\.?|Rc\s*No\.?|No\.)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)]+)', text, re.IGNORECASE)
            if m:
                cand = clean_text(m.group(1))
                if 4 <= len(cand) <= 45 and not any(bad in cand.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details', 'page', 'date']):
                    return cand
    except Exception:
        pass
    return ""

def parse_vacancy_data(html, url, ctx=None):
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "nav", "footer", "iframe"]):
        tag.extract()
        
    page_title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    
    tables = soup.find_all('table')
    overview_kv = {}
    vacancy_rows = []
    date_rows = []
    post_salary_map = {}
    post_qual_map = {}
    
    for t in tables:
        rows = t.find_all('tr')
        if not rows:
            continue
        first_row_cells = [clean_text(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        
        if len(first_row_cells) == 2 and any(k in first_row_cells[0] for k in ['company', 'organization', 'particulars', 'post', 'salary', 'qualification', 'age', 'apply', 'walk-in', 'last date', 'recruiting']):
            for r in rows:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) == 2 and cols[0].lower() not in overview_kv:
                    overview_kv[cols[0].lower()] = cols[1]
            break
            
    for t in tables[1:]:
        rows = t.find_all('tr')
        if not rows:
            continue
        first_row_cells = [clean_text(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        
        # Check if salary table: ['Post Name', 'Salary']
        if any(k in c for c in first_row_cells for k in ['post name', 'post', 'position', 'trade']) and any(k in c for c in first_row_cells for k in ['salary', 'pay', 'scale', 'remuneration', 'stipend']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    p_key = slugify(cols[0])
                    post_salary_map[p_key] = cols[1]
        # Check if qualification table: ['Post Name', 'Qualification']
        elif any(k in c for c in first_row_cells for k in ['post name', 'post', 'position', 'trade']) and any(k in c for c in first_row_cells for k in ['qualification', 'eligibility', 'education']):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    p_key = slugify(cols[0])
                    post_qual_map[p_key] = cols[1]
        # Check if event/date table: ['Event', 'Date']
        elif any('event' in c or 'activity' in c or 'important date' in c for c in first_row_cells) or (len(first_row_cells) == 2 and 'date' in first_row_cells[1]):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    date_rows.append(cols)
        # Check if vacancy count table: ['Post Name', 'Total Posts']
        elif any(k in c for c in first_row_cells for k in ['post name', 'station', 'division', 'discipline', 'trade', 'category']) and any(k in c for c in first_row_cells for k in ['post', 'position', 'vacancy', 'total', 'no of', 'vacancies']):
            if not any(k in c for c in first_row_cells for k in ['salary', 'pay', 'stipend', 'qualification', 'eligibility']):
                for r in rows[1:]:
                    cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                    if len(cols) >= 2 and cols[0].lower() not in ['total', 's. no.', 's.no.']:
                        if cols[0].isdigit() and len(cols) > 2:
                            cols = cols[1:]
                        vacancy_rows.append(cols)

    official_pdf_url = ""
    official_site_url = ""
    official_apply_url = ""
    
    for h in soup.find_all(["h2", "h3"]):
        if "important link" in h.get_text().lower():
            ul = h.find_next("ul")
            if ul:
                for li in ul.find_all("li"):
                    txt = li.get_text(" ", strip=True).lower()
                    a = li.find("a", href=True)
                    if not a:
                        continue
                    href = clean_text(a["href"])
                    if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter', 'arattai', 'sarkariresult']):
                        continue
                    if not href.startswith('http'):
                        continue
                    if 'notification' in txt or 'pdf' in txt or href.endswith('.pdf'):
                        if not official_pdf_url:
                            official_pdf_url = href
                    elif 'apply' in txt or 'portal' in txt or 'registration' in txt:
                        if not official_apply_url:
                            official_apply_url = href
                    elif 'official' in txt or 'website' in txt:
                        if not official_site_url:
                            official_site_url = href
            break
            
    for t in tables:
        for r in t.find_all('tr'):
            cells = r.find_all(['td', 'th'])
            if len(cells) >= 2:
                row_label = clean_text(cells[0].get_text()).lower()
                row_links = [clean_text(a['href']) for a in r.find_all('a', href=True)]
                for href in row_links:
                    if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter', 'arattai', 'sarkariresult']):
                        continue
                    if not href.startswith('http'):
                        continue
                    if 'notification' in row_label or 'pdf' in row_label or href.endswith('.pdf'):
                        if not official_pdf_url:
                            official_pdf_url = href
                    elif 'apply' in row_label or 'registration' in row_label:
                        if not official_apply_url:
                            official_apply_url = href
                    elif any(k in row_label for k in ['website', 'portal', 'official']):
                        if not official_site_url:
                            official_site_url = href

    if not official_pdf_url or not official_site_url:
        for a in soup.find_all('a', href=True):
            href = clean_text(a['href'])
            txt = clean_text(a.get_text()).lower()
            if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter', 'arattai', 'sarkariresult']):
                continue
            if not href.startswith('http'):
                continue
            if (href.endswith('.pdf') or 'notification' in href or 'pdf' in txt) and not official_pdf_url:
                official_pdf_url = href
            elif any(k in txt for k in ['official website', 'apply online', 'portal', 'website']) and not official_site_url:
                official_site_url = href

    board = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['recruiting body', 'recruiting organization', 'recruitment board', 'authority', 'organization', 'company', 'board', 'institute', 'department', 'commission', 'court', 'university', 'society', 'centre', 'corporation']):
            if len(v) > 2 and v.lower() not in ['details', 'various', 'given below']:
                board = v
                break
    if not board:
        m = re.match(r'^(.*?)\s+Recruitment', page_title, re.IGNORECASE)
        if m:
            board = m.group(1).strip()
        else:
            board = page_title.split('-')[0].strip()
    board = re.sub(r'\s*\(India[\'\w\s]+\)\s*', '', board).strip()

    post_name = ""
    for k, v in overview_kv.items():
        if any(term == k for term in ['post', 'posts', 'post name', 'post names', 'name of post', 'name of posts', 'name of exam', 'exam name']):
            if v and not re.match(r'^\d+$', v) and v.lower() not in ['total posts', 'no of posts', 'salary', 'various', 'posts', 'details']:
                post_name = v
                break
                
    if not post_name or post_name.lower() in ['various posts', 'various']:
        m = re.search(r'(?:Apply\s+Online|Walkin|Apply\s+Offline|Apply)\s+(?:for\s+)?(?:\d+\s+)?(.*?)(?:\s+Posts|\s+2026|$)', page_title, re.IGNORECASE)
        if m:
            cand_p = clean_text(m.group(1))
            if cand_p and len(cand_p) > 2 and cand_p.lower() not in ['various', 'posts']:
                post_name = cand_p
    if not post_name or re.match(r'^\d+$', post_name):
        post_name = "Various Posts"

    vacancies_num = 1
    for k, v in overview_kv.items():
        if any(term in k for term in ['no of post', 'vacancies', 'total post', 'total vacancies']):
            clean_num_str = v.replace(',', '')
            vm = re.search(r'\d+', clean_num_str)
            if vm:
                vacancies_num = int(vm.group(0))
                break
    if vacancies_num == 1:
        clean_title_str = page_title.replace(',', '')
        vm = re.search(r'(\d+)\s+(?:posts|vacancies)', clean_title_str, re.IGNORECASE)
        if vm:
            vacancies_num = int(vm.group(1))

    salary_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['salary', 'stipend', 'pay', 'remuneration', 'scale of pay']):
            salary_text = v
            break
            
    if not salary_text or salary_text.lower() in ['details', 'various', 'as per norms']:
        for h in soup.find_all(['h2', 'h3']):
            if 'salary' in h.get_text().lower() or 'remuneration' in h.get_text().lower() or 'pay scale' in h.get_text().lower():
                curr = h.next_sibling
                sal_parts = []
                while curr and curr.name not in ['h2']:
                    if curr.name in ['p', 'table', 'ul']:
                        sal_parts.append(curr.get_text(' ', strip=True))
                    curr = curr.next_sibling
                if sal_parts:
                    salary_text = clean_text(" ".join(sal_parts))[:150]
                break

    if not salary_text:
        salary_text = "As per official institutional pay scale rules"

    qual_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['qualification', 'eligibility', 'education']):
            qual_text = v
            break
            
    if not qual_text or qual_text.lower() in ['details', 'various', 'given below']:
        for h in soup.find_all(['h2', 'h3']):
            if 'qualification' in h.get_text().lower() or 'eligibility' in h.get_text().lower():
                curr = h.next_sibling
                q_parts = []
                while curr and curr.name not in ['h2']:
                    if curr.name in ['p', 'ul', 'ol']:
                        q_parts.append(curr.get_text(' ', strip=True))
                    curr = curr.next_sibling
                if q_parts:
                    qual_text = clean_text(" ".join(q_parts))
                break

    if not qual_text:
        qual_text = "Degree / Diploma / Post Graduation or equivalent from a recognized University / Board as per official notification."

    age_text = ""
    for k, v in overview_kv.items():
        if 'age limit' in k or 'age' in k:
            age_text = v
            break
            
    if not age_text or age_text.lower() in ['details', 'as per rules']:
        for h in soup.find_all(['h2', 'h3']):
            if 'age limit' in h.get_text().lower() or 'age criteria' in h.get_text().lower():
                curr = h.next_sibling
                age_parts = []
                while curr and curr.name not in ['h2']:
                    if curr.name in ['p', 'ul']:
                        age_parts.append(curr.get_text(' ', strip=True))
                    curr = curr.next_sibling
                if age_parts:
                    age_text = clean_text(" ".join(age_parts))[:200]
                break

    if not age_text:
        age_text = "As per government recruitment norms (+ standard relaxation for SC/ST/OBC/PwBD categories)"

    apply_mode = "Online via Official Portal"
    for k, v in overview_kv.items():
        if 'apply mode' in k:
            apply_mode = v
            break
        elif 'walk-in' in k or 'walkin' in k:
            apply_mode = "Walk-in Interview"
    if 'walkin' in page_title.lower() or 'walk-in' in page_title.lower():
        apply_mode = "Walk-in Interview"
    elif 'offline' in page_title.lower():
        apply_mode = "Apply Offline"
    elif 'online' in page_title.lower():
        apply_mode = "Apply Online"

    important_dates = []
    for row in date_rows:
        if len(row) >= 2:
            important_dates.append({
                "event": clean_text(row[0]),
                "date": format_clean_date(row[1])
            })
            
    walkin_date = ""
    last_date = ""
    for k, v in overview_kv.items():
        if 'walk-in' in k or 'walkin' in k:
            walkin_date = format_clean_date(v)
        elif 'last date' in k or 'closing' in k:
            last_date = format_clean_date(v)

    curr_month_year = datetime.datetime.now().strftime("%B %Y")
    if not important_dates:
        if walkin_date:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Walk-in Interview Date", "date": walkin_date})
        elif last_date:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Application Start Date", "date": curr_month_year})
            important_dates.append({"event": "Last Date to Apply", "date": last_date})
        else:
            important_dates.append({"event": "Notification Release Date", "date": curr_month_year})
            important_dates.append({"event": "Application Closing Date", "date": "Refer Official Notification"})

    summary_last_date = "Refer Notification"
    if walkin_date:
        summary_last_date = f"{walkin_date} (Walk-in)"
    elif last_date:
        summary_last_date = last_date
    else:
        for dt in important_dates:
            ev = dt.get("event", "").lower()
            if any(k in ev for k in ["last date", "closing", "deadline", "walk-in", "walkin", "end date", "receipt"]):
                summary_last_date = dt.get("date", "Refer Notification")
                break
        if summary_last_date == "Refer Notification" and len(important_dates) > 1:
            summary_last_date = important_dates[-1].get("date", "Refer Notification")

    advt_no = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['advt', 'advertisement', 'notification no', 'notice no', 'cen no', 'nia no', 'rcno', 'employment notice']) or ('notification' in k and 'date' not in k and 'period' not in k) or k == 'no':
            if v and v.lower() not in ['details', 'various', 'given below', 'refer notification']:
                advt_no = v
                break
    if not advt_no:
        advt_match = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?|CEN\s*No\.?|NIA\s*No\.?)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)\,\s]+?)(?:\s+dated|\s+Dated|\n|\.|\,|$)', html, re.IGNORECASE)
        if advt_match:
            advt_candidate = clean_text(advt_match.group(1))
            if 3 <= len(advt_candidate) <= 45 and not any(bad in advt_candidate.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details']):
                advt_no = advt_candidate
    if official_pdf_url and (not advt_no or advt_no.endswith('/2026')):
        pdf_advt = try_extract_advt_from_pdf(official_pdf_url, ctx)
        if pdf_advt:
            advt_no = pdf_advt
    if not advt_no:
        advt_no = f"{slugify(board)[:14].upper()}/2026"

    location = "India"
    for k, v in overview_kv.items():
        if any(term in k for term in ['job location', 'location', 'place of posting']):
            if v and len(v) > 2 and v.lower() not in ['details', 'as per rules']:
                location = clean_text(v)
                break
    if location == "India":
        loc_matches = re.findall(r'\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Delhi|New Delhi|Chandigarh|Puducherry|Raebareli|Kozhikode|Rewari|Barnala|Amritsar|Nuapada|Koraput|Malegaon|Shivamogga|Nagpur|Raipur|Patna|Dhanbad|Jamshedpur|Dehradun|Roorkee|Kashipur|Haldwani|Almora|Nainital|Kolkata|Kalyani|Shibpur|Malda|Santiniketan|Kharagpur|Jadavpur|Visakhapatnam|Chintapalle|Hyderabad|Hanumakonda|Warangal|Bengaluru|Bangalore|Raichur|Hassan|Chikkaballapur|Mysuru|Belagavi|Bhopal|Indore|Jabalpur|Gwalior|Katni|Mumbai|Pune|Sangli|Bhubaneswar|Rourkela|Cuttack|Mayurbhanj|Balangir|Jaipur|Jodhpur|Ajmer|Kota|Chennai|Madurai|Coimbatore|Erode|Pudukkottai|Ramanathapuram|Tiruchirappalli|Itanagar|Guwahati|Tezpur|Bhagalpur|Gaya|Jashpur|Bilaspur|Durg|Bhilai|Balodabazar|Bastar|Mungeli|Gandhinagar|Ahmedabad|Vadodara|Surat|Bhavnagar|Gurugram|Jhajjar|Rohtak|Kurukshetra|Ranchi|Chatra|Kochi|Thiruvananthapuram|Aizawl|Sangrur|Mohali|Ludhiana|Patiala|Agartala|Lucknow|Kanpur|Varanasi|Gorakhpur|Azamgarh|Prayagraj|Allahabad|Aligarh)\b', page_title + " " + board + " " + html[:2000], re.IGNORECASE)
        if loc_matches:
            location = loc_matches[0].title()

    vacancies_details = []
    if vacancy_rows:
        for r in vacancy_rows:
            p_name = clean_text(r[0])
            v_cnt = clean_text(r[1]) if len(r) > 1 else "1"
            p_key = slugify(p_name)
            p_sal = post_salary_map.get(p_key, salary_text)
            p_q = post_qual_map.get(p_key, clean_text(r[2]) if len(r) > 2 else qual_text)
            clean_v_str = v_cnt.replace(',', '')
            num_match = re.search(r'\d+', clean_v_str)
            cnt_num = int(num_match.group(0)) if num_match else 1
            vacancies_details.append({
                "postName": p_name,
                "vacancies": v_cnt,
                "total": cnt_num,
                "qualification": p_q,
                "payScale": p_sal
            })
        if vacancies_num <= 1:
            sum_cnt = sum(vd['total'] for vd in vacancies_details if isinstance(vd.get('total'), int))
            if sum_cnt > vacancies_num:
                vacancies_num = sum_cnt
    else:
        vacancies_details.append({
            "postName": post_name,
            "vacancies": str(vacancies_num),
            "total": vacancies_num,
            "qualification": qual_text,
            "payScale": salary_text
        })

    urls_list = []
    if official_apply_url:
        urls_list.append({
            "title": f"Apply Online - {board}",
            "url": official_apply_url
        })
    if official_pdf_url:
        urls_list.append({
            "title": f"Download {board} Official Notification PDF",
            "url": official_pdf_url
        })
    if official_site_url:
        urls_list.append({
            "title": f"{board} Official Website / Portal",
            "url": official_site_url
        })
    if not urls_list:
        urls_list.append({
            "title": f"{board} Official Recruitment Notification",
            "url": url
        })

    apply_action = "Apply Online"
    if "walk-in" in apply_mode.lower() or "walkin" in apply_mode.lower():
        apply_action = "Walk-in Interview"
    elif "offline" in apply_mode.lower():
        apply_action = "Apply Offline"

    clean_post_for_title = post_name
    if clean_post_for_title.lower().endswith(" posts"):
        clean_post_for_title = clean_post_for_title[:-6].strip()
    elif clean_post_for_title.lower().endswith(" post"):
        clean_post_for_title = clean_post_for_title[:-5].strip()

    title_str = f"{board} Recruitment 2026 Notification Out for {vacancies_num} {clean_post_for_title} Posts | {apply_action}"

    return {
        "board": board,
        "title": title_str,
        "postName": post_name,
        "vacancies": vacancies_num,
        "advtNo": advt_no,
        "salary": salary_text,
        "qualification": qual_text,
        "ageLimit": age_text,
        "applicationMode": apply_mode,
        "importantDates": important_dates,
        "summaryLastDate": summary_last_date,
        "vacanciesDetails": vacancies_details,
        "jobLocation": location,
        "urls": urls_list,
        "sourceUrl": url
    }

def generate_rich_job_schema(data):
    board = data["board"]
    title = data["title"]
    vacancies = data["vacancies"]
    post_name = data["postName"]
    advt_no = data["advtNo"]
    salary = data["salary"]
    qualification = data["qualification"]
    age_limit = data["ageLimit"]
    app_mode = data["applicationMode"]
    location = data["jobLocation"]
    important_dates = data["importantDates"]
    vacancies_details = data["vacanciesDetails"]
    urls = data["urls"]
    last_date = data["summaryLastDate"]

    job_id = generate_short_slug(board, post_name, year="2026")

    seo_title = f"{board} Recruitment 2026 ({vacancies} {post_name} Posts) {app_mode} | NewVacancyAlert"
    seo_desc = f"{board} recruitment 2026 notification for {vacancies} {post_name} vacancies. Check eligibility criteria, salary, qualification, age limit & application details. Apply before {last_date}."
    if len(seo_desc) > 165:
        seo_desc = seo_desc[:162] + "..."

    focus_keywords = f"{board} Recruitment 2026, {board} {post_name} Vacancy 2026, {board} Notification 2026, {post_name} Jobs 2026"
    lsi_keywords = f"{board} Eligibility Criteria, {board} Salary Pay Scale, {board} Selection Process, {board} Apply {app_mode}, {board} Advt {advt_no}"

    overview = [
        f"{board} has officially announced employment advertisement notification {advt_no} inviting applications for {vacancies} vacancies for {post_name} posts.",
        f"Candidates meeting the prescribed eligibility conditions ({qualification[:120]}...) and age requirements can submit their candidature via {app_mode}. The closing deadline / scheduled date is {last_date}.",
        f"Selected appointees will be stationed in {location}, receiving official compensation ({salary[:90]}), statutory allowances, and established public service benefits as per organizational regulations."
    ]

    highlights = [
        {"label": "Recruitment Authority", "value": board},
        {"label": "Post Name", "value": post_name},
        {"label": "Advertisement No.", "value": advt_no},
        {"label": "Total Vacancies", "value": f"{vacancies} Posts"},
        {"label": "Educational Qualification", "value": qualification[:150]},
        {"label": "Age Limit", "value": age_limit},
        {"label": "Salary / Remuneration", "value": salary[:150]},
        {"label": "Job Location", "value": location},
        {"label": "Application Mode", "value": app_mode},
        {"label": "Important Date / Deadline", "value": last_date},
        {"label": "Official Website", "value": urls[-1]["url"] if urls else "Official Government Portal"}
    ]

    fee_details = [
        {"category": "General / OBC / EWS Candidates", "fee": "As per official notification guidelines / Exempted if unspecified"},
        {"category": "SC / ST / PwBD / Female Candidates", "fee": "Exempted / Concessional as per government norms"}
    ]

    selection_stages = [
        "Screening and verification of minimum educational eligibility criteria and submitted application credentials.",
        "Shortlisting based on academic merit, research publications, or written examination / skill assessment (where applicable).",
        "Personal Interview / Walk-in Interview / Practical Assessment conducted by the Selection Committee.",
        "Document Verification of original academic degrees, caste/category certificates, and experience records.",
        "Final Medical Fitness Examination and issuance of official appointment letter."
    ]

    how_to_apply = [
        f"Visit the official portal or access the notification link provided at {urls[0]['url'] if urls else 'official website'}.",
        "Carefully read the official advertisement guidelines, terms of engagement, and eligibility conditions before applying.",
        f"For {app_mode}: Ensure all required bio-data forms, online registration, or prescribed proforma are accurately completed.",
        "Attach/Upload clear scanned copies of required educational certificates, mark sheets, age proof, identity proof, and photographs.",
        "Pay the prescribed application fee (if applicable) through official designated payment channels.",
        "Submit the application form or report to the designated interview venue on the scheduled date with original credentials and self-attested copies.",
        "Retain an acknowledgement receipt or printed copy of the submitted application for subsequent stages."
    ]

    docs_required = [
        "Signed Application Form in prescribed format / Online Application Printout.",
        "Class 10th (Matriculation) Certificate as proof of Date of Birth.",
        "All Academic Marksheets and Degree/Diploma Certificates (Graduation/Post Graduation/Technical Qualifications).",
        "Relevant Experience Certificates and NOC from current employer (if employed in Govt/PSU).",
        "Valid Category / Caste Certificate (SC/ST/OBC-NCL/EWS) issued by competent authority.",
        "Recent Passport Size Color Photographs and valid Photo ID Proof (Aadhaar/PAN/Voter ID/Passport)."
    ]

    faqs = [
        {
            "question": f"What is the total number of vacancies announced for {board} Recruitment 2026?",
            "answer": f"A total of {vacancies} vacancies have been officially announced for {post_name} under {board} Recruitment 2026."
        },
        {
            "question": f"What is the official Advertisement Number for this {board} recruitment drive?",
            "answer": f"The official advertisement number for this recruitment notification is {advt_no}."
        },
        {
            "question": f"What educational qualification is required to apply for {post_name} in {board}?",
            "answer": f"Candidates must possess {qualification}. Please refer to the official notification PDF for complete discipline-specific details."
        },
        {
            "question": f"What is the prescribed age limit for {board} {post_name} posts?",
            "answer": f"The prescribed age limit is {age_limit}. Standard age relaxations apply for SC, ST, OBC, PwBD, and Ex-Servicemen as per government norms."
        },
        {
            "question": f"What is the monthly salary or pay scale offered for {post_name} in {board}?",
            "answer": f"Selected candidates will receive {salary}, along with admissible allowances as per official organizational policy."
        },
        {
            "question": f"What is the mode of application for {board} Recruitment 2026?",
            "answer": f"The application mode is {app_mode}. Candidates should follow the official submission guidelines carefully."
        },
        {
            "question": f"What is the last date to apply or interview date for {board} {post_name}?",
            "answer": f"The last date for application submission or scheduled event date is {last_date}."
        },
        {
            "question": f"What is the selection process for {board} {post_name} recruitment?",
            "answer": "The selection process involves initial scrutiny of qualifications, shortlisting, personal interview / skill assessment / written test, and document verification."
        },
        {
            "question": f"Where will the selected candidates be posted for this {board} vacancy?",
            "answer": f"The selected candidates will be posted in {location} or designated project sites/campuses under {board}."
        },
        {
            "question": f"Is there any application fee for {board} {post_name} Recruitment 2026?",
            "answer": "Application fee details are specified in the official notification. Reserved categories and female applicants are generally exempt or entitled to concessions."
        },
        {
            "question": f"Are candidates in their final year/semester eligible to apply?",
            "answer": "Candidates must possess the requisite degree and final mark sheet on or before the crucial closing date specified in the notification."
        },
        {
            "question": f"Is age relaxation applicable for reserved category applicants?",
            "answer": "Yes, standard age relaxations (5 years for SC/ST, 3 years for OBC-NCL, and 10+ years for PwBD) are applicable as per Central/State Government rules."
        },
        {
            "question": f"What documents are required during interview and verification?",
            "answer": "Candidates must carry 10th certificate for DOB proof, degree certificates, all semester mark sheets, caste certificate, experience certificates, photo ID proof, and self-attested photocopies."
        },
        {
            "question": f"Can candidates currently employed in Government/PSU apply?",
            "answer": "Yes, candidates working in Central/State Government or PSUs can apply provided they produce a 'No Objection Certificate' (NOC) from their employer at the time of interview."
        },
        {
            "question": f"How can I download the official notification PDF for {board} Recruitment 2026?",
            "answer": f"The official notification PDF can be downloaded directly from the official link: {urls[0]['url'] if urls else 'official website'}."
        },
        {
            "question": f"Is this a permanent post or contractual engagement in {board}?",
            "answer": f"Please refer to the official advertisement ({advt_no}) for the precise tenure and engagement terms (regular/contractual/project-basis) for {post_name}."
        },
        {
            "question": f"Where can I check updates regarding admit cards, interview schedules, or results for {board}?",
            "answer": f"All official updates, interview lists, and result notices will be published directly on the official {board} recruitment portal: {urls[-1]['url'] if urls else 'official portal'}."
        },
        {
            "question": f"Can candidates from all states and UTs in India apply for {board} vacancies?",
            "answer": "Yes, Indian citizens fulfilling the required educational qualification, age limit, and language proficiency criteria are eligible to apply."
        },
        {
            "question": f"What should I do if there is a discrepancy in my online application details?",
            "answer": f"Candidates must verify all details before final submission. In case of corrections, check the official {board} portal during the edit window if provided."
        },
        {
            "question": f"Who can be contacted for technical assistance regarding {board} recruitment application?",
            "answer": f"Candidates may contact the official helpdesk or email address provided on the {board} official website."
        }
    ]

    schema = {
        "id": job_id,
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
        "focusKeywords": focus_keywords,
        "lsiKeywords": lsi_keywords,
        "title": title,
        "board": board,
        "advtNo": advt_no,
        "vacancies": vacancies,
        "jobLocation": location,
        "applicationMode": app_mode,
        "applicationStatus": f"Active - Apply before {last_date}",
        "lastUpdated": datetime.datetime.now().strftime("%Y-%m-%d"),
        "overview": overview,
        "highlights": highlights,
        "importantDates": important_dates,
        "vacanciesDetails": vacancies_details,
        "eligibility": {
            "education": [qualification] if isinstance(qualification, str) else qualification,
            "ageLimit": age_limit,
            "medicalStandards": "Standard physical and medical fitness as per organizational regulations."
        },
        "salary": {
            "payLevel": "As per institutional scales",
            "initialPay": salary,
            "allowances": "DA, HRA, Medical and other allowances as applicable per government rules."
        },
        "applicationFee": fee_details,
        "howToPayFee": [
            "Online via Net Banking, Debit Card, Credit Card or UPI payment gateways.",
            "Offline via Demand Draft / Postal Order / Challan if specified in official notification.",
            "Retain transaction e-receipt and registration slip for future recruitment stages."
        ],
        "selectionProcess": selection_stages,
        "howToApply": how_to_apply,
        "howToApplySteps": how_to_apply,
        "documentsRequired": docs_required,
        "importantInstructions": [
            "Verify all eligibility criteria, educational certificates, and age limits before submitting the application.",
            "Complete and submit application forms well before the deadline to avoid server overload or transit delays.",
            "Ensure that email addresses and phone numbers provided remain active for official interview communications."
        ],
        "faqs": faqs,
        "urls": urls
    }

    return schema

def safe_write_json(filepath, data):
    for attempt in range(5):
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            time.sleep(0.3)
    try:
        tmp_file = filepath + ".tmp"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        if os.path.exists(filepath):
            os.remove(filepath)
        os.rename(tmp_file, filepath)
        return True
    except Exception as e:
        print(f"[WARN] Failed to write {filepath}: {e}")
        return False

def safe_write_text(filepath, content):
    for attempt in range(5):
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            time.sleep(0.3)
    try:
        tmp_file = filepath + ".tmp"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            f.write(content)
        if os.path.exists(filepath):
            os.remove(filepath)
        os.rename(tmp_file, filepath)
        return True
    except Exception as e:
        print(f"[WARN] Failed to write {filepath}: {e}")
        return False

def add_job_to_system(job_schema):
    job_id = job_schema["id"]
    
    # 1. Update jobDetails.json
    details_data = {}
    if os.path.exists(DETAILS_FILE):
        try:
            with open(DETAILS_FILE, 'r', encoding='utf-8') as f:
                details_data = json.load(f)
        except Exception:
            details_data = {}
            
    details_data[job_id] = job_schema
    safe_write_json(DETAILS_FILE, details_data)
        
    # 2. Update jobsData.ts
    with open(JOBS_DATA_FILE, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    if f'"id": "{job_id}"' not in jobs_text:
        qual_val = format_short_qualification(job_schema.get("eligibility", {}).get("education", "See eligibility"))
            
        post_date = datetime.datetime.now().strftime("%d %B %Y")
        last_date = job_schema.get("applicationStatus", "").replace("Active - Apply before ", "").strip()
        if not last_date or "Refer" in last_date:
            last_date = job_schema.get("importantDates", [{}])[-1].get("date", "Refer Notification")
        last_date = format_clean_date(last_date)
                
        summary_entry = {
            "id": job_id,
            "b": job_schema.get("board", ""),
            "t": job_schema.get("title", ""),
            "d": post_date,
            "l": last_date,
            "a": job_schema.get("advtNo", ""),
            "q": qual_val,
            "desc": job_schema.get("overview", [""])[0],
            "u": job_schema.get("urls", [{}])[0].get("url", "") if job_schema.get("urls") else ""
        }
        marker = "export const JOBS_DATA: JobEntry[] = ["
        entry_json = json.dumps(summary_entry, indent=4, ensure_ascii=False)
        new_content = jobs_text.replace(marker, f"{marker}\n  {entry_json},")
        safe_write_text(JOBS_DATA_FILE, new_content)
            
    # 3. Update jobUploadDates.json
    upload_dates = {}
    if os.path.exists(UPLOAD_DATES_FILE):
        try:
            with open(UPLOAD_DATES_FILE, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
        except Exception:
            upload_dates = {}
    if job_id not in upload_dates:
        upload_dates[job_id] = datetime.datetime.now().strftime("%Y-%m-%d")
        safe_write_json(UPLOAD_DATES_FILE, upload_dates)
            
    return True

def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, cwd=PROJECT_ROOT, capture_output=True, text=True)
    return res.returncode == 0, res.stdout, res.stderr

def main():
    print("================================================================")
    print("         BATCH URL VACANCY ADDER - RUNNING PIPELINE             ")
    print("================================================================")
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    seen_urls = set()
    unique_urls = []
    for u in INPUT_URLS:
        if u not in seen_urls:
            seen_urls.add(u)
            unique_urls.append(u)

    print(f"Total Unique URLs to process: {len(unique_urls)}\n")

    added_jobs = []
    skipped_jobs = []
    added_jobs_count = 0
    processed_urls = set()

    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                prog = json.load(f)
                added_jobs = prog.get('added_jobs', [])
                skipped_jobs = prog.get('skipped_jobs', [])
                added_jobs_count = len(added_jobs)
                processed_urls = set(prog.get('processed_urls', []))
                print(f"[RESUME] Resuming from progress file: {added_jobs_count} added, {len(skipped_jobs)} skipped, {len(processed_urls)} processed.\n")
        except Exception:
            pass

    for idx, url in enumerate(unique_urls, 1):
        if url in processed_urls:
            continue

        print(f"\n[{idx}/{len(unique_urls)}] Processing URL: {url}")
        html = fetch_page(url, ctx)
        if not html:
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": "Failed to fetch webpage"})
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        try:
            raw_data = parse_vacancy_data(html, url, ctx=ctx)
        except Exception as e:
            print(f"[PARSE ERROR] {url}: {e}")
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": f"Parsing exception: {e}"})
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        existing_jobs, existing_list = load_existing_db()
        candidate_id = generate_short_slug(raw_data['board'], raw_data['postName'], year="2026")

        is_dup, dup_reason = check_duplicate(candidate_id, raw_data["board"], raw_data["title"], raw_data["advtNo"], existing_jobs, existing_list, post_name=raw_data["postName"])
        if is_dup:
            print(f"⏩ [SKIPPED DUPLICATE] {raw_data['board']} - {raw_data['postName']}: {dup_reason}")
            skipped_jobs.append({
                "url": url,
                "title": raw_data["title"],
                "board": raw_data["board"],
                "reason": f"Duplicate ({dup_reason})"
            })
            processed_urls.add(url)
            safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})
            continue

        # Ensure unique candidate_id if base collision exists
        base_id = candidate_id
        counter = 1
        m_art = re.search(r'-(\d{5,8})(?:/|$)', url)
        art_id = m_art.group(1) if m_art else ""
        while candidate_id in existing_jobs:
            if art_id and counter == 1:
                candidate_id = f"{base_id}-{art_id}"
            else:
                candidate_id = f"{base_id}-{counter}"
            counter += 1

        # Generate rich schema
        schema = generate_rich_job_schema(raw_data)
        schema["id"] = candidate_id
        add_job_to_system(schema)
        added_jobs_count += 1
        processed_urls.add(url)
        print(f"✅ [ADDED #{added_jobs_count}] {schema['id']} | {raw_data['board']} | {raw_data['vacancies']} Vacancies | Closing: {schema['applicationStatus']}")
        added_jobs.append({
            "id": schema["id"],
            "title": raw_data["title"],
            "board": raw_data["board"],
            "vacancies": raw_data["vacancies"],
            "closing": raw_data["summaryLastDate"],
            "link": raw_data["urls"][0]["url"] if raw_data["urls"] else ""
        })

        safe_write_json(PROGRESS_FILE, {"processed_urls": list(processed_urls), "added_jobs": added_jobs, "skipped_jobs": skipped_jobs})

        # Periodic Git commit & push every 10 added jobs
        if added_jobs_count > 0 and added_jobs_count % 10 == 0:
            print(f"\n🚀 [MILESTONE] Reached {added_jobs_count} added jobs! Triggering build and commit...")
            
            # 1. Build
            print("  -> Running npm run build...")
            b_ok, b_out, b_err = run_cmd([NPM_CMD, "run", "build"])
            if not b_ok:
                print(f"  [BUILD WARNING/ERROR]: {b_err[:300]}")
            else:
                print("  -> Build successful!")

            # 2. Git add, commit, push
            print("  -> Git staging, committing, and pushing...")
            run_cmd([GIT_PATH, "add", "."])
            run_cmd([GIT_PATH, "commit", "-m", f"feat(jobs): batch add 10 vacancies from official portals (total: {added_jobs_count})"])
            p_ok, p_out, p_err = run_cmd([GIT_PATH, "push", "origin", "main"])
            if p_ok:
                print("  -> Successfully pushed to GitHub main branch!\n")
            else:
                print(f"  -> Push output: {p_out} {p_err}\n")

    print("\n================================================================")
    print("         ALL URLS PROCESSED - FINALIZING PIPELINE               ")
    print("================================================================")
    print(f"Total Added Jobs: {added_jobs_count}")
    print(f"Total Skipped Jobs: {len(skipped_jobs)}")

    # 1. Regenerate sitemap
    print("\n[1/3] Regenerating Sitemap & RSS Feeds...")
    s_ok, s_out, s_err = run_cmd([NPX_CMD, "tsx", "scripts/generate-sitemap.ts"])
    print(s_out if s_ok else f"Sitemap error: {s_err}")

    # 2. Production build
    print("\n[2/3] Running final Production Build...")
    b_ok, b_out, b_err = run_cmd([NPM_CMD, "run", "build"])
    if not b_ok:
        print(f"Final Build Error: {b_err[:400]}")
    else:
        print("Final build completed successfully!")

    # 3. Final Git Push
    print("\n[3/3] Final Git Commit & Push...")
    run_cmd([GIT_PATH, "add", "."])
    _, st_out, _ = run_cmd([GIT_PATH, "status", "--porcelain"])
    if st_out.strip():
        run_cmd([GIT_PATH, "commit", "-m", f"feat(jobs): update sitemap and final batch add remaining vacancies from official portals (total added: {added_jobs_count})"])
        p_ok, p_out, p_err = run_cmd([GIT_PATH, "push", "origin", "main"])
        if p_ok:
            print("Final push succeeded!")
        else:
            print(f"Final push output: {p_out} {p_err}")
    else:
        print("Working directory clean, nothing new to commit.")

    # Save summary report
    results_path = os.path.join(PROJECT_ROOT, "scripts", "batch_url_results.json")
    summary_report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_urls_processed": len(unique_urls),
        "total_added": added_jobs_count,
        "total_skipped": len(skipped_jobs),
        "added_jobs": added_jobs,
        "skipped_jobs": skipped_jobs
    }
    safe_write_json(results_path, summary_report)
    safe_write_json(os.path.join(PROJECT_ROOT, "scratch", "batch_summary_report.json"), summary_report)
    print(f"\nBatch URL Vacancy Adder completed successfully! Summary saved to {results_path}")

if __name__ == "__main__":
    main()
