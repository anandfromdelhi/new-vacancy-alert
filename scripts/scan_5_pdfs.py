import os
import pypdf
from check_duplicate_vacancy import check_duplicate

pdf_files = [
    r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785973036222.pdf",
    r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785973036295.pdf",
    r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785973036631.pdf",
    r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785973036795.pdf",
    r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785973037064.pdf"
]

for idx, pdf in enumerate(pdf_files, 1):
    print(f"\n=======================================================")
    print(f" PDF #{idx}: {os.path.basename(pdf)}")
    print(f"=======================================================")
    if os.path.exists(pdf):
        reader = pypdf.PdfReader(pdf)
        print(f"Total Pages: {len(reader.pages)}")
        t1 = reader.pages[0].extract_text() or ""
        t2 = reader.pages[1].extract_text() if len(reader.pages) > 1 else ""
        text_sample = (t1 + " " + t2)[:600].replace('\n', ' ')
        print(f"Sample: {text_sample}")
        
        # Check duplicate
        dup_results = check_duplicate(text_sample)
        if dup_results and dup_results[0]['score'] >= 40:
            print(f"[!] DUPLICATE MATCH: Score {dup_results[0]['score']} -> {dup_results[0]['id']}")
            print(f"    Title: {dup_results[0]['title']}")
        else:
            print("[OK] NO DUPLICATE FOUND - READY TO ADD!")
    else:
        print("File not found!")
