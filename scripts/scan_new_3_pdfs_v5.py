import json
import os
    print(f" PDF #{idx}: {os.path.basename(pdf)}")
    print(f"=======================================================")
    if os.path.exists(pdf):
        reader = pypdf.PdfReader(pdf)
        print(f"Total Pages: {len(reader.pages)}")
        t1 = reader.pages[0].extract_text() or ""
        t2 = reader.pages[1].extract_text() if len(reader.pages) > 1 else ""
        text_sample = (t1 + " " + t2)[:700].replace('\n', ' ')
        clean_sample = text_sample.encode('ascii', errors='ignore').decode('ascii')
        print(f"Sample: {clean_sample[:400]}")
        
        # Check duplicate
        if text_sample.strip():
            dup_results = check_duplicate(text_sample)
            if dup_results and dup_results[0]['score'] >= 40:
                print(f"[!] DUPLICATE MATCH: Score {dup_results[0]['score']} -> {dup_results[0]['id']}")
                print(f"    Title: {dup_results[0]['title']}")
            else:
                print("[OK] NO DUPLICATE FOUND - READY TO ADD!")
        else:
            print("[IMAGE-BASED PDF] Will extract details from OCR/screenshots.")
    else:
        print("File not found!")
