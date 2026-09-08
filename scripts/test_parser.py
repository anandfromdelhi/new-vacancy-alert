import urllib.request, ssl, re
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def clean(t):
    return re.sub(r'\s+', ' ', t or '').strip()

def test_parse(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req, context=ctx, timeout=15).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(['script', 'style', 'nav', 'footer', 'iframe']):
        tag.extract()
        
    page_title = clean(soup.title.string) if soup.title and soup.title.string else ''
    
    tables = soup.find_all('table')
    overview_kv = {}
    vacancy_rows = []
    date_rows = []
    
    for t in tables:
        rows = t.find_all('tr')
        if not rows: continue
        first_row = [clean(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        if len(first_row) == 2 and any(k in first_row[0] for k in ['particulars', 'company', 'recruiting', 'organization', 'post', 'no of post', 'apply mode']):
            for r in rows:
                cols = [clean(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) == 2 and cols[0].lower() not in overview_kv:
                    overview_kv[cols[0].lower()] = cols[1]
            break
            
    for t in tables[1:]:
        rows = t.find_all('tr')
        if not rows: continue
        first_row = [clean(c.get_text()).lower() for c in rows[0].find_all(['td', 'th'])]
        if any('post name' in c or 'station' in c or 'division' in c or 'discipline' in c or 'trade' in c for c in first_row) and any('post' in c or 'position' in c or 'vacancy' in c or 'total' in c for c in first_row):
            for r in rows[1:]:
                cols = [clean(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2 and cols[0].lower() != 'total':
                    vacancy_rows.append(cols)
        elif any('event' in c or 'important date' in c for c in first_row) or any('date' in c for c in first_row):
            for r in rows[1:]:
                cols = [clean(c.get_text()) for c in r.find_all(['td', 'th'])]
                if len(cols) >= 2:
                    date_rows.append(cols)

    board = ''
    for k, v in overview_kv.items():
        if any(term in k for term in ['recruiting body', 'recruiting organization', 'recruitment board', 'organization', 'company', 'board', 'authority', 'commission', 'institute', 'university', 'department', 'court']):
            if len(v) > 2 and v.lower() not in ['details', 'various', 'given below']:
                board = v
                break
    if not board:
        m = re.match(r'^(.*?)\s+Recruitment', page_title, re.I)
        board = m.group(1).strip() if m else page_title.split('-')[0].strip()
    board = re.sub(r'\s*\(India[\'\w\s]+\)\s*', '', board).strip()

    post_name = ''
    for k, v in overview_kv.items():
        if any(term == k for term in ['post', 'posts', 'post name', 'post names', 'name of post', 'name of posts', 'name of exam', 'exam name']):
            if v and not re.match(r'^\d+$', v) and v.lower() not in ['total posts', 'no of posts', 'salary', 'various', 'posts', 'details']:
                post_name = v
                break
    if not post_name:
        m = re.search(r'(?:Apply\s+Online|Walkin|Apply\s+Offline|Apply)\s+(?:for\s+)?(?:\d+\s+)?(.*?)(?:\s+Posts|\s+2026|$)', page_title, re.I)
        if m:
            post_name = m.group(1).strip()
    if not post_name or re.match(r'^\d+$', post_name):
        post_name = 'Various Posts'

    vacancies_num = 1
    for k, v in overview_kv.items():
        if any(term in k for term in ['no of post', 'vacancies', 'total post', 'total vacancies']):
            vm = re.search(r'\d+', v)
            if vm:
                vacancies_num = int(vm.group(0))
                break
    if vacancies_num == 1:
        vm = re.search(r'(\d+)\s+(?:posts|vacancies)', page_title, re.I)
        if vm:
            vacancies_num = int(vm.group(1))

    advt_no = ''
    for k, v in overview_kv.items():
        if any(term in k for term in ['advt', 'notification no', 'notice no', 'nia no', 'cen no', 'rcno', 'advertisement no']) or k == 'no':
            if v and v.lower() not in ['details', 'various', 'given below', 'refer notification']:
                advt_no = v
                break

    links = []
    for h in soup.find_all(['h2', 'h3']):
        if 'Important Links' in h.get_text():
            curr = h.next_sibling
            while curr and curr.name not in ['h2']:
                if curr.name == 'ul':
                    for li in curr.find_all('li'):
                        a = li.find('a', href=True)
                        if a and not any(ign in a['href'] for ign in ['freejobalert', 'play.google', 'whatsapp', 'telegram', 'arattai', 'facebook', 'twitter']):
                            title = clean(li.get_text(' ', strip=True).split(':')[0])
                            links.append({'title': title, 'url': clean(a['href'])})
                curr = curr.next_sibling
            break
            
    for t in tables:
        for r in t.find_all('tr'):
            cells = r.find_all(['td', 'th'])
            if len(cells) >= 2:
                row_label = clean(cells[0].get_text())
                for a in r.find_all('a', href=True):
                    href = clean(a['href'])
                    if not any(ign in href for ign in ['freejobalert', 'play.google', 'whatsapp', 'telegram', 'arattai']) and href.startswith('http'):
                        if not any(l['url'] == href for l in links):
                            links.append({'title': row_label, 'url': href})

    print('-------------------------------------------------------------')
    print('BOARD:', board)
    print('POST:', post_name)
    print('ADVT:', advt_no)
    print('VACANCIES:', vacancies_num)
    print('VAC ROWS:', len(vacancy_rows))
    print('DATE ROWS:', len(date_rows))
    print('LINKS:', links[:3])

urls_to_check = [
    'https://www.freejobalert.com/articles/prasar-bharati-marketing-executive-recruitment-2026-apply-online-for-20-posts-3066813',
    'https://www.freejobalert.com/articles/rrb-paramedical-recruitment-2026-apply-online-for-560-posts-3066740',
    'https://www.freejobalert.com/articles/dwcweo-chittoor-recruitment-2026-apply-offline-for-12-security-guard-case-workers-and-more-posts-3066691',
    'https://www.freejobalert.com/articles/ssc-chsl-recruitment-2026-apply-online-for-2536-posts-3066658',
    'https://www.freejobalert.com/articles/eil-experienced-personnel-recruitment-2026-apply-online-for-61-engineer-deputy-manager-and-more-posts-3066847'
]

for u in urls_to_check:
    test_parse(u)
