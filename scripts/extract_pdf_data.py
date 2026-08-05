import pypdf
import sys
import os

def extract_pdf_fast(pdf_path, max_pages=None):
    if not os.path.exists(pdf_path):
        print(f"Error: File not found - {pdf_path}")
        return
        
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
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
        print(f"--- PAGE {page_idx + 1} OF {total_pages} ---")
        print(text[:500] + ("..." if len(text) > 500 else ""))
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
