import subprocess
import sys
import os

try:
    import pypdf
except ImportError:
    pypdf = None

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

def extract_pdf_fast(pdf_path, max_pages=None):
    if not os.path.exists(pdf_path):
        print(f"Error: File not found - {pdf_path}")
        return ""
        
    # First try pdftotext
    try:
        cmd = ["pdftotext"]
        if max_pages:
            cmd.extend(["-l", str(max_pages)])
        cmd.extend([pdf_path, "-"])
        res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
        if res.returncode == 0 and res.stdout.strip():
            print(f"[OK] pdftotext extracted {len(res.stdout)} chars from {pdf_path}")
            return res.stdout
    except Exception as e:
        pass

    if pypdf is None:
        print("[ERROR] Neither pdftotext nor pypdf available.")
        return ""
    
    print(f"\n=======================================================")
    print(f"      FAST PDF DATA EXTRACTOR REPORT                   ")
    print(f"=======================================================")
    print(f"File Path    : {pdf_path}")
    print(f"Total Pages  : {total_pages}")
    print(f"=======================================================\n")
    
    pages_to_read = min(total_pages, max_pages) if max_pages else total_pages
    full_text = []
    
    for page_idx in range(pages_to_read):
        page = reader.pages[page_idx]
        text = page.extract_text() or ""
        clean_text = text.strip()
        print(f"--- PAGE {page_idx + 1} OF {total_pages} ---")
        if clean_text:
            print(clean_text[:500] + ("..." if len(clean_text) > 500 else ""))
        else:
            print("[Note: Page appears to be scanned image. Rendering image via fitz...] ")
        print("\n")
        full_text.append(f"=== PAGE {page_idx + 1} ===\n{text}")

    print("=======================================================")
    print(f"[OK] Extraction complete! Processed {pages_to_read}/{total_pages} pages.")
    print("=======================================================\n")
    return "\n\n".join(full_text)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_data.py <path_to_pdf> [max_pages]")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else None
    extract_pdf_fast(pdf_path, max_pages)
