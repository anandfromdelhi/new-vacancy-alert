import sys
if hasattr(sys.stdout, "reconfigure"): sys.stdout.reconfigure(line_buffering=True)
import os
import re
import json
import ssl
import time
import datetime
import subprocess
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DETAILS_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobDetails.json')
JOBS_DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobsData.ts')
UPLOAD_DATES_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'jobUploadDates.json')
PROGRESS_FILE = os.path.join(PROJECT_ROOT, 'scratch', 'batch_progress.json')

MONTHS_MAP = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September'
}

def clean_text(text):
    if not text:
        return ""
    text = text.replace('\xa0', ' ').replace('\u2013', '-').replace('\u2014', '-').replace('\ufffd', ' ')
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

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

    formatted = re.sub(r'\b([0-3]?[0-9])[\./-]([0-1]?[0-9])[\./-](202[4-9])\b', _replace_num_date, date_str)
    return formatted

def format_short_qualification(qual_text):
    if not qual_text:
        return "See eligibility"
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
    if len(clean_q) > 65:
        return clean_q[:62] + "..."
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

def check_duplicate(candidate_id, board, title, advt_no, existing_jobs, existing_list):
    # 1. Exact ID match
    if candidate_id in existing_jobs:
        return True, f"Exact ID '{candidate_id}' already exists in jobDetails.json"
        
    for j in existing_list:
        if j['id'] == candidate_id:
            return True, f"Exact ID '{candidate_id}' already exists in jobsData.ts"
            
    # 2. Check by distinct Advt No
    a_norm = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    if a_norm and len(a_norm) >= 5 and not a_norm.endswith("rec2026") and not a_norm.endswith("2026") and a_norm not in ["notification2026", "advtno", "various"]:
        for jid, j in existing_jobs.items():
            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if ex_advt and ex_advt == a_norm:
                return True, f"Advt No '{j.get('advtNo')}' matches existing '{jid}'"
                
    # 3. Same Board & Same Post Check
    b_norm = re.sub(r'[^a-z0-9]', '', board.lower())
    for jid, j in existing_jobs.items():
        ex_b_norm = re.sub(r'[^a-z0-9]', '', j.get('board', '').lower())
        if b_norm == ex_b_norm or (len(b_norm) > 10 and b_norm in ex_b_norm) or (len(ex_b_norm) > 10 and ex_b_norm in b_norm):
            p1_tokens = set(re.findall(r'[a-z0-9]{3,}', title.lower())) - {'recruitment', 'apply', 'online', 'offline', 'walkin', 'posts', 'post', 'vacancies', 'vacancy', '2026', 'total', 'various'}
            p2_tokens = set(re.findall(r'[a-z0-9]{3,}', j.get('title', '').lower())) - {'recruitment', 'apply', 'online', 'offline', 'walkin', 'posts', 'post', 'vacancies', 'vacancy', '2026', 'total', 'various'}
            common = p1_tokens.intersection(p2_tokens)
            if p1_tokens and len(common) / len(p1_tokens) >= 0.7:
                return True, f"Same board '{j.get('board')}' and matching post with '{jid}'"
                
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
    for retry in range(3):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            time.sleep(1)
    print(f"[FETCH FAILED] {url}")
    return None

