import os
import sys
from bs4 import BeautifulSoup

def clean_and_parse_article(html_path, out_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract links
    official_links = []
    seen_urls = set()
    for a in soup.find_all('a', href=True):
        href = a['href']
        text = a.get_text(strip=True)
        if href in seen_urls:
            continue
        # Filter out 3rd party ads/socials/freejobalert
        if any(dom in href.lower() for dom in ['.gov.in', '.nic.in', '.ac.in', '.edu.in', '.org.in', '.res.in', 'aiims', 'pgimer', 'nit', 'niper', 'sainik', 'drdo', 'isro', 'delhi.gov.in', 'andhra', 'ap.gov.in', 'telangana', 'karnataka', 'assam', 'bihar', 'up.gov.in', 'punjab', 'rajasthan']):
            if 'freejobalert' not in href.lower() and 'facebook' not in href.lower() and 'twitter' not in href.lower() and 'telegram' not in href.lower():
                official_links.append({'text': text, 'url': href})
                seen_urls.add(href)
    
    article = soup.find('div', class_='entry-content') or soup.find('article')
    text_content = article.get_text(separator='\n', strip=True) if article else soup.get_text(separator='\n', strip=True)
    
    # Extract all tables
    tables_data = []
    if article:
        for t in article.find_all('table'):
            rows = []
            for tr in t.find_all('tr'):
                cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                if cells:
                    rows.append(' | '.join(cells))
            tables_data.append('\n'.join(rows))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write('=== OFFICIAL LINKS ===\n')
        for l in official_links:
            out.write(f"{l['text']}: {l['url']}\n")
        out.write('\n=== TABLES ===\n')
        for t in tables_data:
            out.write(t + '\n---\n')
        out.write('\n=== TEXT CONTENT ===\n')
        out.write(text_content)

if __name__ == '__main__':
    if len(sys.argv) > 2:
        clean_and_parse_article(sys.argv[1], sys.argv[2])
        print(f"Parsed to {sys.argv[2]}")
    else:
        print("Usage: python scripts/parse_url_content.py <html_path> <out_path>")
