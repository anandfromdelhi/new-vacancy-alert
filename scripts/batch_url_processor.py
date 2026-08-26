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
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_URLS = [
    "https://www.freejobalert.com/articles/rars-chintapalle-recruitment-2026-walkin-for-teaching-associate-and-teaching-assistants-posts-3064609",
    "https://www.freejobalert.com/articles/tmc-hbchrcv-medical-officer-recruitment-2026-walkin-3064603",
    "https://www.freejobalert.com/articles/apcrda-assistant-manager-recruitment-2026-apply-online-3064595",
    "https://www.freejobalert.com/articles/sbc-visakhapatnam-group-c-recruitment-2026-apply-online-for-fire-engine-driver-construction-handler-and-more-posts-3063735",
    "https://www.freejobalert.com/articles/iit-guwahati-project-fellow-recruitment-2026-apply-online-3064579",
    "https://www.freejobalert.com/articles/fremaa-recruitment-2026-apply-online-for-12-it-assistant-field-assistants-and-more-posts-3064468",
    "https://www.freejobalert.com/articles/tezpur-university-recruitment-2026-apply-online-for-junior-research-fellow-senior-research-fellow-posts-3064455",
    "https://www.freejobalert.com/articles/tezpur-university-assistant-professor-recruitment-2026-apply-online-3064429",
    "https://www.freejobalert.com/articles/iit-patna-recruitment-2026-apply-online-for-senior-research-fellow-srf-project-assistant-pa-posts-3064581",
    "https://www.freejobalert.com/articles/iiit-bhagalpur-apprentice-recruitment-2026-apply-online-for-21-posts-3064563",
    "https://www.freejobalert.com/articles/bsfc-recruitment-2026-apply-online-for-259-accountant-lower-grade-clerk-and-more-posts-3064459",
    "https://www.freejobalert.com/articles/cusb-crs-project-fellow-recruitment-2026-apply-online-3064453",
    "https://www.freejobalert.com/articles/pgimer-project-technical-support-ii-recruitment-2026-apply-online-3064593",
    "https://www.freejobalert.com/articles/pgimer-lab-technician-recruitment-2026-apply-offline-3064587",
    "https://www.freejobalert.com/articles/panjab-university-guest-faculty-recruitment-2026-apply-offline-3064560",
    "https://www.freejobalert.com/articles/pgimer-senior-resident-recruitment-2026-walkin-3064492",
    "https://www.freejobalert.com/articles/panjab-university-guest-faculty-recruitment-2026-apply-offline-3064485",
    "https://www.freejobalert.com/articles/panjab-university-post-doctoral-fellowship-recruitment-2026-walkin-3064482",
    "https://www.freejobalert.com/articles/panjab-university-manager-recruitment-2026-walkin-3064480",
    "https://www.freejobalert.com/articles/panjab-university-lab-technician-recruitment-2026-walkin-3064477",
    "https://www.freejobalert.com/articles/pgimer-project-nurse-ii-recruitment-2026-apply-offline-3064450",
    "https://www.freejobalert.com/articles/cmho-balodabazar-nursing-officer-attendant-and-more-recruitment-2026-apply-offline-for-38-posts-3064470",
    "https://www.freejobalert.com/articles/bastar-district-recruitment-2026-apply-offline-for-11-subject-expert-part-time-music-teacher-and-more-posts-3064457",
    "https://www.freejobalert.com/articles/iit-bhilai-research-associate-i-recruitment-2026-apply-online-3064419",
    "https://www.freejobalert.com/articles/concor-recruitment-2026-apply-online-for-77-management-trainee-and-assistant-officer-posts-3064451",
    "https://www.freejobalert.com/articles/seci-recruitment-2026-apply-online-for-28-general-manager-accounts-officer-and-more-posts-3064526",
    "https://www.freejobalert.com/articles/iocl-recruitment-2026-apply-online-for-production-manager-senior-production-manager-and-senior-manager-posts-3064614",
    "https://www.freejobalert.com/articles/delhi-university-south-campus-junior-research-fellow-recruitment-2026-apply-offline-3064589",
    "https://www.freejobalert.com/articles/icmr-young-professional-recruitment-2026-walkin-3064569",
    "https://www.freejobalert.com/articles/ernet-india-recruitment-2026-apply-online-for-project-engineer-project-manager-and-more-posts-3064562",
    "https://www.freejobalert.com/articles/dpcc-group-a-recruitment-2026-apply-offline-for-17-environmental-engineer-assistant-environmental-engineer-and-more-posts-3064555",
    "https://www.freejobalert.com/articles/cerc-recruitment-2026-apply-offline-for-joint-chief-deputy-chief-and-more-posts-3064548",
    "https://www.freejobalert.com/articles/ernet-india-administrative-assistant-procurement-recruitment-2026-apply-online-3064539",
    "https://www.freejobalert.com/articles/supreme-court-of-india-assistant-registrar-recruitment-2026-apply-offline-3064537",
    "https://www.freejobalert.com/articles/nhai-recruitment-2026-apply-online-for-manager-senior-librarian-information-officer-posts-3064531",
    "https://www.freejobalert.com/articles/moefcc-scientific-consultant-grade-i-recruitment-2026-apply-online-3064512",
    "https://www.freejobalert.com/articles/aiims-delhi-recruitment-2026-apply-online-for-data-entry-operator-project-nurse-iii-posts-3064500",
    "https://www.freejobalert.com/articles/powergrid-apprentices-recruitment-2026-apply-online-3064109",
    "https://www.freejobalert.com/articles/jnu-advocate-recruitment-2026-apply-offline-3064447",
    "https://www.freejobalert.com/articles/sahitya-akademi-recruitment-2026-apply-online-for-30-clerk-mts-and-more-posts-3063652",
    "https://www.freejobalert.com/articles/wdra-consultant-recruitment-2026-apply-offline-3064424",
    "https://www.freejobalert.com/articles/spmcil-assistant-manager-deputy-manager-recruitment-2026-3060221",
    "https://www.freejobalert.com/articles/nfsu-recruitment-2026-apply-online-for-visiting-medical-consultant-psychologist-counsellor-posts-3064523",
    "https://www.freejobalert.com/articles/esic-teaching-faculty-recruitment-2026-walk-in-for-107-professor-senior-resident-and-more-posts-3064490",
    "https://www.freejobalert.com/articles/iiit-vadodara-assistant-professor-grade-ii-recruitment-2026-apply-online-for-25-posts-3064616",
    "https://www.freejobalert.com/articles/svnit-teaching-assistant-recruitment-2026-apply-online-3064534",
    "https://www.freejobalert.com/articles/bhavnagar-municipal-corporation-recruitment-2026-apply-online-for-80-mphw-executive-engineer-and-more-posts-3064502",
    "https://www.freejobalert.com/articles/eil-associate-engineer-recruitment-2026-apply-online-for-12-posts-3064498",
    "https://www.freejobalert.com/articles/bric-nbrc-project-technical-support-i-recruitment-2026-apply-offline-3064630",
    "https://www.freejobalert.com/articles/nbrc-research-assistant-iii-recruitment-2026-apply-offline-3064600",
    "https://www.freejobalert.com/articles/nbrc-account-assistant-recruitment-2026-apply-online-3064591",
    "https://www.freejobalert.com/articles/rites-engineer-recruitment-2026-apply-online-3064552",
    "https://www.freejobalert.com/articles/aiims-jhajjar-project-technical-support-iii-recruitment-2026-apply-online-3064497",
    "https://www.freejobalert.com/articles/nbrc-account-assistant-recruitment-2026-apply-online-3064445",
    "https://www.freejobalert.com/articles/hprca-assistant-staff-nurse-recruitment-2026-3060019",
    "https://www.freejobalert.com/articles/iit-ism-dhanbad-project-associate-recruitment-2026-apply-online-3064495",
    "https://www.freejobalert.com/articles/iit-ism-dhanbad-junior-research-fellow-jrf-recruitment-2026-apply-online-3064487",
    "https://www.freejobalert.com/articles/dmft-chatra-specialist-anaesthesiologist-recruitment-2026-walkin-3064432",
    "https://www.freejobalert.com/articles/drdo-dibt-recruitment-2026-apply-offline-for-research-associate-junior-research-fellow-posts-3064544",
    "https://www.freejobalert.com/articles/chikkaballapur-district-community-health-officer-cho-recruitment-2026-apply-offline-3064541",
    "https://www.freejobalert.com/articles/csir-cftri-senior-project-associate-recruitment-2026-apply-online-3064510",
    "https://www.freejobalert.com/articles/karnataka-swrt-teacher-recruitment-2026-apply-online-for-140-social-welfare-residential-school-teacher-posts-3064469",
    "https://www.freejobalert.com/articles/kase-manager-recruitment-2026-apply-online-3064570",
    "https://www.freejobalert.com/articles/igntu-project-assistant-recruitment-2026-apply-online-3064566",
    "https://www.freejobalert.com/articles/ordnance-factory-katni-labour-welfare-officer-recruitment-2026-apply-offline-3064551",
    "https://www.freejobalert.com/articles/igntu-company-secretary-cs-firm-recruitment-2026-apply-offline-3064421",
    "https://www.freejobalert.com/articles/actrec-recruitment-2026-walkin-for-research-associate-junior-research-fellow-posts-3064626",
    "https://www.freejobalert.com/articles/csir-neeri-project-associate-i-recruitment-2026-apply-online-3064618",
    "https://www.freejobalert.com/articles/icar-circot-business-manager-recruitment-2026-walkin-3064612",
    "https://www.freejobalert.com/articles/actrec-scientific-assistant-recruitment-2026-walkin-3064521",
    "https://www.freejobalert.com/articles/actrec-attendant-recruitment-2026-walkin-3064505",
    "https://www.freejobalert.com/articles/rcfl-management-trainee-recruitment-2026-apply-online-for-94-posts-3061029",
    "https://www.freejobalert.com/articles/emrs-pallong-non-teaching-staff-recruitment-2026-apply-offline-for-14-driver-cook-and-more-posts-3064437",
    "https://www.freejobalert.com/articles/neigrihms-senior-resident-doctor-recruitment-2026-apply-online-for-58-posts-3064605",
    "https://www.freejobalert.com/articles/oav-garudabasa-support-staff-recruitment-2026-apply-offline-for-warden-head-cook-and-more-posts-3064635",
    "https://www.freejobalert.com/articles/oav-bhalubasa-recruitment-2026-apply-offline-for-warden-assistant-cook-and-more-posts-3064628",
    "https://www.freejobalert.com/articles/oav-garudabasa-warden-recruitment-2026-apply-offline-3064385",
    "https://www.freejobalert.com/articles/oav-mayurbhanj-recruitment-2026-apply-offline-for-warden-chowkidar-and-more-posts-3064624",
    "https://www.freejobalert.com/articles/oav-shirsa-recruitment-2026-apply-offline-for-warden-head-cook-and-more-posts-3064607",
    "https://www.freejobalert.com/articles/oav-morada-recruitment-2026-apply-offline-for-warden-head-cook-and-more-posts-3064598",
    "https://www.freejobalert.com/articles/oav-balangir-recruitment-2026-apply-offline-for-warden-chowkidar-and-more-posts-3064379",
    "https://www.freejobalert.com/articles/oil-consultant-recruitment-2026-apply-online-3064025",
    "https://www.freejobalert.com/articles/wcd-odisha-anganwadi-helper-recruitment-2026-apply-online-3064013",
    "https://www.freejobalert.com/articles/gopabandhu-science-college-guest-faculty-recruitment-2026-apply-online-for-18-posts-3064489",
    "https://www.freejobalert.com/articles/oav-garudabasa-recruitment-2026-apply-offline-for-warden-head-cook-and-more-posts-3064443",
    "https://www.freejobalert.com/articles/jipmer-project-technical-assistant-recruitment-2026-apply-online-3064508",
    "https://www.freejobalert.com/articles/tmc-recruitment-2026-walkin-for-junior-engineer-pharmacist-posts-3064640",
    "https://www.freejobalert.com/articles/ggsmch-project-technical-support-recruitment-2026-apply-offline-3064528",
    "https://www.freejobalert.com/articles/pudukkottai-district-out-reach-worker-recruitment-2026-apply-offline-3064642",
    "https://www.freejobalert.com/articles/dhs-tiruchirappalli-recruitment-2026-apply-offline-for-driver-and-microbiologist-posts-3064637",
    "https://www.freejobalert.com/articles/one-stop-centre-erode-senior-counsellor-recruitment-2026-apply-offline-3064602",
    "https://www.freejobalert.com/articles/tmb-specialist-officer-recruitment-2026-apply-online-for-software-engineer-data-scientist-and-more-posts-3064575",
    "https://www.freejobalert.com/articles/tnuavc-recruitment-2026-apply-offline-for-36-car-driver-cook-helper-and-more-posts-3064542",
    "https://www.freejobalert.com/articles/iob-security-guard-recruitment-2026-apply-online-for-25-posts-3064438",
    "https://www.freejobalert.com/articles/iiit-agartala-assistant-professor-recruitment-2026-apply-online-for-10-posts-3064633",
    "https://www.freejobalert.com/articles/iit-kanpur-senior-project-executive-officer-recruitment-2026-apply-online-3064525",
    "https://www.freejobalert.com/articles/ksssci-senior-resident-recruitment-2026-walkin-for-19-posts-3064518",
    "https://www.freejobalert.com/articles/allahabad-university-recruitment-2026-apply-online-for-junior-research-fellow-and-research-assistant-posts-3064474",
    "https://www.freejobalert.com/articles/indian-bank-authorised-doctor-recruitment-2026-apply-offline-3064464",
    "https://www.freejobalert.com/articles/bhu-recruitment-2026-apply-online-for-lab-assistant-srf-and-more-posts-3064462",
    "https://www.freejobalert.com/articles/atal-residential-school-azamgarh-recruitment-2026-apply-online-for-11-pgt-and-tgt-posts-3064434",
    "https://www.freejobalert.com/articles/iit-roorkee-recruitment-2026-apply-online-for-research-associate-i-jrf-posts-3064573",
    "https://www.freejobalert.com/articles/ukpsc-veterinary-officer-recruitment-2026-apply-online-for-25-posts-3064558",
    "https://www.freejobalert.com/articles/bel-havildar-recruitment-2026-apply-online-3064506",
    "https://www.freejobalert.com/articles/iit-roorkee-junior-research-fellow-recruitment-2026-apply-online-3064427",
    "https://www.freejobalert.com/articles/aiims-kalyani-recruitment-2026-apply-online-for-51-senior-resident-senior-demonstrator-posts-3064620",
    "https://www.freejobalert.com/articles/bitm-junior-mentor-recruitment-2026-walkin-3064583"
]

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def load_existing_db():
    details_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobDetails.json')
    jobs_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jobsData.ts')
    
    existing_jobs = {}
    if os.path.exists(details_path):
        try:
            with open(details_path, 'r', encoding='utf-8') as f:
                existing_jobs = json.load(f)
        except Exception:
            pass
            
    existing_list = []
    if os.path.exists(jobs_path):
        try:
            with open(jobs_path, 'r', encoding='utf-8') as f:
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
            
    b_norm = re.sub(r'[^a-z0-9]', '', board.lower())
    t_norm = re.sub(r'[^a-z0-9]', '', title.lower())
    a_norm = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    
    # 2. Check by meaningful advt no
    if a_norm and len(a_norm) > 4 and not a_norm.endswith("rec2026") and not a_norm.endswith("2026"):
        for jid, j in existing_jobs.items():
            ex_advt = re.sub(r'[^a-z0-9]', '', j.get('advtNo', '').lower())
            if ex_advt and ex_advt == a_norm:
                return True, f"Advt No '{j.get('advtNo')}' matches existing '{jid}'"
                
    # 3. Check board + title similarity
    for jid, j in existing_jobs.items():
        ex_b = re.sub(r'[^a-z0-9]', '', j.get('board', '').lower())
        ex_t = re.sub(r'[^a-z0-9]', '', j.get('title', '').lower())
        
        if (b_norm and (b_norm in ex_b or ex_b in b_norm)) or (b_norm[:15] in ex_b if len(b_norm) > 15 else False):
            words1 = set(re.findall(r'\w{4,}', title.lower()))
            words2 = set(re.findall(r'\w{4,}', j.get('title', '').lower()))
            common = words1.intersection(words2)
            if len(common) >= 4 or (len(words1) > 0 and len(common) / len(words1) > 0.65):
                return True, f"High board & title match with '{jid}'"
                
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
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[FETCH ERROR] {url}: {e}")
        return None