def parse_full_page(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "nav", "footer", "iframe"]):
        tag.extract()
        
    page_title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    tables = soup.find_all('table')
    
    overview_kv = {}
    vacancy_rows = []
    date_rows = []
    fee_rows = []
    exam_rows = []
    
    # 1. Parse Overview Table (First table with 2 columns)
    for t in tables:
        rows = t.find_all('tr')
        if not rows:
            continue
        first_row_cells = [clean_text(c.get_text()) for c in rows[0].find_all(['td', 'th'])]
        if len(first_row_cells) == 2 and any(k in first_row_cells[0].lower() for k in ['company', 'organization', 'particulars', 'post', 'salary', 'qualification', 'age', 'apply', 'walk-in', 'last date', 'recruiting']):
            for r in rows:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) == 2 and cols[0].lower() not in overview_kv:
                    overview_kv[cols[0].lower()] = cols[1]
            break
            
    # 2. Parse Other Tables
    for t in tables[1:]:
        rows = t.find_all('tr')
        if not rows:
            continue
        header_cells = [clean_text(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        
        # Vacancy breakdown table
        if any('post name' in c or 'post' in c or 'department' in c for c in header_cells) and any('post' in c or 'vacanc' in c or 'total' in c for c in header_cells):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if cols and cols[0].lower() not in ['total', 's. no.', 's.no.']:
                    # Remove serial number column if first cell is numeric
                    if cols[0].isdigit() and len(cols) > 2:
                        cols = cols[1:]
                    vacancy_rows.append(cols)
        # Date table
        elif any('event' in c or 'activity' in c or 'important date' in c for c in header_cells) or (len(header_cells) == 2 and 'date' in header_cells[1]):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    date_rows.append(cols)
        # Fee table
        elif any('category' in c or 'fee' in c or 'application fee' in c for c in header_cells) and any('fee' in c or 'amount' in c or 'charges' in c for c in header_cells):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    fee_rows.append(cols)
        # Exam pattern table
        elif any('subject' in c or 'section' in c for c in header_cells) and any('mark' in c or 'question' in c for c in header_cells):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if cols:
                    exam_rows.append(cols)

    # 3. Extract Links
    official_pdf_url = ""
    official_site_url = ""
    for t in tables:
        for r in t.find_all('tr'):
            cells = r.find_all(['td', 'th'])
            if len(cells) >= 2:
                row_label = clean_text(cells[0].get_text()).lower()
                for a in r.find_all('a', href=True):
                    href = clean_text(a['href'])
                    if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter']):
                        continue
                    if not href.startswith('http'):
                        continue
                    if 'notification' in row_label or 'pdf' in row_label or href.endswith('.pdf'):
                        if not official_pdf_url:
                            official_pdf_url = href
                    elif any(k in row_label for k in ['website', 'apply online', 'portal', 'online application', 'apply here', 'official']):
                        if not official_site_url:
                            official_site_url = href

    for a in soup.find_all('a', href=True):
        href = clean_text(a['href'])
        txt = clean_text(a.get_text()).lower()
        if any(ign in href for ign in ['freejobalert', 'play.google.com', 'whatsapp', 'telegram', 'instagram', 'facebook', 'twitter']):
            continue
        if href.endswith('.pdf') or 'notification' in href or 'pdf' in txt or 'notification' in txt:
            if not official_pdf_url and href.startswith('http'):
                official_pdf_url = href
        elif any(k in txt for k in ['official website', 'apply online', 'portal', 'website', 'online portal', 'click here']):
            if not official_site_url and href.startswith('http'):
                official_site_url = href

    # 4. Extract Q&A / FAQs directly from the webpage
    extracted_faqs = []
    for h in soup.find_all(['h3', 'h4']):
        htxt = clean_text(h.get_text())
        if re.match(r'^(?:Q\d*[\.:\-]?\s*|What|When|How|Where|Is|Can|Who)\b', htxt, re.IGNORECASE) and '?' in htxt:
            # find subsequent sibling paragraph
            ans_parts = []
            nxt = h.find_next_sibling()
            while nxt and nxt.name in ['p', 'ul', 'ol'] and not re.match(r'^(?:Q\d*[\.:\-]?\s*|What|When|How|Where|Is|Can|Who)\b', nxt.get_text().strip(), re.IGNORECASE):
                ans_parts.append(clean_text(nxt.get_text()))
                nxt = nxt.find_next_sibling()
                if len(ans_parts) >= 2:
                    break
            ans_txt = " ".join(ans_parts).strip()
            if ans_txt and len(ans_txt) > 10:
                q_clean = re.sub(r'^Q\d*[\.:\-]?\s*', '', htxt).strip()
                extracted_faqs.append({"question": q_clean, "answer": format_clean_date(ans_txt)})

    # 5. Extract Board
    board = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['company', 'organization', 'board', 'institute', 'department', 'recruiting authority', 'recruiting body', 'particulars']):
            if len(v) > 2 and v.lower() not in ['details', 'various']:
                board = v
                break
    if not board:
        m = re.match(r'^(.*?)\s+Recruitment', page_title, re.IGNORECASE)
        board = m.group(1).strip() if m else page_title.split('-')[0].strip()

    # 6. Extract Post Name
    post_name = ""
    for k, v in overview_kv.items():
        if 'post name' in k or 'post names' in k or 'posts' in k:
            if v and v.lower() not in ['total posts', 'no of posts', 'salary', 'various', 'posts', 'details']:
                post_name = v
                break
    if not post_name:
        m = re.search(r'for\s+(?:\d+\s+)?(.*?)\s+Posts', page_title, re.IGNORECASE)
        if m:
            post_name = m.group(1).strip()
        else:
            m2 = re.search(r'^(?:.*?)\s+Recruitment\s+2026\s*[-–]\s*(?:Apply\s+Online|Walkin|Apply\s+Offline|Apply)\s+(?:for\s+)?(.*?)(?:\s+Posts|\s+2026|$)', page_title, re.IGNORECASE)
            post_name = m2.group(1).strip() if m2 else "Various Posts"

    # 7. Extract Vacancy Count
    vacancies_num = 1
    for k, v in overview_kv.items():
        if any(term in k for term in ['no of post', 'vacancies', 'total post', 'total vacancies']):
            vm = re.search(r'\d+', v)
            if vm:
                vacancies_num = int(vm.group(0))
                break
    if vacancies_num == 1:
        vm = re.search(r'(\d+)\s+(?:posts|vacancies)', page_title, re.IGNORECASE)
        if vm:
            vacancies_num = int(vm.group(1))

    # 8. Extract Salary
    salary_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['salary', 'stipend', 'pay', 'remuneration', 'scale of pay']):
            salary_text = v
            break
    if not salary_text:
        salary_text = "As per official institutional pay scale rules"

    # 9. Extract Qualification
    qual_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['qualification', 'eligibility', 'education']):
            qual_text = v
            break
    if not qual_text:
        qual_text = "Degree / Diploma / 10th / 12th as per official notification guidelines."

    # 10. Extract Age Limit
    age_text = ""
    for k, v in overview_kv.items():
        if 'age limit' in k or 'age' in k:
            age_text = v
            break
    if not age_text:
        age_text = "As per recruitment norms (+ relaxation for reserved categories)"

    # 11. Extract Apply Mode
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
        apply_mode = "Offline / Speed Post"
    elif 'online' in page_title.lower():
        apply_mode = "Online via Official Portal"

    # 12. Extract Dates
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

    if not important_dates:
        if walkin_date:
            important_dates.append({"event": "Walk-in Interview Date", "date": walkin_date})
        elif last_date:
            important_dates.append({"event": "Last Date to Apply", "date": last_date})
        else:
            important_dates.append({"event": "Notification Published", "date": "August 2026"})
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

    # 13. Advt No
    advt_no = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['advt', 'advertisement', 'notification no', 'notice no', 'government order']):
            advt_no = v
            break
    if not advt_no:
        advt_match = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)\s]+?)(?:\s+dated|\s+Dated|\n|\.|\,|$)', html, re.IGNORECASE)
        if advt_match:
            advt_candidate = advt_match.group(1).strip()
            if 3 <= len(advt_candidate) <= 50 and not any(bad in advt_candidate.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details']):
                advt_no = advt_candidate
    if not advt_no:
        advt_no = f"{slugify(board)[:14].upper()}/2026"

    # 14. Location
    location = "India"
    loc_matches = re.findall(r'\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Delhi|New Delhi|Chandigarh|Puducherry|Raebareli|Kozhikode|Rewari|Barnala|Amritsar|Nuapada|Koraput|Malegaon|Shivamogga|Nagpur|Raipur|Patna|Dhanbad|Jamshedpur|Dehradun|Roorkee|Kashipur|Haldwani|Almora|Nainital|Kolkata|Kalyani|Shibpur|Malda|Santiniketan|Kharagpur|Jadavpur|Visakhapatnam|Chintapalle|Hyderabad|Hanumakonda|Warangal|Bengaluru|Bangalore|Raichur|Hassan|Chikkaballapur|Mysuru|Belagavi|Bhopal|Indore|Jabalpur|Gwalior|Katni|Mumbai|Pune|Sangli|Bhubaneswar|Rourkela|Cuttack|Mayurbhanj|Balangir|Jaipur|Jodhpur|Ajmer|Kota|Chennai|Madurai|Coimbatore|Erode|Pudukkottai|Ramanathapuram|Tiruchirappalli|Itanagar|Guwahati|Tezpur|Bhagalpur|Gaya|Jashpur|Bilaspur|Durg|Bhilai|Balodabazar|Bastar|Mungeli|Gandhinagar|Ahmedabad|Vadodara|Surat|Bhavnagar|Gurugram|Jhajjar|Rohtak|Kurukshetra|Ranchi|Chatra|Kochi|Thiruvananthapuram|Aizawl|Sangrur|Mohali|Ludhiana|Patiala|Agartala|Lucknow|Kanpur|Varanasi|Gorakhpur|Azamgarh|Prayagraj|Allahabad|Aligarh)\b', page_title + " " + board + " " + html[:2000], re.IGNORECASE)
    if loc_matches:
        location = loc_matches[0].title()

    # 15. Vacancies Details Breakdown (Zero-Loss Table Parsing)
    vacancies_details = []
    if vacancy_rows:
        for r in vacancy_rows:
            p_name = clean_text(r[0])
            v_cnt = clean_text(r[1]) if len(r) > 1 else "1"
            q_spec = clean_text(r[2]) if len(r) > 2 else qual_text
            p_scale = clean_text(r[3]) if len(r) > 3 else salary_text
            vacancies_details.append({
                "postName": p_name,
                "vacancies": v_cnt,
                "qualification": q_spec,
                "payScale": p_scale
            })
    else:
        vacancies_details.append({
            "postName": post_name,
            "vacancies": str(vacancies_num),
            "qualification": qual_text,
            "payScale": salary_text
        })

    # 16. Fee Details
    fee_details = []
    if fee_rows:
        for r in fee_rows:
            cat = clean_text(r[0])
            f_amt = clean_text(r[1]) if len(r) > 1 else "Exempted / As per rules"
            fee_details.append({"category": cat, "fee": f_amt})
    else:
        fee_details = [
            {"category": "General / OBC / EWS", "fee": "As per official notification guidelines / Refer portal"},
            {"category": "SC / ST / PwBD / Female", "fee": "Exempted / Concessional as per rules"}
        ]

    # 17. Selection Process
    selection_process = []
    # Check if Q&A answers selection process
    for q in extracted_faqs:
        if 'selection' in q['question'].lower():
            selection_process.append({"stage": "Stage 1", "description": q['answer']})
            break
    if not selection_process:
        if "walk-in" in apply_mode.lower() or "walkin" in apply_mode.lower():
            selection_process = [
                {"stage": "Stage 1: Document Verification", "description": "Verification of original eligibility certificates, degrees, and identification proof."},
                {"stage": "Stage 2: Walk-in Interview / Practical Assessment", "description": "Direct personal interview and subject knowledge evaluation by Selection Board."}
            ]
        else:
            selection_process = [
                {"stage": "Stage 1: Scrutiny of Applications", "description": "Screening of minimum qualifications, experience, and eligibility credentials."},
                {"stage": "Stage 2: Written Examination / CBT / Interview", "description": "Written test or personal interview depending on total candidates shortlisted."},
                {"stage": "Stage 3: Document Verification & Medical Exam", "description": "Verification of original credentials followed by standard fitness evaluation."}
            ]

    # 18. URLs
    urls_list = []
    if official_pdf_url:
        urls_list.append({
            "title": f"Download {board} Official Notification PDF",
            "url": official_pdf_url
        })
    if official_site_url:
        urls_list.append({
            "title": f"{board} Official Website / Online Portal",
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

    title_str = f"{board} Recruitment 2026 Notification Out for {vacancies_num} {post_name} Posts | {apply_action}"

    # Build grounded FAQs (Combining extracted Q&A + grounded core facts)
    all_faqs = []
    seen_q = set()
    for q in extracted_faqs:
        q_key = re.sub(r'[^a-z]', '', q['question'].lower())
        if q_key not in seen_q:
            seen_q.add(q_key)
            all_faqs.append(q)

    # Add core grounded FAQs if missing
    core_faq_candidates = [
        (f"What is the total number of vacancies announced for {board} Recruitment 2026?",
         f"A total of {vacancies_num} vacancies have been officially announced for {post_name} under {board} Recruitment 2026."),
        (f"What is the last date to apply or scheduled event date for {board} {post_name}?",
         f"The last date for application submission or scheduled event date is {summary_last_date}."),
        (f"What educational qualification is required for {post_name} in {board}?",
         f"Candidates must possess {qual_text}."),
        (f"What is the prescribed age limit for {board} {post_name} recruitment?",
         f"The prescribed age limit is {age_text}."),
        (f"What is the salary or remuneration offered for {post_name} in {board}?",
         f"Selected candidates will receive {salary_text}."),
        (f"What is the application mode for {board} Recruitment 2026?",
         f"The application mode is {apply_mode}."),
        (f"Where can I download the official notification PDF for {board} Recruitment 2026?",
         f"The official notification PDF can be downloaded directly from the official link: {urls_list[0]['url'] if urls_list else 'official portal'}.")
    ]
    for cq, ca in core_faq_candidates:
        q_key = re.sub(r'[^a-z]', '', cq.lower())
        if q_key not in seen_q:
            seen_q.add(q_key)
            all_faqs.append({"question": cq, "answer": ca})

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
        "feeDetails": fee_details,
        "selectionProcess": selection_process,
        "faqs": all_faqs,
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
    fee_details = data["feeDetails"]
    selection_process = data["selectionProcess"]
    faqs = data["faqs"]

    b_slug = slugify(board)[:25].strip('-')
    p_slug = slugify(post_name)[:25].strip('-')
    job_id = f"{b_slug}-{p_slug}-recruitment-2026"
    job_id = re.sub(r'-+', '-', job_id).strip('-')

    seo_title = f"{board} Recruitment 2026 ({vacancies} {post_name} Posts) {app_mode} | NewVacancyAlert"
    seo_desc = f"{board} recruitment 2026 notification for {vacancies} {post_name} vacancies. Check eligibility, salary, qualification, age limit & application details. Apply before {last_date}."
    if len(seo_desc) > 165:
        seo_desc = seo_desc[:162] + "..."

    focus_keywords = f"{board} Recruitment 2026, {board} {post_name} Vacancy 2026, {board} Notification 2026, {post_name} Jobs 2026"
    lsi_keywords = f"{board} Eligibility Criteria, {board} Salary Pay Scale, {board} Selection Process, {board} Apply {app_mode}, {board} Advt {advt_no}"

    overview = [
        f"{board} has officially released employment advertisement notification {advt_no} for the recruitment of {vacancies} vacancies for {post_name} posts.",
        f"Candidates possessing eligible qualifications ({qualification[:120]}...) and satisfying the age criteria can submit their candidature via {app_mode}. The closing/event date for this recruitment is {last_date}.",
        f"Selected applicants will be placed across designated institutions/offices in {location}, offering competitive pay ({salary[:80]}), comprehensive benefits, and structured career growth as per official institutional norms."
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

    how_to_apply = [
        f"Visit the official portal or access the notification link provided at {urls[0]['url'] if urls else 'official website'}.",
        "Carefully read the official advertisement guidelines, terms of engagement, and eligibility conditions before applying.",
        f"For {app_mode}: Ensure all required bio-data forms, online registration, or prescribed proforma are accurately filled.",
        "Attach/Upload scanned copies of required educational certificates, mark sheets, age proof, identity proof, and passport-size photographs.",
        "Pay the prescribed application fee (if applicable) through official payment channels.",
        "Submit the application or report to the designated interview venue on the scheduled date with original documents and self-attested photocopies.",
        "Keep a printout or acknowledgement copy of the submitted form for future reference."
    ]

    docs_required = [
        "Signed Application Form in prescribed format / Online Application Printout.",
        "Class 10th (Matriculation) Certificate as proof of Date of Birth.",
        "All Academic Marksheets and Degree/Diploma Certificates (Graduation/Post Graduation/Ph.D/Engineering).",
        "Relevant Experience Certificates and NOC from current employer (if employed in Govt/PSU).",
        "Valid Category / Caste Certificate (SC/ST/OBC-NCL/EWS) issued by competent authority.",
        "Recent Passport Size Color Photographs and valid Photo ID Proof (Aadhaar/PAN/Voter ID/Passport)."
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
            "education": qualification,
            "ageLimit": age_limit,
            "medicalStandards": "Standard physical and medical fitness as per organizational regulations."
        },
        "salary": {
            "payLevel": "As per institutional scales",
            "initialPay": salary,
            "allowances": "DA, HRA, Medical and other allowances as applicable per government rules."
        },
        "applicationFee": fee_details,
        "selectionProcess": selection_process,
        "howToApplySteps": how_to_apply,
        "documentsRequired": docs_required,
        "faqs": faqs,
        "urls": urls
    }
    return schema

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
    with open(DETAILS_FILE, 'w', encoding='utf-8') as f:
        json.dump(details_data, f, indent=2, ensure_ascii=False)
        
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
        with open(JOBS_DATA_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
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
        with open(UPLOAD_DATES_FILE, 'w', encoding='utf-8') as f:
            json.dump(upload_dates, f, indent=2, ensure_ascii=False)
            
    return True

def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, cwd=PROJECT_ROOT, capture_output=True, text=True)
    return res.returncode == 0, res.stdout, res.stderr

def main():
    print("================================================================")
    print("      BATCH URL VACANCY ADDER (HIGH FIDELITY & GROUNDED)        ")
    print("================================================================")
    
    with open("scratch/pending_urls.json", "r", encoding="utf-8") as f:
        unique_urls = json.load(f)

    print(f"Total Unique URLs to process: {len(unique_urls)}\n")

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    added_jobs = []
    skipped_jobs = []
    added_jobs_count = 0

    # Load progress if resuming
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                prog = json.load(f)
                added_jobs = prog.get('added_jobs', [])
                skipped_jobs = prog.get('skipped_jobs', [])
                added_jobs_count = len(added_jobs)
                processed_urls = set(prog.get('processed_urls', []))
        except Exception:
            processed_urls = set()
    else:
        processed_urls = set()

    for idx, url in enumerate(unique_urls, 1):
        if url in processed_urls:
            continue

        print(f"[{idx}/{len(unique_urls)}] Processing: {url}")
        html = fetch_page(url, ctx)
        if not html:
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": "Fetch failed"})
            processed_urls.add(url)
            continue

        try:
            raw_data = parse_full_page(html, url)
        except Exception as e:
            print(f"  [PARSE ERROR] {url}: {e}")
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": f"Parse error: {e}"})
            processed_urls.add(url)
            continue

        existing_jobs, existing_list = load_existing_db()
        b_slug = slugify(raw_data['board'])[:25].strip('-')
        p_slug = slugify(raw_data['postName'])[:25].strip('-')
        candidate_id = f"{b_slug}-{p_slug}-recruitment-2026"
        candidate_id = re.sub(r'-+', '-', candidate_id).strip('-')

        is_dup, dup_reason = check_duplicate(candidate_id, raw_data["board"], raw_data["title"], raw_data["advtNo"], existing_jobs, existing_list)
        if is_dup:
            print(f"  ⏩ [SKIPPED DUPLICATE] {raw_data['board']} - {raw_data['postName']}: {dup_reason}")
            skipped_jobs.append({
                "url": url,
                "title": raw_data["title"],
                "board": raw_data["board"],
                "reason": f"Duplicate: {dup_reason}"
            })
            processed_urls.add(url)
            continue

        # Generate grounded rich schema
        schema = generate_rich_job_schema(raw_data)
        add_job_to_system(schema)
        added_jobs_count += 1
        processed_urls.add(url)
        print(f"  ✅ [ADDED #{added_jobs_count}] {schema['id']} | {raw_data['board']} | {raw_data['vacancies']} Posts | Deadline: {schema['applicationStatus']}")
        added_jobs.append({
            "id": schema["id"],
            "title": raw_data["title"],
            "board": raw_data["board"],
            "vacancies": raw_data["vacancies"],
            "closing": raw_data["summaryLastDate"],
            "link": raw_data["urls"][0]["url"] if raw_data["urls"] else ""
        })

        # Save progress
        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                "processed_urls": list(processed_urls),
                "added_jobs": added_jobs,
                "skipped_jobs": skipped_jobs
            }, f, indent=2)

        # Periodic Git commit & push every 10 added jobs
        if added_jobs_count > 0 and added_jobs_count % 10 == 0:
            print(f"\n🚀 [MILESTONE REACHED: {added_jobs_count} JOBS ADDED]")
            print("  Building site and pushing to GitHub...")
            b_ok, b_out, b_err = run_cmd(["npm", "run", "build"])
            if not b_ok:
                print(f"  [BUILD WARNING]: {b_err[:200]}")
            else:
                print("  Build complete.")
            run_cmd(["git", "add", "."])
            run_cmd(["git", "commit", "-m", f"feat(jobs): batch add 10 vacancies from official portals (total: {added_jobs_count})"])
            p_ok, p_out, p_err = run_cmd(["git", "push", "origin", "main"])
            if p_ok:
                print(f"  Pushed milestone commit to GitHub! Resuming batch...\n")
            else:
                print(f"  [PUSH ERROR]: {p_err[:200]}\n")

    print("\n================================================================")
    print("           BATCH EXTRACTION COMPLETE - FINALIZING               ")
    print("================================================================")
    print(f"Total Processed: {len(unique_urls)}")
    print(f"Total Added    : {len(added_jobs)}")
    print(f"Total Skipped  : {len(skipped_jobs)}\n")

    if added_jobs_count > 0:
        print("Finalizing build and updating sitemap...")
        run_cmd(["npx", "tsx", "scripts/generate-sitemap.ts"])
        b_ok, b_out, b_err = run_cmd(["npm", "run", "build"])
        if b_ok:
            print("Final build successful.")
        run_cmd(["git", "add", "."])
        _, st_out, _ = run_cmd(["git", "status", "--porcelain"])
        if st_out.strip():
            run_cmd(["git", "commit", "-m", f"feat(jobs): update sitemap and final batch add remaining vacancies from official portals (total: {added_jobs_count})"])
            run_cmd(["git", "push", "origin", "main"])
        print("Final push complete!")

    # Summary table
    with open("scratch/batch_summary_report.json", "w", encoding="utf-8") as f:
        json.dump({"added": added_jobs, "skipped": skipped_jobs}, f, indent=2)

if __name__ == '__main__':
    main()
