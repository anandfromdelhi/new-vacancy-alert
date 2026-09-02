import os
import sys
import pypdf

def scan_folder_pdfs(folder_path):
    if not os.path.exists(folder_path):
        print(f"[ERROR] Folder does not exist: {folder_path}")
        return []

    pdf_files = []
    for root, _, files in os.walk(folder_path):
        for f in sorted(files):
            if f.lower().endswith('.pdf'):
                full_path = os.path.join(root, f)
                pdf_files.append(full_path)

    print("\n=======================================================")
    print("      BATCH FOLDER PDF SCANNER REPORT                  ")
    print("=======================================================")
    print(f"Target Folder : {folder_path}")
    print(f"Total PDFs    : {len(pdf_files)}")
    print("=======================================================\n")

    if not pdf_files:
        print("[!] No PDF files found in the specified directory.")
        return []

    for idx, pdf_path in enumerate(pdf_files, 1):
        size_kb = os.path.getsize(pdf_path) / 1024
        try:
            reader = pypdf.PdfReader(pdf_path)
            pages = len(reader.pages)
        except Exception:
            pages = 'Unknown'
        filename = os.path.basename(pdf_path)
        print(f"[{idx}/{len(pdf_files)}] {filename} ({pages} pages, {size_kb:.1f} KB)")
        print(f"      Path: {pdf_path}")

    print("\n=======================================================\n")
    return pdf_files

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/scan_folder_pdfs.py <folder_path>")
        sys.exit(1)
    scan_folder_pdfs(sys.argv[1])