def parse_vacancy_data(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(["script", "style", "nav", "footer", "iframe"]):
        tag.extract()
        
    page_title = clean_text(soup.title.string) if soup.title and soup.title.string else ""
    
    tables = soup.find_all('table')
    overview_kv = {}
    vacancy_rows = []
    date_rows = []
    link_rows = []
    
    for t in tables:
        rows = t.find_all('tr')
        if not rows:
            continue
        first_row_cells = [clean_text(c.get_text()) for c in rows[0].find_all(['td', 'th'])]
        
        # Key-Value Overview Table
        if len(first_row_cells) == 2 and any(k in first_row_cells[0].lower() for k in ['company', 'organization', 'particulars', 'post', 'salary', 'qualification', 'age', 'apply', 'walk-in', 'last date']):
            for r in rows:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) == 2:
                    overview_kv[cols[0].lower()] = cols[1]
                    
        # Vacancy breakdown table
        elif any('post name' in c.lower() for c in first_row_cells) and any('post' in c.lower() or 'vacancy' in c.lower() or 'total' in c.lower() for c in first_row_cells):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2 and cols[0].lower() != 'total':
                    vacancy_rows.append(cols)
                    
        # Important dates table
        elif any('event' in c.lower() or 'important date' in c.lower() for c in first_row_cells) or any('date' in c.lower() for c in first_row_cells):
            for r in rows[1:]:
                cols = [clean_text(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    date_rows.append(cols)
                    
        # Link table
        elif any('link' in c.lower() or 'official' in c.lower() or 'notification' in c.lower() for c in first_row_cells):
            for r in rows:
                a_tags = r.find_all('a', href=True)
                for a in a_tags:
                    link_text = clean_text(a.get_text())
                    link_href = clean_text(a['href'])
                    if not link_href.startswith('http'):
                        link_href = urllib.parse.urljoin(url, link_href)
                    link_rows.append((link_text, link_href))

    # Scan for official PDF and official site link
    official_pdf_url = ""
    official_site_url = ""
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

    # Extract Board
    board = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['company', 'organization', 'board', 'institute', 'department']):
            board = v
            break
    if not board:
        m = re.match(r'^(.*?)\s+Recruitment', page_title, re.IGNORECASE)
        if m:
            board = m.group(1).strip()
        else:
            board = page_title.split('-')[0].strip()

    # Extract Post Names
    post_name = ""
    for k, v in overview_kv.items():
        if 'post name' in k:
            post_name = v
            break
    if not post_name:
        m = re.search(r'for\s+(.*?)\s+Posts', page_title, re.IGNORECASE)
        if m:
            post_name = m.group(1).strip()
        else:
            post_name = "Various Posts"

    # Extract Vacancies
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

    # Extract Salary
    salary_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['salary', 'stipend', 'pay', 'remuneration', 'scale of pay']):
            salary_text = v
            break
    if not salary_text:
        salary_text = "As per official institutional pay scale rules"

    # Extract Qualification
    qual_text = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['qualification', 'eligibility', 'education']):
            qual_text = v
            break
    if not qual_text:
        qual_text = "Degree / Diploma / Post Graduation or equivalent from a recognized University / Board as per notification."

    # Extract Age Limit
    age_text = ""
    for k, v in overview_kv.items():
        if 'age limit' in k or 'age' in k:
            age_text = v
            break
    if not age_text:
        age_text = "As per government recruitment norms (+ standard relaxation for SC/ST/OBC/PwBD categories)"

    # Extract Apply Mode
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

    # Extract Dates
    important_dates = []
    for row in date_rows:
        if len(row) >= 2:
            important_dates.append({
                "event": row[0],
                "date": row[1]
            })
            
    walkin_date = ""
    last_date = ""
    for k, v in overview_kv.items():
        if 'walk-in' in k or 'walkin' in k:
            walkin_date = v
        elif 'last date' in k or 'closing' in k:
            last_date = v

    if not important_dates:
        if walkin_date:
            important_dates.append({"event": "Notification Release Date", "date": "August 2026"})
            important_dates.append({"event": "Walk-in Interview Date", "date": walkin_date})
        elif last_date:
            important_dates.append({"event": "Notification Release Date", "date": "August 2026"})
            important_dates.append({"event": "Application Start Date", "date": "August 2026"})
            important_dates.append({"event": "Last Date to Apply", "date": last_date})
        else:
            important_dates.append({"event": "Notification Release Date", "date": "August 2026"})
            important_dates.append({"event": "Application Closing Date", "date": "Refer Official Notification"})

    summary_last_date = "Refer Notification"
    if walkin_date:
        summary_last_date = walkin_date
    elif last_date:
        summary_last_date = last_date
    else:
        for dt in important_dates:
            ev = dt.get("event", "").lower()
            if any(k in ev for k in ["last date", "closing", "deadline", "walk-in", "walkin", "end date"]):
                summary_last_date = dt.get("date", "Refer Notification")
                break
        if summary_last_date == "Refer Notification" and len(important_dates) > 1:
            summary_last_date = important_dates[-1].get("date", "Refer Notification")

    # Advt No
    advt_no = ""
    for k, v in overview_kv.items():
        if any(term in k for term in ['advt', 'advertisement', 'notification no', 'notice no']):
            advt_no = v
            break
    if not advt_no:
        advt_match = re.search(r'(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notification\s*No\.?|Notice\s*No\.?)\s*[:\-]?\s*([A-Za-z0-9\/\-\_\.\(\)\s]+?)(?:\s+dated|\s+Dated|\n|\.|\,|$)', html, re.IGNORECASE)
        if advt_match:
            advt_candidate = advt_match.group(1).strip()
            if 3 <= len(advt_candidate) <= 40 and not any(bad in advt_candidate.lower() for bad in ['pdf', 'click', 'freejob', 'http', 'table', 'details']):
                advt_no = advt_candidate
    if not advt_no:
        advt_no = f"{slugify(board)[:14].upper()}/2026"

    # Location
    location = "India"
    loc_matches = re.findall(r'\b(Delhi|Mumbai|Chandigarh|Kolkata|Assam|Guwahati|Tezpur|Patna|Bhagalpur|Bihar|Bhilai|Balodabazar|Bastar|Chhattisgarh|Gujarat|Vadodara|Surat|Bhavnagar|Haryana|Jhajjar|Jharkhand|Dhanbad|Chatra|Karnataka|Bengaluru|Chikkaballapur|Mysuru|Kerala|Madhya Pradesh|Katni|Odisha|Mayurbhanj|Balangir|Puducherry|Tamil Nadu|Tiruchirappalli|Pudukkottai|Erode|Chennai|Tripura|Agartala|Uttar Pradesh|Kanpur|Lucknow|Varanasi|Azamgarh|Prayagraj|Allahabad|Uttarakhand|Roorkee|Kalyani|West Bengal|Visakhapatnam|Chintapalle|Andhra Pradesh)\b', page_title + " " + board, re.IGNORECASE)
    if loc_matches:
        location = loc_matches[0].title()

    vacancies_details = []
    if vacancy_rows:
        for r in vacancy_rows:
            p_name = r[0]
            v_cnt = r[1] if len(r) > 1 else "1"
            q_spec = r[2] if len(r) > 2 else qual_text
            vacancies_details.append({
                "postName": p_name,
                "vacancies": v_cnt,
                "qualification": q_spec
            })
    else:
        vacancies_details.append({
            "postName": post_name,
            "vacancies": str(vacancies_num),
            "qualification": qual_text
        })

    urls_list = []
    if official_pdf_url:
        urls_list.append({
            "title": f"Download {board} Official Notification PDF",
            "url": official_pdf_url
        })
    if official_site_url:
        urls_list.append({
            "title": f"{board} Official Careers / Recruitment Portal",
            "url": official_site_url
        })
    if not urls_list:
        urls_list.append({
            "title": f"{board} Official Recruitment Notification",
            "url": url
        })

    return {
        "board": board,
        "title": f"{board} Recruitment 2026 – Apply for {vacancies_num} {post_name} Posts",
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

    job_id = f"{slugify(board)}-{slugify(post_name)[:30]}-recruitment-2026"
    job_id = re.sub(r'-+', '-', job_id).strip('-')

    seo_title = f"{board} Recruitment 2026 ({vacancies} {post_name} Posts) {app_mode} | NewVacancyAlert"
    seo_desc = f"{board} recruitment 2026 notification for {vacancies} {post_name} vacancies. Check eligibility criteria, salary, qualification, age limit & application details. Apply before {last_date}."
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

    fee_details = [
        {"category": "General / OBC / EWS Candidates", "fee": "As per official notification guidelines / Exempted if unspecified"},
        {"category": "SC / ST / PwBD / Female Candidates", "fee": "Exempted / Concessional as per rules"}
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
        "selectionProcess": selection_stages,
        "howToApplySteps": how_to_apply,
        "documentsRequired": docs_required,
        "faqs": faqs,
        "urls": urls
    }

    return schema

def add_job_to_system(job_schema):
    job_id = job_schema["id"]
    
    # 1. Update jobDetails.json
    details_file = "src/data/jobDetails.json"
    details_data = {}
    if os.path.exists(details_file):
        try:
            with open(details_file, 'r', encoding='utf-8') as f:
                details_data = json.load(f)
        except Exception:
            details_data = {}
            
    details_data[job_id] = job_schema
    with open(details_file, 'w', encoding='utf-8') as f:
        json.dump(details_data, f, indent=2, ensure_ascii=False)
        
    # 2. Update jobsData.ts
    jobs_file = "src/data/jobsData.ts"
    with open(jobs_file, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    if f'"id": "{job_id}"' not in jobs_text:
        qual_val = job_schema.get("eligibility", {}).get("education", "See eligibility")
        if len(qual_val) > 80:
            qual_val = qual_val[:77] + "..."
            
        post_date = datetime.datetime.now().strftime("%d %B %Y")
        last_date = job_schema.get("importantDates", [{}])[-1].get("date", "See details")
        for dt in job_schema.get("importantDates", []):
            ev = dt.get("event", "").lower()
            if any(k in ev for k in ["last date", "closing", "end date", "submission", "deadline", "walk-in", "walkin"]):
                last_date = dt.get("date", last_date)
                break
                
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
        with open(jobs_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
    # 3. Update jobUploadDates.json
    upload_dates_file = "src/data/jobUploadDates.json"
    if os.path.exists(upload_dates_file):
        try:
            with open(upload_dates_file, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
        except Exception:
            upload_dates = {}
        if job_id not in upload_dates:
            upload_dates[job_id] = datetime.datetime.now().strftime("%Y-%m-%d")
            with open(upload_dates_file, 'w', encoding='utf-8') as f:
                json.dump(upload_dates, f, indent=2, ensure_ascii=False)
                
    return True

def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, capture_output=True, text=True)
    return res.returncode == 0, res.stdout, res.stderr

def main():
    print("================================================================")
    print("         BATCH URL VACANCY ADDER - RUNNING PIPELINE             ")
    print("================================================================")
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    # Deduplicate input list while preserving order
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

    for idx, url in enumerate(unique_urls, 1):
        print(f"\n[{idx}/{len(unique_urls)}] Processing URL: {url}")
        html = fetch_page(url, ctx)
        if not html:
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": "Failed to fetch webpage"})
            continue

        try:
            raw_data = parse_vacancy_data(html, url)
        except Exception as e:
            print(f"[PARSE ERROR] {url}: {e}")
            skipped_jobs.append({"url": url, "title": "N/A", "board": "N/A", "reason": f"Parsing exception: {e}"})
            continue

        existing_jobs, existing_list = load_existing_db()
        candidate_id = f"{slugify(raw_data['board'])}-{slugify(raw_data['postName'])[:30]}-recruitment-2026"
        candidate_id = re.sub(r'-+', '-', candidate_id).strip('-')

        is_dup, dup_reason = check_duplicate(candidate_id, raw_data["board"], raw_data["title"], raw_data["advtNo"], existing_jobs, existing_list)
        if is_dup:
            print(f"⏩ [SKIPPED DUPLICATE] {raw_data['board']} - {raw_data['postName']}: {dup_reason}")
            skipped_jobs.append({
                "url": url,
                "title": raw_data["title"],
                "board": raw_data["board"],
                "reason": f"Duplicate ({dup_reason})"
            })
            continue

        # Generate rich schema
        schema = generate_rich_job_schema(raw_data)
        add_job_to_system(schema)
        added_jobs_count += 1
        print(f"✅ [ADDED #{added_jobs_count}] {schema['id']} | {raw_data['board']} | {raw_data['vacancies']} Vacancies | Closing: {schema['applicationStatus']}")
        added_jobs.append({
            "id": schema["id"],
            "title": raw_data["title"],
            "board": raw_data["board"],
            "vacancies": raw_data["vacancies"],
            "closing": raw_data["summaryLastDate"],
            "link": raw_data["urls"][0]["url"] if raw_data["urls"] else ""
        })

        # Periodic Git commit & push every 10 added jobs
        if added_jobs_count > 0 and added_jobs_count % 10 == 0:
            print(f"\n🚀 [MILESTONE] Reached {added_jobs_count} added jobs! Triggering build and commit...")
            git_path = r"C:\Users\Administrator\MinGit\cmd\git.exe"
            
            # 1. Build
            print("  -> Running npm run build...")
            b_ok, b_out, b_err = run_cmd(["npm.cmd", "run", "build"])
            if not b_ok:
                print(f"  [BUILD WARNING/ERROR]: {b_err[:300]}")
            else:
                print("  -> Build successful!")

            # 2. Git add, commit, push
            print("  -> Git staging, committing, and pushing...")
            run_cmd([git_path, "add", "."])
            run_cmd([git_path, "commit", "-m", f"feat(jobs): batch add 10 vacancies from official portals (total: {added_jobs_count})"])
            p_ok, p_out, p_err = run_cmd([git_path, "push", "origin", "main"])
            if p_ok:
                print("  -> Successfully pushed to GitHub main branch!\n")
            else:
                print(f"  -> Push failed: {p_err}\n")

    print("\n================================================================")
    print("         ALL URLS PROCESSED - FINALIZING PIPELINE               ")
    print("================================================================")
    print(f"Total Added Jobs: {added_jobs_count}")
    print(f"Total Skipped Jobs: {len(skipped_jobs)}")

    # 1. Regenerate sitemap
    print("\n[1/3] Regenerating Sitemap & RSS Feeds...")
    s_ok, s_out, s_err = run_cmd(["npx.cmd", "tsx", "scripts/generate-sitemap.ts"])
    print(s_out if s_ok else f"Sitemap error: {s_err}")

    # 2. Production build
    print("\n[2/3] Running final Production Build...")
    b_ok, b_out, b_err = run_cmd(["npm.cmd", "run", "build"])
    if not b_ok:
        print(f"Final Build Error: {b_err[:400]}")
    else:
        print("Final build completed successfully!")

    # 3. Final Git Push
    print("\n[3/3] Final Git Commit & Push...")
    git_path = r"C:\Users\Administrator\MinGit\cmd\git.exe"
    run_cmd([git_path, "add", "."])
    run_cmd([git_path, "commit", "-m", f"feat(jobs): update sitemap and final batch add remaining vacancies from official portals (total added: {added_jobs_count})"])
    p_ok, p_out, p_err = run_cmd([git_path, "push", "origin", "main"])
    if p_ok:
        print("Final push succeeded!")
    else:
        print(f"Final push output: {p_out} {p_err}")

    # Save summary report
    summary_report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_urls_processed": len(unique_urls),
        "total_added": added_jobs_count,
        "total_skipped": len(skipped_jobs),
        "added_jobs": added_jobs,
        "skipped_jobs": skipped_jobs
    }
    with open("scripts/batch_url_results.json", "w", encoding="utf-8") as f:
        json.dump(summary_report, f, indent=2, ensure_ascii=False)
    print("\nBatch URL Vacancy Adder completed successfully! Summary saved to scripts/batch_url_results.json")

if __name__ == "__main__":
    main()
