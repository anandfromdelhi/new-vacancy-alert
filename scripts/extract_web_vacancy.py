import sys
import os
import re
import urllib.request
import urllib.parse
import ssl
from bs4 import BeautifulSoup

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def extract_web_vacancy(url):
    print("\n=======================================================")
    print("      LIVE WEB PAGE VACANCY EXTRACTOR REPORT           ")
    print("=======================================================")
    print(f"Target URL: {url}")
    print("=======================================================\n")

    # Set up SSL context to handle certificate verification gracefully if needed
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
        with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[ERROR] Failed to fetch URL: {e}")
        return

    soup = BeautifulSoup(html, 'html.parser')

    # Remove script, style, nav, footer tags for clean text extraction
    for element in soup(["script", "style", "nav", "footer", "iframe"]):
        element.extract()

    # 1. Extract Page Title
    title = soup.title.string.strip() if soup.title and soup.title.string else "N/A"
    print(f"📌 PAGE TITLE: {title}\n")

    # 2. Extract Key Headings (h1, h2, h3)
    headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])]
    if headings:
        print("📌 MAIN HEADINGS:")
        for h in headings[:10]:
            print(f"   • {h}")
        print()

    # 3. Extract Tables
    tables = soup.find_all('table')
    if tables:
        print(f"📌 EXTRACTED TABLES ({len(tables)} found):")
        for idx, table in enumerate(tables, 1):
            print(f"\n--- Table #{idx} ---")
            rows = table.find_all('tr')
            for r in rows[:20]:  # limit rows per table
                cols = [c.get_text(separator=' ', strip=True) for c in r.find_all(['td', 'th'])]
                if cols:
                    print(" | ".join(cols))
        print()

    # 4. Extract Discovered PDF & Link URLs
    links = soup.find_all('a', href=True)
    pdf_links = []
    other_links = []

    for a in links:
        href = a['href'].strip()
        link_text = a.get_text(strip=True) or "Link"
        full_url = urllib.parse.urljoin(url, href)

        if href.lower().endswith('.pdf') or 'pdf' in href.lower() or 'download' in href.lower() or 'notification' in href.lower():
            pdf_links.append((link_text, full_url))
        elif any(kw in href.lower() or kw in link_text.lower() for kw in ['apply', 'register', 'career', 'recruitment', 'job', 'advt']):
            other_links.append((link_text, full_url))

    if pdf_links:
        print(f"📌 DISCOVERED NOTIFICATION / PDF LINKS ({len(pdf_links)} found):")
        for text, href in pdf_links[:15]:
            print(f"   • {text} -> {href}")
        print()

    if other_links:
        print(f"📌 RELEVANT ACTION / APPLY LINKS ({len(other_links)} found):")
        for text, href in other_links[:10]:
            print(f"   • {text} -> {href}")
        print()

    # 5. Main Body Text Content
    body_text = soup.get_text(separator='\n', strip=True)
    # Filter out empty lines
    clean_lines = [line for line in body_text.split('\n') if len(line.strip()) > 3]

    print("📌 MAIN TEXT CONTENT (Preview):")
    print("\n".join(clean_lines[:40]))

    print("\n=======================================================")
    print("[OK] Live Web Page extraction complete!")
    print("=======================================================\n")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/extract_web_vacancy.py <URL>")
        sys.exit(1)
        
    target_url = sys.argv[1]
    extract_web_vacancy(target_url)
