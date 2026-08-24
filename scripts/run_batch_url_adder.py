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
        with urllib.request.urlopen(req, context=ctx, timeout=20) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return html
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return None

def check_is_duplicate(board, title, advt_no, existing_jobs):
    clean_advt = re.sub(r'[^a-z0-9]', '', advt_no.lower()) if advt_no else ""
    clean_title = title.lower()
    clean_board = board.lower()

    for job in existing_jobs:
        j_advt = re.sub(r'[^a-z0-9]', '', job.get('advtNo', '').lower())
        j_title = job.get('title', '').lower()
        j_board = job.get('board', '').lower()
        j_id = job.get('id', '').lower()

        # Exact advt match if long enough
        if clean_advt and len(clean_advt) >= 5 and (clean_advt in j_advt or clean_advt in j_title):
            return True, f"Advt No match: {advt_no} (Existing: {job.get('id')})"

        # High board + title token overlap
        if len(clean_board) > 5 and clean_board in j_board:
            # Check key title tokens
            t_tokens = [w for w in re.findall(r'\w+', clean_title) if len(w) > 4 and w not in ['recruitment', 'apply', 'online', 'offline', 'posts', 'vacancies', 'notification']]
            matched_tokens = [w for w in t_tokens if w in j_title]
            if len(matched_tokens) >= 3:
                return True, f"Board and Title token match: {job.get('id')}"

    return False, ""

def extract_job_data(html, source_url):
    soup = BeautifulSoup(html, 'html.parser')
    for el in soup(["script", "style", "nav", "footer", "iframe"]):
        el.extract()

    page_title = soup.title.string.strip() if soup.title and soup.title.string else ""
    
    # Extract table rows
    table_data = {}
    for table in soup.find_all('table'):
        for tr in table.find_all('tr'):
            tds = [td.get_text(separator=' ', strip=True) for td in tr.find_all(['td', 'th'])]
            if len(tds) == 2:
                key = tds[0].strip().rstrip(':')
                val = tds[1].strip()
                table_data[key.lower()] = val

    # Discovered links
    official_links = []
    seen_links = set()
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        text = a.get_text(strip=True)
        if href.startswith('http') and not any(x in href for x in ['freejobalert.com', 'whatsapp', 'facebook', 'twitter', 'telegram', 'instagram', 'reddit', 'google.com', 'play.google.com']):
            if href not in seen_links:
                seen_links.add(href)
                label = text if text and len(text) < 40 else "Official Government Portal"
                official_links.append({"label": label, "url": href})

    return {
        "page_title": page_title,
        "table_data": table_data,
        "official_links": official_links,
        "full_text": soup.get_text(separator='\n', strip=True)
    }

print("Batch helper script defined.")
