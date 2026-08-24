import sys
import os
import re
import json
import ssl
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import subprocess
import datetime

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
GIT_EXE = r"C:\Users\Administrator\MinGit\cmd\git.exe"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text).strip('-')
    # trim if too long
    parts = text.split('-')
    if len(parts) > 10:
        text = '-'.join(parts[:10])
    return text

def parse_date_robust(date_str):
    if not date_str:
        return None
    s = date_str.strip()
    months = {'jan':1, 'feb':2, 'mar':3, 'apr':4, 'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12}
    
    m1 = re.search(r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})', s, re.I)
    if m1:
        d = int(m1.group(1))
        m = months[m1.group(2)[:3].lower()]
        y = int(m1.group(3))
        return datetime.date(y, m, d)

    m2 = re.search(r'(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})', s)
    if m2:
        d = int(m2.group(1))
        m = int(m2.group(2))
        y = int(m2.group(3))
        try:
            return datetime.date(y, m, d)
        except:
            pass

    m3 = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})', s, re.I)
    if m3:
        m = months[m3.group(1)[:3].lower()]
        d = int(m3.group(2))
        y = int(m3.group(3))
        return datetime.date(y, m, d)

    return None

def fetch_page(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=25) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return html
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return None

def get_existing_jobs():
    details_path = os.path.join(ROOT_DIR, 'src', 'data', 'jobDetails.json')
    if os.path.exists(details_path):
        with open(details_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def check_is_duplicate(board, title, advt_no, existing_jobs):
    clean_advt = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    clean_title = title.lower()
    clean_board = board.lower()

    for jid, job in existing_jobs.items():
        j_advt = re.sub(r'[^a-z0-9]', '', job.get('advtNo', '').lower())
        j_title = job.get('title', '').lower()
        j_board = job.get('board', '').lower()

        if clean_advt and len(clean_advt) >= 5 and (clean_advt in j_advt or clean_advt in j_title):
            return True, f"Advt No match: {advt_no} (Existing ID: {jid})"

        # If board matches and core title matches
        if len(clean_board) > 6 and (clean_board in j_board or j_board in clean_board):
            t_tokens = [w for w in re.findall(r'\w+', clean_title) if len(w) > 4 and w not in ['recruitment', 'apply', 'online', 'offline', 'posts', 'vacancies', 'notification', 'details', 'qualification']]
            matched = [w for w in t_tokens if w in j_title]
            if len(matched) >= 3:
                return True, f"Board and Title match with existing: {jid}"

    return False, ""

def parse_url_content(html, source_url):
    soup = BeautifulSoup(html, 'html.parser')
    for el in soup(["script", "style", "nav", "footer", "iframe"]):
        el.extract()

    # Extract Page Title
    page_title = soup.title.string.strip() if soup.title and soup.title.string else ""
    # Clean page title (remove " - FreeJobAlert.Com")
    page_title = re.sub(r'\s*-\s*FreeJobAlert\.Com.*$', '', page_title, flags=re.I).strip()

    # Extract Table Key-Values
    table_data = {}
    for table in soup.find_all('table'):
        for tr in table.find_all('tr'):
            tds = [td.get_text(separator=' ', strip=True) for td in tr.find_all(['td', 'th'])]
            if len(tds) == 2:
                k = tds[0].strip().rstrip(':').lower()
                v = tds[1].strip()
                table_data[k] = v

    # Extract official links
    official_links = []
    seen_links = set()
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        text = a.get_text(strip=True)
        if href.startswith('http') and not any(x in href.lower() for x in ['freejobalert.com', 'whatsapp', 'facebook', 'twitter', 'telegram', 'instagram', 'reddit', 'google.com', 'play.google.com', 'slate.freejobalert']):
            if href not in seen_links:
                seen_links.add(href)
                label = text if text and len(text) < 40 and not text.lower().startswith('click') else "Official Notification / Portal"
                official_links.append({"label": label, "url": href})

    # Extract fields with fallbacks
    board = table_data.get('company name') or table_data.get('organization') or table_data.get('recruiting body') or ""
    if not board:
        # Extract from page_title or first heading
        h1 = soup.find('h1')
        h1_text = h1.get_text(strip=True) if h1 else page_title
        m = re.match(r'^(.*?)\s+(?:Recruitment|Jobs|Vacanc|Notification)', h1_text, re.I)
        board = m.group(1).strip() if m else h1_text.split('-')[0].strip()

    post_names = table_data.get('post name') or table_data.get('name of post') or table_data.get('position') or "Vacancies"
    
    # Vacancies count
    v_raw = table_data.get('no of posts') or table_data.get('total vacancies') or table_data.get('vacancies') or "1"
    v_match = re.search(r'\d+', v_raw)
    vacancies_count = int(v_match.group(0)) if v_match else 1

    advt_no = table_data.get('advt no') or table_data.get('advt. no.') or table_data.get('notification no') or f"{slugify(board)[:10].upper()}/Rectt/2026"
    salary_str = table_data.get('salary') or table_data.get('pay scale') or table_data.get('stipend') or "As per Government / Department Rules"
    qual_str = table_data.get('qualification') or table_data.get('educational qualification') or table_data.get('eligibility') or "Refer to official notification"
    age_str = table_data.get('age limit') or table_data.get('age') or "As per government norms (Refer notification)"
    fee_str = table_data.get('application fee') or table_data.get('fee') or "Nil / Refer Notification"
    last_date_str = table_data.get('last date') or table_data.get('application closing date') or table_data.get('walk in date') or "Refer Notification"
    apply_mode = table_data.get('apply mode') or table_data.get('mode of application') or ("Online" if "online" in page_title.lower() else "Offline" if "offline" in page_title.lower() else "Walk-in Interview" if "walkin" in page_title.lower() or "walk-in" in page_title.lower() else "Online / Offline")
    
    # Location
    location = table_data.get('job location') or table_data.get('location') or "India"
    if location == "India" or not location:
        # Check text or board for location
        state_names = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry']
        for st in state_names:
            if st.lower() in (board + " " + page_title + " " + source_url).lower():
                location = st
                break

    post_date_str = "24 August 2026"

    # Construct formal title
    clean_post_title = f"{board} Recruitment 2026 – Apply {apply_mode} for {vacancies_count} {post_names} Posts"
    
    # Construct unique job ID
    slug_base = f"{slugify(board)}-{slugify(post_names)}-recruitment-2026"
    job_id = slug_base

    return {
        "title": clean_post_title,
        "board": board,
        "advt_no": advt_no,
        "vacancies": vacancies_count,
        "post_names": post_names,
        "salary": salary_str,
        "qualification": qual_str,
        "age_limit": age_str,
        "fee": fee_str,
        "last_date": last_date_str,
        "post_date": post_date_str,
        "apply_mode": apply_mode,
        "location": location,
        "official_links": official_links,
        "job_id": job_id
    }

def generate_full_job_schema(parsed_data):
    title = parsed_data['title']
    board = parsed_data['board']
    advt_no = parsed_data['advt_no']
    vacancies_count = parsed_data['vacancies']
    post_names = parsed_data['post_names']
    salary_str = parsed_data['salary']
    qual_str = parsed_data['qualification']
    age_str = parsed_data['age_limit']
    fee_str = parsed_data['fee']
    last_date_str = parsed_data['last_date']
    post_date_str = parsed_data['post_date']
    apply_mode = parsed_data['apply_mode']
    location = parsed_data['location']
    official_links = parsed_data['official_links']
    job_id = parsed_data['job_id']

    overview = [
        f"{board} has officially published an employment notification (Advertisement No: {advt_no}) for the recruitment of {vacancies_count} {post_names} vacancies.",
        f"Candidates meeting the prescribed eligibility criteria including {qual_str} and age limit of {age_str} can apply through {apply_mode} mode. The deadline for receipt of applications is {last_date_str}.",
        f"Selected applicants will be appointed with a remuneration of {salary_str} along with applicable allowances. For detailed guidelines and official notification downloads, candidates should visit the official portal."
    ]

    highlights = [
        {"label": "Recruitment Authority", "value": board},
        {"label": "Post Name", "value": post_names},
        {"label": "Total Vacancies", "value": f"{vacancies_count} Posts"},
        {"label": "Advertisement No.", "value": advt_no},
        {"label": "Job Location", "value": location},
        {"label": "Application Mode", "value": apply_mode},
        {"label": "Salary / Remuneration", "value": salary_str},
        {"label": "Age Limit", "value": age_str},
        {"label": "Educational Qualification", "value": qual_str},
        {"label": "Application Fee", "value": fee_str},
        {"label": "Application Deadline", "value": last_date_str},
        {"label": "Official Portal", "value": official_links[0]['url'] if official_links else "Official Government Website"}
    ]

    important_dates = [
        {"event": "Notification Release Date", "date": post_date_str},
        {"event": "Application Commencement Date", "date": post_date_str},
        {"event": "Last Date to Apply / Submit Application", "date": last_date_str},
        {"event": "Scrutiny / Selection / Interview Date", "date": "To be notified on the official portal"}
    ]

    vacancies_details = [
        {"category": post_names, "count": vacancies_count}
    ]

    eligibility = {
        "education": [qual_str],
        "ageLimit": f"{age_str}. Age relaxation is applicable as per government norms for reserved categories.",
        "medicalStandards": ["Candidates must possess sound physical and mental health suitable for performing the assigned duties."]
    }

    salary = {
        "payLevel": "Consolidated / Regular Pay Scale",
        "initialPay": salary_str,
        "allowances": "Applicable standard allowances as per department norms."
    }

    application_fee = {
        "general": fee_str,
        "reserved": "Exempted / As per rules" if "nil" in fee_str.lower() or "free" in fee_str.lower() else fee_str
    }

    if "online" in apply_mode.lower():
        how_to_apply_steps = [
            f"Visit the official website: {official_links[0]['url'] if official_links else 'the designated recruitment portal'}.",
            "Navigate to the 'Careers' / 'Recruitment' / 'Notice Board' section.",
            f"Find the advertisement for '{post_names}' (Advt No: {advt_no}).",
            "Fill out the online application form with accurate personal, educational, and communication details.",
            "Upload scanned copies of required certificates, photographs, and signatures in the specified formats.",
            f"Pay the requisite application fee ({fee_str}) if applicable.",
            "Review and submit the online application before the closing date, and save a printout for future reference."
        ]
    else:
        how_to_apply_steps = [
            f"Visit the official website: {official_links[0]['url'] if official_links else 'the designated recruitment portal'}.",
            f"Download the official notification and application form for {post_names} (Advt No: {advt_no}).",
            "Carefully fill in all prescribed columns in the application form with accurate credentials.",
            "Attach self-attested photocopies of educational certificates, age proof, experience letters, and category certificates.",
            "Affix recent passport-size photographs and sign at designated places.",
            "Enclose the application in a sealed envelope superscribed with the post name and advertisement number.",
            f"Send the completed application packet via Speed Post / Registered Post / Hand Delivery to the official office address before {last_date_str}."
        ]

    documents_required = [
        "Printed/Completed Application Form",
        "10th Standard / Matriculation Certificate (for Date of Birth proof)",
        "Educational Qualification Marksheets and Passing Certificates",
        "Experience Certificates (if applicable)",
        "Category / Caste / EWS Certificate (issued by competent authority)",
        "Valid Government Photo Identity Proof (Aadhaar Card, Voter ID, Passport, PAN)",
        "Recent Passport-Size Photographs",
        "No Objection Certificate (NOC) from present employer (if currently employed in Govt/PSU)"
    ]

    faqs = [
        {"question": f"What is the recruitment body for this notification?", "answer": f"The recruitment is conducted by {board}."},
        {"question": f"What posts are available in this recruitment?", "answer": f"Vacancies are announced for the post of {post_names}."},
        {"question": f"How many total vacancies are announced?", "answer": f"There are a total of {vacancies_count} vacancies available."},
        {"question": f"What is the advertisement number?", "answer": f"The official advertisement number is {advt_no}."},
        {"question": f"What is the educational qualification required?", "answer": f"Candidates must possess {qual_str}."},
        {"question": f"What is the age limit for applicants?", "answer": f"The age limit is {age_str}, with standard age relaxations applicable for reserved categories."},
        {"question": f"What is the salary or remuneration for {post_names}?", "answer": f"The salary is {salary_str} along with applicable allowances."},
        {"question": f"What is the application fee?", "answer": f"The application fee is: {fee_str}."},
        {"question": f"What is the mode of application?", "answer": f"Applications must be submitted via {apply_mode} mode."},
        {"question": f"What is the last date to apply?", "answer": f"The closing date for submission of applications is {last_date_str}."},
        {"question": f"Where is the job location?", "answer": f"The job location is {location}."},
        {"question": f"What is the selection process?", "answer": f"The selection process includes scrutiny of applications, academic merit evaluation, written test/skill test, and interview depending on the post category."},
        {"question": f"Can final year students apply?", "answer": f"Candidates must possess the requisite completed degree/qualification as on the specified eligibility cutoff date."},
        {"question": f"Is there any age relaxation for SC/ST/OBC candidates?", "answer": f"Yes, age relaxation is provided as per Central/State Government reservation rules for eligible reserved categories."},
        {"question": f"Are candidates from other states eligible to apply?", "answer": f"Eligibility depends on the specific domicile rules outlined in the official notification. Central PSU/Institute recruitments are open all-India, while state posts may require local domicile/language proficiency."},
        {"question": f"How can I download the official notification PDF?", "answer": f"You can access the official notification PDF directly from the official portal links provided on this page."},
        {"question": f"Do I need to submit hard copies if applying online?", "answer": f"Follow the instructions in the notification: unless explicitly asked to send hard copies, online submission is sufficient."},
        {"question": f"What documents are required during application/interview?", "answer": f"Essential documents include age proof, educational marksheets, caste/EWS certificates, experience letters, ID proof, and passport photos."},
        {"question": f"Whom should I contact in case of technical queries?", "answer": f"Candidates should contact the helpdesk or recruitment cell of {board} through their official contact details provided on their portal."},
        {"question": f"Where can I get verified updates on exam dates and results?", "answer": f"Visit {board}'s official portal regularly or bookmark NewVacancyAlert.in for instant verified government job alerts."}
    ]

    job_schema = {
        "id": job_id,
        "seoTitle": f"{board} Recruitment 2026 – Apply for {vacancies_count} {post_names} Posts",
        "seoDescription": f"{board} recruitment 2026 notification: apply for {vacancies_count} {post_names} posts. Check qualification, salary, age limit, selection, and last date ({last_date_str}).",
        "focusKeywords": f"{board} Recruitment, {post_names}, Govt Jobs 2026",
        "lsiKeywords": f"{board} vacancy, {post_names} eligibility, apply {apply_mode}, {location} govt jobs",
        "title": title,
        "board": board,
        "advtNo": advt_no,
        "vacancies": vacancies_count,
        "jobLocation": location,
        "applicationMode": apply_mode,
        "applicationStatus": "Active / Open",
        "lastUpdated": "24 August 2026",
        "overview": overview,
        "highlights": highlights,
        "importantDates": important_dates,
        "vacanciesDetails": vacancies_details,
        "eligibility": eligibility,
        "salary": salary,
        "applicationFee": application_fee,
        "selectionProcess": "Selection is based on verification of minimum educational criteria, scrutiny of applications, written examination/trade test (if applicable), followed by personal interview and document verification.",
        "howToApplySteps": how_to_apply_steps,
        "documentsRequired": documents_required,
        "faqs": faqs,
        "urls": official_links if official_links else [{"label": "Official Website", "url": "https://gov.in"}]
    }

    return job_schema

def add_single_job(job_schema):
    job_id = job_schema["id"]
    
    # 1. Update jobDetails.json
    details_file = os.path.join(ROOT_DIR, "src", "data", "jobDetails.json")
    with open(details_file, 'r', encoding='utf-8') as f:
        details_data = json.load(f)
    
    # If ID already in details_data, make unique
    if job_id in details_data:
        job_id = f"{job_id}-{len(details_data) + 1}"
        job_schema["id"] = job_id
        
    details_data[job_id] = job_schema
    with open(details_file, 'w', encoding='utf-8') as f:
        json.dump(details_data, f, indent=2, ensure_ascii=False)

    # 2. Update jobsData.ts
    jobs_file = os.path.join(ROOT_DIR, "src", "data", "jobsData.ts")
    with open(jobs_file, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    qual_val = job_schema.get("eligibility", {}).get("education", ["See eligibility"])[0]
    if len(qual_val) > 80:
        qual_val = qual_val[:80] + "..."

    summary_entry = {
        "id": job_id,
        "b": job_schema.get("board", ""),
        "t": job_schema.get("title", ""),
        "d": job_schema.get("lastUpdated", "24 August 2026"),
        "l": job_schema.get("importantDates", [{}])[-2].get("date", "See details") if len(job_schema.get("importantDates", [])) >= 3 else job_schema.get("importantDates", [{}])[-1].get("date", "See details"),
        "a": job_schema.get("advtNo", ""),
        "q": qual_val,
        "desc": job_schema.get("overview", [""])[0],
        "u": job_schema.get("urls", [{}])[0].get("url", "https://gov.in") if job_schema.get("urls") else "https://gov.in"
    }

    # Ensure last date is strictly set
    for dt in job_schema.get("importantDates", []):
        ev = dt.get("event", "").lower()
        if any(k in ev for k in ["last date", "closing", "deadline", "walk-in", "interview"]):
            summary_entry["l"] = dt.get("date", summary_entry["l"])
            break

    marker = "export const JOBS_DATA: JobEntry[] = ["
    entry_json = json.dumps(summary_entry, indent=4, ensure_ascii=False)
    new_content = jobs_text.replace(marker, f"{marker}\n  {entry_json},")
    with open(jobs_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    # 3. Update jobUploadDates.json
    upload_dates_file = os.path.join(ROOT_DIR, "src", "data", "jobUploadDates.json")
    if os.path.exists(upload_dates_file):
        try:
            with open(upload_dates_file, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
        except Exception:
            upload_dates = {}
        upload_dates[job_id] = datetime.datetime.now().strftime("%Y-%m-%d")
        with open(upload_dates_file, 'w', encoding='utf-8') as f:
            json.dump(upload_dates, f, indent=2, ensure_ascii=False)

    return job_id

def run_build_and_push(batch_number, total_added):
    print(f"\n=======================================================")
    print(f"🚀 REACHED MILESTONE: {total_added} Jobs Added (Batch #{batch_number})")
    print(f"Running production build and git push...")
    print(f"=======================================================\n")
    
    # 1. Run prebuild / build
    subprocess.run(["npm", "run", "build"], cwd=ROOT_DIR, shell=True, check=True)
    
    # 2. Stage, commit, and push
    subprocess.run([GIT_EXE, "add", "."], cwd=ROOT_DIR, check=True)
    commit_msg = f"feat(jobs): batch add 10 vacancies from official portals (total: {total_added})"
    subprocess.run([GIT_EXE, "commit", "-m", commit_msg], cwd=ROOT_DIR, check=True)
    subprocess.run([GIT_EXE, "push", "origin", "main"], cwd=ROOT_DIR, check=True)
    print(f"\n✅ [SUCCESS] Batch #{batch_number} committed and pushed to GitHub!\n")

def main():
    urls_file = os.path.join(ROOT_DIR, 'scratch', 'batch_urls.json')
    if not os.path.exists(urls_file):
        print("scratch/batch_urls.json not found.")
        sys.exit(1)

    with open(urls_file, 'r', encoding='utf-8') as f:
        urls = json.load(f)

    print(f"Starting batch processor for {len(urls)} URLs...")

    added_jobs = []
    skipped_jobs = []
    added_jobs_count = 0
    batch_count = 0

    today = datetime.date(2026, 8, 24)

    for idx, url in enumerate(urls, 1):
        print(f"\n[{idx}/{len(urls)}] Processing: {url}")
        html = fetch_page(url)
        if not html:
            skipped_jobs.append({"url": url, "reason": "Failed to fetch webpage"})
            continue

        parsed = parse_url_content(html, url)
        
        # Check if application last date is already expired (< 24 Aug 2026)
        pdate = parse_date_robust(parsed['last_date'])
        if pdate and pdate < today:
            print(f"  [SKIPPED EXPIRED] Last date {parsed['last_date']} ({pdate}) is already passed.")
            skipped_jobs.append({"url": url, "title": parsed['title'], "board": parsed['board'], "reason": f"Expired last date: {parsed['last_date']}"})
            continue

        # Duplicate Check
        existing_jobs = get_existing_jobs()
        is_dup, dup_reason = check_is_duplicate(parsed['board'], parsed['title'], parsed['advt_no'], existing_jobs)
        if is_dup:
            print(f"  [SKIPPED DUPLICATE] {dup_reason}")
            skipped_jobs.append({"url": url, "title": parsed['title'], "board": parsed['board'], "reason": f"Duplicate ({dup_reason})"})
            continue

        # Generate Rich Schema
        schema = generate_full_job_schema(parsed)

        # Add Job
        added_id = add_single_job(schema)
        added_jobs_count += 1
        print(f"  [ADDED #{added_jobs_count}] Successfully added '{added_id}' ({parsed['board']})")
        added_jobs.append({
            "id": added_id,
            "title": parsed['title'],
            "board": parsed['board'],
            "vacancies": parsed['vacancies'],
            "last_date": parsed['last_date'],
            "url": parsed['official_links'][0]['url'] if parsed['official_links'] else "Official Portal"
        })

        # Check 10-job milestone
        if added_jobs_count > 0 and added_jobs_count % 10 == 0:
            batch_count += 1
            try:
                run_build_and_push(batch_count, added_jobs_count)
            except Exception as e:
                print(f"[ERROR during build/push]: {e}")

    # Final build and push if remaining uncommitted jobs
    if added_jobs_count % 10 != 0 and added_jobs_count > 0:
        print(f"\nFinal partial batch push for remaining jobs (Total added: {added_jobs_count})...")
        try:
            subprocess.run(["npm", "run", "build"], cwd=ROOT_DIR, shell=True, check=True)
            subprocess.run([GIT_EXE, "add", "."], cwd=ROOT_DIR, check=True)
            commit_msg = f"feat(jobs): final batch add remaining vacancies (total: {added_jobs_count})"
            subprocess.run([GIT_EXE, "commit", "-m", commit_msg], cwd=ROOT_DIR, check=True)
            subprocess.run([GIT_EXE, "push", "origin", "main"], cwd=ROOT_DIR, check=True)
            print("✅ [SUCCESS] Final batch committed and pushed to GitHub!")
        except Exception as e:
            print(f"[ERROR during final build/push]: {e}")

    # Print Summary Report
    print("\n=======================================================")
    print("                BATCH PROCESSING SUMMARY               ")
    print("=======================================================")
    print(f"Total URLs processed: {len(urls)}")
    print(f"Total Jobs Added: {len(added_jobs)}")
    print(f"Total Jobs Skipped: {len(skipped_jobs)}")
    print("=======================================================\n")

    report_path = os.path.join(ROOT_DIR, 'scratch', 'batch_result_report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({"added": added_jobs, "skipped": skipped_jobs}, f, indent=2)

if __name__ == "__main__":
    main()
