import os, glob

upload_dir = r'C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded'
pdf_files = glob.glob(os.path.join(upload_dir, '*.pdf'))
pdf_files.sort(key=lambda x: os.path.getmtime(x), reverse=True)

print(f"Latest PDF: {pdf_files[0]}")
